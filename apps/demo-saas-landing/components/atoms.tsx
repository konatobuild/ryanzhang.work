import type { CSSProperties, ReactNode } from "react";

export const FONT_DISPLAY =
  "var(--font-space-grotesk), ui-sans-serif, system-ui, sans-serif";
export const FONT_MONO =
  "var(--font-jetbrains-mono), ui-monospace, SFMono-Regular, monospace";
export const HAIRLINE = "rgba(255,255,255,0.16)";
export const ACCENT = "#4AC9E4";

export function Hairline({
  vertical = false,
  style = {},
}: {
  vertical?: boolean;
  style?: CSSProperties;
}) {
  return (
    <div
      style={{
        background: HAIRLINE,
        ...(vertical
          ? { width: 1, height: "100%" }
          : { height: 1, width: "100%" }),
        ...style,
      }}
    />
  );
}

type PillVariant = "ghost" | "primary" | "subtle";

const VARIANT_STYLES: Record<PillVariant, CSSProperties> = {
  ghost: {
    padding: "11px 22px",
    background: "rgba(8, 8, 8, 0.35)",
    backdropFilter: "blur(10px) saturate(1.2)",
    WebkitBackdropFilter: "blur(10px) saturate(1.2)",
    color: "#fff",
    border: "1px solid rgba(255,255,255,0.28)",
    fontSize: 12,
    fontWeight: 500,
  },
  primary: {
    padding: "15px 30px",
    background: "#fff",
    color: "#000",
    border: "1px solid #fff",
    fontSize: 13,
    fontWeight: 600,
  },
  subtle: {
    padding: "11px 22px",
    background: "rgba(8, 8, 8, 0.35)",
    backdropFilter: "blur(10px) saturate(1.2)",
    WebkitBackdropFilter: "blur(10px) saturate(1.2)",
    color: "rgba(255,255,255,0.6)",
    border: "1px solid rgba(255,255,255,0.12)",
    fontSize: 12,
    fontWeight: 500,
  },
};

export function PillButton({
  children,
  symbol,
  onClick,
  variant = "ghost",
  style = {},
}: {
  children: ReactNode;
  symbol?: string;
  onClick?: () => void;
  variant?: PillVariant;
  style?: CSSProperties;
}) {
  const vs = VARIANT_STYLES[variant];
  return (
    <button
      onClick={onClick}
      className={`pill-btn pill-btn-${variant}`}
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 10,
        borderRadius: 999,
        fontFamily: FONT_DISPLAY,
        letterSpacing: "0.14em",
        textTransform: "uppercase",
        cursor: "pointer",
        ...vs,
        ...style,
      }}
    >
      {children}
      {symbol && (
        <span
          style={{
            fontFamily: FONT_MONO,
            fontSize: variant === "primary" ? 14 : 13,
            opacity: variant === "primary" ? 1 : 0.9,
          }}
        >
          {symbol}
        </span>
      )}
    </button>
  );
}

export function MonoLabel({
  children,
  style = {},
}: {
  children: ReactNode;
  style?: CSSProperties;
}) {
  return (
    <div
      style={{
        fontFamily: FONT_MONO,
        fontSize: 11,
        letterSpacing: "0.24em",
        textTransform: "uppercase",
        color: "rgba(255,255,255,0.55)",
        ...style,
      }}
    >
      {children}
    </div>
  );
}
