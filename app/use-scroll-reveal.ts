"use client";

import { useEffect, type RefObject } from "react";

type MotionKind = "rise" | "image" | "line" | "icon" | "slide";

// Animate individual content blocks, rather than hiding an entire long section.
const groups: [string, string, MotionKind, number][] = [
  [".countdown", ":scope > p, :scope > h2, .count-grid > div", "rise", 85],
  [".invitation", ":scope > p, :scope > h2", "rise", 100],
  [".venue-frame", ":scope > p, :scope > h2, :scope > h3, .venue-times > p, .venue-links", "rise", 75],
  [".dress", ":scope > p, :scope > h2, :scope > h3", "rise", 80],
  [".palette", ":scope > span", "icon", 75],
  [".timeline", ":scope > h2, :scope > p", "rise", 90],
  [".timeline li", ".timeline-icon", "icon", 0],
  [".timeline li", ".timeline-copy", "slide", 0],
  [".recovery > div", ":scope > p, :scope > h2, :scope > h3, .recovery-date, .venue-links", "rise", 85],
  [".gift-frame", ":scope > h2, :scope > p, :scope > span", "rise", 120],
  [".gift-frame", ":scope > svg", "icon", 0],
  [".faq", ":scope > p, :scope > h2", "rise", 90],
  [".faq-list", ":scope > [data-slot=accordion-item]", "rise", 60],
  [".rsvp", ":scope > h2, :scope > p, :scope > form", "rise", 110],
  [".rsvp", ":scope > svg", "icon", 0],
  ["footer", ":scope > p, :scope > h2, :scope > a", "rise", 100],
  ["main", ".recovery-art, .guests-art, .rsvp-envelope, .rsvp-topiary, .candle-border, .invitation-garland, .dress-garland, footer img", "image", 0],
  ["main", ".fine-rule", "line", 0],
];

const entrances: Record<MotionKind, Keyframe[]> = {
  rise: [{ opacity: 0, transform: "translateY(28px)" }, { opacity: 1, transform: "translateY(0)" }],
  image: [{ opacity: 0, transform: "translateY(30px) scale(.94)" }, { opacity: 1, transform: "translateY(0) scale(1)" }],
  line: [{ opacity: 0, transform: "scaleX(0)" }, { opacity: 1, transform: "scaleX(1)" }],
  icon: [{ opacity: 0, transform: "translateY(12px) scale(.8)" }, { opacity: 1, transform: "translateY(0) scale(1)" }],
  slide: [{ opacity: 0, transform: "translateX(24px)" }, { opacity: 1, transform: "translateX(0)" }],
};

export function useScrollReveal(rootRef: RefObject<HTMLElement | null>) {
  useEffect(() => {
    const root = rootRef.current;
    if (!root || !window.IntersectionObserver || !Element.prototype.animate) return;
    const preference = window.matchMedia("(prefers-reduced-motion: reduce)");
    const targets = new Map<HTMLElement, { kind: MotionKind; delay: number }>();
    const active = new Map<HTMLElement, Animation>();
    let observer: IntersectionObserver | undefined;

    for (const [scope, selector, kind, stagger] of groups) {
      const scopes = scope === "main" ? [root] : root.querySelectorAll<HTMLElement>(scope);
      for (const group of scopes) {
        group.querySelectorAll<HTMLElement>(selector).forEach((element, index) => {
          targets.set(element, { kind, delay: Math.min(index * stagger, 240) });
        });
      }
    }

    function show(element: HTMLElement, animate = true) {
      if (element.dataset.scrollReveal !== "pending") return;
      element.dataset.scrollReveal = "shown";
      observer?.unobserve(element);
      if (!animate || preference.matches) return;
      const { kind, delay } = targets.get(element)!;
      const animation = element.animate(entrances[kind], {
        duration: kind === "image" ? 1150 : kind === "line" ? 950 : 800,
        delay, easing: "cubic-bezier(.22, 1, .36, 1)", fill: "backwards",
      });
      active.set(element, animation);
      animation.onfinish = () => active.delete(element);
    }

    function stop() {
      observer?.disconnect();
      active.forEach(animation => animation.cancel());
      active.clear();
      targets.forEach((_, element) => delete element.dataset.scrollReveal);
    }

    function start() {
      stop();
      if (preference.matches) return;
      observer = new IntersectionObserver(entries => {
        entries.forEach(entry => { if (entry.isIntersecting) show(entry.target as HTMLElement); });
      }, { threshold: 0, rootMargin: "0px 0px -7% 0px" });
      targets.forEach((_, element) => {
        // Hash navigation / restored scroll positions must keep previous content readable.
        if (element.getBoundingClientRect().bottom <= 0) return;
        element.dataset.scrollReveal = "pending";
        observer!.observe(element);
      });
    }

    // Tabbing directly to an offscreen control must reveal it immediately.
    function onFocus(event: FocusEvent) {
      if (!(event.target instanceof Element)) return;
      const pending = event.target.closest<HTMLElement>('[data-scroll-reveal="pending"]');
      if (pending) show(pending, false);
      active.forEach((animation, element) => {
        if (element.contains(event.target as Node)) { animation.cancel(); active.delete(element); }
      });
    }

    start();
    preference.addEventListener("change", start);
    root.addEventListener("focusin", onFocus);
    return () => {
      stop();
      preference.removeEventListener("change", start);
      root.removeEventListener("focusin", onFocus);
    };
  }, [rootRef]);
}
