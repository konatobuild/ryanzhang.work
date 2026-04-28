import { VerticalDeck } from "@/components/VerticalDeck";

/*
 * Home — vertical scroll-snap deck.
 * The previous identity hero + WorkStream layout has been replaced by the
 * 6-frame deck. WorkStream still exists; it now belongs in /studies.
 * See apps/portfolio/STRATEGY.md §6 for the design rationale.
 */
export default function Home() {
  return <VerticalDeck />;
}
