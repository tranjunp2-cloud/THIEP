"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { dateParts, longDate, lunar, mainEvent } from "@/lib/wedding/format";
import type { Person, Photo, Wedding } from "@/lib/wedding/types";
import { useSkin } from "./skins";
import { Crescent, HyGlyph, StarField } from "./skins/motifs";

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

  if (skin === "dem-sao")
    return (
      <div className="ph ph--dem-sao">
        <Img photo={cover} className="ph-bg" eager />
        <span className="ph-shade" aria-hidden="true" />
        <StarField className="ph-stars" />
        <Crescent className="ph-moon" />
        <div className="ph-copy">
          <p className="eyebrow">Lễ thành hôn của</p>
          <h1>
            {w.groom.short} <span>&amp;</span> {w.bride.short}
          </h1>
          <p className="hero-date">{longDate(main.start)}</p>
          <p className="script">{lunar(main.start)}</p>
        </div>
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

export function WeddingCalendar({ w }: { w: Wedding }) {
  const main = mainEvent(w);
  const { y, m, d, weekday } = dateParts(main.start);
  const first = new Date(Date.UTC(y, m - 1, 1)).getUTCDay(); // 0 = CN
  const lead = (first + 6) % 7; // tuần bắt đầu từ Thứ Hai
  const days = new Date(Date.UTC(y, m, 0)).getUTCDate();
  const cells = [...Array(lead).fill(0), ...Array.from({ length: days }, (_, i) => i + 1)];

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
      <div className="cal-card">
        <p className="cal-month">
          Tháng {m} / {y}
        </p>
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

/**
 * Băng chuyền ảnh: ảnh ở giữa to và thẳng, hai bên nghiêng vào trong (Song Hỷ).
 * Tự chạy; dừng khi khách rê chuột/chạm vào, đang xem ảnh lớn, hoặc băng chuyền không nằm trên màn hình.
 */
function Coverflow({ photos, onOpen, paused = false }: { photos: Photo[]; onOpen: (i: number) => void; paused?: boolean }) {
  const track = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);
  const activeRef = useRef(0);
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
    }, AUTOPLAY_MS);
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
      style={{ "--autoplay": `${AUTOPLAY_MS}ms` } as React.CSSProperties}
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

export function Album({ w }: { w: Wedding }) {
  const skin = useSkin();
  const photos = w.photos?.album ?? [];
  const [open, setOpen] = useState<number | null>(null);
  const close = useCallback(() => setOpen(null), []);
  if (!photos.length) return null;

  const grid =
    skin === "song-hy" ? (
      <Coverflow photos={photos} onOpen={setOpen} paused={open !== null} />
    ) : (
      <ul className={`album-grid album-grid--${skin}`}>
        {photos.map((p, i) => (
          <li key={p.src + i} style={{ "--r": `${((i * 37) % 7) - 3}deg` } as React.CSSProperties}>
            <button type="button" onClick={() => setOpen(i)} aria-label={`Xem ảnh ${i + 1}${p.alt ? `: ${p.alt}` : ""}`}>
              <Img photo={p} sizes="(max-width: 640px) 50vw, 340px" />
            </button>
            {skin === "toi-gian" && <span className="album-no">{String(i + 1).padStart(2, "0")}</span>}
            {skin === "dem-sao" && p.alt && <span className="album-cap">{p.alt}</span>}
          </li>
        ))}
      </ul>
    );

  return (
    <section id="album" className={`album section album--${skin}`}>
      <p className="script">Những khoảnh khắc của chúng mình</p>
      <h2 className="sec-title">Album ảnh cưới</h2>
      {grid}
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
