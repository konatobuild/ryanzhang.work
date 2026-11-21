import Image from "next/image";
import Link from "next/link";
import { AutoVideo } from "@/components/site/AutoVideo";
import { WorkCards } from "@/components/site/Cards";
import { LiveFrame } from "@/components/site/LiveFrame";
import { Recognition } from "@/components/site/Recognition";
import { Showcase } from "@/components/site/Showcase";
import { Plate, Stage } from "@/components/site/Stage";
import {
  CONTACT_EMAIL,
  caseStudies,
  objects,
  products,
  brand,
  interfaces,
  web,
  type BackdropKey,
} from "@/lib/work";

/** A still from a case study, with its real dimensions and alt text. */
function still(slug: string, file: string) {
  const m = caseStudies[slug].images[file];
  return { src: `/work/${slug}/${file}`, w: m.w, h: m.h, alt: m.alt };
}

const PANELS: {
  title: string;
  text: string;
  note: string;
  link: { href: string; label: string };
  paint: BackdropKey;
  window: string;
  image: { src: string; w: number; h: number; alt: string };
  pos?: string;
  /** An upright picture: shown whole, standing on the painting, instead of filling a window. */
  upright?: boolean;
  /** A recording that plays in place of the picture. */
  video?: string;
  /** A website: shown whole in a browser frame with this address, so it reads as a page at any moment. */
  browser?: string;
  /** A working interface that sits in the window in place of a picture. */
  live?: { src: string; w: number; poster: string };
}[] = [
  {
    title: "Objects",
    text: "Consumer products taken from interviews and sketches to a painted model in the hand.",
    note: "Research and testing, form and CMF, structure, model making, rendering, packaging.",
    link: { href: "/industrial-design", label: "See the industrial design →" },
    paint: "waterlooGray",
    window: "BackTech Elite, carried by its handle",
    image: still("backtech-elite", "cover.webp"),
    upright: true,
  },
  {
    title: "Software",
    text: "Apps I design and build myself, from the first sketch to the release on its own site.",
    note: "Product and interface design, characters and icons, Swift and React, launch films.",
    link: { href: "/software", label: "See the software →" },
    paint: "waterloo",
    window: "Peeko, the room",
    image: {
      src: "/software/peeko/today-window.webp",
      w: 1780,
      h: 1158,
      alt: "Peeko's window: project teams as characters",
    },
    pos: "0% 0%",
    live: { src: "/software/peeko/room.html", w: 1000, poster: "/software/peeko/room-poster.webp" },
  },
  {
    title: "Websites",
    text: "The page each product launches on, designed and built by the same hands.",
    note: "Art direction, type, scroll scenes and motion, hand-written HTML and CSS.",
    link: { href: "/software#websites", label: "See the websites →" },
    paint: "charingCross",
    window: "Curio Editions, home page",
    image: {
      src: "/web/curio/scroll-poster.webp",
      w: 1280,
      h: 800,
      alt: "The Curio Editions website being scrolled: a hand holding a painted card, then what clients said, then the cards",
    },
    video: "/web/curio/scroll.mp4",
    browser: "curioeditions.com",
  },
  {
    title: "Brand identity",
    text: "An identity system for OFX, from the cube mark and type to stationery, screens and street signs.",
    note: "Identity systems, brand guidelines, applications.",
    link: { href: "/work/ofx-rebrand", label: "Read about OFX →" },
    paint: "coast",
    window: "OFX, street billboard",
    image: still("ofx-rebrand", "street.webp"),
  },
];

const NUMBERS = ["Zero", "One", "Two", "Three", "Four", "Five", "Six", "Seven", "Eight", "Nine", "Ten", "Eleven", "Twelve", "Thirteen", "Fourteen", "Fifteen", "Sixteen", "Seventeen", "Eighteen", "Nineteen", "Twenty", "Twenty-one", "Twenty-two", "Twenty-three", "Twenty-four"];
/** How many pieces the showcase holds, spelled out. */
const COUNT = NUMBERS[objects.length + products.length + web.length + interfaces.length + brand.length];

const SKILLS = [
  ["Research", "Interviews, journey maps, surveys and competitor analysis."],
  ["Testing", "Grip models, paper mock-ups and concept tests with users."],
  ["Form and CMF", "Sketching, 3D modelling, colour, material and finish."],
  ["Structure", "Frames and mechanisms worked out in section and in the hand."],
  ["Model making", "Foam, 3D printing and paint. Appearance models made by hand."],
  ["Rendering and animation", "KeyShot stills and Blender animation."],
  ["Interface design", "Flows and screens in Figma, for phone, watch and headset."],
  ["Building software", "Swift for Mac and iPhone, React and TypeScript for the web."],
  ["Brand and packaging", "Identity systems, guidelines and packaging."],
];

const PATH = [
  ["2026", "Released Peeko and Digo, two apps for the Mac"],
  ["2025", "Received the Red Dot Design Concept award for CoolDrip"],
  ["2024 to now", "Graduate study at the USC Iovine and Young Academy"],
  ["2024", "Graduated from SIVA DeTao School of Design, Shanghai"],
  ];

export default function Home() {
  return (
    <>
      <section className="wrap hero">
        <h1 className="t-h1 hero__title">
          Ryan Zhang designs objects to hold and software to use.
        </h1>
        <div className="hero__actions">
          <Link className="btn" href="/work">
            See the work →
          </Link>
          <Link className="btn btn--quiet" href="/contact">
            Get in touch →
          </Link>
        </div>

        <div className="hero__stage">
          <Showcase
            groups={[
              { label: "Objects", items: objects },
              { label: "Software", items: products },
              { label: "Websites", items: web },
              { label: "Interface and brand", items: [...interfaces, ...brand] },
            ]}
          />
        </div>
      </section>

      <Recognition />

      <section className="wrap section" aria-label="What I do">
        <div className="panels">
          {PANELS.map((p, i) => (
            <article key={p.title} className={i % 2 ? "panel panel--flip" : "panel"}>
              <div className="panel__text">
                <h3 className="t-l duo">
                  {p.title}
                  <span>{p.text}</span>
                </h3>
                <Link className="link" href={p.link.href}>
                  {p.link.label}
                </Link>
                <p className="panel__note">{p.note}</p>
              </div>
              <Stage
                paint={p.paint}
                className={
                  p.upright || p.browser ? "panel__stage panel__stage--upright" : "panel__stage"
                }
              >
                <Plate
                  className={
                    p.upright
                      ? "panel__win panel__win--upright"
                      : p.browser
                        ? "panel__win panel__win--browser"
                        : "panel__win"
                  }
                  style={p.upright ? { aspectRatio: `${p.image.w} / ${p.image.h}` } : undefined}
                >
                  {p.browser ? (
                    <div className="browser__bar" aria-hidden="true">
                      <i />
                      <i />
                      <i />
                      <span>{p.browser}</span>
                    </div>
                  ) : null}
                  <div className="panel__media">
                    {p.live ? (
                      <LiveFrame {...p.live} title={p.window} />
                    ) : p.video ? (
                      <AutoVideo src={p.video} poster={p.image.src} label={p.image.alt} />
                    ) : (
                      <Image
                        src={p.image.src}
                        alt={p.image.alt}
                        width={p.image.w}
                        height={p.image.h}
                        sizes="(max-width: 860px) 100vw, 840px"
                        style={p.pos ? { objectPosition: p.pos } : undefined}
                      />
                    )}
                  </div>
                </Plate>
              </Stage>
            </article>
          ))}
        </div>
      </section>

      <section className="wrap section">
        <h2 className="t-xl section__head--center section__head">
          {COUNT} projects: objects, software and websites.
        </h2>
        <div className="section__head">
          <h3 className="t-l duo">
            Objects
            <span>Nine objects, from a coffee maker to a concept car.</span>
          </h3>
        </div>
        <WorkCards items={objects} />
        <p className="section__foot">
          <Link className="link" href="/industrial-design">
            More on the industrial design →
          </Link>
        </p>
      </section>

      <section className="wrap section">
        <div className="section__head">
          <h3 className="t-l duo">
            Software
            <span>Four apps of my own. Three are out; one is on its way.</span>
          </h3>
        </div>
        <WorkCards items={products} />
        <p className="section__foot">
          <Link className="link" href="/software">
            Prototypes and interface work →
          </Link>
        </p>
      </section>

      <section className="wrap section">
        <div className="section__head">
          <h3 className="t-l duo">
            Websites
            <span>Six sites, each recorded from the live page.</span>
          </h3>
        </div>
        <WorkCards items={web} cols={3} motion ratio="16 / 10" />
      </section>

      <section className="wrap section" aria-label="Skills">
        <h2 className="t-l duo section__head section__head--center">
          What I can do
          <span>From the first interview to a shipped app.</span>
        </h2>
        <ul className="cards">
          {SKILLS.map(([title, text]) => (
            <li key={title} className="card card--s">
              <h3>{title}</h3>
              <p className="muted">{text}</p>
            </li>
          ))}
        </ul>
      </section>

      <section className="wrap section" aria-label="Path">
        <div className="section__head">
          <h2 className="t-l">Path</h2>
        </div>
        <ul className="cards cards--4 cards--s">
          {PATH.map(([when, what]) => (
            <li key={what} className="card card--s">
              <span className="t-s muted">{when}</span>
              <h3>{what}</h3>
            </li>
          ))}
        </ul>
      </section>

      <section className="wrap section">
        <article className="panel">
          <div className="panel__text">
            <h2 className="t-l duo">
              I trained as an industrial designer, where the model on the bench
              settles the argument.
              <span>
                I work on software the same way: build the real thing early,
                then judge it in use.
              </span>
            </h2>
            <Link className="link" href="/about">
              More about me →
            </Link>
          </div>
          <div className="panel__photo">
            <Image
              src="/ryan-portrait.webp"
              alt="Ryan Zhang, in glasses and a black sweater, looking off to one side"
              width={2000}
              height={1000}
              sizes="(max-width: 860px) 100vw, 840px"
            />
          </div>
        </article>
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
