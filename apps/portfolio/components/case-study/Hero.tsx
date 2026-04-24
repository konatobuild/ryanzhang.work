import Image from "next/image";
import { ButtonLink } from "../ui/Button";
import { MetaLabel } from "../ui/MetaLabel";
import type { CaseStudyMeta } from "./types";

interface HeroProps {
  title: string;
  description: string;
  meta: CaseStudyMeta;
  liveUrl?: string;
  image?: {
    src: string;
    alt: string;
    width: number;
    height: number;
  };
  isConcept?: boolean;
}

export function Hero({
  title,
  description,
  meta,
  liveUrl,
  image,
  isConcept,
}: HeroProps) {
  return (
    <section className="container-page px-6 md:px-10 pt-8 md:pt-12">
      <div className="grid gap-10 md:grid-cols-[3fr_1fr] md:gap-16">
        {/* Left — identity */}
        <header>
          {isConcept && (
            <MetaLabel
              as="p"
              className="mb-4"
              style={{ color: "var(--color-klein)" }}
            >
              Concept project
            </MetaLabel>
          )}
          <h1 className="text-5xl md:text-7xl font-semibold leading-[1.02] tracking-[-0.03em]">
            {title}
          </h1>
          <p className="mt-5 text-lg md:text-xl text-[color:var(--color-muted)] max-w-3xl leading-relaxed">
            {description}
          </p>
        </header>

        {/* Right — meta rail: single mono line (no labels) + optional CTA.
            Labels are dropped because the values are self-evident in context. */}
        <aside className="flex flex-col gap-5 md:pt-3">
          <MetaLabel as="p" className="leading-relaxed">
            {meta.role} · {meta.timeline} · {meta.type}
          </MetaLabel>
          {liveUrl && (
            <div>
              <ButtonLink href={liveUrl} external>
                View live demo →
              </ButtonLink>
            </div>
          )}
        </aside>
      </div>

      {image && (
        <div className="mt-12 card overflow-hidden aspect-[16/10] relative bg-[#f4f4f4]">
          <Image
            src={image.src}
            alt={image.alt}
            fill
            sizes="(min-width: 1200px) 1200px, 100vw"
            priority
            className="object-cover"
          />
        </div>
      )}
    </section>
  );
}
