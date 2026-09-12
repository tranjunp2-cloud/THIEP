"use client";

import { forwardRef, useCallback, useEffect, useImperativeHandle, useRef, useState } from "react";
import { LoaderCircle, Volume2, VolumeX } from "lucide-react";

export type WeddingMusicHandle = { startOnOpen: () => void };
const preferenceKey = "wedding-music-enabled";

export const WeddingMusic = forwardRef<WeddingMusicHandle>(function WeddingMusic(_, ref) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const enabled = useRef(true);
  const wanted = useRef(false);
  const requestId = useRef(0);
  const [playing, setPlaying] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    try { enabled.current = localStorage.getItem(preferenceKey) !== "false"; } catch {}
    const audio = audioRef.current;
    if (audio) audio.volume = 0.28;
    return () => { requestId.current++; wanted.current = false; audio?.pause(); };
  }, []);

  const play = useCallback(async () => {
    const audio = audioRef.current;
    if (!audio || (wanted.current && !audio.paused)) return;
    const id = ++requestId.current;
    wanted.current = true;
    setLoading(true);
    setMessage("");
    // Called directly from the opening/toggle gesture, including on mobile Safari.
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
      setMessage(error instanceof DOMException && error.name === "NotAllowedError"
        ? "Tap the music button to start."
        : "Music could not load. Tap to retry.");
    }
  }, []);

  useImperativeHandle(ref, () => ({
    startOnOpen() { if (enabled.current) void play(); },
  }), [play]);

  function toggle() {
    const next = !wanted.current;
    enabled.current = next;
    try { localStorage.setItem(preferenceKey, String(next)); } catch {}
    if (next) { void play(); return; }
    requestId.current++;
    wanted.current = false;
    audioRef.current?.pause();
    setPlaying(false);
    setLoading(false);
    setMessage("");
  }

  return <>
    <audio ref={audioRef} src="/audio/canon-in-d-major.mp3" preload="none" loop
      onPlaying={() => {
        if (!wanted.current) { audioRef.current?.pause(); return; }
        setPlaying(true); setLoading(false); setMessage("");
      }}
      onPause={() => { wanted.current = false; setPlaying(false); setLoading(false); }}
      onWaiting={() => { if (wanted.current) setLoading(true); }}
      onError={() => {
        requestId.current++; wanted.current = false;
        setPlaying(false); setLoading(false);
        setMessage("Music could not load. Tap to retry.");
      }} />
    <div className="wedding-music">
      {message && <p className="music-message" role="status">{message}</p>}
      <button type="button" className={`music-toggle ${playing ? "music-playing" : ""}`}
        onClick={toggle} aria-pressed={playing} aria-label={loading ? "Cancel loading wedding music" : playing ? "Pause wedding music" : "Play wedding music"}
        title={playing ? "Pause music · Canon in D Major" : "Play music · Canon in D Major"}>
        {loading ? <LoaderCircle size={18} className="music-spinner"/> : playing ? <Volume2 size={18}/> : <VolumeX size={18}/>}
        <span>{loading ? "Loading…" : playing ? "Music on" : "Music off"}</span>
      </button>
    </div>
  </>;
});
