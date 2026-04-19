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

          {/* Desktop: narrow fixed-width vertical rail on far left */}
          <div className="hidden md:flex shrink-0 w-[72px] md:pl-10 md:pr-4 items-end">
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

          {/* Image — edge-to-edge on the right on desktop */}
          <div className="flex-1 min-w-0 min-h-0 px-6 md:px-0">
            <figure className="relative w-full h-full min-h-[320px] overflow-hidden bg-[#d9d9d9]">
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <p className="font-mono text-[11px] tracking-[0.22em] uppercase text-[color:var(--color-ink)]/50">
                    Portrait · placeholder
                  </p>
                  <p className="mt-4 font-mono text-[48px] md:text-[72px] tracking-[0.04em] text-[color:var(--color-ink)]/70">
                    RZ
                  </p>
                </div>
              </div>
            </figure>
          </div>
        </div>
      </section>

      {/* SCREEN 2+ — WORK ARCHIVE ----------------------------------------- */}
      <WorkStream />
    </div>
  );
}
