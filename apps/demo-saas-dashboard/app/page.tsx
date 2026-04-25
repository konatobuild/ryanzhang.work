"use client";

import { useState } from "react";
import { Header } from "../components/header";
import { Sidebar } from "../components/sidebar";
import { UsersPage } from "../components/users-page";
import { ALL_USERS, type User } from "../lib/data";

export default function Page() {
  const [activeNav, setActiveNav] = useState<string>("users");
  const [collapsed, setCollapsed] = useState(false);
  const [users, setUsers] = useState<User[]>(ALL_USERS);

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
          <UsersPage users={users} setUsers={setUsers} />
        </div>
      </main>
    </div>
  );
}
