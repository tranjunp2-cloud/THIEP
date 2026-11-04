import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { Invitation } from "@/components/invitation/Invitation";
import { getWedding } from "@/lib/store";
import { dotDate, longDate, lunar, mainEvent } from "@/lib/wedding/format";
import "./thiep.css";
import "./skins.css";

type Props = PageProps<"/thiep/[slug]">;

const guestKey = (sp: Record<string, string | string[] | undefined>) => (typeof sp.k === "string" ? sp.k.slice(0, 80) : "");

export async function generateMetadata({ params, searchParams }: Props): Promise<Metadata> {
  const [{ slug }, sp] = await Promise.all([params, searchParams]);
  const w = await getWedding(slug).catch(() => null);
  if (!w) return { title: "Không tìm thấy thiệp", robots: { index: false } };
  const e = mainEvent(w);
  const guest = w.guests.find((g) => g.key === guestKey(sp));
  const couple = `${w.groom.short} & ${w.bride.short}`;
  const title = guest ? `Kính mời ${guest.name} tới dự lễ cưới ${couple}` : `Thiệp cưới ${couple} · ${dotDate(e.start).replace(/ /g, "")}`;
  const description = `${longDate(e.start)} (${lunar(e.start)}) · ${e.venue}`;
  const image = `/thiep/${w.slug}/anh${guest ? `?k=${guest.key}` : ""}`;
  return {
    title,
    description,
    robots: { index: false, follow: false }, // thiệp là riêng tư
    openGraph: { title, description, type: "website", locale: "vi_VN", images: [{ url: image, width: 1200, height: 630 }] },
    twitter: { card: "summary_large_image", title, description, images: [image] },
  };
}

async function InvitationLoader({ params, searchParams }: Props) {
  const [{ slug }, sp] = await Promise.all([params, searchParams]);
  const w = await getWedding(slug);
  if (!w) notFound();
  const guest = w.guests.find((g) => g.key === guestKey(sp));
  return <Invitation wedding={w} guest={guest} />;
}

/** Bìa xanh tĩnh hiện ngay trong lúc tải dữ liệu thiệp. */
function CoverFallback() {
  return (
    <main className="thiep">
      <section className="hero" aria-label="Đang mở thiệp">
        <div className="door door-left" aria-hidden="true" />
        <div className="door door-right" aria-hidden="true" />
      </section>
    </main>
  );
}

export default function ThiepPage(props: Props) {
  return (
    <Suspense fallback={<CoverFallback />}>
      <InvitationLoader {...props} />
    </Suspense>
  );
}
