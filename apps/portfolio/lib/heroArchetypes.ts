/*
 * Hero cycle archetypes — eight Braun-grammar product abstractions.
 * Each archetype renders inside a 320×320 viewBox using whatever
 * primitive serves the form best (form follows function):
 *
 *   1. speaker     — small dark dots = perforations (L1 / T1000 grille)
 *   2. line-grille — vertical ink lines clipped to a circle (RT 20 grille)
 *   3. click-wheel — gray disc + lighter inner circle = button + cavity (iPod)
 *   4. calculator  — 4×5 grid of large gray circles = button cap (ET66)
 *   5. t523-stack  — three buttons in a row, leftmost accent + two dark gray (T523)
 *   6. noise-gate  — two dark knobs w/ orange dots over a dot grid (TE noise gate)
 *   7. dot-matrix  — square ink dot matrix at the speaker's dot size (display)
 *   8. slat-grid   — columns of stacked horizontal ink strokes (data table)
 *
 * Tonal semantics (light page background → light card surface):
 *   gray-12  : ink — perforation holes, accent type
 *   gray-10  : shadow — dark gray buttons (T523)
 *   gray-7   : ghost — engraved dial markers (click-wheel)
 *   gray-5   : surface — button caps, wheel material
 *   gray-1   : "see-through" — iPod's inner click cavity
 *   accent   : Braun warm orange — leftmost button on T523
 *
 * Shapes are NOT all sorted right-to-left. Only the dot-heavy speaker
 * uses that wave; others use semantic stacking order so the
 * background appears first, details last.
 */

export const VIEWBOX = 320;
export const CENTER = VIEWBOX / 2;

export type CircleShape = {
  kind: "circle";
  cx: number;
  cy: number;
  r: number;
  fill: string;
};

export type LineShape = {
  kind: "line";
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  stroke: string;
  strokeWidth: number;
};

export type PolygonShape = {
  kind: "polygon";
  points: [number, number][];
  fill: string;
};

export type Shape = CircleShape | LineShape | PolygonShape;

export type Archetype = {
  name: string;
  shapes: Shape[];
};

const TONE = {
  ink: "var(--color-gray-12)",
  shadow: "var(--color-gray-10)",
  ghost: "var(--color-gray-7)",
  surface: "var(--color-gray-5)",
  cavity: "var(--color-gray-1)",
  accent: "#e85a1f",
} as const;

function buildSpeaker(): Archetype {
  // Hex-packed ink dots clipped to a circle — Braun's perforated grille
  // (T1000 / L1 / RT 20 logic). Alternate rows offset by half-spacing,
  // row height = SPACING·√3/2, so all six neighbors are equidistant.
  const PATTERN_R = 140;
  const SPACING = 18;
  const ROW_H = (SPACING * Math.sqrt(3)) / 2;
  const DOT_R = 4.5;
  const shapes: CircleShape[] = [];
  const cutoff = PATTERN_R - DOT_R;
  const rows = Math.ceil(PATTERN_R / ROW_H);
  const cols = Math.ceil(PATTERN_R / SPACING) + 1;
  for (let j = -rows; j <= rows; j++) {
    const offset = j & 1 ? SPACING / 2 : 0;
    for (let i = -cols; i <= cols; i++) {
      const dx = i * SPACING + offset;
      const dy = j * ROW_H;
      if (Math.hypot(dx, dy) > cutoff) continue;
      shapes.push({
        kind: "circle",
        cx: CENTER + dx,
        cy: CENTER + dy,
        r: DOT_R,
        fill: TONE.ink,
      });
    }
  }
  // Right-to-left wave matches the cycle's slide-in direction.
  shapes.sort((a, b) => b.cx - a.cx || b.cy - a.cy);
  return { name: "speaker", shapes };
}

function buildLineGrille(): Archetype {
  // Horizontal ink lines clipped to a circular boundary, bisected by a
  // 20px vertical gap — RT 20 grille with center channel.
  const PATTERN_R = 140;
  const SPACING = 10;
  const STROKE = 3;
  const GAP = 20;
  const HALF_GAP = GAP / 2;
  const shapes: LineShape[] = [];
  const half = Math.floor(PATTERN_R / SPACING);
  for (let j = -half; j <= half; j++) {
    const y = j * SPACING;
    const halfW = Math.sqrt(Math.max(0, PATTERN_R * PATTERN_R - y * y)) - STROKE / 2;
    if (halfW <= HALF_GAP) continue;
    shapes.push({
      kind: "line",
      x1: CENTER - halfW,
      y1: CENTER + y,
      x2: CENTER - HALF_GAP,
      y2: CENTER + y,
      stroke: TONE.ink,
      strokeWidth: STROKE,
    });
    shapes.push({
      kind: "line",
      x1: CENTER + HALF_GAP,
      y1: CENTER + y,
      x2: CENTER + halfW,
      y2: CENTER + y,
      stroke: TONE.ink,
      strokeWidth: STROKE,
    });
  }
  // Right-to-left sweep — right-edge x descending gives a slide-in-from-right wave.
  shapes.sort((a, b) => b.x2 - a.x2);
  return { name: "line-grille", shapes };
}

function buildClickWheel(): Archetype {
  // Gray disc + lighter inner cavity + small ink triangle at NE.
  // The triangle is borrowed from the Braun T3's rotational indicator,
  // making the wheel legible as a turn-knob rather than just a disc.
  const shapes: Shape[] = [];
  shapes.push({
    kind: "circle",
    cx: CENTER,
    cy: CENTER,
    r: 140,
    fill: TONE.surface,
  });
  shapes.push({
    kind: "circle",
    cx: CENTER,
    cy: CENTER,
    r: 42,
    fill: TONE.cavity,
  });
  // Two ink dots inside the cavity — side-by-side spec markers.
  for (const dx of [-14, 14]) {
    shapes.push({
      kind: "circle",
      cx: CENTER + dx,
      cy: CENTER,
      r: 5,
      fill: TONE.ink,
    });
  }
  // NE indicator triangle — apex points outward at 45°, base is closer to center.
  const APEX_R = 130;
  const BASE_R = 109;
  const HALF_WIDTH = 12;
  const cos = Math.SQRT1_2;
  const sin = Math.SQRT1_2;
  const apex: [number, number] = [CENTER + APEX_R * cos, CENTER - APEX_R * sin];
  const baseCenter: [number, number] = [CENTER + BASE_R * cos, CENTER - BASE_R * sin];
  const perp: [number, number] = [sin, cos];
  shapes.push({
    kind: "polygon",
    points: [
      apex,
      [baseCenter[0] + HALF_WIDTH * perp[0], baseCenter[1] + HALF_WIDTH * perp[1]],
      [baseCenter[0] - HALF_WIDTH * perp[0], baseCenter[1] - HALF_WIDTH * perp[1]],
    ],
    fill: TONE.ink,
  });
  // Two ghost-gray radial markers at 5:30 and 9:30 — paired with the
  // NE triangle to imply a three-position rotational dial. They sit
  // closer to the rim than the triangle, with thicker stroke so they
  // read as crisp engraved markers.
  const MARKER_STROKE = 6;
  // Pull outer end back by stroke radius so the rounded cap sits inside the rim.
  const MARKER_OUTER = 140 - MARKER_STROKE / 2 - 1;
  const MARKER_INNER = 118;
  for (const angDeg of [165, 285]) {
    const ang = (angDeg * Math.PI) / 180;
    const dx = Math.sin(ang);
    const dy = -Math.cos(ang);
    shapes.push({
      kind: "line",
      x1: CENTER + MARKER_OUTER * dx,
      y1: CENTER + MARKER_OUTER * dy,
      x2: CENTER + MARKER_INNER * dx,
      y2: CENTER + MARKER_INNER * dy,
      stroke: TONE.ghost,
      strokeWidth: MARKER_STROKE,
    });
  }
  return { name: "click-wheel", shapes };
}

function buildCalculator(): Archetype {
  // 4×5 grid of large round buttons. ET66's bottom-right "=" key is the
  // accent — rendered in ink to anchor the layout visually.
  const shapes: CircleShape[] = [];
  const COLS = 4;
  const ROWS = 5;
  const SPACING_X = 60;
  const SPACING_Y = 54;
  const BUTTON_R = 22;
  for (let r = 0; r < ROWS; r++) {
    for (let c = 0; c < COLS; c++) {
      const x = CENTER + (c - (COLS - 1) / 2) * SPACING_X;
      const y = CENTER + (r - (ROWS - 1) / 2) * SPACING_Y;
      const isAccent = r === ROWS - 1 && c === COLS - 1;
      shapes.push({
        kind: "circle",
        cx: x,
        cy: y,
        r: BUTTON_R,
        fill: isAccent ? TONE.ink : TONE.surface,
      });
    }
  }
  return { name: "calculator", shapes };
}

function buildT523Stack(): Archetype {
  // Three buttons in a horizontal row — T523's control bar. Leftmost
  // button is the accent (Braun orange); the two to its right are
  // recessed dark-gray functional buttons.
  const shapes: CircleShape[] = [];
  const BUTTON_R = 36;
  const SPACING = 96;
  const fills = [TONE.accent, TONE.shadow, TONE.shadow];
  for (let i = 0; i < 3; i++) {
    shapes.push({
      kind: "circle",
      cx: CENTER + (i - 1) * SPACING,
      cy: CENTER,
      r: BUTTON_R,
      fill: fills[i],
    });
  }
  return { name: "t523-stack", shapes };
}

function buildNoiseGate(): Archetype {
  // Two dark-gray knobs with orange position dots over a horizontal
  // dot grid — Teenage Engineering noise gate (Braun-lineage TX-6 era).
  const shapes: Shape[] = [];
  const KNOB_R = 40;
  const KNOB_CY = 100;
  // Knob outer edges align with grid outer edges (56 and 264).
  const KNOB_CXS = [96, 224];
  const KNOB_DOT_R = 5;
  const KNOB_DOT_OFFSET_Y = -22;
  for (const cx of KNOB_CXS) {
    shapes.push({
      kind: "circle",
      cx,
      cy: KNOB_CY,
      r: KNOB_R,
      fill: TONE.shadow,
    });
  }
  for (const cx of KNOB_CXS) {
    shapes.push({
      kind: "circle",
      cx,
      cy: KNOB_CY + KNOB_DOT_OFFSET_Y,
      r: KNOB_DOT_R,
      fill: TONE.accent,
    });
  }
  // Dot grid below — small ink dots, right-to-left sweep on entry.
  const COLS = 14;
  const ROWS = 4;
  const SPACING = 16;
  const DOT_R = 4;
  const GRID_CY = 232;
  const grid: CircleShape[] = [];
  for (let r = 0; r < ROWS; r++) {
    for (let c = 0; c < COLS; c++) {
      grid.push({
        kind: "circle",
        cx: CENTER + (c - (COLS - 1) / 2) * SPACING,
        cy: GRID_CY + (r - (ROWS - 1) / 2) * SPACING,
        r: DOT_R,
        fill: TONE.ink,
      });
    }
  }
  grid.sort((a, b) => b.cx - a.cx || a.cy - b.cy);
  shapes.push(...grid);
  return { name: "noise-gate", shapes };
}

function buildDotMatrix(): Archetype {
  // Square ink dot matrix — same dot size and spacing as the speaker
  // grille, but in a straight square grid. Reads as a digital display
  // / status panel rather than a perforated grille.
  const SPACING = 18;
  const DOT_R = 4.5;
  const COLS = 15;
  const ROWS = 15;
  const shapes: CircleShape[] = [];
  for (let r = 0; r < ROWS; r++) {
    for (let c = 0; c < COLS; c++) {
      shapes.push({
        kind: "circle",
        cx: CENTER + (c - (COLS - 1) / 2) * SPACING,
        cy: CENTER + (r - (ROWS - 1) / 2) * SPACING,
        r: DOT_R,
        fill: TONE.ink,
      });
    }
  }
  shapes.sort((a, b) => b.cx - a.cx || a.cy - b.cy);
  return { name: "dot-matrix", shapes };
}

function buildSlatGrid(): Archetype {
  // Columns of stacked short horizontal ink strokes — venetian-blind /
  // data-table pattern. Each column repeats a thin horizontal line
  // several times; columns are spaced apart with a clear gap.
  const COLS = 7;
  const ROWS = 9;
  const LINE_W = 30;
  const COL_PITCH = 40;
  const ROW_PITCH = 22;
  const STROKE_W = 3;
  const totalW = (COLS - 1) * COL_PITCH + LINE_W;
  const totalH = (ROWS - 1) * ROW_PITCH + STROKE_W;
  const startX = CENTER - totalW / 2;
  const startY = CENTER - totalH / 2 + STROKE_W / 2;
  const shapes: LineShape[] = [];
  for (let c = 0; c < COLS; c++) {
    const xLeft = startX + c * COL_PITCH;
    const xRight = xLeft + LINE_W;
    for (let r = 0; r < ROWS; r++) {
      const y = startY + r * ROW_PITCH;
      shapes.push({
        kind: "line",
        x1: xLeft,
        y1: y,
        x2: xRight,
        y2: y,
        stroke: TONE.ink,
        strokeWidth: STROKE_W,
      });
    }
  }
  shapes.sort((a, b) => b.x1 - a.x1 || b.y1 - a.y1);
  return { name: "slat-grid", shapes };
}

export const ARCHETYPES: Archetype[] = [
  buildSpeaker(),
  buildLineGrille(),
  buildClickWheel(),
  buildCalculator(),
  buildT523Stack(),
  buildNoiseGate(),
  buildDotMatrix(),
  buildSlatGrid(),
];
