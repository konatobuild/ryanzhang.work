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
    <section className="container-page px-6 md:px-10 pt-12 md:pt-20">
      <div className="grid gap-10 md:gap-14">
        <header className="max-w-4xl">
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
          <p className="mt-6 text-lg md:text-xl text-[color:var(--color-muted)] max-w-3xl leading-relaxed">
            {description}
          </p>

          <dl className="mt-10 grid grid-cols-3 gap-6 max-w-2xl">
            <div>
              <MetaLabel as="dt" className="mb-1">
                Role
              </MetaLabel>
              <dd className="text-[15px] font-medium">{meta.role}</dd>
            </div>
            <div>
              <MetaLabel as="dt" className="mb-1">
                Timeline
              </MetaLabel>
              <dd className="text-[15px] font-medium">{meta.timeline}</dd>
            </div>
            <div>
              <MetaLabel as="dt" className="mb-1">
                Type
              </MetaLabel>
              <dd className="text-[15px] font-medium">{meta.type}</dd>
            </div>
          </dl>

          {liveUrl && (
            <div className="mt-10">
              <ButtonLink href={liveUrl} external>
                View live demo →
              </ButtonLink>
            </div>
          )}
        </header>

        <div className="card overflow-hidden aspect-[16/10] relative bg-[#f4f4f4]">
          {image ? (
            <Image
              src={image.src}
              alt={image.alt}
              fill
              sizes="(min-width: 1200px) 1200px, 100vw"
              priority
              className="object-cover"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center">
              <MetaLabel>Hero screenshot placeholder</MetaLabel>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
