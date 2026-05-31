import Link from "next/link";
import AtlasStage from "@/components/specimens/atlas/AtlasStage";

export const metadata = {
  title: "Atlas — a zoomable file canvas",
  description:
    "A prototype that replaces the folder tree with one zoomable canvas. Zoom out and files become terrain that shows where the clutter is; zoom in and they resolve into readable previews. Pick a file up, zoom out, and drop it where you can see — origin and destination on screen at once.",
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
          Lab · Atlas
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
          A zoomable file canvas
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
          The folder tree is good at storing files and bad at tidying them. It
          shows one folder at a time, so moving a file means remembering the whole
          structure and dragging it blind into a folder you can&rsquo;t see. The
          task is about the relationship between two places, but the tool only ever
          shows one.
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
          This prototype uses one zoomable canvas instead. Zoom out and files
          become terrain: bigger folders take more space, stale ones dim, and
          duplicates are marked — so you can see where the clutter is before
          reading a single name. Zoom in and the same shapes become readable file
          previews. It&rsquo;s one surface at different scales, not separate
          screens. Scroll to zoom; drag a file to move it.
        </p>
      </header>

      <div style={{ width: "100%", maxWidth: 1080 }}>
        <AtlasStage />
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
          Notes
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
              term: "One zoom, four levels of detail",
              detail:
                "Zoomed out, a file is just terrain — size, age, and whether it's a duplicate. Closer, it's a labelled tray with any problems flagged. Closer still, a card. All the way in, the actual file: a photo fills the frame, a PDF shows its layout, a document shows its text. It's a single continuous zoom, so you don't lose your place moving between the overview and the detail.",
            },
            {
              term: "Clutter is visible without opening anything",
              detail:
                "Size maps to area, stale files dim, and duplicates are marked — including two real copies of the same image that read as one pile. The zoomed-out view is the diagnosis: it tells you where to start before you open a thing.",
            },
            {
              term: "Move files without losing context",
              detail:
                "Pick a file up and it stays under the cursor while the canvas keeps zooming underneath. So you can grab something in a crowded folder, zoom out until the destination is on screen, and drop it there — both ends visible at once, instead of dragging blind.",
            },
            {
              term: "Scope of the prototype",
              detail:
                "This is a front-end sketch with mock files — no real filesystem behind it. It's meant to test one idea: whether semantic zoom is a better way to tidy than drilling in and out of folders. Search, undo, and multi-select aren't built.",
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
    </main>
  );
}
