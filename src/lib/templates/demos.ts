/**
 * Thiệp demo theo từng dòng mẫu — mỗi mẫu là câu chuyện của MỘT cặp đôi:
 * tên, gia đình, ngày cưới, địa điểm, lịch trình và một bộ ảnh cùng buổi chụp.
 * Mọi tên, địa chỉ, tài khoản đều là giả định. Ảnh: Pexels (giấy phép Pexels).
 */
import { demoInput, demoPhoto, DEMO_SLUG } from "../wedding/demo";
import { toWedding, type WeddingInput } from "../wedding/schema";
import type { Wedding } from "../wedding/types";
import { findTemplate } from "./registry";

type Persona = {
  input: Partial<WeddingInput>;
  dressPalette?: string[];
};

const PERSONAS: Record<string, Persona> = {
  /* ---------- Ngà Botanical: tiệc cưới sân vườn ---------- */
  "nga-botanical": {
    input: {},
  },

  /* ---------- Lụa Đỏ: lễ vu quy truyền thống, áo dài & cổng hoa đỏ ---------- */
  "lua-do": {
    input: {
      faqs: [
        { q: "Lễ rước dâu bắt đầu lúc mấy giờ?", a: "Lễ gia tiên bắt đầu 7:30 tại tư gia nhà gái, đoàn nhà trai rước dâu khoảng 8:30." },
        { q: "Tiệc mừng tổ chức ở đâu?", a: "Tại Trung tâm tiệc cưới Kinh Bắc Palace, đón khách từ 10:30, lễ thành hôn lúc 11:00." },
        { q: "Có chỗ gửi xe không?", a: "Trung tâm tiệc cưới có bãi gửi ô tô và xe máy miễn phí." },
      ],
      groom: { name: "Trần Đức Anh", short: "Đức Anh", title: "Trưởng nam" },
      bride: { name: "Nguyễn Phương Thảo", short: "Phương Thảo", title: "Thứ nữ" },
      city: "Bắc Ninh",
      families: [
        { father: "Ông Trần Văn Hải", mother: "Bà Đỗ Thị Hoa", address: "Từ Sơn, Bắc Ninh" },
        { father: "Ông Nguyễn Văn Thịnh", mother: "Bà Lê Thị Hằng", address: "Yên Phong, Bắc Ninh" },
      ],
      events: [
        {
          title: "Lễ Vu Quy",
          subtitle: "Lễ rước dâu tại tư gia nhà gái",
          date: "2026-12-27",
          start: "07:30",
          end: "09:00",
          venue: "Tư gia nhà gái",
          address: "Thôn Đông Xuyên, Yên Phong, Bắc Ninh",
          note: "Hai họ làm lễ gia tiên, trao trầu cau và rước dâu về nhà trai.",
        },
        {
          title: "Lễ Thành Hôn",
          subtitle: "Lễ thành hôn & tiệc mừng",
          date: "2026-12-27",
          start: "11:00",
          end: "14:00",
          venue: "Trung tâm tiệc cưới Kinh Bắc Palace",
          address: "Số 25 đường Lý Thái Tổ, Từ Sơn, Bắc Ninh",
          note: "",
        },
      ],
      mainIndex: 1,
      timeline: [
        { time: "07:30", title: "Lễ gia tiên", detail: "Thắp hương báo cáo tổ tiên hai họ" },
        { time: "08:30", title: "Rước dâu", detail: "Đoàn nhà trai đón cô dâu về" },
        { time: "11:00", title: "Lễ thành hôn", detail: "Trao nhẫn, rót rượu hợp cẩn" },
        { time: "11:30", title: "Khai tiệc", detail: "Nâng ly chúc mừng cùng hai họ" },
        { time: "13:30", title: "Tiễn khách", detail: "Cảm ơn quý khách đã đến chung vui" },
      ],
      dress: { title: "Áo dài & sắc đỏ", note: "Rất mong quý khách chọn áo dài hoặc trang phục tông đỏ, kem, vàng để ngày vui thêm rộn ràng." },
      gifts: {
        message: "Sự có mặt của quý khách là niềm vinh hạnh của gia đình. Nếu ở xa, quý khách có thể gửi lời chúc mừng qua thông tin dưới đây.",
        accounts: [
          { side: "Nhà trai", bank: "Ngân hàng ABC (demo)", number: "0211 345 678", holder: "TRAN DUC ANH" },
          { side: "Nhà gái", bank: "Ngân hàng XYZ (demo)", number: "0987 222 111", holder: "NGUYEN PHUONG THAO" },
        ],
      },
      photos: {
        cover: demoPhoto("lua", 1, 1200, 1735, "Cô dâu chú rể trong lễ phục đỏ dạo bước dưới hiên nhà cổ treo đèn lồng", "55% 60%"),
        groom: demoPhoto("lua", 2, 818, 1088, "Chú rể trong lễ phục đỏ thêu rồng", "50% 30%"),
        bride: demoPhoto("lua", 13, 633, 843, "Cô dâu trong lễ phục đỏ thêu phượng", "50% 30%"),
        album: [
          demoPhoto("lua", 3, 859, 1242, "Thả đèn hoa đăng bên bến sông"),
          demoPhoto("lua", 7, 843, 589, "Tựa đầu bên nhau"),
          demoPhoto("lua", 4, 855, 1242, "Chung ô đỏ trên cầu đá"),
          demoPhoto("lua", 9, 561, 811, "Chữ Hỷ cho ngày vui"),
          demoPhoto("lua", 5, 859, 1242, "Mời trà bên song cửa gỗ"),
          demoPhoto("lua", 8, 843, 589, "Phong bao lì xì đỏ"),
          demoPhoto("lua", 6, 855, 1242, "Bên xích đu hoa giữa sân vườn"),
          demoPhoto("lua", 11, 562, 855, "Nụ cười ngày cưới"),
          demoPhoto("lua", 10, 1200, 1735, "Cánh hoa hồng rơi"),
          demoPhoto("lua", 12, 547, 855, "Ngồi bên nhau trên ghế gỗ"),
        ],
        credit: "Ảnh minh hoạ do AI tạo.",
      },
      rsvpDeadline: "2026-12-20",
    },
    dressPalette: ["#8e1f2b", "#c9a45c", "#f3e2c4", "#fbf4ea", "#5a111d"],
  },

  /* ---------- Tối Giản: phong cách tạp chí, studio trắng & bờ hồ ---------- */
  "toi-gian": {
    input: {
      faqs: [
        { q: "Mình nên đến lúc mấy giờ?", a: "Đón khách từ 17:30 với welcome drink và photobooth, nghi thức bắt đầu lúc 18:15." },
        { q: "Dress code thế nào?", a: "Trắng, kem hoặc be — nhẹ nhàng là đẹp nhất." },
        { q: "Có chỗ đỗ xe không?", a: "Toà nhà có hầm gửi xe, bạn báo bảo vệ là khách dự tiệc cưới nhé." },
      ],
      groom: { name: "Phạm Gia Huy", short: "Gia Huy", title: "Con trai út" },
      bride: { name: "Đỗ Khánh Linh", short: "Khánh Linh", title: "Con gái đầu" },
      city: "TP. Hồ Chí Minh",
      families: [
        { father: "Ông Phạm Quốc Bảo", mother: "Bà Võ Thị Mai", address: "Quận 3, TP. Hồ Chí Minh" },
        { father: "Ông Đỗ Minh Trí", mother: "Bà Huỳnh Ngọc Lan", address: "Thủ Đức, TP. Hồ Chí Minh" },
      ],
      events: [
        {
          title: "Tiệc Cưới",
          subtitle: "Tiệc cưới tối thân mật",
          date: "2027-01-09",
          start: "18:00",
          end: "21:30",
          venue: "White Hall · Sảnh Tầng 5",
          address: "120 Nguyễn Văn Hưởng, Thảo Điền, Thủ Đức, TP. Hồ Chí Minh",
          note: "",
        },
      ],
      mainIndex: 0,
      timeline: [
        { time: "17:30", title: "Đón khách", detail: "Welcome drink & photobooth" },
        { time: "18:15", title: "Nghi thức", detail: "Lời hứa của hai bạn" },
        { time: "18:45", title: "Khai tiệc", detail: "Bữa tối và rượu vang" },
        { time: "20:00", title: "First dance", detail: "Nhảy cùng chúng mình" },
        { time: "21:30", title: "Kết thúc", detail: "Hẹn gặp lại" },
      ],
      dress: { title: "Trắng & Be", note: "Dress code trắng, kem hoặc be. Chúng mình muốn mọi khung hình đều thật nhẹ nhàng, tinh gọn." },
      gifts: {
        message: "Món quà lớn nhất là bạn có mặt. Nếu muốn gửi lời chúc từ xa, bạn có thể dùng thông tin dưới đây.",
        accounts: [
          { side: "Nhà trai", bank: "Ngân hàng ABC (demo)", number: "0333 909 101", holder: "PHAM GIA HUY" },
          { side: "Nhà gái", bank: "Ngân hàng XYZ (demo)", number: "0909 101 333", holder: "DO KHANH LINH" },
        ],
      },
      photos: {
        cover: demoPhoto("toi", 1, 1200, 801, "Hai bạn tựa trán vào nhau bên hồ", "50% 40%"),
        groom: demoPhoto("toi", 2, 1200, 1607, "Chú rể cầm bó hoa", "50% 28%", 1.35),
        bride: demoPhoto("toi", 3, 1200, 1607, "Cô dâu mỉm cười", "45% 30%", 1.35),
        album: [
          demoPhoto("toi", 6, 1200, 800, "Ôm nhau trước bức tường trái tim"),
          demoPhoto("toi", 4, 1200, 801, "Chú rể trao hoa"),
          demoPhoto("toi", 8, 1200, 800, "Trong khung trái tim"),
          demoPhoto("toi", 10, 1200, 801, "Bên hồ"),
          demoPhoto("toi", 5, 1200, 741, "Khiêu vũ dưới tán cây"),
          demoPhoto("toi", 7, 1200, 800, "Cái ôm thật chặt"),
          demoPhoto("toi", 9, 1200, 801, "Nắm tay"),
          demoPhoto("toi", 12, 1200, 800, "Chạy về phía nhau"),
        ],
        credit: "Ảnh minh hoạ: Pexels.",
      },
      rsvpDeadline: "2026-12-30",
    },
    dressPalette: ["#8c7260", "#b8a48f", "#e0d4c4", "#efe7dc", "#ffffff"],
  },

  /* ---------- Đêm Sao: tiệc tối khách sạn ---------- */
  "dem-sao": {
    input: {
      faqs: [
        { q: "Mình nên đến lúc mấy giờ?", a: "Cocktail đón khách từ 18:00 ở sân thượng, lễ thành hôn bắt đầu lúc 18:30." },
        { q: "Có phần ngoài trời không?", a: "Có — sau cắt bánh mọi người cùng ra sân thượng ngắm biển đêm, bạn mang thêm áo khoác mỏng nhé." },
        { q: "Khách sạn có chỗ gửi xe không?", a: "Khách sạn có hầm gửi xe miễn phí cho khách dự tiệc." },
      ],
      groom: { name: "Lê Tuấn Kiệt", short: "Tuấn Kiệt", title: "Trưởng nam" },
      bride: { name: "Vũ Minh Châu", short: "Minh Châu", title: "Út nữ" },
      city: "Đà Nẵng",
      families: [
        { father: "Ông Lê Văn Phúc", mother: "Bà Nguyễn Thị Thu", address: "Hải Châu, Đà Nẵng" },
        { father: "Ông Vũ Đình Long", mother: "Bà Trần Thị Ngọc", address: "Sơn Trà, Đà Nẵng" },
      ],
      events: [
        {
          title: "Tiệc Cưới",
          subtitle: "Dạ tiệc dưới trời sao",
          date: "2026-12-26",
          start: "18:30",
          end: "22:00",
          venue: "Starlight Ballroom · Khách sạn Biển Xanh",
          address: "36 Võ Nguyên Giáp, Sơn Trà, Đà Nẵng",
          note: "",
        },
      ],
      mainIndex: 0,
      timeline: [
        { time: "18:00", title: "Đón khách", detail: "Cocktail ngoài sân thượng" },
        { time: "18:30", title: "Lễ thành hôn", detail: "Trao nhẫn dưới vòm đèn" },
        { time: "19:00", title: "Khai tiệc", detail: "Dạ tiệc & âm nhạc" },
        { time: "20:30", title: "Cắt bánh", detail: "Rót rượu và cắt bánh cưới" },
        { time: "21:30", title: "Pháo sáng", detail: "Cùng nhau ngắm biển đêm" },
      ],
      dress: { title: "Dạ tiệc", note: "Trang phục dạ tiệc tông xanh đêm, ánh kim hoặc đen. Tiệc có phần ngoài trời, mời bạn mang thêm áo khoác mỏng." },
      gifts: {
        message: "Cảm ơn bạn đã đến cùng chúng mình trong đêm đặc biệt này. Lời chúc từ xa có thể gửi qua thông tin bên dưới.",
        accounts: [
          { side: "Nhà trai", bank: "Ngân hàng ABC (demo)", number: "0905 123 456", holder: "LE TUAN KIET" },
          { side: "Nhà gái", bank: "Ngân hàng XYZ (demo)", number: "0935 654 321", holder: "VU MINH CHAU" },
        ],
      },
      photos: {
        cover: demoPhoto("sao", 4, 1200, 1800, "Nụ hôn trước vòm hoa", "50% 18%"),
        groom: demoPhoto("sao", 11, 1176, 1568, "Chú rể trong áo dài trắng", "50% 28%"),
        bride: demoPhoto("sao", 12, 1176, 1568, "Cô dâu áo dài trắng ôm hoa", "50% 28%"),
        album: [
          demoPhoto("sao", 4, 1200, 1800, "Nụ hôn trước vòm hoa"),
          demoPhoto("sao", 8, 1200, 800, "Vui cùng bạn bè trong đêm tiệc"),
          demoPhoto("sao", 6, 1200, 1800, "Áo dài trắng trong lễ gia tiên"),
          demoPhoto("sao", 5, 1200, 1800, "Đeo nhẫn cưới"),
          demoPhoto("sao", 9, 1200, 800, "Nhận lì xì mừng cưới"),
          demoPhoto("sao", 7, 1200, 1800, "Khoảnh khắc trong lễ rước dâu"),
          demoPhoto("sao", 10, 1200, 1800, "Cười thật tươi"),
          demoPhoto("sao", 1, 1200, 1800, "Bó hoa cưới trắng"),
        ],
        credit: "Ảnh minh hoạ: Pexels.",
      },
      rsvpDeadline: "2026-12-18",
    },
    dressPalette: ["#0f1a36", "#1c1530", "#d8b878", "#f1e6c8", "#161616"],
  },

  /* ---------- Sen Hồng: lễ vu quy miền Tây, đất sen Đồng Tháp ---------- */
  "sen-hong": {
    input: {
      faqs: [
        { q: "Lễ vu quy bắt đầu lúc mấy giờ?", a: "Lễ gia tiên tại tư gia nhà gái lúc 8:00, đoàn nhà trai rước dâu khoảng 9:00." },
        { q: "Tiệc cưới tổ chức ở đâu?", a: "Nhà hàng Sen Hồng Garden bên hồ Văn Miếu, đón khách từ 10:30, khai tiệc lúc 11:00." },
        { q: "Có chỗ gửi xe không?", a: "Nhà hàng có bãi gửi ô tô và xe máy miễn phí ngay cổng chính." },
      ],
      groom: { name: "Hoàng Gia Bảo", short: "Gia Bảo", title: "Trưởng nam" },
      bride: { name: "Trần Ngọc Diệp", short: "Ngọc Diệp", title: "Út nữ" },
      city: "Đồng Tháp",
      families: [
        { father: "Ông Hoàng Văn Phúc", mother: "Bà Lê Thị Mai", address: "TP. Sa Đéc, Đồng Tháp" },
        { father: "Ông Trần Minh Tâm", mother: "Bà Nguyễn Thị Sen", address: "TP. Cao Lãnh, Đồng Tháp" },
      ],
      events: [
        {
          title: "Lễ Vu Quy",
          subtitle: "Tại tư gia nhà gái",
          date: "2027-01-16",
          start: "08:00",
          end: "09:30",
          venue: "Tư gia nhà gái",
          address: "Số 18 đường Lý Thường Kiệt, Phường 1, TP. Cao Lãnh, Đồng Tháp",
          note: "Lễ gia tiên ấm cúng giữa hai họ, trao trầu cau và rước dâu.",
        },
        {
          title: "Tiệc Cưới",
          subtitle: "Lễ thành hôn & tiệc mừng",
          date: "2027-01-16",
          start: "11:00",
          end: "14:00",
          venue: "Nhà hàng Sen Hồng Garden",
          address: "Số 5 đường Nguyễn Huệ, Phường 2, TP. Cao Lãnh, Đồng Tháp",
          note: "",
        },
      ],
      mainIndex: 1,
      timeline: [
        { time: "10:30", title: "Đón khách", detail: "Chụp ảnh lưu niệm bên hồ sen" },
        { time: "11:00", title: "Lễ thành hôn", detail: "Trao nhẫn và lời hứa trăm năm" },
        { time: "11:30", title: "Khai tiệc", detail: "Nâng ly chúc mừng cùng hai họ" },
        { time: "12:30", title: "Văn nghệ", detail: "Đờn ca tài tử từ bạn bè quê nhà" },
        { time: "13:30", title: "Tiễn khách", detail: "Cảm ơn quý khách đã về chung vui" },
      ],
      dress: { title: "Áo dài & sắc sen", note: "Rất mong quý khách chọn áo dài hoặc trang phục tông hồng phấn, trắng, xanh lá sen để ngày vui thêm dịu dàng." },
      gifts: {
        message: "Sự hiện diện của quý khách là niềm vui lớn nhất của gia đình. Nếu ở xa, quý khách có thể gửi lời chúc mừng qua thông tin dưới đây.",
        accounts: [
          { side: "Nhà trai", bank: "Ngân hàng ABC (demo)", number: "0277 456 789", holder: "HOANG GIA BAO" },
          { side: "Nhà gái", bank: "Ngân hàng XYZ (demo)", number: "0939 112 233", holder: "TRAN NGOC DIEP" },
        ],
      },
      rsvpDeadline: "2027-01-08",
    },
    dressPalette: ["#c76f7f", "#f2c9cf", "#fcf5f3", "#a9bfa3", "#6d8f68"],
  },
};

/** Thiệp demo đầy đủ của một mẫu (một biến thể màu). */
export function demoWeddingFor(templateId: string): Wedding {
  const t = findTemplate(templateId);
  const persona = (t && PERSONAS[t.family.id]) ?? PERSONAS["nga-botanical"];
  const input: WeddingInput = { ...demoInput, ...persona.input, template: templateId };
  const w = toWedding(DEMO_SLUG, input, true);
  if (persona.dressPalette) w.dress.palette = persona.dressPalette;
  return w;
}
