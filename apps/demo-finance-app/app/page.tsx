"use client";

import { useEffect, useState } from "react";
import {
  Dashboard,
  Goals,
  HouseDetail,
  Phone,
  T,
  sans,
  serif,
  type FinPilotScreen,
} from "@/components/FinPilotScreens";

const DEVICE_WIDTH = 390;
const DEVICE_HEIGHT = 844;

const NAV: { id: FinPilotScreen; label: string }[] = [
  { id: "dash", label: "Dashboard" },
  { id: "goals", label: "Goals" },
  { id: "house", label: "Buy a House" },
];

export default function FinPilotPrototype() {
  const [screen, setScreen] = useState<FinPilotScreen>("dash");

  const [scale, setScale] = useState(1);
  useEffect(() => {
    const fit = () => {
      const availH = window.innerHeight - 160;
      const availW = window.innerWidth - 40;
      const s = Math.min(1, availH / DEVICE_HEIGHT, availW / DEVICE_WIDTH);
      setScale(s);
    };
    fit();
    window.addEventListener("resize", fit);
    return () => window.removeEventListener("resize", fit);
  }, []);

  return (
    <main
      style={{
        minHeight: "100vh",
        position: "relative",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "80px 20px 40px",
        boxSizing: "border-box",
        background:
          "radial-gradient(1200px 800px at 50% 40%, #EFEDE3 0%, #DDD9CC 100%)",
        overflow: "hidden",
        fontFamily: sans,
      }}
    >
      {/* Decorative huge "goals" type behind the phone */}
      <div
        aria-hidden
        style={{
          position: "absolute",
          inset: 0,
          zIndex: 0,
          pointerEvents: "none",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontFamily: serif,
          fontStyle: "italic",
          fontWeight: 400,
          fontSize: "42vmin",
          color: "#0B0B0D",
          opacity: 0.08,
          letterSpacing: "-0.04em",
          lineHeight: 0.8,
          userSelect: "none",
        }}
      >
        goals
      </div>

      {/* Top nav pill */}
      <nav
        style={{
          position: "fixed",
          top: 20,
          left: "50%",
          transform: "translateX(-50%)",
          display: "flex",
          gap: 6,
          zIndex: 100,
          background: "rgba(255,255,255,0.7)",
          backdropFilter: "blur(10px)",
          WebkitBackdropFilter: "blur(10px)",
          padding: 6,
          borderRadius: 100,
          border: "1px solid rgba(0,0,0,0.06)",
        }}
      >
        {NAV.map((n) => {
          const active = screen === n.id;
          return (
            <button
              type="button"
              key={n.id}
              onClick={() => setScreen(n.id)}
              style={{
                padding: "8px 14px",
                borderRadius: 100,
                background: active ? T.bg : "rgba(0,0,0,0.06)",
                color: active ? "#fff" : T.bg,
                border: "none",
                cursor: "pointer",
                fontSize: 13,
                fontWeight: 500,
                fontFamily: sans,
              }}
            >
              {n.label}
            </button>
          );
        })}
      </nav>

      {/* Scaled phone wrapper */}
      <div
        style={{
          position: "relative",
          zIndex: 1,
          width: DEVICE_WIDTH * scale,
          height: DEVICE_HEIGHT * scale,
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
          <Phone>
            {screen === "dash" && <Dashboard go={setScreen} />}
            {screen === "goals" && <Goals go={setScreen} />}
            {screen === "house" && <HouseDetail go={setScreen} />}
          </Phone>
        </div>
      </div>
    </main>
  );
}
