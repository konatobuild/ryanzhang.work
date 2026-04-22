import { ArrowUR } from "../shared";

const PARTNERS = [
  {
    name: "Eleanor R. Meridian",
    role: "Managing Partner · Corporate & M&A",
    bar: "CA · NY · England & Wales",
    years: 24,
  },
  {
    name: "Jasper T. Cole",
    role: "Partner · Disputes & Arbitration",
    bar: "CA · NY · DC",
    years: 19,
  },
  {
    name: "Adaora N. Okoye",
    role: "Partner · International & Tax",
    bar: "NY · Singapore",
    years: 16,
  },
];

export default function Attorneys() {
  return (
    <section id="people" style={{ padding: "140px 0 120px" }}>
      <div className="wrap">
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "200px 1fr auto",
            alignItems: "end",
            marginBottom: 72,
            gap: 40,
          }}
        >
          <div className="eyebrow reveal">§ 03 — The Partners</div>
          <h2
            className="display reveal"
            style={{
              fontSize: "clamp(40px, 4.4vw, 64px)",
              margin: 0,
              lineHeight: 1.08,
            }}
          >
            Three partners.{" "}
            <em>No associates billing behind them.</em>
          </h2>
          <a href="#" className="btn btn-outline">
            All attorneys <ArrowUR />
          </a>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)",
            gap: 24,
            borderTop: "1px solid var(--edge)",
            paddingTop: 32,
          }}
        >
          {PARTNERS.map((p, i) => (
            <article
              key={p.name}
              className="reveal"
              style={{ display: "flex", flexDirection: "column", gap: 20 }}
            >
              <div
                className="placeholder-img"
                style={{ aspectRatio: "3 / 4", alignItems: "flex-end" }}
              >
                <div style={{ color: "rgba(244,241,234,.35)" }}>
                  <div>Portrait · 900×1200</div>
                  <div style={{ marginTop: 4 }}>
                    {p.name.split(" ").slice(-1)}
                  </div>
                </div>
              </div>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "baseline",
                }}
              >
                <div className="display" style={{ fontSize: 26 }}>
                  {p.name}
                </div>
                <div className="eyebrow">
                  {String(i + 1).padStart(2, "0")}
                </div>
              </div>
              <div
                style={{
                  fontSize: 13,
                  color: "var(--muted)",
                  lineHeight: 1.55,
                }}
              >
                {p.role}
                <div
                  style={{
                    marginTop: 8,
                    fontSize: 12,
                    letterSpacing: ".1em",
                    textTransform: "uppercase",
                    color: "var(--muted-2)",
                  }}
                >
                  Admitted: {p.bar} — {p.years} years
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
