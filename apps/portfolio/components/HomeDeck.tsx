"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { HeroMorphPoc } from "@/components/HeroMorphPoc";
import {
  InteractionPlate,
  SCREEN_BOUNDS,
} from "@/components/facets/InteractionPlate";

/*
 * HomeDeck — primary surface for the portfolio home page.
 *
 * Same calling-card gesture as the industrial deck (open 1 → 0.78, browse,
 * close 0.78 → 1) and the same decoupled three-phase motion model. The
 * structural change versus the previous home deck (six facet/work cards
 * stacked uniformly) is the borrow of industrial's slot grammar:
 *
 *   - "card"     — Card 01 (identity) and Card N (colophon). Contained,
 *     16:10 white-with-hairline frames. Bookends.
 *   - "cinema"   — slots in between. Pre-sized at 100vw / DECK_SCALE wide
 *     and 100dvh / DECK_SCALE tall in unscaled pixels, so once the deck
 *     settles at DECK_SCALE = 0.78, each cinema slot fills the viewport
 *     exactly. The "specimen" variant is light-ground and centers a
 *     contained device (Pro Display XDR) carrying the calibrating reel.
 *     The "pair" variant is light-ground and splits into two halves for
 *     side-by-side component specimens.
 *
 * Why borrow industrial's grammar here: industrial's big/pair rhythm is
 * the Phaidon-monograph editorial cadence (hero plate → catalog spread →
 * hero plate → catalog spread). On home it serves the same role one
 * register down — the macOS specimen acts as the establishing "hero
 * plate" and each subsequent pair carries two component specimens that
 * stand on their own (no project framing, no case-study link).
 *
 * Phase A and Phase C ramp scale alone, with translate solved each frame
 * to hold the focal card visually stationary; Phase B is pure translate
 * at constant 0.78. See the comment block above tick() for the partition
 * math (identical to IndustrialDeck's derivation — when both decks have
 * settled we can extract this into a shared hook).
 */

const HOME_SCALE = 1;
const DECK_SCALE = 0.78;
const RAMP_PX = 1200;

type SlotMeta =
  | { kind: "card-identity"; anchor: string; label: string }
  | {
      /** Light-ground hero plate that centers the Pro Display XDR mockup
       *  with the InteractionReel inside its screen bounds. Same outer
       *  geometry as industrial's cinema-big (100vw × 100dvh post-scale)
       *  but with a contained device instead of full-bleed photography. */
      kind: "cinema-specimen";
      anchor: string;
      label: string;
    }
  | {
      /** A single full-viewport card holding a 2×2 grid of specimen video
       *  tiles — small gaps, no dividers, the grid filling the slot so the
       *  recordings carry the screen instead of floating in whitespace. */
      kind: "cinema-grid";
      anchor: string;
      label: string;
      tiles: { src: string; label: string; href: string }[];
    }
  | { kind: "card-colophon"; anchor: string; label: string };

const SLOT_DEFS: SlotMeta[] = [
  { kind: "card-identity", anchor: "01", label: "Home" },
  {
    kind: "cinema-specimen",
    anchor: "02",
    label: "Specimen — Pro Display XDR",
  },
  {
    kind: "cinema-grid",
    anchor: "03",
    label: "Components",
    tiles: [
      {
        src: "/specimens/gridex.mp4",
        label: "Gridex — an agentic workspace you can just watch",
        href: "/lab/gridex",
      },
      {
        src: "/specimens/agent-cursor.mp4",
        label: "A guide cursor that points instead of talking",
        href: "/lab/agent-cursor",
      },
      {
        src: "/specimens/atlas.mp4",
        label: "Atlas — a zoomable file canvas",
        href: "/lab/atlas",
      },
      {
        src: "/specimens/command-palette.mp4",
        label: "An optical command palette with a glass loupe",
        href: "/lab/command-palette",
      },
    ],
  },
  { kind: "card-colophon", anchor: "04", label: "Colophon" },
];

export function HomeDeck() {
  const stageRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const spacerRef = useRef<HTMLDivElement>(null);

  const [activeIndex, setActiveIndex] = useState(0);

  // Three-phase motion model — see the comment above tick() for the full
  // derivation (math is identical to IndustrialDeck.tsx; the two
  // implementations will be unified once both surfaces have stabilised).
  const motionRef = useRef({
    scrollPositions: [] as number[],
    tyAB: 0,
    terminalScrollStart: 0,
    terminalScrollEnd: 0,
    heroCenter: 0,
    terminalCenter: 0,
    halfH: 0,
    dvh: 0,
  });

  useEffect(() => {
    const recalc = () => {
      const track = trackRef.current;
      const spacer = spacerRef.current;
      if (!track || !spacer) return false;

      const slots = track.querySelectorAll<HTMLElement>(".id-deck-slot");
      if (slots.length < 2) return false;

      const dvh = window.innerHeight;
      const halfH = track.scrollHeight / 2;
      const lastIdx = slots.length - 1;

      const cardCenters: number[] = Array.from(slots).map(
        (el) => el.offsetTop + el.offsetHeight / 2,
      );
      const heroCenter = cardCenters[0];
      const terminalCenter = cardCenters[lastIdx];

      // Decoupled scale/translate. Phase A and Phase C hold the focal card
      // visually centered while scale ramps; ty is solved each frame to
      // cancel the scale-induced drift. Phase B is pure translate at
      // constant DECK_SCALE.
      const tyAB =
        dvh / 2 - halfH * (1 - DECK_SCALE) - heroCenter * DECK_SCALE;
      const tyBC =
        dvh / 2 - halfH * (1 - DECK_SCALE) - terminalCenter * DECK_SCALE;
      const phaseBLength = tyAB - tyBC;
      const terminalScrollStart = RAMP_PX + phaseBLength;
      const terminalScrollEnd = terminalScrollStart + RAMP_PX;

      const scrollPositions: number[] = cardCenters.map((center, i) => {
        if (i === 0) return 0;
        if (i === lastIdx) return terminalScrollEnd;
        return RAMP_PX + DECK_SCALE * (center - heroCenter);
      });

      if (scrollPositions[1] <= RAMP_PX) return false;

      motionRef.current.scrollPositions = scrollPositions;
      motionRef.current.tyAB = tyAB;
      motionRef.current.terminalScrollStart = terminalScrollStart;
      motionRef.current.terminalScrollEnd = terminalScrollEnd;
      motionRef.current.heroCenter = heroCenter;
      motionRef.current.terminalCenter = terminalCenter;
      motionRef.current.halfH = halfH;
      motionRef.current.dvh = dvh;

      spacer.style.height = `${terminalScrollEnd + dvh}px`;
      return true;
    };

    // Initial measurement + resilient re-measurement.
    //
    // Root cause this guards against: card slots get their height from the
    // card WIDTH (resolves on first layout), but cinema slots are sized off
    // 100dvh (calc(100dvh / 0.78)). The dynamic viewport height can resolve
    // a beat AFTER first layout, so an early recalc() can "succeed" while the
    // cinema slots are still collapsed — locking in a too-short spacer and
    // scrollPositions that never match the settled layout, leaving the deck
    // stuck in the unscaled fallback (a manual window resize was the only
    // thing that recovered it). recalc() is idempotent, so we re-measure on
    // every signal that layout might have changed and let the last correct
    // measurement win.
    let tryRaf = 0;
    let attempts = 0;
    const MAX_ATTEMPTS = 180;
    const tryRecalc = () => {
      if (recalc() || attempts >= MAX_ATTEMPTS) {
        tryRaf = 0;
        return;
      }
      attempts++;
      tryRaf = requestAnimationFrame(tryRecalc);
    };
    tryRecalc();

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
    window.addEventListener("load", scheduleRecalc);
    let fontsCancelled = false;
    document.fonts?.ready.then(() => {
      if (!fontsCancelled) scheduleRecalc();
    });

    // Timed backstop. setTimeout fires regardless of tab visibility or rAF
    // throttling (unlike the rAF retry and the rAF-wrapped scheduleRecalc),
    // so a correct measurement still lands after dvh settles even if the
    // event-driven paths miss it. Each call re-measures and overwrites; the
    // last one wins once layout is stable.
    const timers = [120, 300, 600, 1000, 1600, 2600].map((ms) =>
      window.setTimeout(recalc, ms),
    );

    return () => {
      if (tryRaf) cancelAnimationFrame(tryRaf);
      if (recalcRaf) cancelAnimationFrame(recalcRaf);
      fontsCancelled = true;
      timers.forEach(clearTimeout);
      ro.disconnect();
      window.removeEventListener("resize", scheduleRecalc);
      window.removeEventListener("load", scheduleRecalc);
    };
  }, []);

  // Three-phase tick — decouples scale from translate so the hero (and
  // terminal) card stays visually stationary during its scale ramp.
  //
  //   sy ∈ [0, RAMP_PX]
  //     Phase A — scale 1 → 0.78, ty solved each frame to hold the hero
  //               centered. Hero shrinks in place.
  //   sy ∈ [RAMP_PX, terminalScrollStart]
  //     Phase B — scale = 0.78 (constant). ty = tyAB - (sy - RAMP_PX).
  //               Pure translate; this is the browse register.
  //   sy ∈ [terminalScrollStart, terminalScrollEnd]
  //     Phase C — scale 0.78 → 1, ty solved to hold the terminal card
  //               centered. Terminal grows in place.
  useEffect(() => {
    let raf = 0;
    const tick = () => {
      const m = motionRef.current;
      const sps = m.scrollPositions;
      const sy = Math.max(window.scrollY, 0);

      let scale: number;
      let ty: number;

      if (sps.length < 2) {
        scale = HOME_SCALE;
        ty = -sy;
      } else if (sy <= RAMP_PX) {
        const t = sy / RAMP_PX;
        const eased = (1 - Math.cos(t * Math.PI)) / 2;
        scale = HOME_SCALE + (DECK_SCALE - HOME_SCALE) * eased;
        ty = m.dvh / 2 - m.halfH * (1 - scale) - m.heroCenter * scale;
      } else if (sy < m.terminalScrollStart) {
        scale = DECK_SCALE;
        ty = m.tyAB - (sy - RAMP_PX);
      } else {
        const t = Math.min((sy - m.terminalScrollStart) / RAMP_PX, 1);
        const eased = (1 - Math.cos(t * Math.PI)) / 2;
        scale = DECK_SCALE + (HOME_SCALE - DECK_SCALE) * eased;
        ty = m.dvh / 2 - m.halfH * (1 - scale) - m.terminalCenter * scale;
      }

      if (trackRef.current) {
        trackRef.current.style.transform =
          `translateX(-50%) translateY(${ty.toFixed(2)}px) ` +
          `scale(${scale.toFixed(4)})`;
      }

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
   * Re-entry replay. Fires on activeIndex change.
   *   - idx 0 (identity)    → per-character cascade (hero entry signature)
   *   - cinema slots        → photo / specimen fade-rise + marker fade
   *   - colophon (last)     → clip-line rise on each colophon line
   */
  const lastReplayedIdxRef = useRef(0);
  useEffect(() => {
    if (activeIndex === lastReplayedIdxRef.current) return;
    lastReplayedIdxRef.current = activeIndex;

    const slots =
      trackRef.current?.querySelectorAll<HTMLElement>(".id-deck-slot");
    if (!slots) return;
    const slot = slots[activeIndex];
    if (!slot) return;

    if (activeIndex === 0) {
      const heroLines = slot.querySelectorAll<HTMLElement>(".hero-line");
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
      const rule = slot.querySelector<HTMLElement>(".hero-rule");
      if (rule) {
        rule.getAnimations().forEach((a) => a.cancel());
        rule.animate(
          [{ transform: "scaleX(0)" }, { transform: "scaleX(1)" }],
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

    if (slot.dataset.kind === "cinema") {
      const photos = slot.querySelectorAll<HTMLElement>(".id-cinema__photo");
      photos.forEach((photo) => {
        photo.getAnimations().forEach((a) => a.cancel());
        photo.animate(
          [
            { transform: "translateY(12px)", opacity: 0 },
            { transform: "translateY(0)", opacity: 1 },
          ],
          {
            duration: 900,
            easing: "cubic-bezier(0.2, 0.8, 0.2, 1)",
            fill: "both",
            composite: "add",
          },
        );
      });
      const markers = slot.querySelectorAll<HTMLElement>(".id-cinema__marker");
      markers.forEach((marker, i) => {
        marker.getAnimations().forEach((a) => a.cancel());
        marker.animate([{ opacity: 0 }, { opacity: 1 }], {
          duration: 600,
          delay: 300 + i * 80,
          easing: "cubic-bezier(0.2, 0.8, 0.2, 1)",
          fill: "both",
        });
      });
      return;
    }

    const lines = slot.querySelectorAll<HTMLElement>(".clip-line > *");
    if (lines.length === 0) return;
    lines.forEach((el, i) => {
      el.getAnimations().forEach((a) => a.cancel());
      el.animate(
        [{ transform: "translateY(110%)" }, { transform: "translateY(0)" }],
        {
          duration: 800,
          delay: i * 80,
          easing: "cubic-bezier(0.2, 0.8, 0.2, 1)",
          fill: "both",
        },
      );
    });
  }, [activeIndex]);

  const scrollToIndex = (index: number) => {
    const sps = motionRef.current.scrollPositions;
    const target = sps[index];
    if (target === undefined) return;
    window.scrollTo({ top: target, behavior: "smooth" });
  };

  return (
    <>
      <div ref={spacerRef} className="id-deck-spacer" aria-hidden="true" />

      <div ref={stageRef} className="id-deck-stage home-deck-stage">
        <HomeDeckChrome
          activeIndex={activeIndex}
          total={SLOT_DEFS.length}
          onJumpToIndex={scrollToIndex}
        />

        <div ref={trackRef} className="id-deck-track">
          {SLOT_DEFS.map((meta, i) => {
            const isCinema =
              meta.kind === "cinema-specimen" || meta.kind === "cinema-grid";
            return (
              <article
                key={meta.anchor}
                data-slot-index={i}
                data-kind={isCinema ? "cinema" : "card"}
                data-anchor={meta.anchor}
                className={`id-deck-slot id-deck-slot--${
                  meta.kind === "cinema-specimen" ? "cinema-big" : meta.kind
                }`}
                aria-label={meta.label}
              >
                {meta.kind === "card-identity" && <IdentityBody />}
                {meta.kind === "cinema-specimen" && <MacSpecimen />}
                {meta.kind === "cinema-grid" && (
                  <CinemaGrid tiles={meta.tiles} />
                )}
                {meta.kind === "card-colophon" && <ContactBody />}
              </article>
            );
          })}
        </div>

        <HomeDeckProgress
          count={SLOT_DEFS.length}
          activeIndex={activeIndex}
          onSelect={scrollToIndex}
        />
      </div>
    </>
  );
}

/* ─── Chrome ────────────────────────────────────────────────────────── */

function HomeDeckChrome({
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

function HomeDeckProgress({
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
            aria-label={`Go to slot ${i + 1}`}
          />
        );
      })}
    </div>
  );
}

/* ─── Card 01 · Identity ────────────────────────────────────────────── */

/*
 * Same .hero-* class lineage as IndustrialDeck's IdentityBody — the type
 * rules, hairline rule, clip-reveal animations, and HeroMorphPoc on the
 * right are shared. Only the manifesto copy differs per surface (home
 * flavor here).
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
          <HeroLine delayMs={0} indent={0} anim="rise">
            Ryan Zhang
          </HeroLine>
        </h1>
        <span className="hero-rule" aria-hidden="true" />
        <p
          className="hero-manifesto"
          aria-label="is a design engineer designing with coding agents, making AI-native interfaces that ship as they’re designed"
        >
          <HeroLine delayMs={900} indent={0} anim="drop">
            is a design engineer
          </HeroLine>
          <HeroLine delayMs={1000} indent={1} anim="drift">
            designing with coding agents
          </HeroLine>
          <HeroLine delayMs={1100} indent={0} anim="drop">
            making AI-native interfaces
          </HeroLine>
          <HeroLine delayMs={1200} indent={1} anim="drift">
            that ship as they’re designed
          </HeroLine>
        </p>
      </div>
      <div className="hero-plate-slot" aria-hidden="true">
        <HeroMorphPoc />
      </div>
    </div>
  );
}

/* ─── Card 02 · macOS specimen (cinema-big variant) ──────────────────── */

/*
 * MacSpecimen — Pro Display XDR mockup centered inside a cinema-big slot,
 * with the InteractionReel looping inside its screen bounds.
 *
 * Establishing plate for the home deck: it carries "what the work looks
 * like at full scale" before the pair grid drills down into individual
 * component specimens. The slot is sized exactly like industrial's
 * cinema-big (100vw × 100dvh post-scale) but the inner wrapper overlays
 * a light ground and contains the device, so the dark cinema-big default
 * background never shows.
 */
function MacSpecimen() {
  return (
    <div className="home-cinema-specimen">
      <div
        className="home-cinema-specimen__device"
        aria-label="Pro Display XDR showing interaction work"
      >
        <InteractionPlate className="home-cinema-specimen__plate" />
        <div
          className="home-cinema-specimen__screen"
          style={{
            left: `${SCREEN_BOUNDS.left * 100}%`,
            top: `${SCREEN_BOUNDS.top * 100}%`,
            width: `${SCREEN_BOUNDS.width * 100}%`,
            height: `${SCREEN_BOUNDS.height * 100}%`,
          }}
        >
          <InteractionReel />
        </div>
      </div>
      <span className="id-cinema__marker">Specimen</span>
    </div>
  );
}

/* ─── Card 03 · Component grid ──────────────────────────────────────── */

/*
 * A 2×2 grid of specimen video tiles filling the slot. No dividers — small
 * gaps separate the tiles — and only a slim outer margin, so the four
 * recordings carry the screen instead of floating in whitespace. Each tile
 * is a rounded card; the deck's own ground shows through the gaps. Tiles
 * are landscape (the slot is ~viewport-shaped, halved on each axis), which
 * is the framing the recordings are cut for.
 */
function CinemaGrid({
  tiles,
}: {
  tiles: { src: string; label: string; href: string }[];
}) {
  return (
    <div className="id-cinema id-cinema-grid-wrap">
      <div className="id-cinema-grid">
        {tiles.map((tile) => (
          <Link
            key={tile.href}
            href={tile.href}
            className="id-cinema-grid__cell"
            aria-label={tile.label}
          >
            <VideoReel src={tile.src} label={tile.label} />
          </Link>
        ))}
      </div>
    </div>
  );
}

/* ─── Card N · Colophon (closing calling card) ──────────────────────── */

/*
 * Book-style colophon. Eyebrow flush top-left, vast empty middle, flush-
 * left cluster of signature lines at the bottom. Uses the shared
 * .facet-colophon classes so the visual register matches the rest of
 * the deck's print discipline.
 */
function ContactBody() {
  return (
    <div className="facet-colophon">
      <span className="facet-eyebrow clip-line">
        <span>Colophon</span>
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

/* ─── Interaction reel — looping clip inside the Pro Display XDR screen ─
 *
 * Respects prefers-reduced-motion: when the user has reduced-motion set,
 * the video pauses on its first frame and never starts. JS — not the
 * `autoplay` HTML attribute — drives playback so we can react to runtime
 * preference changes (OS-level toggle while the page is open).
 */
/** A muted, looping video reel that fills its (relatively-positioned)
 *  parent. Pauses on the first frame under prefers-reduced-motion. Used
 *  for the XDR specimen (drag-electron) and the component-pair specimen
 *  recordings — pre-rendered so they never compete with the deck's scroll
 *  animation for frame budget. */
function VideoReel({
  src,
  label,
  objectFit = "cover",
}: {
  src: string;
  label: string;
  objectFit?: "cover" | "contain";
}) {
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
    <div style={{ position: "absolute", inset: 0, background: "#000" }}>
      <video
        ref={videoRef}
        src={src}
        muted
        loop
        playsInline
        preload="auto"
        aria-label={label}
        style={{
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
          objectFit,
        }}
      />
    </div>
  );
}

function InteractionReel() {
  return (
    <VideoReel src="/interaction/drag-electron.mp4" label="Drag interaction" />
  );
}
