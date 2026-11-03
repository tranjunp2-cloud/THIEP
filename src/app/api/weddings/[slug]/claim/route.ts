import { bearer, noStore, readJson } from "@/lib/http";
import { claimWedding } from "@/lib/store";
import { getSessionUser } from "@/lib/supabase/server";

/** Lưu thiệp (đang quản lý bằng link bí mật) vào tài khoản đang đăng nhập. */
export async function POST(request: Request, ctx: RouteContext<"/api/weddings/[slug]/claim">) {
  const parsed = await readJson(request, 1000); // chỉ để kiểm tra nguồn gửi
  if (!parsed.ok) return parsed.res;
  const { slug } = await ctx.params;
  const user = await getSessionUser();
  if (!user) return Response.json({ error: "Vui lòng đăng nhập." }, { status: 401 });
  try {
    const result = await claimWedding(slug, bearer(request), user.id);
    if (result === "forbidden") return Response.json({ error: "Link quản lý không đúng." }, { status: 403 });
    if (result === "taken") return Response.json({ error: "Thiệp đã thuộc một tài khoản khác." }, { status: 409 });
    return Response.json({ saved: true }, { headers: noStore });
  } catch (e) {
    console.error("Claim failed", e);
    return Response.json({ error: "Chưa lưu được. Bạn đã chạy migration thêm cột owner_id chưa?" }, { status: 503 });
  }
}
