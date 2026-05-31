import { GrammarBoard } from "../../../components/specimens/GrammarBoard";

export const metadata = {
  title: "Grammar board POC",
  robots: { index: false, follow: false },
};

export default function Page() {
  return (
    <main className="hero-morph-lab">
      <header>
        <h1>Grammar board POC</h1>
        <p>
          The eight Braun-grammar archetypes from{" "}
          <code>heroArchetypes.ts</code>, as a board with three verbs.{" "}
          <strong>Drag</strong> a card — it lifts, tilts and flings with inertia
          while the rest of the grid springs around it, iOS-springboard style;
          the rank badge re-ticks the instant a card crosses a slot.{" "}
          <strong>Sort</strong> the whole board by tone, primitive or era and
          every card springs into its new slot at once.{" "}
          <strong>Tap</strong> a card (a press that doesn&apos;t turn into a
          drag) to lift its artwork out into a detail panel via a shared-element
          morph, revealing the real object it abstracts. Hand-rolled FLIP +
          spring, no drag libraries. Honors{" "}
          <code>prefers-reduced-motion</code>.
        </p>
      </header>
      <figure>
        <GrammarBoard />
      </figure>
    </main>
  );
}
