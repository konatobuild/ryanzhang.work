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
import { MetaLabel } from "@/components/ui/MetaLabel";

export const metadata: Metadata = {
  title: "Template preview",
  description:
    "Internal template preview — not a real case study. Used to visually QA the /work/[slug] layout before real cases are built.",
  robots: { index: false, follow: false },
};

const decisions: DesignDecision[] = [
  {
    title: "Single operational view over tabbed navigation",
    body: "Dispatchers during an incident response need to see live driver locations, route status, and fuel reports simultaneously. Tabs would hide critical streams at the worst moment. The tradeoff is higher visual density — accepted because the operator uses this screen for 6+ hours a day and density is legible under repeated exposure.",
  },
  {
    title: "Treat alerts as first-class citizens, not a notification tray",
    body: "Alerts surface inline, pinned to the data stream that produced them. Operators never have to context-switch to a separate alerts list. A muted tray exists for completed alerts, but open alerts stay with their source.",
  },
  {
    title: "Keep keyboard-first affordances even in a mouse-dominant tool",
    body: "Power users rapidly toggle between vehicles. Every vehicle row has a shortcut, every drawer closes on escape, and the command palette can search across drivers, routes, and recent incidents.",
  },
  {
    title: "Hold the Klein Blue accent to signals of state change only",
    body: "Color here is a scarce resource. The product is monochrome for clarity; the accent is reserved for state changes (new alert, newly-assigned route, live vehicle selection). Used sparingly, it stays legible. Used everywhere, it stops meaning anything.",
  },
];

const showcase: ShowcaseItem[] = [
  {
    heading: "Primary dashboard",
    caption:
      "Three synchronized streams — map, route table, fuel snapshot — pinned into a single operational view.",
  },
  {
    heading: "Driver detail drawer",
    caption:
      "Opens in place without losing map context. Keyboard-dismissible; mouse-friendly for incident escalation.",
  },
  {
    heading: "Alerts inline",
    caption:
      "Alerts attach to the data stream that produced them. Muted tray exists for cleared items; open alerts stay in situ.",
  },
];

export default function SampleCaseStudy() {
  return (
    <div>
      <div className="container-page px-6 md:px-10 pt-8">
        <div className="card-flat px-5 py-3 flex items-center gap-3">
          <MetaLabel style={{ color: "var(--color-klein)" }}>
            ◌ Template preview
          </MetaLabel>
          <span className="text-sm text-[color:var(--color-muted)]">
            Not a real case — this route exists only to QA the case-study
            layout.
          </span>
        </div>
      </div>

      <Hero
        title="Fleet operations dashboard for a mid-size logistics company"
        description="A single operational view consolidating driver locations, route status, and fuel telemetry so dispatchers stop switching between three systems during incident response."
        meta={{
          role: "Design + Engineering",
          timeline: "2 weeks",
          type: "Concept project",
        }}
        isConcept
      />

      <Context
        body="A mid-size logistics company's dispatcher was switching between three systems daily to check driver locations, route status, and fuel reports. In an incident, the cost of that context-switching compounded. This concept consolidates those streams into a single operational view tuned for the first ninety seconds after something goes wrong."
      />

      <Approach decisions={decisions} />

      <Showcase items={showcase} />

      <BottomNav
        nav={{
          previous: {
            slug: "sample",
            title: "This is a template preview",
          },
          next: {
            slug: "sample",
            title: "No next case yet",
          },
        }}
      />
    </div>
  );
}
