"use client";

import type { CaseCategory } from "@/lib/cases";

export type WorkFilterValue = "all" | CaseCategory;

interface WorkFilterProps {
  value: WorkFilterValue;
  onChange: (value: WorkFilterValue) => void;
}

const options: Array<{ value: WorkFilterValue; label: string }> = [
  { value: "all", label: "All" },
  { value: "landing", label: "Landing" },
  { value: "web-app", label: "Apps" },
  { value: "mobile", label: "Mobile" },
];

export function WorkFilter({ value, onChange }: WorkFilterProps) {
  return (
    <div
      role="tablist"
      aria-label="Work category filter"
      className="inline-flex items-center gap-1 rounded-full p-1"
      style={{ backgroundColor: "rgba(0,0,0,0.05)" }}
    >
      {options.map((opt) => {
        const active = opt.value === value;
        return (
          <button
            key={opt.value}
            type="button"
            role="tab"
            aria-selected={active}
            onClick={() => onChange(opt.value)}
            className={[
              "inline-flex items-center h-8 px-4 rounded-full text-[13px] font-medium transition-colors",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--color-klein)] focus-visible:ring-offset-0",
              active
                ? "bg-[color:var(--color-ink)] text-white"
                : "text-[color:var(--color-ink)]/70 hover:text-[color:var(--color-ink)]",
            ].join(" ")}
          >
            {opt.label}
          </button>
        );
      })}
    </div>
  );
}
