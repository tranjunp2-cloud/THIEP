import { lunarPhrase } from "../lunar";
import type { Guest, Wedding, WeddingEvent } from "./types";

const WEEKDAYS = ["Chủ Nhật", "Thứ Hai", "Thứ Ba", "Thứ Tư", "Thứ Năm", "Thứ Sáu", "Thứ Bảy"];

/** Đọc phần ngày giờ địa phương trong chuỗi ISO (+07:00) — không phụ thuộc múi giờ máy khách. */
function parts(iso: string) {
  const [date, time] = iso.split("T");
  const [y, m, d] = date.split("-").map(Number);
  const [hh, mm] = time.split(":");
  const weekday = WEEKDAYS[new Date(Date.UTC(y, m - 1, d)).getUTCDay()];
  return { y, m, d, hh, mm, weekday };
}

const pad = (n: number) => String(n).padStart(2, "0");

/** "Chủ Nhật, 20 tháng 12 năm 2026" */
export const longDate = (iso: string) => {
  const p = parts(iso);
  return `${p.weekday}, ${p.d} tháng ${p.m} năm ${p.y}`;
};

/** "20 · 12 · 2026" */
export const dotDate = (iso: string) => {
  const p = parts(iso);
  return `${pad(p.d)} · ${pad(p.m)} · ${p.y}`;
};

/** "11:00" */
export const time = (iso: string) => {
  const p = parts(iso);
  return `${p.hh}:${p.mm}`;
};

export const lunar = (iso: string) => lunarPhrase(iso);

export const mainEvent = (w: Wedding) => w.events.find((e) => e.id === w.mainEvent) ?? w.events[0];

export const mapsUrl = (e: WeddingEvent) =>
  `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${e.venue}, ${e.address}`)}`;

const icsStamp = (iso: string) => new Date(iso).toISOString().replace(/[-:]/g, "").replace(/\.\d{3}/, "");

export function icsFile(w: Wedding, e: WeddingEvent) {
  const esc = (s: string) => s.replace(/[,;\\]/g, (c) => `\\${c}`);
  return [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//Duyen//Thiep cuoi//VI",
    "BEGIN:VEVENT",
    `UID:${w.slug}-${e.id}@duyen`,
    `DTSTAMP:${icsStamp(e.start)}`,
    `DTSTART:${icsStamp(e.start)}`,
    `DTEND:${icsStamp(e.end)}`,
    `SUMMARY:${esc(`${e.title} · ${w.groom.short} & ${w.bride.short}`)}`,
    `LOCATION:${esc(`${e.venue}, ${e.address}`)}`,
    "END:VEVENT",
    "END:VCALENDAR",
    "",
  ].join("\r\n");
}

/** Cô dâu chú rể tự xưng theo vai vế của khách. */
export const selfRef = (g?: Guest) => (g?.tone === "elder" ? "chúng con" : "chúng mình");
