"use client";

import { useEffect, useRef, useState } from "react";
import { dotDate, icsFile, longDate, mainEvent, mapsUrl, time } from "@/lib/wedding/format";
import type { Guest, Wedding, WeddingEvent } from "@/lib/wedding/types";
import { Art } from "./Art";

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

function EventLinks({ w, e }: { w: Wedding; e: WeddingEvent }) {
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

function CopyButton({ text }: { text: string }) {
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

/* ---------------- RSVP ---------------- */

function Rsvp({ w, guest }: { w: Wedding; guest?: Guest }) {
  const [available, setAvailable] = useState<boolean | null>(null);
  const [attendance, setAttendance] = useState<"yes" | "no">("yes");
  const [status, setStatus] = useState<"idle" | "sending" | "saved" | "demo" | "error">("idle");
  const [error, setError] = useState("");
  const key = useRef("");

  useEffect(() => {
    const c = new AbortController();
    fetch("/api/rsvp", { signal: c.signal, cache: "no-store" })
      .then((r) => (r.ok ? r.json() : Promise.reject()))
      .then((d) => setAvailable(d?.available === true))
      .catch(() => !c.signal.aborted && setAvailable(false));
    return () => c.abort();
  }, []);

  async function send(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (status === "sending") return;
    const data = new FormData(e.currentTarget);
    if (!available) {
      // Thiệp demo chưa nối cơ sở dữ liệu: không giả vờ đã lưu.
      setStatus("demo");
      return;
    }
    if (!key.current) key.current = crypto.randomUUID();
    setStatus("sending");
    setError("");
    try {
      const r = await fetch("/api/rsvp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: key.current,
          wedding: w.slug,
          guestKey: guest?.key ?? "",
          name: data.get("name"),
          attendance,
          partySize: attendance === "yes" ? Number(data.get("partySize") || 1) : 0,
          side: guest?.side ?? data.get("side") ?? "",
          message: data.get("message"),
          website: data.get("website"),
        }),
      });
      if (!r.ok) throw new Error("Chưa gửi được phản hồi. Bạn thử lại sau ít phút nhé.");
      setStatus("saved");
    } catch (err) {
      setStatus("error");
      setError(err instanceof Error ? err.message : "Vui lòng thử lại.");
    }
  }

  const done = status === "saved" || status === "demo";

  return (
    <section id="xac-nhan" className="rsvp section">
      <Art name="envelope" className="rsvp-envelope" />
      <h2>
        {guest?.tone === "elder"
          ? `Chúng con kính mong được đón ${guest.name}`
          : `Chúng mình đã để dành một chỗ cho ${guest?.name ?? "bạn"}`}
      </h2>
      <p className="script">Vui lòng xác nhận trước ngày {w.rsvpDeadline}</p>

      {done ? (
        <div className="rsvp-success" role="status">
          <svg width="34" height="34" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" aria-hidden="true">
            <path d="m5 12 5 5 9-10" />
          </svg>
          <h3>Cảm ơn {guest?.name ?? "bạn"}!</h3>
          <p>
            {attendance === "yes"
              ? `${guest?.tone === "elder" ? "Chúng con rất mong được đón" : "Chúng mình rất mong được gặp"} ${guest?.name ?? "bạn"} trong ngày vui.`
              : "Tiếc quá! Cảm ơn bạn đã báo trước và gửi lời chúc."}
          </p>
          {status === "demo" && (
            <p className="demo-note">Đây là thiệp demo nên phản hồi chưa được lưu lại.</p>
          )}
          <p className="script">
            Thương mến, {w.groom.short} &amp; {w.bride.short}
          </p>
        </div>
      ) : (
        <form onSubmit={send}>
          <Art name="topiary" className="rsvp-topiary" />
          <label htmlFor="name">
            Họ và tên <span aria-hidden="true">*</span>
          </label>
          <input
            id="name"
            name="name"
            required
            minLength={2}
            maxLength={150}
            autoComplete="name"
            defaultValue={guest?.name ?? ""}
            key={guest?.key ?? "anon"}
            placeholder="Tên của bạn"
          />
          <fieldset>
            <legend>
              Bạn sẽ đến chung vui chứ? <span aria-hidden="true">*</span>
            </legend>
            <label className="radio-label">
              <input type="radio" name="attendance" value="yes" checked={attendance === "yes"} onChange={() => setAttendance("yes")} />
              Chắc chắn rồi, mình sẽ đến
            </label>
            <label className="radio-label">
              <input type="radio" name="attendance" value="no" checked={attendance === "no"} onChange={() => setAttendance("no")} />
              Rất tiếc, mình không đến được
            </label>
          </fieldset>
          {attendance === "yes" && (
            <>
              <label htmlFor="partySize">Số người tham dự (kể cả bạn)</label>
              <select id="partySize" name="partySize" defaultValue="1">
                {[1, 2, 3, 4, 5, 6].map((n) => (
                  <option key={n} value={n}>
                    {n} người
                  </option>
                ))}
              </select>
            </>
          )}
          {!guest && (
            <fieldset>
              <legend>Bạn là khách của</legend>
              <label className="radio-label">
                <input type="radio" name="side" value="Nhà trai" defaultChecked /> Nhà trai
              </label>
              <label className="radio-label">
                <input type="radio" name="side" value="Nhà gái" /> Nhà gái
              </label>
            </fieldset>
          )}
          <label htmlFor="message">Lời chúc gửi cô dâu chú rể</label>
          <textarea id="message" name="message" maxLength={2000} rows={4} placeholder="Một lời chúc, một kỷ niệm…" />
          <div className="honeypot" aria-hidden="true">
            <label htmlFor="website">Website</label>
            <input id="website" name="website" tabIndex={-1} autoComplete="off" />
          </div>
          {error && (
            <p className="form-error" role="alert">
              {error}
            </p>
          )}
          {available === false && <p className="form-note">Bản demo: phản hồi sẽ không được lưu.</p>}
          <button type="submit" className="submit-rsvp" disabled={status === "sending"}>
            {status === "sending" ? "Đang gửi…" : "Gửi xác nhận"}
          </button>
        </form>
      )}
    </section>
  );
}

/* ---------------- Các phần còn lại ---------------- */

export function EventsAndDetails({ wedding: w, guest, couple }: { wedding: Wedding; guest?: Guest; couple: string }) {
  const main = mainEvent(w);
  const others = w.events.filter((e) => e.id !== main.id);
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  return (
    <>
      <section id="su-kien" className="venue section">
        <div className="venue-frame">
          <Art name="ceremony-frame" className="ceremony-frame-art" />
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

      <section id="lich-trinh" className="timeline section">
        <h2>Lịch trình ngày vui</h2>
        <p className="script">Từ lời chào đầu tiên đến điệu nhảy cuối cùng</p>
        <ol>
          {w.timeline.map((item) => (
            <li key={item.time}>
              <div className="timeline-icon">
                <Art name={item.art} className="timeline-art" />
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

      {others.map((e) => (
        <section key={e.id} className="recovery section">
          <div>
            <p className="eyebrow">Trước đó, cùng ngày</p>
            <h2>{e.title}</h2>
            <p className="script">{e.subtitle}</p>
            <Art name="recovery-building" className="recovery-art" />
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

      <section className="dress section">
        <Art name="leafy-garland" className="dress-garland" />
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
        <Art name="guests" className="guests-art" />
      </section>

      <section className="gifts section">
        <div className="gift-frame">
          <Art name="gifts-frame" className="gifts-frame-art" />
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

      <Rsvp w={w} guest={guest} />

      <footer>
        <p className="script">Hẹn gặp {guest ? guest.name : "bạn"} trong ngày vui</p>
        <h2>
          {w.groom.short} <i>&amp;</i> {w.bride.short}
        </h2>
        <p className="eyebrow">
          {dotDate(main.start)} · {w.city}
        </p>
        <Art name="estate-panorama" className="estate-art" />
        <a href="#top" className="back-top">
          ↑ Về đầu thiệp
        </a>
        <p className="music-credit">
          Nhạc nền:{" "}
          <a href="https://incompetech.com/music/royalty-free/index.html?isrc=USUAN1100301" target="_blank" rel="noreferrer">
            Canon in D Major · Kevin MacLeod
          </a>
          <br />
          Giấy phép{" "}
          <a href="https://creativecommons.org/licenses/by/3.0/" target="_blank" rel="noreferrer">
            CC BY 3.0
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
    </>
  );
}
