import { bearer, noStore, readJson } from "@/lib/http";
import { getWeddingInput, updateWedding } from "@/lib/store";
import { weddingInputSchema } from "@/lib/wedding/schema";

/** Mở lại dữ liệu để sửa — cần token quản lý. */
export async function GET(request: Request, ctx: RouteContext<"/api/weddings/[slug]">) {
  const { slug } = await ctx.params;
  const input = await getWeddingInput(slug, bearer(request)).catch(() => null);
  if (!input) return Response.json({ error: "Link quản lý không đúng hoặc đã hết hạn." }, { status: 401, headers: noStore });
  return Response.json({ input }, { headers: noStore });
}

export async function PUT(request: Request, ctx: RouteContext<"/api/weddings/[slug]">) {
  const { slug } = await ctx.params;
  const parsed = await readJson(request, 200_000);
  if (!parsed.ok) return parsed.res;
  const input = weddingInputSchema.safeParse(parsed.body);
  if (!input.success) {
    return Response.json({ error: "Thông tin thiệp chưa hợp lệ.", issues: input.error.issues.slice(0, 10) }, { status: 400 });
  }
  try {
    const ok = await updateWedding(slug, bearer(request), input.data);
    if (!ok) return Response.json({ error: "Link quản lý không đúng." }, { status: 401 });
    return Response.json({ saved: true }, { headers: noStore });
  } catch (e) {
    console.error("Update wedding failed", e);
    return Response.json({ error: "Chưa lưu được thay đổi." }, { status: 503 });
  }
}
