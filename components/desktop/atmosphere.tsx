"use client";

import { useEffect, useRef } from "react";

/** Dust motes drifting through the light, drawn behind the windows. */
export function Motes() {
  const canvas = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const el = canvas.current;
    const ctx = el?.getContext("2d");
    if (!el || !ctx || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const dpr = Math.min(window.devicePixelRatio, 2);
    const resize = () => {
      el.width = window.innerWidth * dpr;
      el.height = window.innerHeight * dpr;
    };
    resize();
    window.addEventListener("resize", resize);

    const motes = Array.from({ length: 70 }, () => ({
      x: Math.random(),
      y: Math.random(),
      r: 0.6 + Math.random() * 1.8,
      speed: 0.00008 + Math.random() * 0.00018,
      sway: Math.random() * Math.PI * 2,
    }));

    let frame = 0;
    const draw = (t: number) => {
      ctx.clearRect(0, 0, el.width, el.height);
      for (const m of motes) {
        m.y -= m.speed;
        if (m.y < -0.02) m.y = 1.02;
        const x = (m.x + Math.sin(t / 4000 + m.sway) * 0.01) * el.width;
        const y = m.y * el.height;
        // Brightest inside the sunbeams, which fall from the upper left.
        const beam = Math.max(0, 1 - Math.abs(m.x - 0.25 - m.y * 0.3) * 3);
        ctx.globalAlpha = 0.15 + beam * 0.6;
        ctx.beginPath();
        ctx.arc(x, y, m.r * dpr, 0, Math.PI * 2);
        ctx.fillStyle = "#fff6d8";
        ctx.fill();
      }
      frame = requestAnimationFrame(draw);
    };
    frame = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return <canvas ref={canvas} className="motes" aria-hidden="true" />;
}

/*
 * Server-rendered and faded out by CSS alone, so the desktop never waits on
 * JavaScript. Repeat visits in the same tab skip it.
 */
export function BootScreen() {
  const el = useRef<HTMLDivElement>(null);

  useEffect(() => {
    try {
      if (sessionStorage.getItem("booted")) el.current?.remove();
      sessionStorage.setItem("booted", "1");
    } catch {}
  }, []);

  return (
    <div ref={el} className="boot" aria-hidden="true">
      <span className="boot-logo">J</span>
      <span className="boot-bar" />
    </div>
  );
}
