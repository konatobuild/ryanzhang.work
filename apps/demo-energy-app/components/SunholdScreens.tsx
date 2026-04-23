"use client";

import type { CSSProperties, ReactNode, MouseEvent } from "react";
import { Children, useMemo, useState } from "react";

// ──────────────────────────────────────────────────────────────
// Constants
// ──────────────────────────────────────────────────────────────

export const sans =
  '-apple-system, BlinkMacSystemFont, "SF Pro Text", "Helvetica Neue", system-ui, sans-serif';

export const COLORS = {
  bg: "#F5F2EC",
  surface: "#FFFFFF",
  ink: "#111111",
  inkSoft: "#3A3A3A",
  inkMuted: "#8A8A8A",
  yellow: "#F5CE3A",
  yellowDeep: "#E8B928",
  yellowSoft: "#FBE89A",
  yellowPale: "#FFF3BF",
  grid: "rgba(0,0,0,0.06)",
  stage: "#F1C632",
} as const;

export const PHONE_W = 390;
export const PHONE_H = 844;

export type ScreenId = "home" | "solar" | "reserve" | "grid" | "settings";

// ──────────────────────────────────────────────────────────────
// Icons
// ──────────────────────────────────────────────────────────────

type IconName =
  | "chevron-left"
  | "chevron-right"
  | "chevron-down"
  | "chevron-up"
  | "bell"
  | "eye"
  | "home"
  | "sun"
  | "battery"
  | "bolt"
  | "pie"
  | "grid"
  | "settings"
  | "plug"
  | "leaf"
  | "chart"
  | "user"
  | "car"
  | "wifi";

export function Icon({
  name,
  size = 18,
  color = "#111",
  strokeWidth = 2,
}: {
  name: IconName;
  size?: number;
  color?: string;
  strokeWidth?: number;
}) {
  const s = size;
  const stroke = {
    stroke: color,
    strokeWidth,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    fill: "none",
  };
  const fill = { fill: color };
  switch (name) {
    case "chevron-left":
      return (
        <svg width={s} height={s} viewBox="0 0 24 24">
          <path d="M15 6l-6 6 6 6" {...stroke} />
        </svg>
      );
    case "chevron-right":
      return (
        <svg width={s} height={s} viewBox="0 0 24 24">
          <path d="M9 6l6 6-6 6" {...stroke} />
        </svg>
      );
    case "chevron-down":
      return (
        <svg width={s} height={s} viewBox="0 0 24 24">
          <path d="M6 9l6 6 6-6" {...stroke} />
        </svg>
      );
    case "chevron-up":
      return (
        <svg width={s} height={s} viewBox="0 0 24 24">
          <path d="M18 15l-6-6-6 6" {...stroke} />
        </svg>
      );
    case "bell":
      return (
        <svg width={s} height={s} viewBox="0 0 24 24">
          <path d="M6 8a6 6 0 0112 0c0 7 3 7 3 9H3c0-2 3-2 3-9z" {...stroke} />
          <path d="M10 21a2 2 0 004 0" {...stroke} />
        </svg>
      );
    case "eye":
      return (
        <svg width={s} height={s} viewBox="0 0 24 24">
          <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12z" {...stroke} />
          <circle cx="12" cy="12" r="3" {...stroke} />
        </svg>
      );
    case "home":
      return (
        <svg width={s} height={s} viewBox="0 0 24 24">
          <path
            d="M3 11l9-8 9 8v10a1 1 0 01-1 1h-5v-7h-6v7H4a1 1 0 01-1-1V11z"
            {...stroke}
          />
        </svg>
      );
    case "sun":
      return (
        <svg width={s} height={s} viewBox="0 0 24 24">
          <circle cx="12" cy="12" r="4" {...stroke} />
          <path
            d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"
            {...stroke}
          />
        </svg>
      );
    case "battery":
      return (
        <svg width={s} height={s} viewBox="0 0 24 24">
          <rect x="2" y="8" width="17" height="10" rx="2.5" {...stroke} />
          <rect x="20" y="11" width="2" height="4" rx="0.5" {...fill} />
          <rect x="4.5" y="10.5" width="8" height="5" rx="1" {...fill} />
        </svg>
      );
    case "bolt":
      return (
        <svg width={s} height={s} viewBox="0 0 24 24">
          <path d="M13 2L4 14h7l-1 8 9-12h-7l1-8z" {...stroke} />
        </svg>
      );
    case "pie":
      return (
        <svg width={s} height={s} viewBox="0 0 24 24">
          <path d="M12 3v9l8 4a9 9 0 11-8-13z" {...stroke} />
        </svg>
      );
    case "grid":
      return (
        <svg width={s} height={s} viewBox="0 0 24 24">
          <path
            d="M3 12h18M12 3v18M5 3l2 18M19 3l-2 18M3 5l18 2M3 19l18-2"
            {...stroke}
            strokeWidth={1.5}
          />
        </svg>
      );
    case "settings":
      return (
        <svg width={s} height={s} viewBox="0 0 24 24">
          <circle cx="12" cy="12" r="3" {...stroke} />
          <path
            d="M19.4 15a1.7 1.7 0 00.3 1.8l.1.1a2 2 0 11-2.8 2.8l-.1-.1a1.7 1.7 0 00-1.8-.3 1.7 1.7 0 00-1 1.5V21a2 2 0 01-4 0v-.1a1.7 1.7 0 00-1.1-1.5 1.7 1.7 0 00-1.8.3l-.1.1a2 2 0 11-2.8-2.8l.1-.1a1.7 1.7 0 00.3-1.8 1.7 1.7 0 00-1.5-1H3a2 2 0 010-4h.1a1.7 1.7 0 001.5-1.1 1.7 1.7 0 00-.3-1.8l-.1-.1a2 2 0 112.8-2.8l.1.1a1.7 1.7 0 001.8.3H9a1.7 1.7 0 001-1.5V3a2 2 0 014 0v.1a1.7 1.7 0 001 1.5 1.7 1.7 0 001.8-.3l.1-.1a2 2 0 112.8 2.8l-.1.1a1.7 1.7 0 00-.3 1.8V9a1.7 1.7 0 001.5 1H21a2 2 0 010 4h-.1a1.7 1.7 0 00-1.5 1z"
            {...stroke}
            strokeWidth={1.5}
          />
        </svg>
      );
    case "plug":
      return (
        <svg width={s} height={s} viewBox="0 0 24 24">
          <path
            d="M9 2v6M15 2v6M6 10h12v4a6 6 0 01-6 6 6 6 0 01-6-6v-4zM12 20v2"
            {...stroke}
          />
        </svg>
      );
    case "leaf":
      return (
        <svg width={s} height={s} viewBox="0 0 24 24">
          <path
            d="M6 21c-2-6 0-12 8-15 5-2 8 0 8 0s-1 12-9 15c-4 1.5-7-1-7-1z"
            {...stroke}
          />
          <path d="M6 21c3-6 7-9 13-12" {...stroke} />
        </svg>
      );
    case "chart":
      return (
        <svg width={s} height={s} viewBox="0 0 24 24">
          <path d="M3 3v18h18" {...stroke} />
          <path d="M7 14l4-4 3 3 6-8" {...stroke} />
        </svg>
      );
    case "user":
      return (
        <svg width={s} height={s} viewBox="0 0 24 24">
          <circle cx="12" cy="8" r="4" {...stroke} />
          <path d="M4 21a8 8 0 0116 0" {...stroke} />
        </svg>
      );
    case "car":
      return (
        <svg width={s} height={s} viewBox="0 0 24 24">
          <path d="M3 14l2-6h14l2 6M3 14v4h2v-2h14v2h2v-4M3 14h18" {...stroke} />
          <circle cx="7" cy="17" r="1.5" {...fill} />
          <circle cx="17" cy="17" r="1.5" {...fill} />
        </svg>
      );
    case "wifi":
      return (
        <svg width={s} height={s} viewBox="0 0 24 24">
          <path
            d="M2 8a15 15 0 0120 0M5 12a10 10 0 0114 0M8.5 15.5a5 5 0 017 0"
            {...stroke}
          />
          <circle cx="12" cy="19" r="1" {...fill} />
        </svg>
      );
    default:
      return null;
  }
}

// ──────────────────────────────────────────────────────────────
// UI primitives
// ──────────────────────────────────────────────────────────────

function PillButton({
  children,
  size = 44,
  onClick,
  style = {},
  bg = "#EDEAE3",
  ring = true,
}: {
  children: ReactNode;
  size?: number;
  onClick?: () => void;
  style?: CSSProperties;
  bg?: string;
  ring?: boolean;
}) {
  const down = (e: MouseEvent<HTMLButtonElement>) => {
    e.currentTarget.style.transform = "scale(0.94)";
  };
  const up = (e: MouseEvent<HTMLButtonElement>) => {
    e.currentTarget.style.transform = "scale(1)";
  };
  return (
    <button
      type="button"
      onClick={onClick}
      onMouseDown={down}
      onMouseUp={up}
      onMouseLeave={up}
      style={{
        width: size,
        height: size,
        borderRadius: size / 2,
        background: bg,
        border: "none",
        cursor: "pointer",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        boxShadow: ring
          ? "inset 0 1px 0 rgba(255,255,255,0.9), inset 0 -1px 0 rgba(0,0,0,0.04), 0 1px 2px rgba(0,0,0,0.03)"
          : "none",
        padding: 0,
        transition: "transform 0.15s ease, background 0.15s ease",
        ...style,
      }}
    >
      {children}
    </button>
  );
}

function Chip({
  children,
  onClick,
  active = false,
  style = {},
}: {
  children: ReactNode;
  onClick?: () => void;
  active?: boolean;
  style?: CSSProperties;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      style={{
        height: 40,
        padding: "0 18px",
        borderRadius: 999,
        background: active ? COLORS.ink : "#EDEAE3",
        color: active ? "#fff" : COLORS.ink,
        border: "none",
        cursor: "pointer",
        display: "inline-flex",
        alignItems: "center",
        gap: 8,
        fontFamily: "inherit",
        fontSize: 15,
        fontWeight: 500,
        boxShadow:
          "inset 0 1px 0 rgba(255,255,255,0.9), 0 1px 2px rgba(0,0,0,0.03)",
        ...style,
      }}
    >
      {children}
    </button>
  );
}

function Header({
  title,
  onBack,
  trailing,
  dark = false,
}: {
  title: string;
  onBack?: () => void;
  trailing?: ReactNode;
  dark?: boolean;
}) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "12px 18px 16px",
      }}
    >
      <PillButton
        onClick={onBack}
        bg={dark ? "rgba(255,255,255,0.15)" : "#EDEAE3"}
      >
        <Icon name="chevron-left" color={dark ? "#fff" : COLORS.ink} />
      </PillButton>
      <div
        style={{
          fontSize: 17,
          fontWeight: 600,
          color: dark ? "#fff" : COLORS.ink,
          letterSpacing: -0.3,
        }}
      >
        {title}
      </div>
      <div>
        {trailing ?? (
          <PillButton bg={dark ? "rgba(255,255,255,0.15)" : "#EDEAE3"}>
            <Icon name="bell" color={dark ? "#fff" : COLORS.ink} />
          </PillButton>
        )}
      </div>
    </div>
  );
}

// ──────────────────────────────────────────────────────────────
// Charts
// ──────────────────────────────────────────────────────────────

type Point = [number, number];

function smoothPath(points: Point[]): string {
  if (points.length < 2) return "";
  let d = `M ${points[0][0]} ${points[0][1]}`;
  for (let i = 0; i < points.length - 1; i++) {
    const p0 = points[i - 1] ?? points[i];
    const p1 = points[i];
    const p2 = points[i + 1];
    const p3 = points[i + 2] ?? p2;
    const c1x = p1[0] + (p2[0] - p0[0]) / 6;
    const c1y = p1[1] + (p2[1] - p0[1]) / 6;
    const c2x = p2[0] - (p3[0] - p1[0]) / 6;
    const c2y = p2[1] - (p3[1] - p1[1]) / 6;
    d += ` C ${c1x} ${c1y}, ${c2x} ${c2y}, ${p2[0]} ${p2[1]}`;
  }
  return d;
}

function seedSeries(
  seed: number,
  count: number,
  min: number,
  max: number
): number[] {
  let s = seed;
  const rand = () => {
    s = (s * 9301 + 49297) % 233280;
    return s / 233280;
  };
  const arr: number[] = [];
  let v = min + (max - min) * 0.3;
  for (let i = 0; i < count; i++) {
    v += (rand() - 0.5) * (max - min) * 0.18;
    v = Math.max(min, Math.min(max, v));
    arr.push(v);
  }
  return arr;
}

function LineChart({
  data,
  width = 360,
  height = 240,
  yMin = 0,
  yMax = 4,
  yTicks = [0, 2, 4],
  xLabels = ["6 AM", "12 PM", "6 PM"],
  yUnit = "kW",
  color = COLORS.yellow,
  peakIndex = null,
  peakLabel = "Peak Load",
  showBeam = true,
  gradientId,
}: {
  data: number[];
  width?: number;
  height?: number;
  yMin?: number;
  yMax?: number;
  yTicks?: number[];
  xLabels?: string[];
  yUnit?: string;
  color?: string;
  peakIndex?: number | null;
  peakLabel?: string;
  showBeam?: boolean;
  gradientId: string;
}) {
  const padL = 18;
  const padR = 18;
  const padT = 30;
  const padB = 32;
  const W = width - padL - padR;
  const H = height - padT - padB;
  const n = data.length;
  const xAt = (i: number) => padL + (i / (n - 1)) * W;
  const yAt = (v: number) => padT + H - ((v - yMin) / (yMax - yMin)) * H;
  const pts: Point[] = data.map((v, i) => [xAt(i), yAt(v)]);
  const path = smoothPath(pts);

  const beamStart = pts[pts.length - 1];
  const beamEndX = padL + W + 6;
  const beamSpread = 38;

  const peakPt = peakIndex !== null ? pts[peakIndex] : null;

  const beamId = `${gradientId}-beam`;
  const shadowId = `${gradientId}-shadow`;

  return (
    <svg width={width} height={height} style={{ display: "block" }}>
      <defs>
        <linearGradient id={beamId} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor={color} stopOpacity="0.85" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
        <linearGradient id={shadowId} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.2" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>

      <text
        x={padL}
        y={padT - 10}
        fontSize="11"
        fill="#9A9A9A"
        fontFamily="inherit"
      >
        {yUnit}
      </text>

      {yTicks.map((t, i) => {
        const y = yAt(t);
        return (
          <g key={i}>
            <line
              x1={padL}
              y1={y}
              x2={padL + W}
              y2={y}
              stroke="#000"
              strokeOpacity="0.07"
              strokeDasharray={i === 0 || i === yTicks.length - 1 ? "" : "2 4"}
              strokeWidth="1"
            />
            <text
              x={padL + W + 2}
              y={y + 4}
              fontSize="11"
              fill="#9A9A9A"
              fontFamily="inherit"
              textAnchor="end"
            >
              {t}
            </text>
          </g>
        );
      })}

      {xLabels.map((lab, i) => {
        const x = padL + (i / (xLabels.length - 1)) * W;
        return (
          <text
            key={i}
            x={x}
            y={padT + H + 22}
            fontSize="12"
            fill="#9A9A9A"
            fontFamily="inherit"
            textAnchor="middle"
          >
            {lab}
          </text>
        );
      })}

      {showBeam && (
        <polygon
          points={`${beamStart[0]},${beamStart[1]} ${beamEndX},${beamStart[1] - beamSpread} ${beamEndX},${beamStart[1] + beamSpread}`}
          fill={`url(#${beamId})`}
        />
      )}

      <path
        d={`${path} L ${pts[n - 1][0]} ${padT + H} L ${pts[0][0]} ${padT + H} Z`}
        fill={`url(#${shadowId})`}
      />

      <path
        d={path}
        fill="none"
        stroke={color}
        strokeWidth="2.5"
        strokeLinejoin="round"
        strokeLinecap="round"
      />

      <circle cx={beamStart[0]} cy={beamStart[1]} r="4" fill={color} />
      <circle cx={beamStart[0]} cy={beamStart[1]} r="2" fill="#fff" />

      {peakPt && (
        <g>
          <rect
            x={peakPt[0] - 42}
            y={peakPt[1] - 38}
            width="84"
            height="26"
            rx="13"
            fill={color}
          />
          <text
            x={peakPt[0]}
            y={peakPt[1] - 20}
            fontSize="12"
            fill="#111"
            fontWeight="600"
            fontFamily="inherit"
            textAnchor="middle"
          >
            {peakLabel}
          </text>
          <path
            d={`M ${peakPt[0] - 4} ${peakPt[1] - 12} L ${peakPt[0]} ${peakPt[1] - 6} L ${peakPt[0] + 4} ${peakPt[1] - 12} Z`}
            fill={color}
          />
        </g>
      )}
    </svg>
  );
}

function BarChart({
  data,
  width = 360,
  height = 200,
  labels,
  max,
  color = COLORS.yellow,
  highlight = null,
}: {
  data: number[];
  width?: number;
  height?: number;
  labels: string[];
  max?: number;
  color?: string;
  highlight?: number | null;
}) {
  const padL = 18;
  const padR = 18;
  const padT = 10;
  const padB = 28;
  const W = width - padL - padR;
  const H = height - padT - padB;
  const n = data.length;
  const barW = (W / n) * 0.55;
  const gap = (W / n) * 0.45;
  const maxV = max ?? Math.max(...data);

  return (
    <svg width={width} height={height} style={{ display: "block" }}>
      <line
        x1={padL}
        y1={padT + H}
        x2={padL + W}
        y2={padT + H}
        stroke="#000"
        strokeOpacity="0.07"
      />
      {data.map((v, i) => {
        const x = padL + (i / n) * W + gap / 2;
        const h = (v / maxV) * H;
        const y = padT + H - h;
        const isHi = highlight === i;
        return (
          <g key={i}>
            <rect
              x={x}
              y={y}
              width={barW}
              height={h}
              rx="6"
              fill={isHi ? "#111" : color}
              opacity={isHi ? 1 : 0.9}
            />
            <text
              x={x + barW / 2}
              y={padT + H + 18}
              fontSize="11"
              fill={isHi ? "#111" : "#9A9A9A"}
              fontWeight={isHi ? 600 : 400}
              fontFamily="inherit"
              textAnchor="middle"
            >
              {labels[i]}
            </text>
          </g>
        );
      })}
    </svg>
  );
}

// ──────────────────────────────────────────────────────────────
// iOS device frame
// ──────────────────────────────────────────────────────────────

function IOSStatusBar({ time = "9:41" }: { time?: string }) {
  const c = "#000";
  return (
    <div
      style={{
        display: "flex",
        gap: 154,
        alignItems: "center",
        justifyContent: "center",
        padding: "21px 24px 19px",
        boxSizing: "border-box",
        position: "relative",
        zIndex: 20,
        width: "100%",
      }}
    >
      <div
        style={{
          flex: 1,
          height: 22,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          paddingTop: 1.5,
        }}
      >
        <span
          style={{
            fontFamily: sans,
            fontWeight: 590,
            fontSize: 17,
            lineHeight: "22px",
            color: c,
          }}
        >
          {time}
        </span>
      </div>
      <div
        style={{
          flex: 1,
          height: 22,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: 7,
          paddingTop: 1,
          paddingRight: 1,
        }}
      >
        <svg width="19" height="12" viewBox="0 0 19 12">
          <rect x="0" y="7.5" width="3.2" height="4.5" rx="0.7" fill={c} />
          <rect x="4.8" y="5" width="3.2" height="7" rx="0.7" fill={c} />
          <rect x="9.6" y="2.5" width="3.2" height="9.5" rx="0.7" fill={c} />
          <rect x="14.4" y="0" width="3.2" height="12" rx="0.7" fill={c} />
        </svg>
        <svg width="17" height="12" viewBox="0 0 17 12">
          <path
            d="M8.5 3.2C10.8 3.2 12.9 4.1 14.4 5.6L15.5 4.5C13.7 2.7 11.2 1.5 8.5 1.5C5.8 1.5 3.3 2.7 1.5 4.5L2.6 5.6C4.1 4.1 6.2 3.2 8.5 3.2Z"
            fill={c}
          />
          <path
            d="M8.5 6.8C9.9 6.8 11.1 7.3 12 8.2L13.1 7.1C11.8 5.9 10.2 5.1 8.5 5.1C6.8 5.1 5.2 5.9 3.9 7.1L5 8.2C5.9 7.3 7.1 6.8 8.5 6.8Z"
            fill={c}
          />
          <circle cx="8.5" cy="10.5" r="1.5" fill={c} />
        </svg>
        <svg width="27" height="13" viewBox="0 0 27 13">
          <rect
            x="0.5"
            y="0.5"
            width="23"
            height="12"
            rx="3.5"
            stroke={c}
            strokeOpacity="0.35"
            fill="none"
          />
          <rect x="2" y="2" width="20" height="9" rx="2" fill={c} />
          <path
            d="M25 4.5V8.5C25.8 8.2 26.5 7.2 26.5 6.5C26.5 5.8 25.8 4.8 25 4.5Z"
            fill={c}
            fillOpacity="0.4"
          />
        </svg>
      </div>
    </div>
  );
}

export function IOSDevice({
  children,
  width = PHONE_W,
  height = PHONE_H,
}: {
  children: ReactNode;
  width?: number;
  height?: number;
}) {
  return (
    <div
      style={{
        width,
        height,
        borderRadius: 48,
        overflow: "hidden",
        position: "relative",
        background: COLORS.bg,
        boxShadow:
          "0 40px 80px rgba(0,0,0,0.18), 0 0 0 1px rgba(0,0,0,0.12)",
        fontFamily: sans,
        WebkitFontSmoothing: "antialiased",
      }}
    >
      <div
        style={{
          position: "absolute",
          top: 11,
          left: "50%",
          transform: "translateX(-50%)",
          width: 126,
          height: 37,
          borderRadius: 24,
          background: "#000",
          zIndex: 50,
        }}
      />
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          zIndex: 10,
        }}
      >
        <IOSStatusBar />
      </div>
      <div style={{ height: "100%", display: "flex", flexDirection: "column" }}>
        <div style={{ flex: 1, overflow: "auto" }}>{children}</div>
      </div>
      <div
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          zIndex: 60,
          height: 34,
          display: "flex",
          justifyContent: "center",
          alignItems: "flex-end",
          paddingBottom: 8,
          pointerEvents: "none",
        }}
      >
        <div
          style={{
            width: 139,
            height: 5,
            borderRadius: 100,
            background: "rgba(0,0,0,0.25)",
          }}
        />
      </div>
    </div>
  );
}

// ──────────────────────────────────────────────────────────────
// Tab bar
// ──────────────────────────────────────────────────────────────

export function TabBar({
  active,
  onChange,
}: {
  active: ScreenId;
  onChange: (id: ScreenId) => void;
}) {
  const tabs: { id: ScreenId; icon: IconName }[] = [
    { id: "home", icon: "home" },
    { id: "solar", icon: "sun" },
    { id: "reserve", icon: "battery" },
    { id: "grid", icon: "bolt" },
    { id: "settings", icon: "pie" },
  ];
  return (
    <div
      style={{
        position: "absolute",
        left: 0,
        right: 0,
        bottom: 24,
        display: "flex",
        justifyContent: "center",
        zIndex: 40,
        pointerEvents: "none",
      }}
    >
      <div
        style={{
          pointerEvents: "auto",
          display: "flex",
          alignItems: "center",
          gap: 4,
          padding: 6,
          background: "rgba(245, 206, 58, 0.92)",
          backdropFilter: "blur(16px) saturate(160%)",
          WebkitBackdropFilter: "blur(16px) saturate(160%)",
          borderRadius: 999,
          boxShadow:
            "0 8px 24px rgba(180,130,0,0.25), inset 0 1px 0 rgba(255,255,255,0.5), inset 0 -1px 0 rgba(0,0,0,0.08)",
        }}
      >
        {tabs.map((t) => {
          const isActive = active === t.id;
          return (
            <button
              type="button"
              key={t.id}
              onClick={() => onChange(t.id)}
              style={{
                width: 44,
                height: 44,
                borderRadius: 999,
                border: "none",
                background: isActive ? "#FFFFFF" : "transparent",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer",
                boxShadow: isActive
                  ? "0 2px 6px rgba(0,0,0,0.12)"
                  : "none",
                transition: "background 0.2s",
                padding: 0,
              }}
            >
              <Icon
                name={t.icon}
                size={18}
                color={COLORS.ink}
                strokeWidth={isActive ? 2.2 : 1.8}
              />
            </button>
          );
        })}
      </div>
    </div>
  );
}

// ──────────────────────────────────────────────────────────────
// Shared Energy Flow rail
// ──────────────────────────────────────────────────────────────

type Flow = { pct: number; label: string; kwh: number };

function EnergyFlowSection({
  flows,
  title = "Energy Flow",
  subtitle = "Used From",
}: {
  flows: Flow[];
  title?: string;
  subtitle?: string;
}) {
  const [open, setOpen] = useState(true);
  return (
    <div
      style={{
        marginTop: "auto",
        background: COLORS.yellow,
        padding: "22px 22px 110px",
        flex: 1,
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "flex-start",
          justifyContent: "space-between",
          marginBottom: 18,
        }}
      >
        <div>
          <div
            style={{
              fontSize: 22,
              fontWeight: 700,
              color: COLORS.ink,
              letterSpacing: -0.4,
            }}
          >
            {title}
          </div>
          <div
            style={{
              fontSize: 13,
              color: "rgba(0,0,0,0.55)",
              marginTop: 2,
            }}
          >
            {subtitle}
          </div>
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          <PillButton size={40} bg="rgba(0,0,0,0.08)" ring={false}>
            <Icon name="eye" size={16} color={COLORS.ink} />
          </PillButton>
          <PillButton
            size={40}
            bg="rgba(0,0,0,0.08)"
            ring={false}
            onClick={() => setOpen(!open)}
          >
            <Icon
              name={open ? "chevron-up" : "chevron-down"}
              size={16}
              color={COLORS.ink}
            />
          </PillButton>
        </div>
      </div>
      {open && (
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          {flows.map((f, i) => (
            <div
              key={i}
              style={{
                display: "flex",
                justifyContent: "space-between",
                fontSize: 15,
                color: COLORS.ink,
                fontWeight: 500,
              }}
            >
              <div>
                {f.pct}% {f.label}
              </div>
              <div style={{ fontVariantNumeric: "tabular-nums" }}>
                {f.kwh.toFixed(1)} kWh
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ──────────────────────────────────────────────────────────────
// Screens
// ──────────────────────────────────────────────────────────────

type ScreenProps = { onNavigate: (id: ScreenId) => void };

export function ReserveScreen(_: ScreenProps) {
  void _;
  const [range] = useState<"Day" | "Week" | "Month">("Day");
  const data = useMemo(() => {
    const base = seedSeries(7, 48, 0.2, 2.5);
    base[28] = 3.4;
    base[27] = 2.7;
    base[29] = 3.0;
    base[26] = 2.0;
    base[30] = 2.2;
    for (let i = 0; i < 10; i++) base[i] = 0.4 + i * 0.02;
    for (let i = 40; i < 48; i++) base[i] = 1.1 - (i - 40) * 0.05;
    return base;
  }, []);

  const flows: Flow[] = [
    { pct: 47, label: "Powerwall", kwh: 9.9 },
    { pct: 50, label: "Solar", kwh: 10.2 },
    { pct: 3, label: "Grid", kwh: 0.5 },
  ];

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        height: "100%",
        background: COLORS.bg,
      }}
    >
      <div style={{ height: 64, flexShrink: 0 }} />
      <Header title="Reserve Stock" />

      <div
        style={{
          display: "flex",
          alignItems: "flex-end",
          justifyContent: "space-between",
          padding: "8px 22px 18px",
        }}
      >
        <div style={{ display: "flex", alignItems: "baseline", gap: 6 }}>
          <div
            style={{
              fontSize: 68,
              fontWeight: 700,
              color: COLORS.ink,
              letterSpacing: -2.5,
              lineHeight: 1,
              fontVariantNumeric: "tabular-nums",
            }}
          >
            20.1
          </div>
          <div
            style={{
              fontSize: 17,
              color: COLORS.inkSoft,
              fontWeight: 500,
              marginLeft: 4,
            }}
          >
            kWh
          </div>
        </div>
        <Chip>
          {range}
          <Icon name="chevron-down" size={14} />
        </Chip>
      </div>

      <div style={{ padding: "0 14px" }}>
        <LineChart
          data={data}
          width={360}
          height={250}
          yMin={0}
          yMax={4}
          yTicks={[0, 2, 4]}
          xLabels={["6 AM", "12 PM", "6 PM"]}
          peakIndex={28}
          peakLabel="Peak Load"
          gradientId="reserve"
        />
      </div>

      <EnergyFlowSection flows={flows} />
    </div>
  );
}

export function HomeScreen({ onNavigate }: ScreenProps) {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        height: "100%",
        background: COLORS.bg,
      }}
    >
      <div style={{ height: 64, flexShrink: 0 }} />
      <Header title="My Home" onBack={() => onNavigate("reserve")} />

      <div style={{ padding: "4px 22px 10px" }}>
        <div style={{ fontSize: 13, color: COLORS.inkMuted, marginBottom: 4 }}>
          Good afternoon
        </div>
        <div
          style={{
            fontSize: 28,
            fontWeight: 700,
            color: COLORS.ink,
            letterSpacing: -0.8,
            lineHeight: 1.1,
          }}
        >
          Self-powered
          <br />
          since sunrise.
        </div>
      </div>

      <div
        style={{
          display: "flex",
          justifyContent: "center",
          padding: "18px 0 6px",
        }}
      >
        <Gauge value={74} />
      </div>

      <div
        style={{
          padding: "16px 18px 0",
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: 10,
        }}
      >
        <Tile
          onClick={() => onNavigate("solar")}
          icon="sun"
          label="Solar"
          value="3.2"
          unit="kW"
          trend="+12%"
        />
        <Tile
          onClick={() => onNavigate("reserve")}
          icon="battery"
          label="Reserve"
          value="20.1"
          unit="kWh"
          trend="74%"
        />
        <Tile
          onClick={() => onNavigate("grid")}
          icon="bolt"
          label="Grid"
          value="0.1"
          unit="kW"
          trend="importing"
          muted
        />
        <Tile
          icon="plug"
          label="Home load"
          value="1.4"
          unit="kW"
          trend="normal"
        />
      </div>

      <EnergyFlowSection
        flows={[
          { pct: 62, label: "Solar direct", kwh: 8.1 },
          { pct: 31, label: "Reserve", kwh: 4.0 },
          { pct: 7, label: "Grid", kwh: 0.9 },
        ]}
        title="Today so far"
        subtitle="Powered by"
      />
    </div>
  );
}

function Gauge({ value = 74 }: { value?: number }) {
  const size = 210;
  const stroke = 14;
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  const ARC = 0.75;
  const len = c * ARC;
  const filled = len * (value / 100);
  return (
    <div style={{ position: "relative", width: size, height: size }}>
      <svg width={size} height={size} style={{ transform: "rotate(135deg)" }}>
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke="rgba(0,0,0,0.06)"
          strokeWidth={stroke}
          strokeDasharray={`${len} ${c}`}
          strokeLinecap="round"
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke={COLORS.yellow}
          strokeWidth={stroke}
          strokeDasharray={`${filled} ${c}`}
          strokeLinecap="round"
        />
      </svg>
      <div
        style={{
          position: "absolute",
          inset: 0,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <div
          style={{
            fontSize: 12,
            color: COLORS.inkMuted,
            letterSpacing: 0.4,
            textTransform: "uppercase",
          }}
        >
          Self-supplied
        </div>
        <div
          style={{
            fontSize: 54,
            fontWeight: 700,
            color: COLORS.ink,
            letterSpacing: -2,
            lineHeight: 1,
          }}
        >
          {value}
          <span style={{ fontSize: 22, fontWeight: 500 }}>%</span>
        </div>
        <div style={{ fontSize: 12, color: COLORS.inkMuted, marginTop: 4 }}>
          of today&apos;s demand
        </div>
      </div>
    </div>
  );
}

function Tile({
  icon,
  label,
  value,
  unit,
  trend,
  onClick,
  muted = false,
}: {
  icon: IconName;
  label: string;
  value: string;
  unit: string;
  trend: string;
  onClick?: () => void;
  muted?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      style={{
        background: COLORS.surface,
        border: "none",
        borderRadius: 22,
        padding: "14px 14px 16px",
        textAlign: "left",
        cursor: onClick ? "pointer" : "default",
        fontFamily: "inherit",
        boxShadow:
          "inset 0 1px 0 rgba(255,255,255,0.9), 0 1px 2px rgba(0,0,0,0.04)",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: 14,
        }}
      >
        <div
          style={{
            width: 32,
            height: 32,
            borderRadius: 10,
            background: muted ? "#EDEAE3" : COLORS.yellowPale,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Icon name={icon} size={16} color={COLORS.ink} />
        </div>
        <div style={{ fontSize: 11, color: COLORS.inkMuted }}>{trend}</div>
      </div>
      <div style={{ fontSize: 12, color: COLORS.inkMuted, marginBottom: 2 }}>
        {label}
      </div>
      <div style={{ display: "flex", alignItems: "baseline", gap: 4 }}>
        <div
          style={{
            fontSize: 24,
            fontWeight: 700,
            color: COLORS.ink,
            letterSpacing: -0.8,
          }}
        >
          {value}
        </div>
        <div style={{ fontSize: 12, color: COLORS.inkSoft }}>{unit}</div>
      </div>
    </button>
  );
}

export function SolarScreen({ onNavigate }: ScreenProps) {
  const [range] = useState<"Week" | "Day" | "Month">("Week");
  const weekData = [18.2, 22.4, 14.0, 25.1, 29.8, 26.5, 19.7];
  const labels = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        height: "100%",
        background: COLORS.bg,
      }}
    >
      <div style={{ height: 64, flexShrink: 0 }} />
      <Header title="Solar" onBack={() => onNavigate("home")} />

      <div
        style={{
          display: "flex",
          alignItems: "flex-end",
          justifyContent: "space-between",
          padding: "8px 22px 14px",
        }}
      >
        <div style={{ display: "flex", alignItems: "baseline", gap: 6 }}>
          <div
            style={{
              fontSize: 68,
              fontWeight: 700,
              color: COLORS.ink,
              letterSpacing: -2.5,
              lineHeight: 1,
            }}
          >
            155.7
          </div>
          <div
            style={{
              fontSize: 17,
              color: COLORS.inkSoft,
              fontWeight: 500,
              marginLeft: 4,
            }}
          >
            kWh
          </div>
        </div>
        <Chip>
          {range}
          <Icon name="chevron-down" size={14} />
        </Chip>
      </div>

      <div style={{ padding: "0 22px 6px", color: COLORS.inkMuted, fontSize: 13 }}>
        Produced this week · 18% above last week
      </div>

      <div style={{ padding: "14px 14px" }}>
        <BarChart data={weekData} width={360} height={200} labels={labels} highlight={4} />
      </div>

      <div
        style={{
          padding: "0 22px 10px",
          display: "grid",
          gridTemplateColumns: "1fr 1fr 1fr",
          gap: 10,
        }}
      >
        <Stat label="Best day" value="Fri" sub="29.8 kWh" />
        <Stat label="Peak rate" value="4.1" sub="kW at 1 PM" />
        <Stat label="Avg /day" value="22.2" sub="kWh" />
      </div>

      <EnergyFlowSection
        flows={[
          { pct: 54, label: "To home", kwh: 84.1 },
          { pct: 28, label: "To reserve", kwh: 43.6 },
          { pct: 18, label: "To grid", kwh: 28.0 },
        ]}
        title="Where it went"
        subtitle="This week"
      />
    </div>
  );
}

function Stat({
  label,
  value,
  sub,
}: {
  label: string;
  value: string;
  sub: string;
}) {
  return (
    <div
      style={{
        background: COLORS.surface,
        borderRadius: 16,
        padding: "12px 12px",
        boxShadow:
          "inset 0 1px 0 rgba(255,255,255,0.9), 0 1px 2px rgba(0,0,0,0.04)",
      }}
    >
      <div
        style={{
          fontSize: 10,
          color: COLORS.inkMuted,
          letterSpacing: 0.3,
          textTransform: "uppercase",
        }}
      >
        {label}
      </div>
      <div
        style={{
          fontSize: 20,
          fontWeight: 700,
          color: COLORS.ink,
          marginTop: 4,
          letterSpacing: -0.5,
        }}
      >
        {value}
      </div>
      <div style={{ fontSize: 11, color: COLORS.inkMuted, marginTop: 1 }}>
        {sub}
      </div>
    </div>
  );
}

export function GridScreen({ onNavigate }: ScreenProps) {
  const [range] = useState<"Day" | "Week" | "Month">("Day");
  const data = useMemo(() => {
    let s = 11;
    const rand = () => {
      s = (s * 9301 + 49297) % 233280;
      return s / 233280;
    };
    const arr: number[] = [];
    for (let i = 0; i < 48; i++) {
      const hr = i / 2;
      if (hr < 6) arr.push(0.3);
      else if (hr < 10) arr.push(-0.2 - rand() * 0.4);
      else if (hr < 15) arr.push(-1.2 - rand() * 0.8);
      else if (hr < 18) arr.push(-0.6 - rand() * 0.3);
      else arr.push(0.4 + rand() * 0.3);
    }
    return arr.map((v) => v + 2);
  }, []);

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        height: "100%",
        background: COLORS.bg,
      }}
    >
      <div style={{ height: 64, flexShrink: 0 }} />
      <Header title="Grid Activity" onBack={() => onNavigate("home")} />

      <div
        style={{
          display: "flex",
          alignItems: "flex-end",
          justifyContent: "space-between",
          padding: "8px 22px 14px",
        }}
      >
        <div>
          <div style={{ display: "flex", alignItems: "baseline", gap: 6 }}>
            <div
              style={{
                fontSize: 60,
                fontWeight: 700,
                color: COLORS.ink,
                letterSpacing: -2.2,
                lineHeight: 1,
              }}
            >
              −4.8
            </div>
            <div
              style={{
                fontSize: 17,
                color: COLORS.inkSoft,
                fontWeight: 500,
                marginLeft: 4,
              }}
            >
              kWh
            </div>
          </div>
          <div style={{ fontSize: 12, color: COLORS.inkMuted, marginTop: 4 }}>
            Net export today
          </div>
        </div>
        <Chip>
          {range}
          <Icon name="chevron-down" size={14} />
        </Chip>
      </div>

      <div style={{ padding: "0 14px" }}>
        <LineChart
          data={data}
          width={360}
          height={230}
          yMin={0}
          yMax={3}
          yTicks={[0, 2, 3]}
          xLabels={["6 AM", "12 PM", "6 PM"]}
          peakIndex={22}
          peakLabel="Best export"
          showBeam={false}
          gradientId="grid"
        />
      </div>

      <EnergyFlowSection
        flows={[
          { pct: 78, label: "Exported to grid", kwh: 6.1 },
          { pct: 18, label: "Imported at night", kwh: 1.3 },
          { pct: 4, label: "Standby draw", kwh: 0.3 },
        ]}
        title="Grid balance"
        subtitle="Credits earned · $1.42"
      />
    </div>
  );
}

export function SettingsScreen({ onNavigate }: ScreenProps) {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        height: "100%",
        background: COLORS.bg,
      }}
    >
      <div style={{ height: 64, flexShrink: 0 }} />
      <Header title="Settings" onBack={() => onNavigate("home")} />

      <div
        style={{
          padding: "8px 22px 18px",
          display: "flex",
          alignItems: "center",
          gap: 14,
        }}
      >
        <div
          style={{
            width: 54,
            height: 54,
            borderRadius: 27,
            background: COLORS.yellow,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 20,
            fontWeight: 700,
            color: COLORS.ink,
          }}
        >
          AM
        </div>
        <div>
          <div style={{ fontSize: 18, fontWeight: 600, color: COLORS.ink }}>
            Alex Mercer
          </div>
          <div style={{ fontSize: 13, color: COLORS.inkMuted }}>
            12 Linden Way · Plan: Sunhold+
          </div>
        </div>
      </div>

      <div
        style={{
          padding: "0 18px",
          display: "flex",
          flexDirection: "column",
          gap: 10,
        }}
      >
        <SettingsGroup>
          <SettingsRow icon="battery" label="Reserve threshold" detail="20%" />
          <SettingsRow icon="bolt" label="Peak hours" detail="4–9 PM" />
          <SettingsRow icon="sun" label="Solar array" detail="12 panels" />
        </SettingsGroup>
        <SettingsGroup>
          <SettingsRow icon="bell" label="Notifications" detail="On" />
          <SettingsRow icon="wifi" label="Network" detail="Home-5G" />
          <SettingsRow icon="car" label="Connected devices" detail="3" />
        </SettingsGroup>
        <SettingsGroup>
          <SettingsRow icon="leaf" label="Eco mode" detail="Auto" />
          <SettingsRow icon="user" label="Account" detail="" />
        </SettingsGroup>
      </div>

      <EnergyFlowSection
        flows={[{ pct: 100, label: "Plan: Sunhold+", kwh: 0 }]}
        title="Membership"
        subtitle="Renews Mar 12"
      />
    </div>
  );
}

function SettingsGroup({ children }: { children: ReactNode }) {
  const items = Children.toArray(children);
  return (
    <div
      style={{
        background: COLORS.surface,
        borderRadius: 18,
        overflow: "hidden",
        boxShadow:
          "inset 0 1px 0 rgba(255,255,255,0.9), 0 1px 2px rgba(0,0,0,0.03)",
      }}
    >
      {items.map((c, i) => (
        <div
          key={i}
          style={{
            borderTop: i === 0 ? "none" : "1px solid rgba(0,0,0,0.05)",
          }}
        >
          {c}
        </div>
      ))}
    </div>
  );
}

function SettingsRow({
  icon,
  label,
  detail,
}: {
  icon: IconName;
  label: string;
  detail: string;
}) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 12,
        padding: "14px 16px",
        cursor: "pointer",
      }}
    >
      <div
        style={{
          width: 32,
          height: 32,
          borderRadius: 10,
          background: COLORS.yellowPale,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Icon name={icon} size={16} color={COLORS.ink} />
      </div>
      <div
        style={{
          flex: 1,
          fontSize: 15,
          color: COLORS.ink,
          fontWeight: 500,
        }}
      >
        {label}
      </div>
      {detail && (
        <div style={{ fontSize: 13, color: COLORS.inkMuted }}>{detail}</div>
      )}
      <Icon name="chevron-right" size={14} color={COLORS.inkMuted} />
    </div>
  );
}

// ──────────────────────────────────────────────────────────────
// Registry helper
// ──────────────────────────────────────────────────────────────

export const SCREENS: Record<
  ScreenId,
  (props: ScreenProps) => React.JSX.Element
> = {
  home: HomeScreen,
  solar: SolarScreen,
  reserve: ReserveScreen,
  grid: GridScreen,
  settings: SettingsScreen,
};
