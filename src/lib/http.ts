import "server-only";

/** Đọc JSON an toàn: kiểm tra nguồn gửi và giới hạn kích thước. */
export async function readJson(request: Request, maxBytes: number): Promise<{ ok: true; body: unknown } | { ok: false; res: Response }> {
  const origin = request.headers.get("origin");
  if (origin && origin !== new URL(request.url).origin) {
    return { ok: false, res: Response.json({ error: "Invalid origin" }, { status: 403 }) };
  }
  const raw = await request.text();
  if (raw.length > maxBytes) return { ok: false, res: Response.json({ error: "Dữ liệu quá lớn" }, { status: 413 }) };
  try {
    return { ok: true, body: JSON.parse(raw) };
  } catch {
    return { ok: false, res: Response.json({ error: "Invalid request" }, { status: 400 }) };
  }
}

export const bearer = (request: Request) => (request.headers.get("authorization") ?? "").replace(/^Bearer\s+/i, "").slice(0, 100);

export const noStore = { "Cache-Control": "no-store" };
