# Kế hoạch: Hệ thống mẫu thiệp

_Ngày lập: 04/11/2026 · Trạng thái: đã xong giai đoạn 0–1 và phần lớn giai đoạn 2 (xem mục 9)_

## 1. Mục tiêu

Biến SayIDo từ "một thiết kế thiệp" (Ngà Botanical) thành một **hệ thống mẫu**: người dùng chọn mẫu, đổi mẫu bất cứ lúc nào mà không mất nội dung, và kho mẫu có thể mở rộng nhanh lên vài chục mẫu.

Tham khảo cách tổ chức của chungdoi.com/vi/mau-thiep. Chỉ học **cấu trúc**, không dùng lại hình vẽ, ảnh hay tên mẫu riêng của họ.

## 2. Những gì học được từ Chung Đôi

| Điểm | Họ làm | Áp dụng cho SayIDo |
|---|---|---|
| Số lượng | 89 mẫu nhưng chỉ khoảng 30 **dòng thiết kế**, mỗi dòng 2–4 **biến thể màu** | Mô hình `dòng mẫu × màu`. Thêm một biến thể màu chỉ là thêm một bộ token, không cần vẽ lại |
| Phân loại | Bộ sưu tập theo **màu** (đỏ, xanh lá, xanh dương, vàng kim) và theo **chủ đề** (truyền thống, long phụng, tối giản, hoa, vườn, hoàng gia châu Âu, boho), có badge "Mới" | Lọc theo hai trục chủ đề và màu, có badge "Mới", sau này thêm trang bộ sưu tập cho SEO |
| Trang chi tiết | Ảnh ba phần (phong bì, đầu thiệp, nội dung), điểm nổi bật, "phù hợp cho", danh sách tính năng, FAQ riêng, mẫu liên quan, nút "Tạo thiệp" và "Xem demo" | Giữ cấu trúc này, **làm tốt hơn** bằng bộ chọn màu ngay trên trang chi tiết (họ chỉ đưa biến thể vào mục mẫu liên quan) và bản demo thật cho từng màu |
| Đổi mẫu | Nội dung đã nhập giữ nguyên khi đổi mẫu | Mọi mẫu dùng **chung một cấu trúc dữ liệu và section**, chỉ khác giao diện |
| Giá | Mọi mẫu chung một giá, tạo miễn phí, ưng ý mới trả | Giữ nguyên mô hình giá hiện tại, mẫu không ảnh hưởng giá |
| Khác | Mục "Chưa thấy mẫu ưng ý? Yêu cầu thiết kế" | Thêm ở giai đoạn 3 |

## 3. Hiện trạng code

- `src/components/invitation/*` cùng `src/app/thiep/[slug]/thiep.css` dựng **một** thiết kế duy nhất. Màu viết cứng (`#293e2e`, `#f6f2ed`…), phần trang trí là ảnh màu nước raster trong `public/thiep/images/`.
- `Wedding` / `weddingInputSchema` **chưa có trường mẫu**. Dữ liệu lưu dạng `jsonb` trong `weddings.data`, nên thêm trường **không cần migration**.
- `src/components/landing/content.ts` → `templates` cùng `InviteCard` chỉ là thẻ minh hoạ CSS/SVG, chưa nối với thiệp thật.
- `Builder.tsx` có 7 bước nhưng chưa có bước chọn mẫu.

## 4. Kiến trúc đề xuất

### 4.1 Bộ đăng ký mẫu (registry): `src/lib/templates/`

```ts
type ThemeGroup = "truyen-thong" | "toi-gian" | "hoa-vuon" | "chau-au";
type ColorGroup = "do" | "xanh-la" | "xanh-duong" | "vang-kim" | "hong" | "trung-tinh";

type TemplateTokens = {
  bg: string; paper: string; fg: string; muted: string;
  accent: string; line: string;
  cover: string;            // nền cửa/phong bì
  coverFg: string;
  fontHeading: "display" | "serif-vn" | "sans";
  fontScript?: "script" | "none";
};

type TemplateVariant = {
  id: string;               // "do", "xanh-ngoc"…
  label: string;            // "Đỏ lụa"
  color: ColorGroup;
  tokens: TemplateTokens;
  isNew?: boolean;
};

type TemplateFamily = {
  id: string;               // "lua-do", "long-phung", "toi-gian"…
  name: string;
  group: ThemeGroup;
  tags: string[];
  status: "ready" | "soon";
  skin: SkinId;             // bộ trang trí, xem 4.3
  description: string;
  highlights: string[];
  occasions: string[];
  faqs?: { q: string; a: string }[];
  variants: TemplateVariant[];
};
```

- **Mã mẫu** = `${family}-${variant}`, ví dụ `long-phung-lam`. Mã này được lưu vào thiệp và dùng làm URL.
- Registry là **nguồn dữ liệu duy nhất**: trang chủ, kho mẫu, trang chi tiết, Builder, ảnh OG và thiệp thật đều đọc từ đây. Mảng `templates` trong `content.ts` sẽ bỏ.

### 4.2 Theme token cho thiệp thật

- Chuyển toàn bộ màu và font viết cứng trong `thiep.css` sang biến `--t-*`, giá trị mặc định chính là Ngà Botanical. **Bước này không được làm thay đổi giao diện**: chụp ảnh trước và sau để so.
- `Invitation` nhận `template` rồi đặt `data-skin` và `style={tokensToCss(variant.tokens)}` lên `<main className="thiep">`.
- Các trang khác dùng thiệp cũng nhận theo, gồm `PreviewFrame`, `/xem-truoc` và ảnh OG `/thiep/[slug]/anh`.

### 4.3 Skin (bộ trang trí theo dòng mẫu)

Mọi mẫu dùng **chung bộ section** (bìa, đếm ngược, lời mời, sự kiện, lịch trình, trang phục, mừng cưới, FAQ, RSVP, cuối thiệp). Đây là điều kiện để đổi mẫu không mất nội dung. Skin chỉ thay các **slot trang trí**:

| Slot | Ví dụ Ngà | Ví dụ Song Hỷ |
|---|---|---|
| `cover` (cửa/phong bì mở thiệp) | Cánh cửa xanh rêu | Phong bì đỏ, con dấu 囍 |
| `seal` | Dấu sáp bạc | Dấu son chữ Hỷ |
| `heroArt` | Nến, hoa màu nước | Khung vòm cho ảnh cưới |
| `divider` | Nhành lá | Hoạ tiết mây |
| `frame` (khung mừng cưới, địa điểm) | Khung viền đôi | Khung góc hoa văn |
| `footerArt` | Toàn cảnh khu vườn | Đôi chim/hoa văn |

- Skin là component React nằm trong `src/components/invitation/skins/<skin>.tsx` và chỉ trả về các slot này.
- **Biến thể màu không cần ảnh mới**: hoạ tiết vẽ bằng SVG với `currentColor` / `var(--t-accent)`. Riêng ảnh raster màu nước (như Ngà) chỉ dùng cho skin cao cấp, và ảnh nằm trong `public/thiep/skins/<skin>/`.
- Thẻ xem trước (`InviteCard`) chuyển sang đọc cùng token và SVG của skin, để ảnh trong kho mẫu khớp với thiệp thật.

### 4.4 Dữ liệu

- Thêm `template: z.string()` vào `weddingInputSchema`, kiểm tra mã có trong registry và đang ở trạng thái `ready`.
- Thiệp cũ chưa có trường này thì mặc định `nga-botanical-nga` khi đọc, không cần migration.
- API `POST/PATCH /api/weddings` chấp nhận đổi mẫu. Trang quản lý `/quan-ly/[slug]` có nút "Đổi mẫu".

### 4.5 Builder

- Thêm **bước 0 "Chọn mẫu"**: lưới mẫu đã lọc, bấm vào là bản xem trước bên phải đổi ngay. Có bộ chọn màu.
- Hỗ trợ `/tao-thiep?mau=long-phung-lam`: nút "Dùng mẫu này" ở trang chi tiết chọn sẵn mẫu đó. Modal đăng nhập (`data-require-auth`) phải giữ nguyên query khi chuyển trang.
- Đổi mẫu ở bất kỳ bước nào cũng không làm mất dữ liệu đã nhập.

### 4.6 Kho mẫu và trang chi tiết

- `/mau-thiep`: lọc theo **chủ đề** (4 nhóm) × **màu** (6 nhóm), có badge "Mới" / "Sắp ra mắt". Mỗi thẻ là một biến thể màu, giống cách Chung Đôi nhân số mẫu.
- `/mau-thiep/[id]` (id = mã mẫu):
  - Ảnh xem trước, **chấm màu đổi biến thể** (chuyển sang URL của biến thể đó).
  - Mô tả, điểm nổi bật, phù hợp cho, danh sách tính năng chung, FAQ riêng của mẫu.
  - Hai nút "Dùng mẫu này" và "Xem demo", kèm mẫu liên quan cùng chủ đề.
- `/mau-thiep/[id]/demo`: thiệp đầy đủ với dữ liệu mẫu (`lib/wedding/demo.ts`) và đúng mẫu đó, không lưu RSVP (`preview`).
- Giai đoạn 3 thêm `/mau-thiep/bo-suu-tap/[slug]` (SEO) và form "Yêu cầu mẫu riêng".

## 5. Danh mục mẫu đề xuất (theo 4 chủ đề bạn chọn)

Tên do SayIDo tự đặt. Những chữ chỉ hoạ tiết dân gian chung như Song Hỷ, Long Phụng, Baroque thì dùng được.

| Chủ đề | Dòng mẫu | Biến thể màu | Kỹ thuật | Giai đoạn |
|---|---|---|---|---|
| Hoa & vườn | **Ngà Botanical** (đã có) | Ngà rêu, Ngà hồng | Raster màu nước + SVG | 1 |
| Truyền thống Việt | **Lụa Đỏ**: Song Hỷ | Đỏ lụa, Xanh ngọc, Đỏ đô | SVG | 1 |
| Tối giản hiện đại | **Tối Giản**: kiểu tạp chí | Mực, Nâu, Navy, Đỏ đô, Rêu | Chỉ token + typography | 1 |
| Sang trọng châu Âu | **Đêm Sao**: ánh kim | Đêm xanh, Tím than | SVG | 1 |
| Truyền thống Việt | Long Phụng | Đỏ son, Lam, Huyền | SVG | 3 |
| Truyền thống Việt | Duyên Xưa: cổ phục, giấy dó | Kem đỏ, Kem lam | SVG + texture | 3 |
| Truyền thống Việt | Sen Hồng (đã có thẻ) | Hồng, Ngà | SVG | 3 |
| Truyền thống Việt | Trúc Xanh (đã có thẻ) | Trúc, Rêu | SVG | 3 |
| Tối giản hiện đại | Ấn Chữ: typography lớn | Kem đen, Kem đỏ | Token | 3 |
| Hoa & vườn | Hoa Dại: màu nước | Hồng, Lam | Raster/SVG | 3 |
| Hoa & vườn | Đồng Nội: boho, hoa khô | Cam đất, Nâu | Raster/SVG | 3 |
| Sang trọng châu Âu | Dạ Vũ: hoa văn Baroque | Vàng/đỏ đô, Vàng/navy | SVG | 3 |

Kết thúc giai đoạn 1 có **4 dòng × 12 biến thể**. Kết thúc giai đoạn 3 có khoảng **12 dòng × 30 biến thể**.

## 6. Lộ trình

**Giai đoạn 0: Nền tảng (không đổi giao diện)**
1. Tạo registry `src/lib/templates/` và đưa Ngà vào làm mục đầu tiên.
2. Token hoá `thiep.css`, dùng ảnh chụp để xác nhận Ngà không đổi.
3. Thêm trường `template` vào schema/types, mặc định cho thiệp cũ, API nhận trường mới.
4. Cho trang chủ, kho mẫu và trang chi tiết đọc từ registry, bỏ `templates` trong `content.ts`.

**Giai đoạn 1: Bốn dòng mẫu thật**
5. Tách cơ chế skin và chuyển Ngà sang `skins/botanical`.
6. Làm skin Song Hỷ, Tối Giản, Đêm Sao cùng các biến thể màu.
7. `InviteCard` đọc token và skin để ảnh xem trước khớp thiệp thật.
8. Cập nhật ảnh OG `/thiep/[slug]/anh` theo mẫu.

**Giai đoạn 2: Chọn và đổi mẫu**
9. Thêm bước "Chọn mẫu" trong Builder và hỗ trợ `?mau=`.
10. Thêm nút "Đổi mẫu" trong trang quản lý.
11. Thêm route `/mau-thiep/[id]/demo`, bộ chọn màu trên trang chi tiết, và bộ lọc chủ đề × màu.

**Giai đoạn 3: Mở rộng kho**
12. Làm thêm các dòng mẫu ở mục 5.
13. Thêm trang bộ sưu tập (SEO), badge "Mới" và form "Yêu cầu mẫu riêng".

## 7. Kiểm thử và tiêu chí hoàn thành

- Ngà sau khi token hoá trùng ảnh chụp trước đó, ở desktop 1440 và mobile 390.
- Mỗi biến thể: chữ trên nền đạt độ tương phản WCAG AA, hiển thị đúng ở 360px, không tràn ngang.
- Đổi mẫu trong Builder và trang quản lý: dữ liệu giữ nguyên, link khách cũ vẫn mở được.
- Thiệp cũ chưa có trường `template` vẫn hiển thị Ngà.
- `tsc`, `eslint`, `next build` sạch. Mỗi mã mẫu `ready` đều có trang chi tiết và trang demo được prerender.

## 8. Quyết định đã chốt (04/11/2026)

1. **Hoạ tiết:** SayIDo tự vẽ bằng SVG dựa trên motif văn hoá chung (chữ Hỷ, mây cát tường, song cửa, đèn lồng, trăng sao). Không sao chép hình của Chung Đôi hay bên khác. Ảnh màu nước chỉ dùng cho skin cao cấp đã có (Ngà).
2. **Font:** đã thêm 7 font Google, tất cả có bộ chữ tiếng Việt và không preload (chỉ tải khi mẫu cần):
   - Lụa Đỏ: Playfair Display, Lora, Pinyon Script
   - Tối Giản: Josefin Sans, Lora
   - Đêm Sao: Prata, EB Garamond, Imperial Script
3. **Bố cục:** mọi mẫu dùng chung bộ section, mỗi skin tự quyết phần trang trí và một số tinh chỉnh CSS riêng.
4. **Giá theo mẫu**, đặt trong `PRICE_TIERS` của registry để kiểm tra lại sau:
   - Cơ bản 149.000đ: chỉ token và chữ (Tối Giản)
   - Tiêu chuẩn 199.000đ: hoạ tiết SVG riêng (Lụa Đỏ, Đêm Sao, Sen, Trúc)
   - Cao cấp 299.000đ: tranh vẽ tay (Ngà Botanical)

   Section Bảng giá trên trang chủ đã bỏ (04/11/2026). Giá chỉ hiện trên từng mẫu, kèm một mục hỏi đáp "Giá thiệp thế nào?" lấy giá thấp nhất từ registry.

## 9. Tiến độ

- [x] Registry `src/lib/templates/registry.ts`: 6 dòng mẫu, 14 biến thể (12 sẵn sàng, 2 "sắp ra mắt"), giá, font, token
- [x] Token hoá `thiep.css` (Ngà giữ nguyên giao diện) + `skins.css`
- [x] Skin SVG: `components/invitation/skins/` (Song Hỷ, Đêm Sao, Tối Giản), Ngà dùng tranh gốc
- [x] Trường `template` trong dữ liệu thiệp, thiệp cũ mặc định Ngà
- [x] Ảnh OG theo màu mẫu
- [x] Kho mẫu lọc theo chủ đề × màu, badge Mới, giá
- [x] Trang chi tiết: chọn màu, giá, phông, tính năng, FAQ, mẫu liên quan
- [x] Demo `/mau-thiep/[id]/demo`
- [x] Bộ chọn mẫu trong trang tạo/sửa thiệp + `/tao-thiep?mau=`
- [x] Ảnh cưới trong dữ liệu thiệp (`photos.cover/groom/bride/album`, có `focus`/`zoom` để cắt khung)
- [x] Demo theo concept cặp đôi (`src/lib/templates/demos.ts`). Mỗi dòng mẫu là một cặp riêng: tên, danh xưng, gia đình, ngày, địa điểm, lịch trình, dress code, lời chúc và **một bộ ảnh cùng buổi chụp** (Pexels):
  - Ngà: Minh Quân & Thanh Mai, rừng thông Đà Lạt
  - Lụa Đỏ: Đức Anh & Phương Thảo, lễ vu quy áo dài
  - Tối Giản: Gia Huy & Khánh Linh, studio và bờ hồ
  - Đêm Sao: Tuấn Kiệt & Minh Châu, tiệc tối
- [x] Section "Cô dâu & chú rể" (chân dung riêng theo skin)
- [x] Bỏ xác nhận tham dự + sổ lưu bút (04/11/2026): phạm vi chỉ còn **tạo thiệp + gửi link riêng từng khách**, đầu tư vào giao diện & animation
- [x] Ảnh demo bị loại khỏi thiệp thật khi xuất bản (`stripDemoPhotos`, cả trình duyệt lẫn API)
- [x] Bìa có ảnh riêng từng skin:
  - Song Hỷ: mái vòm, chữ cong, khung ảnh vòm
  - Đêm Sao: ảnh tràn viền phủ màu đêm
  - Tối Giản: bố cục tạp chí hai cột
- [x] Lịch tháng có trái tim đánh dấu ngày cưới, tiêu đề section dạng dải màu (Song Hỷ)
- [x] Album theo skin, có xem ảnh lớn (lightbox):
  - Song Hỷ: băng chuyền 3D
  - Đêm Sao: ảnh polaroid nghiêng
  - Tối Giản: lưới tạp chí đánh số
  - Ngà: masonry khung trắng
- [ ] Tải ảnh lên trong trang tạo thiệp (cần Supabase Storage + nén ảnh phía trình duyệt)
- [x] Animation theo skin:
  - Mở thiệp: Ngà mở cửa; Lụa Đỏ lật nắp phong bì; Đêm Sao bầu trời tan dần; Tối Giản hai trang tách dọc
  - Bìa hiện theo kịch bản riêng của từng mẫu
  - Hiệu ứng nền: cánh hoa, lá bay, sao băng
  - Hiện ra khi cuộn: 5 kiểu mới (trượt trái/phải, mở khung, phóng to, bật lên)
- [ ] Thu tiền theo giá mẫu (chưa có cổng thanh toán)
- [ ] Giai đoạn 3: thêm dòng mẫu (Long Phụng, Duyên Xưa, Hoa Dại, Đồng Nội, Dạ Vũ, hoàn thiện Sen và Trúc), trang bộ sưu tập, form yêu cầu mẫu riêng

## 10. Cập nhật 04/11/2026: mẫu = bố cục riêng, màu = tuỳ chọn

- Mỗi mẫu một trang, một thẻ và một demo: `/mau-thiep/<mẫu>`. Màu là tuỳ chọn `?mau=<màu>`, đổi được ngay trên thẻ kho mẫu, trang chi tiết và thanh nổi trong thiệp demo. Link cũ `/mau-thiep/<mẫu>-<màu>` chuyển hướng 308 sang link mới.
- Bố cục riêng từng mẫu ở `components/invitation/Layout.tsx` (`LAYOUTS`): thứ tự section và phiên bản riêng của từng section:
  - Ngà: cổ điển đối xứng
  - Lụa Đỏ: báo hỷ trước, thẻ sự kiện dải đỏ, lịch trình trục giữa, băng chuyền ảnh
  - Đêm Sao: đếm ngược phát sáng mở màn, thẻ kính mờ, lịch trình chòm sao ngang
  - Tối Giản: tạp chí đánh số, đếm ngược một dòng, bảng sự kiện và lịch trình
- Mẫu mới phải có mục `LAYOUTS` riêng, không dùng chung bố cục.
