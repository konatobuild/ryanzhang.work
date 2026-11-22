import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Plate, Stage } from "@/components/site/Stage";
import { CASE_BACKDROP, CONTACT_EMAIL, caseStudies, keyboards } from "@/lib/work";

export const metadata: Metadata = {
  title: "Keyboards",
  description:
    "Mechanical keyboards by Ryan Zhang: cases drawn, laser-cut, 3D printed and built since 2021, and a series designed in 2026.",
  openGraph: {
    title: "Keyboards — Ryan Zhang",
    description: "Cases for mechanical keyboards, drawn, cut and printed since 2021.",
    images: ["/work/keyboard-thin-67/full.webp"],
  },
};

/** "Laser-cut acrylic" mid-sentence; "3D printing" keeps its capitals. */
const lower = (t: string) => (/^[A-Z][a-z]/.test(t) ? t[0].toLowerCase() + t.slice(1) : t);

/** Year, how it was made, and whether it exists, as one quiet line. */
function facts(slug: string) {
  const c = caseStudies[slug];
  if (c.context.includes("A design")) return `${c.year}. A design, not built.`;
  const made = lower(c.tools[c.tools.length - 1]);
  return `${c.year}, ${made}. ${c.context.includes("not built") ? "Drawn, not built." : "Built and used."}`;
}

/**
 * Keyboards — every keyboard, one after another, each a project of its
 * own. The page is built like the panels on the home page: a sentence
 * beside one picture on a painting, alternating sides.
 */
export default function KeyboardsPage() {
  return (
    <>
      <section className="wrap hero" style={{ paddingBottom: 0 }}>
        <p className="t-s hero__eyebrow">
          <Link href="/work">Work</Link> / <Link href="/industrial-design">Industrial design</Link>
        </p>
        <h1 className="t-h1 duo hero__title">
          Keyboards
          <span>Cases for mechanical keyboards, drawn, cut and printed since 2021.</span>
        </h1>
      </section>

      <section className="wrap section" aria-label="The keyboards">
        <div className="panels">
          {keyboards.map((k, i) => {
            const c = caseStudies[k.slug];
            const pic = k.wide;
            return (
              <article key={k.slug} className={i % 2 ? "panel panel--flip" : "panel"}>
                <div className="panel__text">
                  <h2 className="t-l duo">
                    {c.title}
                    <span>{c.subtitle}.</span>
                  </h2>
                  <Link className="link" href={k.href!}>
                    Read about {/^\d/.test(c.title) ? "the " : ""}
                    {c.title} →
                  </Link>
                  <p className="panel__note">{facts(k.slug)}</p>
                </div>
                <Stage paint={CASE_BACKDROP[k.slug]} className="panel__stage panel__stage--upright panel__stage--whole">
                  <Link href={k.href!} aria-label={c.title} tabIndex={-1}>
                    <Plate
                      className="panel__win panel__win--whole"
                      style={{ aspectRatio: `${pic.w} / ${pic.h}` }}
                    >
                      <div className="panel__media">
                        <Image
                          src={pic.src}
                          alt={pic.alt}
                          width={pic.w}
                          height={pic.h}
                          sizes="(max-width: 860px) 100vw, 760px"
                          priority={i === 0}
                        />
                      </div>
                    </Plate>
                  </Link>
                </Stage>
              </article>
            );
          })}
        </div>
      </section>

      <section className="wrap closing">
        <h2 className="t-xxl">Get in touch.</h2>
        <a className="btn" href={`mailto:${CONTACT_EMAIL}`}>
          {CONTACT_EMAIL}
        </a>
      </section>
    </>
  );
}
