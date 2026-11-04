import type { Metadata, Viewport } from "next";
import {
  Be_Vietnam_Pro,
  Cormorant_Garamond,
  EB_Garamond,
  Great_Vibes,
  Imperial_Script,
  Josefin_Sans,
  Lora,
  Pinyon_Script,
  Playfair_Display,
  Prata,
} from "next/font/google";
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

/* Phông của các mẫu thiệp — không preload, chỉ tải khi mẫu dùng tới. */
const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin", "vietnamese"],
  weight: ["400", "500", "600"],
  style: ["normal", "italic"],
  display: "swap",
  preload: false,
});

const pinyon = Pinyon_Script({
  variable: "--font-pinyon",
  subsets: ["latin", "vietnamese"],
  weight: "400",
  display: "swap",
  preload: false,
});

const josefin = Josefin_Sans({
  variable: "--font-josefin",
  subsets: ["latin", "vietnamese"],
  weight: ["300", "400", "600"],
  display: "swap",
  preload: false,
});

const lora = Lora({
  variable: "--font-lora",
  subsets: ["latin", "vietnamese"],
  weight: ["400", "500"],
  style: ["normal", "italic"],
  display: "swap",
  preload: false,
});

const prata = Prata({
  variable: "--font-prata",
  subsets: ["latin", "vietnamese"],
  weight: "400",
  display: "swap",
  preload: false,
});

const imperial = Imperial_Script({
  variable: "--font-imperial",
  subsets: ["latin", "vietnamese"],
  weight: "400",
  display: "swap",
  preload: false,
});

const garamond = EB_Garamond({
  variable: "--font-garamond",
  subsets: ["latin", "vietnamese"],
  weight: ["400", "500"],
  style: ["normal", "italic"],
  display: "swap",
  preload: false,
});

const templateFonts = [playfair, pinyon, josefin, lora, prata, imperial, garamond].map((f) => f.variable).join(" ");

const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL ??
  (process.env.VERCEL_PROJECT_PRODUCTION_URL ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}` : "http://localhost:3000");

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: "SayIDo — Thiệp cưới online sang trọng",
  description:
    "Tạo thiệp cưới online trong 15 phút. Gửi link riêng mang tên từng vị khách qua Zalo, Messenger — nhiều mẫu thiệp đẹp, hiệu ứng mở thiệp riêng và QR mừng cưới.",
};

export const viewport: Viewport = {
  themeColor: "#f7f1e7",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="vi" className={`${display.variable} ${sans.variable} ${script.variable} ${templateFonts}`}>
      <body>{children}</body>
    </html>
  );
}
