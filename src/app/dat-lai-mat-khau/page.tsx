import type { Metadata } from "next";
import { AuthProvider } from "@/components/auth/AuthProvider";
import { ResetPassword } from "@/components/auth/ResetPassword";
import "../app.css";

export const metadata: Metadata = { title: "Đặt lại mật khẩu — SayIDo", robots: { index: false } };

export default function ResetPage() {
  return (
    <AuthProvider>
      <ResetPassword />
    </AuthProvider>
  );
}
