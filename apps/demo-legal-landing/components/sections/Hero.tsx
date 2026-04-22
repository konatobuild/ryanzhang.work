import { ArrowUR, Logo } from "../shared";

export default function Hero() {
  return (
    <header style={{ background: "var(--ink-2)", color: "var(--cream)" }}>
      <nav
        style={{
          display: "grid",
          gridTemplateColumns: "1fr auto 1fr",
          alignItems: "center",
          padding: "28px 48px",
          borderBottom: "1px solid var(--edge-dark)",
        }}
      >
        <Logo light />
        <div
          style={{
            display: "flex",
            gap: 42,
            fontSize: 13,
            letterSpacing: ".02em",
            color: "rgba(244,241,234,.8)",
          }}
        >
          <a href="#practice">Practice</a>
          <a href="#firm">The Firm</a>
          <a href="#people">Attorneys</a>
          <a href="#contact">Contact</a>
        </div>
        <div style={{ display: "flex", justifyContent: "flex-end" }}>
          <a href="#contact" className="btn btn-outline-light">
            Schedule consultation
          </a>
        </div>
      </nav>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1.05fr 1fr",
          minHeight: 640,
          alignItems: "stretch",
        }}
      >
        <div
          style={{
            padding: "100px 72px 80px 48px",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
          }}
        >
          <div>
            <div className="eyebrow light reveal">
              — San Francisco · New York · Singapore
            </div>
            <h1
              className="display reveal"
              style={{
                fontSize: "clamp(56px, 6.4vw, 104px)",
                color: "var(--cream)",
                margin: "40px 0 0",
                maxWidth: "12ch",
              }}
            >
              A steady hand
              <br />
              <em style={{ color: "var(--accent-2)" }}>in difficult</em>
              <br />
              law.
            </h1>
          </div>

          <div
            className="reveal"
            style={{
              display: "grid",
              gridTemplateColumns: "1fr auto",
              alignItems: "end",
              gap: 40,
              marginTop: 80,
              paddingTop: 40,
              borderTop: "1px solid var(--edge-dark)",
            }}
          >
            <p
              style={{
                fontSize: 15,
                lineHeight: 1.6,
                color: "rgba(244,241,234,.7)",
                margin: 0,
                maxWidth: "46ch",
              }}
            >
              A boutique firm advising founders, funds, and family offices
              through the matters that shape their trajectory — formation,
              financing, cross-border disputes, and exit.
            </p>
            <a href="#practice" className="btn btn-light">
              View practice
              <ArrowUR />
            </a>
          </div>
        </div>

        <div
          style={{
            position: "relative",
            borderLeft: "1px solid var(--edge-dark)",
          }}
        >
          <div
            className="placeholder-img"
            style={{ height: "100%", borderRadius: 0 }}
          >
            <div>
              <div>Photograph · 1600×2000</div>
              <div
                style={{
                  marginTop: 8,
                  color: "rgba(244,241,234,.35)",
                  letterSpacing: ".15em",
                }}
              >
                The Cole Room, Floor 41
              </div>
            </div>
          </div>
          <div
            style={{
              position: "absolute",
              inset: 0,
              background:
                "linear-gradient(180deg, rgba(20,32,28,0) 40%, rgba(20,32,28,.7) 100%)",
              pointerEvents: "none",
            }}
          />
          <div
            style={{
              position: "absolute",
              left: 32,
              bottom: 32,
              right: 32,
              display: "flex",
              justifyContent: "space-between",
              alignItems: "flex-end",
              color: "rgba(244,241,234,.8)",
              fontSize: 12,
              letterSpacing: ".18em",
              textTransform: "uppercase",
            }}
          >
            <span>Figure 01 — The Partners</span>
            <span>MMXXVI</span>
          </div>
        </div>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(4, 1fr)",
          borderTop: "1px solid var(--edge-dark)",
          padding: "28px 48px",
          color: "rgba(244,241,234,.75)",
          fontSize: 13,
        }}
      >
        <span>— Chambers USA · Corporate/M&amp;A, 2023 – 2026</span>
        <span>— The Legal 500 · Asia Pacific</span>
        <span>— Best Lawyers® in America, 2025</span>
        <span style={{ textAlign: "right" }}>— Member, International Bar Association</span>
      </div>
    </header>
  );
}
