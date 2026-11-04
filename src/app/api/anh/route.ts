import { bearer, noStore } from "@/lib/http";
import { MAX_PHOTO_BYTES, savePhoto, sniffImage } from "@/lib/photo-store";
import { storeMode, verifyAccess } from "@/lib/store";
import { authEnabled } from "@/lib/supabase/config";
import { getSessionUser } from "@/lib/supabase/server";

/**
 * Tải một ảnh cưới lên. Thân yêu cầu là dữ liệu ảnh (đã nén ở trình duyệt).
 * Quyền: đã đăng nhập, hoặc có token quản lý của thiệp đang sửa (header X-Wedding + Authorization),
 * hoặc site chưa bật đăng nhập (bản thử nghiệm).
 */
export async function POST(request: Request) {
  const origin = request.headers.get("origin");
  if (origin && origin !== new URL(request.url).origin) return Response.json({ error: "Invalid origin" }, { status: 403 });
  if (!storeMode()) return Response.json({ error: "Chưa cấu hình nơi lưu ảnh." }, { status: 503 });

  const user = await getSessionUser();
  let owner = user?.id ?? "";
  if (!user && authEnabled) {
    const slug = (request.headers.get("x-wedding") ?? "").slice(0, 80);
    const token = bearer(request);
    const access = slug && token ? await verifyAccess(slug, { token }).catch(() => null) : null;
    if (!access?.ok) return Response.json({ error: "Vui lòng đăng nhập để tải ảnh lên.", login: true }, { status: 401 });
    owner = slug;
  }

  const declared = Number(request.headers.get("content-length") ?? 0);
  if (declared > MAX_PHOTO_BYTES) return Response.json({ error: "Ảnh quá lớn (tối đa 3MB)." }, { status: 413 });
  const buf = new Uint8Array(await request.arrayBuffer());
  if (!buf.length) return Response.json({ error: "Chưa có ảnh." }, { status: 400 });
  if (buf.length > MAX_PHOTO_BYTES) return Response.json({ error: "Ảnh quá lớn (tối đa 3MB)." }, { status: 413 });
  const type = sniffImage(buf);
  if (!type) return Response.json({ error: "Chỉ nhận ảnh JPG, PNG hoặc WebP." }, { status: 415 });

  try {
    const src = await savePhoto(buf, type, owner || "dev");
    return Response.json({ src }, { status: 201, headers: noStore });
  } catch (e) {
    console.error("Photo upload failed", e);
    return Response.json({ error: "Chưa tải được ảnh lên. Vui lòng thử lại." }, { status: 503 });
  }
}
