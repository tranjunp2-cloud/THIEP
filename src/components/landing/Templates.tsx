"use client";

import { useRef } from "react";
import { templates } from "./content";
import { DESKTOP, gsap, MOTION_OK, useGSAP } from "./gsap";
import { InviteCard } from "./InviteCard";

export function Templates() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    (_, contextSafe) => {
      const mm = gsap.matchMedia();

      mm.add(MOTION_OK, () => {
        gsap.from(".tpl-head > *", {
          autoAlpha: 0,
          y: 40,
          stagger: 0.1,
          duration: 1,
          ease: "expo.out",
          scrollTrigger: { trigger: root.current, start: "top 75%" },
        });
      });

      // Desktop: ghim section, kéo dải thiệp sang ngang theo nhịp cuộn.
      mm.add(`${DESKTOP} and ${MOTION_OK}`, () => {
        const track = root.current!.querySelector<HTMLElement>(".tpl-track")!;
        const bar = root.current!.querySelector<HTMLElement>(".tpl-progress-bar");
        const distance = () => track.scrollWidth - window.innerWidth + 80;
        const tween = gsap.to(track, {
          x: () => -distance(),
          ease: "none",
          scrollTrigger: {
            trigger: ".tpl-pin",
            start: "top top",
            end: () => `+=${distance()}`,
            pin: true,
            scrub: 0.6,
            invalidateOnRefresh: true,
            onUpdate: (self) => bar && gsap.set(bar, { scaleX: self.progress }),
          },
        });

        // Mỗi thiệp nghiêng và dâng lên khi đi vào giữa màn hình.
        gsap.utils.toArray<HTMLElement>(".tpl-item").forEach((item) => {
          const inner = item.querySelector(".tpl-card-inner");
          if (!inner) return;
          gsap.fromTo(
            inner,
            { rotateY: -18, y: 40 },
            {
              rotateY: 0,
              y: 0,
              ease: "none",
              scrollTrigger: { trigger: item, containerAnimation: tween, start: "left right", end: "center 60%", scrub: true },
            },
          );
        });
      });

      // Nghiêng 3D theo con trỏ.
      if (window.matchMedia("(hover: hover) and (pointer: fine)").matches) {
        const cards = gsap.utils.toArray<HTMLElement>(".tpl-card");
        const handlers = cards.map((card) => {
          const inner = card.querySelector<HTMLElement>(".tpl-tilt")!;
          const rx = gsap.quickTo(inner, "rotateX", { duration: 0.5, ease: "power3.out" });
          const ry = gsap.quickTo(inner, "rotateY", { duration: 0.5, ease: "power3.out" });
          const move = contextSafe!((e: PointerEvent) => {
            const r = card.getBoundingClientRect();
            const px = (e.clientX - r.left) / r.width;
            const py = (e.clientY - r.top) / r.height;
            ry((px - 0.5) * 16);
            rx((0.5 - py) * 12);
            card.style.setProperty("--sx", `${px * 100}%`);
            card.style.setProperty("--sy", `${py * 100}%`);
          });
          const leave = contextSafe!(() => {
            rx(0);
            ry(0);
          });
          card.addEventListener("pointermove", move);
          card.addEventListener("pointerleave", leave);
          return () => {
            card.removeEventListener("pointermove", move);
            card.removeEventListener("pointerleave", leave);
          };
        });
        return () => handlers.forEach((off) => off());
      }
    },
    { scope: root },
  );

  return (
    <section ref={root} id="mau-thiep" className="templates">
      <div className="tpl-pin">
        <div className="tpl-head container">
          <p className="eyebrow">Kho mẫu thiệp</p>
          <h2 className="h2">
            Mỗi mẫu là một <em>câu chuyện</em>
          </h2>
          <p className="lead">Vẽ tay bởi nhà thiết kế Việt. Đổi màu, đổi chữ, đổi ảnh — vẫn giữ trọn vẻ sang trọng.</p>
          <div className="tpl-progress" aria-hidden="true">
            <span className="tpl-progress-bar" />
          </div>
        </div>
        <div className="tpl-viewport">
          <ul className="tpl-track">
            {templates.map((t, i) => (
              <li key={t.id} className="tpl-item">
                <div className="tpl-card-inner">
                  <a href={t.id === "nga" ? "/thiep/quan-mai" : "#bat-dau"} className="tpl-card" aria-label={t.id === "nga" ? `Xem thiệp demo mẫu ${t.name}` : `Dùng mẫu ${t.name}`}>
                    <div className="tpl-tilt">
                      <InviteCard theme={t.id} />
                      <span className="tpl-shine" aria-hidden="true" />
                    </div>
                    {t.badge && <span className="tpl-badge">{t.badge}</span>}
                  </a>
                  <div className="tpl-meta">
                    <span className="tpl-no">{String(i + 1).padStart(2, "0")}</span>
                    <div>
                      <h3>{t.name}</h3>
                      <p>{t.mood}</p>
                    </div>
                    <span className="tpl-cta">Dùng mẫu →</span>
                  </div>
                </div>
              </li>
            ))}
            <li className="tpl-item tpl-item--more">
              <a href="#bat-dau" className="tpl-more">
                <span className="tpl-more-num">+</span>
                <span>Nhiều mẫu mới đang được vẽ</span>
                <span className="tpl-cta">Xem toàn bộ kho →</span>
              </a>
            </li>
          </ul>
        </div>
      </div>
    </section>
  );
}
