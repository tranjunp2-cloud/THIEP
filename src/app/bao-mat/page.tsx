import type { Metadata } from "next";
import { LegalPage } from "@/components/app/LegalPage";
import "../app.css";

export const metadata: Metadata = { title: "Chính sách bảo mật — SayIDo" };

export default function PrivacyPage() {
  return (
    <LegalPage title="Chính sách bảo mật" updated="11/2026">
      <h2>Chúng mình thu thập gì</h2>
      <ul>
        <li>Tài khoản: tên, email, ảnh đại diện (nếu đăng nhập bằng Google/Facebook). Mật khẩu được nhà cung cấp xác thực lưu dưới dạng băm.</li>
        <li>Nội dung thiệp bạn nhập: tên cô dâu chú rể, gia đình, sự kiện, lịch trình, thông tin mừng cưới, danh sách khách.</li>
        <li>Phản hồi của khách: tên, có tham dự hay không, số người, lời chúc.</li>
      </ul>
      <h2>Dùng để làm gì</h2>
      <p>
        Chỉ để hiển thị thiệp, gửi link mời và cho cô dâu chú rể xem phản hồi. SayIDo không bán dữ liệu và không dùng danh sách khách cho mục
        đích quảng cáo.
      </p>
      <h2>Ai xem được</h2>
      <ul>
        <li>Thiệp: bất kỳ ai có đường link thiệp. Thiệp không được đưa lên công cụ tìm kiếm.</li>
        <li>Danh sách phản hồi: chỉ chủ tài khoản của thiệp hoặc người có link quản lý.</li>
      </ul>
      <h2>Lưu trữ</h2>
      <p>
        Dữ liệu được lưu tại Supabase (cơ sở dữ liệu và xác thực) và ứng dụng chạy trên Vercel. Trình duyệt lưu bản nháp thiệp và lựa chọn nhạc
        nền trên chính thiết bị của bạn.
      </p>
      <h2>Quyền của bạn</h2>
      <p>Bạn có thể sửa thông tin thiệp bất cứ lúc nào và yêu cầu xoá tài khoản cùng dữ liệu qua email hỗ trợ.</p>
    </LegalPage>
  );
}
