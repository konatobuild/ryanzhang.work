"use client";

import { useEffect, useState } from "react";
import { BottomNav, type NavTab } from "./primitives";
import { HomeScreen } from "./screens/Home";
import { SearchScreen } from "./screens/Search";
import { FreelancerScreen } from "./screens/Freelancer";
import { JobScreen } from "./screens/Job";
import { MessagesScreen } from "./screens/Messages";
import { ChatScreen } from "./screens/Chat";
import { ProfileScreen } from "./screens/Profile";

export type ScreenName =
  | "home"
  | "search"
  | "freelancer"
  | "job"
  | "messages"
  | "chat"
  | "profile";

export type StackEntry = {
  name: ScreenName;
  id?: string;
};

export type AppAPI = {
  go: (name: ScreenName, params?: { id?: string }) => void;
  goFreelancer: (id: string) => void;
  goJob: (id: string) => void;
  back: () => void;
};

const ACCENTS = {
  lime: { accent: "#caff3f", accent2: "#5ef0c8" },
  mint: { accent: "#5ef0c8", accent2: "#caff3f" },
  orange: { accent: "#ff8f4a", accent2: "#caff3f" },
  violet: { accent: "#c8a6ff", accent2: "#5ef0c8" },
} as const;

type AccentKey = keyof typeof ACCENTS;

const STORAGE_KEY = "guild:stack";

export function GuildApp() {
  const [accentKey, setAccentKey] = useState<AccentKey>("lime");
  const [stack, setStack] = useState<StackEntry[]>([{ name: "home" }]);

  // Restore/persist navigation stack. Run client-side only to avoid hydration mismatch.
  useEffect(() => {
    try {
      const raw = typeof window !== "undefined" && localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as StackEntry[];
        if (Array.isArray(parsed) && parsed.length > 0) setStack(parsed);
      }
    } catch {
      // ignore — start from default stack
    }
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(stack));
    } catch {
      // ignore
    }
  }, [stack]);

  const cur = stack[stack.length - 1];
  const app: AppAPI = {
    go: (name, params = {}) => setStack((s) => [...s, { name, ...params }]),
    goFreelancer: (id) => setStack((s) => [...s, { name: "freelancer", id }]),
    goJob: (id) => setStack((s) => [...s, { name: "job", id }]),
    back: () => setStack((s) => (s.length > 1 ? s.slice(0, -1) : s)),
  };

  const tabs: NavTab[] = ["home", "search", "messages", "profile"];
  const curTab = (tabs as string[]).includes(cur.name) ? (cur.name as NavTab) : null;

  const renderScreen = () => {
    switch (cur.name) {
      case "home":
        return <HomeScreen app={app} />;
      case "search":
        return <SearchScreen app={app} />;
      case "freelancer":
        return <FreelancerScreen app={app} id={cur.id} />;
      case "job":
        return <JobScreen app={app} id={cur.id} />;
      case "messages":
        return <MessagesScreen app={app} />;
      case "chat":
        return <ChatScreen app={app} id={cur.id} />;
      case "profile":
        return <ProfileScreen app={app} />;
      default:
        return <HomeScreen app={app} />;
    }
  };

  const showNav = !["chat", "freelancer", "job"].includes(cur.name);

  return (
    <div
      className="guild-root"
      data-accent={accentKey}
      style={{
        width: "100%",
        height: "100%",
        background: "var(--bg-0)",
        color: "var(--text-1)",
        position: "relative",
        overflow: "hidden",
        fontFamily: "var(--font-body)",
      }}
    >
      <div
        style={{
          height: "100%",
          overflowY: cur.name === "chat" ? "hidden" : "auto",
          position: "relative",
        }}
      >
        {renderScreen()}
      </div>
      {showNav && (
        <BottomNav
          current={curTab ?? "home"}
          onGo={(t) => setStack([{ name: t }])}
          unread={3}
        />
      )}

      {/* Minimal accent swatch toolbar — parity with the prototype's Tweaks panel */}
      <AccentSwitcher value={accentKey} onChange={setAccentKey} />
    </div>
  );
}

function AccentSwitcher({
  value,
  onChange,
}: {
  value: AccentKey;
  onChange: (k: AccentKey) => void;
}) {
  return (
    <div
      style={{
        position: "absolute",
        top: 62,
        right: 14,
        display: "flex",
        gap: 5,
        padding: 5,
        borderRadius: 999,
        background: "rgba(255,255,255,0.7)",
        border: "1px solid rgba(15,15,16,0.06)",
        backdropFilter: "blur(8px)",
        WebkitBackdropFilter: "blur(8px)",
        zIndex: 40,
      }}
      aria-label="Accent color"
    >
      {(Object.keys(ACCENTS) as AccentKey[]).map((k) => (
        <button
          key={k}
          onClick={() => onChange(k)}
          aria-label={k}
          style={{
            width: 16,
            height: 16,
            borderRadius: 8,
            background: ACCENTS[k].accent,
            border:
              value === k
                ? "2px solid #0f0f10"
                : "1px solid rgba(15,15,16,0.12)",
            cursor: "pointer",
            padding: 0,
          }}
        />
      ))}
    </div>
  );
}
