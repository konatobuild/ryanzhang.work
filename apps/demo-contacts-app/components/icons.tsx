import type { ReactNode } from "react";

interface IcoProps {
  path: ReactNode;
  size?: number;
  stroke?: number;
  fill?: string;
}

function Ico({ path, size = 16, stroke = 1.5, fill = "none" }: IcoProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 16 16"
      fill={fill}
      stroke="currentColor"
      strokeWidth={stroke}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {path}
    </svg>
  );
}

export const Icons = {
  spark: (
    <Ico
      path={
        <>
          <path d="M8 1.5v3M8 11.5v3M1.5 8h3M11.5 8h3M3.4 3.4l2.1 2.1M10.5 10.5l2.1 2.1M3.4 12.6l2.1-2.1M10.5 5.5l2.1-2.1" />
        </>
      }
    />
  ),
  bell: (
    <Ico
      path={
        <>
          <path d="M3.5 11V7.5a4.5 4.5 0 019 0V11l1 1.5H2.5L3.5 11zM6.5 13.5a1.5 1.5 0 003 0" />
        </>
      }
    />
  ),
  hub: (
    <Ico
      path={
        <>
          <circle cx="8" cy="8" r="1.5" />
          <circle cx="8" cy="2.5" r="1" />
          <circle cx="8" cy="13.5" r="1" />
          <circle cx="2.5" cy="8" r="1" />
          <circle cx="13.5" cy="8" r="1" />
          <path d="M8 4v2.5M8 9.5V12M4 8h2.5M9.5 8H12" />
        </>
      }
    />
  ),
  chat: (
    <Ico
      path={
        <path d="M2.5 4.5a1.5 1.5 0 011.5-1.5h8a1.5 1.5 0 011.5 1.5v5a1.5 1.5 0 01-1.5 1.5H6L3 13.5V11H4a1.5 1.5 0 01-1.5-1.5v-5z" />
      }
    />
  ),
  dash: (
    <Ico
      path={
        <>
          <rect x="2" y="2" width="5" height="5" rx="1" />
          <rect x="9" y="2" width="5" height="5" rx="1" />
          <rect x="2" y="9" width="5" height="5" rx="1" />
          <rect x="9" y="9" width="5" height="5" rx="1" />
        </>
      }
    />
  ),
  contacts: (
    <Ico
      path={
        <>
          <circle cx="6" cy="6" r="2.5" />
          <path d="M2 13c0-2.2 1.8-4 4-4s4 1.8 4 4M10.5 3.5a2 2 0 010 3.8M11 9.2c1.8.3 3 1.7 3 3.8" />
        </>
      }
    />
  ),
  pipeline: (
    <Ico
      path={
        <>
          <path d="M2 4h7M2 8h10M2 12h5" />
          <circle cx="11" cy="4" r="1.2" />
          <circle cx="14" cy="8" r="1.2" />
          <circle cx="8" cy="12" r="1.2" />
        </>
      }
    />
  ),
  campaign: (
    <Ico
      path={
        <path d="M2.5 6v4l7 2.5V3.5L2.5 6zM9.5 4.5v7M11.5 6.5v3M4.5 10v2.5l2 .5v-2.5" />
      }
    />
  ),
  ledger: (
    <Ico
      path={
        <>
          <rect x="2.5" y="2" width="11" height="12" rx="1" />
          <path d="M5 5h6M5 8h6M5 11h4" />
        </>
      }
    />
  ),
  insights: <Ico path={<path d="M2 13h12M4 11V7M7 11V4M10 11V8M13 11V5" />} />,
  docs: (
    <Ico
      path={
        <>
          <path d="M3.5 2h6L12.5 5v9h-9V2z" />
          <path d="M9 2v3h3.5M5.5 8h5M5.5 10.5h5M5.5 5.5h2" />
        </>
      }
    />
  ),
  members: (
    <Ico
      path={
        <>
          <circle cx="5.5" cy="6" r="2" />
          <circle cx="11" cy="6.5" r="1.5" />
          <path d="M1.5 13c0-1.9 1.8-3.5 4-3.5s4 1.6 4 3.5M9.5 13c0-1.3 1.2-2.5 3-2.5" />
        </>
      }
    />
  ),
  plus: <Ico path={<path d="M8 3v10M3 8h10" />} />,
  chev: <Ico path={<path d="M4 6l4 4 4-4" />} />,
  chevr: <Ico path={<path d="M6 4l4 4-4 4" />} />,
  chevu: <Ico path={<path d="M4 10l4-4 4 4" />} />,
  dots: (
    <Ico
      path={
        <>
          <circle cx="3.5" cy="8" r=".9" fill="currentColor" />
          <circle cx="8" cy="8" r=".9" fill="currentColor" />
          <circle cx="12.5" cy="8" r=".9" fill="currentColor" />
        </>
      }
    />
  ),
  filter: <Ico path={<path d="M2 3h12l-4.5 6v5l-3 1V9L2 3z" />} />,
  search: (
    <Ico
      path={
        <>
          <circle cx="7" cy="7" r="4" />
          <path d="M10 10l3.5 3.5" />
        </>
      }
    />
  ),
  sliders: (
    <Ico
      path={
        <>
          <path d="M2 4h8M12 4h2M2 8h3M7 8h7M2 12h9M13 12h1" />
          <circle cx="11" cy="4" r="1.2" />
          <circle cx="6" cy="8" r="1.2" />
          <circle cx="12" cy="12" r="1.2" />
        </>
      }
    />
  ),
  up: <Ico path={<path d="M8 13V3M4 7l4-4 4 4" />} />,
  upright: <Ico path={<path d="M5 11L11 5M6 5h5v5" />} />,
  down: <Ico path={<path d="M8 3v10M4 9l4 4 4-4" />} />,
  x: <Ico path={<path d="M4 4l8 8M12 4l-8 8" />} />,
  check: <Ico path={<path d="M3.5 8.5l3 3 6-7" />} />,
  trash: (
    <Ico
      path={
        <>
          <path d="M3 4.5h10M5.5 4.5V3h5v1.5M5 4.5l.5 8.5h5l.5-8.5" />
        </>
      }
    />
  ),
  archive: (
    <Ico
      path={
        <>
          <rect x="2.5" y="3" width="11" height="3" rx=".5" />
          <path d="M3.5 6v7h9V6M6.5 9h3" />
        </>
      }
    />
  ),
  share: (
    <Ico
      path={
        <>
          <path d="M11 5.5l-6 3M11 10.5l-6-3" />
          <circle cx="12" cy="4.5" r="1.5" />
          <circle cx="4" cy="8" r="1.5" />
          <circle cx="12" cy="11.5" r="1.5" />
        </>
      }
    />
  ),
  logout: <Ico path={<path d="M6.5 3H3v10h3.5M10 5.5L12.5 8 10 10.5M7 8h5.5" />} />,
  settings: (
    <Ico
      path={
        <>
          <circle cx="8" cy="8" r="2" />
          <path d="M8 1.5v2M8 12.5v2M1.5 8h2M12.5 8h2M3.4 3.4l1.4 1.4M11.2 11.2l1.4 1.4M3.4 12.6l1.4-1.4M11.2 4.8l1.4-1.4" />
        </>
      }
    />
  ),
  switchIco: <Ico path={<path d="M3 6h9l-2-2M13 10H4l2 2" />} />,
  invite: (
    <Ico
      path={
        <>
          <circle cx="6" cy="6" r="2.5" />
          <path d="M1.5 13c0-2.2 2-4 4.5-4s4.5 1.8 4.5 4M12 5v5M9.5 7.5h5" />
        </>
      }
    />
  ),
  help: (
    <Ico
      path={
        <>
          <circle cx="8" cy="8" r="6" />
          <path d="M6.5 6.5c0-1 .7-1.8 1.8-1.8 1 0 1.7.7 1.7 1.6 0 .9-.7 1.3-1.5 1.7v.7" />
          <circle cx="8.1" cy="11" r=".5" fill="currentColor" stroke="none" />
        </>
      }
    />
  ),
  sidebar: (
    <Ico
      path={
        <>
          <rect x="2" y="3" width="12" height="10" rx="1" />
          <path d="M6 3v10" />
        </>
      }
    />
  ),
  assistant: (
    <Ico
      path={<path d="M8 2l1.5 3.5L13 7l-3.5 1.5L8 12l-1.5-3.5L3 7l3.5-1.5L8 2z" />}
    />
  ),
  star: (
    <Ico
      path={
        <path d="M8 2l1.8 4 4.2.5-3 2.8.8 4.2L8 11.5 4.2 13.5 5 9.3 2 6.5l4.2-.5L8 2z" />
      }
    />
  ),
  calendar: (
    <Ico
      path={
        <>
          <rect x="2" y="3" width="12" height="11" rx="1" />
          <path d="M2 6.5h12M5 2v3M11 2v3" />
        </>
      }
    />
  ),
  tag: (
    <Ico
      path={
        <>
          <path d="M2.5 2.5h5L13.5 8.5l-5 5-6-6v-5z" />
          <circle cx="5" cy="5" r=".8" fill="currentColor" />
        </>
      }
    />
  ),
};
