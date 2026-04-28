"use client";

import { useEffect, useState, type CSSProperties } from "react";
import { ARCHETYPES, VIEWBOX } from "../lib/heroArchetypes";

const CYCLE_MS = 1000;

/*
 * HeroCycle — rotating Braun-grammar product abstractions.
 *
 * Each archetype is a list of Shape values (circle | line | polygon).
 * Each archetype's <g> slides in from off-stage right, sits centered
 * briefly, then exits in place via per-shape opacity fade as the next
 * slides in. Cycle is CYCLE_MS per archetype, looping.
 *
 * State derived from activeIdx:
 *   - active : currently centered (visible)
 *   - exit   : just left active, fading out in place
 *   - preset : queued off-stage right (or already past, dormant)
 *
 * Per-shape --shape-phase feeds CSS transition-delay so entry/exit
 * reads as a wave.
 *
 * Honors prefers-reduced-motion: pinned to first archetype, no cycling.
 */
export function HeroCycle() {
  const [activeIdx, setActiveIdx] = useState(0);

  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) return;
    const id = window.setInterval(() => {
      setActiveIdx((i) => (i + 1) % ARCHETYPES.length);
    }, CYCLE_MS);
    return () => window.clearInterval(id);
  }, []);

  const N = ARCHETYPES.length;

  return (
    <svg
      viewBox={`0 0 ${VIEWBOX} ${VIEWBOX}`}
      className="hero-cycle"
      role="img"
      aria-label="Cycling Braun-grammar product abstractions"
      preserveAspectRatio="xMidYMid meet"
    >
      {ARCHETYPES.map((arch, i) => {
        const state =
          i === activeIdx
            ? "active"
            : i === (activeIdx - 1 + N) % N
              ? "exit"
              : "preset";
        return (
          <g key={arch.name} className="cycle-arch" data-state={state}>
            {arch.shapes.map((s, j) => {
              const phase = j / arch.shapes.length;
              const phaseStyle = { "--shape-phase": phase } as CSSProperties;
              if (s.kind === "circle") {
                return (
                  <circle
                    key={j}
                    cx={s.cx}
                    cy={s.cy}
                    r={s.r}
                    className="cycle-shape"
                    style={{ ...phaseStyle, fill: s.fill }}
                  />
                );
              }
              if (s.kind === "polygon") {
                return (
                  <polygon
                    key={j}
                    points={s.points.map((p) => p.join(",")).join(" ")}
                    className="cycle-shape"
                    style={{ ...phaseStyle, fill: s.fill }}
                  />
                );
              }
              return (
                <line
                  key={j}
                  x1={s.x1}
                  y1={s.y1}
                  x2={s.x2}
                  y2={s.y2}
                  strokeLinecap="round"
                  className="cycle-shape"
                  style={{
                    ...phaseStyle,
                    stroke: s.stroke,
                    strokeWidth: s.strokeWidth,
                  }}
                />
              );
            })}
          </g>
        );
      })}
    </svg>
  );
}
