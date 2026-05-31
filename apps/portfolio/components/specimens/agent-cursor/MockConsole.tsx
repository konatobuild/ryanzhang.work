"use client";

/**
 * MockConsole.tsx — a fictional cloud/SaaS admin console.
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
 * Design: restrained, premium, light-ground. Hairlines instead of fills.
 * Mono accents for numbers/status. Generous whitespace. No color fills on
 * interactive elements; only state changes via hairline weight or subtle bg.
 * Inspired by Linear/Stripe filtered through Braun editorial discipline.
 */

import { useState, useEffect } from "react";
import { type SectionId } from "./scenarios";

// ─── Helpers ─────────────────────────────────────────────────────────────────

/**
 * getTargetRect — query a data-target element and return its bounding rect.
 * Returns null if the element is not in the DOM (e.g., hidden section).
 * The cursor engine should call this AFTER the section has been switched and
 * one animation frame has elapsed so layout is fresh.
 */
export function getTargetRect(id: string): DOMRect | null {
  const el = document.querySelector<HTMLElement>(`[data-target="${id}"]`);
  if (!el) return null;
  return el.getBoundingClientRect();
}

// ─── Section definitions ──────────────────────────────────────────────────────

const SECTION_DEFS: { id: SectionId; label: string }[] = [
  { id: "overview", label: "Overview" },
  { id: "environments", label: "Environments" },
  { id: "api-keys", label: "API Keys" },
  { id: "team", label: "Team" },
  { id: "billing", label: "Billing" },
  { id: "settings", label: "Settings" },
];

// ─── Props ────────────────────────────────────────────────────────────────────

type MockConsoleProps = {
  activeSection: SectionId;
  onSectionChange: (id: SectionId) => void;
};

// ─── Root component ───────────────────────────────────────────────────────────

export function MockConsole({ activeSection, onSectionChange }: MockConsoleProps) {
  return (
    <div className="mc-root">
      {/* Left sidebar */}
      <aside className="mc-sidebar">
        <div className="mc-sidebar__header">
          <span className="mc-org-mark" aria-hidden="true">⬡</span>
          <span className="mc-org-name">Meridian Cloud</span>
        </div>

        <nav className="mc-nav" aria-label="Console navigation">
          {SECTION_DEFS.map(({ id, label }) => (
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
        </nav>

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

      {/* Main content */}
      <main className="mc-main">
        {activeSection === "overview" && <OverviewSection />}
        {activeSection === "environments" && <EnvironmentsSection />}
        {activeSection === "api-keys" && <ApiKeysSection />}
        {activeSection === "team" && <TeamSection />}
        {activeSection === "billing" && <BillingSection />}
        {activeSection === "settings" && <SettingsSection />}
      </main>
    </div>
  );
}

// ─── Nav icon placeholders (SVG inline, single-weight) ───────────────────────

function NavIcon({ section }: { section: SectionId }) {
  const paths: Record<SectionId, string> = {
    overview:
      "M3 3h7v7H3V3zm8 0h7v7h-7V3zm0 8h7v7h-7v-7zm-8 0h7v7H3v-7z",
    environments:
      "M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 14H9V8h2v8zm4 0h-2V8h2v8z",
    "api-keys":
      "M12.65 10A5.99 5.99 0 007 6c-3.31 0-6 2.69-6 6s2.69 6 6 6a5.99 5.99 0 005.65-4H17v4h4v-4h2v-4H12.65zM7 14c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2z",
    team: "M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z",
    billing:
      "M20 4H4c-1.11 0-2 .89-2 2v12c0 1.11.89 2 2 2h16c1.11 0 2-.89 2-2V6c0-1.11-.89-2-2-2zm0 14H4v-6h16v6zm0-10H4V6h16v2z",
    settings:
      "M19.14 12.94c.04-.3.06-.61.06-.94 0-.32-.02-.64-.07-.94l2.03-1.58a.49.49 0 00.12-.61l-1.92-3.32a.488.488 0 00-.59-.22l-2.39.96a7.01 7.01 0 00-1.62-.94l-.36-2.54a.484.484 0 00-.48-.41h-3.84c-.24 0-.43.17-.47.41l-.36 2.54c-.59.24-1.13.57-1.62.94l-2.39-.96a.477.477 0 00-.59.22L2.74 8.87a.47.47 0 00.12.61l2.03 1.58c-.05.3-.07.62-.07.94s.02.64.07.94l-2.03 1.58a.47.47 0 00-.12.61l1.92 3.32c.12.22.37.29.59.22l2.39-.96c.5.36 1.04.69 1.62.94l.36 2.54c.05.24.24.41.48.41h3.84c.24 0 .44-.17.47-.41l.36-2.54c.59-.24 1.13-.57 1.62-.94l2.39.96c.22.08.47 0 .59-.22l1.92-3.32a.47.47 0 00-.12-.61l-2.01-1.58zM12 15.6c-1.98 0-3.6-1.62-3.6-3.6s1.62-3.6 3.6-3.6 3.6 1.62 3.6 3.6-1.62 3.6-3.6 3.6z",
  };
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
    >
      <path d={paths[section]} />
    </svg>
  );
}

// ─── Overview section ─────────────────────────────────────────────────────────

function OverviewSection() {
  return (
    <div className="mc-section">
      <div className="mc-section__header">
        <h2 className="mc-section__title">Overview</h2>
        <div className="mc-section__meta">
          <span className="mc-badge mc-badge--green" data-target="env-status-badge">
            Operational
          </span>
          <span
            className="mc-badge mc-badge--neutral"
            data-target="region-badge"
          >
            us-east-1
          </span>
        </div>
      </div>

      <div className="mc-cards-grid">
        <StatCard label="Requests / day" value="2,847,012" delta="+4.2%" />
        <StatCard label="Error rate" value="0.12%" delta="-0.03%" positive />
        <StatCard label="P95 latency" value="94 ms" delta="+2 ms" />
        <StatCard label="Active tokens" value="3" delta="" />
      </div>

      <div className="mc-section__block">
        <h3 className="mc-block-title">Recent activity</h3>
        <div className="mc-table">
          <div className="mc-table__row mc-table__row--header">
            <span>Event</span>
            <span>Actor</span>
            <span>Time</span>
            <span>Status</span>
          </div>
          {RECENT_EVENTS.map((ev, i) => (
            <div key={i} className="mc-table__row">
              <span className="mc-table__cell--name">{ev.event}</span>
              <span className="mc-table__cell--mono">{ev.actor}</span>
              <span className="mc-table__cell--muted">{ev.time}</span>
              <span>
                <span className={`mc-badge mc-badge--${ev.statusColor}`}>
                  {ev.status}
                </span>
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

const RECENT_EVENTS = [
  { event: "API key rotated", actor: "ryan.runsheng", time: "3 min ago", status: "Success", statusColor: "green" },
  { event: "New member invited", actor: "sys-deploy", time: "1 hr ago", status: "Pending", statusColor: "yellow" },
  { event: "Environment deployed", actor: "ci-pipeline", time: "2 hr ago", status: "Success", statusColor: "green" },
  { event: "Usage limit warning", actor: "system", time: "6 hr ago", status: "Warning", statusColor: "yellow" },
  { event: "Billing updated", actor: "ryan.runsheng", time: "1 day ago", status: "Success", statusColor: "green" },
];

function StatCard({ label, value, delta, positive }: { label: string; value: string; delta: string; positive?: boolean }) {
  return (
    <div className="mc-stat-card">
      <span className="mc-stat-card__label">{label}</span>
      <span className="mc-stat-card__value">{value}</span>
      {delta && (
        <span className={`mc-stat-card__delta ${positive ? "mc-stat-card__delta--pos" : ""}`}>
          {delta}
        </span>
      )}
    </div>
  );
}

// ─── Environments section ─────────────────────────────────────────────────────

function EnvironmentsSection() {
  return (
    <div className="mc-section">
      <div className="mc-section__header">
        <h2 className="mc-section__title">Environments</h2>
        <button type="button" className="mc-btn mc-btn--ghost">
          New environment
        </button>
      </div>

      {ENV_LIST.map((env) => (
        <div key={env.name} className="mc-env-card">
          <div className="mc-env-card__left">
            <span className="mc-env-card__name">{env.name}</span>
            <span className="mc-env-card__region">{env.region}</span>
          </div>
          <div className="mc-env-card__mid">
            <span className={`mc-badge mc-badge--${env.statusColor}`}>{env.status}</span>
            <span className="mc-table__cell--muted">Updated {env.updated}</span>
          </div>
          <div className="mc-env-card__actions">
            <button type="button" className="mc-btn mc-btn--ghost mc-btn--sm">
              Configure
            </button>
            <button type="button" className="mc-btn mc-btn--ghost mc-btn--sm">
              Logs
            </button>
          </div>
        </div>
      ))}

      {/* Danger Zone */}
      <div className="mc-danger-zone">
        <h3 className="mc-danger-zone__title">Danger Zone</h3>
        <p className="mc-danger-zone__body">
          Permanently delete the <strong>production</strong> environment and all
          associated data. This action cannot be undone.
        </p>
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
  { name: "production", region: "us-east-1", status: "Active", statusColor: "green", updated: "2 hr ago" },
  { name: "staging", region: "us-east-1", status: "Active", statusColor: "green", updated: "1 day ago" },
  { name: "preview-87a3f", region: "us-east-1", status: "Idle", statusColor: "neutral", updated: "3 days ago" },
];

// ─── API Keys section ─────────────────────────────────────────────────────────

function ApiKeysSection() {
  // The "Rotate key" button is a real action the user performs — the cursor
  // only points at it. On click the product responds: the production key gets
  // a fresh prefix and a confirmation replaces the warning. Auto-resets so the
  // demo can be replayed.
  const [rotated, setRotated] = useState(false);

  useEffect(() => {
    if (!rotated) return;
    const t = setTimeout(() => setRotated(false), 5000);
    return () => clearTimeout(t);
  }, [rotated]);

  const keys = rotated
    ? [
        {
          ...API_KEYS[0],
          prefix: "mc_live_a3Fn…",
          created: "just now",
          lastUsed: "—",
        },
        ...API_KEYS.slice(1),
      ]
    : API_KEYS;

  return (
    <div className="mc-section">
      <div className="mc-section__header">
        <h2 className="mc-section__title">API Keys</h2>
        <div className="mc-section__meta">
          <button type="button" className="mc-btn mc-btn--ghost">
            Create key
          </button>
          <button
            type="button"
            className="mc-btn mc-btn--warning"
            data-target="rotate-key"
            onClick={() => setRotated(true)}
          >
            Rotate key
          </button>
        </div>
      </div>

      <p className="mc-section__desc">
        Your API keys grant programmatic access to Meridian Cloud resources. Treat
        them like passwords — store them in a secrets manager, never in source code.
      </p>

      <div className="mc-table">
        <div className="mc-table__row mc-table__row--header">
          <span>Name</span>
          <span>Key prefix</span>
          <span>Created</span>
          <span>Last used</span>
          <span>Scope</span>
          <span></span>
        </div>
        {keys.map((k, i) => (
          <div
            key={k.name}
            className="mc-table__row"
            data-target={`key-list-item-${i}`}
          >
            <span className="mc-table__cell--name">{k.name}</span>
            <span className="mc-table__cell--mono">{k.prefix}</span>
            <span className="mc-table__cell--muted">{k.created}</span>
            <span className="mc-table__cell--muted">{k.lastUsed}</span>
            <span>
              <span className="mc-badge mc-badge--neutral">{k.scope}</span>
            </span>
            <span>
              <button type="button" className="mc-link-btn">Revoke</button>
            </span>
          </div>
        ))}
      </div>

      {rotated ? (
        <div className="mc-callout mc-callout--ok" role="status">
          <span className="mc-callout__icon" aria-hidden="true">✓</span>
          <p className="mc-callout__text">
            Key rotated. <strong>production-main</strong> now starts{" "}
            <code>mc_live_a3Fn…</code> — the previous key is now invalid.
          </p>
        </div>
      ) : (
        <div className="mc-callout mc-callout--warn">
          <span className="mc-callout__icon" aria-hidden="true">⚠</span>
          <p className="mc-callout__text">
            Rotating a key immediately invalidates the current key. All services
            using it will fail until the new key is deployed. Plan a maintenance
            window before rotating production keys.
          </p>
        </div>
      )}
    </div>
  );
}

const API_KEYS = [
  { name: "production-main", prefix: "mc_live_k7Bx…", created: "14 Jan 2025", lastUsed: "4 min ago", scope: "Full access" },
  { name: "ci-deploy", prefix: "mc_live_pQ2r…", created: "3 Mar 2025", lastUsed: "1 hr ago", scope: "Deploy only" },
  { name: "read-only-analytics", prefix: "mc_live_9wKj…", created: "18 Apr 2025", lastUsed: "2 days ago", scope: "Read only" },
];

// ─── Team section ─────────────────────────────────────────────────────────────

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
          Invite member
        </button>
      </div>

      <div className="mc-table">
        <div className="mc-table__row mc-table__row--header">
          <span>Member</span>
          <span>Role</span>
          <span>Joined</span>
          <span>2FA</span>
          <span></span>
        </div>
        {TEAM_MEMBERS.map((m) => (
          <div key={m.email} className="mc-table__row">
            <div className="mc-member-cell">
              <span className="mc-avatar">{m.initials}</span>
              <div>
                <span className="mc-table__cell--name">{m.name}</span>
                <span className="mc-table__cell--muted">{m.email}</span>
              </div>
            </div>
            <span>
              <span className="mc-badge mc-badge--neutral">{m.role}</span>
            </span>
            <span className="mc-table__cell--muted">{m.joined}</span>
            <span>
              <span className={`mc-badge mc-badge--${m.tfa ? "green" : "yellow"}`}>
                {m.tfa ? "Enabled" : "Disabled"}
              </span>
            </span>
            <span>
              <button type="button" className="mc-link-btn">Edit</button>
            </span>
          </div>
        ))}
      </div>

      <div className="mc-section__block">
        <h3 className="mc-block-title">Pending invitations</h3>
        <div className="mc-table">
          <div className="mc-table__row mc-table__row--header">
            <span>Email</span>
            <span>Role</span>
            <span>Sent</span>
            <span>Expires</span>
            <span></span>
          </div>
          <div className="mc-table__row">
            <span className="mc-table__cell--mono">jin@example.io</span>
            <span><span className="mc-badge mc-badge--neutral">Developer</span></span>
            <span className="mc-table__cell--muted">2 hr ago</span>
            <span className="mc-table__cell--muted">in 22 hr</span>
            <span><button type="button" className="mc-link-btn">Resend</button></span>
          </div>
        </div>
      </div>
    </div>
  );
}

const TEAM_MEMBERS = [
  { name: "Ryan Zhang", email: "ryan.runsheng@gmail.com", initials: "R", role: "Owner", joined: "Jan 2025", tfa: true },
  { name: "Ada Liu", email: "ada@meridian.io", initials: "A", role: "Admin", joined: "Feb 2025", tfa: true },
  { name: "Marcus Beil", email: "m.beil@meridian.io", initials: "M", role: "Developer", joined: "Mar 2025", tfa: false },
  { name: "ci-pipeline", email: "ci@meridian.io", initials: "C", role: "Service account", joined: "Jan 2025", tfa: true },
];

// ─── Billing section ──────────────────────────────────────────────────────────

function BillingSection() {
  return (
    <div className="mc-section">
      <div className="mc-section__header">
        <h2 className="mc-section__title">Billing</h2>
        <span className="mc-badge mc-badge--green" data-target="billing-plan-badge">
          Pro plan
        </span>
      </div>

      <div className="mc-cards-grid mc-cards-grid--3">
        <StatCard label="This month" value="$847.20" delta="" />
        <StatCard label="Last month" value="$791.44" delta="" />
        <StatCard label="Included quota" value="50M req" delta="38M remaining" positive />
      </div>

      <div className="mc-section__block">
        <h3 className="mc-block-title">Usage breakdown</h3>
        <div className="mc-table">
          <div className="mc-table__row mc-table__row--header">
            <span>Service</span>
            <span>Units</span>
            <span>Rate</span>
            <span>Subtotal</span>
          </div>
          {BILLING_ROWS.map((r) => (
            <div key={r.service} className="mc-table__row">
              <span className="mc-table__cell--name">{r.service}</span>
              <span className="mc-table__cell--mono">{r.units}</span>
              <span className="mc-table__cell--muted">{r.rate}</span>
              <span className="mc-table__cell--mono">{r.subtotal}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="mc-section__block">
        <h3 className="mc-block-title">Payment method</h3>
        <div className="mc-payment-row">
          <span className="mc-payment-row__card">•••• •••• •••• 4242</span>
          <span className="mc-badge mc-badge--neutral">Visa</span>
          <span className="mc-table__cell--muted">Expires 08 / 27</span>
          <button type="button" className="mc-link-btn">Update</button>
        </div>
      </div>
    </div>
  );
}

const BILLING_ROWS = [
  { service: "API Requests (standard)", units: "2.84B", rate: "$0.25 / 1M", subtotal: "$711.00" },
  { service: "API Requests (priority)", units: "143M", rate: "$0.75 / 1M", subtotal: "$107.25" },
  { service: "Log retention (30 days)", units: "1.2 TB", rate: "$18.00 / TB", subtotal: "$21.60" },
  { service: "Outbound data transfer", units: "189 GB", rate: "$0.04 / GB", subtotal: "$7.56" },
];

// ─── Settings section ─────────────────────────────────────────────────────────

function SettingsSection() {
  return (
    <div className="mc-section">
      <div className="mc-section__header">
        <h2 className="mc-section__title">Settings</h2>
      </div>

      {/* General */}
      <div className="mc-settings-group">
        <h3 className="mc-settings-group__title">General</h3>
        <SettingsRow
          label="Workspace name"
          value="meridian-prod"
          action={<button type="button" className="mc-link-btn">Edit</button>}
        />
        <SettingsRow
          label="Default region"
          value="us-east-1"
        />
        <SettingsRow
          label="Timeout (API)"
          value="30 s"
          action={<button type="button" className="mc-link-btn">Edit</button>}
        />
      </div>

      {/* Notifications */}
      <div className="mc-settings-group">
        <h3 className="mc-settings-group__title">Notifications</h3>
        <SettingsToggleRow
          label="Email on deploy failure"
          defaultOn={true}
        />
        <SettingsToggleRow
          label="Slack alerts"
          defaultOn={false}
        />
        <SettingsToggleRow
          label="Weekly usage digest"
          defaultOn={true}
        />
      </div>

      {/* Security */}
      <div className="mc-settings-group">
        <h3 className="mc-settings-group__title">Security</h3>
        <SettingsRow
          label="Session timeout"
          value="8 hours"
          action={<button type="button" className="mc-link-btn">Edit</button>}
        />
        <SettingsToggleRow label="Require 2FA for all members" defaultOn={false} />
        <SettingsRow
          label="IP allowlist"
          value="Disabled"
          action={<button type="button" className="mc-link-btn">Configure</button>}
        />
        <SettingsRow
          label="Single sign-on (SSO)"
          value="Not configured"
          action={<button type="button" className="mc-link-btn">Set up</button>}
        />
      </div>

      {/* Privacy — this is where data-sharing-toggle lives, buried */}
      <div className="mc-settings-group">
        <h3 className="mc-settings-group__title">Privacy</h3>
        <p className="mc-settings-group__desc">
          Control how Meridian Cloud uses your workspace data to improve its
          services.
        </p>
        <div className="mc-settings-subgroup">
          <h4 className="mc-settings-subgroup__title">Usage Data</h4>
          <SettingsToggleRow
            label="Share anonymised usage data to improve the product"
            sublabel="Includes request patterns, error rates, and feature usage. No request payloads are ever shared."
            targetId="data-sharing-toggle"
            defaultOn={true}
          />
          <SettingsToggleRow
            label="Personalised feature suggestions"
            defaultOn={false}
          />
        </div>
        <div className="mc-settings-subgroup">
          <h4 className="mc-settings-subgroup__title">Audit Log Retention</h4>
          <SettingsRow
            label="Retention period"
            value="90 days"
            action={<button type="button" className="mc-link-btn">Edit</button>}
          />
        </div>
      </div>

      {/* Integrations */}
      <div className="mc-settings-group">
        <h3 className="mc-settings-group__title">Integrations</h3>
        <SettingsRow
          label="GitHub"
          value="Connected (org: meridian-io)"
          action={<button type="button" className="mc-link-btn">Disconnect</button>}
        />
        <SettingsRow
          label="PagerDuty"
          value="Not connected"
          action={<button type="button" className="mc-link-btn">Connect</button>}
        />
        <SettingsRow
          label="Datadog"
          value="Not connected"
          action={<button type="button" className="mc-link-btn">Connect</button>}
        />
      </div>
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
      <div className="mc-settings-row__left">
        <span className="mc-settings-row__label">{label}</span>
        <span className="mc-settings-row__value">{value}</span>
      </div>
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
  // Real local state so the user can actually flip it — the cursor only points.
  const [on, setOn] = useState(defaultOn);
  return (
    <div className="mc-settings-row">
      <div className="mc-settings-row__left">
        <span className="mc-settings-row__label">{label}</span>
        {sublabel && (
          <span className="mc-settings-row__sublabel">{sublabel}</span>
        )}
      </div>
      <div className="mc-settings-row__action">
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
    </div>
  );
}
