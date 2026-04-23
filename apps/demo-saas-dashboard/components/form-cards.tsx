"use client";

import {
  useState,
  type CSSProperties,
  type InputHTMLAttributes,
  type TextareaHTMLAttributes,
} from "react";
import { FIELDS, TEMPLATES, type FieldType, type Template } from "../lib/data";

export type FormState = {
  name: string;
  description: string;
  status: "active" | "draft";
};

const styles: Record<string, CSSProperties> = {
  card: {
    background: "var(--panel)",
    border: "1px solid var(--line)",
    borderRadius: 16,
    padding: "22px 24px 24px",
    marginBottom: 16,
  },
  title: {
    fontSize: 15.5,
    fontWeight: 600,
    color: "var(--ink)",
    marginBottom: 18,
    letterSpacing: "-0.01em",
  },
  label: {
    fontSize: 12.5,
    fontWeight: 500,
    color: "var(--ink-2)",
    marginBottom: 7,
    display: "block",
  },
  input: {
    width: "100%",
    height: 42,
    padding: "0 16px",
    background: "var(--bg)",
    border: "1px solid transparent",
    borderRadius: 22,
    fontSize: 13.5,
    color: "var(--ink)",
    transition: "border-color .15s, background .15s",
  },
  inputFocus: {
    borderColor: "var(--accent)",
    background: "var(--panel)",
  },
  textarea: {
    width: "100%",
    minHeight: 86,
    padding: "12px 16px",
    background: "var(--bg)",
    border: "1px solid transparent",
    borderRadius: 14,
    fontSize: 13.5,
    color: "var(--ink)",
    resize: "vertical",
    transition: "border-color .15s, background .15s",
  },
  fieldWrap: { marginBottom: 16 },
  radioRow: { display: "flex", gap: 22, marginTop: 8 },
  radio: {
    display: "flex",
    alignItems: "center",
    gap: 8,
    cursor: "pointer",
    fontSize: 13.5,
    color: "var(--ink-2)",
    userSelect: "none",
  },
  radioDot: {
    width: 18,
    height: 18,
    borderRadius: "50%",
    border: "1.5px solid var(--muted-2)",
    display: "grid",
    placeItems: "center",
    transition: "border-color .15s",
  },
  radioDotActive: { borderColor: "var(--accent)" },
  templateGrid: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: 12,
  },
  template: {
    background: "var(--bg)",
    border: "1.5px solid transparent",
    borderRadius: 12,
    padding: "14px 16px 14px",
    cursor: "pointer",
    transition: "border-color .15s, background .15s",
  },
  templateActive: {
    borderColor: "var(--accent)",
    background: "var(--panel)",
    boxShadow: "0 0 0 4px rgba(47,93,80,0.06)",
  },
  templateTitle: {
    display: "flex",
    alignItems: "center",
    gap: 10,
    fontSize: 13.5,
    fontWeight: 600,
    color: "var(--ink)",
    marginBottom: 4,
    whiteSpace: "nowrap",
  },
  templateSub: {
    fontSize: 12.5,
    color: "var(--muted)",
    marginLeft: 26,
    whiteSpace: "nowrap",
  },
  fieldGrid: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: 12,
  },
  fieldTile: {
    display: "flex",
    alignItems: "center",
    gap: 12,
    background: "var(--bg)",
    borderRadius: 10,
    padding: "12px 16px",
    cursor: "pointer",
    border: "1px solid transparent",
    transition: "background .15s, border-color .15s",
    fontSize: 13.5,
    fontWeight: 500,
    color: "var(--ink-2)",
  },
  fieldIconWrap: {
    width: 24,
    height: 24,
    display: "grid",
    placeItems: "center",
    color: "var(--accent)",
  },
};

function Input({
  value,
  onChange,
  ...rest
}: {
  value: string;
  onChange: (v: string) => void;
} & Omit<InputHTMLAttributes<HTMLInputElement>, "onChange" | "value" | "style">) {
  const [focus, setFocus] = useState(false);
  return (
    <input
      style={{ ...styles.input, ...(focus ? styles.inputFocus : {}) }}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      onFocus={() => setFocus(true)}
      onBlur={() => setFocus(false)}
      {...rest}
    />
  );
}

function Textarea({
  value,
  onChange,
  ...rest
}: {
  value: string;
  onChange: (v: string) => void;
} & Omit<
  TextareaHTMLAttributes<HTMLTextAreaElement>,
  "onChange" | "value" | "style"
>) {
  const [focus, setFocus] = useState(false);
  return (
    <textarea
      style={{ ...styles.textarea, ...(focus ? styles.inputFocus : {}) }}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      onFocus={() => setFocus(true)}
      onBlur={() => setFocus(false)}
      {...rest}
    />
  );
}

function Radio({
  checked,
  onClick,
  label,
}: {
  checked: boolean;
  onClick: () => void;
  label: string;
}) {
  return (
    <div style={styles.radio} onClick={onClick}>
      <div
        style={{
          ...styles.radioDot,
          ...(checked ? styles.radioDotActive : {}),
        }}
      >
        {checked && (
          <span
            style={{
              width: 9,
              height: 9,
              borderRadius: "50%",
              background: "var(--accent)",
            }}
          />
        )}
      </div>
      <span style={checked ? { color: "var(--ink)", fontWeight: 500 } : {}}>
        {label}
      </span>
    </div>
  );
}

export function FormInformation({
  state,
  setState,
}: {
  state: FormState;
  setState: (updater: (prev: FormState) => FormState) => void;
}) {
  return (
    <div style={styles.card}>
      <div style={styles.title}>Form Information</div>
      <div style={styles.fieldWrap}>
        <label style={styles.label}>Form Name</label>
        <Input
          value={state.name}
          onChange={(v) => setState((s) => ({ ...s, name: v }))}
          placeholder="Enter form name"
        />
      </div>
      <div style={styles.fieldWrap}>
        <label style={styles.label}>Description</label>
        <Textarea
          value={state.description}
          onChange={(v) => setState((s) => ({ ...s, description: v }))}
          placeholder="Brief description of this form's purpose..."
        />
      </div>
      <div style={{ marginTop: 22 }}>
        <label style={styles.label}>Form Status</label>
        <div style={styles.radioRow}>
          <Radio
            checked={state.status === "active"}
            onClick={() => setState((s) => ({ ...s, status: "active" }))}
            label="Active"
          />
          <Radio
            checked={state.status === "draft"}
            onClick={() => setState((s) => ({ ...s, status: "draft" }))}
            label="Draft"
          />
        </div>
      </div>
    </div>
  );
}

export function Templates({
  selected,
  onSelect,
}: {
  selected: string;
  onSelect: (t: Template) => void;
}) {
  return (
    <div style={styles.card}>
      <div style={styles.title}>Start With a Template</div>
      <div style={styles.templateGrid}>
        {TEMPLATES.map((t) => {
          const active = selected === t.id;
          const Icon = t.icon;
          return (
            <div
              key={t.id}
              style={{
                ...styles.template,
                ...(active ? styles.templateActive : {}),
              }}
              onClick={() => onSelect(t)}
            >
              <div style={styles.templateTitle}>
                <Icon
                  size={17}
                  style={{
                    color: active ? "var(--accent)" : "var(--ink-2)",
                  }}
                />
                <span>{t.title}</span>
              </div>
              <div style={styles.templateSub}>{t.sub}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function FieldTile({ field, onAdd }: { field: FieldType; onAdd: () => void }) {
  const [hover, setHover] = useState(false);
  const Icon = field.icon;
  return (
    <div
      style={{
        ...styles.fieldTile,
        ...(hover
          ? { background: "var(--panel)", borderColor: "var(--accent-3)" }
          : {}),
      }}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      onClick={onAdd}
    >
      <div style={styles.fieldIconWrap}>
        <Icon size={16} />
      </div>
      <span>{field.label}</span>
    </div>
  );
}

export function AddFormFields({ onAdd }: { onAdd: (f: FieldType) => void }) {
  return (
    <div style={styles.card}>
      <div style={styles.title}>Add Form Fields</div>
      <div style={styles.fieldGrid}>
        {FIELDS.map((f) => (
          <FieldTile key={f.id} field={f} onAdd={() => onAdd(f)} />
        ))}
      </div>
    </div>
  );
}
