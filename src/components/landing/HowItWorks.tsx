"use client";

import { useRef, useState } from "react";
import { guestNames, sampleCouple, steps, templates } from "./content";
import { gsap, MOTION_OK, ScrollTrigger, useGSAP } from "./gsap";
import { InviteCard } from "./InviteCard";

function ScreenPick() {
  return (
    <div className="scr scr-pick">
      <p className="scr-title">Chọn mẫu thiệp</p>
      <div className="scr-pick-grid">
        {templates.slice(0, 4).map((t, i) => (
          <div key={t.id} className={`scr-pick-item ${i === 0 ? "is-chosen" : ""}`}>
            <InviteCard theme={t.id} className="invite--mini" />
            <span>{t.name}</span>
          </div>
        ))}
      </div>
      <span className="scr-btn">Dùng mẫu Ngà Botanical</span>
    </div>
  );
}

function ScreenEdit() {
  return (
    <div className="scr scr-edit">
      <p className="scr-title">Thông tin lễ cưới</p>
      <label className="scr-field">
        <span>Chú rể</span>
        <b className="type type-1">{sampleCouple.groom}</b>
      </label>
      <label className="scr-field">
        <span>Cô dâu</span>
        <b className="type type-2">{sampleCouple.bride}</b>
      </label>
      <label className="scr-field">
        <span>Ngày cưới</span>
        <b className="type type-3">20/12/2026 · 10:00</b>
      </label>
      <p className="scr-note">✦ Ngày âm lịch được tính tự động</p>
      <p className="scr-sub">Ảnh cưới</p>
      <div className="scr-photos">
        {[0, 1, 2, 3, 4, 5].map((i) => (
          <span key={i} className="scr-photo" style={{ "--d": `${1.6 + i * 0.18}s` } as React.CSSProperties} />
        ))}
      </div>
    </div>
  );
}

function ScreenShare() {
  const status = ["Đã xác nhận", "Đã mở thiệp", "Đã gửi", "Đã mở thiệp", "Đã gửi"];
  return (
    <div className="scr scr-share">
      <p className="scr-title">Danh sách khách mời</p>
      <ul>
        {guestNames.map((n, i) => (
          <li key={n} style={{ "--d": `${0.25 + i * 0.22}s` } as React.CSSProperties}>
            <span className="scr-avatar">{n.split(" ").slice(-1)[0][0]}</span>
            <span className="scr-guest">{n}</span>
            <span className={`scr-chip scr-chip--${i % 3}`}>{status[i]}</span>
          </li>
        ))}
      </ul>
      <span className="scr-btn">Sao chép link riêng</span>
    </div>
  );
}

const screens = [ScreenPick, ScreenEdit, ScreenShare];

function Phone({ active, only }: { active: number; only?: number }) {
  return (
    <div className="phone">
      <span className="phone-notch" />
      <div className="phone-screen">
        {screens.map((S, i) =>
          only === undefined || only === i ? (
            <div key={i} className={`phone-layer ${active === i ? "is-active" : ""}`}>
              <S />
            </div>
          ) : null,
        )}
      </div>
    </div>
  );
}

export function HowItWorks() {
  const root = useRef<HTMLElement>(null);
  const [active, setActive] = useState(0);

  useGSAP(
    () => {
      gsap.utils.toArray<HTMLElement>(".step").forEach((el, i) => {
        ScrollTrigger.create({
          trigger: el,
          start: "top 55%",
          end: "bottom 55%",
          onToggle: (self) => self.isActive && setActive(i),
        });
      });
      const mm = gsap.matchMedia();
      mm.add(MOTION_OK, () => {
        gsap.utils.toArray<HTMLElement>(".step").forEach((el) => {
          gsap.from(el.querySelectorAll(":scope > .step-no, :scope > h3, :scope > p"), {
            autoAlpha: 0,
            y: 30,
            stagger: 0.08,
            duration: 0.9,
            ease: "expo.out",
            scrollTrigger: { trigger: el, start: "top 75%" },
          });
        });
        gsap.from(".how-head > *", {
          autoAlpha: 0,
          y: 30,
          stagger: 0.1,
          duration: 1,
          ease: "expo.out",
          scrollTrigger: { trigger: ".how-head", start: "top 80%" },
        });
      });
    },
    { scope: root },
  );

  return (
    <section ref={root} id="cach-lam" className="how container">
      <div className="how-head">
        <p className="eyebrow">Ba bước, mười lăm phút</p>
        <h2 className="h2">
          Từ ý tưởng đến <em>lời mời</em> trong tay khách
        </h2>
      </div>
      <div className="how-grid">
        <div className="how-sticky">
          <Phone active={active} />
          <ol className="how-dots" aria-hidden="true">
            {steps.map((s, i) => (
              <li key={s.no} className={active === i ? "is-active" : ""} />
            ))}
          </ol>
        </div>
        <div className="how-steps">
          {steps.map((s, i) => (
            <article key={s.no} className={`step ${active === i ? "is-active" : ""}`}>
              <span className="step-no">{s.no}</span>
              <h3>{s.title}</h3>
              <p>{s.body}</p>
              <div className="step-phone">
                <Phone active={active} only={i} />
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
