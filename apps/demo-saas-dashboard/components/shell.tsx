"use client";

import type { ComponentType } from "react";
import * as I from "./icons";
import { NAV, type NavItem } from "../lib/data";

type TabId = "accounts" | "health" | "renewals" | "team";

export function TopBar({
  tab,
  setTab,
}: {
  tab: TabId;
  setTab: (t: TabId) => void;
}) {
  const tabs: { id: TabId; label: string; icon: ComponentType<{ size?: number }> }[] = [
    { id: "accounts", label: "Accounts", icon: I.Folder },
    { id: "health", label: "Health", icon: I.Activity },
    { id: "renewals", label: "Renewals", icon: I.Calendar },
    { id: "team", label: "Team", icon: I.Users },
  ];
  return (
    <header
      style={{
        height: 64,
        display: "flex",
        alignItems: "center",
        gap: 20,
        padding: "0 20px",
        background: "var(--bg)",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 10, width: 212 }}>
        <div
          style={{
            width: 28,
            height: 28,
            borderRadius: 7,
            background: "var(--accent)",
            display: "grid",
            placeItems: "center",
            color: "#fff",
          }}
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.2"
            strokeLinecap="round"
          >
            <path d="M4 8l4-4 4 4M12 4v13M20 16l-4 4-4-4" />
          </svg>
        </div>
        <span
          style={{
            fontSize: 18,
            fontWeight: 700,
            letterSpacing: -0.3,
            color: "var(--ink)",
          }}
        >
          pilotdesk
        </span>
      </div>

      <nav
        style={{ display: "flex", gap: 4, flex: 1, justifyContent: "center" }}
      >
        {tabs.map((t) => {
          const active = tab === t.id;
          const Ico = t.icon;
          return (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 8,
                padding: "8px 18px",
                borderRadius: 8,
                border: 0,
                cursor: "pointer",
                background: active ? "var(--surface)" : "transparent",
                color: active ? "var(--ink)" : "var(--mute)",
                fontWeight: active ? 600 : 500,
                fontSize: 14,
                boxShadow: active
                  ? "var(--shadow-xs), 0 0 0 1px var(--line)"
                  : "none",
              }}
            >
              <Ico size={16} />
              {t.label}
            </button>
          );
        })}
      </nav>

      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            width: 260,
            padding: "0 14px",
            height: 40,
            background: "var(--surface)",
            borderRadius: 999,
            color: "var(--mute)",
            boxShadow: "var(--shadow-xs)",
          }}
        >
          <I.Search size={16} />
          <input
            placeholder="Search anything..."
            style={{
              flex: 1,
              border: 0,
              outline: 0,
              background: "transparent",
              color: "var(--ink)",
              fontFamily: "inherit",
              fontSize: 14,
              minWidth: 0,
            }}
          />
        </div>
        <button
          style={{
            width: 40,
            height: 40,
            display: "grid",
            placeItems: "center",
            borderRadius: 999,
            background: "var(--surface)",
            border: 0,
            color: "var(--ink-2)",
            cursor: "pointer",
            position: "relative",
            boxShadow: "var(--shadow-xs)",
          }}
        >
          <I.Bell size={18} />
          <span
            style={{
              position: "absolute",
              top: 9,
              right: 10,
              width: 7,
              height: 7,
              borderRadius: 999,
              background: "var(--accent)",
              border: "2px solid var(--surface)",
            }}
          />
        </button>
        <div
          style={{
            width: 40,
            height: 40,
            borderRadius: 999,
            background: "var(--accent)",
            display: "grid",
            placeItems: "center",
            color: "#fff",
            fontWeight: 600,
            fontSize: 14,
            boxShadow: "var(--shadow-xs)",
          }}
        >
          HG
        </div>
      </div>
    </header>
  );
}

const NAV_ICONS: Record<NavItem["id"], ComponentType<{ size?: number }>> = {
  all: I.Folder,
  recent: I.Clock,
  watchlist: I.Star,
  shared: I.Share,
  segments: I.Tag,
};

export function LeftRail({
  section,
  setSection,
}: {
  section: NavItem["id"];
  setSection: (s: NavItem["id"]) => void;
}) {
  return (
    <aside
      style={{
        width: 200,
        flexShrink: 0,
        padding: "4px 12px 20px 20px",
        display: "flex",
        flexDirection: "column",
        gap: 4,
        background: "var(--bg)",
      }}
    >
      <ul
        style={{
          listStyle: "none",
          padding: 0,
          margin: 0,
          display: "flex",
          flexDirection: "column",
          gap: 2,
        }}
      >
        {NAV.map((it) => {
          const active = section === it.id;
          const Ico = NAV_ICONS[it.id];
          return (
            <li key={it.id}>
              <button
                onClick={() => setSection(it.id)}
                style={{
                  width: "100%",
                  display: "flex",
                  alignItems: "center",
                  gap: 12,
                  padding: "10px 12px",
                  borderRadius: 8,
                  border: 0,
                  cursor: "pointer",
                  background: active ? "var(--surface)" : "transparent",
                  color: active ? "var(--accent)" : "var(--ink-2)",
                  fontWeight: 500,
                  fontSize: 14,
                  boxShadow: active ? "var(--shadow-xs)" : "none",
                }}
              >
                <Ico size={16} />
                <span style={{ flex: 1, textAlign: "left" }}>{it.label}</span>
                {it.caret && <I.ChevronD size={14} />}
              </button>
            </li>
          );
        })}
      </ul>

      <div style={{ flex: 1 }} />

      <ul
        style={{
          listStyle: "none",
          padding: 0,
          margin: 0,
          display: "flex",
          flexDirection: "column",
          gap: 2,
          marginBottom: 12,
        }}
      >
        {[
          { id: "settings", label: "Settings", icon: I.Gear },
          { id: "archive", label: "Archived", icon: I.Trash },
        ].map((it) => {
          const Ico = it.icon;
          return (
            <li key={it.id}>
              <button
                style={{
                  width: "100%",
                  display: "flex",
                  alignItems: "center",
                  gap: 12,
                  padding: "10px 12px",
                  borderRadius: 8,
                  border: 0,
                  cursor: "pointer",
                  background: "transparent",
                  color: "var(--ink-2)",
                  fontSize: 14,
                  fontWeight: 500,
                }}
              >
                <Ico size={16} />
                {it.label}
              </button>
            </li>
          );
        })}
      </ul>

      <div
        style={{
          padding: "14px 14px 16px",
          borderRadius: 12,
          background: "var(--surface)",
          boxShadow: "var(--shadow-xs)",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            marginBottom: 12,
          }}
        >
          <I.Pie size={16} />
          <span style={{ fontSize: 14, fontWeight: 600, color: "var(--ink)" }}>
            Seats
          </span>
          <span style={{ flex: 1 }} />
          <I.ChevronD size={14} />
        </div>
        <div
          style={{
            height: 6,
            borderRadius: 999,
            background: "var(--line)",
            overflow: "hidden",
            marginBottom: 8,
          }}
        >
          <div
            style={{
              width: "34%",
              height: "100%",
              background: "var(--accent)",
            }}
          />
        </div>
        <div
          className="tnum"
          style={{ fontSize: 12, color: "var(--mute)" }}
        >
          86 of 250 seats used
        </div>
      </div>
    </aside>
  );
}

export type { TabId };
