import { Icon } from "./icons";
import {
  DAYS,
  END_HOUR,
  EVENTS,
  HOUR_PX,
  START_HOUR,
  STATS,
  type CalEvent,
} from "../lib/data";

type CalendarView = "Day" | "Week" | "Month" | "Staff";

interface MainProps {
  view: CalendarView;
  setView: (v: CalendarView) => void;
  onNewAppointment: () => void;
  onEventClick: (ev: CalEvent) => void;
  onQuickAction: (label: string) => void;
}

function formatHour(h: number) {
  const suf = h < 12 ? "AM" : "PM";
  const hh = ((h + 11) % 12) + 1;
  return `${String(hh).padStart(2, "0")}:00 ${suf}`;
}

function TimeGutter() {
  const hours: number[] = [];
  for (let h = START_HOUR; h < END_HOUR; h++) hours.push(h);
  return (
    <div className="time-col">
      {hours.map((h) => (
        <div key={h} className="time-slot">
          {formatHour(h)}
        </div>
      ))}
    </div>
  );
}

function EventCard({
  ev,
  onClick,
}: {
  ev: CalEvent;
  onClick: () => void;
}) {
  const top = ((ev.start - START_HOUR * 60) / 60) * HOUR_PX;
  const height = ((ev.end - ev.start) / 60) * HOUR_PX - 4;
  const tiny = height < 54;
  return (
    <button
      type="button"
      className={"event c-" + ev.color + (tiny ? " tiny" : "")}
      style={{ top, height }}
      onClick={onClick}
    >
      <div className="e-head">
        <div className="e-title">{ev.title}</div>
        {!tiny && <div className="e-sub">{ev.sub}</div>}
      </div>
      <div className="e-mins">
        <span className="e-num">{ev.num}</span>
        <span className="e-unit">MIN</span>
      </div>
    </button>
  );
}

function DayColumn({
  dayIdx,
  onEventClick,
  showNow,
  nowTop,
}: {
  dayIdx: number;
  onEventClick: (ev: CalEvent) => void;
  showNow: boolean;
  nowTop: number;
}) {
  const slots: number[] = [];
  for (let h = START_HOUR; h < END_HOUR; h++) slots.push(h);
  return (
    <div className="day-col">
      {slots.map((h) => (
        <div key={h} className="day-slot" />
      ))}
      {EVENTS.filter((e) => e.day === dayIdx).map((ev) => (
        <EventCard key={ev.id} ev={ev} onClick={() => onEventClick(ev)} />
      ))}
      {showNow && (
        <div className="now-line" style={{ top: nowTop }}>
          <span className="now-label">11:30</span>
        </div>
      )}
    </div>
  );
}

function WeekGrid({ onEventClick }: { onEventClick: (ev: CalEvent) => void }) {
  const nowTop = (11.5 - START_HOUR) * HOUR_PX;
  return (
    <div className="week">
      <div className="week-head">
        <div className="gmt-cell">GMT+7</div>
        {DAYS.map((d) => (
          <div key={d.n} className="day-cell">
            <div className={"day-num" + (d.today ? " is-today" : "")}>{d.n}</div>
            <div className="day-meta">
              <div className="day-name">{d.name}</div>
              <div className="day-count">
                {d.count} appointment{d.count !== 1 ? "s" : ""}
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid-scroll scroll">
        <div className="grid">
          <TimeGutter />
          {DAYS.map((d, i) => (
            <DayColumn
              key={d.n}
              dayIdx={i}
              onEventClick={onEventClick}
              showNow={d.today}
              nowTop={nowTop}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

function Stats() {
  return (
    <div className="stats">
      {STATS.map((s) => (
        <div key={s.label} className="stat-card">
          <div className="stat-head">
            <div className="stat-label">
              <span>{s.label}</span>
              <Icon name="filter" size={12} className="ic-f" />
            </div>
          </div>
          <div className="stat-sub">{s.sub}</div>
          <div className="stat-row">
            <div className="stat-value">
              {s.value}
              {s.unit && <span className="unit">{s.unit}</span>}
            </div>
            <span className={"delta " + (s.deltaDir === "up" ? "up" : "down")}>
              {s.delta}
            </span>
            <span className="stat-ft">{s.compare}</span>
          </div>
        </div>
      ))}
    </div>
  );
}

function Toolbar({
  view,
  setView,
  onNewAppointment,
}: {
  view: CalendarView;
  setView: (v: CalendarView) => void;
  onNewAppointment: () => void;
}) {
  const views: CalendarView[] = ["Day", "Week", "Month", "Staff"];
  return (
    <div className="toolbar">
      <button type="button" className="pill bordered">
        Today
      </button>
      <div className="date-pill">
        <span className="label">Jan 2024</span>
        <button type="button" className="icon-btn" aria-label="Previous month">
          <Icon name="chevronLeft" size={14} />
        </button>
        <button type="button" className="icon-btn" aria-label="Next month">
          <Icon name="chevronRight" size={14} />
        </button>
      </div>

      <div className="pill-group" role="tablist" aria-label="Calendar view">
        {views.map((v) => (
          <button
            key={v}
            type="button"
            role="tab"
            aria-selected={view === v}
            className={"pill" + (view === v ? " active" : "")}
            onClick={() => setView(v)}
          >
            {v}
          </button>
        ))}
      </div>

      <button type="button" className="filter-chip">
        <span className="dot" style={{ background: "var(--olive)" }} />
        All status
        <Icon name="chevronDown" size={12} />
      </button>
      <button type="button" className="filter-chip">
        <Icon name="user" size={12} />
        All staff
        <Icon name="chevronDown" size={12} />
      </button>

      <div className="toolbar-right">
        <button
          type="button"
          className="btn btn-primary accent"
          onClick={onNewAppointment}
        >
          <Icon name="plus" size={13} />
          New
        </button>
      </div>
    </div>
  );
}

export function Main({
  view,
  setView,
  onNewAppointment,
  onEventClick,
  onQuickAction,
}: MainProps) {
  return (
    <main className="main">
      <div className="main-head">
        <div className="main-title-row">
          <h1 className="main-title">Appointment</h1>
          <span className="title-meta">Week 04 · Jan 22–26</span>
        </div>
        <Toolbar
          view={view}
          setView={setView}
          onNewAppointment={onNewAppointment}
        />
      </div>

      <Stats />
      <WeekGrid onEventClick={onEventClick} />

      <div className="cmdbar">
        <button
          type="button"
          className="cmd-btn"
          aria-label="Search"
          onClick={() => onQuickAction("Search")}
        >
          <Icon name="search" size={15} />
        </button>
        <button
          type="button"
          className="cmd-btn"
          aria-label="Quick add"
          onClick={() => onQuickAction("Quick add")}
        >
          <Icon name="plus" size={15} />
        </button>
        <button
          type="button"
          className="cmd-btn accent"
          aria-label="AI assist"
          onClick={() => onQuickAction("Assist")}
        >
          <Icon name="sparkles" size={15} />
        </button>
      </div>
    </main>
  );
}
