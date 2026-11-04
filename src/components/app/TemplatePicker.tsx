"use client";

import { useState } from "react";
import { TemplateThumb } from "@/components/gallery/TemplateThumb";
import { FAMILIES, formatVnd, priceOf, resolveTemplate } from "@/lib/templates/registry";

/** Chọn mẫu thiệp trong trang tạo/sửa thiệp. Đổi mẫu không động tới nội dung đã nhập. */
export function TemplatePicker({ value, onChange }: { value: string; onChange: (id: string) => void }) {
  const [open, setOpen] = useState(false);
  const current = resolveTemplate(value);
  const ready = FAMILIES.filter((f) => f.status === "ready");

  return (
    <section className="tpl-picker" aria-label="Mẫu thiệp">
      <div className="tpl-picker-head">
        <div className="tpl-picker-thumb">
          <TemplateThumb t={current} sizes="46px" />
        </div>
        <div className="tpl-picker-info">
          <span className="tpl-picker-label">Mẫu thiệp</span>
          <b>
            {current.family.name} · {current.variant.label}
          </b>
          <span className="tpl-picker-price">{formatVnd(priceOf(current.family).price)}</span>
        </div>
        <div className="tpl-picker-variants" role="group" aria-label="Màu của mẫu">
          {current.family.variants.map((v) => {
            const id = `${current.family.id}-${v.id}`;
            return (
              <button
                key={v.id}
                type="button"
                title={v.label}
                aria-label={`Màu ${v.label}`}
                aria-pressed={id === current.id}
                className={id === current.id ? "is-active" : ""}
                style={{ background: `linear-gradient(135deg, ${v.tokens.cover} 50%, ${v.tokens.bg} 50%)` }}
                onClick={() => onChange(id)}
              />
            );
          })}
        </div>
        <button type="button" className="btn btn-ghost btn-sm" aria-expanded={open} onClick={() => setOpen((o) => !o)}>
          {open ? "Đóng" : "Đổi mẫu"}
        </button>
      </div>

      {open && (
        <div className="tpl-picker-grid">
          {ready.map((f) => {
            const t = resolveTemplate(`${f.id}-${f.variants[0].id}`);
            const active = f.id === current.family.id;
            return (
              <button
                key={f.id}
                type="button"
                className={`tpl-picker-item${active ? " is-active" : ""}`}
                aria-pressed={active}
                onClick={() => {
                  onChange(active ? current.id : t.id);
                  setOpen(false);
                }}
              >
                <span className="tpl-picker-item-card">
                  <TemplateThumb t={active ? current : t} sizes="140px" />
                </span>
                <span className="tpl-picker-item-name">{f.name}</span>
                <span className="tpl-picker-item-meta">
                  {f.variants.length} màu · {formatVnd(priceOf(f).price)}
                </span>
              </button>
            );
          })}
          <a className="tpl-picker-all" href="/mau-thiep" target="_blank" rel="noreferrer">
            Xem kho mẫu ↗
          </a>
        </div>
      )}
      <p className="tpl-picker-note">Đổi mẫu bất cứ lúc nào — nội dung bạn đã nhập được giữ nguyên.</p>
    </section>
  );
}
