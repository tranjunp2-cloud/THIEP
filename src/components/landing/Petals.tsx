"use client";

import { useEffect, useRef } from "react";

type Petal = { x: number; y: number; r: number; vy: number; vx: number; rot: number; vr: number; sway: number; phase: number; hue: number };

const COLORS = ["#efd6cf", "#f4e3d9", "#e8c7bd", "#f1dfb4", "#ffffff"];

/** Cánh hoa rơi nhẹ trên nền canvas. Tự dừng khi ra khỏi màn hình hoặc người dùng tắt chuyển động. */
export function Petals({ count = 26, className = "" }: { count?: number; className?: string }) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current!;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const ctx = canvas.getContext("2d")!;
    let w = 0;
    let h = 0;
    let raf = 0;
    let visible = true;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const n = window.innerWidth < 700 ? Math.round(count * 0.55) : count;

    const resize = () => {
      w = canvas.clientWidth;
      h = canvas.clientHeight;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();

    const spawn = (top = false): Petal => ({
      x: Math.random() * w,
      y: top ? -20 : Math.random() * h,
      r: 5 + Math.random() * 7,
      vy: 0.25 + Math.random() * 0.55,
      vx: -0.15 + Math.random() * 0.3,
      rot: Math.random() * Math.PI * 2,
      vr: (-0.5 + Math.random()) * 0.02,
      sway: 0.4 + Math.random() * 0.9,
      phase: Math.random() * Math.PI * 2,
      hue: Math.floor(Math.random() * COLORS.length),
    });
    const petals = Array.from({ length: n }, () => spawn());

    const draw = (t: number) => {
      ctx.clearRect(0, 0, w, h);
      for (const p of petals) {
        p.y += p.vy;
        p.x += p.vx + Math.sin(t / 1400 + p.phase) * p.sway * 0.35;
        p.rot += p.vr;
        if (p.y > h + 20 || p.x < -30 || p.x > w + 30) Object.assign(p, spawn(true));
        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rot);
        ctx.scale(1, 0.55 + 0.45 * Math.abs(Math.sin(t / 900 + p.phase)));
        ctx.beginPath();
        ctx.moveTo(0, -p.r);
        ctx.bezierCurveTo(p.r * 0.9, -p.r * 0.6, p.r * 0.7, p.r * 0.7, 0, p.r);
        ctx.bezierCurveTo(-p.r * 0.7, p.r * 0.7, -p.r * 0.9, -p.r * 0.6, 0, -p.r);
        ctx.fillStyle = COLORS[p.hue];
        ctx.globalAlpha = 0.75;
        ctx.fill();
        ctx.restore();
      }
      if (visible) raf = requestAnimationFrame(draw);
    };

    const io = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      cancelAnimationFrame(raf);
      if (visible) raf = requestAnimationFrame(draw);
    });
    io.observe(canvas);
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);

    return () => {
      cancelAnimationFrame(raf);
      io.disconnect();
      ro.disconnect();
    };
  }, [count]);

  return <canvas ref={ref} className={`petals ${className}`} aria-hidden="true" />;
}
