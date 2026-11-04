import type { Metadata } from "next";
import { notFound, permanentRedirect } from "next/navigation";
import { DemoSwitcher } from "@/components/invitation/DemoSwitcher";
import { demoWeddingFor } from "@/lib/templates/demos";
import { FAMILIES, familyDefault, findFamily, findTemplate } from "@/lib/templates/registry";
import "../../../thiep/[slug]/thiep.css";
import "../../../thiep/[slug]/skins.css";

type Props = PageProps<"/mau-thiep/[id]/demo">;

export function generateStaticParams() {
  return FAMILIES.filter((f) => f.status === "ready").map((f) => ({ id: f.id }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const f = findFamily((await params).id);
  return { title: f ? `Demo mẫu ${f.name} — SayIDo` : "Không tìm thấy mẫu thiệp", robots: { index: false } };
}

/** Mọi mẫu đã được prerender; mã lạ cần trả 404 thật nên cho phép chặn. */
export const instant = false;

/** Thiệp demo đầy đủ của một mẫu — đổi màu ngay trong thiệp, dữ liệu mẫu, không lưu gì. */
export default async function TemplateDemoPage({ params }: Props) {
  const { id } = await params;
  const f = findFamily(id);
  if (!f) {
    const old = findTemplate(id);
    if (old) permanentRedirect(`/mau-thiep/${old.family.id}/demo?mau=${old.variant.id}`);
    notFound();
  }
  if (f.status !== "ready") notFound();
  return <DemoSwitcher f={f} wedding={demoWeddingFor(familyDefault(f).id)} />;
}
