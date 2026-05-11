"use client";

import { useEffect, useRef, useState } from "react";
import { facets, type FacetMeta, type FacetSlug } from "@/lib/facets";
import { HeroMorphPoc } from "@/components/HeroMorphPoc";
import {
  InteractionPlate,
  SCREEN_BOUNDS as INTERACTION_SCREEN,
} from "@/components/facets/InteractionPlate";

/*
 * VerticalDeck — the home-page primary surface.
 *
 * Motion model:
 *   - The deck is a fixed-position stage. Native page scroll is used as
 *     a scrubber; nothing in the document flow except a hidden spacer
 *     that determines scrollable distance.
 *   - All cards live on a single rigid track. JS reads scrollY and
 *     applies a translateY to the track, plus a one-time scale ramp
 *     (1 → 0.78) that compresses the deck once the user enters it.
 *   - Cards are uniform — same dimensions, same surface treatment.
 *     Card contents stay still relative to their card frame: no
 *     per-card parallax, no inertia simulation. Print-spec rule —
 *     simulated motion would undercut the typographic register the
 *     rest of the design holds to.
 *   - No scroll-snap. The only time-based motion is the page-load
 *     reveal (hero clip-reveal + cohort fade for the rest at 800ms)
 *     and the hairline-rule scaleX-from-left.
 */

type CardMeta = {
  anchor: string;
  label: string;
  variant: "identity" | "facet" | "selected-works" | "contact";
  /** Only set when variant === "facet". */
  facetSlug?: FacetSlug;
};

// Sustained scale once the user is past the hero. Native scroll-pixel cost
// of advancing one visual card is `cardStep / DECK_SCALE`, because the deck
// visually compresses by this factor — 1px of scroll moves the deck 0.78px.
const HOME_SCALE = 1;
const DECK_SCALE = 0.78;

/*
 * RAMP_PX — scroll distance over which the deck-level scale ramps between
 * the calling-card (1) and the browse register (0.78). Used for both the
 * opening (hero) and closing (terminal) ramps so the metaphor's symmetry
 * is matched by symmetric pacing. Earlier we used `firstStep × 0.7` and
 * `lastStep × 0.7`, but the per-step factor floats with middle-card
 * heights, producing visibly asymmetric open/close cadences.
 */
const RAMP_PX = 1200;

const CARD_DEFS: CardMeta[] = [
  { anchor: "01", label: "Home", variant: "identity" },
  {
    anchor: "02",
    label: "Facet · Interaction",
    variant: "facet",
    facetSlug: "interaction",
  },
  {
    anchor: "03",
    label: "Facet · AI systems",
    variant: "facet",
    facetSlug: "ai-systems",
  },
  {
    anchor: "04",
    label: "Facet · Taste formation",
    variant: "facet",
    facetSlug: "taste-formation",
  },
  { anchor: "05", label: "Selected Works", variant: "selected-works" },
  { anchor: "06", label: "Make contact", variant: "contact" },
];

export function VerticalDeck() {
  const stageRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const spacerRef = useRef<HTMLDivElement>(null);

  const [activeIndex, setActiveIndex] = useState(0);

  // Animation + layout state.
  //
  // scrollPositions — native-scroll Y to land each card visually centered.
  //                   Computed per-card so variable-height sections (e.g.
  //                   the specimen card with a tall mockup) still resolve
  //                   to the right scroll target. Position 0 is hero.
  //                   Last entry is the terminal calling-card target,
  //                   computed at scale=1 to match the closing ramp's end.
  const motionRef = useRef({
    scrollPositions: [] as number[],
  });

  // Recalculate spacer height + per-card scroll positions whenever the
  // layout changes. Reading per-card centers (not offsetTops) is what
  // makes variable-height cards visually center correctly.
  //
  // Math derivation. The track has `position: absolute; top: 0; left: 50%`
  // and the JS transform is `translateX(-50%) translateY(-scrollY) scale(s)`
  // with `transform-origin: 50% 50%` of the unscaled track. A point at
  // unscaled offset y inside the track ends up at viewport-Y:
  //
  //     visualY = -scrollY + H/2 + (y - H/2) * s            (1)
  //
  // where H is the unscaled track height. To center card N visually,
  // y = cardCenter_N (offsetTop + height/2) and visualY = dvh/2:
  //
  //     scrollY_N = H/2 * (1 - s) + s * cardCenter_N - dvh/2
  //
  // The scale at which each target is computed must match the scale the
  // tick function will produce when the user reaches that scroll target:
  //   - card 0 (hero, opening calling card)        → scale = 1
  //   - middle cards (browse state)                → scale = DECK_SCALE
  //   - last card (terminal, closing calling card) → scale = 1
  // Hero opens the calling card with a 1 → 0.78 ramp; terminal closes it
  // with a symmetric 0.78 → 1 ramp. Both calling cards land at full size,
  // so their scrollY targets must use scale = 1 in the formula above.
  useEffect(() => {
    const recalc = () => {
      const track = trackRef.current;
      const spacer = spacerRef.current;
      if (!track || !spacer) return false;

      const cards = track.querySelectorAll<HTMLElement>(".deck-card");
      if (cards.length < 2) return false;

      const dvh = window.innerHeight;
      const halfH = track.scrollHeight / 2;
      const lastIdx = cards.length - 1;
      const scrollPositions: number[] = [];
      cards.forEach((c, i) => {
        if (i === 0) {
          scrollPositions.push(0);
          return;
        }
        // Terminal card lands at full scale (calling-card-back focused);
        // every middle card lands at the sustained browse scale.
        const s = i === lastIdx ? HOME_SCALE : DECK_SCALE;
        const center = c.offsetTop + c.offsetHeight / 2;
        const sy = halfH * (1 - s) + s * center - dvh / 2;
        scrollPositions.push(sy);
      });

      if (scrollPositions[1] <= 0) return false;

      motionRef.current.scrollPositions = scrollPositions;

      // Spacer must extend a full viewport past the last target so the
      // browser actually permits scrollY = scrollPositions[last]
      // (max scrollY = scrollHeight - viewport). Otherwise the last
      // card is unreachable and the deck stalls one card short.
      const totalScroll = scrollPositions[scrollPositions.length - 1];
      spacer.style.height = `${totalScroll + dvh}px`;

      return true;
    };

    // Try a few times in case cards haven't laid out yet on first paint.
    let attempts = 0;
    const tryRecalc = () => {
      if (recalc() || attempts >= 10) return;
      attempts++;
      requestAnimationFrame(tryRecalc);
    };
    tryRecalc();

    // rAF-throttled recalc so font-load reflow / resize bursts collapse
    // into one recompute per frame instead of running synchronously
    // inside the ResizeObserver callback.
    let recalcRaf = 0;
    const scheduleRecalc = () => {
      if (recalcRaf) return;
      recalcRaf = requestAnimationFrame(() => {
        recalcRaf = 0;
        recalc();
      });
    };

    const ro = new ResizeObserver(scheduleRecalc);
    if (trackRef.current) ro.observe(trackRef.current);
    window.addEventListener("resize", scheduleRecalc);

    return () => {
      if (recalcRaf) cancelAnimationFrame(recalcRaf);
      ro.disconnect();
      window.removeEventListener("resize", scheduleRecalc);
    };
  }, []);

  // Main animation loop — position-driven translate + scale.
  //
  // Three-phase scale model: hero ramp / browse / terminal ramp. The
  // calling-card metaphor lives at the deck level — hero opens it
  // (1 → 0.78), the user browses at the sustained 0.78 scale, and the
  // terminal card closes it back (0.78 → 1). Both ends land at full
  // scale; the middle is the browse register.
  //
  //   scrollY = 0              → scale = 1 (hero, opening card front)
  //   0 < scrollY < RAMP_PX    → scale ramps 1 → 0.78
  //   RAMP_PX ≤ sy ≤ tS        → scale = 0.78 (browse register)
  //   tS < scrollY ≤ tE        → scale ramps 0.78 → 1
  //   scrollY = tE             → scale = 1 (terminal, closing card back)
  //
  // tE = scrollPositions[last]; tS = tE − RAMP_PX. Both ramps share the
  // same fixed scroll distance so open and close feel symmetric — earlier
  // we used per-step factors (firstStep×0.7 / lastStep×0.7), but those
  // floated with middle-card heights, giving asymmetric pacing.
  //
  // No damping: the scale is set directly to its target each frame.
  // Damping (lerp ×0.4) was masking subpixel jitter at the cost of a
  // visible lag during ramps — the formula computes scrollPositions at
  // the *target* scale, so any actual-scale lag translates to position
  // error proportional to (target − actual) × (cardCenter − halfH).
  // For the terminal card that error reached ~165px during fast scroll
  // and read as a "rubbery" closing.
  useEffect(() => {
    let raf = 0;

    const tick = () => {
      const m = motionRef.current;
      const sps = m.scrollPositions;
      const sy = window.scrollY;

      let scale = HOME_SCALE;

      if (sps.length > 1) {
        const terminalEnd = sps[sps.length - 1];
        const terminalStart = terminalEnd - RAMP_PX;

        if (sy >= terminalStart) {
          // Terminal ramp: 0.78 → 1 over the last RAMP_PX.
          const t = Math.min((sy - terminalStart) / RAMP_PX, 1);
          const eased = (1 - Math.cos(t * Math.PI)) / 2;
          scale = DECK_SCALE + (HOME_SCALE - DECK_SCALE) * eased;
        } else if (sy > 0) {
          // Hero ramp: 1 → 0.78 over the first RAMP_PX. Beyond, sits
          // at DECK_SCALE for the browse zone.
          const t = Math.min(sy / RAMP_PX, 1);
          const eased = (1 - Math.cos(t * Math.PI)) / 2;
          scale = HOME_SCALE + (DECK_SCALE - HOME_SCALE) * eased;
        }
      }

      const ty = -sy;

      if (trackRef.current) {
        trackRef.current.style.transform =
          `translateX(-50%) translateY(${ty.toFixed(2)}px) ` +
          `scale(${scale.toFixed(4)})`;
      }

      // Active index: the largest i where scrollY has crossed the
      // midpoint between card[i-1] and card[i]. Works for variable
      // card heights because midpoints come from per-card positions,
      // not a uniform step.
      if (sps.length > 1) {
        let idx = 0;
        for (let i = 1; i < sps.length; i++) {
          const mid = (sps[i - 1] + sps[i]) / 2;
          if (sy >= mid) idx = i;
        }
        setActiveIndex((prev) => (prev === idx ? prev : idx));
      }

      raf = requestAnimationFrame(tick);
    };

    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

  /*
   * Section re-entry text reveal.
   *
   * Fires whenever activeIndex changes — i.e., the moment the user
   * crosses the midpoint between two cards. Each visited card replays
   * its clip-line elements once per visit; lastReplayedIdxRef stops
   * the same card from looping if the user wiggles inside it.
   *
   * Reactive on activeIndex (not on scroll-stop debounce) so the
   * animation always fires when the user actually enters the card,
   * even if they scroll past it without stopping. Hero (idx 0) gets a
   * per-character cascade reveal; the terminal card is animated by the
   * deck-level scale ramp and skips line replay so it doesn't compete
   * with the closing motion; every middle card uses rise-from-below.
   */
  const lastReplayedIdxRef = useRef(0);

  useEffect(() => {
    if (activeIndex === lastReplayedIdxRef.current) return;
    lastReplayedIdxRef.current = activeIndex;

    const cards = trackRef.current?.querySelectorAll<HTMLElement>(
      ".deck-card",
    );
    if (!cards) return;
    const card = cards[activeIndex];
    if (!card) return;

    // Terminal card: the deck-level scale ramp (0.78 → 1) is the entry
    // animation. Skip line replay so the closing reads as one piece —
    // text drops while the card is still scaling would steal focus from
    // the ramp and read as double-signal.
    if (activeIndex === cards.length - 1) return;

    // Hero (card 0) — per-character cascade with per-line direction.
    // Mirrors the CSS first-load animation so re-entry feels identical.
    if (activeIndex === 0) {
      const heroLines = card.querySelectorAll<HTMLElement>(".hero-line");
      if (heroLines.length === 0) return;

      const ANIM_FROM = {
        rise: { transform: "translateY(110%)", opacity: "0" },
        drop: { transform: "translateY(-91%)", opacity: "0" },
        drift: { transform: "translateY(28%)", opacity: "0" },
      } as const;
      const ANIM_DURATION = { rise: 700, drop: 750, drift: 900 } as const;
      const TO = { transform: "translateY(0)", opacity: "1" };

      heroLines.forEach((line) => {
        const lineDelay = parseInt(line.dataset.delayMs ?? "0", 10);
        const animKey = (line.dataset.anim ?? "rise") as keyof typeof ANIM_FROM;
        const fromKf = ANIM_FROM[animKey];
        const duration = ANIM_DURATION[animKey];
        const chars = line.querySelectorAll<HTMLElement>(".hero-char");
        chars.forEach((char, i) => {
          char.getAnimations().forEach((a) => a.cancel());
          char.animate([fromKf, TO], {
            duration,
            delay: lineDelay + i * 16,
            easing: "cubic-bezier(0.2, 0.8, 0.2, 1)",
            fill: "both",
          });
        });
      });

      // Hairline rule between name and manifesto — scaleX from left.
      const rule = card.querySelector<HTMLElement>(".hero-rule");
      if (rule) {
        rule.getAnimations().forEach((a) => a.cancel());
        rule.animate(
          [
            { transform: "scaleX(0)" },
            { transform: "scaleX(1)" },
          ],
          {
            duration: 600,
            delay: 700,
            easing: "cubic-bezier(0.2, 0.8, 0.2, 1)",
            fill: "both",
          },
        );
      }
      return;
    }

    // Middle cards — standard rise-from-below line replay.
    const lines = card.querySelectorAll<HTMLElement>(".clip-line > *");
    if (lines.length === 0) return;

    lines.forEach((el, i) => {
      el.getAnimations().forEach((a) => a.cancel());
      el.animate(
        [
          { transform: "translateY(110%)" },
          { transform: "translateY(0)" },
        ],
        {
          duration: 800,
          delay: i * 80,
          easing: "cubic-bezier(0.2, 0.8, 0.2, 1)",
          fill: "both",
        },
      );
    });
  }, [activeIndex]);

  // Anchor scroll handler — scroll programmatically to a given card index.
  const scrollToIndex = (index: number) => {
    const sps = motionRef.current.scrollPositions;
    const target = sps[index];
    if (target === undefined) return;
    window.scrollTo({ top: target, behavior: "smooth" });
  };

  return (
    <>
      {/* Hidden spacer in normal flow — drives native scroll. */}
      <div
        ref={spacerRef}
        className="deck-spacer"
        aria-hidden="true"
      />

      {/* Fixed stage that visually replaces the page. */}
      <div ref={stageRef} className="deck-stage">
        <DeckChrome
          activeIndex={activeIndex}
          total={CARD_DEFS.length}
          onJumpToIndex={scrollToIndex}
        />

        <div ref={trackRef} className="deck-track">
          {CARD_DEFS.map((meta, i) => (
            <article
              key={meta.anchor}
              data-card-index={i}
              data-anchor={meta.anchor}
              className="deck-card"
              aria-label={meta.label}
            >
              <div className="deck-card__body">
                {meta.variant === "identity" && <IdentityBody />}
                {meta.variant === "facet" && meta.facetSlug && (
                  <FacetBody
                    facet={
                      facets.find((f) => f.slug === meta.facetSlug) ?? facets[0]
                    }
                  />
                )}
                {meta.variant === "selected-works" && <SelectedWorksBody />}
                {meta.variant === "contact" && <ContactBody />}
              </div>
            </article>
          ))}
        </div>

        <DeckProgress
          count={CARD_DEFS.length}
          activeIndex={activeIndex}
          onSelect={scrollToIndex}
        />
      </div>
    </>
  );
}

/* ─── Top chrome (replaces standard nav on home) ────────────────────── */

function DeckChrome({
  activeIndex,
  total,
  onJumpToIndex,
}: {
  activeIndex: number;
  total: number;
  onJumpToIndex: (i: number) => void;
}) {
  const position = String(activeIndex + 1).padStart(2, "0");
  const totalStr = String(total).padStart(2, "0");

  return (
    <div className="deck-chrome">
      <button
        type="button"
        onClick={() => onJumpToIndex(0)}
        style={{
          all: "unset",
          cursor: "pointer",
          fontFamily: "var(--font-mono)",
          fontSize: "var(--fs-12)",
          letterSpacing: "0.18em",
          textTransform: "uppercase",
          color: "var(--color-gray-12)",
        }}
      >
        Ryan Zhang
      </button>
      <span style={{ color: "var(--color-gray-12)" }}>
        {position}{" "}
        <span style={{ color: "var(--color-gray-9)" }}>/ {totalStr}</span>
      </span>
    </div>
  );
}

/* ─── Right-edge progress hairline ──────────────────────────────────── */

function DeckProgress({
  count,
  activeIndex,
  onSelect,
}: {
  count: number;
  activeIndex: number;
  onSelect: (i: number) => void;
}) {
  return (
    <div className="deck-progress" aria-hidden="true">
      {Array.from({ length: count }).map((_, i) => {
        const top = `${((i + 0.5) / count) * 100}%`;
        return (
          <button
            key={i}
            type="button"
            className="deck-progress__marker"
            data-active={i === activeIndex}
            onClick={() => onSelect(i)}
            style={{
              top,
              all: "unset",
              position: "absolute",
              cursor: "pointer",
            }}
            aria-label={`Go to card ${i + 1}`}
          />
        );
      })}
    </div>
  );
}

/* ─── Card body: Identity (hero) ────────────────────────────────────── */

/*
 * HeroLine — character-level cascade reveal.
 *
 * Each line splits its text into per-character spans so the entry animation
 * runs as a left-to-right cascade (16ms stagger) instead of the whole line
 * popping at once. The line's `data-anim` picks one of three directions:
 *   - rise   →  translateY(110%) → 0   (anchors push up from below)
 *   - drop   →  translateY(-80%) → 0   (verbs fall in from above)
 *   - drift  →  translateY(25%) + opacity 0 → 0 + 1  (footnotes fade-drift)
 *
 * Direction is chosen by indent level in IdentityBody so each semantic
 * tier has its own entry signature — breaks the "everything from below"
 * uniformity without leaving the clip-reveal language.
 */
function HeroLine({
  delayMs,
  indent,
  anim,
  children,
}: {
  delayMs: number;
  indent: 0 | 1 | 2;
  anim: "rise" | "drop" | "drift";
  children: string;
}) {
  // Words are wrapped in `.hero-word` (inline-block + nowrap) so line
  // wrapping happens at word boundaries — without this, the per-char
  // inline-block spans would let the browser break mid-word.
  const words = children.split(" ");
  let charIndex = 0;
  const nodes: React.ReactNode[] = [];
  words.forEach((word, wi) => {
    nodes.push(
      <span key={`w${wi}`} className="hero-word">
        {Array.from(word).map((ch, ci) => {
          const i = charIndex++;
          return (
            <span
              key={ci}
              className="hero-char"
              style={{ "--char-i": i } as React.CSSProperties}
            >
              {ch}
            </span>
          );
        })}
      </span>,
    );
    if (wi < words.length - 1) nodes.push(" ");
  });
  return (
    <span
      className="clip-line hero-line"
      style={{ "--hero-line-delay": `${delayMs}ms` } as React.CSSProperties}
      data-delay-ms={delayMs}
      data-indent={indent}
      data-anim={anim}
    >
      {nodes}
    </span>
  );
}

function IdentityBody() {
  return (
    <div className="hero-layout">
      <div className="hero-text">
        <h1 className="hero-name" aria-label="Ryan Zhang">
          <HeroLine delayMs={0} indent={0} anim="rise">Ryan Zhang</HeroLine>
        </h1>
        <span className="hero-rule" aria-hidden="true" />
        <p className="hero-manifesto" aria-label="design engineer designing with coding agents, making AI-native interfaces that ship as they’re designed">
          <HeroLine delayMs={900} indent={0} anim="drop">is a design engineer</HeroLine>
          <HeroLine delayMs={1000} indent={1} anim="drift">designing with coding agents</HeroLine>
          <HeroLine delayMs={1100} indent={0} anim="drop">making AI-native interfaces</HeroLine>
          <HeroLine delayMs={1200} indent={1} anim="drift">that ship as they’re designed</HeroLine>
        </p>
      </div>
      <div className="hero-plate-slot" aria-hidden="true">
        <HeroMorphPoc />
      </div>
    </div>
  );
}

/* ─── Card body: Facet (personal-quality narrative) ─────────────────── */

/*
 * FacetBody — surface treatment for one of the three facet narratives.
 *
 * Minimal-register print formula (Braun ad / cover lineage, post-research):
 *   one-graphic + minimal-type. No body paragraph on the surface card —
 *   the supporting prose lives on /facets/[slug]. The card carries only
 *   the claim (English title), the Chinese subhead, the model-number
 *   eyebrow, and one Schmittel-grammar plate. Reader fills in the rest.
 *
 * Inherits the hero's two-register print spec via `.facet-*` classes
 * defined in globals.css. Single weight throughout; hierarchy comes from
 * size + position + hairline rule, never from weight.
 */
function FacetBody({ facet }: { facet: FacetMeta }) {
  // Each facet picks the composition that lets its content speak. None of
  // them inherit the hero's left/right name-card layout — that grammar is
  // reserved for the calling card itself.
  if (facet.slug === "interaction") {
    return <SpecimenFacetBody facet={facet} />;
  }
  if (facet.slug === "ai-systems") {
    return <SurfacesFacetBody facet={facet} />;
  }
  if (facet.slug === "taste-formation") {
    return <RecordFacetBody facet={facet} />;
  }
  return <SpecimenFacetBody facet={facet} />;
}

/*
 * SpecimenFacetBody — Braun catalog-spread composition.
 *
 *   ┌──────────────────────────────────────────────────────────┐
 *   │ 01 / 03 · FACET                                          │
 *   │                                                          │
 *   │                                                          │
 *   │              [ landscape diagram fills here ]            │
 *   │                                                          │
 *   │                                                          │
 *   │  ────────────────────────────                            │
 *   │  I keep refusing the default interaction.                │
 *   │  我对交互形式不安分。                                       │
 *   └──────────────────────────────────────────────────────────┘
 *
 * Photo dominates the page; caption sits underneath, left-flush, smaller
 * than a hero-register title (this is caption typography, not display).
 * Hairline rule sits ABOVE the caption — Schmittel convention is to mark
 * the photo/caption boundary with a thin rule.
 */
function SpecimenFacetBody({ facet }: { facet: FacetMeta }) {
  const ordinal = String(facet.index).padStart(2, "0");
  const total = String(facet.total).padStart(2, "0");

  return (
    <div className="facet-bigshow">
      <div className="facet-bigshow__text">
        <span className="facet-eyebrow clip-line">
          <span>
            {ordinal}
            <span className="facet-eyebrow__total"> / {total}</span>
            <span className="facet-eyebrow__separator">·</span>
            Facet
          </span>
        </span>
        <p className="facet-bigshow__title clip-line">
          <span>{facet.title}</span>
        </p>
        <p className="facet-bigshow__zh clip-line">
          <span>{facet.titleZh}</span>
        </p>
      </div>

      <div className="facet-bigshow__device-wrap">
        <div className="facet-device" aria-label="Pro Display XDR showing interaction work">
          <InteractionPlate className="facet-device__frame" />
          <div
            className="facet-device__screen"
            style={{
              left: `${INTERACTION_SCREEN.left * 100}%`,
              top: `${INTERACTION_SCREEN.top * 100}%`,
              width: `${INTERACTION_SCREEN.width * 100}%`,
              height: `${INTERACTION_SCREEN.height * 100}%`,
            }}
          >
            <InteractionReel />
          </div>
        </div>
      </div>
    </div>
  );
}

/*
 * SurfacesFacetBody — uniform specimen frame with hover-reveal + ledger.
 *
 *   ┌─────────────────────────────────────────────────────────┐
 *   │ 03 · Surfaces                                           │
 *   │ ─── outer hairline frame ────────────────────────────── │
 *   │ ┌──────────────────┬──────────────────┐                 │
 *   │ │  INTERFACE       │  CODE            │ ← primary       │
 *   │ │  [specimen]      │  [specimen]      │   span-6 each   │
 *   │ │  ↳ hover caption │  ↳ hover caption │                 │
 *   │ ├──────────┬───────┼──────────┐                         │
 *   │ │ OBJECT   │ GRAPHIC│ DETAIL  │ ← supporting span-4 ×3  │
 *   │ │ [spec]   │ [spec] │ [spec]  │                         │
 *   │ │ ↳ hover  │ ↳ hover│ ↳ hover │                         │
 *   │ └──────────┴────────┴─────────┘                         │
 *   │ ─── ledger (always visible) ────────────────────────── │
 *   │ 01  INTERFACE  Stash 0.4.2          retrieval pane · 26 │
 *   │ 02  CODE       deck_tick()          motion · 26         │
 *   │ 03  OBJECT     Aurora               Red Dot · 25        │
 *   │ ...                                                      │
 *   │ ─────────────────────────────────────────────────────── │
 *   │ Same eye, different surfaces.                           │
 *   │ 同一种判断，落在不同表面。                                  │
 *   └─────────────────────────────────────────────────────────┘
 *
 * Two-layer explanation strategy:
 *   - Per-cell hover caption — opt-in "看点" prose, only visible on
 *     hover/focus. Cell stays sparse by default (top mono label only).
 *     Hidden on touch devices (no hover affordance, ledger covers info).
 *   - Frame-bottom ledger — always-visible numbered index of all 5
 *     specimens. Mono catalog grammar: index / category / name / meta.
 *     This is the museum-wall figure list — primary source of credit
 *     and identity for every specimen.
 *
 * Specimen content drops in later; for chassis state every cell is an
 * empty plate with a mono label, and ledger fields carry placeholders.
 */

type SurfaceEntry = {
  index: string;
  category: string;
  span: 4 | 6;
  row: "primary" | "supporting";
  name: string;
  meta: string;
  /** One-line hover prose — what to notice. */
  caption: string;
};

const SURFACES_ENTRIES: SurfaceEntry[] = [
  {
    index: "01",
    category: "Interface",
    span: 6,
    row: "primary",
    name: "[待填 · specimen name]",
    meta: "[待填 · year/context]",
    caption: "[待填 · 一句话看点 — what to notice in this interface specimen]",
  },
  {
    index: "02",
    category: "Code",
    span: 6,
    row: "primary",
    name: "[待填 · code excerpt name]",
    meta: "[待填 · year]",
    caption: "[待填 · 一句话看点 — what to notice in this code specimen]",
  },
  {
    index: "03",
    category: "Object",
    span: 4,
    row: "supporting",
    name: "[待填 · object name]",
    meta: "[待填 · award/year]",
    caption: "[待填 · 一句话看点 — what to notice in this object]",
  },
  {
    index: "04",
    category: "Graphic",
    span: 4,
    row: "supporting",
    name: "[待填 · graphic name]",
    meta: "[待填 · year]",
    caption: "[待填 · 一句话看点 — what to notice in this graphic]",
  },
  {
    index: "05",
    category: "Detail",
    span: 4,
    row: "supporting",
    name: "[待填 · detail source]",
    meta: "[待填 · macro context]",
    caption: "[待填 · 一句话看点 — what the macro reveals]",
  },
];

function SurfacesFacetBody({ facet }: { facet: FacetMeta }) {
  const ordinal = String(facet.index).padStart(2, "0");
  const total = String(facet.total).padStart(2, "0");
  const primary = SURFACES_ENTRIES.filter((e) => e.row === "primary");
  const supporting = SURFACES_ENTRIES.filter((e) => e.row === "supporting");

  const renderCell = (entry: SurfaceEntry) => (
    <div
      key={entry.index}
      className={`facet-surfaces__cell facet-surfaces__cell--span-${entry.span}`}
      tabIndex={0}
    >
      <span className="facet-surfaces__cell-label clip-line">
        <span>{entry.category}</span>
      </span>
      <span className="facet-surfaces__cell-caption">{entry.caption}</span>
    </div>
  );

  return (
    <div className="facet-surfaces">
      <span className="facet-eyebrow clip-line">
        <span>
          {ordinal}
          <span className="facet-eyebrow__total"> / {total}</span>
          <span className="facet-eyebrow__separator">·</span>
          Facet
        </span>
      </span>

      <div className="facet-surfaces__frame">
        <div className="facet-surfaces__row facet-surfaces__row--primary">
          {primary.map(renderCell)}
        </div>
        <div className="facet-surfaces__row facet-surfaces__row--supporting">
          {supporting.map(renderCell)}
        </div>
      </div>

      <ol className="facet-surfaces__ledger">
        {SURFACES_ENTRIES.map((entry) => (
          <li key={entry.index} className="facet-surfaces__ledger-row">
            <span className="facet-surfaces__ledger-index">{entry.index}</span>
            <span className="facet-surfaces__ledger-category">
              {entry.category}
            </span>
            <span className="facet-surfaces__ledger-name">{entry.name}</span>
            <span className="facet-surfaces__ledger-meta">{entry.meta}</span>
          </li>
        ))}
      </ol>

      <div className="facet-caption">
        <h2 className="facet-caption__title clip-line">
          <span>{facet.title}</span>
        </h2>
        <p className="facet-caption__zh clip-line">
          <span>{facet.titleZh}</span>
        </p>
      </div>
    </div>
  );
}

/*
 * RecordFacetBody — editorial entries with marginalia (annotated record).
 *
 *   ┌──────────────────────────────────────────────────────────┐
 *   │ 04 · On Record                                           │
 *   │ What's been recognized, where it was made.               │
 *   │ ──────────────────────────────────────────────────────── │
 *   │ 2025    IF DESIGN AWARD             [why this matters /  │
 *   │         Industrial · Object          jury size, % awarded,│
 *   │                                      what the body did]  │
 *   │ ──────────────────────────────────────────────────────── │
 *   │ 2024    [Project name]              [context · why it    │
 *   │         External · SaaS              matters]            │
 *   │ ──────────────────────────────────────────────────────── │
 *   │ ...                                                       │
 *   └──────────────────────────────────────────────────────────┘
 *
 * Vertical reading rhythm — orthogonal to S3's horizontal cell grid so
 * the deck visibly changes register entering S4 (specimen catalog →
 * annotated record). Each entry is a 3-column block: year (left, mono
 * large) / title-and-body (middle) / context (right, the "why this
 * matters" annotation).
 *
 * The context column is the actual content move that distinguishes
 * this from a CV table — it lets each credential be storytelling
 * (jury composition, % awarded, citation, what it was given for)
 * rather than just a label. No logos, no logo walls — context is
 * always text.
 *
 * Placeholders here demonstrate the format only; real awards /
 * projects / education get filled in when the record is authored.
 * Reverse-chronological mixed (awards + projects + education in one
 * column) so the section reads as one continuous record rather than
 * three sub-categories.
 */
const RECORD_PLACEHOLDERS = [
  {
    year: "2025",
    title: "[Award name placeholder]",
    body: "Industrial · Object",
    context:
      "[~1-2 line context — jury size, % accepted, recognition body's stature, what the work was awarded for]",
  },
  {
    year: "2025",
    title: "[Project name placeholder]",
    body: "External · AI systems",
    context:
      "[~1-2 line context — what it does, scale, citation or recognition that gives it weight]",
  },
  {
    year: "2024",
    title: "[Award name placeholder]",
    body: "Graphic",
    context:
      "[~1-2 line context — jury, percentile, what category]",
  },
  {
    year: "2024",
    title: "[Project name placeholder]",
    body: "External · SaaS",
    context:
      "[~1-2 line context — your role, scale, outcome]",
  },
  {
    year: "2024",
    title: "[Project name placeholder]",
    body: "External · platform",
    context:
      "[~1-2 line context]",
  },
  {
    year: "2023",
    title: "[Education placeholder]",
    body: "Master's · school name",
    context:
      "[~1-2 line context — program focus, thesis, advisors]",
  },
  {
    year: "2023",
    title: "[Award name placeholder]",
    body: "Industrial · Object",
    context:
      "[~1-2 line context]",
  },
  {
    year: "2022",
    title: "[Award name placeholder]",
    body: "Graphic",
    context:
      "[~1-2 line context]",
  },
  {
    year: "2021",
    title: "[Education placeholder]",
    body: "Bachelor's · school name",
    context:
      "[~1-2 line context]",
  },
];

function RecordFacetBody({ facet }: { facet: FacetMeta }) {
  const ordinal = String(facet.index).padStart(2, "0");
  const total = String(facet.total).padStart(2, "0");
  return (
    <div className="facet-record">
      <header className="facet-record__header">
        <span className="facet-eyebrow clip-line">
          <span>
            {ordinal}
            <span className="facet-eyebrow__total"> / {total}</span>
            <span className="facet-eyebrow__separator">·</span>
            Facet
          </span>
        </span>
        <h2 className="facet-record__thesis clip-line">
          <span>{facet.title}</span>
        </h2>
      </header>

      <div className="facet-record__entries">
        {RECORD_PLACEHOLDERS.map((entry, i) => (
          <article key={i} className="facet-record__entry">
            <span className="facet-record__year">{entry.year}</span>
            <div className="facet-record__main">
              <h3 className="facet-record__title clip-line">
                <span>{entry.title}</span>
              </h3>
              <p className="facet-record__body">{entry.body}</p>
            </div>
            <p className="facet-record__context">{entry.context}</p>
          </article>
        ))}
      </div>
    </div>
  );
}

/* ─── Card body: Selected Works ─────────────────────────────────────── */

/*
 * SelectedWorksBody — the "card back" of the hero.
 *
 *   ┌──────────────────────────────────────────────────────────┐
 *   │ 05 · Selected Works                                      │
 *   │                                                          │
 *   │   ┌─────────────┐   [ work index list goes here ]       │
 *   │   │  featured   │                                        │
 *   │   │  demo       │   01  [project] · status               │
 *   │   │  thumbnail  │   02  [project] · status               │
 *   │   │             │   03  [project] · status               │
 *   │   └─────────────┘   ...                                  │
 *   │                                                          │
 *   └──────────────────────────────────────────────────────────┘
 *
 * Mirrors the hero card's contained shape — same width (--card-w),
 * same height (--card-h), same white-with-thin-border treatment —
 * so S1 (hero) and S5 (works) read as the calling card's two faces.
 * Everything between (S2 / S3 / S4) breaks out full-bleed; this is
 * the deck's other "anchor" frame.
 *
 * Layout placeholder for now. Real content (featured demo image
 * left + work index list right) gets wired once the visual shell
 * is approved.
 */
function SelectedWorksBody() {
  return (
    <div className="works-card">
      <span className="facet-eyebrow clip-line">
        <span>
          05
          <span className="facet-eyebrow__separator">·</span>
          Selected Works
        </span>
      </span>

      <div className="works-card__placeholder" aria-hidden="true">
        <span className="works-card__placeholder-label clip-line">
          <span>[ card chassis · layout to come ]</span>
        </span>
        <span className="works-card__placeholder-label clip-line">
          <span>featured demo · 6/12 col</span>
        </span>
        <span className="works-card__placeholder-label clip-line">
          <span>work index list · 6/12 col</span>
        </span>
        <span className="works-card__placeholder-label clip-line">
          <span>→ all work</span>
        </span>
      </div>
    </div>
  );
}

/* ─── Card body: Contact ────────────────────────────────────────────── */

/*
 * ContactBody — book-style colophon.
 *
 *   ┌──────────────────────────────────────────────────────────┐
 *   │ 05 · Colophon                                            │
 *   │                                                          │
 *   │                                                          │
 *   │                       (vast empty)                       │
 *   │                                                          │
 *   │                                                          │
 *   │  Designed and built by Ryan Zhang.                       │
 *   │  Set in Inter and Geist Mono.                            │
 *   │  Available for design-engineer roles at AI-product teams.│
 *   │  ryan.runsheng@gmail.com                                 │
 *   └──────────────────────────────────────────────────────────┘
 *
 * Last page of a book convention: small, dense, signature-like, flush
 * left, lower portion of the page. Vast empty area above carries the
 * weight of "this is the end". No hero treatment, no big type, no
 * buttons. The colophon is the closing — not another opener.
 */
function ContactBody() {
  return (
    <div className="facet-colophon">
      <span className="facet-eyebrow clip-line">
        <span>
          06
          <span className="facet-eyebrow__separator">·</span>
          Colophon
        </span>
      </span>

      <div className="facet-colophon__block">
        <p className="facet-colophon__line clip-line">
          <span>Designed and built by Ryan Zhang.</span>
        </p>
        <p className="facet-colophon__line clip-line">
          <span>Set in Inter and Geist Mono.</span>
        </p>
        <p className="facet-colophon__line clip-line">
          <span>
            Available for design-engineer roles at AI-product teams.
          </span>
        </p>
        <p className="facet-colophon__line clip-line">
          <span>
            <a
              href="mailto:ryan.runsheng@gmail.com"
              className="facet-colophon__email"
            >
              ryan.runsheng@gmail.com
            </a>
          </span>
        </p>
      </div>
    </div>
  );
}

/* ─── Interaction reel — single looping clip inside the monitor screen ─
 *
 * Respects prefers-reduced-motion: when the user has reduced-motion set,
 * the video pauses on its first frame and never starts. JS — not the
 * `autoplay` HTML attribute — drives playback so we can react to runtime
 * preference changes (OS-level toggle while the page is open).
 */
function InteractionReel() {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;

    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");

    const apply = (reduced: boolean) => {
      if (reduced) {
        v.pause();
        v.currentTime = 0;
      } else {
        v.play().catch(() => {});
      }
    };

    apply(mq.matches);

    const handler = (e: MediaQueryListEvent) => apply(e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        background: "#000",
      }}
    >
      <video
        ref={videoRef}
        src="/interaction/drag-electron.mp4"
        muted
        loop
        playsInline
        preload="auto"
        aria-label="Drag interaction"
        style={{
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
          objectFit: "cover",
        }}
      />
    </div>
  );
}
