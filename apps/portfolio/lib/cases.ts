export type CaseCategory = "landing" | "web-app" | "mobile" | "ai-system";
export type CaseStatus = "placeholder" | "live";

/**
 * Tier governs where a case appears.
 * - "feature" — surfaces in the home-page vertical deck (strategic work).
 * - "study"   — surfaces only in /studies (interface explorations / range).
 *
 * See apps/portfolio/STRATEGY.md §5.3 for the rationale.
 */
export type CaseTier = "feature" | "study";

export interface CaseEntry {
  slug: string;
  title: string;
  /**
   * Short descriptor of the client vertical / scenario. One line, 4–8 words.
   * Shown under the title in Featured Work cards.
   */
  scenario: string;
  category: CaseCategory;
  status: CaseStatus;
  tier: CaseTier;
  /** Subdomain like `saas-demo` → https://saas-demo.ryanzhang.work */
  subdomain?: string;
  /** Full external URL — takes precedence over `subdomain` if present. */
  liveUrl?: string;
  /** GitHub repo URL for cases where the source is the artifact. */
  repoUrl?: string;
  /** Path under /public for the card cover, eg `/covers/saas-landing.jpg`. */
  coverImage?: string;
  /**
   * Per-case accent color used on hover highlights inside the card.
   * Falls back to portfolio Klein Blue when absent.
   */
  accent?: string;
  /** Plain-English one-liner used in Featured Work and case study hero. */
  summary?: string;
  /** Display year (string for flexibility, e.g. "2026" or "2025–26"). */
  year?: string;
  /** Build metadata shown inline on the case card. Keep terse. */
  buildMeta?: {
    framework?: string;
    notes?: string;
  };
}

export const CATEGORY_LABELS: Record<CaseCategory, string> = {
  landing: "Landing page",
  "web-app": "Web application",
  mobile: "Mobile",
  "ai-system": "AI system",
};

/**
 * Single source of truth for every case. The home-page deck filters to
 * `tier === "feature"`; /studies filters to `tier === "study"`.
 *
 * To promote a study to a feature: flip its `tier`, fill in `summary`,
 * `coverImage`, `liveUrl` (or `subdomain`), and create the matching
 * `/work/[slug]` route.
 */
export const cases: CaseEntry[] = [
  // ── FEATURE TIER ─────────────────────────────────────────────────────
  {
    slug: "stash",
    title: "Stash",
    scenario: "macOS Taste Library · in development",
    category: "ai-system",
    status: "placeholder",
    tier: "feature",
    year: "2026",
    summary:
      "A macOS taste library with retrieval architecture — the things you save become queryable design infrastructure.",
    buildMeta: {
      framework: "macOS native · Retrieval-augmented",
      notes: "Currently building · Solo",
    },
  },

  // ── STUDY TIER (range / explorations) ────────────────────────────────
  {
    slug: "gnovi",
    title: "AI chat with a draggable workspace",
    scenario: "Desktop AI workspace · Electron",
    category: "ai-system",
    status: "live",
    tier: "study",
    year: "2026",
    summary:
      "A desktop AI chat where every surface is a drag source and the AI can drive an inline browser.",
    buildMeta: {
      framework: "Electron 34 · React 19 · Multi-provider",
      notes: "Snapshot · Feb 2026 · Exploration",
    },
  },
  {
    slug: "saas-landing",
    title: "Seed-stage SaaS launch page",
    scenario: "Early-stage B2B SaaS",
    category: "landing",
    status: "placeholder",
    tier: "study",
  },
  {
    slug: "legal-landing",
    title: "Small firm, serious intake",
    scenario: "Boutique law firm",
    category: "landing",
    status: "placeholder",
    tier: "study",
  },
  {
    slug: "commerce-landing",
    title: "Commerce platform, fully briefed",
    scenario: "Payments / commerce platform",
    category: "landing",
    status: "placeholder",
    tier: "study",
  },
  {
    slug: "professional-landing",
    title: "Professional services, clarified",
    scenario: "Consulting / agency",
    category: "landing",
    status: "placeholder",
    tier: "study",
  },
  {
    slug: "devtools-landing",
    title: "Developer-tools launch page",
    scenario: "Developer-tools SaaS",
    category: "landing",
    status: "placeholder",
    tier: "study",
  },
  {
    slug: "legal-intake",
    title: "Client intake that doesn't feel like a form",
    scenario: "Law firm / medical clinic",
    category: "web-app",
    status: "placeholder",
    tier: "study",
  },
  {
    slug: "logistics-dashboard",
    title: "Fleet operations dashboard",
    scenario: "B2B ops — logistics & warehousing",
    category: "web-app",
    status: "placeholder",
    tier: "study",
  },
  {
    slug: "analytics-tool",
    title: "Analytics surface for a SaaS product",
    scenario: "Product-led growth tool",
    category: "web-app",
    status: "placeholder",
    tier: "study",
  },
  {
    slug: "consumer-app",
    title: "Consumer mobile experience",
    scenario: "Health & lifestyle",
    category: "mobile",
    status: "placeholder",
    tier: "study",
  },
  {
    slug: "mobile-web",
    title: "Mobile-first content experience",
    scenario: "D2C / editorial",
    category: "mobile",
    status: "placeholder",
    tier: "study",
  },
  {
    slug: "saas-dashboard",
    title: "Accounts workspace for a CS team",
    scenario: "Customer success / accounts",
    category: "web-app",
    status: "placeholder",
    tier: "study",
  },
  {
    slug: "finance-app",
    title: "Personal finance planner",
    scenario: "Consumer fintech / goal planning",
    category: "mobile",
    status: "placeholder",
    tier: "study",
  },
  {
    slug: "freelancer-app",
    title: "Freelancer marketplace, pocket-sized",
    scenario: "Two-sided marketplace — mobile",
    category: "mobile",
    status: "placeholder",
    tier: "study",
  },
  {
    slug: "banking-app",
    title: "Digital banking, in your pocket",
    scenario: "Consumer fintech — mobile",
    category: "mobile",
    status: "placeholder",
    tier: "study",
  },
  {
    slug: "voice-recorder",
    title: "Voice recorder with live transcription",
    scenario: "Creator / productivity utility — mobile",
    category: "mobile",
    status: "placeholder",
    tier: "study",
  },
  {
    slug: "energy-app",
    title: "Home energy monitor",
    scenario: "Consumer IoT — solar & battery",
    category: "mobile",
    status: "placeholder",
    tier: "study",
  },
  {
    slug: "appointment-calendar",
    title: "Editorial appointment calendar",
    scenario: "Wellness & salon scheduling SaaS",
    category: "web-app",
    status: "placeholder",
    tier: "study",
  },
  {
    slug: "contacts-app",
    title: "Personal CRM for founders",
    scenario: "Relationship tracker — founder/exec",
    category: "web-app",
    status: "placeholder",
    tier: "study",
  },
];

/** Convenience: feature-tier cases, in declaration order. */
export const featureCases = cases.filter((c) => c.tier === "feature");

/** Convenience: study-tier cases, in declaration order. */
export const studyCases = cases.filter((c) => c.tier === "study");

export function getCaseHref(entry: CaseEntry): string | null {
  if (entry.status !== "live") return null;
  if (entry.liveUrl) return entry.liveUrl;
  return `/work/${entry.slug}`;
}
