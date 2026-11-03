import { noStore } from "@/lib/http";
import { listOwned } from "@/lib/store";
import { getSessionUser } from "@/lib/supabase/server";

/** Thiệp thuộc tài khoản đang đăng nhập. */
export async function GET() {
  const user = await getSessionUser();
  if (!user) return Response.json({ error: "Vui lòng đăng nhập." }, { status: 401, headers: noStore });
  try {
    return Response.json({ user, weddings: await listOwned(user.id) }, { headers: noStore });
  } catch (e) {
    console.error("List owned failed", e);
    return Response.json({ error: "Chưa tải được danh sách thiệp." }, { status: 503, headers: noStore });
  }
}
