import type { Metadata } from "next";
import { PreviewFrame } from "@/components/invitation/PreviewFrame";
import "../thiep/[slug]/thiep.css";
import "../thiep/[slug]/skins.css";

export const metadata: Metadata = { title: "Xem trước thiệp", robots: { index: false } };

export default function PreviewPage() {
  return <PreviewFrame />;
}
