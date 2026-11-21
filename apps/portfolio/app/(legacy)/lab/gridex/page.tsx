import Link from "next/link";
import GridexHeroStage from "@/components/specimens/gridex/GridexHeroStage";
import GridexExplodedStage from "@/components/specimens/gridex/GridexExplodedStage";

export const metadata = {
  title: "Gridex home hero — a design note",
  description:
    "How I tried to show an AI product's capability without the usual glow or industry photos: a legible, cursor-led workspace you can just watch. Lifted out of the Gridex home page and shown on its own.",
};

export default function Page() {
  return (
    <main
      style={{
        minHeight: "100vh",
        padding: "var(--space-9) 64px var(--space-9)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: "var(--space-8)",
      }}
    >
      <header style={{ width: "100%", maxWidth: 760 }}>
        <Link
          href="/"
          style={{
            fontFamily: "var(--font-geist-mono)",
            fontSize: 12,
            letterSpacing: "0.14em",
            textTransform: "uppercase",
            color: "var(--color-gray-11)",
            textDecoration: "none",
          }}
        >
          ← Back home
        </Link>
        <p
          style={{
            marginTop: "var(--space-6)",
            fontFamily: "var(--font-geist-mono)",
            fontSize: 12,
            letterSpacing: "0.14em",
            textTransform: "uppercase",
            color: "var(--color-gray-11)",
          }}
        >
          Design note · Gridex home hero
        </p>
        <h1
          style={{
            margin: "var(--space-3) 0 0",
            fontSize: "clamp(36px, 5vw, 60px)",
            lineHeight: 1.04,
            letterSpacing: "-0.02em",
            color: "var(--color-gray-12)",
          }}
        >
          An interface you can just watch
        </h1>
        <p
          style={{
            margin: "var(--space-5) 0 0",
            maxWidth: 620,
            fontSize: "var(--fs-18, 18px)",
            lineHeight: 1.5,
            color: "var(--color-gray-11)",
          }}
        >
          Most AI companies prove themselves two ways: line up photos of
          whatever industry they sell into, or wrap the screen in glow, glass,
          and gradients. Both buy the same feeling—new, technical—and neither
          tells you what the product actually does. The over-engineered
          alternative isn&rsquo;t any better: an architecture diagram with every
          box and arrow. I wanted a third option—a visual that shows there are
          agents and that there&rsquo;s design behind them, yet stays legible to
          someone who doesn&rsquo;t follow AI. They should be able to just watch
          it and understand the work.
        </p>
        <p
          style={{
            margin: "var(--space-4) 0 0",
            maxWidth: 620,
            fontSize: "var(--fs-18, 18px)",
            lineHeight: 1.5,
            color: "var(--color-gray-11)",
          }}
        >
          The way in was the cursor. So the home hero is something you read over
          someone&rsquo;s shoulder: cursors pick up real tasks—an email, a Slack
          thread, a voice note, a contract, a reconciliation sheet—work them,
          and log each result to a running pile. I lifted the whole thing out of
          the product and set it on neutral ground so the craft can be read on
          its own.
        </p>
      </header>

      <div
        style={{
          alignSelf: "center",
          padding: "var(--space-7)",
          borderRadius: 16,
          background:
            "radial-gradient(circle at 20% 30%, rgba(215,235,117,0.05) 0%, transparent 50%), radial-gradient(circle at 80% 70%, rgba(183,146,100,0.04) 0%, transparent 50%), #1c2b27",
          border: "1px solid rgba(244,239,226,0.1)",
          boxShadow: "0 24px 60px -28px rgba(28,43,39,0.45)",
        }}
      >
        <GridexHeroStage />
      </div>

      <section style={{ width: "100%", maxWidth: 760 }}>
        <p
          style={{
            fontFamily: "var(--font-geist-mono)",
            fontSize: 12,
            letterSpacing: "0.14em",
            textTransform: "uppercase",
            color: "var(--color-gray-11)",
          }}
        >
          What I decided, and why
        </p>

        <dl
          style={{
            margin: "var(--space-6) 0 0",
            display: "flex",
            flexDirection: "column",
            gap: "var(--space-7)",
          }}
        >
          {[
            {
              term: "A cursor, not a diagram",
              detail:
                "The cursor is the one piece of an interface everyone already knows how to read. Borrow it and the scene explains itself: you watch a hand pick something up, do something to it, and set it down. No legend, no onboarding, no AI vocabulary required.",
            },
            {
              term: "Real tasks, named plainly",
              detail:
                "Each card is a job you'd recognize from your own week—an email to answer, a Slack thread to catch up on, a voice note to write down, a contract to check, a sheet to reconcile. Recognizable inputs carry the meaning that an “our AI does X” headline usually has to spell out.",
            },
            {
              term: "Paper, not glow",
              detail:
                "The palette is paper, sage, and a single lime accent—no glass, no gradient, no product-shot lighting. The restraint is the argument: if the work is legible, it doesn't need the packaging to feel new.",
            },
            {
              term: "The pile is the proof",
              detail:
                "Every finished task drops a receipt onto a growing stack, and that stack is the only metric on screen. It says the agents are actually producing—without a chart, a counter, or a claim.",
            },
          ].map((note) => (
            <div key={note.term}>
              <dt
                style={{
                  fontSize: "var(--fs-20, 20px)",
                  letterSpacing: "-0.01em",
                  color: "var(--color-gray-12)",
                }}
              >
                {note.term}
              </dt>
              <dd
                style={{
                  margin: "var(--space-3) 0 0",
                  maxWidth: 620,
                  fontSize: "var(--fs-18, 18px)",
                  lineHeight: 1.5,
                  color: "var(--color-gray-11)",
                }}
              >
                {note.detail}
              </dd>
            </div>
          ))}
        </dl>
      </section>

      <section style={{ width: "100%", maxWidth: 760 }}>
        <p
          style={{
            fontFamily: "var(--font-geist-mono)",
            fontSize: 12,
            letterSpacing: "0.14em",
            textTransform: "uppercase",
            color: "var(--color-gray-11)",
          }}
        >
          The same desk, pulled apart
        </p>
        <p
          style={{
            margin: "var(--space-4) 0 0",
            maxWidth: 620,
            fontSize: "var(--fs-18, 18px)",
            lineHeight: 1.5,
            color: "var(--color-gray-11)",
          }}
        >
          One more way to read it. The dashed outlines are where each surface
          sits in the assembled scene; above them, the slots an agent rotates
          through fan out into the stack of tools it actually picks up. The three
          cursors keep working through the layers—each one riding its own loop of
          surfaces.
        </p>
      </section>

      <div
        style={{
          alignSelf: "center",
          width: "100%",
          maxWidth: 900,
          minHeight: 840,
          padding: "var(--space-8) var(--space-7)",
          borderRadius: 16,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background:
            "radial-gradient(circle at 20% 30%, rgba(215,235,117,0.05) 0%, transparent 50%), radial-gradient(circle at 80% 70%, rgba(183,146,100,0.04) 0%, transparent 50%), #1c2b27",
          boxShadow: "0 24px 60px -28px rgba(28,43,39,0.45)",
          overflow: "hidden",
        }}
      >
        <GridexExplodedStage />
      </div>
    </main>
  );
}
