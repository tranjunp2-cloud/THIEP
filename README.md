# SayIDo — Thiệp cưới online

Nền tảng thiệp cưới online (bản dựng thử nghiệm): landing page giới thiệu sản phẩm và thiệp cưới mẫu đầu tiên
phát triển từ giao diện "Ngà Botanical" trước đây của repo này.

| Đường dẫn | Nội dung |
|---|---|
| `/` | Landing page — intro, phong bì mở theo cuộn, kho mẫu, cách làm, cá nhân hóa, tính năng, bảng giá, hỏi đáp |
| `/tao-thiep` | Tạo thiệp 7 bước, xem trước trực tiếp trong khung điện thoại, tự lưu nháp; `?sua=<slug>` để sửa |
| `/thiep/<slug>` | Thiệp cưới; `?k=<mã-khách>` = link riêng (tên khách trên bìa, xưng hô theo vai vế) |
| `/thiep/<slug>/anh` | Ảnh xem trước 1200×630 khi gửi qua Zalo/Messenger (có tên khách nếu kèm `?k=`) |
| `/quan-ly/<slug>#t=<token>` | Trang quản lý: thống kê RSVP, link từng khách, sổ lời chúc, tải CSV, sửa thiệp |
| `/quan-ly` | “Thiệp của tôi” — các thiệp đã tạo trên trình duyệt này |
| `/thiep/quan-mai` | Thiệp demo (không lưu RSVP) |

Không cần tài khoản: khi xuất bản, người tạo nhận **link quản lý bí mật** (token nằm sau dấu `#` nên không gửi lên
server trong URL, không lọt vào log). Server chỉ lưu bản băm SHA-256 của token.

Mã nguồn thiệp cũ (Camille & Antoine) vẫn nằm trong lịch sử git trước commit thay thế.

## Chạy dự án

```bash
npm ci
npm run dev      # http://localhost:3000
npm run build && npm start
npm run lint
```

Node 20.9+ (đã thử với Node 24). Next.js 16 (App Router, Cache Components), GSAP 3 + ScrollTrigger/SplitText, Lenis.

## Cấu trúc

- `src/components/landing/` — các section của landing; **toàn bộ chữ, giá, tên thương hiệu** ở `content.ts`.
- `src/app/landing.css` — style landing; `src/app/thiep/[slug]/thiep.css` — style thiệp. Hai trang dùng CSS riêng và
  liên kết với nhau bằng thẻ `<a>` (tải lại trang) để style không chồng lên nhau.
- `src/lib/wedding/` — kiểu dữ liệu (`types.ts`), dữ liệu thiệp (`demo.ts`), định dạng ngày/giờ, file lịch `.ics`.
  Thiệp demo nằm trong `demo.ts`; thiệp của người dùng được lưu qua `store.ts`.
- `src/lib/lunar.ts` — đổi dương lịch sang âm lịch Việt Nam (thuật toán Hồ Ngọc Đức, múi giờ +7).
- `src/components/invitation/` — thiệp: bìa phong bì, nhạc nền, các section, RSVP.
- `src/lib/wedding/schema.ts` — schema dữ liệu thiệp (zod) dùng chung cho form và API.
- `src/lib/store.ts` — lưu thiệp/RSVP (Supabase hoặc file khi dev).
- `src/components/app/` — trang tạo thiệp, trang quản lý; `src/app/app.css` là style của chúng.
- `assets/fonts/` — phông chữ (OFL) để vẽ ảnh xem trước.

## Lưu trữ

- **Supabase** (khi có `SUPABASE_URL` + `SUPABASE_SERVICE_ROLE_KEY`): bảng `weddings` và `wedding_rsvps`.
- **File JSON** `.data/store.json` khi chạy `npm run dev` (hoặc đặt `DUYEN_FILE_STORE=1`) — để thử trọn luồng trên máy
  mà không cần cơ sở dữ liệu. Không dùng trên Vercel (ổ đĩa chỉ đọc).
- Production chưa cấu hình Supabase: landing và thiệp demo vẫn chạy; nút xuất bản báo rõ là chưa thể lưu.

### Bật Supabase

1. Trong Supabase SQL Editor, chạy `supabase/schema.sql` (tạo `weddings` + `wedding_rsvps`, không đụng bảng `rsvps` cũ).
2. Thêm biến môi trường (Vercel → Settings → Environment Variables), rồi deploy lại:
   - `SUPABASE_URL`
   - `SUPABASE_SERVICE_ROLE_KEY` — khoá chỉ dùng phía server, **không** đặt tiền tố `NEXT_PUBLIC_`, không commit.
   - (tuỳ chọn) `NEXT_PUBLIC_SITE_URL` — tên miền chính thức, dùng cho đường dẫn ảnh xem trước.

API kiểm tra nguồn gửi, giới hạn kích thước, kiểm tra dữ liệu bằng zod, có bẫy chống bot và chống gửi trùng bằng UUID.
`GET /api/rsvp` và `GET /api/weddings` chỉ báo đã cấu hình hay chưa; dữ liệu khách chỉ trả khi có token quản lý.

## Tài khoản (đăng nhập / đăng ký)

Supabase Auth. Mặc định (không phát sinh phí): đăng ký bằng **họ tên, email, số điện thoại, mật khẩu**; đăng nhập
bằng email + mật khẩu; “ghi nhớ thiết bị”. Số điện thoại lưu trong hồ sơ (`user_metadata.phone`), không xác minh bằng SMS.
Trên Supabase cần **tắt “Confirm email”** (Authentication → Sign In / Providers → Email) để không phải gửi email.

Công tắc (đặt biến rồi deploy lại):
- Google / Facebook: nút tự hiện khi provider tương ứng được bật trên Supabase (Authentication → Sign In / Providers).
- `NEXT_PUBLIC_AUTH_RESET=0` — ẩn “Quên mật khẩu?” (mặc định bật; email gửi qua Supabase — nên có tên miền + SMTP riêng).

Tài khoản chỉ bật khi có hai biến công khai
`NEXT_PUBLIC_SUPABASE_URL` và `NEXT_PUBLIC_SUPABASE_ANON_KEY`; khi chưa có, trang chạy như trước (xuất bản ẩn danh bằng
link quản lý).

Khi đã bật: nút “Tạo thiệp” trên landing mở modal Tạo tài khoản nếu chưa đăng nhập; xuất bản yêu cầu đăng nhập; thiệp gắn
với tài khoản (`weddings.owner_id`). Link quản lý bí mật vẫn hoạt động (để chia sẻ quyền với người còn lại) và thiệp cũ có
nút “Lưu vào tài khoản”.

| Đường dẫn | Nội dung |
|---|---|
| `/auth/callback` | Quay về sau Google/Facebook, link xác nhận email, link đặt lại mật khẩu |
| `/dat-lai-mat-khau` | Đặt mật khẩu mới |
| `/dieu-khoan`, `/bao-mat` | Điều khoản dịch vụ, Chính sách bảo mật (bản nháp) |

Cấu hình: chạy `supabase/migrations/002_accounts.sql` (nếu đã chạy `schema.sql` bản cũ); Supabase → Authentication →
URL Configuration: Site URL = tên miền production, Redirect URLs thêm `https://<tên-miền>/auth/callback` và
`http://localhost:3000/auth/callback`; bật provider Google/Facebook nếu dùng. Email của Supabase mặc định bị giới hạn số
lượng mỗi giờ — khi chạy thật nên cấu hình SMTP riêng (Resend, SendGrid…).

## Triển khai Vercel

Framework Preset: **Next.js**, để mặc định Build/Output/Install command. Đã bỏ `vercel.json` cũ (cấu hình Vite).

## Bản quyền & nội dung

- Tên, địa chỉ, số tài khoản trong thiệp demo và giá trên landing đều mang tính minh họa.
- Nhạc trong thiệp: *Canon in D Major* — Kevin MacLeod (incompetech.com), CC BY 3.0, có ghi nguồn ở cuối thiệp.
- Nhạc nền trang SayIDo (landing, tạo thiệp, quản lý): *Gymnopédie No. 1* (Erik Satie) — Kevin MacLeod (incompetech.com,
  ISRC USUAN1100787), CC BY 4.0, ghi nguồn ở footer landing. Bản gốc 320 kbps tải tại incompetech; bản trong
  `public/audio/` đã nén 128 kbps và thêm fade đầu/cuối để lặp mượt. Đổi bài: thay file và hằng `SRC` trong
  `src/components/site/SiteMusic.tsx`.
- Tranh màu nước trong `public/thiep/images` lấy từ bản thiệp trước của repo (được tạo theo một video tham khảo);
  nên thay bằng bộ tranh tự thiết kế trước khi thương mại hóa.
