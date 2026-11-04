"use client";

import { useMemo } from "react";
import { useVariant } from "@/components/gallery/useVariant";
import type { TemplateFamily } from "@/lib/templates/registry";
import type { Wedding } from "@/lib/wedding/types";
import { Invitation } from "./Invitation";

/** Thiệp demo của một mẫu + thanh đổi màu nổi: màu là tuỳ chọn bên trong mẫu. */
export function DemoSwitcher({ f, wedding }: { f: TemplateFamily; wedding: Wedding }) {
  const [t, choose] = useVariant(f);
  const w = useMemo(() => ({ ...wedding, template: t.id }), [wedding, t.id]);
  return (
    <>
      <Invitation key={f.id} wedding={w} />
      <div className="demo-bar" role="group" aria-label="Thử màu khác cho mẫu">
        <a href={`/mau-thiep/${f.id}${t.variant.id === f.variants[0].id ? "" : `?mau=${t.variant.id}`}`} className="demo-back" aria-label="Về trang mẫu">
          ←
        </a>
        <span className="demo-name">{f.name}</span>
        {f.variants.length > 1 && (
          <span className="demo-colors">
            {f.variants.map((v) => (
              <button
                key={v.id}
                type="button"
                title={v.label}
                aria-label={`Màu ${v.label}`}
                aria-pressed={v.id === t.variant.id}
                className={v.id === t.variant.id ? "is-active" : ""}
                style={{ background: `linear-gradient(135deg, ${v.tokens.cover} 50%, ${v.tokens.bg} 50%)` }}
                onClick={() => choose(v.id)}
              />
            ))}
          </span>
        )}
        <a href={`/tao-thiep?mau=${t.id}`} className="demo-use">
          Dùng mẫu này
        </a>
      </div>
    </>
  );
}
