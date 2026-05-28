import Link from "next/link";
import GridexHeroStage from "@/components/specimens/gridex/GridexHeroStage";

export const metadata = {
  title: "Gridex hero stage — craft specimen",
  description:
    "The animated workspace stage I built for the Gridex home page: three agent cursors working real-looking tools, lifted out of the product and shown on its own.",
};

export default function Page() {
  return (
    <main
      style={{
        minHeight: "100vh",
        padding: "var(--space-9) 64px var(--space-9)",
        display: "flex",
        flexDirection: "column",
        gap: "var(--space-8)",
      }}
    >
      <header style={{ maxWidth: 760 }}>
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
          Specimen · Gridex hero stage
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
          Three agents, one desk
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
          The Gridex home hero is a live workspace: three agent cursors move
          through real-looking tools—an inbox, a Slack thread, a voice
          transcript, a contract, a reconciliation sheet—picking up work,
          handling it, and logging each result to a running Done pile. I lifted
          the whole stage out of the product and set it on a neutral ground so
          the motion can be read on its own.
        </p>
      </header>

      <div
        style={{
          alignSelf: "center",
          padding: "var(--space-7)",
          borderRadius: 16,
          background: "var(--color-gray-1, #fcfbf8)",
          border: "1px solid var(--color-hairline, rgba(0,0,0,0.08))",
        }}
      >
        <GridexHeroStage />
      </div>
    </main>
  );
}
