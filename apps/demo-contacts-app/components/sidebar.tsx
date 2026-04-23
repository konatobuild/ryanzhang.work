"use client";

import {
  useEffect,
  useState,
  type CSSProperties,
  type Dispatch,
  type ReactNode,
  type SetStateAction,
} from "react";
import { Icons } from "./icons";

type StyleMap = Record<string, CSSProperties>;

const sidebarStyles: StyleMap = {
  root: {
    width: 232,
    background: "var(--sidebar-bg)",
    borderRight: "1px solid var(--border)",
    display: "flex",
    flexDirection: "column",
    flexShrink: 0,
    fontSize: 13,
    color: "var(--ink)",
    position: "relative",
  },
  brandRow: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "14px 14px 6px 14px",
  },
  brand: {
    display: "flex",
    alignItems: "center",
    gap: 9,
    cursor: "pointer",
    padding: "4px 6px",
    margin: "-4px -6px",
    borderRadius: 6,
  },
  logo: {
    width: 22,
    height: 22,
    borderRadius: "50%",
    background: "var(--ink)",
    color: "var(--paper)",
    display: "grid",
    placeItems: "center",
    fontSize: 11,
    fontWeight: 600,
    letterSpacing: 0.2,
  },
  brandName: { fontSize: 14, fontWeight: 600, letterSpacing: -0.2 },
  iconBtn: {
    width: 24,
    height: 24,
    display: "grid",
    placeItems: "center",
    borderRadius: 5,
    color: "var(--muted)",
    cursor: "pointer",
    background: "transparent",
    border: "none",
  },
  quickRow: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    margin: "10px 10px 4px 10px",
    padding: "8px 10px",
    border: "1px solid var(--border)",
    borderRadius: 8,
    background: "var(--paper)",
    cursor: "pointer",
  },
  quickLeft: {
    display: "flex",
    alignItems: "center",
    gap: 8,
    color: "var(--ink)",
  },
  kbd: {
    fontFamily: "var(--mono)",
    fontSize: 11,
    color: "var(--muted)",
    border: "1px solid var(--border)",
    padding: "1px 5px",
    borderRadius: 4,
    background: "var(--paper)",
  },
  groupLabel: {
    fontSize: 11,
    fontWeight: 500,
    textTransform: "uppercase",
    letterSpacing: 0.8,
    color: "var(--muted)",
    padding: "14px 16px 6px 16px",
  },
  item: {
    display: "flex",
    alignItems: "center",
    gap: 10,
    padding: "6px 12px",
    margin: "0 8px",
    borderRadius: 6,
    cursor: "pointer",
    color: "var(--ink-2)",
    position: "relative",
  },
  itemActive: { background: "var(--accent-bg)", color: "var(--ink)" },
  itemIcon: {
    color: "var(--muted)",
    display: "grid",
    placeItems: "center",
    width: 16,
    height: 16,
  },
  itemIconActive: { color: "var(--accent-ink)" },
  count: {
    marginLeft: "auto",
    fontFamily: "var(--mono)",
    fontSize: 11,
    color: "var(--muted)",
  },
  newBadge: {
    marginLeft: "auto",
    fontSize: 9,
    fontWeight: 600,
    letterSpacing: 0.4,
    color: "var(--accent-ink)",
    background: "var(--accent-bg)",
    padding: "2px 6px",
    borderRadius: 3,
    border: "1px solid var(--accent-border)",
  },
  userRow: {
    marginTop: "auto",
    display: "flex",
    alignItems: "center",
    gap: 8,
    padding: "10px 12px",
    borderTop: "1px solid var(--border)",
    cursor: "pointer",
    position: "relative",
  },
  avatar: {
    width: 26,
    height: 26,
    borderRadius: "50%",
    background: "var(--accent-bg)",
    color: "var(--accent-ink)",
    display: "grid",
    placeItems: "center",
    fontSize: 11,
    fontWeight: 600,
    border: "1px solid var(--accent-border)",
  },
  userName: { fontSize: 13, fontWeight: 500 },
  popover: {
    position: "absolute",
    bottom: 56,
    left: 8,
    right: 8,
    background: "var(--paper)",
    border: "1px solid var(--border)",
    borderRadius: 10,
    boxShadow:
      "0 12px 32px -8px rgba(20,20,20,.15), 0 2px 6px rgba(20,20,20,.05)",
    padding: 6,
    zIndex: 40,
  },
  popHead: {
    padding: "8px 10px 10px 10px",
    borderBottom: "1px solid var(--border)",
    marginBottom: 4,
    display: "flex",
    alignItems: "center",
    gap: 10,
  },
  popName: { fontSize: 13, fontWeight: 600 },
  popEmail: { fontSize: 11.5, color: "var(--muted)" },
  popItem: {
    display: "flex",
    alignItems: "center",
    gap: 9,
    padding: "7px 10px",
    borderRadius: 5,
    cursor: "pointer",
    fontSize: 12.5,
    color: "var(--ink-2)",
  },
  popItemDanger: { color: "var(--danger)" },
  divider: { height: 1, background: "var(--border)", margin: "4px 0" },
};

interface NavItemProps {
  icon: ReactNode;
  label: string;
  count?: number;
  badge?: string;
  active?: boolean;
  onClick?: () => void;
}

function NavItem({ icon, label, count, badge, active, onClick }: NavItemProps) {
  const [hover, setHover] = useState(false);
  return (
    <div
      style={{
        ...sidebarStyles.item,
        ...(active ? sidebarStyles.itemActive : {}),
        ...(hover && !active ? { background: "var(--hover)" } : {}),
      }}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      onClick={onClick}
    >
      <span
        style={{
          ...sidebarStyles.itemIcon,
          ...(active ? sidebarStyles.itemIconActive : {}),
        }}
      >
        {icon}
      </span>
      <span>{label}</span>
      {badge && <span style={sidebarStyles.newBadge}>{badge}</span>}
      {count != null && <span style={sidebarStyles.count}>{count}</span>}
    </div>
  );
}

interface PopItemProps {
  icon: ReactNode;
  label: string;
  kbd?: string;
  danger?: boolean;
  onClick?: () => void;
}

function PopItem({ icon, label, kbd, danger, onClick }: PopItemProps) {
  const [h, setH] = useState(false);
  return (
    <div
      style={{
        ...sidebarStyles.popItem,
        ...(danger ? sidebarStyles.popItemDanger : {}),
        ...(h ? { background: "var(--hover)" } : {}),
      }}
      onMouseEnter={() => setH(true)}
      onMouseLeave={() => setH(false)}
      onClick={onClick}
    >
      <span
        style={{
          color: danger ? "var(--danger)" : "var(--muted)",
          display: "grid",
          placeItems: "center",
        }}
      >
        {icon}
      </span>
      <span>{label}</span>
      {kbd && <span style={{ ...sidebarStyles.kbd, marginLeft: "auto" }}>{kbd}</span>}
    </div>
  );
}

function UserPopover({ onClose }: { onClose: () => void }) {
  useEffect(() => {
    const h = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", h);
    return () => window.removeEventListener("keydown", h);
  }, [onClose]);

  return (
    <div style={sidebarStyles.popover} onClick={(e) => e.stopPropagation()}>
      <div style={sidebarStyles.popHead}>
        <div style={{ ...sidebarStyles.avatar, width: 32, height: 32, fontSize: 12 }}>
          MR
        </div>
        <div>
          <div style={sidebarStyles.popName}>Mara Reyes</div>
          <div style={sidebarStyles.popEmail}>mara@orbit.work</div>
        </div>
      </div>
      <PopItem icon={Icons.switchIco} label="Switch workspace" />
      <PopItem icon={Icons.invite} label="Invite teammate" />
      <PopItem icon={Icons.settings} label="Settings" kbd="⌘," />
      <div style={sidebarStyles.divider} />
      <PopItem icon={Icons.help} label="Help & keyboard" kbd="?" />
      <PopItem icon={Icons.logout} label="Sign out" danger />
    </div>
  );
}

export type NavId = "contacts" | "overview" | "pipeline" | "campaigns" | "ledger" | "insights" | "briefs" | "members" | "schedule";

interface SidebarProps {
  activeNav: NavId;
  setActiveNav: Dispatch<SetStateAction<NavId>>;
  onToggleSidebar: () => void;
}

export function Sidebar({ activeNav, setActiveNav, onToggleSidebar }: SidebarProps) {
  const [userOpen, setUserOpen] = useState(false);

  useEffect(() => {
    if (!userOpen) return;
    const close = () => setUserOpen(false);
    const t = window.setTimeout(
      () => window.addEventListener("click", close, { once: true }),
      0,
    );
    return () => {
      window.clearTimeout(t);
      window.removeEventListener("click", close);
    };
  }, [userOpen]);

  return (
    <aside style={sidebarStyles.root}>
      <div style={sidebarStyles.brandRow}>
        <div style={sidebarStyles.brand}>
          <div style={sidebarStyles.logo}>◐</div>
          <span style={sidebarStyles.brandName}>Orbit</span>
          <span style={{ color: "var(--muted)", marginTop: 2 }}>{Icons.chev}</span>
        </div>
        <button
          style={sidebarStyles.iconBtn}
          onClick={onToggleSidebar}
          title="Collapse sidebar"
        >
          {Icons.sidebar}
        </button>
      </div>

      <div style={sidebarStyles.quickRow}>
        <div style={sidebarStyles.quickLeft}>
          <span style={{ color: "var(--muted)", display: "grid", placeItems: "center" }}>
            {Icons.spark}
          </span>
          <span>Quick capture</span>
        </div>
        <span style={sidebarStyles.kbd}>⌘K</span>
      </div>

      <div style={{ marginTop: 4 }}>
        <NavItem icon={Icons.assistant} label="Assistant" badge="BETA" />
        <NavItem icon={Icons.bell} label="Notifications" count={4} />
        <NavItem icon={Icons.hub} label="My hub" />
        <NavItem icon={Icons.chat} label="Threads" count={2} />
      </div>

      <div style={sidebarStyles.groupLabel}>Workspace</div>
      <NavItem
        icon={Icons.dash}
        label="Overview"
        active={activeNav === "overview"}
        onClick={() => setActiveNav("overview")}
      />
      <NavItem
        icon={Icons.contacts}
        label="Contacts"
        active={activeNav === "contacts"}
        onClick={() => setActiveNav("contacts")}
      />
      <NavItem icon={Icons.pipeline} label="Pipeline" />
      <NavItem icon={Icons.campaign} label="Campaigns" />
      <NavItem icon={Icons.ledger} label="Ledger" />
      <NavItem icon={Icons.insights} label="Insights" />
      <NavItem icon={Icons.docs} label="Briefs" />

      <div style={sidebarStyles.groupLabel}>Team</div>
      <NavItem icon={Icons.members} label="Members" />
      <NavItem icon={Icons.calendar} label="Schedule" />

      <div
        style={sidebarStyles.userRow}
        onClick={(e) => {
          e.stopPropagation();
          setUserOpen((v) => !v);
        }}
      >
        <div style={sidebarStyles.avatar}>MR</div>
        <div>
          <div style={sidebarStyles.userName}>Mara Reyes</div>
          <div style={{ fontSize: 11, color: "var(--muted)" }}>Founder workspace</div>
        </div>
        <span style={{ marginLeft: "auto", color: "var(--muted)" }}>
          {userOpen ? Icons.chevu : Icons.chev}
        </span>
        {userOpen && <UserPopover onClose={() => setUserOpen(false)} />}
      </div>
    </aside>
  );
}
