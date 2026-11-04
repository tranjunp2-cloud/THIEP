"use client";

import { familyHref, formatVnd, priceOf, type TemplateFamily } from "@/lib/templates/registry";
import { TemplateThumb } from "./TemplateThumb";
import { useVariant } from "./useVariant";

/** Thẻ một mẫu thiệp. Màu là tuỳ chọn: chấm màu đổi ảnh xem trước ngay trên thẻ. */
export function GalleryCard({ f, initialVariant }: { f: TemplateFamily; initialVariant?: string }) {
  const [ref, choose] = useVariant(f, { syncUrl: false, initial: initialVariant });
  const ready = f.status === "ready";
  const isNew = f.variants.some((v) => v.isNew);

  return (
    <div className="gl-card">
      <a href={familyHref(f, ref.variant.id)} className="gl-link" aria-label={`Xem mẫu ${f.name}`}>
        <div className={`gl-thumb${ready ? " is-photo" : " is-soon"}`}>
          <span className="gl-screen">
            <TemplateThumb t={ref} />
          </span>
          {ready && <span className="gl-view">Xem mẫu</span>}
          <span className="gl-badges">
            {!ready && <span className="gl-badge">Sắp ra mắt</span>}
            {ready && isNew && <span className="gl-badge is-new">Mới</span>}
          </span>
        </div>
      </a>
      <div className="gl-meta">
        <div>
          <h3>
            <a href={familyHref(f, ref.variant.id)}>{f.name}</a>
          </h3>
          <p>
            {f.tagline} · {formatVnd(priceOf(f).price)}
          </p>
        </div>
        {f.variants.length > 1 && (
          <div className="gl-swatches" role="group" aria-label={`Màu của mẫu ${f.name}`}>
            {f.variants.map((v) => (
              <button
                key={v.id}
                type="button"
                title={v.label}
                aria-label={`Màu ${v.label}`}
                aria-pressed={v.id === ref.variant.id}
                className={v.id === ref.variant.id ? "is-active" : ""}
                style={{ background: `linear-gradient(135deg, ${v.tokens.cover} 50%, ${v.tokens.bg} 50%)` }}
                onClick={() => choose(v.id)}
                onPointerEnter={(e) => e.pointerType === "mouse" && choose(v.id)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
