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

  const visual = (
    <div
      className={[
        "relative w-full overflow-hidden",
        "h-[60vh] min-h-[380px] md:h-[72vh]",
        isLive ? "bg-[#0a0a0a]" : "bg-[#0a0a0a]",
      ].join(" ")}
    >
      {isLive && entry.coverImage ? (
        <Image
          src={entry.coverImage}
          alt={entry.title}
          fill
          sizes="100vw"
          className="object-cover"
        />
      ) : (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center">
            <p className="font-mono text-[11px] tracking-[0.18em] uppercase text-white/40">
              Shipping Q2 2026
            </p>
            <p className="mt-4 text-[44px] md:text-[72px] font-semibold tracking-[-0.03em] leading-[1.02] text-white/85">
              {entry.title}
            </p>
            <p className="mt-3 font-mono text-[11px] tracking-[0.18em] uppercase text-white/40">
              {entry.scenario}
            </p>
          </div>
        </div>
      )}
    </div>
  );

  return (
    <article
      aria-label={`Work ${num} · ${entry.title}`}
      className="border-b border-[color:var(--color-hairline)]"
    >
      {/* Meta row */}
      <div className="grid grid-cols-12 gap-6 md:gap-8 px-6 md:px-10 py-5 md:py-6">
        <div className="col-span-6 md:col-span-6 inline-flex items-center gap-4">
          <span className="font-mono text-[11px] tracking-[0.18em] uppercase text-[color:var(--color-muted)]">
            Work {num}
          </span>
          <span className="h-3 w-px bg-[color:var(--color-hairline)]" />
          <span className="font-mono text-[11px] tracking-[0.18em] uppercase text-[color:var(--color-ink)]">
            {categoryLabel}
          </span>
        </div>
        <div className="col-span-6 md:col-span-6 justify-self-end inline-flex items-center gap-2">
          {isLive ? (
            <span className="inline-flex items-center gap-2 font-mono text-[11px] tracking-[0.18em] uppercase text-[color:var(--color-ink)]">
              <span className="inline-block h-1.5 w-1.5 rounded-full bg-[color:var(--color-klein)]" />
              Live
            </span>
          ) : (
            <span className="font-mono text-[11px] tracking-[0.18em] uppercase text-[color:var(--color-muted)]">
              ◌ Shipping soon
            </span>
          )}
        </div>
      </div>

      {/* Visual */}
      {href && isLive ? (
        <Link
          href={href}
          aria-label={`${entry.title} — view case study`}
          className="group block"
        >
          {visual}
          <div className="grid grid-cols-12 gap-6 md:gap-8 px-6 md:px-10 py-6 md:py-8">
            <div className="col-span-12 md:col-span-8">
              <h2 className="text-[28px] md:text-[40px] font-semibold tracking-[-0.02em] leading-[1.08] group-hover:text-[color:var(--color-klein)] transition-colors">
                {entry.title}
              </h2>
              <p className="mt-2 text-[15px] text-[color:var(--color-muted)]">
                {entry.scenario}
              </p>
            </div>
            <div className="col-span-12 md:col-span-4 flex items-end justify-end">
              <span className="inline-flex items-center gap-2 font-mono text-[11px] tracking-[0.18em] uppercase text-[color:var(--color-ink)] group-hover:text-[color:var(--color-klein)] transition-colors">
                View case study →
              </span>
            </div>
          </div>
        </Link>
      ) : (
        <>
          {visual}
          <div className="grid grid-cols-12 gap-6 md:gap-8 px-6 md:px-10 py-6 md:py-8">
            <div className="col-span-12 md:col-span-8">
              <h2 className="text-[28px] md:text-[40px] font-semibold tracking-[-0.02em] leading-[1.08] text-[color:var(--color-ink)]/70">
                {entry.title}
              </h2>
              <p className="mt-2 text-[15px] text-[color:var(--color-muted)]">
                {entry.scenario}
              </p>
            </div>
            <div className="col-span-12 md:col-span-4 flex items-end justify-end">
              <span className="font-mono text-[11px] tracking-[0.18em] uppercase text-[color:var(--color-muted)]">
                Placeholder
              </span>
            </div>
          </div>
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
              Selected <span className="text-[color:var(--color-ink)]">/ 2026</span>
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
