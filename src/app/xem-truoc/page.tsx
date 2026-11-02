import type { Metadata } from "next";
import { PreviewFrame } from "@/components/invitation/PreviewFrame";
import "../thiep/[slug]/thiep.css";

export const metadata: Metadata = { title: "Xem trước thiệp", robots: { index: false } };

export default function PreviewPage() {
  return <PreviewFrame />;
}
