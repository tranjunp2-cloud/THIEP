"use client";

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import { TextPlugin } from "gsap/TextPlugin";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger, SplitText, TextPlugin, useGSAP);

export const MOTION_OK = "(prefers-reduced-motion: no-preference)";
export const DESKTOP = "(min-width: 900px)";

/** Lời giới thiệu (intro) xong thì mới chạy hiệu ứng hero. */
export function onIntroDone(cb: () => void) {
  if (typeof window === "undefined") return () => {};
  const w = window as Window & { __introDone?: boolean };
  if (w.__introDone) {
    requestAnimationFrame(cb);
    return () => {};
  }
  window.addEventListener("intro:done", cb, { once: true });
  return () => window.removeEventListener("intro:done", cb);
}

export function markIntroDone() {
  (window as Window & { __introDone?: boolean }).__introDone = true;
  // Tách khỏi context GSAP của Intro để selector của các section khác không bị giới hạn phạm vi.
  requestAnimationFrame(() => window.dispatchEvent(new Event("intro:done")));
}

export { gsap, ScrollTrigger, SplitText, useGSAP };
