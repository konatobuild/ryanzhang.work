"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Sidebar } from "../components/sidebar";
import { Main } from "../components/main";
import { RightPanel } from "../components/right-panel";
import type { CalEvent, NavId } from "../lib/data";

type CalendarView = "Day" | "Week" | "Month" | "Staff";

export default function Page() {
  const [activeNav, setActiveNav] = useState<NavId>("appointment");
  const [view, setView] = useState<CalendarView>("Week");
  const [panelOpen, setPanelOpen] = useState(true);
  const [toast, setToast] = useState<string | null>(null);
  const toastTimer = useRef<number | null>(null);

  const notify = useCallback((msg: string) => {
    setToast(msg);
    if (toastTimer.current !== null) {
      window.clearTimeout(toastTimer.current);
    }
    toastTimer.current = window.setTimeout(() => setToast(null), 1800);
  }, []);

  useEffect(() => {
    return () => {
      if (toastTimer.current !== null) window.clearTimeout(toastTimer.current);
    };
  }, []);

  const handleEventClick = (ev: CalEvent) => notify(`${ev.title} · ${ev.sub}`);
  const handleNewAppointment = () => {
    setPanelOpen(true);
    notify("Creating new appointment");
  };
  const handleSubmitWaitlist = () => {
    notify("Waitlist entry added");
    setPanelOpen(false);
  };
  const handleClosePanel = () => setPanelOpen(false);
  const handleQuickAction = (label: string) => notify(label);

  return (
    <div className="app" data-panel={panelOpen ? "open" : "closed"}>
      <Sidebar
        active={activeNav}
        onNavigate={setActiveNav}
        brandName="Cadence Studio"
        brandMark="C"
      />
      <Main
        view={view}
        setView={setView}
        onNewAppointment={handleNewAppointment}
        onEventClick={handleEventClick}
        onQuickAction={handleQuickAction}
      />
      {panelOpen && (
        <RightPanel
          onSubmit={handleSubmitWaitlist}
          onCancel={handleClosePanel}
        />
      )}
      {toast && <div className="toast">{toast}</div>}
    </div>
  );
}
