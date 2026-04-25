import { useState } from "react";
import { Icon } from "./icons";
import type { IconName } from "../lib/data";

interface Props {
  onSubmit: () => void;
  onCancel: () => void;
}

interface MonthCell {
  d: number;
  muted: boolean;
}

function buildJan2024Grid(): MonthCell[] {
  // Weeks start Saturday (per reference).
  // Jan 2024: Mon Jan 1 .. Wed Jan 31.
  // Pad from Sat Dec 30 → Sat Feb 3 inclusive.
  const cells: MonthCell[] = [];
  cells.push({ d: 30, muted: true });
  cells.push({ d: 31, muted: true });
  for (let d = 1; d <= 31; d++) cells.push({ d, muted: false });
  for (let d = 1; d <= 3; d++) cells.push({ d, muted: true });
  return cells;
}

const SLOT_OPTS: { id: string; icon: IconName; title: string; sub: string }[] = [
  { id: "any", icon: "clock", title: "Any time", sub: "All hours" },
  { id: "morning", icon: "sun", title: "Morning", sub: "Before 12pm" },
  { id: "afternoon", icon: "moon", title: "Afternoon", sub: "After 12pm" },
];

function MonthCalendar({
  selected,
  setSelected,
}: {
  selected: number;
  setSelected: (d: number) => void;
}) {
  const cells = buildJan2024Grid();
  return (
    <div className="cal">
      <div className="cal-head">
        <button type="button" className="icon-btn" aria-label="Previous month">
          <Icon name="chevronLeft" size={14} />
        </button>
        <div className="cal-title">Jan 2024</div>
        <button type="button" className="icon-btn" aria-label="Next month">
          <Icon name="chevronRight" size={14} />
        </button>
      </div>
      <div className="cal-grid">
        {["Sat", "Sun", "Mon", "Tue", "Wed", "Thu", "Fri"].map((d) => (
          <div key={d} className="cal-dow">
            {d}
          </div>
        ))}
        {cells.map((c, i) => {
          const isSelected = !c.muted && c.d === selected;
          const isToday = !c.muted && c.d === 22;
          return (
            <div
              key={i}
              role="button"
              tabIndex={c.muted ? -1 : 0}
              className={
                "cal-day" +
                (c.muted ? " muted" : "") +
                (isToday ? " today" : "") +
                (isSelected ? " selected" : "")
              }
              onClick={() => !c.muted && setSelected(c.d)}
              onKeyDown={(e) => {
                if (!c.muted && (e.key === "Enter" || e.key === " ")) {
                  e.preventDefault();
                  setSelected(c.d);
                }
              }}
            >
              {c.d}
            </div>
          );
        })}
      </div>
    </div>
  );
}

export function RightPanel({ onSubmit, onCancel }: Props) {
  const [selectedDate, setSelectedDate] = useState(23);
  const [slot, setSlot] = useState("any");
  const [from] = useState("12:45 PM");
  const [to] = useState("01:45 PM");

  return (
    <section className="rp">
      <header className="rp-head">
        <h2 className="rp-title">Add Waitlist</h2>
        <button
          type="button"
          className="rp-close"
          onClick={onCancel}
          aria-label="Close panel"
        >
          <Icon name="arrowRight" size={14} />
        </button>
      </header>

      <div className="rp-body scroll">
        <div className="rp-row">
          <div className="rp-avatar">LK</div>
          <div className="rp-row-body">
            <div className="rp-row-title">Liam Kim</div>
            <div className="rp-row-sub">+1 889-789-885</div>
          </div>
          <button type="button" className="rp-edit" aria-label="Edit customer">
            <Icon name="pencil" size={13} />
          </button>
        </div>

        <div className="rp-row">
          <div className="rp-avatar svc">
            <Icon name="yoga" size={18} />
          </div>
          <div className="rp-row-body">
            <div className="rp-row-title">Yoga</div>
            <div className="rp-row-sub">30 MIN · $59.99</div>
          </div>
          <button type="button" className="rp-edit" aria-label="Edit service">
            <Icon name="pencil" size={13} />
          </button>
        </div>

        <div className="rp-section-title">
          Preferred Date &amp; Time
          <span className="small">Jan {selectedDate} · Tue</span>
        </div>
        <MonthCalendar selected={selectedDate} setSelected={setSelectedDate} />

        <div className="rp-section-title">Preferred Time Slot</div>
        <div className="slots">
          {SLOT_OPTS.map((o) => (
            <button
              key={o.id}
              type="button"
              className={"slot" + (slot === o.id ? " active" : "")}
              onClick={() => setSlot(o.id)}
            >
              <span className="ic">
                <Icon name={o.icon} size={18} />
              </span>
              <span className="s-title">{o.title}</span>
              <span className="s-sub">{o.sub}</span>
            </button>
          ))}
        </div>

        <div className="time-pair">
          <div className="time-input">
            <span>{from}</span>
            <Icon name="chevronDown" size={14} />
          </div>
          <div className="time-input">
            <span>{to}</span>
            <Icon name="chevronDown" size={14} />
          </div>
        </div>
      </div>

      <footer className="rp-foot">
        <button type="button" className="btn btn-ghost" onClick={onCancel}>
          Back
        </button>
        <div style={{ display: "flex", gap: 8 }}>
          <button type="button" className="btn btn-outline" onClick={onCancel}>
            Cancel
          </button>
          <button
            type="button"
            className="btn btn-primary accent"
            onClick={onSubmit}
          >
            Next
          </button>
        </div>
      </footer>
    </section>
  );
}
