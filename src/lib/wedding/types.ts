/** Cấu trúc dữ liệu của một tấm thiệp. Giao diện chỉ đọc từ đây — đổi dữ liệu là đổi thiệp. */

/** `title`: danh xưng trong gia đình — "Trưởng nam", "Út nữ"… (không bắt buộc). */
export type Person = { name: string; short: string; title?: string };

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

/** Ảnh cưới. `src` là đường dẫn tuyệt đối (https://…) hoặc ảnh tĩnh của site (/thiep/…). */
/**
 * `focus`: điểm giữ lại khi cắt ảnh vào khung (object-position), ví dụ "30% 40%".
 * `zoom`: phóng to quanh `focus` khi đặt vào khung chân dung (1 = giữ nguyên).
 */
export type Photo = { src: string; width: number; height: number; alt?: string; focus?: string; zoom?: number };

export type Wedding = {
  slug: string;
  demo?: boolean;
  /** Mã mẫu thiệp (lib/templates/registry), ví dụ "lua-do-do". Thiếu thì dùng mẫu mặc định. */
  template?: string;
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
  /** Ảnh bìa + album. Thiệp chưa có ảnh vẫn hiển thị đủ, chỉ ẩn phần ảnh. */
  photos: { cover?: Photo; groom?: Photo; bride?: Photo; album: Photo[]; credit?: string };
};
