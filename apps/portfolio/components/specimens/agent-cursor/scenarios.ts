/**
 * scenarios.ts — scripted "brain" for the agent-cursor specimen.
 *
 * Today this is pure data: each scenario is a hand-authored sequence of Steps.
 * The scenario runner in AgentCursorStage steps through them, switching console
 * sections and driving the AgentCursor to each target.
 *
 * FUTURE: replace scripted lookup with askLLM(question, elementMap) returning Step[]
 * Stub signature is at the bottom of this file.
 */

// ─── Target IDs ─────────────────────────────────────────────────────────────
// Every element the cursor might point at must carry data-target="<id>".
// Keep this union in sync with the data-target attributes in MockConsole.tsx.

export type TargetId =
  | "nav-overview"
  | "nav-environments"
  | "nav-api-keys"
  | "nav-team"
  | "nav-billing"
  | "nav-settings"
  | "region-badge"
  | "rotate-key"
  | "key-list-item-0"
  | "key-list-item-1"
  | "data-sharing-toggle"
  | "delete-env-button"
  | "env-status-badge"
  | "team-invite-button"
  | "billing-plan-badge";

// ─── Section IDs ─────────────────────────────────────────────────────────────
// Matches the `id` field in SECTION_DEFS inside MockConsole.tsx.
// A Step with a `section` field causes the runner to switch sections before
// traveling. Targets that only exist in a specific section MUST include section.

export type SectionId =
  | "overview"
  | "environments"
  | "api-keys"
  | "team"
  | "billing"
  | "settings";

// ─── Step & Scenario types ───────────────────────────────────────────────────

/**
 * A single cursor beat in a scenario.
 *
 * @field mode
 *   - "guide"  → cursor travels to the element, draws a pulsing ring
 *                around it, shows the text as a callout caption.
 *                The cursor does NOT interact; the human acts.
 *   - "answer" → cursor travels to the element, shows the text as a
 *                floating explanation chip (no ring). Pure information.
 *
 * @field targetId  Which element to travel to (see TargetId union).
 * @field section   Optional: if set, the runner switches to this section
 *                  before the cursor begins its travel. Required for any
 *                  target that only exists in one section.
 * @field text      Caption or answer copy shown by the cursor.
 */
export type Step = {
  mode: "guide" | "answer";
  targetId: TargetId;
  section?: SectionId;
  text: string;
  /** If set, this is a terminal "do it yourself" step: after pointing, the
   *  cursor WAITS for the user to actually click/interact with the target,
   *  then celebrates with `doneText`. This closes the loop — the human acts,
   *  the agent only pointed. */
  awaitAction?: boolean;
  /** Completion line shown when the user performs the awaited action. */
  doneText?: string;
};

export type Scenario = {
  id: string;
  question: string;
  steps: Step[];
};

// ─── Scripted scenarios ──────────────────────────────────────────────────────

export const SCENARIOS: Scenario[] = [
  // ── (a) High-stakes guide: rotate the API key ──────────────────────────
  {
    id: "rotate-api-key",
    question: "How do I rotate my API key?",
    steps: [
      {
        mode: "guide",
        targetId: "nav-api-keys",
        section: "api-keys",
        text: "First, head into API Keys.",
      },
      {
        mode: "guide",
        targetId: "rotate-key",
        section: "api-keys",
        text: "Here — Rotate key. The old key dies the instant you confirm, so you press it.",
        awaitAction: true,
        doneText: "Done — the old key is already dead. You pressed it, not me.",
      },
    ],
  },

  // ── (b) Answer/pop: explain the Region badge ───────────────────────────
  {
    id: "what-is-region",
    question: "What does Region mean?",
    steps: [
      {
        mode: "answer",
        targetId: "region-badge",
        section: "overview",
        text:
          "Region is the data centre your data lives in. It's fixed at creation — changing it means rebuilding the whole workspace.",
      },
    ],
  },

  // ── (c) Buried setting: turn off data sharing ─────────────────────────
  {
    id: "disable-data-sharing",
    question: "How do I turn off data sharing?",
    steps: [
      {
        mode: "guide",
        targetId: "nav-settings",
        section: "settings",
        text: "Open Settings, then scroll down to Privacy.",
      },
      {
        mode: "guide",
        targetId: "data-sharing-toggle",
        section: "settings",
        text: "Under Privacy → Usage Data. Flip this to stop sharing.",
        awaitAction: true,
        doneText: "Off. Sharing's stopped — and you're the one who flipped it.",
      },
    ],
  },
];

// ─── resolveQuestion ─────────────────────────────────────────────────────────
/**
 * Today: fuzzy/string matching over SCENARIOS by question text.
 * Returns the first scenario whose question string contains any keyword
 * from the user's query (case-insensitive).
 *
 * FUTURE: replace scripted lookup with askLLM(question, elementMap) returning Step[]
 * async function resolveQuestionLLM(question: string, elementMap: Record<TargetId, DOMRect>): Promise<Step[]>
 */
export function resolveQuestion(question: string): Scenario | null {
  const q = question.toLowerCase().trim();
  if (!q) return null;

  // Direct match first
  const direct = SCENARIOS.find((s) => s.question === question);
  if (direct) return direct;

  // Keyword overlap: score each scenario by how many words from the query
  // appear in the scenario's question string.
  const qWords = q.split(/\s+/);
  let bestScore = 0;
  let best: Scenario | null = null;

  for (const scenario of SCENARIOS) {
    const sq = scenario.question.toLowerCase();
    const score = qWords.filter((w) => sq.includes(w)).length;
    if (score > bestScore) {
      bestScore = score;
      best = scenario;
    }
  }

  // Require at least one keyword overlap, otherwise return first scenario
  // so the demo always has something to show.
  return best ?? SCENARIOS[0] ?? null;
}
