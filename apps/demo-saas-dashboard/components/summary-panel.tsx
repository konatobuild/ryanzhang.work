"use client";

import type { CSSProperties, ReactNode } from "react";
import {
  IcoCheck,
  IcoCheckCircle,
  IcoFile,
  IcoHash,
  IcoInfo,
  IcoUser,
  type IconCmp,
} from "./icons";
import type { Template } from "../lib/data";
import type { FormState } from "./form-cards";

const styles: Record<string, CSSProperties> = {
  card: {
    background: "var(--panel)",
    border: "1px solid var(--line)",
    borderRadius: 16,
    padding: "22px 22px 22px",
    marginBottom: 16,
  },
  title: {
    fontSize: 15.5,
    fontWeight: 600,
    color: "var(--ink)",
    marginBottom: 16,
    letterSpacing: "-0.01em",
  },
  row: {
    display: "grid",
    gridTemplateColumns: "1fr 1.1fr",
    alignItems: "start",
    padding: "11px 0",
    borderBottom: "1px solid var(--line-2)",
    gap: 16,
  },
  rowLabel: {
    display: "flex",
    alignItems: "center",
    gap: 10,
    color: "var(--muted)",
    fontSize: 13,
    fontWeight: 500,
  },
  rowVal: {
    fontSize: 13.5,
    color: "var(--ink)",
    fontWeight: 600,
    textAlign: "left",
    overflow: "hidden",
    textOverflow: "ellipsis",
  },
  activePill: {
    display: "inline-flex",
    alignItems: "center",
    gap: 7,
    background: "var(--accent-soft)",
    color: "var(--accent)",
    padding: "4px 11px",
    borderRadius: 999,
    fontSize: 12.5,
    fontWeight: 600,
  },
  activeDot: {
    width: 7,
    height: 7,
    borderRadius: "50%",
    background: "var(--accent)",
  },
  check: {
    display: "grid",
    gridTemplateColumns: "22px 1fr",
    gap: 12,
    padding: "10px 0 6px",
    cursor: "pointer",
    alignItems: "start",
  },
  checkBox: {
    width: 18,
    height: 18,
    borderRadius: 5,
    border: "1.5px solid var(--muted-2)",
    display: "grid",
    placeItems: "center",
    marginTop: 1,
    transition: "background .15s, border-color .15s",
  },
  checkBoxActive: {
    background: "var(--accent)",
    borderColor: "var(--accent)",
    color: "white",
  },
  checkLabel: { fontSize: 13.5, fontWeight: 600, color: "var(--ink)" },
  checkSub: { fontSize: 12.5, color: "var(--muted)", marginTop: 2 },
  tip: {
    display: "grid",
    gridTemplateColumns: "34px 1fr",
    gap: 12,
    background: "var(--accent-soft)",
    borderRadius: 14,
    padding: "14px 16px",
    marginTop: 18,
  },
  tipIcon: {
    width: 34,
    height: 34,
    borderRadius: "50%",
    background: "var(--accent-3)",
    color: "var(--accent)",
    display: "grid",
    placeItems: "center",
  },
  tipTitle: { fontSize: 13.5, fontWeight: 600, color: "var(--ink)" },
  tipSub: {
    fontSize: 12.5,
    color: "var(--ink-2)",
    marginTop: 3,
    lineHeight: 1.45,
  },
  actionsCard: {
    background: "var(--panel)",
    border: "1px solid var(--line)",
    borderRadius: 16,
    padding: 14,
    display: "flex",
    flexDirection: "column",
    gap: 10,
  },
  publishBtn: {
    height: 50,
    borderRadius: 25,
    background: "linear-gradient(180deg, #4E8A76 0%, #2F5D50 100%)",
    color: "white",
    fontWeight: 600,
    fontSize: 14,
    boxShadow:
      "0 6px 18px -8px rgba(47,93,80,0.55), inset 0 1px 0 rgba(255,255,255,0.12)",
    transition: "transform .1s",
  },
  cancelBtn: {
    height: 48,
    borderRadius: 24,
    background: "var(--panel)",
    border: "1px solid var(--line)",
    color: "var(--ink-2)",
    fontWeight: 600,
    fontSize: 14,
  },
};

export type PublishSettingsState = {
  email: boolean;
  autoResponse: boolean;
  captcha: boolean;
};

function SummaryRow({
  icon: Icon,
  label,
  children,
  last,
}: {
  icon: IconCmp;
  label: string;
  children: ReactNode;
  last?: boolean;
}) {
  return (
    <div style={{ ...styles.row, ...(last ? { borderBottom: "none" } : {}) }}>
      <div style={styles.rowLabel}>
        <Icon size={15} />
        <span>{label}</span>
      </div>
      <div style={styles.rowVal}>{children}</div>
    </div>
  );
}

export function FormSummary({
  state,
  totalFields,
  requiredFields,
  template,
}: {
  state: FormState;
  totalFields: number;
  requiredFields: number;
  template: Template | undefined;
}) {
  return (
    <div style={styles.card}>
      <div style={styles.title}>Form Summary</div>
      <SummaryRow icon={IcoUser} label="Name">
        {state.name || "—"}
      </SummaryRow>
      <SummaryRow icon={IcoFile} label="Template">
        {template ? template.title : "—"}
      </SummaryRow>
      <SummaryRow icon={IcoHash} label="Total Fields">
        {totalFields}
      </SummaryRow>
      <SummaryRow icon={IcoCheckCircle} label="Required">
        {requiredFields}
      </SummaryRow>
      <SummaryRow icon={IcoCheckCircle} label="Status" last>
        <span style={styles.activePill}>
          <span style={styles.activeDot} />
          {state.status === "active" ? "Active" : "Draft"}
        </span>
      </SummaryRow>
    </div>
  );
}

function Checkbox({
  checked,
  onToggle,
  label,
  sub,
}: {
  checked: boolean;
  onToggle: () => void;
  label: string;
  sub: string;
}) {
  return (
    <div style={styles.check} onClick={onToggle}>
      <div
        style={{
          ...styles.checkBox,
          ...(checked ? styles.checkBoxActive : {}),
        }}
      >
        {checked && <IcoCheck size={12} strokeWidth={2.6} />}
      </div>
      <div>
        <div style={styles.checkLabel}>{label}</div>
        <div style={styles.checkSub}>{sub}</div>
      </div>
    </div>
  );
}

export function PublishSettings({
  settings,
  setSettings,
}: {
  settings: PublishSettingsState;
  setSettings: (
    updater: (prev: PublishSettingsState) => PublishSettingsState,
  ) => void;
}) {
  const toggle = (k: keyof PublishSettingsState) =>
    setSettings((s) => ({ ...s, [k]: !s[k] }));
  return (
    <div style={styles.card}>
      <div style={styles.title}>Publish Settings</div>
      <Checkbox
        checked={settings.email}
        onToggle={() => toggle("email")}
        label="Email Notifications"
        sub="Receive an email for each submission"
      />
      <Checkbox
        checked={settings.autoResponse}
        onToggle={() => toggle("autoResponse")}
        label="Auto Response"
        sub="Send confirmation email to submitters"
      />
      <Checkbox
        checked={settings.captcha}
        onToggle={() => toggle("captcha")}
        label="CAPTCHA Protection"
        sub="Prevent spam submissions"
      />
      <div style={styles.tip}>
        <div style={styles.tipIcon}>
          <IcoInfo size={18} />
        </div>
        <div>
          <div style={styles.tipTitle}>Tip: Share your form</div>
          <div style={styles.tipSub}>
            After publishing, you&apos;ll receive a shareable link and embed
            code
          </div>
        </div>
      </div>
    </div>
  );
}

export function Actions({
  onPublish,
  onCancel,
  publishing,
}: {
  onPublish: () => void;
  onCancel: () => void;
  publishing: boolean;
}) {
  return (
    <div style={styles.actionsCard}>
      <button
        style={styles.publishBtn}
        onClick={onPublish}
        onMouseDown={(e) => {
          e.currentTarget.style.transform = "scale(.98)";
        }}
        onMouseUp={(e) => {
          e.currentTarget.style.transform = "scale(1)";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = "scale(1)";
        }}
      >
        {publishing ? "Publishing…" : "Publish Form"}
      </button>
      <button style={styles.cancelBtn} onClick={onCancel}>
        Cancel
      </button>
    </div>
  );
}
