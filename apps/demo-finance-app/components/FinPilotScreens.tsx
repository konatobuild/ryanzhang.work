"use client";

import type { CSSProperties, ReactNode } from "react";
import { useMemo, useState } from "react";

// ──────────────────────────── Theme ────────────────────────────
export const T = {
  bg: "#0B0B0D",
  bgSoft: "#141418",
  card: "#1A1A1F",
  cardSoft: "#202026",
  text: "#F5F5F0",
  mute: "rgba(245,245,240,0.55)",
  dim: "rgba(245,245,240,0.35)",
  sage: "#C8E6A0",
  sageDeep: "#9FC46B",
  lav: "#CFC0F0",
  lavDeep: "#A98FE0",
  stroke: "rgba(255,255,255,0.08)",
} as const;

export const serif = "'Fraunces', 'Times New Roman', Georgia, serif";
export const sans = "'Inter', -apple-system, system-ui, sans-serif";

export type FinPilotScreen = "dash" | "goals" | "house";

// ──────────────────────────── Phone frame ────────────────────────────
export function Phone({ children }: { children: ReactNode }) {
  return (
    <div
      style={{
        width: 390,
        height: 844,
        borderRadius: 54,
        position: "relative",
        background: "#111",
        padding: 10,
        boxSizing: "border-box",
        boxShadow:
          "0 0 0 2px #2a2a2a, 0 40px 100px rgba(0,0,0,0.45), 0 10px 30px rgba(0,0,0,0.3)",
      }}
    >
      {/* side buttons */}
      <div
        style={{
          position: "absolute",
          left: -2,
          top: 120,
          width: 4,
          height: 32,
          borderRadius: 2,
          background: "#1a1a1a",
        }}
      />
      <div
        style={{
          position: "absolute",
          left: -2,
          top: 180,
          width: 4,
          height: 56,
          borderRadius: 2,
          background: "#1a1a1a",
        }}
      />
      <div
        style={{
          position: "absolute",
          left: -2,
          top: 250,
          width: 4,
          height: 56,
          borderRadius: 2,
          background: "#1a1a1a",
        }}
      />
      <div
        style={{
          position: "absolute",
          right: -2,
          top: 170,
          width: 4,
          height: 88,
          borderRadius: 2,
          background: "#1a1a1a",
        }}
      />

      <div
        style={{
          width: "100%",
          height: "100%",
          borderRadius: 44,
          overflow: "hidden",
          background: T.bg,
          position: "relative",
        }}
      >
        {/* status bar */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            height: 54,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "0 32px",
            zIndex: 50,
            fontFamily: sans,
            fontSize: 16,
            fontWeight: 600,
            color: "#fff",
          }}
        >
          <span style={{ paddingTop: 14 }}>11:31</span>
          <div
            style={{
              paddingTop: 14,
              display: "flex",
              gap: 6,
              alignItems: "center",
            }}
          >
            <svg width="17" height="11" viewBox="0 0 17 11" aria-hidden>
              <g fill="#fff">
                <rect x="0" y="7" width="3" height="4" rx="0.5" />
                <rect x="4.5" y="5" width="3" height="6" rx="0.5" />
                <rect x="9" y="2.5" width="3" height="8.5" rx="0.5" />
                <rect x="13.5" y="0" width="3" height="11" rx="0.5" />
              </g>
            </svg>
            <svg
              width="15"
              height="11"
              viewBox="0 0 15 11"
              fill="#fff"
              aria-hidden
            >
              <path d="M7.5 2.8c2 0 3.9.8 5.2 2l1-1a9 9 0 0 0-12.4 0l1 1c1.3-1.2 3.2-2 5.2-2zm0 3.1c1.2 0 2.3.5 3.1 1.2l1-1a6 6 0 0 0-8.2 0l1 1a4.4 4.4 0 0 1 3.1-1.2zM7.5 9a1.5 1.5 0 1 0 0 3 1.5 1.5 0 0 0 0-3z" />
            </svg>
            <svg width="25" height="11" viewBox="0 0 25 11" aria-hidden>
              <rect
                x="0.5"
                y="0.5"
                width="21"
                height="10"
                rx="2.5"
                stroke="#fff"
                strokeOpacity="0.4"
                fill="none"
              />
              <rect x="2" y="2" width="18" height="7" rx="1.5" fill="#fff" />
              <rect
                x="22.5"
                y="3.5"
                width="1.5"
                height="4"
                rx="0.5"
                fill="#fff"
                fillOpacity="0.4"
              />
            </svg>
          </div>
        </div>
        {/* notch */}
        <div
          style={{
            position: "absolute",
            top: 10,
            left: "50%",
            transform: "translateX(-50%)",
            width: 120,
            height: 34,
            borderRadius: 20,
            background: "#000",
            zIndex: 60,
          }}
        />
        {children}
      </div>
    </div>
  );
}

// ──────────────────────────── Icons ────────────────────────────
const Icon = {
  plus: (c = "#fff", s = 14) => (
    <svg width={s} height={s} viewBox="0 0 14 14" fill="none" aria-hidden>
      <path
        d="M7 1v12M1 7h12"
        stroke={c}
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </svg>
  ),
  spark: (c: string = T.sage) => (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden>
      <path
        d="M9 1v5M9 12v5M1 9h5M12 9h5M3.5 3.5l3 3M11.5 11.5l3 3M14.5 3.5l-3 3M6.5 11.5l-3 3"
        stroke={c}
        strokeWidth="1.6"
        strokeLinecap="round"
      />
    </svg>
  ),
  info: (c: string = T.mute) => (
    <svg width="13" height="13" viewBox="0 0 13 13" fill="none" aria-hidden>
      <circle cx="6.5" cy="6.5" r="5.5" stroke={c} strokeWidth="1.2" />
      <circle cx="6.5" cy="3.8" r="0.7" fill={c} />
      <path d="M6.5 6v4" stroke={c} strokeWidth="1.2" strokeLinecap="round" />
    </svg>
  ),
  bell: (c = "#fff") => (
    <svg width="16" height="18" viewBox="0 0 16 18" fill="none" aria-hidden>
      <path
        d="M8 1v1m0 0a5 5 0 0 0-5 5v3l-2 3h14l-2-3V7a5 5 0 0 0-5-5zM6 15a2 2 0 0 0 4 0"
        stroke={c}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  ),
  inviteUser: (c = "#fff") => (
    <svg width="18" height="16" viewBox="0 0 18 16" fill="none" aria-hidden>
      <circle cx="7" cy="4.5" r="3" stroke={c} strokeWidth="1.5" />
      <path
        d="M1 15c0-3 3-5 6-5s6 2 6 5M14 4v4M12 6h4"
        stroke={c}
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  ),
  close: (c: string = T.mute) => (
    <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden>
      <path
        d="M1 1l10 10M11 1L1 11"
        stroke={c}
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  ),
  chev: (c: string = T.mute) => (
    <svg width="8" height="12" viewBox="0 0 8 12" fill="none" aria-hidden>
      <path
        d="M1 1l6 5-6 5"
        stroke={c}
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  ),
  home: (c = "#fff") => (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden>
      <path d="M2 9l8-7 8 7v9a1 1 0 0 1-1 1h-4v-6H7v6H3a1 1 0 0 1-1-1V9z" fill={c} />
    </svg>
  ),
  search: (c = "#fff") => (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden>
      <circle cx="8.5" cy="8.5" r="6.5" stroke={c} strokeWidth="1.8" />
      <path d="M13.5 13.5L19 19" stroke={c} strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  ),
  wallet: (c = "#fff") => (
    <svg width="20" height="18" viewBox="0 0 20 18" fill="none" aria-hidden>
      <rect x="1" y="3" width="18" height="14" rx="2.5" stroke={c} strokeWidth="1.8" />
      <path d="M1 7h18M14 12h2" stroke={c} strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  ),
  swap: (c = "#fff") => (
    <svg width="20" height="16" viewBox="0 0 20 16" fill="none" aria-hidden>
      <path
        d="M1 5h16m0 0l-4-4m4 4l-4 4M19 11H3m0 0l4-4m-4 4l4 4"
        stroke={c}
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  ),
  back: (c = "#fff") => (
    <svg width="18" height="14" viewBox="0 0 18 14" fill="none" aria-hidden>
      <path
        d="M7 1L1 7l6 6"
        stroke={c}
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  ),
};

// ──────────────────────────── Spark chart (dashboard) ────────────────────────────
function buildSparkPoints(): number[] {
  const seed = [
    0.2, 0.25, 0.3, 0.28, 0.35, 0.4, 0.45, 0.5, 0.48, 0.55, 0.6, 0.62, 0.7,
    0.72, 0.68, 0.75, 0.8, 0.78, 0.85, 0.9, 0.88, 0.92, 0.95, 0.93, 0.97, 0.94,
    0.9,
  ];
  const expanded: number[] = [];
  for (let i = 0; i < seed.length - 1; i++) {
    for (let j = 0; j < 4; j++) {
      const t = j / 4;
      const base = seed[i] * (1 - t) + seed[i + 1] * t;
      const noise =
        (Math.sin(i * 7 + j * 3.1) * 0.5 + Math.cos(i * 2.3 + j * 5) * 0.5) *
        0.06;
      expanded.push(Math.max(0.05, Math.min(1, base + noise)));
    }
  }
  return expanded;
}

function SparkChart({ w = 358, h = 150 }: { w?: number; h?: number }) {
  const pts = useMemo(buildSparkPoints, []);
  const step = w / (pts.length - 1);
  const line = pts
    .map(
      (p, i) =>
        `${i === 0 ? "M" : "L"} ${i * step} ${h - p * h * 0.85 - 10}`,
    )
    .join(" ");
  const area = `${line} L ${w} ${h} L 0 ${h} Z`;
  return (
    <svg width={w} height={h} style={{ display: "block" }} aria-hidden>
      <defs>
        <linearGradient id="finpilotChartFill" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#CFC0F0" stopOpacity="0.45" />
          <stop offset="100%" stopColor="#CFC0F0" stopOpacity="0" />
        </linearGradient>
      </defs>
      <path d={area} fill="url(#finpilotChartFill)" />
      <path d={line} stroke="#CFC0F0" strokeWidth="1.5" fill="none" />
    </svg>
  );
}

function AvatarBubble() {
  return (
    <div
      style={{
        width: 36,
        height: 36,
        borderRadius: "50%",
        background:
          "linear-gradient(135deg, #E5C5A8 0%, #B88A6A 60%, #8B5A3C 100%)",
        position: "relative",
        overflow: "hidden",
        border: "1px solid rgba(255,255,255,0.15)",
      }}
    >
      <div
        style={{
          position: "absolute",
          top: 6,
          left: "50%",
          transform: "translateX(-50%)",
          width: 14,
          height: 14,
          borderRadius: "50%",
          background: "linear-gradient(180deg, #F2D5B8, #D4A480)",
        }}
      />
      <div
        style={{
          position: "absolute",
          bottom: -2,
          left: "50%",
          transform: "translateX(-50%)",
          width: 30,
          height: 14,
          borderRadius: "50% 50% 0 0",
          background: "#2D2520",
        }}
      />
    </div>
  );
}

// ──────────────────────────── Dashboard ────────────────────────────
type Nav = (s: FinPilotScreen) => void;

export function Dashboard({ go }: { go: Nav }) {
  return (
    <div
      style={{
        height: "100%",
        background: T.bg,
        color: T.text,
        fontFamily: sans,
        display: "flex",
        flexDirection: "column",
        paddingTop: 50,
      }}
    >
      {/* top bar */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "8px 20px 12px",
        }}
      >
        <button
          type="button"
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            background: "transparent",
            border: `1px solid ${T.stroke}`,
            borderRadius: 100,
            padding: "8px 14px 8px 12px",
            color: T.text,
            fontFamily: sans,
            fontSize: 14,
            fontWeight: 500,
            cursor: "pointer",
          }}
        >
          {Icon.inviteUser()}
          <span>Invite</span>
        </button>
        <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
          <div
            style={{
              width: 40,
              height: 40,
              borderRadius: "50%",
              border: `1px solid ${T.stroke}`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            {Icon.bell()}
          </div>
          <AvatarBubble />
        </div>
      </div>

      {/* balance */}
      <div style={{ padding: "4px 24px 12px" }}>
        <div
          style={{
            fontSize: 13,
            color: T.mute,
            fontWeight: 500,
            marginBottom: 6,
          }}
        >
          Total balance · <span style={{ color: T.dim }}>All time</span>
        </div>
        <div
          style={{
            fontFamily: serif,
            fontSize: 46,
            fontWeight: 400,
            letterSpacing: -1.2,
            lineHeight: 1,
            color: T.text,
            fontFeatureSettings: "'ss01', 'tnum'",
          }}
        >
          $ 35,981.<span style={{ fontSize: 42 }}>00</span>
        </div>
      </div>

      {/* chart */}
      <div style={{ padding: "4px 16px 14px" }}>
        <SparkChart w={358} h={150} />
      </div>

      {/* cash / investments cards */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: 10,
          padding: "0 16px 10px",
        }}
      >
        {[
          { label: "Cash", delta: "+0.8%", value: "11,250.00" },
          { label: "Investments", delta: "+1.2%", value: "21,231.00" },
        ].map((c) => (
          <div
            key={c.label}
            style={{
              background: T.card,
              borderRadius: 18,
              padding: "14px 16px 16px",
              border: `1px solid ${T.stroke}`,
            }}
          >
            <div
              style={{
                fontSize: 14,
                color: T.text,
                fontWeight: 500,
                marginBottom: 10,
              }}
            >
              {c.label}
            </div>
            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                background: "rgba(200,230,160,0.18)",
                color: T.sage,
                borderRadius: 100,
                padding: "3px 9px",
                fontSize: 11,
                fontWeight: 600,
                marginBottom: 10,
              }}
            >
              {c.delta}
            </div>
            <div
              style={{
                fontFamily: serif,
                fontSize: 22,
                letterSpacing: -0.3,
                color: T.text,
              }}
            >
              $ {c.value}
            </div>
          </div>
        ))}
      </div>

      {/* AI forecast banner */}
      <div style={{ padding: "0 16px 10px" }}>
        <button
          type="button"
          onClick={() => go("house")}
          style={{
            width: "100%",
            background: T.sage,
            color: "#1a2415",
            border: "none",
            borderRadius: 18,
            padding: "14px 16px 16px",
            textAlign: "left",
            cursor: "pointer",
            fontFamily: sans,
            position: "relative",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              marginBottom: 6,
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 6,
                fontSize: 12,
                fontWeight: 600,
                whiteSpace: "nowrap",
              }}
            >
              {Icon.spark("#2a3a1a")}
              <span>FinPilot AI forecast</span>
            </div>
            {Icon.close("#2a3a1a")}
          </div>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "flex-end",
              gap: 10,
            }}
          >
            <div
              style={{
                fontFamily: serif,
                fontSize: 19,
                fontWeight: 400,
                lineHeight: 1.15,
                letterSpacing: -0.3,
              }}
            >
              How soon can you
              <br />
              buy a house?
            </div>
            <div
              style={{
                background: "#fff",
                color: "#111",
                borderRadius: 100,
                padding: "8px 16px",
                fontSize: 13,
                fontWeight: 600,
                flexShrink: 0,
                whiteSpace: "nowrap",
              }}
            >
              Find out
            </div>
          </div>
        </button>
      </div>

      {/* goals bar */}
      <div style={{ padding: "0 16px 10px" }}>
        <button
          type="button"
          onClick={() => go("goals")}
          style={{
            width: "100%",
            background: T.card,
            color: T.text,
            border: `1px solid ${T.stroke}`,
            borderRadius: 18,
            padding: "14px 16px",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            cursor: "pointer",
            fontFamily: sans,
          }}
        >
          <span
            style={{
              fontFamily: serif,
              fontSize: 22,
              fontWeight: 500,
              letterSpacing: -0.3,
            }}
          >
            Goals
          </span>
          <span
            style={{
              width: 30,
              height: 30,
              borderRadius: "50%",
              border: `1px solid ${T.stroke}`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 13,
              color: T.mute,
            }}
          >
            3
          </span>
        </button>
      </div>

      {/* tab bar */}
      <div style={{ marginTop: "auto" }}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-around",
            padding: "14px 20px 10px",
            background: T.bg,
            position: "relative",
          }}
        >
          <div
            style={{
              width: 42,
              height: 42,
              borderRadius: "50%",
              background: "#2a2a30",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
            }}
          >
            {Icon.home()}
          </div>
          <div
            style={{
              width: 42,
              height: 42,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
            }}
          >
            {Icon.search(T.mute)}
          </div>
          <div
            style={{
              width: 54,
              height: 54,
              borderRadius: "50%",
              background: "linear-gradient(180deg, #C3AAF5 0%, #9E80E0 100%)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              boxShadow:
                "0 6px 20px rgba(158,128,224,0.45), inset 0 1px 0 rgba(255,255,255,0.3)",
              flexShrink: 0,
            }}
          >
            {Icon.plus("#fff", 18)}
          </div>
          <div
            style={{
              width: 42,
              height: 42,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
            }}
          >
            {Icon.wallet(T.mute)}
          </div>
          <div
            style={{
              width: 42,
              height: 42,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
            }}
          >
            {Icon.swap(T.mute)}
          </div>
        </div>
        <div
          style={{
            height: 24,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background: T.bg,
          }}
        >
          <div
            style={{
              width: 134,
              height: 5,
              borderRadius: 100,
              background: "rgba(255,255,255,0.85)",
            }}
          />
        </div>
      </div>
    </div>
  );
}

// ──────────────────────────── Goals ────────────────────────────
function GoalHouseIcon() {
  return (
    <div
      style={{
        width: 44,
        height: 44,
        borderRadius: 10,
        background: "linear-gradient(180deg, #8FA8C4, #5D7A99)",
        position: "relative",
        overflow: "hidden",
        flexShrink: 0,
        border: "1px solid rgba(255,255,255,0.1)",
      }}
    >
      <svg
        width="44"
        height="44"
        viewBox="0 0 44 44"
        style={{ position: "absolute", inset: 0 }}
        aria-hidden
      >
        <path d="M10 22l12-10 12 10v12H10z" fill="#EADDC8" />
        <path
          d="M10 22l12-10 12 10"
          fill="none"
          stroke="#8B5E3C"
          strokeWidth="1.2"
        />
        <rect x="19" y="26" width="6" height="8" fill="#8B5E3C" />
        <rect x="14" y="24" width="4" height="4" fill="#9DB8D4" />
        <rect x="26" y="24" width="4" height="4" fill="#9DB8D4" />
      </svg>
    </div>
  );
}

function GoalCollegeIcon() {
  return (
    <div
      style={{
        width: 44,
        height: 44,
        borderRadius: 10,
        background: "linear-gradient(180deg, #C4B08F, #8B7355)",
        position: "relative",
        overflow: "hidden",
        flexShrink: 0,
        border: "1px solid rgba(255,255,255,0.1)",
      }}
    >
      <svg
        width="44"
        height="44"
        viewBox="0 0 44 44"
        style={{ position: "absolute", inset: 0 }}
        aria-hidden
      >
        <rect x="8" y="14" width="28" height="20" fill="#E8DEC5" />
        <path
          d="M8 14L22 6l14 8"
          fill="#D4C4A0"
          stroke="#8B6E3C"
          strokeWidth="0.8"
        />
        <rect x="12" y="18" width="3" height="5" fill="#5D4A2C" />
        <rect x="18" y="18" width="3" height="5" fill="#5D4A2C" />
        <rect x="24" y="18" width="3" height="5" fill="#5D4A2C" />
        <rect x="30" y="18" width="3" height="5" fill="#5D4A2C" />
        <rect x="19" y="26" width="6" height="8" fill="#5D4A2C" />
      </svg>
    </div>
  );
}

function GoalRetireIcon() {
  return (
    <div
      style={{
        width: 44,
        height: 44,
        borderRadius: 10,
        background: "linear-gradient(180deg, #D4A888, #A87655)",
        position: "relative",
        overflow: "hidden",
        flexShrink: 0,
        border: "1px solid rgba(255,255,255,0.1)",
      }}
    >
      <svg
        width="44"
        height="44"
        viewBox="0 0 44 44"
        style={{ position: "absolute", inset: 0 }}
        aria-hidden
      >
        <circle cx="22" cy="18" r="6" fill="#F5D9B5" />
        <path d="M10 36c0-7 5-11 12-11s12 4 12 11" fill="#4A8C8C" />
      </svg>
    </div>
  );
}

type GoalRowProps = {
  icon: ReactNode;
  title: string;
  tag: string;
  category: string;
  current: number;
  target: number;
  onClick?: () => void;
};

function GoalRow({
  icon,
  title,
  tag,
  category,
  current,
  target,
  onClick,
}: GoalRowProps) {
  const pct = Math.min(100, (current / target) * 100);
  const fmt = (n: number) =>
    n.toLocaleString("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  return (
    <button
      type="button"
      onClick={onClick}
      style={{
        width: "100%",
        background: T.card,
        border: `1px solid ${T.stroke}`,
        borderRadius: 20,
        padding: "14px 16px",
        cursor: "pointer",
        fontFamily: sans,
        color: T.text,
        textAlign: "left",
        display: "block",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 12,
          marginBottom: 12,
        }}
      >
        {icon}
        <div style={{ flex: 1, minWidth: 0 }}>
          <div
            style={{
              fontFamily: serif,
              fontSize: 22,
              fontWeight: 500,
              letterSpacing: -0.3,
              color: T.text,
              lineHeight: 1.1,
              marginBottom: 2,
            }}
          >
            {title}
          </div>
          <div style={{ fontSize: 12, color: T.mute }}>
            {tag} · {category}
          </div>
        </div>
        {Icon.chev()}
      </div>
      <div
        style={{
          height: 3,
          background: "rgba(255,255,255,0.08)",
          borderRadius: 2,
          marginBottom: 10,
        }}
      >
        <div
          style={{
            width: `${pct}%`,
            height: "100%",
            background: T.lav,
            borderRadius: 2,
          }}
        />
      </div>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          fontFamily: serif,
          fontSize: 14,
          color: T.text,
        }}
      >
        <span>$ {fmt(current)}</span>
        <span style={{ color: T.mute }}>$ {fmt(target)}</span>
      </div>
    </button>
  );
}

export function Goals({ go }: { go: Nav }) {
  const [bannerOpen, setBannerOpen] = useState(true);
  return (
    <div
      style={{
        height: "100%",
        background: T.bg,
        color: T.text,
        fontFamily: sans,
        display: "flex",
        flexDirection: "column",
        paddingTop: 56,
        overflow: "auto",
      }}
    >
      {/* top bar */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "12px 20px 18px",
        }}
      >
        <button
          type="button"
          onClick={() => go("dash")}
          style={{
            background: "none",
            border: "none",
            color: T.text,
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            gap: 8,
            fontFamily: sans,
            fontSize: 16,
            fontWeight: 600,
            padding: 0,
          }}
        >
          {Icon.back()}
          Back
        </button>
        <div
          style={{
            width: 36,
            height: 36,
            borderRadius: "50%",
            border: `1px solid ${T.stroke}`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {Icon.plus("#fff", 12)}
        </div>
      </div>

      {/* title */}
      <div style={{ padding: "0 20px 14px" }}>
        <h1
          style={{
            fontFamily: serif,
            fontSize: 40,
            fontWeight: 400,
            lineHeight: 1.02,
            letterSpacing: -1,
            margin: 0,
            color: T.text,
          }}
        >
          You have <span style={{ fontStyle: "italic" }}>3</span>
          <br />
          <span style={{ fontStyle: "italic" }}>long-term goals</span>
        </h1>
        <p
          style={{
            fontSize: 14,
            color: T.mute,
            lineHeight: 1.45,
            marginTop: 14,
            marginBottom: 0,
          }}
        >
          Long-term goals focus on empowering users
          <br />
          to achieve financial independence through
          <br />
          automated and personalized planning.
        </p>
      </div>

      {/* banner */}
      {bannerOpen && (
        <div style={{ padding: "14px 16px 12px" }}>
          <div
            style={{
              background: T.lav,
              color: "#1f1a30",
              borderRadius: 20,
              padding: "14px 16px 10px",
              fontFamily: sans,
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: 6,
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 6,
                  fontSize: 13,
                  fontWeight: 600,
                  whiteSpace: "nowrap",
                }}
              >
                {Icon.spark("#2d2250")}
                <span>You&apos;re nailing it!</span>
              </div>
              <button
                type="button"
                onClick={() => setBannerOpen(false)}
                style={{
                  background: "none",
                  border: "none",
                  padding: 4,
                  cursor: "pointer",
                }}
                aria-label="Dismiss"
              >
                {Icon.close("#2d2250")}
              </button>
            </div>
            <div
              style={{
                fontSize: 13.5,
                lineHeight: 1.45,
                marginBottom: 12,
                color: "#2d2250",
              }}
            >
              We&apos;ve analyzed your savings and it looks like
              <br />
              you&apos;ll reach your goal by age 57.
            </div>
            <div
              style={{
                background: "#fff",
                borderRadius: 14,
                padding: "10px 16px",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                fontFamily: serif,
              }}
            >
              <span style={{ color: "#999", fontSize: 15 }}>32</span>
              <span
                style={{
                  color: "#111",
                  fontSize: 22,
                  fontWeight: 500,
                  letterSpacing: -0.4,
                }}
              >
                age 57
              </span>
              <span style={{ color: "#c7b8e8", fontSize: 15 }}>62</span>
            </div>
          </div>
        </div>
      )}

      {/* goals list */}
      <div
        style={{
          padding: "4px 16px 24px",
          display: "flex",
          flexDirection: "column",
          gap: 10,
        }}
      >
        <GoalRow
          icon={<GoalHouseIcon />}
          title="Buy a house"
          tag="Individual"
          category="Real Estate"
          current={51385}
          target={167800}
          onClick={() => go("house")}
        />
        <GoalRow
          icon={<GoalCollegeIcon />}
          title="College for kid"
          tag="Individual"
          category="Education"
          current={3500}
          target={61360.99}
        />
        <GoalRow
          icon={<GoalRetireIcon />}
          title="Retire at age 62"
          tag="Individual"
          category="Retirement"
          current={18920}
          target={820000}
        />
      </div>
    </div>
  );
}

// ──────────────────────────── House detail ────────────────────────────
function FinAccountIcons() {
  const ring: CSSProperties = {
    width: 28,
    height: 28,
    borderRadius: "50%",
    border: `2px solid ${T.card}`,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  };
  return (
    <div style={{ display: "flex", alignItems: "center" }}>
      <div style={{ ...ring, background: "#B82C2C" }}>
        <svg width="14" height="14" viewBox="0 0 14 14" aria-hidden>
          <rect x="5" y="1" width="4" height="4" fill="#fff" />
          <rect x="1" y="5" width="4" height="4" fill="#fff" />
          <rect x="9" y="5" width="4" height="4" fill="#fff" />
          <rect x="5" y="9" width="4" height="4" fill="#fff" />
        </svg>
      </div>
      <div
        style={{
          ...ring,
          background: "#E8F5A0",
          marginLeft: -8,
          color: "#2a3a1a",
          fontWeight: 700,
          fontSize: 11,
        }}
      >
        ct
      </div>
      <div style={{ ...ring, background: "#1B3A6B", marginLeft: -8 }}>
        <svg width="14" height="12" viewBox="0 0 14 12" aria-hidden>
          <path
            d="M1 11h12M2 4l5-3 5 3M3 4h8v7H3z"
            stroke="#fff"
            strokeWidth="1.2"
            fill="none"
          />
        </svg>
      </div>
      <div style={{ ...ring, background: T.sage, marginLeft: -8 }}>
        {Icon.spark("#2a3a1a")}
      </div>
    </div>
  );
}

function SectionNumber({ n, color = T.sage }: { n: string; color?: string }) {
  return (
    <div
      style={{
        width: 22,
        height: 22,
        borderRadius: "50%",
        background: "transparent",
        border: `1.5px solid ${color}`,
        color: color,
        fontSize: 12,
        fontWeight: 600,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexShrink: 0,
        fontFamily: sans,
      }}
    >
      {n}
    </div>
  );
}

export function HouseDetail({ go }: { go: Nav }) {
  return (
    <div
      style={{
        height: "100%",
        background: T.bg,
        color: T.text,
        fontFamily: sans,
        display: "flex",
        flexDirection: "column",
        paddingTop: 56,
        overflow: "auto",
      }}
    >
      {/* top bar */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "12px 20px 18px",
        }}
      >
        <button
          type="button"
          onClick={() => go("goals")}
          style={{
            background: "none",
            border: "none",
            color: T.text,
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            gap: 8,
            fontFamily: sans,
            fontSize: 16,
            fontWeight: 600,
            padding: 0,
          }}
        >
          {Icon.back()}
          Back
        </button>
        <div>{Icon.spark()}</div>
      </div>

      {/* title */}
      <div style={{ padding: "0 20px 14px" }}>
        <h1
          style={{
            fontFamily: serif,
            fontSize: 40,
            fontWeight: 400,
            lineHeight: 1.02,
            letterSpacing: -1,
            margin: 0,
            color: T.text,
          }}
        >
          Buying your
          <br />
          <span style={{ color: T.sage, fontStyle: "italic" }}>own house</span>
        </h1>
        <p
          style={{
            fontSize: 14,
            color: T.mute,
            lineHeight: 1.45,
            marginTop: 14,
            marginBottom: 0,
          }}
        >
          FinPilot helps you calculate the cost of
          <br />
          buying a house through its HomePlan
          <br />
          planning tool, which integrates various
          <br />
          personal financial parameters and external
          <br />
          data to project affordability.
        </p>
      </div>

      {/* Section 1 header */}
      <div
        style={{
          padding: "20px 20px 12px",
          display: "flex",
          alignItems: "center",
          gap: 10,
        }}
      >
        <SectionNumber n="1" />
        <h2
          style={{
            fontFamily: serif,
            fontSize: 20,
            fontWeight: 500,
            letterSpacing: -0.3,
            margin: 0,
            color: T.text,
          }}
        >
          Current Financial Standing
        </h2>
      </div>

      {/* 2x2 grid */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: 10,
          padding: "0 16px",
        }}
      >
        {/* Net worth — highlighted */}
        <div
          style={{
            background: T.lav,
            color: "#1f1a30",
            borderRadius: 20,
            padding: "14px 16px 16px",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 4,
              fontSize: 13,
              fontWeight: 600,
              marginBottom: 14,
            }}
          >
            Current net worth {Icon.info("#5a4a80")}
          </div>
          <div
            style={{
              fontFamily: serif,
              fontSize: 22,
              letterSpacing: -0.4,
              marginBottom: 14,
              color: "#1f1a30",
            }}
          >
            $ 35,981.00
          </div>
          <button
            type="button"
            style={{
              background: "transparent",
              border: "1px solid rgba(31,26,48,0.4)",
              borderRadius: 100,
              padding: "7px 18px",
              color: "#1f1a30",
              fontFamily: sans,
              fontSize: 13,
              fontWeight: 600,
              cursor: "pointer",
            }}
          >
            Edit
          </button>
        </div>

        {/* Income */}
        <div
          style={{
            background: T.card,
            color: T.text,
            borderRadius: 20,
            padding: "14px 16px 16px",
            border: `1px solid ${T.stroke}`,
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 4,
              fontSize: 13,
              fontWeight: 500,
              marginBottom: 14,
              color: T.mute,
            }}
          >
            Income {Icon.info()}
          </div>
          <div
            style={{
              fontFamily: serif,
              fontSize: 22,
              letterSpacing: -0.4,
              marginBottom: 14,
            }}
          >
            $ 21,231.00
          </div>
          <button
            type="button"
            style={{
              background: "transparent",
              border: `1px solid ${T.stroke}`,
              borderRadius: 100,
              padding: "7px 18px",
              color: T.text,
              fontFamily: sans,
              fontSize: 13,
              fontWeight: 500,
              cursor: "pointer",
            }}
          >
            Edit
          </button>
        </div>

        {/* Debt */}
        <div
          style={{
            background: T.card,
            color: T.text,
            borderRadius: 20,
            padding: "14px 16px 16px",
            border: `1px solid ${T.stroke}`,
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 4,
              fontSize: 13,
              fontWeight: 500,
              marginBottom: 14,
              color: T.mute,
            }}
          >
            Existing debt {Icon.info()}
          </div>
          <div
            style={{
              fontFamily: serif,
              fontSize: 22,
              letterSpacing: -0.4,
              marginBottom: 10,
            }}
          >
            $ 0
          </div>
          <div style={{ fontSize: 11.5, color: T.dim, lineHeight: 1.35 }}>
            You do not have any
            <br />
            existing debt.
          </div>
        </div>

        {/* Accounts */}
        <div
          style={{
            background: T.card,
            color: T.text,
            borderRadius: 20,
            padding: "14px 16px 16px",
            border: `1px solid ${T.stroke}`,
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 4,
              fontSize: 13,
              fontWeight: 500,
              marginBottom: 14,
              color: T.mute,
            }}
          >
            Financial accounts {Icon.info()}
          </div>
          <div style={{ marginBottom: 14 }}>
            <FinAccountIcons />
          </div>
          <button
            type="button"
            style={{
              background: "transparent",
              border: `1px solid ${T.stroke}`,
              borderRadius: 100,
              padding: "7px 12px",
              color: T.text,
              fontFamily: sans,
              fontSize: 12,
              fontWeight: 500,
              cursor: "pointer",
              display: "inline-flex",
              alignItems: "center",
              gap: 4,
              whiteSpace: "nowrap",
            }}
          >
            + Link accounts
          </button>
        </div>
      </div>

      {/* Section 2 */}
      <div
        style={{
          padding: "24px 20px 10px",
          display: "flex",
          alignItems: "center",
          gap: 10,
        }}
      >
        <SectionNumber n="2" />
        <h2
          style={{
            fontFamily: serif,
            fontSize: 20,
            fontWeight: 500,
            letterSpacing: -0.3,
            margin: 0,
            color: T.text,
          }}
        >
          Future Financial Goals
        </h2>
      </div>
      <div style={{ padding: "0 20px 16px" }}>
        <p style={{ fontSize: 14, color: T.mute, lineHeight: 1.45, margin: 0 }}>
          The tool evaluates trade-offs between
          <br />
          purchasing a house and other goals like
          <br />
          retirement, education, and travel.
        </p>
      </div>

      {/* Section 3 */}
      <div
        style={{
          padding: "8px 20px 10px",
          display: "flex",
          alignItems: "center",
          gap: 10,
        }}
      >
        <SectionNumber n="3" />
        <h2
          style={{
            fontFamily: serif,
            fontSize: 20,
            fontWeight: 500,
            letterSpacing: -0.3,
            margin: 0,
            color: T.text,
          }}
        >
          Affordability Projection
        </h2>
      </div>
      <div style={{ padding: "0 20px 28px" }}>
        <p style={{ fontSize: 14, color: T.mute, lineHeight: 1.45, margin: 0 }}>
          Based on your current standing, you&apos;re on
          <br />
          track to afford a $ 420,000 home by 2029.
        </p>
      </div>

      {/* CTA */}
      <div style={{ padding: "0 16px 24px" }}>
        <button
          type="button"
          onClick={() => go("dash")}
          style={{
            width: "100%",
            background: T.sage,
            color: "#1a2415",
            border: "none",
            borderRadius: 100,
            padding: "16px",
            fontFamily: sans,
            fontSize: 15,
            fontWeight: 600,
            cursor: "pointer",
          }}
        >
          Run affordability projection
        </button>
      </div>
    </div>
  );
}
