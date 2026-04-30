/*
 * InteractionPlate — UI anatomy line drawing for the Interaction facet.
 *
 * Density target: Schmittel catalog spec sheet / Teenage Engineering OP-1
 * anatomy page. ~25 hairline elements, ortho view, no perspective, no
 * fills except for tiny accent marks. Reads as a real engineering diagram
 * of a custom drag interaction surface, not a 4-stroke icon.
 *
 * Composition (left to right):
 *   1. Source card with internal contents — title bar, three content rows,
 *      a small filled "draggable" item, corner grab indicators
 *   2. Drag arc spanning the page, with arrowhead and a faint shadow trail
 *   3. Target canvas with header bar, internal grid, and a "drop zone"
 *      indicator showing where the item lands
 *   4. Numbered callouts ①②③ at key moments along the gesture
 *
 * Print-spec rules:
 *   - hairline strokes (1.25px) — slightly thinner than before so the
 *     denser composition doesn't read as heavy
 *   - achromatic — currentColor inherits from gray-12
 *   - one filled accent (the dragged item) for visual anchor
 *   - small mono numerals as callouts — same family as the eyebrow
 */
export function InteractionPlate({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 900 360"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.25"
      xmlns="http://www.w3.org/2000/svg"
      aria-label="Custom drag interaction anatomy: source card, gesture arc, target canvas"
    >
      {/* ─── Source card (left) ───────────────────────────────── */}
      {/* Outer card frame */}
      <rect x="48" y="180" width="180" height="148" rx="2" />
      {/* Title bar — small caps line */}
      <line x1="64" y1="200" x2="160" y2="200" />
      {/* Content rows — three short lines suggesting card content */}
      <line x1="64" y1="220" x2="200" y2="220" strokeWidth="0.75" />
      <line x1="64" y1="234" x2="180" y2="234" strokeWidth="0.75" />
      <line x1="64" y1="248" x2="190" y2="248" strokeWidth="0.75" />
      {/* The draggable item — single filled rect, the visual anchor */}
      <rect
        x="74"
        y="270"
        width="80"
        height="36"
        fill="currentColor"
        stroke="none"
      />
      {/* Tiny grab handle dots inside the dragged item */}
      <circle cx="86" cy="288" r="1.5" fill="#ffffff" stroke="none" />
      <circle cx="92" cy="288" r="1.5" fill="#ffffff" stroke="none" />
      <circle cx="98" cy="288" r="1.5" fill="#ffffff" stroke="none" />

      {/* Callout ① at the source */}
      <circle cx="36" cy="195" r="9" />
      <text
        x="36"
        y="199"
        fontFamily="ui-monospace, monospace"
        fontSize="11"
        textAnchor="middle"
        fill="currentColor"
        stroke="none"
      >
        1
      </text>

      {/* ─── Drag arc (center) ────────────────────────────────── */}
      {/* Faint shadow trail — dashed line below the main arc */}
      <path
        d="M 160 270 Q 450 100, 720 220"
        strokeWidth="0.75"
        strokeDasharray="2 4"
        opacity="0.4"
      />
      {/* Main drag arc */}
      <path d="M 160 250 Q 450 50, 720 180" strokeLinecap="round" />
      {/* Arrowhead at the end of the arc */}
      <path
        d="M 712 170 L 724 180 L 710 192"
        strokeLinejoin="round"
        strokeLinecap="round"
      />

      {/* Callout ② at the apex of the arc */}
      <circle cx="450" cy="60" r="9" />
      <text
        x="450"
        y="64"
        fontFamily="ui-monospace, monospace"
        fontSize="11"
        textAnchor="middle"
        fill="currentColor"
        stroke="none"
      >
        2
      </text>

      {/* ─── Target canvas (right) ───────────────────────────── */}
      {/* Outer canvas frame */}
      <rect x="660" y="120" width="220" height="220" rx="2" />
      {/* Window chrome bar */}
      <line x1="660" y1="146" x2="880" y2="146" />
      {/* Three small dots in the chrome (window controls) */}
      <circle cx="676" cy="133" r="2.5" fill="currentColor" stroke="none" />
      <circle cx="688" cy="133" r="2.5" fill="currentColor" stroke="none" />
      <circle cx="700" cy="133" r="2.5" fill="currentColor" stroke="none" />
      {/* Internal grid — subtle dotted matrix suggesting "canvas" surface */}
      <line
        x1="680"
        y1="170"
        x2="860"
        y2="170"
        strokeWidth="0.5"
        strokeDasharray="2 4"
        opacity="0.5"
      />
      <line
        x1="680"
        y1="200"
        x2="860"
        y2="200"
        strokeWidth="0.5"
        strokeDasharray="2 4"
        opacity="0.5"
      />
      <line
        x1="680"
        y1="230"
        x2="860"
        y2="230"
        strokeWidth="0.5"
        strokeDasharray="2 4"
        opacity="0.5"
      />
      <line
        x1="680"
        y1="260"
        x2="860"
        y2="260"
        strokeWidth="0.5"
        strokeDasharray="2 4"
        opacity="0.5"
      />
      <line
        x1="680"
        y1="290"
        x2="860"
        y2="290"
        strokeWidth="0.5"
        strokeDasharray="2 4"
        opacity="0.5"
      />
      <line
        x1="680"
        y1="320"
        x2="860"
        y2="320"
        strokeWidth="0.5"
        strokeDasharray="2 4"
        opacity="0.5"
      />
      {/* Drop-zone indicator — outline rectangle where the item lands */}
      <rect
        x="700"
        y="200"
        width="80"
        height="36"
        strokeDasharray="3 3"
        strokeWidth="1"
      />

      {/* Callout ③ at the target */}
      <circle cx="892" cy="135" r="9" />
      <text
        x="892"
        y="139"
        fontFamily="ui-monospace, monospace"
        fontSize="11"
        textAnchor="middle"
        fill="currentColor"
        stroke="none"
      >
        3
      </text>
    </svg>
  );
}
