"use client";

import { useState } from "react";
import { dotDate, icsFile, longDate, mainEvent, mapsUrl, time } from "@/lib/wedding/format";
import type { Guest, Wedding, WeddingEvent } from "@/lib/wedding/types";
import { musicOf, resolveTemplate } from "@/lib/templates/registry";
import { Ornament, TimelineIcon } from "./skins";

const Pin = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true">
    <path d="M12 21s-7-6.2-7-11.5A7 7 0 0 1 19 9.5C19 14.8 12 21 12 21z" />
    <circle cx="12" cy="9.5" r="2.5" />
  </svg>
);
const Cal = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true">
    <rect x="3" y="5" width="18" height="16" rx="2" />
    <path d="M3 10h18M8 3v4M16 3v4" />
  </svg>
);

export function EventLinks({ w, e }: { w: Wedding; e: WeddingEvent }) {
  function download() {
    const url = URL.createObjectURL(new Blob([icsFile(w, e)], { type: "text/calendar;charset=utf-8" }));
    const a = document.createElement("a");
    a.href = url;
    a.download = `${w.slug}-${e.id}.ics`;
    a.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  }
  return (
    <div className="venue-links">
      <a className="text-link" href={mapsUrl(e)} target="_blank" rel="noreferrer">
        <Pin /> Chỉ đường
      </a>
      <button type="button" className="text-link" onClick={download}>
        <Cal /> Thêm vào lịch
      </button>
    </div>
  );
}

export function CopyButton({ text }: { text: string }) {
  const [done, setDone] = useState(false);
  async function copy() {
    try {
      await navigator.clipboard.writeText(text.replace(/\s/g, ""));
      setDone(true);
      setTimeout(() => setDone(false), 1800);
    } catch {}
  }
  return (
    <button type="button" className="copy-btn" onClick={copy}>
      {done ? "Đã chép ✓" : "Chép số tài khoản"}
    </button>
  );
}

/* ---------------- Các section — mỗi mẫu tự chọn thứ tự và phiên bản (xem Layout.tsx) ---------------- */

export type SecProps = { w: Wedding; guest?: Guest; couple: string };

export function VenueMain({ w }: SecProps) {
  const main = mainEvent(w);
  return (
    <section id="su-kien" className="venue section">
      <div className="venue-frame">
        <Ornament slot="venueFrame" className="ceremony-frame-art" />
        <p className="eyebrow">{main.subtitle}</p>
        <h2>{main.title}</h2>
        <h3>{main.venue}</h3>
        <p className="eyebrow venue-address">{main.address}</p>
        <p className="script">{longDate(main.start)}</p>
        <div className="venue-times">
          <p>
            <span>Đón khách</span>
            {w.timeline[0]?.time ?? time(main.start)}
          </p>
          <p>
            <span>Lễ thành hôn</span>
            {time(main.start)}
          </p>
        </div>
        <EventLinks w={w} e={main} />
      </div>
    </section>
  );
}

export function Timeline({ w }: SecProps) {
  return (
    <section id="lich-trinh" className="timeline section">
      <h2>Lịch trình ngày vui</h2>
      <p className="script">Từ lời chào đầu tiên đến điệu nhảy cuối cùng</p>
      <ol>
        {w.timeline.map((item) => (
          <li key={item.time}>
            <div className="timeline-icon">
              <TimelineIcon art={item.art} />
            </div>
            <div className="timeline-copy">
              <time>{item.time}</time>
              <h3>{item.title}</h3>
              <p>{item.detail}</p>
            </div>
          </li>
        ))}
      </ol>
    </section>
  );
}

export function OtherEvents({ w }: SecProps) {
  const main = mainEvent(w);
  const others = w.events.filter((e) => e.id !== main.id);
  return (
    <>
      {others.map((e) => (
        <section key={e.id} className="recovery section">
          <div>
            <p className="eyebrow">Trước đó, cùng ngày</p>
            <h2>{e.title}</h2>
            <p className="script">{e.subtitle}</p>
            <Ornament slot="recovery" className="recovery-art" />
          </div>
          <div className="recovery-copy">
            <h3>{e.venue}</h3>
            <div className="recovery-date">
              <span>{longDate(e.start)}</span>
              <span>Từ {time(e.start)}</span>
            </div>
            <p>{e.address}</p>
            {e.note && <p className="recovery-note">{e.note}</p>}
            <EventLinks w={w} e={e} />
          </div>
        </section>
      ))}
    </>
  );
}

export function Dress({ w }: SecProps) {
  return (
    <section className="dress section">
      <Ornament slot="dressTop" className="dress-garland" />
      <p className="script">Một chút trang trọng cho ngày vui</p>
      <h2>Trang phục</h2>
      <div className="fine-rule" />
      <h3>{w.dress.title}</h3>
      <p>{w.dress.note}</p>
      <div className="palette" aria-label="Bảng màu gợi ý">
        {w.dress.palette.map((c) => (
          <span key={c} style={{ background: c }} />
        ))}
      </div>
      <Ornament slot="dressFoot" className="guests-art" />
    </section>
  );
}

export function Gifts({ w }: SecProps) {
  return (
    <section className="gifts section">
      <div className="gift-frame">
        <Ornament slot="giftFrame" className="gifts-frame-art" />
        <h2>Mừng cưới</h2>
        <p className="script">{w.gifts.message}</p>
        <div className="gift-accounts">
          {w.gifts.accounts.map((a) => (
            <div key={a.side} className="gift-account">
              <p className="eyebrow">{a.side}</p>
              <p className="gift-number">{a.number}</p>
              <p className="gift-meta">
                {a.holder} · {a.bank}
              </p>
              <CopyButton text={a.number} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export function Faq({ w }: SecProps) {
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  return (
    <section id="hoi-dap" className="faq section">
      <div className="faq-flower faq-flower-left" aria-hidden="true" />
      <div className="faq-flower faq-flower-right" aria-hidden="true" />
      <p className="script">Vài điều có thể bạn đang thắc mắc</p>
      <h2>Những điều cần biết</h2>
      <div className="faq-list">
        {w.faqs.map((f, i) => {
          const open = openFaq === i;
          return (
            <div key={f.q} className={`faq-item ${open ? "is-open" : ""}`}>
              <h3>
                <button type="button" aria-expanded={open} aria-controls={`faq-${i}`} onClick={() => setOpenFaq(open ? null : i)}>
                  {f.q}
                  <span className="faq-plus" aria-hidden="true" />
                </button>
              </h3>
              <div id={`faq-${i}`} className="faq-answer" role="region">
                <div>
                  <p>{f.a}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}

export function Closing({ w, guest, couple }: SecProps) {
  const main = mainEvent(w);
  const music = musicOf(resolveTemplate(w.template).family);
  return (
    <footer>
      <p className="script">Hẹn gặp {guest ? guest.name : "bạn"} trong ngày vui</p>
      <h2>
        {w.groom.short} <i>&amp;</i> {w.bride.short}
      </h2>
      <p className="eyebrow">
        {dotDate(main.start)} · {w.city}
      </p>
      <Ornament slot="footer" className="estate-art" />
      <a href="#top" className="back-top">
        ↑ Về đầu thiệp
      </a>
      <p className="music-credit">
        Nhạc nền:{" "}
        <a href={music.url} target="_blank" rel="noreferrer">
          {music.title} · {music.artist}
        </a>
        <br />
        Giấy phép{" "}
        <a href={music.licenseUrl} target="_blank" rel="noreferrer">
          {music.license}
        </a>{" "}
        · đã nén để phát trên web.
        {w.demo && (
          <>
            <br />
            Thiệp demo của {couple} — tên, địa chỉ và tài khoản mang tính minh họa.
          </>
        )}
      </p>
    </footer>
  );
}

