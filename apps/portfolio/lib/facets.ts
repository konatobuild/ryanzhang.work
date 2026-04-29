import { cases, type CaseEntry } from "./cases";

/**
 * Facets — three personal-quality narratives shown as Cards 2–4 of the
 * VerticalDeck and expanded as full pages under /facets/[slug].
 *
 * Each facet is a claim about *me* (not about a product), with project
 * evidence drawn from cases.ts plus side evidence (awards, influences,
 * external projects, repos, writing) declared inline below.
 *
 * Cases declare their own membership via `facet` + `facetRole` in
 * cases.ts; this file only carries facet metadata + non-case evidence.
 */

export type FacetSlug = "interaction" | "ai-systems" | "taste-formation";

export type FacetRole = "primary" | "supporting";

export type SideEvidenceType =
  | "award"
  | "influence"
  | "repo"
  | "writing"
  | "external-project";

export interface FacetSideEvidence {
  type: SideEvidenceType;
  title: string;
  titleZh?: string;
  year?: string;
  /** External URL where applicable. */
  source?: string;
  /** One-line description; placeholder text is acceptable. */
  description?: string;
}

export interface FacetCalibratingAsset {
  kind: "video" | "image" | "diagram" | "collage";
  /** Path under /public; optional during placeholder phase. */
  src?: string;
  alt: string;
}

export interface FacetMeta {
  slug: FacetSlug;
  /** 1-based ordinal; renders as "01", "02", "03" on the surface card. */
  index: number;
  total: number;

  // Surface card copy (rendered on home VerticalDeck card)
  /** English headline — primary voice on the card. */
  title: string;
  /** Chinese subhead — runs beneath the English headline. */
  titleZh: string;
  /** One-line body copy beneath the headline. */
  subhead: string;
  cta: string;

  /** Calibrating visual on the surface card; optional during placeholder phase. */
  calibratingAsset?: FacetCalibratingAsset;

  // Detail-page copy (placeholders — user authors these in their own voice)
  /** First-person opener paragraph for the facet detail page. */
  opener: string;
  /** Formation paragraph: when/why this quality took shape. */
  formation: string;
  /** Closing paragraph: what's next in this direction. */
  closing: string;

  /**
   * Side evidence that isn't a CaseEntry — awards, influences, external
   * projects, repos, writings. Project evidence comes from cases.ts via
   * the `facet` field and is resolved by `getCasesForFacet`.
   */
  sideEvidence: FacetSideEvidence[];
}

export const facets: FacetMeta[] = [
  {
    slug: "interaction",
    index: 1,
    total: 3,
    title: "I keep refusing the default interaction.",
    titleZh: "我对交互形式不安分。",
    subhead:
      "Drag flows, draggable AI canvases, custom gesture surfaces — and I build them myself in code.",
    cta: "How I push interaction →",
    opener:
      "[待你亲笔填] 第一人称开场：我从什么时候开始拒绝默认交互的？我反复在追问的那个问题是什么？",
    formation:
      "[待你亲笔填] 形成段：哪些项目、哪些瞬间、哪些影响让我成为这样的设计师？特别是为什么我执意要自己写代码把它们做出来？",
    closing:
      "[待你亲笔填] 收束：在这个方向上接下来想推到哪里？",
    sideEvidence: [
      {
        type: "external-project",
        title: "Draggable info-flow recording",
        titleZh: "拖拽式信息流录屏",
        description:
          "[待你亲笔填: 一句说明 — 它在你这套交互探索里的位置]",
      },
      {
        type: "external-project",
        title: "AI Chat with draggable flow",
        titleZh: "AI Chat 拖拽流",
        description:
          "[待你亲笔填: 一句说明 — 你在这件事里干了什么]",
      },
    ],
  },
  {
    slug: "ai-systems",
    index: 2,
    total: 3,
    title: "I design AI as a system, not as a skin.",
    titleZh: "我把 AI 当系统设计，不是当皮肤贴。",
    subhead:
      "Workflow pipelines, retrieval layers, middle layers — designer thinking applied above the model and below the chat.",
    cta: "How I think about AI systems →",
    opener:
      "[待你亲笔填] 第一人称开场：作为设计师，我说「系统性地思考 AI」是什么意思？为什么我不满足于做「AI 皮肤」？",
    formation:
      "[待你亲笔填] 形成段：ADA 是怎么开始的？AI 视频 SaaS 里我把工作流编排做到哪一步？Stash 的检索层在我脑子里是怎么组织的？",
    closing:
      "[待你亲笔填] 收束：模型之上、对话之下，这一层接下来还想做什么？",
    sideEvidence: [
      {
        type: "external-project",
        title: "ADA — middle layer for AI",
        titleZh: "ADA · AI 的中间层",
        description:
          "[待你亲笔填: 一段话讲清楚 ADA 是什么、为什么它代表了「系统性思考」]",
      },
      {
        type: "external-project",
        title: "AI video pipeline (SaaS)",
        titleZh: "AI 视频模型 SaaS",
        description:
          "[待你亲笔填: 一段话讲清楚 — 表面是 SaaS，底下是工作流编排]",
      },
    ],
  },
  {
    slug: "taste-formation",
    index: 3,
    total: 3,
    title: "My taste was formed across three disciplines.",
    titleZh: "我的审美是在三个学科里长出来的。",
    subhead:
      "Industrial design, graphic design, and code — plus awards along the way, and Jobs as the person who first showed me what care looks like.",
    cta: "How my taste was built →",
    opener:
      "[待你亲笔填] 第一人称开场：把工业设计 / 平面 / 代码这三条线一句话点出来。",
    formation:
      "[待你亲笔填] 形成段：这三条线发生的顺序、各自教会我什么、它们之间是怎么互相喂养的、Jobs 在哪一刻出现并改变了什么。",
    closing:
      "[待你亲笔填] 收束：「审美」对今天的我意味着什么？",
    sideEvidence: [
      {
        type: "influence",
        title: "Steve Jobs",
        titleZh: "乔布斯",
        description:
          "[待你亲笔填: 一段话 — 他作为启蒙者在你身上留下了什么]",
      },
      // 奖项从 lib/awards.ts 流入 detail 页面，这里不重复列举
    ],
  },
];

/* ─── Resolution helpers ──────────────────────────────────────────── */

export function getFacet(slug: FacetSlug): FacetMeta | undefined {
  return facets.find((f) => f.slug === slug);
}

/**
 * Resolves project evidence for a facet by reading `facet` + `facetRole`
 * from cases.ts. Single source of truth: each case declares its own
 * facet membership; this function aggregates.
 */
export function getCasesForFacet(slug: FacetSlug): {
  primary: CaseEntry[];
  supporting: CaseEntry[];
} {
  const all = cases.filter((c) => c.facet === slug);
  return {
    primary: all.filter((c) => c.facetRole === "primary"),
    supporting: all.filter((c) => c.facetRole === "supporting"),
  };
}
