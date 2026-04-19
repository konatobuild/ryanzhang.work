import Link from "next/link";
import Image from "next/image";
import { CATEGORY_LABELS, getCaseHref, type CaseEntry } from "@/lib/cases";
import { MetaLabel } from "./ui/MetaLabel";

interface CaseCardProps {
  entry: CaseEntry;
}

export function CaseCard({ entry }: CaseCardProps) {
  const href = getCaseHref(entry);
  const isPlaceholder = entry.status === "placeholder";
  const accent = entry.accent ?? "var(--color-klein)";

  const inner = (
    <article
      className={[
        "group relative flex flex-col overflow-hidden rounded-[var(--radius-card)] border border-[color:var(--color-hairline)] transition-all duration-300",
        isPlaceholder
          ? "bg-[#fafafa]"
          : "bg-white hover:shadow-[var(--shadow-card-hover)]",
      ].join(" ")}
    >
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-[#f4f4f4]">
        {!isPlaceholder && entry.coverImage ? (
          <Image
            src={entry.coverImage}
            alt={entry.title}
            fill
            sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
            className="object-cover transition-transform duration-500 group-hover:scale-[1.02]"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center">
            <span className="meta-text">Coming soon</span>
          </div>
        )}
      </div>

      <div className="flex flex-col gap-2 p-6 md:p-7">
        <div className="flex items-center justify-between">
          <MetaLabel>{CATEGORY_LABELS[entry.category]}</MetaLabel>
          {isPlaceholder ? (
            <MetaLabel
              style={{ color: "var(--color-muted)" }}
              aria-label="Status: placeholder"
            >
              ◌ Placeholder
            </MetaLabel>
          ) : (
            <MetaLabel
              style={{ color: accent }}
              aria-label="Status: live"
            >
              ● Live
            </MetaLabel>
          )}
        </div>
        <h3 className="text-xl md:text-[22px] font-semibold leading-tight tracking-tight">
          {entry.title}
        </h3>
        <p className="text-sm text-[color:var(--color-muted)]">
          {entry.scenario}
        </p>
      </div>

      {!isPlaceholder && (
        <span
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-6 bottom-6 h-[2px] origin-left scale-x-0 bg-[color:var(--color-klein)] transition-transform duration-300 group-hover:scale-x-100"
          style={{ backgroundColor: accent }}
        />
      )}
    </article>
  );

  if (href && !isPlaceholder) {
    const external = href.startsWith("http");
    if (external) {
      return (
        <a
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          className="block"
          aria-label={`${entry.title} — open live demo`}
        >
          {inner}
        </a>
      );
    }
    return (
      <Link href={href} className="block" aria-label={entry.title}>
        {inner}
      </Link>
    );
  }

  return <div aria-disabled="true">{inner}</div>;
}
