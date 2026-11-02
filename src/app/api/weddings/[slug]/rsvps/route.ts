import { bearer, noStore } from "@/lib/http";
import { getWedding, listRsvps, verifyToken } from "@/lib/store";

/** Danh sách phản hồi cho trang quản lý — chỉ trả khi token đúng. */
export async function GET(request: Request, ctx: RouteContext<"/api/weddings/[slug]/rsvps">) {
  const { slug } = await ctx.params;
  try {
    if (!(await verifyToken(slug, bearer(request)))) {
      return Response.json({ error: "Link quản lý không đúng." }, { status: 401, headers: noStore });
    }
    const [wedding, rsvps] = await Promise.all([getWedding(slug), listRsvps(slug)]);
    return Response.json({ wedding, rsvps }, { headers: noStore });
  } catch (e) {
    console.error("List RSVPs failed", e);
    return Response.json({ error: "Chưa tải được dữ liệu." }, { status: 503, headers: noStore });
  }
}
