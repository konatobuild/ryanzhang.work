import { WorkStream } from "@/components/WorkStream";

export default function Home() {
  return (
    <div>
      {/* SCREEN 1 — IDENTITY STATEMENT ------------------------------------- */}
      <section
        aria-label="Identity"
        className="relative border-b border-[color:var(--color-hairline)]"
      >
        <div className="grid grid-cols-12 gap-6 md:gap-8 px-6 md:px-10 pt-10 md:pt-14">
          {/* Display name — takes full right side, huge */}
          <div className="col-span-12">
            <h1
              className="font-semibold tracking-[-0.04em] leading-[0.92] text-[color:var(--color-ink)] text-[84px] md:text-[180px] lg:text-[240px] xl:text-[280px]"
            >
              RYAN ZHANG
            </h1>
          </div>
        </div>

        {/* Photo + vertical meta rail row */}
        <div className="relative grid grid-cols-12 gap-6 md:gap-8 px-6 md:px-10 pt-6 md:pt-10 pb-10 md:pb-14">
          {/* Vertical meta rail */}
          <div className="col-span-12 md:col-span-2">
            <div
              className="hidden md:block font-mono text-[11px] tracking-[0.22em] uppercase text-[color:var(--color-muted)]"
              style={{ writingMode: "vertical-rl", transform: "rotate(180deg)" }}
            >
              SEQ_001{"  //  "}DESIGN_ENGINEER{"  //  "}INDEXED_2026
            </div>

            {/* Mobile: horizontal meta rail */}
            <div className="md:hidden font-mono text-[11px] tracking-[0.18em] uppercase text-[color:var(--color-muted)]">
              SEQ_001 · DESIGN_ENGINEER · INDEXED_2026
            </div>
          </div>

          {/* Personal photo area (placeholder) */}
          <div className="col-span-12 md:col-span-10">
            <figure className="relative w-full aspect-[4/3] md:aspect-[16/9] overflow-hidden bg-[#d9d9d9]">
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
