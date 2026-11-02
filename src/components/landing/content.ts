// Toàn bộ nội dung landing page. Đổi tên thương hiệu, giá, câu chữ tại đây.

export const brand = {
  name: "Duyên",
  tagline: "Thiệp cưới online",
  demoLink: "duyen.vn/quan-mai",
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
  { href: "#bang-gia", label: "Bảng giá" },
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

export type TemplateTheme = "truc" | "lua" | "nga" | "sen" | "sao" | "toi";

export const templates: {
  id: TemplateTheme;
  name: string;
  mood: string;
  badge?: string;
}[] = [
  { id: "truc", name: "Trúc Xanh", mood: "Thanh nhã · Á Đông", badge: "Được chọn nhiều" },
  { id: "lua", name: "Lụa Đỏ", mood: "Truyền thống · Song Hỷ" },
  { id: "nga", name: "Ngà Botanical", mood: "Màu nước · Cổ điển", badge: "Mới" },
  { id: "sen", name: "Sen Hồng", mood: "Dịu dàng · Thuần Việt" },
  { id: "sao", name: "Đêm Sao", mood: "Lãng mạn · Ánh kim" },
  { id: "toi", name: "Tối Giản", mood: "Hiện đại · Tạp chí" },
];

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
    body: "Thêm danh sách khách, mỗi người nhận một đường link có tên mình. Gửi qua Zalo, Messenger hay tin nhắn — và biết ai đã mở thiệp.",
  },
];

export const guestNames = [
  "Cô Lan & Chú Hùng",
  "Anh Tuấn",
  "Bạn Thảo Vy",
  "Gia đình Bác Bình",
  "Chị Ngọc Hân",
];

export const pricing = [
  {
    name: "Thử nghiệm",
    price: "0đ",
    note: "Miễn phí trọn đời",
    features: ["1 mẫu thiệp cơ bản", "Tối đa 10 ảnh", "Link chung cho mọi khách", "Có logo Duyên"],
    cta: "Bắt đầu miễn phí",
  },
  {
    name: "Trọn vẹn",
    price: "199.000đ",
    note: "Thanh toán một lần",
    highlight: true,
    features: [
      "Toàn bộ kho mẫu thiệp",
      "Link riêng & tên từng khách",
      "Xác nhận tham dự + sổ lời chúc",
      "QR mừng cưới nhà trai / nhà gái",
      "Không logo · lưu trữ 12 tháng",
    ],
    cta: "Chọn gói Trọn vẹn",
  },
  {
    name: "Cao cấp",
    price: "499.000đ",
    note: "Kèm thiết kế riêng",
    features: [
      "Mọi quyền lợi gói Trọn vẹn",
      "Nhà thiết kế chỉnh theo ý bạn",
      "Tên miền riêng cho thiệp",
      "Album ảnh không giới hạn",
    ],
    cta: "Trò chuyện với chúng mình",
  },
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
    q: "Tiền mừng qua QR có đi qua Duyên không?",
    a: "Không. Mã QR dẫn thẳng đến tài khoản ngân hàng của hai bạn theo chuẩn VietQR, chúng mình không giữ hay xử lý khoản tiền nào.",
  },
  {
    q: "Thiệp được lưu trong bao lâu?",
    a: "Gói Trọn vẹn lưu thiệp 12 tháng kể từ ngày cưới, bạn có thể tải toàn bộ lời chúc và danh sách xác nhận về máy bất cứ lúc nào.",
  },
];
