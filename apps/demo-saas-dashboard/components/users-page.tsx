"use client";

import {
  useMemo,
  useState,
  type CSSProperties,
  type FormEvent,
  type ReactNode,
} from "react";
import { Icon } from "./icons";
import { ROLES, type IconName, type Status, type User } from "../lib/data";

interface UsersPageProps {
  users: User[];
  setUsers: (next: User[]) => void;
}

function Avatar({ user, size = 48 }: { user: User; size?: number }) {
  return (
    <div
      style={{
        width: size,
        height: size,
        borderRadius: 99,
        background: `linear-gradient(135deg, oklch(0.88 0.06 ${user.hue}), oklch(0.72 0.10 ${(user.hue + 60) % 360}))`,
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
      {user.initials}
    </div>
  );
}

function StatusDot({ status }: { status: Status }) {
  const map: Record<Status, string> = {
    Active: "var(--accent)",
    Idle: "oklch(0.75 0.10 80)",
    Pending: "var(--muted-2)",
  };
  return (
    <span
      style={{
        display: "inline-block",
        width: 6,
        height: 6,
        borderRadius: 99,
        background: map[status],
        boxShadow:
          status === "Active" ? "0 0 0 3px oklch(0.95 0.04 145)" : "none",
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
  return (
    <button
      type="button"
      onClick={onChange}
      style={{
        width: 18,
        height: 18,
        borderRadius: 5,
        border: `1.5px solid ${checked || indeterminate ? "var(--ink)" : "var(--line)"}`,
        background: checked || indeterminate ? "var(--ink)" : "var(--surface)",
        color: "var(--surface)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 0,
        flexShrink: 0,
        transition: "all .12s",
      }}
    >
      {checked && <Icon name="check" size={11} stroke={2.5} />}
      {indeterminate && !checked && (
        <span
          style={{
            width: 8,
            height: 1.5,
            background: "var(--surface)",
            borderRadius: 1,
          }}
        />
      )}
    </button>
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

interface UserCardProps {
  user: User;
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

function UserCard({
  user,
  selected,
  onSelect,
  onEdit,
  onDelete,
  onView,
}: UserCardProps) {
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
          : "0 1px 0 rgba(15,15,14,.02)",
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
        <Avatar user={user} size={56} />
        <div style={{ marginTop: 10, fontWeight: 600, fontSize: 14.5 }}>
          {user.name}
        </div>
        <div
          className="mono"
          style={{ fontSize: 11.5, color: "var(--muted)", marginTop: 2 }}
        >
          @{user.handle}
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
        <MetaRow icon="mail" label={user.email} mono />
        <MetaRow
          icon="badge"
          label={
            <>
              <span>Role: </span>
              <span style={{ color: "var(--ink)", fontWeight: 500 }}>
                {user.role}
              </span>
            </>
          }
        />
        <MetaRow
          icon="message"
          label={
            <>
              <span>Posts: </span>
              <span style={{ color: "var(--ink)", fontWeight: 500 }}>
                {user.posts}
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
              <StatusDot status={user.status} />
              <span style={{ color: "var(--muted)" }}>Status:</span>
              <span style={{ color: "var(--ink)", fontWeight: 500 }}>
                {user.status}
              </span>
            </div>
          }
        />
      </div>
    </div>
  );
}

const LIST_GRID = "40px 1.5fr 1.5fr 1fr 100px 80px 110px";

function UserListRow({
  user,
  selected,
  onSelect,
  onEdit,
  onDelete,
  onView,
}: UserCardProps) {
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
        <Avatar user={user} size={32} />
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
            {user.name}
          </div>
          <div
            className="mono"
            style={{ fontSize: 10.5, color: "var(--muted)" }}
          >
            @{user.handle}
          </div>
        </div>
      </div>
      <div
        className="mono"
        style={{
          fontSize: 12,
          color: "var(--muted)",
          whiteSpace: "nowrap",
          overflow: "hidden",
          textOverflow: "ellipsis",
        }}
      >
        {user.email}
      </div>
      <div style={{ fontSize: 12.5 }}>{user.role}</div>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 6,
          fontSize: 12.5,
        }}
      >
        <StatusDot status={user.status} />
        {user.status}
      </div>
      <div className="mono" style={{ fontSize: 12, color: "var(--muted)" }}>
        {user.posts} posts
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
            background: active ? "rgba(255,255,255,.18)" : "var(--chip)",
            color: "inherit",
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

export function UsersPage({ users, setUsers }: UsersPageProps) {
  const [filter, setFilter] = useState<string>("All");
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<Set<string>>(
    () => new Set(users[0] ? [users[0].id] : []),
  );
  const [view, setView] = useState<"grid" | "list">("grid");
  const [page, setPage] = useState(1);
  const [showAdd, setShowAdd] = useState(false);
  const [toast, setToast] = useState<string | null>(null);

  const filterCounts = useMemo(() => {
    const c: Record<string, number> = { All: users.length };
    ROLES.forEach((r) => {
      c[r] = users.filter((u) => u.role === r).length;
    });
    return c;
  }, [users]);

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return users.filter((u) => {
      if (filter !== "All" && u.role !== filter) return false;
      if (
        q &&
        !(
          u.name.toLowerCase().includes(q) ||
          u.email.includes(q) ||
          u.handle.includes(q)
        )
      )
        return false;
      return true;
    });
  }, [users, filter, search]);

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
    setUsers(users.filter((u) => !selected.has(u.id)));
    showToast(
      `${selected.size} member${selected.size > 1 ? "s" : ""} removed`,
    );
    setSelected(new Set());
  };
  const deleteOne = (id: string) => {
    setUsers(users.filter((u) => u.id !== id));
    const next = new Set(selected);
    next.delete(id);
    setSelected(next);
    showToast("Member removed");
  };
  const addUser = (u: User) => {
    setUsers([u, ...users]);
    setShowAdd(false);
    showToast(`${u.name} invited`);
  };

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
          <span>People</span>
          <Icon name="chevron-right" size={11} />
          <span style={{ color: "var(--ink)" }}>Members</span>
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
            Help chat
          </button>
          <button type="button" style={subBtn}>
            <Icon name="docs" size={13} />
            Docs
          </button>
          <button type="button" style={subBtn}>
            <Icon name="print" size={13} />
            Print
          </button>
        </div>
      </div>

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
                background: "var(--accent-soft)",
                color: "var(--accent)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Icon name="users" size={18} />
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
                Members
              </h1>
              <div
                style={{
                  fontSize: 12.5,
                  color: "var(--muted)",
                  marginTop: 2,
                }}
              >
                Manage who has access to{" "}
                <span style={{ color: "var(--ink)" }}>foliage.studio</span> and
                what they can do.
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
              placeholder="Search members…"
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
            Invite member
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
              label: "Total members",
              value: users.length,
              sub: "+12 this month",
              icon: "users",
            },
            {
              label: "Active now",
              value: users.filter((u) => u.status === "Active").length,
              sub: "past 24 hours",
              icon: "sparkle",
            },
            {
              label: "Pending invites",
              value: users.filter((u) => u.status === "Pending").length,
              sub: "2 expire today",
              icon: "mail",
            },
            {
              label: "Seats remaining",
              value: 32 - users.length,
              sub: "on Studio plan",
              icon: "badge",
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
              }}
            >
              {stat.value}
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
            All members
          </Pill>
          {ROLES.map((role) => (
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
          <div
            style={{ display: "flex", alignItems: "center", gap: 10 }}
          >
            <button
              type="button"
              onClick={toggleAll}
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
              }}
            >
              <Checkbox
                checked={allSelected}
                indeterminate={someSelected && !allSelected}
                onChange={toggleAll}
              />
              {selected.size > 0
                ? `${selected.size} selected`
                : "Select all"}
            </button>
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

          <div
            style={{ display: "flex", alignItems: "center", gap: 6 }}
          >
            <ToolbarBtn icon="filter">Filters</ToolbarBtn>
            <ToolbarBtn icon="settings-2">Sort: Recent</ToolbarBtn>
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
                  background:
                    view === "list" ? "var(--ink)" : "var(--surface)",
                  color:
                    view === "list" ? "var(--surface)" : "var(--muted)",
                }}
              >
                <Icon name="list" size={14} />
              </button>
              <button
                type="button"
                onClick={() => setView("grid")}
                style={{
                  ...viewBtn,
                  background:
                    view === "grid" ? "var(--ink)" : "var(--surface)",
                  color:
                    view === "grid" ? "var(--surface)" : "var(--muted)",
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
              gridTemplateColumns:
                "repeat(auto-fill, minmax(248px, 1fr))",
              gap: 12,
              padding: 16,
            }}
          >
            {filtered.map((u) => (
              <UserCard
                key={u.id}
                user={u}
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
                  No members match
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
              <span>Member</span>
              <span>Email</span>
              <span>Role</span>
              <span>Status</span>
              <span>Posts</span>
              <span style={{ textAlign: "right" }}>Actions</span>
            </div>
            {filtered.map((u) => (
              <UserListRow
                key={u.id}
                user={u}
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
                No members match your filters.
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
            <span style={{ color: "var(--ink)" }}>1–{filtered.length}</span>{" "}
            of{" "}
            <span style={{ color: "var(--ink)" }}>{users.length}</span>
          </div>
          <div
            style={{ display: "flex", alignItems: "center", gap: 4 }}
          >
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
            <span style={{ padding: "0 6px", color: "var(--muted-2)" }}>
              …
            </span>
            <button type="button" style={pgBtn}>
              21
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
          © 2078 Foliage Studio · Region: eu-west-2 · Build 4a91c
        </div>
        <div
          style={{ display: "flex", alignItems: "center", gap: 14 }}
        >
          <span>Privacy</span>
          <span>Terms</span>
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
            <option>Deutsch</option>
            <option>日本語</option>
          </select>
        </div>
      </div>

      {showAdd && (
        <AddMemberModal
          onClose={() => setShowAdd(false)}
          onAdd={addUser}
          existing={users}
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
            color: "var(--surface)",
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
  onAdd: (u: User) => void;
  existing: User[];
}

function AddMemberModal({ onClose, onAdd, existing }: AddModalProps) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState<(typeof ROLES)[number]>("Editor");

  const submit = (e: FormEvent) => {
    e.preventDefault();
    const trimmedName = name.trim();
    const trimmedEmail = email.trim();
    if (!trimmedName || !trimmedEmail) return;
    const parts = trimmedName.split(" ");
    onAdd({
      id: "u_" + Date.now(),
      name: trimmedName,
      handle: trimmedName.toLowerCase().replace(/\s+/g, "."),
      email: trimmedEmail,
      role,
      status: "Pending",
      posts: 0,
      joined: new Date().toISOString().slice(0, 10),
      hue: Math.floor(Math.random() * 360),
      initials:
        ((parts[0]?.[0] || "") + (parts[1]?.[0] || "")).toUpperCase() || "NN",
    });
  };

  return (
    <div
      onClick={onClose}
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(15,15,14,.32)",
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
          width: 460,
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
            NEW MEMBER
          </div>
          <div
            style={{
              fontSize: 17,
              fontWeight: 600,
              marginTop: 2,
              letterSpacing: "-.01em",
            }}
          >
            Invite someone to Foliage
          </div>
          <div
            style={{
              fontSize: 12.5,
              color: "var(--muted)",
              marginTop: 4,
            }}
          >
            They’ll receive an email with a one-time link valid for 72 hours.
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
              placeholder="e.g. Mira Okafor"
              autoFocus
              style={inputStyle}
            />
          </Field>
          <Field label="Work email">
            <input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="mira@foliage.studio"
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
              {ROLES.slice(0, 3).map((r) => (
                <button
                  type="button"
                  key={r}
                  onClick={() => setRole(r)}
                  style={{
                    padding: "9px 10px",
                    background:
                      role === r ? "var(--ink)" : "var(--surface)",
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
                    {r === "Editor"
                      ? "Edit + publish"
                      : r === "Contributor"
                        ? "Edit drafts"
                        : "Read only"}
                  </div>
                </button>
              ))}
            </div>
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
            {existing.length} / 32 seats used
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
                color: "var(--surface)",
                borderRadius: 8,
                fontSize: 13,
                fontWeight: 500,
                display: "inline-flex",
                alignItems: "center",
                gap: 7,
              }}
            >
              Send invite <Icon name="arrow-right" size={13} />
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
