import {
  FlowGateMotif,
  SparklineMotif,
  TimelineMotif,
  WaterfallMotif,
} from "../HowItWorksMotifs";
import { ACCENT, FONT_DISPLAY, MonoLabel } from "../atoms";

const STEPS = [
  {
    n: "01",
    k: "Trace",
    d: "Span ingestion from any framework — LangChain, LlamaIndex, Anthropic SDK, OpenTelemetry. Zero instrumentation if already OTel-native.",
    Motif: WaterfallMotif,
  },
  {
    n: "02",
    k: "Detect",
    d: "Anomaly detector flags drift, hallucination, tool failure, cost spikes, and policy violations in real time. 97.3% precision.",
    Motif: SparklineMotif,
  },
  {
    n: "03",
    k: "Replay",
    d: "Deterministic replay of any production run. Step through the reasoning chain, inspect each token, fork execution from any span.",
    Motif: TimelineMotif,
  },
  {
    n: "04",
    k: "Intervene",
    d: "Human-in-the-loop approval gates for sensitive tool calls. Stops the agent mid-flight. Resumes with your fix.",
    Motif: FlowGateMotif,
  },
] as const;

export function HowItWorksSection() {
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
            marginBottom: 72,
          }}
        >
          <div>
            <MonoLabel>03 / Architecture</MonoLabel>
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
              Noise <span style={{ color: "rgba(255,255,255,0.35)" }}>→</span>{" "}
              <span style={{ color: ACCENT }}>signal</span>,
              <br />
              in four passes.
            </h2>
          </div>
          <MonoLabel style={{ textAlign: "right" }}>
            P99 · 11ms
            <br />
            SOC 2 · ISO 27001
          </MonoLabel>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(4, 1fr)",
            borderTop: "1px solid rgba(255,255,255,0.16)",
          }}
        >
          {STEPS.map(({ n, k, d, Motif }, i) => (
            <div
              key={n}
              style={{
                padding: "32px 24px 40px",
                borderRight:
                  i < STEPS.length - 1
                    ? "1px solid rgba(255,255,255,0.16)"
                    : "none",
                minHeight: 420,
                display: "flex",
                flexDirection: "column",
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "flex-start",
                }}
              >
                <MonoLabel>
                  {n} / {k}
                </MonoLabel>
                <MonoLabel style={{ opacity: 0.3 }}>●</MonoLabel>
              </div>
              <div style={{ height: 140, marginTop: 28, marginBottom: 28 }}>
                <Motif />
              </div>
              <div
                style={{
                  fontFamily: FONT_DISPLAY,
                  fontSize: 22,
                  fontWeight: 400,
                  letterSpacing: "-0.01em",
                  color: "#fff",
                  marginTop: "auto",
                }}
              >
                {k}.
              </div>
              <p
                style={{
                  marginTop: 10,
                  fontSize: 13,
                  lineHeight: 1.55,
                  color: "rgba(255,255,255,0.6)",
                  fontFamily: FONT_DISPLAY,
                }}
              >
                {d}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
