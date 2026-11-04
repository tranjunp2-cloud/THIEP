// Toàn bộ nội dung landing page. Đổi tên thương hiệu, câu chữ tại đây (giá nằm ở từng mẫu: lib/templates/registry).

import { formatVnd, PRICE_TIERS } from "@/lib/templates/registry";

/** Giá thấp nhất trong kho mẫu — dùng trong phần hỏi đáp. */
const MIN_PRICE = Math.min(...Object.values(PRICE_TIERS).map((t) => t.price));

/** Liên hệ — dùng ở footer, phần hỏi đáp và cuối kho mẫu. */
export const contact = {
  email: "tranjun.p2@gmail.com",
  zalo: "0344351194",
  /** Hiển thị dễ đọc. */
  zaloLabel: "0344 351 194",
};

export const zaloUrl = `https://zalo.me/${contact.zalo}`;

/** Link email soạn sẵn yêu cầu thiết kế mẫu riêng. */
export const customDesignMailto = () =>
  `mailto:${contact.email}?subject=${encodeURIComponent("Yêu cầu thiết kế mẫu thiệp riêng")}&body=${encodeURIComponent(
    "Chào SayIDo,\n\nTên hai bạn: \nNgày cưới: \nConcept / màu sắc mong muốn: \nẢnh hoặc mẫu tham khảo (nếu có): \nSố điện thoại / Zalo để liên hệ: \n",
  )}`;

export const brand = {
  name: "SayIDo",
  tagline: "Thiệp cưới online",
  demoLink: "sayido.vn/quan-mai",
};

/** Cặp đôi mẫu dùng trong các bản xem trước. */
export const sampleCouple = {
  groom: "Minh Quân",
  bride: "Thanh Mai",
  dateLabel: "Chủ Nhật · 20.12.2026",
  dateShort: "20 · 12 · 2026",
  dateISO: "2026-12-20T10:00:00+07:00",
  venue: "Tư gia nhà gái · Hà Nội",
};

export const navLinks = [
  { href: "#mau-thiep", label: "Mẫu thiệp" },
  { href: "#cach-lam", label: "Cách làm" },
  { href: "#tinh-nang", label: "Tính năng" },
  { href: "#hoi-dap", label: "Hỏi đáp" },
];

export const marqueeWords = [
  "Lễ Vu Quy",
  "Lễ Thành Hôn",
  "Tiệc Báo Hỷ",
  "Save the Date",
  "Kính mời Quý Khách",
  "Trăm năm hạnh phúc",
];

export const manifesto =
  "Mỗi tấm thiệp là một lời hẹn. Chúng mình giúp bạn gửi lời hẹn ấy đến từng người thương — đúng tên, đúng cách xưng hô, đẹp trọn vẹn trên mọi màn hình.";

/** Nav/Footer dùng anchor của trang chủ — ở trang khác thì trỏ về trang chủ, riêng "Mẫu thiệp" trỏ về kho mẫu. */
export const navHref = (href: string, onHome: boolean) =>
  onHome ? href : href === "#mau-thiep" ? "/mau-thiep" : `/${href}`;

export const steps = [
  {
    no: "01",
    title: "Chọn một mẫu bạn thương",
    body: "Mẫu thiệp do nhà thiết kế vẽ riêng, từ truyền thống Song Hỷ đến tối giản hiện đại. Xem trước trực tiếp trên điện thoại trước khi chọn.",
  },
  {
    no: "02",
    title: "Điền thông tin, thả ảnh vào",
    body: "Nhập tên, ngày giờ, địa điểm — ngày âm lịch tự tính. Chọn một lần nhiều ảnh, hệ thống tự xếp vào khung và nén nhẹ để thiệp mở thật nhanh.",
  },
  {
    no: "03",
    title: "Gửi link riêng cho từng người",
    body: "Thêm danh sách khách, mỗi người nhận một đường link có tên mình. Gửi qua Zalo, Messenger hay tin nhắn — lời mời xưng hô đúng vai vế với từng người.",
  },
];

export const guestNames = [
  "Cô Lan & Chú Hùng",
  "Anh Tuấn",
  "Bạn Thảo Vy",
  "Gia đình Bác Bình",
  "Chị Ngọc Hân",
];

export const faqs = [
  {
    q: "Khách có cần tải ứng dụng để xem thiệp không?",
    a: "Không. Thiệp là một trang web, khách chỉ cần bấm vào link trong Zalo, Messenger hay tin nhắn là xem được ngay trên điện thoại.",
  },
  {
    q: "Mình có sửa thiệp được sau khi đã gửi không?",
    a: "Được. Mọi thay đổi (giờ đón khách, địa điểm, ảnh…) cập nhật ngay trên cùng một đường link, khách không cần nhận link mới.",
  },
  {
    q: "Ngày âm lịch có được tính tự động không?",
    a: "Có. Bạn chỉ nhập ngày dương lịch, thiệp tự hiển thị ngày âm tương ứng theo lịch Việt Nam.",
  },
  {
    q: "Tiền mừng qua QR có đi qua SayIDo không?",
    a: "Không. Mã QR dẫn thẳng đến tài khoản ngân hàng của hai bạn theo chuẩn VietQR, chúng mình không giữ hay xử lý khoản tiền nào.",
  },
  {
    q: "Giá thiệp thế nào?",
    a: `Mỗi mẫu có giá riêng, ghi ngay trên trang của mẫu đó — từ ${formatVnd(MIN_PRICE)}, thanh toán một lần. Bạn tạo và xem trước miễn phí, ưng ý mới thanh toán; không thu thêm theo số khách mời.`,
  },
  {
    q: "Thiệp được lưu trong bao lâu?",
    a: "Thiệp được lưu 12 tháng kể từ ngày cưới. Trong thời gian đó bạn sửa nội dung, đổi mẫu và gửi thêm khách bất cứ lúc nào.",
  },
];
