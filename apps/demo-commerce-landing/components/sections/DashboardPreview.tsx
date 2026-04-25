"use client";

import type { ReactNode } from "react";
import { Caret, Logo } from "../atoms";

function MetricCard({
  icon,
  label,
  value,
  delta,
  up = true,
}: {
  icon: ReactNode;
  label: string;
  value: string;
  delta: string;
  up?: boolean;
}) {
  return (
    <div
      style={{
        background: "white",
        border: "1px solid var(--line)",
        borderRadius: 12,
        padding: 18,
        flex: 1,
        minWidth: 0,
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 8,
          color: "var(--muted)",
          fontSize: 12,
          marginBottom: 10,
        }}
      >
        <span
          style={{
            width: 22,
            height: 22,
            borderRadius: 999,
            border: "1px solid var(--line)",
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {icon}
        </span>
        {label}
      </div>
      <div
        style={{
          display: "flex",
          alignItems: "baseline",
          gap: 10,
          justifyContent: "space-between",
        }}
      >
        <div
          style={{ fontSize: 24, fontWeight: 600, letterSpacing: "-0.02em" }}
        >
          {value}
        </div>
        <div
          style={{
            fontSize: 12,
            color: "var(--muted)",
            display: "inline-flex",
            alignItems: "center",
            gap: 6,
          }}
        >
          <span
            style={{
              color: up ? "var(--up)" : "#c23",
              display: "inline-flex",
              alignItems: "center",
              gap: 4,
              fontWeight: 500,
            }}
          >
            <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
              <path
                d={up ? "M2 7L5 4L8 7" : "M2 3L5 6L8 3"}
                stroke="currentColor"
                strokeWidth="1.4"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            {delta}
          </span>
          vs last month
        </div>
      </div>
    </div>
  );
}

function ChartSpark() {
  return (
    <svg
      viewBox="0 0 600 120"
      preserveAspectRatio="none"
      style={{ width: "100%", height: 120, display: "block" }}
    >
      <defs>
        <linearGradient id="gfill" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0" stopColor="var(--accent)" stopOpacity="0.14" />
          <stop offset="1" stopColor="var(--accent)" stopOpacity="0" />
        </linearGradient>
      </defs>
      <path
        d="M0 90 C 60 80, 90 60, 140 70 S 220 30, 280 40 S 380 20, 440 30 S 540 50, 600 35 L 600 120 L 0 120 Z"
        fill="url(#gfill)"
      />
      <path
        d="M0 90 C 60 80, 90 60, 140 70 S 220 30, 280 40 S 380 20, 440 30 S 540 50, 600 35"
        stroke="var(--accent)"
        strokeWidth="1.6"
        fill="none"
      />
    </svg>
  );
}

const DollarIcon = (
  <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
    <path
      d="M5 1V9M7 3H4.5a1.2 1.2 0 0 0 0 2.4h1a1.2 1.2 0 0 1 0 2.4H3"
      stroke="currentColor"
      strokeWidth="1"
      strokeLinecap="round"
    />
  </svg>
);

const EyeIcon = (
  <svg width="12" height="8" viewBox="0 0 12 8" fill="none">
    <path
      d="M1 4s1.8-3 5-3 5 3 5 3-1.8 3-5 3-5-3-5-3z"
      stroke="currentColor"
      strokeWidth="1"
    />
    <circle cx="6" cy="4" r="1.3" stroke="currentColor" strokeWidth="1" />
  </svg>
);

const UserIcon = (
  <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
    <circle cx="5" cy="3.5" r="1.6" stroke="currentColor" strokeWidth="1" />
    <path
      d="M2 8.5c0-1.7 1.3-2.5 3-2.5s3 .8 3 2.5"
      stroke="currentColor"
      strokeWidth="1"
      strokeLinecap="round"
    />
  </svg>
);

const TOPNAV = ["Home", "Dashboard", "Payouts", "Reporting", "Customers", "Settings"];
const SUBNAV = [
  "Overview",
  "Notifications",
  "Analytics",
  "Saved reports",
  "Scheduled",
  "Exports",
];
const RANGE = ["12 months", "30 days", "7 days", "24 hours"];

export function DashboardPreview() {
  return (
    <div style={{ position: "relative", marginTop: 64 }}>
      <div
        aria-hidden
        style={{
          position: "absolute",
          inset: 0,
          display: "flex",
          justifyContent: "space-between",
          pointerEvents: "none",
        }}
      >
        <div
          style={{
            width: 80,
            background:
              "linear-gradient(90deg, var(--bg) 0%, transparent 100%)",
          }}
        />
        <div
          style={{
            width: 80,
            background:
              "linear-gradient(270deg, var(--bg) 0%, transparent 100%)",
          }}
        />
      </div>
      <div className="wrap" style={{ position: "relative" }}>
        <div
          style={{
            background: "white",
            border: "1px solid var(--line)",
            borderRadius: 14,
            boxShadow:
              "0 30px 60px -30px rgba(20,21,15,0.12), 0 1px 0 rgba(20,21,15,0.04)",
            overflow: "hidden",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              padding: "14px 18px",
              borderBottom: "1px solid var(--line-2)",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 22 }}>
              <Logo />
              <nav style={{ display: "flex", gap: 4, marginLeft: 8 }}>
                {TOPNAV.map((x, i) => (
                  <span
                    key={x}
                    style={{
                      padding: "6px 10px",
                      fontSize: 13,
                      fontWeight: i === 1 ? 600 : 500,
                      color: i === 1 ? "var(--ink)" : "var(--muted)",
                      background: i === 1 ? "var(--bg-2)" : "transparent",
                      borderRadius: 6,
                    }}
                  >
                    {x}
                  </span>
                ))}
              </nav>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <div
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 6,
                  padding: "6px 12px",
                  border: "1px solid var(--line)",
                  borderRadius: 999,
                  fontSize: 12,
                }}
              >
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                  <path
                    d="M6 1L7.5 4.5L11 5L8.5 7.5L9 11L6 9L3 11L3.5 7.5L1 5L4.5 4.5L6 1Z"
                    fill="var(--accent)"
                    stroke="var(--accent)"
                    strokeWidth="0.8"
                    strokeLinejoin="round"
                  />
                </svg>
                <span style={{ fontWeight: 600 }}>240</span>
                <span style={{ color: "var(--muted)" }}>credits</span>
              </div>
              <div
                style={{
                  width: 30,
                  height: 30,
                  borderRadius: 999,
                  background: "var(--bg-2)",
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 11,
                  fontWeight: 600,
                  color: "var(--ink-2)",
                }}
              >
                MV
              </div>
            </div>
          </div>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              padding: "10px 18px",
              borderBottom: "1px solid var(--line-2)",
            }}
          >
            <div style={{ display: "flex", gap: 18, fontSize: 13 }}>
              {SUBNAV.map((x, i) => (
                <span
                  key={x}
                  style={{
                    color: i === 0 ? "var(--ink)" : "var(--muted)",
                    fontWeight: i === 0 ? 600 : 500,
                    paddingBottom: 6,
                    borderBottom:
                      i === 0
                        ? "1.5px solid var(--ink)"
                        : "1.5px solid transparent",
                  }}
                >
                  {x}
                </span>
              ))}
            </div>
            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 8,
                padding: "6px 10px",
                border: "1px solid var(--line)",
                borderRadius: 8,
                width: 220,
                fontSize: 12,
                color: "var(--muted-2)",
              }}
            >
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                <circle
                  cx="5"
                  cy="5"
                  r="3.2"
                  stroke="currentColor"
                  strokeWidth="1.1"
                />
                <path
                  d="M7.5 7.5L10 10"
                  stroke="currentColor"
                  strokeWidth="1.1"
                  strokeLinecap="round"
                />
              </svg>
              Search
              <span
                style={{
                  marginLeft: "auto",
                  fontFamily: "var(--font-geist-mono)",
                  fontSize: 10,
                  padding: "1px 5px",
                  border: "1px solid var(--line)",
                  borderRadius: 4,
                }}
              >
                ⌘K
              </span>
            </div>
          </div>

          <div style={{ padding: "22px 22px 28px" }}>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                marginBottom: 16,
              }}
            >
              <h3
                style={{
                  margin: 0,
                  fontSize: 18,
                  fontWeight: 600,
                  letterSpacing: "-0.01em",
                }}
              >
                My dashboard
              </h3>
              <div style={{ display: "flex", gap: 6 }}>
                {RANGE.map((x, i) => (
                  <span
                    key={x}
                    style={{
                      padding: "5px 10px",
                      fontSize: 12,
                      borderRadius: 999,
                      background: i === 0 ? "var(--bg-2)" : "transparent",
                      color: i === 0 ? "var(--ink)" : "var(--muted)",
                      fontWeight: i === 0 ? 600 : 500,
                    }}
                  >
                    {x}
                  </span>
                ))}
              </div>
            </div>

            <div style={{ display: "flex", gap: 14, marginBottom: 18 }}>
              <MetricCard
                icon={DollarIcon}
                label="All revenue"
                value="$8,746.22"
                delta="2.4%"
              />
              <MetricCard
                icon={EyeIcon}
                label="Page views"
                value="12,440"
                delta="6.2%"
              />
              <MetricCard
                icon={UserIcon}
                label="Active now"
                value="96"
                delta="0.8%"
              />
            </div>

            <div
              style={{
                border: "1px solid var(--line)",
                borderRadius: 12,
                padding: "18px 18px 0",
                background: "white",
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  marginBottom: 4,
                }}
              >
                <div>
                  <div
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: 4,
                      fontSize: 12,
                      color: "var(--muted)",
                    }}
                  >
                    Net revenue
                    <Caret />
                  </div>
                  <div
                    style={{
                      fontSize: 22,
                      fontWeight: 600,
                      letterSpacing: "-0.02em",
                      marginTop: 2,
                    }}
                  >
                    $7,804.16
                    <span
                      style={{
                        fontSize: 12,
                        color: "var(--up)",
                        fontWeight: 500,
                        marginLeft: 4,
                      }}
                    >
                      ▲ 3.4%
                    </span>
                  </div>
                </div>
              </div>
              <ChartSpark />
            </div>
          </div>
        </div>

        <button
          type="button"
          aria-label="Play product tour"
          style={{
            position: "absolute",
            left: "50%",
            bottom: -24,
            transform: "translateX(-50%)",
            width: 56,
            height: 56,
            borderRadius: 999,
            border: "1px solid var(--line)",
            background: "rgba(255,255,255,0.75)",
            backdropFilter: "blur(6px)",
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: "pointer",
            boxShadow: "0 10px 30px -10px rgba(20,21,15,0.25)",
          }}
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path d="M5 3L12 8L5 13V3Z" fill="var(--ink)" />
          </svg>
        </button>
      </div>
    </div>
  );
}
