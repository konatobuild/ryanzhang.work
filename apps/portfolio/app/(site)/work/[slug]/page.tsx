import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Figures, type Fig } from "@/components/site/Figures";
import { FingerKeys } from "@/components/site/FingerKeys";
import { Plate, Stage } from "@/components/site/Stage";
import {
  CASE_BACKDROP,
  brand,
  caseStudies,
  interfaces,
  making,
  objects,
} from "@/lib/work";

/** Pieces with a case page. Making has a page but is not in the running order. */
const LISTED = [...objects, ...interfaces, ...brand];
const ORDER = [...LISTED, making];

export function generateStaticParams() {
  return ORDER.map((w) => ({ slug: w.slug }));
}

export const dynamicParams = false;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const c = caseStudies[slug];
  if (!c) return {};
  return {
    title: c.title,
    description: c.summary,
    openGraph: {
      title: `${c.title} — Ryan Zhang`,
      description: c.subtitle,
      images: [`/work/${slug}/${c.hero}`],
    },
  };
}

function paragraphs(text: string) {
  return text
    .split(/\n\s*\n/)
    .map((p) => p.trim())
    .filter(Boolean);
}

export default async function CasePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const c = caseStudies[slug];
  const at = ORDER.findIndex((w) => w.slug === slug);
  if (!c || at < 0) notFound();

  const entry = ORDER[at];
  const from = LISTED.findIndex((w) => w.slug === slug);
  const more = [1, 2, 3].map((d) => LISTED[(from + d + LISTED.length) % LISTED.length]);
  const base = `/work/${slug}/`;
  const hero = c.images[c.hero];
  const back =
    entry.group === "object"
      ? { href: "/industrial-design", label: "Industrial design" }
      : { href: "/software", label: "Interface and brand" };

  const fig = (file: string): Fig | null => {
    const m = c.images[file];
    return m ? { ...m, file, src: base + file } : null;
  };

  // One line per award, with its categories.
  const awards = new Map<string, string[]>();
  for (const a of c.awards ?? []) {
    const key = `${a.name}, ${a.year}`;
    awards.set(key, [...(awards.get(key) ?? []), a.category ?? ""].filter(Boolean));
  }

  return (
    <article className="wrap post">
      <header className="post__row post__head">
        <p className="post__side">
          <Link href="/work">Work</Link> / <Link href={back.href}>{back.label}</Link>
        </p>
        <div className="post__main">
          <p className="muted">
            {entry.label} · {c.year}
          </p>
          <h1 className="t-xl post__title">{c.title}</h1>
          <p className="post__lead">{c.summary}</p>
          {c.links?.length ? (
            <div className="post__actions">
              {c.links.map((l) => (
                <a
                  key={l.url}
                  className="btn btn--s btn--line"
                  href={l.url}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {l.label} ↗
                </a>
              ))}
            </div>
          ) : null}
        </div>
        <aside className="post__aside">
          <dl className="facts">
            {c.context ? (
              <div>
                <dt>Context</dt>
                <dd>{c.context}</dd>
              </div>
            ) : null}
            <div>
              <dt>My part</dt>
              <dd>{c.role}</dd>
            </div>
            {c.team ? (
              <div>
                <dt>Team</dt>
                <dd>{c.team}</dd>
              </div>
            ) : null}
            {c.tools?.length ? (
              <div>
                <dt>Made with</dt>
                <dd>{c.tools.join(", ")}</dd>
              </div>
            ) : null}
            {awards.size ? (
              <div>
                <dt>Recognition</dt>
                <dd>
                  <ul>
                    {[...awards.keys()].map((name) => (
                      <li key={name}>{name}</li>
                    ))}
                  </ul>
                </dd>
              </div>
            ) : null}
          </dl>
        </aside>
      </header>

      <Stage paint={CASE_BACKDROP[slug] ?? "nocturne"} className="post__stage" priority>
        <Plate
          label={<p className="muted">{hero.caption ?? hero.alt}</p>}
          // An upright picture is sized by its height, so it stays on one screen.
          style={hero.w < hero.h ? { maxWidth: Math.round((700 * hero.w) / hero.h) } : undefined}
        >
          <Image
            src={base + c.hero}
            alt={hero.alt}
            width={hero.w}
            height={hero.h}
            sizes="(max-width: 860px) 100vw, 1080px"
            priority
          />
        </Plate>
      </Stage>

      {c.sections.map((s) => {
        const figs = s.images
          .filter((f) => f !== c.hero)
          .map(fig)
          .filter((f): f is Fig => f !== null);
        return (
          <section key={s.heading} className="post__row post__section">
            <div className="post__main">
              <h2 className="t-l">{s.heading}</h2>
              <div className="prose">
                {paragraphs(s.body).map((p) => (
                  <p key={p.slice(0, 32)}>{p}</p>
                ))}
              </div>
            </div>
            {s.demo === "finger-keys" ? (
              <div className="post__wide post__demo">
                <FingerKeys />
              </div>
            ) : null}
            {figs.length ? (
              <div className="post__wide">
                <Figures figs={figs} />
              </div>
            ) : null}
          </section>
        );
      })}

      <section className="post__row post__more">
        <h2 className="post__side">More work</h2>
        <div className="post__main">
          <ul className="cards">
            {more.map((m) => (
              <li key={m.slug}>
                <Link href={m.href!} className="rowcard">
                  <div>
                    {m.title.split(":")[0]}
                    <span>{m.subtitle}</span>
                    <span>{m.year}</span>
                  </div>
                  <div className="rowcard__img">
                    <Image
                      src={m.cover.src}
                      alt=""
                      width={m.cover.w}
                      height={m.cover.h}
                      sizes="150px"
                      style={m.cover.pos ? { objectPosition: m.cover.pos } : undefined}
                    />
                  </div>
                </Link>
              </li>
            ))}
          </ul>
          <p className="section__foot">
            <Link className="link" href="/work">
              See all the work →
            </Link>
          </p>
        </div>
      </section>
    </article>
  );
}
