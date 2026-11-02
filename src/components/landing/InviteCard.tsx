import type { TemplateTheme } from "./content";
import { sampleCouple } from "./content";

/* ---------- Họa tiết SVG (vẽ tay đơn giản, tự sở hữu) ---------- */

function Leaf({ x, y, r, s = 1, fill }: { x: number; y: number; r: number; s?: number; fill: string }) {
  return (
    <path
      d="M0 0 C 6 -10 18 -12 26 -6 C 18 -1 8 2 0 0 Z"
      transform={`translate(${x} ${y}) rotate(${r}) scale(${s})`}
      fill={fill}
    />
  );
}

export function Sprig({ className = "", color = "currentColor" }: { className?: string; color?: string }) {
  return (
    <svg viewBox="0 0 120 60" className={className} aria-hidden="true">
      <path d="M8 52 C 34 40 62 26 112 8" stroke={color} strokeWidth="1.1" fill="none" strokeLinecap="round" />
      {[
        [22, 45, -40], [34, 39, 30], [46, 34, -50], [58, 28, 20], [70, 23, -55], [82, 18, 10], [94, 13, -60],
      ].map(([x, y, r], i) => (
        <Leaf key={i} x={x} y={y} r={r} s={0.7 - i * 0.03} fill={color} />
      ))}
    </svg>
  );
}

function Bamboo({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 120 160" className={className} aria-hidden="true">
      <g stroke="#cfe0bf" strokeWidth="3" strokeLinecap="round" opacity=".75">
        <path d="M18 160 L 30 0" />
        <path d="M24 82 l 6 -1" stroke="#97b783" />
        <path d="M27 40 l 6 -1" stroke="#97b783" />
      </g>
      {[
        [30, 30, -20, 1.4], [30, 32, 30, 1.2], [29, 60, -35, 1.5], [28, 64, 15, 1.1], [26, 100, -15, 1.4], [25, 104, 40, 1.2],
      ].map(([x, y, r, s], i) => (
        <Leaf key={i} x={x} y={y} r={r} s={s} fill={i % 2 ? "#a9c78f" : "#7fa96a"} />
      ))}
    </svg>
  );
}

function Lotus({ className = "" }: { className?: string }) {
  const petal = "M0 0 C -9 -10 -8 -30 0 -40 C 8 -30 9 -10 0 0 Z";
  return (
    <svg viewBox="-50 -50 100 60" className={className} aria-hidden="true">
      {[-60, -30, 0, 30, 60].map((r, i) => (
        <path key={r} d={petal} transform={`rotate(${r})`} fill={i === 2 ? "#e79aa3" : "#f2bcc0"} stroke="#d77f8a" strokeWidth=".6" />
      ))}
      <path d="M-40 4 C -20 -2 20 -2 40 4" stroke="#8fb59a" strokeWidth="2" fill="none" />
    </svg>
  );
}

function Stars({ className = "" }: { className?: string }) {
  const pts = [
    [12, 12, 1], [40, 6, 0.6], [70, 16, 0.8], [96, 7, 0.5], [26, 24, 0.45], [86, 22, 0.7], [56, 26, 0.4],
  ];
  return (
    <svg viewBox="0 0 110 32" className={className} aria-hidden="true">
      {pts.map(([x, y, s], i) => (
        <path
          key={i}
          className="twinkle"
          style={{ animationDelay: `${i * 0.37}s` }}
          d="M0 -6 L 1.2 -1.2 L 6 0 L 1.2 1.2 L 0 6 L -1.2 1.2 L -6 0 L -1.2 -1.2 Z"
          transform={`translate(${x} ${y}) scale(${s})`}
          fill="#f1dfb4"
        />
      ))}
    </svg>
  );
}

/* ---------- Thiệp mẫu ---------- */

const labels: Record<TemplateTheme, { top: string; title: string }> = {
  truc: { top: "Save the date", title: "Lễ Thành Hôn" },
  lua: { top: "Trân trọng báo tin", title: "Lễ Vu Quy" },
  nga: { top: "Cùng gia đình hai bên", title: "Lễ Thành Hôn" },
  sen: { top: "Trân trọng kính mời", title: "Tiệc Báo Hỷ" },
  sao: { top: "Một lời hẹn ước", title: "Lễ Thành Hôn" },
  toi: { top: "Wedding invitation", title: "Chúng mình cưới" },
};

export function InviteCard({ theme = "nga", className = "" }: { theme?: TemplateTheme; className?: string }) {
  const l = labels[theme];
  return (
    <div className={`invite invite--${theme} ${className}`}>
      <div className="invite-frame" />
      {theme === "truc" && (
        <>
          <Bamboo className="invite-orn invite-orn--tl sway" />
          <Bamboo className="invite-orn invite-orn--br sway sway--late" />
        </>
      )}
      {theme === "lua" && <span className="invite-hy" aria-hidden="true">囍</span>}
      {theme === "nga" && (
        <>
          <Sprig className="invite-orn invite-orn--sprig-t" color="#58775a" />
          <Sprig className="invite-orn invite-orn--sprig-b" color="#58775a" />
        </>
      )}
      {theme === "sen" && <Lotus className="invite-orn invite-orn--lotus" />}
      {theme === "sao" && (
        <>
          <Stars className="invite-orn invite-orn--stars-t" />
          <Stars className="invite-orn invite-orn--stars-b" />
        </>
      )}
      <div className="invite-body">
        <p className="invite-top">{l.top}</p>
        <p className="invite-title">{l.title}</p>
        <p className="invite-names">
          <span>{sampleCouple.groom}</span>
          <em>&amp;</em>
          <span>{sampleCouple.bride}</span>
        </p>
        <span className="invite-rule" />
        <p className="invite-date">{sampleCouple.dateShort}</p>
        <p className="invite-venue">{sampleCouple.venue}</p>
      </div>
    </div>
  );
}
