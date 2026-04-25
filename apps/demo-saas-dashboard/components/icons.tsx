import type { CSSProperties } from "react";
import type { IconName } from "../lib/data";

export interface IconProps {
  name: IconName;
  size?: number;
  stroke?: number;
  className?: string;
  style?: CSSProperties;
}

export function Icon({
  name,
  size = 16,
  stroke = 1.5,
  className,
  style,
}: IconProps) {
  const props = {
    width: size,
    height: size,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: stroke,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    className,
    style,
  };
  switch (name) {
    case "grid":
      return (
        <svg {...props}>
          <rect x="3" y="3" width="7" height="7" rx="1.5" />
          <rect x="14" y="3" width="7" height="7" rx="1.5" />
          <rect x="3" y="14" width="7" height="7" rx="1.5" />
          <rect x="14" y="14" width="7" height="7" rx="1.5" />
        </svg>
      );
    case "users":
      return (
        <svg {...props}>
          <circle cx="9" cy="8" r="3.5" />
          <path d="M3 20c0-3 2.7-5 6-5s6 2 6 5" />
          <circle cx="17" cy="9" r="2.5" />
          <path d="M21 18c0-2-1.5-3.5-4-3.5" />
        </svg>
      );
    case "edit":
      return (
        <svg {...props}>
          <path d="M12 20h9" />
          <path d="M16.5 3.5a2.12 2.12 0 1 1 3 3L7 19l-4 1 1-4z" />
        </svg>
      );
    case "tag":
      return (
        <svg {...props}>
          <path d="M20.6 13.4 13 21l-9-9 7.6-7.6 9 .8z" />
          <circle cx="9" cy="9" r="1" />
        </svg>
      );
    case "folder":
      return (
        <svg {...props}>
          <path d="M3 7a2 2 0 0 1 2-2h4l2 2h8a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
        </svg>
      );
    case "chat":
      return (
        <svg {...props}>
          <path d="M21 12a8 8 0 0 1-11.7 7.1L4 20l1-4.5A8 8 0 1 1 21 12z" />
        </svg>
      );
    case "gear":
      return (
        <svg {...props}>
          <circle cx="12" cy="12" r="3" />
          <path d="M19.4 15a1.7 1.7 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-1.8-.3 1.7 1.7 0 0 0-1 1.5V21a2 2 0 1 1-4 0v-.1a1.7 1.7 0 0 0-1-1.5 1.7 1.7 0 0 0-1.8.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.7 1.7 0 0 0 .3-1.8 1.7 1.7 0 0 0-1.5-1H3a2 2 0 1 1 0-4h.1a1.7 1.7 0 0 0 1.5-1 1.7 1.7 0 0 0-.3-1.8l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.7 1.7 0 0 0 1.8.3h0a1.7 1.7 0 0 0 1-1.5V3a2 2 0 1 1 4 0v.1a1.7 1.7 0 0 0 1 1.5 1.7 1.7 0 0 0 1.8-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.7 1.7 0 0 0-.3 1.8v0a1.7 1.7 0 0 0 1.5 1H21a2 2 0 1 1 0 4h-.1a1.7 1.7 0 0 0-1.5 1z" />
        </svg>
      );
    case "globe":
      return (
        <svg {...props}>
          <circle cx="12" cy="12" r="9" />
          <path d="M3 12h18M12 3a14 14 0 0 1 0 18M12 3a14 14 0 0 0 0 18" />
        </svg>
      );
    case "moon":
      return (
        <svg {...props}>
          <path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z" />
        </svg>
      );
    case "book":
      return (
        <svg {...props}>
          <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20V3H6.5A2.5 2.5 0 0 0 4 5.5z" />
          <path d="M4 19.5V21h16" />
        </svg>
      );
    case "help":
      return (
        <svg {...props}>
          <circle cx="12" cy="12" r="9" />
          <path d="M9.5 9a2.5 2.5 0 1 1 3.5 2.3c-1 .5-1.5 1-1.5 2" />
          <circle cx="12" cy="17" r=".5" fill="currentColor" />
        </svg>
      );
    case "life":
      return (
        <svg {...props}>
          <circle cx="12" cy="12" r="9" />
          <circle cx="12" cy="12" r="4" />
          <path d="M4.9 4.9 9 9M15 15l4.1 4.1M4.9 19.1 9 15M15 9l4.1-4.1" />
        </svg>
      );
    case "search":
      return (
        <svg {...props}>
          <circle cx="11" cy="11" r="7" />
          <path d="m20 20-3.5-3.5" />
        </svg>
      );
    case "bell":
      return (
        <svg {...props}>
          <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9" />
          <path d="M10 21a2 2 0 0 0 4 0" />
        </svg>
      );
    case "settings-2":
      return (
        <svg {...props}>
          <path d="M20 7H8M4 7h0M4 17h0M20 17H8" />
          <circle cx="6" cy="7" r="2" />
          <circle cx="18" cy="17" r="2" />
        </svg>
      );
    case "sparkle":
      return (
        <svg {...props}>
          <path d="M12 3v4M12 17v4M3 12h4M17 12h4M5.6 5.6l2.8 2.8M15.6 15.6l2.8 2.8M5.6 18.4l2.8-2.8M15.6 8.4l2.8-2.8" />
        </svg>
      );
    case "pencil":
      return (
        <svg {...props}>
          <path d="M16.5 3.5a2.12 2.12 0 1 1 3 3L7 19l-4 1 1-4z" />
        </svg>
      );
    case "trash":
      return (
        <svg {...props}>
          <path d="M3 6h18M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
        </svg>
      );
    case "eye":
      return (
        <svg {...props}>
          <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12z" />
          <circle cx="12" cy="12" r="3" />
        </svg>
      );
    case "plus":
      return (
        <svg {...props}>
          <path d="M12 5v14M5 12h14" />
        </svg>
      );
    case "check":
      return (
        <svg {...props}>
          <path d="m4 12 5 5L20 6" />
        </svg>
      );
    case "chevron-down":
      return (
        <svg {...props}>
          <path d="m6 9 6 6 6-6" />
        </svg>
      );
    case "chevron-up":
      return (
        <svg {...props}>
          <path d="m6 15 6-6 6 6" />
        </svg>
      );
    case "chevron-left":
      return (
        <svg {...props}>
          <path d="m15 18-6-6 6-6" />
        </svg>
      );
    case "chevron-right":
      return (
        <svg {...props}>
          <path d="m9 18 6-6-6-6" />
        </svg>
      );
    case "mail":
      return (
        <svg {...props}>
          <rect x="3" y="5" width="18" height="14" rx="2" />
          <path d="m3 7 9 7 9-7" />
        </svg>
      );
    case "badge":
      return (
        <svg {...props}>
          <circle cx="12" cy="8" r="5" />
          <path d="M8.5 12 7 22l5-3 5 3-1.5-10" />
        </svg>
      );
    case "message":
      return (
        <svg {...props}>
          <path d="M21 12a8 8 0 0 1-11.7 7.1L4 20l1-4.5A8 8 0 1 1 21 12z" />
        </svg>
      );
    case "list":
      return (
        <svg {...props}>
          <path d="M3 6h18M3 12h18M3 18h18" />
        </svg>
      );
    case "cards":
      return (
        <svg {...props}>
          <rect x="3" y="3" width="7" height="7" rx="1.5" />
          <rect x="14" y="3" width="7" height="7" rx="1.5" />
          <rect x="3" y="14" width="7" height="7" rx="1.5" />
          <rect x="14" y="14" width="7" height="7" rx="1.5" />
        </svg>
      );
    case "filter":
      return (
        <svg {...props}>
          <path d="M3 5h18M6 12h12M10 19h4" />
        </svg>
      );
    case "docs":
      return (
        <svg {...props}>
          <path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8z" />
          <path d="M14 3v5h5M9 13h6M9 17h4" />
        </svg>
      );
    case "print":
      return (
        <svg {...props}>
          <path d="M6 9V3h12v6M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2" />
          <rect x="6" y="14" width="12" height="8" rx="1" />
        </svg>
      );
    case "sidebar":
      return (
        <svg {...props}>
          <rect x="3" y="4" width="18" height="16" rx="2" />
          <path d="M9 4v16" />
        </svg>
      );
    case "bolt":
      return (
        <svg {...props}>
          <path d="M13 3 4 14h7l-1 7 9-11h-7z" />
        </svg>
      );
    case "arrow-right":
      return (
        <svg {...props}>
          <path d="M5 12h14M13 5l7 7-7 7" />
        </svg>
      );
    case "arrow-left":
      return (
        <svg {...props}>
          <path d="M19 12H5M11 5l-7 7 7 7" />
        </svg>
      );
    case "arrow-up":
      return (
        <svg {...props}>
          <path d="M12 19V5M5 12l7-7 7 7" />
        </svg>
      );
    case "dots":
      return (
        <svg {...props}>
          <circle cx="5" cy="12" r="1.4" fill="currentColor" />
          <circle cx="12" cy="12" r="1.4" fill="currentColor" />
          <circle cx="19" cy="12" r="1.4" fill="currentColor" />
        </svg>
      );
    case "leaf":
      return (
        <svg {...props}>
          <path d="M11 20A7 7 0 0 1 4 13c0-6 5-9 16-9 0 9-3 16-9 16zM4 22 17 9" />
        </svg>
      );
    case "stethoscope":
      return (
        <svg {...props}>
          <path d="M5 3v6a5 5 0 0 0 10 0V3M7 3H4M16 3h-3" />
          <path d="M10 14v3a4 4 0 0 0 8 0v-1" />
          <circle cx="18" cy="13" r="2.2" />
        </svg>
      );
    case "calendar":
      return (
        <svg {...props}>
          <rect x="3" y="5" width="18" height="16" rx="2" />
          <path d="M3 10h18M8 3v4M16 3v4" />
        </svg>
      );
    case "shield":
      return (
        <svg {...props}>
          <path d="M12 3 4 6v6c0 5 3.5 8.5 8 9 4.5-.5 8-4 8-9V6z" />
          <path d="m9 12 2 2 4-4" />
        </svg>
      );
    case "id-card":
      return (
        <svg {...props}>
          <rect x="3" y="5" width="18" height="14" rx="2" />
          <circle cx="9" cy="12" r="2.2" />
          <path d="M14 10h4M14 14h4M5.5 16.5c.6-1.4 1.9-2.2 3.5-2.2s2.9.8 3.5 2.2" />
        </svg>
      );
    case "branch":
      return (
        <svg {...props}>
          <circle cx="6" cy="6" r="2" />
          <circle cx="6" cy="18" r="2" />
          <circle cx="18" cy="12" r="2" />
          <path d="M6 8v8M8 6h6a4 4 0 0 1 4 4v0M8 18h6a4 4 0 0 0 4-4v0" />
        </svg>
      );
    case "scroll":
      return (
        <svg {...props}>
          <path d="M5 4h11a3 3 0 0 1 3 3v11a3 3 0 0 1-3 3H8a3 3 0 0 1-3-3V4z" />
          <path d="M9 8h6M9 12h6M9 16h4M19 7h2v3a3 3 0 0 1-3 3" />
        </svg>
      );
    case "atria":
      // Stylized "A" / heart-chamber mark used for the brand glyph.
      return (
        <svg
          width={props.width}
          height={props.height}
          viewBox="0 0 24 24"
          fill="currentColor"
          className={props.className}
          style={props.style}
        >
          <path d="M5 20 11 4h2l6 16h-3.2l-1.3-3.6H9.5L8.2 20zm5.4-6.4h3.2L12 8.6z" />
        </svg>
      );
    case "send":
      return (
        <svg {...props}>
          <path d="m4 12 16-8-6 18-3-7z" />
          <path d="m4 12 7 3" />
        </svg>
      );
    case "mic":
      return (
        <svg {...props}>
          <rect x="9" y="3" width="6" height="12" rx="3" />
          <path d="M5 11a7 7 0 0 0 14 0M12 18v3" />
        </svg>
      );
    case "expand":
      return (
        <svg {...props}>
          <path d="M9 4H4v5M15 4h5v5M4 15v5h5M20 15v5h-5" />
        </svg>
      );
    default:
      return null;
  }
}
