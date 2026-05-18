"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";

/*
 * IndustrialDeck — primary surface for /industrial-design.
 *
 * Mirror of VerticalDeck's full motion model: fixed stage, scroll-as-
 * scrubber, track translateY tied to scrollY, AND the calling-card
 * scale ramp (1 → 0.78 → 1) that opens and closes the deck. The same
 * "calling card opens, browse, closes" gesture as the home page; the
 * shared signature is the point.
 *
 * The only difference is slot composition. Slots come in two kinds:
 *   - "card"   — Card 01 (identity) and Card 07 (colophon). Same
 *     contained 16:10 white-with-hairline frame as home's hero/terminal
 *     cards. Bookends.
 *   - "cinema" — slots 02–06. Pre-sized at 100vw/DECK_SCALE wide and
 *     100dvh/DECK_SCALE tall in unscaled pixels, so once the deck
 *     settles at the browse scale (DECK_SCALE = 0.78), each cinema slot
 *     fills the viewport exactly. Reserved for product photography.
 *
 * The bookend / cinema rhythm is what TE / Naoto Fukasawa monographs
 * do: editor's voice (cards) frames the work; the work itself (cinema)
 * takes the page edge-to-edge in between.
 */

// Same ramp model as VerticalDeck. Calling card opens 1 → DECK_SCALE on
// entry; the browse register holds DECK_SCALE; the terminal card closes
// DECK_SCALE → 1. RAMP_PX is the scroll distance for each ramp; symmetric
// so open and close feel matched.
const HOME_SCALE = 1;
const DECK_SCALE = 0.78;
const RAMP_PX = 1200;

/*
 * Slot kinds. Two cinema variants alternate through the middle:
 *
 *   - "cinema-big"  full-bleed single hero plate, dark ground. Mood,
 *     drama, single product. The "atmospheric" beat.
 *   - "cinema-pair" full-bleed split-into-two plates, light ground.
 *     Catalog beat — two products / variants side-by-side, like
 *     teenage.engineering's product-grid sections that follow each
 *     hero. The "detail" beat.
 *
 * The rhythm big → pair → big → pair → big mirrors TE's homepage
 * cadence (hero → product cards → hero → product cards), which is
 * itself a translation of the ID monograph editorial rhythm onto web.
 * Cinema slots butt up edge-to-edge with a 1px hairline divider; only
 * the card↔cinema boundary keeps stage-gray breathing space.
 */
/** One half of a cinema-pair slot. Image is optional so an unfinished
 *  pair shows a placeholder marker on one side and a real plate on the
 *  other without forcing a schema-level mismatch. */
type HalfPlate = {
  number: number;
  imageSrc?: string;
  imageAlt?: string;
};

type SlotMeta =
  | { kind: "card-identity"; anchor: string; label: string }
  | {
      kind: "cinema-big";
      anchor: string;
      label: string;
      plateNumber: number;
      /** Optional full-bleed photo. When absent, the slot renders as a
       *  dark placeholder with only the ordinal marker. */
      imageSrc?: string;
      imageAlt?: string;
      /** Per-plate cover-scale boost. Stacks on top of `object-fit:
       *  cover` to crop more aggressively (default 1 = no extra crop).
       *  Use values 1.05–1.4 when the source has margins that should
       *  be trimmed; uniform symmetric crop on all four edges. */
      imageZoom?: number;
      /** Image band height as a percentage of slot height (0–100).
       *  Default 100 = the image fills the slot (cover, full-bleed).
       *  Setting e.g. 70 makes the image a horizontal band that
       *  occupies 70% of the slot height, centered vertically, with
       *  the slot's own dark ground showing above and below. Editorial
       *  letterbox — useful when the source's natural composition is
       *  wider than tall and looks better as a strip than as a
       *  full-bleed hero. */
      imageHeight?: number;
    }
  | {
      kind: "cinema-pair";
      anchor: string;
      label: string;
      plates: [HalfPlate, HalfPlate];
    }
  | { kind: "card-colophon"; anchor: string; label: string };

const SLOT_DEFS: SlotMeta[] = [
  { kind: "card-identity", anchor: "01", label: "Industrial Design" },
  {
    kind: "cinema-big",
    anchor: "02",
    label: "Plate 01",
    plateNumber: 1,
    imageSrc: "/industrial/plate-01.png",
    imageAlt: "Pour-over coffee set on burgundy ground — product hero",
  },
  {
    kind: "cinema-pair",
    anchor: "03",
    label: "Plates 02–03",
    plates: [
      {
        number: 2,
        imageSrc: "/industrial/plate-02.png",
        imageAlt: "Translucent rain-shell backpack worn — product detail",
      },
      {
        number: 3,
        imageSrc: "/industrial/plate-03.png",
        imageAlt: "Phone mounted on articulated handheld grip — product detail",
      },
    ],
  },
  {
    kind: "cinema-big",
    anchor: "04",
    label: "Plate 04",
    plateNumber: 4,
    imageSrc: "/industrial/plate-04.jpg",
    imageAlt: "UNLEASH custom 3D-printed sports insole — concept layout",
  },
  {
    kind: "cinema-big",
    anchor: "05",
    label: "Plate 05",
    plateNumber: 5,
    imageSrc: "/industrial/plate-05.jpg",
    imageAlt: "Pour-over set on café table — atmospheric product still",
  },
  {
    kind: "cinema-big",
    anchor: "06",
    label: "Plate 06",
    plateNumber: 6,
    imageSrc: "/industrial/plate-06.jpg",
    imageAlt: "Mechanical keyboard on liquid-glass surface",
  },
  {
    kind: "cinema-pair",
    anchor: "07",
    label: "Plates 07–08",
    plates: [{ number: 7 }, { number: 8 }],
  },
  {
    kind: "cinema-big",
    anchor: "08",
    label: "Plate 09",
    plateNumber: 9,
  },
  {
    kind: "cinema-pair",
    anchor: "09",
    label: "Plates 10–11",
    plates: [{ number: 10 }, { number: 11 }],
  },
  { kind: "card-colophon", anchor: "10", label: "Inquiry" },
];

export function IndustrialDeck() {
  const stageRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const spacerRef = useRef<HTMLDivElement>(null);

  const [activeIndex, setActiveIndex] = useState(0);

  // Per-slot scroll target: scale at landing matches the ramp state at
  // that scroll position (HOME_SCALE for bookends, DECK_SCALE for middle).
  // Derivation in VerticalDeck — same here.
  const motionRef = useRef({ scrollPositions: [] as number[] });

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
      const scrollPositions: number[] = [];
      slots.forEach((s, i) => {
        if (i === 0) {
          scrollPositions.push(0);
          return;
        }
        // Last slot (Card 07) lands at HOME_SCALE; middle (cinema) slots
        // land at DECK_SCALE. Cinema slots are pre-sized so they fit
        // exactly viewport at DECK_SCALE.
        const s_scale = i === lastIdx ? HOME_SCALE : DECK_SCALE;
        const center = s.offsetTop + s.offsetHeight / 2;
        const sy = halfH * (1 - s_scale) + s_scale * center - dvh / 2;
        scrollPositions.push(sy);
      });

      if (scrollPositions[1] <= 0) return false;

      motionRef.current.scrollPositions = scrollPositions;
      const totalScroll = scrollPositions[scrollPositions.length - 1];
      spacer.style.height = `${totalScroll + dvh}px`;
      return true;
    };

    let attempts = 0;
    const tryRecalc = () => {
      if (recalc() || attempts >= 10) return;
      attempts++;
      requestAnimationFrame(tryRecalc);
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
    return () => {
      if (recalcRaf) cancelAnimationFrame(recalcRaf);
      ro.disconnect();
      window.removeEventListener("resize", scheduleRecalc);
    };
  }, []);

  // Three-phase scale model — identical to VerticalDeck. Opens at 1
  // (Card 01 calling card), ramps to 0.78 over the first RAMP_PX of
  // scroll, sustains through the cinema browse zone, ramps back to 1
  // over the last RAMP_PX (Card 07 calling card closes).
  useEffect(() => {
    let raf = 0;
    const tick = () => {
      const sps = motionRef.current.scrollPositions;
      const sy = window.scrollY;

      let scale = HOME_SCALE;
      if (sps.length > 1) {
        const terminalEnd = sps[sps.length - 1];
        const terminalStart = terminalEnd - RAMP_PX;
        if (sy >= terminalStart) {
          const t = Math.min((sy - terminalStart) / RAMP_PX, 1);
          const eased = (1 - Math.cos(t * Math.PI)) / 2;
          scale = DECK_SCALE + (HOME_SCALE - DECK_SCALE) * eased;
        } else if (sy > 0) {
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
   * Re-entry text replay. Fires on activeIndex change.
   *   - idx 0 (identity)   → per-character cascade like home hero
   *   - cinema slots       → no replay; image speaks
   *   - colophon (last)    → standard clip-line rise
   */
  const lastReplayedIdxRef = useRef(0);
  useEffect(() => {
    if (activeIndex === lastReplayedIdxRef.current) return;
    lastReplayedIdxRef.current = activeIndex;

    const slots = trackRef.current?.querySelectorAll<HTMLElement>(".id-deck-slot");
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

    if (slot.dataset.kind === "cinema") return;

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

      <div ref={stageRef} className="id-deck-stage">
        <IDDeckChrome
          activeIndex={activeIndex}
          total={SLOT_DEFS.length}
          onJumpToIndex={scrollToIndex}
        />

        <div ref={trackRef} className="id-deck-track">
          {SLOT_DEFS.map((meta, i) => {
            const isCinema =
              meta.kind === "cinema-big" || meta.kind === "cinema-pair";
            return (
              <article
                key={meta.anchor}
                data-slot-index={i}
                data-kind={isCinema ? "cinema" : "card"}
                data-anchor={meta.anchor}
                className={`id-deck-slot id-deck-slot--${meta.kind}`}
                aria-label={meta.label}
              >
                {meta.kind === "card-identity" && <IdentityBody />}
                {meta.kind === "cinema-big" && (
                  <CinemaBigPlaceholder
                    plateNumber={meta.plateNumber}
                    imageSrc={meta.imageSrc}
                    imageAlt={meta.imageAlt}
                    imageZoom={meta.imageZoom}
                  />
                )}
                {meta.kind === "cinema-pair" && (
                  <CinemaPairPlaceholder plates={meta.plates} />
                )}
                {meta.kind === "card-colophon" && <ColophonBody />}
              </article>
            );
          })}
        </div>

        <IDDeckProgress
          count={SLOT_DEFS.length}
          activeIndex={activeIndex}
          onSelect={scrollToIndex}
        />
      </div>
    </>
  );
}

/* ─── Chrome ────────────────────────────────────────────────────────── */

function IDDeckChrome({
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

function IDDeckProgress({
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
 * Mirrors home's IdentityBody hero-text layout — same .hero-* classes
 * so the type rules, hairline rule, and clip-reveal animations in
 * globals.css pick this up without duplication. ID-flavored copy. No
 * right-side plate (HeroMorphPoc is the AI-builder signature; doesn't
 * belong on the ID surface). The text block sits on its own — left-
 * weighted print composition.
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
    <div className="hero-layout id-hero-layout">
      <div className="hero-text">
        <h1 className="hero-name" aria-label="Ryan Zhang">
          <HeroLine delayMs={0} indent={0} anim="rise">Ryan Zhang</HeroLine>
        </h1>
        <span className="hero-rule" aria-hidden="true" />
        <p
          className="hero-manifesto"
          aria-label="trained as an industrial designer, drawing objects before screens, designing consumer products recognized internationally"
        >
          <HeroLine delayMs={900} indent={0} anim="drop">
            trained as an industrial designer
          </HeroLine>
          <HeroLine delayMs={1000} indent={1} anim="drift">
            drawing objects before screens
          </HeroLine>
          <HeroLine delayMs={1100} indent={0} anim="drop">
            designing consumer products
          </HeroLine>
          <HeroLine delayMs={1200} indent={1} anim="drift">
            recognized internationally
          </HeroLine>
        </p>
      </div>
    </div>
  );
}

/* ─── Cinema placeholders ───────────────────────────────────────────── */

/*
 * Empty plates. Hold the slot in the deck flow at 100vw × 100dvh so the
 * eventual product photography can later occupy these footprints exactly.
 * No fake image, no fake caption — placeholders that pretend to be content
 * trick the eye into thinking the page is more done than it is.
 *
 * Marker text is deliberately minimal: just a two-digit ordinal at the
 * bottom corner. Layout will eventually carry its own captions; the
 * placeholder marker is only a wayfinding device for the author.
 */
function CinemaBigPlaceholder({
  plateNumber,
  imageSrc,
  imageAlt,
  imageZoom,
}: {
  plateNumber: number;
  imageSrc?: string;
  imageAlt?: string;
  imageZoom?: number;
}) {
  const num = String(plateNumber).padStart(2, "0");
  // imageZoom stacks on object-fit: cover. Applied as a CSS transform on
  // the <img>; transform-origin defaults to center, so the crop is
  // symmetric on all four edges. Skip the inline style when zoom is the
  // default 1 so the photo stays on the GPU's identity transform path.
  const photoStyle =
    imageZoom && imageZoom !== 1
      ? { transform: `scale(${imageZoom})` }
      : undefined;
  return (
    <div className="id-cinema id-cinema--big">
      {imageSrc && (
        <Image
          className="id-cinema__photo"
          src={imageSrc}
          alt={imageAlt ?? ""}
          fill
          priority={false}
          sizes="100vw"
          style={photoStyle}
        />
      )}
      <span className="id-cinema__marker">{num}</span>
    </div>
  );
}

function CinemaPairPlaceholder({
  plates,
}: {
  plates: [HalfPlate, HalfPlate];
}) {
  return (
    <div className="id-cinema id-cinema--pair">
      {plates.map((plate, i) => (
        <div key={i} className="id-cinema__half">
          {plate.imageSrc && (
            <Image
              className="id-cinema__photo"
              src={plate.imageSrc}
              alt={plate.imageAlt ?? ""}
              fill
              sizes="50vw"
            />
          )}
          <span className="id-cinema__marker">
            {String(plate.number).padStart(2, "0")}
          </span>
        </div>
      ))}
    </div>
  );
}

/* ─── Card 07 · Colophon (inquiry) ──────────────────────────────────── */

/*
 * Closing calling card. Same contained 16:10 white frame as Card 01;
 * book-colophon convention — small, dense, lower-left, signature-like.
 * Mirrors home ContactBody composition; ID-flavored copy.
 */
function ColophonBody() {
  return (
    <div className="facet-colophon">
      <span className="facet-eyebrow clip-line">
        <span>
          10
          <span className="facet-eyebrow__separator">·</span>
          Colophon
        </span>
      </span>

      <div className="facet-colophon__block">
        <p className="facet-colophon__line clip-line">
          <span>Selected industrial design work by Ryan Zhang.</span>
        </p>
        <p className="facet-colophon__line clip-line">
          <span>
            Recognized by Red Dot, MUSE, NY Product, and London Design Awards.
          </span>
        </p>
        <p className="facet-colophon__line clip-line">
          <span>Available for product briefs and collaborations.</span>
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
