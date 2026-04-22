import { ACCENT, FONT_DISPLAY, MonoLabel, PillButton } from "../atoms";

const COLUMNS: ReadonlyArray<[string, ReadonlyArray<string>]> = [
  ["Platform", ["Trace", "Detect", "Replay", "Intervene"]],
  ["Modules", ["Tracing", "Anomaly Detect", "Approval Gates", "Cost Router"]],
  ["Company", ["Manifesto", "Research", "Careers", "Press"]],
  ["Legal", ["Terms", "Privacy", "DPA", "SOC 2"]],
];

export function SiteFooter({ brand }: { brand: string }) {
  return (
    <footer
      style={{
        position: "relative",
        borderTop: "1px solid rgba(255,255,255,0.16)",
      }}
    >
      <div style={{ padding: "120px 40px 80px" }}>
        <div style={{ maxWidth: 1280, margin: "0 auto" }}>
          <div
            style={{
              fontFamily: FONT_DISPLAY,
              fontSize: "clamp(56px, 8vw, 128px)",
              fontWeight: 400,
              letterSpacing: "-0.035em",
              lineHeight: 0.95,
              color: "#fff",
            }}
          >
            Deploy the <span style={{ color: ACCENT }}>control plane</span>.
            <br />
            <span style={{ color: "rgba(255,255,255,0.4)" }}>
              Trust your agents.
            </span>
          </div>
          <div style={{ marginTop: 48 }}>
            <PillButton variant="primary" symbol="⊕">
              Deploy Instance
            </PillButton>
          </div>

          <div
            style={{
              marginTop: 120,
              display: "grid",
              gridTemplateColumns: "2fr 1fr 1fr 1fr 1fr",
              gap: 32,
              paddingTop: 40,
              borderTop: "1px solid rgba(255,255,255,0.16)",
            }}
          >
            <div>
              <div style={{ fontFamily: FONT_DISPLAY, fontSize: 22 }}>
                {brand}
                <sup style={{ fontSize: 11, opacity: 0.8 }}>©</sup>
              </div>
              <MonoLabel style={{ marginTop: 16 }}>
                2211 Mission St, SF
                <br />© 2026 · All rights reserved
              </MonoLabel>
            </div>
            {COLUMNS.map(([heading, items]) => (
              <div key={heading}>
                <MonoLabel>{heading}</MonoLabel>
                <ul
                  style={{
                    listStyle: "none",
                    padding: 0,
                    margin: "16px 0 0",
                    display: "grid",
                    gap: 8,
                  }}
                >
                  {items.map((item) => (
                    <li
                      key={item}
                      style={{
                        fontFamily: FONT_DISPLAY,
                        fontSize: 14,
                        color: "rgba(255,255,255,0.75)",
                      }}
                    >
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
