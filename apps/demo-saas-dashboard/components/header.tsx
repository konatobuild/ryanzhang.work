"use client";

import type { CSSProperties } from "react";
import { Icon } from "./icons";

const NAV_TABS = ["Overview", "Activity", "Reports", "Audit log"] as const;

const iconBtn: CSSProperties = {
  position: "relative",
  width: 34,
  height: 34,
  borderRadius: 8,
  color: "var(--ink-2)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
};

export function Header() {
  return (
    <header
      style={{
        display: "flex",
        alignItems: "center",
        gap: 16,
        padding: "0 28px",
        height: 64,
        borderBottom: "1px solid var(--line)",
        background: "var(--surface)",
        position: "sticky",
        top: 0,
        zIndex: 10,
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 10,
          flex: 1,
          maxWidth: 420,
          background: "var(--surface-2)",
          border: "1px solid var(--line)",
          borderRadius: 10,
          padding: "8px 12px",
        }}
      >
        <Icon name="search" size={15} style={{ color: "var(--muted)" }} />
        <input
          placeholder="Search anything across the workspace…"
          style={{
            flex: 1,
            background: "transparent",
            border: "none",
            fontSize: 13.5,
            color: "var(--ink)",
          }}
        />
        <span
          className="mono"
          style={{
            fontSize: 10.5,
            padding: "2px 6px",
            background: "var(--chip)",
            color: "var(--muted)",
            borderRadius: 4,
            letterSpacing: ".04em",
          }}
        >
          ⌘K
        </span>
      </div>

      <nav style={{ display: "flex", gap: 4, marginLeft: "auto" }}>
        {NAV_TABS.map((label, i) => (
          <button
            key={label}
            type="button"
            style={{
              padding: "7px 12px",
              background: i === 0 ? "var(--chip)" : "transparent",
              borderRadius: 8,
              fontSize: 13,
              color: i === 0 ? "var(--ink)" : "var(--muted)",
              fontWeight: i === 0 ? 500 : 450,
            }}
          >
            {label}
          </button>
        ))}
      </nav>

      <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
        <button type="button" title="Notifications" style={iconBtn}>
          <Icon name="bell" size={16} />
          <span
            style={{
              position: "absolute",
              top: 6,
              right: 6,
              width: 6,
              height: 6,
              borderRadius: 99,
              background: "var(--accent)",
            }}
          />
        </button>
        <button type="button" title="Help" style={iconBtn}>
          <Icon name="help" size={16} />
        </button>
        <button type="button" title="Settings" style={iconBtn}>
          <Icon name="gear" size={16} />
        </button>

        <div
          style={{
            width: 1,
            height: 24,
            background: "var(--line)",
            margin: "0 8px",
          }}
        />

        <button
          type="button"
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            padding: "7px 12px 7px 10px",
            background: "var(--ink)",
            color: "var(--surface)",
            borderRadius: 999,
            fontSize: 12.5,
            fontWeight: 500,
          }}
        >
          <Icon name="bolt" size={13} />
          Upgrade plan
        </button>

        <button
          type="button"
          style={{
            marginLeft: 4,
            width: 34,
            height: 34,
            borderRadius: 99,
            border: "2px solid var(--line)",
            background:
              "linear-gradient(135deg, oklch(0.85 0.08 145), oklch(0.7 0.12 200))",
            color: "var(--ink)",
            fontWeight: 600,
            fontSize: 12,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: 0,
          }}
        >
          EM
        </button>
      </div>
    </header>
  );
}
