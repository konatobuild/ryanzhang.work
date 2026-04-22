import { FONT_DISPLAY, FONT_MONO, MonoLabel } from "../atoms";

const MODULES = [
  { k: "Tracing", s: "Multi-framework · OTel-native" },
  { k: "Anomaly Detect", s: "Drift · hallucination · policy" },
  { k: "Replay", s: "Deterministic · fork from any span" },
  { k: "Approval Gates", s: "Block sensitive tool calls mid-flight" },
  { k: "Cost Router", s: "Model + prompt routing by spend" },
  { k: "Audit Trail", s: "SOC 2 · immutable · exportable" },
] as const;

export function CapabilitiesSection() {
  return (
    <section
      style={{
        position: "relative",
        padding: "160px 40px",
        borderTop: "1px solid rgba(255,255,255,0.16)",
      }}
    >
      <div style={{ maxWidth: 1280, margin: "0 auto" }}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-end",
            marginBottom: 64,
          }}
        >
          <div>
            <MonoLabel>04 / Capabilities</MonoLabel>
            <h2
              style={{
                margin: "20px 0 0",
                fontFamily: FONT_DISPLAY,
                fontWeight: 400,
                fontSize: "clamp(40px, 5vw, 72px)",
                letterSpacing: "-0.03em",
                lineHeight: 1,
              }}
            >
              Six primitives.
              <br />
              One control plane.
            </h2>
          </div>
          <MonoLabel style={{ textAlign: "right" }}>
            All modules · GA
            <br />
            Self-hosted · Cloud
          </MonoLabel>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)",
            border: "1px solid rgba(255,255,255,0.16)",
          }}
        >
          {MODULES.map((m, i) => {
            const row = Math.floor(i / 3);
            const col = i % 3;
            return (
              <div
                key={m.k}
                style={{
                  padding: "44px 36px 44px",
                  borderRight:
                    col < 2 ? "1px solid rgba(255,255,255,0.16)" : "none",
                  borderBottom:
                    row < 1 ? "1px solid rgba(255,255,255,0.16)" : "none",
                  minHeight: 260,
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                  position: "relative",
                }}
              >
                <MonoLabel>0{i + 1}</MonoLabel>
                <div>
                  <div
                    style={{
                      fontFamily: FONT_DISPLAY,
                      fontSize: 34,
                      fontWeight: 400,
                      letterSpacing: "-0.02em",
                      color: "#fff",
                    }}
                  >
                    {m.k}
                  </div>
                  <div
                    style={{
                      marginTop: 10,
                      fontSize: 14,
                      color: "rgba(255,255,255,0.55)",
                    }}
                  >
                    {m.s}
                  </div>
                </div>
                <div style={{ display: "flex", justifyContent: "flex-end" }}>
                  <span
                    style={{
                      fontFamily: FONT_MONO,
                      fontSize: 14,
                      opacity: 0.4,
                    }}
                  >
                    ↗
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
