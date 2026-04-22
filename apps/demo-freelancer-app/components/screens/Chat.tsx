"use client";

import { useState } from "react";
import type { AppAPI } from "../GuildApp";
import { CHAT_THREAD, CONVERSATIONS } from "../data";
import {
  IconArrowUp,
  IconBack,
  IconDots,
  IconPaperclip,
} from "../icons";
import { Avatar, RoundBtn } from "../primitives";

export function ChatScreen({ app, id }: { app: AppAPI; id?: string }) {
  const c = CONVERSATIONS.find((x) => x.id === id) || CONVERSATIONS[0];
  const [input, setInput] = useState("");
  const [thread, setThread] = useState(CHAT_THREAD);

  const send = () => {
    if (!input.trim()) return;
    setThread([...thread, { from: "me", text: input, time: "now" }]);
    setInput("");
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%", position: "relative" }}>
      <div
        style={{
          padding: "56px 16px 14px",
          borderBottom: "1px solid var(--hairline)",
          display: "flex",
          alignItems: "center",
          gap: 12,
          background: "var(--bg-0)",
          position: "relative",
          zIndex: 2,
        }}
      >
        <RoundBtn onClick={() => app.go("messages")}>
          <IconBack size={18} />
        </RoundBtn>
        <div style={{ position: "relative" }}>
          <Avatar data={c.avatar} size={42} rounded="full" />
          {c.online && (
            <div
              style={{
                position: "absolute",
                bottom: 0,
                right: 0,
                width: 11,
                height: 11,
                borderRadius: 6,
                background: "var(--accent)",
                border: "2.5px solid var(--bg-0)",
              }}
            />
          )}
        </div>
        <div style={{ flex: 1 }}>
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
          <div
            style={{
              fontSize: 12,
              color: c.online ? "var(--text-1)" : "var(--text-3)",
              fontFamily: "var(--font-body)",
            }}
          >
            {c.online ? "Active now" : "Offline"}
          </div>
        </div>
        <RoundBtn>
          <IconDots size={18} />
        </RoundBtn>
      </div>

      <div
        style={{
          flex: 1,
          overflowY: "auto",
          padding: "18px 16px 100px",
          display: "flex",
          flexDirection: "column",
          gap: 8,
        }}
      >
        <div
          style={{
            alignSelf: "center",
            fontSize: 11,
            color: "var(--text-3)",
            fontFamily: "var(--font-mono)",
            padding: "4px 10px",
            background: "rgba(15,15,16,0.05)",
            borderRadius: 10,
            margin: "4px 0 12px",
          }}
        >
          TODAY · 10:04
        </div>

        {thread.map((m, i) => {
          const prev = thread[i - 1];
          const grouped = prev && prev.from === m.from;
          const mine = m.from === "me";
          return (
            <div
              key={i}
              style={{
                display: "flex",
                justifyContent: mine ? "flex-end" : "flex-start",
                gap: 8,
                marginTop: grouped ? 2 : 8,
              }}
            >
              {!mine && !grouped && <Avatar data={c.avatar} size={28} />}
              {!mine && grouped && <div style={{ width: 28, flexShrink: 0 }} />}
              <div
                style={{
                  maxWidth: "78%",
                  background: mine ? "var(--accent)" : "#fff",
                  color: mine ? "#0f0f10" : "var(--text-1)",
                  border: mine ? "none" : "1px solid var(--hairline)",
                  padding: "10px 14px",
                  borderRadius: 18,
                  borderTopLeftRadius: !mine && grouped ? 6 : 18,
                  borderTopRightRadius: mine && grouped ? 6 : 18,
                  fontSize: 14,
                  lineHeight: 1.4,
                  fontFamily: "var(--font-body)",
                  letterSpacing: -0.1,
                }}
              >
                {m.text}
              </div>
            </div>
          );
        })}

        <div style={{ marginTop: 28, alignSelf: "stretch" }}>
          <div
            style={{
              background: "#0f0f10",
              color: "var(--on-dark-1)",
              borderRadius: 20,
              padding: 16,
              display: "flex",
              flexDirection: "column",
              gap: 12,
            }}
          >
            <div
              style={{
                fontSize: 11,
                color: "var(--on-dark-3)",
                fontFamily: "var(--font-body)",
                textTransform: "uppercase",
                letterSpacing: 0.8,
                lineHeight: 1,
              }}
            >
              Proposal
            </div>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                gap: 12,
              }}
            >
              <div style={{ display: "flex", flexDirection: "column", minWidth: 0 }}>
                <div
                  style={{
                    fontFamily: "var(--font-display)",
                    fontSize: 15,
                    fontWeight: 600,
                    letterSpacing: -0.2,
                    lineHeight: 1.3,
                    marginBottom: 8,
                  }}
                >
                  Landing page — 2 week sprint
                </div>
                <div
                  style={{
                    fontFamily: "var(--font-display)",
                    fontSize: 20,
                    fontWeight: 700,
                    color: "var(--accent)",
                    letterSpacing: -0.3,
                    lineHeight: 1.1,
                  }}
                >
                  $2,400
                </div>
              </div>
              <button
                style={{
                  background: "var(--accent)",
                  color: "#0f0f10",
                  height: 38,
                  padding: "0 16px",
                  borderRadius: 19,
                  border: "none",
                  fontSize: 13,
                  fontWeight: 600,
                  cursor: "pointer",
                  fontFamily: "var(--font-body)",
                }}
              >
                Review
              </button>
            </div>
          </div>
        </div>
      </div>

      <div
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          padding: "10px 12px 28px",
          background: "var(--bg-0)",
          borderTop: "1px solid var(--hairline)",
          display: "flex",
          gap: 8,
          alignItems: "center",
        }}
      >
        <button
          style={{
            width: 44,
            height: 44,
            borderRadius: 22,
            background: "#fff",
            border: "1px solid var(--hairline)",
            color: "var(--text-2)",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <IconPaperclip size={18} />
        </button>
        <div
          style={{
            flex: 1,
            height: 44,
            background: "#fff",
            border: "1px solid var(--hairline)",
            borderRadius: 22,
            display: "flex",
            alignItems: "center",
            padding: "0 16px",
          }}
        >
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && send()}
            placeholder="Message..."
            style={{
              flex: 1,
              border: "none",
              outline: "none",
              background: "transparent",
              color: "var(--text-1)",
              fontSize: 14,
              fontFamily: "var(--font-body)",
            }}
          />
        </div>
        <button
          onClick={send}
          style={{
            width: 44,
            height: 44,
            borderRadius: 22,
            background: input.trim() ? "var(--accent)" : "#fff",
            color: input.trim() ? "#0f0f10" : "var(--text-3)",
            border: input.trim() ? "none" : "1px solid var(--hairline)",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <IconArrowUp size={18} />
        </button>
      </div>
    </div>
  );
}
