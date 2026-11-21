/** The few line icons the interface needs. */
const PATHS = {
  close: "M4 4l8 8M12 4l-8 8",
  menu: "M2.5 5.5h11M2.5 10.5h11",
  left: "M9.5 3.5L5 8l4.5 4.5",
  right: "M6.5 3.5L11 8l-4.5 4.5",
} as const;

export function Icon({ name }: { name: keyof typeof PATHS }) {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.3"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
    >
      <path d={PATHS[name]} />
    </svg>
  );
}
