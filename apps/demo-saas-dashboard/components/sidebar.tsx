"use client";

import { useState, type CSSProperties } from "react";
import { IcoLogout, IcoSettings, type IconCmp } from "./icons";
import { NAV_ITEMS, type NavId } from "../lib/data";

const styles: Record<string, CSSProperties> = {
  wrap: {
    width: 230,
    background: "var(--sidebar)",
    borderRight: "1px solid var(--line)",
    display: "flex",
    flexDirection: "column",
    padding: "22px 16px 20px",
    flexShrink: 0,
    minHeight: "100vh",
  },
  brand: {
    display: "flex",
    alignItems: "center",
    gap: 10,
    padding: "2px 6px 22px",
    marginBottom: 10,
  },
  brandName: {
    fontSize: 16.5,
    fontWeight: 700,
    color: "var(--ink)",
    letterSpacing: "-0.02em",
  },
  brandBadge: {
    fontSize: 11,
    color: "var(--muted)",
    fontWeight: 500,
    marginLeft: 2,
  },
  nav: { display: "flex", flexDirection: "column", gap: 2, flex: 1 },
  item: {
    display: "flex",
    alignItems: "center",
    gap: 11,
    padding: "9px 12px",
    borderRadius: 9,
    color: "var(--ink-2)",
    fontSize: 13.5,
    fontWeight: 500,
    cursor: "pointer",
    transition: "background .15s",
    whiteSpace: "nowrap",
  },
  itemActive: {
    background: "var(--accent-soft)",
    color: "var(--accent)",
    fontWeight: 600,
  },
  footer: {
    display: "flex",
    flexDirection: "column",
    gap: 2,
    paddingTop: 14,
    borderTop: "1px solid var(--line-2)",
  },
};

function BrandMark() {
  return (
    <svg width="28" height="28" viewBox="0 0 40 40" fill="none" aria-hidden>
      <circle cx="20" cy="20" r="19" stroke="#2F5D50" strokeWidth="1.6" />
      <path
        d="M9 25 C14 15, 22 10, 33 10"
        stroke="#2F5D50"
        strokeWidth="2.4"
        strokeLinecap="round"
        fill="none"
      />
      <path
        d="M9 25 C15 20, 24 17, 33 18"
        stroke="#C9B268"
        strokeWidth="2.4"
        strokeLinecap="round"
        fill="none"
      />
    </svg>
  );
}

function NavItem({
  icon: Icon,
  label,
  active,
  onClick,
}: {
  icon: IconCmp;
  label: string;
  active?: boolean;
  onClick?: () => void;
}) {
  const [hover, setHover] = useState(false);
  const s: CSSProperties = {
    ...styles.item,
    ...(active ? styles.itemActive : {}),
    ...(hover && !active ? { background: "var(--chip)" } : {}),
  };
  return (
    <div
      style={s}
      onClick={onClick}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
    >
      <Icon size={17} strokeWidth={active ? 1.9 : 1.6} />
      <span>{label}</span>
    </div>
  );
}

export function Sidebar({
  active,
  onChange,
}: {
  active: NavId;
  onChange: (id: NavId) => void;
}) {
  return (
    <aside style={styles.wrap}>
      <div style={styles.brand}>
        <BrandMark />
        <div style={styles.brandName}>FlowBase</div>
        <div style={styles.brandBadge}>Pro.22</div>
      </div>
      <nav style={styles.nav}>
        {NAV_ITEMS.map((i) => (
          <NavItem
            key={i.id}
            icon={i.icon}
            label={i.label}
            active={active === i.id}
            onClick={() => onChange(i.id)}
          />
        ))}
      </nav>
      <div style={styles.footer}>
        <NavItem icon={IcoSettings} label="Settings" />
        <NavItem icon={IcoLogout} label="Logout" />
      </div>
    </aside>
  );
}
