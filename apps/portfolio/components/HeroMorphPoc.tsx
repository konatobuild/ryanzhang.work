"use client";

import { useEffect, useState, type CSSProperties } from "react";
import { ARCHETYPES, VIEWBOX, type Shape } from "../lib/heroArchetypes";

/*
 * Hero morph POC — all 8 Braun-grammar archetypes from heroArchetypes.ts.
 *
 * Each archetype renders as its native shapes (preserving design). Per
 * shape: scale 0.2 → 1 + opacity 0 → 1, staggered edge-first by distance
 * from canvas center. Each shape pivots at its own visual center.
 *
 * Cross-archetype: A's shapes shrink-and-fade out as B's shapes grow-
 * and-fade in, both using the same edge-first stagger so the visual is
 * a rim-to-center wave on each transition. Honors prefers-reduced-motion.
 */

const CENTER = VIEWBOX / 2;
const MAX_DIST = CENTER;

// Cycle order — chosen so each adjacency is visually compatible. The
// raw heroArchetypes.ts order has wheel→calculator which is the only
// truly jarring jump (one big disc vs 20 spread circles). Swapping
// t523-stack into the gap fixes it: wheel→t523 reads as disc-collapse-
// to-3-buttons (t523's center button sits exactly at wheel center),
// and t523→calc reads as buttons multiplying into a denser grid.
const CYCLE_NAMES = [
  "speaker",
  "line-grille",
  "click-wheel",
  "t523-stack",
  "calculator",
  "noise-gate",
  "dot-matrix",
  "slat-grid",
] as const;

const CYCLE_ORDER = CYCLE_NAMES.map((name) =>
  ARCHETYPES.findIndex((a) => a.name === name),
);

function shapeCenter(s: Shape): [number, number] {
  if (s.kind === "circle") return [s.cx, s.cy];
  if (s.kind === "line") return [(s.x1 + s.x2) / 2, (s.y1 + s.y2) / 2];
  const sx = s.points.reduce((a, [x]) => a + x, 0) / s.points.length;
  const sy = s.points.reduce((a, [, y]) => a + y, 0) / s.points.length;
  return [sx, sy];
}

const EASE = "cubic-bezier(0.2, 0.8, 0.2, 1)";

// Center-anchor shapes have a special synchronized contract: they
// collapse-to-button-size / grow-from-button-size at (160, 160) with
// no stagger and shorter duration. Wheel disc + cavity are the
// canonical case; the t523 middle button is their handoff partner
// across the click-wheel ↔ t523-stack adjacency, so it shares the
// same timing to give the cross-fade the look of "disc becoming
// middle button" rather than "disc fades, button appears separately".
//
// Everything else opacity-fades only — keeps mid-transition crossfades
// readable instead of two fields of half-scaled dots overlapping.
function isCenterAnchor(s: Shape, archName: string, shapeIdx: number): boolean {
  if (archName === "click-wheel" && s.kind === "circle" && s.r > 30) return true;
  if (archName === "t523-stack" && shapeIdx === 1) return true;
  return false;
}

function renderShape(
  s: Shape,
  key: string,
  phase: number,
  isActive: boolean,
  isAnchor: boolean,
) {
  const [cx, cy] = shapeCenter(s);
  const duration = isAnchor ? 280 : 380;
  const delay = isAnchor ? "0ms" : `${(1 - phase) * 220}ms`;
  const transition = isAnchor
    ? `opacity ${duration}ms ${EASE} ${delay}, transform ${duration}ms ${EASE} ${delay}`
    : `opacity ${duration}ms ${EASE} ${delay}`;
  const style: CSSProperties = {
    transformOrigin: `${cx}px ${cy}px`,
    opacity: isActive ? 1 : 0,
    transition,
  };
  if (isAnchor) {
    style.transform = isActive ? "scale(1)" : "scale(0.26)";
  }
  if (s.kind === "circle") {
    return (
      <circle
        key={key}
        cx={s.cx}
        cy={s.cy}
        r={s.r}
        fill={s.fill}
        className="morph-arch-shape"
        style={style}
      />
    );
  }
  if (s.kind === "line") {
    return (
      <line
        key={key}
        x1={s.x1}
        y1={s.y1}
        x2={s.x2}
        y2={s.y2}
        stroke={s.stroke}
        strokeWidth={s.strokeWidth}
        strokeLinecap="round"
        className="morph-arch-shape"
        style={style}
      />
    );
  }
  return (
    <polygon
      key={key}
      points={s.points.map((p) => p.join(",")).join(" ")}
      fill={s.fill}
      className="morph-arch-shape"
      style={style}
    />
  );
}

export function HeroMorphPoc({ cycleMs = 2000 }: { cycleMs?: number }) {
  const [cycleIdx, setCycleIdx] = useState(0);
  const activeArchIdx = CYCLE_ORDER[cycleIdx];

  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) return;
    const id = window.setInterval(() => {
      setCycleIdx((i) => (i + 1) % CYCLE_ORDER.length);
    }, cycleMs);
    return () => window.clearInterval(id);
  }, [cycleMs]);

  return (
    <svg
      viewBox={`0 0 ${VIEWBOX} ${VIEWBOX}`}
      className="hero-morph"
      role="img"
      aria-label="Cycling Braun-grammar product abstractions"
      preserveAspectRatio="xMidYMid meet"
      onClick={() => setCycleIdx((i) => (i + 1) % CYCLE_ORDER.length)}
    >
      {ARCHETYPES.map((arch, ai) => {
        const isActive = ai === activeArchIdx;
        return (
          <g key={arch.name} className="morph-arch">
            {arch.shapes.map((s, si) => {
              const [cx, cy] = shapeCenter(s);
              const phase = Math.min(
                Math.hypot(cx - CENTER, cy - CENTER) / MAX_DIST,
                1,
              );
              const isAnchor = isCenterAnchor(s, arch.name, si);
              return renderShape(s, `${ai}-${si}`, phase, isActive, isAnchor);
            })}
          </g>
        );
      })}
    </svg>
  );
}
