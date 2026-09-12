import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Camille & Antoine | 12 June 2027",
  description: "Celebrate the wedding of Camille Lefèvre and Antoine Marchand in Burgundy, 12 June 2027.",
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">{children}</body>
    </html>
  );
}
