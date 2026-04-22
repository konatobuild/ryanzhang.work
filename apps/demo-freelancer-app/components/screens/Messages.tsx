import type { AppAPI } from "../GuildApp";
import { CONVERSATIONS, FREELANCERS } from "../data";
import { IconPlus, IconSearch } from "../icons";
import { Avatar, RoundBtn } from "../primitives";

export function MessagesScreen({ app }: { app: AppAPI }) {
  const activeAvatars = [
    ...CONVERSATIONS.filter((c) => c.online).map((c) => ({ name: c.name, avatar: c.avatar })),
    ...FREELANCERS.slice(0, 3).map((f) => ({ name: f.name, avatar: f.avatar })),
  ];

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
          Messages
        </div>
        <RoundBtn tone="accent">
          <IconPlus size={18} />
        </RoundBtn>
      </div>

      <div style={{ padding: "0 20px 18px" }}>
        <div
          style={{
            height: 48,
            background: "#fff",
            borderRadius: 24,
            display: "flex",
            alignItems: "center",
            padding: "0 18px",
            border: "1px solid var(--hairline)",
          }}
        >
          <IconSearch size={16} color="var(--text-2)" />
          <input
            placeholder="Search conversations"
            style={{
              flex: 1,
              border: "none",
              outline: "none",
              background: "transparent",
              color: "var(--text-1)",
              fontSize: 14,
              padding: "0 10px",
              fontFamily: "var(--font-body)",
            }}
          />
        </div>
      </div>

      <div style={{ padding: "0 20px 22px" }}>
        <div
          style={{
            fontSize: 11,
            color: "var(--text-3)",
            fontFamily: "var(--font-body)",
            textTransform: "uppercase",
            letterSpacing: 0.8,
            marginBottom: 10,
          }}
        >
          Active now
        </div>
        <div style={{ display: "flex", gap: 14, overflowX: "auto" }}>
          {activeAvatars.map((c, i) => (
            <div
              key={`${c.name}-${i}`}
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: 6,
                flexShrink: 0,
              }}
            >
              <div style={{ position: "relative" }}>
                <Avatar data={c.avatar} size={52} rounded="full" />
                <div
                  style={{
                    position: "absolute",
                    bottom: 0,
                    right: 0,
                    width: 14,
                    height: 14,
                    borderRadius: 7,
                    background: "var(--accent)",
                    border: "3px solid var(--bg-0)",
                  }}
                />
              </div>
              <div
                style={{
                  fontSize: 11,
                  color: "var(--text-2)",
                  fontFamily: "var(--font-body)",
                  maxWidth: 60,
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                }}
              >
                {c.name.split(" ")[0]}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div style={{ padding: "0 12px", display: "flex", flexDirection: "column", gap: 6 }}>
        {CONVERSATIONS.map((c) => (
          <button
            key={c.id}
            onClick={() => app.go("chat", { id: c.id })}
            style={{
              textAlign: "left",
              background: c.unread ? "#fff" : "transparent",
              border: c.unread ? "1px solid var(--hairline)" : "none",
              borderRadius: 20,
              cursor: "pointer",
              padding: "12px 14px",
              display: "flex",
              gap: 14,
              alignItems: "center",
            }}
          >
            <div style={{ position: "relative" }}>
              <Avatar data={c.avatar} size={52} rounded="full" />
              {c.online && (
                <div
                  style={{
                    position: "absolute",
                    bottom: 0,
                    right: 0,
                    width: 12,
                    height: 12,
                    borderRadius: 6,
                    background: "var(--accent)",
                    border: "2.5px solid var(--bg-0)",
                  }}
                />
              )}
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "baseline",
                }}
              >
                <div
                  style={{
                    fontFamily: "var(--font-display)",
                    fontSize: 15,
                    fontWeight: 600,
                    color: "var(--text-1)",
                    letterSpacing: -0.2,
                  }}
                >
                  {c.name}
                </div>
                <div style={{ fontSize: 11, color: "var(--text-3)", fontFamily: "var(--font-mono)" }}>
                  {c.time}
                </div>
              </div>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginTop: 3,
                  gap: 8,
                }}
              >
                <div
                  style={{
                    fontSize: 13,
                    color: c.unread ? "var(--text-1)" : "var(--text-3)",
                    fontFamily: "var(--font-body)",
                    fontWeight: c.unread ? 500 : 400,
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                    flex: 1,
                  }}
                >
                  {c.preview}
                </div>
                {c.unread > 0 && (
                  <div
                    style={{
                      minWidth: 20,
                      height: 20,
                      padding: "0 6px",
                      borderRadius: 10,
                      background: "var(--accent)",
                      color: "#0f0f10",
                      fontSize: 11,
                      fontWeight: 700,
                      fontFamily: "var(--font-display)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    {c.unread}
                  </div>
                )}
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
