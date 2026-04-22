"use client";

import { useEffect, useRef } from "react";
import type { CSSProperties } from "react";

const CYAN_RGB = "74, 201, 228";
const RED_RGB = "233, 75, 60";
const INK_SOFT = "rgba(255, 255, 255, 0.78)";
const INK_DIM = "rgba(255, 255, 255, 0.28)";

function useCanvas(
  draw: (ctx: CanvasRenderingContext2D, w: number, h: number, t: number) => void,
) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const wrapRef = useRef<HTMLDivElement | null>(null);
  const drawRef = useRef(draw);
  useEffect(() => {
    drawRef.current = draw;
  });

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
    let rafId = 0;
    let inView = true;
    const t0 = performance.now();

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

    const tick = () => {
      if (!inView && !reduced) {
        rafId = requestAnimationFrame(tick);
        return;
      }
      const t = reduced ? 0 : (performance.now() - t0) / 1000;
      ctx.clearRect(0, 0, w, h);
      drawRef.current(ctx, w, h, t);
      if (!reduced) rafId = requestAnimationFrame(tick);
    };
    tick();

    return () => {
      cancelAnimationFrame(rafId);
      ro.disconnect();
      io.disconnect();
    };
  }, []);

  return { canvasRef, wrapRef };
}

function canvasWrap(
  wrapRef: React.RefObject<HTMLDivElement | null>,
  canvasRef: React.RefObject<HTMLCanvasElement | null>,
  style: CSSProperties = {},
) {
  return (
    <div
      ref={wrapRef}
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

// ============ 01. Waterfall / Flame graph — TRACE ============

type Bar = {
  startFrac: number;
  widthFrac: number;
  row: number;
  spawnT: number;
};

export function WaterfallMotif() {
  const ref = useRef<Bar[] | null>(null);
  const nextSpawnRef = useRef(1.8);

  const { canvasRef, wrapRef } = useCanvas((ctx, w, h, t) => {
    if (!ref.current) {
      // Seed a trace tree — static feel with one live row growing
      ref.current = [
        { startFrac: 0.02, widthFrac: 0.94, row: 0, spawnT: -1 },
        { startFrac: 0.08, widthFrac: 0.62, row: 1, spawnT: -1 },
        { startFrac: 0.08, widthFrac: 0.3, row: 2, spawnT: -1 },
        { startFrac: 0.42, widthFrac: 0.26, row: 2, spawnT: -1 },
        { startFrac: 0.72, widthFrac: 0.18, row: 1, spawnT: -1 },
        { startFrac: 0.72, widthFrac: 0.08, row: 2, spawnT: -1 },
      ];
    }
    const bars = ref.current;

    // Spawn a new growing bar periodically
    if (t > nextSpawnRef.current) {
      const start = 0.04 + Math.random() * 0.4;
      const width = 0.15 + Math.random() * 0.55;
      const row = Math.max(...bars.map((b) => b.row)) + 1;
      bars.push({ startFrac: start, widthFrac: width, row, spawnT: t });
      // Cap rows; drop the oldest non-spawning bar
      if (row > 6) {
        // Shift everything up by 1 and drop row 0
        for (const b of bars) b.row -= 1;
        for (let i = bars.length - 1; i >= 0; i--) {
          if (bars[i].row < 0) bars.splice(i, 1);
        }
      }
      nextSpawnRef.current = t + 1.8 + Math.random() * 1.4;
    }

    const barH = 5;
    const gap = 6;
    const padX = 14;
    const padY = 20;
    const rowCount = Math.max(...bars.map((b) => b.row)) + 1;
    const contentW = w - padX * 2;
    const startY =
      padY + Math.max(0, (h - padY * 2 - rowCount * (barH + gap)) / 2);

    // Draw each bar
    for (const b of bars) {
      const y = startY + b.row * (barH + gap);
      const x = padX + b.startFrac * contentW;
      const age = b.spawnT < 0 ? 1 : Math.min(1, (t - b.spawnT) / 0.55);
      const ease = 1 - (1 - age) * (1 - age);
      const width = b.widthFrac * contentW * ease;

      // Subtle per-bar pulse so the stack looks live
      const pulse = 0.85 + 0.15 * Math.sin(t * 1.2 + b.row * 0.7);
      const alpha = (0.35 + 0.45 * ease) * pulse;

      ctx.fillStyle = `rgba(255,255,255,${alpha.toFixed(3)})`;
      ctx.fillRect(x, y, width, barH);
    }
  });

  return canvasWrap(wrapRef, canvasRef);
}

// ============ 02. Sparkline + anomaly callouts — DETECT ============

type Anomaly = { x: number; t0: number; value: number };

export function SparklineMotif() {
  const anomaliesRef = useRef<Anomaly[] | null>(null);
  const nextAnomalyRef = useRef(1.2);

  const { canvasRef, wrapRef } = useCanvas((ctx, w, h, t) => {
    if (!anomaliesRef.current) anomaliesRef.current = [];
    const anomalies = anomaliesRef.current;

    const padX = 16;
    const padY = 22;
    const plotW = w - padX * 2;
    const midY = h * 0.58;
    const amp = h * 0.18;

    const yAt = (xFrac: number) => {
      const phase = t * 0.55;
      return (
        midY +
        Math.sin(xFrac * Math.PI * 4 + phase) * amp * 0.55 +
        Math.sin(xFrac * Math.PI * 7 - phase * 1.4) * amp * 0.25 +
        Math.sin(xFrac * Math.PI * 11 + phase * 0.6) * amp * 0.12
      );
    };

    // Baseline hairline
    ctx.strokeStyle = INK_DIM;
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(padX, midY);
    ctx.lineTo(w - padX, midY);
    ctx.stroke();

    // Main waveform
    ctx.strokeStyle = INK_SOFT;
    ctx.lineWidth = 1.2;
    ctx.beginPath();
    const steps = 80;
    for (let i = 0; i <= steps; i++) {
      const xFrac = i / steps;
      const x = padX + xFrac * plotW;
      const y = yAt(xFrac);
      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.stroke();

    // Spawn anomaly at a peak position
    if (t > nextAnomalyRef.current) {
      const xFrac = 0.15 + Math.random() * 0.7;
      const y = yAt(xFrac);
      // Bias to peaks (upper half)
      if (y < midY) {
        anomalies.push({ x: xFrac, t0: t, value: y });
        nextAnomalyRef.current = t + 2.8 + Math.random() * 2.5;
      } else {
        nextAnomalyRef.current = t + 0.2;
      }
    }

    // Draw/fade anomalies
    const LIFE = 2.2;
    for (let i = anomalies.length - 1; i >= 0; i--) {
      const a = anomalies[i];
      const age = t - a.t0;
      if (age > LIFE) {
        anomalies.splice(i, 1);
        continue;
      }
      const alpha = age < 0.3 ? age / 0.3 : age > LIFE - 0.6 ? (LIFE - age) / 0.6 : 1;
      const cx = padX + a.x * plotW;
      const cy = yAt(a.x);
      // Callout box
      const size = 6;
      ctx.strokeStyle = `rgba(${RED_RGB}, ${(alpha * 0.85).toFixed(3)})`;
      ctx.lineWidth = 1;
      ctx.strokeRect(cx - size, cy - size, size * 2, size * 2);
      // Callout stem up to a label position
      const labelY = padY + 4;
      ctx.strokeStyle = `rgba(${RED_RGB}, ${(alpha * 0.4).toFixed(3)})`;
      ctx.setLineDash([2, 2]);
      ctx.beginPath();
      ctx.moveTo(cx, cy - size);
      ctx.lineTo(cx, labelY + 3);
      ctx.stroke();
      ctx.setLineDash([]);
      // Label tick (small red square marker)
      ctx.fillStyle = `rgba(${RED_RGB}, ${alpha.toFixed(3)})`;
      ctx.fillRect(cx - 1.5, labelY, 3, 3);
    }
  });

  return canvasWrap(wrapRef, canvasRef);
}

// ============ 03. Timeline scrubber — REPLAY (pure CSS) ============

export function TimelineMotif() {
  const TICKS = [0.08, 0.2, 0.32, 0.48, 0.6, 0.72, 0.88];
  return (
    <div
      style={{
        position: "relative",
        width: "100%",
        height: "100%",
        overflow: "hidden",
      }}
    >
      <div
        style={{
          position: "absolute",
          left: 16,
          right: 16,
          top: "50%",
          transform: "translateY(-50%)",
          height: 40,
        }}
      >
        {/* Hairline track */}
        <div
          style={{
            position: "absolute",
            top: "50%",
            left: 0,
            right: 0,
            height: 1,
            background: INK_DIM,
            transform: "translateY(-0.5px)",
          }}
        />
        {/* Left end cap */}
        <div
          style={{
            position: "absolute",
            left: 0,
            top: "50%",
            width: 1,
            height: 9,
            background: INK_SOFT,
            transform: "translateY(-50%)",
          }}
        />
        {/* Right end cap */}
        <div
          style={{
            position: "absolute",
            right: 0,
            top: "50%",
            width: 1,
            height: 9,
            background: INK_SOFT,
            transform: "translateY(-50%)",
          }}
        />
        {/* Tick marks */}
        {TICKS.map((t) => (
          <div
            key={t}
            style={{
              position: "absolute",
              left: `${t * 100}%`,
              top: "50%",
              width: 1,
              height: 6,
              background: INK_DIM,
              transform: "translate(-0.5px, -50%)",
            }}
          />
        ))}
        {/* Playhead */}
        <div
          className="replay-playhead"
          style={{
            position: "absolute",
            top: "50%",
            width: 8,
            height: 8,
            borderRadius: 1,
            background: `rgba(${CYAN_RGB}, 1)`,
            boxShadow: `0 0 14px rgba(${CYAN_RGB}, 0.55)`,
            transform: "translate(-4px, -50%) rotate(45deg)",
          }}
        />
      </div>
    </div>
  );
}

// ============ 04. Flow + gate — INTERVENE ============

type Particle = {
  x: number;
  y: number;
  vx: number;
  state: "flow" | "caught";
  caughtT: number;
};

export function FlowGateMotif() {
  const particlesRef = useRef<Particle[] | null>(null);
  const nextSpawnRef = useRef(0);
  const lastTRef = useRef(-1);

  const { canvasRef, wrapRef } = useCanvas((ctx, w, h, t) => {
    if (!particlesRef.current) particlesRef.current = [];
    const particles = particlesRef.current;

    // If the tab was backgrounded (rAF throttled), skip the spawn backlog.
    if (lastTRef.current >= 0 && t - lastTRef.current > 0.5) {
      nextSpawnRef.current = t + 0.08;
    }
    lastTRef.current = t;

    const padY = 22;
    const gateX = w * 0.58;
    const innerH = h - padY * 2;

    // Spawn particles from the left edge; cap per-frame to avoid bursts.
    let spawned = 0;
    while (t > nextSpawnRef.current && spawned < 3) {
      particles.push({
        x: -4,
        y: padY + Math.random() * innerH,
        vx: 40 + Math.random() * 30,
        state: "flow",
        caughtT: 0,
      });
      nextSpawnRef.current += 0.07 + Math.random() * 0.09;
      spawned++;
    }
    if (spawned === 3 && t > nextSpawnRef.current) {
      nextSpawnRef.current = t + 0.1;
    }

    // Step physics
    const FRAME_DT = 1 / 60;
    for (let i = particles.length - 1; i >= 0; i--) {
      const p = particles[i];
      if (p.state === "flow") {
        const prevX = p.x;
        p.x += p.vx * FRAME_DT;
        // Crossed the gate this frame?
        if (prevX < gateX && p.x >= gateX) {
          if (Math.random() < 0.12) {
            p.state = "caught";
            p.caughtT = t;
            p.x = gateX;
          }
        }
        if (p.x > w + 8) particles.splice(i, 1);
      } else if (p.state === "caught") {
        const age = t - p.caughtT;
        if (age > 1.2) particles.splice(i, 1);
      }
    }

    // Gate hairline
    ctx.strokeStyle = INK_DIM;
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(gateX, padY - 6);
    ctx.lineTo(gateX, h - padY + 6);
    ctx.stroke();
    // Gate tick caps
    ctx.fillStyle = INK_SOFT;
    ctx.fillRect(gateX - 2, padY - 7, 4, 1);
    ctx.fillRect(gateX - 2, h - padY + 6, 4, 1);

    // Draw particles
    for (const p of particles) {
      if (p.state === "flow") {
        // White dot, slight trail
        ctx.fillStyle = "rgba(255,255,255,0.85)";
        ctx.fillRect(p.x, p.y, 2, 2);
        ctx.fillStyle = "rgba(255,255,255,0.35)";
        ctx.fillRect(p.x - 6, p.y, 4, 2);
      } else {
        const age = t - p.caughtT;
        const alpha =
          age < 0.15
            ? 1
            : age > 1.0
              ? (1.2 - age) / 0.2
              : 1 - (age - 0.15) * 0.35;
        const clamped = Math.max(0, Math.min(1, alpha));
        ctx.fillStyle = `rgba(${RED_RGB}, ${clamped.toFixed(3)})`;
        ctx.fillRect(p.x - 2, p.y - 2, 5, 5);
        // Small red halo at birth
        if (age < 0.25) {
          const halo = 0.35 * (1 - age / 0.25);
          ctx.fillStyle = `rgba(${RED_RGB}, ${halo.toFixed(3)})`;
          ctx.fillRect(p.x - 5, p.y - 5, 11, 11);
        }
      }
    }
  });

  return canvasWrap(wrapRef, canvasRef);
}
