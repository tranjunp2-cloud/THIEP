"use client";

import { useEffect, useRef, useState } from "react";
import { displayName, useAuth } from "./AuthProvider";

/** Nút “Đăng nhập” khi chưa đăng nhập; avatar + menu khi đã đăng nhập. */
export function AccountMenu({ loginLabel = "Đăng nhập", fallback }: { loginLabel?: string; fallback?: React.ReactNode }) {
  const { enabled, user, loading, openAuth, signOut } = useAuth();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const close = (e: MouseEvent) => !ref.current?.contains(e.target as Node) && setOpen(false);
    const esc = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("mousedown", close);
    document.addEventListener("keydown", esc);
    return () => {
      document.removeEventListener("mousedown", close);
      document.removeEventListener("keydown", esc);
    };
  }, [open]);

  if (!enabled) return <>{fallback}</>;
  if (loading) return <span className="acct-avatar" aria-hidden="true" style={{ opacity: 0.25 }} />;
  if (!user) {
    return (
      <button type="button" className="acct-login" onClick={() => openAuth("login")}>
        {loginLabel}
      </button>
    );
  }

  const name = displayName(user);
  const avatar = user.user_metadata?.avatar_url as string | undefined;
  return (
    <div className="acct" ref={ref}>
      <button type="button" className="acct-btn" aria-haspopup="menu" aria-expanded={open} onClick={() => setOpen((v) => !v)}>
        <span className="acct-avatar">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          {avatar ? <img src={avatar} alt="" referrerPolicy="no-referrer" /> : name.charAt(0).toUpperCase()}
        </span>
        <span className="acct-name">{name}</span>
      </button>
      {open && (
        <div className="acct-menu" role="menu">
          <p>{user.email}</p>
          <a href="/quan-ly" role="menuitem">
            Thiệp của tôi
          </a>
          <a href="/tao-thiep" role="menuitem">
            Tạo thiệp mới
          </a>
          <button
            type="button"
            role="menuitem"
            onClick={async () => {
              setOpen(false);
              await signOut();
              if (window.location.pathname.startsWith("/quan-ly")) window.location.assign("/");
            }}
          >
            Đăng xuất
          </button>
        </div>
      )}
    </div>
  );
}
