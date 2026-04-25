"use client";

import type { CSSProperties, ReactNode } from "react";

type BtnVariant = "primary" | "ghost" | "link";

const baseStyle: CSSProperties = {
  display: "inline-flex",
  alignItems: "center",
  gap: 10,
  border: "1px solid transparent",
  borderRadius: 999,
  padding: "11px 18px",
  fontSize: 14,
  fontWeight: 600,
  cursor: "pointer",
  transition: "all .18s ease",
  whiteSpace: "nowrap",
  fontFamily: "inherit",
};

const variantStyles: Record<BtnVariant, CSSProperties> = {
  primary: { background: "var(--ink)", color: "white" },
  ghost: {
    background: "white",
    color: "var(--ink)",
    borderColor: "var(--line)",
  },
  link: {
    background: "transparent",
    color: "var(--ink)",
    padding: "11px 6px",
  },
};

export function Btn({
  children,
  variant = "primary",
  icon,
  style,
}: {
  children: ReactNode;
  variant?: BtnVariant;
  icon?: ReactNode;
  style?: CSSProperties;
}) {
  return (
    <button
      type="button"
      style={{ ...baseStyle, ...variantStyles[variant], ...style }}
      onMouseEnter={(e) => {
        if (variant === "primary") e.currentTarget.style.background = "#000";
        if (variant === "ghost") e.currentTarget.style.background = "#FBFBF6";
      }}
      onMouseLeave={(e) => {
        if (variant === "primary")
          e.currentTarget.style.background = "var(--ink)";
        if (variant === "ghost") e.currentTarget.style.background = "white";
      }}
    >
      {icon && <span style={{ display: "inline-flex" }}>{icon}</span>}
      {children}
    </button>
  );
}

export function Logo({ inverted = false }: { inverted?: boolean }) {
  return (
    <div style={{ display: "inline-flex", alignItems: "center", gap: 9 }}>
      <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
        <rect
          x="0.5"
          y="0.5"
          width="21"
          height="21"
          rx="6"
          fill={inverted ? "white" : "var(--ink)"}
        />
        <path
          d="M6.5 14.5L11 7.2L15.5 14.5"
          stroke={inverted ? "var(--ink)" : "white"}
          strokeWidth="1.7"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <circle
          cx="11"
          cy="15.4"
          r="1"
          fill={inverted ? "var(--ink)" : "white"}
        />
      </svg>
      <span
        style={{
          fontWeight: 600,
          fontSize: 16,
          letterSpacing: "-0.01em",
          color: inverted ? "white" : "var(--ink)",
        }}
      >
        Northwind
      </span>
    </div>
  );
}

export function Caret() {
  return (
    <svg
      width="10"
      height="10"
      viewBox="0 0 10 10"
      fill="none"
      style={{ marginLeft: 2, opacity: 0.6 }}
    >
      <path
        d="M2 3.5L5 6.5L8 3.5"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function PlayIcon() {
  return (
    <span
      style={{
        width: 20,
        height: 20,
        borderRadius: 999,
        background: "var(--accent-soft)",
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <svg width="8" height="8" viewBox="0 0 8 8" fill="none">
        <path d="M2 1.2L6.5 4L2 6.8V1.2Z" fill="var(--accent)" />
      </svg>
    </span>
  );
}
