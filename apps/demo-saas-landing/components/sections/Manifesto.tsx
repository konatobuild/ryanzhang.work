import { FONT_DISPLAY, FONT_MONO, MonoLabel } from "../atoms";

export function ManifestoSection() {
  return (
    <section
      style={{
        position: "relative",
        padding: "160px 40px",
        borderTop: "1px solid rgba(255,255,255,0.16)",
      }}
    >
      <div
        style={{
          maxWidth: 1280,
          margin: "0 auto",
          display: "grid",
          gridTemplateColumns: "220px 1fr",
          gap: 80,
        }}
      >
        <div>
          <MonoLabel>02 / Manifesto</MonoLabel>
          <div
            style={{
              marginTop: 18,
              fontFamily: FONT_MONO,
              fontSize: 11,
              color: "rgba(255,255,255,0.4)",
              lineHeight: 1.7,
            }}
          >
            Filed
            <br />
            04 · 2026
            <br />
            —
            <br />
            Paper 001
            <br />
            Internal
            <br />
            Distribution
          </div>
        </div>
        <div style={{ maxWidth: 820 }}>
          <h2
            style={{
              margin: 0,
              fontFamily: FONT_DISPLAY,
              fontWeight: 400,
              fontSize: "clamp(32px, 3.4vw, 52px)",
              lineHeight: 1.18,
              letterSpacing: "-0.02em",
              color: "#fff",
            }}
          >
            Every production agent is a{" "}
            <em style={{ fontStyle: "italic", color: "rgba(255,255,255,0.6)" }}>
              stranger
            </em>{" "}
            making decisions on your behalf. Every span is a signal. Every
            failure is a message. Most teams can&apos;t hear either. You
            don&apos;t have a debugging problem. You have a{" "}
            <span style={{ color: "#fff" }}>visibility</span> problem.
          </h2>
          <div
            style={{
              marginTop: 60,
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: 48,
            }}
          >
            <div>
              <MonoLabel>↳ Observed</MonoLabel>
              <p
                style={{
                  marginTop: 12,
                  fontSize: 15,
                  lineHeight: 1.65,
                  color: "rgba(255,255,255,0.7)",
                }}
              >
                A median production agent logs 40+ spans per run. 84% of teams
                shipping agents have no anomaly alerting. Mean time to detect a
                misbehaving agent: 6.3 days. Mean cost of not detecting: one
                customer.
              </p>
            </div>
            <div>
              <MonoLabel>↳ Proposed</MonoLabel>
              <p
                style={{
                  marginTop: 12,
                  fontSize: 15,
                  lineHeight: 1.65,
                  color: "rgba(255,255,255,0.7)",
                }}
              >
                A runtime control plane that watches every span, every tool
                call, every token. Surfaces the one that matters. Intercepts the
                one that shouldn&apos;t have happened. Before it reaches the
                customer.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
