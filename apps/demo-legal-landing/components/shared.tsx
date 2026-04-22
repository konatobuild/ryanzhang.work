import type { CSSProperties } from "react";

export const Logo = ({ light = false }: { light?: boolean }) => {
  const c = light ? "rgba(244,241,234,.9)" : "var(--ink)";
  const sub = light ? "rgba(244,241,234,.5)" : "var(--muted)";
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
      <svg
        width="28"
        height="34"
        viewBox="0 0 28 34"
        fill="none"
        aria-label="Meridian & Cole"
      >
        <rect x="2" y="2" width="24" height="2" fill={c} />
        <rect x="4" y="30" width="20" height="2" fill={c} />
        <rect x="6" y="28" width="16" height="1" fill={c} />
        <rect x="6" y="4" width="1" height="24" fill={c} />
        <rect x="10" y="4" width="1" height="24" fill={c} />
        <rect x="14" y="4" width="1" height="24" fill={c} />
        <rect x="18" y="4" width="1" height="24" fill={c} />
        <rect x="22" y="4" width="1" height="24" fill={c} />
      </svg>
      <div style={{ lineHeight: 1.1 }}>
        <div
          className="display"
          style={{ fontSize: 19, color: c, letterSpacing: ".005em" }}
        >
          Meridian <span style={{ fontStyle: "italic" }}>&amp;</span> Cole
        </div>
        <div
          style={{
            fontSize: 9,
            letterSpacing: ".3em",
            textTransform: "uppercase",
            color: sub,
            marginTop: 3,
          }}
        >
          Attorneys · Est. 2012
        </div>
      </div>
    </div>
  );
};

type IconProps = { size?: number; style?: CSSProperties };

export const ArrowUR = ({ size = 12, style }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 14 14" fill="none" style={style}>
    <path
      d="M3 11 L11 3 M5 3 H11 V9"
      stroke="currentColor"
      strokeWidth="1.4"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export const Plus = ({ size = 14, style }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 14 14" fill="none" style={style}>
    <path
      d="M7 2 V12 M2 7 H12"
      stroke="currentColor"
      strokeWidth="1.2"
      strokeLinecap="round"
    />
  </svg>
);

export const Minus = ({ size = 14, style }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 14 14" fill="none" style={style}>
    <path
      d="M2 7 H12"
      stroke="currentColor"
      strokeWidth="1.2"
      strokeLinecap="round"
    />
  </svg>
);
