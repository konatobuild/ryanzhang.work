"use client";

import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  type PointerEvent as ReactPointerEvent,
} from "react";
import { ARCHETYPES, VIEWBOX, type Shape } from "../../lib/heroArchetypes";

/*
 * Grammar Board — a reorderable specimen built from the site's own
 * design DNA. Each card is one Braun-grammar archetype (heroArchetypes.ts).
 *
 * Three verbs, one spring system (all hand-rolled — no dnd / spring deps):
 *   · DRAG    — pick a card up; it lifts, tilts and flings with inertia
 *               while the rest of the grid springs around it (iOS
 *               springboard). Crossing a slot reorders live.
 *   · SORT    — the control bar reorders the whole board by tone, by
 *               primitive, or by era; every card springs (FLIP) into its
 *               new slot at once — a choreographed re-sort.
 *   · INSPECT — a tap (vs. a drag, disambiguated by a move threshold)
 *               lifts the card's artwork out and grows it into a detail
 *               panel via a shared-element morph, revealing the real
 *               object it abstracts.
 *
 * A semi-implicit Euler spring integrator runs in one rAF loop and writes
 * transforms straight to the DOM — no React re-render during motion.
 * Honors prefers-reduced-motion: reorders + morphs snap instead of spring.
 */

// Terse card label — the piece of vocabulary, not an abstract blob.
const LABELS: Record<string, string> = {
  speaker: "LE1 · grille",
  "line-grille": "RT 20 · grille",
  "click-wheel": "iPod · wheel",
  calculator: "ET 66 · keypad",
  "t523-stack": "T523 · switch",
  "noise-gate": "Studio · gate",
  "dot-matrix": "Display · matrix",
  "slat-grid": "Table · slats",
};

// Inspect copy — fact-checked. Real products carry designer · year; the
// rest are honestly framed as visual grammar (year = null sorts them
// after the dated objects under "Era"). See research notes in the PR.
type Meta = { title: string; sub: string; year: number | null; body: string };
const META: Record<string, Meta> = {
  speaker: {
    title: "Braun LE1",
    sub: "Dieter Rams · 1959",
    year: 1959,
    body: "An electrostatic loudspeaker whose entire face is one perforated metal grille — function made surface. Now in MoMA's collection; the canonical Rams answer to what a speaker should look like.",
  },
  "line-grille": {
    title: "Braun RT 20",
    sub: "Dieter Rams · 1961",
    year: 1961,
    body: "A table radio that hides its speaker behind slots pierced inside a circle — one of the most-cited examples of Rams' “less, but better” surface discipline.",
  },
  "click-wheel": {
    title: "Apple iPod",
    sub: "Jony Ive · 2001",
    year: 2001,
    body: "The original click wheel. Its proportions echo Braun's T3 pocket radio (Rams, 1958); the rotating-wheel input itself came from Bang & Olufsen, not Braun — two lineages often blurred into one.",
  },
  calculator: {
    title: "Braun ET 66",
    sub: "Rams & Lubs · 1987",
    year: 1987,
    body: "Round keys on a calm grid, the soft-green equals key the only emphasis. Widely recognized as the model for the iOS Calculator's layout and button language.",
  },
  "t523-stack": {
    title: "Braun T523",
    sub: "Dieter Rams · 1962",
    year: 1962,
    body: "A pocket transistor radio reduced to three controls — tuning, band, volume — austere Rams grammar. The warm accent is this board's own license; the T523 itself was monochrome.",
  },
  "noise-gate": {
    title: "Studio gate",
    sub: "Visual grammar",
    year: null,
    body: "Not one product but a genre: the rack-mount noise gate — paired threshold and release knobs with an orange signal indicator. Control-surface grammar, abstracted.",
  },
  "dot-matrix": {
    title: "Dot matrix",
    sub: "Visual grammar",
    year: null,
    body: "Information as a field of equal dots — the display reduced to its smallest legible unit. A pattern, not a product.",
  },
  "slat-grid": {
    title: "Tabular grid",
    sub: "Visual grammar",
    year: null,
    body: "Stacked strokes in columns — the skeleton of every data table and ledger, before any data lands. Structure as image.",
  },
};

const GAP = 20; // px between cards
const LIFT_SCALE = 1.06; // dragged card grows slightly
const MAX_TILT = 7; // deg, scaled by horizontal velocity
const FLING = 1.35; // release-velocity boost — gives a thrown card momentum
const MAX_FLING = 48; // px/frame clamp so a hard flick can't launch off-grid
const DRAG_THRESHOLD = 6; // px of movement before a press becomes a drag (vs. a tap)
// Barely underdamped: a soft settle with just a ~4% overshoot — a hint
// of life, not a bounce. (Reference points: 0.18 / 0.74 ≈ 28% rubbery,
// 0.22 / 0.62 ≈ 11% springy, critical damping = 0% lifeless.)
const STIFFNESS = 0.19;
const DAMPING = 0.58;

type Motion = { x: number; y: number; vx: number; vy: number; scale: number; tilt: number };
type Geometry = { cols: number; cellW: number; cellH: number; step: number };

// ── Sort metrics (computed once from the archetype geometry) ──────────────
const KIND_ORDER: Record<Shape["kind"], number> = { circle: 0, line: 1, polygon: 2 };

function colorOf(s: Shape): string {
  return s.kind === "line" ? s.stroke : s.fill;
}
// Map a fill token to an ink level (1 lightest → 12 darkest); accent ≈ mid.
function inkOf(color: string): number {
  const m = /gray-(\d+)/.exec(color);
  if (m) return Number(m[1]);
  return 7;
}
function areaOf(s: Shape): number {
  if (s.kind === "circle") return Math.PI * s.r * s.r;
  if (s.kind === "line") return Math.hypot(s.x2 - s.x1, s.y2 - s.y1) * s.strokeWidth;
  let a = 0;
  const p = s.points;
  for (let i = 0; i < p.length; i++) {
    const [x1, y1] = p[i];
    const [x2, y2] = p[(i + 1) % p.length];
    a += x1 * y2 - x2 * y1;
  }
  return Math.abs(a) / 2;
}
// Area-weighted average darkness — "how dark is the average pixel."
function toneScore(shapes: Shape[]): number {
  let num = 0;
  let den = 0;
  for (const s of shapes) {
    const a = areaOf(s);
    num += inkOf(colorOf(s)) * a;
    den += a;
  }
  return den ? num / den : 0;
}
function dominantKind(shapes: Shape[]): Shape["kind"] {
  const c: Record<Shape["kind"], number> = { circle: 0, line: 0, polygon: 0 };
  for (const s of shapes) c[s.kind]++;
  return (Object.keys(c) as Shape["kind"][]).reduce((b, k) => (c[k] > c[b] ? k : b), "circle");
}

type Metric = { name: string; idx: number; kind: Shape["kind"]; tone: number; year: number | null };
const METRICS: Metric[] = ARCHETYPES.map((a, idx) => ({
  name: a.name,
  idx,
  kind: dominantKind(a.shapes),
  tone: toneScore(a.shapes),
  year: META[a.name]?.year ?? null,
}));

type SortKey = "index" | "tone" | "primitive" | "era";
const SORTS: { key: SortKey; label: string }[] = [
  { key: "index", label: "Index" },
  { key: "tone", label: "Tone" },
  { key: "primitive", label: "Primitive" },
  { key: "era", label: "Era" },
];

function orderFor(key: SortKey): string[] {
  const m = [...METRICS];
  if (key === "tone") m.sort((a, b) => a.tone - b.tone || a.idx - b.idx);
  else if (key === "primitive") m.sort((a, b) => KIND_ORDER[a.kind] - KIND_ORDER[b.kind] || a.idx - b.idx);
  else if (key === "era")
    m.sort((a, b) => (a.year ?? Infinity) - (b.year ?? Infinity) || a.idx - b.idx);
  else m.sort((a, b) => a.idx - b.idx);
  return m.map((x) => x.name);
}

function colsForWidth(w: number): number {
  if (w < 480) return 2;
  if (w < 760) return 3;
  return 4;
}

function Art({ shapes }: { shapes: Shape[] }) {
  return (
    <svg viewBox={`0 0 ${VIEWBOX} ${VIEWBOX}`} aria-hidden="true">
      {shapes.map((shape, i) => {
        if (shape.kind === "circle")
          return <circle key={i} cx={shape.cx} cy={shape.cy} r={shape.r} fill={shape.fill} />;
        if (shape.kind === "line")
          return (
            <line
              key={i}
              x1={shape.x1}
              y1={shape.y1}
              x2={shape.x2}
              y2={shape.y2}
              stroke={shape.stroke}
              strokeWidth={shape.strokeWidth}
              strokeLinecap="round"
            />
          );
        return (
          <polygon key={i} points={shape.points.map((p) => p.join(",")).join(" ")} fill={shape.fill} />
        );
      })}
    </svg>
  );
}

export function GrammarBoard() {
  const boardRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<Map<string, HTMLDivElement>>(new Map());
  const rankRefs = useRef<Map<string, HTMLSpanElement>>(new Map());

  const orderRef = useRef<string[]>(ARCHETYPES.map((a) => a.name));
  const motionRef = useRef<Map<string, Motion>>(new Map());
  const geomRef = useRef<Geometry>({ cols: 4, cellW: 0, cellH: 0, step: 0 });
  const lastWidthRef = useRef(0);
  const rafRef = useRef<number | null>(null);
  const reducedRef = useRef(false);

  // One pointer interaction. `active` flips true only once movement passes
  // the threshold — until then a release counts as a tap (→ inspect).
  const pressRef = useRef<{
    name: string;
    startX: number;
    startY: number;
    offsetX: number;
    offsetY: number;
    targetX: number;
    targetY: number;
    active: boolean;
  } | null>(null);

  const [activeSort, setActiveSort] = useState<SortKey | null>("index");
  const [inspect, setInspect] = useState<string | null>(null);
  const [closing, setClosing] = useState(false);
  const detailArtRef = useRef<HTMLDivElement>(null);
  const closeTimer = useRef<number | null>(null);

  const slotPos = useCallback((index: number) => {
    const { cols, step } = geomRef.current;
    return { x: (index % cols) * step, y: Math.floor(index / cols) * step };
  }, []);

  const measure = useCallback(
    (snap = false) => {
      const board = boardRef.current;
      if (!board) return;
      const w = board.clientWidth;
      if (w <= 0) return;
      const cols = colsForWidth(w);
      const cellW = Math.floor((w - GAP * (cols - 1)) / cols);
      const cellH = cellW;
      const step = cellW + GAP;
      const rows = Math.ceil(ARCHETYPES.length / cols);
      geomRef.current = { cols, cellW, cellH, step };
      board.style.height = `${rows * cellH + (rows - 1) * GAP}px`;

      orderRef.current.forEach((name, index) => {
        const el = cardRefs.current.get(name);
        if (!el) return;
        el.style.width = `${cellW}px`;
        el.style.height = `${cellH}px`;
        const m = motionRef.current.get(name);
        const { x, y } = slotPos(index);
        if (snap && m) {
          m.x = x;
          m.y = y;
          m.vx = 0;
          m.vy = 0;
          el.style.transform = `translate3d(${x}px, ${y}px, 0)`;
        }
      });
    },
    [slotPos],
  );

  const updateRanks = useCallback(() => {
    orderRef.current.forEach((name, index) => {
      const span = rankRefs.current.get(name);
      if (span) span.textContent = String(index + 1).padStart(2, "0");
    });
  }, []);

  const applySort = useCallback(
    (key: SortKey) => {
      orderRef.current = orderFor(key);
      setActiveSort(key);
      updateRanks();
    },
    [updateRanks],
  );

  useLayoutEffect(() => {
    reducedRef.current =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    orderRef.current.forEach((name) => {
      motionRef.current.set(name, { x: 0, y: 0, vx: 0, vy: 0, scale: 1, tilt: 0 });
    });
    measure(true);
    if (geomRef.current.step > 0) lastWidthRef.current = boardRef.current?.clientWidth ?? 0;
    updateRanks();

    const frame = () => {
      const board = boardRef.current;
      if (board) {
        const w = board.clientWidth;
        if (w > 0 && w !== lastWidthRef.current) {
          const firstValid = lastWidthRef.current === 0;
          lastWidthRef.current = w;
          measure(true);
          if (firstValid) updateRanks();
        }
      }

      const press = pressRef.current;
      const drag = press && press.active ? press : null;
      for (const [name, m] of motionRef.current) {
        const el = cardRefs.current.get(name);
        if (!el) continue;

        let tScale: number;
        if (drag && drag.name === name) {
          m.vx = drag.targetX - m.x;
          m.vy = drag.targetY - m.y;
          m.x = drag.targetX;
          m.y = drag.targetY;
          tScale = LIFT_SCALE;
        } else {
          const { x, y } = slotPos(orderRef.current.indexOf(name));
          if (reducedRef.current) {
            m.x = x;
            m.y = y;
            m.vx = 0;
            m.vy = 0;
          } else {
            m.vx = (m.vx + (x - m.x) * STIFFNESS) * DAMPING;
            m.vy = (m.vy + (y - m.y) * STIFFNESS) * DAMPING;
            m.x += m.vx;
            m.y += m.vy;
          }
          tScale = 1;
        }

        const tiltTarget =
          drag && drag.name === name
            ? Math.max(-MAX_TILT, Math.min(MAX_TILT, m.vx * 0.6))
            : 0;
        m.tilt += (tiltTarget - m.tilt) * 0.2;
        m.scale += (tScale - m.scale) * 0.2;

        el.style.transform = `translate3d(${m.x}px, ${m.y}px, 0) scale(${m.scale}) rotate(${m.tilt}deg)`;
      }
      rafRef.current = requestAnimationFrame(frame);
    };
    rafRef.current = requestAnimationFrame(frame);

    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [measure, slotPos, updateRanks]);

  // ── Shared-element morph: card art ⇄ detail art ──────────────────────────
  const flipDetailArt = useCallback((name: string, direction: "in" | "out") => {
    const card = cardRefs.current.get(name);
    const cardArt = card?.querySelector<HTMLElement>(".gb-card__art");
    const detailArt = detailArtRef.current;
    if (!cardArt || !detailArt) return;
    const from = cardArt.getBoundingClientRect();
    const to = detailArt.getBoundingClientRect();
    if (to.width === 0 || to.height === 0) return;
    // The SVG preserves its aspect ratio, so the drawn glyph is a centred
    // square sized to each box's SHORTER side. Map centre→centre with a
    // single UNIFORM scale off those squares — never the raw (often
    // non-square) box dims, which would shear the glyph during the morph.
    const scale = Math.min(from.width, from.height) / Math.min(to.width, to.height);
    const tx = from.left + from.width / 2 - (to.left + to.width / 2);
    const ty = from.top + from.height / 2 - (to.top + to.height / 2);
    const collapsed = `translate(${tx}px, ${ty}px) scale(${scale})`;
    detailArt.style.transformOrigin = "center";
    if (direction === "in") {
      detailArt.style.transition = "none";
      detailArt.style.transform = collapsed;
      void detailArt.offsetWidth; // flush
      detailArt.style.transition = "transform 360ms var(--ease-snappy)";
      detailArt.style.transform = "translate(0, 0) scale(1)";
    } else {
      detailArt.style.transition = "transform 300ms var(--ease-snappy)";
      detailArt.style.transform = collapsed;
    }
  }, []);

  useLayoutEffect(() => {
    if (!inspect || closing || reducedRef.current) return;
    flipDetailArt(inspect, "in");
  }, [inspect, closing, flipDetailArt]);

  // Reverse morph runs at event time (not inside a setState updater, which
  // StrictMode double-invokes). `closing` fades the whole overlay out in
  // step with the artwork flying back, so the panel never sits there empty.
  const closeInspect = useCallback(() => {
    if (!inspect || closing) return;
    if (reducedRef.current) {
      setInspect(null);
      return;
    }
    setClosing(true);
    flipDetailArt(inspect, "out");
    if (closeTimer.current) window.clearTimeout(closeTimer.current);
    closeTimer.current = window.setTimeout(() => {
      setInspect(null);
      setClosing(false);
    }, 300);
  }, [inspect, closing, flipDetailArt]);

  useEffect(() => {
    if (!inspect) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeInspect();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [inspect, closeInspect]);

  useEffect(() => () => void (closeTimer.current && window.clearTimeout(closeTimer.current)), []);

  // ── Pointer: press → (move past threshold) drag, else tap → inspect ───────
  const onPointerDown = (e: ReactPointerEvent<HTMLDivElement>, name: string) => {
    if (inspect) return;
    const board = boardRef.current;
    const m = motionRef.current.get(name);
    if (!board || !m) return;
    e.preventDefault();
    (e.target as HTMLElement).setPointerCapture?.(e.pointerId);
    const rect = board.getBoundingClientRect();
    pressRef.current = {
      name,
      startX: e.clientX,
      startY: e.clientY,
      offsetX: e.clientX - rect.left - m.x,
      offsetY: e.clientY - rect.top - m.y,
      targetX: m.x,
      targetY: m.y,
      active: false,
    };
  };

  const onPointerMove = (e: ReactPointerEvent<HTMLDivElement>) => {
    const press = pressRef.current;
    const board = boardRef.current;
    if (!press || !board) return;

    if (!press.active) {
      if (Math.hypot(e.clientX - press.startX, e.clientY - press.startY) < DRAG_THRESHOLD) return;
      press.active = true;
      cardRefs.current.get(press.name)?.classList.add("gb-card--dragging");
      setActiveSort(null); // a manual drag breaks the current sort
    }

    const rect = board.getBoundingClientRect();
    const { cols, cellW, cellH, step } = geomRef.current;
    const rows = Math.ceil(ARCHETYPES.length / cols);
    const maxX = (cols - 1) * step;
    const maxY = (rows - 1) * step;
    press.targetX = Math.max(0, Math.min(maxX, e.clientX - rect.left - press.offsetX));
    press.targetY = Math.max(0, Math.min(maxY, e.clientY - rect.top - press.offsetY));

    const cx = press.targetX + cellW / 2;
    const cy = press.targetY + cellH / 2;
    const col = Math.max(0, Math.min(cols - 1, Math.round((cx - cellW / 2) / step)));
    const row = Math.max(0, Math.min(rows - 1, Math.round((cy - cellH / 2) / step)));
    const dest = Math.max(0, Math.min(ARCHETYPES.length - 1, row * cols + col));

    const order = orderRef.current;
    const from = order.indexOf(press.name);
    if (from !== dest) {
      order.splice(from, 1);
      order.splice(dest, 0, press.name);
      updateRanks();
    }
  };

  const onPointerUp = (e: ReactPointerEvent<HTMLDivElement>) => {
    const press = pressRef.current;
    if (!press) return;
    (e.target as HTMLElement).releasePointerCapture?.(e.pointerId);

    if (!press.active) {
      // No drag happened → treat as a tap to inspect.
      pressRef.current = null;
      setClosing(false);
      setInspect(press.name);
      return;
    }

    cardRefs.current.get(press.name)?.classList.remove("gb-card--dragging");
    const m = motionRef.current.get(press.name);
    if (m && !reducedRef.current) {
      const clamp = (v: number) => Math.max(-MAX_FLING, Math.min(MAX_FLING, v * FLING));
      m.vx = clamp(m.vx);
      m.vy = clamp(m.vy);
    }
    pressRef.current = null;
  };

  const meta = inspect ? META[inspect] : null;
  const inspectArch = inspect ? ARCHETYPES.find((a) => a.name === inspect) : null;

  return (
    <div className="gb-shell">
      <div className="gb-controls" role="group" aria-label="Sort the board">
        <span className="gb-controls__label">Sort</span>
        {SORTS.map((s) => (
          <button
            key={s.key}
            type="button"
            className={`gb-controls__btn${activeSort === s.key ? " is-active" : ""}`}
            aria-pressed={activeSort === s.key}
            onClick={() => applySort(s.key)}
          >
            {s.label}
          </button>
        ))}
      </div>

      <div
        className="gb-board"
        ref={boardRef}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerUp}
      >
        {ARCHETYPES.map((arch) => (
          <div
            key={arch.name}
            className="gb-card"
            ref={(el) => {
              if (el) cardRefs.current.set(arch.name, el);
              else cardRefs.current.delete(arch.name);
            }}
            onPointerDown={(e) => onPointerDown(e, arch.name)}
          >
            <div className="gb-card__art">
              <Art shapes={arch.shapes} />
            </div>
            <div className="gb-card__meta">
              <span
                className="gb-card__rank"
                ref={(el) => {
                  if (el) rankRefs.current.set(arch.name, el);
                  else rankRefs.current.delete(arch.name);
                }}
              >
                01
              </span>
              <span className="gb-card__label">{LABELS[arch.name] ?? arch.name}</span>
            </div>
          </div>
        ))}
      </div>

      {inspect && meta && inspectArch && (
        <div className={`gb-overlay${closing ? " is-closing" : ""}`} onClick={closeInspect}>
          <div className="gb-detail" role="dialog" aria-modal="true" onClick={(e) => e.stopPropagation()}>
            <button type="button" className="gb-detail__close" aria-label="Close" onClick={closeInspect}>
              ×
            </button>
            <div className="gb-detail__art" ref={detailArtRef}>
              <Art shapes={inspectArch.shapes} />
            </div>
            <div className="gb-detail__body">
              <h2 className="gb-detail__title">{meta.title}</h2>
              <p className="gb-detail__sub">{meta.sub}</p>
              <p className="gb-detail__text">{meta.body}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
