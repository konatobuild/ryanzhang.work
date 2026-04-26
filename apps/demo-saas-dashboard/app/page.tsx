"use client";

import { useState } from "react";
import { Header } from "../components/header";
import { Sidebar } from "../components/sidebar";
import { ProvidersPage } from "../components/users-page";
import { SchedulePage } from "../components/schedule-page";
import { ALL_PROVIDERS, type Provider } from "../lib/data";

export default function Page() {
  const [activeNav, setActiveNav] = useState<string>("schedule");
  const [collapsed, setCollapsed] = useState(false);
  const [providers, setProviders] = useState<Provider[]>(ALL_PROVIDERS);

  return (
    <div
      style={{ display: "flex", minHeight: "100vh", background: "var(--bg)" }}
    >
      <Sidebar
        active={activeNav}
        setActive={setActiveNav}
        collapsed={collapsed}
        setCollapsed={setCollapsed}
      />
      <main
        style={{
          flex: 1,
          minWidth: 0,
          display: "flex",
          flexDirection: "column",
        }}
      >
        <Header />
        <div style={{ flex: 1 }}>
          {activeNav === "providers" ? (
            <ProvidersPage providers={providers} setProviders={setProviders} />
          ) : (
            <SchedulePage />
          )}
        </div>
      </main>
    </div>
  );
}
