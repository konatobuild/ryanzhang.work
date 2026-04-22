import { HeroSection } from "@/components/sections/Hero";
import { ManifestoSection } from "@/components/sections/Manifesto";
import { HowItWorksSection } from "@/components/sections/HowItWorks";
import { CapabilitiesSection } from "@/components/sections/Capabilities";
import { BenchmarksSection } from "@/components/sections/Benchmarks";
import { PricingSection } from "@/components/sections/Pricing";
import { SiteFooter } from "@/components/sections/SiteFooter";

const BRAND = "LATTICE";

export default function LandingPage() {
  return (
    <>
      <HeroSection brand={BRAND} />
      <ManifestoSection />
      <HowItWorksSection />
      <CapabilitiesSection />
      <BenchmarksSection />
      <PricingSection />
      <SiteFooter brand={BRAND} />
    </>
  );
}
