"use client";

/** Thiệp đã tạo trên thiết bị này (kèm token quản lý) — chỉ lưu trong trình duyệt của người tạo. */
export type MineEntry = { slug: string; token: string; title: string; savedAt: string };

const KEY = "duyen:mine";

export function readMine(): MineEntry[] {
  try {
    const v = JSON.parse(localStorage.getItem(KEY) ?? "[]");
    return Array.isArray(v) ? v : [];
  } catch {
    return [];
  }
}

export function rememberMine(entry: MineEntry) {
  try {
    const rest = readMine().filter((m) => m.slug !== entry.slug);
    localStorage.setItem(KEY, JSON.stringify([entry, ...rest].slice(0, 20)));
  } catch {}
}

export function forgetMine(slug: string) {
  try {
    localStorage.setItem(KEY, JSON.stringify(readMine().filter((m) => m.slug !== slug)));
  } catch {}
}

/** Token đọc từ #t=… (phần sau dấu # không gửi lên server, không lọt vào log hay Referer). */
export function tokenFromHash() {
  if (typeof window === "undefined") return "";
  return new URLSearchParams(window.location.hash.slice(1)).get("t") ?? "";
}

export const absolute = (path: string) => (typeof window === "undefined" ? path : new URL(path, window.location.origin).toString());
