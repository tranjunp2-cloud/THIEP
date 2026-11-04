import type { Metadata } from "next";
import { notFound, permanentRedirect } from "next/navigation";
import "../../landing.css";
import "../gallery.css";
import { AuthProvider } from "@/components/auth/AuthProvider";
import { GalleryCard } from "@/components/gallery/GalleryCard";
import { ShowcaseActions, ShowcasePalette, ShowcasePreview, ShowcaseProvider } from "@/components/gallery/TemplateShowcase";
import { Footer } from "@/components/landing/Closing";
import { Nav } from "@/components/landing/Nav";
import { COMMON_FEATURES, FAMILIES, FONT_VAR, findFamily, findTemplate, familyHref, groupLabel, type TemplateFamily } from "@/lib/templates/registry";

type Props = PageProps<"/mau-thiep/[id]">;

export function generateStaticParams() {
  return FAMILIES.map((f) => ({ id: f.id }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const f = findFamily((await params).id);
  if (!f) return { title: "Không tìm thấy mẫu thiệp" };
  return { title: `Mẫu thiệp ${f.name} — SayIDo`, description: f.description };
}

/** Mẫu liên quan: cùng chủ đề trước, rồi tới mẫu đã sẵn sàng. */
function related(f: TemplateFamily) {
  const score = (o: TemplateFamily) => (o.group === f.group ? 2 : 0) + (o.status === "ready" ? 1 : 0);
  return FAMILIES.filter((o) => o.id !== f.id)
    .sort((a, b) => score(b) - score(a))
    .slice(0, 3);
}

function Detail({ f }: { f: TemplateFamily }) {
  const i = FAMILIES.indexOf(f);
  const prev = FAMILIES[(i - 1 + FAMILIES.length) % FAMILIES.length];
  const next = FAMILIES[(i + 1) % FAMILIES.length];

  return (
    <ShowcaseProvider f={f}>
      <nav className="gl-crumbs container" aria-label="Đường dẫn">
        <a href="/">Trang chủ</a>
        <span aria-hidden="true">/</span>
        <a href="/mau-thiep">Kho mẫu thiệp</a>
        <span aria-hidden="true">/</span>
        <span aria-current="page">{f.name}</span>
      </nav>

      <article className="gd container">
        <ShowcasePreview f={f} />

        <div className="gd-info">
          <p className="eyebrow">{groupLabel(f.group)}</p>
          <h1 className="gd-title">{f.name}</h1>
          <p className="gd-mood">{f.tagline}</p>

          <ShowcaseActions f={f} />

          <section className="gd-block">
            <h2>Điểm đặc biệt</h2>
            <ul className="gd-highlights">
              {f.highlights.map((h) => (
                <li key={h}>{h}</li>
              ))}
            </ul>
          </section>

          <section className="gd-block">
            <h2>Bố cục & hiệu ứng</h2>
            <p className="gd-motion">{f.layout}</p>
            <p className="gd-motion gd-motion--sub">{f.motion}</p>
          </section>

          <ShowcasePalette />

          <section className="gd-block">
            <h2>Phông chữ</h2>
            <p className="gd-fonts">
              <span style={{ fontFamily: FONT_VAR[f.fonts.heading] }}>Minh Quân &amp; Thanh Mai</span>
              <span style={{ fontFamily: FONT_VAR[f.fonts.script], fontStyle: "italic" }}>Trân trọng kính mời</span>
            </p>
          </section>

          <section className="gd-block">
            <h2>Phù hợp cho</h2>
            <ul className="gd-tags">
              {f.occasions.map((o) => (
                <li key={o}>{o}</li>
              ))}
            </ul>
          </section>

          <section className="gd-block">
            <h2>Có sẵn trong mọi mẫu</h2>
            <ul className="gd-features">
              {COMMON_FEATURES.map((x) => (
                <li key={x}>{x}</li>
              ))}
            </ul>
          </section>

          {f.faqs.length > 0 && (
            <section className="gd-block">
              <h2>Hỏi đáp về mẫu</h2>
              <div className="gd-faq">
                {f.faqs.map((q) => (
                  <details key={q.q}>
                    <summary>{q.q}</summary>
                    <p>{q.a}</p>
                  </details>
                ))}
              </div>
            </section>
          )}

          <nav className="gd-pager" aria-label="Mẫu trước và mẫu sau">
            <a href={familyHref(prev)}>← {prev.name}</a>
            <a href={familyHref(next)}>{next.name} →</a>
          </nav>
        </div>
      </article>

      <section className="gd-more container" aria-labelledby="gd-more-title">
        <div className="gd-more-head">
          <h2 id="gd-more-title" className="h2">
            Mẫu <em>khác</em>
          </h2>
          <a href="/mau-thiep" className="btn btn--ghost btn--sm">
            Xem tất cả {FAMILIES.length} mẫu
          </a>
        </div>
        <ul className="gl-grid">
          {related(f).map((o) => (
            <li key={o.id}>
              <GalleryCard f={o} />
            </li>
          ))}
        </ul>
      </section>
    </ShowcaseProvider>
  );
}

/** Mọi mẫu đã được prerender; mã lạ cần trả 404 thật nên cho phép chặn. */
export const instant = false;

export default async function TemplateDetailPage({ params }: Props) {
  const { id } = await params;
  const f = findFamily(id);
  if (!f) {
    // Link cũ dạng /mau-thiep/<mẫu>-<màu> → trang mẫu, chọn sẵn màu đó.
    const old = findTemplate(id);
    if (old) permanentRedirect(familyHref(old.family, old.variant.id));
    notFound();
  }
  return (
    <AuthProvider>
      <Nav onHome={false} />
      <main className="gl gl--detail">
        <Detail f={f} />
      </main>
      <Footer onHome={false} />
    </AuthProvider>
  );
}
