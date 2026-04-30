/*
 * InteractionPlate — Apple Pro Display XDR mockup PNG.
 *
 * Tightly cropped (no external padding) — the device fills nearly the
 * full canvas of the source image, so the rendered display extends as
 * close to the viewport edges as possible.
 *
 * Source: 02 - Apple Pro Display XDR - Horizontal Mockup copy.png
 *   - 3994 × 3060 px (~1.305 aspect, close to 4:3)
 *   - RGBA, transparent background
 *   - White screen area (treat as transparent for content overlay)
 */

import Image from "next/image";

export function InteractionPlate({ className }: { className?: string }) {
  return (
    <Image
      className={className}
      src="/mockups/studio-display.png"
      alt="Apple Pro Display XDR — interaction work shown on screen"
      width={3994}
      height={3060}
      priority
      sizes="(min-width: 1024px) 1400px, 96vw"
    />
  );
}

/*
 * Screen bounds in fractional coordinates of the mockup PNG.
 * Measured against the 3994×3060 source — re-measure if the mockup swaps.
 *
 *   inner screen rect (white area inside the black bezel):
 *     left ≈ 1.3%   top ≈ 1.6%   width ≈ 97.4%   height ≈ 73.5%
 */
export const SCREEN_BOUNDS = {
  imageWidth: 3994,
  imageHeight: 3060,
  aspectRatio: 3994 / 3060, // ~1.305
  left: 0.013,
  top: 0.016,
  width: 0.974,
  height: 0.735,
};
