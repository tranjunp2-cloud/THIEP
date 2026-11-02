import { z } from "zod";
import type { TimelineItem, Wedding } from "./types";

/**
 * Dữ liệu người dùng nhập ở trang tạo thiệp. Được kiểm tra ở cả trình duyệt và server,
 * lưu nguyên dạng này, rồi chuyển thành `Wedding` khi hiển thị.
 */

const text = (max: number) => z.string().trim().max(max);
const required = (max: number) => z.string().trim().min(1, "Vui lòng điền").max(max);
const DATE = /^\d{4}-\d{2}-\d{2}$/;
const TIME = /^([01]\d|2[0-3]):[0-5]\d$/;

export const EVENT_TITLES = ["Lễ Vu Quy", "Lễ Tân Hôn", "Lễ Thành Hôn", "Tiệc Cưới", "Tiệc Báo Hỷ"] as const;
const SIDES = ["Nhà trai", "Nhà gái"] as const;

const person = z.object({ name: required(80), short: required(40) });

export const weddingInputSchema = z.object({
  groom: person,
  bride: person,
  city: required(60),
  families: z
    .array(z.object({ father: text(80), mother: text(80), address: text(120) }))
    .length(2),
  events: z
    .array(
      z.object({
        title: z.enum(EVENT_TITLES),
        subtitle: text(80),
        date: z.string().regex(DATE, "Ngày không hợp lệ"),
        start: z.string().regex(TIME, "Giờ không hợp lệ"),
        end: z.string().regex(TIME, "Giờ không hợp lệ"),
        venue: required(100),
        address: required(160),
        note: text(300),
      }),
    )
    .min(1)
    .max(3),
  mainIndex: z.number().int().min(0).max(2),
  timeline: z
    .array(z.object({ time: z.string().regex(TIME, "Giờ không hợp lệ"), title: required(60), detail: text(120) }))
    .max(6),
  dress: z.object({ title: text(40), note: text(240) }),
  gifts: z.object({
    message: text(300),
    accounts: z
      .array(z.object({ side: z.enum(SIDES), bank: required(60), number: required(30), holder: required(60) }))
      .max(2),
  }),
  faqs: z.array(z.object({ q: required(140), a: required(500) })).max(8),
  rsvpDeadline: z.string().regex(DATE, "Ngày không hợp lệ"),
  guests: z
    .array(
      z.object({
        key: z.string().regex(/^[a-z0-9-]{1,60}$/),
        name: required(80),
        tone: z.enum(["elder", "peer"]),
        side: z.enum(SIDES),
      }),
    )
    .max(500),
});

export type WeddingInput = z.infer<typeof weddingInputSchema>;

/* ---------- Tiện ích ---------- */

export function slugify(s: string) {
  return s
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[đĐ]/g, "d")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 40);
}

/** Khoá link khách không trùng nhau: "co-lan", "co-lan-2"… */
export function uniqueGuestKey(name: string, taken: Set<string>) {
  const base = slugify(name) || "khach";
  let key = base;
  for (let i = 2; taken.has(key); i++) key = `${base}-${i}`;
  return key;
}

const ART: TimelineItem["art"][] = ["chapel", "rings", "cocktail", "disco", "champagne"];
const PALETTE = ["#efe7d6", "#d9c9a8", "#a4ad8b", "#6f7f5c", "#2f4a37"];
const initial = (short: string) => (short.trim().split(/\s+/).pop() ?? "").charAt(0).toUpperCase();
const dmy = (iso: string) => iso.split("-").reverse().join("/");

export function toWedding(slug: string, input: WeddingInput, demo = false): Wedding {
  const events = input.events.map((e, i) => ({
    id: `su-kien-${i + 1}`,
    title: e.title,
    subtitle: e.subtitle,
    start: `${e.date}T${e.start}:00+07:00`,
    end: `${e.date}T${e.end < e.start ? e.start : e.end}:00+07:00`,
    venue: e.venue,
    address: e.address,
    note: e.note || undefined,
  }));
  const seen = new Set<string>();
  return {
    slug,
    demo,
    groom: input.groom,
    bride: input.bride,
    monogram: `${initial(input.groom.short)} & ${initial(input.bride.short)}`,
    city: input.city,
    mainEvent: events[Math.min(input.mainIndex, events.length - 1)].id,
    families: [
      { side: "Nhà trai", ...input.families[0] },
      { side: "Nhà gái", ...input.families[1] },
    ],
    events,
    timeline: input.timeline.map((t, i) => ({ ...t, art: ART[i % ART.length] })),
    dress: { ...input.dress, palette: PALETTE },
    gifts: input.gifts,
    faqs: input.faqs,
    rsvpDeadline: dmy(input.rsvpDeadline),
    guests: input.guests.map((g) => {
      const key = seen.has(g.key) ? uniqueGuestKey(g.key, seen) : g.key;
      seen.add(key);
      return { ...g, key };
    }),
  };
}
