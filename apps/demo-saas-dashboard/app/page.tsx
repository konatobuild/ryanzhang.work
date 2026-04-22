"use client";

import { useState } from "react";
import { TopBar, LeftRail, type TabId } from "../components/shell";
import { QuickAccess, AccountsPanel } from "../components/main";
import { DetailPanel } from "../components/detail";
import { ACCOUNTS, ACCOUNT_ROWS, type NavItem } from "../lib/data";

export default function Page() {
  const [tab, setTab] = useState<TabId>("accounts");
  const [section, setSection] = useState<NavItem["id"]>("all");
  const [selectedId, setSelectedId] = useState<string>("r1");
  const [detailOpen, setDetailOpen] = useState<boolean>(true);

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        background: "var(--bg)",
      }}
    >
      <TopBar tab={tab} setTab={setTab} />
      <div
        style={{
          display: "flex",
          alignItems: "stretch",
          flex: 1,
          minHeight: 0,
          padding: "0 12px 12px",
        }}
      >
        <LeftRail section={section} setSection={setSection} />
        <main
          style={{
            flex: 1,
            display: "flex",
            gap: 12,
            minWidth: 0,
            alignItems: "flex-start",
          }}
        >
          <div
            style={{
              flex: 1,
              display: "flex",
              flexDirection: "column",
              gap: 12,
              minWidth: 0,
            }}
          >
            <QuickAccess items={ACCOUNTS} />
            <AccountsPanel
              rows={ACCOUNT_ROWS}
              selectedId={selectedId}
              setSelectedId={setSelectedId}
            />
          </div>
          {detailOpen && (
            <div style={{ width: 280, flexShrink: 0 }}>
              <DetailPanel onClose={() => setDetailOpen(false)} />
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
