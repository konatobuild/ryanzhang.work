import type { Metadata } from "next";
import type { CSSProperties } from "react";
import Image from "next/image";
import { Space_Grotesk, JetBrains_Mono } from "next/font/google";
import {
  Hero,
  Context,
  Approach,
  BottomNav,
  type DesignDecision,
} from "@/components/case-study";
import { MetaLabel } from "@/components/ui/MetaLabel";

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-case-saas-landing-display",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["400"],
  variable: "--font-case-saas-landing-mono",
});

export const metadata: Metadata = {
  title: "LATTICE — Ryan Zhang",
  description:
    "A landing page for an imagined runtime control plane for production AI agents.",
};

const decisions: DesignDecision[] = [
  {
    title: "Signal, Noise.",
    body: "The headline splits the product's claim into two words — SIGNAL holds still, NOISE blurs — letting the page argue typographically before any copy takes over.",
  },
  {
    title: "Live background as diagram.",
    body: "The hero's animated grid isn't decoration; cells oscillate, the cursor pulls them toward the accent, and random cells flare red as anomalies — the product itself, running behind its own marketing.",
  },
  {
    title: "One weight, one accent.",
    body: "Every display heading sits at 400 against a single cyan — the restraint of an editorial spread, not the volume of a SaaS pitch.",
  },
];

// LATTICE "room" palette — kept close to the demo's own atoms so specimens
// don't look translated.
const ACCENT = "#4AC9E4";
const HAIRLINE = "rgba(255,255,255,0.16)";
const INK_SOFT = "rgba(255,255,255,0.78)";
const INK_DIM = "rgba(255,255,255,0.55)";
const DISPLAY_FONT = "var(--font-case-saas-landing-display), sans-serif";
const MONO_FONT = "var(--font-case-saas-landing-mono), monospace";

const monoLabel: CSSProperties = {
  fontFamily: MONO_FONT,
  fontSize: 11,
  letterSpacing: "0.24em",
  textTransform: "uppercase",
  color: INK_DIM,
};

interface TokenEntry {
  label: string;
  value: string;
  note: string;
  visual: React.ReactNode;
}

const tokens: TokenEntry[] = [
  {
    label: "Accent",
    value: "#4AC9E4",
    note: "Reserved for state change — hover glows, status dots, the word 'signal'. Used everywhere, it stops meaning anything.",
    visual: <div style={{ backgroundColor: ACCENT, width: "100%", height: "100%" }} />,
  },
  {
    label: "Canvas",
    value: "#000000",
    note: "Full black. The page reads as a terminal, not a marketing billboard.",
    visual: (
      <div
        style={{
          backgroundColor: "#000",
          width: "100%",
          height: "100%",
          border: `1px solid ${HAIRLINE}`,
          boxSizing: "border-box",
        }}
      />
    ),
  },
  {
    label: "Hairline",
    value: "rgba · 0.16",
    note: "The exact opacity where a divider reads as structural without carrying weight.",
    visual: (
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          width: "100%",
          height: "100%",
        }}
      >
        <div style={{ width: "66%", borderTop: `1px solid ${HAIRLINE}` }} />
      </div>
    ),
  },
  {
    label: "Display face",
    value: "Space Grotesk · 400",
    note: "Every heading stays at weight 400. Editorial register over SaaS shout.",
    visual: (
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          width: "100%",
          height: "100%",
        }}
      >
        <span
          style={{
            fontFamily: DISPLAY_FONT,
            fontWeight: 400,
            fontSize: 36,
            letterSpacing: "-0.03em",
            color: "#fff",
            lineHeight: 1,
          }}
        >
          Signal
        </span>
      </div>
    ),
  },
  {
    label: "Mono label",
    value: "JetBrains · 11px · 0.24em",
    note: "Frames every section as a filed document. Metadata, not copy.",
    visual: (
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          width: "100%",
          height: "100%",
        }}
      >
        <span
          style={{
            ...monoLabel,
            fontSize: 13,
            color: "#fff",
          }}
        >
          02 / Manifesto
        </span>
      </div>
    ),
  },
  {
    label: "Benchmark scale",
    value: "clamp(88, 12vw, 180)",
    note: "The largest type on the page. Numbers speak loudest when they're also the biggest thing.",
    visual: (
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          width: "100%",
          height: "100%",
          overflow: "hidden",
        }}
      >
        <span
          style={{
            fontFamily: DISPLAY_FONT,
            fontWeight: 400,
            fontSize: 44,
            letterSpacing: "-0.05em",
            color: "#fff",
            lineHeight: 1,
          }}
        >
          97.3
          <span style={{ color: ACCENT, fontSize: "0.4em" }}>%</span>
        </span>
      </div>
    ),
  },
];

interface ComponentEntry {
  heading: string;
  caption: string;
}

const components: ComponentEntry[] = [
  {
    heading: "PulseGrid",
    caption:
      "A 60fps field behind the hero. The cursor warps nearby cells toward accent; random cells flare red. The product running behind its own marketing.",
  },
  {
    heading: "SIGNAL, NOISE",
    caption:
      "Two words in opposite visual states. The product's claim, argued typographically before any copy takes over.",
  },
  {
    heading: "Motif canvases",
    caption:
      "Four procedurally-animated vignettes — Trace, Detect, Replay, Intervene. One small machine per step of the pipeline.",
  },
  {
    heading: "PillButton",
    caption:
      "Three variants share geometry; hover alone distinguishes them. Interaction weight scales with intent, not size.",
  },
];

type GalleryLayout = "bleed" | "contained" | "left" | "right";

interface GalleryItem {
  label: string;
  caption: string;
  layout: GalleryLayout;
  aspect: string;
  image?: { src: string; alt: string };
}

const gallery: GalleryItem[] = [
  {
    label: "01 / Hero",
    caption: "The thesis, set in type — against a grid that reacts to the cursor.",
    layout: "bleed",
    aspect: "16 / 9",
  },
  {
    label: "02 / Manifesto",
    caption: "A single claim, filed like an internal paper.",
    layout: "contained",
    aspect: "16 / 10",
  },
  {
    label: "03 / Architecture",
    caption: "Four motifs, one per step. Each paints itself at 60fps.",
    layout: "left",
    aspect: "4 / 5",
  },
  {
    label: "04 / Deploy",
    caption: "Two surfaces, one binary. Procurement clauses in the same font as the manifesto.",
    layout: "right",
    aspect: "4 / 5",
  },
];

export default function SaasLandingCaseStudy() {
  return (
    <div className={`${spaceGrotesk.variable} ${jetbrainsMono.variable}`}>
      <Hero
        title="LATTICE"
        description="A landing page for an imagined runtime control plane for production AI agents."
        meta={{
          role: "Design + engineering",
          timeline: "2026",
          type: "Personal project",
        }}
        liveUrl="https://saas-landing.ryanzhang.work"
      />

      {/* OPENING REVEAL — the first full-bleed mockup, placed immediately
          after the Hero text so visitors hit a visual before any prose.
          Image goes edge-to-edge; label and caption stay padded. */}
      {gallery
        .filter((item) => item.layout === "bleed")
        .map((item) => (
          <section
            key={item.label}
            aria-label="Opening reveal"
            style={{ marginTop: "2rem" }}
          >
            <figure style={{ margin: 0 }}>
              <div className="px-6 md:px-10 mb-4">
                <MetaLabel as="p">{item.label}</MetaLabel>
              </div>
              <div
                style={{
                  position: "relative",
                  width: "100%",
                  aspectRatio: item.aspect,
                  backgroundColor: "#f4f4f4",
                  overflow: "hidden",
                }}
              >
                {item.image ? (
                  <Image
                    src={item.image.src}
                    alt={item.image.alt}
                    fill
                    sizes="100vw"
                    priority
                    className="object-cover"
                  />
                ) : (
                  <div
                    style={{
                      position: "absolute",
                      inset: 0,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <MetaLabel>Mockup placeholder</MetaLabel>
                  </div>
                )}
              </div>
              <figcaption className="px-6 md:px-10 mt-4 max-w-2xl text-[15px] md:text-[17px] leading-relaxed text-[color:var(--color-ink)]/80">
                {item.caption}
              </figcaption>
            </figure>
          </section>
        ))}

      <Context body="LATTICE is a fictional product in the space between AI observability and runtime intervention — an imagined control plane that watches production agents and intercepts them before harm reaches a user. I treated the landing page as an editorial artifact rather than a growth-marketing asset: dense typography, a single accent color, and a live background that performs the product's claim instead of stating it." />

      <Approach decisions={decisions} />

      {/* GALLERY — contained mockups below the fold, with 02 full-width and
          03/04 offset left/right for rhythm. 01 is rendered above, between
          Hero and Context, as the opening reveal. */}
      <section
        aria-label="Gallery"
        style={{ marginTop: "6rem" }}
      >
        {gallery
          .filter((item) => item.layout !== "bleed")
          .map((item, idx, arr) => {
          const frame = (
            <figure style={{ margin: 0 }}>
              <div className="mb-4">
                <MetaLabel as="p">{item.label}</MetaLabel>
              </div>
              <div
                style={{
                  position: "relative",
                  width: "100%",
                  aspectRatio: item.aspect,
                  backgroundColor: "#f4f4f4",
                  overflow: "hidden",
                }}
              >
                {item.image ? (
                  <Image
                    src={item.image.src}
                    alt={item.image.alt}
                    fill
                    sizes="(min-width: 1200px) 1200px, 100vw"
                    className="object-cover"
                  />
                ) : (
                  <div
                    style={{
                      position: "absolute",
                      inset: 0,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <MetaLabel>Mockup placeholder</MetaLabel>
                  </div>
                )}
              </div>
              <figcaption className="mt-4 max-w-2xl text-[15px] md:text-[17px] leading-relaxed text-[color:var(--color-ink)]/80">
                {item.caption}
              </figcaption>
            </figure>
          );

          const alignment =
            item.layout === "left"
              ? "md:mr-auto md:ml-0"
              : item.layout === "right"
              ? "md:ml-auto md:mr-0"
              : "md:mx-auto";

          const widthClass =
            item.layout === "contained" ? "w-full" : "md:w-2/3 w-full";

          return (
            <div
              key={item.label}
              className="container-page px-6 md:px-10"
              style={{
                marginBottom: idx < arr.length - 1 ? 96 : 0,
              }}
            >
              <div className={`${widthClass} ${alignment}`}>{frame}</div>
            </div>
          );
        })}
      </section>

      {/* INSIDE LATTICE — full-bleed dark room, full of its own design language.
          Entry and exit are marked with small mono labels so viewers feel the
          transition as editorial, not accidental. */}
      <section
        aria-label="Inside LATTICE"
        style={{
          backgroundColor: "#000",
          color: INK_SOFT,
          fontFamily: DISPLAY_FONT,
          marginTop: "6rem",
        }}
      >
        {/* Entry rail */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "32px 40px",
            borderBottom: `1px solid ${HAIRLINE}`,
          }}
        >
          <span style={monoLabel}>Inside LATTICE</span>
          <span style={{ ...monoLabel, color: ACCENT }}>↓</span>
        </div>

        {/* Design system */}
        <div style={{ padding: "120px 40px" }}>
          <div style={{ maxWidth: 1280, margin: "0 auto" }}>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "220px 1fr",
                gap: 64,
                marginBottom: 72,
              }}
            >
              <div style={{ paddingTop: 8 }}>
                <span style={monoLabel}>01 / Design system</span>
              </div>
              <div>
                <h2
                  style={{
                    fontFamily: DISPLAY_FONT,
                    fontWeight: 400,
                    fontSize: "clamp(36px, 4.4vw, 64px)",
                    letterSpacing: "-0.03em",
                    lineHeight: 1.05,
                    color: "#fff",
                    maxWidth: "22ch",
                    margin: 0,
                  }}
                >
                  Six tokens carry most of the visual weight.
                </h2>
              </div>
            </div>

            <div style={{ border: `1px solid ${HAIRLINE}` }}>
              {/* Table header */}
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "200px 180px 240px 1fr",
                  backgroundColor: "#000",
                }}
              >
                {["Form", "Name", "Spec", "Note"].map((h, i) => (
                  <div
                    key={h}
                    style={{
                      padding: "14px 24px",
                      ...monoLabel,
                      fontSize: 10,
                      borderRight:
                        i < 3 ? `1px solid ${HAIRLINE}` : undefined,
                    }}
                  >
                    {h}
                  </div>
                ))}
              </div>

              {/* Data rows */}
              {tokens.map((t) => (
                <article
                  key={t.label}
                  style={{
                    display: "grid",
                    gridTemplateColumns: "200px 180px 240px 1fr",
                    borderTop: `1px solid ${HAIRLINE}`,
                    backgroundColor: "#000",
                  }}
                >
                  <div
                    style={{
                      borderRight: `1px solid ${HAIRLINE}`,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      minHeight: 100,
                      padding: "14px 20px",
                    }}
                  >
                    <div
                      style={{
                        width: "100%",
                        height: 72,
                        overflow: "hidden",
                      }}
                    >
                      {t.visual}
                    </div>
                  </div>
                  <div
                    style={{
                      borderRight: `1px solid ${HAIRLINE}`,
                      padding: "20px 24px",
                      display: "flex",
                      alignItems: "center",
                    }}
                  >
                    <h3
                      style={{
                        fontFamily: DISPLAY_FONT,
                        fontWeight: 400,
                        fontSize: 18,
                        color: "#fff",
                        margin: 0,
                        letterSpacing: "-0.01em",
                      }}
                    >
                      {t.label}
                    </h3>
                  </div>
                  <div
                    style={{
                      borderRight: `1px solid ${HAIRLINE}`,
                      padding: "20px 24px",
                      display: "flex",
                      alignItems: "center",
                    }}
                  >
                    <span
                      style={{
                        ...monoLabel,
                        fontSize: 10,
                        color: INK_SOFT,
                      }}
                    >
                      {t.value}
                    </span>
                  </div>
                  <div
                    style={{
                      padding: "20px 28px",
                      display: "flex",
                      alignItems: "center",
                    }}
                  >
                    <p
                      style={{
                        fontFamily: DISPLAY_FONT,
                        fontSize: 14,
                        lineHeight: 1.55,
                        color: INK_SOFT,
                        margin: 0,
                        maxWidth: "56ch",
                      }}
                    >
                      {t.note}
                    </p>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </div>

        {/* Components */}
        <div
          style={{
            padding: "80px 40px 120px",
            borderTop: `1px solid ${HAIRLINE}`,
          }}
        >
          <div style={{ maxWidth: 1280, margin: "0 auto" }}>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "220px 1fr",
                gap: 64,
                marginBottom: 72,
              }}
            >
              <div style={{ paddingTop: 8 }}>
                <span style={monoLabel}>02 / Components</span>
              </div>
              <div>
                <h2
                  style={{
                    fontFamily: DISPLAY_FONT,
                    fontWeight: 400,
                    fontSize: "clamp(36px, 4.4vw, 64px)",
                    letterSpacing: "-0.03em",
                    lineHeight: 1.05,
                    color: "#fff",
                    maxWidth: "22ch",
                    margin: 0,
                  }}
                >
                  Pieces that make the language concrete.
                </h2>
              </div>
            </div>

            <ol style={{ listStyle: "none", padding: 0, margin: 0 }}>
              {components.map((c, idx) => (
                <li
                  key={c.heading}
                  style={{
                    display: "grid",
                    gridTemplateColumns: "220px 1fr",
                    gap: 64,
                    padding: "36px 0",
                    borderTop:
                      idx === 0 ? `1px solid ${HAIRLINE}` : `1px solid ${HAIRLINE}`,
                  }}
                >
                  <div style={{ paddingTop: 4 }}>
                    <span style={monoLabel}>
                      {String(idx + 1).padStart(2, "0")}
                    </span>
                  </div>
                  <div style={{ maxWidth: 720 }}>
                    <h3
                      style={{
                        fontFamily: DISPLAY_FONT,
                        fontWeight: 400,
                        fontSize: "clamp(22px, 2.2vw, 28px)",
                        letterSpacing: "-0.015em",
                        lineHeight: 1.2,
                        color: "#fff",
                        margin: 0,
                        marginBottom: 14,
                      }}
                    >
                      {c.heading}
                    </h3>
                    <p
                      style={{
                        fontFamily: DISPLAY_FONT,
                        fontSize: 16,
                        lineHeight: 1.6,
                        color: INK_SOFT,
                        margin: 0,
                      }}
                    >
                      {c.caption}
                    </p>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </div>

        {/* Exit rail */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "32px 40px",
            borderTop: `1px solid ${HAIRLINE}`,
          }}
        >
          <span style={{ ...monoLabel, color: ACCENT }}>↑</span>
          <span style={monoLabel}>Out</span>
        </div>
      </section>

      <BottomNav />
    </div>
  );
}
