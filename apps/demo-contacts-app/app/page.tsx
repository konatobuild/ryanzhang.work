"use client";

import { useState, type CSSProperties } from "react";
import { Sidebar, type NavId } from "../components/sidebar";
import { ContactsView } from "../components/table";
import { Icons } from "../components/icons";

const styles: Record<string, CSSProperties> = {
  outer: {
    width: "100%",
    minHeight: "100vh",
    display: "grid",
    placeItems: "center",
    padding: 32,
    background: "var(--desktop)",
  },
  stageWrap: { width: "100%", maxWidth: 1280 },
  window: {
    background: "var(--paper)",
    borderRadius: 14,
    overflow: "hidden",
    boxShadow:
      "0 40px 80px -30px rgba(20,20,20,.28), 0 8px 24px -8px rgba(20,20,20,.12)",
    border: "1px solid var(--border)",
  },
  windowBar: {
    display: "flex",
    alignItems: "center",
    padding: "10px 14px",
    borderBottom: "1px solid var(--border)",
    background: "var(--sidebar-bg)",
    gap: 8,
  },
  dot: { width: 11, height: 11, borderRadius: "50%" },
  body: { display: "flex", minHeight: 720, maxHeight: 820 },
  collapsedRail: {
    width: 48,
    borderRight: "1px solid var(--border)",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    padding: "14px 0",
    gap: 14,
    background: "var(--sidebar-bg)",
  },
  railLogo: {
    width: 24,
    height: 24,
    borderRadius: "50%",
    background: "var(--ink)",
    color: "var(--paper)",
    display: "grid",
    placeItems: "center",
    fontSize: 12,
    cursor: "pointer",
  },
};

export default function Page() {
  const [activeNav, setActiveNav] = useState<NavId>("contacts");
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div style={styles.outer}>
      <div style={styles.stageWrap}>
        <div style={styles.window}>
          <div style={styles.windowBar}>
            <span style={{ ...styles.dot, background: "#f35f56" }} />
            <span style={{ ...styles.dot, background: "#f9bc3c" }} />
            <span style={{ ...styles.dot, background: "#2fc94f" }} />
            <div
              style={{
                flex: 1,
                textAlign: "center",
                fontSize: 12,
                color: "var(--muted)",
                fontFamily: "var(--mono)",
              }}
            >
              orbit.work — contacts
            </div>
          </div>
          <div style={styles.body}>
            {!collapsed && (
              <Sidebar
                activeNav={activeNav}
                setActiveNav={setActiveNav}
                onToggleSidebar={() => setCollapsed(true)}
              />
            )}
            {collapsed && (
              <div style={styles.collapsedRail}>
                <div style={styles.railLogo} onClick={() => setCollapsed(false)}>
                  ◐
                </div>
                <div
                  style={{ color: "var(--muted)", cursor: "pointer" }}
                  onClick={() => setCollapsed(false)}
                >
                  {Icons.sidebar}
                </div>
              </div>
            )}
            <ContactsView density="comfortable" />
          </div>
        </div>
      </div>
    </div>
  );
}
