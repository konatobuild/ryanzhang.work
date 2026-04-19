"use client";

import { useState } from "react";
import { HamburgerMenu } from "./HamburgerMenu";

export function Nav() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <>
      <header className="sticky top-0 z-40 bg-[color:var(--color-canvas)]/90 backdrop-blur-md border-b border-[color:var(--color-hairline)]">
        <div className="grid grid-cols-[1fr_auto_1fr] items-center px-6 md:px-10 h-14">
          {/* Left: leave empty for now (could host a small dot mark later) */}
          <div aria-hidden="true" />

          {/* Center: archival meta */}
          <p
            className="justify-self-center font-mono text-[11px] tracking-[0.18em] uppercase text-[color:var(--color-ink)] whitespace-nowrap"
          >
            ARCHIVAL <span className="text-[color:var(--color-muted)]">/</span>{" "}
            VOL.01 <span className="text-[color:var(--color-muted)]">/</span>{" "}
            RZ.OS
          </p>

          {/* Right: status + hamburger */}
          <div className="justify-self-end inline-flex items-center gap-6">
            <span
              className="hidden sm:inline-flex items-center gap-2 font-mono text-[11px] tracking-[0.18em] uppercase text-[color:var(--color-ink)]"
              aria-label="Availability status"
            >
              <span
                aria-hidden="true"
                className="inline-block h-1.5 w-1.5 rounded-full bg-[color:var(--color-klein)]"
              />
              Available
            </span>

            <button
              type="button"
              onClick={() => setMenuOpen(true)}
              aria-label="Open menu"
              aria-expanded={menuOpen}
              className="inline-flex h-8 w-8 flex-col items-center justify-center gap-[5px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--color-klein)] focus-visible:ring-offset-2 rounded-sm"
            >
              <span
                aria-hidden="true"
                className="block h-[1.5px] w-5 bg-[color:var(--color-ink)]"
              />
              <span
                aria-hidden="true"
                className="block h-[1.5px] w-5 bg-[color:var(--color-ink)]"
              />
            </button>
          </div>
        </div>
      </header>

      <HamburgerMenu open={menuOpen} onClose={() => setMenuOpen(false)} />
    </>
  );
}
