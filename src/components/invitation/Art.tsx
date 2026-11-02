import manifest from "./art-manifest.json";

type Asset = { width: number; height: number; smallWidth?: number };

/** Tranh màu nước của mẫu "Ngà Botanical" (chuyển từ repo THIEP). */
export function Art({ name, alt = "", className = "" }: { name: string; alt?: string; className?: string }) {
  const asset = (manifest as Record<string, Asset>)[name];
  const src = `/thiep/images/${name}.webp`;
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={src}
      srcSet={asset?.smallWidth ? `/thiep/images/${name}-640.webp 640w, ${src} ${asset.width}w` : undefined}
      sizes="(max-width: 640px) 100vw, 900px"
      alt={alt}
      aria-hidden={alt ? undefined : true}
      className={`wedding-art ${className}`}
      width={asset?.width ?? 1024}
      height={asset?.height ?? 1024}
      loading="lazy"
      decoding="async"
    />
  );
}
