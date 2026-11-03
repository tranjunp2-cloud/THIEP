/** Cấu hình đăng nhập (Supabase Auth). Hai giá trị này công khai được — khoá anon chỉ có quyền của khách vãng lai. */
export const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
export const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "";
export const authEnabled = Boolean(SUPABASE_URL && SUPABASE_ANON_KEY);

/** Chỉ cho phép chuyển hướng nội bộ (chặn open redirect kiểu //evil.com). */
export function safeNext(next: string | null | undefined, fallback = "/quan-ly") {
  if (!next || !next.startsWith("/") || next.startsWith("//") || next.startsWith("/\\")) return fallback;
  return next;
}
