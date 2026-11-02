import { toWedding, type WeddingInput } from "./schema";

/** Dữ liệu thiệp demo — mọi tên, địa chỉ, tài khoản đều là giả định. Cũng là dữ liệu mẫu ở trang tạo thiệp. */
export const demoInput: WeddingInput = {
  groom: { name: "Nguyễn Minh Quân", short: "Minh Quân" },
  bride: { name: "Lê Thanh Mai", short: "Thanh Mai" },
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
      a: "Rất hoan nghênh các bé! Bạn chỉ cần ghi số người đi cùng trong phần xác nhận để nhà hàng chuẩn bị ghế ngồi.",
    },
    {
      q: "Nếu không đến được, mình gửi lời chúc thế nào?",
      a: "Bạn chọn “Rất tiếc không thể đến” trong phần xác nhận và để lại lời chúc — chúng mình sẽ đọc từng lời một.",
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
