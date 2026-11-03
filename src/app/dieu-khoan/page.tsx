import type { Metadata } from "next";
import { LegalPage } from "@/components/app/LegalPage";
import "../app.css";

export const metadata: Metadata = { title: "Điều khoản dịch vụ — SayIDo" };

export default function TermsPage() {
  return (
    <LegalPage title="Điều khoản dịch vụ" updated="11/2026">
      <h2>1. Dịch vụ</h2>
      <p>
        SayIDo cung cấp công cụ tạo thiệp cưới online, gửi link mời tới khách, nhận xác nhận tham dự và lời chúc. Trong giai đoạn thử
        nghiệm, các tính năng được cung cấp miễn phí và có thể thay đổi.
      </p>
      <h2>2. Tài khoản</h2>
      <p>
        Bạn chịu trách nhiệm giữ an toàn mật khẩu và link quản lý thiệp. Ai có link quản lý đều có thể sửa thiệp và xem danh sách phản hồi,
        vì vậy không gửi link này cho khách.
      </p>
      <h2>3. Nội dung của bạn</h2>
      <p>
        Bạn sở hữu nội dung đưa lên thiệp (tên, thông tin sự kiện, lời nhắn, danh sách khách) và đảm bảo có quyền sử dụng nội dung đó. Không
        đăng nội dung vi phạm pháp luật, xúc phạm người khác hoặc thông tin cá nhân của người khác khi chưa được đồng ý.
      </p>
      <h2>4. Mừng cưới</h2>
      <p>
        Thông tin tài khoản ngân hàng trên thiệp do bạn tự nhập. SayIDo không nhận, giữ hay xử lý bất kỳ khoản tiền mừng nào.
      </p>
      <h2>5. Giới hạn trách nhiệm</h2>
      <p>
        Dịch vụ được cung cấp “như hiện có”. Chúng mình cố gắng giữ thiệp hoạt động ổn định nhưng không đảm bảo không gián đoạn; bạn nên lưu
        lại danh sách phản hồi (tải CSV) trước ngày cưới.
      </p>
      <h2>6. Liên hệ</h2>
      <p>Mọi thắc mắc vui lòng liên hệ qua email hỗ trợ ghi ở cuối trang chủ.</p>
    </LegalPage>
  );
}
