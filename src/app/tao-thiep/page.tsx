import type { Metadata } from "next";
import { Builder } from "@/components/app/Builder";
import { SiteMusic } from "@/components/site/SiteMusic";
import { AuthProvider } from "@/components/auth/AuthProvider";
import "../app.css";

export const metadata: Metadata = { title: "Tạo thiệp cưới — SayIDo", robots: { index: false } };

export default function CreatePage() {
  return (
    <AuthProvider>
      <Builder />
      <SiteMusic />
    </AuthProvider>
  );
}
