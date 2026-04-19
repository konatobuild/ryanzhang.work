import type { Metadata } from "next";
import Image from "next/image";
import { MetaLabel } from "@/components/ui/MetaLabel";
import { ButtonLink } from "@/components/ui/Button";

export const metadata: Metadata = {
  title: "Industrial Design",
  description:
    "Industrial design work by Ryan Zhang — consumer products, Red Dot and international design recognition.",
};

const awards = [
  {
    src: "/awards/red-dot-concept-2025.png",
    name: "Red Dot Design Concept",
    year: "2025",
    tier: "Winner",
    project: "Project name — TODO fill",
  },
  {
    src: "/awards/muse-gold.png",
    name: "MUSE Design Awards",
    year: "2025",
    tier: "Gold",
    project: "Project name — TODO fill",
  },
  {
    src: "/awards/ny-product-silver.jpg",
    name: "NY Product Design Awards",
    year: "2025",
    tier: "Silver",
    project: "Project name — TODO fill",
  },
  {
    src: "/awards/london-silver.png",
    name: "London Design Awards",
    year: "2025",
    tier: "Silver",
    project: "Project name — TODO fill",
  },
];

const projects = [
  { title: "ID project 01", note: "Consumer product — TODO" },
  { title: "ID project 02", note: "Lifestyle product — TODO" },
  { title: "ID project 03", note: "Concept study — TODO" },
  { title: "ID project 04", note: "Award-winning — TODO" },
];

export default function IndustrialDesignPage() {
  return (
    <div className="pt-16 md:pt-24 pb-24">
      {/* Hero */}
      <section className="container-page px-6 md:px-10 max-w-5xl">
        <MetaLabel as="p" className="mb-6">
          Industrial Design — Ryan Zhang
        </MetaLabel>
        <h1 className="text-4xl md:text-7xl font-semibold tracking-[-0.03em] leading-[1.03]">
          Consumer products,{" "}
          <span className="text-[color:var(--color-klein)]">
            designed for daily life.
          </span>
        </h1>
        <p className="mt-8 max-w-3xl text-lg md:text-xl text-[color:var(--color-muted)] leading-relaxed">
          Selected industrial design work across consumer electronics,
          lifestyle, and concept studies. Recognized by Red Dot, MUSE, NY
          Product Design Awards, and London Design Awards.
        </p>
      </section>

      {/* Awards (expanded display) */}
      <section className="container-page px-6 md:px-10 pt-24 md:pt-32">
        <MetaLabel as="p" className="mb-8">
          Awards
        </MetaLabel>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {awards.map((award) => (
            <div key={award.name} className="card-flat p-6 md:p-8">
              <div className="relative h-20 mb-6">
                <Image
                  src={award.src}
                  alt={award.name}
                  fill
                  className="object-contain object-left"
                />
              </div>
              <MetaLabel as="p" className="mb-2">
                {award.year} · {award.tier}
              </MetaLabel>
              <p className="text-base font-semibold leading-snug">
                {award.name}
              </p>
              <p className="text-sm text-[color:var(--color-muted)] mt-2">
                {award.project}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Projects */}
      <section className="container-page px-6 md:px-10 pt-24 md:pt-32">
        <div className="mb-10 flex items-end justify-between gap-6">
          <div>
            <MetaLabel as="p" className="mb-2">
              Projects
            </MetaLabel>
            <h2 className="text-3xl md:text-5xl font-semibold tracking-tight">
              Selected work
            </h2>
          </div>
        </div>

        <div className="grid gap-6 md:gap-8 sm:grid-cols-2">
          {projects.map((project, idx) => (
            <article key={idx} className="card overflow-hidden">
              <div className="aspect-[4/3] bg-[#f4f4f4] flex items-center justify-center">
                <MetaLabel>Hero photo — TODO</MetaLabel>
              </div>
              <div className="p-6 md:p-8">
                <MetaLabel className="mb-2">
                  {String(idx + 1).padStart(2, "0")}
                </MetaLabel>
                <h3 className="text-xl md:text-2xl font-semibold tracking-tight">
                  {project.title}
                </h3>
                <p className="text-sm text-[color:var(--color-muted)] mt-2">
                  {project.note}
                </p>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* Contact CTA */}
      <section className="container-page px-6 md:px-10 pt-24 md:pt-32">
        <div className="card px-8 py-14 md:px-14 md:py-20 flex flex-col items-center text-center gap-6">
          <MetaLabel as="p">Industrial design inquiries</MetaLabel>
          <h2 className="text-3xl md:text-5xl font-semibold tracking-tight max-w-3xl">
            Have a product brief? I&apos;d like to hear about it.
          </h2>
          <ButtonLink href="mailto:ryan.runsheng@gmail.com">
            Reach out →
          </ButtonLink>
        </div>
      </section>
    </div>
  );
}
