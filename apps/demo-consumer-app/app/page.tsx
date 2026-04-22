"use client";

import { useEffect, useState } from "react";
import { IOSDevice } from "@/components/IOSDevice";
import {
  PFWelcomeScreen,
  PFHomeScreen,
  PFInsightsScreen,
  type PulseScreen,
} from "@/components/StrideScreens";

const DEVICE_WIDTH = 390;
const DEVICE_HEIGHT = 844;

export default function StridePrototype() {
  const [screen, setScreen] = useState<PulseScreen>("welcome");

  // Scale the device down on narrow viewports so it fits edge-to-edge on phones.
  const [scale, setScale] = useState(1);
  useEffect(() => {
    const measure = () => {
      const margin = 32;
      const availW = window.innerWidth - margin;
      const availH = window.innerHeight - 140;
      const s = Math.min(1, availW / DEVICE_WIDTH, availH / DEVICE_HEIGHT);
      setScale(s);
    };
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, []);

  const onTab = (t: string) => {
    if (t === "home" || t === "insights" || t === "welcome") {
      setScreen(t);
    }
  };

  return (
    <main
      style={{
        minHeight: "100vh",
        background: "#0A0A0A",
        backgroundImage:
          "radial-gradient(800px 400px at 100% 0%, rgba(212,255,58,0.05), transparent 60%), radial-gradient(700px 350px at 0% 100%, rgba(255,91,46,0.04), transparent 65%), linear-gradient(180deg, #0A0A0A 0%, #050505 100%)",
        padding: "60px 20px 80px",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        fontFamily:
          '-apple-system, BlinkMacSystemFont, "SF Pro Display", system-ui, sans-serif',
        color: "#FAFAFA",
      }}
    >
      <header style={{ textAlign: "center", marginBottom: 36, maxWidth: 560 }}>
        <div
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 10,
            marginBottom: 10,
          }}
        >
          <svg width="28" height="26" viewBox="0 0 24 22" fill="none">
            <path
              d="M2 18 L14 4 L14 10 L22 10"
              stroke="#D4FF3A"
              strokeWidth="3.2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M18 6 L22 10 L18 14"
              stroke="#D4FF3A"
              strokeWidth="3.2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          <span
            style={{
              fontSize: 28,
              fontWeight: 800,
              letterSpacing: 3,
              fontStyle: "italic",
              color: "#FAFAFA",
            }}
          >
            STRIDE
          </span>
        </div>
        <div style={{ fontSize: 14, color: "rgba(250,250,250,0.55)" }}>
          Sport-forward fitness tracker prototype · tap the tab bar to switch
          screens, or hit “Start training” to begin.
        </div>
      </header>

      <div
        style={{
          width: DEVICE_WIDTH * scale,
          height: DEVICE_HEIGHT * scale,
          position: "relative",
          display: "flex",
          justifyContent: "center",
        }}
      >
        <div
          style={{
            width: DEVICE_WIDTH,
            height: DEVICE_HEIGHT,
            transform: `scale(${scale})`,
            transformOrigin: "top left",
            position: "absolute",
            top: 0,
            left: 0,
          }}
        >
          <IOSDevice width={DEVICE_WIDTH} height={DEVICE_HEIGHT}>
            {screen === "welcome" && (
              <PFWelcomeScreen onGetStarted={() => setScreen("home")} />
            )}
            {screen === "home" && <PFHomeScreen onTab={onTab} />}
            {screen === "insights" && <PFInsightsScreen onTab={onTab} />}
          </IOSDevice>
        </div>
      </div>

      <nav
        style={{
          marginTop: 36,
          display: "flex",
          gap: 6,
          padding: 4,
          borderRadius: 999,
          background: "rgba(255,255,255,0.06)",
          border: "1px solid rgba(255,255,255,0.1)",
        }}
      >
        {(["welcome", "home", "insights"] as const).map((s) => {
          const active = s === screen;
          return (
            <button
              key={s}
              onClick={() => setScreen(s)}
              style={{
                padding: "8px 16px",
                borderRadius: 999,
                border: "none",
                cursor: "pointer",
                background: active ? "#D4FF3A" : "transparent",
                color: active ? "#0A0A0A" : "rgba(250,250,250,0.7)",
                fontSize: 12,
                fontWeight: 700,
                fontFamily: "inherit",
                textTransform: "uppercase",
                letterSpacing: 1,
              }}
            >
              {s}
            </button>
          );
        })}
      </nav>
    </main>
  );
}
