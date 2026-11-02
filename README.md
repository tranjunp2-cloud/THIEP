# Duyên — Thiệp cưới online

Nền tảng thiệp cưới online (bản dựng thử nghiệm): landing page giới thiệu sản phẩm và thiệp cưới mẫu đầu tiên
phát triển từ giao diện "Ngà Botanical" trước đây của repo này.

| Đường dẫn | Nội dung |
|---|---|
| `/` | Landing page — intro, phong bì mở theo cuộn, kho mẫu cuộn ngang, cách làm, cá nhân hóa, tính năng, bảng giá, hỏi đáp |
| `/thiep/quan-mai` | Thiệp demo (link chung — "Quý khách") |
| `/thiep/quan-mai?k=co-lan` | Link riêng từng khách (`co-lan`, `bac-binh`, `anh-tuan`, `thao-vy`) — tên khách trên bìa, xưng hô theo vai vế |
| `/api/rsvp` | Lưu xác nhận tham dự (chỉ phía server) |

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
  Thêm thiệp mới = thêm một bản ghi vào `weddings`.
- `src/lib/lunar.ts` — đổi dương lịch sang âm lịch Việt Nam (thuật toán Hồ Ngọc Đức, múi giờ +7).
- `src/components/invitation/` — thiệp: bìa phong bì, nhạc nền, các section, RSVP.
- `src/proxy.ts` — slug thiệp không tồn tại trả 404.

## Bật lưu RSVP (Supabase)

Khi chưa cấu hình, thiệp vẫn chạy và báo rõ "phản hồi chưa được lưu" — không bao giờ giả vờ đã lưu.

1. Trong Supabase SQL Editor, chạy `supabase/wedding_rsvps.sql` (bảng mới `wedding_rsvps`, không đụng bảng `rsvps` cũ).
2. Thêm biến môi trường (Vercel → Settings → Environment Variables), rồi deploy lại:
   - `SUPABASE_URL`
   - `SUPABASE_SERVICE_ROLE_KEY` — khoá chỉ dùng phía server, **không** đặt tiền tố `NEXT_PUBLIC_`, không commit.

API kiểm tra nguồn gửi, giới hạn kích thước, kiểm tra dữ liệu, có bẫy chống bot và chống gửi trùng bằng UUID;
`GET /api/rsvp` chỉ báo đã cấu hình hay chưa, không trả dữ liệu khách.

## Triển khai Vercel

Framework Preset: **Next.js**, để mặc định Build/Output/Install command. Đã bỏ `vercel.json` cũ (cấu hình Vite).

## Bản quyền & nội dung

- Tên, địa chỉ, số tài khoản trong thiệp demo và giá trên landing đều mang tính minh họa.
- Nhạc nền: *Canon in D Major* — Kevin MacLeod (incompetech.com), CC BY 3.0, có ghi nguồn ở cuối thiệp.
- Tranh màu nước trong `public/thiep/images` lấy từ bản thiệp trước của repo (được tạo theo một video tham khảo);
  nên thay bằng bộ tranh tự thiết kế trước khi thương mại hóa.
