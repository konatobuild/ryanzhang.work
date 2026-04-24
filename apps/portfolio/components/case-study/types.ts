import type { ReactNode } from "react";

export interface CaseStudyMeta {
  role: string;
  timeline: string;
  type: string;
}

export interface DesignDecision {
  title: string;
  body: string;
}

export interface ShowcaseItem {
  heading: string;
  caption?: string;
  image?: {
    src: string;
    alt: string;
    width: number;
    height: number;
  };
}

export interface DesignToken {
  /** e.g. "Accent" or "Display face" */
  label: string;
  /** e.g. "#4AC9E4" or "Space Grotesk · 400" — rendered in mono */
  value?: string;
  /** One-line rationale for the choice. Museum-label brevity. */
  note?: string;
  /** Rendered visual — a color swatch, a type specimen, a hairline stroke, etc. */
  visual: ReactNode;
}

export interface CaseStudyNav {
  previous?: { slug: string; title: string };
  next?: { slug: string; title: string };
}
