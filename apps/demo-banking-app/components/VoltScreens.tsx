"use client";

import type { CSSProperties, ReactNode } from "react";
import { useState } from "react";

export const sans = "'Inter', -apple-system, system-ui, sans-serif";
export const serif = "'Instrument Serif', 'Times New Roman', Georgia, serif";

export type VoltScreen = "home" | "cards" | "analytics";
export type Nav = (s: VoltScreen | string) => void;

export const PHONE_W = 380;
export const PHONE_H = 824;

// ──────────────────────────── Phone frame ────────────────────────────
export function PhoneFrame({
  children,
  label,
}: {
  children: ReactNode;
  label?: string;
}) {
  return (
    <div>
      <div
        style={{
          width: PHONE_W,
          height: PHONE_H,
          borderRadius: 56,
          background: "#0a0a0a",
          padding: 10,
          position: "relative",
          boxShadow: "0 30px 60px rgba(0,0,0,0.5), 0 0 0 1px #2a2a2a",
        }}
      >
        <div
          style={{
            position: "absolute",
            inset: 10,
            borderRadius: 48,
            overflow: "hidden",
            background: "#fafaf7",
          }}
        >
          {/* Dynamic island */}
          <div
            style={{
              position: "absolute",
              top: 11,
              left: "50%",
              transform: "translateX(-50%)",
              width: 120,
              height: 35,
              borderRadius: 20,
              background: "#000",
              zIndex: 50,
            }}
          />
          {/* Status bar */}
          <div
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              zIndex: 40,
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              padding: "18px 28px 0",
              fontFamily: '-apple-system, "SF Pro", system-ui',
              fontWeight: 600,
              fontSize: 15,
              color: "#0d0d0d",
            }}
          >
            <span>9:41</span>
            <div style={{ display: "flex", gap: 5, alignItems: "center" }}>
              <svg width="16" height="10" viewBox="0 0 16 10" aria-hidden>
                <rect x="0" y="6" width="2.6" height="4" rx="0.6" fill="#0d0d0d" />
                <rect x="4" y="4" width="2.6" height="6" rx="0.6" fill="#0d0d0d" />
                <rect x="8" y="2" width="2.6" height="8" rx="0.6" fill="#0d0d0d" />
                <rect x="12" y="0" width="2.6" height="10" rx="0.6" fill="#0d0d0d" />
              </svg>
              <svg width="22" height="10" viewBox="0 0 22 10" aria-hidden>
                <rect
                  x="0.5"
                  y="0.5"
                  width="19"
                  height="9"
                  rx="2.5"
                  stroke="#0d0d0d"
                  strokeOpacity="0.35"
                  fill="none"
                />
                <rect x="2" y="2" width="16" height="6" rx="1.5" fill="#0d0d0d" />
              </svg>
            </div>
          </div>
          {children}
          {/* Home indicator */}
          <div
            style={{
              position: "absolute",
              bottom: 6,
              left: "50%",
              transform: "translateX(-50%)",
              width: 130,
              height: 4,
              borderRadius: 999,
              background: "rgba(0,0,0,0.35)",
              zIndex: 60,
            }}
          />
        </div>
      </div>
      {label && (
        <div
          style={{
            textAlign: "center",
            fontSize: 12,
            color: "#888",
            marginTop: 14,
            letterSpacing: 0.5,
            textTransform: "uppercase",
          }}
        >
          {label}
        </div>
      )}
    </div>
  );
}

// ──────────────────────────── Tab bar ────────────────────────────
type TabId = "home" | "cards" | "scan" | "contact" | "analytics";

export function TabBar({
  active,
  accent,
  onNavigate,
}: {
  active: TabId;
  accent: string;
  onNavigate: Nav;
}) {
  const items: Array<{
    id: TabId;
    label: string;
    Icon: (p: { active?: boolean }) => ReactNode;
    fab?: boolean;
  }> = [
    { id: "home", label: "Home", Icon: HomeIcon },
    { id: "cards", label: "Cards", Icon: CardIcon },
    { id: "scan", label: "", Icon: ScanIcon, fab: true },
    { id: "contact", label: "Contact", Icon: ContactIcon },
    { id: "analytics", label: "Analytics", Icon: AnalyticsIcon },
  ];

  return (
    <div
      style={{
        position: "absolute",
        bottom: 0,
        left: 0,
        right: 0,
        zIndex: 5,
        background: "#fafaf7",
        paddingTop: 10,
        paddingBottom: 28,
        display: "flex",
        justifyContent: "space-around",
        alignItems: "flex-end",
        borderTop: "1px solid rgba(0,0,0,0.04)",
      }}
    >
      {items.map((item) => {
        const Icon = item.Icon;
        const isActive = active === item.id;
        if (item.fab) {
          return (
            <button
              type="button"
              key={item.id}
              onClick={() => onNavigate(item.id)}
              style={{
                width: 54,
                height: 54,
                borderRadius: 999,
                background: accent,
                border: "none",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                marginBottom: -6,
                boxShadow: `0 8px 20px ${accent}60`,
              }}
              aria-label="Scan"
            >
              <Icon />
            </button>
          );
        }
        return (
          <button
            type="button"
            key={item.id}
            onClick={() => onNavigate(item.id)}
            style={{
              background: "transparent",
              border: "none",
              cursor: "pointer",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 4,
              color: isActive ? "#0d0d0d" : "#a8a8a3",
              padding: "4px 10px",
              fontFamily: sans,
            }}
          >
            <Icon active={isActive} />
            <span style={{ fontSize: 10, fontWeight: isActive ? 600 : 400 }}>
              {item.label}
            </span>
          </button>
        );
      })}
    </div>
  );
}

function HomeIcon({ active }: { active?: boolean }) {
  return active ? (
    <svg width="22" height="22" viewBox="0 0 22 22" aria-hidden>
      <path d="M3 10L11 3l8 7v9a1 1 0 01-1 1h-4v-6H8v6H4a1 1 0 01-1-1v-9z" fill="#0d0d0d" />
    </svg>
  ) : (
    <svg width="22" height="22" viewBox="0 0 22 22" fill="none" aria-hidden>
      <path
        d="M3 10L11 3l8 7v9a1 1 0 01-1 1h-4v-6H8v6H4a1 1 0 01-1-1v-9z"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function CardIcon({ active }: { active?: boolean }) {
  return active ? (
    <svg width="22" height="22" viewBox="0 0 22 22" aria-hidden>
      <rect x="2" y="5" width="18" height="13" rx="2.5" fill="#0d0d0d" />
      <rect x="2" y="8" width="18" height="2" fill="#fafaf7" />
    </svg>
  ) : (
    <svg width="22" height="22" viewBox="0 0 22 22" fill="none" aria-hidden>
      <rect
        x="2.8"
        y="5.8"
        width="16.5"
        height="11.5"
        rx="2"
        stroke="currentColor"
        strokeWidth="1.5"
      />
      <path d="M3 10h17" stroke="currentColor" strokeWidth="1.5" />
    </svg>
  );
}

function ScanIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 22 22" fill="none" aria-hidden>
      <path
        d="M3 7V5a2 2 0 012-2h2M15 3h2a2 2 0 012 2v2M19 15v2a2 2 0 01-2 2h-2M7 19H5a2 2 0 01-2-2v-2"
        stroke="#0d0d0d"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
      <circle cx="11" cy="11" r="3.5" stroke="#0d0d0d" strokeWidth="1.6" />
    </svg>
  );
}

function ContactIcon({ active }: { active?: boolean }) {
  return active ? (
    <svg width="22" height="22" viewBox="0 0 22 22" aria-hidden>
      <circle cx="11" cy="7.5" r="3.5" fill="#0d0d0d" />
      <path
        d="M4 19c.5-3.5 3.5-6 7-6s6.5 2.5 7 6"
        stroke="#0d0d0d"
        strokeWidth="2"
        fill="none"
        strokeLinecap="round"
      />
    </svg>
  ) : (
    <svg width="22" height="22" viewBox="0 0 22 22" fill="none" aria-hidden>
      <circle cx="11" cy="7.5" r="3.5" stroke="currentColor" strokeWidth="1.5" />
      <path
        d="M4 19c.5-3.5 3.5-6 7-6s6.5 2.5 7 6"
        stroke="currentColor"
        strokeWidth="1.5"
        fill="none"
        strokeLinecap="round"
      />
    </svg>
  );
}

function AnalyticsIcon({ active }: { active?: boolean }) {
  return active ? (
    <svg width="22" height="22" viewBox="0 0 22 22" aria-hidden>
      <rect x="3" y="12" width="3.5" height="7" rx="1" fill="#0d0d0d" />
      <rect x="9" y="7" width="3.5" height="12" rx="1" fill="#0d0d0d" />
      <rect x="15" y="3" width="3.5" height="16" rx="1" fill="#0d0d0d" />
    </svg>
  ) : (
    <svg width="22" height="22" viewBox="0 0 22 22" fill="none" aria-hidden>
      <rect
        x="3.5"
        y="12.5"
        width="3"
        height="6"
        rx="0.8"
        stroke="currentColor"
        strokeWidth="1.5"
      />
      <rect
        x="9.5"
        y="7.5"
        width="3"
        height="11"
        rx="0.8"
        stroke="currentColor"
        strokeWidth="1.5"
      />
      <rect
        x="15.5"
        y="3.5"
        width="3"
        height="15"
        rx="0.8"
        stroke="currentColor"
        strokeWidth="1.5"
      />
    </svg>
  );
}

// ──────────────────────────── Shared atoms ────────────────────────────
function Avatar() {
  return (
    <div
      style={{
        width: 40,
        height: 40,
        borderRadius: 999,
        overflow: "hidden",
        background: "linear-gradient(135deg, #d9c4a7 0%, #8b6a4a 60%, #3d2a1a 100%)",
        position: "relative",
        flexShrink: 0,
        boxShadow: "0 1px 2px rgba(0,0,0,0.1)",
      }}
    >
      <div
        style={{
          position: "absolute",
          left: "50%",
          top: "22%",
          transform: "translateX(-50%)",
          width: 16,
          height: 16,
          borderRadius: "50%",
          background: "radial-gradient(circle at 40% 35%, #e8d2b2, #6b4d32)",
        }}
      />
      <div
        style={{
          position: "absolute",
          left: "50%",
          top: "55%",
          transform: "translateX(-50%)",
          width: 30,
          height: 24,
          borderRadius: "50% 50% 0 0 / 80% 80% 0 0",
          background: "#3d2a1a",
        }}
      />
    </div>
  );
}

function BellButton() {
  return (
    <div
      style={{
        width: 44,
        height: 44,
        borderRadius: 999,
        background: "#fff",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        boxShadow: "0 1px 2px rgba(0,0,0,0.06), 0 4px 12px rgba(0,0,0,0.05)",
        position: "relative",
        flexShrink: 0,
      }}
    >
      <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden>
        <path
          d="M9 2v1.2M4 7.5a5 5 0 1110 0c0 3.5 1 4.5 1.5 5h-13c.5-.5 1.5-1.5 1.5-5z"
          stroke="#0d0d0d"
          strokeWidth="1.4"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path d="M7 14.5a2 2 0 004 0" stroke="#0d0d0d" strokeWidth="1.4" strokeLinecap="round" />
      </svg>
      <div
        style={{
          position: "absolute",
          top: 10,
          right: 12,
          width: 6,
          height: 6,
          borderRadius: 999,
          background: "#e8383f",
          border: "1.5px solid #fff",
        }}
      />
    </div>
  );
}

function Dropdown({
  value,
  onChange,
  options,
  small,
}: {
  value: string;
  onChange: (v: string) => void;
  options: string[];
  small?: boolean;
}) {
  const [open, setOpen] = useState(false);
  return (
    <div style={{ position: "relative" }}>
      <button
        type="button"
        onClick={() => setOpen(!open)}
        style={{
          background: small ? "#eeece4" : "#0d0d0d",
          color: small ? "#0d0d0d" : "#fff",
          border: "none",
          borderRadius: 999,
          padding: small ? "8px 14px" : "10px 16px",
          fontSize: 13,
          display: "flex",
          alignItems: "center",
          gap: 6,
          cursor: "pointer",
          fontFamily: "inherit",
        }}
      >
        {value}
        <svg width="10" height="10" viewBox="0 0 10 10" style={{ opacity: 0.7 }} aria-hidden>
          <path
            d="M2 3.5l3 3 3-3"
            stroke="currentColor"
            strokeWidth="1.5"
            fill="none"
            strokeLinecap="round"
          />
        </svg>
      </button>
      {open && (
        <div
          style={{
            position: "absolute",
            right: 0,
            top: "110%",
            background: "#fff",
            borderRadius: 14,
            boxShadow: "0 4px 16px rgba(0,0,0,0.12)",
            padding: 4,
            zIndex: 10,
            minWidth: 140,
            color: "#0d0d0d",
          }}
        >
          {options.map((o) => (
            <div
              key={o}
              onClick={() => {
                onChange(o);
                setOpen(false);
              }}
              style={{
                padding: "8px 12px",
                fontSize: 13,
                borderRadius: 10,
                cursor: "pointer",
                background: o === value ? "#f2f1ec" : "transparent",
              }}
            >
              {o}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ──────────────────────────── Home ────────────────────────────
function ActionPill({
  icon,
  label,
  primary,
  accent,
}: {
  icon: ReactNode;
  label: string;
  primary?: boolean;
  accent?: string;
}) {
  const bg = primary ? accent : "rgba(255,255,255,0.1)";
  const ring = primary ? "transparent" : "rgba(255,255,255,0.14)";
  return (
    <div
      style={{
        flex: 1,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 6,
      }}
    >
      <div
        style={{
          width: "100%",
          height: 48,
          borderRadius: 999,
          background: bg,
          border: `1px solid ${ring}`,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: primary ? "#0d0d0d" : "#fff",
        }}
      >
        {icon}
      </div>
      <div style={{ fontSize: 11, color: "rgba(255,255,255,0.7)" }}>{label}</div>
    </div>
  );
}

function ActivityRow({
  mark,
  name,
  meta,
  amount,
  positive,
}: {
  mark: ReactNode;
  name: string;
  meta: string;
  amount: string;
  positive?: boolean;
}) {
  return (
    <div
      style={{
        background: "#fff",
        borderRadius: 22,
        padding: "12px 14px",
        display: "flex",
        alignItems: "center",
        gap: 12,
        boxShadow: "0 1px 2px rgba(0,0,0,0.04)",
      }}
    >
      <div
        style={{
          width: 40,
          height: 40,
          borderRadius: 999,
          overflow: "hidden",
          flexShrink: 0,
        }}
      >
        {mark}
      </div>
      <div style={{ flex: 1 }}>
        <div style={{ fontSize: 15, fontWeight: 500 }}>{name}</div>
        <div style={{ fontSize: 12, color: "#8a8a85", marginTop: 1 }}>{meta}</div>
      </div>
      <div
        style={{
          fontSize: 15,
          fontWeight: 500,
          color: positive ? "#2b8a3e" : "#0d0d0d",
        }}
      >
        {amount}
      </div>
    </div>
  );
}

function MarkZenith() {
  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        background: "#0d0d0d",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        color: "#fff",
        fontFamily: serif,
        fontSize: 20,
      }}
    >
      Z
    </div>
  );
}

function MarkOrbit() {
  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        background: "#c44a3d",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        position: "relative",
      }}
    >
      <div
        style={{
          width: 22,
          height: 22,
          borderRadius: 999,
          border: "2px solid #fff",
          position: "relative",
        }}
      >
        <div
          style={{
            position: "absolute",
            inset: 4,
            borderRadius: 999,
            background: "#fff",
          }}
        />
      </div>
    </div>
  );
}

function MarkMeridian() {
  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        background: "#3b5bdb",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        color: "#fff",
      }}
    >
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden>
        <path
          d="M3 14L7 6l3 5 3-7 4 10"
          stroke="#fff"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </div>
  );
}

function MarkSalary({ accent }: { accent: string }) {
  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        background: accent,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <svg width="18" height="18" viewBox="0 0 18 18" aria-hidden>
        <path
          d="M9 3v12M4 8l5-5 5 5"
          stroke="#0d0d0d"
          strokeWidth="2"
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </div>
  );
}

function PlusIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" aria-hidden>
      <path d="M9 3v12M3 9h12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

function ArrowUpIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" aria-hidden>
      <path
        d="M8 13V3M4 7l4-4 4 4"
        stroke="currentColor"
        strokeWidth="1.6"
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function SwapIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" aria-hidden>
      <path
        d="M5 3v10M5 13l-2-2M11 13V3M11 3l2 2"
        stroke="currentColor"
        strokeWidth="1.6"
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function DotsIcon() {
  return (
    <svg width="16" height="4" viewBox="0 0 16 4" aria-hidden>
      <circle cx="2" cy="2" r="1.5" fill="currentColor" />
      <circle cx="8" cy="2" r="1.5" fill="currentColor" />
      <circle cx="14" cy="2" r="1.5" fill="currentColor" />
    </svg>
  );
}

export function HomeScreen({ accent, onNavigate }: { accent: string; onNavigate: Nav }) {
  const [spendTab, setSpendTab] = useState("This Week");
  const [activityFilter, setActivityFilter] = useState("All Activity");

  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        background: "#fafaf7",
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
        fontFamily: sans,
        color: "#0d0d0d",
      }}
    >
      <div
        style={{
          padding: "62px 20px 0",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 12,
        }}
      >
        <Avatar />
        <div style={{ flex: 1, textAlign: "center", marginTop: 4 }}>
          <div style={{ fontSize: 13, color: "#8a8a85", letterSpacing: 0.1 }}>
            Good Morning,
          </div>
          <div
            style={{
              fontFamily: serif,
              fontSize: 28,
              lineHeight: "32px",
              fontWeight: 400,
              letterSpacing: -0.3,
              marginTop: 2,
            }}
          >
            Ada Mercer
          </div>
        </div>
        <BellButton />
      </div>

      <div style={{ flex: 1, overflowY: "auto", paddingBottom: 100 }}>
        {/* Balance card */}
        <div
          style={{
            margin: "18px 16px 0",
            background: "#0d0d0d",
            color: "#fff",
            borderRadius: 28,
            padding: "20px 22px 22px",
            position: "relative",
          }}
        >
          <div style={{ fontSize: 13, color: "rgba(255,255,255,0.55)" }}>Your Balance</div>
          <div
            style={{
              display: "flex",
              alignItems: "flex-start",
              justifyContent: "space-between",
              marginTop: 4,
              gap: 10,
            }}
          >
            <div
              style={{
                fontFamily: serif,
                fontSize: 44,
                lineHeight: "48px",
                letterSpacing: -0.8,
                fontWeight: 400,
              }}
            >
              $15,121.50
            </div>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                background: "rgba(255,255,255,0.08)",
                borderRadius: 10,
                padding: "6px 10px 6px 6px",
                marginTop: 10,
              }}
            >
              <div
                style={{
                  width: 22,
                  height: 16,
                  borderRadius: 3,
                  background: accent,
                  boxShadow: "inset 0 -4px 0 rgba(0,0,0,0.1)",
                }}
              />
              <span style={{ fontSize: 12, color: "rgba(255,255,255,0.85)" }}>**232</span>
              <span
                style={{
                  color: "rgba(255,255,255,0.35)",
                  fontSize: 16,
                  marginLeft: 2,
                }}
              >
                +
              </span>
            </div>
          </div>

          <div style={{ display: "flex", gap: 8, marginTop: 22 }}>
            <ActionPill primary accent={accent} icon={<PlusIcon />} label="Top up" />
            <ActionPill icon={<ArrowUpIcon />} label="Send" />
            <ActionPill icon={<SwapIcon />} label="Swap" />
            <ActionPill icon={<DotsIcon />} label="More" />
          </div>
        </div>

        {/* Spending summary */}
        <div style={{ padding: "24px 24px 8px" }}>
          <div style={{ fontSize: 13, color: "#8a8a85" }}>Total Spending</div>
          <div
            style={{
              display: "flex",
              alignItems: "flex-end",
              justifyContent: "space-between",
              marginTop: 4,
            }}
          >
            <div>
              <div
                style={{
                  fontFamily: serif,
                  fontSize: 40,
                  lineHeight: "44px",
                  letterSpacing: -0.6,
                }}
              >
                $147.52
              </div>
              <div style={{ fontSize: 12, color: "#2b8a3e", marginTop: 2 }}>
                + 1.7% last week
              </div>
            </div>
            <Dropdown
              value={spendTab}
              onChange={setSpendTab}
              options={["This Week", "This Month", "This Year"]}
            />
          </div>

          <div
            style={{
              display: "flex",
              gap: 8,
              marginTop: 18,
              overflowX: "auto",
              paddingBottom: 4,
              scrollbarWidth: "none",
            }}
          >
            {[
              { pct: "30%", label: "Transfer" },
              { pct: "35%", label: "Leisure" },
              { pct: "15%", label: "Receiving" },
              { pct: "20%", label: "Subs" },
            ].map((c, i) => (
              <div
                key={i}
                style={{
                  flexShrink: 0,
                  background: "#eeece4",
                  borderRadius: 999,
                  padding: "10px 16px",
                  fontSize: 13,
                  whiteSpace: "nowrap",
                }}
              >
                <span style={{ fontWeight: 600 }}>{c.pct}</span>
                <span style={{ color: "#5c5c55", marginLeft: 6 }}>{c.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Recent activity */}
        <div style={{ padding: "16px 20px 0" }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <div
              style={{
                fontFamily: serif,
                fontSize: 22,
                letterSpacing: -0.3,
              }}
            >
              Recent Activity
            </div>
            <Dropdown
              value={activityFilter}
              onChange={setActivityFilter}
              options={["All Activity", "Income", "Expenses"]}
              small
            />
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 10, marginTop: 14 }}>
            <ActivityRow mark={<MarkZenith />} name="Zenith Market" meta="Paid · Today" amount="-$9.50" />
            <ActivityRow mark={<MarkOrbit />} name="Orbit Coffee" meta="Paid · 24 Apr" amount="-$15.00" />
            <ActivityRow mark={<MarkMeridian />} name="Meridian Tech" meta="Paid · 23 Apr" amount="-$42.00" />
            <ActivityRow
              mark={<MarkSalary accent={accent} />}
              name="Payroll"
              meta="Received · 22 Apr"
              amount="+$2,250.00"
              positive
            />
          </div>
        </div>
      </div>

      <TabBar active="home" accent={accent} onNavigate={onNavigate} />
    </div>
  );
}

// ──────────────────────────── Cards ────────────────────────────
function CardAction({ icon, label }: { icon: ReactNode; label: string }) {
  return (
    <button
      type="button"
      style={{
        flex: 1,
        background: "#fff",
        border: "none",
        cursor: "pointer",
        borderRadius: 18,
        padding: "12px 8px",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 6,
        boxShadow: "0 1px 2px rgba(0,0,0,0.04)",
        fontFamily: "inherit",
      }}
    >
      <div style={{ color: "#0d0d0d" }}>{icon}</div>
      <div style={{ fontSize: 11, color: "#0d0d0d" }}>{label}</div>
    </button>
  );
}

function DetailRow({
  label,
  value,
  copyable,
}: {
  label: string;
  value: ReactNode;
  copyable?: boolean;
}) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "14px 18px",
      }}
    >
      <div style={{ fontSize: 13, color: "#8a8a85" }}>{label}</div>
      <div
        style={{
          fontSize: 14,
          color: "#0d0d0d",
          fontVariantNumeric: "tabular-nums",
          display: "flex",
          alignItems: "center",
          gap: 8,
        }}
      >
        {value}
        {copyable && (
          <svg width="13" height="13" viewBox="0 0 13 13" fill="none" aria-hidden>
            <rect x="3" y="3" width="8" height="8" rx="1.5" stroke="#0d0d0d" strokeWidth="1.2" />
            <path d="M3 3H2a1 1 0 00-1 1v7" stroke="#0d0d0d" strokeWidth="1.2" strokeLinecap="round" />
          </svg>
        )}
      </div>
    </div>
  );
}

function Divider() {
  return <div style={{ height: 1, background: "rgba(0,0,0,0.05)", marginLeft: 18 }} />;
}

function FreezeIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden>
      <path
        d="M9 2v14M3 5.5L15 12.5M3 12.5L15 5.5"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  );
}

function LimitIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden>
      <circle cx="9" cy="9" r="6.5" stroke="currentColor" strokeWidth="1.5" />
      <path d="M9 5v4l2.5 2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

function ShieldIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden>
      <path
        d="M9 2l6 2.5v4c0 3.5-2.5 6.5-6 7.5-3.5-1-6-4-6-7.5v-4L9 2z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function DotsIcon2() {
  return (
    <svg width="18" height="4" viewBox="0 0 18 4" aria-hidden>
      <circle cx="2" cy="2" r="1.5" fill="currentColor" />
      <circle cx="9" cy="2" r="1.5" fill="currentColor" />
      <circle cx="16" cy="2" r="1.5" fill="currentColor" />
    </svg>
  );
}

export function CardsScreen({ accent, onNavigate }: { accent: string; onNavigate: Nav }) {
  const [selected, setSelected] = useState(0);
  const cards = [
    { name: "Everyday", last: "232", bg: accent, dark: false, num: "5241 9087 0232" },
    { name: "Savings", last: "114", bg: "#0d0d0d", dark: true, num: "4891 2233 0114" },
    { name: "Travel", last: "768", bg: "#e94e4e", dark: true, num: "3302 8810 0768" },
  ] as const;

  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        background: "#fafaf7",
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
        fontFamily: sans,
      }}
    >
      <div
        style={{
          padding: "62px 20px 0",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 12,
        }}
      >
        <button
          type="button"
          onClick={() => onNavigate("home")}
          style={{
            width: 44,
            height: 44,
            borderRadius: 999,
            background: "#fff",
            border: "none",
            cursor: "pointer",
            boxShadow: "0 1px 2px rgba(0,0,0,0.06), 0 4px 12px rgba(0,0,0,0.05)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
          aria-label="Back"
        >
          <svg width="16" height="16" viewBox="0 0 16 16" aria-hidden>
            <path
              d="M10 3L4 8l6 5"
              stroke="#0d0d0d"
              strokeWidth="1.8"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
        <div
          style={{
            flex: 1,
            textAlign: "center",
            fontFamily: serif,
            fontSize: 24,
            letterSpacing: -0.3,
            marginTop: 4,
            color: "#0d0d0d",
          }}
        >
          My Cards
        </div>
        <button
          type="button"
          style={{
            width: 44,
            height: 44,
            borderRadius: 999,
            background: "#fff",
            border: "none",
            cursor: "pointer",
            boxShadow: "0 1px 2px rgba(0,0,0,0.06), 0 4px 12px rgba(0,0,0,0.05)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
          aria-label="Add card"
        >
          <svg width="18" height="18" viewBox="0 0 18 18" aria-hidden>
            <path d="M9 3v12M3 9h12" stroke="#0d0d0d" strokeWidth="2" strokeLinecap="round" />
          </svg>
        </button>
      </div>

      <div style={{ flex: 1, overflowY: "auto", paddingBottom: 100 }}>
        <div style={{ padding: "24px 0 0", position: "relative", height: 260 }}>
          {cards.map((c, i) => {
            const offset = i - selected;
            const z = 10 - Math.abs(offset);
            const cardStyle: CSSProperties = {
              position: "absolute",
              left: "50%",
              top: offset < 0 ? 0 : 24 + offset * 40,
              transform: `translateX(calc(-50% + ${offset * 14}px)) scale(${1 - Math.abs(offset) * 0.04})`,
              width: 320,
              height: 200,
              borderRadius: 22,
              background: c.bg,
              color: c.dark ? "#fff" : "#0d0d0d",
              padding: 20,
              zIndex: z,
              cursor: "pointer",
              boxShadow:
                selected === i
                  ? "0 20px 40px rgba(0,0,0,0.18)"
                  : "0 8px 20px rgba(0,0,0,0.08)",
              opacity: offset < 0 ? 0 : 1,
              transition: "all 0.35s cubic-bezier(.2,.8,.2,1)",
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
            };
            return (
              <div key={i} onClick={() => setSelected(i)} style={cardStyle}>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "flex-start",
                  }}
                >
                  <div style={{ fontSize: 12, opacity: 0.7 }}>{c.name}</div>
                  <div
                    style={{
                      fontFamily: serif,
                      fontSize: 22,
                      letterSpacing: -0.3,
                    }}
                  >
                    volt
                  </div>
                </div>
                <div>
                  <div
                    style={{
                      fontSize: 14,
                      letterSpacing: 2,
                      fontVariantNumeric: "tabular-nums",
                    }}
                  >
                    •• •• •• {c.last}
                  </div>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "flex-end",
                      marginTop: 12,
                    }}
                  >
                    <div style={{ fontSize: 11, opacity: 0.7 }}>A. Mercer · 09/29</div>
                    <div
                      style={{
                        width: 32,
                        height: 22,
                        borderRadius: 4,
                        background: c.dark ? "rgba(255,255,255,0.15)" : "rgba(0,0,0,0.15)",
                      }}
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div style={{ padding: "20px 20px 0" }}>
          <div style={{ display: "flex", gap: 10 }}>
            <CardAction icon={<FreezeIcon />} label="Freeze" />
            <CardAction icon={<LimitIcon />} label="Limits" />
            <CardAction icon={<ShieldIcon />} label="Secure" />
            <CardAction icon={<DotsIcon2 />} label="More" />
          </div>

          <div
            style={{
              marginTop: 18,
              background: "#fff",
              borderRadius: 22,
              overflow: "hidden",
              boxShadow: "0 1px 2px rgba(0,0,0,0.04)",
              color: "#0d0d0d",
            }}
          >
            <DetailRow label="Card number" value={cards[selected].num} copyable />
            <Divider />
            <DetailRow label="Balance" value="$15,121.50" />
            <Divider />
            <DetailRow label="Monthly limit" value="$5,000.00" />
            <Divider />
            <DetailRow
              label="Status"
              value={<span style={{ color: "#2b8a3e" }}>● Active</span>}
            />
          </div>
        </div>
      </div>

      <TabBar active="cards" accent={accent} onNavigate={onNavigate} />
    </div>
  );
}

// ──────────────────────────── Analytics ────────────────────────────
function PeriodBtn({
  value,
  onChange,
  dark,
}: {
  value: string;
  onChange: (v: string) => void;
  dark?: boolean;
}) {
  const [open, setOpen] = useState(false);
  const opts = ["Weekly", "Monthly", "Yearly"];
  return (
    <div style={{ position: "relative" }}>
      <button
        type="button"
        onClick={() => setOpen(!open)}
        style={{
          background: dark ? "#fff" : "#eeece4",
          color: "#0d0d0d",
          border: "none",
          borderRadius: 999,
          padding: "8px 14px",
          fontSize: 12,
          display: "flex",
          alignItems: "center",
          gap: 6,
          cursor: "pointer",
          fontFamily: "inherit",
        }}
      >
        {value}
        <svg width="9" height="9" viewBox="0 0 10 10" aria-hidden>
          <path
            d="M2 3.5l3 3 3-3"
            stroke="currentColor"
            strokeWidth="1.5"
            fill="none"
            strokeLinecap="round"
          />
        </svg>
      </button>
      {open && (
        <div
          style={{
            position: "absolute",
            right: 0,
            top: "110%",
            background: "#fff",
            borderRadius: 12,
            boxShadow: "0 4px 16px rgba(0,0,0,0.15)",
            padding: 4,
            zIndex: 10,
            minWidth: 110,
            color: "#0d0d0d",
          }}
        >
          {opts.map((o) => (
            <div
              key={o}
              onClick={() => {
                onChange(o);
                setOpen(false);
              }}
              style={{
                padding: "7px 10px",
                fontSize: 12,
                borderRadius: 8,
                cursor: "pointer",
                background: o === value ? "#f2f1ec" : "transparent",
              }}
            >
              {o}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function StatCard({
  dir,
  label,
  value,
  pct,
  pctColor,
  period,
  onPeriod,
  showPeriod,
}: {
  dir: "in" | "out";
  label: string;
  value: string;
  pct: string;
  pctColor: string;
  period?: string;
  onPeriod?: (v: string) => void;
  showPeriod?: boolean;
}) {
  return (
    <div
      style={{
        flex: 1,
        background: "#fff",
        borderRadius: 22,
        padding: "14px 14px 14px",
        boxShadow: "0 1px 2px rgba(0,0,0,0.04)",
        position: "relative",
        color: "#0d0d0d",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <div
          style={{
            width: 34,
            height: 34,
            borderRadius: 999,
            border: "1.5px solid #0d0d0d",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <svg
            width="14"
            height="14"
            viewBox="0 0 14 14"
            fill="none"
            style={{ transform: dir === "in" ? "rotate(45deg)" : "rotate(-135deg)" }}
            aria-hidden
          >
            <path
              d="M4 10L10 4M10 4H5M10 4v5"
              stroke="#0d0d0d"
              strokeWidth="1.6"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
        {showPeriod && period && onPeriod ? (
          <PeriodBtn value={period} onChange={onPeriod} />
        ) : (
          <div style={{ fontSize: 11, color: pctColor, fontWeight: 600 }}>{pct}</div>
        )}
      </div>
      {showPeriod && (
        <div
          style={{
            fontSize: 11,
            color: pctColor,
            fontWeight: 600,
            position: "absolute",
            top: 16,
            right: 78,
          }}
        >
          {pct}
        </div>
      )}
      <div style={{ fontSize: 12, color: "#8a8a85", marginTop: 14 }}>{label}</div>
      <div
        style={{
          fontFamily: serif,
          fontSize: 24,
          letterSpacing: -0.3,
          marginTop: 2,
        }}
      >
        {value}
      </div>
    </div>
  );
}

export function AnalyticsScreen({
  accent,
  onNavigate,
}: {
  accent: string;
  onNavigate: Nav;
}) {
  const [period, setPeriod] = useState("Monthly");
  const [overview, setOverview] = useState("Weekly");

  const months = [
    { l: "Feb", v: 528.4, parts: [0.2, 0.25, 0.25, 0.3], tall: false },
    { l: "Mar", v: 612.3, parts: [0.18, 0.28, 0.24, 0.3], tall: false },
    { l: "Apr", v: 724.5, parts: [0.15, 0.3, 0.25, 0.3], tall: false },
    { l: "May", v: 867.2, parts: [0.22, 0.24, 0.28, 0.26], tall: true },
    { l: "Jun", v: 690.0, parts: [0.2, 0.26, 0.24, 0.3], tall: false },
    { l: "Jul", v: 718.0, parts: [0.18, 0.28, 0.26, 0.28], tall: false },
    { l: "Aug", v: 359.5, parts: [0.35, 0.3, 0.1, 0.25], tall: false },
  ];

  const palette = ["#e94e4e", "#f4d03f", "#3b5bdb", accent];

  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        background: "#fafaf7",
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
        fontFamily: sans,
        color: "#0d0d0d",
      }}
    >
      <div
        style={{
          padding: "62px 20px 0",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 12,
        }}
      >
        <button
          type="button"
          onClick={() => onNavigate("home")}
          style={{
            width: 44,
            height: 44,
            borderRadius: 999,
            background: "#fff",
            border: "none",
            cursor: "pointer",
            boxShadow: "0 1px 2px rgba(0,0,0,0.06), 0 4px 12px rgba(0,0,0,0.05)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
          aria-label="Back"
        >
          <svg width="16" height="16" viewBox="0 0 16 16" aria-hidden>
            <path
              d="M10 3L4 8l6 5"
              stroke="#0d0d0d"
              strokeWidth="1.8"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
        <div
          style={{
            flex: 1,
            textAlign: "center",
            fontFamily: serif,
            fontSize: 24,
            letterSpacing: -0.3,
            marginTop: 4,
          }}
        >
          Analytic
        </div>
        <div
          style={{
            width: 44,
            height: 44,
            borderRadius: 999,
            background: "#fff",
            boxShadow: "0 1px 2px rgba(0,0,0,0.06), 0 4px 12px rgba(0,0,0,0.05)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            position: "relative",
          }}
        >
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden>
            <path
              d="M9 2v1.2M4 7.5a5 5 0 1110 0c0 3.5 1 4.5 1.5 5h-13c.5-.5 1.5-1.5 1.5-5z"
              stroke="#0d0d0d"
              strokeWidth="1.4"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          <div
            style={{
              position: "absolute",
              top: 10,
              right: 12,
              width: 6,
              height: 6,
              borderRadius: 999,
              background: "#e8383f",
              border: "1.5px solid #fff",
            }}
          />
        </div>
      </div>

      <div style={{ flex: 1, overflowY: "auto", paddingBottom: 100 }}>
        <div
          style={{
            margin: "18px 16px 0",
            background: "#0d0d0d",
            color: "#fff",
            borderRadius: 28,
            padding: "18px 20px 18px",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "flex-start",
            }}
          >
            <div>
              <div style={{ fontSize: 12, color: "rgba(255,255,255,0.55)" }}>
                Spending Analysis
              </div>
              <div
                style={{
                  fontFamily: serif,
                  fontSize: 40,
                  lineHeight: "44px",
                  letterSpacing: -0.6,
                  marginTop: 4,
                }}
              >
                $5,394.20
              </div>
            </div>
            <PeriodBtn value={period} onChange={setPeriod} dark />
          </div>
          <div
            style={{
              fontSize: 11.5,
              color: "rgba(255,255,255,0.7)",
              marginTop: 8,
            }}
          >
            Your spending has{" "}
            <span style={{ color: "#7bc47f" }}>↓ 42.27%</span> compared to last month
          </div>

          <div
            style={{
              marginTop: 18,
              background: "#1a1a1a",
              borderRadius: 20,
              padding: "16px 10px 10px",
              position: "relative",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "flex-end",
                justifyContent: "space-between",
                gap: 4,
                height: 180,
              }}
            >
              {months.map((m, i) => {
                const maxH = 150;
                const h = (m.v / 900) * maxH;
                const showLabel = m.tall || i === 0 || i === 2 || i === 5 || i === 6;
                return (
                  <div
                    key={i}
                    style={{
                      flex: 1,
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      gap: 4,
                    }}
                  >
                    {showLabel ? (
                      <div
                        style={{
                          fontSize: 9,
                          color: "rgba(255,255,255,0.8)",
                          whiteSpace: "nowrap",
                        }}
                      >
                        ${m.v.toFixed(2)}
                      </div>
                    ) : (
                      <div style={{ height: 10 }} />
                    )}
                    <div
                      style={{
                        width: "100%",
                        maxWidth: 28,
                        height: h,
                        borderRadius: 4,
                        overflow: "hidden",
                        display: "flex",
                        flexDirection: "column",
                        border: m.tall ? "1.5px solid rgba(255,255,255,0.25)" : "none",
                      }}
                    >
                      {m.parts.map((p, j) => (
                        <div key={j} style={{ flex: p, background: palette[j] }} />
                      ))}
                    </div>
                    <div
                      style={{
                        fontSize: 10,
                        color: "rgba(255,255,255,0.6)",
                        marginTop: 2,
                      }}
                    >
                      {m.l}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        <div style={{ padding: "22px 24px 8px" }}>
          <div
            style={{
              fontFamily: serif,
              fontSize: 22,
              letterSpacing: -0.3,
            }}
          >
            Financial Overview
          </div>
        </div>

        <div style={{ display: "flex", gap: 10, padding: "10px 16px 0" }}>
          <StatCard
            dir="in"
            label="Income"
            value="$2,250.00"
            pct="↑ 30.37%"
            pctColor="#2b8a3e"
            period={overview}
            onPeriod={setOverview}
            showPeriod
          />
          <StatCard
            dir="out"
            label="Expenses"
            value="$521.20"
            pct="↑ 2.70%"
            pctColor="#e8383f"
          />
        </div>

        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: 14,
            padding: "20px 24px 0",
          }}
        >
          {[
            { c: palette[0], l: "Groceries" },
            { c: palette[1], l: "Leisure" },
            { c: palette[2], l: "Transfer" },
            { c: palette[3], l: "Subscriptions" },
          ].map((x, i) => (
            <div
              key={i}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 6,
                fontSize: 12,
                color: "#5c5c55",
              }}
            >
              <div style={{ width: 10, height: 10, borderRadius: 3, background: x.c }} />
              {x.l}
            </div>
          ))}
        </div>
      </div>

      <TabBar active="analytics" accent={accent} onNavigate={onNavigate} />
    </div>
  );
}
