import { ACCENT, FONT_DISPLAY, FONT_MONO, MonoLabel } from "../atoms";

const NUMS = [
  { n: "97.3", u: "%", c: "Anomaly detection precision · production agents" },
  { n: "11", u: "ms", c: "P99 trace ingestion latency · single span" },
  { n: "2.8", u: "×", c: "Cost reduction from model routing · median customer" },
] as const;

export function BenchmarksSection() {
  return (
    <section
      style={{
        position: "relative",
        padding: "160px 40px",
        borderTop: "1px solid rgba(255,255,255,0.16)",
      }}
    >
      <div style={{ maxWidth: 1280, margin: "0 auto" }}>
        <MonoLabel>05 / Benchmarks</MonoLabel>
        <div
          style={{
            marginTop: 60,
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)",
          }}
        >
          {NUMS.map((x, i) => (
            <div
              key={x.c}
              style={{
                padding: "20px 32px",
                borderLeft:
                  i > 0 ? "1px solid rgba(255,255,255,0.16)" : "none",
                position: "relative",
              }}
            >
              <div
                style={{
                  fontFamily: FONT_DISPLAY,
                  fontSize: "clamp(88px, 12vw, 180px)",
                  fontWeight: 400,
                  letterSpacing: "-0.05em",
                  lineHeight: 1,
                  color: "#fff",
                }}
              >
                {x.n}
                <span
                  style={{
                    fontSize: "0.4em",
                    color: ACCENT,
                    marginLeft: 4,
                  }}
                >
                  {x.u}
                </span>
              </div>
              <div
                style={{
                  marginTop: 18,
                  fontFamily: FONT_MONO,
                  fontSize: 11,
                  letterSpacing: "0.14em",
                  textTransform: "uppercase",
                  color: "rgba(255,255,255,0.55)",
                }}
              >
                {x.c}
              </div>
            </div>
          ))}
        </div>
        <div
          style={{
            marginTop: 80,
            borderTop: "1px solid rgba(255,255,255,0.16)",
            paddingTop: 24,
            display: "flex",
            justifyContent: "space-between",
          }}
        >
          <MonoLabel>
            Measured across 47 production deployments · Q1 2026
          </MonoLabel>
          <MonoLabel>Methodology ↗</MonoLabel>
        </div>
      </div>
    </section>
  );
}
