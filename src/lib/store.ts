import "server-only";
import { createHash, randomBytes, timingSafeEqual } from "node:crypto";
import { mkdir, readFile, rename, writeFile } from "node:fs/promises";
import { join } from "node:path";
import { DEMO_SLUG, demoWedding } from "./wedding/demo";
import { slugify, toWedding, weddingInputSchema, type WeddingInput } from "./wedding/schema";
import type { Wedding } from "./wedding/types";

/**
 * Lưu trữ thiệp và phản hồi RSVP.
 * - Supabase (REST, khoá service role) khi có SUPABASE_URL + SUPABASE_SERVICE_ROLE_KEY.
 * - File JSON trong .data/ khi chạy dev (hoặc DUYEN_FILE_STORE=1) để thử trọn luồng không cần cơ sở dữ liệu.
 * Token quản lý chỉ được lưu dưới dạng băm SHA-256.
 */

export type RsvpRecord = {
  id: string;
  wedding: string;
  guest_key: string;
  name: string;
  attendance: "yes" | "no";
  party_size: number;
  side: string;
  message: string;
  created_at: string;
};

type StoredWedding = { slug: string; data: WeddingInput; edit_token_hash: string; created_at: string; updated_at: string };

export type StoreMode = "supabase" | "file" | null;

export function storeMode(): StoreMode {
  if (process.env.SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY) return "supabase";
  if (process.env.NODE_ENV !== "production" || process.env.DUYEN_FILE_STORE === "1") return "file";
  return null;
}

const hash = (token: string) => createHash("sha256").update(token).digest("hex");

function tokenMatches(token: string, expectedHash: string) {
  const a = Buffer.from(hash(token), "hex");
  const b = Buffer.from(expectedHash, "hex");
  return a.length === b.length && timingSafeEqual(a, b);
}

/* ---------------- Supabase ---------------- */

async function sb(path: string, init: RequestInit & { prefer?: string } = {}) {
  const url = process.env.SUPABASE_URL!;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY!;
  const endpoint = new URL(`/rest/v1/${path}`, url);
  if (endpoint.protocol !== "https:") throw new Error("Supabase requires HTTPS");
  const res = await fetch(endpoint, {
    ...init,
    headers: {
      apikey: key,
      Authorization: `Bearer ${key}`,
      "Content-Type": "application/json",
      ...(init.prefer ? { Prefer: init.prefer } : {}),
    },
    cache: "no-store",
    signal: AbortSignal.timeout(10000),
  });
  if (!res.ok) throw new Error(`Supabase ${res.status}: ${await res.text().catch(() => "")}`);
  return res;
}

/* ---------------- File (dev) ---------------- */

type FileDb = { weddings: Record<string, StoredWedding>; rsvps: RsvpRecord[] };
const DB_DIR = join(process.cwd(), ".data");
const DB_FILE = join(DB_DIR, "store.json");
let queue: Promise<unknown> = Promise.resolve();

async function readDb(): Promise<FileDb> {
  try {
    return JSON.parse(await readFile(DB_FILE, "utf8"));
  } catch {
    return { weddings: {}, rsvps: [] };
  }
}

/** Ghi tuần tự + đổi tên tệp nguyên tử để không hỏng dữ liệu khi có nhiều yêu cầu cùng lúc. */
function mutateDb<T>(fn: (db: FileDb) => T): Promise<T> {
  const run = queue.then(async () => {
    const db = await readDb();
    const result = fn(db);
    await mkdir(DB_DIR, { recursive: true });
    const tmp = `${DB_FILE}.${process.pid}.tmp`;
    await writeFile(tmp, JSON.stringify(db, null, 1));
    await rename(tmp, DB_FILE);
    return result;
  });
  queue = run.catch(() => {});
  return run;
}

/* ---------------- API công khai ---------------- */

async function getStored(slug: string): Promise<StoredWedding | null> {
  const mode = storeMode();
  if (mode === "supabase") {
    const res = await sb(`weddings?slug=eq.${encodeURIComponent(slug)}&select=*`);
    const rows = (await res.json()) as StoredWedding[];
    return rows[0] ?? null;
  }
  if (mode === "file") return (await readDb()).weddings[slug] ?? null;
  return null;
}

export async function getWedding(slug: string): Promise<Wedding | null> {
  if (slug === DEMO_SLUG) return demoWedding;
  if (!/^[a-z0-9-]{3,80}$/.test(slug)) return null;
  const row = await getStored(slug);
  if (!row) return null;
  const parsed = weddingInputSchema.safeParse(row.data);
  return parsed.success ? toWedding(row.slug, parsed.data) : null;
}

/** Dữ liệu gốc để mở lại ở trang sửa thiệp — chỉ trả khi token đúng. */
export async function getWeddingInput(slug: string, token: string): Promise<WeddingInput | null> {
  const row = await getStored(slug);
  if (!row || !tokenMatches(token, row.edit_token_hash)) return null;
  return row.data;
}

export async function verifyToken(slug: string, token: string) {
  const row = await getStored(slug);
  return Boolean(row && tokenMatches(token, row.edit_token_hash));
}

export async function createWedding(input: WeddingInput) {
  const mode = storeMode();
  if (!mode) throw new Error("Store not configured");
  const token = randomBytes(24).toString("base64url");
  const base = `${slugify(input.groom.short)}-${slugify(input.bride.short)}`.replace(/^-|-$/g, "") || "thiep";
  const now = new Date().toISOString();

  for (let attempt = 0; attempt < 5; attempt++) {
    const slug = `${base}-${randomBytes(3).toString("hex")}`;
    const row: StoredWedding = { slug, data: input, edit_token_hash: hash(token), created_at: now, updated_at: now };
    if (mode === "supabase") {
      try {
        await sb("weddings", { method: "POST", body: JSON.stringify(row), prefer: "return=minimal" });
        return { slug, token };
      } catch (e) {
        if (String(e).includes("409")) continue; // trùng slug, thử lại
        throw e;
      }
    }
    const ok = await mutateDb((db) => {
      if (db.weddings[slug]) return false;
      db.weddings[slug] = row;
      return true;
    });
    if (ok) return { slug, token };
  }
  throw new Error("Could not allocate slug");
}

export async function updateWedding(slug: string, token: string, input: WeddingInput) {
  const row = await getStored(slug);
  if (!row || !tokenMatches(token, row.edit_token_hash)) return false;
  const updated_at = new Date().toISOString();
  if (storeMode() === "supabase") {
    await sb(`weddings?slug=eq.${encodeURIComponent(slug)}`, {
      method: "PATCH",
      body: JSON.stringify({ data: input, updated_at }),
      prefer: "return=minimal",
    });
  } else {
    await mutateDb((db) => {
      db.weddings[slug] = { ...db.weddings[slug], data: input, updated_at };
    });
  }
  return true;
}

export async function saveRsvp(record: RsvpRecord) {
  const mode = storeMode();
  if (mode === "supabase") {
    await sb("wedding_rsvps?on_conflict=id", {
      method: "POST",
      body: JSON.stringify(record),
      prefer: "resolution=ignore-duplicates,return=minimal",
    });
  } else if (mode === "file") {
    await mutateDb((db) => {
      if (!db.rsvps.some((r) => r.id === record.id)) db.rsvps.push(record);
    });
  } else throw new Error("Store not configured");
}

export async function listRsvps(slug: string): Promise<RsvpRecord[]> {
  const mode = storeMode();
  if (mode === "supabase") {
    const res = await sb(`wedding_rsvps?wedding=eq.${encodeURIComponent(slug)}&select=*&order=created_at.desc&limit=2000`);
    return res.json();
  }
  if (mode === "file") {
    return (await readDb()).rsvps.filter((r) => r.wedding === slug).sort((a, b) => b.created_at.localeCompare(a.created_at));
  }
  return [];
}
