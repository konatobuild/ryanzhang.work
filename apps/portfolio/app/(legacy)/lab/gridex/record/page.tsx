import GridexHeroStage from "@/components/specimens/gridex/GridexHeroStage";
import GridexExplodedStage from "@/components/specimens/gridex/GridexExplodedStage";

/*
 * /lab/gridex/record — a bare recording surface.
 *
 * The /lab/gridex design-note page frames the stage inside an editorial
 * column, so the 620×720 stage floats small in a sea of whitespace and is
 * awkward to screen-capture. This route strips everything: just the stage,
 * centered on the same dark ground, full-bleed.
 *
 * Sizing for capture: zoom the BROWSER (⌘+), not CSS. Browser zoom scales
 * the whole page uniformly, so the cursor engine — which reads
 * getBoundingClientRect and writes transforms in the same CSS-px space —
 * stays pixel-accurate. A CSS `transform: scale()` (incl. the stage's own
 * `scale` prop) would desync the cursors from their targets, so it is
 * deliberately not used here. Record at 1.5–2× browser zoom on a retina
 * display, then region-select around the stage; the infinite dark ground
 * means any crop edge lands on flat background.
 *
 *   /lab/gridex/record            → hero stage
 *   /lab/gridex/record?stage=exploded → exploded stage
 */

export const metadata = {
  title: "Gridex — recording surface",
  robots: { index: false, follow: false },
};

const GROUND =
  "radial-gradient(circle at 20% 30%, rgba(215,235,117,0.05) 0%, transparent 50%), " +
  "radial-gradient(circle at 80% 70%, rgba(183,146,100,0.04) 0%, transparent 50%), " +
  "#1c2b27";

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ stage?: string }>;
}) {
  const { stage } = await searchParams;
  const isExploded = stage === "exploded";

  return (
    // Full-bleed overlay above the root layout's <Nav>/<Footer> so the
    // capture frame is pure stage + ground. The chrome stays in the DOM
    // but is fully covered; z-index is maxed so nothing peeks through.
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 2147483647,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: GROUND,
        overflow: "hidden",
      }}
    >
      {isExploded ? <GridexExplodedStage /> : <GridexHeroStage />}
    </div>
  );
}
