import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";
import { getWedding } from "@/lib/store";
import { resolveTemplate } from "@/lib/templates/registry";
import { dotDate, lunar, mainEvent } from "@/lib/wedding/format";

/** Trộn hai màu hex (ảnh OG không hỗ trợ color-mix). */
function mix(a: string, b: string, t: number) {
  const p = (h: string) => [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16));
  const [x, y] = [p(a), p(b)];
  return `#${x.map((v, i) => Math.round(v + (y[i] - v) * t).toString(16).padStart(2, "0")).join("")}`;
}
const alpha = (hex: string, a: number) => `${hex}${Math.round(a * 255).toString(16).padStart(2, "0")}`;

/** Bảng màu ảnh xem trước theo mẫu thiệp. Ngà Botanical giữ đúng màu gốc. */
function ogColors(template: string | undefined) {
  const t = resolveTemplate(template);
  if (t.family.skin === "botanical" && t.variant.id === "reu")
    return { bg: "radial-gradient(ellipse at 50% 30%, #35603f 0%, #1d3a29 55%, #12251b 100%)", fg: "#f4ecd8", gold: "#e9d6a8", bright: "#fbf3df", soft: "#e7dfc9" };
  const k = t.variant.tokens;
  const gold = t.family.skin === "song-hy" ? k.coverFg : mix(k.accent, k.coverFg, 0.25);
  return {
    bg: `radial-gradient(ellipse at 50% 30%, ${mix(k.cover, "#ffffff", 0.14)} 0%, ${k.cover} 55%, ${mix(k.cover, "#000000", 0.4)} 100%)`,
    fg: k.coverFg,
    gold,
    bright: mix(k.coverFg, "#ffffff", 0.4),
    soft: mix(k.coverFg, k.cover, 0.12),
  };
}

const font = (f: string) => readFile(join(process.cwd(), "assets/fonts", f));
const fontsPromise = Promise.all([
  font("CormorantGaramond-Medium.ttf"),
  font("GreatVibes-Regular.ttf"),
  font("BeVietnamPro-Medium.ttf"),
]);

/** Ảnh xem trước khi gửi link qua Zalo / Messenger — có tên từng vị khách. */
export async function GET(request: Request, ctx: RouteContext<"/thiep/[slug]/anh">) {
  const { slug } = await ctx.params;
  const w = await getWedding(slug).catch(() => null);
  if (!w) return new Response("Not found", { status: 404 });
  const key = new URL(request.url).searchParams.get("k") ?? "";
  const guest = w.guests.find((g) => g.key === key);
  const e = mainEvent(w);
  const [serif, script, sans] = await fontsPromise;
  const c = ogColors(w.template);
  const gold = c.gold;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: c.bg,
          color: c.fg,
          fontFamily: "Cormorant",
          position: "relative",
        }}
      >
        <div style={{ position: "absolute", top: 28, left: 28, right: 28, bottom: 28, border: `1.5px solid ${alpha(gold, 0.45)}`, borderRadius: 18, display: "flex" }} />
        <div style={{ position: "absolute", top: 40, left: 40, right: 40, bottom: 40, border: `1px solid ${alpha(gold, 0.2)}`, borderRadius: 12, display: "flex" }} />
        <div style={{ fontFamily: "BeVietnam", fontSize: 22, letterSpacing: 8, color: gold, textTransform: "uppercase" }}>
          {guest ? "Trân trọng kính mời" : "Thiệp mời cưới"}
        </div>
        {guest && (
          <div style={{ fontFamily: "GreatVibes", fontSize: 92, lineHeight: 1.15, marginTop: 6, color: c.bright }}>{guest.name}</div>
        )}
        <div style={{ fontSize: guest ? 30 : 34, marginTop: guest ? 6 : 18, color: c.soft }}>
          {guest ? "tới dự lễ thành hôn của" : "Lễ thành hôn của"}
        </div>
        <div style={{ fontFamily: "GreatVibes", fontSize: guest ? 70 : 120, lineHeight: 1.2, color: gold, marginTop: 4 }}>
          {`${w.groom.short} & ${w.bride.short}`}
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 18, marginTop: 14 }}>
          <div style={{ width: 70, height: 1, background: gold, display: "flex" }} />
          <div style={{ fontSize: 34, letterSpacing: 6 }}>{dotDate(e.start)}</div>
          <div style={{ width: 70, height: 1, background: gold, display: "flex" }} />
        </div>
        <div style={{ fontFamily: "BeVietnam", fontSize: 20, marginTop: 14, color: alpha(c.fg, 0.75) }}>
          {`${lunar(e.start)} · ${e.venue}`}
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
      fonts: [
        { name: "Cormorant", data: serif, weight: 500, style: "normal" },
        { name: "GreatVibes", data: script, weight: 400, style: "normal" },
        { name: "BeVietnam", data: sans, weight: 500, style: "normal" },
      ],
      headers: { "Cache-Control": "public, max-age=300, s-maxage=3600" },
    },
  );
}
