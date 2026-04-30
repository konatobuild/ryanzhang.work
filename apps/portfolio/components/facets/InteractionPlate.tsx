/*
 * InteractionPlate — Apple Pro Display XDR mockup PNG.
 *
 * Replaces the earlier line-drawn laptop SVG with a real Apple-style
 * monitor mockup (transparent background, transparent screen area).
 * The PNG handles the device frame, shadow, and stand. The screen
 * area is empty — a sibling div absolutely-positioned at SCREEN_BOUNDS
 * holds the actual demo content.
 *
 * This is the TE OP-1 product page formula faithfully translated:
 * a real device "stage" with the work shown inside it.
 *
 * Source: 02 - Apple Pro Display XDR - Horizontal Mockup.png
 *   - 7500 × 5000 px (3:2)
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
      width={7500}
      height={5000}
      priority
      sizes="(min-width: 1024px) 960px, 96vw"
    />
  );
}

/*
 * Screen bounds in fractional coordinates of the mockup PNG.
 * Measured against the 7500×5000 source — adjust if the mockup swaps.
 *
 *   inner screen rect (white area inside the black bezel):
 *     left ≈ 24.5%   top ≈ 22%   width ≈ 51%   height ≈ 43%
 */
export const SCREEN_BOUNDS = {
  imageWidth: 7500,
  imageHeight: 5000,
  aspectRatio: 7500 / 5000, // 1.5
  left: 0.245,
  top: 0.22,
  width: 0.51,
  height: 0.43,
};
