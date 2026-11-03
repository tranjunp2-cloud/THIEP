"use client";

import { useEffect, useState } from "react";
import { supabaseBrowser } from "@/lib/supabase/client";
import { AppTop } from "../app/ui";
import { viError } from "./AuthModal";

/** Đặt mật khẩu mới sau khi bấm link trong email (phiên khôi phục đã được /auth/callback tạo). */
export function ResetPassword() {
  const [ready, setReady] = useState<"checking" | "ok" | "no-session">("checking");
  const [pw, setPw] = useState("");
  const [pw2, setPw2] = useState("");
  const [error, setError] = useState("");
  const [done, setDone] = useState(false);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    const sb = supabaseBrowser();
    if (!sb) {
      // eslint-disable-next-line react-hooks/set-state-in-effect -- cấu hình chỉ biết ở trình duyệt
      setReady("no-session");
      return;
    }
    sb.auth.getUser().then(({ data }) => setReady(data.user ? "ok" : "no-session"));
  }, []);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    if (pw.length < 8) return setError("Mật khẩu cần ít nhất 8 ký tự.");
    if (pw !== pw2) return setError("Hai mật khẩu chưa khớp nhau.");
    setBusy(true);
    const { error } = await supabaseBrowser()!.auth.updateUser({ password: pw });
    setBusy(false);
    if (error) return setError(viError(error.message));
    setDone(true);
  }

  return (
    <>
      <AppTop />
      <div className="center-page">
        <div className="panel">
          <h1>Đặt lại mật khẩu</h1>
          {ready === "checking" && <p className="panel-lead">Đang kiểm tra…</p>}
          {ready === "no-session" && (
            <>
              <p className="panel-lead">Link đặt lại mật khẩu đã hết hạn hoặc không hợp lệ. Bạn yêu cầu link mới ở mục “Quên mật khẩu?” nhé.</p>
              <a className="btn btn-dark" href="/">
                Về trang chủ
              </a>
            </>
          )}
          {ready === "ok" &&
            (done ? (
              <>
                <p className="notice">Đã đổi mật khẩu. Từ giờ bạn đăng nhập bằng mật khẩu mới.</p>
                <div className="step-nav">
                  <span />
                  <a className="btn btn-dark" href="/quan-ly">
                    Đến Thiệp của tôi →
                  </a>
                </div>
              </>
            ) : (
              <form onSubmit={submit} style={{ display: "grid", gap: 14, marginTop: 16 }}>
                <label className="field">
                  <span>Mật khẩu mới</span>
                  <input type="password" value={pw} onChange={(e) => setPw(e.target.value)} autoComplete="new-password" minLength={8} required />
                  <small>Ít nhất 8 ký tự.</small>
                </label>
                <label className="field">
                  <span>Nhập lại mật khẩu mới</span>
                  <input type="password" value={pw2} onChange={(e) => setPw2(e.target.value)} autoComplete="new-password" required />
                </label>
                {error && <p className="issues" style={{ listStyle: "none", margin: 0 }}>{error}</p>}
                <button type="submit" className="btn btn-dark" disabled={busy}>
                  {busy ? "Đang lưu…" : "Lưu mật khẩu mới"}
                </button>
              </form>
            ))}
        </div>
      </div>
    </>
  );
}
