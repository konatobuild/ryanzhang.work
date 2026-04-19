import Image from "next/image";
import { WorkStream } from "@/components/WorkStream";

export default function Home() {
  return (
    <div>
      {/* SCREEN 1 — IDENTITY STATEMENT -------------------------------------
          Section fills one viewport minus the 56px sticky nav.
          Desktop: narrow fixed-width meta rail on the left, image extends
          to the right viewport edge. Mobile: rail moves above the image.
         ------------------------------------------------------------------ */}
      <section
        aria-label="Identity"
        className="relative flex flex-col border-b border-[color:var(--color-hairline)]"
        style={{ minHeight: "calc(100dvh - 56px)" }}
      >
        {/* Name row — compact */}
        <div className="px-6 md:px-10 pt-6 md:pt-8">
          <h1 className="font-semibold tracking-[-0.04em] leading-[0.9] text-[color:var(--color-ink)] text-[56px] md:text-[88px] lg:text-[112px] xl:text-[128px]">
            RYAN ZHANG
          </h1>
        </div>

        {/* Photo + rail fills remaining viewport */}
        <div className="flex-1 min-h-0 flex flex-col md:flex-row pt-4 md:pt-6 pb-6 md:pb-8">
          {/* Mobile: horizontal rail above image */}
          <div className="md:hidden px-6 pb-3 font-mono text-[11px] tracking-[0.18em] uppercase text-[color:var(--color-muted)]">
            SEQ_001 · DESIGN_ENGINEER · INDEXED_2026
          </div>

          {/* Desktop: narrow vertical rail in the left gutter (0–40px).
              Image starts at 40px to align with heading's pl-10. */}
          <div className="hidden md:flex shrink-0 w-10 items-end justify-center">
            <div
              className="font-mono text-[11px] tracking-[0.22em] uppercase text-[color:var(--color-muted)] whitespace-nowrap"
              style={{
                writingMode: "vertical-rl",
                transform: "rotate(180deg)",
              }}
            >
              SEQ_001{"  //  "}DESIGN_ENGINEER{"  //  "}INDEXED_2026
            </div>
          </div>

          {/* Image — aligned with heading: pl comes from the rail's width,
              pr-10 matches the heading's right margin. */}
          <div className="flex-1 min-w-0 min-h-0 px-6 md:pr-10 md:pl-0">
            <figure className="relative w-full h-full min-h-[320px] overflow-hidden bg-[#eaeaea]">
              <Image
                src="/ryan-portrait.jpg"
                alt="Ryan Zhang"
                fill
                sizes="(min-width: 768px) 95vw, 100vw"
                quality={100}
                priority
                className="object-cover object-center"
              />
            </figure>
          </div>
        </div>
      </section>

      {/* SCREEN 2+ — WORK ARCHIVE ----------------------------------------- */}
      <WorkStream />
    </div>
  );
}
