import Link from "next/link";
import { AgentCursorStage } from "../../../components/specimens/agent-cursor/AgentCursorStage";

export const metadata = {
  title: "Point, don't tell — a design note",
  description:
    "A help pattern for SaaS: instead of a chatbox or a wall of FAQ text, an assistant embodied as a cursor travels to the real control and either explains it in place or points the way. You stay in control — it points, you act.",
  robots: { index: false, follow: false },
};

const LEAD_1 =
  "When you're lost in a product, help shows up three ways today. A wall of FAQ text. A support bot that types “go to Settings → Privacy → turn off Usage Data” and leaves you to hunt for it. Or an AI agent that takes the wheel and does it for you — so you never learn where anything is, and you're not the one who pressed the button.";

const LEAD_2 =
  "I wanted a fourth. An assistant that doesn't talk at you from a side panel, but inhabits the one thing everyone already knows how to read — the cursor. You ask; it travels to the actual control and either explains it in place or rings it and says “this is it — you press it.” Because its answer is always a real spot on the screen, it can't hallucinate a location the way a chatbot can. And because it points instead of acts, you stay in control.";

const DECISIONS: { term: string; detail: string }[] = [
  {
    term: "A cursor, not a chatbox",
    detail:
      "Everyone already knows how to read a cursor. Borrow it and the help explains itself — you watch it go to the thing and stop. No paragraph to read and translate back into clicks. It doesn't teleport, either: you see it decide and travel, so where the answer lives is something you watch, not something you parse.",
  },
  {
    term: "Point, don't do",
    detail:
      "It guides; you act. The opposite of an agent that takes the wheel — you keep your hands on your own product, you learn where things live, and for anything irreversible you're the one who commits.",
  },
  {
    term: "Grounded, so it can't lie about where",
    detail:
      "It can only point at elements that are really on the screen. The answer is a place, not a claim — so it physically can't send you to a button that doesn't exist, the way a chatbot confidently can.",
  },
  {
    term: "Answer or guide — never a wall of text",
    detail:
      "Two moves only: pop a one-line answer beside the thing (“what is this?”), or travel to it and ring it (“where do I…?”). The agent picks the move; you never parse a reply.",
  },
];

export default function Page() {
  return (
    <main className="ac-lab">
      <header className="ac-lab__header">
        <Link href="/" className="ac-lab__back">
          &larr; Back home
        </Link>
        <p className="ac-lab__eyebrow">Design note &middot; The guide cursor</p>
        <h1 className="ac-lab__title">Point, don&rsquo;t tell</h1>
        <p className="ac-lab__lead">{LEAD_1}</p>
        <p className="ac-lab__lead">{LEAD_2}</p>
      </header>

      <div className="ac-lab__stage">
        <AgentCursorStage />
      </div>

      <section className="ac-lab__notes">
        <p className="ac-lab__eyebrow">What I decided, and why</p>
        <dl className="ac-lab__decisions">
          {DECISIONS.map((note) => (
            <div className="ac-lab__decision" key={note.term}>
              <dt>{note.term}</dt>
              <dd>{note.detail}</dd>
            </div>
          ))}
        </dl>
      </section>
    </main>
  );
}
