"use client";

import { useRef, useState } from "react";
import type { WeddingInput } from "@/lib/wedding/schema";
import type { Photo } from "@/lib/wedding/types";

type Photos = WeddingInput["photos"];
type Slot = "cover" | "groom" | "bride";

const MAX_ALBUM = 24;
const MAX_EDGE = 1800; // cạnh dài nhất sau khi nén
const isDemo = (p?: Photo) => Boolean(p?.src.startsWith("/thiep/demo/"));

/* ---------------- Nén ảnh ở trình duyệt ---------------- */

async function compress(file: File): Promise<{ blob: Blob; width: number; height: number }> {
  const bitmap = await createImageBitmap(file, { imageOrientation: "from-image" });
  const scale = Math.min(1, MAX_EDGE / Math.max(bitmap.width, bitmap.height));
  const width = Math.round(bitmap.width * scale);
  const height = Math.round(bitmap.height * scale);
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  canvas.getContext("2d")!.drawImage(bitmap, 0, 0, width, height);
  bitmap.close();
  for (const q of [0.84, 0.74, 0.62]) {
    const blob = await new Promise<Blob | null>((r) => canvas.toBlob(r, "image/jpeg", q));
    if (blob && (blob.size < 1_400_000 || q === 0.62)) return { blob, width, height };
  }
  throw new Error("Không xử lý được ảnh này.");
}

async function upload(file: File, edit: { slug: string; token: string } | null): Promise<Photo> {
  if (!/^image\//.test(file.type)) throw new Error(`"${file.name}" không phải ảnh.`);
  const { blob, width, height } = await compress(file);
  const r = await fetch("/api/anh", {
    method: "POST",
    headers: { "Content-Type": "image/jpeg", ...(edit ? { "X-Wedding": edit.slug, Authorization: `Bearer ${edit.token}` } : {}) },
    body: blob,
  });
  const d = await r.json().catch(() => ({}));
  if (!r.ok) throw new Error(d?.error ?? "Chưa tải được ảnh lên.");
  return { src: d.src, width, height };
}

/* ---------------- Khung chỉnh điểm lấy nét & độ phóng ---------------- */

function FocusEditor({ photo, shape, onChange }: { photo: Photo; shape: "portrait" | "wide"; onChange: (p: Photo) => void }) {
  const box = useRef<HTMLDivElement>(null);
  const [x, y] = (photo.focus ?? "50% 50%").split(" ").map((v) => parseFloat(v));
  const zoom = photo.zoom ?? 1;

  function setFrom(e: React.PointerEvent) {
    const r = box.current!.getBoundingClientRect();
    const px = Math.round(Math.min(100, Math.max(0, ((e.clientX - r.left) / r.width) * 100)));
    const py = Math.round(Math.min(100, Math.max(0, ((e.clientY - r.top) / r.height) * 100)));
    onChange({ ...photo, focus: `${px}% ${py}%` });
  }

  return (
    <div className="pe-editor">
      <div
        ref={box}
        className={`pe-frame pe-frame--${shape}`}
        onPointerDown={(e) => {
          (e.target as Element).setPointerCapture?.(e.pointerId);
          setFrom(e);
        }}
        onPointerMove={(e) => e.buttons === 1 && setFrom(e)}
        title="Chạm vào điểm muốn giữ ở giữa khung"
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={photo.src}
          alt=""
          draggable={false}
          style={{ objectPosition: `${x}% ${y}%`, transform: `scale(${zoom})`, transformOrigin: `${x}% ${y}%` }}
        />
        <span className="pe-dot" style={{ left: `${x}%`, top: `${y}%` }} aria-hidden="true" />
      </div>
      <label className="pe-zoom">
        <span>Phóng to</span>
        <input
          type="range"
          min={1}
          max={2.5}
          step={0.05}
          value={zoom}
          onChange={(e) => {
            const z = Number(e.target.value);
            onChange({ ...photo, zoom: z > 1.001 ? z : undefined });
          }}
        />
        <b>{zoom.toFixed(1)}×</b>
      </label>
      <p className="pe-hint">Chạm hoặc kéo trên ảnh để chọn phần giữ lại khi ảnh được cắt vào khung.</p>
    </div>
  );
}

/* ---------------- Bước "Ảnh cưới" ---------------- */

export function PhotoStep({
  photos,
  onChange,
  edit,
}: {
  photos: Photos;
  onChange: (fn: (p: Photos) => Photos) => void;
  edit: { slug: string; token: string } | null;
}) {
  const [busy, setBusy] = useState<string | null>(null);
  const [error, setError] = useState("");
  const [selected, setSelected] = useState<Slot | number | null>("cover");
  const pickRef = useRef<HTMLInputElement>(null);
  const target = useRef<Slot | "album">("album");

  const hasDemo = [photos.cover, photos.groom, photos.bride, ...photos.album].some(isDemo);

  function pick(slot: Slot | "album") {
    target.current = slot;
    if (pickRef.current) {
      pickRef.current.multiple = slot === "album";
      pickRef.current.value = "";
      pickRef.current.click();
    }
  }

  async function onFiles(files: FileList | null) {
    if (!files?.length) return;
    const slot = target.current;
    setError("");
    const list = slot === "album" ? [...files].slice(0, MAX_ALBUM - photos.album.filter((p) => !isDemo(p)).length) : [files[0]];
    if (!list.length) return setError(`Album tối đa ${MAX_ALBUM} ảnh.`);
    try {
      for (const [i, f] of list.entries()) {
        setBusy(list.length > 1 ? `Đang tải ảnh ${i + 1}/${list.length}…` : "Đang tải ảnh…");
        const p = await upload(f, edit);
        onChange((cur) => {
          if (slot === "album") {
            const album = cur.album.filter((a) => !isDemo(a));
            return { ...cur, album: [...album, p].slice(0, MAX_ALBUM), credit: undefined };
          }
          return { ...cur, [slot]: p };
        });
        if (slot !== "album") setSelected(slot);
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : "Chưa tải được ảnh lên.");
    } finally {
      setBusy(null);
    }
  }

  const setSlot = (slot: Slot, p: Photo | undefined) => onChange((cur) => ({ ...cur, [slot]: p }));
  const setAlbum = (fn: (a: Photo[]) => Photo[]) => onChange((cur) => ({ ...cur, album: fn(cur.album) }));

  const selectedPhoto = typeof selected === "number" ? photos.album[selected] : selected ? photos[selected] : undefined;
  const updateSelected = (p: Photo) => {
    if (typeof selected === "number") setAlbum((a) => a.map((x, i) => (i === selected ? p : x)));
    else if (selected) setSlot(selected, p);
  };

  const slots: { id: Slot; label: string; hint: string }[] = [
    { id: "cover", label: "Ảnh bìa", hint: "Hiện ngay khi khách mở thiệp" },
    { id: "groom", label: "Chú rể", hint: "Ảnh chân dung" },
    { id: "bride", label: "Cô dâu", hint: "Ảnh chân dung" },
  ];

  return (
    <>
      <h1>Ảnh cưới</h1>
      <p className="panel-lead">
        Ảnh được nén tự động để thiệp mở nhanh. Chọn ảnh rồi chạm vào ảnh để chỉnh phần được giữ lại trong khung — bản xem trước bên cạnh cập
        nhật ngay.
      </p>

      {hasDemo && (
        <div className="sample-banner">
          <span>Đang dùng ảnh minh hoạ — ảnh này sẽ không được đăng kèm thiệp.</span>
          <button
            type="button"
            className="btn btn-sm btn-ghost"
            onClick={() => {
              onChange((cur) => ({
                cover: isDemo(cur.cover) ? undefined : cur.cover,
                groom: isDemo(cur.groom) ? undefined : cur.groom,
                bride: isDemo(cur.bride) ? undefined : cur.bride,
                album: cur.album.filter((p) => !isDemo(p)),
              }));
              setSelected(null);
            }}
          >
            Xoá ảnh minh hoạ
          </button>
        </div>
      )}

      <input ref={pickRef} type="file" accept="image/*" hidden onChange={(e) => onFiles(e.target.files)} />

      <div className="pe-slots">
        {slots.map((s) => {
          const p = photos[s.id];
          return (
            <div key={s.id} className={`pe-slot${selected === s.id ? " is-selected" : ""}`}>
              <button type="button" className="pe-thumb" onClick={() => (p ? setSelected(s.id) : pick(s.id))} aria-label={p ? `Chỉnh ${s.label}` : `Thêm ${s.label}`}>
                {p ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={p.src}
                    alt=""
                    style={{ objectPosition: p.focus, transform: p.zoom ? `scale(${p.zoom})` : undefined, transformOrigin: p.focus }}
                  />
                ) : (
                  <span className="pe-add">+</span>
                )}
                {isDemo(p) && <span className="pe-demo">Minh hoạ</span>}
              </button>
              <b>{s.label}</b>
              <small>{s.hint}</small>
              <div className="pe-actions">
                <button type="button" onClick={() => pick(s.id)} disabled={Boolean(busy)}>
                  {p ? "Đổi ảnh" : "Tải ảnh"}
                </button>
                {p && (
                  <button
                    type="button"
                    onClick={() => {
                      setSlot(s.id, undefined);
                      if (selected === s.id) setSelected(null);
                    }}
                  >
                    Xoá
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      <div className="pe-album-head">
        <h2>
          Album <small>{photos.album.length}/{MAX_ALBUM}</small>
        </h2>
        <button type="button" className="btn btn-ghost btn-sm" onClick={() => pick("album")} disabled={Boolean(busy) || photos.album.length >= MAX_ALBUM}>
          + Thêm nhiều ảnh
        </button>
      </div>
      {photos.album.length ? (
        <ul className="pe-album">
          {photos.album.map((p, i) => (
            <li key={p.src + i} className={selected === i ? "is-selected" : ""}>
              <button type="button" className="pe-thumb" onClick={() => setSelected(i)} aria-label={`Chỉnh ảnh ${i + 1}`}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={p.src} alt="" style={{ objectPosition: p.focus }} />
                <span className="pe-no">{i + 1}</span>
                {isDemo(p) && <span className="pe-demo">Minh hoạ</span>}
              </button>
              <div className="pe-actions pe-actions--icons">
                <button type="button" aria-label="Lên trước" disabled={i === 0} onClick={() => setAlbum((a) => swap(a, i, i - 1))}>
                  ←
                </button>
                <button type="button" aria-label="Ra sau" disabled={i === photos.album.length - 1} onClick={() => setAlbum((a) => swap(a, i, i + 1))}>
                  →
                </button>
                <button type="button" aria-label="Đặt làm ảnh bìa" title="Đặt làm ảnh bìa" onClick={() => setSlot("cover", p)}>
                  ★
                </button>
                <button
                  type="button"
                  aria-label="Xoá ảnh"
                  onClick={() => {
                    setAlbum((a) => a.filter((_, j) => j !== i));
                    setSelected(null);
                  }}
                >
                  ×
                </button>
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <button type="button" className="pe-empty" onClick={() => pick("album")} disabled={Boolean(busy)}>
          Chọn một lúc nhiều ảnh cưới — hệ thống tự nén và xếp vào album.
        </button>
      )}

      {busy && (
        <p className="pe-status" role="status">
          {busy}
        </p>
      )}
      {error && (
        <p className="form-error" role="alert">
          {error}
        </p>
      )}

      {selectedPhoto && (
        <section className="pe-edit" aria-label="Chỉnh ảnh">
          <h2>{typeof selected === "number" ? `Chỉnh ảnh ${selected + 1} trong album` : `Chỉnh ${slots.find((s) => s.id === selected)?.label.toLowerCase()}`}</h2>
          <FocusEditor photo={selectedPhoto} shape={selected === "groom" || selected === "bride" || selected === "cover" ? "portrait" : "wide"} onChange={updateSelected} />
        </section>
      )}
    </>
  );
}

function swap<T>(a: T[], i: number, j: number) {
  const b = [...a];
  [b[i], b[j]] = [b[j], b[i]];
  return b;
}
