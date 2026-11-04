import { readLocalPhoto } from "@/lib/photo-store";

const TYPE: Record<string, string> = { jpg: "image/jpeg", webp: "image/webp", png: "image/png" };

/** Ảnh tải lên khi chạy dev (lưu trong .data/uploads). Bản production dùng Supabase Storage. */
export async function GET(_request: Request, ctx: RouteContext<"/api/anh/[name]">) {
  const { name } = await ctx.params;
  const data = await readLocalPhoto(name);
  if (!data) return new Response("Not found", { status: 404 });
  return new Response(new Uint8Array(data), {
    headers: {
      "Content-Type": TYPE[name.split(".").pop() ?? ""] ?? "application/octet-stream",
      "Cache-Control": "public, max-age=31536000, immutable",
      "X-Content-Type-Options": "nosniff",
    },
  });
}
