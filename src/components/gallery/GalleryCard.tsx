import { TemplateThumb } from "./TemplateThumb";
import { formatVnd, priceOf, templateHref, type TemplateRef } from "@/lib/templates/registry";

/** Thẻ một mẫu (một biến thể màu) — dùng ở kho mẫu và mục "Mẫu liên quan". */
export function GalleryCard({ t }: { t: TemplateRef }) {
  const { family: f, variant: v } = t;
  const ready = f.status === "ready";
  return (
    <a href={templateHref(t.id)} className="gl-card" aria-label={`Xem chi tiết mẫu ${f.name} – ${v.label}`}>
      <div className={`gl-thumb${ready ? " is-photo" : " is-soon"}`}>
        <span className="gl-screen">
          <TemplateThumb t={t} />
        </span>
        {ready && <span className="gl-view">Xem demo</span>}
        <span className="gl-badges">
          {!ready && <span className="gl-badge">Sắp ra mắt</span>}
          {ready && v.isNew && <span className="gl-badge is-new">Mới</span>}
        </span>
      </div>
      <div className="gl-meta">
        <span className="gl-dot" style={{ background: v.tokens.cover }} aria-hidden="true" />
        <div>
          <h3>
            {f.name} <span>· {v.label}</span>
          </h3>
          <p>
            {f.tagline} · {formatVnd(priceOf(f).price)}
          </p>
        </div>
        <span className="gl-arrow" aria-hidden="true">→</span>
      </div>
    </a>
  );
}
