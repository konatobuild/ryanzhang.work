"use client";

import { useEffect, useRef, useState } from "react";
import {
  COLORS,
  IOSDevice,
  PHONE_H,
  PHONE_W,
  SCREENS,
  TabBar,
  sans,
  type ScreenId,
} from "@/components/SunholdScreens";

export default function SunholdPage() {
  const [screen, setScreen] = useState<ScreenId>("reserve");
  const [scale, setScale] = useState(1);
  const scrollerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const fit = () => {
      const w = window.innerWidth;
      const h = window.innerHeight;
      // Leave room for the stage label + breathing space.
      const availH = h - 200;
      const availW = w - 48;
      const s = Math.min(1, availH / PHONE_H, availW / PHONE_W);
      setScale(s);
    };
    fit();
    window.addEventListener("resize", fit);
    return () => window.removeEventListener("resize", fit);
  }, []);

  // Reset scroll when screen changes so headers clear the status bar.
  useEffect(() => {
    const root = scrollerRef.current;
    if (!root) return;
    const scroller = root.querySelector<HTMLDivElement>(
      '[data-ios-scroller="true"]'
    );
    if (scroller) scroller.scrollTop = 0;
  }, [screen]);

  const Current = SCREENS[screen];

  return (
    <main
      style={{
        minHeight: "100vh",
        position: "relative",
        background: COLORS.stage,
        fontFamily: sans,
        padding: "56px 24px 72px",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      <StageHeader />

      <div
        style={{
          width: PHONE_W * scale,
          height: PHONE_H * scale,
          position: "relative",
          marginTop: 24,
        }}
      >
        <div
          ref={scrollerRef}
          style={{
            width: PHONE_W,
            height: PHONE_H,
            transform: `scale(${scale})`,
            transformOrigin: "top left",
            position: "absolute",
            top: 0,
            left: 0,
          }}
        >
          <IOSDevice>
            <div
              data-ios-scroller="true"
              style={{ position: "relative", height: "100%" }}
            >
              <Current onNavigate={setScreen} />
              <TabBar active={screen} onChange={setScreen} />
            </div>
          </IOSDevice>
        </div>
      </div>

      <Footer />
    </main>
  );
}

function StageHeader() {
  return (
    <header
      style={{
        position: "fixed",
        top: 20,
        left: "50%",
        transform: "translateX(-50%)",
        display: "flex",
        alignItems: "center",
        gap: 10,
        zIndex: 100,
      }}
    >
      <SunMark />
      <div
        style={{
          fontFamily: sans,
          fontSize: 13,
          letterSpacing: "0.28em",
          textTransform: "uppercase",
          color: "rgba(17,17,17,0.85)",
          fontWeight: 700,
        }}
      >
        sunhold
      </div>
      <div
        style={{
          width: 1,
          height: 14,
          background: "rgba(17,17,17,0.25)",
          margin: "0 4px",
        }}
      />
      <div
        style={{
          fontSize: 12,
          letterSpacing: "0.04em",
          color: "rgba(17,17,17,0.6)",
          fontWeight: 500,
        }}
      >
        Home energy monitor
      </div>
    </header>
  );
}

function SunMark() {
  return (
    <svg width={20} height={20} viewBox="0 0 24 24" aria-hidden>
      <circle cx="12" cy="12" r="4" fill="#111" />
      <g stroke="#111" strokeWidth="2" strokeLinecap="round">
        <path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" />
      </g>
    </svg>
  );
}

function Footer() {
  return (
    <footer
      style={{
        position: "fixed",
        bottom: 14,
        left: 0,
        right: 0,
        textAlign: "center",
        fontSize: 11,
        color: "rgba(17,17,17,0.55)",
        fontFamily: sans,
        letterSpacing: 0.3,
        pointerEvents: "none",
      }}
    >
      Sunhold — fictional home energy concept · prototype by{" "}
      <span style={{ color: "rgba(17,17,17,0.8)" }}>ryanzhang.work</span>
    </footer>
  );
}
