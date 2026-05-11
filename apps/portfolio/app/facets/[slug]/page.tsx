import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { facets, getFacet, getCasesForFacet, type FacetSlug } from "@/lib/facets";
import { awards } from "@/lib/awards";

/*
 * Facet detail page — the "personal-essay" expansion of one of the three
 * surface cards on the home VerticalDeck.
 *
 * Structure (mirrors §6.P3 of the plan):
 *   ① Header        — ordinal, English title, Chinese subhead, back link
 *   ② Opener        — first-person paragraph (placeholder until user fills)
 *   ③ Formation     — biographical paragraph
 *   ④ Evidence      — primary cases highlighted + supporting cases listed
 *   ⑤ Side          — awards / influences / external projects / repos / writing
 *   ⑥ Closing       — "what's next" paragraph
 *   ⑦ Other facets  — nav between the three
 *
 * All copy lives in lib/facets.ts; this file is just the layout shell.
 * Placeholders use [待你亲笔填] so the user can grep for unfilled spots.
 */

export function generateStaticParams() {
  return facets.map((f) => ({ slug: f.slug }));
}

export async function generateMetadata(
  { params }: { params: Promise<{ slug: string }> },
): Promise<Metadata> {
  const { slug } = await params;
  const facet = getFacet(slug as FacetSlug);
  if (!facet) return {};
  return {
    title: facet.title,
    description: facet.subhead,
  };
}

export default async function FacetPage(
  { params }: { params: Promise<{ slug: string }> },
) {
  const { slug } = await params;
  const facet = getFacet(slug as FacetSlug);
  if (!facet) notFound();

  const { primary, supporting } = getCasesForFacet(facet.slug);
  const otherFacets = facets.filter((f) => f.slug !== facet.slug);
  const ordinal = String(facet.index).padStart(2, "0");
  const total = String(facet.total).padStart(2, "0");

  // Awards only render under taste-formation for now.
  const facetAwards =
    facet.slug === "taste-formation" ? awards : [];

  return (
    <article
      style={{
        maxWidth: "min(820px, calc(100vw - var(--space-6)))",
        margin: "0 auto",
        padding: "var(--space-9) var(--space-3) var(--space-print)",
        color: "var(--color-gray-12)",
      }}
    >
      {/* ── ① Header ───────────────────────────────────────────────── */}
      <header style={{ marginBottom: "var(--space-9)" }}>
        <div
          style={{
            fontFamily: "var(--font-mono)",
            fontSize: "var(--fs-12)",
            letterSpacing: "0.18em",
            textTransform: "uppercase",
            color: "var(--color-gray-11)",
            marginBottom: "var(--space-4)",
          }}
        >
          {ordinal}{" "}
          <span style={{ color: "var(--color-gray-9)" }}>/ {total}</span>
          {"  ·  Facet"}
        </div>

        <h1
          style={{
            fontSize: "clamp(40px, 5.6vw, 72px)",
            lineHeight: 1.04,
            fontWeight: 400,
            letterSpacing: "-0.035em",
            margin: 0,
            maxWidth: "22ch",
          }}
        >
          {facet.title}
        </h1>

        <p
          style={{
            fontSize: "clamp(20px, 1.9vw, 26px)",
            lineHeight: 1.3,
            fontWeight: 400,
            color: "var(--color-gray-11)",
            margin: "var(--space-3) 0 0",
            maxWidth: "26ch",
          }}
        >
          {facet.titleZh}
        </p>

        <p
          style={{
            fontSize: "clamp(15px, 1.25vw, 17px)",
            lineHeight: 1.55,
            color: "var(--color-gray-11)",
            margin: "var(--space-5) 0 0",
            maxWidth: "52ch",
          }}
        >
          {facet.subhead}
        </p>

        <div
          style={{
            marginTop: "var(--space-6)",
            fontFamily: "var(--font-mono)",
            fontSize: "var(--fs-12)",
            letterSpacing: "0.18em",
            textTransform: "uppercase",
          }}
        >
          <Link
            href="/"
            style={{
              color: "var(--color-gray-11)",
              textDecoration: "none",
              borderBottom: "1px solid var(--color-gray-7)",
              paddingBottom: 2,
            }}
          >
            ← Back home
          </Link>
        </div>
      </header>

      {/* ── ② Opener ───────────────────────────────────────────────── */}
      <ProseSection eyebrow="Opener" body={facet.opener} />

      {/* ── ③ Formation ────────────────────────────────────────────── */}
      <ProseSection eyebrow="Formation" body={facet.formation} />

      {/* ── ④ Project evidence ─────────────────────────────────────── */}
      {(primary.length > 0 || supporting.length > 0) && (
        <section style={sectionStyle}>
          <SectionEyebrow>Evidence</SectionEyebrow>
          {primary.length > 0 && (
            <ul style={primaryListStyle}>
              {primary.map((c) => (
                <li key={c.slug} style={primaryItemStyle}>
                  <h3 style={primaryHeadingStyle}>{c.title}</h3>
                  {c.scenario && (
                    <p style={primaryScenarioStyle}>{c.scenario}</p>
                  )}
                  {c.summary && (
                    <p style={primarySummaryStyle}>{c.summary}</p>
                  )}
                  <p style={primaryNoteStyle}>
                    [待你亲笔填: 在这件事里我具体干了什么 — 一句话]
                  </p>
                </li>
              ))}
            </ul>
          )}
          {supporting.length > 0 && (
            <div style={{ marginTop: "var(--space-6)" }}>
              <p
                style={{
                  fontFamily: "var(--font-mono)",
                  fontSize: "var(--fs-12)",
                  letterSpacing: "0.18em",
                  textTransform: "uppercase",
                  color: "var(--color-gray-11)",
                  margin: "0 0 var(--space-3)",
                }}
              >
                Supporting · {supporting.length} {supporting.length === 1 ? "case" : "cases"}
              </p>
              <ul style={supportingListStyle}>
                {supporting.map((c) => (
                  <li key={c.slug} style={supportingItemStyle}>
                    <span style={{ color: "var(--color-gray-12)" }}>
                      {c.title}
                    </span>
                    {c.scenario && (
                      <span style={{ color: "var(--color-gray-9)" }}>
                        {" "}— {c.scenario}
                      </span>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </section>
      )}

      {/* ── ⑤ Side evidence ────────────────────────────────────────── */}
      {(facet.sideEvidence.length > 0 || facetAwards.length > 0) && (
        <section style={sectionStyle}>
          <SectionEyebrow>Also</SectionEyebrow>
          <ul style={supportingListStyle}>
            {facet.sideEvidence.map((s, i) => (
              <li key={i} style={supportingItemStyle}>
                <span
                  style={{
                    fontFamily: "var(--font-mono)",
                    fontSize: "var(--fs-12)",
                    letterSpacing: "0.18em",
                    textTransform: "uppercase",
                    color: "var(--color-gray-9)",
                    marginRight: "var(--space-2)",
                  }}
                >
                  {s.type.replace("-", " ")}
                </span>
                <span style={{ color: "var(--color-gray-12)" }}>{s.title}</span>
                {s.titleZh && (
                  <span style={{ color: "var(--color-gray-11)" }}>
                    {" · "}{s.titleZh}
                  </span>
                )}
                {s.description && (
                  <p
                    style={{
                      margin: "var(--space-1) 0 0",
                      fontSize: "var(--fs-14)",
                      color: "var(--color-gray-11)",
                      lineHeight: 1.5,
                    }}
                  >
                    {s.description}
                  </p>
                )}
              </li>
            ))}
            {facetAwards.map((a) => (
              <li key={a.slug} style={supportingItemStyle}>
                <span
                  style={{
                    fontFamily: "var(--font-mono)",
                    fontSize: "var(--fs-12)",
                    letterSpacing: "0.18em",
                    textTransform: "uppercase",
                    color: "var(--color-gray-9)",
                    marginRight: "var(--space-2)",
                  }}
                >
                  Award
                </span>
                <span style={{ color: "var(--color-gray-12)" }}>{a.title}</span>
                <span style={{ color: "var(--color-gray-11)" }}>
                  {" · "}{a.year}
                  {a.org && ` · ${a.org}`}
                </span>
              </li>
            ))}
          </ul>
        </section>
      )}

      {/* ── ⑥ Closing ──────────────────────────────────────────────── */}
      <ProseSection eyebrow="Closing" body={facet.closing} />

      {/* ── ⑦ Other facets ─────────────────────────────────────────── */}
      <nav
        style={{
          marginTop: "var(--space-print)",
          paddingTop: "var(--space-6)",
          borderTop: "1px solid var(--color-gray-5)",
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "var(--space-5)",
        }}
        aria-label="Other facets"
      >
        {otherFacets.map((f) => (
          <Link
            key={f.slug}
            href={`/facets/${f.slug}`}
            style={{
              textDecoration: "none",
              color: "var(--color-gray-12)",
              display: "flex",
              flexDirection: "column",
              gap: "var(--space-1)",
            }}
          >
            <span
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: "var(--fs-12)",
                letterSpacing: "0.18em",
                textTransform: "uppercase",
                color: "var(--color-gray-9)",
              }}
            >
              {String(f.index).padStart(2, "0")} / {String(f.total).padStart(2, "0")} · Facet →
            </span>
            <span
              style={{
                fontSize: "clamp(20px, 2vw, 26px)",
                lineHeight: 1.2,
                fontWeight: 400,
                letterSpacing: "-0.02em",
              }}
            >
              {f.title}
            </span>
            <span
              style={{
                fontSize: "var(--fs-14)",
                color: "var(--color-gray-11)",
              }}
            >
              {f.titleZh}
            </span>
          </Link>
        ))}
      </nav>
    </article>
  );
}

/* ─── Subcomponents + shared styles ──────────────────────────────── */

const sectionStyle = {
  marginTop: "var(--space-9)",
} as const;

const primaryListStyle = {
  listStyle: "none",
  padding: 0,
  margin: 0,
  display: "grid",
  gap: "var(--space-6)",
} as const;

const primaryItemStyle = {
  display: "flex",
  flexDirection: "column",
  gap: "var(--space-1)",
} as const;

const primaryHeadingStyle = {
  fontSize: "clamp(24px, 2.4vw, 32px)",
  lineHeight: 1.15,
  fontWeight: 500,
  letterSpacing: "-0.02em",
  margin: 0,
} as const;

const primaryScenarioStyle = {
  fontFamily: "var(--font-mono)",
  fontSize: "var(--fs-12)",
  letterSpacing: "0.18em",
  textTransform: "uppercase",
  color: "var(--color-gray-9)",
  margin: 0,
} as const;

const primarySummaryStyle = {
  fontSize: "var(--fs-16)",
  lineHeight: 1.55,
  color: "var(--color-gray-11)",
  margin: "var(--space-2) 0 0",
  maxWidth: "52ch",
} as const;

const primaryNoteStyle = {
  fontSize: "var(--fs-14)",
  lineHeight: 1.5,
  color: "var(--color-gray-9)",
  fontStyle: "italic",
  margin: "var(--space-2) 0 0",
} as const;

const supportingListStyle = {
  listStyle: "none",
  padding: 0,
  margin: 0,
  display: "grid",
  gap: "var(--space-3)",
  fontSize: "var(--fs-16)",
  lineHeight: 1.5,
} as const;

const supportingItemStyle = {
  paddingLeft: 0,
  borderLeft: "none",
} as const;

function SectionEyebrow({ children }: { children: React.ReactNode }) {
  return (
    <p
      style={{
        fontFamily: "var(--font-mono)",
        fontSize: "var(--fs-12)",
        letterSpacing: "0.18em",
        textTransform: "uppercase",
        color: "var(--color-gray-11)",
        margin: "0 0 var(--space-4)",
      }}
    >
      {children}
    </p>
  );
}

function ProseSection({ eyebrow, body }: { eyebrow: string; body: string }) {
  return (
    <section style={sectionStyle}>
      <SectionEyebrow>{eyebrow}</SectionEyebrow>
      <p
        style={{
          fontSize: "clamp(18px, 1.55vw, 22px)",
          lineHeight: 1.55,
          color: "var(--color-gray-12)",
          margin: 0,
          maxWidth: "52ch",
        }}
      >
        {body}
      </p>
    </section>
  );
}
