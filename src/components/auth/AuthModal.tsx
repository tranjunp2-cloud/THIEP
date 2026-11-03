"use client";

import { useEffect, useRef, useState } from "react";
import { SUPABASE_ANON_KEY, SUPABASE_URL } from "@/lib/supabase/config";
import { supabaseBrowser } from "@/lib/supabase/client";
import { BrandMark } from "../site/BrandMark";
import "./auth.css";
import { PasswordInput, PW_MIN } from "./PasswordInput";

export type AuthMode = "login" | "register" | "forgot";
type View = AuthMode | "check-email" | "reset-sent";

/**
 * Công tắc tính năng:
 * - Google / Facebook: nút tự hiện khi provider tương ứng đã bật trên Supabase (đọc /auth/v1/settings).
 * - NEXT_PUBLIC_AUTH_RESET=0  : ẩn “Quên mật khẩu?” (mặc định BẬT — gửi email qua Supabase; nên có SMTP riêng khi chạy thật)
 */
type Provider = "google" | "facebook";
let providersCache: Promise<Provider[]> | null = null;

/** Provider mạng xã hội đang bật trên Supabase — hỏi một lần mỗi lần tải trang. */
export function enabledProviders(): Promise<Provider[]> {
  providersCache ??= fetch(`${SUPABASE_URL}/auth/v1/settings`, { headers: { apikey: SUPABASE_ANON_KEY } })
    .then((r) => (r.ok ? r.json() : { external: {} }))
    .then((j: { external?: Record<string, boolean> }) => (["google", "facebook"] as const).filter((p) => j.external?.[p]))
    .catch(() => []);
  return providersCache;
}
const RESET = process.env.NEXT_PUBLIC_AUTH_RESET !== "0";

/** Số di động Việt Nam: bỏ khoảng trắng/dấu chấm, +84 → 0. Trả "" nếu không hợp lệ. */
export function normalizePhone(v: string) {
  const d = v.replace(/[\s.\-()]/g, "").replace(/^\+?84/, "0");
  return /^0(3|5|7|8|9)\d{8}$/.test(d) ? d : "";
}

const EPHEMERAL = "duyen:auth-ephemeral";
const ALIVE = "duyen:auth-alive";

/** Thông báo lỗi tiếng Việt cho các lỗi thường gặp của Supabase Auth. */
export function viError(message: string) {
  const m = message.toLowerCase();
  if (m.includes("invalid login credentials")) return "Email hoặc mật khẩu không đúng.";
  if (m.includes("already registered") || m.includes("already been registered")) return "Email này đã có tài khoản. Bạn đăng nhập nhé.";
  if (m.includes("email not confirmed")) return "Bạn cần bấm link xác nhận trong email trước khi đăng nhập.";
  if (m.includes("provider is not enabled") || m.includes("unsupported provider")) return "Đăng nhập bằng mạng xã hội này chưa được bật.";
  if (m.includes("rate limit") || m.includes("too many") || m.includes("security purposes")) return "Bạn thao tác hơi nhanh, vui lòng thử lại sau ít phút.";
  if (m.includes("password") && (m.includes("at least") || m.includes("weak") || m.includes("short"))) return `Mật khẩu cần ít nhất ${PW_MIN} ký tự.`;
  if (m.includes("invalid email") || m.includes("unable to validate email")) return "Email chưa đúng định dạng.";
  if (m.includes("not authorized") || m.includes("sending recovery") || m.includes("sending confirmation") || m.includes("error sending"))
    return "Hệ thống chưa gửi được email lúc này. Bạn thử lại sau hoặc liên hệ SayIDo để được hỗ trợ.";
  if (m.includes("expired") || m.includes("otp")) return "Link đã hết hạn hoặc đã được dùng. Bạn thử lại nhé.";
  if (m.includes("code verifier")) return "Link cần được mở trên đúng trình duyệt bạn đã dùng để đăng ký / đăng nhập. Bạn đăng nhập lại nhé.";
  if (m.includes("missing_code") || m.includes("access_denied")) return "Đăng nhập chưa hoàn tất. Bạn thử lại nhé.";
  if (m.includes("not_configured")) return "Đăng nhập chưa được cấu hình trên máy chủ.";
  if (m.includes("fetch") || m.includes("network")) return "Không kết nối được máy chủ. Kiểm tra mạng và thử lại.";
  return "Có lỗi xảy ra, bạn thử lại nhé.";
}

const GoogleIcon = () => (
  <svg width="18" height="18" viewBox="0 0 48 48" aria-hidden="true">
    <path fill="#FFC107" d="M43.6 20.5H42V20H24v8h11.3C33.7 32.7 29.2 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.8 1.2 7.9 3.1l5.7-5.7C34 6.1 29.3 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20 20-8.9 20-20c0-1.3-.1-2.4-.4-3.5z" />
    <path fill="#FF3D00" d="m6.3 14.7 6.6 4.8C14.7 15.1 19 12 24 12c3.1 0 5.8 1.2 7.9 3.1l5.7-5.7C34 6.1 29.3 4 24 4 16.3 4 9.7 8.3 6.3 14.7z" />
    <path fill="#4CAF50" d="M24 44c5.2 0 9.9-2 13.4-5.2l-6.2-5.2C29.2 35.1 26.7 36 24 36c-5.2 0-9.6-3.3-11.3-8l-6.5 5C9.5 39.6 16.2 44 24 44z" />
    <path fill="#1976D2" d="M43.6 20.5H42V20H24v8h11.3c-.8 2.2-2.2 4.2-4.1 5.6l6.2 5.2C37 39.2 44 34 44 24c0-1.3-.1-2.4-.4-3.5z" />
  </svg>
);

const FacebookIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true">
    <rect width="24" height="24" rx="4" fill="#1877F2" />
    <path fill="#fff" d="M16.5 24v-9.3h3.1l.5-3.6h-3.6V8.8c0-1 .3-1.8 1.8-1.8h1.9V3.8c-.3 0-1.5-.1-2.8-.1-2.8 0-4.7 1.7-4.7 4.8v2.6H9.6v3.6h3.1V24h3.8z" />
  </svg>
);

type Props = {
  initialMode: AuthMode;
  next?: string;
  initialError?: string | null;
  onClose: () => void;
  onSignedIn: (remember: boolean) => void;
};

export function AuthModal({ initialMode, next, initialError, onClose, onSignedIn }: Props) {
  const [view, setView] = useState<View>(initialMode);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(true);
  const [providers, setProviders] = useState<Provider[]>([]);
  useEffect(() => {
    let alive = true;
    enabledProviders().then((p) => alive && setProviders(p));
    return () => {
      alive = false;
    };
  }, []);
  const [agree, setAgree] = useState(false);
  const [busy, setBusy] = useState<"" | "email" | "google" | "facebook">("");
  const [error, setError] = useState(initialError ? viError(initialError) : "");
  const dialogRef = useRef<HTMLDivElement>(null);
  const sb = supabaseBrowser();

  // Khoá cuộn trang, Esc để đóng, đưa con trỏ vào ô đầu tiên.
  useEffect(() => {
    const lenis = (window as Window & { __lenis?: { stop: () => void; start: () => void } }).__lenis;
    lenis?.stop();
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => {
      lenis?.start();
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  }, [onClose]);

  useEffect(() => {
    dialogRef.current?.querySelector<HTMLInputElement>("input:not([type=checkbox])")?.focus();
  }, [view]);

  const go = (v: View) => {
    setError("");
    setView(v);
  };

  const callbackUrl = (target?: string) =>
    `${window.location.origin}/auth/callback?next=${encodeURIComponent(target ?? next ?? window.location.pathname)}`;

  async function oauth(provider: Provider) {
    if (!sb) return setError(viError("not_configured"));
    setBusy(provider);
    setError("");
    try {
      // Ghi nhớ lựa chọn trước khi rời trang sang Google / Facebook.
      if (remember) localStorage.removeItem(EPHEMERAL);
      else localStorage.setItem(EPHEMERAL, "1");
      sessionStorage.setItem(ALIVE, "1");
    } catch {}
    const { error } = await sb.auth.signInWithOAuth({ provider, options: { redirectTo: callbackUrl() } });
    if (error) {
      setBusy("");
      setError(viError(error.message));
    }
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!sb) return setError(viError("not_configured"));
    setError("");

    if (view === "register") {
      if (name.trim().length < 2) return setError("Bạn nhập họ và tên giúp mình nhé.");
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) return setError("Email chưa đúng định dạng.");
      if (!normalizePhone(phone)) return setError("Số điện thoại chưa đúng (10 số, ví dụ 0912 345 678).");
      if (password.length < PW_MIN) return setError(`Mật khẩu cần ít nhất ${PW_MIN} ký tự.`);
      if (!agree) return setError("Bạn cần đồng ý với Điều khoản dịch vụ và Chính sách bảo mật.");
    }

    setBusy("email");
    try {
      if (view === "login") {
        const { error } = await sb.auth.signInWithPassword({ email: email.trim(), password });
        if (error) throw error;
        onSignedIn(remember);
      } else if (view === "register") {
        const { data, error } = await sb.auth.signUp({
          email: email.trim(),
          password,
          options: { data: { full_name: name.trim(), phone: normalizePhone(phone) }, emailRedirectTo: callbackUrl() },
        });
        if (error) throw error;
        // Supabase trả user không có identity khi email đã tồn tại (để tránh dò email).
        if (data.user && data.user.identities?.length === 0) throw new Error("already registered");
        if (data.session) onSignedIn(true);
        else go("check-email");
      } else if (view === "forgot") {
        const { error } = await sb.auth.resetPasswordForEmail(email.trim(), { redirectTo: callbackUrl("/dat-lai-mat-khau") });
        if (error) throw error;
        go("reset-sent");
      }
    } catch (err) {
      setError(viError(err instanceof Error ? err.message : String(err)));
    } finally {
      setBusy("");
    }
  }

  async function resend() {
    if (!sb) return;
    setBusy("email");
    const { error } = await sb.auth.resend({ type: "signup", email: email.trim(), options: { emailRedirectTo: callbackUrl() } });
    setBusy("");
    setError(error ? viError(error.message) : "");
    if (!error) setError("Đã gửi lại email xác nhận.");
  }

  const title = { login: "Đăng nhập", register: "Tạo tài khoản", forgot: "Quên mật khẩu", "check-email": "Kiểm tra email", "reset-sent": "Kiểm tra email" }[view];
  const subtitle = {
    login: "Tiếp tục với thiệp cưới của bạn.",
    register: "Miễn phí — chỉ cần vài thông tin cơ bản.",
    forgot: "Nhập email đã đăng ký, chúng mình sẽ gửi link đặt lại mật khẩu.",
    "check-email": `Chúng mình vừa gửi link xác nhận tới ${email}. Bấm vào link để kích hoạt tài khoản.`,
    "reset-sent": `Nếu ${email} đã đăng ký, bạn sẽ nhận được link đặt lại mật khẩu trong vài phút.`,
  }[view];

  return (
    <div className="auth-overlay" onMouseDown={(e) => e.target === e.currentTarget && onClose()}>
      <div ref={dialogRef} className="auth-dialog" role="dialog" aria-modal="true" aria-labelledby="auth-title">
        <button type="button" className="auth-close" onClick={onClose} aria-label="Đóng">
          ×
        </button>
        <div className="auth-brand">
          <BrandMark />
          <i />
        </div>
        <h2 id="auth-title">{title}</h2>
        <p className="auth-sub">{subtitle}</p>

        {providers.length > 0 && (view === "login" || view === "register") && (
          <>
            <div className="auth-social">
              {providers.includes("google") && (
                <button type="button" onClick={() => oauth("google")} disabled={Boolean(busy)}>
                  <GoogleIcon /> {busy === "google" ? "Đang mở…" : providers.length === 1 ? "Tiếp tục với Google" : "Google"}
                </button>
              )}
              {providers.includes("facebook") && (
                <button type="button" onClick={() => oauth("facebook")} disabled={Boolean(busy)}>
                  <FacebookIcon /> {busy === "facebook" ? "Đang mở…" : providers.length === 1 ? "Tiếp tục với Facebook" : "Facebook"}
                </button>
              )}
            </div>
            <div className="auth-divider">
              <span>hoặc dùng email</span>
            </div>
          </>
        )}

        {(view === "login" || view === "register" || view === "forgot") && (
          <form onSubmit={submit} noValidate>
            {view === "register" && (
              <label className="auth-field">
                <span>Họ và tên</span>
                <input value={name} onChange={(e) => setName(e.target.value)} autoComplete="name" maxLength={80} required />
              </label>
            )}
            <label className="auth-field">
              <span>Email</span>
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} autoComplete="email" inputMode="email" required />
            </label>
            {view === "register" && (
              <label className="auth-field">
                <span>Số điện thoại</span>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  autoComplete="tel"
                  inputMode="tel"
                  placeholder="0912 345 678"
                  maxLength={16}
                  required
                />
              </label>
            )}
            {view !== "forgot" && (
              <label className="auth-field">
                <span className="auth-field-row">
                  Mật khẩu
                  {view === "login" && RESET && (
                    <button type="button" className="auth-link" onClick={() => go("forgot")}>
                      Quên mật khẩu?
                    </button>
                  )}
                </span>
                <PasswordInput
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  autoComplete={view === "login" ? "current-password" : "new-password"}
                  required
                />
                {view === "register" && <small>Ít nhất {PW_MIN} ký tự.</small>}
              </label>
            )}
            {view === "login" && (
              <label className="auth-check">
                <input type="checkbox" checked={remember} onChange={(e) => setRemember(e.target.checked)} />
                Ghi nhớ thiết bị này
              </label>
            )}
            {view === "register" && (
              <label className="auth-check">
                <input type="checkbox" checked={agree} onChange={(e) => setAgree(e.target.checked)} />
                <span>
                  Tôi đồng ý với{" "}
                  <a href="/dieu-khoan" target="_blank" rel="noreferrer">
                    Điều khoản dịch vụ
                  </a>{" "}
                  và{" "}
                  <a href="/bao-mat" target="_blank" rel="noreferrer">
                    Chính sách bảo mật
                  </a>
                </span>
              </label>
            )}
            {error && (
              <p className="auth-error" role="alert">
                {error}
              </p>
            )}
            <button type="submit" className="auth-submit" disabled={Boolean(busy)}>
              {busy === "email" ? "Đang xử lý…" : view === "login" ? "Đăng nhập" : view === "register" ? "Tạo tài khoản" : "Gửi link đặt lại"}
            </button>
          </form>
        )}

        {(view === "check-email" || view === "reset-sent") && (
          <div className="auth-sent">
            <div className="auth-mail" aria-hidden="true">
              ✉
            </div>
            {error && <p className={error.startsWith("Đã gửi") ? "auth-ok" : "auth-error"}>{error}</p>}
            {view === "check-email" && (
              <button type="button" className="auth-link" onClick={resend} disabled={Boolean(busy)}>
                Chưa nhận được? Gửi lại email
              </button>
            )}
            <button type="button" className="auth-submit" onClick={() => go("login")}>
              Về đăng nhập
            </button>
          </div>
        )}

        <p className="auth-switch">
          {view === "login" && (
            <>
              Bạn chưa có tài khoản?{" "}
              <button type="button" className="auth-link" onClick={() => go("register")}>
                Tạo tài khoản
              </button>
            </>
          )}
          {view === "register" && (
            <>
              Bạn đã có tài khoản?{" "}
              <button type="button" className="auth-link" onClick={() => go("login")}>
                Đăng nhập
              </button>
            </>
          )}
          {view === "forgot" && (
            <button type="button" className="auth-link" onClick={() => go("login")}>
              ← Quay lại đăng nhập
            </button>
          )}
        </p>
      </div>
    </div>
  );
}
