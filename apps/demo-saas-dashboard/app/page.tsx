"use client";

import { useCallback, useState, type CSSProperties } from "react";
import { Header } from "../components/header";
import { Sidebar } from "../components/sidebar";
import {
  AddFormFields,
  FormInformation,
  Templates,
  type FormState,
} from "../components/form-cards";
import {
  Actions,
  FormSummary,
  PublishSettings,
  type PublishSettingsState,
} from "../components/summary-panel";
import { IcoCheckCircle } from "../components/icons";
import {
  TEMPLATES,
  type FieldType,
  type NavId,
  type TemplateId,
} from "../lib/data";

const styles: Record<string, CSSProperties> = {
  shell: {
    display: "flex",
    minHeight: "100vh",
    background: "var(--bg)",
  },
  main: {
    flex: 1,
    display: "flex",
    flexDirection: "column",
    minWidth: 0,
  },
  body: { padding: "24px 32px 48px", flex: 1 },
  h1: {
    fontSize: 28,
    fontWeight: 700,
    color: "var(--ink)",
    letterSpacing: "-0.02em",
    margin: "4px 0 4px",
  },
  sub: { fontSize: 13.5, color: "var(--muted)", marginBottom: 24 },
  grid: {
    display: "grid",
    gridTemplateColumns: "minmax(0, 1fr) 340px",
    gap: 20,
    alignItems: "start",
  },
  rightCol: {
    position: "sticky",
    top: 24,
    display: "flex",
    flexDirection: "column",
  },
  toast: {
    position: "fixed",
    top: 88,
    right: 32,
    background: "var(--accent)",
    color: "white",
    padding: "12px 18px",
    borderRadius: 12,
    fontSize: 13.5,
    fontWeight: 600,
    boxShadow: "0 10px 30px -10px rgba(47,93,80,0.5)",
    zIndex: 50,
    display: "flex",
    alignItems: "center",
    gap: 10,
  },
};

export default function Page() {
  const [activeNav, setActiveNav] = useState<NavId>("forms");
  const [state, setState] = useState<FormState>({
    name: "Weekend Intensive Booking Form",
    description: "",
    status: "active",
  });
  const [templateId, setTemplateId] = useState<TemplateId>("blank");
  const [customFieldCount, setCustomFieldCount] = useState(0);
  const [settings, setSettings] = useState<PublishSettingsState>({
    email: false,
    autoResponse: false,
    captcha: false,
  });
  const [publishing, setPublishing] = useState(false);
  const [toast, setToast] = useState<string | null>(null);

  const template = TEMPLATES.find((t) => t.id === templateId);
  const totalFields = (template?.fields ?? 0) + customFieldCount;
  const requiredFields = Math.max(0, Math.floor(totalFields * 0.5));

  const flashToast = useCallback((msg: string, ms = 1800) => {
    setToast(msg);
    window.setTimeout(() => setToast(null), ms);
  }, []);

  const handlePublish = () => {
    setPublishing(true);
    window.setTimeout(() => {
      setPublishing(false);
      flashToast("Form published successfully", 2400);
    }, 900);
  };

  const handleCancel = () => flashToast("Changes discarded");

  const addField = (f: FieldType) => {
    setCustomFieldCount((n) => n + 1);
    flashToast(`Added "${f.label}" field`, 1500);
  };

  return (
    <div style={styles.shell}>
      <Sidebar active={activeNav} onChange={setActiveNav} />
      <div style={styles.main}>
        <Header />
        <div style={styles.body}>
          <h1 style={styles.h1}>Create New Booking Form</h1>
          <div style={styles.sub}>Fill out the form details below</div>
          <div style={styles.grid}>
            <div style={{ minWidth: 0 }}>
              <FormInformation state={state} setState={setState} />
              <Templates
                selected={templateId}
                onSelect={(t) => setTemplateId(t.id)}
              />
              <AddFormFields onAdd={addField} />
            </div>
            <div style={styles.rightCol}>
              <FormSummary
                state={state}
                totalFields={totalFields}
                requiredFields={requiredFields}
                template={template}
              />
              <PublishSettings settings={settings} setSettings={setSettings} />
              <Actions
                onPublish={handlePublish}
                onCancel={handleCancel}
                publishing={publishing}
              />
            </div>
          </div>
        </div>
      </div>
      {toast && (
        <div style={styles.toast}>
          <IcoCheckCircle size={16} />
          <span>{toast}</span>
        </div>
      )}
    </div>
  );
}
