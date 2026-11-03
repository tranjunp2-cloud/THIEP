"use client";

import { useEffect, useState } from "react";
import { brand, navLinks } from "./content";
import { Magnetic } from "./Magnetic";
import { BrandMark } from "../site/BrandMark";
import { AccountMenu } from "../auth/AccountMenu";

export function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    let last = window.scrollY;
    const onScroll = () => {
      const y = window.scrollY;
      setScrolled(y > 40);
      setHidden(y > 400 && y > last + 2);
      if (y < last - 2) setHidden(false);
      last = y;
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (open) window.__lenis?.stop();
    else window.__lenis?.start();
  }, [open]);

  return (
    <header className={`nav ${scrolled ? "is-scrolled" : ""} ${hidden && !open ? "is-hidden" : ""} ${open ? "is-open" : ""}`}>
      <div className="nav-inner">
        <a href="#top" className="logo" aria-label={`${brand.name} — về đầu trang`}>
          <span className="logo-script">
            <BrandMark />
          </span>
          <span className="logo-dot" />
        </a>
        <nav aria-label="Điều hướng chính" className="nav-links">
          {navLinks.map((l) => (
            <a key={l.href} href={l.href} className="nav-link">
              <span>{l.label}</span>
            </a>
          ))}
        </nav>
        <div className="nav-actions">
          <span className="nav-acct">
            <AccountMenu fallback={<a href="/quan-ly" className="nav-login">Thiệp của tôi</a>} />
          </span>
          <Magnetic>
            <a href="/tao-thiep" data-require-auth className="btn btn--dark btn--sm">Tạo thiệp miễn phí</a>
          </Magnetic>
          <button
            type="button"
            className="nav-burger"
            aria-expanded={open}
            aria-controls="mobile-menu"
            aria-label={open ? "Đóng menu" : "Mở menu"}
            onClick={() => setOpen((v) => !v)}
          >
            <span />
            <span />
          </button>
        </div>
      </div>
      <div id="mobile-menu" className="mobile-menu" hidden={!open}>
        {navLinks.map((l, i) => (
          <a key={l.href} href={l.href} onClick={() => setOpen(false)} style={{ "--i": i } as React.CSSProperties}>
            {l.label}
          </a>
        ))}
        <a href="/quan-ly" style={{ "--i": navLinks.length } as React.CSSProperties}>
          Thiệp của tôi
        </a>
        <a href="/tao-thiep" data-require-auth className="btn btn--dark" onClick={() => setOpen(false)}>
          Tạo thiệp miễn phí
        </a>
      </div>
    </header>
  );
}
