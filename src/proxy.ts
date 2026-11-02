import { NextResponse, type NextRequest } from "next/server";
import { weddings } from "@/lib/wedding/demo";

/** Slug thiệp không tồn tại → 404 thật (trang thiệp được stream nên không tự đặt được mã 404). */
export function proxy(request: NextRequest) {
  const slug = decodeURIComponent(request.nextUrl.pathname.split("/")[2] ?? "");
  if (weddings[slug]) return NextResponse.next();
  return new NextResponse(
    `<!doctype html><html lang="vi"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Không tìm thấy thiệp</title><body style="margin:0;min-height:100svh;display:grid;place-items:center;background:#f6f2ed;color:#293e2e;font-family:Georgia,serif;text-align:center"><div><p style="letter-spacing:.2em;font-size:12px">404</p><h1 style="font-weight:400">Không tìm thấy tấm thiệp này</h1><p><a href="/" style="color:inherit">Về trang chủ</a></p></div></body></html>`,
    { status: 404, headers: { "content-type": "text/html; charset=utf-8" } },
  );
}

export const config = { matcher: "/thiep/:slug" };
