"use client";

import Image from "next/image";
import Link from "next/link";
import { useRef, useState } from "react";
import { backdrops, type BackdropKey, type Shot, type WorkEntry } from "@/lib/work";
import { AutoVideo } from "./AutoVideo";
import { Icon } from "./Marks";

interface Group {
  label: string;
  items: WorkEntry[];
}

/** A picture or a clip, shown whole at its own proportions. */
function Media({ shot, sizes, priority }: { shot: Shot; sizes: string; priority?: boolean }) {
  return shot.video ? (
    <AutoVideo src={shot.video} poster={shot.src} label={shot.alt} />
  ) : (
    <Image
      src={shot.src}
      alt={shot.alt}
      width={shot.w}
      height={shot.h}
      sizes={sizes}
      priority={priority}
    />
  );
}

/**
 * The small frame: closer views of the piece. The big picture shows the
 * whole thing; these are for a quick look at its parts. Each view has a
 * named tab under the picture, the same way the list beside the stage
 * names each piece: passing the pointer over a tab shows that view at
 * once, clicking or focusing it does the same, and clicking the picture
 * goes to the next. Nothing moves by itself.
 */
function Details({ shots, left }: { shots: Shot[]; left?: boolean }) {
  const [at, setAt] = useState(0);
  const tabs = useRef<HTMLDivElement>(null);
  const many = shots.length > 1;

  function show(i: number, focus = false) {
    const next = (i + shots.length) % shots.length;
    setAt(next);
    if (focus) tabs.current?.querySelectorAll<HTMLButtonElement>("button")[next]?.focus();
  }

  function onKey(e: React.KeyboardEvent) {
    if (e.key === "ArrowRight") show(at + 1, true);
    else if (e.key === "ArrowLeft") show(at - 1, true);
    else return;
    // Keep the arrows here; the list of pieces listens for them too.
    e.preventDefault();
    e.stopPropagation();
  }

  return (
    <div className={left ? "plate show__detail show__detail--left" : "plate show__detail"}>
      <div
        className={many ? "show__views show__views--many" : "show__views"}
        // Each view keeps its own shape: a whole picture is shown whole.
        style={{ "--ratio": shots[at].w / shots[at].h } as React.CSSProperties}
        onClick={many ? () => show(at + 1) : undefined}
      >
        {shots.map((shot, i) => (
          <div className="show__view" data-on={i === at} aria-hidden={i !== at} key={shot.src}>
            <Media shot={shot} sizes="300px" />
          </div>
        ))}
      </div>
      <div
        className="show__tabs"
        ref={tabs}
        role="toolbar"
        aria-label="Closer views"
        onKeyDown={onKey}
      >
        {shots.map((shot, i) => (
          <button
            key={shot.src}
            type="button"
            aria-pressed={i === at}
            tabIndex={i === at ? 0 : -1}
            onClick={() => show(i)}
            onPointerEnter={(e) => {
              if (e.pointerType === "mouse") show(i);
            }}
          >
            {shot.name}
          </button>
        ))}
      </div>
    </div>
  );
}

/**
 * Showcase — a contents list of everything beside one piece on the wall.
 * Each piece is shown the way that suits it: a film or screen recording
 * for software, a photograph or render for objects, at its own
 * proportions, sometimes with a few closer views in a small tabbed frame. Each hangs on its
 * own painting. Choosing a name hangs that piece; the arrows step through
 * in order; arrow keys work in the list.
 */
export function Showcase({ groups }: { groups: Group[] }) {
  const flat = groups.flatMap((g) => g.items);
  const [index, setIndex] = useState(0);
  // Paintings are mounted the first time they are needed, then kept, so
  // going back to one cross-fades without loading it again.
  const [paints, setPaints] = useState<BackdropKey[]>([flat[0].paint]);
  const nav = useRef<HTMLDivElement>(null);
  const item = flat[index];
  const offsets = groups.map((_, gi) =>
    groups.slice(0, gi).reduce((sum, g) => sum + g.items.length, 0),
  );

  function choose(i: number, focus = false) {
    const next = (i + flat.length) % flat.length;
    const paint = flat[next].paint;
    setIndex(next);
    setPaints((p) => (p.includes(paint) ? p : [...p, paint]));
    if (focus) nav.current?.querySelector<HTMLButtonElement>(`[data-i="${next}"]`)?.focus();
  }

  function onKey(e: React.KeyboardEvent) {
    if (e.key === "ArrowRight" || e.key === "ArrowDown") choose(index + 1, true);
    else if (e.key === "ArrowLeft" || e.key === "ArrowUp") choose(index - 1, true);
    else if (e.key === "Home") choose(0, true);
    else if (e.key === "End") choose(flat.length - 1, true);
    else return;
    e.preventDefault();
  }

  const go = !item.href ? (
    <span className="muted">{item.cta}</span>
  ) : item.external ? (
    <a href={item.href} className="link" target="_blank" rel="noopener noreferrer">
      {item.cta}
    </a>
  ) : (
    <Link href={item.href} className="link">
      {item.cta}
    </Link>
  );

  const ratio = item.wide.w / item.wide.h;

  return (
    <div className="show">
      <div className="index" ref={nav} onKeyDown={onKey} role="toolbar" aria-label="All work">
        {groups.map((g, gi) => (
          <div className="index__row" role="group" aria-label={g.label} key={g.label}>
            <span className="index__label">{g.label}</span>
            <div className="index__items">
              {g.items.map((it, ii) => {
                const i = offsets[gi] + ii;
                const on = i === index;
                return (
                  <button
                    key={it.slug}
                    type="button"
                    data-i={i}
                    aria-pressed={on}
                    tabIndex={on ? 0 : -1}
                    onClick={() => choose(i)}
                  >
                    <span>{it.short}</span>
                    <small>{it.year}</small>
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      <div className="show__main">
        <div className="show__stage">
          {paints.map((key) => (
            <Image
              key={key}
              className="show__paint"
              data-on={key === item.paint}
              src={backdrops[key].src}
              alt=""
              fill
              sizes="(max-width: 900px) 100vw, 1040px"
              priority={key === flat[0].paint}
            />
          ))}
          <div
            className={ratio < 1 ? "show__hang show__hang--tall" : "show__hang"}
            style={{ "--ratio": ratio } as React.CSSProperties}
          >
            <div className="plate show__img" key={item.slug}>
              <Media
                shot={item.wide}
                sizes="(max-width: 900px) 100vw, 800px"
                priority={index === 0}
              />
            </div>
            {item.details ? <Details shots={item.details} left={item.detailsLeft} key={`${item.slug}-views`} /> : null}
          </div>
        </div>

        <div className="show__bar">
          <p aria-live="polite">
            {item.title}{" "}
            <span className="muted">
              {item.label}, {item.year}
            </span>
          </p>
          <div className="show__ctl">
            {go}
            <span className="show__count muted">
              {index + 1} / {flat.length}
            </span>
            <button
              type="button"
              className="icon-btn"
              onClick={() => choose(index - 1)}
              aria-label="Previous piece"
            >
              <Icon name="left" />
            </button>
            <button
              type="button"
              className="icon-btn"
              onClick={() => choose(index + 1)}
              aria-label="Next piece"
            >
              <Icon name="right" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
