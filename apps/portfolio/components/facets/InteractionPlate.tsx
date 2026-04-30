/*
 * InteractionPlate — pure hairline UI anatomy line drawing.
 *
 * Pure stroke discipline: every shape is outlined, no fills (the only
 * exception is the small callout numerals, which need fill to be
 * legible at this size — a convention TE OP-1 anatomy keeps too).
 *
 * Stroke weights:
 *   - 1px  — outer shapes (cards, canvas frame)
 *   - 0.75px — internal divisions (window chrome, content rows)
 *   - 0.5px — internal grid dots, shadow trail, faint references
 *
 * Pure-line means the diagram reads as printed engineering material —
 * matches Karl Gerstner *Designing Programmes* / Schmittel Braun
 * manual / TE OP-1 anatomy pages, all of which are stroke-only.
 */
export function InteractionPlate({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 900 360"
      fill="none"
      stroke="currentColor"
      strokeWidth="1"
      xmlns="http://www.w3.org/2000/svg"
      aria-label="Custom drag interaction anatomy: source card, gesture arc, target canvas"
    >
      {/* ─── Source card (left) ───────────────────────────────── */}
      {/* Outer card frame */}
      <rect x="48" y="180" width="180" height="148" rx="2" />
      {/* Title bar — heavier internal line */}
      <line x1="64" y1="200" x2="160" y2="200" strokeWidth="0.75" />
      {/* Content rows — finer */}
      <line x1="64" y1="220" x2="200" y2="220" strokeWidth="0.5" />
      <line x1="64" y1="234" x2="180" y2="234" strokeWidth="0.5" />
      <line x1="64" y1="248" x2="190" y2="248" strokeWidth="0.5" />
      {/* The draggable item — outlined rectangle, no fill */}
      <rect x="74" y="270" width="80" height="36" rx="1" />
      {/* Tiny grab handle dots inside the draggable — outlined */}
      <circle cx="100" cy="288" r="1.5" strokeWidth="0.75" />
      <circle cx="108" cy="288" r="1.5" strokeWidth="0.75" />
      <circle cx="116" cy="288" r="1.5" strokeWidth="0.75" />

      {/* Callout 1 — circle + small numeral (numerals filled for legibility) */}
      <circle cx="36" cy="195" r="9" strokeWidth="0.75" />
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
        strokeWidth="0.5"
        strokeDasharray="2 4"
        opacity="0.5"
      />
      {/* Main drag arc */}
      <path d="M 160 250 Q 450 50, 720 180" strokeLinecap="round" />
      {/* Arrowhead at the end of the arc */}
      <path
        d="M 712 170 L 724 180 L 710 192"
        strokeLinejoin="round"
        strokeLinecap="round"
      />

      {/* Callout 2 — circle + numeral at the apex of the arc */}
      <circle cx="450" cy="60" r="9" strokeWidth="0.75" />
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
      <line x1="660" y1="146" x2="880" y2="146" strokeWidth="0.75" />
      {/* Three small window-control dots — outlined */}
      <circle cx="676" cy="133" r="2.5" strokeWidth="0.75" />
      <circle cx="688" cy="133" r="2.5" strokeWidth="0.75" />
      <circle cx="700" cy="133" r="2.5" strokeWidth="0.75" />
      {/* Internal grid — dashed hairlines suggesting "canvas" surface */}
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
      {/* Drop-zone indicator — dashed outline rectangle where item lands */}
      <rect
        x="700"
        y="200"
        width="80"
        height="36"
        rx="1"
        strokeDasharray="3 3"
        strokeWidth="0.75"
      />

      {/* Callout 3 — circle + numeral at the target */}
      <circle cx="892" cy="135" r="9" strokeWidth="0.75" />
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
