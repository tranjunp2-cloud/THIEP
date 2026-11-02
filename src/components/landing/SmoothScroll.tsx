"use client";

import Lenis from "lenis";
import { useEffect, useRef } from "react";
import { gsap, ScrollTrigger } from "./gsap";

declare global {
  interface Window {
    __lenis?: Lenis;
  }
}

/** Cuộn mượt (Lenis) đồng bộ với ScrollTrigger + thanh tiến trình vàng ở đầu trang. */
export function SmoothScroll() {
  const barRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let lenis: Lenis | undefined;
    let tick: ((time: number) => void) | undefined;

    if (!reduce) {
      lenis = new Lenis({ lerp: 0.09, anchors: { offset: -72 } });
      window.__lenis = lenis;
      lenis.on("scroll", ScrollTrigger.update);
      tick = (time: number) => lenis!.raf(time * 1000);
      gsap.ticker.add(tick);
      gsap.ticker.lagSmoothing(0);
    }

    const bar = barRef.current;
    const st = ScrollTrigger.create({
      start: 0,
      end: "max",
      onUpdate: (self) => bar && gsap.set(bar, { scaleX: self.progress }),
    });

    return () => {
      st.kill();
      if (tick) gsap.ticker.remove(tick);
      lenis?.destroy();
      delete window.__lenis;
    };
  }, []);

  return <div ref={barRef} className="scroll-progress" aria-hidden="true" />;
}
