"use client";

import {
  useMemo,
  useState,
  type CSSProperties,
  type FormEvent,
  type KeyboardEvent,
  type ReactNode,
} from "react";
import { Icon } from "./icons";
import {
  PROVIDER_ROLES,
  type IconName,
  type Provider,
  type ProviderRole,
  type Status,
} from "../lib/data";

interface ProvidersPageProps {
  providers: Provider[];
  setProviders: (next: Provider[]) => void;
}

function Avatar({
  provider,
  size = 48,
}: {
  provider: Provider;
  size?: number;
}) {
  return (
    <div
      style={{
        width: size,
        height: size,
        borderRadius: 99,
        background: `linear-gradient(135deg, oklch(0.94 0.13 ${provider.hue}), oklch(0.82 0.18 ${(provider.hue + 12) % 360}))`,
        color: "var(--ink)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontWeight: 600,
        fontSize: size * 0.36,
        flexShrink: 0,
        letterSpacing: "-.01em",
      }}
    >
      {provider.initials}
    </div>
  );
}

const STATUS_PRESENTATION: Record<
  Status,
  { dot: string; halo: string; label: string }
> = {
  "On shift": {
    dot: "var(--accent)",
    halo: "var(--accent-soft)",
    label: "On shift",
  },
  "On call": {
    dot: "var(--ink)",
    halo: "var(--chip)",
    label: "On call",
  },
  "Off duty": {
    dot: "var(--muted-2)",
    halo: "transparent",
    label: "Off duty",
  },
  "On leave": {
    dot: "var(--danger)",
    halo: "rgba(229,72,77,.18)",
    label: "On leave",
  },
};

function StatusDot({ status }: { status: Status }) {
  const p = STATUS_PRESENTATION[status];
  return (
    <span
      style={{
        display: "inline-block",
        width: 6,
        height: 6,
        borderRadius: 99,
        background: p.dot,
        boxShadow: p.halo !== "transparent" ? `0 0 0 3px ${p.halo}` : "none",
      }}
    />
  );
}

function Checkbox({
  checked,
  onChange,
  indeterminate,
}: {
  checked: boolean;
  onChange: () => void;
  indeterminate?: boolean;
}) {
  const handleKey = (e: KeyboardEvent<HTMLSpanElement>) => {
    if (e.key === " " || e.key === "Enter") {
      e.preventDefault();
      onChange();
    }
  };
  return (
    <span
      role="checkbox"
      aria-checked={indeterminate ? "mixed" : checked}
      tabIndex={0}
      onClick={(e) => {
        e.stopPropagation();
        onChange();
      }}
      onKeyDown={handleKey}
      style={{
        width: 18,
        height: 18,
        borderRadius: 5,
        border: `1.5px solid ${checked || indeterminate ? "var(--ink)" : "var(--line)"}`,
        background: checked || indeterminate ? "var(--ink)" : "var(--surface)",
        color: "var(--accent)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexShrink: 0,
        transition: "all .12s",
        cursor: "pointer",
        outlineOffset: 2,
      }}
    >
      {checked && <Icon name="check" size={11} stroke={2.5} />}
      {indeterminate && !checked && (
        <span
          style={{
            width: 8,
            height: 1.5,
            background: "var(--accent)",
            borderRadius: 1,
          }}
        />
      )}
    </span>
  );
}

const cardIconBtn: CSSProperties = {
  width: 26,
  height: 26,
  borderRadius: 6,
  color: "inherit",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  padding: 0,
};

interface ProviderCardProps {
  provider: Provider;
  selected: boolean;
  onSelect: () => void;
  onEdit: () => void;
  onDelete: () => void;
  onView: () => void;
}

function MetaRow({
  icon,
  label,
  mono,
  custom,
}: {
  icon?: IconName | null;
  label?: ReactNode;
  mono?: boolean;
  custom?: ReactNode;
}) {
  if (custom) return <>{custom}</>;
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 8,
        fontSize: 12,
        color: "var(--muted)",
      }}
    >
      {icon && <Icon name={icon} size={13} />}
      <span
        className={mono ? "mono" : undefined}
        style={{
          whiteSpace: "nowrap",
          overflow: "hidden",
          textOverflow: "ellipsis",
          fontSize: mono ? 11.5 : 12,
        }}
      >
        {label}
      </span>
    </div>
  );
}

function ProviderCard({
  provider,
  selected,
  onSelect,
  onEdit,
  onDelete,
  onView,
}: ProviderCardProps) {
  return (
    <div
      style={{
        background: "var(--surface)",
        border: `1px solid ${selected ? "var(--ink)" : "var(--line)"}`,
        borderRadius: 12,
        padding: 16,
        transition: "border-color .15s, box-shadow .15s",
        boxShadow: selected
          ? "0 0 0 1px var(--ink)"
          : "0 1px 0 rgba(10,10,10,.02)",
        position: "relative",
      }}
      onMouseEnter={(e) => {
        if (!selected) e.currentTarget.style.borderColor = "var(--muted-2)";
      }}
      onMouseLeave={(e) => {
        if (!selected) e.currentTarget.style.borderColor = "var(--line)";
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <Checkbox checked={selected} onChange={onSelect} />
        <div style={{ display: "flex", gap: 2, color: "var(--muted)" }}>
          <button
            type="button"
            onClick={onEdit}
            title="Edit"
            style={cardIconBtn}
          >
            <Icon name="pencil" size={13} />
          </button>
          <button
            type="button"
            onClick={onDelete}
            title="Delete"
            style={cardIconBtn}
          >
            <Icon name="trash" size={13} />
          </button>
          <button
            type="button"
            onClick={onView}
            title="View"
            style={cardIconBtn}
          >
            <Icon name="eye" size={13} />
          </button>
        </div>
      </div>

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          textAlign: "center",
          marginTop: 4,
        }}
      >
        <Avatar provider={provider} size={56} />
        <div style={{ marginTop: 10, fontWeight: 600, fontSize: 14.5 }}>
          {provider.name}
        </div>
        <div
          className="mono"
          style={{ fontSize: 11.5, color: "var(--muted)", marginTop: 2 }}
        >
          NPI {provider.npi}
        </div>
      </div>

      <div
        style={{
          height: 1,
          background: "var(--line-2)",
          margin: "14px 0 10px",
        }}
      />

      <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
        <MetaRow icon="mail" label={provider.email} mono />
        <MetaRow
          icon="badge"
          label={
            <>
              <span>Title: </span>
              <span style={{ color: "var(--ink)", fontWeight: 500 }}>
                {provider.role}, {provider.specialty}
              </span>
            </>
          }
        />
        <MetaRow
          icon="branch"
          label={
            <>
              <span>Unit: </span>
              <span style={{ color: "var(--ink)", fontWeight: 500 }}>
                {provider.unit}
              </span>
            </>
          }
        />
        <MetaRow
          icon="message"
          label={
            <>
              <span>Cases MTD: </span>
              <span style={{ color: "var(--ink)", fontWeight: 500 }}>
                {provider.cases}
              </span>
            </>
          }
        />
        <MetaRow
          custom={
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 6,
                fontSize: 12,
              }}
            >
              <StatusDot status={provider.status} />
              <span style={{ color: "var(--muted)" }}>Status:</span>
              <span style={{ color: "var(--ink)", fontWeight: 500 }}>
                {provider.status}
              </span>
            </div>
          }
        />
      </div>
    </div>
  );
}

const LIST_GRID = "40px 1.6fr 1.4fr 1.2fr 110px 90px 110px";

function ProviderListRow({
  provider,
  selected,
  onSelect,
  onEdit,
  onDelete,
  onView,
}: ProviderCardProps) {
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: LIST_GRID,
        alignItems: "center",
        gap: 12,
        padding: "12px 16px",
        borderBottom: "1px solid var(--line-2)",
        background: selected ? "var(--surface-2)" : "var(--surface)",
        transition: "background .12s",
      }}
      onMouseEnter={(e) => {
        if (!selected) e.currentTarget.style.background = "var(--surface-2)";
      }}
      onMouseLeave={(e) => {
        if (!selected) e.currentTarget.style.background = "var(--surface)";
      }}
    >
      <Checkbox checked={selected} onChange={onSelect} />
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 10,
          minWidth: 0,
        }}
      >
        <Avatar provider={provider} size={32} />
        <div style={{ minWidth: 0 }}>
          <div
            style={{
              fontWeight: 500,
              fontSize: 13.5,
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
            }}
          >
            {provider.name}
          </div>
          <div
            className="mono"
            style={{ fontSize: 10.5, color: "var(--muted)" }}
          >
            NPI {provider.npi}
          </div>
        </div>
      </div>
      <div
        style={{
          fontSize: 12.5,
          minWidth: 0,
          whiteSpace: "nowrap",
          overflow: "hidden",
          textOverflow: "ellipsis",
        }}
      >
        <div>{provider.role}</div>
        <div className="mono" style={{ fontSize: 10.5, color: "var(--muted)" }}>
          {provider.specialty}
        </div>
      </div>
      <div
        className="mono"
        style={{
          fontSize: 11.5,
          color: "var(--muted)",
          whiteSpace: "nowrap",
          overflow: "hidden",
          textOverflow: "ellipsis",
        }}
      >
        {provider.unit}
      </div>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 6,
          fontSize: 12.5,
        }}
      >
        <StatusDot status={provider.status} />
        {provider.status}
      </div>
      <div className="mono" style={{ fontSize: 12, color: "var(--muted)" }}>
        {provider.cases} cases
      </div>
      <div
        style={{
          display: "flex",
          justifyContent: "flex-end",
          gap: 2,
          color: "var(--muted)",
        }}
      >
        <button type="button" onClick={onEdit} style={cardIconBtn}>
          <Icon name="pencil" size={13} />
        </button>
        <button type="button" onClick={onDelete} style={cardIconBtn}>
          <Icon name="trash" size={13} />
        </button>
        <button type="button" onClick={onView} style={cardIconBtn}>
          <Icon name="eye" size={13} />
        </button>
      </div>
    </div>
  );
}

function Pill({
  active,
  onClick,
  children,
  count,
}: {
  active: boolean;
  onClick: () => void;
  children: ReactNode;
  count?: number;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 6,
        padding: "6px 12px",
        borderRadius: 999,
        border: `1px solid ${active ? "var(--ink)" : "transparent"}`,
        background: active ? "var(--ink)" : "transparent",
        color: active ? "var(--surface)" : "var(--muted)",
        fontSize: 12.5,
        fontWeight: 500,
        transition: "all .12s",
        whiteSpace: "nowrap",
      }}
    >
      {children}
      {count != null && (
        <span
          className="mono"
          style={{
            fontSize: 10,
            padding: "1px 6px",
            borderRadius: 99,
            background: active ? "var(--accent)" : "var(--chip)",
            color: active ? "var(--ink)" : "inherit",
          }}
        >
          {count}
        </span>
      )}
    </button>
  );
}

function ToolbarBtn({
  children,
  icon,
  onClick,
  danger,
  primary,
}: {
  children: ReactNode;
  icon?: IconName;
  onClick?: () => void;
  danger?: boolean;
  primary?: boolean;
}) {
  const styles: CSSProperties = primary
    ? {
        background: "var(--ink)",
        color: "var(--surface)",
        border: "1px solid var(--ink)",
      }
    : danger
      ? {
          background: "transparent",
          color: "var(--danger)",
          border: "1px solid var(--line)",
        }
      : {
          background: "var(--surface)",
          color: "var(--ink-2)",
          border: "1px solid var(--line)",
        };
  return (
    <button
      type="button"
      onClick={onClick}
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 7,
        padding: "7px 12px",
        borderRadius: 8,
        fontSize: 12.5,
        fontWeight: 500,
        ...styles,
      }}
    >
      {icon && <Icon name={icon} size={13} />}
      {children}
    </button>
  );
}

const subBtn: CSSProperties = {
  display: "inline-flex",
  alignItems: "center",
  gap: 6,
  color: "var(--muted)",
  fontSize: 12.5,
  padding: "6px 8px",
  borderRadius: 6,
};

const viewBtn: CSSProperties = {
  width: 32,
  height: 30,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  padding: 0,
};

const pgBtn: CSSProperties = {
  minWidth: 30,
  height: 30,
  padding: "0 8px",
  borderRadius: 8,
  background: "transparent",
  color: "var(--ink-2)",
  fontSize: 12.5,
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
};

function InsightBanner({ savedHours }: { savedHours: number }) {
  return (
    <div
      style={{
        position: "relative",
        marginBottom: 18,
        padding: "18px 22px",
        borderRadius: 14,
        border: "1px solid var(--line)",
        background: "var(--surface)",
        overflow: "hidden",
        display: "flex",
        alignItems: "center",
        gap: 18,
      }}
    >
      {/* Frosted accent layer */}
      <div
        aria-hidden
        style={{
          position: "absolute",
          inset: 0,
          background:
            "radial-gradient(120% 90% at 22% 0%, var(--accent-glow), transparent 55%), radial-gradient(80% 60% at 60% 110%, var(--accent-soft), transparent 60%)",
          filter: "blur(28px)",
          opacity: 0.85,
          pointerEvents: "none",
        }}
      />
      <div
        aria-hidden
        style={{
          position: "absolute",
          inset: 0,
          background: "rgba(255,255,255,.55)",
          backdropFilter: "blur(2px)",
          pointerEvents: "none",
        }}
      />

      <div
        style={{
          position: "relative",
          width: 44,
          height: 44,
          borderRadius: 12,
          background: "var(--ink)",
          color: "var(--accent)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexShrink: 0,
        }}
      >
        <Icon name="sparkle" size={18} />
      </div>

      <div style={{ position: "relative", flex: 1, minWidth: 0 }}>
        <div
          className="mono"
          style={{
            fontSize: 10.5,
            color: "var(--muted)",
            letterSpacing: ".08em",
            textTransform: "uppercase",
            display: "flex",
            alignItems: "center",
            gap: 8,
          }}
        >
          <span style={{ color: "var(--ink)", fontWeight: 600 }}>
            Atria Insight
          </span>
          <span>·</span>
          <span>This month</span>
        </div>
        <div
          style={{
            fontSize: 19.5,
            fontWeight: 600,
            letterSpacing: "-.018em",
            marginTop: 4,
            lineHeight: 1.3,
          }}
        >
          Auto-scheduling freed up{" "}
          <span
            style={{
              padding: "1px 8px",
              background: "var(--ink)",
              color: "var(--accent)",
              borderRadius: 6,
              fontWeight: 700,
            }}
          >
            {savedHours} attending hours
          </span>{" "}
          and closed 6 credential gaps before they hit a shift.
        </div>
      </div>

      <button
        type="button"
        style={{
          position: "relative",
          padding: "8px 14px 8px 14px",
          borderRadius: 999,
          background: "var(--ink)",
          color: "var(--surface)",
          fontSize: 12.5,
          fontWeight: 500,
          display: "inline-flex",
          alignItems: "center",
          gap: 8,
          flexShrink: 0,
        }}
      >
        See breakdown
        <Icon name="arrow-right" size={13} />
      </button>
    </div>
  );
}

export function ProvidersPage({ providers, setProviders }: ProvidersPageProps) {
  const [filter, setFilter] = useState<string>("All");
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<Set<string>>(
    () => new Set(providers[0] ? [providers[0].id] : []),
  );
  const [view, setView] = useState<"grid" | "list">("grid");
  const [page, setPage] = useState(1);
  const [showAdd, setShowAdd] = useState(false);
  const [toast, setToast] = useState<string | null>(null);

  const filterCounts = useMemo(() => {
    const c: Record<string, number> = { All: providers.length };
    PROVIDER_ROLES.forEach((r) => {
      c[r] = providers.filter((u) => u.role === r).length;
    });
    return c;
  }, [providers]);

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return providers.filter((u) => {
      if (filter !== "All" && u.role !== filter) return false;
      if (
        q &&
        !(
          u.name.toLowerCase().includes(q) ||
          u.email.includes(q) ||
          u.npi.includes(q) ||
          u.specialty.toLowerCase().includes(q)
        )
      )
        return false;
      return true;
    });
  }, [providers, filter, search]);

  const toggle = (id: string) => {
    const next = new Set(selected);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    setSelected(next);
  };
  const allSelected =
    filtered.length > 0 && filtered.every((u) => selected.has(u.id));
  const someSelected = filtered.some((u) => selected.has(u.id));
  const toggleAll = () => {
    if (allSelected) setSelected(new Set());
    else setSelected(new Set(filtered.map((u) => u.id)));
  };
  const showToast = (msg: string) => {
    setToast(msg);
    window.setTimeout(() => setToast(null), 2200);
  };
  const deleteSelected = () => {
    if (selected.size === 0) return;
    setProviders(providers.filter((u) => !selected.has(u.id)));
    showToast(
      `${selected.size} provider${selected.size > 1 ? "s" : ""} removed`,
    );
    setSelected(new Set());
  };
  const deleteOne = (id: string) => {
    setProviders(providers.filter((u) => u.id !== id));
    const next = new Set(selected);
    next.delete(id);
    setSelected(next);
    showToast("Provider removed");
  };
  const addProvider = (u: Provider) => {
    setProviders([u, ...providers]);
    setShowAdd(false);
    showToast(`${u.name} added`);
  };

  const onShiftCount = providers.filter((u) => u.status === "On shift").length;
  const credentialDueCount = providers.filter(
    (u) => u.credentialDueDays <= 30,
  ).length;
  const onLeaveCount = providers.filter((u) => u.status === "On leave").length;

  return (
    <div style={{ padding: "0 28px 28px", position: "relative" }}>
      {/* Sub-header */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "18px 0",
        }}
      >
        <div
          className="mono"
          style={{
            fontSize: 11.5,
            color: "var(--muted)",
            letterSpacing: ".02em",
            display: "flex",
            alignItems: "center",
            gap: 8,
          }}
        >
          <span>WORKSPACE</span>
          <Icon name="chevron-right" size={11} />
          <span>Clinical</span>
          <Icon name="chevron-right" size={11} />
          <span style={{ color: "var(--ink)" }}>Providers</span>
        </div>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 6,
            color: "var(--muted)",
          }}
        >
          <button type="button" style={subBtn}>
            <Icon name="message" size={13} />
            Page chief
          </button>
          <button type="button" style={subBtn}>
            <Icon name="docs" size={13} />
            Roster export
          </button>
          <button type="button" style={subBtn}>
            <Icon name="print" size={13} />
            Print
          </button>
        </div>
      </div>

      {/* Insight banner */}
      <InsightBanner savedHours={142} />

      {/* Page title */}
      <div
        style={{
          display: "flex",
          alignItems: "flex-end",
          justifyContent: "space-between",
          marginTop: 8,
          marginBottom: 24,
          gap: 16,
          flexWrap: "wrap",
        }}
      >
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <div
              style={{
                width: 38,
                height: 38,
                borderRadius: 10,
                background: "var(--ink)",
                color: "var(--accent)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Icon name="stethoscope" size={18} />
            </div>
            <div>
              <h1
                style={{
                  margin: 0,
                  fontSize: 22,
                  fontWeight: 600,
                  letterSpacing: "-.015em",
                }}
              >
                Providers
              </h1>
              <div
                style={{
                  fontSize: 12.5,
                  color: "var(--muted)",
                  marginTop: 2,
                }}
              >
                Manage who&rsquo;s on shift, on call, and credentialed at{" "}
                <span style={{ color: "var(--ink)" }}>atriahealth.org</span>.
              </div>
            </div>
          </div>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              background: "var(--surface)",
              border: "1px solid var(--line)",
              borderRadius: 10,
              padding: "7px 11px",
              minWidth: 240,
            }}
          >
            <Icon name="search" size={13} style={{ color: "var(--muted)" }} />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search providers, NPI, specialty…"
              style={{
                flex: 1,
                background: "transparent",
                border: "none",
                fontSize: 13,
                color: "var(--ink)",
              }}
            />
            <span
              className="mono"
              style={{
                fontSize: 10,
                padding: "1px 5px",
                background: "var(--chip)",
                color: "var(--muted)",
                borderRadius: 4,
              }}
            >
              ⌘F
            </span>
          </div>
          <ToolbarBtn icon="plus" primary onClick={() => setShowAdd(true)}>
            Add provider
          </ToolbarBtn>
        </div>
      </div>

      {/* Stats strip */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(4, 1fr)",
          gap: 1,
          background: "var(--line)",
          border: "1px solid var(--line)",
          borderRadius: 12,
          overflow: "hidden",
          marginBottom: 24,
        }}
      >
        {(
          [
            {
              label: "Active providers",
              value: providers.length,
              sub: "+4 this quarter",
              icon: "stethoscope",
              accent: false,
            },
            {
              label: "On shift right now",
              value: onShiftCount,
              sub: "5 services covered",
              icon: "sparkle",
              accent: true,
            },
            {
              label: "Credentials due ≤30d",
              value: credentialDueCount,
              sub: "auto-renewals queued",
              icon: "id-card",
              accent: false,
            },
            {
              label: "Open requisitions",
              value: 4 + onLeaveCount,
              sub: "across 5 departments",
              icon: "badge",
              accent: false,
            },
          ] as const
        ).map((stat) => (
          <div
            key={stat.label}
            style={{
              background: "var(--surface)",
              padding: "16px 18px",
              display: "flex",
              flexDirection: "column",
              gap: 8,
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <div
                className="mono"
                style={{
                  fontSize: 10.5,
                  color: "var(--muted)",
                  letterSpacing: ".06em",
                  textTransform: "uppercase",
                }}
              >
                {stat.label}
              </div>
              <Icon
                name={stat.icon}
                size={13}
                style={{ color: "var(--muted-2)" }}
              />
            </div>
            <div
              style={{
                fontSize: 28,
                fontWeight: 600,
                letterSpacing: "-.02em",
                lineHeight: 1,
                display: "inline-flex",
                alignItems: "center",
                gap: 8,
              }}
            >
              <span>{stat.value}</span>
              {stat.accent && (
                <span
                  style={{
                    display: "inline-block",
                    width: 8,
                    height: 8,
                    borderRadius: 99,
                    background: "var(--accent)",
                    boxShadow: "0 0 0 4px var(--accent-soft)",
                  }}
                />
              )}
            </div>
            <div style={{ fontSize: 11.5, color: "var(--muted)" }}>
              {stat.sub}
            </div>
          </div>
        ))}
      </div>

      {/* Card workspace */}
      <div
        style={{
          background: "var(--surface)",
          border: "1px solid var(--line)",
          borderRadius: 14,
          overflow: "hidden",
        }}
      >
        {/* Filter pills */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 4,
            padding: "12px 14px",
            borderBottom: "1px solid var(--line-2)",
            overflowX: "auto",
          }}
        >
          <Pill
            active={filter === "All"}
            onClick={() => setFilter("All")}
            count={filterCounts.All}
          >
            All providers
          </Pill>
          {PROVIDER_ROLES.map((role) => (
            <Pill
              key={role}
              active={filter === role}
              onClick={() => setFilter(role)}
              count={filterCounts[role]}
            >
              {role}
            </Pill>
          ))}
        </div>

        {/* Toolbar */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "12px 14px",
            borderBottom: "1px solid var(--line-2)",
            background: "var(--surface-2)",
            gap: 12,
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div
              role="button"
              tabIndex={0}
              onClick={toggleAll}
              onKeyDown={(e) => {
                if (e.key === " " || e.key === "Enter") {
                  e.preventDefault();
                  toggleAll();
                }
              }}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                padding: "6px 10px 6px 8px",
                background: "var(--surface)",
                border: "1px solid var(--line)",
                borderRadius: 8,
                fontSize: 12.5,
                color: "var(--ink-2)",
                cursor: "pointer",
                userSelect: "none",
              }}
            >
              <Checkbox
                checked={allSelected}
                indeterminate={someSelected && !allSelected}
                onChange={toggleAll}
              />
              {selected.size > 0 ? `${selected.size} selected` : "Select all"}
            </div>
            {selected.size > 0 && (
              <button
                type="button"
                onClick={() => setSelected(new Set())}
                style={{
                  color: "var(--muted)",
                  fontSize: 12,
                  padding: "4px 8px",
                }}
              >
                Clear
              </button>
            )}
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <ToolbarBtn icon="filter">Filters</ToolbarBtn>
            <ToolbarBtn icon="settings-2">Sort: Last shift</ToolbarBtn>
            <ToolbarBtn icon="pencil">Bulk edit</ToolbarBtn>
            <ToolbarBtn icon="trash" danger onClick={deleteSelected}>
              Delete
            </ToolbarBtn>
            <div
              style={{
                width: 1,
                height: 24,
                background: "var(--line)",
                margin: "0 4px",
              }}
            />
            <div
              style={{
                display: "flex",
                border: "1px solid var(--line)",
                borderRadius: 8,
                overflow: "hidden",
              }}
            >
              <button
                type="button"
                onClick={() => setView("list")}
                style={{
                  ...viewBtn,
                  background: view === "list" ? "var(--ink)" : "var(--surface)",
                  color: view === "list" ? "var(--surface)" : "var(--muted)",
                }}
              >
                <Icon name="list" size={14} />
              </button>
              <button
                type="button"
                onClick={() => setView("grid")}
                style={{
                  ...viewBtn,
                  background: view === "grid" ? "var(--ink)" : "var(--surface)",
                  color: view === "grid" ? "var(--surface)" : "var(--muted)",
                }}
              >
                <Icon name="cards" size={14} />
              </button>
            </div>
          </div>
        </div>

        {/* Body */}
        {view === "grid" ? (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(248px, 1fr))",
              gap: 12,
              padding: 16,
            }}
          >
            {filtered.map((u) => (
              <ProviderCard
                key={u.id}
                provider={u}
                selected={selected.has(u.id)}
                onSelect={() => toggle(u.id)}
                onEdit={() => showToast(`Editing ${u.name}`)}
                onView={() => showToast(`Viewing ${u.name}`)}
                onDelete={() => deleteOne(u.id)}
              />
            ))}
            {filtered.length === 0 && (
              <div
                style={{
                  gridColumn: "1 / -1",
                  padding: 60,
                  textAlign: "center",
                  color: "var(--muted)",
                  fontSize: 13.5,
                }}
              >
                <div
                  style={{
                    fontSize: 16,
                    color: "var(--ink)",
                    fontWeight: 500,
                    marginBottom: 4,
                  }}
                >
                  No providers match
                </div>
                Try clearing filters or refining your search.
              </div>
            )}
          </div>
        ) : (
          <div>
            <div
              className="mono"
              style={{
                display: "grid",
                gridTemplateColumns: LIST_GRID,
                gap: 12,
                padding: "10px 16px",
                fontSize: 11,
                color: "var(--muted)",
                textTransform: "uppercase",
                letterSpacing: ".06em",
                borderBottom: "1px solid var(--line-2)",
                background: "var(--surface-2)",
              }}
            >
              <span />
              <span>Provider</span>
              <span>Title</span>
              <span>Unit</span>
              <span>Status</span>
              <span>Cases</span>
              <span style={{ textAlign: "right" }}>Actions</span>
            </div>
            {filtered.map((u) => (
              <ProviderListRow
                key={u.id}
                provider={u}
                selected={selected.has(u.id)}
                onSelect={() => toggle(u.id)}
                onEdit={() => showToast(`Editing ${u.name}`)}
                onView={() => showToast(`Viewing ${u.name}`)}
                onDelete={() => deleteOne(u.id)}
              />
            ))}
            {filtered.length === 0 && (
              <div
                style={{
                  padding: 60,
                  textAlign: "center",
                  color: "var(--muted)",
                  fontSize: 13.5,
                }}
              >
                No providers match your filters.
              </div>
            )}
          </div>
        )}

        {/* Pagination */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "14px 16px",
            borderTop: "1px solid var(--line-2)",
            fontSize: 12.5,
            color: "var(--muted)",
          }}
        >
          <div className="mono" style={{ fontSize: 11.5 }}>
            Showing{" "}
            <span style={{ color: "var(--ink)" }}>1–{filtered.length}</span> of{" "}
            <span style={{ color: "var(--ink)" }}>312</span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
            <button type="button" style={pgBtn}>
              <Icon name="arrow-left" size={13} />
            </button>
            {[1, 2, 3].map((n) => (
              <button
                key={n}
                type="button"
                onClick={() => setPage(n)}
                style={{
                  ...pgBtn,
                  background: page === n ? "var(--ink)" : "transparent",
                  color: page === n ? "var(--surface)" : "var(--ink-2)",
                  border:
                    page === n
                      ? "1px solid var(--ink)"
                      : "1px solid transparent",
                }}
              >
                {n}
              </button>
            ))}
            <span style={{ padding: "0 6px", color: "var(--muted-2)" }}>…</span>
            <button type="button" style={pgBtn}>
              13
            </button>
            <button type="button" style={pgBtn}>
              <Icon name="arrow-right" size={13} />
            </button>
            <div
              style={{
                width: 1,
                height: 20,
                background: "var(--line)",
                margin: "0 6px",
              }}
            />
            <button
              type="button"
              style={{
                padding: "6px 12px",
                borderRadius: 999,
                border: "1px solid var(--line)",
                background: "var(--surface)",
                fontSize: 12,
                fontWeight: 500,
                color: "var(--ink-2)",
              }}
            >
              Load more →
            </button>
          </div>
        </div>
      </div>

      {/* Footer strip */}
      <div
        style={{
          marginTop: 20,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          fontSize: 12,
          color: "var(--muted)",
        }}
      >
        <div className="mono" style={{ fontSize: 11 }}>
          © 2026 Atria Clinical Cloud · Region: us-east-2 · Build 4a91c
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          <span>HIPAA</span>
          <span>SOC 2</span>
          <span>Status</span>
          <select
            style={{
              background: "var(--surface)",
              border: "1px solid var(--line)",
              borderRadius: 999,
              padding: "5px 10px",
              fontSize: 12,
              color: "var(--ink-2)",
            }}
          >
            <option>English (US)</option>
            <option>Español</option>
            <option>Français</option>
          </select>
        </div>
      </div>

      {showAdd && (
        <AddProviderModal
          onClose={() => setShowAdd(false)}
          onAdd={addProvider}
          existing={providers}
        />
      )}

      {toast && (
        <div
          style={{
            position: "fixed",
            bottom: 24,
            left: "50%",
            transform: "translateX(-50%)",
            padding: "10px 16px",
            background: "var(--ink)",
            color: "var(--accent)",
            borderRadius: 10,
            fontSize: 13,
            fontWeight: 500,
            display: "flex",
            alignItems: "center",
            gap: 10,
            boxShadow: "0 8px 24px rgba(0,0,0,.18)",
            zIndex: 1000,
          }}
        >
          <Icon name="check" size={14} />
          {toast}
        </div>
      )}
    </div>
  );
}

function Field({
  label,
  children,
}: {
  label: string;
  children: ReactNode;
}) {
  return (
    <label style={{ display: "flex", flexDirection: "column", gap: 6 }}>
      <span
        className="mono"
        style={{
          fontSize: 10.5,
          color: "var(--muted)",
          letterSpacing: ".06em",
          textTransform: "uppercase",
        }}
      >
        {label}
      </span>
      {children}
    </label>
  );
}

const inputStyle: CSSProperties = {
  padding: "9px 12px",
  background: "var(--surface-2)",
  border: "1px solid var(--line)",
  borderRadius: 8,
  fontSize: 13.5,
  color: "var(--ink)",
};

interface AddModalProps {
  onClose: () => void;
  onAdd: (u: Provider) => void;
  existing: Provider[];
}

const PROVIDER_ROLE_BLURBS: Record<ProviderRole, string> = {
  Attending: "Full privileges",
  Resident: "Supervised",
  Fellow: "Subspecialty",
  "Nurse practitioner": "Mid-level",
  "Physician assistant": "Mid-level",
};

function AddProviderModal({ onClose, onAdd, existing }: AddModalProps) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState<ProviderRole>("Attending");
  const [specialty, setSpecialty] = useState("Cardiology");

  const submit = (e: FormEvent) => {
    e.preventDefault();
    const trimmedName = name.trim();
    const trimmedEmail = email.trim();
    if (!trimmedName || !trimmedEmail) return;
    const parts = trimmedName.replace(/^Dr\.\s*/i, "").split(" ");
    const npi = String(1_400_000_000 + Math.floor(Math.random() * 600_000_000));
    onAdd({
      id: "p_" + Date.now(),
      name: trimmedName.startsWith("Dr.") ? trimmedName : `Dr. ${trimmedName}`,
      npi,
      email: trimmedEmail,
      role,
      specialty,
      unit: "Tower 4 · West",
      status: "Off duty",
      cases: 0,
      joined: new Date().toISOString().slice(0, 10),
      hue: 90 + Math.floor(Math.random() * 40),
      initials:
        ((parts[0]?.[0] || "") + (parts[1]?.[0] || "")).toUpperCase() || "DR",
      credentialDueDays: 365,
    });
  };

  return (
    <div
      onClick={onClose}
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(10,10,10,.32)",
        backdropFilter: "blur(4px)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 100,
        padding: 20,
      }}
    >
      <form
        onClick={(e) => e.stopPropagation()}
        onSubmit={submit}
        style={{
          background: "var(--surface)",
          border: "1px solid var(--line)",
          borderRadius: 14,
          width: 480,
          maxWidth: "100%",
          boxShadow: "0 20px 60px rgba(0,0,0,.18)",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            padding: "18px 20px",
            borderBottom: "1px solid var(--line-2)",
          }}
        >
          <div
            className="mono"
            style={{
              fontSize: 10.5,
              color: "var(--muted)",
              letterSpacing: ".08em",
              textTransform: "uppercase",
            }}
          >
            NEW PROVIDER
          </div>
          <div
            style={{
              fontSize: 17,
              fontWeight: 600,
              marginTop: 2,
              letterSpacing: "-.01em",
            }}
          >
            Add a clinician to Atria
          </div>
          <div style={{ fontSize: 12.5, color: "var(--muted)", marginTop: 4 }}>
            They&rsquo;ll receive a credentialing checklist by email — onboarding
            unlocks once license, DEA, and board certs are verified.
          </div>
        </div>
        <div
          style={{
            padding: 20,
            display: "flex",
            flexDirection: "column",
            gap: 14,
          }}
        >
          <Field label="Full name">
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Dr. Mira Okafor"
              autoFocus
              style={inputStyle}
            />
          </Field>
          <Field label="Work email">
            <input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="mira.okafor@atriahealth.org"
              type="email"
              style={inputStyle}
            />
          </Field>
          <Field label="Role">
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(3, 1fr)",
                gap: 6,
              }}
            >
              {PROVIDER_ROLES.slice(0, 3).map((r) => (
                <button
                  type="button"
                  key={r}
                  onClick={() => setRole(r)}
                  style={{
                    padding: "9px 10px",
                    background: role === r ? "var(--ink)" : "var(--surface)",
                    color: role === r ? "var(--surface)" : "var(--ink-2)",
                    border: `1px solid ${role === r ? "var(--ink)" : "var(--line)"}`,
                    borderRadius: 8,
                    fontSize: 12.5,
                    fontWeight: 500,
                    textAlign: "left",
                  }}
                >
                  <div>{r}</div>
                  <div
                    style={{ fontSize: 10.5, opacity: 0.7, marginTop: 2 }}
                    className="mono"
                  >
                    {PROVIDER_ROLE_BLURBS[r]}
                  </div>
                </button>
              ))}
            </div>
          </Field>
          <Field label="Primary specialty">
            <select
              value={specialty}
              onChange={(e) => setSpecialty(e.target.value)}
              style={inputStyle}
            >
              <option>Cardiology</option>
              <option>Neurology</option>
              <option>Emergency medicine</option>
              <option>Internal medicine</option>
              <option>Anesthesiology</option>
              <option>Orthopedics</option>
              <option>Pediatrics</option>
              <option>General surgery</option>
              <option>Psychiatry</option>
            </select>
          </Field>
        </div>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "14px 20px",
            background: "var(--surface-2)",
            borderTop: "1px solid var(--line-2)",
          }}
        >
          <div
            style={{ fontSize: 11.5, color: "var(--muted)" }}
            className="mono"
          >
            {existing.length} of 312 active providers
          </div>
          <div style={{ display: "flex", gap: 8 }}>
            <button
              type="button"
              onClick={onClose}
              style={{
                padding: "8px 14px",
                background: "transparent",
                border: "1px solid var(--line)",
                borderRadius: 8,
                fontSize: 13,
                color: "var(--ink-2)",
              }}
            >
              Cancel
            </button>
            <button
              type="submit"
              style={{
                padding: "8px 16px",
                background: "var(--ink)",
                color: "var(--accent)",
                borderRadius: 8,
                fontSize: 13,
                fontWeight: 500,
                display: "inline-flex",
                alignItems: "center",
                gap: 7,
              }}
            >
              Send credentialing checklist <Icon name="arrow-right" size={13} />
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
