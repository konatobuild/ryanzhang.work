import type { CSSProperties, ReactNode } from "react";

function TextLogo({
  name,
  style = {},
  mark,
}: {
  name: string;
  style?: CSSProperties;
  mark?: ReactNode;
}) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: 10,
        padding: "28px 20px",
        background: "white",
        border: "1px solid var(--line)",
        borderRadius: 10,
        color: "var(--ink-2)",
        minHeight: 90,
        ...style,
      }}
    >
      {mark}
      <span
        style={{
          fontSize: 18,
          fontWeight: 600,
          letterSpacing: style.letterSpacing ?? "0.02em",
          fontFamily: style.fontFamily ?? "var(--font-inter-tight)",
          textTransform: style.textTransform ?? "none",
        }}
      >
        {name}
      </span>
    </div>
  );
}

export function LogoWall() {
  return (
    <section style={{ padding: "64px 0" }}>
      <div className="wrap">
        <div style={{ maxWidth: 640, marginBottom: 40 }}>
          <div className="mono" style={{ marginBottom: 10 }}>
            Trusted by 4,000+ teams
          </div>
          <h2
            style={{
              margin: 0,
              fontSize: 30,
              letterSpacing: "-0.02em",
              lineHeight: 1.15,
              fontWeight: 600,
            }}
          >
            In good company.
          </h2>
          <p
            style={{
              color: "var(--muted)",
              marginTop: 14,
              fontSize: 15,
              maxWidth: 560,
            }}
          >
            Join thousands of digital entrepreneurs who have collectively
            processed over $420M in sales through Northwind.
          </p>
        </div>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(4, 1fr)",
            gap: 16,
          }}
        >
          <TextLogo
            name="MERIDIAN"
            style={{ letterSpacing: "0.28em", fontWeight: 500 }}
          />
          <TextLogo
            name="Thicket"
            style={{
              fontFamily: "var(--font-geist-mono)",
              textTransform: "lowercase",
            }}
            mark={
              <span
                style={{
                  width: 14,
                  height: 14,
                  borderRadius: 3,
                  background: "var(--ink)",
                }}
              />
            }
          />
          <TextLogo
            name="descript"
            style={{ fontFamily: "var(--font-geist-mono)" }}
            mark={
              <svg width="14" height="14" viewBox="0 0 14 14">
                <rect x="1" y="3" width="12" height="2" fill="var(--ink)" />
                <rect x="1" y="6.5" width="8" height="2" fill="var(--ink)" />
                <rect x="1" y="10" width="12" height="2" fill="var(--ink)" />
              </svg>
            }
          />
          <TextLogo
            name="Halcyon"
            style={{ letterSpacing: "-0.01em" }}
            mark={
              <svg width="16" height="16" viewBox="0 0 16 16">
                <path d="M8 1L15 15H1L8 1Z" fill="var(--ink)" />
              </svg>
            }
          />
          <TextLogo
            name="PLAID"
            style={{ letterSpacing: "0.18em" }}
            mark={
              <svg width="16" height="16" viewBox="0 0 16 16">
                <circle
                  cx="8"
                  cy="8"
                  r="7"
                  stroke="var(--ink)"
                  strokeWidth="1.4"
                  fill="none"
                />
                <circle cx="8" cy="8" r="3" fill="var(--ink)" />
              </svg>
            }
          />
          <TextLogo
            name="Outreach"
            mark={
              <svg width="16" height="16" viewBox="0 0 16 16">
                <path
                  d="M8 2L14 8L8 14L2 8L8 2Z"
                  stroke="var(--ink)"
                  strokeWidth="1.4"
                  fill="none"
                />
              </svg>
            }
          />
          <TextLogo
            name="LaunchDarkly →"
            style={{ letterSpacing: "-0.01em" }}
          />
          <TextLogo
            name="LOOPRING"
            style={{ letterSpacing: "0.18em", fontWeight: 500 }}
            mark={
              <svg width="16" height="16" viewBox="0 0 16 16">
                <circle
                  cx="6"
                  cy="8"
                  r="4"
                  stroke="var(--ink)"
                  strokeWidth="1.4"
                  fill="none"
                />
                <circle
                  cx="10"
                  cy="8"
                  r="4"
                  stroke="var(--ink)"
                  strokeWidth="1.4"
                  fill="none"
                />
              </svg>
            }
          />
        </div>
      </div>
    </section>
  );
}
