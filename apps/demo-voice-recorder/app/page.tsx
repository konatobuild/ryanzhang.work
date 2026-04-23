"use client";

import { useEffect, useState } from "react";
import {
  EditingScreen,
  PALETTE,
  PHONE_H,
  PHONE_W,
  PhoneFrame,
  Prototype,
  RecordingScreen,
  StartScreen,
  WAVE_A,
  WAVE_B,
  WAVE_C,
  sans,
} from "@/components/VoiceRecorderScreens";

type Layout = "triptych" | "prototype";

export default function VoiceRecorderPage() {
  const [layout, setLayout] = useState<Layout>("triptych");
  const [forceSingle, setForceSingle] = useState(false);
  const [scale, setScale] = useState(1);

  useEffect(() => {
    const fit = () => {
      const w = window.innerWidth;
      const h = window.innerHeight;
      const triptychMinW = PHONE_W * 3 + 96 + 96;
      const small = w < triptychMinW;
      setForceSingle(small);
      const eff: Layout = small ? "prototype" : layout;
      if (eff === "prototype") {
        const availH = h - 200;
        const availW = w - 40;
        setScale(Math.min(1, availH / PHONE_H, availW / PHONE_W));
      } else {
        setScale(1);
      }
    };
    fit();
    window.addEventListener("resize", fit);
    return () => window.removeEventListener("resize", fit);
  }, [layout]);

  const effective: Layout = forceSingle ? "prototype" : layout;

  return (
    <main
      style={{
        minHeight: "100vh",
        position: "relative",
        background: "#78726b",
        color: "#fafaf7",
        fontFamily: sans,
        padding: effective === "triptych" ? "96px 24px 96px" : "96px 20px 72px",
        boxSizing: "border-box",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      <TopBar
        layout={layout}
        setLayout={setLayout}
        showToggle={!forceSingle}
      />

      {effective === "triptych" ? <Triptych /> : <SinglePhone scale={scale} />}

      <Footer />
    </main>
  );
}

function TopBar({
  layout,
  setLayout,
  showToggle,
}: {
  layout: Layout;
  setLayout: (l: Layout) => void;
  showToggle: boolean;
}) {
  return (
    <nav
      style={{
        position: "fixed",
        top: 20,
        left: "50%",
        transform: "translateX(-50%)",
        display: "flex",
        gap: 10,
        zIndex: 100,
        alignItems: "center",
      }}
    >
      <div
        style={{
          fontFamily: sans,
          fontSize: 14,
          letterSpacing: "0.22em",
          textTransform: "uppercase",
          color: "#fafaf7",
          padding: "0 8px",
          fontWeight: 600,
        }}
      >
        voice recorder
      </div>
      {showToggle && (
        <div
          style={{
            display: "flex",
            gap: 4,
            background: "rgba(0,0,0,0.25)",
            border: "1px solid rgba(255,255,255,0.08)",
            backdropFilter: "blur(10px)",
            WebkitBackdropFilter: "blur(10px)",
            padding: 4,
            borderRadius: 100,
          }}
        >
          {(["triptych", "prototype"] as const).map((l) => {
            const active = layout === l;
            return (
              <button
                type="button"
                key={l}
                onClick={() => setLayout(l)}
                style={{
                  padding: "7px 14px",
                  borderRadius: 100,
                  background: active ? PALETTE.red : "transparent",
                  color: active ? "#fff" : "rgba(250,250,247,0.7)",
                  border: "none",
                  cursor: "pointer",
                  fontSize: 12,
                  fontWeight: active ? 600 : 500,
                  fontFamily: sans,
                  textTransform: "capitalize",
                  letterSpacing: "0.04em",
                }}
              >
                {l}
              </button>
            );
          })}
        </div>
      )}
    </nav>
  );
}

function Triptych() {
  const [progress, setProgress] = useState(0.62);

  return (
    <div
      style={{
        display: "flex",
        gap: 48,
        justifyContent: "center",
        flexWrap: "wrap",
      }}
    >
      <PhoneFrame label="01 Start">
        <StartScreen wave={WAVE_A} />
      </PhoneFrame>
      <PhoneFrame label="02 Recording">
        <RecordingScreen
          timeMs={32910}
          paused={false}
          wave={WAVE_B}
          progress={0.72}
        />
      </PhoneFrame>
      <PhoneFrame label="03 Editing">
        <EditingScreen
          progress={progress}
          setProgress={setProgress}
          playing={false}
          wave={WAVE_C}
        />
      </PhoneFrame>
    </div>
  );
}

function SinglePhone({ scale }: { scale: number }) {
  return (
    <div
      style={{
        width: PHONE_W * scale,
        height: PHONE_H * scale + 40,
        position: "relative",
      }}
    >
      <div
        style={{
          width: PHONE_W,
          height: PHONE_H + 40,
          transform: `scale(${scale})`,
          transformOrigin: "top left",
          position: "absolute",
          top: 0,
          left: 0,
        }}
      >
        <PhoneFrame label="Live prototype">
          <Prototype />
        </PhoneFrame>
      </div>
    </div>
  );
}

function Footer() {
  return (
    <footer
      style={{
        position: "fixed",
        bottom: 16,
        left: 0,
        right: 0,
        textAlign: "center",
        fontSize: 11,
        color: "rgba(250,250,247,0.5)",
        fontFamily: sans,
        letterSpacing: 0.3,
        pointerEvents: "none",
      }}
    >
      Voice Recorder — fictional transcription concept · prototype by{" "}
      <span style={{ color: "rgba(250,250,247,0.75)" }}>ryanzhang.work</span>
    </footer>
  );
}
