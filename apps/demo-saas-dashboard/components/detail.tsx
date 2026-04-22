"use client";

import { useState } from "react";
import { Avatar, AvatarStack, Tag } from "./atoms";
import * as I from "./icons";
import { ACTIVITY } from "../lib/data";

type Tab = "activity" | "notes" | "deals";

export function DetailPanel({ onClose }: { onClose: () => void }) {
  const [tab, setTab] = useState<Tab>("activity");

  return (
    <aside
      style={{
        width: 280,
        flexShrink: 0,
        background: "var(--surface)",
        borderRadius: 12,
        overflow: "hidden",
        alignSelf: "flex-start",
        position: "sticky",
        top: 12,
        maxHeight: "calc(100vh - 24px)",
        display: "flex",
        flexDirection: "column",
        boxShadow: "var(--shadow-xs)",
      }}
    >
      <div style={{ overflowY: "auto", flex: 1 }}>
        <div style={{ padding: "20px 20px 16px" }}>
          <div
            style={{
              display: "flex",
              alignItems: "flex-start",
              marginBottom: 14,
            }}
          >
            <I.AccountGlyph size={44} />
            <div style={{ flex: 1 }} />
            <button
              onClick={onClose}
              style={{
                background: "none",
                border: 0,
                cursor: "pointer",
                color: "var(--mute)",
                padding: 4,
              }}
            >
              <I.X size={18} />
            </button>
          </div>
          <div
            style={{
              fontSize: 20,
              fontWeight: 600,
              color: "var(--ink)",
              marginBottom: 4,
            }}
          >
            Acme Corp
          </div>
          <div
            className="tnum"
            style={{ fontSize: 13, color: "var(--mute)" }}
          >
            <span>$480K ARR</span>
            <span style={{ margin: "0 6px", opacity: 0.5 }}>•</span>
            <span>Renews in 47 days</span>
          </div>
        </div>

        <div style={{ padding: "8px 20px 16px" }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              marginBottom: 10,
            }}
          >
            <span style={{ fontSize: 14, fontWeight: 600, color: "var(--ink)" }}>
              Labels
            </span>
            <div style={{ flex: 1 }} />
            <button
              style={{
                background: "none",
                border: 0,
                cursor: "pointer",
                color: "var(--accent)",
                fontSize: 13,
                fontWeight: 500,
              }}
            >
              Edit
            </button>
          </div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
            <Tag>Enterprise</Tag>
            <Tag>Renewal 90d</Tag>
            <Tag>Advocate</Tag>
          </div>
        </div>

        <div style={{ padding: "8px 20px 20px" }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              marginBottom: 12,
            }}
          >
            <span style={{ fontSize: 14, fontWeight: 600, color: "var(--ink)" }}>
              Team
            </span>
            <div style={{ flex: 1 }} />
            <button
              style={{
                background: "none",
                border: 0,
                cursor: "pointer",
                color: "var(--accent)",
                fontSize: 13,
                fontWeight: 500,
              }}
            >
              Manage
            </button>
          </div>
          <AvatarStack avatars={["AS", "MR", "AV", "JT"]} extra={3} size={28} />
        </div>

        <div
          style={{
            display: "flex",
            gap: 24,
            padding: "0 20px",
            borderBottom: "1px solid var(--line)",
          }}
        >
          {(
            [
              { id: "activity", label: "Activity" },
              { id: "notes", label: "Notes" },
              { id: "deals", label: "Deals" },
            ] as { id: Tab; label: string }[]
          ).map((t) => {
            const active = tab === t.id;
            return (
              <button
                key={t.id}
                onClick={() => setTab(t.id)}
                style={{
                  padding: "10px 0",
                  background: "transparent",
                  border: 0,
                  cursor: "pointer",
                  fontSize: 14,
                  fontWeight: active ? 600 : 500,
                  color: active ? "var(--ink)" : "var(--mute)",
                  borderBottom: active
                    ? "2px solid var(--accent)"
                    : "2px solid transparent",
                  marginBottom: -1,
                }}
              >
                {t.label}
              </button>
            );
          })}
        </div>

        <div style={{ padding: "16px 20px 20px" }}>
          <ol
            style={{
              listStyle: "none",
              padding: 0,
              margin: 0,
              display: "flex",
              flexDirection: "column",
              gap: 18,
            }}
          >
            {ACTIVITY.map((it, i) => (
              <li key={i}>
                <div
                  style={{
                    fontSize: 12,
                    color: "var(--accent)",
                    fontWeight: 500,
                    marginBottom: 6,
                  }}
                >
                  {it.when}
                </div>
                <div
                  style={{
                    display: "flex",
                    alignItems: "flex-start",
                    gap: 10,
                  }}
                >
                  <Avatar who={it.avatar} size={28} />
                  <div
                    style={{
                      flex: 1,
                      fontSize: 13,
                      color: "var(--ink-2)",
                      lineHeight: 1.55,
                    }}
                  >
                    <span>{it.text} </span>
                    {it.link && (
                      <span
                        style={{ color: "var(--accent)", fontWeight: 500 }}
                      >
                        {it.link}
                      </span>
                    )}
                    {it.tag && (
                      <span
                        style={{
                          display: "inline-flex",
                          alignItems: "center",
                          gap: 4,
                          marginLeft: 2,
                        }}
                      >
                        <Tag>{it.tag}</Tag>
                        {it.extra && <Tag>{it.extra}</Tag>}
                      </span>
                    )}
                    {it.sub && (
                      <div
                        style={{
                          marginTop: 6,
                          fontSize: 12,
                          color: "var(--mute)",
                        }}
                      >
                        {it.sub}
                      </div>
                    )}
                  </div>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </aside>
  );
}
