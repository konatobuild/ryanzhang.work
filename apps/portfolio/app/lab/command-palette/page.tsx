import Link from "next/link";
import { OpticalCommandPalette } from "@/components/specimens/optical-palette/OpticalCommandPalette";

export const metadata = {
  title: "Optical command palette — a design note",
  description:
    "A working ⌘K palette whose selection is an optical instrument: the list sits slightly out of focus and the active command is the one thing pulled sharp. Type to filter, arrow to move the focus.",
  robots: { index: false, follow: false },
};

const NOTES: { term: string; detail: string }[] = [
  {
    term: "Attention is the interface",
    detail:
      "A command list asks you to read everything to find one thing. Here the list stays soft and the active row is the only thing in true focus — magnified, sharp, edged with a thin spectrum. Navigating isn't highlighting a row; it's pulling a command into focus.",
  },
  {
    term: "Optics, not a highlight bar",
    detail:
      "The whole list is one WebGL texture under a depth-of-field shader. The focus band samples sharp and magnified while the rest is genuinely defocused, so the active command sits on a different focal plane — the way your eye actually resolves one line at a time.",
  },
  {
    term: "The component still works",
    detail:
      "It's a real palette underneath: a focused input, subsequence fuzzy matching, ↑/↓ to move, esc to clear, and a hidden listbox so screen readers get the same list. The craft rides on top of a thing that does its job.",
  },
  {
    term: "Glass with weight",
    detail:
      "The focus band chases the selection through a critically-damped spring, so it lags and settles rather than snapping between rows. A soft sheen and a contact shadow seat it on the paper — no glow, no gradient.",
  },
];

export default function Page() {
  return (
    <main
      style={{
        minHeight: "100vh",
        padding: "var(--space-8) 64px var(--space-9)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: "var(--space-7)",
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
            marginTop: "var(--space-5)",
            fontFamily: "var(--font-geist-mono)",
            fontSize: 12,
            letterSpacing: "0.14em",
            textTransform: "uppercase",
            color: "var(--color-gray-11)",
          }}
        >
          Design note · Optical command palette
        </p>
        <h1
          style={{
            margin: "var(--space-3) 0 0",
            fontSize: "clamp(32px, 4.5vw, 52px)",
            lineHeight: 1.05,
            letterSpacing: "-0.02em",
            color: "var(--color-gray-12)",
          }}
        >
          One command, in focus
        </h1>
        <p
          style={{
            margin: "var(--space-4) 0 0",
            maxWidth: 600,
            fontSize: "var(--fs-18, 18px)",
            lineHeight: 1.5,
            color: "var(--color-gray-11)",
          }}
        >
          A ⌘K palette where the list stays soft and only the active command is
          pulled into focus — magnified and sharp under a glass band. Type to
          filter, then arrow up and down and watch the focus settle.
        </p>
      </header>

      <div
        style={{
          width: "100%",
          maxWidth: 760,
          padding: "var(--space-7) var(--space-6)",
          borderRadius: 16,
          background:
            "radial-gradient(circle at 30% 20%, rgba(0,0,0,0.03) 0%, transparent 60%), var(--color-gray-2)",
          border: "1px solid var(--color-hairline)",
          display: "flex",
          justifyContent: "center",
        }}
      >
        <OpticalCommandPalette />
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
          {NOTES.map((note) => (
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
    </main>
  );
}
