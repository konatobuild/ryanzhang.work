/*
 * InteractionPlate — line-drawn laptop with a screen window.
 *
 * The line drawing is the "stage": a hairline ortho rendering of a
 * laptop (screen + hinge + base trapezoid). The screen area is empty
 * — at runtime, the parent wraps this SVG with an absolutely-positioned
 * panel that holds the actual demo content (video / image / animation).
 * That gives us TE OP-1 product-page grammar: line-drawn device frame
 * + real content inside.
 *
 * The screen area's coordinates are exposed so the parent can position
 * the content panel in lockstep with the SVG bezel.
 *
 * Pure stroke discipline: 1px outer, 0.75px internal, 0.5px reference
 * lines. No fills. Same printed-engineering register as the rest of
 * the deck.
 */
export function InteractionPlate({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 960 480"
      fill="none"
      stroke="currentColor"
      strokeWidth="1"
      xmlns="http://www.w3.org/2000/svg"
      aria-label="Laptop displaying interaction work — line drawing of a laptop"
    >
      {/* ─── Laptop screen (top half) ──────────────────────────── */}
      {/* Screen outer chassis */}
      <rect x="120" y="30" width="720" height="380" rx="10" />
      {/* Inner bezel — content sits inside this rect, see SCREEN_BOUNDS */}
      <rect x="140" y="48" width="680" height="344" rx="2" />
      {/* Camera notch — small pill shape centered at the top */}
      <rect
        x="455"
        y="30"
        width="50"
        height="6"
        rx="1.5"
        strokeWidth="0.75"
      />
      {/* Tiny camera dot inside the notch */}
      <circle cx="480" cy="33" r="1.25" strokeWidth="0.5" />

      {/* ─── Hinge line (between screen and base) ─────────────── */}
      <line
        x1="120"
        y1="411"
        x2="840"
        y2="411"
        strokeWidth="0.75"
      />

      {/* ─── Laptop base (trapezoid, bottom) ───────────────────── */}
      {/* Trapezoid sides — slight perspective so it reads as a base */}
      <path
        d="M 80 412 L 880 412 L 856 462 L 104 462 Z"
        strokeWidth="0.75"
      />
      {/* Front edge indent — small notch in the front lip where you
          can lift the lid open. Mirrors a real MacBook / Studio Display. */}
      <path
        d="M 440 462 L 460 470 L 500 470 L 520 462"
        strokeWidth="0.5"
      />
    </svg>
  );
}

/*
 * Screen bounds in viewBox coordinates — used by the parent so it
 * can absolutely-position the content panel over the SVG's inner
 * bezel rect. Keeping these exported avoids drift between the two.
 */
export const SCREEN_BOUNDS = {
  viewBoxWidth: 960,
  viewBoxHeight: 480,
  // Inner bezel: x=140 y=48 w=680 h=344
  left: 140 / 960, // ~14.58%
  top: 48 / 480, // 10%
  width: 680 / 960, // ~70.83%
  height: 344 / 480, // ~71.67%
};
