type BaseIcon = { size?: number; color?: string };

export const Arrow = ({ size = 20, color = "#111" }: BaseIcon) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <path
      d="M15 5l-7 7 7 7"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export const Dots = ({ size = 20, color = "#111" }: BaseIcon) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
    <circle cx="12" cy="5" r="1.8" />
    <circle cx="12" cy="12" r="1.8" />
    <circle cx="12" cy="19" r="1.8" />
  </svg>
);

export const Search = ({ size = 18, color = "#111" }: BaseIcon) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <circle cx="11" cy="11" r="6.5" stroke={color} strokeWidth="1.8" />
    <path d="M16 16l4 4" stroke={color} strokeWidth="1.8" strokeLinecap="round" />
  </svg>
);

export const Heart = ({
  size = 20,
  color = "#111",
  filled = false,
}: BaseIcon & { filled?: boolean }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill={filled ? color : "none"}>
    <path
      d="M12 20s-7-4.35-7-10a4 4 0 017-2.65A4 4 0 0119 10c0 5.65-7 10-7 10z"
      stroke={color}
      strokeWidth="1.8"
      strokeLinejoin="round"
    />
  </svg>
);

export const Plus = ({ size = 18, color = "#111" }: BaseIcon) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <path d="M12 5v14M5 12h14" stroke={color} strokeWidth="2" strokeLinecap="round" />
  </svg>
);

export const Minus = ({ size = 18, color = "#111" }: BaseIcon) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <path d="M5 12h14" stroke={color} strokeWidth="2" strokeLinecap="round" />
  </svg>
);

export const ZoomIn = ({ size = 18, color = "#111" }: BaseIcon) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <circle cx="11" cy="11" r="6.5" stroke={color} strokeWidth="1.8" />
    <path
      d="M16 16l4 4M11 8v6M8 11h6"
      stroke={color}
      strokeWidth="1.8"
      strokeLinecap="round"
    />
  </svg>
);

export const ZoomOut = ({ size = 18, color = "#111" }: BaseIcon) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <circle cx="11" cy="11" r="6.5" stroke={color} strokeWidth="1.8" />
    <path d="M16 16l4 4M8 11h6" stroke={color} strokeWidth="1.8" strokeLinecap="round" />
  </svg>
);

export const Clock = ({ size = 18, color = "#111" }: BaseIcon) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <circle cx="12" cy="13" r="7.5" stroke={color} strokeWidth="1.7" />
    <path
      d="M12 9v4l2.5 1.5M9 3h6"
      stroke={color}
      strokeWidth="1.7"
      strokeLinecap="round"
    />
  </svg>
);

export const Phone = ({ size = 20, color = "#111" }: BaseIcon) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <path
      d="M5 4h3l2 5-2.5 1.5a11 11 0 005 5l1.5-2.5 5 2v3a2 2 0 01-2 2A15 15 0 013 6a2 2 0 012-2z"
      stroke={color}
      strokeWidth="1.7"
      strokeLinejoin="round"
    />
  </svg>
);

export const Chat = ({ size = 20, color = "#111" }: BaseIcon) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <path
      d="M4 6a2 2 0 012-2h12a2 2 0 012 2v9a2 2 0 01-2 2H9l-4 4v-4H6a2 2 0 01-2-2V6z"
      stroke={color}
      strokeWidth="1.7"
      strokeLinejoin="round"
    />
  </svg>
);

export const Check = ({ size = 16, color = "#111" }: BaseIcon) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <path
      d="M5 12l5 5 9-10"
      stroke={color}
      strokeWidth="2.2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export const Hex = ({
  size = 22,
  color = "#fff",
  filled = false,
  bg = "#111",
}: BaseIcon & { filled?: boolean; bg?: string }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <path
      d="M12 3l7.5 4.5v9L12 21l-7.5-4.5v-9L12 3z"
      stroke={color}
      strokeWidth="1.7"
      fill={filled ? bg : "none"}
      strokeLinejoin="round"
    />
  </svg>
);

export const Package = ({ size = 20, color = "#fff" }: BaseIcon) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <path
      d="M3 7.5L12 3l9 4.5v9L12 21l-9-4.5v-9z"
      stroke={color}
      strokeWidth="1.7"
      strokeLinejoin="round"
    />
    <path
      d="M3 7.5L12 12m0 0l9-4.5M12 12v9"
      stroke={color}
      strokeWidth="1.7"
      strokeLinejoin="round"
    />
  </svg>
);

export const Bottle = ({ size = 20, color = "#fff" }: BaseIcon) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <path
      d="M9 3h6v2l1 2v2c0 .8-.4 1.5-1 2v8a2 2 0 01-2 2h-2a2 2 0 01-2-2v-8c-.6-.5-1-1.2-1-2V7l1-2V3z"
      stroke={color}
      strokeWidth="1.6"
      strokeLinejoin="round"
    />
  </svg>
);

export const Truck = ({ size = 22, color = "#fff" }: BaseIcon) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <path
      d="M2 7h11v9H2zM13 10h5l3 3v3h-8z"
      stroke={color}
      strokeWidth="1.6"
      strokeLinejoin="round"
    />
    <circle cx="6" cy="18" r="1.7" stroke={color} strokeWidth="1.6" />
    <circle cx="17" cy="18" r="1.7" stroke={color} strokeWidth="1.6" />
  </svg>
);

export const Shield = ({ size = 20, color = "#111" }: BaseIcon) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <path
      d="M12 3l7 2.5v6c0 4.5-3 8-7 10-4-2-7-5.5-7-10v-6L12 3z"
      stroke={color}
      strokeWidth="1.7"
      strokeLinejoin="round"
    />
  </svg>
);

export const Cart = ({ size = 20, color = "#111" }: BaseIcon) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <path
      d="M3 5h2l2.5 11h11l2-8H7"
      stroke={color}
      strokeWidth="1.7"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <circle cx="9" cy="20" r="1.3" fill={color} />
    <circle cx="18" cy="20" r="1.3" fill={color} />
  </svg>
);

export const HomeHex = ({ size = 20, color = "#111" }: BaseIcon) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <path
      d="M12 3l7.5 4.5v9L12 21l-7.5-4.5v-9L12 3z"
      stroke={color}
      strokeWidth="1.7"
      strokeLinejoin="round"
    />
  </svg>
);

export const Leaf = ({ size = 14, color = "#4a8a3a" }: BaseIcon) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
    <path d="M20 4C10 4 4 10 4 20c0-1 0-3 1-5 4 0 10-3 12-7 1-1 2-3 3-4z" />
    <path d="M4 20c4-6 10-10 16-12" stroke="#2f5c24" strokeWidth="1" fill="none" />
  </svg>
);

export const Apple = ({ size = 14 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24">
    <path d="M13 4c-.5-1 0-2 1.5-2.5.5 1.2 0 2.2-1.5 2.5z" fill="#4a8a3a" />
    <path
      d="M12 6c-3 0-6 2.5-6 6.5s3 8.5 6 8.5c1 0 1.5-.5 2-.5s1 .5 2 .5c3 0 6-4.5 6-8.5S18 6 15 6c-1 0-1.5.5-2 .5S13 6 12 6z"
      fill="#e74c3c"
    />
  </svg>
);

export const Carrot = ({ size = 14 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24">
    <path d="M6 18l10-10 2 2L8 20z" fill="#e67e22" />
    <path
      d="M16 8l3-3M18 6l2-1M14 6l1-3"
      stroke="#2d8659"
      strokeWidth="1.5"
      strokeLinecap="round"
    />
  </svg>
);
