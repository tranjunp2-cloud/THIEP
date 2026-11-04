import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Invitation } from "@/components/invitation/Invitation";
import { ALL_TEMPLATES, findTemplate } from "@/lib/templates/registry";
import { demoWeddingFor } from "@/lib/templates/demos";
import "../../../thiep/[slug]/thiep.css";
import "../../../thiep/[slug]/skins.css";

type Props = PageProps<"/mau-thiep/[id]/demo">;

export function generateStaticParams() {
  return ALL_TEMPLATES.filter((t) => t.family.status === "ready").map((t) => ({ id: t.id }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const t = findTemplate((await params).id);
  return {
    title: t ? `Demo mẫu ${t.family.name} · ${t.variant.label} — SayIDo` : "Không tìm thấy mẫu thiệp",
    robots: { index: false },
  };
}

/** Mọi mã mẫu hợp lệ đã được prerender; mã lạ cần trả 404 thật nên cho phép chặn. */
export const instant = false;

/** Thiệp demo đầy đủ của một mẫu — dữ liệu mẫu, không lưu phản hồi. */
export default async function TemplateDemoPage({ params }: Props) {
  const t = findTemplate((await params).id);
  if (!t || t.family.status !== "ready") notFound();
  return <Invitation wedding={demoWeddingFor(t.id)} />;
}
