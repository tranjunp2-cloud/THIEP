import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Invitation } from "@/components/invitation/Invitation";
import { dotDate, longDate, lunar, mainEvent } from "@/lib/wedding/format";
import { weddings } from "@/lib/wedding/demo";
import "./thiep.css";

export function generateStaticParams() {
  return Object.keys(weddings).map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: PageProps<"/thiep/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const w = weddings[slug];
  if (!w) return {};
  const e = mainEvent(w);
  const title = `Thiệp cưới ${w.groom.short} & ${w.bride.short} · ${dotDate(e.start).replace(/ /g, "")}`;
  const description = `Trân trọng kính mời bạn tới dự lễ thành hôn của ${w.groom.short} & ${w.bride.short} — ${longDate(e.start)} (${lunar(e.start)}), ${e.venue}.`;
  return { title, description, openGraph: { title, description, type: "website", locale: "vi_VN" } };
}

export default async function ThiepPage({ params }: PageProps<"/thiep/[slug]">) {
  const { slug } = await params;
  const w = weddings[slug];
  if (!w) notFound();
  return <Invitation wedding={w} />;
}
