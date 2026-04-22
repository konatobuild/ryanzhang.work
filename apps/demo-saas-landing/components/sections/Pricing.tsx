import { FONT_DISPLAY, FONT_MONO, MonoLabel, PillButton } from "../atoms";

const ROWS: ReadonlyArray<[string, string, string]> = [
  ["Trace throughput", "10M spans/day", "Unlimited"],
  ["Frameworks supported", "All", "All"],
  ["Anomaly detection", "Included", "Included"],
  ["Replay depth", "30 days", "Configurable"],
  ["Approval gates", "Up to 5 workflows", "Unlimited"],
  ["SSO · SAML · SCIM", "—", "Included"],
  ["Air-gapped deployment", "—", "Included"],
  ["Audit log retention", "90 days", "Configurable"],
  ["Support", "Business hours", "24/7 · Named SE"],
];

function PricingColumn({
  title,
  tag,
  price,
  unit,
  cta,
  idx,
  primary = false,
}: {
  title: string;
  tag: string;
  price: string;
  unit: string;
  cta: string;
  idx: number;
  primary?: boolean;
}) {
  return (
    <div
      style={{
        padding: "48px 40px",
        borderLeft: idx > 0 ? "1px solid rgba(255,255,255,0.16)" : "none",
      }}
    >
      <MonoLabel>{tag}</MonoLabel>
      <div
        style={{
          fontFamily: FONT_DISPLAY,
          fontSize: 40,
          fontWeight: 400,
          letterSpacing: "-0.02em",
          color: "#fff",
          marginTop: 14,
        }}
      >
        {title}
      </div>
      <div style={{ marginTop: 40 }}>
        <span
          style={{
            fontFamily: FONT_DISPLAY,
            fontSize: 72,
            fontWeight: 400,
            letterSpacing: "-0.04em",
            color: "#fff",
          }}
        >
          {price}
        </span>
        <span
          style={{
            fontFamily: FONT_MONO,
            fontSize: 13,
            color: "rgba(255,255,255,0.5)",
            marginLeft: 10,
          }}
        >
          {unit}
        </span>
      </div>
      <div style={{ marginTop: 28 }}>
        <PillButton variant={primary ? "primary" : "ghost"} symbol="⊕">
          {cta}
        </PillButton>
      </div>
    </div>
  );
}

export function PricingSection() {
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
            marginBottom: 56,
          }}
        >
          <div>
            <MonoLabel>06 / Deploy</MonoLabel>
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
              Two surfaces.
              <br />
              One binary.
            </h2>
          </div>
          <MonoLabel style={{ textAlign: "right" }}>
            Invoiced quarterly · USD
            <br />
            Commitment waived ≥ $250k/yr
          </MonoLabel>
        </div>

        <div style={{ border: "1px solid rgba(255,255,255,0.16)" }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr" }}>
            <PricingColumn
              idx={0}
              title="Cloud"
              tag="Managed"
              price="$0.0008"
              unit="/ span classified"
              cta="Start Instance"
              primary
            />
            <PricingColumn
              idx={1}
              title="Self-Hosted"
              tag="Your VPC"
              price="$240k"
              unit="/ year · base"
              cta="Contact Deploy"
            />
          </div>
          <div style={{ borderTop: "1px solid rgba(255,255,255,0.16)" }}>
            {ROWS.map((r, i) => (
              <div
                key={r[0]}
                style={{
                  display: "grid",
                  gridTemplateColumns: "1.2fr 1fr 1fr",
                  borderTop:
                    i > 0 ? "1px solid rgba(255,255,255,0.08)" : "none",
                  fontFamily: FONT_MONO,
                  fontSize: 13,
                }}
              >
                <div
                  style={{
                    padding: "16px 40px",
                    color: "rgba(255,255,255,0.55)",
                    textTransform: "uppercase",
                    letterSpacing: "0.08em",
                    fontSize: 11,
                  }}
                >
                  {r[0]}
                </div>
                <div
                  style={{
                    padding: "16px 40px",
                    color: "#fff",
                    borderLeft: "1px solid rgba(255,255,255,0.16)",
                  }}
                >
                  {r[1]}
                </div>
                <div
                  style={{
                    padding: "16px 40px",
                    color: "#fff",
                    borderLeft: "1px solid rgba(255,255,255,0.16)",
                  }}
                >
                  {r[2]}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
