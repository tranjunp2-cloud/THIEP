"use client";

import type { User } from "@supabase/supabase-js";
import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { authEnabled } from "@/lib/supabase/config";
import { supabaseBrowser } from "@/lib/supabase/client";
import { AuthModal, type AuthMode } from "./AuthModal";

type AuthCtx = {
  enabled: boolean;
  user: User | null;
  loading: boolean;
  /** Mở modal; `next` là trang chuyển tới sau khi đăng nhập xong. */
  openAuth: (mode?: AuthMode, next?: string) => void;
  signOut: () => Promise<void>;
};

const Ctx = createContext<AuthCtx>({
  enabled: false,
  user: null,
  loading: false,
  openAuth: () => {},
  signOut: async () => {},
});

export const useAuth = () => useContext(Ctx);

const EPHEMERAL = "duyen:auth-ephemeral"; // người dùng bỏ chọn “Ghi nhớ thiết bị này”
const ALIVE = "duyen:auth-alive";

export const displayName = (u: User | null) =>
  (u?.user_metadata?.full_name as string) || (u?.user_metadata?.name as string) || u?.email?.split("@")[0] || "";

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(authEnabled);
  const [modal, setModal] = useState<{ mode: AuthMode; next?: string; error?: string } | null>(null);

  useEffect(() => {
    // Supabase trả phiên trong #hash (link email kiểu cũ, hoặc rơi về Site URL) → để /auth/hoan-tat xử lý.
    if (/(^#|&)(access_token|error_code)=/.test(window.location.hash) && authEnabled) {
      window.location.replace(`/auth/hoan-tat${window.location.hash}`);
      return;
    }
    const sb = supabaseBrowser();
    if (!sb) return;
    let active = true;

    (async () => {
      // “Không ghi nhớ thiết bị”: phiên chỉ sống trong phiên trình duyệt hiện tại.
      try {
        if (localStorage.getItem(EPHEMERAL) === "1" && sessionStorage.getItem(ALIVE) !== "1") {
          await sb.auth.signOut({ scope: "local" });
          localStorage.removeItem(EPHEMERAL);
        }
        sessionStorage.setItem(ALIVE, "1");
      } catch {}
      const { data } = await sb.auth.getUser();
      if (!active) return;
      setUser(data.user ?? null);
      setLoading(false);
    })();

    const { data: sub } = sb.auth.onAuthStateChange((_event, session) => setUser(session?.user ?? null));

    // Lỗi trả về từ /auth/callback (vd. link xác nhận hết hạn).
    const err = new URLSearchParams(window.location.search).get("auth_error");
    if (err) {
      // eslint-disable-next-line react-hooks/set-state-in-effect -- chỉ đọc URL ở trình duyệt, một lần khi tải trang
      setModal({ mode: "login", error: err });
      history.replaceState(null, "", window.location.pathname + window.location.hash);
    }

    return () => {
      active = false;
      sub.subscription.unsubscribe();
    };
  }, []);

  const openAuth = useCallback((mode: AuthMode = "login", next?: string) => setModal({ mode, next }), []);

  const signOut = useCallback(async () => {
    await supabaseBrowser()?.auth.signOut();
    setUser(null);
    try {
      localStorage.removeItem(EPHEMERAL);
    } catch {}
  }, []);

  /* Link có data-require-auth: chưa đăng nhập thì mở modal Tạo tài khoản (giống CineLove). */
  useEffect(() => {
    if (!authEnabled) return;
    const onClick = (e: MouseEvent) => {
      if (user || e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey) return;
      const a = (e.target as Element | null)?.closest?.("a[data-require-auth]") as HTMLAnchorElement | null;
      if (!a) return;
      e.preventDefault();
      setModal({ mode: "register", next: a.getAttribute("href") ?? "/tao-thiep" });
    };
    document.addEventListener("click", onClick, true);
    return () => document.removeEventListener("click", onClick, true);
  }, [user]);

  const value = useMemo(() => ({ enabled: authEnabled, user, loading, openAuth, signOut }), [user, loading, openAuth, signOut]);

  return (
    <Ctx.Provider value={value}>
      {children}
      {modal && (
        <AuthModal
          initialMode={modal.mode}
          next={modal.next}
          initialError={modal.error}
          onClose={() => setModal(null)}
          onSignedIn={(remember) => {
            try {
              if (remember) localStorage.removeItem(EPHEMERAL);
              else localStorage.setItem(EPHEMERAL, "1");
              sessionStorage.setItem(ALIVE, "1");
            } catch {}
            const next = modal.next;
            setModal(null);
            if (next && next !== window.location.pathname + window.location.search) window.location.assign(next);
          }}
        />
      )}
    </Ctx.Provider>
  );
}
