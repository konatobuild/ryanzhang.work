"use client";

import { Btn, Caret, Logo } from "../atoms";

function NavLink({
  children,
  hasMenu,
}: {
  children: React.ReactNode;
  hasMenu?: boolean;
}) {
  return (
    <a
      href="#"
      style={{
        display: "inline-flex",
        alignItems: "center",
        textDecoration: "none",
        color: "var(--ink-2)",
        fontSize: 14,
        fontWeight: 500,
        padding: "8px 12px",
        borderRadius: 8,
      }}
      onMouseEnter={(e) => (e.currentTarget.style.color = "var(--ink)")}
      onMouseLeave={(e) => (e.currentTarget.style.color = "var(--ink-2)")}
    >
      {children}
      {hasMenu && <Caret />}
    </a>
  );
}

export function Nav() {
  return (
    <header style={{ padding: "20px 0 0" }}>
      <div
        className="wrap"
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 24,
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 4,
            background: "white",
            border: "1px solid var(--line)",
            borderRadius: 999,
            padding: "8px 8px 8px 16px",
            boxShadow: "0 1px 0 rgba(20,21,15,0.02)",
          }}
        >
          <Logo />
          <div
            style={{
              width: 1,
              height: 20,
              background: "var(--line)",
              margin: "0 12px 0 16px",
            }}
          />
          <nav style={{ display: "flex", alignItems: "center" }}>
            <NavLink hasMenu>Platform</NavLink>
            <NavLink>Pricing</NavLink>
            <NavLink hasMenu>Resources</NavLink>
            <NavLink>Enterprise</NavLink>
            <NavLink hasMenu>Changelog</NavLink>
          </nav>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <Btn variant="link">Log in</Btn>
          <Btn variant="primary">Start free trial</Btn>
        </div>
      </div>
    </header>
  );
}
