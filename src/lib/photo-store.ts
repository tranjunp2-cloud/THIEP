import "server-only";
import { randomBytes } from "node:crypto";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import { join } from "node:path";
import { storeMode } from "./store";

/**
 * Lưu ảnh cưới người dùng tải lên.
 * - Supabase Storage (bucket công khai `wedding-photos`) khi có khoá service role.
 * - Thư mục .data/uploads khi chạy dev; ảnh được phục vụ qua /api/anh/<tên>.
 * Ảnh đã được nén ở trình duyệt; server chỉ kiểm tra loại tệp và kích thước.
 */

export const PHOTO_BUCKET = "wedding-photos";
export const MAX_PHOTO_BYTES = 3 * 1024 * 1024;

const TYPES = {
  "image/jpeg": "jpg",
  "image/webp": "webp",
  "image/png": "png",
} as const;
export type PhotoType = keyof typeof TYPES;

/** Nhận diện loại ảnh từ vài byte đầu — không tin header Content-Type của trình duyệt. */
export function sniffImage(buf: Uint8Array): PhotoType | null {
  if (buf[0] === 0xff && buf[1] === 0xd8 && buf[2] === 0xff) return "image/jpeg";
  if (buf[0] === 0x89 && buf[1] === 0x50 && buf[2] === 0x4e && buf[3] === 0x47) return "image/png";
  const riff = String.fromCharCode(...buf.slice(0, 4));
  const webp = String.fromCharCode(...buf.slice(8, 12));
  if (riff === "RIFF" && webp === "WEBP") return "image/webp";
  return null;
}

const UPLOAD_DIR = join(process.cwd(), ".data", "uploads");
export const SAFE_NAME = /^[a-z0-9-]{8,80}\.(jpg|webp|png)$/;

let bucketReady: Promise<void> | null = null;

async function storage(path: string, init: RequestInit) {
  const url = new URL(`/storage/v1/${path}`, process.env.SUPABASE_URL!);
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY!;
  return fetch(url, {
    ...init,
    headers: { apikey: key, Authorization: `Bearer ${key}`, ...(init.headers ?? {}) },
    cache: "no-store",
    signal: AbortSignal.timeout(20000),
  });
}

/** Tạo bucket công khai ở lần tải ảnh đầu tiên (bỏ qua nếu đã có). */
function ensureBucket() {
  bucketReady ??= storage("bucket", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ id: PHOTO_BUCKET, name: PHOTO_BUCKET, public: true, file_size_limit: MAX_PHOTO_BYTES, allowed_mime_types: Object.keys(TYPES) }),
  }).then(async (r) => {
    if (r.ok || r.status === 409) return;
    const text = await r.text().catch(() => "");
    if (/already exists|Duplicate/i.test(text)) return;
    bucketReady = null;
    throw new Error(`Không tạo được bucket ảnh: ${r.status} ${text}`);
  });
  return bucketReady;
}

/** Lưu ảnh, trả về đường dẫn công khai dùng trong dữ liệu thiệp. */
export async function savePhoto(buf: Uint8Array, type: PhotoType, owner: string): Promise<string> {
  const name = `${owner.replace(/[^a-z0-9]/gi, "").slice(0, 24).toLowerCase() || "khach"}-${Date.now().toString(36)}-${randomBytes(6).toString("hex")}.${TYPES[type]}`;
  const mode = storeMode();
  if (mode === "supabase") {
    await ensureBucket();
    const r = await storage(`object/${PHOTO_BUCKET}/${name}`, {
      method: "POST",
      headers: { "Content-Type": type, "Cache-Control": "31536000", "x-upsert": "false" },
      body: Buffer.from(buf),
    });
    if (!r.ok) throw new Error(`Tải ảnh lên Supabase thất bại: ${r.status} ${await r.text().catch(() => "")}`);
    return `${new URL(`/storage/v1/object/public/${PHOTO_BUCKET}/${name}`, process.env.SUPABASE_URL!).href}`;
  }
  if (mode === "file") {
    await mkdir(UPLOAD_DIR, { recursive: true });
    await writeFile(join(UPLOAD_DIR, name), buf);
    return `/api/anh/${name}`;
  }
  throw new Error("Chưa cấu hình nơi lưu ảnh.");
}

/** Đọc ảnh đã lưu ở chế độ dev. */
export async function readLocalPhoto(name: string) {
  if (!SAFE_NAME.test(name)) return null;
  try {
    return await readFile(join(UPLOAD_DIR, name));
  } catch {
    return null;
  }
}
