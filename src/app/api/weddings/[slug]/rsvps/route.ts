import { bearer, noStore } from "@/lib/http";
import { getWedding, listRsvps, verifyAccess } from "@/lib/store";
import { getSessionUser } from "@/lib/supabase/server";

/** Danh sách phản hồi cho trang quản lý — chỉ trả cho người có token hoặc chủ thiệp. */
export async function GET(request: Request, ctx: RouteContext<"/api/weddings/[slug]/rsvps">) {
  const { slug } = await ctx.params;
  try {
    const user = await getSessionUser();
    const acc = await verifyAccess(slug, { token: bearer(request), userId: user?.id });
    if (!acc?.ok) {
      return Response.json({ error: user ? "Thiệp này không thuộc tài khoản của bạn." : "Bạn không có quyền xem thiệp này." }, { status: 401, headers: noStore });
    }
    const [wedding, rsvps] = await Promise.all([getWedding(slug), listRsvps(slug)]);
    // canClaim: đang đăng nhập, mở bằng token, thiệp chưa có chủ → có thể lưu vào tài khoản.
    return Response.json({ wedding, rsvps, owned: acc.owned, mine: acc.mine, canClaim: Boolean(user && !acc.owned) }, { headers: noStore });
  } catch (e) {
    console.error("List RSVPs failed", e);
    return Response.json({ error: "Chưa tải được dữ liệu." }, { status: 503, headers: noStore });
  }
}
