import { DEFAULT_TEMPLATE } from "../templates/registry";
import { toWedding, type WeddingInput } from "./schema";
import type { Photo } from "./types";

/** Ảnh trong /thiep/demo/<bộ ảnh>/NN.jpg (đã nén, có bản -640). */
export const demoPhoto = (set: string, n: number, width: number, height: number, alt: string, focus?: string, zoom?: number): Photo => ({
  src: `/thiep/demo/${set}/${String(n).padStart(2, "0")}.jpg`,
  width,
  height,
  alt,
  ...(focus ? { focus } : {}),
  ...(zoom ? { zoom } : {}),
});

const P = (n: number, w: number, h: number, alt: string, focus?: string, zoom?: number) => demoPhoto("nga", n, w, h, alt, focus, zoom);

/** Bộ ảnh của cặp đôi demo Ngà Botanical (rừng thông Đà Lạt — Pexels, nhiếp ảnh gia Hai Thanh). */
export const demoPhotos: WeddingInput["photos"] = {
  cover: P(4, 1200, 1800, "Cô dâu chú rể giữa rừng thông"),
  groom: P(1, 1200, 1661, "Chú rể mỉm cười", "68% 30%", 1.5),
  bride: P(2, 1200, 1800, "Cô dâu ôm bó hoa", "30% 26%", 2.1),
  album: [
    P(6, 1200, 1800, "Hai bạn nắm tay giữa đồi thông"),
    P(1, 1200, 1661, "Cô dâu nâng niu khuôn mặt chú rể"),
    P(5, 1200, 800, "Chú rể trao hoa trên triền đồi"),
    P(3, 1200, 1800, "Dạo bước dưới tán thông"),
    P(8, 1200, 800, "Ôm nhau giữa rừng"),
    P(7, 1200, 1800, "Đồi sương buổi sớm"),
    P(2, 1200, 1800, "Cô dâu ôm bó hoa cam"),
  ],
  credit: "Ảnh minh hoạ: Hai Thanh / Pexels.",
};

export const demoInput: WeddingInput = {
  template: DEFAULT_TEMPLATE,
  photos: demoPhotos,
  groom: { name: "Nguyễn Minh Quân", short: "Minh Quân", title: "Trưởng nam" },
  bride: { name: "Lê Thanh Mai", short: "Thanh Mai", title: "Út nữ" },
  city: "Hà Nội",
  families: [
    { father: "Ông Nguyễn Văn An", mother: "Bà Trần Thị Bình", address: "Hà Đông, Hà Nội" },
    { father: "Ông Lê Văn Cường", mother: "Bà Phạm Thị Dung", address: "Cầu Giấy, Hà Nội" },
  ],
  events: [
    {
      title: "Lễ Vu Quy",
      subtitle: "Tại tư gia nhà gái",
      date: "2026-12-20",
      start: "08:00",
      end: "09:30",
      venue: "Tư gia nhà gái",
      address: "Số 12 ngõ 45 phố Hoa Lan, Cầu Giấy, Hà Nội",
      note: "Lễ gia tiên ấm cúng giữa hai họ. Rất mong được đón cả nhà sớm.",
    },
    {
      title: "Tiệc Cưới",
      subtitle: "Lễ thành hôn & tiệc mừng",
      date: "2026-12-20",
      start: "11:00",
      end: "14:00",
      venue: "Nhà hàng Hoa Sen Garden",
      address: "88 đường Ven Hồ, Tây Hồ, Hà Nội",
      note: "",
    },
  ],
  mainIndex: 1,
  timeline: [
    { time: "10:30", title: "Đón khách", detail: "Chụp ảnh lưu niệm cùng cô dâu chú rể" },
    { time: "11:00", title: "Lễ thành hôn", detail: "Khoảnh khắc trao nhẫn và lời hứa trăm năm" },
    { time: "11:30", title: "Khai tiệc", detail: "Nâng ly chúc mừng cùng hai họ" },
    { time: "12:30", title: "Giao lưu & văn nghệ", detail: "Những tiết mục từ bạn bè thân thương" },
    { time: "13:30", title: "Tiễn khách", detail: "Cảm ơn mọi người đã đến chung vui" },
  ],
  dress: {
    title: "Thanh lịch",
    note: "Chúng mình rất vui nếu bạn chọn trang phục theo tông màu dưới đây. Tiệc tổ chức trong sảnh và sân vườn.",
  },
  gifts: {
    message:
      "Sự hiện diện của bạn là món quà ý nghĩa nhất. Nếu muốn gửi lời chúc mừng từ xa, bạn có thể dùng thông tin bên dưới.",
    accounts: [
      { side: "Nhà trai", bank: "Ngân hàng ABC (demo)", number: "0123 456 789", holder: "NGUYEN MINH QUAN" },
      { side: "Nhà gái", bank: "Ngân hàng XYZ (demo)", number: "9876 543 210", holder: "LE THANH MAI" },
    ],
  },
  faqs: [
    {
      q: "Mình nên đến lúc mấy giờ?",
      a: "Nhà hàng đón khách từ 10:30. Lễ thành hôn bắt đầu lúc 11:00, bạn đến sớm một chút để cùng chụp ảnh với chúng mình nhé.",
    },
    { q: "Nhà hàng có chỗ gửi xe không?", a: "Có. Nhà hàng có bãi gửi ô tô và xe máy miễn phí ngay cổng chính." },
    {
      q: "Mình có thể đưa bé đi cùng không?",
      a: "Rất hoan nghênh các bé! Bạn nhắn trước cho chúng mình số người đi cùng để nhà hàng chuẩn bị ghế ngồi nhé.",
    },
    {
      q: "Nếu không đến được, mình gửi lời chúc thế nào?",
      a: "Bạn nhắn cho chúng mình qua Zalo hoặc gửi lời chúc mừng qua thông tin mừng cưới bên trên — chúng mình sẽ đọc từng lời một.",
    },
  ],
  rsvpDeadline: "2026-12-10",
  guests: [
    { key: "co-lan", name: "Cô Lan & Chú Hùng", tone: "elder", side: "Nhà gái" },
    { key: "bac-binh", name: "Gia đình Bác Bình", tone: "elder", side: "Nhà trai" },
    { key: "anh-tuan", name: "Anh Tuấn", tone: "peer", side: "Nhà trai" },
    { key: "thao-vy", name: "Bạn Thảo Vy", tone: "peer", side: "Nhà gái" },
  ],
};

export const DEMO_SLUG = "quan-mai";
export const demoWedding = toWedding(DEMO_SLUG, demoInput, true);
