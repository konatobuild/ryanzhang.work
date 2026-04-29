/*
 * InteractionPlate — minimal Schmittel-grammar diagram for the Interaction
 * facet. Reads as: a card-shaped source on the left, a draggable element
 * pulled out along an arc, dropped into a larger canvas-shaped target on
 * the right.
 *
 * Print-spec rules (from Braun graphic system research):
 *   - hairline-only strokes (1.5px), no fill except the dragged element
 *   - achromatic — currentColor inherits from card's gray-12
 *   - composed of 4–5 primitives total; reader fills in the rest
 *   - no captions, no labels, no decoration — the diagram IS the caption
 */
export function InteractionPlate({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 320 280"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      xmlns="http://www.w3.org/2000/svg"
      aria-label="Drag from a card-source into a canvas-target"
    >
      {/* Source card — small rectangle on the lower left */}
      <rect x="32" y="156" width="72" height="92" rx="2" />

      {/* The element being dragged — small filled square inside the source,
          poised at the upper edge so the arc reads as "lifting out". */}
      <rect
        x="52"
        y="174"
        width="32"
        height="22"
        fill="currentColor"
        stroke="none"
      />

      {/* Drag arc — quadratic curve from source upward and into the target.
          Endpoint stops 4–6 units before the target rect so the arrowhead
          can sit cleanly without overlapping the rect's stroke. */}
      <path
        d="M 90 168 Q 168 36, 252 116"
        strokeLinecap="round"
      />

      {/* Arrowhead — a short two-stroke chevron at the arc's end. */}
      <path
        d="M 244 106 L 254 116 L 242 122"
        strokeLinejoin="round"
        strokeLinecap="round"
      />

      {/* Target canvas — larger rectangle on the upper right.
          Slight horizontal hairline near the top reads as a window header,
          giving the rectangle just enough internal structure to feel like
          a canvas without becoming a fake UI mockup. */}
      <rect x="180" y="92" width="116" height="148" rx="2" />
      <line x1="180" y1="112" x2="296" y2="112" strokeWidth="1" />
    </svg>
  );
}
