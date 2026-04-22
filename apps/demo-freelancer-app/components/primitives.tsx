import type { CSSProperties, ReactNode } from "react";
import type { AvatarData } from "./data";
import {
  IconArrowRight,
  IconChat,
  IconHome,
  IconSearch,
  IconStar,
  IconUser,
} from "./icons";

type AvatarProps = {
  data: AvatarData;
  size?: number;
  ring?: boolean;
  rounded?: "full" | "xl" | "md";
};

export const Avatar = ({ data, size = 40, ring = false, rounded = "full" }: AvatarProps) => {
  const borderRadius = rounded === "full" ? "50%" : rounded === "xl" ? 18 : 12;
  return (
    <div
      style={{
        width: size,
        height: size,
        borderRadius,
        background: data.bg,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        color: "#0f0f10",
        fontWeight: 700,
        fontSize: size * 0.42,
        fontFamily: "var(--font-display)",
        boxShadow: ring ? "0 0 0 2px var(--bg-0), 0 0 0 4px var(--accent)" : "none",
        flexShrink: 0,
        position: "relative",
        letterSpacing: -0.5,
      }}
    >
      {data.initial}
    </div>
  );
};

type ChipProps = {
  children: ReactNode;
  icon?: ReactNode;
  active?: boolean;
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
  tone?: "default" | "dark" | "ghost" | "white";
  size?: "sm" | "md" | "lg";
  onDark?: boolean;
};

export const Chip = ({
  children,
  icon,
  active = false,
  onClick,
  tone = "default",
  size = "md",
  onDark = false,
}: ChipProps) => {
  const heights = { sm: 28, md: 34, lg: 40 } as const;
  const paddings = { sm: "0 10px", md: "0 14px", lg: "0 18px" } as const;
  const fontSizes = { sm: 12, md: 13, lg: 14 } as const;

  let bg: string;
  let fg: string;
  let border: string;
  if (active) {
    bg = "var(--accent)";
    fg = "#0f0f10";
    border = "1px solid var(--accent)";
  } else if (onDark) {
    bg = "rgba(255,255,255,0.08)";
    fg = "var(--on-dark-1)";
    border = "1px solid rgba(255,255,255,0.1)";
    if (tone === "dark") {
      bg = "#0f0f10";
      fg = "var(--on-dark-1)";
      border = "none";
    }
  } else {
    bg = "rgba(15,15,16,0.05)";
    fg = "var(--text-1)";
    border = "1px solid rgba(15,15,16,0.08)";
    if (tone === "dark") {
      bg = "#0f0f10";
      fg = "var(--on-dark-1)";
      border = "none";
    } else if (tone === "ghost") {
      bg = "transparent";
      fg = "var(--text-2)";
      border = "1px solid rgba(15,15,16,0.12)";
    } else if (tone === "white") {
      bg = "#fff";
      fg = "#0f0f10";
      border = "1px solid rgba(15,15,16,0.06)";
    }
  }

  return (
    <button
      onClick={onClick}
      style={{
        height: heights[size],
        padding: paddings[size],
        borderRadius: heights[size] / 2,
        background: bg,
        color: fg,
        border,
        fontSize: fontSizes[size],
        fontWeight: 500,
        fontFamily: "var(--font-body)",
        display: "inline-flex",
        alignItems: "center",
        gap: 6,
        cursor: "pointer",
        whiteSpace: "nowrap",
        letterSpacing: -0.1,
      }}
    >
      {icon}
      {children}
    </button>
  );
};

type RoundBtnProps = {
  children: ReactNode;
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
  size?: number;
  tone?: "default" | "accent" | "dark" | "light";
  badge?: number;
  onDark?: boolean;
};

export const RoundBtn = ({
  children,
  onClick,
  size = 42,
  tone = "default",
  badge = 0,
  onDark = false,
}: RoundBtnProps) => {
  let bg: string;
  let fg: string;
  if (tone === "accent") {
    bg = "var(--accent)";
    fg = "#0f0f10";
  } else if (tone === "dark") {
    bg = "#0f0f10";
    fg = "var(--on-dark-1)";
  } else if (tone === "light") {
    bg = "#fff";
    fg = "#0f0f10";
  } else if (onDark) {
    bg = "rgba(255,255,255,0.12)";
    fg = "var(--on-dark-1)";
  } else {
    bg = "#fff";
    fg = "var(--text-1)";
  }

  return (
    <button
      onClick={onClick}
      style={{
        width: size,
        height: size,
        borderRadius: "50%",
        background: bg,
        color: fg,
        border:
          onDark || tone === "dark" || tone === "accent"
            ? "none"
            : "1px solid rgba(15,15,16,0.06)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        cursor: "pointer",
        flexShrink: 0,
        position: "relative",
        boxShadow:
          !onDark && tone !== "dark" && tone !== "accent"
            ? "0 1px 2px rgba(15,15,16,0.04)"
            : "none",
      }}
    >
      {children}
      {badge > 0 && (
        <div
          style={{
            position: "absolute",
            top: -2,
            right: -2,
            width: 18,
            height: 18,
            borderRadius: 9,
            background: "var(--accent)",
            color: "#0f0f10",
            fontSize: 10,
            fontWeight: 700,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            border: "2px solid var(--bg-0)",
            fontFamily: "var(--font-display)",
          }}
        >
          {badge}
        </div>
      )}
    </button>
  );
};

type RatingPillProps = { value: number; tone?: "dark" | "light" };

export const RatingPill = ({ value, tone = "dark" }: RatingPillProps) => {
  const bg = tone === "dark" ? "rgba(0,0,0,0.88)" : "rgba(255,255,255,0.95)";
  const fg = tone === "dark" ? "#fff" : "#0f0f10";
  return (
    <div
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 4,
        height: 26,
        padding: "0 8px",
        borderRadius: 13,
        background: bg,
        color: fg,
        fontSize: 12,
        fontWeight: 600,
        fontFamily: "var(--font-display)",
      }}
    >
      <IconStar size={11} color="var(--accent)" />
      {value}
    </div>
  );
};

export type NavTab = "home" | "search" | "messages" | "profile";

type BottomNavProps = {
  current: NavTab;
  onGo: (tab: NavTab) => void;
  unread?: number;
};

export const BottomNav = ({ current, onGo, unread = 0 }: BottomNavProps) => {
  const items: { id: NavTab; Icon: (p: { size?: number }) => React.ReactElement; label: string; badge?: number }[] = [
    { id: "home", Icon: IconHome, label: "Home" },
    { id: "search", Icon: IconSearch, label: "Search" },
    { id: "messages", Icon: IconChat, label: "Messages", badge: unread },
    { id: "profile", Icon: IconUser, label: "Profile" },
  ];
  return (
    <div
      style={{
        position: "absolute",
        bottom: 0,
        left: 0,
        right: 0,
        padding: "12px 14px 30px",
        background:
          "linear-gradient(180deg, rgba(255,255,255,0) 0%, var(--bg-0) 40%)",
        zIndex: 30,
      }}
    >
      <div
        style={{
          background: "#0f0f10",
          borderRadius: 36,
          padding: 8,
          display: "flex",
          alignItems: "center",
          gap: 4,
          boxShadow: "0 8px 30px rgba(15,15,16,0.18)",
        }}
      >
        {items.map((it) => {
          const active = it.id === current;
          if (it.id === "profile") {
            return (
              <button
                key={it.id}
                onClick={() => onGo(it.id)}
                style={{
                  flex: active ? undefined : 1,
                  height: 48,
                  padding: active ? "0 18px 0 6px" : 0,
                  borderRadius: 24,
                  background: active ? "#fff" : "transparent",
                  color: active ? "#0f0f10" : "rgba(245,242,234,0.6)",
                  border: "none",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                  justifyContent: "center",
                  fontSize: 13,
                  fontWeight: 600,
                  fontFamily: "var(--font-body)",
                  letterSpacing: -0.1,
                }}
              >
                {active ? (
                  <>
                    <div
                      style={{
                        width: 34,
                        height: 34,
                        borderRadius: "50%",
                        background: "#e8d5b7",
                        color: "#0f0f10",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontWeight: 700,
                        fontSize: 14,
                      }}
                    >
                      A
                    </div>
                    Profile
                  </>
                ) : (
                  <it.Icon size={22} />
                )}
              </button>
            );
          }
          return (
            <button
              key={it.id}
              onClick={() => onGo(it.id)}
              style={{
                flex: 1,
                height: 48,
                borderRadius: 24,
                background: active ? "var(--accent)" : "transparent",
                color: active ? "#0f0f10" : "rgba(245,242,234,0.6)",
                border: "none",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 6,
                position: "relative",
                fontSize: 13,
                fontWeight: 600,
                fontFamily: "var(--font-body)",
                letterSpacing: -0.1,
              }}
            >
              <it.Icon size={22} />
              {active && <span>{it.label}</span>}
              {it.badge !== undefined && it.badge > 0 && !active && (
                <div
                  style={{
                    position: "absolute",
                    top: 8,
                    right: 10,
                    width: 8,
                    height: 8,
                    borderRadius: 4,
                    background: "var(--accent)",
                  }}
                />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};

type PlaceholderProps = {
  label: string;
  height?: number;
  tone?: "light" | "dark";
  style?: CSSProperties;
};

export const Placeholder = ({
  label,
  height = 120,
  tone = "light",
  style,
}: PlaceholderProps) => {
  const stripeA = tone === "dark" ? "rgba(255,255,255,0.06)" : "rgba(15,15,16,0.05)";
  const stripeB = tone === "dark" ? "rgba(255,255,255,0.02)" : "rgba(15,15,16,0.02)";
  const fg = tone === "dark" ? "rgba(255,255,255,0.35)" : "rgba(15,15,16,0.4)";
  return (
    <div
      style={{
        height,
        borderRadius: 18,
        overflow: "hidden",
        background: `repeating-linear-gradient(135deg, ${stripeA} 0 8px, ${stripeB} 8px 16px)`,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontFamily: "var(--font-mono)",
        fontSize: 10,
        color: fg,
        textTransform: "uppercase",
        letterSpacing: 1,
        ...style,
      }}
    >
      {label}
    </div>
  );
};

type SectionHeadProps = {
  title: string;
  actionLabel?: string;
  onAction?: () => void;
};

export const SectionHead = ({ title, actionLabel, onAction }: SectionHeadProps) => (
  <div
    style={{
      display: "flex",
      alignItems: "baseline",
      justifyContent: "space-between",
      padding: "0 20px",
      marginBottom: 14,
    }}
  >
    <div
      style={{
        fontFamily: "var(--font-display)",
        fontSize: 22,
        fontWeight: 700,
        color: "var(--text-1)",
        letterSpacing: -0.5,
      }}
    >
      {title}
    </div>
    {actionLabel && (
      <button
        onClick={onAction}
        style={{
          background: "transparent",
          border: "none",
          color: "var(--text-2)",
          fontSize: 13,
          fontFamily: "var(--font-body)",
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          gap: 4,
        }}
      >
        {actionLabel} <IconArrowRight size={14} />
      </button>
    )}
  </div>
);
