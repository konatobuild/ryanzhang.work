/*
 * InteractionPlate — minimal Schmittel-grammar diagram for the Interaction
 * facet. Landscape ratio (~2.5:1) so it can stretch across the upper part
 * of the card the way a Braun catalog product photograph dominates the
 * page above its caption.
 *
 * Reads as: a small card-shaped source on the far left, a draggable
 * element lifted out along a long arc spanning most of the page, landing
 * in a large canvas-shaped target on the far right. The horizontal travel
 * distance IS the gesture — the diagram is about reach, not just direction.
 *
 * Print-spec rules (from Braun graphic system research):
 *   - hairline strokes (1.5px), no fill except the dragged element
 *   - achromatic — currentColor inherits from card's gray-12
 *   - 5 primitives total; reader fills in the rest
 *   - no captions, no labels — the diagram IS the caption
 */
export function InteractionPlate({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 800 300"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      xmlns="http://www.w3.org/2000/svg"
      aria-label="Drag from a card-source on the left into a canvas-target on the right"
    >
      {/* Source card — small rectangle on the far left */}
      <rect x="40" y="180" width="96" height="100" rx="2" />

      {/* The element being dragged — filled rectangle inside the source,
          near the upper edge so the arc reads as "lifting out". */}
      <rect
        x="60"
        y="198"
        width="56"
        height="28"
        fill="currentColor"
        stroke="none"
      />

      {/* Drag arc — long quadratic curve spanning most of the viewBox.
          Apex sits high (y ≈ 30) so the arc visibly clears the rectangles. */}
      <path d="M 124 188 Q 400 -10, 660 130" strokeLinecap="round" />

      {/* Arrowhead — short two-stroke chevron at the arc's end. */}
      <path
        d="M 650 120 L 662 130 L 650 142"
        strokeLinejoin="round"
        strokeLinecap="round"
      />

      {/* Target canvas — larger rectangle on the far right.
          Horizontal hairline near the top reads as a window header bar,
          giving the rectangle just enough internal structure to feel like
          a canvas without becoming a fake UI mockup. */}
      <rect x="600" y="100" width="160" height="180" rx="2" />
      <line x1="600" y1="124" x2="760" y2="124" strokeWidth="1" />
    </svg>
  );
}
