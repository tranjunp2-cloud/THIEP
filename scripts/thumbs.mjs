#!/usr/bin/env node
/**
 * Chụp thumbnail cho từng mẫu thiệp từ chính bản demo (bìa đã mở, khung điện thoại).
 *
 *   npm run dev            # chạy site trước
 *   npm run thumbs         # chụp tất cả mẫu đã sẵn sàng
 *   npm run thumbs -- lua-do-do dem-sao-xanh-dem   # chỉ chụp vài mẫu
 *
 * Biến môi trường: BASE_URL (mặc định http://localhost:3000), CHROME (đường dẫn Chrome).
 * Ảnh lưu tại public/thiep/thumbs/<mã mẫu>.jpg — trang kho mẫu tự dùng nếu file tồn tại.
 */
import { spawn } from "node:child_process";
import { mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";

const BASE = process.env.BASE_URL ?? "http://localhost:3000";
const CHROME = process.env.CHROME ?? "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";
const OUT = join(process.cwd(), "public/thiep/thumbs");
const W = 430;
const H = 764; // tỉ lệ ~ 9:16 như màn hình điện thoại
const SCALE = 1.5;
/** Dòng mẫu chụp thumbnail từ một khối riêng (selector) thay vì bìa — khối nổi bật nhất của mẫu đó. */
const THUMB_SECTION = { "sen-hong": ".couple .cp-pair" };

/** "lua-do-xanh-ngoc" → ["lua-do", "xanh-ngoc"], dựa trên danh sách dòng mẫu trong registry. */
let FAMILY_IDS = [];
function splitId(id) {
  const f = FAMILY_IDS.filter((x) => id.startsWith(`${x}-`)).sort((a, b) => b.length - a.length)[0];
  if (!f) throw new Error(`Không rõ mẫu của mã "${id}"`);
  return [f, id.slice(f.length + 1)];
}

/** Đọc danh sách mã mẫu "ready" từ registry (không cần chạy TypeScript). */
function readyTemplateIds() {
  const src = readFileSync(join(process.cwd(), "src/lib/templates/registry.ts"), "utf8");
  const ids = [];
  for (const block of src.split(/\n  \{\n    id: "/).slice(1)) {
    const family = block.slice(0, block.indexOf('"'));
    FAMILY_IDS.push(family);
    if (!/status: "ready"/.test(block.slice(0, block.indexOf("variants:")))) continue;
    const variants = block.slice(block.indexOf("variants:"));
    for (const m of variants.matchAll(/\n {8}id: "([^"]+)"/g)) ids.push(`${family}-${m[1]}`);
  }
  return ids;
}

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function main() {
  const all = readyTemplateIds();
  const ids = process.argv.slice(2).length ? process.argv.slice(2) : all;
  if (!ids.length) throw new Error("Không tìm thấy mẫu nào.");
  mkdirSync(OUT, { recursive: true });

  const profile = mkdtempSync(join(tmpdir(), "sayido-thumbs-"));
  const port = 9400 + Math.floor(Math.random() * 400);
  const chrome = spawn(CHROME, ["--headless=new", "--hide-scrollbars", "--mute-audio", `--remote-debugging-port=${port}`, `--user-data-dir=${profile}`, "about:blank"], {
    stdio: "ignore",
  });

  try {
    let target;
    for (let i = 0; i < 60 && !target; i++) {
      await sleep(200);
      try {
        target = (await (await fetch(`http://127.0.0.1:${port}/json`)).json()).find((t) => t.type === "page");
      } catch {}
    }
    if (!target) throw new Error("Không mở được Chrome — đặt biến CHROME trỏ tới Chrome/Chromium.");

    const ws = new WebSocket(target.webSocketDebuggerUrl);
    await new Promise((r) => (ws.onopen = r));
    let seq = 0;
    const pending = new Map();
    ws.onmessage = (m) => {
      const d = JSON.parse(m.data);
      if (d.id && pending.has(d.id)) pending.get(d.id)(d);
    };
    const send = (method, params = {}) =>
      new Promise((resolve, reject) => {
        const id = ++seq;
        pending.set(id, (d) => (d.error ? reject(new Error(d.error.message)) : resolve(d.result)));
        ws.send(JSON.stringify({ id, method, params }));
      });
    const run = (expression) => send("Runtime.evaluate", { expression, awaitPromise: true, returnByValue: true });

    await send("Page.enable");
    await send("Emulation.setDeviceMetricsOverride", { width: W, height: H, deviceScaleFactor: SCALE, mobile: true });

    for (const id of ids) {
      const [family, variant] = splitId(id);
      await send("Page.navigate", { url: `${BASE}/mau-thiep/${family}/demo?mau=${variant}` });
      await sleep(3500);
      await run(`(async () => {
        // Ẩn phần không thuộc thiệp: nút nhạc, lớp dev của Next, hiệu ứng nền, nút "Khám phá".
        const css = document.createElement("style");
        css.textContent = ".wedding-music, nextjs-portal, .ambient, .discover, .desktop-nav, .demo-bar { display: none !important; }";
        document.head.append(css);
        // Bìa chụp toàn khung (không viền lề desktop) và tải ngay mọi ảnh ở bìa.
        css.textContent += " .hero { max-width: none !important; } .hero.has-photo, .hero { height: 100svh !important; min-height: 0 !important; }";
        document.querySelectorAll(".hero img").forEach((i) => (i.loading = "eager"));
        document.querySelector(".open-invitation")?.click();
        await Promise.all([...document.querySelectorAll(".hero img")].map((i) => i.decode().catch(() => {})));
      })()`);
      await sleep(3600); // đợi animation mở thiệp chạy xong
      // Mẫu có khối đặc trưng hơn bìa: chụp từ khối đó thay vì bìa.
      let top = 0;
      const section = THUMB_SECTION[family];
      if (section) {
        const r = await run(`(async () => {
          const el = document.querySelector(${JSON.stringify(section)});
          el.scrollIntoView({ block: "start" });
          await new Promise((r) => setTimeout(r, 1800));
          el.querySelectorAll("img").forEach((i) => (i.loading = "eager"));
          await Promise.all([...el.querySelectorAll("img")].map((i) => i.decode().catch(() => {})));
          return el.getBoundingClientRect().top + window.scrollY - 150;
        })()`);
        top = Math.max(0, Math.round(r.result.value));
        await sleep(800);
      }
      const shot = await send("Page.captureScreenshot", {
        format: "jpeg",
        quality: 82,
        captureBeyondViewport: top > 0,
        clip: { x: 0, y: top, width: W, height: H, scale: 1 },
      });
      writeFileSync(join(OUT, `${id}.jpg`), Buffer.from(shot.data, "base64"));
      console.log("✓", id);
    }
    ws.close();
  } finally {
    chrome.kill();
    await sleep(300);
    rmSync(profile, { recursive: true, force: true });
  }
}

main().catch((e) => {
  console.error(e.message);
  process.exit(1);
});
