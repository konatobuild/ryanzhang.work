import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { WorkCards } from "@/components/site/Cards";
import { Recognition } from "@/components/site/Recognition";
import { Plate, Stage } from "@/components/site/Stage";
import { CONTACT_EMAIL, caseStudies, objects } from "@/lib/work";

// Canonical URL is the subdomain: industrial.ryanzhang.work serves this
// page as its root, and ryanzhang.work/industrial-design 308s there (see
// next.config.ts).
export const metadata: Metadata = {
  title: "Industrial design",
  description:
    "Industrial design by Ryan Zhang: consumer products taken from interviews to painted models, including CoolDrip.",
  alternates: { canonical: "https://industrial.ryanzhang.work" },
  openGraph: {
    type: "website",
    url: "https://industrial.ryanzhang.work",
    title: "Industrial design — Ryan Zhang",
    description:
      "Consumer products taken from interviews to painted models, including CoolDrip.",
    images: ["/work/cooldrip/hero.webp"],
  },
};

const STEPS = [
  ["Research", "Interviews, journey maps and surveys before any sketch."],
  ["Testing", "Mock-ups and grip models put in people's hands."],
  ["Making", "Foam, 3D prints and paint, putting a model on the bench before any render."],
];

export default function IndustrialDesignPage() {
  const c = caseStudies.cooldrip;
  const hero = c.images[c.hero];
  return (
    <>
      <section className="wrap hero">
        <p className="t-s hero__eyebrow">Industrial design</p>
        <h1 className="t-h1 duo hero__title">
          Objects made for the hand
          <span>Taken from interviews and sketches to a painted model on the bench.</span>
        </h1>
        <div className="hero__actions">
          <Link className="btn" href="/work/cooldrip">
            Read about CoolDrip →
          </Link>
        </div>
        <Stage paint="trouville" className="stage--hero hero__stage" priority>
          <Plate className="plate--wide" label={<p className="muted">CoolDrip, brewing unit and carafe</p>}>
            <Image
              src={`/work/cooldrip/${c.hero}`}
              alt={hero.alt}
              width={hero.w}
              height={hero.h}
              sizes="(max-width: 860px) 100vw, 1080px"
              priority
            />
          </Plate>
        </Stage>
      </section>

      <Recognition />

      <section className="wrap section">
        <div className="section__head">
          <h2 className="t-l duo">
            Nine projects
            <span>2021 to 2026. Some come with an app; the label says which.</span>
          </h2>
        </div>
        <WorkCards items={objects} />
      </section>



      <section className="wrap section">
        <div className="section__head">
          <h2 className="t-l duo">
            How a project runs
            <span>The same three habits every time.</span>
          </h2>
        </div>
        <ul className="cards">
          {STEPS.map(([title, text]) => (
            <li key={title} className="card card--s">
              <h3>{title}</h3>
              <p className="muted">{text}</p>
            </li>
          ))}
        </ul>
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
