"use client";

import { useEffect, useState } from "react";
import { IOSDevice } from "@/components/IOSDevice";
import {
  PFWelcomeScreen,
  PFHomeScreen,
  PFInsightsScreen,
  type PulseScreen,
} from "@/components/PulseScreens";

const DEVICE_WIDTH = 390;
const DEVICE_HEIGHT = 844;

export default function PulseFitnessPrototype() {
  const [screen, setScreen] = useState<PulseScreen>("welcome");

  // Scale the device down on narrow viewports so it fits edge-to-edge on phones.
  const [scale, setScale] = useState(1);
  useEffect(() => {
    const measure = () => {
      const margin = 32;
      const availW = window.innerWidth - margin;
      const availH = window.innerHeight - 120;
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
        background: "#f0eee9",
        backgroundImage:
          "url(\"data:image/svg+xml,%3Csvg width='120' height='120' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M120 0H0v120' fill='none' stroke='rgba(0,0,0,0.06)' stroke-width='1'/%3E%3C/svg%3E\")",
        backgroundSize: "120px 120px",
        padding: "60px 20px 80px",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        fontFamily:
          '-apple-system, BlinkMacSystemFont, "SF Pro Display", system-ui, sans-serif',
        color: "rgba(40,30,20,0.85)",
      }}
    >
      <header style={{ textAlign: "center", marginBottom: 40, maxWidth: 560 }}>
        <div
          style={{
            fontSize: 28,
            fontWeight: 600,
            letterSpacing: -0.4,
            marginBottom: 6,
          }}
        >
          Pulse Fitness
        </div>
        <div style={{ fontSize: 15, color: "rgba(60,50,40,0.6)" }}>
          Consumer fitness-tracker prototype · tap the tab bar to switch
          screens, or use “Start Training” to begin.
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
          gap: 8,
          padding: 4,
          borderRadius: 999,
          background: "rgba(255,255,255,0.6)",
          border: "1px solid rgba(0,0,0,0.06)",
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
                background: active ? "#1A1230" : "transparent",
                color: active ? "#fff" : "rgba(40,30,20,0.7)",
                fontSize: 13,
                fontWeight: 500,
                fontFamily: "inherit",
                textTransform: "capitalize",
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
