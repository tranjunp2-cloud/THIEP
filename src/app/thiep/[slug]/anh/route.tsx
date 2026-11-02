import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";
import { getWedding } from "@/lib/store";
import { dotDate, lunar, mainEvent } from "@/lib/wedding/format";

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
  const gold = "#e9d6a8";

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
          background: "radial-gradient(ellipse at 50% 30%, #35603f 0%, #1d3a29 55%, #12251b 100%)",
          color: "#f4ecd8",
          fontFamily: "Cormorant",
          position: "relative",
        }}
      >
        <div style={{ position: "absolute", top: 28, left: 28, right: 28, bottom: 28, border: "1.5px solid rgba(233,214,168,0.45)", borderRadius: 18, display: "flex" }} />
        <div style={{ position: "absolute", top: 40, left: 40, right: 40, bottom: 40, border: "1px solid rgba(233,214,168,0.2)", borderRadius: 12, display: "flex" }} />
        <div style={{ fontFamily: "BeVietnam", fontSize: 22, letterSpacing: 8, color: gold, textTransform: "uppercase" }}>
          {guest ? "Trân trọng kính mời" : "Thiệp mời cưới"}
        </div>
        {guest && (
          <div style={{ fontFamily: "GreatVibes", fontSize: 92, lineHeight: 1.15, marginTop: 6, color: "#fbf3df" }}>{guest.name}</div>
        )}
        <div style={{ fontSize: guest ? 30 : 34, marginTop: guest ? 6 : 18, color: "#e7dfc9" }}>
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
        <div style={{ fontFamily: "BeVietnam", fontSize: 20, marginTop: 14, color: "rgba(244,236,216,0.75)" }}>
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
