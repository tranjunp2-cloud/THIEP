/** Cấu trúc dữ liệu của một tấm thiệp. Giao diện chỉ đọc từ đây — đổi dữ liệu là đổi thiệp. */

export type Person = { name: string; short: string };

export type Family = {
  side: "Nhà trai" | "Nhà gái";
  father: string;
  mother: string;
  address: string;
};

export type WeddingEvent = {
  id: string;
  title: string; // "Lễ Vu Quy", "Tiệc cưới"…
  subtitle: string;
  start: string; // ISO có múi giờ, ví dụ 2026-12-20T11:00:00+07:00
  end: string;
  venue: string;
  address: string;
  note?: string;
};

export type TimelineItem = {
  time: string;
  title: string;
  detail: string;
  art: "chapel" | "rings" | "cocktail" | "disco" | "champagne";
};

export type GiftAccount = {
  side: "Nhà trai" | "Nhà gái";
  bank: string;
  number: string;
  holder: string;
};

/** Cách xưng hô theo vai vế: với người lớn, cô dâu chú rể tự xưng "chúng con". */
export type GuestTone = "elder" | "peer";

export type Guest = {
  key: string; // dùng trong link: ?k=co-lan
  name: string; // "Cô Lan & Chú Hùng"
  tone: GuestTone;
  side: "Nhà trai" | "Nhà gái";
};

export type Wedding = {
  slug: string;
  demo?: boolean;
  groom: Person;
  bride: Person;
  monogram: string; // "Q & M"
  city: string;
  mainEvent: string; // id của sự kiện chính dùng cho đếm ngược
  families: [Family, Family];
  events: WeddingEvent[];
  timeline: TimelineItem[];
  dress: { title: string; note: string; palette: string[] };
  gifts: { message: string; accounts: GiftAccount[] };
  faqs: { q: string; a: string }[];
  rsvpDeadline: string;
  guests: Guest[];
};
