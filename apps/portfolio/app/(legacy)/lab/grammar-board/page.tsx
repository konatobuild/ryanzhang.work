import { GrammarBoard } from "@/components/specimens/GrammarBoard";

export const metadata = {
  title: "Grammar board",
  robots: { index: false, follow: false },
};

export default function Page() {
  return (
    <main className="hero-morph-lab">
      <header>
        <h1>Grammar board</h1>
        <p>
          Eight glyphs abstracted from the control surfaces of classic
          products, as a board with three verbs. <strong>Drag</strong> a card:
          it lifts, tilts and can be thrown, while the rest of the grid springs
          around it and its number changes the moment it crosses a slot.{" "}
          <strong>Sort</strong> the board by tone, primitive or era and every
          card springs to its new place at once. <strong>Tap</strong> a card to
          lift its drawing into a panel that names the object it abstracts. The
          springs and the layout animation are written by hand, with no drag
          library, and the board honours reduced motion.
        </p>
      </header>
      <figure>
        <GrammarBoard />
      </figure>
    </main>
  );
}
