"use client";

import { useRef } from "react";
import { gsap, markIntroDone, useGSAP } from "./gsap";
import { brand } from "./content";

/** Màn mở đầu: chữ "Duyên" hiện ra như được viết, đường chỉ vàng, rồi hai tấm màn kéo lên. */
export function Intro() {
  const root = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const el = root.current!;
      const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      let seen = false;
      try {
        seen = sessionStorage.getItem("duyen:intro") === "1";
        sessionStorage.setItem("duyen:intro", "1");
      } catch {}

      const finish = () => {
        document.documentElement.classList.remove("is-intro");
        window.__lenis?.start();
        el.style.display = "none";
        markIntroDone();
      };

      if (reduce || seen) {
        finish();
        return;
      }

      document.documentElement.classList.add("is-intro");
      window.__lenis?.stop();

      gsap
        .timeline({ defaults: { ease: "power3.inOut" }, onComplete: finish })
        .fromTo(".intro-word", { clipPath: "inset(0 100% 0 0)" }, { clipPath: "inset(0 0% 0 0)", duration: 1.1 })
        .fromTo(".intro-line", { scaleX: 0 }, { scaleX: 1, duration: 0.7 }, "-=0.55")
        .fromTo(".intro-sub", { autoAlpha: 0, y: 8 }, { autoAlpha: 1, y: 0, duration: 0.5 }, "-=0.35")
        .to(".intro-inner", { autoAlpha: 0, y: -20, duration: 0.45, ease: "power2.in" }, "+=0.25")
        .to(".intro-panel", { yPercent: -100, duration: 0.9, stagger: { each: 0.12, from: "end" }, ease: "expo.inOut" }, "-=0.1");
    },
    { scope: root },
  );

  return (
    <div ref={root} className="intro" aria-hidden="true">
      <noscript>
        <style>{`.intro{display:none}`}</style>
      </noscript>
      <div className="intro-panel intro-panel--gold" />
      <div className="intro-panel">
        <div className="intro-inner">
          <span className="intro-word">{brand.name}</span>
          <span className="intro-line" />
          <span className="intro-sub">{brand.tagline}</span>
        </div>
      </div>
    </div>
  );
}
