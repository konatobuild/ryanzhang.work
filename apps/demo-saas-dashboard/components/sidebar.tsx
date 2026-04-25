"use client";

import { useState, type CSSProperties } from "react";
import { Icon } from "./icons";
import { NAV_PRIMARY, NAV_LINKS, NAV_FOOTER, type NavItem } from "../lib/data";

interface NavItemProps {
  item: NavItem;
  active: boolean;
  collapsed: boolean;
  onClick: () => void;
}

function NavItemRow({ item, active, collapsed, onClick }: NavItemProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      style={{
        display: "flex",
        alignItems: "center",
        gap: 10,
        width: "100%",
        padding: collapsed ? "8px 0" : "8px 10px",
        justifyContent: collapsed ? "center" : "flex-start",
        background: active ? "var(--ink)" : "transparent",
        color: active ? "var(--surface)" : "var(--ink-2)",
        borderRadius: 8,
        fontSize: 13.5,
        fontWeight: active ? 500 : 450,
        textAlign: "left",
        transition: "background .15s, color .15s",
      }}
      onMouseEnter={(e) => {
        if (!active) e.currentTarget.style.background = "var(--chip)";
      }}
      onMouseLeave={(e) => {
        if (!active) e.currentTarget.style.background = "transparent";
      }}
    >
      <Icon name={item.icon} size={16} />
      {!collapsed && <span style={{ flex: 1 }}>{item.label}</span>}
      {!collapsed && item.count != null && (
        <span
          className="mono"
          style={{
            fontSize: 10.5,
            padding: "2px 7px",
            borderRadius: 999,
            background: active ? "rgba(255,255,255,.14)" : "var(--chip)",
            color: active ? "var(--surface)" : "var(--muted)",
            letterSpacing: ".02em",
          }}
        >
          {item.count.toLocaleString()}
        </span>
      )}
    </button>
  );
}

interface NavSectionProps {
  title: string;
  defaultOpen?: boolean;
  collapsed: boolean;
  children: React.ReactNode;
}

function NavSection({
  title,
  defaultOpen = true,
  collapsed,
  children,
}: NavSectionProps) {
  const [open, setOpen] = useState(defaultOpen);
  if (collapsed)
    return (
      <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
        {children}
      </div>
    );
  return (
    <div>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          width: "100%",
          padding: "4px 10px",
          color: "var(--muted)",
          fontSize: 11,
          fontWeight: 500,
          textTransform: "uppercase",
          letterSpacing: ".08em",
          marginBottom: 4,
        }}
      >
        <span>{title}</span>
        <Icon name={open ? "chevron-up" : "chevron-down"} size={12} />
      </button>
      {open && (
        <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
          {children}
        </div>
      )}
    </div>
  );
}

const styles: Record<string, CSSProperties> = {
  brandIcon: {
    width: 30,
    height: 30,
    borderRadius: 8,
    background: "var(--ink)",
    color: "var(--surface)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  searchPill: {
    display: "flex",
    alignItems: "center",
    gap: 8,
    background: "var(--surface-2)",
    border: "1px solid var(--line)",
    borderRadius: 8,
    padding: "7px 10px",
    color: "var(--muted)",
    fontSize: 12.5,
  },
  resourceLink: {
    display: "flex",
    alignItems: "center",
    gap: 10,
    padding: "6px 10px",
    color: "var(--muted)",
    fontSize: 13,
    textAlign: "left",
  },
  trialCard: {
    marginTop: 10,
    padding: 12,
    borderRadius: 10,
    background: "var(--surface)",
    border: "1px solid var(--line)",
    display: "flex",
    alignItems: "center",
    gap: 10,
  },
  trialAvatar: {
    width: 32,
    height: 32,
    borderRadius: 8,
    background: "linear-gradient(135deg, oklch(0.85 0.08 145), oklch(0.7 0.12 200))",
    color: "var(--ink)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontWeight: 600,
    fontSize: 12,
  },
  expandHandle: {
    position: "absolute",
    top: 20,
    right: -12,
    width: 24,
    height: 24,
    borderRadius: 99,
    border: "1px solid var(--line)",
    background: "var(--surface)",
    color: "var(--muted)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    boxShadow: "0 1px 3px rgba(0,0,0,.04)",
  },
};

interface SidebarProps {
  active: string;
  setActive: (id: string) => void;
  collapsed: boolean;
  setCollapsed: (next: boolean) => void;
}

export function Sidebar({
  active,
  setActive,
  collapsed,
  setCollapsed,
}: SidebarProps) {
  return (
    <aside
      style={{
        width: collapsed ? 64 : 248,
        flexShrink: 0,
        background: "var(--bg)",
        borderRight: "1px solid var(--line)",
        display: "flex",
        flexDirection: "column",
        transition: "width .25s ease",
        position: "sticky",
        top: 0,
        height: "100vh",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 10,
          padding: collapsed ? "16px 0" : "16px 18px",
          justifyContent: collapsed ? "center" : "space-between",
          borderBottom: "1px solid var(--line)",
          height: 64,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={styles.brandIcon}>
            <Icon name="leaf" size={16} />
          </div>
          {!collapsed && (
            <div>
              <div style={{ fontWeight: 600, fontSize: 14, lineHeight: 1.1 }}>
                Foliage
              </div>
              <div
                className="mono"
                style={{
                  fontSize: 10,
                  color: "var(--muted)",
                  letterSpacing: ".04em",
                }}
              >
                STUDIO · v3.2
              </div>
            </div>
          )}
        </div>
        {!collapsed && (
          <button
            type="button"
            onClick={() => setCollapsed(true)}
            title="Collapse sidebar"
            style={{
              color: "var(--muted)",
              padding: 4,
              borderRadius: 6,
              display: "flex",
            }}
          >
            <Icon name="sidebar" size={14} />
          </button>
        )}
      </div>

      {!collapsed && (
        <div style={{ padding: "12px 14px 0" }}>
          <div style={styles.searchPill}>
            <Icon name="search" size={13} />
            <span style={{ flex: 1 }}>Quick jump…</span>
            <span
              className="mono"
              style={{
                fontSize: 10,
                padding: "1px 5px",
                background: "var(--chip)",
                borderRadius: 4,
              }}
            >
              ⌘K
            </span>
          </div>
        </div>
      )}

      <div
        style={{
          flex: 1,
          overflowY: "auto",
          padding: collapsed ? "12px 8px" : "14px 12px",
          display: "flex",
          flexDirection: "column",
          gap: 18,
        }}
      >
        <NavSection title="Workspace" collapsed={collapsed}>
          {NAV_PRIMARY.map((item) => (
            <NavItemRow
              key={item.id}
              item={item}
              active={active === item.id}
              onClick={() => setActive(item.id)}
              collapsed={collapsed}
            />
          ))}
        </NavSection>

        {!collapsed && (
          <NavSection title="Resources" collapsed={collapsed}>
            {NAV_LINKS.map((link) => (
              <button
                key={link.id}
                type="button"
                onClick={() => setActive(link.id)}
                style={styles.resourceLink}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.color = "var(--ink)")
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.color = "var(--muted)")
                }
              >
                <span
                  style={{
                    width: 4,
                    height: 4,
                    borderRadius: 99,
                    background: "currentColor",
                    opacity: 0.5,
                  }}
                />
                {link.label}
              </button>
            ))}
          </NavSection>
        )}
      </div>

      <div
        style={{
          borderTop: "1px solid var(--line)",
          padding: collapsed ? "10px 8px" : "10px 12px",
          display: "flex",
          flexDirection: "column",
          gap: 2,
        }}
      >
        {NAV_FOOTER.map((item) => (
          <NavItemRow
            key={item.id}
            item={item}
            active={active === item.id}
            onClick={() => setActive(item.id)}
            collapsed={collapsed}
          />
        ))}

        {!collapsed && (
          <div style={styles.trialCard}>
            <div style={styles.trialAvatar}>EM</div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div
                style={{
                  fontSize: 12.5,
                  fontWeight: 500,
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                }}
              >
                Elif Marchetti
              </div>
              <div
                style={{ fontSize: 10.5, color: "var(--muted)" }}
                className="mono"
              >
                OWNER · 14d trial
              </div>
            </div>
            <button
              type="button"
              style={{ color: "var(--muted)", padding: 4, display: "flex" }}
            >
              <Icon name="dots" size={14} />
            </button>
          </div>
        )}
      </div>

      {collapsed && (
        <button
          type="button"
          onClick={() => setCollapsed(false)}
          style={styles.expandHandle}
        >
          <Icon name="chevron-right" size={12} />
        </button>
      )}
    </aside>
  );
}
