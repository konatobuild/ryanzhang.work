import { HomeDeck } from "@/components/HomeDeck";

/*
 * Home — calling-card deck in industrial's slot grammar.
 *
 * Identity → macOS specimen (cinema-big) → component pairs (cinema-pair)
 * → colophon. Project-level entries (Selected Works, Featured Work grid)
 * have been removed from this surface — home now shows craft as the unit
 * of display, with project case studies living under /work/[slug] for
 * readers who arrive after they've already seen the work.
 */
export default function Home() {
  return <HomeDeck />;
}
