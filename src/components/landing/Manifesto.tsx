"use client";

import { useRef } from "react";
import { manifesto } from "./content";
import { gsap, MOTION_OK, SplitText, useGSAP } from "./gsap";
import { Sprig } from "./InviteCard";

/** Đoạn tuyên ngôn: từng chữ sáng dần theo nhịp cuộn. */
export function Manifesto() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MOTION_OK, () => {
        const split = SplitText.create(".manifesto-text", { type: "words", wordsClass: "mf-word" });
        gsap.fromTo(
          split.words,
          { opacity: 0.14 },
          {
            opacity: 1,
            stagger: 0.08,
            ease: "none",
            scrollTrigger: { trigger: ".manifesto-text", start: "top 78%", end: "bottom 45%", scrub: true },
          },
        );
        gsap.from(".manifesto-sprig path", {
          scale: 0,
          transformOrigin: "50% 50%",
          stagger: 0.06,
          ease: "back.out(2)",
          scrollTrigger: { trigger: root.current, start: "top 75%" },
        });
        return () => split.revert();
      });
    },
    { scope: root },
  );

  return (
    <section ref={root} className="manifesto container">
      <Sprig className="manifesto-sprig" color="#6f8b67" />
      <p className="eyebrow">Vì sao là SayIDo</p>
      <p className="manifesto-text">{manifesto}</p>
    </section>
  );
}
