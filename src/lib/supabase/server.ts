import "server-only";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { authEnabled, SUPABASE_ANON_KEY, SUPABASE_URL } from "./config";

export async function supabaseServer() {
  const store = await cookies();
  return createServerClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
    cookies: {
      getAll: () => store.getAll(),
      setAll: (list) => {
        try {
          list.forEach(({ name, value, options }) => store.set(name, value, options));
        } catch {
          // Gọi từ nơi không ghi được cookie — bỏ qua, phiên sẽ được làm mới ở lần gọi sau.
        }
      },
    },
  });
}

export type SessionUser = { id: string; email?: string; name?: string };

/** Người dùng đang đăng nhập (đã xác minh với máy chủ Supabase Auth), hoặc null. */
export async function getSessionUser(): Promise<SessionUser | null> {
  if (!authEnabled) return null;
  try {
    const sb = await supabaseServer();
    const { data } = await sb.auth.getUser();
    const u = data.user;
    if (!u) return null;
    return { id: u.id, email: u.email, name: (u.user_metadata?.full_name as string) || (u.user_metadata?.name as string) || undefined };
  } catch {
    return null;
  }
}
