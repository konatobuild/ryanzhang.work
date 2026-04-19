import Image from "next/image";
import { MetaLabel } from "./ui/MetaLabel";

interface Award {
  src: string;
  alt: string;
  /** Visual scale multiplier to normalize logo weight. */
  scale?: number;
}

const awards: Award[] = [
  {
    src: "/awards/red-dot-concept-2025.png",
    alt: "Red Dot Design Concept Winner 2025",
    scale: 1,
  },
  {
    src: "/awards/muse-gold.png",
    alt: "MUSE Design Awards — Gold",
    scale: 1,
  },
  {
    src: "/awards/ny-product-silver.jpg",
    alt: "NY Product Design Awards — Silver",
    scale: 0.75,
  },
  {
    src: "/awards/london-silver.png",
    alt: "London Design Awards — Silver",
    scale: 0.6,
  },
];

export function AwardStrip() {
  const loop = [...awards, ...awards];
  return (
    <section className="card overflow-hidden px-6 py-8 md:px-10 md:py-10">
      <MetaLabel as="p" className="text-center mb-6">
        Recognized for design excellence
      </MetaLabel>
      <div className="marquee" aria-label="Design award recognitions">
        <div className="marquee__track">
          {loop.map((award, i) => {
            const isPrimary = i < awards.length;
            return (
              <div
                key={`${award.src}-${i}`}
                className="marquee__item h-16"
                aria-hidden={!isPrimary}
                tabIndex={isPrimary ? 0 : -1}
                style={{
                  transform: `scale(${award.scale ?? 1})`,
                  transformOrigin: "center",
                }}
              >
                <Image
                  src={award.src}
                  alt={isPrimary ? award.alt : ""}
                  width={220}
                  height={64}
                  className="h-full w-auto object-contain"
                  priority={isPrimary}
                />
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
