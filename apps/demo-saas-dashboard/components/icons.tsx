import type { CSSProperties, SVGProps } from "react";

type IconProps = {
  size?: number;
  stroke?: number;
  style?: CSSProperties;
} & Omit<SVGProps<SVGSVGElement>, "stroke">;

function mkIcon(path: React.ReactNode) {
  return function IconCmp({
    size = 18,
    stroke = 1.6,
    style,
    ...rest
  }: IconProps) {
    return (
      <svg
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth={stroke}
        strokeLinecap="round"
        strokeLinejoin="round"
        style={style}
        {...rest}
      >
        {path}
      </svg>
    );
  };
}

/* Account card — same 3-layer blue depth language as FolderGlyph,
   but reads as a customer record (top band + avatar + name lines). */
export function AccountGlyph({ size = 40 }: { size?: number }) {
  return (
    <svg width={size} height={size * 0.82} viewBox="0 0 40 33" fill="none">
      <path
        d="M3 6a3 3 0 0 1 3-3h28a3 3 0 0 1 3 3v20a3 3 0 0 1-3 3H6a3 3 0 0 1-3-3V6z"
        fill="#5A70FF"
      />
      <path
        d="M2 9a3 3 0 0 1 3-3h30a3 3 0 0 1 3 3v18a3 3 0 0 1-3 3H5a3 3 0 0 1-3-3V9z"
        fill="#2F4BFF"
      />
      <path
        d="M2 9a3 3 0 0 1 3-3h30a3 3 0 0 1 3 3v3H2V9z"
        fill="#B9C3FF"
      />
      <circle cx="9" cy="22" r="3" fill="#B9C3FF" fillOpacity="0.95" />
      <rect
        x="14"
        y="19.5"
        width="20"
        height="1.8"
        rx="0.9"
        fill="#B9C3FF"
        fillOpacity="0.6"
      />
      <rect
        x="14"
        y="23"
        width="14"
        height="1.8"
        rx="0.9"
        fill="#B9C3FF"
        fillOpacity="0.45"
      />
    </svg>
  );
}

/* Isometric-ish folder in the ONE accent blue */
export function FolderGlyph({ size = 40 }: { size?: number }) {
  return (
    <svg width={size} height={size * 0.82} viewBox="0 0 40 33" fill="none">
      <path
        d="M2 6a3 3 0 0 1 3-3h8l3 3h19a3 3 0 0 1 3 3v18a3 3 0 0 1-3 3H5a3 3 0 0 1-3-3V6z"
        fill="#5A70FF"
      />
      <path
        d="M3 11a3 3 0 0 1 3-3h28a3 3 0 0 1 3 3v16a3 3 0 0 1-3 3H6a3 3 0 0 1-3-3V11z"
        fill="#2F4BFF"
      />
      <path
        d="M3 11a3 3 0 0 1 3-3h28a3 3 0 0 1 3 3v2H3v-2z"
        fill="#B9C3FF"
      />
    </svg>
  );
}

/* Grayscale document */
export function DocGlyph({ size = 40 }: { size?: number }) {
  return (
    <svg width={size * 0.82} height={size} viewBox="0 0 33 40" fill="none">
      <path
        d="M3 4a3 3 0 0 1 3-3h14l10 10v25a3 3 0 0 1-3 3H6a3 3 0 0 1-3-3V4z"
        fill="var(--gray-100)"
        stroke="var(--gray-300)"
        strokeWidth="1.2"
      />
      <path
        d="M20 1v6a3 3 0 0 0 3 3h6"
        stroke="var(--gray-300)"
        strokeWidth="1.2"
        fill="none"
      />
      <path
        d="M9 20h14M9 25h14M9 30h9"
        stroke="var(--gray-400)"
        strokeWidth="1.2"
        strokeLinecap="round"
      />
    </svg>
  );
}

/* Link/bookmark glyph — grayscale */
export function LinkGlyph({ size = 40 }: { size?: number }) {
  return (
    <svg width={size * 0.82} height={size} viewBox="0 0 33 40" fill="none">
      <path
        d="M3 4a3 3 0 0 1 3-3h14l10 10v25a3 3 0 0 1-3 3H6a3 3 0 0 1-3-3V4z"
        fill="var(--gray-100)"
        stroke="var(--gray-300)"
        strokeWidth="1.2"
      />
      <path
        d="M20 1v6a3 3 0 0 0 3 3h6"
        stroke="var(--gray-300)"
        strokeWidth="1.2"
        fill="none"
      />
      <path
        d="M12 24c0-2 1.5-4 4-4h1M20 24c0 2-1.5 4-4 4h-1M14 24h8"
        stroke="var(--gray-500)"
        strokeWidth="1.3"
        strokeLinecap="round"
      />
    </svg>
  );
}

export const Folder = mkIcon(
  <path d="M3 6a2 2 0 0 1 2-2h4l2 2h8a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V6z" />,
);
export const Clock = mkIcon(
  <>
    <circle cx="12" cy="12" r="8.5" />
    <path d="M12 7.5V12l3 1.8" />
  </>,
);
export const Star = mkIcon(
  <path d="M12 3.5l2.6 5.4 5.9.8-4.3 4.2 1 5.9L12 17l-5.2 2.8 1-5.9L3.5 9.7l5.9-.8L12 3.5z" />,
);
export const Share = mkIcon(
  <>
    <circle cx="6" cy="12" r="2" />
    <circle cx="18" cy="6" r="2" />
    <circle cx="18" cy="18" r="2" />
    <path d="M8 11l8-4M8 13l8 4" />
  </>,
);
export const Tag = mkIcon(
  <>
    <path d="M4 4h8l8 8-8 8-8-8V4z" />
    <circle cx="8" cy="8" r="1.2" fill="currentColor" />
  </>,
);
export const Gear = mkIcon(
  <>
    <circle cx="12" cy="12" r="3" />
    <path d="M12 3v2M12 19v2M3 12h2M19 12h2M5.6 5.6l1.4 1.4M17 17l1.4 1.4M5.6 18.4L7 17M17 7l1.4-1.4" />
  </>,
);
export const Trash = mkIcon(
  <path d="M5 7h14M9 7V5a1.5 1.5 0 0 1 1.5-1.5h3A1.5 1.5 0 0 1 15 5v2M7 7l1 12a2 2 0 0 0 2 2h4a2 2 0 0 0 2-2l1-12" />,
);
export const Pie = mkIcon(
  <>
    <circle cx="12" cy="12" r="8.5" />
    <path d="M12 12l5-3M12 12V3" />
  </>,
);
export const Search = mkIcon(
  <>
    <circle cx="11" cy="11" r="6" />
    <path d="M20 20l-3.5-3.5" />
  </>,
);
export const Bell = mkIcon(
  <>
    <path d="M6 16V11a6 6 0 0 1 12 0v5l1.5 2H4.5L6 16z" />
    <path d="M10 20a2 2 0 0 0 4 0" />
  </>,
);
export const Activity = mkIcon(
  <path d="M3 12h4l3-7 4 14 3-7h4" />,
);
export const Calendar = mkIcon(
  <>
    <rect x="4" y="5" width="16" height="15" rx="2" />
    <path d="M4 10h16M9 3v4M15 3v4" />
  </>,
);
export const Users = mkIcon(
  <>
    <circle cx="9" cy="9" r="3.2" />
    <path d="M3 19c.8-3 3.4-4.8 6-4.8s5.2 1.8 6 4.8" />
    <circle cx="17" cy="10" r="2.4" />
    <path d="M15 19c.5-2 1.9-3.2 4-3.2s3 1.2 3 3.2" />
  </>,
);
export const ChevronD = mkIcon(<path d="M6 9l6 6 6-6" />);
export const ChevronR = mkIcon(<path d="M9 6l6 6-6 6" />);
export const Plus = mkIcon(<path d="M12 5v14M5 12h14" />);
export const More = mkIcon(
  <>
    <circle cx="5" cy="12" r="1.3" fill="currentColor" />
    <circle cx="12" cy="12" r="1.3" fill="currentColor" />
    <circle cx="19" cy="12" r="1.3" fill="currentColor" />
  </>,
);
export const Grid = mkIcon(
  <>
    <rect x="4" y="4" width="7" height="7" rx="1.4" />
    <rect x="13" y="4" width="7" height="7" rx="1.4" />
    <rect x="4" y="13" width="7" height="7" rx="1.4" />
    <rect x="13" y="13" width="7" height="7" rx="1.4" />
  </>,
);
export const X = mkIcon(<path d="M6 6l12 12M18 6L6 18" />);
