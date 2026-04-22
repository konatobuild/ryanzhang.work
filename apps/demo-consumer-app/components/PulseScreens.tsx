"use client";

import { useState, type ReactNode } from "react";

// Palette — soft peach/coral + deep indigo
const PEACH = "#FFD4B8";
const PEACH_SOFT = "#FFE8D6";
const PEACH_TINT = "#FFF2E6";
const INK = "#1A1230";
const TEXT = "#100828";
const MUTED = "#7A7490";
const ACCENT = "#FF7A47";

export type PulseScreen = "welcome" | "home" | "insights";

// ─────────── Welcome Screen ───────────
export function PFWelcomeScreen({ onGetStarted }: { onGetStarted: () => void }) {
  return (
    <div
      style={{
        height: "100%",
        background: PEACH,
        display: "flex",
        flexDirection: "column",
        padding: "0 28px",
        paddingTop: 62,
        paddingBottom: 34,
        fontFamily: "-apple-system, system-ui, sans-serif",
        color: INK,
      }}
    >
      <div style={{ paddingTop: 44 }}>
        <svg width="48" height="44" viewBox="0 0 48 44" fill="none">
          <circle cx="16" cy="22" r="13" stroke={INK} strokeWidth="4.5" />
          <circle cx="32" cy="22" r="13" stroke={INK} strokeWidth="4.5" />
        </svg>
      </div>

      <div style={{ flex: 1 }} />

      <div
        style={{
          fontSize: 46,
          fontWeight: 600,
          lineHeight: 1.08,
          letterSpacing: -1.2,
          color: INK,
          marginBottom: 22,
          textWrap: "balance",
        }}
      >
        Move With
        <br />
        Intention,
        <br />
        Every Day
      </div>
      <div
        style={{
          fontSize: 15.5,
          lineHeight: 1.5,
          color: "#3B2E52",
          marginBottom: 40,
          opacity: 0.82,
        }}
      >
        Build habits that stick. Track workouts, recovery, and energy in one
        clean space designed around how you actually train.
      </div>

      <button
        onClick={onGetStarted}
        style={{
          width: "100%",
          height: 60,
          borderRadius: 999,
          border: "none",
          background: INK,
          color: "#fff",
          fontSize: 17,
          fontWeight: 500,
          letterSpacing: -0.2,
          cursor: "pointer",
          fontFamily: "inherit",
          boxShadow: "0 6px 18px rgba(26,18,48,0.25)",
        }}
      >
        Start Training
      </button>

      <div
        style={{
          textAlign: "center",
          marginTop: 20,
          fontSize: 14.5,
          color: "#3B2E52",
        }}
      >
        Already a member?{" "}
        <span style={{ fontWeight: 600, color: INK }}>Sign in</span>
      </div>
    </div>
  );
}

// ─────────── Bottom Tab Bar ───────────
type TabId = "home" | "insights" | "play" | "plan" | "profile";
type TabEntry = { id: TabId; icon: (c: string) => ReactNode };

function PFTabBar({
  active,
  onChange,
}: {
  active: TabId;
  onChange: (t: TabId) => void;
}) {
  const tabs: TabEntry[] = [
    {
      id: "home",
      icon: (c) => (
        <svg
          width="22"
          height="22"
          viewBox="0 0 24 24"
          fill="none"
          stroke={c}
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M3 11l9-8 9 8v10a2 2 0 01-2 2h-3v-7h-8v7H5a2 2 0 01-2-2V11z" />
        </svg>
      ),
    },
    {
      id: "insights",
      icon: (c) => (
        <svg
          width="22"
          height="22"
          viewBox="0 0 24 24"
          fill="none"
          stroke={c}
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M3 17l5-5 4 4 8-8M14 4h7v7" />
        </svg>
      ),
    },
    {
      id: "play",
      icon: (c) => (
        <svg width="22" height="22" viewBox="0 0 24 24" fill={c} stroke="none">
          <path d="M8 5v14l11-7z" />
        </svg>
      ),
    },
    {
      id: "plan",
      icon: (c) => (
        <svg
          width="22"
          height="22"
          viewBox="0 0 24 24"
          fill="none"
          stroke={c}
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <rect x="3" y="5" width="18" height="16" rx="2" />
          <path d="M8 3v4M16 3v4M3 11h18" />
        </svg>
      ),
    },
    {
      id: "profile",
      icon: (c) => (
        <svg
          width="22"
          height="22"
          viewBox="0 0 24 24"
          fill="none"
          stroke={c}
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <circle cx="12" cy="8" r="4" />
          <path d="M4 21c0-4.4 3.6-8 8-8s8 3.6 8 8" />
        </svg>
      ),
    },
  ];
  return (
    <div
      style={{
        position: "absolute",
        bottom: 0,
        left: 0,
        right: 0,
        height: 88,
        paddingBottom: 28,
        background: "#fff",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-around",
        borderTop: "1px solid rgba(0,0,0,0.04)",
      }}
    >
      {tabs.map((t) => {
        const isActive = t.id === active;
        const isCenter = t.id === "play";
        return (
          <button
            key={t.id}
            onClick={() => onChange(t.id)}
            style={{
              border: "none",
              background: "transparent",
              cursor: "pointer",
              padding: 8,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 4,
              position: "relative",
            }}
          >
            {isActive && !isCenter ? (
              <div
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: 10,
                  background: INK,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                {t.icon("#fff")}
              </div>
            ) : isCenter ? (
              <div
                style={{
                  width: 44,
                  height: 44,
                  borderRadius: 22,
                  background: PEACH_SOFT,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                {t.icon(INK)}
              </div>
            ) : (
              t.icon("#100828")
            )}
            {isActive && !isCenter && (
              <div
                style={{
                  width: 4,
                  height: 4,
                  borderRadius: 2,
                  background: INK,
                }}
              />
            )}
          </button>
        );
      })}
    </div>
  );
}

// ─────────── Home Screen ───────────
type Activity = {
  name: string;
  sub: string;
  amount: string;
  type: string;
  avatar: ReactNode;
};

export function PFHomeScreen({ onTab }: { onTab: (t: TabId) => void }) {
  const [privacy, setPrivacy] = useState(false);

  const activities: Activity[] = [
    {
      name: "Morning Run",
      sub: "Today, 6:42 AM",
      amount: "5.2 km",
      type: "28 min",
      avatar: (
        <div
          style={{
            width: 44,
            height: 44,
            borderRadius: 22,
            background: "#FFE0CC",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <svg
            width="22"
            height="22"
            viewBox="0 0 24 24"
            fill="none"
            stroke={ACCENT}
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <circle cx="13" cy="4" r="2" />
            <path d="M4 22l3-8 4 2v6M14 13l-3-3 4-5 3 3 3-1" />
          </svg>
        </div>
      ),
    },
    {
      name: "Yoga Flow",
      sub: "Yesterday, 8:10 PM",
      amount: "45 min",
      type: "Recovery",
      avatar: (
        <div
          style={{
            width: 44,
            height: 44,
            borderRadius: 22,
            background: PEACH_TINT,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontWeight: 600,
            color: INK,
            fontSize: 14,
          }}
        >
          YF
        </div>
      ),
    },
    {
      name: "Coach Ellis",
      sub: "Monday",
      amount: "+120 XP",
      type: "Check-in",
      avatar: (
        <div
          style={{
            width: 44,
            height: 44,
            borderRadius: 22,
            background:
              "repeating-linear-gradient(45deg,#6B5A8F 0 6px,#4D3F6B 6px 12px)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "#fff",
            fontWeight: 600,
            fontSize: 14,
            fontFamily: "ui-monospace,monospace",
          }}
        >
          CE
        </div>
      ),
    },
  ];

  return (
    <div
      style={{
        height: "100%",
        background: "#fff",
        position: "relative",
        fontFamily: "-apple-system, system-ui, sans-serif",
      }}
    >
      <div
        style={{
          padding: "66px 24px 100px",
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
            marginTop: 8,
          }}
        >
          <div style={{ minWidth: 0, flex: 1, paddingRight: 16 }}>
            <div
              style={{
                fontSize: 26,
                fontWeight: 600,
                color: TEXT,
                letterSpacing: -0.6,
                whiteSpace: "nowrap",
              }}
            >
              Hey, Mira
            </div>
            <div style={{ fontSize: 15, color: MUTED, marginTop: 4 }}>
              Ready for day 24?
            </div>
          </div>
          <div style={{ position: "relative", marginTop: 6 }}>
            <svg
              width="26"
              height="26"
              viewBox="0 0 24 24"
              fill="none"
              stroke={TEXT}
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9" />
              <path d="M13.7 21a2 2 0 01-3.4 0" />
            </svg>
            <div
              style={{
                position: "absolute",
                top: -4,
                right: -4,
                minWidth: 18,
                height: 18,
                borderRadius: 9,
                background: ACCENT,
                color: "#fff",
                fontSize: 11,
                fontWeight: 600,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                padding: "0 4px",
                border: "2px solid #fff",
              }}
            >
              3
            </div>
          </div>
        </div>

        {/* Readiness */}
        <div style={{ marginTop: 28 }}>
          <div style={{ fontSize: 15, color: MUTED }}>Readiness today</div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 14,
              marginTop: 6,
            }}
          >
            <div
              style={{
                fontSize: 38,
                fontWeight: 600,
                color: TEXT,
                letterSpacing: -1.2,
              }}
            >
              {privacy ? "••" : "82"}
              <span
                style={{
                  fontSize: 22,
                  color: MUTED,
                  fontWeight: 500,
                  marginLeft: 4,
                }}
              >
                / 100
              </span>
            </div>
            <button
              onClick={() => setPrivacy((v) => !v)}
              style={{
                border: "none",
                background: "transparent",
                cursor: "pointer",
                padding: 4,
              }}
            >
              <svg
                width="22"
                height="22"
                viewBox="0 0 24 24"
                fill="none"
                stroke={TEXT}
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                {privacy ? (
                  <>
                    <path d="M3 3l18 18M10.6 10.6a2 2 0 002.8 2.8M9.9 5.1A10.4 10.4 0 0112 5c7 0 10 7 10 7a13.6 13.6 0 01-2.3 3.3M6.6 6.6C3.8 8.5 2 12 2 12s3 7 10 7c1.7 0 3.2-.4 4.5-1" />
                  </>
                ) : (
                  <>
                    <path d="M1 12s4-7 11-7 11 7 11 7-4 7-11 7S1 12 1 12z" />
                    <circle cx="12" cy="12" r="3" />
                  </>
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Quick stats row */}
        <div
          style={{
            marginTop: 24,
            display: "flex",
            alignItems: "center",
            gap: 12,
          }}
        >
          <div
            style={{
              fontSize: 15,
              color: TEXT,
              fontWeight: 500,
              marginRight: 4,
            }}
          >
            Today
          </div>
          <button
            style={{
              width: 46,
              height: 46,
              borderRadius: 23,
              border: "none",
              cursor: "pointer",
              background: PEACH_TINT,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
            }}
          >
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke={INK}
              strokeWidth="2.4"
              strokeLinecap="round"
            >
              <path d="M12 5v14M5 12h14" />
            </svg>
          </button>
          {/* STEPS chip */}
          <div
            style={{
              width: 92,
              height: 46,
              borderRadius: 10,
              flexShrink: 0,
              background:
                "linear-gradient(135deg, #FF7A47 0%, #FFA77A 50%, #D96230 100%)",
              position: "relative",
              overflow: "hidden",
              boxShadow: "inset 0 1px 0 rgba(255,255,255,0.25)",
            }}
          >
            <div
              style={{
                position: "absolute",
                inset: 0,
                background:
                  "radial-gradient(circle at 30% 40%, rgba(255,255,255,0.22), transparent 40%), radial-gradient(circle at 80% 80%, rgba(0,0,0,0.25), transparent 50%)",
              }}
            />
            <div
              style={{
                position: "absolute",
                top: 6,
                left: 10,
                color: "#fff",
                fontSize: 9,
                fontWeight: 500,
                letterSpacing: 0.5,
                opacity: 0.85,
              }}
            >
              STEPS
            </div>
            <div
              style={{
                position: "absolute",
                bottom: 6,
                right: 10,
                color: "#fff",
                fontSize: 12,
                fontWeight: 600,
              }}
            >
              8,412
            </div>
          </div>
          {/* SLEEP chip */}
          <div
            style={{
              width: 92,
              height: 46,
              borderRadius: 10,
              flexShrink: 0,
              background:
                "linear-gradient(135deg, #1A1230 0%, #3B2E52 50%, #0E0820 100%)",
              position: "relative",
              overflow: "hidden",
            }}
          >
            <div
              style={{
                position: "absolute",
                inset: 0,
                background:
                  "radial-gradient(circle at 20% 30%, rgba(255,255,255,0.1), transparent 40%)",
              }}
            />
            <div
              style={{
                position: "absolute",
                top: 6,
                left: 10,
                color: "#fff",
                fontSize: 9,
                fontWeight: 500,
                letterSpacing: 0.5,
                opacity: 0.7,
              }}
            >
              SLEEP
            </div>
            <div
              style={{
                position: "absolute",
                bottom: 6,
                right: 10,
                color: "#fff",
                fontSize: 12,
                fontWeight: 600,
              }}
            >
              7h 24m
            </div>
          </div>
        </div>

        {/* Action buttons */}
        <div
          style={{
            marginTop: 22,
            display: "flex",
            gap: 10,
            alignItems: "center",
          }}
        >
          <button
            style={{
              flex: 1,
              height: 54,
              borderRadius: 27,
              border: "none",
              cursor: "pointer",
              background: INK,
              color: "#fff",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 8,
              fontSize: 15,
              fontWeight: 500,
              fontFamily: "inherit",
            }}
          >
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="#fff"
              stroke="none"
            >
              <path d="M8 5v14l11-7z" />
            </svg>
            Start
          </button>
          <button
            style={{
              flex: 1,
              height: 54,
              borderRadius: 27,
              border: "none",
              cursor: "pointer",
              background: PEACH,
              color: INK,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 8,
              fontSize: 15,
              fontWeight: 500,
              fontFamily: "inherit",
            }}
          >
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke={INK}
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <rect x="3" y="5" width="18" height="16" rx="2" />
              <path d="M8 3v4M16 3v4M3 11h18" />
            </svg>
            Plan
          </button>
          <button
            style={{
              width: 54,
              height: 54,
              borderRadius: 27,
              border: "none",
              cursor: "pointer",
              background: PEACH_TINT,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill={INK}>
              <circle cx="7" cy="7" r="3" />
              <circle cx="17" cy="7" r="3" />
              <circle cx="7" cy="17" r="3" />
              <circle cx="17" cy="17" r="3" />
            </svg>
          </button>
        </div>

        {/* Divider */}
        <div
          style={{
            marginTop: 22,
            display: "flex",
            justifyContent: "center",
          }}
        >
          <div
            style={{
              width: 48,
              height: 4,
              borderRadius: 2,
              background: "#EFEBE4",
            }}
          />
        </div>

        {/* Recent Sessions */}
        <div
          style={{
            marginTop: 18,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <div
            style={{
              fontSize: 18,
              fontWeight: 600,
              color: TEXT,
              letterSpacing: -0.3,
            }}
          >
            Recent Sessions
          </div>
          <button
            style={{
              border: "none",
              background: "transparent",
              cursor: "pointer",
              color: INK,
              fontSize: 14,
              fontWeight: 500,
              display: "flex",
              alignItems: "center",
              gap: 4,
              fontFamily: "inherit",
            }}
          >
            See all
            <svg
              width="12"
              height="12"
              viewBox="0 0 24 24"
              fill="none"
              stroke={INK}
              strokeWidth="2.4"
              strokeLinecap="round"
            >
              <path d="M9 6l6 6-6 6" />
            </svg>
          </button>
        </div>

        <div
          style={{
            marginTop: 14,
            display: "flex",
            flexDirection: "column",
            gap: 16,
          }}
        >
          {activities.map((a, i) => (
            <div
              key={i}
              style={{ display: "flex", alignItems: "center", gap: 14 }}
            >
              {a.avatar}
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 16, fontWeight: 600, color: TEXT }}>
                  {a.name}
                </div>
                <div style={{ fontSize: 13, color: MUTED, marginTop: 2 }}>
                  {a.sub}
                </div>
              </div>
              <div style={{ textAlign: "right" }}>
                <div style={{ fontSize: 16, fontWeight: 600, color: TEXT }}>
                  {a.amount}
                </div>
                <div style={{ fontSize: 12, color: MUTED, marginTop: 2 }}>
                  {a.type}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      <PFTabBar active="home" onChange={onTab} />
    </div>
  );
}

// ─────────── Insights Screen ───────────
export function PFInsightsScreen({ onTab }: { onTab: (t: TabId) => void }) {
  const bars = [0.5, 0.42, 0.65, 0.88, 0.55, 0.7, 0.35];
  const weekLetters = ["M", "T", "W", "T", "F", "S", "S"];

  const months = ["Feb", "Mar", "Apr", "May", "Jun", "Jul"];
  const pts = [0.55, 0.4, 0.62, 0.78, 0.5, 0.75];
  const W = 340;
  const H = 140;
  const toXY = (v: number, i: number): [number, number] => [
    (i / (pts.length - 1)) * W,
    H - v * H * 0.8 - 10,
  ];
  const d = pts.reduce((acc, v, i) => {
    const [x, y] = toXY(v, i);
    if (i === 0) return `M ${x} ${y}`;
    const [px, py] = toXY(pts[i - 1], i - 1);
    const cx1 = px + (x - px) / 2;
    const cx2 = px + (x - px) / 2;
    return acc + ` C ${cx1} ${py} ${cx2} ${y} ${x} ${y}`;
  }, "");
  const area = d + ` L ${W} ${H} L 0 ${H} Z`;

  const tooltipIdx = 4;
  const [tx, ty] = toXY(pts[tooltipIdx], tooltipIdx);

  const categories = [
    { name: "Strength", amount: "4h 20m" },
    { name: "Cardio", amount: "2h 45m" },
    { name: "Mobility", amount: "1h 30m" },
    { name: "Recovery", amount: "3h 10m" },
  ];

  return (
    <div
      style={{
        height: "100%",
        background: "#fff",
        position: "relative",
        fontFamily: "-apple-system, system-ui, sans-serif",
      }}
    >
      <div
        style={{
          padding: "66px 24px 100px",
          height: "100%",
          overflowY: "auto",
          boxSizing: "border-box",
        }}
      >
        {/* Title */}
        <div
          style={{
            textAlign: "center",
            fontSize: 19,
            fontWeight: 500,
            color: TEXT,
            letterSpacing: -0.3,
          }}
        >
          Insights
        </div>

        {/* Weekly Load Card */}
        <div
          style={{
            marginTop: 24,
            padding: "20px 22px",
            borderRadius: 22,
            background: "#fff",
            boxShadow:
              "0 4px 22px rgba(40,20,10,0.06), 0 0 0 1px rgba(0,0,0,0.03)",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <div>
            <div style={{ fontSize: 14, color: MUTED }}>Weekly Load</div>
            <div
              style={{
                fontSize: 26,
                fontWeight: 600,
                color: TEXT,
                marginTop: 4,
                letterSpacing: -0.7,
              }}
            >
              11h 45m
            </div>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 4,
                marginTop: 6,
                fontSize: 12,
                color: MUTED,
              }}
            >
              <svg width="10" height="10" viewBox="0 0 10 10">
                <path d="M5 1l4 7H1z" fill={ACCENT} />
              </svg>
              <span style={{ color: ACCENT, fontWeight: 600 }}>6.2%</span>
              <span>vs last week</span>
            </div>
          </div>
          <div
            style={{
              display: "flex",
              alignItems: "flex-end",
              gap: 5,
              height: 70,
            }}
          >
            {bars.map((h, i) => (
              <div
                key={i}
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: 6,
                }}
              >
                <div
                  style={{
                    width: 10,
                    height: h * 60,
                    borderRadius: 3,
                    background: i === 3 ? INK : PEACH,
                  }}
                />
                <div style={{ fontSize: 10, color: MUTED }}>
                  {weekLetters[i]}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Resting HR header */}
        <div
          style={{
            marginTop: 26,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <div>
            <div style={{ fontSize: 15, color: MUTED }}>Resting HR</div>
            <div
              style={{
                fontSize: 32,
                fontWeight: 600,
                color: TEXT,
                letterSpacing: -1,
                marginTop: 4,
              }}
            >
              58 bpm
            </div>
          </div>
          <button
            style={{
              padding: "10px 16px",
              borderRadius: 22,
              border: "1px solid rgba(0,0,0,0.08)",
              background: "#fff",
              cursor: "pointer",
              fontSize: 13,
              color: TEXT,
              fontFamily: "inherit",
              display: "flex",
              alignItems: "center",
              gap: 6,
            }}
          >
            Jul 2024
            <svg
              width="10"
              height="10"
              viewBox="0 0 12 12"
              fill="none"
              stroke={TEXT}
              strokeWidth="1.8"
              strokeLinecap="round"
            >
              <path d="M2 4l4 4 4-4" />
            </svg>
          </button>
        </div>

        {/* Line chart */}
        <div style={{ marginTop: 18, position: "relative" }}>
          <svg
            width="100%"
            viewBox={`0 0 ${W} ${H + 8}`}
            style={{ display: "block" }}
          >
            <defs>
              <linearGradient id="pfgrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={ACCENT} stopOpacity="0.32" />
                <stop offset="100%" stopColor={ACCENT} stopOpacity="0" />
              </linearGradient>
            </defs>
            <path d={area} fill="url(#pfgrad)" />
            <path
              d={d}
              stroke={ACCENT}
              strokeWidth="2.5"
              fill="none"
              strokeLinecap="round"
            />
            <line
              x1={tx}
              y1={ty}
              x2={tx}
              y2={H}
              stroke={INK}
              strokeWidth="1.2"
              strokeDasharray="2 2"
            />
            <circle cx={tx} cy={ty} r="4.5" fill={INK} />
            <circle cx={tx} cy={ty} r="8" fill={INK} fillOpacity="0.12" />
          </svg>
          <div
            style={{
              position: "absolute",
              left: `${(tooltipIdx / (pts.length - 1)) * 100}%`,
              top: ty - 38,
              transform: "translateX(-50%)",
              background: "#fff",
              boxShadow:
                "0 4px 16px rgba(0,0,0,0.12), 0 0 0 1px rgba(0,0,0,0.04)",
              padding: "6px 12px",
              borderRadius: 14,
              fontSize: 13,
              fontWeight: 600,
              color: TEXT,
              whiteSpace: "nowrap",
            }}
          >
            61 bpm
          </div>

          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              marginTop: 10,
              padding: "0 2px",
            }}
          >
            {months.map((m, i) => (
              <div
                key={m}
                style={{
                  fontSize: 12,
                  color: i === tooltipIdx ? TEXT : MUTED,
                  fontWeight: i === tooltipIdx ? 600 : 400,
                }}
              >
                {m}
              </div>
            ))}
          </div>
        </div>

        {/* Categories */}
        <div
          style={{
            marginTop: 26,
            display: "flex",
            flexDirection: "column",
            gap: 18,
          }}
        >
          {categories.map((c) => (
            <div
              key={c.name}
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <div
                style={{ display: "flex", alignItems: "center", gap: 12 }}
              >
                <div
                  style={{
                    width: 10,
                    height: 10,
                    borderRadius: 5,
                    background: INK,
                  }}
                />
                <div style={{ fontSize: 16, color: TEXT }}>{c.name}</div>
              </div>
              <div style={{ fontSize: 16, fontWeight: 500, color: TEXT }}>
                {c.amount}
              </div>
            </div>
          ))}
        </div>
      </div>
      <PFTabBar active="insights" onChange={onTab} />
    </div>
  );
}
