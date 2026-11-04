"use client";

import { useEffect, useRef, useState } from "react";
import { dotDate, longDate, lunar, mainEvent, selfRef } from "@/lib/wedding/format";
import { resolveTemplate, templateStyle } from "@/lib/templates/registry";
import type { Guest, Wedding } from "@/lib/wedding/types";
import { Music, type MusicHandle } from "./Music";
import { Ambient } from "./Ambient";
import { Album, CoupleIntro, hasPhotoHero, PhotoHero, WeddingCalendar } from "./Photos";
import { EventsAndDetails } from "./Sections";
import { Ornament, Seal, SkinProvider } from "./skins";
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
  const tpl = resolveTemplate(w.template);
  const style = templateStyle(tpl);
  const photoHero = hasPhotoHero(w);

  // Nền ngoài thiệp (khi kéo quá đầu/cuối trang) cũng theo màu mẫu.
  useEffect(() => {
    const root = document.documentElement;
    for (const [k, v] of Object.entries(style)) root.style.setProperty(k, v);
    return () => {
      for (const k of Object.keys(style)) root.style.removeProperty(k);
    };
  }, [tpl.id]); // eslint-disable-line react-hooks/exhaustive-deps

  function openInvitation() {
    setOpened(true);
    if (!preview) musicRef.current?.startOnOpen();
  }

  return (
    <SkinProvider skin={tpl.family.skin}>
    <main id="top" ref={rootRef} className="thiep" data-skin={tpl.family.skin} data-template={tpl.id} style={style as React.CSSProperties}>
      {!preview && <Music ref={musicRef} />}
      <Ambient skin={tpl.family.skin} active={opened} />

      <nav className="desktop-nav" aria-label="Điều hướng thiệp">
        <a href="#top" className="nav-monogram">
          {g1} <i>&amp;</i> {g2}
        </a>
        <div>
          <a href="#su-kien">Sự kiện</a>
          <a href="#lich-trinh">Lịch trình</a>
          {w.photos?.album?.length ? <a href="#album">Album ảnh</a> : <a href="#hoi-dap">Hỏi đáp</a>}
        </div>
        <span>{dotDate(main.start).replace(/ /g, "")}</span>
      </nav>

      <section className={`hero ${opened ? "is-open" : ""}${photoHero ? " has-photo" : ""}`} aria-label="Thiệp mời cưới">
        <div className="hero-paper">
          {photoHero ? (
            <>
              <PhotoHero w={w} />
              {tpl.family.skin === "botanical" && <Ornament slot="hero" className="hero-candles" />}
            </>
          ) : (
            <>
              <div className="hero-copy">
                <p className="eyebrow">Lễ thành hôn của</p>
                <h1>
                  {w.groom.short} <span>&amp;</span> {w.bride.short}
                </h1>
                <p className="hero-date">{longDate(main.start)}</p>
                <p className="script">{lunar(main.start)}</p>
              </div>
              <Ornament slot="hero" className="hero-candles" />
            </>
          )}
        </div>
        <div className="door door-left" aria-hidden="true" />
        <div className="door door-right" aria-hidden="true" />
        <div className="envelope-copy">
          <p className="script">Trân trọng kính mời</p>
          <p className="guest-name is-ready">{guest?.name ?? "Quý khách"}</p>
          <button className="seal" onClick={openInvitation} aria-label="Mở thiệp cưới">
            <Seal g1={g1} g2={g2} />
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

      <CoupleIntro w={w} />

      <section className="countdown section" id="dem-nguoc">
        <Ornament slot="countdownSide" className="countdown-flower countdown-flower-left" />
        <Ornament slot="countdownSide" className="countdown-flower countdown-flower-right" />
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
        <Ornament slot="countdownFoot" className="candle-border" />
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
        <Ornament slot="invitationFoot" className="invitation-garland" />
      </section>

      {tpl.family.skin !== "botanical" && <WeddingCalendar w={w} />}
      <Album w={w} />

      <EventsAndDetails wedding={w} guest={guest} couple={couple} />
    </main>
    </SkinProvider>
  );
}
