"use client";

import { useState, type CSSProperties, type FormEvent, type ReactNode } from "react";
import { Icon } from "./icons";

interface AssistantPanelProps {
  open: boolean;
  onClose: () => void;
}

export function AssistantPanel({ open, onClose }: AssistantPanelProps) {
  const [draft, setDraft] = useState("");

  if (!open) return null;

  const send = (e: FormEvent) => {
    e.preventDefault();
    if (!draft.trim()) return;
    setDraft("");
  };

  return (
    <aside
      style={{
        width: 380,
        flexShrink: 0,
        background: "var(--surface)",
        borderLeft: "1px solid var(--line)",
        display: "flex",
        flexDirection: "column",
        position: "sticky",
        top: 0,
        height: "100vh",
      }}
    >
      <PanelHeader onClose={onClose} />

      <div
        style={{
          flex: 1,
          overflowY: "auto",
          padding: "20px 18px",
          display: "flex",
          flexDirection: "column",
          gap: 18,
        }}
      >
        <InboundBubble
          author="Dr. Jordan Lee"
          role="Chief, Cardiology"
          time="10:12"
        >
          <span>
            Hey Atria, can you check coverage for cardiology this weekend? I
            want to make sure ICU and the cath lab both have an attending on
            site overnight.
          </span>
          <AttachmentChip />
        </InboundBubble>

        <AssistantBubble time="10:13">
          <p style={{ margin: 0 }}>
            Three attendings on rotation Sat–Sun. ICU and cath lab are covered{" "}
            <strong>except Sun 02:00–06:00</strong> — Dr. Aoki goes off shift
            before Dr. Petrov picks up.
          </p>
          <CoverageMatrix />
          <ActionRow />
        </AssistantBubble>
      </div>

      <Composer draft={draft} setDraft={setDraft} onSubmit={send} />
    </aside>
  );
}

function PanelHeader({ onClose }: { onClose: () => void }) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 10,
        padding: "0 18px",
        height: 64,
        borderBottom: "1px solid var(--line)",
      }}
    >
      <div
        style={{
          width: 28,
          height: 28,
          borderRadius: 8,
          background: "var(--ink)",
          color: "var(--accent)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Icon name="sparkle" size={14} />
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: 13.5, fontWeight: 600, lineHeight: 1.1 }}>
          Atria Assistant
        </div>
        <div
          className="mono"
          style={{
            fontSize: 10.5,
            color: "var(--muted)",
            letterSpacing: ".04em",
          }}
        >
          ON-CALL · LIVE ROSTER
        </div>
      </div>
      <button
        type="button"
        title="Expand"
        style={iconGhost}
      >
        <Icon name="expand" size={14} />
      </button>
      <button
        type="button"
        title="Close"
        onClick={onClose}
        style={iconGhost}
      >
        <Icon name="chevron-right" size={14} />
      </button>
    </div>
  );
}

function InboundBubble({
  author,
  role,
  time,
  children,
}: {
  author: string;
  role: string;
  time: string;
  children: ReactNode;
}) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        <div
          style={{
            width: 30,
            height: 30,
            borderRadius: 99,
            background: "var(--ink)",
            color: "var(--accent)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontWeight: 600,
            fontSize: 11.5,
            letterSpacing: "-.02em",
          }}
        >
          JL
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: 12.5, fontWeight: 600 }}>{author}</div>
          <div
            className="mono"
            style={{
              fontSize: 10,
              color: "var(--muted)",
              letterSpacing: ".04em",
            }}
          >
            {role}
          </div>
        </div>
        <span
          className="mono"
          style={{ fontSize: 10.5, color: "var(--muted-2)" }}
        >
          {time}
        </span>
      </div>
      <div
        style={{
          fontSize: 13,
          color: "var(--ink-2)",
          lineHeight: 1.55,
          paddingLeft: 40,
          display: "flex",
          flexDirection: "column",
          gap: 8,
        }}
      >
        {children}
      </div>
    </div>
  );
}

function AssistantBubble({
  time,
  children,
}: {
  time: string;
  children: ReactNode;
}) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        <div
          style={{
            width: 30,
            height: 30,
            borderRadius: 8,
            background: "var(--accent)",
            color: "var(--ink)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Icon name="atria" size={16} />
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: 12.5, fontWeight: 600 }}>Atria</div>
          <div
            className="mono"
            style={{
              fontSize: 10,
              color: "var(--muted)",
              letterSpacing: ".04em",
            }}
          >
            CLINICAL OPS · CO-PILOT
          </div>
        </div>
        <span
          className="mono"
          style={{ fontSize: 10.5, color: "var(--muted-2)" }}
        >
          {time}
        </span>
      </div>
      <div
        style={{
          fontSize: 13,
          color: "var(--ink-2)",
          lineHeight: 1.55,
          paddingLeft: 40,
          display: "flex",
          flexDirection: "column",
          gap: 10,
        }}
      >
        {children}
      </div>
    </div>
  );
}

function AttachmentChip() {
  return (
    <div
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 8,
        padding: "6px 10px",
        background: "var(--surface-2)",
        border: "1px solid var(--line)",
        borderRadius: 8,
        alignSelf: "flex-start",
        fontSize: 11.5,
      }}
    >
      <Icon name="docs" size={12} style={{ color: "var(--muted)" }} />
      <span className="mono" style={{ color: "var(--muted)" }}>
        ROSTER · 2026-04-25.pdf
      </span>
    </div>
  );
}

const matrixRow = (label: string, values: string[]): [string, string[]] => [
  label,
  values,
];

function CoverageMatrix() {
  const rows = [
    matrixRow("Sat 08–20", ["Aoki", "Aoki", "Petrov"]),
    matrixRow("Sat 20–08", ["Petrov", "Petrov", "Aoki"]),
    matrixRow("Sun 08–20", ["Castell", "Castell", "Castell"]),
    matrixRow("Sun 02–06", ["—", "—", "—"]),
  ];
  const cols = ["ICU", "Cath lab", "Step-down"];
  return (
    <div
      style={{
        background: "var(--surface-2)",
        border: "1px solid var(--line)",
        borderRadius: 10,
        padding: 10,
        fontSize: 11.5,
      }}
    >
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1.1fr repeat(3, 1fr)",
          gap: 6,
          color: "var(--muted)",
          paddingBottom: 6,
          borderBottom: "1px solid var(--line-2)",
          marginBottom: 6,
        }}
        className="mono"
      >
        <span style={{ fontSize: 10, letterSpacing: ".06em" }}>WINDOW</span>
        {cols.map((c) => (
          <span
            key={c}
            style={{ fontSize: 10, letterSpacing: ".06em" }}
          >
            {c.toUpperCase()}
          </span>
        ))}
      </div>
      {rows.map(([label, values], i) => {
        const isGap = values.every((v) => v === "—");
        return (
          <div
            key={label}
            style={{
              display: "grid",
              gridTemplateColumns: "1.1fr repeat(3, 1fr)",
              gap: 6,
              padding: "4px 0",
              borderTop: i === 0 ? "none" : "1px solid var(--line-2)",
              alignItems: "center",
            }}
          >
            <span
              className="mono"
              style={{ color: isGap ? "var(--ink)" : "var(--muted)" }}
            >
              {label}
            </span>
            {values.map((v, j) => (
              <span
                key={j}
                style={{
                  color: isGap ? "var(--danger)" : "var(--ink-2)",
                  fontWeight: isGap ? 600 : 400,
                }}
              >
                {v}
              </span>
            ))}
          </div>
        );
      })}
    </div>
  );
}

function ActionRow() {
  return (
    <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
      <ActionChip primary>Page on-call float</ActionChip>
      <ActionChip>Open schedule</ActionChip>
      <ActionChip>Notify Dr. Lee</ActionChip>
    </div>
  );
}

function ActionChip({
  children,
  primary,
}: {
  children: ReactNode;
  primary?: boolean;
}) {
  return (
    <button
      type="button"
      style={{
        padding: "6px 12px",
        borderRadius: 999,
        background: primary ? "var(--ink)" : "var(--surface)",
        border: `1px solid ${primary ? "var(--ink)" : "var(--line)"}`,
        color: primary ? "var(--accent)" : "var(--ink-2)",
        fontSize: 11.5,
        fontWeight: 500,
      }}
    >
      {children}
    </button>
  );
}

function Composer({
  draft,
  setDraft,
  onSubmit,
}: {
  draft: string;
  setDraft: (v: string) => void;
  onSubmit: (e: FormEvent) => void;
}) {
  return (
    <form
      onSubmit={onSubmit}
      style={{
        padding: 14,
        borderTop: "1px solid var(--line)",
        display: "flex",
        flexDirection: "column",
        gap: 10,
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 6,
          padding: "8px 10px",
          background: "var(--surface-2)",
          border: "1px solid var(--line)",
          borderRadius: 12,
        }}
      >
        <input
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          placeholder="Ask the assistant…"
          style={{
            flex: 1,
            background: "transparent",
            border: "none",
            fontSize: 13,
            color: "var(--ink)",
            padding: "4px 0",
          }}
        />
        <button type="button" title="Voice input" style={iconGhost}>
          <Icon name="mic" size={14} />
        </button>
        <button
          type="submit"
          style={{
            width: 30,
            height: 30,
            borderRadius: 8,
            background: "var(--ink)",
            color: "var(--accent)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: 0,
          }}
          title="Send"
        >
          <Icon name="send" size={13} />
        </button>
      </div>
      <div
        className="mono"
        style={{
          fontSize: 10.5,
          color: "var(--muted-2)",
          letterSpacing: ".04em",
          display: "flex",
          alignItems: "center",
          gap: 6,
        }}
      >
        <span style={{ color: "var(--muted)" }}>HIPAA-aware</span>
        <span>·</span>
        <span>Roster context loaded · 312 providers</span>
      </div>
    </form>
  );
}

const iconGhost: CSSProperties = {
  width: 28,
  height: 28,
  borderRadius: 6,
  color: "var(--muted)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  padding: 0,
};
