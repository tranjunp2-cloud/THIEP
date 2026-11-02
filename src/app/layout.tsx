import type { Metadata, Viewport } from "next";
import { Be_Vietnam_Pro, Cormorant_Garamond, Great_Vibes } from "next/font/google";
import "lenis/dist/lenis.css";
import "./globals.css";

const display = Cormorant_Garamond({
  variable: "--font-display",
  subsets: ["latin", "vietnamese"],
  weight: ["300", "400", "500", "600"],
  style: ["normal", "italic"],
  display: "swap",
});

const sans = Be_Vietnam_Pro({
  variable: "--font-sans",
  subsets: ["latin", "vietnamese"],
  weight: ["300", "400", "500", "600"],
  display: "swap",
});

const script = Great_Vibes({
  variable: "--font-script",
  subsets: ["latin", "vietnamese"],
  weight: "400",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Duyên — Thiệp cưới online sang trọng",
  description:
    "Tạo thiệp cưới online trong 15 phút. Gửi link riêng cho từng vị khách qua Zalo, Messenger, kèm xác nhận tham dự, sổ lời chúc và QR mừng cưới.",
};

export const viewport: Viewport = {
  themeColor: "#f7f1e7",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="vi" className={`${display.variable} ${sans.variable} ${script.variable}`}>
      <body>{children}</body>
    </html>
  );
}
