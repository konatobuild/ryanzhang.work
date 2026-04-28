import { HeroMorphPoc } from "../../../components/HeroMorphPoc";

export const metadata = {
  title: "Hero morph POC",
  robots: { index: false, follow: false },
};

export default function Page() {
  return (
    <main className="hero-morph-lab">
      <header>
        <h1>Hero morph POC</h1>
        <p>
          All 8 Braun-grammar archetypes from <code>heroArchetypes.ts</code>
          rendered with their native geometry preserved. Each shape scales
          from a small point and fades in/out with edge-first stagger by
          distance from canvas center. Click the figure to advance.
        </p>
      </header>
      <figure>
        <HeroMorphPoc />
      </figure>
    </main>
  );
}
