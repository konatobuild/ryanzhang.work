"use client";

import { useEffect, useState } from "react";
import { PhoneFrame } from "@/components/PhoneFrame";
import {
  HomeScreen,
  ProductScreen,
  TrackingScreen,
  type FreshScreen,
  type ProductId,
} from "@/components/FreshScreens";

const DEVICE_WIDTH = 390;
const DEVICE_HEIGHT = 810;

type Layout = "triptych" | "focus";

export default function FreshPrototype() {
  const [layout, setLayout] = useState<Layout>("triptych");
  const [screen, setScreen] = useState<FreshScreen>("home");
  const [activeProduct, setActiveProduct] = useState<ProductId>("red");
  const [favs, setFavs] = useState<ProductId[]>([]);

  // Scale the device(s) down on narrow viewports so the frame(s) fit.
  const [scale, setScale] = useState(1);
  useEffect(() => {
    const measure = () => {
      const margin = 48;
      const cols = layout === "triptych" ? 3 : 1;
      const gap = 40;
      const availW = window.innerWidth - margin;
      const availH = window.innerHeight - 180;
      const neededW = DEVICE_WIDTH * cols + gap * (cols - 1);
      setScale(
        Math.min(1, availW / neededW, availH / DEVICE_HEIGHT)
      );
    };
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, [layout]);

  const accent = "#7bc47f";

  const toggleFav = (id: ProductId) => {
    setFavs((f) => (f.includes(id) ? f.filter((x) => x !== id) : [...f, id]));
  };

  const homeProps = {
    accent,
    favs,
    toggleFav,
    onOpenProduct: (id: ProductId) => {
      setActiveProduct(id);
      setScreen("product");
    },
    onOpenTracking: () => setScreen("tracking"),
  };
  const productProps = {
    accent,
    productId: activeProduct,
    favs,
    toggleFav,
    onBack: () => setScreen("home"),
    onAddToCart: () => setScreen("tracking"),
  };
  const trackingProps = {
    onBack: () => setScreen("home"),
  };

  const triptychWidth = DEVICE_WIDTH * 3 + 40 * 2;
  const focusWidth = DEVICE_WIDTH;
  const stageWidth = layout === "triptych" ? triptychWidth : focusWidth;

  return (
    <main
      style={{
        minHeight: "100vh",
        background:
          "radial-gradient(ellipse at top, #2a2a2a 0%, #121212 70%)",
        padding: "60px 20px 80px",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        color: "#fafafa",
      }}
    >
      <header style={{ textAlign: "center", marginBottom: 44, maxWidth: 640 }}>
        <div
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 10,
            marginBottom: 8,
          }}
        >
          <span
            aria-hidden
            style={{
              display: "inline-flex",
              width: 34,
              height: 34,
              borderRadius: 10,
              background: accent,
              alignItems: "center",
              justifyContent: "center",
              boxShadow: `0 0 0 6px ${accent}22`,
            }}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
              <path
                d="M20 4C10 4 4 10 4 20c0-1 0-3 1-5 4 0 10-3 12-7 1-1 2-3 3-4z"
                fill="#0f2710"
              />
            </svg>
          </span>
          <span
            style={{
              fontSize: 26,
              fontWeight: 800,
              letterSpacing: 2,
              color: "#fafafa",
            }}
          >
            FRESH
          </span>
        </div>
        <div style={{ fontSize: 14, color: "rgba(250,250,250,0.6)" }}>
          Three-screen smoothie delivery prototype — tap a card to open a
          product, tap the shield tab to watch the order track across a real
          city map.
        </div>
      </header>

      {/* Layout toggle */}
      <nav
        style={{
          display: "flex",
          gap: 6,
          padding: 4,
          borderRadius: 999,
          background: "rgba(255,255,255,0.06)",
          border: "1px solid rgba(255,255,255,0.1)",
          marginBottom: 36,
        }}
      >
        {(["triptych", "focus"] as const).map((l) => {
          const active = l === layout;
          return (
            <button
              type="button"
              key={l}
              onClick={() => setLayout(l)}
              style={{
                padding: "8px 16px",
                borderRadius: 999,
                border: "none",
                cursor: "pointer",
                background: active ? accent : "transparent",
                color: active ? "#0f2710" : "rgba(250,250,250,0.7)",
                fontSize: 12,
                fontWeight: 700,
                fontFamily: "inherit",
                textTransform: "uppercase",
                letterSpacing: 1.2,
              }}
            >
              {l === "triptych" ? "All 3" : "Focus"}
            </button>
          );
        })}
      </nav>

      {/* Stage */}
      <div
        style={{
          width: stageWidth * scale,
          height: DEVICE_HEIGHT * scale,
          position: "relative",
        }}
      >
        <div
          style={{
            width: stageWidth,
            height: DEVICE_HEIGHT,
            transform: `scale(${scale})`,
            transformOrigin: "top left",
            position: "absolute",
            top: 0,
            left: 0,
            display: "flex",
            gap: 40,
            justifyContent: "center",
          }}
        >
          {layout === "triptych" ? (
            <>
              <PhoneLabel label="Home">
                <PhoneFrame>
                  <HomeScreen {...homeProps} />
                </PhoneFrame>
              </PhoneLabel>
              <PhoneLabel label="Product">
                <PhoneFrame>
                  <ProductScreen {...productProps} />
                </PhoneFrame>
              </PhoneLabel>
              <PhoneLabel label="Tracking">
                <PhoneFrame>
                  <TrackingScreen {...trackingProps} />
                </PhoneFrame>
              </PhoneLabel>
            </>
          ) : (
            <PhoneFrame>
              {screen === "home" && <HomeScreen {...homeProps} />}
              {screen === "product" && <ProductScreen {...productProps} />}
              {screen === "tracking" && <TrackingScreen {...trackingProps} />}
            </PhoneFrame>
          )}
        </div>
      </div>

      {/* Focus-mode quick nav */}
      {layout === "focus" && (
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
          {(["home", "product", "tracking"] as const).map((s) => {
            const active = s === screen;
            return (
              <button
                type="button"
                key={s}
                onClick={() => setScreen(s)}
                style={{
                  padding: "8px 16px",
                  borderRadius: 999,
                  border: "none",
                  cursor: "pointer",
                  background: active ? "#fff" : "transparent",
                  color: active ? "#111" : "rgba(250,250,250,0.7)",
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
      )}
    </main>
  );
}

function PhoneLabel({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div style={{ position: "relative" }}>
      <div
        style={{
          position: "absolute",
          top: -28,
          left: 0,
          right: 0,
          textAlign: "center",
          color: "#888",
          fontSize: 12,
          letterSpacing: 2,
          textTransform: "uppercase",
          fontFamily: "var(--font-jetbrains-mono), monospace",
        }}
      >
        {label}
      </div>
      {children}
    </div>
  );
}
