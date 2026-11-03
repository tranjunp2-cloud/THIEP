import type { Metadata } from "next";
import { FinishAuth } from "./FinishAuth";
import "../../app.css";

export const metadata: Metadata = { title: "Đang đăng nhập — SayIDo", robots: { index: false } };

/** Link email kiểu cũ ({{ .ConfirmationURL }}) trả phiên trong #hash — chỉ trình duyệt đọc được. */
export default function FinishAuthPage() {
  return <FinishAuth />;
}
