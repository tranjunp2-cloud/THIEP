"use client";

import { useState } from "react";
import { BrandMark } from "../site/BrandMark";
import { AccountMenu } from "../auth/AccountMenu";

export function AppTop({ children }: { children?: React.ReactNode }) {
  return (
    <header className="app-top">
      <a href="/" className="app-logo" aria-label="SayIDo — trang chủ">
        <b>
          <BrandMark />
        </b>
        <i />
      </a>
      <div className="app-top-actions">
        {children}
        <AccountMenu />
      </div>
    </header>
  );
}

export function CopyButton({ text, label = "Chép link", className = "btn btn-ghost btn-sm" }: { text: string; label?: string; className?: string }) {
  const [done, setDone] = useState(false);
  return (
    <button
      type="button"
      className={className}
      onClick={async () => {
        try {
          await navigator.clipboard.writeText(text);
          setDone(true);
          setTimeout(() => setDone(false), 1600);
        } catch {}
      }}
    >
      {done ? "Đã chép ✓" : label}
    </button>
  );
}

export function LinkRow({ url, label }: { url: string; label?: string }) {
  return (
    <div className="link-row">
      <code title={url}>{url}</code>
      <CopyButton text={url} label={label} />
    </div>
  );
}
