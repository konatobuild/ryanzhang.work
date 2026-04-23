export type CaseCategory = "landing" | "web-app" | "mobile";
export type CaseStatus = "placeholder" | "live";

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
  /** Subdomain like `saas-demo` → https://saas-demo.ryanzhang.work */
  subdomain?: string;
  /** Full external URL — takes precedence over `subdomain` if present. */
  liveUrl?: string;
  /** Path under /public for the card cover, eg `/covers/saas-landing.jpg`. */
  coverImage?: string;
  /**
   * Per-case accent color used on hover highlights inside the card.
   * Falls back to portfolio Klein Blue when absent.
   */
  accent?: string;
  /** Plain-English one-liner used in Featured Work and case study hero. */
  summary?: string;
}

export const CATEGORY_LABELS: Record<CaseCategory, string> = {
  landing: "Landing page",
  "web-app": "Web application",
  mobile: "Mobile",
};

/**
 * Single source of truth for the Featured Work grid on `/`.
 *
 * To surface a new case:
 * 1. Flip `status` from "placeholder" to "live".
 * 2. Fill `summary`, `subdomain` (or `liveUrl`), `coverImage`, and optional `accent`.
 * 3. Create the corresponding `/work/[slug]` route in `app/work/`.
 *
 * Do NOT batch-edit all nine at once — see root README §"Adding a new demo".
 */
export const cases: CaseEntry[] = [
  {
    slug: "saas-landing",
    title: "Seed-stage SaaS launch page",
    scenario: "Early-stage B2B SaaS",
    category: "landing",
    status: "placeholder",
  },
  {
    slug: "legal-landing",
    title: "Small firm, serious intake",
    scenario: "Boutique law firm",
    category: "landing",
    status: "placeholder",
  },
  {
    slug: "d2c-landing",
    title: "Product story, sold",
    scenario: "Direct-to-consumer brand",
    category: "landing",
    status: "placeholder",
  },
  {
    slug: "professional-landing",
    title: "Professional services, clarified",
    scenario: "Consulting / agency",
    category: "landing",
    status: "placeholder",
  },
  {
    slug: "legal-intake",
    title: "Client intake that doesn't feel like a form",
    scenario: "Law firm / medical clinic",
    category: "web-app",
    status: "placeholder",
  },
  {
    slug: "logistics-dashboard",
    title: "Fleet operations dashboard",
    scenario: "B2B ops — logistics & warehousing",
    category: "web-app",
    status: "placeholder",
  },
  {
    slug: "analytics-tool",
    title: "Analytics surface for a SaaS product",
    scenario: "Product-led growth tool",
    category: "web-app",
    status: "placeholder",
  },
  {
    slug: "consumer-app",
    title: "Consumer mobile experience",
    scenario: "Health & lifestyle",
    category: "mobile",
    status: "placeholder",
  },
  {
    slug: "mobile-web",
    title: "Mobile-first content experience",
    scenario: "D2C / editorial",
    category: "mobile",
    status: "placeholder",
  },
  {
    slug: "saas-dashboard",
    title: "Accounts workspace for a CS team",
    scenario: "Customer success / accounts",
    category: "web-app",
    status: "placeholder",
  },
  {
    slug: "finance-app",
    title: "Personal finance planner",
    scenario: "Consumer fintech / goal planning",
    category: "mobile",
    status: "placeholder",
  },
  {
    slug: "freelancer-app",
    title: "Freelancer marketplace, pocket-sized",
    scenario: "Two-sided marketplace — mobile",
    category: "mobile",
    status: "placeholder",
  },
  {
    slug: "banking-app",
    title: "Digital banking, in your pocket",
    scenario: "Consumer fintech — mobile",
    category: "mobile",
    status: "placeholder",
  },
  {
    slug: "voice-recorder",
    title: "Voice recorder with live transcription",
    scenario: "Creator / productivity utility — mobile",
    category: "mobile",
    status: "placeholder",
  },
];

export function getCaseHref(entry: CaseEntry): string | null {
  if (entry.status !== "live") return null;
  if (entry.liveUrl) return entry.liveUrl;
  return `/work/${entry.slug}`;
}
