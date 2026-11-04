import { InviteCard } from "@/components/landing/InviteCard";
import { thumbOf, type TemplateRef } from "@/lib/templates/registry";

/** Thumbnail một mẫu: ảnh chụp bìa demo thật nếu có, không thì thẻ minh hoạ CSS. */
export function TemplateThumb({ t, sizes = "(max-width: 640px) 50vw, 360px", eager = false }: { t: TemplateRef; sizes?: string; eager?: boolean }) {
  const src = thumbOf(t);
  if (!src) return <InviteCard tpl={t} />;
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      className="tpl-thumb-img"
      src={src}
      sizes={sizes}
      width={645}
      height={1146}
      alt={`Bìa thiệp mẫu ${t.family.name} – ${t.variant.label}`}
      loading={eager ? "eager" : "lazy"}
      decoding="async"
    />
  );
}
