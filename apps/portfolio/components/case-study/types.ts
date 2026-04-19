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

export interface CaseStudyNav {
  previous?: { slug: string; title: string };
  next?: { slug: string; title: string };
}
