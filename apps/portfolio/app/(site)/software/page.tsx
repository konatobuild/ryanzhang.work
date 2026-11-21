import type { Metadata } from "next";
import { AutoVideo } from "@/components/site/AutoVideo";
import { WorkCards } from "@/components/site/Cards";
import { Icons } from "@/components/site/Icons";
import { Plate, Stage } from "@/components/site/Stage";
import { CONTACT_EMAIL, cooldripApp, interfaces, more, products, prototypes, web } from "@/lib/work";

export const metadata: Metadata = {
  title: "Software",
  description:
    "Software and websites by Ryan Zhang: Mac and iPhone apps designed and built end to end, the sites they launch on, working prototypes, and interface design.",
  openGraph: {
    title: "Software — Ryan Zhang",
    description: "Mac and iPhone apps designed and built end to end, plus working prototypes.",
    images: ["/web/peeko/hero.webp"],
  },
};

const HABITS = [
  ["One pair of hands", "I design the product and write the code, so nothing is lost between the two."],
  ["A character as interface", "Peeko and Digo both explain what the software is doing through a character."],
  ["Out in the open", "Each app goes out with its own site and public release."],
];

export default function SoftwarePage() {
  const peeko = products[0];
  const screens = [cooldripApp, ...interfaces];
  return (
    <>
      <section className="wrap hero">
        <p className="t-s hero__eyebrow">Software</p>
        <h1 className="t-h1 duo hero__title">
          Software built to run
          <span>Apps, websites and prototypes I design and build myself.</span>
        </h1>
        <div className="hero__actions">
          <a className="btn" href={peeko.href} target="_blank" rel="noopener noreferrer">
            {peeko.cta}
          </a>
        </div>
        <Stage paint="waterloo" className="stage--hero hero__stage" priority>
          <Plate className="plate--wide" label={<p className="muted">Peeko, launch film</p>}>
            <AutoVideo src={peeko.wide.video!} poster={peeko.wide.src} label={peeko.wide.alt} />
          </Plate>
        </Stage>
      </section>

      <section className="wrap section">
        <div className="section__head">
          <h2 className="t-l duo">
            Products
            <span>Four apps of my own. Three are out; one is on its way.</span>
          </h2>
        </div>
        <WorkCards items={products} />
      </section>

      <section className="wrap section">
        <div className="section__head">
          <h2 className="t-l duo">
            Also in the works
            <span>An editor still in development, and a study of an AI workspace.</span>
          </h2>
        </div>
        <WorkCards items={more} cols={2} motion ratio="16 / 10" />
      </section>

      <section className="wrap section" id="websites">
        <div className="section__head">
          <h2 className="t-l duo">
            Websites
            <span>Six sites, designed and built by me. Each is a recording of the live page.</span>
          </h2>
        </div>
        <WorkCards items={web} cols={3} motion ratio="16 / 10" />
      </section>

      <section className="wrap section" id="icons">
        <div className="section__head">
          <h2 className="t-l duo">
            App icons
            <span>One for each app. Two are built as layers, so the system draws the rest.</span>
          </h2>
        </div>
        <Icons />
      </section>

      <section className="wrap section">
        <div className="section__head">
          <h2 className="t-l duo">
            Prototypes
            <span>Interface ideas built far enough to use, each with a design note.</span>
          </h2>
        </div>
        <WorkCards items={prototypes} cols={3} motion ratio="5 / 4" />
      </section>

      <section className="wrap section">
        <div className="section__head">
          <h2 className="t-l duo">
            Interface design
            <span>Interfaces designed for a product, one of them with a working prototype.</span>
          </h2>
        </div>
        <WorkCards items={screens} cols={3} />
      </section>

      <section className="wrap section">
        <div className="section__head">
          <h2 className="t-l duo">
            How I make software
            <span>The same three habits every time.</span>
          </h2>
        </div>
        <ul className="cards">
          {HABITS.map(([title, text]) => (
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
