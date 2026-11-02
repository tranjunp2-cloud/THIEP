import type { Metadata } from "next";
import { MineList } from "@/components/app/Manage";
import "../app.css";

export const metadata: Metadata = { title: "Thiệp của tôi — Duyên", robots: { index: false } };

export default function MinePage() {
  return <MineList />;
}
