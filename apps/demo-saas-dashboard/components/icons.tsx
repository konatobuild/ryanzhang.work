import type { ComponentType, CSSProperties, ReactNode, SVGProps } from "react";

export type IconProps = {
  size?: number;
  strokeWidth?: number;
  style?: CSSProperties;
} & Omit<SVGProps<SVGSVGElement>, "stroke">;

export type IconCmp = ComponentType<IconProps>;

function mkIcon(path: ReactNode) {
  return function IconCmp({
    size = 18,
    strokeWidth = 1.6,
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
        strokeWidth={strokeWidth}
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

/* Sidebar navigation */
export const IcoDashboard = mkIcon(
  <>
    <rect x="3" y="3" width="7" height="9" rx="1.2" />
    <rect x="14" y="3" width="7" height="5" rx="1.2" />
    <rect x="14" y="12" width="7" height="9" rx="1.2" />
    <rect x="3" y="16" width="7" height="5" rx="1.2" />
  </>,
);

export const IcoBookings = mkIcon(
  <>
    <rect x="3" y="4.5" width="18" height="16" rx="2" />
    <path d="M3 9h18" />
    <path d="M8 3v3M16 3v3" />
    <circle cx="8.5" cy="13.5" r="0.8" fill="currentColor" />
    <circle cx="12" cy="13.5" r="0.8" fill="currentColor" />
    <circle cx="15.5" cy="13.5" r="0.8" fill="currentColor" />
  </>,
);

export const IcoUser = mkIcon(
  <>
    <circle cx="12" cy="8" r="3.5" />
    <path d="M5 20c0-3.5 3-6 7-6s7 2.5 7 6" />
  </>,
);

export const IcoUsers = mkIcon(
  <>
    <circle cx="9" cy="8" r="3" />
    <circle cx="17" cy="10" r="2.3" />
    <path d="M3 19c0-3 2.7-5 6-5s6 2 6 5" />
    <path d="M15.5 19c.2-2.2 2-3.3 4-3.3s3.5 1 3.5 3.3" />
  </>,
);

export const IcoStuff = mkIcon(
  <>
    <circle cx="12" cy="8" r="3.2" />
    <path d="M6 20c0-3 2.5-5 6-5s6 2 6 5" />
  </>,
);

export const IcoPayouts = mkIcon(
  <>
    <rect x="3" y="6" width="18" height="13" rx="2" />
    <path d="M3 10h18" />
    <path d="M7 15h3" />
  </>,
);

export const IcoForm = mkIcon(
  <>
    <rect x="4" y="3" width="16" height="18" rx="2" />
    <path d="M8 8h8M8 12h8M8 16h5" />
  </>,
);

export const IcoMarketing = mkIcon(
  <>
    <path d="M3 10v4a1 1 0 0 0 1 1h3l5 4V5L7 9H4a1 1 0 0 0-1 1Z" />
    <path d="M16 9a4 4 0 0 1 0 6" />
  </>,
);

export const IcoLocation = mkIcon(
  <>
    <path d="M12 21s-7-6.3-7-12a7 7 0 1 1 14 0c0 5.7-7 12-7 12Z" />
    <circle cx="12" cy="9" r="2.5" />
  </>,
);

export const IcoPackage = mkIcon(
  <>
    <path d="M3 7.5 12 3l9 4.5v9L12 21l-9-4.5v-9Z" />
    <path d="M3 7.5 12 12l9-4.5" />
    <path d="M12 12v9" />
  </>,
);

export const IcoJoin = mkIcon(
  <>
    <path d="M15 4h3a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2h-3" />
    <path d="M10 17l-5-5 5-5" />
    <path d="M5 12h10" />
  </>,
);

export const IcoSettings = mkIcon(
  <>
    <circle cx="12" cy="12" r="2.7" />
    <path d="M19.4 14.6a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V20a2 2 0 1 1-4 0v-.09A1.65 1.65 0 0 0 9 18.4a1.65 1.65 0 0 0-1.82.33l-.06.06A2 2 0 1 1 4.29 15.96l.06-.06A1.65 1.65 0 0 0 4.68 14.09 1.65 1.65 0 0 0 3.17 13.1H3a2 2 0 1 1 0-4h.09A1.65 1.65 0 0 0 4.6 8.1a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V2a2 2 0 1 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9c.39.25.69.62.87 1.05" />
  </>,
);

export const IcoLogout = mkIcon(
  <>
    <path d="M9 4H5a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h4" />
    <path d="M16 17l5-5-5-5" />
    <path d="M21 12H10" />
  </>,
);

/* Header */
export const IcoSearch = mkIcon(
  <>
    <circle cx="11" cy="11" r="7" />
    <path d="m20 20-3.2-3.2" />
  </>,
);

export const IcoChevron = mkIcon(<path d="m6 9 6 6 6-6" />);
export const IcoChevronR = mkIcon(<path d="m9 6 6 6-6 6" />);

export const IcoBell = mkIcon(
  <>
    <path d="M6 8a6 6 0 1 1 12 0c0 4 2 6 2 6H4s2-2 2-6Z" />
    <path d="M10 19a2 2 0 0 0 4 0" />
  </>,
);

/* Template tile icons */
export const IcoFile = mkIcon(
  <>
    <path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8z" />
    <path d="M14 3v5h5" />
  </>,
);

export const IcoFlash = mkIcon(
  <path d="M13 2 4 14h7l-1 8 9-12h-7z" />,
);

export const IcoGrid = mkIcon(
  <>
    <rect x="3" y="3" width="7" height="7" rx="1" />
    <rect x="14" y="3" width="7" height="7" rx="1" />
    <rect x="3" y="14" width="7" height="7" rx="1" />
    <rect x="14" y="14" width="7" height="7" rx="1" />
  </>,
);

export const IcoBriefcase = mkIcon(
  <>
    <rect x="3" y="7" width="18" height="13" rx="2" />
    <path d="M9 7V5a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2" />
    <path d="M3 12h18" />
  </>,
);

/* Field tile icons */
export const IcoText = mkIcon(
  <>
    <path d="M4 7V5h16v2" />
    <path d="M12 5v14" />
    <path d="M9 19h6" />
  </>,
);

export const IcoParagraph = mkIcon(
  <path d="M4 6h16M4 12h16M4 18h10" />,
);

export const IcoMail = mkIcon(
  <>
    <rect x="3" y="5" width="18" height="14" rx="2" />
    <path d="m3 7 9 6 9-6" />
  </>,
);

export const IcoPhone = mkIcon(
  <path d="M4 5c0-1 1-2 2-2h2l2 4-2 1.5a12 12 0 0 0 5.5 5.5L15 12l4 2v2c0 1-1 2-2 2A14 14 0 0 1 4 5Z" />,
);

export const IcoCheck = mkIcon(<path d="m5 12 5 5L20 7" />);

export const IcoCheckCircle = mkIcon(
  <>
    <circle cx="12" cy="12" r="9" />
    <path d="m8 12 3 3 5-6" />
  </>,
);

export const IcoHash = mkIcon(
  <path d="M4 9h16M4 15h16M10 3 8 21M16 3l-2 18" />,
);

export const IcoInfo = mkIcon(
  <>
    <circle cx="12" cy="12" r="9" />
    <path d="M12 11v5" />
    <circle cx="12" cy="8" r="0.6" fill="currentColor" />
  </>,
);
