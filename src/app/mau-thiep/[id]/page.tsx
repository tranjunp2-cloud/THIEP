import type { Metadata } from "next";
import { notFound } from "next/navigation";
import "../../landing.css";
import "../gallery.css";
import { AuthProvider } from "@/components/auth/AuthProvider";
import { GalleryCard } from "@/components/gallery/GalleryCard";
import { Footer } from "@/components/landing/Closing";
import { TemplateThumb } from "@/components/gallery/TemplateThumb";
import { Nav } from "@/components/landing/Nav";
import {
  ALL_TEMPLATES,
  COMMON_FEATURES,
  FONT_VAR,
  findTemplate,
  formatVnd,
  groupLabel,
  priceOf,
  templateHref,
  type TemplateRef,
} from "@/lib/templates/registry";

type Props = PageProps<"/mau-thiep/[id]">;

export function generateStaticParams() {
  return ALL_TEMPLATES.map((t) => ({ id: t.id }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const t = findTemplate((await params).id);
  if (!t) return { title: "Không tìm thấy mẫu thiệp" };
  return { title: `Mẫu thiệp ${t.family.name} · ${t.variant.label} — SayIDo`, description: t.family.description };
}

/** Mẫu liên quan: các mẫu khác cùng chủ đề trước, rồi tới mẫu đã sẵn sàng. */
function related(t: TemplateRef) {
  const others = ALL_TEMPLATES.filter((o) => o.family.id !== t.family.id);
  const score = (o: TemplateRef) => (o.family.group === t.family.group ? 2 : 0) + (o.family.status === "ready" ? 1 : 0);
  const seen = new Set<string>();
  return others
    .sort((a, b) => score(b) - score(a))
    .filter((o) => !seen.has(o.family.id) && seen.add(o.family.id))
    .slice(0, 3);
}

function Detail({ t }: { t: TemplateRef }) {
  const { family: f, variant: v } = t;
  const ready = f.status === "ready";
  const price = priceOf(f);
  const i = ALL_TEMPLATES.indexOf(t);
  const prev = ALL_TEMPLATES[(i - 1 + ALL_TEMPLATES.length) % ALL_TEMPLATES.length];
  const next = ALL_TEMPLATES[(i + 1) % ALL_TEMPLATES.length];

  return (
    <>
      <nav className="gl-crumbs container" aria-label="Đường dẫn">
        <a href="/">Trang chủ</a>
        <span aria-hidden="true">/</span>
        <a href="/mau-thiep">Kho mẫu thiệp</a>
        <span aria-hidden="true">/</span>
        <span aria-current="page">
          {f.name} · {v.label}
        </span>
      </nav>

      <article className="gd container">
        <div className="gd-preview">
          <div className={`gd-card${ready ? "" : " is-soon"}`}>
            <TemplateThumb t={t} sizes="(max-width: 899px) 340px, 460px" eager />
          </div>
          {ready && (
            <a href={`${templateHref(t.id)}/demo`} className="gd-demo-link">
              Mở thiệp demo đầy đủ ↗
            </a>
          )}
        </div>

        <div className="gd-info">
          <p className="eyebrow">{groupLabel(f.group)}</p>
          <h1 className="gd-title">{f.name}</h1>
          <p className="gd-mood">{f.tagline}</p>

          <div className="gd-variants" role="group" aria-label="Biến thể màu">
            {f.variants.map((o) => {
              const id = `${f.id}-${o.id}`;
              const active = o.id === v.id;
              return (
                <a key={o.id} href={templateHref(id)} className={`gd-variant${active ? " is-active" : ""}`} aria-current={active ? "page" : undefined}>
                  <span style={{ background: `linear-gradient(135deg, ${o.tokens.cover} 50%, ${o.tokens.bg} 50%)` }} aria-hidden="true" />
                  {o.label}
                  {o.isNew && <em>Mới</em>}
                </a>
              );
            })}
          </div>

          <div className="gd-price">
            <strong>{formatVnd(price.price)}</strong>
            <span>
              Gói {price.label} · tạo & xem trước miễn phí, ưng ý mới thanh toán
            </span>
          </div>

          <p className="gd-desc">{f.description}</p>

          <div className="gd-actions">
            {ready ? (
              <>
                <a href={`/tao-thiep?mau=${t.id}`} data-require-auth className="btn btn--dark">
                  Dùng mẫu này
                </a>
                <a href={`${templateHref(t.id)}/demo`} className="btn btn--ghost">
                  Xem demo
                </a>
              </>
            ) : (
              <>
                <span className="btn btn--ghost is-disabled" aria-disabled="true">
                  Đang hoàn thiện
                </span>
                <a href="/mau-thiep" className="btn btn--ghost">
                  Xem mẫu đã sẵn sàng
                </a>
              </>
            )}
          </div>

          <section className="gd-block">
            <h2>Điểm đặc biệt</h2>
            <ul className="gd-highlights">
              {f.highlights.map((h) => (
                <li key={h}>{h}</li>
              ))}
            </ul>
          </section>

          <section className="gd-block">
            <h2>Bảng màu {v.label}</h2>
            <ul className="gd-palette">
              {(
                [
                  ["Nền", v.tokens.bg],
                  ["Chữ", v.tokens.fg],
                  ["Nhấn", v.tokens.accent],
                  ["Bìa", v.tokens.cover],
                ] as const
              ).map(([name, hex]) => (
                <li key={name}>
                  <span className="gd-swatch" style={{ background: hex }} />
                  <span>
                    {name}
                    <code>{hex}</code>
                  </span>
                </li>
              ))}
            </ul>
          </section>

          <section className="gd-block">
            <h2>Hiệu ứng</h2>
            <p className="gd-motion">{f.motion}</p>
          </section>

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
            <a href={templateHref(prev.id)}>
              ← {prev.family.name} · {prev.variant.label}
            </a>
            <a href={templateHref(next.id)}>
              {next.family.name} · {next.variant.label} →
            </a>
          </nav>
        </div>
      </article>

      <section className="gd-more container" aria-labelledby="gd-more-title">
        <div className="gd-more-head">
          <h2 id="gd-more-title" className="h2">
            Mẫu <em>liên quan</em>
          </h2>
          <a href="/mau-thiep" className="btn btn--ghost btn--sm">
            Xem tất cả {ALL_TEMPLATES.length} mẫu
          </a>
        </div>
        <ul className="gl-grid">
          {related(t).map((o) => (
            <li key={o.id}>
              <GalleryCard t={o} />
            </li>
          ))}
        </ul>
      </section>
    </>
  );
}

/** Mọi mã mẫu hợp lệ đã được prerender; mã lạ cần trả 404 thật nên cho phép chặn. */
export const instant = false;

export default async function TemplateDetailPage({ params }: Props) {
  const t = findTemplate((await params).id);
  if (!t) notFound();
  return (
    <AuthProvider>
      <Nav onHome={false} />
      <main className="gl gl--detail">
        <Detail t={t} />
      </main>
      <Footer onHome={false} />
    </AuthProvider>
  );
}
