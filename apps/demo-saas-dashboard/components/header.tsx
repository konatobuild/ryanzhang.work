"use client";

import { Icon } from "./icons";

export function Header() {
  return (
    <header
      style={{
        display: "flex",
        alignItems: "center",
        gap: 16,
        padding: "0 32px",
        height: 56,
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
          maxWidth: 360,
          color: "var(--muted)",
        }}
      >
        <Icon name="search" size={14} />
        <input
          placeholder="Search providers, shifts, credentials…"
          style={{
            flex: 1,
            background: "transparent",
            border: "none",
            fontSize: 13,
            color: "var(--ink)",
          }}
        />
        <span
          className="mono"
          style={{
            fontSize: 10,
            padding: "1px 5px",
            border: "1px solid var(--line)",
            borderRadius: 4,
            letterSpacing: ".04em",
          }}
        >
          ⌘K
        </span>
      </div>

      <div
        style={{
          marginLeft: "auto",
          display: "flex",
          alignItems: "center",
          gap: 16,
        }}
      >
        <span
          className="mono"
          style={{
            fontSize: 11,
            color: "var(--muted)",
            letterSpacing: ".06em",
          }}
        >
          SAT · APR 25 · 14:32 ET
        </span>
        <button
          type="button"
          style={{
            width: 32,
            height: 32,
            borderRadius: 99,
            background: "var(--chip)",
            color: "var(--ink)",
            fontWeight: 600,
            fontSize: 11.5,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: 0,
            letterSpacing: "-.02em",
          }}
        >
          EM
        </button>
      </div>
    </header>
  );
}
