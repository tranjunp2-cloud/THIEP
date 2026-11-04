"use client";

import { useCallback, useEffect, useState } from "react";
import { variantRef, type TemplateFamily } from "@/lib/templates/registry";

/**
 * Màu đang chọn của một mẫu. Đọc/ghi `?mau=` trên URL để link chia sẻ giữ đúng màu,
 * nhưng trang vẫn tĩnh (đọc URL sau khi trang đã hiện).
 */
export function useVariant(f: TemplateFamily, { syncUrl = true, initial }: { syncUrl?: boolean; initial?: string } = {}) {
  const [variantId, setVariantId] = useState(initial && f.variants.some((v) => v.id === initial) ? initial : f.variants[0].id);

  useEffect(() => {
    if (!syncUrl) return;
    const v = new URLSearchParams(window.location.search).get("mau");
    // eslint-disable-next-line react-hooks/set-state-in-effect -- màu ban đầu chỉ biết được từ URL ở trình duyệt
    if (v && f.variants.some((x) => x.id === v)) setVariantId(v);
  }, [f, syncUrl]);

  const choose = useCallback(
    (id: string) => {
      setVariantId(id);
      if (!syncUrl) return;
      const url = new URL(window.location.href);
      if (id === f.variants[0].id) url.searchParams.delete("mau");
      else url.searchParams.set("mau", id);
      history.replaceState(history.state, "", url);
    },
    [f, syncUrl],
  );

  return [variantRef(f, variantId), choose] as const;
}
