import { AwardStrip } from "@/components/AwardStrip";
import { FeaturedWorkGrid } from "@/components/FeaturedWorkGrid";
import { ButtonLink } from "@/components/ui/Button";
import { MetaLabel } from "@/components/ui/MetaLabel";

export default function Home() {
  return (
    <div>
      {/* Hero */}
      <section className="container-page px-6 md:px-10 pt-16 md:pt-28 pb-20 md:pb-32">
        <MetaLabel as="p" className="mb-6">
          Ryan Zhang — Design + Front-End
        </MetaLabel>

        <h1 className="text-[44px] leading-[1.02] md:text-[96px] md:leading-[0.98] font-semibold tracking-[-0.04em] max-w-5xl">
          Design Engineer shipping{" "}
          <span className="text-[color:var(--color-klein)]">UX end-to-end</span>
          <span className="text-[color:var(--color-muted)]">.</span>
        </h1>

        <p className="mt-8 max-w-2xl text-lg md:text-xl text-[color:var(--color-muted)] leading-relaxed">
          I design and build product interfaces for early-stage and growing
          teams — interface, interaction, and front-end under one pair of
          hands. Based between the US and Asia; available for remote work.
        </p>

        <div className="mt-10 flex flex-wrap items-center gap-3">
          <ButtonLink href="#landing">View selected work →</ButtonLink>
          <ButtonLink href="/contact" variant="ghost">
            Get in touch
          </ButtonLink>
        </div>
      </section>

      {/* Featured Work */}
      <section className="container-page px-6 md:px-10">
        <FeaturedWorkGrid />
      </section>

      {/* Awards */}
      <section className="container-page px-6 md:px-10 pt-24 md:pt-32">
        <AwardStrip />
      </section>
    </div>
  );
}
