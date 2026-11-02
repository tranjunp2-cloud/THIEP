"use client";

import { useRef, useState } from "react";
import { brand, faqs, navLinks, pricing } from "./content";
import { gsap, MOTION_OK, SplitText, useGSAP } from "./gsap";
import { Magnetic } from "./Magnetic";
import { Petals } from "./Petals";

export function Pricing() {
  const root = useRef<HTMLElement>(null);
  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MOTION_OK, () => {
        gsap.from(".price-head > *", {
          autoAlpha: 0, y: 30, stagger: 0.1, duration: 1, ease: "expo.out",
          scrollTrigger: { trigger: ".price-head", start: "top 80%" },
        });
        gsap.from(".price-card", {
          autoAlpha: 0, y: 80, rotateX: -12, transformOrigin: "50% 100%", stagger: 0.12, duration: 1.2, ease: "expo.out",
          scrollTrigger: { trigger: ".price-grid", start: "top 80%" },
        });
      });
    },
    { scope: root },
  );

  return (
    <section ref={root} id="bang-gia" className="price container">
      <div className="price-head">
        <p className="eyebrow">Bảng giá</p>
        <h2 className="h2">
          Một lần trả, <em>trọn vẹn</em> ngày vui
        </h2>
        <p className="lead">Không thu phí theo số khách. Không gia hạn tự động.</p>
      </div>
      <div className="price-grid">
        {pricing.map((p) => (
          <article key={p.name} className={`price-card ${p.highlight ? "is-hl" : ""}`}>
            {p.highlight && <span className="price-ribbon">Được chọn nhiều nhất</span>}
            <h3>{p.name}</h3>
            <p className="price-num">{p.price}</p>
            <p className="price-note">{p.note}</p>
            <ul>
              {p.features.map((f) => (
                <li key={f}>{f}</li>
              ))}
            </ul>
            <a href="#bat-dau" className={`btn ${p.highlight ? "btn--gold" : "btn--ghost"}`}>{p.cta}</a>
          </article>
        ))}
      </div>
    </section>
  );
}

export function Faq() {
  const [open, setOpen] = useState<number | null>(0);
  return (
    <section id="hoi-dap" className="faq container">
      <div className="faq-head">
        <p className="eyebrow">Hỏi đáp</p>
        <h2 className="h2">
          Bạn đang <em>băn khoăn</em>?
        </h2>
        <p className="lead">Chưa thấy câu hỏi của mình? Nhắn cho chúng mình qua Zalo, trả lời trong vài phút.</p>
      </div>
      <div className="faq-list">
        {faqs.map((f, i) => {
          const isOpen = open === i;
          return (
            <div key={f.q} className={`faq-item ${isOpen ? "is-open" : ""}`}>
              <h3>
                <button
                  type="button"
                  aria-expanded={isOpen}
                  aria-controls={`faq-${i}`}
                  id={`faq-q-${i}`}
                  onClick={() => setOpen(isOpen ? null : i)}
                >
                  <span>{f.q}</span>
                  <span className="faq-icon" aria-hidden="true" />
                </button>
              </h3>
              <div id={`faq-${i}`} role="region" aria-labelledby={`faq-q-${i}`} className="faq-a">
                <div>
                  <p>{f.a}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}

export function FinalCta() {
  const root = useRef<HTMLElement>(null);
  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MOTION_OK, () => {
        const split = SplitText.create(".cta-script", { type: "words" });
        gsap
          .timeline({ scrollTrigger: { trigger: root.current, start: "top 65%" } })
          .from(split.words, { autoAlpha: 0, y: 50, rotate: 4, filter: "blur(8px)", stagger: 0.12, duration: 1.3, ease: "expo.out" })
          .from(".cta-sub, .cta-actions", { autoAlpha: 0, y: 24, stagger: 0.12, duration: 0.9, ease: "expo.out" }, "-=0.7");
        gsap.fromTo(
          ".cta-ring",
          { scale: 0.6, rotate: -30 },
          { scale: 1.15, rotate: 30, ease: "none", scrollTrigger: { trigger: root.current, start: "top bottom", end: "bottom top", scrub: true } },
        );
        return () => split.revert();
      });
    },
    { scope: root },
  );

  return (
    <section ref={root} id="bat-dau" className="cta">
      <Petals count={22} className="cta-petals" />
      <span className="cta-ring" aria-hidden="true" />
      <div className="cta-inner container">
        <p className="eyebrow eyebrow--light">Bắt đầu hôm nay</p>
        <p className="cta-script">Hẹn gặp nhau trong ngày vui</p>
        <p className="cta-sub">Tạo bản nháp miễn phí, chỉ trả phí khi bạn đã thật sự ưng ý.</p>
        <div className="cta-actions">
          <Magnetic>
            <a href="#" className="btn btn--gold btn--lg">Tạo thiệp miễn phí</a>
          </Magnetic>
          <a href="#mau-thiep" className="btn btn--line">Xem lại kho mẫu</a>
        </div>
      </div>
    </section>
  );
}

export function Footer() {
  return (
    <footer className="footer">
      <div className="container footer-grid">
        <div>
          <a href="#top" className="logo logo--light">
            <span className="logo-script">{brand.name}</span>
            <span className="logo-dot" />
          </a>
          <p className="footer-tag">Thiệp cưới online, trao bằng cả trái tim.</p>
        </div>
        <nav aria-label="Liên kết cuối trang" className="footer-links">
          {navLinks.map((l) => (
            <a key={l.href} href={l.href}>{l.label}</a>
          ))}
        </nav>
        <div className="footer-contact">
          <p>Hỗ trợ qua Zalo & email</p>
          <a href="mailto:hello@example.com">hello@example.com</a>
        </div>
      </div>
      <p className="footer-bottom container">
        © 2026 {brand.name}. Bản dựng thử nghiệm — nội dung và giá mang tính minh họa.
      </p>
    </footer>
  );
}
