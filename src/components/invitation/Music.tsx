"use client";

import { forwardRef, useCallback, useEffect, useImperativeHandle, useRef, useState } from "react";

export type MusicHandle = { startOnOpen: () => void };
const PREF = "duyen:music";
const SRC = "/thiep/audio/canon-in-d-major-web.mp3";

const Icon = ({ state }: { state: "on" | "off" | "loading" }) => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" className={state === "loading" ? "music-spinner" : undefined}>
    {state === "loading" ? (
      <path d="M21 12a9 9 0 1 1-6.2-8.6" />
    ) : (
      <>
        <path d="M11 5 6 9H3v6h3l5 4V5z" />
        {state === "on" ? <path d="M15.5 8.5a5 5 0 0 1 0 7M18.5 5.5a9 9 0 0 1 0 13" /> : <path d="m17 9 5 6m0-6-5 6" />}
      </>
    )}
  </svg>
);

/** Nhạc nền: chỉ phát khi khách bấm mở thiệp, nhớ lựa chọn tắt nhạc trên thiết bị. */
export const Music = forwardRef<MusicHandle>(function Music(_, ref) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const enabled = useRef(true);
  const wanted = useRef(false);
  const requestId = useRef(0);
  const [playing, setPlaying] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    try {
      enabled.current = localStorage.getItem(PREF) !== "false";
    } catch {}
    const audio = audioRef.current;
    if (audio) audio.volume = 0.28;
    return () => {
      // eslint-disable-next-line react-hooks/exhaustive-deps -- bộ đếm, không phải DOM node
      requestId.current++;
      wanted.current = false;
      audio?.pause();
    };
  }, []);

  const play = useCallback(async () => {
    const audio = audioRef.current;
    if (!audio || (wanted.current && !audio.paused)) return;
    const id = ++requestId.current;
    wanted.current = true;
    setLoading(true);
    setMessage("");
    audio.volume = 0.28;
    if (audio.error) audio.load();
    try {
      await audio.play();
      if (id !== requestId.current) return;
      setPlaying(!audio.paused);
      setLoading(false);
    } catch (error) {
      if (id !== requestId.current) return;
      wanted.current = false;
      setPlaying(false);
      setLoading(false);
      setMessage(
        error instanceof DOMException && error.name === "NotAllowedError"
          ? "Chạm vào nút nhạc để bật."
          : "Chưa tải được nhạc. Chạm để thử lại.",
      );
    }
  }, []);

  useImperativeHandle(ref, () => ({ startOnOpen: () => enabled.current && void play() }), [play]);

  function toggle() {
    const next = !wanted.current;
    enabled.current = next;
    try {
      localStorage.setItem(PREF, String(next));
    } catch {}
    if (next) return void play();
    requestId.current++;
    wanted.current = false;
    audioRef.current?.pause();
    setPlaying(false);
    setLoading(false);
    setMessage("");
  }

  const state = loading ? "loading" : playing ? "on" : "off";
  return (
    <>
      <audio
        ref={audioRef}
        src={SRC}
        preload="none"
        loop
        onPlaying={() => {
          if (!wanted.current) return audioRef.current?.pause();
          setPlaying(true);
          setLoading(false);
          setMessage("");
        }}
        onPause={() => {
          wanted.current = false;
          setPlaying(false);
          setLoading(false);
        }}
        onWaiting={() => wanted.current && setLoading(true)}
        onError={() => {
          requestId.current++;
          wanted.current = false;
          setPlaying(false);
          setLoading(false);
          setMessage("Chưa tải được nhạc. Chạm để thử lại.");
        }}
      />
      <div className="wedding-music">
        {message && (
          <p className="music-message" role="status">
            {message}
          </p>
        )}
        <button
          type="button"
          className={`music-toggle ${playing ? "music-playing" : ""}`}
          onClick={toggle}
          aria-pressed={playing}
          aria-label={loading ? "Huỷ tải nhạc" : playing ? "Tắt nhạc nền" : "Bật nhạc nền"}
        >
          <Icon state={state} />
          <span>{loading ? "Đang tải…" : playing ? "Đang phát nhạc" : "Nhạc nền"}</span>
        </button>
      </div>
    </>
  );
});
