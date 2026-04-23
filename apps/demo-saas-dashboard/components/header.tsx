"use client";

import type { CSSProperties } from "react";
import { IcoBell, IcoChevron, IcoChevronR, IcoSearch } from "./icons";

const styles: Record<string, CSSProperties> = {
  wrap: {
    height: 72,
    borderBottom: "1px solid var(--line)",
    background: "var(--bg)",
    display: "flex",
    alignItems: "center",
    padding: "0 32px",
    gap: 20,
    flexShrink: 0,
  },
  crumb: {
    display: "flex",
    alignItems: "center",
    gap: 10,
    fontSize: 13.5,
    flex: "0 0 auto",
    minWidth: 260,
    whiteSpace: "nowrap",
  },
  crumbDim: {
    color: "var(--muted)",
    fontWeight: 500,
    whiteSpace: "nowrap",
  },
  crumbActive: {
    color: "var(--ink)",
    fontWeight: 600,
    whiteSpace: "nowrap",
  },
  searchWrap: {
    flex: 1,
    display: "flex",
    justifyContent: "center",
  },
  search: {
    width: 380,
    height: 40,
    background: "var(--panel)",
    border: "1px solid var(--line)",
    borderRadius: 20,
    display: "flex",
    alignItems: "center",
    padding: "0 16px",
    gap: 10,
    color: "var(--muted)",
  },
  searchInput: {
    border: "none",
    background: "transparent",
    width: "100%",
    fontSize: 13.5,
    color: "var(--ink)",
  },
  right: {
    display: "flex",
    alignItems: "center",
    gap: 16,
    flexShrink: 0,
  },
  balance: {
    display: "flex",
    alignItems: "center",
    gap: 8,
    height: 40,
    padding: "0 16px",
    background: "var(--panel)",
    border: "1px solid var(--line)",
    borderRadius: 20,
    fontSize: 13.5,
    fontWeight: 600,
    color: "var(--ink)",
    cursor: "pointer",
  },
  bell: {
    width: 40,
    height: 40,
    borderRadius: "50%",
    background: "var(--panel)",
    border: "1px solid var(--line)",
    display: "grid",
    placeItems: "center",
    color: "var(--ink-2)",
    cursor: "pointer",
    position: "relative",
  },
  bellDot: {
    position: "absolute",
    top: 10,
    right: 11,
    width: 7,
    height: 7,
    borderRadius: "50%",
    background: "#E07A5F",
    border: "2px solid var(--panel)",
  },
  profile: {
    display: "flex",
    alignItems: "center",
    gap: 10,
    background: "var(--panel)",
    border: "1px solid var(--line)",
    padding: "5px 12px 5px 5px",
    borderRadius: 24,
    cursor: "pointer",
  },
  avatar: {
    width: 34,
    height: 34,
    borderRadius: "50%",
    background: "linear-gradient(135deg, #C9A97E 0%, #8A6A4A 100%)",
    display: "grid",
    placeItems: "center",
    color: "white",
    fontWeight: 600,
    fontSize: 13,
    flexShrink: 0,
    overflow: "hidden",
    position: "relative",
  },
  name: {
    fontSize: 13,
    fontWeight: 600,
    color: "var(--ink)",
    lineHeight: 1.2,
    whiteSpace: "nowrap",
  },
  plan: {
    fontSize: 11.5,
    color: "var(--muted)",
    lineHeight: 1.2,
    marginTop: 1,
    whiteSpace: "nowrap",
  },
};

function Avatar() {
  return (
    <div style={styles.avatar}>
      <svg width="34" height="34" viewBox="0 0 34 34" aria-hidden>
        <defs>
          <linearGradient id="flowbase-avatar" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#D7B68E" />
            <stop offset="1" stopColor="#7C5A40" />
          </linearGradient>
        </defs>
        <rect width="34" height="34" fill="url(#flowbase-avatar)" />
        <circle cx="17" cy="13.5" r="5.2" fill="#F1DDBE" />
        <path
          d="M5 34 C 7 25, 12 22, 17 22 C 22 22, 27 25, 29 34 Z"
          fill="#2D2318"
          opacity="0.85"
        />
      </svg>
    </div>
  );
}

export function Header() {
  return (
    <header style={styles.wrap}>
      <div style={styles.crumb}>
        <span style={styles.crumbDim}>Booking Forms</span>
        <IcoChevronR size={14} style={{ color: "var(--muted-2)" }} />
        <span style={styles.crumbActive}>Create Form</span>
      </div>
      <div style={styles.searchWrap}>
        <div style={styles.search}>
          <IcoSearch size={16} />
          <input style={styles.searchInput} placeholder="Search here..." />
        </div>
      </div>
      <div style={styles.right}>
        <div style={styles.balance}>
          <span>$2,325</span>
          <IcoChevron size={15} style={{ color: "var(--muted)" }} />
        </div>
        <div style={styles.bell}>
          <IcoBell size={18} />
          <span style={styles.bellDot} />
        </div>
        <div style={styles.profile}>
          <Avatar />
          <div>
            <div style={styles.name}>Ilias Miah</div>
            <div style={styles.plan}>Pro Plan</div>
          </div>
          <IcoChevron
            size={15}
            style={{ color: "var(--muted)", marginLeft: 4 }}
          />
        </div>
      </div>
    </header>
  );
}
