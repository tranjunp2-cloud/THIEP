/**
 * Hoạ tiết SVG do SayIDo tự vẽ cho các skin thiệp. Mọi nét dùng currentColor / biến --t-* nên
 * đổi biến thể màu là hoạ tiết đổi theo, không cần ảnh mới.
 */

type P = { className?: string };

const svg = (viewBox: string, className = "") => ({
  viewBox,
  className: `motif ${className}`,
  "aria-hidden": true as const,
  focusable: "false" as const,
});

/* ---------------- Chung ---------------- */

/** Biểu tượng Song Hỷ — dùng phông CJK có sẵn trên máy (iOS, Android, macOS, Windows đều có). */
export function HyGlyph({ className = "", size = 100 }: P & { size?: number }) {
  return (
    <svg {...svg("0 0 100 100", className)}>
      <text
        x="50"
        y="53"
        textAnchor="middle"
        dominantBaseline="middle"
        fontSize={size * 0.86}
        fill="currentColor"
        style={{ fontFamily: '"Songti SC","STSong","Noto Serif CJK SC","Noto Serif SC","SimSun",serif', fontWeight: 700 }}
      >
        囍
      </text>
    </svg>
  );
}

/** Ngôi sao bốn cánh lấp lánh. */
export const sparkle = "M0 -10 C 1 -3 3 -1 10 0 C 3 1 1 3 0 10 C -1 3 -3 1 -10 0 C -3 -1 -1 -3 0 -10 Z";

/* ---------------- Song Hỷ (truyền thống) ---------------- */

/** Một cụm mây cát tường: ba vòng xoắn trên một đường đế. */
function CloudScroll({ x = 0, y = 0, s = 1, flip = false }: { x?: number; y?: number; s?: number; flip?: boolean }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${flip ? -s : s} ${s})`} fill="none" stroke="currentColor" strokeWidth={1.4 / s} strokeLinecap="round">
      <path d="M-46 10 H46" />
      <path d="M-40 10 C -44 -2 -30 -10 -22 -3 C -20 -16 0 -20 6 -8 C 12 -18 30 -14 30 -2 C 38 -4 44 4 40 10" />
      <path d="M-22 -3 C -18 2 -24 6 -28 3 C -31 0 -27 -4 -24 -2" />
      <path d="M6 -8 C 9 -2 3 2 -1 -1 C -4 -4 0 -8 3 -6" />
      <path d="M30 -2 C 30 3 24 4 23 1 C 22 -2 26 -3 27 -1" />
    </g>
  );
}

/** Vạch chia: dải mây hai bên, chữ Hỷ hoặc hình thoi ở giữa. */
export function CloudDivider({ className = "", hy = false }: P & { hy?: boolean }) {
  return (
    <svg {...svg("0 0 400 60", className)}>
      <g stroke="currentColor" strokeWidth="1" opacity=".55">
        <path d="M20 30 H140 M260 30 H380" />
        <path d="M20 35 H120 M280 35 H380" opacity=".6" />
      </g>
      <CloudScroll x={95} y={22} s={0.7} />
      <CloudScroll x={305} y={22} s={0.7} flip />
      {hy ? (
        <text
          x="200"
          y="33"
          textAnchor="middle"
          dominantBaseline="middle"
          fontSize="38"
          fill="var(--t-accent)"
          style={{ fontFamily: '"Songti SC","STSong","Noto Serif CJK SC","Noto Serif SC","SimSun",serif', fontWeight: 700 }}
        >
          囍
        </text>
      ) : (
        <g transform="translate(200 30)" fill="none" stroke="var(--t-accent)" strokeWidth="1.2">
          <rect x="-9" y="-9" width="18" height="18" transform="rotate(45)" />
          <rect x="-4" y="-4" width="8" height="8" transform="rotate(45)" fill="var(--t-accent)" />
        </g>
      )}
    </svg>
  );
}

/** Góc khung kiểu song cửa (hoa văn chữ Vạn đơn giản hoá). */
export function LatticeCorner({ className = "" }: P) {
  return (
    <svg {...svg("0 0 90 90", className)}>
      <g fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="square">
        <path d="M4 86 V4 H86" />
        <path d="M12 70 V12 H70" opacity=".8" />
        <path d="M12 30 H30 V12" />
        <path d="M20 20 H24 V24 H20 Z" fill="currentColor" />
        <path d="M30 30 H44 V20 H54" opacity=".8" />
        <path d="M30 30 V44 H20 V54" opacity=".8" />
      </g>
    </svg>
  );
}

/** Đôi đèn lồng — minh hoạ cho lễ vu quy / chân thiệp. */
export function Lanterns({ className = "" }: P) {
  const lantern = (x: number, y: number, s: number) => (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <path d="M0 -60 V-38" stroke="currentColor" strokeWidth="1.2" />
      <rect x="-12" y="-40" width="24" height="6" rx="1.5" fill="currentColor" />
      <ellipse cx="0" cy="-6" rx="30" ry="30" fill="var(--t-accent)" />
      <g fill="none" stroke="var(--t-cover-fg)" strokeWidth="1" opacity=".55">
        <ellipse cx="0" cy="-6" rx="17" ry="30" />
        <ellipse cx="0" cy="-6" rx="6" ry="30" />
      </g>
      <text
        x="0"
        y="-4"
        textAnchor="middle"
        dominantBaseline="middle"
        fontSize="24"
        fill="var(--t-cover-fg)"
        style={{ fontFamily: '"Songti SC","STSong","Noto Serif CJK SC","Noto Serif SC","SimSun",serif', fontWeight: 700 }}
      >
        囍
      </text>
      <rect x="-12" y="22" width="24" height="6" rx="1.5" fill="currentColor" />
      <path d="M0 28 V40 M-4 40 V58 M0 40 V62 M4 40 V58" stroke="var(--t-accent)" strokeWidth="1.4" strokeLinecap="round" />
    </g>
  );
  return (
    <svg {...svg("0 0 240 170", className)}>
      <path d="M10 14 C 80 34 160 34 230 14" fill="none" stroke="currentColor" strokeWidth="1.2" opacity=".6" />
      {lantern(72, 86, 1)}
      {lantern(170, 92, 0.86)}
    </svg>
  );
}

/** Dấu son tròn chữ Hỷ — nút mở thiệp. */
export function HySeal({ className = "" }: P) {
  return (
    <svg {...svg("0 0 160 160", className)}>
      <circle cx="80" cy="80" r="74" fill="var(--t-accent)" />
      <circle cx="80" cy="80" r="66" fill="none" stroke="var(--t-cover-fg)" strokeWidth="1.5" opacity=".7" />
      <circle cx="80" cy="80" r="61" fill="none" stroke="var(--t-cover-fg)" strokeWidth=".8" strokeDasharray="2 4" opacity=".6" />
      <text
        x="80"
        y="84"
        textAnchor="middle"
        dominantBaseline="middle"
        fontSize="72"
        fill="var(--t-cover-fg)"
        style={{ fontFamily: '"Songti SC","STSong","Noto Serif CJK SC","Noto Serif SC","SimSun",serif', fontWeight: 700 }}
      >
        囍
      </text>
    </svg>
  );
}

/** Dải trang trí đầu thiệp: mây hai góc trên. */
export function CloudBand({ className = "" }: P) {
  return (
    <svg {...svg("0 0 600 120", className)} preserveAspectRatio="xMidYMid meet">
      <CloudScroll x={90} y={60} s={1.1} />
      <CloudScroll x={510} y={60} s={1.1} flip />
      <CloudScroll x={190} y={95} s={0.6} />
      <CloudScroll x={410} y={95} s={0.6} flip />
    </svg>
  );
}

/* ---------------- Đêm Sao (sang trọng) ---------------- */

const STARS: [number, number, number][] = [
  [40, 30, 0.9], [120, 70, 0.5], [190, 22, 0.7], [260, 90, 0.45], [330, 40, 1.1], [410, 80, 0.55], [470, 26, 0.75],
  [540, 64, 0.5], [600, 30, 0.9], [80, 120, 0.4], [300, 140, 0.5], [520, 130, 0.45], [160, 160, 0.6], [440, 170, 0.7],
];

/** Bầu trời sao phủ nền bìa thiệp. */
export function StarField({ className = "" }: P) {
  return (
    <svg {...svg("0 0 640 200", className)} preserveAspectRatio="xMidYMid slice">
      {STARS.map(([x, y, s], i) => (
        <g key={i} transform={`translate(${x} ${y}) scale(${(s * 0.7).toFixed(2)})`}>
          <path d={sparkle} fill="var(--t-accent)" className="twinkle" style={{ animationDelay: `${((i * 0.43) % 3).toFixed(2)}s` }} />
        </g>
      ))}
      {[[60, 80], [230, 60], [380, 120], [500, 100], [20, 170], [620, 160], [350, 10]].map(([x, y], i) => (
        <circle key={`d${i}`} cx={x} cy={y} r="1.3" fill="var(--t-accent)" opacity=".7" />
      ))}
    </svg>
  );
}

/** Vầng trăng khuyết. */
export function Crescent({ className = "" }: P) {
  return (
    <svg {...svg("0 0 100 100", className)}>
      <defs>
        <mask id="crescent-cut">
          <rect width="100" height="100" fill="white" />
          <circle cx="62" cy="40" r="34" fill="black" />
        </mask>
      </defs>
      <circle cx="46" cy="52" r="36" fill="var(--t-accent)" mask="url(#crescent-cut)" />
      <path d={sparkle} transform="translate(80 74) scale(.7)" fill="var(--t-accent)" />
    </svg>
  );
}

/** Vạch chia chòm sao: các ngôi sao nối nhau bằng nét mảnh. */
export function ConstellationDivider({ className = "" }: P) {
  const pts: [number, number, number][] = [[40, 34, 0.45], [110, 20, 0.6], [170, 38, 0.4], [200, 26, 1], [230, 38, 0.4], [290, 20, 0.6], [360, 34, 0.45]];
  return (
    <svg {...svg("0 0 400 56", className)}>
      <polyline points={pts.map(([x, y]) => `${x},${y}`).join(" ")} fill="none" stroke="var(--t-accent)" strokeWidth=".8" opacity=".55" />
      {pts.map(([x, y, s], i) => (
        <g key={i} transform={`translate(${x} ${y}) scale(${s})`}>
          <path d={sparkle} fill="var(--t-accent)" className={s >= 1 ? "twinkle" : undefined} />
        </g>
      ))}
    </svg>
  );
}

/** Góc khung ánh kim: hai đường cong và một ngôi sao. */
export function StarCorner({ className = "" }: P) {
  return (
    <svg {...svg("0 0 90 90", className)}>
      <g fill="none" stroke="var(--t-accent)" strokeWidth="1.2">
        <path d="M4 86 V30 C 4 14 14 4 30 4 H86" />
        <path d="M12 86 V34 C 12 22 22 12 34 12 H86" opacity=".55" />
      </g>
      <path d={sparkle} transform="translate(24 24) scale(.8)" fill="var(--t-accent)" />
    </svg>
  );
}

/** Dấu niêm tròn viền kép — monogram ở giữa (chữ do thiệp đặt lên trên). */
export function StarSeal({ className = "" }: P) {
  return (
    <svg {...svg("0 0 160 160", className)}>
      <circle cx="80" cy="80" r="74" fill="var(--t-cover)" stroke="var(--t-accent)" strokeWidth="1.5" />
      <circle cx="80" cy="80" r="66" fill="none" stroke="var(--t-accent)" strokeWidth=".8" opacity=".6" />
      {Array.from({ length: 12 }, (_, i) => (
        <circle key={i} cx={(80 + 70 * Math.cos((i * Math.PI) / 6)).toFixed(2)} cy={(80 + 70 * Math.sin((i * Math.PI) / 6)).toFixed(2)} r="1.2" fill="var(--t-accent)" />
      ))}
      <path d={sparkle} transform="translate(80 30) scale(.8)" fill="var(--t-accent)" />
    </svg>
  );
}

/** Đường chân trời đêm: trăng + sao, dùng ở cuối thiệp. */
export function NightHorizon({ className = "" }: P) {
  return (
    <svg {...svg("0 0 600 160", className)}>
      <StarFieldGroup />
      <g transform="translate(470 30) scale(.7)">
        <circle cx="46" cy="52" r="36" fill="var(--t-accent)" opacity=".9" mask="url(#crescent-cut-2)" />
      </g>
      <defs>
        <mask id="crescent-cut-2">
          <rect x="-50" y="-50" width="200" height="200" fill="white" />
          <circle cx="62" cy="40" r="34" fill="black" />
        </mask>
      </defs>
      <path d="M0 150 C 150 120 450 120 600 150" fill="none" stroke="var(--t-accent)" strokeWidth="1" opacity=".5" />
    </svg>
  );
}

function StarFieldGroup() {
  return (
    <>
      {STARS.slice(0, 10).map(([x, y, s], i) => (
        <g key={i} transform={`translate(${x * 0.8 + 20} ${y * 0.6 + 10}) scale(${(s * 0.8).toFixed(2)})`}>
          <path d={sparkle} fill="var(--t-accent)" className="twinkle" style={{ animationDelay: `${((i * 0.51) % 3).toFixed(2)}s` }} />
        </g>
      ))}
    </>
  );
}

/* ---------------- Tối Giản ---------------- */

/** Vạch kẻ mảnh với một điểm ở giữa. */
export function HairRule({ className = "" }: P) {
  return (
    <svg {...svg("0 0 400 20", className)}>
      <path d="M0 10 H185 M215 10 H400" stroke="currentColor" strokeWidth="1" />
      <circle cx="200" cy="10" r="2.5" fill="var(--t-accent)" />
    </svg>
  );
}

/** Dấu niêm vuông viền mảnh. */
export function SquareSeal({ className = "" }: P) {
  return (
    <svg {...svg("0 0 160 160", className)}>
      <rect x="10" y="10" width="140" height="140" fill="var(--t-cover-fg)" stroke="var(--t-cover-fg)" />
      <rect x="18" y="18" width="124" height="124" fill="none" stroke="var(--t-cover)" strokeWidth="1" />
    </svg>
  );
}

/** Ký hiệu "&" cỡ lớn làm điểm nhấn bìa. */
export function Ampersand({ className = "" }: P) {
  return (
    <svg {...svg("0 0 100 120", className)}>
      <text x="50" y="66" textAnchor="middle" dominantBaseline="middle" fontSize="120" fill="currentColor" style={{ fontFamily: "var(--t-font-body)", fontStyle: "italic" }}>
        &amp;
      </text>
    </svg>
  );
}

/* ---------------- Biểu tượng lịch trình (nét mảnh) ---------------- */

export function TimelineGlyph({ name, className = "" }: P & { name: string }) {
  const paths: Record<string, React.ReactNode> = {
    chapel: (
      <>
        <path d="M10 44 V22 L24 8 L38 22 V44 Z" />
        <path d="M19 44 V33 a5 5 0 0 1 10 0 V44" />
        <path d="M24 2 V8 M21 5 H27" />
      </>
    ),
    rings: (
      <>
        <circle cx="18" cy="30" r="10" />
        <circle cx="30" cy="30" r="10" />
        <path d="M24 12 L20 16 L24 20 L28 16 Z" />
      </>
    ),
    cocktail: (
      <>
        <path d="M10 10 H38 L24 26 Z" />
        <path d="M24 26 V42 M16 42 H32" />
        <circle cx="33" cy="9" r="3" />
      </>
    ),
    disco: (
      <>
        <circle cx="16" cy="36" r="5" />
        <circle cx="34" cy="32" r="5" />
        <path d="M21 36 V12 L39 8 V32" />
      </>
    ),
    champagne: (
      <>
        <path d="M12 8 H20 L19 22 A3 3 0 0 1 13 22 Z" transform="rotate(-12 16 22)" />
        <path d="M28 8 H36 L35 22 A3 3 0 0 1 29 22 Z" transform="rotate(12 32 22)" />
        <path d="M15 26 L13 40 M33 26 L35 40 M9 40 H17 M31 40 H39" />
        <path d="M24 3 V7 M20 5 L22 7 M28 5 L26 7" />
      </>
    ),
  };
  return (
    <svg {...svg("0 0 48 48", className)}>
      <g fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
        {paths[name] ?? paths.rings}
      </g>
    </svg>
  );
}
