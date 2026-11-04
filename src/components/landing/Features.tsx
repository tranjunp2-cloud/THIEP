"use client";

import { useEffect, useRef, useState } from "react";
import { sampleCouple } from "./content";
import { gsap, MOTION_OK, useGSAP } from "./gsap";

function Countdown() {
  const [parts, setParts] = useState<number[] | null>(null);
  useEffect(() => {
    const target = new Date(sampleCouple.dateISO).getTime();
    const tick = () => {
      const n = Math.max(0, target - Date.now());
      setParts([Math.floor(n / 864e5), Math.floor(n / 36e5) % 24, Math.floor(n / 6e4) % 60, Math.floor(n / 1e3) % 60]);
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);
  const labels = ["Ngày", "Giờ", "Phút", "Giây"];
  return (
    <div className="cd" aria-label="Đếm ngược đến ngày cưới mẫu">
      {labels.map((l, i) => (
        <div key={l} className="cd-cell">
          <b>{parts ? String(parts[i]).padStart(2, "0") : "--"}</b>
          <span>{l}</span>
        </div>
      ))}
    </div>
  );
}

/** Mã QR trang trí (không quét được) — chỉ để minh họa. Tính sẵn một lần. */
const N = 21;
const QR_CELLS: [number, number][] = (() => {
  const cells: [number, number][] = [];
  let seed = 7;
  const rnd = () => ((seed = (seed * 9301 + 49297) % 233280) / 233280);
  const finder = (x: number, y: number) =>
    [[0, 0], [N - 7, 0], [0, N - 7]].some(([fx, fy]) => x >= fx && x < fx + 7 && y >= fy && y < fy + 7);
  for (let y = 0; y < N; y++)
    for (let x = 0; x < N; x++) {
      if (finder(x, y)) continue;
      if (rnd() > 0.52) cells.push([x, y]);
    }
  return cells;
})();

function FakeQR() {
  const cells = QR_CELLS;
  return (
    <svg viewBox={`0 0 ${N} ${N}`} className="qr" aria-hidden="true">
      {[[0, 0], [N - 7, 0], [0, N - 7]].map(([x, y]) => (
        <g key={`${x}-${y}`} className="qr-finder">
          <rect x={x + 0.5} y={y + 0.5} width="6" height="6" rx="1.2" fill="none" stroke="currentColor" strokeWidth="1" />
          <rect x={x + 2} y={y + 2} width="3" height="3" rx=".6" />
        </g>
      ))}
      {cells.map(([x, y], i) => (
        <rect key={i} className="qr-cell" x={x + 0.1} y={y + 0.1} width=".8" height=".8" rx=".2" style={{ "--i": i } as React.CSSProperties} />
      ))}
    </svg>
  );
}

const wishes = [
  "Cánh cửa gỗ khép mở",
  "Phong bì lụa và dấu son",
  "Bầu trời sao tan dần",
  "Trang tạp chí lật mở",
  "Cánh hoa rơi",
  "Ảnh hiện dần khi cuộn",
];

/** Thẻ "Đổi mẫu": vài mẫu tiêu biểu trong kho. */
const SWITCH_TEMPLATES = [
  { name: "Ngà Botanical", note: "Tranh màu nước, tiệc sân vườn" },
  { name: "Lụa Đỏ", note: "Song Hỷ, lễ vu quy truyền thống" },
  { name: "Đêm Sao", note: "Ánh kim, dạ tiệc buổi tối" },
  { name: "Tối Giản", note: "Chữ lớn kiểu tạp chí" },
];

export function Features() {
  const root = useRef<HTMLElement>(null);
  const [side, setSide] = useState<"trai" | "gai">("trai");
  const [tpl, setTpl] = useState(0);

  useGSAP(
    (_, contextSafe) => {
      const mm = gsap.matchMedia();
      mm.add(MOTION_OK, () => {
        gsap.from(".feat-head > *", {
          autoAlpha: 0,
          y: 30,
          stagger: 0.1,
          duration: 1,
          ease: "expo.out",
          scrollTrigger: { trigger: ".feat-head", start: "top 80%" },
        });
        gsap.from(".bento-card", {
          autoAlpha: 0,
          y: 60,
          scale: 0.96,
          stagger: { each: 0.08, from: "start" },
          duration: 1.1,
          ease: "expo.out",
          scrollTrigger: { trigger: ".bento", start: "top 78%" },
        });
      });

      // Viền phát sáng đi theo con trỏ.
      const grid = root.current!.querySelector<HTMLElement>(".bento")!;
      const move = contextSafe!((e: PointerEvent) => {
        grid.querySelectorAll<HTMLElement>(".bento-card").forEach((c) => {
          const r = c.getBoundingClientRect();
          c.style.setProperty("--mx", `${e.clientX - r.left}px`);
          c.style.setProperty("--my", `${e.clientY - r.top}px`);
        });
      });
      grid.addEventListener("pointermove", move);
      return () => grid.removeEventListener("pointermove", move);
    },
    { scope: root },
  );

  return (
    <section ref={root} id="tinh-nang" className="feat container">
      <div className="feat-head">
        <p className="eyebrow">Mọi thứ một tấm thiệp cần</p>
        <h2 className="h2">
          Đẹp từ cái nhìn đầu, <em>chu đáo</em> đến phút cuối
        </h2>
      </div>

      <div className="bento">
        <article className="bento-card b-rsvp">
          <h3>Đổi mẫu bất cứ lúc nào</h3>
          <p>Nội dung giữ nguyên, chỉ đổi phong cách — từ Song Hỷ truyền thống đến tối giản hiện đại.</p>
          <div className="rsvp-demo">
            <span className="rsvp-q">Thiệp của bạn mặc mẫu nào?</span>
            <div className="rsvp-opts" role="group" aria-label="Thử chọn mẫu">
              {SWITCH_TEMPLATES.map((t, i) => (
                <button key={t.name} type="button" className={tpl === i ? "on" : ""} onClick={() => setTpl(i)} aria-pressed={tpl === i}>
                  {t.name}
                </button>
              ))}
            </div>
            <span className="rsvp-ok" key={tpl}>
              ✓ {SWITCH_TEMPLATES[tpl].note}
            </span>
          </div>
        </article>

        <article className="bento-card b-qr">
          <h3>QR mừng cưới</h3>
          <p>Chuẩn VietQR, tách riêng nhà trai và nhà gái.</p>
          <div className="qr-wrap">
            <div className="qr-tabs" role="tablist" aria-label="Chọn bên">
              <button type="button" role="tab" aria-selected={side === "trai"} onClick={() => setSide("trai")}>Nhà trai</button>
              <button type="button" role="tab" aria-selected={side === "gai"} onClick={() => setSide("gai")}>Nhà gái</button>
            </div>
            <div className="qr-box" key={side}>
              <FakeQR />
              <small>{side === "trai" ? "Minh Quân · Ngân hàng A" : "Thanh Mai · Ngân hàng B"}</small>
            </div>
          </div>
        </article>

        <article className="bento-card b-count">
          <h3>Đếm ngược đến ngày vui</h3>
          <Countdown />
        </article>

        <article className="bento-card b-wish">
          <h3>Hiệu ứng mở thiệp</h3>
          <p>Mỗi mẫu một cách mở thiệp riêng.</p>
          <div className="wish-stream" aria-hidden="true">
            {[...wishes, ...wishes].map((w, i) => (
              <span key={i} className="wish">{w}</span>
            ))}
          </div>
        </article>

        <article className="bento-card b-map">
          <h3>Bản đồ & lịch</h3>
          <p>Một chạm để chỉ đường hoặc thêm vào lịch điện thoại.</p>
          <div className="map" aria-hidden="true">
            <svg viewBox="0 0 200 110" className="map-lines">
              <path d="M-10 80 C 40 70 60 20 110 30 S 180 70 210 40" />
              <path d="M20 -10 C 30 40 70 60 90 120" />
              <path d="M140 -10 C 130 30 150 70 190 120" />
            </svg>
            <span className="map-pin" />
            <span className="map-pulse" />
          </div>
        </article>

        <article className="bento-card b-music">
          <h3>Nhạc nền</h3>
          <p>Bản nhạc của hai bạn vang lên khi thiệp mở.</p>
          <div className="eq" aria-hidden="true">
            {Array.from({ length: 14 }).map((_, i) => (
              <span key={i} style={{ "--i": i } as React.CSSProperties} />
            ))}
          </div>
        </article>

        <article className="bento-card b-lunar">
          <h3>Ngày âm lịch tự động</h3>
          <p>Nhập ngày dương, thiệp tự ghi “nhằm ngày… tháng… năm…” theo lịch Việt.</p>
          <div className="lunar" aria-hidden="true">
            <span className="moon" />
          </div>
        </article>
      </div>
    </section>
  );
}
