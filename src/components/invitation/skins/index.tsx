"use client";

import { createContext, useContext, type ReactNode } from "react";
import type { SkinId } from "@/lib/templates/registry";
import { Art } from "../Art";
import {
  Ampersand,
  CloudBand,
  CloudDivider,
  ConstellationDivider,
  Crescent,
  HairRule,
  HySeal,
  HyGlyph,
  LatticeCorner,
  Lanterns,
  NightHorizon,
  SquareSeal,
  StarCorner,
  StarField,
  StarSeal,
  TimelineGlyph,
} from "./motifs";

/**
 * Skin = bộ trang trí của một dòng mẫu. Mọi mẫu dùng chung các phần thiệp (bìa, đếm ngược, sự kiện…),
 * skin chỉ thay hình ở các "slot" dưới đây — nhờ vậy đổi mẫu không mất nội dung.
 */
export type Slot =
  | "hero"
  | "countdownSide"
  | "countdownFoot"
  | "invitationFoot"
  | "venueFrame"
  | "recovery"
  | "dressTop"
  | "dressFoot"
  | "giftFrame"
  | "rsvpTop"
  | "rsvpSide"
  | "footer";

const SkinContext = createContext<SkinId>("botanical");

export function SkinProvider({ skin, children }: { skin: SkinId; children: ReactNode }) {
  return <SkinContext.Provider value={skin}>{children}</SkinContext.Provider>;
}

export const useSkin = () => useContext(SkinContext);

/* Ngà Botanical: tranh màu nước gốc. */
const BOTANICAL: Record<Slot, string | null> = {
  hero: "candles",
  countdownSide: "floral-side",
  countdownFoot: "candles",
  invitationFoot: "leafy-garland",
  venueFrame: "ceremony-frame",
  recovery: "recovery-building",
  dressTop: "leafy-garland",
  dressFoot: "guests",
  giftFrame: "gifts-frame",
  rsvpTop: "envelope",
  rsvpSide: "topiary",
  footer: "estate-panorama",
};

function Corners({ Corner }: { Corner: (p: { className?: string }) => ReactNode }) {
  return (
    <span className="orn-corners" aria-hidden="true">
      <Corner className="orn-corner orn-corner--tl" />
      <Corner className="orn-corner orn-corner--tr" />
      <Corner className="orn-corner orn-corner--bl" />
      <Corner className="orn-corner orn-corner--br" />
    </span>
  );
}

const SVG_SKINS: Partial<Record<SkinId, Partial<Record<Slot, ReactNode>>>> = {
  "song-hy": {
    hero: (
      <>
        <CloudBand className="orn-hero-band orn-hero-band--top" />
        <HyGlyph className="orn-hero-hy" />
        <CloudBand className="orn-hero-band orn-hero-band--bottom" />
      </>
    ),
    countdownFoot: <CloudDivider className="orn-divider" />,
    invitationFoot: <CloudDivider className="orn-divider" hy />,
    venueFrame: <Corners Corner={LatticeCorner} />,
    recovery: <Lanterns className="orn-feature" />,
    dressTop: <CloudDivider className="orn-divider" />,
    giftFrame: <Corners Corner={LatticeCorner} />,
    rsvpTop: <HySeal className="orn-badge" />,
    footer: <Lanterns className="orn-footer" />,
  },
  "dem-sao": {
    hero: (
      <>
        <StarField className="orn-hero-stars" />
        <Crescent className="orn-hero-moon" />
      </>
    ),
    countdownFoot: <ConstellationDivider className="orn-divider" />,
    invitationFoot: <ConstellationDivider className="orn-divider" />,
    venueFrame: <Corners Corner={StarCorner} />,
    recovery: <Crescent className="orn-feature orn-feature--sm" />,
    dressTop: <ConstellationDivider className="orn-divider" />,
    giftFrame: <Corners Corner={StarCorner} />,
    rsvpTop: <Crescent className="orn-badge" />,
    footer: <NightHorizon className="orn-footer" />,
  },
  "toi-gian": {
    hero: <Ampersand className="orn-hero-amp" />,
    countdownFoot: <HairRule className="orn-divider" />,
    invitationFoot: <HairRule className="orn-divider" />,
    dressTop: <HairRule className="orn-divider" />,
    footer: <HairRule className="orn-divider" />,
  },
};

/** Hoạ tiết tại một vị trí trong thiệp, theo skin hiện tại. `className` là lớp bố cục của bản Ngà. */
export function Ornament({ slot, className = "" }: { slot: Slot; className?: string }) {
  const skin = useSkin();
  if (skin === "botanical") {
    const name = BOTANICAL[slot];
    return name ? <Art name={name} className={className} /> : null;
  }
  const node = SVG_SKINS[skin]?.[slot];
  return node ? <span className={`orn orn--${slot}`}>{node}</span> : null;
}

/** Biểu tượng từng mốc lịch trình. */
export function TimelineIcon({ art }: { art: string }) {
  const skin = useSkin();
  if (skin === "botanical") return <Art name={art} className="timeline-art" />;
  return (
    <span className="orn-timeline">
      <TimelineGlyph name={art} />
    </span>
  );
}

/** Con dấu trên bìa (nút mở thiệp). */
export function Seal({ g1, g2 }: { g1: string; g2: string }) {
  const skin = useSkin();
  const mono = (
    <span>
      {g1}
      <small>&amp;</small>
      {g2}
    </span>
  );
  if (skin === "song-hy") return <HySeal className="seal-art" />;
  if (skin === "dem-sao")
    return (
      <>
        <StarSeal className="seal-art" />
        {mono}
      </>
    );
  if (skin === "toi-gian")
    return (
      <>
        <SquareSeal className="seal-art" />
        {mono}
      </>
    );
  return (
    <>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src="/thiep/images/silver-seal.webp" alt="" aria-hidden="true" width="400" height="480" />
      {mono}
    </>
  );
}
