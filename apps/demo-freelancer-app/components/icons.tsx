import type { ReactNode } from "react";

type IconProps = {
  size?: number;
  color?: string;
  stroke?: number;
  fill?: string;
};

type BaseIconProps = IconProps & { path: ReactNode };

const BaseIcon = ({
  path,
  size = 20,
  color = "currentColor",
  stroke = 2,
  fill = "none",
}: BaseIconProps) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill={fill}
    stroke={color}
    strokeWidth={stroke}
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    {path}
  </svg>
);

export const IconSearch = (p: IconProps) => (
  <BaseIcon
    {...p}
    path={
      <>
        <circle cx="11" cy="11" r="7" />
        <path d="m20 20-3.5-3.5" />
      </>
    }
  />
);

export const IconFilter = (p: IconProps) => (
  <BaseIcon {...p} path={<path d="M3 6h18M6 12h12M10 18h4" />} />
);

export const IconHeart = (p: IconProps) => (
  <BaseIcon
    {...p}
    path={
      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
    }
  />
);

export const IconHeartFill = (p: IconProps) => (
  <BaseIcon
    {...p}
    fill={p.color || "currentColor"}
    path={
      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
    }
  />
);

export const IconChat = (p: IconProps) => (
  <BaseIcon
    {...p}
    path={
      <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
    }
  />
);

export const IconSend = (p: IconProps) => (
  <BaseIcon
    {...p}
    path={
      <>
        <path d="m22 2-7 20-4-9-9-4Z" />
        <path d="M22 2 11 13" />
      </>
    }
  />
);

export const IconBack = (p: IconProps) => (
  <BaseIcon {...p} path={<path d="m15 18-6-6 6-6" />} />
);

export const IconChevron = (p: IconProps) => (
  <BaseIcon {...p} path={<path d="m9 18 6-6-6-6" />} />
);

export const IconChevronDown = (p: IconProps) => (
  <BaseIcon {...p} path={<path d="m6 9 6 6 6-6" />} />
);

export const IconStar = (p: IconProps) => (
  <BaseIcon
    {...p}
    fill={p.fill || p.color || "currentColor"}
    path={
      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
    }
  />
);

export const IconClock = (p: IconProps) => (
  <BaseIcon
    {...p}
    path={
      <>
        <circle cx="12" cy="12" r="9" />
        <path d="M12 7v5l3 2" />
      </>
    }
  />
);

export const IconPin = (p: IconProps) => (
  <BaseIcon
    {...p}
    path={
      <>
        <path d="M21 10c0 7-9 13-9 13S3 17 3 10a9 9 0 0 1 18 0z" />
        <circle cx="12" cy="10" r="3" />
      </>
    }
  />
);

export const IconBriefcase = (p: IconProps) => (
  <BaseIcon
    {...p}
    path={
      <>
        <rect x="2" y="7" width="20" height="14" rx="2" />
        <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
      </>
    }
  />
);

export const IconHome = (p: IconProps) => (
  <BaseIcon
    {...p}
    path={
      <>
        <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
        <path d="M9 22V12h6v10" />
      </>
    }
  />
);

export const IconUser = (p: IconProps) => (
  <BaseIcon
    {...p}
    path={
      <>
        <circle cx="12" cy="8" r="4" />
        <path d="M4 21c0-4.4 3.6-8 8-8s8 3.6 8 8" />
      </>
    }
  />
);

export const IconPlus = (p: IconProps) => (
  <BaseIcon {...p} path={<path d="M12 5v14M5 12h14" />} />
);

export const IconX = (p: IconProps) => (
  <BaseIcon {...p} path={<path d="M18 6 6 18M6 6l12 12" />} />
);

export const IconPaperclip = (p: IconProps) => (
  <BaseIcon
    {...p}
    path={
      <path d="m21.44 11.05-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48" />
    }
  />
);

export const IconBookmark = (p: IconProps) => (
  <BaseIcon
    {...p}
    path={<path d="m19 21-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />}
  />
);

export const IconBookmarkFill = (p: IconProps) => (
  <BaseIcon
    {...p}
    fill={p.color || "currentColor"}
    path={<path d="m19 21-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />}
  />
);

export const IconSparkle = (p: IconProps) => (
  <BaseIcon
    {...p}
    fill={p.color || "currentColor"}
    stroke={0}
    path={<path d="M12 2l1.8 6.2L20 10l-6.2 1.8L12 18l-1.8-6.2L4 10l6.2-1.8L12 2z" />}
  />
);

export const IconArrowRight = (p: IconProps) => (
  <BaseIcon
    {...p}
    path={
      <>
        <path d="M5 12h14" />
        <path d="m12 5 7 7-7 7" />
      </>
    }
  />
);

export const IconArrowUp = (p: IconProps) => (
  <BaseIcon
    {...p}
    path={
      <>
        <path d="M12 19V5" />
        <path d="m5 12 7-7 7 7" />
      </>
    }
  />
);

export const IconCheck = (p: IconProps) => (
  <BaseIcon {...p} path={<path d="M20 6 9 17l-5-5" />} />
);

export const IconDots = (p: IconProps) => (
  <BaseIcon
    {...p}
    fill={p.color || "currentColor"}
    stroke={0}
    path={
      <>
        <circle cx="6" cy="12" r="1.5" />
        <circle cx="12" cy="12" r="1.5" />
        <circle cx="18" cy="12" r="1.5" />
      </>
    }
  />
);

export const IconSettings = (p: IconProps) => (
  <BaseIcon
    {...p}
    path={
      <>
        <circle cx="12" cy="12" r="3" />
        <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 1 1-4 0v-.09a1.65 1.65 0 0 0-1-1.51 1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 1 1 0-4h.09a1.65 1.65 0 0 0 1.51-1 1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33h0a1.65 1.65 0 0 0 1-1.51V3a2 2 0 1 1 4 0v.09a1.65 1.65 0 0 0 1 1.51h0a1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82v0a1.65 1.65 0 0 0 1.51 1H21a2 2 0 1 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
      </>
    }
  />
);

export const IconWallet = (p: IconProps) => (
  <BaseIcon
    {...p}
    path={
      <>
        <rect x="2" y="6" width="20" height="14" rx="2" />
        <path d="M2 10h20M17 15h.01" />
      </>
    }
  />
);
