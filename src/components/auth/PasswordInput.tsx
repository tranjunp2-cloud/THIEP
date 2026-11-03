"use client";

import { useState } from "react";
import "./auth.css";

/** Độ dài mật khẩu tối thiểu — khớp với cài đặt mặc định của Supabase (6). */
export const PW_MIN = 6;

const Eye = ({ open }: { open: boolean }) => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" aria-hidden="true">
    <path d="M2 12s3.6-7 10-7 10 7 10 7-3.6 7-10 7S2 12 2 12z" />
    <circle cx="12" cy="12" r="3" />
    {!open && <path d="M4 4l16 16" />}
  </svg>
);

/** Ô mật khẩu có nút con mắt để hiện / ẩn. */
export function PasswordInput(props: Omit<React.InputHTMLAttributes<HTMLInputElement>, "type">) {
  const [show, setShow] = useState(false);
  return (
    <span className="auth-pw">
      <input {...props} type={show ? "text" : "password"} />
      <button type="button" onClick={() => setShow((v) => !v)} aria-label={show ? "Ẩn mật khẩu" : "Hiện mật khẩu"} aria-pressed={show}>
        <Eye open={show} />
      </button>
    </span>
  );
}
