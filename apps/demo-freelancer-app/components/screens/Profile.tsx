import type { AppAPI } from "../GuildApp";
import { FREELANCERS } from "../data";
import {
  IconArrowRight,
  IconBookmark,
  IconChat,
  IconChevron,
  IconSettings,
  IconSparkle,
  IconStar,
  IconWallet,
} from "../icons";
import { Avatar, RoundBtn, SectionHead } from "../primitives";

export function ProfileScreen({ app }: { app: AppAPI }) {
  return (
    <div style={{ paddingBottom: 120 }}>
      <div
        style={{
          padding: "58px 20px 10px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <div
          style={{
            fontFamily: "var(--font-display)",
            fontSize: 34,
            fontWeight: 700,
            color: "var(--text-1)",
            letterSpacing: -1,
          }}
        >
          Profile
        </div>
        <RoundBtn>
          <IconSettings size={18} />
        </RoundBtn>
      </div>

      <div style={{ padding: "0 20px 14px" }}>
        <div
          style={{
            background: "#fff",
            border: "1px solid var(--hairline)",
            borderRadius: 24,
            padding: 20,
            display: "flex",
            alignItems: "center",
            gap: 14,
          }}
        >
          <Avatar data={{ bg: "#e8d5b7", initial: "A" }} size={64} rounded="xl" />
          <div style={{ flex: 1 }}>
            <div
              style={{
                fontFamily: "var(--font-display)",
                fontSize: 20,
                fontWeight: 700,
                color: "var(--text-1)",
                letterSpacing: -0.4,
              }}
            >
              Amelia Park
            </div>
            <div
              style={{
                fontSize: 13,
                color: "var(--text-2)",
                fontFamily: "var(--font-body)",
                marginTop: 2,
              }}
            >
              Hiring for Orchid Studio
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 4, marginTop: 8 }}>
              <IconStar size={12} color="#0f0f10" />
              <span
                style={{
                  fontSize: 13,
                  color: "var(--text-1)",
                  fontFamily: "var(--font-display)",
                  fontWeight: 600,
                }}
              >
                4.9
              </span>
              <span style={{ fontSize: 13, color: "var(--text-3)" }}>· 34 hires</span>
            </div>
          </div>
        </div>
      </div>

      <div style={{ padding: "0 20px 20px" }}>
        <div
          style={{
            background: "var(--accent)",
            color: "#0f0f10",
            borderRadius: 24,
            padding: "20px 22px",
            position: "relative",
            overflow: "hidden",
          }}
        >
          <div
            style={{
              position: "absolute",
              top: -30,
              right: -30,
              width: 120,
              height: 120,
              borderRadius: "50%",
              background: "rgba(15,15,16,0.06)",
            }}
          />
          <div
            style={{
              fontSize: 12,
              textTransform: "uppercase",
              letterSpacing: 0.8,
              fontFamily: "var(--font-body)",
              opacity: 0.7,
            }}
          >
            This month
          </div>
          <div
            style={{
              fontFamily: "var(--font-display)",
              fontSize: 42,
              fontWeight: 700,
              letterSpacing: -1.5,
              lineHeight: 1,
              marginTop: 6,
            }}
          >
            $4,820
          </div>
          <div style={{ fontSize: 13, marginTop: 8, opacity: 0.7 }}>Across 3 active projects</div>
          <button
            style={{
              background: "#0f0f10",
              color: "var(--accent)",
              height: 40,
              padding: "0 16px",
              borderRadius: 20,
              border: "none",
              fontSize: 13,
              fontWeight: 600,
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: 6,
              marginTop: 16,
              fontFamily: "var(--font-body)",
            }}
          >
            Manage payments <IconArrowRight size={13} />
          </button>
        </div>
      </div>

      <SectionHead title="Saved freelancers" actionLabel="See all" />
      <div style={{ padding: "0 20px 24px", display: "flex", flexDirection: "column", gap: 10 }}>
        {FREELANCERS.slice(0, 2).map((f) => (
          <button
            key={f.id}
            onClick={() => app.goFreelancer(f.id)}
            style={{
              textAlign: "left",
              background: "#fff",
              border: "1px solid var(--hairline)",
              borderRadius: 18,
              padding: 12,
              cursor: "pointer",
              color: "var(--text-1)",
              display: "flex",
              alignItems: "center",
              gap: 12,
            }}
          >
            <Avatar data={f.avatar} size={44} rounded="xl" />
            <div style={{ flex: 1 }}>
              <div
                style={{
                  fontFamily: "var(--font-display)",
                  fontSize: 14,
                  fontWeight: 600,
                  letterSpacing: -0.2,
                }}
              >
                {f.name}
              </div>
              <div
                style={{
                  fontSize: 12,
                  color: "var(--text-3)",
                  fontFamily: "var(--font-body)",
                  marginTop: 2,
                }}
              >
                {f.role} · ${f.rate.toLocaleString()}/mo
              </div>
            </div>
            <IconChevron size={14} color="var(--text-3)" />
          </button>
        ))}
      </div>

      <div style={{ padding: "0 20px", display: "flex", flexDirection: "column", gap: 2 }}>
        {[
          { label: "Payments & billing", icon: <IconWallet size={18} /> },
          { label: "Notifications", icon: <IconChat size={18} /> },
          { label: "Saved searches", icon: <IconBookmark size={18} /> },
          { label: "Help & support", icon: <IconSparkle size={18} /> },
        ].map((it) => (
          <div
            key={it.label}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 14,
              padding: "16px 4px",
              borderBottom: "1px solid var(--hairline)",
              cursor: "pointer",
            }}
          >
            <div
              style={{
                width: 36,
                height: 36,
                borderRadius: 12,
                background: "#fff",
                border: "1px solid var(--hairline)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "var(--text-2)",
              }}
            >
              {it.icon}
            </div>
            <div
              style={{
                flex: 1,
                fontSize: 14,
                color: "var(--text-1)",
                fontFamily: "var(--font-body)",
                letterSpacing: -0.1,
              }}
            >
              {it.label}
            </div>
            <IconChevron size={14} color="var(--text-3)" />
          </div>
        ))}
      </div>
    </div>
  );
}
