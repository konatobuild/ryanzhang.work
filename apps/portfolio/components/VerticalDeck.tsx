"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { featureCases, type CaseEntry } from "@/lib/cases";
import { HeroMorphPoc } from "@/components/HeroMorphPoc";

/*
 * VerticalDeck — the home-page primary surface.
 *
 * Motion model (ported from rauno.me homepage):
 *   - The deck is a fixed-position stage. Native page scroll is used as
 *     a scrubber; nothing in the document flow except a hidden spacer
 *     that determines scrollable distance.
 *   - All cards live on a single rigid track. JS reads scrollY and
 *     applies a translateY to the track, plus a velocity-driven scale
 *     spring (1 ↔ ~0.7) that shrinks the deck during fast scroll and
 *     springs back to 1 when scroll stops. That's the "you can see
 *     across sections" feel.
 *   - Cards are uniform — same dimensions, same surface treatment.
 *     Hero is just card 0; gnovi is card 1; etc.
 *   - No scroll-snap. No per-card entrance during scroll. The only
 *     time-based motion is the page-load reveal (hero clip-reveal +
 *     cohort fade for the rest at 800ms).
 *
 * See STRATEGY.md §6 + the rauno.me motion deep-dive report.
 */

type CardMeta = {
  anchor: string;
  label: string;
  variant: "identity" | "focus" | "work" | "contact";
};

// Sustained scale once the user is past the hero. Native scroll-pixel cost
// of advancing one visual card is `cardStep / DECK_SCALE`, because the deck
// visually compresses by this factor — 1px of scroll moves the deck 0.78px.
const HOME_SCALE = 1;
const DECK_SCALE = 0.78;

const CARD_DEFS: CardMeta[] = [
  { anchor: "01", label: "Home", variant: "identity" },
  { anchor: "02", label: "Focus · Stash", variant: "focus" },
  { anchor: "03", label: "Work 01", variant: "work" },
  { anchor: "04", label: "Work 02", variant: "work" },
  { anchor: "05", label: "Work 03", variant: "work" },
  { anchor: "06", label: "Make contact", variant: "contact" },
];

export function VerticalDeck() {
  const stash = featureCases.find((c) => c.slug === "stash") ?? null;

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
    // Per-card parallax offsets — chase a target derived from scroll
    // position. Each card body translates additionally on Y so its content
    // "trails" the card frame as the deck scrolls. Mirrors rauno.me's
    // per-frame slide spring (`k = useSpring(0, {stiffness:500, damping:40})`)
    // applied to slide-variant frame contents.
    parallax: [] as number[],
  });

  // Cache references to each card's body element. Populated once after
  // mount; the tick function reads from here to apply per-frame parallax
  // without paying for repeated DOM queries.
  const bodyRefsRef = useRef<HTMLElement[]>([]);

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

      // Cache body refs for the parallax loop in tick().
      const bodies: HTMLElement[] = [];
      cards.forEach((c) => {
        const body = c.querySelector(".deck-card__body");
        if (body instanceof HTMLElement) bodies.push(body);
      });
      bodyRefsRef.current = bodies;
      motionRef.current.parallax = new Array(bodies.length).fill(0);

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

      // Per-card parallax. Each card body translates additionally on Y
      // based on its distance from the current scroll center, so contents
      // "trail" the card frame as the deck moves. Mirrors rauno.me's
      // per-frame slide spring on slide-variant frames. Direction: positive
      // distance (user has scrolled past card center) → content drifts down
      // within its card → content lingers in viewport longer than card.
      const bodies = bodyRefsRef.current;
      if (effective > 0 && bodies.length > 0) {
        const PARALLAX_FACTOR = 0.18;
        const PARALLAX_MAX = 90;
        for (let i = 0; i < bodies.length; i++) {
          const body = bodies[i];
          const cardCenter = i * effective;
          const distance = window.scrollY - cardCenter;
          const target = Math.max(
            -PARALLAX_MAX,
            Math.min(PARALLAX_MAX, distance * PARALLAX_FACTOR),
          );
          const current = m.parallax[i] ?? 0;
          const next = current + (target - current) * 0.35;
          m.parallax[i] = next;
          body.style.transform = `translateY(${next.toFixed(2)}px)`;
        }
      }

      // Suppress unused-var lint if step ends up unused after refactors.
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

        const ANIM_FROM = {
          rise: { transform: "translateY(110%)", opacity: "0" },
          drop: { transform: "translateY(-80%)", opacity: "0" },
          drift: { transform: "translateY(25%)", opacity: "0" },
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
                {meta.variant === "focus" && <StashBody entry={stash} />}
                {meta.variant === "work" && <WorkSlotBody label={meta.label} />}
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

/* ─── Card body: Stash (current focus) ──────────────────────────────── */

function StashBody({ entry }: { entry: CaseEntry | null }) {
  return (
    <>
      <div
        style={{
          flex: 1,
          display: "grid",
          gridTemplateColumns: "minmax(0, 1.1fr) minmax(0, 1fr)",
          gap: "clamp(var(--space-4), 4vw, var(--space-7))",
          alignItems: "stretch",
          minHeight: 0,
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            gap: "var(--space-3)",
            minWidth: 0,
          }}
        >
          <h2
            className="clip-line"
            style={{
              fontSize: "clamp(48px, 6vw, 88px)",
              lineHeight: 1.02,
              fontWeight: 400,
              letterSpacing: "-0.04em",
              color: "var(--color-gray-12)",
              margin: 0,
            }}
          >
            <span>Stash</span>
          </h2>
          <p
            className="clip-line"
            style={{
              fontSize: "clamp(16px, 1.5vw, 20px)",
              lineHeight: 1.45,
              color: "var(--color-gray-12)",
              margin: 0,
              maxWidth: "42ch",
            }}
          >
            <span>
              A macOS taste library — built with retrieval architecture so
              the things you save become queryable design infrastructure.
            </span>
          </p>

          <div className="clip-line">
            <ul
              style={{
                listStyle: "none",
                padding: 0,
                margin: 0,
                display: "grid",
                gap: "var(--space-1)",
                fontSize: "clamp(13px, 1.15vw, 15px)",
                lineHeight: 1.4,
                color: "var(--color-gray-12)",
                marginTop: "var(--space-2)",
              }}
            >
              <li>
                <strong style={{ fontWeight: 500 }}>Native macOS</strong>{" "}
                <span style={{ color: "var(--color-gray-11)" }}>
                  — system-integrated, not a browser tab.
                </span>
              </li>
              <li>
                <strong style={{ fontWeight: 500 }}>Retrieval first</strong>{" "}
                <span style={{ color: "var(--color-gray-11)" }}>
                  — saved work returns when you&rsquo;re working, not when you
                  search.
                </span>
              </li>
              <li>
                <strong style={{ fontWeight: 500 }}>Designed in code</strong>{" "}
                <span style={{ color: "var(--color-gray-11)" }}>
                  — every interaction shipped as it was sketched.
                </span>
              </li>
              <li>
                <strong style={{ fontWeight: 500 }}>Solo build</strong>{" "}
                <span style={{ color: "var(--color-gray-11)" }}>
                  — design, system, and code in one pair of hands.
                </span>
              </li>
            </ul>
          </div>
        </div>

        <div
          aria-label="Stash preview (placeholder)"
          style={{
            background:
              "linear-gradient(135deg, var(--color-gray-2), var(--color-gray-4))",
            border: "1px solid var(--color-gray-5)",
            borderRadius: "var(--radius-2)",
            display: "grid",
            placeItems: "center",
            color: "var(--color-gray-9)",
            fontFamily: "var(--font-mono)",
            fontSize: "var(--fs-12)",
            letterSpacing: "0.18em",
            textTransform: "uppercase",
            minHeight: 0,
          }}
        >
          Preview · TBD
        </div>
      </div>

      <div className="clip-line" style={{ flexShrink: 0 }}>
        <div
          style={{
            display: "flex",
            gap: "var(--space-3)",
            flexWrap: "wrap",
            alignItems: "center",
            marginTop: "var(--space-2)",
          }}
        >
          <a
            href="mailto:ryan.runsheng@gmail.com?subject=Stash%20%E2%80%94%20early%20access"
            className="btn"
          >
            Get early access →
          </a>
          <span
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: "var(--fs-12)",
              letterSpacing: "0.18em",
              textTransform: "uppercase",
              color: "var(--color-gray-11)",
            }}
          >
            {entry?.buildMeta?.framework ??
              "macOS native · Retrieval-augmented"}
          </span>
        </div>
      </div>
    </>
  );
}

/* ─── Card body: Work slot (placeholder) ────────────────────────────── */

function WorkSlotBody({ label }: { label: string }) {
  return (
    <>
      <div
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          gap: "var(--space-3)",
        }}
      >
        <h2
          className="clip-line"
          style={{
            fontSize: "clamp(28px, 3.4vw, 48px)",
            lineHeight: 1.1,
            fontWeight: 500,
            letterSpacing: "-0.02em",
            color: "var(--color-gray-12)",
            margin: 0,
          }}
        >
          <span>Reserved for strategic work.</span>
        </h2>
        <p
          className="clip-line"
          style={{
            fontSize: "clamp(15px, 1.3vw, 18px)",
            lineHeight: 1.5,
            color: "var(--color-gray-11)",
            margin: 0,
            maxWidth: "56ch",
          }}
        >
          <span>
            This slot is held for an AI/system or award-winning industrial
            design project — the kind that earns its place beside{" "}
            <em>Stash</em>.
          </span>
        </p>
      </div>
      <div className="clip-line" style={{ flexShrink: 0 }}>
        <div
          style={{
            fontFamily: "var(--font-mono)",
            fontSize: "var(--fs-12)",
            letterSpacing: "0.18em",
            textTransform: "uppercase",
            color: "var(--color-gray-9)",
          }}
        >
          {label} · Awaiting promotion from study tier
        </div>
      </div>
    </>
  );
}

/* ─── Card body: Contact ────────────────────────────────────────────── */

function ContactBody() {
  return (
    <>
      <div
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          gap: "var(--space-4)",
        }}
      >
        <h2
          className="clip-line"
          style={{
            fontSize: "clamp(40px, 5.2vw, 80px)",
            lineHeight: 1.05,
            fontWeight: 500,
            letterSpacing: "-0.04em",
            color: "var(--color-gray-12)",
            margin: 0,
            maxWidth: "20ch",
          }}
        >
          <span>
            Working on something <em>AI-native</em>?
          </span>
        </h2>
        <p
          className="clip-line"
          style={{
            fontSize: "clamp(16px, 1.5vw, 20px)",
            lineHeight: 1.45,
            color: "var(--color-gray-11)",
            margin: 0,
            maxWidth: "48ch",
          }}
        >
          <span>
            Open to design-engineer roles at AI-product teams, and to a small
            number of carefully chosen consulting projects.
          </span>
        </p>
      </div>
      <div className="clip-line" style={{ flexShrink: 0 }}>
        <div
          style={{
            display: "flex",
            gap: "var(--space-3)",
            flexWrap: "wrap",
          }}
        >
          <a href="mailto:ryan.runsheng@gmail.com" className="btn">
            ryan.runsheng@gmail.com
          </a>
          <a
            href="https://github.com/konatobuild"
            target="_blank"
            rel="noreferrer"
            className="btn-ghost"
          >
            GitHub ↗
          </a>
          <Link href="/about" className="btn-ghost">
            About →
          </Link>
        </div>
      </div>
    </>
  );
}
