"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import "./site-music.css";

/**
 * Nhạc nền chung của trang SayIDo (landing, tạo thiệp, quản lý).
 * - Trình duyệt chặn tự phát có tiếng: nhạc bắt đầu ở lần chạm / bấm phím đầu tiên, tăng âm lượng từ từ.
 * - Nhớ lựa chọn bật/tắt (localStorage) và vị trí đang phát (sessionStorage) khi chuyển trang.
 * - Tạm dừng khi chuyển sang tab khác.
 * Trang thiệp cưới không dùng component này vì đã có nhạc riêng của cô dâu chú rể.
 */

const SRC = "/audio/gymnopedie-no-1-web.mp3";
const PREF = "duyen:site-music"; // "off" = người dùng đã tắt
const POS = "duyen:site-music-pos";
const VOLUME = 0.22;

const store = {
  get(s: Storage | undefined, k: string) {
    try {
      return s?.getItem(k) ?? null;
    } catch {
      return null;
    }
  },
  set(s: Storage | undefined, k: string, v: string) {
    try {
      s?.setItem(k, v);
    } catch {}
  },
};

export function SiteMusic() {
  const audioRef = useRef<HTMLAudioElement>(null);
  const fadeRef = useRef<number>(0);
  const wantRef = useRef(false); // người dùng muốn nghe (chưa tắt)
  const pausedByTab = useRef(false);
  const [playing, setPlaying] = useState(false);
  const [hint, setHint] = useState(false);

  const fadeTo = useCallback((target: number, ms: number, done?: () => void) => {
    const a = audioRef.current;
    if (!a) return;
    cancelAnimationFrame(fadeRef.current);
    const from = a.volume;
    const t0 = performance.now();
    const step = (t: number) => {
      // Mốc thời gian của khung hình có thể sớm hơn t0 → kẹp k trong [0, 1].
      const k = Math.max(0, Math.min(1, (t - t0) / ms));
      a.volume = Math.max(0, Math.min(1, from + (target - from) * k));
      if (k < 1) fadeRef.current = requestAnimationFrame(step);
      else done?.();
    };
    fadeRef.current = requestAnimationFrame(step);
  }, []);

  const start = useCallback(async () => {
    const a = audioRef.current;
    if (!a || !a.paused) return true;
    a.volume = 0;
    try {
      await a.play();
      fadeTo(VOLUME, 2200);
      return true;
    } catch {
      return false;
    }
  }, [fadeTo]);

  const stop = useCallback(() => {
    const a = audioRef.current;
    if (!a || a.paused) return;
    fadeTo(0, 500, () => a.pause());
  }, [fadeTo]);

  useEffect(() => {
    const a = audioRef.current!;
    const local = typeof window !== "undefined" ? window.localStorage : undefined;
    const session = typeof window !== "undefined" ? window.sessionStorage : undefined;
    wantRef.current = store.get(local, PREF) !== "off";

    const savedPos = Number(store.get(session, POS));
    const restore = () => {
      if (savedPos > 0 && savedPos < a.duration - 1) a.currentTime = savedPos;
    };
    // Thông tin file có thể đã tải xong trước khi effect chạy.
    if (a.readyState >= 1) restore();
    else a.addEventListener("loadedmetadata", restore, { once: true });

    // Lần tương tác đầu tiên mở khoá âm thanh.
    const onGesture = (e: Event) => {
      if ((e.target as Element | null)?.closest?.(".site-music")) return; // nút nhạc tự xử lý
      if (wantRef.current) void start();
      remove();
    };
    const events = ["pointerdown", "keydown", "touchend"] as const;
    const remove = () => events.forEach((ev) => window.removeEventListener(ev, onGesture, true));
    const timers: ReturnType<typeof setTimeout>[] = [];
    if (wantRef.current) {
      events.forEach((ev) => window.addEventListener(ev, onGesture, { capture: true, passive: true }));
      // Nếu trình duyệt đã cho phép (vd. vừa nghe ở trang trước), thử phát ngay.
      void start().then((ok) => ok && remove());
      timers.push(setTimeout(() => setHint(true), 2500), setTimeout(() => setHint(false), 9000));
    }

    // Lưu vị trí để trang sau phát tiếp.
    const savePos = () => store.set(session, POS, String(a.currentTime || 0));
    const id = setInterval(() => !a.paused && savePos(), 2000);
    window.addEventListener("pagehide", savePos);

    const onVisibility = () => {
      if (document.hidden && !a.paused) {
        pausedByTab.current = true;
        a.pause();
      } else if (!document.hidden && pausedByTab.current && wantRef.current) {
        pausedByTab.current = false;
        void start();
      }
    };
    document.addEventListener("visibilitychange", onVisibility);

    return () => {
      a.removeEventListener("loadedmetadata", restore);
      remove();
      timers.forEach(clearTimeout);
      clearInterval(id);
      savePos();
      window.removeEventListener("pagehide", savePos);
      document.removeEventListener("visibilitychange", onVisibility);
      cancelAnimationFrame(fadeRef.current);
      a.pause();
    };
  }, [start]);

  function toggle() {
    setHint(false);
    const local = window.localStorage;
    if (playing) {
      wantRef.current = false;
      store.set(local, PREF, "off");
      stop();
    } else {
      wantRef.current = true;
      store.set(local, PREF, "on");
      void start();
    }
  }

  return (
    <div className="site-music">
      <audio
        ref={audioRef}
        src={SRC}
        loop
        preload="metadata"
        onPlay={() => setPlaying(true)}
        onPause={() => setPlaying(false)}
      />
      {hint && !playing && (
        <p className="site-music-hint" role="status">
          Chạm bất kỳ đâu để nghe nhạc nền ♪
        </p>
      )}
      <button
        type="button"
        className={`site-music-btn ${playing ? "is-playing" : ""}`}
        onClick={toggle}
        aria-pressed={playing}
        aria-label={playing ? "Tắt nhạc nền" : "Bật nhạc nền"}
        title={playing ? "Tắt nhạc · Gymnopédie No. 1" : "Bật nhạc · Gymnopédie No. 1"}
      >
        <span className="site-music-bars" aria-hidden="true">
          <i />
          <i />
          <i />
          <i />
        </span>
        <span className="site-music-label">{playing ? "Nhạc nền" : "Bật nhạc"}</span>
      </button>
    </div>
  );
}
