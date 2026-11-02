import { weddings } from "@/lib/wedding/demo";
import { isRsvpConfigured, saveRsvp } from "@/lib/rsvp-storage";

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
const str = (v: unknown, max: number) => (typeof v === "string" ? v.trim().slice(0, max + 1) : "");

export async function GET() {
  // Chỉ báo có lưu được hay không — không bao giờ trả danh sách khách.
  return Response.json({ available: isRsvpConfigured() }, { headers: { "Cache-Control": "no-store" } });
}

export async function POST(request: Request) {
  const origin = request.headers.get("origin");
  if (origin && origin !== new URL(request.url).origin) return Response.json({ error: "Invalid origin" }, { status: 403 });
  const raw = await request.text();
  if (raw.length > 10000) return Response.json({ error: "Request too large" }, { status: 413 });

  let body: Record<string, unknown>;
  try {
    body = JSON.parse(raw);
  } catch {
    return Response.json({ error: "Invalid request" }, { status: 400 });
  }

  const wedding = weddings[str(body.wedding, 80)];
  const id = str(body.id, 36);
  const name = str(body.name, 150);
  const attendance = body.attendance === "yes" || body.attendance === "no" ? body.attendance : null;
  const partySize = Number(body.partySize);
  const message = str(body.message, 2000);
  const side = str(body.side, 20);
  const guestKey = str(body.guestKey, 80);

  if (str(body.website, 1)) return Response.json({ saved: true }, { status: 201 }); // bẫy bot
  if (
    !wedding ||
    !UUID.test(id) ||
    name.length < 2 ||
    name.length > 150 ||
    !attendance ||
    message.length > 2000 ||
    (attendance === "yes" && !(Number.isInteger(partySize) && partySize >= 1 && partySize <= 10)) ||
    (side && side !== "Nhà trai" && side !== "Nhà gái") ||
    (guestKey && !wedding.guests.some((g) => g.key === guestKey))
  ) {
    return Response.json({ error: "Vui lòng kiểm tra lại thông tin." }, { status: 400 });
  }

  if (!isRsvpConfigured()) return Response.json({ error: "RSVP chưa được cấu hình." }, { status: 503 });

  try {
    await saveRsvp({
      id,
      wedding: wedding.slug,
      guest_key: guestKey,
      name,
      attendance,
      party_size: attendance === "yes" ? partySize : 0,
      side,
      message,
      created_at: new Date().toISOString(),
    });
    return Response.json({ saved: true }, { status: 201 });
  } catch (e) {
    console.error("RSVP storage unavailable", e);
    return Response.json({ error: "Chưa lưu được phản hồi. Vui lòng thử lại." }, { status: 503 });
  }
}
