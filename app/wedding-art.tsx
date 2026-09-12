import manifest from './wedding-art-manifest.json';

type WeddingArtProps = {
 name: string;
 alt?: string;
 className?: string;
 width?: number;
 height?: number;
};

export function WeddingArt({name, alt = '', className = '', width = 1024, height = 1024}: WeddingArtProps) {
 const asset = (manifest as Record<string, {width:number;height:number;smallWidth?:number}>)[name];
 return <img src={`/images/wedding/${name}.webp`} srcSet={asset?.smallWidth ? `/images/wedding/${name}-640.webp 640w, /images/wedding/${name}.webp ${asset.width}w` : undefined} sizes="(max-width: 640px) 100vw, 900px" alt={alt} aria-hidden={alt ? undefined : true} className={`wedding-art ${className}`} width={asset?.width ?? width} height={asset?.height ?? height} loading="lazy" decoding="async"/>;
}
