import type { Metadata } from "next";
import { Builder } from "@/components/app/Builder";
import "../app.css";

export const metadata: Metadata = { title: "Tạo thiệp cưới — Duyên", robots: { index: false } };

export default function CreatePage() {
  return <Builder />;
}
