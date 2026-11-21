"use client";

import { useSyncExternalStore } from "react";

type Choice = "system" | "paper" | "ink";

const OPTIONS: { value: Choice; label: string }[] = [
  { value: "system", label: "System" },
  { value: "paper", label: "Light" },
  { value: "ink", label: "Dark" },
];

const listeners = new Set<() => void>();

function subscribe(cb: () => void) {
  listeners.add(cb);
  return () => {
    listeners.delete(cb);
  };
}

function read(): Choice {
  try {
    const v = localStorage.getItem("theme");
    return v === "ink" || v === "paper" ? v : "system";
  } catch {
    return "system";
  }
}

function choose(value: Choice) {
  const root = document.documentElement;
  try {
    if (value === "system") localStorage.removeItem("theme");
    else localStorage.setItem("theme", value);
  } catch {
    /* private mode: the switch still works for this page view */
  }
  root.dataset.theme =
    value === "system"
      ? window.matchMedia("(prefers-color-scheme: dark)").matches
        ? "ink"
        : "paper"
      : value;
  listeners.forEach((l) => l());
}

/**
 * Appearance: follow the system, or pin light or dark. It lives in the
 * footer: a setting, not a destination. The stored choice is applied
 * before paint by the inline script in the layout.
 */
export function ThemeSwitch() {
  const current = useSyncExternalStore(subscribe, read, () => "system" as Choice);
  return (
    <div className="seg" role="radiogroup" aria-label="Appearance">
      {OPTIONS.map((o) => (
        <button
          key={o.value}
          type="button"
          role="radio"
          aria-checked={current === o.value}
          onClick={() => choose(o.value)}
        >
          {o.label}
        </button>
      ))}
    </div>
  );
}
