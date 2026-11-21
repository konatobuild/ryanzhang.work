import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { CONTACT_EMAIL, awards } from "@/lib/work";

export const metadata: Metadata = {
  title: "About",
  description:
    "From industrial design to product interfaces: Ryan Zhang's background, recognition, and how the work fits together.",
};

export default function AboutPage() {
  return (
    <>
      <article className="wrap post">
        <header className="post__row post__head">
          <p className="post__side">About</p>
          <div className="post__main">
            <h1 className="t-xl post__title">
              I started by designing physical objects. Now I also design and
              build software.
            </h1>
            <p className="post__lead">
              I trained as an industrial designer, working on physical objects where every millimetre and tolerance matters. Today I also work as a design engineer, designing software interfaces and building the front-end myself.
            </p>
            <div className="post__actions">
              <a className="btn" href={`mailto:${CONTACT_EMAIL}`}>
                Get in touch →
              </a>
            </div>
          </div>
          <aside className="post__aside">
            <dl className="facts">
              <div>
                <dt>2026</dt>
                <dd>Released Peeko and Digo, two apps for the Mac</dd>
              </div>
              <div>
                <dt>2024 to now</dt>
                <dd>Graduate study, USC Iovine and Young Academy, Los Angeles</dd>
              </div>
              <div>
                <dt>To 2024</dt>
                <dd>SIVA DeTao School of Design, Strategic Design and Innovation, Shanghai</dd>
              </div>
            </dl>
          </aside>
        </header>

        <section className="post__row post__section">
          <div className="post__wide">
            <Image
              src="/ryan-portrait.webp"
              alt="Ryan Zhang, in glasses and a black sweater, looking off to one side"
              width={2000}
              height={1000}
              sizes="(max-width: 980px) 100vw, 972px"
              style={{ width: "100%", height: "auto", borderRadius: 4 }}
              priority
            />
          </div>
        </section>

        <section className="post__row post__section">
          <div className="post__main">
            <h2 className="t-l">How the work has changed</h2>
            <div className="prose">
              <p>Looking back across the physical objects I have made, my way of working has shifted in stages. Early on, design meant finding a clear need and giving it a clear answer, keeping form close to function. Later I began testing how several functions could fold into one simple object, taking work from interviews, surveys and sketches through paper mock-ups, grip models, foam and painted models.</p>
              <p>With CoolDrip, a coffee maker and companion app designed as one product, my thinking moved another step. Alongside function and structure, I started asking what kind of feeling a form carries, and whether that feeling can be part of what an object does. I received eight international design awards for CoolDrip, including Red Dot Design Concept in 2025. After it, a period of heavy 3D printing pushed me to treat the pairing of materials itself as a way to produce function.</p>
            </div>
          </div>
        </section>

        <section className="post__row post__section">
          <div className="post__main">
            <h2 className="t-l">How I work</h2>
            <div className="prose">
              <p>That background left me with one steady habit that now shapes my software work as well. I prefer working in small steps with real things on the table. For physical products that means foam, 3D prints and a painted model before any KeyShot render or Blender animation. For software it means building a running prototype early and judging it in use, adjusting layout, state and motion directly in code instead of waiting on a handoff.</p>
              <p>I work with Swift for Mac and iPhone, and Next.js, React, TypeScript, Tailwind, HTML, CSS and Figma for the web and interfaces. In 2026 I released Peeko and Digo for the Mac, two of four apps of my own, and I have designed and built six websites. Across objects, interfaces and brand systems such as OFX, the order stays the same. Build a real version early and judge it in use.</p>
            </div>
            <p style={{ marginTop: 16 }}>
              <Link className="link" href="/work/making">
                Models, builds and drawing →
              </Link>
            </p>
          </div>
        </section>

        <section className="post__row post__section" style={{ paddingBottom: "var(--section)" }}>
          <div className="post__main">
            <h2 className="t-l">Recognition</h2>
            <p className="muted" style={{ marginBottom: 16 }}>
              I received all eight for <Link className="inline-link" href="/work/cooldrip">CoolDrip</Link>.
            </p>
            <ul className="cards" style={{ ["--cols" as string]: 1 }}>
              {awards.map((a) => (
                <li key={a.name + a.category} className="card card--s" style={{ minHeight: 0 }}>
                  <h3>
                    {a.name}, {a.level.toLowerCase()}
                  </h3>
                  <p className="t-s muted">
                    {a.category}, {a.year}
                  </p>
                </li>
              ))}
            </ul>
          </div>
        </section>
      </article>
    </>
  );
}
