import type { Metadata } from "next";
import { IndustrialDeck } from "@/components/IndustrialDeck";

// Canonical URL lives at industrial.ryanzhang.work (the subdomain). Both
// the /industrial-design path under the apex and the subdomain root render
// this page, but the subdomain is the authoritative URL; ryanzhang.work/
// industrial-design 308s here via next.config redirects.
export const metadata: Metadata = {
  title: "Industrial Design",
  description:
    "Industrial design work by Ryan Zhang — consumer products, Red Dot and international design recognition.",
  alternates: {
    canonical: "https://industrial.ryanzhang.work",
  },
  openGraph: {
    type: "website",
    url: "https://industrial.ryanzhang.work",
    title: "Industrial Design — Ryan Zhang",
    description:
      "Industrial design work by Ryan Zhang — consumer products, Red Dot and international design recognition.",
  },
};

export default function IndustrialDesignPage() {
  return <IndustrialDeck />;
}
