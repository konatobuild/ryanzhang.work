import { HomeDeck } from "@/components/HomeDeck";

/*
 * Home — calling-card deck in industrial's slot grammar.
 *
 * Identity → macOS specimen (cinema-big) → component pairs (cinema-pair)
 * → colophon. Project-level entries (Selected Works, Featured Work grid)
 * have been removed from this surface — home now shows craft as the unit
 * of display, with project case studies living under /work/[slug] for
 * readers who arrive after they've already seen the work.
 *
 * The previous VerticalDeck (six facet/work cards) remains in the tree
 * for reference during the transition; it can be deleted once the new
 * structure is signed off.
 */
export default function Home() {
  return <HomeDeck />;
}
