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
  variant: "identity" | "facet" | "contact";
  /** Only set when variant === "facet". */
  facetSlug?: FacetSlug;
};

// Sustained scale once the user is past the hero. Native scroll-pixel cost
// of advancing one visual card is `cardStep / DECK_SCALE`, because the deck
// visually compresses by this factor — 1px of scroll moves the deck 0.78px.
const HOME_SCALE = 1;
const DECK_SCALE = 0.78;

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
  { anchor: "05", label: "Make contact", variant: "contact" },
];

export function VerticalDeck() {
  const stageRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const spacerRef = useRef<HTMLDivElement>(null);

  const [activeIndex, setActiveIndex] = useState(0);

  // Animation + layout state.
  //
  // cardStep        — distance between adjacent cards in the unscaled track
  //                   (CSS layout value, e.g. 822 for a 750-tall card + 72 gap)
  // effectiveStep   — scroll-pixels to advance one visual card at sustained
  //                   scale. At DECK_SCALE = 0.78, one card visually = 1054px
  //                   of native scroll. Used for spacer height and activeIndex.
  const motionRef = useRef({
    scale: 1,
    cardStep: 0,
    effectiveStep: 0,
  });

  // Recalculate spacer height + cardStep whenever viewport changes.
  // We read the actual rendered card dimensions (instead of resolving
  // the CSS variable strings) so calc() / clamp() are evaluated for us.
  useEffect(() => {
    const recalc = () => {
      const track = trackRef.current;
      const spacer = spacerRef.current;
      if (!track || !spacer) return false;

      const cards = track.querySelectorAll<HTMLElement>(".deck-card");
      if (cards.length < 2) return false;

      const r0 = cards[0].getBoundingClientRect();
      const r1 = cards[1].getBoundingClientRect();

      // cardStep = distance from card N's top to card N+1's top.
      const cardStep = r1.top - r0.top;
      if (cardStep <= 0) return false;

      motionRef.current.cardStep = cardStep;
      // Compensate for sustained scale: at scale 0.78, advancing one
      // visual card requires step / 0.78 = 1054 native scroll-pixels.
      const effectiveStep = cardStep / DECK_SCALE;
      motionRef.current.effectiveStep = effectiveStep;

      const totalScroll = (CARD_DEFS.length - 1) * effectiveStep;
      spacer.style.height = `${totalScroll + 8}px`;

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

    // ResizeObserver picks up font-load reflow + viewport changes.
    const ro = new ResizeObserver(() => recalc());
    if (trackRef.current) ro.observe(trackRef.current);
    window.addEventListener("resize", recalc);

    return () => {
      ro.disconnect();
      window.removeEventListener("resize", recalc);
    };
  }, []);

  // Main animation loop — position-driven translate + scale.
  //
  // Scale model (matches rauno.me's actual behavior, verified by reading
  // pages/index-25e30adbdf1f855a.js directly):
  //   - At scrollY = 0 (hero centered)        → scale = 1 (full size)
  //   - At scrollY > TRANSITION_RANGE         → scale = DECK_SCALE (sustained)
  //   - Smooth cosine ramp between
  //
  // Once the user enters the deck, every card stays at the compressed scale
  // for the rest of navigation — no per-card pop-back to 1. That's what
  // makes scrolling between cards feel smooth and continuous instead of
  // "jumping" at every section. Returning to scrollY = 0 expands back to 1.
  //
  // We still damp the scale variable slightly so sub-pixel scroll jitter
  // doesn't translate into scale jitter.
  useEffect(() => {
    let raf = 0;

    const tick = () => {
      const m = motionRef.current;
      const step = m.cardStep;
      const effective = m.effectiveStep;

      let targetScale = HOME_SCALE;

      if (effective > 0) {
        // Transition completes within the first 70% of the first effective
        // card-step (i.e., as the user approaches the visual position of
        // card 2). Beyond that, scale stays at DECK_SCALE.
        const range = effective * 0.7;
        const t = Math.min(window.scrollY / range, 1);
        const eased = (1 - Math.cos(t * Math.PI)) / 2; // smooth s-curve
        targetScale = HOME_SCALE + (DECK_SCALE - HOME_SCALE) * eased;
      }

      // Critically-damped chase — converges in ~3 frames at 60fps.
      m.scale += (targetScale - m.scale) * 0.4;

      const scale = Math.abs(m.scale - 1) < 0.0005 ? 1 : m.scale;
      const ty = -window.scrollY;

      if (trackRef.current) {
        trackRef.current.style.transform =
          `translateX(-50%) translateY(${ty.toFixed(2)}px) ` +
          `scale(${scale.toFixed(4)})`;
      }

      // Active index uses effective step so the counter ticks when the
      // visual card center reaches the viewport center — not when scrollY
      // hits the unscaled cardStep.
      if (effective > 0) {
        const idx = Math.round(window.scrollY / effective);
        const clamped = Math.max(0, Math.min(idx, CARD_DEFS.length - 1));
        setActiveIndex((prev) => (prev === clamped ? prev : clamped));
      }

      // Print-spec rule: card contents do not parallax. The deck as a
      // whole scrubs and scales; cards themselves stay still. Earlier
      // versions imitated rauno.me's per-frame inertia spring here, but
      // simulated inertia reads as motion-graphic and undermines the
      // print register the rest of the design commits to.
      void step;

      raf = requestAnimationFrame(tick);
    };

    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

  /*
   * Section re-entry text reveal.
   *
   * When the user settles on a card different from the previously-revealed
   * one, replay the clip-line elements inside that card with a stagger.
   * Each line resets to translateY(110%) and animates back to 0 — same
   * mechanism as the page-load hero clip-reveal, but JS-driven so it can
   * fire on every section re-entry.
   *
   * Hero (index 0) is initially revealed by CSS, so we mark it as already
   * replayed; the JS only fires once the user has visited a different card.
   * Triggered on scroll-stop (220ms debounce), not on every activeIndex
   * change, so fast scrolls passing through cards don't queue animations.
   */
  const activeIndexRef = useRef(0);
  useEffect(() => {
    activeIndexRef.current = activeIndex;
  }, [activeIndex]);

  useEffect(() => {
    let stopTimer: number | undefined;
    const lastReplayedIdxRef = { current: 0 };

    const replay = () => {
      const idx = activeIndexRef.current;
      if (idx === lastReplayedIdxRef.current) return;
      lastReplayedIdxRef.current = idx;

      const cards = trackRef.current?.querySelectorAll<HTMLElement>(
        ".deck-card",
      );
      const card = cards?.[idx];
      if (!card) return;

      // Hero (card 0) — per-character cascade with per-line direction.
      // Mirrors the CSS first-load animation so re-entry feels identical.
      if (idx === 0) {
        const heroLines = card.querySelectorAll<HTMLElement>(".hero-line");
        if (heroLines.length === 0) return;

        // Must mirror the CSS @keyframes hero-char-* values in globals.css.
        // drop/drift compensated for the manifesto's lh=32px lock so absolute
        // swing matches the previous lh=36.4 baseline (-29px / +9px).
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
        // Sequenced after name char cascade lands (~700ms).
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

      // Non-hero cards — line-level replay (existing behavior).
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
    };

    const onScroll = () => {
      window.clearTimeout(stopTimer);
      stopTimer = window.setTimeout(replay, 220);
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.clearTimeout(stopTimer);
    };
  }, []);

  // Anchor scroll handler — scroll programmatically to a given card index.
  const scrollToIndex = (index: number) => {
    const eff = motionRef.current.effectiveStep;
    if (eff <= 0) return;
    window.scrollTo({ top: index * eff, behavior: "smooth" });
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
    return <StackedFacetBody facet={facet} />;
  }
  if (facet.slug === "taste-formation") {
    return <TriadicFacetBody facet={facet} />;
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
    <div className="facet-poster">
      <span className="facet-eyebrow clip-line">
        <span>
          {ordinal}
          <span className="facet-eyebrow__total"> / {total}</span>
          <span className="facet-eyebrow__separator">·</span>
          Facet
        </span>
      </span>

      <h2 className="facet-poster__hook clip-line">
        <span>{facet.hook}</span>
      </h2>

      <div className="facet-poster__plate">
        <div className="facet-device" aria-label="Laptop displaying interaction work">
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
            <span className="facet-device__placeholder">demo · pending</span>
          </div>
        </div>
      </div>

      <div className="facet-poster__caption">
        <p className="facet-poster__title clip-line">
          <span>{facet.title}</span>
        </p>
        <p className="facet-poster__zh clip-line">
          <span>{facet.titleZh}</span>
        </p>
      </div>
    </div>
  );
}

/*
 * StackedFacetBody — Bauhaus engineering-page composition.
 *
 *   ┌──────────────────────────────────────────────────────────┐
 *   │ 02 / 03 · Facet                                          │
 *   │ ─────────────────────────────────────────────────────────│
 *   │  Layer 01 · UI                                           │
 *   │ ─────────────────────────────────────────────────────────│
 *   │  Layer 02 · Middle layer                                 │
 *   │ ─────────────────────────────────────────────────────────│
 *   │  Layer 03 · Model                                        │
 *   │ ─────────────────────────────────────────────────────────│
 *   │  I design AI as a system, not as a skin.                 │
 *   │  我把 AI 当系统设计，不是当皮肤贴。                            │
 *   └──────────────────────────────────────────────────────────┘
 *
 * Three horizontal zones separated by hairlines = the architecture
 * itself, drawn with type. The version reads top-to-bottom from
 * surface (UI) to ground (model). Caption sits underneath, repeating
 * the SpecimenFacetBody convention so all facets share the same
 * caption register.
 */
function StackedFacetBody({ facet }: { facet: FacetMeta }) {
  const ordinal = String(facet.index).padStart(2, "0");
  const total = String(facet.total).padStart(2, "0");

  return (
    <div className="facet-stacked">
      <span className="facet-eyebrow clip-line">
        <span>
          {ordinal}
          <span className="facet-eyebrow__total"> / {total}</span>
          <span className="facet-eyebrow__separator">·</span>
          Facet
        </span>
      </span>

      <div className="facet-stacked__layers">
        <div className="facet-stacked__layer">
          <span className="facet-stacked__layer-label clip-line">
            <span>Layer 01 · UI</span>
          </span>
        </div>
        <div className="facet-stacked__layer">
          <span className="facet-stacked__layer-label clip-line">
            <span>Layer 02 · Middle layer</span>
          </span>
        </div>
        <div className="facet-stacked__layer">
          <span className="facet-stacked__layer-label clip-line">
            <span>Layer 03 · Model</span>
          </span>
        </div>
      </div>

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
 * TriadicFacetBody — three-column index composition.
 *
 *   ┌──────────────────────────────────────────────────────────┐
 *   │ 03 / 03 · Facet                                          │
 *   │                                                          │
 *   │  Industrial   │   Graphic   │   Code                     │
 *   │ ─────────────────────────────────────────────────────────│
 *   │  My taste was formed across three disciplines.           │
 *   │  我的审美是在三个学科里长出来的。                              │
 *   └──────────────────────────────────────────────────────────┘
 *
 * Three vertical columns at the top become the three disciplines, each
 * with its own mono-caps label. Hairline rule below the columns marks
 * the boundary between the index and the manifesto caption.
 */
function TriadicFacetBody({ facet }: { facet: FacetMeta }) {
  const ordinal = String(facet.index).padStart(2, "0");
  const total = String(facet.total).padStart(2, "0");

  return (
    <div className="facet-triadic">
      <span className="facet-eyebrow clip-line">
        <span>
          {ordinal}
          <span className="facet-eyebrow__total"> / {total}</span>
          <span className="facet-eyebrow__separator">·</span>
          Facet
        </span>
      </span>

      <div className="facet-triadic__columns">
        <div className="facet-triadic__column">
          <span className="facet-triadic__column-label clip-line">
            <span>Industrial</span>
          </span>
        </div>
        <div className="facet-triadic__column">
          <span className="facet-triadic__column-label clip-line">
            <span>Graphic</span>
          </span>
        </div>
        <div className="facet-triadic__column">
          <span className="facet-triadic__column-label clip-line">
            <span>Code</span>
          </span>
        </div>
      </div>

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
          05
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
