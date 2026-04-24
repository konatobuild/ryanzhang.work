import type { Metadata } from "next";
import {
  Hero,
  Context,
  Approach,
  Showcase,
  BottomNav,
  type DesignDecision,
  type ShowcaseItem,
} from "@/components/case-study";

export const metadata: Metadata = {
  title: "LATTICE — Ryan Zhang",
  description:
    "A landing page for an imagined runtime control plane for production AI agents.",
};

const decisions: DesignDecision[] = [
  {
    title: "Signal, Noise.",
    body: "The headline splits the product's claim into two words — SIGNAL holds still, NOISE blurs — letting the page argue typographically before any copy takes over.",
  },
  {
    title: "Live background as diagram.",
    body: "The hero's animated grid isn't decoration; cells oscillate, the cursor pulls them toward the accent, and random cells flare red as anomalies — the product itself, running behind its own marketing.",
  },
  {
    title: "One weight, one accent.",
    body: "Every display heading sits at 400 against a single cyan — the restraint of an editorial spread, not the volume of a SaaS pitch.",
  },
];

const showcase: ShowcaseItem[] = [
  {
    heading: "Hero",
    caption: "Signal and Noise, the thesis as type.",
  },
  {
    heading: "Manifesto",
    caption: "The argument before the features.",
  },
  {
    heading: "Architecture",
    caption: "Four passes, one motif per step.",
  },
  {
    heading: "Deploy",
    caption: "Two surfaces, one binary.",
  },
];

export default function SaasLandingCaseStudy() {
  return (
    <div>
      <Hero
        title="LATTICE"
        description="A landing page for an imagined runtime control plane for production AI agents."
        meta={{
          role: "Design + engineering",
          timeline: "2026",
          type: "Personal project",
        }}
      />

      <Context body="LATTICE is a fictional product in the space between AI observability and runtime intervention — an imagined control plane that watches production agents and intercepts them before harm reaches a user. I treated the landing page as an editorial artifact rather than a growth-marketing asset: dense typography, a single accent color, and a live background that performs the product's claim instead of stating it." />

      <Approach decisions={decisions} />

      <Showcase items={showcase} />

      <BottomNav />
    </div>
  );
}
