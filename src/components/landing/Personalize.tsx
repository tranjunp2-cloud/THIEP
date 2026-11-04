"use client";

import { useRef } from "react";
import { brand, guestNames, sampleCouple } from "./content";
import { gsap, MOTION_OK, useGSAP } from "./gsap";
import { Sprig } from "./InviteCard";

const points = [
  { t: "Xưng hô đúng vai vế", d: "Cô, chú, anh, chị, bạn — mỗi người được mời bằng đúng cách bạn vẫn gọi." },
  { t: "Ảnh xem trước có tên khách", d: "Khi gửi qua Zalo hay Messenger, khung xem trước hiện ngay tên người nhận." },
  { t: "Bìa thiệp gọi tên từng người", d: "Mở thiệp ra là thấy “Trân trọng kính mời” kèm đúng tên vị khách nhận." },
];

export function Personalize() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MOTION_OK, () => {
        gsap
          .timeline({ scrollTrigger: { trigger: ".chat", start: "top 75%" } })
          .from(".chat", { autoAlpha: 0, y: 50, rotate: -3, duration: 1.1, ease: "expo.out" })
          .from(".bubble", { autoAlpha: 0, y: 16, scale: 0.9, transformOrigin: "100% 100%", stagger: 0.25, duration: 0.6, ease: "back.out(1.8)" }, "-=0.6");

        // Gõ lần lượt tên từng vị khách.
        const name = ".og-name";
        const tl = gsap.timeline({ repeat: -1, delay: 1.2, scrollTrigger: { trigger: ".chat", start: "top 80%", toggleActions: "play pause resume pause" } });
        guestNames.forEach((n) => {
          tl.to(name, { text: { value: n }, duration: n.length * 0.05, ease: "none" })
            .to(".og-card", { "--glow": 1, duration: 0.3 }, "<")
            .to(".og-card", { "--glow": 0, duration: 0.6 }, ">")
            .to(name, { text: { value: "" }, duration: 0.35, ease: "none" }, "+=1.4");
        });

        gsap.from(".pz-point", {
          autoAlpha: 0,
          x: 30,
          stagger: 0.12,
          duration: 0.9,
          ease: "expo.out",
          scrollTrigger: { trigger: ".pz-points", start: "top 80%" },
        });
      });
    },
    { scope: root },
  );

  return (
    <section ref={root} className="pz">
      <div className="container pz-grid">
        <div className="chat" aria-label="Minh họa tin nhắn gửi thiệp">
          <div className="chat-head">
            <span className="chat-avatar">Q</span>
            <div>
              <b>Minh Quân</b>
              <small>Đang hoạt động</small>
            </div>
          </div>
          <div className="chat-body">
            <p className="bubble bubble--in">Ơ Quân sắp cưới hả? 😍</p>
            <div className="bubble bubble--out bubble--card">
              <div className="og-card">
                <div className="og-img">
                  <Sprig className="og-sprig" color="#e9dcc2" />
                  <span className="og-script">
                    {sampleCouple.groom.split(" ").slice(-1)} &amp; {sampleCouple.bride.split(" ").slice(-1)}
                  </span>
                  <span className="og-date">{sampleCouple.dateShort}</span>
                </div>
                <div className="og-text">
                  <small>{brand.demoLink}</small>
                  <b>
                    Kính mời <span className="og-name">{guestNames[0]}</span>
                    <span className="og-caret" aria-hidden="true" /> tới dự lễ cưới
                  </b>
                  <span>
                    {sampleCouple.groom} &amp; {sampleCouple.bride} · {sampleCouple.dateLabel}
                  </span>
                </div>
              </div>
            </div>
            <p className="bubble bubble--out">Thiệp mời của tụi mình nè, nhớ đến sớm nha 💌</p>
          </div>
        </div>

        <div className="pz-copy">
          <p className="eyebrow">Cá nhân hóa từng lời mời</p>
          <h2 className="h2">
            Mỗi vị khách, <em>một lời mời riêng</em>
          </h2>
          <p className="lead">
            Không còn một đường link chung cho cả trăm người. SayIDo tạo cho mỗi khách một lời mời mang tên họ — trang trọng
            như trao thiệp tận tay.
          </p>
          <ul className="pz-points">
            {points.map((p, i) => (
              <li key={p.t} className="pz-point">
                <span className="pz-num">0{i + 1}</span>
                <div>
                  <h3>{p.t}</h3>
                  <p>{p.d}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
