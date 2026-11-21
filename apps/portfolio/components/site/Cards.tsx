import Image from "next/image";
import Link from "next/link";
import { AutoVideo } from "@/components/site/AutoVideo";
import type { WorkEntry } from "@/lib/work";

/**
 * One piece of work: what kind of thing it is, what it is, where it
 * leads, and its picture underneath, cropped around its subject.
 *
 * With `motion`, a piece that has a recording plays it in the card while
 * the card is on screen: a website or a prototype is made of movement, and
 * a still of it shows the least interesting part. `ratio` sets the frame
 * for the whole row, so recordings are shown whole instead of cropped.
 */
export function WorkCards({
  items,
  cols = 4,
  motion = false,
  ratio,
}: {
  items: WorkEntry[];
  cols?: 2 | 3 | 4;
  motion?: boolean;
  ratio?: string;
}) {
  return (
    <ul className={`cards cards--${cols}`}>
      {items.map((it) => {
        const body = (
          <>
            <div className="card__text">
              <span className="t-s muted">
                {it.label} · {it.year}
              </span>
              <h3>{it.title.split(":")[0]}</h3>
              <p>{it.subtitle}</p>
              <span className={it.href ? "link" : "muted"}>{it.cta}</span>
            </div>
            <div className="card__gap" />
            <div
              className="card__media"
              style={{
                background: it.cover.ground,
                aspectRatio: ratio,
              }}
            >
              {motion && it.wide.video ? (
                <AutoVideo src={it.wide.video} poster={it.wide.src} label={it.wide.alt} />
              ) : (
                <Image
                  src={it.cover.src}
                  alt={it.cover.alt}
                  width={it.cover.w}
                  height={it.cover.h}
                  sizes="(max-width: 760px) 100vw, (max-width: 1000px) 50vw, 420px"
                  style={{
                    objectPosition: it.cover.pos,
                    objectFit: it.cover.ground ? "contain" : undefined,
                  }}
                />
              )}
            </div>
          </>
        );
        return (
          <li key={it.slug} style={{ display: "contents" }}>
            {!it.href ? (
              <div className="card">{body}</div>
            ) : it.external ? (
              <a href={it.href} className="card" target="_blank" rel="noopener noreferrer">
                {body}
              </a>
            ) : (
              <Link href={it.href} className="card">
                {body}
              </Link>
            )}
          </li>
        );
      })}
    </ul>
  );
}
