const AV_TONES: Record<string, { bg: string; fg: string }> = {
  YO: { bg: "#2F4BFF", fg: "#FFFFFF" },
  MR: { bg: "#5A70FF", fg: "#FFFFFF" },
  AV: { bg: "#B9C3FF", fg: "#1D2D99" },
  AS: { bg: "#2538CC", fg: "#FFFFFF" },
  JT: { bg: "#DCE2FF", fg: "#1D2D99" },
  MK: { bg: "#2F4BFF", fg: "#FFFFFF" },
  NO: { bg: "var(--gray-300)", fg: "var(--gray-700)" },
  EL: { bg: "var(--gray-400)", fg: "#FFFFFF" },
};

export function Avatar({
  who = "YO",
  size = 24,
}: {
  who?: string;
  size?: number;
}) {
  const t = AV_TONES[who] || AV_TONES.YO;
  return (
    <div
      style={{
        width: size,
        height: size,
        borderRadius: 999,
        background: t.bg,
        color: t.fg,
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        fontSize: Math.max(9, size * 0.38),
        fontWeight: 600,
        letterSpacing: 0.2,
        flexShrink: 0,
        boxShadow: "0 0 0 2px var(--surface)",
      }}
    >
      {who}
    </div>
  );
}

export function AvatarStack({
  avatars = [],
  extra = 0,
  size = 24,
  max = 3,
}: {
  avatars?: string[];
  extra?: number;
  size?: number;
  max?: number;
}) {
  const shown = avatars.slice(0, max);
  const overflow = avatars.length - shown.length + (extra || 0);
  return (
    <div style={{ display: "inline-flex", alignItems: "center" }}>
      {shown.map((a, i) => (
        <div
          key={i}
          style={{ marginLeft: i === 0 ? 0 : -8, zIndex: shown.length - i }}
        >
          <Avatar who={a} size={size} />
        </div>
      ))}
      {overflow > 0 && (
        <span
          style={{
            marginLeft: 8,
            fontSize: 13,
            color: "var(--mute)",
            fontWeight: 500,
          }}
        >
          +{overflow}
        </span>
      )}
    </div>
  );
}

export function Tag({ children }: { children: React.ReactNode }) {
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        padding: "3px 10px",
        borderRadius: 999,
        background: "var(--accent-soft)",
        color: "var(--accent)",
        fontSize: 12,
        fontWeight: 500,
        lineHeight: "18px",
      }}
    >
      {children}
    </span>
  );
}
