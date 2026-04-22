import { HeroTicker } from "../HeroTicker";
import { PulseGrid } from "../PulseGrid";
import { FONT_DISPLAY, MonoLabel, PillButton } from "../atoms";

export function HeroSection({ brand }: { brand: string }) {
  return (
    <section
      id="sec-hero"
      style={{ position: "relative", minHeight: "100vh", overflow: "hidden" }}
    >
      <nav
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          zIndex: 10,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "28px 40px",
        }}
      >
        <div
          style={{
            fontFamily: FONT_DISPLAY,
            fontSize: 20,
            fontWeight: 500,
            letterSpacing: "-0.01em",
          }}
        >
          {brand}
          <sup style={{ fontSize: 11, marginLeft: 1, opacity: 0.8 }}>©</sup>
        </div>
        <div style={{ display: "flex", gap: 10 }}>
          <PillButton>Platform</PillButton>
          <PillButton>Pricing</PillButton>
          <PillButton>Login</PillButton>
        </div>
      </nav>

      <div style={{ position: "absolute", inset: 0 }}>
        <PulseGrid cursorReactive scrollReactive />
      </div>

      <div
        style={{
          position: "relative",
          zIndex: 5,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          minHeight: "100vh",
          padding: "0 40px",
          pointerEvents: "none",
        }}
      >
        <div style={{ maxWidth: 820, margin: "0 auto", textAlign: "center" }}>
          <MonoLabel style={{ marginBottom: 28 }}>Control Plane — —</MonoLabel>
          <h1
            style={{
              margin: 0,
              fontFamily: FONT_DISPLAY,
              fontWeight: 500,
              fontSize: "clamp(72px, 10vw, 148px)",
              lineHeight: 0.92,
              letterSpacing: "-0.035em",
            }}
          >
            <div style={{ filter: "none", textShadow: "0 0 0 #fff" }}>SIGNAL</div>
            <div
              className="noise-word"
              style={{ filter: "blur(2.5px)", opacity: 0.92 }}
            >
              NOISE
            </div>
          </h1>
          <p
            style={{
              marginTop: 36,
              fontFamily: FONT_DISPLAY,
              fontSize: 19,
              lineHeight: 1.45,
              color: "rgba(255,255,255,0.78)",
              maxWidth: 560,
              marginLeft: "auto",
              marginRight: "auto",
              textShadow: "0 0 14px #000, 0 0 22px #000",
            }}
          >
            Runtime control plane for production AI agents.
            <br />
            See every span. Intervene before harm.
          </p>
          <div
            style={{
              marginTop: 40,
              display: "flex",
              gap: 12,
              justifyContent: "center",
              pointerEvents: "auto",
            }}
          >
            <PillButton variant="primary" symbol="⊕">
              Deploy Instance
            </PillButton>
            <PillButton variant="subtle" symbol="↗">
              Read Whitepaper
            </PillButton>
          </div>
        </div>
      </div>

      <div style={{ position: "absolute", left: 40, bottom: 28, zIndex: 6 }}>
        <MonoLabel>
          <HeroTicker />
        </MonoLabel>
      </div>
      <div
        style={{
          position: "absolute",
          right: 40,
          bottom: 28,
          zIndex: 6,
          textAlign: "right",
        }}
      >
        <MonoLabel>
          <span style={{ display: "inline-flex", alignItems: "center" }}>
            <span className="nominal-dot" aria-hidden />
            Nominal
          </span>
        </MonoLabel>
      </div>
    </section>
  );
}
