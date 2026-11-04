"use client";

import { useState } from "react";
import { COLOR_GROUPS, FAMILIES, THEME_GROUPS, type ColorGroup, type ThemeGroup } from "@/lib/templates/registry";
import { GalleryCard } from "./GalleryCard";

/** Lưới mẫu thiệp (mỗi mẫu một thẻ) + bộ lọc chủ đề × màu. Mẫu đã sẵn sàng xếp trước. */
export function GalleryGrid() {
  const [group, setGroup] = useState<ThemeGroup | null>(null);
  const [color, setColor] = useState<ColorGroup | null>(null);

  const list = FAMILIES.filter((f) => (!group || f.group === group) && (!color || f.variants.some((v) => v.color === color))).sort(
    (a, b) => Number(b.status === "ready") - Number(a.status === "ready"),
  );
  const count = (g: ThemeGroup | null) => FAMILIES.filter((f) => !g || f.group === g).length;

  return (
    <>
      <div className="gl-filters" role="group" aria-label="Lọc theo chủ đề">
        <button type="button" className={`gl-chip${group === null ? " is-active" : ""}`} aria-pressed={group === null} onClick={() => setGroup(null)}>
          Tất cả <span>{count(null)}</span>
        </button>
        {THEME_GROUPS.map((g) => (
          <button
            key={g.id}
            type="button"
            className={`gl-chip${group === g.id ? " is-active" : ""}`}
            aria-pressed={group === g.id}
            onClick={() => setGroup(g.id)}
          >
            {g.label} <span>{count(g.id)}</span>
          </button>
        ))}
      </div>
      <div className="gl-colors" role="group" aria-label="Lọc theo màu">
        <span className="gl-colors-label">Có màu</span>
        {COLOR_GROUPS.map((c) => (
          <button
            key={c.id}
            type="button"
            className={`gl-swatch${color === c.id ? " is-active" : ""}`}
            aria-pressed={color === c.id}
            title={c.label}
            onClick={() => setColor(color === c.id ? null : c.id)}
          >
            <span style={{ background: c.swatch }} aria-hidden="true" />
            {c.label}
          </button>
        ))}
      </div>
      {list.length ? (
        <ul className="gl-grid">
          {list.map((f) => {
            // Lọc theo màu: thẻ hiện sẵn biến thể đúng màu đó.
            const initial = color ? f.variants.find((v) => v.color === color)?.id : undefined;
            return (
              <li key={`${f.id}-${initial ?? ""}`}>
                <GalleryCard f={f} initialVariant={initial} />
              </li>
            );
          })}
        </ul>
      ) : (
        <p className="gl-empty">
          Chưa có mẫu nào khớp bộ lọc.{" "}
          <button
            type="button"
            onClick={() => {
              setGroup(null);
              setColor(null);
            }}
          >
            Xem tất cả mẫu
          </button>
        </p>
      )}
    </>
  );
}
