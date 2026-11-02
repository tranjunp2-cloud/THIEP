"use client";

import { useEffect, useRef, useState } from "react";
import { dotDate, longDate, lunar, mainEvent, selfRef } from "@/lib/wedding/format";
import type { Guest, Wedding } from "@/lib/wedding/types";
import { Art } from "./Art";
import { Music, type MusicHandle } from "./Music";
import { EventsAndDetails } from "./Sections";
import { useScrollReveal } from "./useScrollReveal";

const ArrowDown = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true">
    <path d="M12 5v14m-6-6 6 6 6-6" />
  </svg>
);

function useCountdown(iso: string) {
  const [count, setCount] = useState<number[] | null>(null);
  useEffect(() => {
    const target = new Date(iso).getTime();
    const tick = () => {
      const n = Math.max(0, target - Date.now());
      setCount([Math.floor(n / 864e5), Math.floor(n / 36e5) % 24, Math.floor(n / 6e4) % 60, Math.floor(n / 1e3) % 60]);
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [iso]);
  return count;
}

type Props = {
  wedding: Wedding;
  /** Khách nhận diện từ ?k= ở server — tên hiện ngay trên bìa, không nháy. */
  guest?: Guest;
  /** Bản xem trước trong trang tạo thiệp: không phát nhạc, không gửi RSVP. */
  preview?: boolean;
  startOpen?: boolean;
};

export function Invitation({ wedding: w, guest, preview = false, startOpen = false }: Props) {
  const rootRef = useRef<HTMLElement>(null);
  useScrollReveal(rootRef);
  const musicRef = useRef<MusicHandle>(null);
  const [opened, setOpened] = useState(startOpen);
  const main = mainEvent(w);
  const count = useCountdown(main.start);
  const couple = `${w.groom.short} & ${w.bride.short}`;
  const [g1, g2] = w.monogram.split("&").map((s) => s.trim());

  function openInvitation() {
    setOpened(true);
    if (!preview) musicRef.current?.startOnOpen();
  }

  return (
    <main id="top" ref={rootRef} className="thiep">
      {!preview && <Music ref={musicRef} />}

      <nav className="desktop-nav" aria-label="Điều hướng thiệp">
        <a href="#top" className="nav-monogram">
          {g1} <i>&amp;</i> {g2}
        </a>
        <div>
          <a href="#su-kien">Sự kiện</a>
          <a href="#lich-trinh">Lịch trình</a>
          <a href="#xac-nhan">Xác nhận tham dự</a>
        </div>
        <span>{dotDate(main.start).replace(/ /g, "")}</span>
      </nav>

      <section className={`hero ${opened ? "is-open" : ""}`} aria-label="Thiệp mời cưới">
        <div className="hero-paper">
          <div className="hero-copy">
            <p className="eyebrow">Lễ thành hôn của</p>
            <h1>
              {w.groom.short} <span>&amp;</span> {w.bride.short}
            </h1>
            <p className="hero-date">{longDate(main.start)}</p>
            <p className="script">{lunar(main.start)}</p>
          </div>
          <Art name="candles" className="hero-candles" />
        </div>
        <div className="door door-left" aria-hidden="true" />
        <div className="door door-right" aria-hidden="true" />
        <div className="envelope-copy">
          <p className="script">Trân trọng kính mời</p>
          <p className="guest-name is-ready">{guest?.name ?? "Quý khách"}</p>
          <button className="seal" onClick={openInvitation} aria-label="Mở thiệp cưới">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/thiep/images/silver-seal.webp" alt="" aria-hidden="true" width="400" height="480" />
            <span>
              {g1}
              <small>&amp;</small>
              {g2}
            </span>
          </button>
          <p className="eyebrow">tới dự lễ thành hôn của {selfRef(guest)}</p>
          <button className="open-invitation" onClick={openInvitation}>
            Mở thiệp <ArrowDown />
          </button>
        </div>
        {opened && (
          <a className="discover" href="#dem-nguoc">
            Khám phá <ArrowDown />
          </a>
        )}
      </section>

      <section className="countdown section" id="dem-nguoc">
        <Art name="floral-side" className="countdown-flower countdown-flower-left" />
        <Art name="floral-side" className="countdown-flower countdown-flower-right" />
        <p className="script">Từng khoảnh khắc đưa {selfRef(guest)} lại gần nhau</p>
        <h2>Đếm ngược đến ngày vui</h2>
        <div className="count-grid">
          {["Ngày", "Giờ", "Phút", "Giây"].map((label, i) => (
            <div key={label}>
              <strong>{count ? String(count[i]).padStart(2, "0") : "--"}</strong>
              <span>{label}</span>
            </div>
          ))}
        </div>
        <Art name="candles" className="candle-border" />
      </section>

      <section className="invitation section">
        <p className="script">Cùng gia đình hai bên</p>
        <div className="families">
          {w.families.map((f) => (
            <div key={f.side} className="family">
              <p className="eyebrow">{f.side}</p>
              <p className="family-names">
                {f.father}
                <br />
                {f.mother}
              </p>
              <p className="family-address">{f.address}</p>
            </div>
          ))}
        </div>
        <p className="script">trân trọng báo tin lễ thành hôn của con chúng tôi</p>
        <h2>
          {w.groom.name}
          <span className="script">và</span>
          {w.bride.name}
        </h2>
        <p className="eyebrow">{longDate(main.start)}</p>
        <div className="fine-rule" />
        <p>
          Sự hiện diện của <b className="guest-inline">{guest?.name ?? "quý khách"}</b> là niềm vinh hạnh
          <br />
          cho gia đình và {selfRef(guest)}.
        </p>
        <Art name="leafy-garland" className="invitation-garland" />
      </section>

      <EventsAndDetails wedding={w} guest={guest} couple={couple} preview={preview} />
    </main>
  );
}
