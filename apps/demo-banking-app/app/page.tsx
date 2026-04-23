"use client";

import { useEffect, useState } from "react";
import {
  AnalyticsScreen,
  CardsScreen,
  HomeScreen,
  PHONE_H,
  PHONE_W,
  PhoneFrame,
  sans,
  serif,
  type VoltScreen,
} from "@/components/VoltScreens";

const ACCENT = "#bef264";

type Layout = "triptych" | "single";

const NAV: { id: VoltScreen; label: string }[] = [
  { id: "home", label: "Home" },
  { id: "cards", label: "Cards" },
  { id: "analytics", label: "Analytics" },
];

function renderScreen(name: VoltScreen, onNavigate: (s: string) => void) {
  if (name === "cards") return <CardsScreen accent={ACCENT} onNavigate={onNavigate} />;
  if (name === "analytics") return <AnalyticsScreen accent={ACCENT} onNavigate={onNavigate} />;
  return <HomeScreen accent={ACCENT} onNavigate={onNavigate} />;
}

function asScreen(s: string): VoltScreen {
  return s === "cards" || s === "analytics" ? s : "home";
}

export default function VoltPrototype() {
  const [layout, setLayout] = useState<Layout>("triptych");
  const [screen, setScreen] = useState<VoltScreen>("home");
  const [forceSingle, setForceSingle] = useState(false);
  const [scale, setScale] = useState(1);

  useEffect(() => {
    const fit = () => {
      const w = window.innerWidth;
      const h = window.innerHeight;
      // Triptych needs ~3 phones + 2 gaps + side padding
      const triptychMinW = PHONE_W * 3 + 96 + 96;
      const small = w < triptychMinW;
      setForceSingle(small);
      const eff: Layout = small ? "single" : layout;
      if (eff === "single") {
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

  const effectiveLayout: Layout = forceSingle ? "single" : layout;

  return (
    <main
      style={{
        minHeight: "100vh",
        position: "relative",
        background: "#17171a",
        color: "#eee",
        fontFamily: sans,
        padding: effectiveLayout === "triptych" ? "96px 24px 64px" : "96px 20px 40px",
        boxSizing: "border-box",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      <TopBar
        layout={layout}
        setLayout={setLayout}
        screen={screen}
        setScreen={setScreen}
        showScreens={effectiveLayout === "single"}
        showLayoutToggle={!forceSingle}
      />

      {effectiveLayout === "triptych" ? (
        <Triptych />
      ) : (
        <SinglePhone screen={screen} setScreen={setScreen} scale={scale} />
      )}

      <Footer />
    </main>
  );
}

function TopBar({
  layout,
  setLayout,
  screen,
  setScreen,
  showScreens,
  showLayoutToggle,
}: {
  layout: Layout;
  setLayout: (l: Layout) => void;
  screen: VoltScreen;
  setScreen: (s: VoltScreen) => void;
  showScreens: boolean;
  showLayoutToggle: boolean;
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
          fontFamily: serif,
          fontSize: 22,
          letterSpacing: -0.4,
          color: "#fafaf7",
          padding: "0 6px",
        }}
      >
        volt
      </div>
      {showScreens && (
        <div
          style={{
            display: "flex",
            gap: 4,
            background: "rgba(255,255,255,0.06)",
            border: "1px solid rgba(255,255,255,0.08)",
            backdropFilter: "blur(10px)",
            WebkitBackdropFilter: "blur(10px)",
            padding: 4,
            borderRadius: 100,
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
                  padding: "7px 14px",
                  borderRadius: 100,
                  background: active ? "#fafaf7" : "transparent",
                  color: active ? "#0d0d0d" : "#bfbfba",
                  border: "none",
                  cursor: "pointer",
                  fontSize: 12,
                  fontWeight: active ? 600 : 500,
                  fontFamily: sans,
                }}
              >
                {n.label}
              </button>
            );
          })}
        </div>
      )}
      {showLayoutToggle && (
        <div
          style={{
            display: "flex",
            gap: 4,
            background: "rgba(255,255,255,0.06)",
            border: "1px solid rgba(255,255,255,0.08)",
            backdropFilter: "blur(10px)",
            WebkitBackdropFilter: "blur(10px)",
            padding: 4,
            borderRadius: 100,
          }}
        >
          {(["triptych", "single"] as const).map((l) => {
            const active = layout === l;
            return (
              <button
                type="button"
                key={l}
                onClick={() => setLayout(l)}
                style={{
                  padding: "7px 12px",
                  borderRadius: 100,
                  background: active ? "#bef264" : "transparent",
                  color: active ? "#1a1a1a" : "#bfbfba",
                  border: "none",
                  cursor: "pointer",
                  fontSize: 12,
                  fontWeight: active ? 600 : 500,
                  fontFamily: sans,
                  textTransform: "capitalize",
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
  const [home, setHome] = useState<VoltScreen>("home");
  const [cards, setCards] = useState<VoltScreen>("cards");
  const [analytics, setAnalytics] = useState<VoltScreen>("analytics");

  const slots: Array<{
    label: string;
    value: VoltScreen;
    set: (s: VoltScreen) => void;
  }> = [
    { label: "Home", value: home, set: setHome },
    { label: "Cards", value: cards, set: setCards },
    { label: "Analytics", value: analytics, set: setAnalytics },
  ];

  return (
    <div
      style={{
        display: "flex",
        gap: 48,
        justifyContent: "center",
        flexWrap: "wrap",
      }}
    >
      {slots.map((slot) => (
        <PhoneFrame key={slot.label} label={slot.label}>
          <div style={{ position: "absolute", inset: 0 }}>
            {renderScreen(slot.value, (s) => slot.set(asScreen(s)))}
          </div>
        </PhoneFrame>
      ))}
    </div>
  );
}

function SinglePhone({
  screen,
  setScreen,
  scale,
}: {
  screen: VoltScreen;
  setScreen: (s: VoltScreen) => void;
  scale: number;
}) {
  const label = screen === "home" ? "Home" : screen === "cards" ? "Cards" : "Analytics";
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
        <PhoneFrame label={label}>
          <div style={{ position: "absolute", inset: 0 }}>
            {renderScreen(screen, (s) => setScreen(asScreen(s)))}
          </div>
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
        color: "#666",
        fontFamily: sans,
        letterSpacing: 0.3,
        pointerEvents: "none",
      }}
    >
      Volt — fictional banking concept · prototype by{" "}
      <span style={{ color: "#999" }}>ryanzhang.work</span>
    </footer>
  );
}
