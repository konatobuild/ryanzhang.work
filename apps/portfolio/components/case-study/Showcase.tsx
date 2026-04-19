import Image from "next/image";
import { MetaLabel } from "../ui/MetaLabel";
import type { ShowcaseItem } from "./types";

interface ShowcaseProps {
  items: ShowcaseItem[];
}

export function Showcase({ items }: ShowcaseProps) {
  return (
    <section className="container-page px-6 md:px-10 pt-24 md:pt-32">
      <div className="mb-10 grid gap-8 md:grid-cols-[220px_1fr] md:gap-16">
        <MetaLabel as="p" className="md:pt-3">
          Solution
        </MetaLabel>
        <h2 className="text-3xl md:text-4xl font-semibold tracking-tight max-w-2xl">
          How it comes together
        </h2>
      </div>

      <div className="space-y-10">
        {items.map((item, idx) => (
          <figure key={idx} className="card overflow-hidden">
            <div className="relative aspect-[16/10] bg-[#f4f4f4]">
              {item.image ? (
                <Image
                  src={item.image.src}
                  alt={item.image.alt}
                  fill
                  sizes="(min-width: 1200px) 1200px, 100vw"
                  className="object-cover"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center">
                  <MetaLabel>Screenshot placeholder</MetaLabel>
                </div>
              )}
            </div>
            <figcaption className="flex flex-col gap-1 px-6 py-5 md:px-10 md:py-6">
              <MetaLabel>{`Figure ${String(idx + 1).padStart(2, "0")}`}</MetaLabel>
              <h3 className="text-lg md:text-xl font-semibold tracking-tight">
                {item.heading}
              </h3>
              {item.caption && (
                <p className="text-sm text-[color:var(--color-muted)] max-w-2xl">
                  {item.caption}
                </p>
              )}
            </figcaption>
          </figure>
        ))}
      </div>
    </section>
  );
}
