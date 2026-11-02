import { noStore, readJson } from "@/lib/http";
import { createWedding, storeMode } from "@/lib/store";
import { weddingInputSchema } from "@/lib/wedding/schema";

export async function GET() {
  return Response.json({ available: storeMode() !== null }, { headers: noStore });
}

/** Xuất bản thiệp mới. Trả về slug + token quản lý (chỉ hiện một lần). */
export async function POST(request: Request) {
  const parsed = await readJson(request, 200_000);
  if (!parsed.ok) return parsed.res;
  const input = weddingInputSchema.safeParse(parsed.body);
  if (!input.success) {
    return Response.json({ error: "Thông tin thiệp chưa hợp lệ.", issues: input.error.issues.slice(0, 10) }, { status: 400 });
  }
  if (!storeMode()) return Response.json({ error: "Chưa cấu hình nơi lưu thiệp." }, { status: 503 });
  try {
    const { slug, token } = await createWedding(input.data);
    return Response.json({ slug, token }, { status: 201, headers: noStore });
  } catch (e) {
    console.error("Create wedding failed", e);
    return Response.json({ error: "Chưa xuất bản được thiệp. Vui lòng thử lại." }, { status: 503 });
  }
}
