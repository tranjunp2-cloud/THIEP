"use client";

import { useRef } from "react";
import { marqueeWords } from "./content";
import { gsap, MOTION_OK, ScrollTrigger, useGSAP } from "./gsap";

/** Dải chữ chạy vô tận; tăng tốc và đổi chiều theo hướng cuộn. */
export function Marquee() {
  const root = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MOTION_OK, () => {
        const loop = gsap.to(".marquee-track", { xPercent: -50, duration: 38, ease: "none", repeat: -1 });
        let dir = 1;
        ScrollTrigger.create({
          trigger: root.current,
          start: "top bottom",
          end: "bottom top",
          onUpdate: (self) => {
            const v = self.getVelocity();
            if (Math.abs(v) < 30) return;
            dir = v > 0 ? 1 : -1;
            gsap.to(loop, { timeScale: dir * Math.min(1 + Math.abs(v) / 400, 6), duration: 0.2, overwrite: true });
            gsap.to(loop, { timeScale: dir, duration: 1.2, delay: 0.25, ease: "power2.out" });
          },
        });
        gsap.to(".marquee", {
          rotate: -2.2,
          ease: "none",
          scrollTrigger: { trigger: root.current, start: "top bottom", end: "bottom top", scrub: true },
        });
      });
    },
    { scope: root },
  );

  const row = [...marqueeWords, ...marqueeWords];
  return (
    <div ref={root} className="marquee-wrap" aria-hidden="true">
      <div className="marquee">
        <div className="marquee-track">
          {[0, 1].map((k) => (
            <div className="marquee-group" key={k}>
              {row.map((w, i) => (
                <span key={i} className="marquee-item">
                  {i % 2 ? <em>{w}</em> : w}
                  <svg viewBox="0 0 20 20" className="marquee-star"><path d="M10 0 12 8 20 10 12 12 10 20 8 12 0 10 8 8Z" /></svg>
                </span>
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
