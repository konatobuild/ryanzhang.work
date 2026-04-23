"use client";

import type { CSSProperties, ReactNode } from "react";
import { Icons } from "./icons";

type StyleMap = Record<string, CSSProperties>;

const statsStyles: StyleMap = {
  row: {
    display: "grid",
    gridTemplateColumns: "repeat(5, 1fr)",
    borderBottom: "1px solid var(--border)",
  },
  card: {
    padding: "18px 22px",
    borderRight: "1px solid var(--border)",
    display: "flex",
    flexDirection: "column",
    gap: 10,
    minHeight: 108,
    position: "relative",
  },
  cardLast: { borderRight: "none" },
  labelRow: {
    display: "flex",
    alignItems: "center",
    gap: 6,
    fontSize: 12,
    color: "var(--muted)",
  },
  bigNum: {
    fontSize: 30,
    fontWeight: 500,
    letterSpacing: -0.8,
    lineHeight: 1,
    fontFeatureSettings: '"tnum" 1',
    color: "var(--ink)",
  },
  sub: {
    fontFamily: "var(--mono)",
    fontSize: 11,
    color: "var(--muted)",
    marginLeft: 8,
  },
  subGood: { color: "var(--ok)" },
  chartWrap: { marginTop: "auto", height: 24, width: "100%" },
  gauge: {
    height: 3,
    background: "var(--border)",
    borderRadius: 2,
    position: "relative",
    marginTop: 2,
  },
  gaugeFill: {
    position: "absolute",
    top: 0,
    left: 0,
    bottom: 0,
    background: "var(--ink-2)",
    borderRadius: 2,
  },
  gaugeDot: {
    position: "absolute",
    top: "50%",
    width: 8,
    height: 8,
    borderRadius: "50%",
    background: "var(--paper)",
    border: "1.5px solid var(--ink)",
    transform: "translate(-50%, -50%)",
  },
};

function makeSketchPath(
  points: Array<[number, number]>,
  jitter = 0.6,
  seed = 1,
): string {
  let s = seed * 9301 + 49297;
  const rnd = () => {
    s = (s * 9301 + 49297) % 233280;
    return s / 233280;
  };
  let d = "";
  for (let i = 0; i < points.length; i++) {
    const [x, y] = points[i];
    const jx = (rnd() - 0.5) * jitter;
    const jy = (rnd() - 0.5) * jitter;
    if (i === 0) {
      d += `M ${x + jx} ${y + jy}`;
    } else {
      const [px, py] = points[i - 1];
      const cx1 = px + (x - px) * 0.4 + (rnd() - 0.5) * jitter * 1.2;
      const cy1 = py + (y - py) * 0.3 + (rnd() - 0.5) * jitter * 1.6;
      const cx2 = px + (x - px) * 0.6 + (rnd() - 0.5) * jitter * 1.2;
      const cy2 = y - (y - py) * 0.3 + (rnd() - 0.5) * jitter * 1.6;
      d += ` C ${cx1} ${cy1}, ${cx2} ${cy2}, ${x + jx} ${y + jy}`;
    }
  }
  return d;
}

interface SketchlineProps {
  values: number[];
  width?: number;
  height?: number;
  seed?: number;
  color?: string;
}

function Sketchline({
  values,
  width = 240,
  height = 28,
  seed = 1,
  color = "var(--ink)",
}: SketchlineProps) {
  const min = Math.min(...values);
  const max = Math.max(...values);
  const range = max - min || 1;
  const pad = 2;
  const points: Array<[number, number]> = values.map((v, i) => [
    pad + (i / (values.length - 1)) * (width - pad * 2),
    height - pad - ((v - min) / range) * (height - pad * 2),
  ]);
  const d1 = makeSketchPath(points, 0.55, seed);
  const d2 = makeSketchPath(points, 0.9, seed + 17);
  return (
    <svg
      width="100%"
      height={height}
      viewBox={`0 0 ${width} ${height}`}
      preserveAspectRatio="none"
      style={{ display: "block" }}
    >
      <path
        d={d1}
        fill="none"
        stroke={color}
        strokeWidth="1.1"
        strokeLinecap="round"
        strokeLinejoin="round"
        opacity="0.85"
      />
      <path
        d={d2}
        fill="none"
        stroke={color}
        strokeWidth="0.6"
        strokeLinecap="round"
        strokeLinejoin="round"
        opacity="0.3"
      />
    </svg>
  );
}

interface BarlineProps {
  values: number[];
  width?: number;
  height?: number;
  color?: string;
}

function Barline({ values, width = 240, height = 28, color = "var(--ink-2)" }: BarlineProps) {
  const max = Math.max(...values);
  const bw = (width - 2) / values.length;
  return (
    <svg
      width="100%"
      height={height}
      viewBox={`0 0 ${width} ${height}`}
      preserveAspectRatio="none"
      style={{ display: "block" }}
    >
      {values.map((v, i) => {
        const h = Math.max(1, (v / max) * (height - 4));
        return (
          <rect
            key={i}
            x={1 + i * bw}
            y={height - h - 1}
            width={Math.max(1, bw - 1.2)}
            height={h}
            fill={color}
            opacity={0.35 + 0.6 * (v / max)}
          />
        );
      })}
    </svg>
  );
}

function Gauge({ pct, label }: { pct: number; label: string }) {
  return (
    <div>
      <div style={statsStyles.gauge}>
        <div style={{ ...statsStyles.gaugeFill, width: `${pct}%` }} />
        <div style={{ ...statsStyles.gaugeDot, left: `${pct}%` }} />
      </div>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginTop: 6,
          fontFamily: "var(--mono)",
          fontSize: 10,
          color: "var(--muted)",
        }}
      >
        <span>0</span>
        <span>{label}</span>
        <span>100</span>
      </div>
    </div>
  );
}

interface CardProps {
  label: string;
  trend?: boolean;
  value: string;
  sub: string;
  goodSub?: boolean;
  chart: ReactNode;
  last?: boolean;
}

function Card({ label, trend, value, sub, goodSub, chart, last }: CardProps) {
  return (
    <div style={{ ...statsStyles.card, ...(last ? statsStyles.cardLast : {}) }}>
      <div style={statsStyles.labelRow}>
        <span>{label}</span>
        {trend && (
          <span style={{ color: "var(--muted)", display: "grid", placeItems: "center" }}>
            {Icons.upright}
          </span>
        )}
      </div>
      <div style={{ display: "flex", alignItems: "baseline" }}>
        <span style={statsStyles.bigNum}>{value}</span>
        <span style={{ ...statsStyles.sub, ...(goodSub ? statsStyles.subGood : {}) }}>
          {sub}
        </span>
      </div>
      <div style={statsStyles.chartWrap}>{chart}</div>
    </div>
  );
}

const SPARK_A = [21, 22, 24, 23, 26, 28, 27, 30, 33, 31, 34, 38, 41, 43, 46];
const SPARK_B = [40, 42, 41, 45, 47, 48, 51, 55, 58, 57, 60, 63, 67, 71, 74];
const BARS = [6, 8, 10, 9, 12, 14, 11, 15, 18, 16, 19, 22, 20, 24, 21];

export function StatsRow() {
  return (
    <div style={statsStyles.row}>
      <Card
        label="Total contacts"
        trend
        value="1,284"
        sub="+6.4%"
        goodSub
        chart={<Sketchline values={SPARK_A} seed={3} />}
      />
      <Card
        label="Active this week"
        trend
        value="472"
        sub="38%"
        chart={<Sketchline values={SPARK_B} seed={8} />}
      />
      <Card
        label="Going cold"
        value="63"
        sub="5 new"
        chart={<Barline values={BARS} />}
      />
      <Card
        label="Avg. reply time"
        value="2h 14m"
        sub="healthy"
        goodSub
        chart={<Gauge pct={34} label="target 4h" />}
      />
      <Card
        label="Data coverage"
        value="87%"
        sub="4 fields low"
        chart={<Gauge pct={87} label="goal 95%" />}
        last
      />
    </div>
  );
}
