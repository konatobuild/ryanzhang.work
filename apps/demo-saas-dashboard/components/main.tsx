"use client";

import { AvatarStack } from "./atoms";
import * as I from "./icons";
import type { AccountItem, AccountRow } from "../lib/data";

const COLS = "minmax(200px,2fr) 120px 120px 120px 36px";

function QuickCard({ item }: { item: AccountItem }) {
  return (
    <div
      style={{
        padding: "18px 18px 16px",
        borderRadius: 12,
        background: "var(--surface)",
        boxShadow: "var(--shadow-xs)",
        display: "flex",
        flexDirection: "column",
        gap: 14,
        cursor: "pointer",
        transition: "box-shadow .15s, transform .15s",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.boxShadow = "var(--shadow-sm)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.boxShadow = "var(--shadow-xs)";
      }}
    >
      {item.kind === "account" ? (
        <I.AccountGlyph size={40} />
      ) : (
        <I.DocGlyph size={40} />
      )}
      <div style={{ minWidth: 0 }}>
        <div
          style={{
            fontSize: 14,
            fontWeight: 600,
            color: "var(--ink)",
            marginBottom: 4,
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
          }}
        >
          {item.name}
        </div>
        <div
          className="tnum"
          style={{
            fontSize: 12,
            color: "var(--mute)",
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
          }}
        >
          <span>{item.meta}</span>
          <span style={{ margin: "0 6px", opacity: 0.5 }}>•</span>
          <span>{item.sub}</span>
        </div>
      </div>
    </div>
  );
}

export function QuickAccess({ items }: { items: AccountItem[] }) {
  return (
    <section
      style={{
        background: "var(--surface)",
        borderRadius: 12,
        padding: 20,
        display: "flex",
        flexDirection: "column",
        gap: 16,
        boxShadow: "var(--shadow-xs)",
      }}
    >
      <div style={{ display: "flex", alignItems: "center" }}>
        <h2
          style={{
            margin: 0,
            fontSize: 18,
            fontWeight: 600,
            letterSpacing: -0.1,
            color: "var(--ink)",
          }}
        >
          Quick Access
        </h2>
        <div style={{ flex: 1 }} />
        <button
          style={{
            background: "none",
            border: 0,
            cursor: "pointer",
            color: "var(--mute)",
            padding: 4,
          }}
        >
          <I.More size={20} />
        </button>
      </div>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(4,minmax(0,1fr))",
          gap: 12,
        }}
      >
        {items.map((it) => (
          <QuickCard key={it.id} item={it} />
        ))}
      </div>
    </section>
  );
}

function RowIcon({ kind }: { kind: AccountRow["kind"] }) {
  if (kind === "account") return <I.AccountGlyph size={26} />;
  if (kind === "link") return <I.LinkGlyph size={22} />;
  return <I.DocGlyph size={22} />;
}

function SortHeader({ label, sort }: { label: string; sort?: boolean }) {
  return (
    <div
      style={{
        fontSize: 13,
        fontWeight: 500,
        color: "var(--mute)",
        display: "flex",
        alignItems: "center",
        gap: 4,
        cursor: sort ? "pointer" : "default",
      }}
    >
      {label}
      {sort && <I.ChevronD size={14} />}
    </div>
  );
}

function AccountRowItem({
  row,
  selected,
  onSelect,
}: {
  row: AccountRow;
  selected: boolean;
  onSelect: (id: string) => void;
}) {
  return (
    <div
      onClick={() => onSelect(row.id)}
      style={{
        display: "grid",
        gridTemplateColumns: COLS,
        alignItems: "center",
        padding: "14px 20px",
        background: selected ? "var(--accent-soft)" : "transparent",
        cursor: "pointer",
        borderRadius: selected ? 10 : 0,
        margin: selected ? "2px 10px" : 0,
        paddingLeft: selected ? 14 : 20,
        paddingRight: selected ? 14 : 20,
        transition: "background .12s",
      }}
      onMouseEnter={(e) => {
        if (!selected) e.currentTarget.style.background = "var(--row-hover)";
      }}
      onMouseLeave={(e) => {
        if (!selected) e.currentTarget.style.background = "transparent";
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 12,
          minWidth: 0,
        }}
      >
        <RowIcon kind={row.kind} />
        <span
          style={{
            fontSize: 14,
            fontWeight: 500,
            color: "var(--ink)",
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
          }}
        >
          {row.name}
        </span>
      </div>
      <div style={{ fontSize: 14, color: "var(--mute)" }}>
        {row.owners ? (
          <AvatarStack avatars={row.owners} extra={row.extra} size={24} />
        ) : (
          <span>Shared</span>
        )}
      </div>
      <div
        className="tnum"
        style={{ fontSize: 14, color: "var(--mute)" }}
      >
        {row.count}
      </div>
      <div style={{ fontSize: 14, color: "var(--mute)" }}>{row.modified}</div>
      <div style={{ textAlign: "right" }}>
        <button
          onClick={(e) => e.stopPropagation()}
          style={{
            background: "none",
            border: 0,
            color: "var(--mute)",
            cursor: "pointer",
            padding: 4,
          }}
        >
          <I.More size={18} />
        </button>
      </div>
    </div>
  );
}

export function AccountsPanel({
  rows,
  selectedId,
  setSelectedId,
}: {
  rows: AccountRow[];
  selectedId: string;
  setSelectedId: (id: string) => void;
}) {
  return (
    <section
      style={{
        background: "var(--surface)",
        borderRadius: 12,
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
        boxShadow: "var(--shadow-xs)",
      }}
    >
      <div
        style={{
          padding: "18px 20px 14px",
          display: "flex",
          alignItems: "center",
          gap: 10,
        }}
      >
        <nav
          style={{
            display: "flex",
            alignItems: "center",
            gap: 10,
            fontSize: 15,
          }}
        >
          <span style={{ color: "var(--mute)", fontWeight: 500 }}>Accounts</span>
          <I.ChevronR size={14} style={{ color: "var(--mute-2)" }} />
          <span style={{ color: "var(--mute)", fontWeight: 500 }}>
            Growth Tier
          </span>
          <I.ChevronR size={14} style={{ color: "var(--mute-2)" }} />
          <span style={{ color: "var(--ink)", fontWeight: 600 }}>
            Acme Corp
          </span>
        </nav>
        <div style={{ flex: 1 }} />
        <button
          style={{
            width: 36,
            height: 36,
            display: "grid",
            placeItems: "center",
            background: "var(--bg)",
            border: 0,
            borderRadius: 8,
            color: "var(--ink-2)",
            cursor: "pointer",
          }}
        >
          <I.Grid size={16} />
        </button>
        <button
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 6,
            padding: "8px 14px",
            background: "var(--accent)",
            color: "#fff",
            border: 0,
            borderRadius: 8,
            fontSize: 14,
            fontWeight: 600,
            cursor: "pointer",
            boxShadow: "0 1px 2px rgba(47,75,255,0.25)",
          }}
        >
          <I.Plus size={16} /> Add New
        </button>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: COLS,
          padding: "10px 20px",
          borderBottom: "1px solid var(--line)",
        }}
      >
        <SortHeader label="Account" sort />
        <SortHeader label="Owner" />
        <SortHeader label="ARR" sort />
        <SortHeader label="Last activity" sort />
        <div />
      </div>

      <div style={{ padding: "6px 0" }}>
        {rows.map((r) => (
          <AccountRowItem
            key={r.id}
            row={r}
            selected={selectedId === r.id}
            onSelect={setSelectedId}
          />
        ))}
      </div>
    </section>
  );
}
