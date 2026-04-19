"use client";

import Link from "next/link";
import Image from "next/image";
import { useMemo, useState } from "react";
import {
  CATEGORY_LABELS,
  cases as allCases,
  getCaseHref,
  type CaseEntry,
} from "@/lib/cases";
import { WorkFilter, type WorkFilterValue } from "./WorkFilter";

function WorkItem({ entry, index }: { entry: CaseEntry; index: number }) {
  const isLive = entry.status === "live";
  const href = getCaseHref(entry);
  const num = String(index + 1).padStart(2, "0");
  const categoryLabel = CATEGORY_LABELS[entry.category];

  // Dark visual — intentionally empty. Placeholders stay pure black;
  // live cases render the cover image edge-to-edge without overlays.
  const visual = (
    <div className="px-6 md:px-10">
      <div className="relative w-full overflow-hidden h-[70vh] min-h-[420px] md:h-[80vh] bg-[#0a0a0a]">
        {isLive && entry.coverImage && (
          <Image
            src={entry.coverImage}
            alt={entry.title}
            fill
            sizes="100vw"
            className="object-cover"
          />
        )}
      </div>
    </div>
  );

  // Top meta — single line: WORK NN on the left, status on the right.
  const topMeta = (
    <div className="grid grid-cols-2 items-center gap-4 px-6 md:px-10 py-4 md:py-5">
      <span className="justify-self-start font-mono text-[11px] tracking-[0.18em] uppercase text-[color:var(--color-muted)]">
        Work {num}
      </span>
      <span className="justify-self-end">
        {isLive ? (
          <span className="inline-flex items-center gap-2 font-mono text-[11px] tracking-[0.18em] uppercase text-[color:var(--color-ink)]">
            <span
              aria-hidden="true"
              className="inline-block h-1.5 w-1.5 rounded-full bg-[color:var(--color-klein)]"
            />
            Live
          </span>
        ) : (
          <span className="font-mono text-[11px] tracking-[0.18em] uppercase text-[color:var(--color-muted)]">
            ◌ Shipping soon
          </span>
        )}
      </span>
    </div>
  );

  // Bottom meta — single line: title on left, category · scenario · CTA on right.
  const bottomMetaInner = (
    <>
      <h2
        className={[
          "text-[18px] md:text-[22px] font-semibold tracking-[-0.02em] leading-[1.2]",
          isLive
            ? "text-[color:var(--color-ink)] group-hover:text-[color:var(--color-klein)] transition-colors"
            : "text-[color:var(--color-ink)]/70",
        ].join(" ")}
      >
        {entry.title}
      </h2>
      <span className="font-mono text-[11px] tracking-[0.18em] uppercase text-[color:var(--color-muted)] whitespace-nowrap flex-shrink-0">
        {categoryLabel}
        <span className="mx-2 text-[color:var(--color-hairline)]">·</span>
        {entry.scenario}
        {isLive && (
          <>
            <span className="mx-2 text-[color:var(--color-hairline)]">·</span>
            <span className="text-[color:var(--color-ink)] group-hover:text-[color:var(--color-klein)] transition-colors">
              View →
            </span>
          </>
        )}
      </span>
    </>
  );

  const bottomMeta = (
    <div className="flex flex-col md:flex-row md:items-baseline md:justify-between gap-2 md:gap-8 px-6 md:px-10 py-4 md:py-5">
      {bottomMetaInner}
    </div>
  );

  return (
    <article
      aria-label={`Work ${num} · ${entry.title}`}
      className="border-b border-[color:var(--color-hairline)]"
    >
      {href && isLive ? (
        <Link
          href={href}
          aria-label={`${entry.title} — view case study`}
          className="group block"
        >
          {topMeta}
          {visual}
          {bottomMeta}
        </Link>
      ) : (
        <>
          {topMeta}
          {visual}
          {bottomMeta}
        </>
      )}
    </article>
  );
}

export function WorkStream() {
  const [filter, setFilter] = useState<WorkFilterValue>("all");

  const visible = useMemo(() => {
    if (filter === "all") return allCases;
    return allCases.filter((c) => c.category === filter);
  }, [filter]);

  return (
    <section aria-label="Selected work">
      {/* Filter header — sticks to top-0 once Screen 1 (and its static Nav)
          have been scrolled away. No seat reserved for Nav. */}
      <div className="border-b border-[color:var(--color-hairline)] bg-[color:var(--color-canvas)] sticky top-0 z-30">
        <div className="grid grid-cols-12 gap-6 md:gap-8 px-6 md:px-10 py-5 md:py-6 items-center">
          <div className="col-span-12 md:col-span-4">
            <p className="font-mono text-[11px] tracking-[0.18em] uppercase text-[color:var(--color-muted)]">
              Selected{" "}
              <span className="text-[color:var(--color-ink)]">/ 2026</span>
            </p>
          </div>
          <div className="col-span-12 md:col-span-8 justify-self-start md:justify-self-end">
            <WorkFilter value={filter} onChange={setFilter} />
          </div>
        </div>
      </div>

      {/* Stream */}
      {visible.map((entry, i) => (
        <WorkItem key={entry.slug} entry={entry} index={i} />
      ))}

      {visible.length === 0 && (
        <div className="px-6 md:px-10 py-20 text-center">
          <p className="font-mono text-[11px] tracking-[0.18em] uppercase text-[color:var(--color-muted)]">
            No cases in this category yet
          </p>
        </div>
      )}
    </section>
  );
}
