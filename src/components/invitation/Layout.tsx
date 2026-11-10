"use client";

import { Fragment, useEffect, useState, type ReactNode } from "react";
import type { SkinId } from "@/lib/templates/registry";
import { dateParts, dotDate, longDate, lunar, mainEvent, selfRef, time } from "@/lib/wedding/format";
import type { WeddingEvent } from "@/lib/wedding/types";
import { Album, CoupleIntro, DateBar, MonthGrid, WeddingCalendar } from "./Photos";
import { Closing, CopyButton, Dress, EventLinks, Faq, Gifts, OtherEvents, Timeline, VenueMain, type SecProps } from "./Sections";
import { Ornament } from "./skins";

/* ============================================================
   Các khối dùng chung
   ============================================================ */

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

function Countdown({ w, guest }: SecProps) {
  const count = useCountdown(mainEvent(w).start);
  return (
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
  );
}

function FamiliesInvite({ w, guest }: SecProps) {
  const main = mainEvent(w);
  return (
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
        Sự hiện diện của <b className="guest-inline">{guest?.name ?? "quý khách"}</b> là niềm vinh hạnh{" "}
        <br />
        cho gia đình và {selfRef(guest)}.
      </p>
      <Ornament slot="invitationFoot" className="invitation-garland" />
    </section>
  );
}

const byStart = (a: WeddingEvent, b: WeddingEvent) => a.start.localeCompare(b.start);

/* ============================================================
   Phiên bản riêng theo mẫu
   ============================================================ */

/** Lụa Đỏ / Đêm Sao: mọi sự kiện thành các thẻ đặt cạnh nhau. */
function EventCards({ w, othersOnly = false }: SecProps & { othersOnly?: boolean }) {
  const main = mainEvent(w);
  const events = [...w.events].filter((e) => !othersOnly || e.id !== main.id).sort(byStart);
  if (!events.length) return null;
  return (
    <section id="su-kien" className="ev-cards section">
      <p className="script">Rất mong được đón tiếp</p>
      <h2 className="sec-title">Thông tin lễ cưới</h2>
      <div className={`ev-grid ev-grid--${events.length}`}>
        {events.map((e) => {
          const d = dateParts(e.start);
          return (
            <article key={e.id} className={`ev-card${e.id === main.id ? " is-main" : ""}`}>
              <Ornament slot="venueFrame" />
              <p className="ev-kicker">{e.subtitle || "Trân trọng kính mời"}</p>
              <h3>{e.title}</h3>
              <div className="ev-date">
                <span>{time(e.start)}</span>
                <b>{String(d.d).padStart(2, "0")}</b>
                <span>
                  Tháng {String(d.m).padStart(2, "0")}
                  <br />
                  {d.y}
                </span>
              </div>
              <p className="ev-lunar">{lunar(e.start)}</p>
              <p className="ev-venue">{e.venue}</p>
              <p className="ev-address">{e.address}</p>
              {e.note && <p className="ev-note">{e.note}</p>}
              <EventLinks w={w} e={e} />
            </article>
          );
        })}
      </div>
    </section>
  );
}

/** Tối Giản: sự kiện dạng bảng kiểu tạp chí. */
function EventTable({ w }: SecProps) {
  const events = [...w.events].sort(byStart);
  return (
    <section id="su-kien" className="ev-table section">
      <h2 className="sec-title">Ngày cưới</h2>
      <ol>
        {events.map((e) => {
          const d = dateParts(e.start);
          return (
            <li key={e.id}>
              <div className="ev-t-date">
                <b>
                  {String(d.d).padStart(2, "0")}.{String(d.m).padStart(2, "0")}
                </b>
                <span>{time(e.start)}</span>
              </div>
              <div className="ev-t-body">
                <h3>{e.title}</h3>
                <p className="ev-t-venue">{e.venue}</p>
                <p className="ev-t-address">{e.address}</p>
                {e.note && <p className="ev-t-note">{e.note}</p>}
              </div>
              <EventLinks w={w} e={e} />
            </li>
          );
        })}
      </ol>
    </section>
  );
}

/** Tối Giản: đếm ngược bằng con số khổng lồ kiểu bìa tạp chí. */
function CountdownLine({ w }: SecProps) {
  const main = mainEvent(w);
  const count = useCountdown(main.start);
  return (
    <section className="cd-line section" id="dem-nguoc" aria-label="Đếm ngược">
      <p className="cd-kicker">Còn</p>
      <div className="cd-big">
        <b>{count ? count[0] : "--"}</b>
        <span>
          ngày
          <br />
          nữa
        </span>
      </div>
      <div className="cd-small" aria-hidden={!count}>
        {["giờ", "phút", "giây"].map((u, i) => (
          <span key={u}>
            <b>{count ? String(count[i + 1]).padStart(2, "0") : "--"}</b> {u}
          </span>
        ))}
      </div>
      <p className="cd-meta">
        {longDate(main.start)} · {lunar(main.start)}
      </p>
    </section>
  );
}

/** Tối Giản: dải chữ chạy ngang tên hai bạn — như dòng tít chạy của tạp chí. */
function Marquee({ w }: SecProps) {
  const main = mainEvent(w);
  const item = (
    <span>
      {w.groom.short} <i>&amp;</i> {w.bride.short}
      <em>✦</em>
      {dotDate(main.start).replace(/ /g, "")}
      <em>✦</em>
      {w.city}
      <em>✦</em>
    </span>
  );
  return (
    <div className="ed-marquee" aria-hidden="true">
      <div className="ed-marquee-track">
        {item}
        {item}
        {item}
        {item}
      </div>
    </div>
  );
}

/** Đêm Sao: một tấm thiệp gộp giờ tiệc, đón khách/khai tiệc, đếm ngược và lịch tháng. */
function PartyInfo({ w }: SecProps) {
  const main = mainEvent(w);
  const count = useCountdown(main.start);
  const d = dateParts(main.start);
  const welcome = w.timeline[0]?.time;
  const feast = w.timeline.find((t) => /tiệc/i.test(t.title))?.time;
  return (
    <section className="party section" id="dem-nguoc">
      <div className="ds-panel">
        <h2 className="sec-title">Thông tin tiệc cưới</h2>
        <p className="party-kicker">Tiệc cưới sẽ diễn ra vào lúc</p>
        <div className="ev-date">
          <span>
            {time(main.start)}
            <br />
            {d.weekday}
          </span>
          <b>{String(d.d).padStart(2, "0")}</b>
          <span>
            Tháng {String(d.m).padStart(2, "0")}
            <br />
            {d.y}
          </span>
        </div>
        <p className="ev-lunar">({lunar(main.start)})</p>
        {(welcome || feast) && (
          <div className="party-times">
            {welcome && (
              <p>
                <span>Đón khách</span>
                {welcome}
              </p>
            )}
            {feast && (
              <p>
                <span>Khai tiệc</span>
                {feast}
              </p>
            )}
          </div>
        )}
        <p className="party-count-label">Cùng đếm ngược</p>
        <p className="party-count">
          {count ? (
            <>
              <b>{count[0]}</b> ngày <b>{count[1]}</b> giờ <b>{count[2]}</b> phút <b>{count[3]}</b> giây
            </>
          ) : (
            "…"
          )}
        </p>
        <MonthGrid iso={main.start} />
        <p className="party-venue">
          {main.venue}
          <span>{main.address}</span>
        </p>
        <EventLinks w={w} e={main} />
      </div>
    </section>
  );
}

/** Đêm Sao: hộp quà mừng — chạm để mở, bên trong là thông tin mừng cưới. */
function GiftBox({ w }: SecProps) {
  const [open, setOpen] = useState(false);
  if (!w.gifts.accounts.length) return null;
  return (
    <section className="giftbox section" id="mung-cuoi">
      <h2 className="sec-title">Hộp quà mừng</h2>
      <p className="script">{w.gifts.message}</p>
      <div className={`gb-wrap${open ? " is-open" : ""}`}>
        <button type="button" className="gb-box" onClick={() => setOpen(true)} aria-expanded={open} aria-controls="gb-accounts">
          <svg viewBox="0 0 200 200" aria-hidden="true">
            <g className="gb-lid">
              <rect x="30" y="62" width="140" height="34" rx="4" fill="var(--t-paper)" stroke="var(--t-accent)" strokeWidth="2" />
              <rect x="92" y="62" width="16" height="34" fill="var(--t-accent)" />
              <path d="M100 62 C 70 30 52 52 74 62 Z M100 62 C 130 30 148 52 126 62 Z" fill="none" stroke="var(--t-accent)" strokeWidth="3" />
            </g>
            <rect x="40" y="96" width="120" height="84" rx="4" fill="var(--t-cover)" stroke="var(--t-accent)" strokeWidth="2" />
            <rect x="92" y="96" width="16" height="84" fill="var(--t-accent)" />
            {[
              [56, 116],
              [140, 128],
              [62, 160],
              [134, 164],
            ].map(([x, y], i) => (
              <path key={i} d="M0 -5 L1.2 -1.2 L5 0 L1.2 1.2 L0 5 L-1.2 1.2 L-5 0 L-1.2 -1.2 Z" transform={`translate(${x} ${y})`} fill="var(--t-accent)" />
            ))}
          </svg>
          <span>{open ? "Đã mở" : "Chạm để mở"}</span>
        </button>
        <div id="gb-accounts" className="gb-accounts" hidden={!open}>
          {w.gifts.accounts.map((a) => (
            <div key={a.side} className="ds-panel gb-card">
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

/** Sen Hồng: mỗi sự kiện một khối căn giữa — giờ lớn, thanh ngày, địa điểm; hoạ tiết sen ngăn giữa các khối. */
function SenEvents({ w }: SecProps) {
  const events = [...w.events].sort(byStart);
  if (!events.length) return null;
  return (
    <section id="su-kien" className="sen-events section">
      <p className="script">Trân trọng kính mời</p>
      <h2 className="sec-title">Thông tin lễ cưới</h2>
      {events.map((e, i) => (
        <Fragment key={e.id}>
          {i > 0 && <Ornament slot="invitationFoot" />}
          <article className="sen-event">
            <p className="sen-event-kicker">{e.subtitle || e.title}</p>
            <h3>{e.title}</h3>
            <p className="sen-event-at">vào lúc</p>
            <DateBar iso={e.start} time={time(e.start)} />
            <p className="sen-event-venue">{e.venue}</p>
            <p className="sen-event-address">{e.address}</p>
            {e.note && <p className="sen-event-note">{e.note}</p>}
            <EventLinks w={w} e={e} />
          </article>
        </Fragment>
      ))}
    </section>
  );
}

/** Sen Hồng: đếm ngược bốn ô cánh sen và lịch tháng đánh dấu ngày cưới. */
function SenCountdown({ w, guest }: SecProps) {
  const main = mainEvent(w);
  const count = useCountdown(main.start);
  return (
    <section className="sen-count section" id="dem-nguoc">
      <p className="script">Từng ngày đưa {selfRef(guest)} lại gần nhau</p>
      <h2 className="sec-title">Cùng đếm ngược</h2>
      <div className="sen-count-grid">
        {["Ngày", "Giờ", "Phút", "Giây"].map((label, i) => (
          <div key={label}>
            <strong>{count ? String(count[i]).padStart(2, "0") : "--"}</strong>
            <span>{label}</span>
          </div>
        ))}
      </div>
      <MonthGrid iso={main.start} />
    </section>
  );
}

/* ============================================================
   Bố cục của từng mẫu — thứ tự và phiên bản section
   ============================================================ */

type Sec = (p: SecProps) => ReactNode;

const SECTIONS: Record<string, Sec> = {
  couple: ({ w }) => <CoupleIntro w={w} />,
  countdown: Countdown,
  countdownLine: CountdownLine,
  marquee: Marquee,
  party: PartyInfo,
  giftBox: GiftBox,
  senEvents: SenEvents,
  senCount: SenCountdown,
  families: FamiliesInvite,
  calendar: ({ w }) => <WeddingCalendar w={w} />,
  album: ({ w }) => <Album w={w} />,
  venue: VenueMain,
  others: OtherEvents,
  eventCards: EventCards,
  otherCards: (p) => <EventCards {...p} othersOnly />,
  eventTable: EventTable,
  timeline: Timeline,
  dress: Dress,
  gifts: Gifts,
  faq: Faq,
  closing: Closing,
};

/** Nhãn mục cho bố cục tạp chí (Tối Giản). */
const ED_LABEL: Record<string, string> = {
  couple: "Hai chúng mình",
  families: "Lời mời",
  countdownLine: "Đếm ngược",
  eventTable: "Ngày cưới",
  timeline: "Lịch trình",
  album: "Album",
  dress: "Dress code",
  gifts: "Mừng cưới",
  faq: "Hỏi đáp",
};

export const LAYOUTS: Record<SkinId, string[]> = {
  // Cổ điển, đối xứng, tranh màu nước đan giữa các phần.
  botanical: ["couple", "countdown", "families", "album", "venue", "timeline", "others", "dress", "gifts", "faq", "closing"],
  // Truyền thống: báo hỷ gia đình trước, lịch trái tim, thẻ sự kiện, băng chuyền ảnh.
  "song-hy": ["families", "couple", "calendar", "eventCards", "album", "timeline", "gifts", "faq", "closing"],
  // Dạ tiệc dưới trời sao: các tấm thiệp sáng màu nổi trên nền đêm, phong bì ảnh, hộp quà chạm để mở.
  "dem-sao": ["families", "couple", "album", "party", "otherCards", "dress", "timeline", "giftBox", "closing"],
  // Tạp chí: các mục đánh số, bảng sự kiện, đếm ngược một dòng.
  "toi-gian": ["countdownLine", "couple", "marquee", "families", "eventTable", "timeline", "album", "marquee", "dress", "gifts", "faq", "closing"],
  // Sen Hồng: ảnh đôi nghiêng chồng nhau, báo hỷ hai họ, khối sự kiện thanh ngày, album khung vòm, lịch đếm ngược.
  sen: ["couple", "families", "senEvents", "album", "senCount", "dress", "timeline", "giftBox", "faq", "closing"],
  truc: ["couple", "countdown", "families", "album", "venue", "timeline", "others", "dress", "gifts", "faq", "closing"],
};

export function InvitationBody({ skin, ...props }: SecProps & { skin: SkinId }) {
  const order = LAYOUTS[skin] ?? LAYOUTS.botanical;
  let n = 0;
  return (
    <>
      {order.map((key, idx) => {
        const Section = SECTIONS[key];
        if (!Section) return null;
        const label = skin === "toi-gian" ? ED_LABEL[key] : undefined;
        if (label) n++;
        return label ? (
          <div key={key} className={`ed-sec ed-sec--${key}`}>
            <aside className="ed-rail" aria-hidden="true">
              <span className="ed-no">{String(n).padStart(2, "0")}</span>
              <span className="ed-label">{label}</span>
            </aside>
            <div className="ed-body">
              <Section {...props} />
            </div>
          </div>
        ) : (
          <Fragment key={`${key}-${idx}`}>
            <Section {...props} />
          </Fragment>
        );
      })}
    </>
  );
}
