import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { MetaLabel } from "@/components/ui/MetaLabel";

export const metadata: Metadata = {
  title: "About",
  description:
    "From industrial design to product interfaces — Ryan Zhang's background, recognition, and how the work fits together.",
};

const awards = [
  {
    src: "/awards/red-dot-concept-2025.png",
    name: "Red Dot — Design Concept Winner",
    year: "2025",
    note: "Project name — TODO fill",
  },
  {
    src: "/awards/muse-gold.png",
    name: "MUSE Design Awards — Gold",
    year: "2025",
    note: "Project name — TODO fill",
  },
  {
    src: "/awards/ny-product-silver.jpg",
    name: "NY Product Design Awards — Silver",
    year: "2025",
    note: "Project name — TODO fill",
  },
  {
    src: "/awards/london-silver.png",
    name: "London Design Awards — Silver",
    year: "2025",
    note: "Project name — TODO fill",
  },
];

const idProjects = [
  { title: "ID project 01", note: "Short descriptor — TODO" },
  { title: "ID project 02", note: "Short descriptor — TODO" },
  { title: "ID project 03", note: "Short descriptor — TODO" },
  { title: "ID project 04", note: "Short descriptor — TODO" },
];

export default function AboutPage() {
  return (
    <div className="pt-16 md:pt-24">
      {/* Intro */}
      {/* TODO: Ryan — rewrite this in your own voice. Keep the ID→UX bridge. */}
      <section className="container-page px-6 md:px-10 max-w-4xl">
        <MetaLabel as="p" className="mb-6">
          About
        </MetaLabel>
        <h1 className="text-4xl md:text-6xl font-semibold tracking-[-0.03em] leading-[1.04]">
          I started with products you could hold. Now I design ones you use
          with your thumbs.
        </h1>
        <div className="mt-10 space-y-6 text-lg leading-relaxed text-[color:var(--color-ink)]/85">
          <p>
            I trained as an industrial designer — shaping physical products
            where constraints are unforgiving and every millimeter is
            negotiated. The same instincts translated cleanly to software:
            reducing cognitive load, fighting for clarity under pressure, and
            treating craft as the baseline, not the finish.
          </p>
          <p>
            Today I work as a Design Engineer — the person who designs the
            interface and ships the front-end. For early-stage teams that
            can&apos;t afford handoffs between three contractors, this is a
            meaningful difference: fewer meetings, tighter iterations, and
            interfaces that survive contact with real engineering.
          </p>
        </div>
      </section>

      {/* Recognition */}
      <section className="container-page px-6 md:px-10 pt-24 md:pt-32">
        <div className="grid gap-8 md:grid-cols-[220px_1fr] md:gap-16">
          <MetaLabel as="p" className="md:pt-3">
            Recognition
          </MetaLabel>
          <div>
            <h2 className="text-2xl md:text-3xl font-semibold tracking-tight max-w-2xl">
              Design recognition for industrial design work.
            </h2>
            <ul className="mt-10 divide-y divide-[color:var(--color-hairline)] border-y border-[color:var(--color-hairline)]">
              {awards.map((award) => (
                <li
                  key={award.name}
                  className="flex items-center gap-6 py-5 md:py-6"
                >
                  <div className="relative h-10 w-24 md:h-12 md:w-32 flex-shrink-0">
                    <Image
                      src={award.src}
                      alt={award.name}
                      fill
                      className="object-contain object-left"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[15px] font-medium truncate">
                      {award.name}
                    </p>
                    <p className="meta-text mt-1">{award.note}</p>
                  </div>
                  <span className="meta-text whitespace-nowrap">
                    {award.year}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* Selected ID work */}
      <section className="container-page px-6 md:px-10 pt-24 md:pt-32">
        <div className="grid gap-8 md:grid-cols-[220px_1fr] md:gap-16">
          <MetaLabel as="p" className="md:pt-3">
            Selected ID work
          </MetaLabel>
          <div>
            <h2 className="text-2xl md:text-3xl font-semibold tracking-tight max-w-2xl">
              A small slice of earlier industrial design projects.
            </h2>
            <div className="mt-10 grid gap-6 sm:grid-cols-2">
              {idProjects.map((project, idx) => (
                <div key={idx} className="card-flat overflow-hidden">
                  <div className="aspect-[4/3] bg-[#f4f4f4] flex items-center justify-center">
                    <MetaLabel>ID cover placeholder</MetaLabel>
                  </div>
                  <div className="px-6 py-5">
                    <h3 className="text-base font-semibold">{project.title}</h3>
                    <p className="meta-text mt-1">{project.note}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-10">
              <Link
                href="/industrial-design"
                className="link-klein text-[15px] font-medium"
              >
                See full industrial design portfolio →
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* How I Work */}
      <section className="container-page px-6 md:px-10 pt-24 md:pt-32">
        <div className="grid gap-8 md:grid-cols-[220px_1fr] md:gap-16 max-w-5xl">
          <MetaLabel as="p" className="md:pt-3">
            How I work
          </MetaLabel>
          <div className="space-y-5 text-lg leading-relaxed">
            <p>
              Small, frequent deliverables over long reveals. I work in
              running prototypes — not deck screenshots — so every decision is
              stress-tested against real interaction.
            </p>
            <p>
              Typical stack: Next.js, TypeScript, Tailwind, Figma. Comfortable
              picking up the right tool for the job.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
