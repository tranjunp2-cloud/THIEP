"use client";

import { createContext, useContext, type ReactNode } from "react";
import { formatVnd, priceOf, type TemplateFamily, type TemplateRef } from "@/lib/templates/registry";
import { TemplateThumb } from "./TemplateThumb";
import { useVariant } from "./useVariant";

type Ctx = readonly [TemplateRef, (id: string) => void];
const ShowcaseContext = createContext<Ctx | null>(null);

/** Giữ màu đang chọn cho cả trang chi tiết (ảnh, nút, bảng màu dùng chung). */
export function ShowcaseProvider({ f, children }: { f: TemplateFamily; children: ReactNode }) {
  const value = useVariant(f);
  return <ShowcaseContext.Provider value={value}>{children}</ShowcaseContext.Provider>;
}

const useShowcase = () => useContext(ShowcaseContext)!;

/** Ảnh xem trước của mẫu — đổi theo màu đang chọn. */
export function ShowcasePreview({ f }: { f: TemplateFamily }) {
  const [t] = useShowcase();
  const ready = f.status === "ready";
  return (
    <div className="gd-preview">
      <div className={`gd-card${ready ? "" : " is-soon"}`}>
        <TemplateThumb key={t.id} t={t} sizes="(max-width: 899px) 320px, 400px" eager />
      </div>
      {ready && (
        <a href={`/mau-thiep/${f.id}/demo?mau=${t.variant.id}`} className="gd-demo-link">
          Mở thiệp demo đầy đủ ↗
        </a>
      )}
    </div>
  );
}

/** Chọn màu + giá + nút hành động của mẫu. */
export function ShowcaseActions({ f }: { f: TemplateFamily }) {
  const [t, choose] = useShowcase();
  const ready = f.status === "ready";
  const price = priceOf(f);
  return (
    <>
      {f.variants.length > 1 && (
        <div className="gd-variants-wrap">
          <p className="gd-variants-label">
            Màu: <b>{t.variant.label}</b>
          </p>
          <div className="gd-variants" role="group" aria-label="Chọn màu cho mẫu">
            {f.variants.map((o) => {
              const active = o.id === t.variant.id;
              return (
                <button
                  key={o.id}
                  type="button"
                  className={`gd-variant${active ? " is-active" : ""}`}
                  aria-pressed={active}
                  onClick={() => choose(o.id)}
                >
                  <span style={{ background: `linear-gradient(135deg, ${o.tokens.cover} 50%, ${o.tokens.bg} 50%)` }} aria-hidden="true" />
                  {o.label}
                  {o.isNew && <em>Mới</em>}
                </button>
              );
            })}
          </div>
        </div>
      )}

      <div className="gd-price">
        <strong>{formatVnd(price.price)}</strong>
        <span>Gói {price.label} · đã gồm mọi màu · tạo & xem trước miễn phí, ưng ý mới thanh toán</span>
      </div>

      <p className="gd-desc">{f.description}</p>

      <div className="gd-actions">
        {ready ? (
          <>
            <a href={`/tao-thiep?mau=${t.id}`} data-require-auth className="btn btn--dark">
              Dùng mẫu này
            </a>
            <a href={`/mau-thiep/${f.id}/demo?mau=${t.variant.id}`} className="btn btn--ghost">
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
    </>
  );
}

/** Bảng màu của màu đang chọn. */
export function ShowcasePalette() {
  const [t] = useShowcase();
  const k = t.variant.tokens;
  return (
    <section className="gd-block">
      <h2>Bảng màu {t.variant.label}</h2>
      <ul className="gd-palette">
        {(
          [
            ["Nền", k.bg],
            ["Chữ", k.fg],
            ["Nhấn", k.accent],
            ["Bìa", k.cover],
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
  );
}
