import type { CSSProperties, ReactNode } from "react";

type PhoneFrameProps = {
  children: ReactNode;
  bg?: string;
  width?: number;
  height?: number;
  style?: CSSProperties;
};

// Custom phone frame matching the reference mocks — no iOS chrome, no dynamic
// island. Rounded-rect with a dark bezel ring and soft elevated shadow.
export function PhoneFrame({
  children,
  bg = "#ECECEC",
  width = 390,
  height = 810,
  style,
}: PhoneFrameProps) {
  return (
    <div
      style={{
        width,
        height,
        borderRadius: 46,
        background: bg,
        position: "relative",
        overflow: "hidden",
        boxShadow:
          "0 0 0 8px #1f1f1f, 0 30px 60px rgba(0,0,0,0.45), 0 10px 24px rgba(0,0,0,0.25)",
        WebkitFontSmoothing: "antialiased",
        ...style,
      }}
    >
      {children}
    </div>
  );
}
