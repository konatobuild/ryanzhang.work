"use client";

import { type ReactNode, type CSSProperties } from "react";

// ───────────────── Palette ─────────────────
// Dark-first, sport-forward. No peach/wellness tones.
const INK = "#0A0A0A";
const SURFACE = "#141414";
const SURFACE_HI = "#1C1C1C";
const LINE = "rgba(255,255,255,0.08)";
const LINE_HI = "rgba(255,255,255,0.14)";
const CHALK = "#FAFAFA";
const DIM = "#8A8A8A";
const DIM_DEEP = "#5A5A5A";
const VOLT = "#D4FF3A";
const FLAME = "#FF5B2E";

// HR zones — easy → max
const Z1 = "#5CC8FF";
const Z2 = "#2DD36F";
const Z3 = "#D4FF3A";
const Z4 = "#FF9F0A";
const Z5 = "#FF3B30";

const FONT =
  '-apple-system, BlinkMacSystemFont, "SF Pro Display", system-ui, sans-serif';

export type PulseScreen = "welcome" | "home" | "insights";
type TabId = "home" | "insights" | "record" | "plans" | "profile";

// ───────────────── Wordmark ─────────────────
function Wordmark({ size = 22 }: { size?: number }) {
  return (
    <div
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 6,
        fontFamily: FONT,
      }}
    >
      <svg
        width={size * 1.1}
        height={size}
        viewBox="0 0 24 22"
        fill="none"
        aria-hidden
      >
        <path
          d="M2 18 L14 4 L14 10 L22 10"
          stroke={VOLT}
          strokeWidth="3.2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M18 6 L22 10 L18 14"
          stroke={VOLT}
          strokeWidth="3.2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
      <span
        style={{
          fontSize: size,
          fontWeight: 800,
          letterSpacing: 2,
          color: CHALK,
          fontStyle: "italic",
          lineHeight: 1,
        }}
      >
        STRIDE
      </span>
    </div>
  );
}

// ───────────────── Welcome ─────────────────
export function PFWelcomeScreen({ onGetStarted }: { onGetStarted: () => void }) {
  return (
    <div
      style={{
        height: "100%",
        background: INK,
        color: CHALK,
        padding: "0 28px",
        paddingTop: 62,
        paddingBottom: 34,
        display: "flex",
        flexDirection: "column",
        fontFamily: FONT,
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Backdrop streaks */}
      <div
        aria-hidden
        style={{
          position: "absolute",
          inset: 0,
          background:
            "radial-gradient(900px 400px at 100% 0%, rgba(212,255,58,0.08), transparent 60%), radial-gradient(600px 300px at 0% 100%, rgba(255,91,46,0.06), transparent 65%)",
          pointerEvents: "none",
        }}
      />
      <div
        aria-hidden
        style={{
          position: "absolute",
          top: 120,
          left: -60,
          width: 520,
          height: 520,
          borderRadius: "50%",
          border: `1px solid ${LINE}`,
          pointerEvents: "none",
        }}
      />
      <div
        aria-hidden
        style={{
          position: "absolute",
          top: 200,
          left: 40,
          width: 360,
          height: 360,
          borderRadius: "50%",
          border: `1px solid ${LINE}`,
          pointerEvents: "none",
        }}
      />

      <div style={{ paddingTop: 44, position: "relative" }}>
        <Wordmark size={22} />
      </div>

      <div style={{ flex: 1 }} />

      <div style={{ position: "relative" }}>
        <div
          style={{
            fontSize: 13,
            fontWeight: 600,
            color: VOLT,
            letterSpacing: 2,
            marginBottom: 18,
            textTransform: "uppercase",
          }}
        >
          Train like it counts
        </div>
        <div
          style={{
            fontSize: 52,
            fontWeight: 800,
            lineHeight: 0.98,
            letterSpacing: -2,
            color: CHALK,
            marginBottom: 22,
            textWrap: "balance",
          }}
        >
          One stride
          <br />
          at a time.
        </div>
        <div
          style={{
            fontSize: 15.5,
            lineHeight: 1.5,
            color: DIM,
            marginBottom: 40,
            maxWidth: 320,
          }}
        >
          Running, strength, and heart-rate zones — one app that actually
          speaks your training language.
        </div>

        <button
          onClick={onGetStarted}
          style={{
            width: "100%",
            height: 62,
            borderRadius: 999,
            border: "none",
            background: VOLT,
            color: INK,
            fontSize: 17,
            fontWeight: 700,
            letterSpacing: -0.2,
            cursor: "pointer",
            fontFamily: FONT,
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 10,
            boxShadow: "0 10px 28px rgba(212,255,58,0.18)",
          }}
        >
          Start training
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
            <path
              d="M5 12h14M13 5l7 7-7 7"
              stroke={INK}
              strokeWidth="2.6"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>

        <div
          style={{
            textAlign: "center",
            marginTop: 22,
            fontSize: 12,
            color: DIM_DEEP,
            letterSpacing: 1.6,
            textTransform: "uppercase",
          }}
        >
          Running · Strength · HR zones
        </div>
      </div>
    </div>
  );
}

// ───────────────── Tab Bar ─────────────────
function TabBar({
  active,
  onChange,
}: {
  active: TabId;
  onChange: (t: TabId) => void;
}) {
  const sideTabs: { id: TabId; label: string; icon: (c: string) => ReactNode }[] = [
    {
      id: "home",
      label: "Today",
      icon: (c) => (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
          <path
            d="M3 11l9-8 9 8v10a2 2 0 01-2 2h-3v-7h-8v7H5a2 2 0 01-2-2V11z"
            stroke={c}
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      ),
    },
    {
      id: "insights",
      label: "Insights",
      icon: (c) => (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
          <path
            d="M3 17l5-5 4 4 8-8M14 4h7v7"
            stroke={c}
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      ),
    },
    {
      id: "plans",
      label: "Plans",
      icon: (c) => (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
          <rect
            x="3"
            y="5"
            width="18"
            height="16"
            rx="2"
            stroke={c}
            strokeWidth="2"
          />
          <path
            d="M8 3v4M16 3v4M3 11h18"
            stroke={c}
            strokeWidth="2"
            strokeLinecap="round"
          />
        </svg>
      ),
    },
    {
      id: "profile",
      label: "You",
      icon: (c) => (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
          <circle cx="12" cy="8" r="4" stroke={c} strokeWidth="2" />
          <path
            d="M4 21c0-4.4 3.6-8 8-8s8 3.6 8 8"
            stroke={c}
            strokeWidth="2"
            strokeLinecap="round"
          />
        </svg>
      ),
    },
  ];

  const renderSide = (t: (typeof sideTabs)[number]) => {
    const isActive = active === t.id;
    return (
      <button
        key={t.id}
        onClick={() => onChange(t.id)}
        style={{
          border: "none",
          background: "transparent",
          cursor: "pointer",
          padding: 4,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 3,
          flex: 1,
          color: isActive ? CHALK : DIM_DEEP,
          fontFamily: FONT,
        }}
      >
        {t.icon(isActive ? CHALK : DIM_DEEP)}
        <div
          style={{
            fontSize: 10,
            fontWeight: isActive ? 700 : 500,
            letterSpacing: 0.6,
            textTransform: "uppercase",
          }}
        >
          {t.label}
        </div>
      </button>
    );
  };

  return (
    <div
      style={{
        position: "absolute",
        bottom: 0,
        left: 0,
        right: 0,
        height: 92,
        paddingBottom: 28,
        background: INK,
        borderTop: `1px solid ${LINE}`,
        display: "flex",
        alignItems: "center",
      }}
    >
      {sideTabs.slice(0, 2).map(renderSide)}

      {/* Record FAB — lifted above bar */}
      <div
        style={{
          flex: 1,
          display: "flex",
          justifyContent: "center",
          position: "relative",
        }}
      >
        <button
          onClick={() => onChange("record")}
          aria-label="Start recording"
          style={{
            position: "absolute",
            top: -26,
            width: 66,
            height: 66,
            borderRadius: 33,
            border: `4px solid ${INK}`,
            background: VOLT,
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            boxShadow:
              "0 10px 26px rgba(212,255,58,0.22), 0 0 0 1px rgba(0,0,0,0.2)",
          }}
        >
          <div
            style={{
              width: 18,
              height: 18,
              borderRadius: 9,
              background: INK,
            }}
          />
        </button>
      </div>

      {sideTabs.slice(2).map(renderSide)}
    </div>
  );
}

// ───────────────── Home ─────────────────
type RecentSession = {
  kind: "run" | "strength" | "recovery";
  title: string;
  when: string;
  primary: string;
  secondary: string;
  hr: string;
};

function SessionIcon({ kind }: { kind: RecentSession["kind"] }) {
  const bg = SURFACE_HI;
  const stroke = kind === "run" ? VOLT : kind === "strength" ? Z1 : Z2;
  return (
    <div
      style={{
        width: 42,
        height: 42,
        borderRadius: 12,
        background: bg,
        border: `1px solid ${LINE}`,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexShrink: 0,
      }}
    >
      {kind === "run" && (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
          <circle cx="15" cy="4.5" r="2" stroke={stroke} strokeWidth="2" />
          <path
            d="M5 21l3-7 4 1 2-4 4 3M9 10l2-4 4 2"
            stroke={stroke}
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      )}
      {kind === "strength" && (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
          <path
            d="M5 9v6M19 9v6M3 11v2M21 11v2M8 6v12M16 6v12"
            stroke={stroke}
            strokeWidth="2"
            strokeLinecap="round"
          />
        </svg>
      )}
      {kind === "recovery" && (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
          <path
            d="M12 3v3M12 18v3M3 12h3M18 12h3M5.6 5.6l2.1 2.1M16.3 16.3l2.1 2.1M5.6 18.4l2.1-2.1M16.3 7.7l2.1-2.1"
            stroke={stroke}
            strokeWidth="2"
            strokeLinecap="round"
          />
          <circle cx="12" cy="12" r="3" stroke={stroke} strokeWidth="2" />
        </svg>
      )}
    </div>
  );
}

function GoalRing({
  value,
  max,
  size = 82,
}: {
  value: number;
  max: number;
  size?: number;
}) {
  const stroke = 7;
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  const pct = Math.min(1, value / max);
  const offset = c - c * pct;
  return (
    <div style={{ position: "relative", width: size, height: size }}>
      <svg width={size} height={size}>
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke="rgba(255,255,255,0.1)"
          strokeWidth={stroke}
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke={VOLT}
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={c}
          strokeDashoffset={offset}
          transform={`rotate(-90 ${size / 2} ${size / 2})`}
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
          color: CHALK,
        }}
      >
        <div style={{ fontSize: 20, fontWeight: 800, letterSpacing: -0.5 }}>
          {value}
          <span style={{ color: DIM, fontWeight: 500 }}>/{max}</span>
        </div>
        <div
          style={{
            fontSize: 9,
            color: DIM,
            letterSpacing: 1,
            textTransform: "uppercase",
          }}
        >
          week
        </div>
      </div>
    </div>
  );
}

// Today's time-in-zone (minutes per zone). Sums to a visible horizontal bar.
const TODAY_ZONES = [
  { label: "Z1", mins: 6, color: Z1 },
  { label: "Z2", mins: 10, color: Z2 },
  { label: "Z3", mins: 7, color: Z3 },
  { label: "Z4", mins: 4, color: Z4 },
  { label: "Z5", mins: 1, color: Z5 },
];

function ZoneBar({ compact = false }: { compact?: boolean }) {
  const total = TODAY_ZONES.reduce((s, z) => s + z.mins, 0);
  return (
    <div>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "baseline",
          marginBottom: 8,
        }}
      >
        <div
          style={{
            fontSize: 11,
            color: DIM,
            letterSpacing: 1.2,
            textTransform: "uppercase",
            fontWeight: 600,
          }}
        >
          Time in zones · today
        </div>
        <div style={{ fontSize: 11, color: DIM_DEEP }}>{total} min</div>
      </div>
      <div
        style={{
          display: "flex",
          height: compact ? 10 : 14,
          borderRadius: 999,
          overflow: "hidden",
          gap: 2,
          background: SURFACE_HI,
        }}
      >
        {TODAY_ZONES.map((z) => (
          <div
            key={z.label}
            style={{
              flex: z.mins,
              background: z.color,
            }}
            title={`${z.label}: ${z.mins} min`}
          />
        ))}
      </div>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginTop: 8,
        }}
      >
        {TODAY_ZONES.map((z) => (
          <div
            key={z.label}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 4,
              fontSize: 10,
              color: DIM,
              fontWeight: 600,
              letterSpacing: 0.6,
            }}
          >
            <div
              style={{
                width: 6,
                height: 6,
                borderRadius: 3,
                background: z.color,
              }}
            />
            {z.label}
            <span style={{ color: DIM_DEEP, fontWeight: 500 }}>{z.mins}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export function PFHomeScreen({ onTab }: { onTab: (t: TabId) => void }) {
  const recents: RecentSession[] = [
    {
      kind: "run",
      title: "Morning Run",
      when: "Today · 6:42 AM",
      primary: "5.2 km",
      secondary: "28:14",
      hr: "152 avg",
    },
    {
      kind: "strength",
      title: "Push Day",
      when: "Mon · 7:15 PM",
      primary: "48 min",
      secondary: "6 lifts",
      hr: "118 avg",
    },
    {
      kind: "recovery",
      title: "Mobility",
      when: "Sun · 8:10 PM",
      primary: "25 min",
      secondary: "Recovery",
      hr: "—",
    },
  ];

  const metricLabel: CSSProperties = {
    fontSize: 10,
    color: DIM,
    letterSpacing: 1.4,
    textTransform: "uppercase",
    fontWeight: 700,
    marginBottom: 4,
  };
  const metricValue: CSSProperties = {
    fontSize: 22,
    color: CHALK,
    fontWeight: 800,
    letterSpacing: -0.8,
    lineHeight: 1,
  };
  const metricUnit: CSSProperties = {
    fontSize: 12,
    color: DIM,
    fontWeight: 500,
    marginLeft: 2,
  };

  return (
    <div
      style={{
        height: "100%",
        background: INK,
        color: CHALK,
        position: "relative",
        fontFamily: FONT,
      }}
    >
      <div
        style={{
          padding: "66px 22px 120px",
          height: "100%",
          overflowY: "auto",
          boxSizing: "border-box",
        }}
      >
        {/* Header */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
            marginTop: 4,
          }}
        >
          <div>
            <div
              style={{
                fontSize: 11,
                color: DIM_DEEP,
                letterSpacing: 1.6,
                textTransform: "uppercase",
                fontWeight: 700,
              }}
            >
              Wed · Apr 22
            </div>
            <div
              style={{
                fontSize: 26,
                fontWeight: 800,
                color: CHALK,
                letterSpacing: -0.8,
                marginTop: 2,
              }}
            >
              Hey, Mira
            </div>
          </div>
          {/* Streak pill */}
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 6,
              padding: "8px 12px",
              borderRadius: 999,
              background: SURFACE,
              border: `1px solid ${LINE_HI}`,
              marginTop: 6,
            }}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
              <path
                d="M12 2s5 4.5 5 10a5 5 0 01-10 0c0-2 1-3.5 2-5 0 2 1 3 2 3 0-3-1-5 1-8z"
                fill={FLAME}
              />
            </svg>
            <div style={{ fontSize: 13, fontWeight: 700, color: CHALK }}>
              24
            </div>
            <div
              style={{
                fontSize: 10,
                color: DIM,
                letterSpacing: 1,
                textTransform: "uppercase",
                fontWeight: 700,
              }}
            >
              day streak
            </div>
          </div>
        </div>

        {/* Hero — today's metrics + weekly ring */}
        <div
          style={{
            marginTop: 20,
            padding: 18,
            borderRadius: 20,
            background: SURFACE,
            border: `1px solid ${LINE}`,
            display: "flex",
            gap: 16,
            alignItems: "center",
            boxShadow:
              "0 1px 0 rgba(255,255,255,0.04) inset, 0 20px 40px rgba(0,0,0,0.3)",
          }}
        >
          <div style={{ flex: 1, display: "grid", gap: 14 }}>
            <div>
              <div style={metricLabel}>Distance</div>
              <div style={metricValue}>
                5.2<span style={metricUnit}>km</span>
              </div>
            </div>
            <div>
              <div style={metricLabel}>Time</div>
              <div style={metricValue}>28:14</div>
            </div>
            <div>
              <div style={metricLabel}>Avg HR</div>
              <div style={metricValue}>
                152<span style={metricUnit}>bpm</span>
              </div>
            </div>
          </div>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 8,
              paddingLeft: 8,
              borderLeft: `1px solid ${LINE}`,
              alignSelf: "stretch",
              justifyContent: "center",
            }}
          >
            <GoalRing value={3} max={5} />
            <div
              style={{
                fontSize: 10,
                color: DIM,
                letterSpacing: 1,
                textTransform: "uppercase",
                fontWeight: 700,
                textAlign: "center",
              }}
            >
              Sessions
            </div>
          </div>
        </div>

        {/* HR zones today */}
        <div
          style={{
            marginTop: 16,
            padding: 18,
            borderRadius: 20,
            background: SURFACE,
            border: `1px solid ${LINE}`,
          }}
        >
          <ZoneBar />
        </div>

        {/* Next up */}
        <div
          style={{
            marginTop: 16,
            padding: 16,
            borderRadius: 18,
            background: SURFACE,
            border: `1px solid ${LINE}`,
            display: "flex",
            alignItems: "center",
            gap: 14,
          }}
        >
          <div
            style={{
              width: 44,
              height: 44,
              borderRadius: 12,
              background: "rgba(212,255,58,0.12)",
              border: `1px solid rgba(212,255,58,0.3)`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
            }}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <path
                d="M3 12h4l3-8 4 16 3-8h4"
                stroke={VOLT}
                strokeWidth="2.2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div
              style={{
                fontSize: 10,
                color: VOLT,
                letterSpacing: 1.4,
                textTransform: "uppercase",
                fontWeight: 700,
              }}
            >
              Next up
            </div>
            <div
              style={{
                fontSize: 15,
                color: CHALK,
                fontWeight: 700,
                marginTop: 2,
                letterSpacing: -0.2,
              }}
            >
              Threshold Intervals
            </div>
            <div style={{ fontSize: 12, color: DIM, marginTop: 2 }}>
              Wed · 7:00 AM · 6 × 4 min @ Z4
            </div>
          </div>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
            <path
              d="M9 6l6 6-6 6"
              stroke={DIM}
              strokeWidth="2.4"
              strokeLinecap="round"
            />
          </svg>
        </div>

        {/* Recent sessions */}
        <div
          style={{
            marginTop: 24,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <div
            style={{
              fontSize: 11,
              color: DIM,
              letterSpacing: 1.6,
              textTransform: "uppercase",
              fontWeight: 700,
            }}
          >
            Recent sessions
          </div>
          <button
            style={{
              border: "none",
              background: "transparent",
              cursor: "pointer",
              color: CHALK,
              fontSize: 12,
              fontWeight: 700,
              display: "flex",
              alignItems: "center",
              gap: 4,
              fontFamily: FONT,
              letterSpacing: 0.4,
            }}
          >
            See all
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
              <path
                d="M9 6l6 6-6 6"
                stroke={CHALK}
                strokeWidth="2.4"
                strokeLinecap="round"
              />
            </svg>
          </button>
        </div>

        <div
          style={{
            marginTop: 12,
            display: "flex",
            flexDirection: "column",
            gap: 10,
          }}
        >
          {recents.map((r, i) => (
            <div
              key={i}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 12,
                padding: "10px 12px",
                borderRadius: 14,
                background: SURFACE,
                border: `1px solid ${LINE}`,
              }}
            >
              <SessionIcon kind={r.kind} />
              <div style={{ flex: 1, minWidth: 0 }}>
                <div
                  style={{
                    fontSize: 14,
                    fontWeight: 700,
                    color: CHALK,
                    letterSpacing: -0.2,
                  }}
                >
                  {r.title}
                </div>
                <div style={{ fontSize: 11, color: DIM, marginTop: 2 }}>
                  {r.when}
                </div>
              </div>
              <div style={{ textAlign: "right" }}>
                <div
                  style={{
                    fontSize: 14,
                    fontWeight: 800,
                    color: CHALK,
                    letterSpacing: -0.3,
                  }}
                >
                  {r.primary}
                </div>
                <div style={{ fontSize: 11, color: DIM, marginTop: 2 }}>
                  {r.secondary} · {r.hr}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      <TabBar active="home" onChange={onTab} />
    </div>
  );
}

// ───────────────── Insights ─────────────────
export function PFInsightsScreen({ onTab }: { onTab: (t: TabId) => void }) {
  // Weekly load bars (hours per day, M-Sun). Thursday peak.
  const loadHours = [1.2, 0.8, 1.8, 2.6, 1.4, 2.0, 0.8];
  const loadLetters = ["M", "T", "W", "T", "F", "S", "S"];
  const loadMax = 3; // Y axis max (hours)
  const loadTicks = [0, 1, 2, 3];
  const peakIdx = loadHours.indexOf(Math.max(...loadHours));

  // RHR line (bpm, last 6 months). Lower is better — trends down.
  const rhrMonths = ["Nov", "Dec", "Jan", "Feb", "Mar", "Apr"];
  const rhrVals = [63, 62, 60, 59, 59, 58];
  const rhrMin = 55;
  const rhrMax = 66;
  const W = 340;
  const H = 140;
  const toXY = (v: number, i: number): [number, number] => [
    (i / (rhrVals.length - 1)) * (W - 24) + 12,
    H - ((v - rhrMin) / (rhrMax - rhrMin)) * (H - 24) - 12,
  ];
  const line = rhrVals.reduce((acc, v, i) => {
    const [x, y] = toXY(v, i);
    if (i === 0) return `M ${x} ${y}`;
    const [px, py] = toXY(rhrVals[i - 1], i - 1);
    const cx1 = px + (x - px) / 2;
    const cx2 = px + (x - px) / 2;
    return acc + ` C ${cx1} ${py} ${cx2} ${y} ${x} ${y}`;
  }, "");
  const area = line + ` L ${toXY(rhrVals[rhrVals.length - 1], rhrVals.length - 1)[0]} ${H - 12} L ${toXY(rhrVals[0], 0)[0]} ${H - 12} Z`;
  const latestIdx = rhrVals.length - 1;
  const [tx, ty] = toXY(rhrVals[latestIdx], latestIdx);

  // Weekly HR zone distribution (percent)
  const zoneDist = [
    { label: "Z1", pct: 22, color: Z1 },
    { label: "Z2", pct: 34, color: Z2 },
    { label: "Z3", pct: 24, color: Z3 },
    { label: "Z4", pct: 14, color: Z4 },
    { label: "Z5", pct: 6, color: Z5 },
  ];

  // Training split — minutes + proportion
  const split = [
    { name: "Running", mins: 245 },
    { name: "Strength", mins: 200 },
    { name: "Intervals", mins: 85 },
    { name: "Mobility", mins: 75 },
  ];
  const splitMax = Math.max(...split.map((s) => s.mins));
  const fmtHrs = (m: number) =>
    `${Math.floor(m / 60)}h ${String(m % 60).padStart(2, "0")}m`;

  const pbs = [
    { label: "5K PR", value: "22:18", sub: "Apr 08" },
    { label: "Bench 1RM", value: "185 lb", sub: "Mar 24" },
    { label: "Longest streak", value: "24 d", sub: "Now" },
  ];

  return (
    <div
      style={{
        height: "100%",
        background: INK,
        color: CHALK,
        position: "relative",
        fontFamily: FONT,
      }}
    >
      <div
        style={{
          padding: "60px 22px 120px",
          height: "100%",
          overflowY: "auto",
          boxSizing: "border-box",
        }}
      >
        {/* Title */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <div
            style={{
              fontSize: 22,
              fontWeight: 800,
              color: CHALK,
              letterSpacing: -0.6,
            }}
          >
            Insights
          </div>
          <button
            style={{
              padding: "8px 12px",
              borderRadius: 999,
              border: `1px solid ${LINE_HI}`,
              background: SURFACE,
              cursor: "pointer",
              fontSize: 12,
              color: CHALK,
              fontFamily: FONT,
              display: "flex",
              alignItems: "center",
              gap: 6,
              fontWeight: 600,
            }}
          >
            Apr 2026
            <svg width="10" height="10" viewBox="0 0 12 12" fill="none">
              <path
                d="M2 4l4 4 4-4"
                stroke={CHALK}
                strokeWidth="1.8"
                strokeLinecap="round"
              />
            </svg>
          </button>
        </div>

        {/* Weekly Load */}
        <div
          style={{
            marginTop: 18,
            padding: 18,
            borderRadius: 20,
            background: SURFACE,
            border: `1px solid ${LINE}`,
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "flex-start",
              justifyContent: "space-between",
              gap: 16,
            }}
          >
            <div>
              <div
                style={{
                  fontSize: 11,
                  color: DIM,
                  letterSpacing: 1.4,
                  textTransform: "uppercase",
                  fontWeight: 700,
                }}
              >
                Weekly load
              </div>
              <div
                style={{
                  fontSize: 28,
                  fontWeight: 800,
                  color: CHALK,
                  marginTop: 4,
                  letterSpacing: -1,
                }}
              >
                10h 40m
              </div>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 4,
                  marginTop: 6,
                  fontSize: 12,
                }}
              >
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                  <path
                    d="M6 2l4 5H2z"
                    fill={VOLT}
                  />
                </svg>
                <span style={{ color: VOLT, fontWeight: 800 }}>+6.2%</span>
                <span style={{ color: DIM }}>vs last week</span>
              </div>
            </div>

            {/* Bar chart with Y axis */}
            <div
              style={{
                display: "flex",
                gap: 8,
                alignItems: "stretch",
                height: 96,
              }}
            >
              {/* Y axis ticks */}
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                  paddingRight: 2,
                  alignItems: "flex-end",
                }}
              >
                {[...loadTicks].reverse().map((t) => (
                  <div
                    key={t}
                    style={{
                      fontSize: 9,
                      color: DIM_DEEP,
                      lineHeight: 1,
                      fontWeight: 600,
                    }}
                  >
                    {t}h
                  </div>
                ))}
              </div>
              {/* Grid + bars */}
              <div
                style={{
                  position: "relative",
                  display: "flex",
                  alignItems: "flex-end",
                  gap: 6,
                  paddingTop: 4,
                }}
              >
                {loadTicks.map((t) => (
                  <div
                    key={t}
                    style={{
                      position: "absolute",
                      left: 0,
                      right: 0,
                      bottom: ((t / loadMax) * (96 - 4)),
                      height: 1,
                      background: "rgba(255,255,255,0.05)",
                    }}
                  />
                ))}
                {loadHours.map((h, i) => {
                  const isPeak = i === peakIdx;
                  return (
                    <div
                      key={i}
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        gap: 4,
                        position: "relative",
                        zIndex: 1,
                      }}
                    >
                      <div
                        style={{
                          width: 12,
                          height: (h / loadMax) * (96 - 18),
                          borderRadius: 3,
                          background: isPeak ? VOLT : "rgba(255,255,255,0.16)",
                        }}
                      />
                      <div
                        style={{
                          fontSize: 9,
                          color: isPeak ? CHALK : DIM_DEEP,
                          fontWeight: isPeak ? 800 : 500,
                        }}
                      >
                        {loadLetters[i]}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* Resting HR */}
        <div
          style={{
            marginTop: 16,
            padding: 18,
            borderRadius: 20,
            background: SURFACE,
            border: `1px solid ${LINE}`,
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "flex-end",
            }}
          >
            <div>
              <div
                style={{
                  fontSize: 11,
                  color: DIM,
                  letterSpacing: 1.4,
                  textTransform: "uppercase",
                  fontWeight: 700,
                }}
              >
                Resting HR
              </div>
              <div
                style={{
                  fontSize: 30,
                  fontWeight: 800,
                  color: CHALK,
                  letterSpacing: -1,
                  marginTop: 4,
                }}
              >
                58<span style={{ fontSize: 14, color: DIM, marginLeft: 4, fontWeight: 500 }}>bpm</span>
              </div>
            </div>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 4,
                fontSize: 11,
                color: VOLT,
                fontWeight: 700,
                letterSpacing: 0.4,
              }}
            >
              <svg width="10" height="10" viewBox="0 0 12 12" fill="none">
                <path d="M6 10l4-5H2z" fill={VOLT} />
              </svg>
              Lower is better
            </div>
          </div>

          {/* Line chart */}
          <div style={{ marginTop: 14, position: "relative" }}>
            <svg
              width="100%"
              viewBox={`0 0 ${W} ${H + 12}`}
              style={{ display: "block" }}
            >
              <defs>
                <linearGradient id="stgrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={VOLT} stopOpacity="0.28" />
                  <stop offset="100%" stopColor={VOLT} stopOpacity="0" />
                </linearGradient>
              </defs>
              <path d={area} fill="url(#stgrad)" />
              <path
                d={line}
                stroke={VOLT}
                strokeWidth="2.4"
                fill="none"
                strokeLinecap="round"
              />
              <line
                x1={tx}
                y1={ty}
                x2={tx}
                y2={H}
                stroke={LINE_HI}
                strokeWidth="1"
                strokeDasharray="2 3"
              />
              <circle cx={tx} cy={ty} r="5" fill={INK} stroke={VOLT} strokeWidth="2.4" />
            </svg>
            {/* Tooltip — same value as header */}
            <div
              style={{
                position: "absolute",
                left: `${(latestIdx / (rhrVals.length - 1)) * 100}%`,
                top: ty - 42,
                transform: "translateX(-70%)",
                background: CHALK,
                color: INK,
                padding: "6px 10px",
                borderRadius: 10,
                fontSize: 12,
                fontWeight: 800,
                whiteSpace: "nowrap",
                letterSpacing: -0.2,
              }}
            >
              58 bpm
            </div>

            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                marginTop: 6,
                padding: "0 2px",
              }}
            >
              {rhrMonths.map((m, i) => (
                <div
                  key={m}
                  style={{
                    fontSize: 10,
                    color: i === latestIdx ? CHALK : DIM_DEEP,
                    fontWeight: i === latestIdx ? 800 : 500,
                    letterSpacing: 0.5,
                  }}
                >
                  {m}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* HR Zones — weekly distribution */}
        <div
          style={{
            marginTop: 16,
            padding: 18,
            borderRadius: 20,
            background: SURFACE,
            border: `1px solid ${LINE}`,
          }}
        >
          <div
            style={{
              fontSize: 11,
              color: DIM,
              letterSpacing: 1.4,
              textTransform: "uppercase",
              fontWeight: 700,
              marginBottom: 10,
            }}
          >
            HR zones · this week
          </div>
          <div
            style={{
              display: "flex",
              height: 18,
              borderRadius: 999,
              overflow: "hidden",
              gap: 2,
            }}
          >
            {zoneDist.map((z) => (
              <div
                key={z.label}
                style={{ flex: z.pct, background: z.color }}
              />
            ))}
          </div>
          <div
            style={{
              marginTop: 12,
              display: "grid",
              gridTemplateColumns: "repeat(5, 1fr)",
              gap: 8,
            }}
          >
            {zoneDist.map((z) => (
              <div key={z.label}>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 4,
                    fontSize: 10,
                    color: DIM,
                    letterSpacing: 0.8,
                    fontWeight: 700,
                  }}
                >
                  <div
                    style={{
                      width: 6,
                      height: 6,
                      borderRadius: 3,
                      background: z.color,
                    }}
                  />
                  {z.label}
                </div>
                <div
                  style={{
                    fontSize: 15,
                    color: CHALK,
                    fontWeight: 800,
                    marginTop: 2,
                    letterSpacing: -0.3,
                  }}
                >
                  {z.pct}
                  <span style={{ fontSize: 10, color: DIM, fontWeight: 500 }}>
                    %
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Training split */}
        <div
          style={{
            marginTop: 16,
            padding: 18,
            borderRadius: 20,
            background: SURFACE,
            border: `1px solid ${LINE}`,
          }}
        >
          <div
            style={{
              fontSize: 11,
              color: DIM,
              letterSpacing: 1.4,
              textTransform: "uppercase",
              fontWeight: 700,
              marginBottom: 14,
            }}
          >
            Training split
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {split.map((s) => (
              <div key={s.name}>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "baseline",
                    marginBottom: 6,
                  }}
                >
                  <div
                    style={{
                      fontSize: 13,
                      color: CHALK,
                      fontWeight: 600,
                    }}
                  >
                    {s.name}
                  </div>
                  <div
                    style={{
                      fontSize: 13,
                      color: CHALK,
                      fontWeight: 800,
                      letterSpacing: -0.2,
                    }}
                  >
                    {fmtHrs(s.mins)}
                  </div>
                </div>
                <div
                  style={{
                    height: 6,
                    borderRadius: 3,
                    background: SURFACE_HI,
                    overflow: "hidden",
                  }}
                >
                  <div
                    style={{
                      width: `${(s.mins / splitMax) * 100}%`,
                      height: "100%",
                      background: VOLT,
                      opacity: 0.85,
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Personal bests */}
        <div
          style={{
            marginTop: 16,
            display: "flex",
            gap: 10,
          }}
        >
          {pbs.map((p) => (
            <div
              key={p.label}
              style={{
                flex: 1,
                padding: 14,
                borderRadius: 16,
                background: SURFACE,
                border: `1px solid ${LINE}`,
              }}
            >
              <div
                style={{
                  fontSize: 9,
                  color: VOLT,
                  letterSpacing: 1.2,
                  textTransform: "uppercase",
                  fontWeight: 800,
                }}
              >
                {p.label}
              </div>
              <div
                style={{
                  fontSize: 18,
                  color: CHALK,
                  fontWeight: 800,
                  marginTop: 6,
                  letterSpacing: -0.4,
                }}
              >
                {p.value}
              </div>
              <div style={{ fontSize: 10, color: DIM, marginTop: 2 }}>
                {p.sub}
              </div>
            </div>
          ))}
        </div>
      </div>
      <TabBar active="insights" onChange={onTab} />
    </div>
  );
}
