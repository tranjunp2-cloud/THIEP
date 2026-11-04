/**
 * Kho mẫu thiệp — nguồn dữ liệu duy nhất cho trang chủ, kho mẫu, trang chi tiết, trang tạo thiệp và thiệp thật.
 *
 * Mô hình: dòng mẫu (family) × biến thể màu (variant). Mã mẫu = `${family}-${variant}`, lưu trong dữ liệu thiệp.
 * Thêm một màu = thêm một bộ token. Thêm một dòng mẫu = thêm một skin (bộ hoạ tiết) trong components/invitation/skins.
 */

export type ThemeGroup = "truyen-thong" | "toi-gian" | "hoa-vuon" | "chau-au";
export type ColorGroup = "do" | "xanh-la" | "xanh-duong" | "vang-kim" | "hong" | "trung-tinh";
export type SkinId = "botanical" | "song-hy" | "toi-gian" | "dem-sao" | "sen" | "truc";
export type PriceTier = "co-ban" | "tieu-chuan" | "cao-cap";

/** Phông chữ — biến CSS do app/layout.tsx khai báo (next/font, đều có bộ chữ tiếng Việt). */
export type FontKey = "cormorant" | "great-vibes" | "playfair" | "pinyon" | "josefin" | "lora" | "prata" | "imperial" | "garamond" | "be-vietnam";

export const FONT_VAR: Record<FontKey, string> = {
  cormorant: "var(--font-display), Georgia, serif",
  "great-vibes": "var(--font-script), cursive",
  playfair: "var(--font-playfair), Georgia, serif",
  pinyon: "var(--font-pinyon), cursive",
  josefin: "var(--font-josefin), system-ui, sans-serif",
  lora: "var(--font-lora), Georgia, serif",
  prata: "var(--font-prata), Georgia, serif",
  imperial: "var(--font-imperial), cursive",
  garamond: "var(--font-garamond), Georgia, serif",
  "be-vietnam": "var(--font-sans), system-ui, sans-serif",
};

export type TemplateTokens = {
  /** Nền trang thiệp. */
  bg: string;
  /** Nền phụ (khung bìa, thẻ). */
  paper: string;
  /** Chữ chính. */
  fg: string;
  /** Chữ phụ. */
  muted: string;
  /** Màu nhấn: nút, chấm, hoạ tiết. */
  accent: string;
  /** Đường kẻ, viền. */
  line: string;
  /** Nền cánh cửa / phong bì mở thiệp. */
  cover: string;
  /** Chữ trên cánh cửa / phong bì. */
  coverFg: string;
};

export type TemplateFonts = { heading: FontKey; body: FontKey; script: FontKey };

export type TemplateVariant = {
  id: string;
  label: string;
  color: ColorGroup;
  tokens: TemplateTokens;
  isNew?: boolean;
};

export type TemplateFamily = {
  id: string;
  name: string;
  group: ThemeGroup;
  skin: SkinId;
  tier: PriceTier;
  status: "ready" | "soon";
  /** Hiện ở section Kho mẫu trên trang chủ. */
  featured?: boolean;
  tagline: string;
  /** Hiệu ứng mở thiệp + hiệu ứng nền — hiện ở trang chi tiết. */
  motion: string;
  tags: string[];
  description: string;
  highlights: string[];
  occasions: string[];
  fonts: TemplateFonts;
  faqs: { q: string; a: string }[];
  variants: TemplateVariant[];
};

export type TemplateRef = { family: TemplateFamily; variant: TemplateVariant; id: string };

/* ---------- Danh mục chung ---------- */

export const THEME_GROUPS: { id: ThemeGroup; label: string }[] = [
  { id: "truyen-thong", label: "Truyền thống Việt" },
  { id: "hoa-vuon", label: "Hoa & vườn" },
  { id: "toi-gian", label: "Tối giản hiện đại" },
  { id: "chau-au", label: "Sang trọng châu Âu" },
];

export const COLOR_GROUPS: { id: ColorGroup; label: string; swatch: string }[] = [
  { id: "do", label: "Đỏ", swatch: "#8e1f2b" },
  { id: "xanh-la", label: "Xanh lá", swatch: "#3d5e45" },
  { id: "xanh-duong", label: "Xanh dương", swatch: "#1d2f5a" },
  { id: "vang-kim", label: "Vàng kim", swatch: "#c9a45c" },
  { id: "hong", label: "Hồng", swatch: "#e2a9ae" },
  { id: "trung-tinh", label: "Trung tính", swatch: "#d8d0c2" },
];

/**
 * Giá theo mẫu (thanh toán một lần khi xuất bản; tạo và xem trước luôn miễn phí).
 * Cơ bản: chỉ token + chữ. Tiêu chuẩn: hoạ tiết SVG riêng. Cao cấp: tranh vẽ tay.
 */
export const PRICE_TIERS: Record<PriceTier, { label: string; price: number }> = {
  "co-ban": { label: "Cơ bản", price: 149_000 },
  "tieu-chuan": { label: "Tiêu chuẩn", price: 199_000 },
  "cao-cap": { label: "Cao cấp", price: 299_000 },
};

export const formatVnd = (n: number) => `${n.toLocaleString("vi-VN")}đ`;

/** Tính năng có ở mọi mẫu — hiện ở trang chi tiết. */
export const COMMON_FEATURES = [
  "Link riêng có tên từng vị khách",
  "Xưng hô theo vai vế (chúng con / chúng mình)",
  "Ngày âm lịch tự tính",
  "Đếm ngược ngày cưới",
  "Chỉ đường Google Maps & thêm vào lịch",
  "Hiệu ứng mở thiệp riêng của từng mẫu",
  "Thông tin mừng cưới nhà trai / nhà gái",
  "Nhạc nền & ảnh xem trước khi gửi qua Zalo",
  "Đổi mẫu bất cứ lúc nào, giữ nguyên nội dung",
];

/* ---------- Các dòng mẫu ---------- */

export const FAMILIES: TemplateFamily[] = [
  {
    id: "nga-botanical",
    name: "Ngà Botanical",
    group: "hoa-vuon",
    skin: "botanical",
    tier: "cao-cap",
    status: "ready",
    featured: true,
    tagline: "Màu nước · Cổ điển",
    motion: "Đôi cánh cửa mở ra, lá xanh bay nhẹ suốt thiệp",
    tags: ["Màu nước", "Vẽ tay", "Sân vườn"],
    description:
      "Nền giấy ngà ấm, tranh màu nước vẽ tay: nến, hoa, khu vườn và lâu đài nhỏ. Mở thiệp bằng đôi cánh cửa và con dấu sáp — sang trọng mà vẫn nhẹ nhàng, hợp tiệc cưới sân vườn hay nhà hàng.",
    highlights: ["Tranh màu nước vẽ tay ở mọi phần thiệp", "Mở thiệp bằng cánh cửa và dấu sáp", "Lịch trình kèm minh hoạ từng hoạt động", "Bố cục thoáng, đọc dễ trên điện thoại"],
    occasions: ["Lễ Thành Hôn", "Tiệc cưới sân vườn", "Nhà hàng"],
    fonts: { heading: "cormorant", body: "cormorant", script: "cormorant" },
    faqs: [
      { q: "Tranh trong thiệp có đổi được không?", a: "Tranh màu nước là phần đặc trưng của mẫu nên được giữ nguyên. Bạn đổi được toàn bộ chữ, ngày giờ, địa điểm và màu biến thể." },
      { q: "Mẫu có hợp tiệc trong nhà hàng không?", a: "Có. Tông ngà và xanh rêu trung tính, hợp cả tiệc sân vườn lẫn sảnh nhà hàng." },
    ],
    variants: [
      {
        id: "reu",
        label: "Ngà rêu",
        color: "xanh-la",
        tokens: { bg: "#f6f2ed", paper: "#f1ede6", fg: "#293e2e", muted: "#68715f", accent: "#657558", line: "#acb39f", cover: "#213d2d", coverFg: "#ede8db" },
      },
      {
        id: "hong",
        label: "Ngà hồng",
        color: "hong",
        isNew: true,
        tokens: { bg: "#f8f0ec", paper: "#f3e7e2", fg: "#4a2f33", muted: "#7a6266", accent: "#a5646d", line: "#d4b7b5", cover: "#6b3a41", coverFg: "#f6e6df" },
      },
    ],
  },
  {
    id: "lua-do",
    name: "Lụa Đỏ",
    group: "truyen-thong",
    skin: "song-hy",
    tier: "tieu-chuan",
    status: "ready",
    featured: true,
    tagline: "Song Hỷ · Truyền thống",
    motion: "Phong bì lụa lật nắp, dấu son chữ Hỷ, cánh hoa đỏ rơi",
    tags: ["Chữ Hỷ", "Truyền thống", "Ánh kim"],
    description:
      "Sắc lụa và chữ Song Hỷ ánh kim — đúng tinh thần thiệp cưới Việt mà ông bà, cha mẹ quen thuộc, nhưng gọn gàng và hiện đại trên màn hình. Mở thiệp bằng phong bì có dấu son chữ Hỷ.",
    highlights: ["Phong bì lụa với dấu son 囍", "Hoạ tiết mây cát tường làm vạch chia", "Ghi rõ ngày âm lịch", "Lời mời theo vai vế từng khách"],
    occasions: ["Lễ Vu Quy", "Lễ Thành Hôn", "Lễ ăn hỏi"],
    fonts: { heading: "playfair", body: "lora", script: "pinyon" },
    faqs: [
      { q: "Chữ Song Hỷ mang ý nghĩa gì?", a: "Song Hỷ (囍) là hai chữ Hỷ ghép đôi, tượng trưng cho niềm vui nhân đôi của hai gia đình — biểu tượng quen thuộc nhất trong đám cưới Á Đông." },
      { q: "Người lớn tuổi đọc có dễ không?", a: "Mẫu dùng chữ có chân cỡ lớn, nền tương phản rõ và ghi kèm ngày âm lịch, rất hợp để gửi họ hàng." },
    ],
    variants: [
      {
        id: "do",
        label: "Đỏ lụa",
        color: "do",
        tokens: { bg: "#fbf4ea", paper: "#f6e9d8", fg: "#6e1620", muted: "#86545a", accent: "#a8232f", line: "#d9b98a", cover: "#8e1f2b", coverFg: "#f6dfaa" },
      },
      {
        id: "xanh-ngoc",
        label: "Xanh ngọc",
        color: "xanh-la",
        tokens: { bg: "#f6f3ea", paper: "#ebe8da", fg: "#17463f", muted: "#55706a", accent: "#1f6b5f", line: "#c9b98a", cover: "#17463f", coverFg: "#efd9a4" },
      },
      {
        id: "do-do",
        label: "Đỏ đô",
        color: "do",
        isNew: true,
        tokens: { bg: "#f7efe6", paper: "#efe1d3", fg: "#4f1019", muted: "#7a4e53", accent: "#7a1824", line: "#cfae7d", cover: "#4f1019", coverFg: "#e8cf98" },
      },
    ],
  },
  {
    id: "toi-gian",
    name: "Tối Giản",
    group: "toi-gian",
    skin: "toi-gian",
    tier: "co-ban",
    status: "ready",
    featured: true,
    tagline: "Hiện đại · Tạp chí",
    motion: "Hai trang tách dọc như lật tạp chí, ảnh lướt ra từ một bên",
    tags: ["Typography", "Tạp chí", "Ít hoạ tiết"],
    description:
      "Chữ lớn, nhiều khoảng trắng, đường kẻ mảnh kiểu tạp chí. Dành cho cặp đôi yêu sự tinh gọn và muốn nội dung là nhân vật chính.",
    highlights: ["Typography lớn kiểu tạp chí", "Đường kẻ mảnh, không hoạ tiết rườm rà", "5 tông màu từ mực đến đỏ đô", "Tải nhanh nhất trong kho mẫu"],
    occasions: ["Lễ Thành Hôn", "Tiệc cưới hiện đại", "Save the date"],
    fonts: { heading: "josefin", body: "lora", script: "lora" },
    faqs: [
      { q: "Mẫu tối giản có quá đơn điệu không?", a: "Mẫu dựa vào chữ và khoảng trắng để tạo cảm giác sang. Bạn có thể chọn tông nâu, navy hay đỏ đô để thiệp có cá tính hơn." },
    ],
    variants: [
      {
        id: "muc",
        label: "Mực",
        color: "trung-tinh",
        tokens: { bg: "#f7f5f0", paper: "#efebe3", fg: "#161616", muted: "#5c5a55", accent: "#161616", line: "#cfcbc2", cover: "#161616", coverFg: "#f7f5f0" },
      },
      {
        id: "nau",
        label: "Nâu",
        color: "trung-tinh",
        tokens: { bg: "#f6f0e8", paper: "#ece2d5", fg: "#3b2a20", muted: "#76655a", accent: "#6d4c37", line: "#d3c3b1", cover: "#3b2a20", coverFg: "#f3e9dc" },
      },
      {
        id: "navy",
        label: "Navy",
        color: "xanh-duong",
        tokens: { bg: "#f4f4f1", paper: "#e7e9e8", fg: "#14213d", muted: "#565f74", accent: "#1d3461", line: "#c6cbd3", cover: "#14213d", coverFg: "#eef0f2" },
      },
      {
        id: "do-do",
        label: "Đỏ đô",
        color: "do",
        tokens: { bg: "#f7f2ee", paper: "#efe4dd", fg: "#3d0f16", muted: "#7a5357", accent: "#6e1423", line: "#d8bfbd", cover: "#5a111d", coverFg: "#f5e6e1" },
      },
      {
        id: "reu",
        label: "Rêu",
        color: "xanh-la",
        isNew: true,
        tokens: { bg: "#f4f3ec", paper: "#e8e8dc", fg: "#23301f", muted: "#5f6a58", accent: "#3f5536", line: "#c9cdb9", cover: "#2a3a26", coverFg: "#eef0e4" },
      },
    ],
  },
  {
    id: "dem-sao",
    name: "Đêm Sao",
    group: "chau-au",
    skin: "dem-sao",
    tier: "tieu-chuan",
    status: "ready",
    featured: true,
    tagline: "Lãng mạn · Ánh kim",
    motion: "Bầu trời sao tan dần, sao băng thỉnh thoảng lướt qua",
    tags: ["Ánh kim", "Tiệc tối", "Sao lấp lánh"],
    description:
      "Nền đêm sâu, chòm sao ánh kim lấp lánh và vầng trăng khuyết — như lời hẹn ước dưới trời sao. Dành cho tiệc cưới buổi tối, rooftop hay khách sạn.",
    highlights: ["Sao lấp lánh chuyển động nhẹ", "Tông tối sang trọng, chữ ánh kim", "Vầng trăng và chòm sao làm hoạ tiết", "Hợp tiệc tối & khách sạn"],
    occasions: ["Tiệc cưới buổi tối", "Lễ Thành Hôn", "Khách sạn & rooftop"],
    fonts: { heading: "prata", body: "garamond", script: "imperial" },
    faqs: [
      { q: "Nền tối có khó đọc không?", a: "Chữ dùng tông kem ánh kim có độ tương phản cao trên nền đêm, đọc rõ cả ngoài trời." },
    ],
    variants: [
      {
        id: "xanh-dem",
        label: "Xanh đêm",
        color: "xanh-duong",
        tokens: { bg: "#0f1a36", paper: "#15234a", fg: "#f1e6c8", muted: "#b9b3a0", accent: "#d8b878", line: "#4a5679", cover: "#0a1228", coverFg: "#f1dfb4" },
      },
      {
        id: "tim-than",
        label: "Tím than",
        color: "vang-kim",
        isNew: true,
        tokens: { bg: "#1c1530", paper: "#271d42", fg: "#f2e7cc", muted: "#bdb2a6", accent: "#d9b56f", line: "#564a75", cover: "#130e22", coverFg: "#f2deb0" },
      },
    ],
  },
  {
    id: "sen-hong",
    name: "Sen Hồng",
    group: "truyen-thong",
    skin: "sen",
    tier: "tieu-chuan",
    status: "soon",
    tagline: "Dịu dàng · Thuần Việt",
    motion: "Đang hoàn thiện",
    tags: ["Hoa sen", "Thuần Việt"],
    description: "Đoá sen hồng giữa nền phấn nhạt — nét thuần Việt dịu dàng, thanh khiết. Hợp tiệc báo hỷ ấm cúng.",
    highlights: ["Hoạ tiết sen vẽ tay", "Tông hồng phấn dịu mắt"],
    occasions: ["Tiệc Báo Hỷ", "Lễ Thành Hôn"],
    fonts: { heading: "playfair", body: "lora", script: "pinyon" },
    faqs: [],
    variants: [
      {
        id: "hong",
        label: "Hồng",
        color: "hong",
        tokens: { bg: "#fbf3f1", paper: "#f6e2df", fg: "#6e2c3a", muted: "#8a6168", accent: "#c4707c", line: "#e2c0bf", cover: "#7b3442", coverFg: "#fbe9e6" },
      },
    ],
  },
  {
    id: "truc-xanh",
    name: "Trúc Xanh",
    group: "truyen-thong",
    skin: "truc",
    tier: "tieu-chuan",
    status: "soon",
    tagline: "Thanh nhã · Á Đông",
    motion: "Đang hoàn thiện",
    tags: ["Trúc", "Á Đông"],
    description: "Những nhành trúc xanh khẽ đung đưa — biểu tượng của sự bền bỉ, thanh cao. Tinh thần Á Đông nhã nhặn.",
    highlights: ["Nhành trúc đung đưa nhẹ", "Bố cục thoáng"],
    occasions: ["Lễ gia tiên", "Save the date"],
    fonts: { heading: "cormorant", body: "cormorant", script: "great-vibes" },
    faqs: [],
    variants: [
      {
        id: "truc",
        label: "Trúc",
        color: "xanh-la",
        tokens: { bg: "#f3f4ec", paper: "#e6eadb", fg: "#1f3d2a", muted: "#5d6f5f", accent: "#4f7d55", line: "#c3cfb5", cover: "#234a32", coverFg: "#f2e8cd" },
      },
    ],
  },
];

/* ---------- Tra cứu ---------- */

export const DEFAULT_TEMPLATE = "nga-botanical-reu";

const index = new Map<string, TemplateRef>();
for (const family of FAMILIES)
  for (const variant of family.variants) {
    const id = `${family.id}-${variant.id}`;
    index.set(id, { family, variant, id });
  }

/** Mọi mẫu (mỗi biến thể màu là một mẫu). */
export const ALL_TEMPLATES: TemplateRef[] = [...index.values()];
export const READY_TEMPLATES = ALL_TEMPLATES.filter((t) => t.family.status === "ready");
export const FEATURED_FAMILIES = FAMILIES.filter((f) => f.featured);

export const findTemplate = (id: string | undefined | null) => (id ? index.get(id) : undefined);
export const isReadyTemplate = (id: string | undefined | null) => findTemplate(id)?.family.status === "ready";
/** Luôn trả về một mẫu hợp lệ — thiệp cũ chưa có trường mẫu sẽ dùng Ngà Botanical. */
export const resolveTemplate = (id: string | undefined | null): TemplateRef =>
  (id && index.get(id)?.family.status === "ready" ? index.get(id) : undefined) ?? index.get(DEFAULT_TEMPLATE)!;

/**
 * Ảnh chụp bìa demo (scripts/thumbs.mjs → public/thiep/thumbs/<mã>.jpg).
 * Chỉ mẫu đã sẵn sàng mới có; mẫu "sắp ra mắt" dùng thẻ minh hoạ vẽ bằng CSS.
 */
export const thumbOf = (t: TemplateRef) => (t.family.status === "ready" ? `/thiep/thumbs/${t.id}.jpg` : undefined);

export const familyDefault = (f: TemplateFamily): TemplateRef => index.get(`${f.id}-${f.variants[0].id}`)!;
export const templateHref = (id: string) => `/mau-thiep/${id}`;
export const priceOf = (f: TemplateFamily) => PRICE_TIERS[f.tier];
export const groupLabel = (g: ThemeGroup) => THEME_GROUPS.find((x) => x.id === g)?.label ?? "";

/** Biến CSS đặt lên gốc thiệp. */
export function templateStyle(t: TemplateRef): Record<string, string> {
  const k = t.variant.tokens;
  const f = t.family.fonts;
  return {
    "--t-bg": k.bg,
    "--t-paper": k.paper,
    "--t-fg": k.fg,
    "--t-muted": k.muted,
    "--t-accent": k.accent,
    "--t-line": k.line,
    "--t-cover": k.cover,
    "--t-cover-fg": k.coverFg,
    "--t-font-heading": FONT_VAR[f.heading],
    "--t-font-body": FONT_VAR[f.body],
    "--t-font-script": FONT_VAR[f.script],
  };
}
