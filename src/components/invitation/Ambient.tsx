"use client";

import type { SkinId } from "@/lib/templates/registry";

/**
 * Hiệu ứng nền chạy sau khi mở thiệp — mỗi skin một kiểu:
 * Song Hỷ: cánh hoa đỏ/vàng rơi · Ngà: lá xanh bay · Đêm Sao: sao băng thỉnh thoảng lướt qua.
 * Giá trị cố định (không random) để server và trình duyệt render giống nhau.
 * Tắt hoàn toàn khi người xem bật "giảm chuyển động".
 */

// [vị trí ngang %, thời lượng s, độ trễ s, cỡ px, độ lệch ngang px, xoay °]
const DRIFT: [number, number, number, number, number, number][] = [
  [6, 13, 0, 14, 60, 220], [16, 16, 4.5, 10, -40, -180], [27, 12, 1.8, 16, 80, 260], [38, 17, 7.2, 11, -70, -200],
  [49, 14, 2.6, 13, 50, 240], [59, 18, 9.4, 9, -50, -160], [68, 13, 5.1, 15, 70, 210], [78, 16, 0.9, 12, -60, -230],
  [87, 15, 6.6, 14, 40, 190], [95, 19, 3.7, 10, -80, -250], [21, 20, 11.5, 9, 30, 170], [73, 21, 13, 11, -30, -150],
];

function Petals({ kind }: { kind: "petal" | "leaf" }) {
  return (
    <div className={`ambient ambient--${kind}`} aria-hidden="true">
      {DRIFT.map(([x, dur, delay, size, dx, rot], i) => (
        <span
          key={i}
          className={`drift drift--${i % 3}`}
          style={
            {
              "--x": `${x}%`,
              "--dur": `${dur}s`,
              "--delay": `${delay}s`,
              "--size": `${size}px`,
              "--dx": `${dx}px`,
              "--rot": `${rot}deg`,
            } as React.CSSProperties
          }
        >
          {kind === "leaf" ? (
            <svg viewBox="0 0 26 12">
              <path d="M0 6 C 6 -2 18 -2 26 6 C 18 14 6 14 0 6 Z" />
              <path d="M1 6 H 24" className="vein" />
            </svg>
          ) : null}
        </span>
      ))}
    </div>
  );
}

// [top %, left %, độ trễ s, chu kỳ s, góc °]
const SHOOTING: [number, number, number, number, number][] = [
  [12, 70, 1.2, 9, 22],
  [30, 92, 5.5, 13, 28],
  [8, 40, 9.8, 15, 18],
];

function ShootingStars() {
  return (
    <div className="ambient ambient--stars" aria-hidden="true">
      {SHOOTING.map(([top, left, delay, cycle, angle], i) => (
        <span
          key={i}
          className="shooting"
          style={
            { top: `${top}%`, left: `${left}%`, "--delay": `${delay}s`, "--cycle": `${cycle}s`, "--angle": `${angle}deg` } as React.CSSProperties
          }
        />
      ))}
    </div>
  );
}

export function Ambient({ skin, active }: { skin: SkinId; active: boolean }) {
  if (!active) return null;
  if (skin === "song-hy") return <Petals kind="petal" />;
  if (skin === "botanical") return <Petals kind="leaf" />;
  if (skin === "dem-sao") return <ShootingStars />;
  return null;
}
