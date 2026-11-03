"use client";

import { useEffect } from "react";
import { safeNext } from "@/lib/supabase/config";
import { supabaseBrowser } from "@/lib/supabase/client";

/**
 * /auth/callback chuyển tới đây khi Supabase trả phiên trong phần #hash
 * (#access_token=…&refresh_token=…&type=recovery) thay vì ?code= / ?token_hash=.
 * Đọc và xoá hash trước khi tạo client để token không nằm lại trên thanh địa chỉ.
 */
let started = false; // StrictMode chạy effect hai lần — lần hai hash đã bị xoá

export function FinishAuth() {
  useEffect(() => {
    if (started) return;
    started = true;
    const hash = new URLSearchParams(window.location.hash.slice(1));
    const next = safeNext(new URLSearchParams(window.location.search).get("next"));
    history.replaceState(null, "", window.location.pathname);
    const fail = (reason: string) => window.location.replace(`/?auth_error=${encodeURIComponent(reason)}`);

    const error = hash.get("error_description") || hash.get("error_code") || hash.get("error");
    if (error) return fail(error);
    const access_token = hash.get("access_token");
    const refresh_token = hash.get("refresh_token");
    const sb = supabaseBrowser();
    if (!sb) return fail("not_configured");
    if (!access_token || !refresh_token) return fail("missing_code");

    sb.auth.setSession({ access_token, refresh_token }).then(({ error }) => {
      if (error) return fail(error.message);
      window.location.replace(hash.get("type") === "recovery" ? "/dat-lai-mat-khau" : next);
    });
  }, []);

  return (
    <main className="legal" style={{ minHeight: "60vh", display: "grid", placeItems: "center" }}>
      <p>Đang đăng nhập…</p>
    </main>
  );
}
