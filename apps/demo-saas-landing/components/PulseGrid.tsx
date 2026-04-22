"use client";

import { useEffect, useRef } from "react";

export type PulseGridProps = {
  /** Mean anomalies spawned per second. */
  anomalyRate?: number;
  cursorReactive?: boolean;
  scrollReactive?: boolean;
  /** Cell pixel size. Default 11 (hero). Pass smaller (e.g. 5) for sub-motifs. */
  cellSize?: number;
  /** Pixel gap between cells. Default 6. */
  gapSize?: number;
  className?: string;
  style?: React.CSSProperties;
};

type Anomaly = { i: number; j: number; t0: number };

const ANOMALY_HOLD = 0.4;
const ANOMALY_FADE = 1.1;
const ANOMALY_LIFE = ANOMALY_HOLD + ANOMALY_FADE;
const CURSOR_RADIUS = 32;

const GRAY_LO = 90;
const GRAY_HI = 255;
const CYAN_R = 74;
const CYAN_G = 201;
const CYAN_B = 228;
const RED_R = 233;
const RED_G = 75;
const RED_B = 60;

export function PulseGrid({
  anomalyRate = 2.2,
  cursorReactive = false,
  scrollReactive = false,
  cellSize = 11,
  gapSize = 6,
  className = "",
  style = {},
}: PulseGridProps) {
  const CELL = cellSize;
  const GAP = gapSize;
  const PITCH = CELL + GAP;
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const wrapRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const wrap = wrapRef.current;
    if (!canvas || !wrap) return;
    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return;

    const reduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    let w = 0;
    let h = 0;
    let cols = 0;
    let rows = 0;
    let rafId = 0;
    let inView = true;
    let scrollMult = 1;
    const mouse = { x: -9999, y: -9999, active: false };
    const anomalies: Anomaly[] = [];
    let phases: Float32Array | null = null;
    const TAU = Math.PI * 2;

    const t0 = performance.now();
    let nextAnomalyT = 0.2;
    let lastRenderT = -1;

    const hash = (i: number, j: number) => {
      let h0 = (i * 73856093) ^ (j * 19349663);
      h0 = Math.imul(h0 ^ (h0 >>> 16), 0x85ebca6b);
      h0 = Math.imul(h0 ^ (h0 >>> 13), 0xc2b2ae35);
      h0 = h0 ^ (h0 >>> 16);
      return ((h0 >>> 0) % 10000) / 10000;
    };

    const rebuildPhases = () => {
      phases = new Float32Array(cols * rows);
      for (let j = 0; j < rows; j++) {
        for (let i = 0; i < cols; i++) {
          phases[j * cols + i] = hash(i, j) * TAU;
        }
      }
    };

    const resize = () => {
      const rect = wrap.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = Math.max(1, Math.floor(rect.width));
      h = Math.max(1, Math.floor(rect.height));
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      canvas.style.width = w + "px";
      canvas.style.height = h + "px";
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      cols = Math.ceil(w / PITCH);
      rows = Math.ceil(h / PITCH);
      rebuildPhases();
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(wrap);

    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) inView = e.isIntersecting;
      },
      { threshold: 0 },
    );
    io.observe(wrap);

    const onMouseMove = (e: MouseEvent) => {
      const r = wrap.getBoundingClientRect();
      mouse.x = e.clientX - r.left;
      mouse.y = e.clientY - r.top;
      mouse.active = true;
    };
    const onMouseLeave = () => {
      mouse.active = false;
    };
    if (cursorReactive) {
      window.addEventListener("mousemove", onMouseMove);
      wrap.addEventListener("mouseleave", onMouseLeave);
    }

    const onScroll = () => {
      const r = wrap.getBoundingClientRect();
      const vh = window.innerHeight;
      const progress = Math.max(0, Math.min(1, -r.top / (vh * 1.2)));
      scrollMult = 1 - progress * 0.55;
    };
    if (scrollReactive) {
      window.addEventListener("scroll", onScroll, { passive: true });
      onScroll();
    }

    const render = () => {
      if (!inView && !reduced) {
        rafId = requestAnimationFrame(render);
        return;
      }

      const t = reduced ? 0 : (performance.now() - t0) / 1000;

      // If frame delta > 1s (tab was backgrounded / rAF throttled),
      // skip forward to avoid burst-spawning a backlog of anomalies.
      if (lastRenderT >= 0 && t - lastRenderT > 1) {
        nextAnomalyT = t + 0.4 / anomalyRate;
      }
      lastRenderT = t;

      ctx.clearRect(0, 0, w, h);

      if (!reduced) {
        while (t >= nextAnomalyT) {
          anomalies.push({
            i: Math.floor(Math.random() * cols),
            j: Math.floor(Math.random() * rows),
            t0: t,
          });
          nextAnomalyT += (0.4 + Math.random() * 0.9) / anomalyRate;
        }
        for (let k = anomalies.length - 1; k >= 0; k--) {
          if (t - anomalies[k].t0 > ANOMALY_LIFE) anomalies.splice(k, 1);
        }
      }

      const baseOmega = (t / 2.8) * TAU;
      const cursorR2 = CURSOR_RADIUS * CURSOR_RADIUS;

      for (let j = 0; j < rows; j++) {
        const y = j * PITCH;
        for (let i = 0; i < cols; i++) {
          const x = i * PITCH;
          const phase = phases![j * cols + i];

          let intensity = 0.075 + 0.055 * Math.sin(baseOmega + phase);
          let activeMix = 0;

          if (cursorReactive && mouse.active) {
            const dx = x - mouse.x;
            const dy = y - mouse.y;
            const d2 = dx * dx + dy * dy;
            if (d2 < cursorR2) {
              const f = 1 - Math.sqrt(d2) / CURSOR_RADIUS;
              intensity += f * 0.32;
              activeMix += f * 0.95;
            }
          }

          intensity *= scrollMult;

          if (intensity < 0.025 && activeMix < 0.025) continue;

          const mix = activeMix > 1 ? 1 : activeMix;
          const gray = GRAY_LO + intensity * (GRAY_HI - GRAY_LO);
          const r = gray + (CYAN_R - gray) * mix * 0.9;
          const g = gray + (CYAN_G - gray) * mix * 0.65;
          const b = gray + (CYAN_B - gray) * mix * 0.95;
          const alpha = Math.min(
            0.95,
            0.18 + intensity * 0.78 + activeMix * 0.18,
          );

          ctx.fillStyle = `rgba(${r | 0},${g | 0},${b | 0},${alpha.toFixed(3)})`;
          ctx.fillRect(x, y, CELL, CELL);
        }
      }

      for (const a of anomalies) {
        const age = t - a.t0;
        let alpha: number;
        if (age < ANOMALY_HOLD) {
          alpha = 0.95;
        } else {
          alpha = 0.95 * (1 - (age - ANOMALY_HOLD) / ANOMALY_FADE);
        }
        if (alpha <= 0) continue;

        ctx.fillStyle = `rgba(${RED_R},${RED_G},${RED_B},${alpha.toFixed(3)})`;
        ctx.fillRect(a.i * PITCH, a.j * PITCH, CELL, CELL);

        if (age < 0.22) {
          const halo = 0.32 * (1 - age / 0.22);
          ctx.fillStyle = `rgba(${RED_R},${RED_G},${RED_B},${halo.toFixed(3)})`;
          const neighbors: ReadonlyArray<[number, number]> = [
            [-1, 0],
            [1, 0],
            [0, -1],
            [0, 1],
          ];
          for (const [di, dj] of neighbors) {
            const ni = a.i + di;
            const nj = a.j + dj;
            if (ni < 0 || nj < 0 || ni >= cols || nj >= rows) continue;
            ctx.fillRect(ni * PITCH, nj * PITCH, CELL, CELL);
          }
        }
      }

      if (!reduced) rafId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(rafId);
      ro.disconnect();
      io.disconnect();
      if (cursorReactive) {
        window.removeEventListener("mousemove", onMouseMove);
        wrap.removeEventListener("mouseleave", onMouseLeave);
      }
      if (scrollReactive) window.removeEventListener("scroll", onScroll);
    };
  }, [anomalyRate, cursorReactive, scrollReactive, CELL, GAP, PITCH]);

  return (
    <div
      ref={wrapRef}
      className={className}
      style={{
        position: "relative",
        width: "100%",
        height: "100%",
        ...style,
      }}
    >
      <canvas
        ref={canvasRef}
        style={{ display: "block", width: "100%", height: "100%" }}
      />
    </div>
  );
}
