"use client";

import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import { dateParts, longDate, lunar, mainEvent } from "@/lib/wedding/format";
import type { Person, Photo, Wedding } from "@/lib/wedding/types";
import { useSkin } from "./skins";
import { Crescent, HyGlyph, StarField, StarSeal } from "./skins/motifs";

/** Ảnh có bản nhỏ 640px nếu là ảnh tĩnh của site (…/anh-01.jpg → …/anh-01-640.jpg). */
function Img({ photo, className = "", sizes = "100vw", eager = false }: { photo: Photo; className?: string; sizes?: string; eager?: boolean }) {
  const local = photo.src.startsWith("/thiep/demo/");
  const small = local ? photo.src.replace(/\.jpg$/, "-640.jpg") : undefined;
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={photo.src}
      srcSet={small ? `${small} 640w, ${photo.src} ${photo.width}w` : undefined}
      sizes={sizes}
      width={photo.width}
      height={photo.height}
      alt={photo.alt ?? ""}
      className={className}
      style={
        photo.focus || photo.zoom
          ? { objectPosition: photo.focus, ...(photo.zoom ? { transform: `scale(${photo.zoom})`, transformOrigin: photo.focus } : {}) }
          : undefined
      }
      loading={eager ? "eager" : "lazy"}
      decoding="async"
    />
  );
}

/* ============================================================
   Bìa có ảnh — mỗi skin một bố cục
   ============================================================ */

/** Chữ chạy theo cung tròn. */
function ArcText({ text, id }: { text: string; id: string }) {
  return (
    <svg viewBox="0 0 300 70" className="arc-text" aria-hidden="true">
      <path id={id} d="M 20 64 Q 150 -6 280 64" fill="none" />
      <text>
        <textPath href={`#${id}`} startOffset="50%" textAnchor="middle">
          {text}
        </textPath>
      </text>
    </svg>
  );
}

function StarSealMini() {
  return (
    <span className="ph-env-seal" aria-hidden="true">
      <StarSeal className="motif" />
    </span>
  );
}

export function hasPhotoHero(w: Wedding) {
  return Boolean(w.photos?.cover);
}

export function PhotoHero({ w }: { w: Wedding }) {
  const skin = useSkin();
  const cover = w.photos.cover!;
  const main = mainEvent(w);

  // Ngà: giữ khung tranh màu nước, thêm ảnh cưới trong khung oval viền kép.
  if (skin === "botanical")
    return (
      <div className="ph ph--botanical">
        <figure className="ph-oval">
          <Img photo={cover} sizes="240px" eager />
        </figure>
        <div className="hero-copy">
          <p className="eyebrow">Lễ thành hôn của</p>
          <h1>
            {w.groom.short} <span>&amp;</span> {w.bride.short}
          </h1>
          <p className="hero-date">{longDate(main.start)}</p>
          <p className="script">{lunar(main.start)}</p>
        </div>
      </div>
    );

  if (skin === "song-hy")
    return (
      <div className="ph ph--song-hy">
        <div className="ph-dome">
          <p className="ph-kicker">Trân trọng báo hỷ</p>
          <div className="ph-names">
            <p>
              <small>Chú rể</small>
              {w.groom.short}
            </p>
            <HyGlyph className="ph-hy" />
            <p>
              <small>Cô dâu</small>
              {w.bride.short}
            </p>
          </div>
          <ArcText text="Trăm năm hạnh phúc" id="arc-song-hy" />
        </div>
        <figure className="ph-arch">
          <Img photo={cover} sizes="(max-width: 640px) 80vw, 420px" eager />
        </figure>
        <p className="ph-date">{longDate(main.start)}</p>
        <p className="script">{lunar(main.start)}</p>
      </div>
    );

  // Đêm Sao: ảnh cưới cài nghiêng trong phong bì xanh đêm, tên lớn với "&" viết tay phía sau.
  if (skin === "dem-sao")
    return (
      <div className="ph ph--dem-sao">
        <StarField className="ph-stars" />
        <p className="ph-std">Save the date</p>
        <div className="ph-env">
          <span className="ph-env-back" aria-hidden="true" />
          <figure className="ph-env-photo">
            <Img photo={cover} sizes="(max-width: 640px) 70vw, 340px" eager />
          </figure>
          <svg className="ph-env-front" viewBox="0 0 400 220" preserveAspectRatio="none" aria-hidden="true">
            <path d="M0 0 L200 120 L400 0 V220 H0 Z" fill="var(--t-cover)" />
            <path d="M0 0 L200 120 L400 0" fill="none" stroke="var(--t-accent)" strokeWidth="1.4" opacity=".8" />
            <path d="M0 220 L170 108 M400 220 L230 108" fill="none" stroke="var(--t-accent)" strokeWidth=".8" opacity=".35" />
          </svg>
          <StarSealMini />
          <Crescent className="ph-env-moon" />
        </div>
        <h1 className="ph-big-names">
          <span>{w.groom.short}</span>
          <span>{w.bride.short}</span>
          <i aria-hidden="true">&amp;</i>
        </h1>
        <p className="hero-date">{longDate(main.start)}</p>
        <p className="script">{lunar(main.start)}</p>
      </div>
    );

  // Tối Giản: bố cục tạp chí — ảnh một bên, chữ một bên.
  const d = dateParts(main.start);
  return (
    <div className="ph ph--toi-gian">
      <figure className="ph-photo">
        <Img photo={cover} sizes="(max-width: 760px) 100vw, 50vw" eager />
        <figcaption>
          Số đặc biệt · {String(d.d).padStart(2, "0")}.{String(d.m).padStart(2, "0")}.{d.y}
        </figcaption>
      </figure>
      <div className="ph-copy">
        <p className="eyebrow">The Wedding of</p>
        <h1>
          {w.groom.short}
          <span>&amp;</span>
          {w.bride.short}
        </h1>
        <div className="ph-rule" />
        <p className="hero-date">{longDate(main.start)}</p>
        <p className="script">{lunar(main.start)}</p>
        <p className="ph-city">{w.city}</p>
      </div>
    </div>
  );
}

/* ============================================================
   Lịch tháng — đánh dấu ngày cưới
   ============================================================ */

/** Lưới lịch tháng có trái tim đánh dấu ngày cưới. */
export function MonthGrid({ iso, title }: { iso: string; title?: string }) {
  const { y, m, d } = dateParts(iso);
  const first = new Date(Date.UTC(y, m - 1, 1)).getUTCDay(); // 0 = CN
  const lead = (first + 6) % 7; // tuần bắt đầu từ Thứ Hai
  const days = new Date(Date.UTC(y, m, 0)).getUTCDate();
  const cells = [...Array(lead).fill(0), ...Array.from({ length: days }, (_, i) => i + 1)];
  return (
    <div className="cal-card">
      <p className="cal-month">{title ?? `Tháng ${m} / ${y}`}</p>
      <div className="cal-grid" role="grid" aria-label={`Lịch tháng ${m} năm ${y}`}>
        {["T2", "T3", "T4", "T5", "T6", "T7", "CN"].map((n) => (
          <span key={n} className="cal-head" role="columnheader">
            {n}
          </span>
        ))}
        {cells.map((n, i) =>
          n === 0 ? (
            <span key={`e${i}`} />
          ) : (
            <span key={n} role="gridcell" className={n === d ? "is-day" : undefined} aria-current={n === d ? "date" : undefined}>
              {n === d && (
                <svg viewBox="0 0 24 22" aria-hidden="true">
                  <path d="M12 21 C 5 15 1 11 1 6.5 A 5.5 5.5 0 0 1 12 4 A 5.5 5.5 0 0 1 23 6.5 C 23 11 19 15 12 21 Z" />
                </svg>
              )}
              <i>{n}</i>
            </span>
          ),
        )}
      </div>
    </div>
  );
}

export function WeddingCalendar({ w }: { w: Wedding }) {
  const main = mainEvent(w);
  const { y, m, d, weekday } = dateParts(main.start);
  return (
    <section className="cal section" aria-label="Ngày cưới">
      <h2 className="sec-title">Lưu ngày vui</h2>
      <div className="cal-date">
        <span>{weekday}</span>
        <b>{String(d).padStart(2, "0")}</b>
        <span>Tháng {String(m).padStart(2, "0")}</span>
      </div>
      <p className="cal-year">{y}</p>
      <p className="script">({lunar(main.start)})</p>
      <MonthGrid iso={main.start} />
    </section>
  );
}

/* ============================================================
   Album — bố cục theo skin + xem ảnh lớn
   ============================================================ */

function Lightbox({ photos, index, onClose, onMove }: { photos: Photo[]; index: number; onClose: () => void; onMove: (i: number) => void }) {
  const ref = useRef<HTMLDialogElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (el && !el.open) el.showModal();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") onMove((index + 1) % photos.length);
      if (e.key === "ArrowLeft") onMove((index - 1 + photos.length) % photos.length);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [index, photos.length, onMove]);
  const p = photos[index];
  return (
    <dialog ref={ref} className="lightbox" onClose={onClose} onClick={(e) => e.target === e.currentTarget && onClose()} aria-label="Xem ảnh">
      <Img photo={p} sizes="100vw" eager />
      <p className="lightbox-count">
        {index + 1} / {photos.length}
      </p>
      <button type="button" className="lightbox-btn lightbox-prev" aria-label="Ảnh trước" onClick={() => onMove((index - 1 + photos.length) % photos.length)}>
        ‹
      </button>
      <button type="button" className="lightbox-btn lightbox-next" aria-label="Ảnh sau" onClick={() => onMove((index + 1) % photos.length)}>
        ›
      </button>
      <button type="button" className="lightbox-close" aria-label="Đóng" onClick={() => ref.current?.close()}>
        ×
      </button>
    </dialog>
  );
}

/** Băng chuyền ảnh: ảnh ở giữa to và thẳng, hai bên nghiêng vào trong (Song Hỷ). */
/** Thời gian mỗi ảnh đứng yên trước khi tự chuyển (ms). */
const AUTOPLAY_MS = 3800;
/** Băng chuyền Lụa Đỏ chạy nhanh hơn các album khác. */
const COVERFLOW_MS = 2400;
/** Trình chiếu Đêm Sao. */
const CINEMA_MS = 2600;

/**
 * Băng chuyền ảnh: ảnh ở giữa to và thẳng, hai bên nghiêng vào trong (Song Hỷ).
 * Tự chạy; dừng khi khách rê chuột/chạm vào, đang xem ảnh lớn, hoặc băng chuyền không nằm trên màn hình.
 */
function Coverflow({ photos, onOpen, paused = false }: { photos: Photo[]; onOpen: (i: number) => void; paused?: boolean }) {
  const track = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(Math.floor(photos.length / 2));
  const activeRef = useRef(Math.floor(photos.length / 2));
  const [holding, setHolding] = useState(false);
  const [visible, setVisible] = useState(false);
  const [reduced, setReduced] = useState(false);
  const resumeTimer = useRef<ReturnType<typeof setTimeout>>(undefined);

  const update = useCallback(() => {
    const el = track.current;
    if (!el) return;
    const mid = el.scrollLeft + el.clientWidth / 2;
    let best = 0;
    let bestDist = Infinity;
    [...el.children].forEach((c, i) => {
      const item = c as HTMLElement;
      const center = item.offsetLeft + item.offsetWidth / 2;
      const dist = (center - mid) / item.offsetWidth;
      item.style.setProperty("--d", String(Math.max(-2, Math.min(2, dist))));
      if (Math.abs(dist) < bestDist) {
        bestDist = Math.abs(dist);
        best = i;
      }
    });
    activeRef.current = best;
    setActive(best);
  }, []);

  // Mặc định đứng ở ảnh giữa album: hai bên đều có ảnh nghiêng, nhìn cân đối ngay từ đầu.
  useLayoutEffect(() => {
    const el = track.current;
    const mid = el?.children[Math.floor(photos.length / 2)] as HTMLElement | undefined;
    if (!el || !mid) return;
    el.scrollLeft = mid.offsetLeft - (el.clientWidth - mid.offsetWidth) / 2;
  }, [photos.length]);

  useEffect(() => {
    update();
    const el = track.current;
    let raf = 0;
    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(update);
    };
    el?.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      el?.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      cancelAnimationFrame(raf);
    };
  }, [update]);

  // Chỉ tự chạy khi băng chuyền đang hiện trên màn hình.
  useEffect(() => {
    const el = track.current;
    if (!el || !window.IntersectionObserver) return;
    const io = new IntersectionObserver(([e]) => setVisible(e.isIntersecting), { threshold: 0.35 });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => setReduced(mq.matches);
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);

  /** Cuộn ngang tới ảnh i — không dùng scrollIntoView để trang không bị kéo lên/xuống khi tự chạy. */
  const go = useCallback((i: number) => {
    const el = track.current;
    const item = el?.children[i] as HTMLElement | undefined;
    if (!el || !item) return;
    el.scrollTo({ left: item.offsetLeft - (el.clientWidth - item.offsetWidth) / 2, behavior: "smooth" });
  }, []);

  const running = !paused && !holding && visible && !reduced && photos.length > 1;

  useEffect(() => {
    if (!running) return;
    const id = setInterval(() => {
      if (document.hidden) return;
      go((activeRef.current + 1) % photos.length);
    }, COVERFLOW_MS);
    return () => clearInterval(id);
  }, [running, go, photos.length, active]);

  // Chạm/vuốt trên điện thoại: dừng, rồi tự chạy lại sau vài giây.
  const hold = () => {
    clearTimeout(resumeTimer.current);
    setHolding(true);
  };
  const release = (delay = 0) => {
    clearTimeout(resumeTimer.current);
    resumeTimer.current = setTimeout(() => setHolding(false), delay);
  };
  useEffect(() => () => clearTimeout(resumeTimer.current), []);

  return (
    <div
      className={`flow${running ? " is-running" : ""}`}
      style={{ "--autoplay": `${COVERFLOW_MS}ms` } as React.CSSProperties}
      onPointerEnter={(e) => e.pointerType === "mouse" && hold()}
      onPointerLeave={(e) => e.pointerType === "mouse" && release()}
      onTouchStart={hold}
      onTouchEnd={() => release(4000)}
      onFocus={hold}
      onBlur={() => release()}
    >
      <div ref={track} className="flow-track" aria-roledescription="băng chuyền" aria-label="Album ảnh cưới">
        {photos.map((p, i) => (
          <button
            key={p.src + i}
            type="button"
            className="flow-item"
            onClick={() => (i === active ? onOpen(i) : go(i))}
            aria-label={`Ảnh ${i + 1} / ${photos.length}${p.alt ? `: ${p.alt}` : ""}`}
          >
            <Img photo={p} sizes="(max-width: 640px) 70vw, 360px" eager />
          </button>
        ))}
      </div>
      <div className="flow-dots" role="tablist" aria-label="Chọn ảnh">
        {photos.map((_, i) => (
          <button
            key={i === active ? `on-${active}` : i}
            type="button"
            role="tab"
            aria-selected={i === active}
            aria-label={`Ảnh ${i + 1}`}
            onClick={() => go(i)}
          />
        ))}
      </div>
    </div>
  );
}

/* ---------- Tự chạy dùng chung cho các kiểu album ---------- */

/**
 * Chỉ số ảnh đang hiện + tự chuyển. Dừng khi khách rê chuột/chạm, đang xem ảnh lớn,
 * album ra khỏi màn hình, tab bị ẩn hoặc người xem bật "giảm chuyển động".
 */
function useAutoplay(count: number, paused: boolean, ms = AUTOPLAY_MS) {
  const ref = useRef<HTMLDivElement>(null);
  const [index, setIndex] = useState(0);
  const [holding, setHolding] = useState(false);
  const [visible, setVisible] = useState(false);
  const [reduced, setReduced] = useState(false);
  const resume = useRef<ReturnType<typeof setTimeout>>(undefined);

  useEffect(() => {
    const el = ref.current;
    if (!el || !window.IntersectionObserver) return;
    const io = new IntersectionObserver(([e]) => setVisible(e.isIntersecting), { threshold: 0.35 });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => setReduced(mq.matches);
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);

  const running = !paused && !holding && visible && !reduced && count > 1;

  useEffect(() => {
    if (!running) return;
    const id = setTimeout(() => !document.hidden && setIndex((i) => (i + 1) % count), ms);
    return () => clearTimeout(id);
  }, [running, index, count, ms]);

  useEffect(() => () => clearTimeout(resume.current), []);

  const hold = () => {
    clearTimeout(resume.current);
    setHolding(true);
  };
  const release = (delay = 0) => {
    clearTimeout(resume.current);
    resume.current = setTimeout(() => setHolding(false), delay);
  };

  const bind = {
    ref,
    onPointerEnter: (e: React.PointerEvent) => e.pointerType === "mouse" && hold(),
    onPointerLeave: (e: React.PointerEvent) => e.pointerType === "mouse" && release(),
    onTouchStart: hold,
    onTouchEnd: () => release(4000),
    onFocus: hold,
    onBlur: () => release(),
    style: { "--autoplay": `${ms}ms` } as React.CSSProperties,
  };

  const go = (i: number) => setIndex(((i % count) + count) % count);
  return { index, go, running, bind };
}

function Dots({ count, index, go }: { count: number; index: number; go: (i: number) => void }) {
  return (
    <div className="flow-dots" role="tablist" aria-label="Chọn ảnh">
      {Array.from({ length: count }, (_, i) => (
        <button key={i === index ? `on-${index}` : i} type="button" role="tab" aria-selected={i === index} aria-label={`Ảnh ${i + 1}`} onClick={() => go(i)} />
      ))}
    </div>
  );
}

/** Ngà Botanical: chồng ảnh polaroid — tấm trên cùng bay ra rồi luồn xuống dưới. */
function PolaroidDeck({ photos, onOpen, paused }: { photos: Photo[]; onOpen: (i: number) => void; paused: boolean }) {
  const { index, go, running, bind } = useAutoplay(photos.length, paused);
  const n = photos.length;
  return (
    <div className={`deck${running ? " flow is-running" : " flow"}`} {...bind}>
      <div className="deck-stage">
        {photos.map((p, i) => {
          const pos = (i - index + n) % n;
          return (
            <button
              key={p.src + i}
              type="button"
              className={`deck-card${pos === 0 ? " is-top" : ""}${pos === n - 1 ? " is-out" : ""}${pos > 3 && pos < n - 1 ? " is-hidden" : ""}`}
              style={{ "--pos": pos, "--r": `${((i * 47) % 11) - 5}deg`, zIndex: n - pos } as React.CSSProperties}
              onClick={() => (pos === 0 ? onOpen(i) : go(i))}
              aria-label={`Ảnh ${i + 1} / ${n}${p.alt ? `: ${p.alt}` : ""}`}
              tabIndex={pos === 0 ? 0 : -1}
            >
              <Img photo={p} sizes="(max-width: 640px) 80vw, 420px" eager={pos < 3} />
              {p.alt && <span className="album-cap">{p.alt}</span>}
            </button>
          );
        })}
      </div>
      <div className="deck-nav">
        <button type="button" aria-label="Ảnh trước" onClick={() => go(index - 1)}>
          ‹
        </button>
        <Dots count={n} index={index} go={go} />
        <button type="button" aria-label="Ảnh sau" onClick={() => go(index + 1)}>
          ›
        </button>
      </div>
    </div>
  );
}

/** Đêm Sao: trình chiếu điện ảnh — ảnh mờ dần chuyển cảnh, phóng chậm, chú thích viết tay. */
function CinemaSlides({ photos, onOpen, paused }: { photos: Photo[]; onOpen: (i: number) => void; paused: boolean }) {
  const { index, go, running, bind } = useAutoplay(photos.length, paused, CINEMA_MS);
  const p = photos[index];
  return (
    <div className={`cinema flow${running ? " is-running" : ""}`} {...bind}>
      <button type="button" className="cinema-stage" onClick={() => onOpen(index)} aria-label={`Xem lớn ảnh ${index + 1}`}>
        {photos.map((ph, i) => (
          <span key={ph.src + i} className={`cinema-slide${i === index ? " is-on" : ""}`} aria-hidden={i !== index}>
            <Img photo={ph} sizes="(max-width: 760px) 100vw, 980px" eager={Math.abs(i - index) <= 1} />
          </span>
        ))}
        <span className="cinema-shade" aria-hidden="true" />
        <span className="cinema-count">
          {String(index + 1).padStart(2, "0")} / {String(photos.length).padStart(2, "0")}
        </span>
        {p.alt && (
          <span key={index} className="cinema-cap">
            {p.alt}
          </span>
        )}
      </button>
      <div className="cinema-thumbs" role="tablist" aria-label="Chọn ảnh">
        {photos.map((ph, i) => (
          <button key={ph.src + i} type="button" role="tab" aria-selected={i === index} aria-label={`Ảnh ${i + 1}`} onClick={() => go(i)}>
            <Img photo={ph} sizes="80px" />
          </button>
        ))}
      </div>
    </div>
  );
}

/** Tối Giản: dải phim ngang tự trượt, khung đang chọn nổi rõ, đánh số kiểu tạp chí. */
function Filmstrip({ photos, onOpen, paused }: { photos: Photo[]; onOpen: (i: number) => void; paused: boolean }) {
  const { index, go, running, bind } = useAutoplay(photos.length, paused, 3200);
  return (
    <div className={`film flow${running ? " is-running" : ""}`} {...bind}>
      <div className="film-track" style={{ "--i": index } as React.CSSProperties}>
        {photos.map((p, i) => (
          <button
            key={p.src + i}
            type="button"
            className={`film-frame${i === index ? " is-on" : ""}`}
            onClick={() => (i === index ? onOpen(i) : go(i))}
            aria-label={`Ảnh ${i + 1}${p.alt ? `: ${p.alt}` : ""}`}
          >
            <Img photo={p} sizes="(max-width: 640px) 70vw, 380px" eager={Math.abs(i - index) <= 2} />
            <span className="album-no">
              {String(i + 1).padStart(2, "0")} — {p.alt}
            </span>
          </button>
        ))}
      </div>
      <div className="film-bar" aria-hidden="true">
        <span style={{ width: `${((index + 1) / photos.length) * 100}%` }} />
      </div>
    </div>
  );
}

export function Album({ w }: { w: Wedding }) {
  const skin = useSkin();
  const photos = w.photos?.album ?? [];
  const [open, setOpen] = useState<number | null>(null);
  const close = useCallback(() => setOpen(null), []);
  if (!photos.length) return null;

  const paused = open !== null;
  const view =
    skin === "song-hy" ? (
      <Coverflow photos={photos} onOpen={setOpen} paused={paused} />
    ) : skin === "dem-sao" ? (
      <CinemaSlides photos={photos} onOpen={setOpen} paused={paused} />
    ) : skin === "toi-gian" ? (
      <Filmstrip photos={photos} onOpen={setOpen} paused={paused} />
    ) : (
      <PolaroidDeck photos={photos} onOpen={setOpen} paused={paused} />
    );

  return (
    <section id="album" className={`album section album--${skin}`}>
      <p className="script">Những khoảnh khắc của chúng mình</p>
      <h2 className="sec-title">Album ảnh cưới</h2>
      {view}
      {w.photos.credit && <p className="album-credit">{w.photos.credit}</p>}
      {open !== null && <Lightbox photos={photos} index={open} onClose={close} onMove={setOpen} />}
    </section>
  );
}

/* ============================================================
   Giới thiệu cô dâu & chú rể — ảnh chân dung riêng
   ============================================================ */

function Portrait({ person, photo, role, parents }: { person: Person; photo?: Photo; role: string; parents: string }) {
  return (
    <div className="cp-person">
      {photo && (
        <figure className="cp-frame">
          <Img photo={photo} sizes="(max-width: 640px) 60vw, 300px" />
        </figure>
      )}
      <div className="cp-copy">
        <p className="cp-role">{person.title || role}</p>
        <p className="cp-name">{person.short}</p>
        <p className="cp-full">{person.name}</p>
        {parents && <p className="cp-parents">{parents}</p>}
      </div>
    </div>
  );
}

export function CoupleIntro({ w }: { w: Wedding }) {
  const skin = useSkin();
  const [fGroom, fBride] = w.families;
  const parents = (f: typeof fGroom) => [f.father, f.mother].filter(Boolean).join(" · ");
  if (!w.photos?.groom && !w.photos?.bride) return null;
  return (
    <section className={`couple section couple--${skin}`} aria-label="Cô dâu và chú rể">
      <p className="script">Chuyện của chúng mình</p>
      <h2 className="sec-title">Cô dâu &amp; chú rể</h2>
      <div className="cp-pair">
        <Portrait person={w.groom} photo={w.photos.groom} role="Chú rể" parents={parents(fGroom)} />
        <span className="cp-amp" aria-hidden="true">
          &amp;
        </span>
        <Portrait person={w.bride} photo={w.photos.bride} role="Cô dâu" parents={parents(fBride)} />
      </div>
    </section>
  );
}
