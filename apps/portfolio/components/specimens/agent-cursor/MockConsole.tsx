"use client";

/**
 * MockConsole.tsx -- a fictional cloud/SaaS admin console.
 *
 * Structural contract:
 *   - `activeSection` + `onSectionChange` are lifted to the parent
 *     (AgentCursorStage) so the scenario runner can switch sections
 *     programmatically without any ref imperative handle. This is the
 *     cleanest approach: state lives in one place, the cursor engine
 *     calls onSectionChange(sectionId), React re-renders, targets
 *     become visible in the DOM, then the runner waits one rAF before
 *     calling getTargetRect(targetId).
 *
 * Targeting:
 *   - Every element the cursor might travel to carries data-target="<id>".
 *   - See TargetId in scenarios.ts for the full union.
 *   - getTargetRect(id) queries [data-target="<id>"] and returns its DOMRect.
 *
 * Aesthetic: Braun industrial + Phaidon editorial.
 *   - White/gray ground, Klein blue as single accent (active nav rule only).
 *   - Status shown as 6px dots, never filled pastel pills.
 *   - Mono reserved for real data: numbers, IDs, timestamps, regions.
 *   - Instrument readout band replaces stat-card grid.
 *   - Tables use intentional column widths, not auto-fit.
 */

import { useState, useEffect } from "react";
import { type SectionId } from "./scenarios";

// --- Helpers -----------------------------------------------------------------

/**
 * getTargetRect -- query a data-target element and return its bounding rect.
 * Returns null if the element is not in the DOM (e.g., hidden section).
 * The cursor engine should call this AFTER the section has been switched and
 * one animation frame has elapsed so layout is fresh.
 */
export function getTargetRect(id: string): DOMRect | null {
  const el = document.querySelector<HTMLElement>(`[data-target="${id}"]`);
  if (!el) return null;
  return el.getBoundingClientRect();
}

// --- Nav groups --------------------------------------------------------------

const NAV_GROUPS: {
  label: string;
  items: { id: SectionId; label: string }[];
}[] = [
  {
    label: "PLATFORM",
    items: [
      { id: "overview", label: "Overview" },
      { id: "environments", label: "Environments" },
      { id: "api-keys", label: "API Keys" },
    ],
  },
  {
    label: "WORKSPACE",
    items: [
      { id: "team", label: "Team" },
      { id: "billing", label: "Billing" },
      { id: "settings", label: "Settings" },
    ],
  },
];

// --- Props -------------------------------------------------------------------

type MockConsoleProps = {
  activeSection: SectionId;
  onSectionChange: (id: SectionId) => void;
};

// --- Root component ----------------------------------------------------------

export function MockConsole({ activeSection, onSectionChange }: MockConsoleProps) {
  // breadcrumb label
  const allItems = NAV_GROUPS.flatMap((g) => g.items);
  const activeLabel = allItems.find((i) => i.id === activeSection)?.label ?? "";

  return (
    <div className="mc-root">
      {/* Left sidebar */}
      <aside className="mc-sidebar">
        {/* Org mark */}
        <div className="mc-sidebar__brand">
          <OrgMark />
          <span className="mc-org-name">Meridian</span>
        </div>

        {/* Grouped nav */}
        <nav className="mc-nav" aria-label="Console navigation">
          {NAV_GROUPS.map((group) => (
            <div key={group.label} className="mc-nav__group">
              <span className="mc-nav__group-label">{group.label}</span>
              {group.items.map(({ id, label }) => (
                <button
                  key={id}
                  type="button"
                  data-target={`nav-${id}`}
                  className="mc-nav__item"
                  data-active={id === activeSection}
                  onClick={() => onSectionChange(id)}
                >
                  <NavIcon section={id} />
                  <span>{label}</span>
                </button>
              ))}
            </div>
          ))}
        </nav>

        {/* Account row */}
        <div className="mc-sidebar__footer">
          <div className="mc-user-row">
            <span className="mc-user-avatar" aria-hidden="true">R</span>
            <div className="mc-user-info">
              <span className="mc-user-name">ryan.runsheng</span>
              <span className="mc-user-role">Admin</span>
            </div>
          </div>
        </div>
      </aside>

      {/* Right panel: top chrome + scrollable main */}
      <div className="mc-panel">
        {/* Top chrome bar */}
        <header className="mc-chrome">
          <div className="mc-chrome__breadcrumb">
            <span className="mc-chrome__crumb-root">Meridian Cloud</span>
            <ChevronIcon />
            <span className="mc-chrome__crumb-leaf">{activeLabel}</span>
          </div>
          <div className="mc-chrome__search">
            <SearchIcon />
            <span className="mc-chrome__search-placeholder">Search or jump... (CMD+K)</span>
          </div>
          <div className="mc-chrome__account">
            <span className="mc-chrome__account-chip">meridian-prod</span>
          </div>
        </header>

        {/* Scrollable section content */}
        <main className="mc-main">
          {activeSection === "overview" && <OverviewSection />}
          {activeSection === "environments" && <EnvironmentsSection />}
          {activeSection === "api-keys" && <ApiKeysSection />}
          {activeSection === "team" && <TeamSection />}
          {activeSection === "billing" && <BillingSection />}
          {activeSection === "settings" && <SettingsSection />}
        </main>
      </div>
    </div>
  );
}

// --- Inline SVG icons (line, 1.5px stroke, 16px, currentColor) ---------------

function OrgMark() {
  return (
    <svg width="22" height="22" viewBox="0 0 22 22" fill="none" aria-hidden="true" className="mc-org-mark">
      <polygon points="11,2 20,7 20,15 11,20 2,15 2,7" stroke="currentColor" strokeWidth="1.5" fill="none" />
      <line x1="11" y1="2" x2="11" y2="20" stroke="currentColor" strokeWidth="1" opacity="0.4" />
      <line x1="2" y1="7" x2="20" y2="15" stroke="currentColor" strokeWidth="1" opacity="0.4" />
      <line x1="20" y1="7" x2="2" y2="15" stroke="currentColor" strokeWidth="1" opacity="0.4" />
    </svg>
  );
}

function NavIcon({ section }: { section: SectionId }) {
  switch (section) {
    case "overview":
      return (
        <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
          <rect x="1" y="1" width="6" height="6" rx="1" />
          <rect x="9" y="1" width="6" height="6" rx="1" />
          <rect x="1" y="9" width="6" height="6" rx="1" />
          <rect x="9" y="9" width="6" height="6" rx="1" />
        </svg>
      );
    case "environments":
      return (
        <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
          <rect x="1" y="3" width="14" height="4" rx="1" />
          <rect x="1" y="9" width="14" height="4" rx="1" />
          <circle cx="4.5" cy="5" r="1" fill="currentColor" stroke="none" />
          <circle cx="4.5" cy="11" r="1" fill="currentColor" stroke="none" />
        </svg>
      );
    case "api-keys":
      return (
        <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
          <circle cx="5.5" cy="8" r="3.5" />
          <path d="M8.5 8h6M12 6v4" strokeLinecap="round" />
        </svg>
      );
    case "team":
      return (
        <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
          <circle cx="6" cy="5.5" r="2.5" />
          <path d="M1 14c0-2.761 2.239-5 5-5s5 2.239 5 5" strokeLinecap="round" />
          <circle cx="12" cy="5.5" r="2" />
          <path d="M14.5 14c0-2.21-1.567-4-3.5-4" strokeLinecap="round" />
        </svg>
      );
    case "billing":
      return (
        <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
          <rect x="1" y="3.5" width="14" height="9" rx="1.5" />
          <line x1="1" y1="7" x2="15" y2="7" />
          <line x1="4" y1="10.5" x2="7" y2="10.5" strokeLinecap="round" />
        </svg>
      );
    case "settings":
      return (
        <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
          <circle cx="8" cy="8" r="2.5" />
          <path d="M8 1.5v2M8 12.5v2M1.5 8h2M12.5 8h2M3.11 3.11l1.415 1.415M11.475 11.475l1.415 1.415M12.89 3.11l-1.415 1.415M4.525 11.475l-1.415 1.415" strokeLinecap="round" />
        </svg>
      );
  }
}

function SearchIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
      <circle cx="6.5" cy="6.5" r="5" />
      <path d="M10.5 10.5l3.5 3.5" strokeLinecap="round" />
    </svg>
  );
}

function ChevronIcon() {
  return (
    <svg width="10" height="10" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true" className="mc-chrome__chevron">
      <path d="M6 4l4 4-4 4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function PlusIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
      <path d="M8 2v12M2 8h12" strokeLinecap="round" />
    </svg>
  );
}

function RotateIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
      <path d="M2.5 8a5.5 5.5 0 1 0 1.08-3.3" strokeLinecap="round" />
      <path d="M2 4l1.5 1.5L5 4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function StatusDot({ status }: { status: "ok" | "warn" | "err" | "idle" | "info" }) {
  return <span className={`mc-dot mc-dot--${status}`} aria-hidden="true" />;
}

// --- Overview section --------------------------------------------------------

function OverviewSection() {
  return (
    <div className="mc-section">
      {/* Section heading row */}
      <div className="mc-section__header">
        <div className="mc-section__heading-group">
          <h2 className="mc-section__title">Overview</h2>
          <div className="mc-section__meta">
            <StatusDot status="ok" />
            <span
              className="mc-status-label"
              data-target="env-status-badge"
            >
              All systems operational
            </span>
          </div>
        </div>
        <div className="mc-section__actions">
          <span className="mc-region-chip" data-target="region-badge">
            <span className="mc-region-chip__dot" />
            <span className="mc-region-chip__label">us-east-1</span>
          </span>
        </div>
      </div>

      {/* Instrument readout band */}
      <div className="mc-readout">
        <div className="mc-readout__col">
          <span className="mc-readout__label">Requests / 24 h</span>
          <span className="mc-readout__value">2,847,012</span>
          <span className="mc-readout__sub">
            <span className="mc-readout__caret">&#x25b2;</span> 4.2%
          </span>
        </div>
        <div className="mc-readout__divider" />
        <div className="mc-readout__col">
          <span className="mc-readout__label">Error rate</span>
          <span className="mc-readout__value">0.12%</span>
          <span className="mc-readout__sub">
            <span className="mc-readout__caret mc-readout__caret--down">&#x25bc;</span> 0.03%
          </span>
        </div>
        <div className="mc-readout__divider" />
        <div className="mc-readout__col">
          <span className="mc-readout__label">P95 latency</span>
          <span className="mc-readout__value">94 ms</span>
          <span className="mc-readout__sub">
            <span className="mc-readout__caret">&#x25b2;</span> 2 ms
          </span>
        </div>
        <div className="mc-readout__divider" />
        <div className="mc-readout__col">
          <span className="mc-readout__label">Active tokens</span>
          <span className="mc-readout__value">3</span>
          <span className="mc-readout__sub">--</span>
        </div>
        <div className="mc-readout__divider" />
        <div className="mc-readout__col mc-readout__col--wide">
          <span className="mc-readout__label">Throughput (24h)</span>
          <Sparkline />
        </div>
      </div>

      {/* Resources list */}
      <div className="mc-block">
        <div className="mc-block__header">
          <span className="mc-block__title">Resources</span>
        </div>
        <div className="mc-resource-list">
          {RESOURCES.map((r) => (
            <div key={r.name} className="mc-resource-row">
              <span className="mc-resource-row__name">{r.name}</span>
              <span className="mc-resource-row__val">{r.count}</span>
              <StatusDot status={r.status} />
              <span className="mc-resource-row__region">{r.region}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Recent activity log */}
      <div className="mc-block">
        <div className="mc-block__header">
          <span className="mc-block__title">Recent activity</span>
        </div>
        <div className="mc-log">
          {RECENT_EVENTS.map((ev, i) => (
            <div key={i} className="mc-log__row">
              <StatusDot status={ev.dot} />
              <span className="mc-log__event">{ev.event}</span>
              <span className="mc-log__actor">{ev.actor}</span>
              <span className="mc-log__time">{ev.time}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

const RESOURCES = [
  { name: "Environments", count: "3", status: "ok" as const, region: "us-east-1" },
  { name: "API Keys", count: "3", status: "ok" as const, region: "us-east-1" },
  { name: "Team members", count: "4", status: "ok" as const, region: "--" },
  { name: "Log volume", count: "1.2 TB", status: "warn" as const, region: "us-east-1" },
];

const RECENT_EVENTS = [
  { dot: "ok" as const, event: "API key rotated", actor: "ryan.runsheng", time: "03:14" },
  { dot: "info" as const, event: "New member invited", actor: "sys-deploy", time: "02:07" },
  { dot: "ok" as const, event: "Environment deployed", actor: "ci-pipeline", time: "01:52" },
  { dot: "warn" as const, event: "Usage limit 80%", actor: "system", time: "00:31" },
  { dot: "ok" as const, event: "Billing updated", actor: "ryan.runsheng", time: "-1d 18:04" },
  { dot: "ok" as const, event: "SSO domain verified", actor: "ryan.runsheng", time: "-1d 09:11" },
];

function Sparkline() {
  const pts = [18, 22, 19, 28, 25, 31, 30, 38, 34, 42, 40, 44];
  const w = 88;
  const h = 28;
  const max = Math.max(...pts);
  const min = Math.min(...pts);
  const range = max - min || 1;
  const coords = pts.map((v, i) => {
    const x = (i / (pts.length - 1)) * w;
    const y = h - ((v - min) / range) * (h - 4) - 2;
    return `${x},${y}`;
  });
  return (
    <svg
      width={w}
      height={h}
      viewBox={`0 0 ${w} ${h}`}
      className="mc-sparkline"
      aria-hidden="true"
    >
      <polyline points={coords.join(" ")} fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
    </svg>
  );
}

// --- Environments section ----------------------------------------------------

function EnvironmentsSection() {
  return (
    <div className="mc-section">
      <div className="mc-section__header">
        <h2 className="mc-section__title">Environments</h2>
        <button type="button" className="mc-btn mc-btn--ghost">
          <PlusIcon /> New environment
        </button>
      </div>

      {/* Env list as table */}
      <div className="mc-block">
        <div className="mc-block__header">
          <span className="mc-block__title">Active</span>
        </div>
        <div className="mc-env-table">
          <div className="mc-env-table__header">
            <span>Environment</span>
            <span>Region</span>
            <span>Status</span>
            <span>Last deploy</span>
            <span>Branch</span>
            <span></span>
          </div>
          {ENV_LIST.map((env) => (
            <div key={env.name} className="mc-env-table__row">
              <span className="mc-env-table__name">{env.name}</span>
              <span className="mc-env-table__mono">{env.region}</span>
              <span className="mc-env-table__status">
                <StatusDot status={env.dot} />
                <span className="mc-env-table__status-label">{env.status}</span>
              </span>
              <span className="mc-env-table__muted">{env.updated}</span>
              <span className="mc-env-table__mono">{env.branch}</span>
              <span className="mc-env-table__actions">
                <button type="button" className="mc-link-btn">Logs</button>
                <button type="button" className="mc-link-btn">Config</button>
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Detail strip for production */}
      <div className="mc-block">
        <div className="mc-block__header">
          <span className="mc-block__title">production &mdash; detail</span>
        </div>
        <div className="mc-detail-grid">
          <div className="mc-detail-grid__item">
            <span className="mc-detail-grid__label">Deploy URL</span>
            <span className="mc-detail-grid__val">https://meridian.io</span>
          </div>
          <div className="mc-detail-grid__item">
            <span className="mc-detail-grid__label">Runtime</span>
            <span className="mc-detail-grid__val">Node 20.x</span>
          </div>
          <div className="mc-detail-grid__item">
            <span className="mc-detail-grid__label">Instances</span>
            <span className="mc-detail-grid__val">4</span>
          </div>
          <div className="mc-detail-grid__item">
            <span className="mc-detail-grid__label">Memory</span>
            <span className="mc-detail-grid__val">512 MB</span>
          </div>
          <div className="mc-detail-grid__item">
            <span className="mc-detail-grid__label">Deploy SHA</span>
            <span className="mc-detail-grid__val">a3f9bc2</span>
          </div>
          <div className="mc-detail-grid__item">
            <span className="mc-detail-grid__label">Uptime</span>
            <span className="mc-detail-grid__val">99.97%</span>
          </div>
        </div>
      </div>

      {/* Danger zone -- hairline-separated, only the button is red */}
      <div className="mc-danger-zone">
        <div className="mc-danger-zone__head">
          <span className="mc-danger-zone__label">Danger zone</span>
          <p className="mc-danger-zone__desc">
            Permanently delete the <strong>production</strong> environment and all associated data. This action cannot be undone.
          </p>
        </div>
        <button
          type="button"
          className="mc-btn mc-btn--danger"
          data-target="delete-env-button"
        >
          Delete environment
        </button>
      </div>
    </div>
  );
}

const ENV_LIST = [
  { name: "production", region: "us-east-1", status: "Active", dot: "ok" as const, updated: "2 hr ago", branch: "main" },
  { name: "staging", region: "us-east-1", status: "Active", dot: "ok" as const, updated: "1 day ago", branch: "staging" },
  { name: "preview-87a3f", region: "us-east-1", status: "Idle", dot: "idle" as const, updated: "3 days ago", branch: "feat/onboarding" },
];

// --- API Keys section --------------------------------------------------------

function ApiKeysSection() {
  const [rotated, setRotated] = useState(false);
  const [scopeFilter, setScopeFilter] = useState("all");

  useEffect(() => {
    if (!rotated) return;
    const t = setTimeout(() => setRotated(false), 5000);
    return () => clearTimeout(t);
  }, [rotated]);

  const keys = rotated
    ? [
        {
          ...API_KEYS[0],
          prefix: "mc_live_a3Fn...",
          created: "just now",
          lastUsed: "--",
        },
        ...API_KEYS.slice(1),
      ]
    : API_KEYS;

  const filtered = scopeFilter === "all" ? keys : keys.filter((k) => k.scope === scopeFilter);

  return (
    <div className="mc-section">
      <div className="mc-section__header">
        <h2 className="mc-section__title">API Keys</h2>
      </div>

      <p className="mc-section__desc">
        API keys grant programmatic access to Meridian Cloud resources. Store them in a secrets manager -- never in source code.
      </p>

      {/* Toolbar */}
      <div className="mc-toolbar">
        <div className="mc-toolbar__filters">
          {(["all", "Full access", "Deploy only", "Read only"] as const).map((s) => (
            <button
              key={s}
              type="button"
              className="mc-filter-btn"
              data-active={scopeFilter === s}
              onClick={() => setScopeFilter(s)}
            >
              {s === "all" ? "All scopes" : s}
            </button>
          ))}
        </div>
        <div className="mc-toolbar__search">
          <SearchIcon />
          <input type="text" className="mc-search-input" placeholder="Filter keys..." aria-label="Filter keys" />
        </div>
        <div className="mc-toolbar__actions">
          <button type="button" className="mc-btn mc-btn--ghost">
            <PlusIcon /> Create key
          </button>
          <button
            type="button"
            className="mc-btn mc-btn--warn-line"
            data-target="rotate-key"
            onClick={() => setRotated(true)}
          >
            <RotateIcon /> Rotate key
          </button>
        </div>
      </div>

      {/* Keys table */}
      <div className="mc-key-table">
        <div className="mc-key-table__header">
          <span>Name</span>
          <span>Key prefix</span>
          <span>Scope</span>
          <span>Created</span>
          <span>Last used</span>
          <span>Usage (7d)</span>
          <span></span>
        </div>
        {filtered.map((k, i) => (
          <div
            key={k.name}
            className="mc-key-table__row"
            data-target={`key-list-item-${i}`}
          >
            <span className="mc-key-table__name">{k.name}</span>
            <span className="mc-key-table__prefix">{k.prefix}</span>
            <span className="mc-key-table__scope">{k.scope}</span>
            <span className="mc-key-table__muted">{k.created}</span>
            <span className="mc-key-table__muted">{k.lastUsed}</span>
            <span className="mc-key-table__usage">{k.usage}</span>
            <span>
              <button type="button" className="mc-link-btn">Revoke</button>
            </span>
          </div>
        ))}
      </div>

      {rotated ? (
        <div className="mc-callout mc-callout--ok" role="status">
          <StatusDot status="ok" />
          <p className="mc-callout__text">
            Key rotated. <strong>production-main</strong> now starts{" "}
            <code>mc_live_a3Fn...</code> &mdash; the previous key is immediately invalid.
          </p>
        </div>
      ) : (
        <div className="mc-callout mc-callout--warn">
          <StatusDot status="warn" />
          <p className="mc-callout__text">
            Rotating a key immediately invalidates the current key. All services using it will fail until the new key is deployed. Plan a maintenance window before rotating production keys.
          </p>
        </div>
      )}
    </div>
  );
}

const API_KEYS = [
  {
    name: "production-main",
    prefix: "mc_live_k7Bx...",
    created: "14 Jan 2025",
    lastUsed: "4 min ago",
    scope: "Full access",
    usage: "2.84B req",
  },
  {
    name: "ci-deploy",
    prefix: "mc_live_pQ2r...",
    created: "3 Mar 2025",
    lastUsed: "1 hr ago",
    scope: "Deploy only",
    usage: "143M req",
  },
  {
    name: "read-only-analytics",
    prefix: "mc_live_9wKj...",
    created: "18 Apr 2025",
    lastUsed: "2 days ago",
    scope: "Read only",
    usage: "28M req",
  },
];

// --- Team section ------------------------------------------------------------

function TeamSection() {
  return (
    <div className="mc-section">
      <div className="mc-section__header">
        <h2 className="mc-section__title">Team</h2>
        <button
          type="button"
          className="mc-btn mc-btn--primary"
          data-target="team-invite-button"
        >
          <PlusIcon /> Invite member
        </button>
      </div>

      {/* Members table */}
      <div className="mc-block">
        <div className="mc-block__header">
          <span className="mc-block__title">Members &mdash; 4</span>
        </div>
        <div className="mc-member-table">
          <div className="mc-member-table__header">
            <span>Member</span>
            <span>Role</span>
            <span>Joined</span>
            <span>Last active</span>
            <span>2FA</span>
            <span></span>
          </div>
          {TEAM_MEMBERS.map((m) => (
            <div key={m.email} className="mc-member-table__row">
              <div className="mc-member-cell">
                <span className="mc-avatar">{m.initials}</span>
                <div className="mc-member-cell__info">
                  <span className="mc-member-cell__name">{m.name}</span>
                  <span className="mc-member-cell__email">{m.email}</span>
                </div>
              </div>
              <span className="mc-role-label">{m.role}</span>
              <span className="mc-member-table__muted">{m.joined}</span>
              <span className="mc-member-table__muted">{m.lastActive}</span>
              <span>
                <StatusDot status={m.tfa ? "ok" : "warn"} />
                <span className="mc-member-table__tfa-label">{m.tfa ? "On" : "Off"}</span>
              </span>
              <span>
                <button type="button" className="mc-link-btn">Edit</button>
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Pending invitations */}
      <div className="mc-block">
        <div className="mc-block__header">
          <span className="mc-block__title">Pending invitations</span>
        </div>
        <div className="mc-invite-table">
          <div className="mc-invite-table__header">
            <span>Email</span>
            <span>Role</span>
            <span>Sent</span>
            <span>Expires</span>
            <span></span>
          </div>
          <div className="mc-invite-table__row">
            <span className="mc-invite-table__email">jin@example.io</span>
            <span className="mc-role-label">Developer</span>
            <span className="mc-invite-table__muted">2 hr ago</span>
            <span className="mc-invite-table__muted">in 22 hr</span>
            <span><button type="button" className="mc-link-btn">Resend</button></span>
          </div>
        </div>
      </div>

      {/* Role permissions summary */}
      <div className="mc-block">
        <div className="mc-block__header">
          <span className="mc-block__title">Role permissions</span>
        </div>
        <div className="mc-role-grid">
          {ROLE_PERMS.map((r) => (
            <div key={r.role} className="mc-role-grid__item">
              <span className="mc-role-grid__role">{r.role}</span>
              <span className="mc-role-grid__desc">{r.desc}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

const TEAM_MEMBERS = [
  { name: "Ryan Zhang", email: "ryan.runsheng@gmail.com", initials: "R", role: "Owner", joined: "Jan 2025", lastActive: "now", tfa: true },
  { name: "Ada Liu", email: "ada@meridian.io", initials: "A", role: "Admin", joined: "Feb 2025", lastActive: "1 hr ago", tfa: true },
  { name: "Marcus Beil", email: "m.beil@meridian.io", initials: "M", role: "Developer", joined: "Mar 2025", lastActive: "3 days ago", tfa: false },
  { name: "ci-pipeline", email: "ci@meridian.io", initials: "C", role: "Service account", joined: "Jan 2025", lastActive: "4 min ago", tfa: true },
];

const ROLE_PERMS = [
  { role: "Owner", desc: "Full control: billing, deletion, team" },
  { role: "Admin", desc: "All resources; no billing or deletion" },
  { role: "Developer", desc: "Environments, keys, logs" },
  { role: "Service account", desc: "API access only (no console)" },
];

// --- Billing section ---------------------------------------------------------

function BillingSection() {
  return (
    <div className="mc-section">
      <div className="mc-section__header">
        <h2 className="mc-section__title">Billing</h2>
        <div className="mc-section__actions">
          <span className="mc-plan-badge" data-target="billing-plan-badge">Pro</span>
          <button type="button" className="mc-btn mc-btn--ghost">Manage plan</button>
        </div>
      </div>

      {/* Billing instrument readout */}
      <div className="mc-readout">
        <div className="mc-readout__col">
          <span className="mc-readout__label">This month</span>
          <span className="mc-readout__value">$847.20</span>
          <span className="mc-readout__sub">+7.04% vs last</span>
        </div>
        <div className="mc-readout__divider" />
        <div className="mc-readout__col">
          <span className="mc-readout__label">Last month</span>
          <span className="mc-readout__value">$791.44</span>
          <span className="mc-readout__sub">--</span>
        </div>
        <div className="mc-readout__divider" />
        <div className="mc-readout__col">
          <span className="mc-readout__label">Included quota</span>
          <span className="mc-readout__value">50M req</span>
          <span className="mc-readout__sub">38M remaining</span>
        </div>
        <div className="mc-readout__divider" />
        <div className="mc-readout__col">
          <span className="mc-readout__label">Overage rate</span>
          <span className="mc-readout__value">$0.25</span>
          <span className="mc-readout__sub">per 1M req</span>
        </div>
      </div>

      {/* Usage breakdown */}
      <div className="mc-block">
        <div className="mc-block__header">
          <span className="mc-block__title">Usage breakdown</span>
        </div>
        <div className="mc-billing-table">
          <div className="mc-billing-table__header">
            <span>Service</span>
            <span>Units</span>
            <span>Rate</span>
            <span>Subtotal</span>
          </div>
          {BILLING_ROWS.map((r) => (
            <div key={r.service} className="mc-billing-table__row">
              <span className="mc-billing-table__service">{r.service}</span>
              <span className="mc-billing-table__mono">{r.units}</span>
              <span className="mc-billing-table__muted">{r.rate}</span>
              <span className="mc-billing-table__total">{r.subtotal}</span>
            </div>
          ))}
          <div className="mc-billing-table__footer">
            <span className="mc-billing-table__total-label">Total</span>
            <span className="mc-billing-table__total-val">$847.20</span>
          </div>
        </div>
      </div>

      {/* Invoice history */}
      <div className="mc-block">
        <div className="mc-block__header">
          <span className="mc-block__title">Invoices</span>
        </div>
        <div className="mc-invoice-table">
          <div className="mc-invoice-table__header">
            <span>Period</span>
            <span>Amount</span>
            <span>Status</span>
            <span></span>
          </div>
          {INVOICES.map((inv) => (
            <div key={inv.period} className="mc-invoice-table__row">
              <span className="mc-invoice-table__period">{inv.period}</span>
              <span className="mc-invoice-table__amount">{inv.amount}</span>
              <span className="mc-invoice-table__status">
                <StatusDot status={inv.dot} />
                <span>{inv.status}</span>
              </span>
              <span><button type="button" className="mc-link-btn">PDF</button></span>
            </div>
          ))}
        </div>
      </div>

      {/* Payment method */}
      <div className="mc-block">
        <div className="mc-block__header">
          <span className="mc-block__title">Payment method</span>
        </div>
        <div className="mc-payment-row">
          <span className="mc-payment-row__card">**** **** **** 4242</span>
          <span className="mc-payment-row__type">Visa</span>
          <span className="mc-payment-row__exp">Expires 08 / 27</span>
          <button type="button" className="mc-link-btn">Update</button>
        </div>
      </div>
    </div>
  );
}

const BILLING_ROWS = [
  { service: "API Requests (standard)", units: "2.84B", rate: "$0.25 / 1M", subtotal: "$711.00" },
  { service: "API Requests (priority)", units: "143M", rate: "$0.75 / 1M", subtotal: "$107.25" },
  { service: "Log retention (30d)", units: "1.2 TB", rate: "$18.00 / TB", subtotal: "$21.60" },
  { service: "Outbound data transfer", units: "189 GB", rate: "$0.04 / GB", subtotal: "$7.56" },
];

const INVOICES = [
  { period: "Apr 2025", amount: "$791.44", status: "Paid", dot: "ok" as const },
  { period: "Mar 2025", amount: "$834.10", status: "Paid", dot: "ok" as const },
  { period: "Feb 2025", amount: "$702.88", status: "Paid", dot: "ok" as const },
];

// --- Settings section --------------------------------------------------------

/**
 * Settings is a SINGLE SCROLLABLE PAGE -- no sub-tab switching.
 * data-sharing-toggle lives under Privacy -> Usage Data, several rows deep.
 * The cursor finds it by scrolling mc-main -- not by switching tabs.
 */
function SettingsSection() {
  return (
    <div className="mc-section mc-section--settings">
      <div className="mc-section__header">
        <h2 className="mc-section__title">Settings</h2>
      </div>

      {/* General */}
      <SettingsGroup title="General" desc="Basic workspace configuration.">
        <SettingsRow label="Workspace name" value="meridian-prod" action={<button type="button" className="mc-link-btn">Edit</button>} />
        <SettingsRow label="Workspace slug" value="meridian-prod" action={<button type="button" className="mc-link-btn">Edit</button>} />
        <SettingsRow label="Default region" value="us-east-1" />
        <SettingsRow label="API timeout" value="30 s" action={<button type="button" className="mc-link-btn">Edit</button>} />
        <SettingsRow label="Created" value="12 Jan 2025" />
      </SettingsGroup>

      {/* Notifications */}
      <SettingsGroup title="Notifications" desc="Control when and where Meridian sends alerts.">
        <SettingsToggleRow label="Email on deploy failure" defaultOn={true} />
        <SettingsToggleRow label="Email on budget threshold (80%)" defaultOn={true} />
        <SettingsToggleRow label="Slack alerts" defaultOn={false} sublabel="Connect Slack first under Integrations." />
        <SettingsToggleRow label="Weekly usage digest" defaultOn={true} />
        <SettingsToggleRow label="Incident post-mortems" defaultOn={false} />
      </SettingsGroup>

      {/* Security */}
      <SettingsGroup title="Security" desc="Access control and authentication policies.">
        <SettingsRow label="Session timeout" value="8 hours" action={<button type="button" className="mc-link-btn">Edit</button>} />
        <SettingsToggleRow label="Require 2FA for all members" defaultOn={false} />
        <SettingsRow label="IP allowlist" value="Disabled" action={<button type="button" className="mc-link-btn">Configure</button>} />
        <SettingsRow label="Single sign-on (SSO)" value="Not configured" action={<button type="button" className="mc-link-btn">Set up</button>} />
        <SettingsRow label="Audit log retention" value="90 days" action={<button type="button" className="mc-link-btn">Edit</button>} />
        <SettingsToggleRow label="Lock workspace on suspicious login" defaultOn={true} />
      </SettingsGroup>

      {/* Privacy -- data-sharing-toggle lives here, under Usage Data sub-section */}
      <SettingsGroup
        title="Privacy"
        desc="Control how Meridian Cloud uses your workspace data to improve its services."
      >
        <div className="mc-settings-subhead">Usage Data</div>
        <SettingsToggleRow
          label="Share anonymised usage data to improve the product"
          sublabel="Includes request patterns, error rates, and feature usage. No request payloads are ever shared."
          targetId="data-sharing-toggle"
          defaultOn={true}
        />
        <SettingsToggleRow
          label="Personalised feature suggestions"
          sublabel="Meridian may surface tips based on your usage patterns."
          defaultOn={false}
        />

        <div className="mc-settings-subhead">Data Residency</div>
        <SettingsRow
          label="Data residency region"
          value="us-east-1 (default)"
          action={<button type="button" className="mc-link-btn">Change</button>}
        />
        <SettingsToggleRow
          label="Restrict cross-region replication"
          defaultOn={false}
        />

        <div className="mc-settings-subhead">Audit &amp; Compliance</div>
        <SettingsRow label="Export audit log" value="--" action={<button type="button" className="mc-link-btn">Export CSV</button>} />
        <SettingsRow label="Data processing agreement" value="Signed (DPA v2.1)" action={<button type="button" className="mc-link-btn">View</button>} />
      </SettingsGroup>

      {/* Integrations */}
      <SettingsGroup title="Integrations" desc="Third-party services connected to this workspace.">
        <SettingsRow label="GitHub" value="Connected (org: meridian-io)" action={<button type="button" className="mc-link-btn">Disconnect</button>} />
        <SettingsRow label="PagerDuty" value="Not connected" action={<button type="button" className="mc-link-btn">Connect</button>} />
        <SettingsRow label="Datadog" value="Not connected" action={<button type="button" className="mc-link-btn">Connect</button>} />
        <SettingsRow label="Sentry" value="Not connected" action={<button type="button" className="mc-link-btn">Connect</button>} />
      </SettingsGroup>
    </div>
  );
}

function SettingsGroup({
  title,
  desc,
  children,
}: {
  title: string;
  desc?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="mc-settings-group">
      <div className="mc-settings-group__head">
        <h3 className="mc-settings-group__title">{title}</h3>
        {desc && <p className="mc-settings-group__desc">{desc}</p>}
      </div>
      <div className="mc-settings-group__body">{children}</div>
    </div>
  );
}

function SettingsRow({
  label,
  value,
  action,
}: {
  label: string;
  value: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="mc-settings-row">
      <span className="mc-settings-row__label">{label}</span>
      <span className="mc-settings-row__value">{value}</span>
      {action && <div className="mc-settings-row__action">{action}</div>}
    </div>
  );
}

function SettingsToggleRow({
  label,
  sublabel,
  defaultOn,
  targetId,
}: {
  label: string;
  sublabel?: string;
  defaultOn: boolean;
  targetId?: string;
}) {
  const [on, setOn] = useState(defaultOn);
  return (
    <div className="mc-settings-row mc-settings-row--toggle">
      <div className="mc-settings-row__text">
        <span className="mc-settings-row__label">{label}</span>
        {sublabel && <span className="mc-settings-row__sublabel">{sublabel}</span>}
      </div>
      <button
        type="button"
        className="mc-toggle"
        data-on={on}
        data-target={targetId}
        aria-label={`Toggle: ${label}`}
        aria-checked={on}
        role="switch"
        onClick={() => setOn((v) => !v)}
      >
        <span className="mc-toggle__thumb" />
      </button>
    </div>
  );
}
