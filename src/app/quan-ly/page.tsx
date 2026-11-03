import type { Metadata } from "next";
import { MineList } from "@/components/app/Manage";
import { SiteMusic } from "@/components/site/SiteMusic";
import { AuthProvider } from "@/components/auth/AuthProvider";
import "../app.css";

export const metadata: Metadata = { title: "Thiệp của tôi — SayIDo", robots: { index: false } };

export default function MinePage() {
  return (
    <AuthProvider>
      <MineList />
      <SiteMusic />
    </AuthProvider>
  );
}
