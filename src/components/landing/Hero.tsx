"use client";

import { useRef } from "react";
import { DESKTOP, gsap, MOTION_OK, onIntroDone, ScrollTrigger, SplitText, useGSAP } from "./gsap";
import { InviteCard } from "./InviteCard";
import { Magnetic } from "./Magnetic";
import { Petals } from "./Petals";

export function Hero() {
  const root = useRef<HTMLElement>(null);
  const playRef = useRef<() => void>(() => {});

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      const q = gsap.utils.selector(root);

      /** Timeline mở phong bì — dùng chung cho cả cuộn (desktop) và tự chạy (mobile). */
      const buildOpen = () =>
        gsap
          .timeline({ defaults: { ease: "power2.inOut" } })
          .to(".env-seal", { scale: 0.6, autoAlpha: 0, rotate: -25, duration: 0.18 })
          .to(".hero-hint", { autoAlpha: 0, duration: 0.1 }, 0)
          .fromTo(".env-flap", { rotateX: 0, transformPerspective: 1000 }, { rotateX: 180, duration: 0.35 }, 0.08)
          .set(".env-flap", { zIndex: 1, backgroundImage: "linear-gradient(180deg,#e7dac4,#efe4d2)" }, 0.26)
          .fromTo(".env-card", { yPercent: 0, scale: 0.58 }, { yPercent: -45, scale: 1, duration: 0.55, ease: "power3.out" }, 0.4)
          .to([".env-back", ".env-front"], { y: 60, duration: 0.55, ease: "power2.inOut" }, 0.45)
          .fromTo(".spark", { scale: 0, autoAlpha: 0 }, { scale: 1, autoAlpha: 1, stagger: 0.03, duration: 0.2, ease: "back.out(3)" }, 0.6)
          .to(".spark", { autoAlpha: 0, duration: 0.25 }, 0.9);

      mm.add(
        { all: "all", motion: MOTION_OK, desktop: DESKTOP },
        (ctx) => {
          const { motion, desktop } = ctx.conditions as { motion: boolean; desktop: boolean };

          if (!motion) {
            // Người dùng tắt chuyển động: hiện thiệp ở trạng thái đã mở.
            buildOpen().progress(1);
            playRef.current = () => {};
            return;
          }

          // Phong bì lơ lửng nhẹ khi chờ.
          const float = gsap.to(".env-float", { y: -10, rotate: -1.2, duration: 2.6, yoyo: true, repeat: -1, ease: "sine.inOut" });

          let split: SplitText | undefined;
          const cleanupIntro = onIntroDone(() => ctx.add(() => {
            split = SplitText.create(q(".hero-title"), { type: "lines,words", mask: "lines", linesClass: "split-line" });
            gsap
              .timeline({ defaults: { ease: "expo.out" } })
              .from(q(".hero-eyebrow"), { autoAlpha: 0, y: 14, duration: 0.8 })
              .from(split.words, { yPercent: 115, duration: 1.2, stagger: 0.06 }, "<0.1")
              .from(q(".hero-sub, .hero-ctas, .hero-trust li"), { autoAlpha: 0, y: 22, duration: 1, stagger: 0.1 }, "<0.45")
              .from(q(".hero-stage"), { autoAlpha: 0, y: 60, scale: 0.94, duration: 1.4 }, 0.2);
          }));

          const open = buildOpen().pause();
          let cleanupAuto = () => {};

          if (desktop) {
            const st = ScrollTrigger.create({
              trigger: root.current,
              start: "top top",
              end: "+=110%",
              pin: true,
              scrub: 0.8,
              animation: open,
              onUpdate: (self) => (self.progress > 0.02 ? float.pause() : float.play()),
            });
            gsap.to(".hero-copy", {
              yPercent: -6,
              ease: "none",
              scrollTrigger: { trigger: root.current, start: "top top", end: "+=110%", scrub: true },
            });
            playRef.current = () => window.__lenis?.scrollTo(st.end, { duration: 1.6 }) ?? window.scrollTo({ top: st.end, behavior: "smooth" });
          } else {
            open.timeScale(0.45);
            playRef.current = () => {
              float.pause();
              open.play();
            };
            // Mobile: tự mở phong bì khi khách cuộn tới.
            cleanupAuto = onIntroDone(() =>
              ctx.add(() => {
                ScrollTrigger.create({
                  trigger: q(".env")[0],
                  start: "top 75%",
                  once: true,
                  onEnter: () => gsap.delayedCall(0.3, () => playRef.current()),
                });
              }),
            );
          }

          return () => {
            cleanupIntro();
            cleanupAuto();
            split?.revert();
          };
        },
      );
    },
    { scope: root },
  );

  return (
    <section ref={root} id="top" className="hero">
      <Petals className="hero-petals" />
      <div className="hero-glow" aria-hidden="true" />
      <div className="hero-grid container">
        <div className="hero-copy">
          <p className="eyebrow hero-eyebrow">
            <span className="eyebrow-dot" /> Thiệp cưới online · Đậm chất Việt
          </p>
          <h1 className="hero-title">
            Trao lời mời cưới đẹp như <em>một lời hẹn ước</em>
          </h1>
          <p className="hero-sub">
            Tạo thiệp cưới online trong 15 phút. Gửi đường link mang tên từng vị khách qua Zalo, Messenger — kèm xác nhận
            tham dự, sổ lời chúc và QR mừng cưới.
          </p>
          <div className="hero-ctas">
            <Magnetic>
              <a href="#bat-dau" className="btn btn--dark">
                Tạo thiệp miễn phí
                <svg viewBox="0 0 20 20" aria-hidden="true"><path d="M4 10h11m-4-4 4 4-4 4" /></svg>
              </a>
            </Magnetic>
            {/* Tải lại toàn trang để CSS của landing và của thiệp không chồng lên nhau. */}
            {/* eslint-disable-next-line @next/next/no-html-link-for-pages */}
            <a href="/thiep/quan-mai?k=co-lan" className="btn btn--ghost">Xem thiệp demo</a>
          </div>
          <ul className="hero-trust">
            <li>Không cần tải ứng dụng</li>
            <li>Sửa thiệp không giới hạn</li>
            <li>Ngày âm lịch tự động</li>
          </ul>
        </div>

        <div className="hero-stage">
          <div className="env-float">
            <div className="env">
              <div className="env-back" />
              <div className="env-card">
                <InviteCard theme="nga" />
              </div>
              <div className="env-front" />
              <div className="env-flap" />
              <button type="button" className="env-seal" onClick={() => playRef.current()} aria-label="Mở thiệp mẫu">
                <span>Q<i>&amp;</i>M</span>
              </button>
              {Array.from({ length: 8 }).map((_, i) => (
                <span key={i} className="spark" style={{ "--a": `${i * 45}deg` } as React.CSSProperties} aria-hidden="true" />
              ))}
            </div>
          </div>
          <p className="hero-hint">
            <span className="hero-hint-line" /> Cuộn để mở thiệp
          </p>
        </div>
      </div>
    </section>
  );
}
