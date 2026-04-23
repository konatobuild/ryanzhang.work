"use client";

import type { CSSProperties, ReactNode } from "react";
import { useEffect, useRef, useState } from "react";

export const sans = "'Golos Text', -apple-system, system-ui, sans-serif";

export const PALETTE = {
  red: "#fd3436",
  black: "#000000",
  ink: "#0a0a0a",
  warmGray: "#777069",
  cream: "#edebe8",
  mute: "#b8b2ac",
  faint: "#d7d3cf",
} as const;

export const PHONE_W = 390;
export const PHONE_H = 844;

export type ScreenName = "start" | "recording" | "editing";

// ─────────────────────────────────────────────────────────
// Phone frame — iOS-style notched body with dynamic island
// ─────────────────────────────────────────────────────────
export function PhoneFrame({
  children,
  label,
}: {
  children: ReactNode;
  label?: string;
}) {
  return (
    <div>
      <div
        style={{
          width: PHONE_W,
          height: PHONE_H,
          borderRadius: 56,
          background: "#0a0a0a",
          padding: 10,
          position: "relative",
          boxShadow: "0 30px 60px rgba(0,0,0,0.5), 0 0 0 1px #2a2a2a",
        }}
      >
        <div
          style={{
            position: "absolute",
            inset: 10,
            borderRadius: 48,
            overflow: "hidden",
            background: "#ffffff",
          }}
        >
          {/* Dynamic island */}
          <div
            style={{
              position: "absolute",
              top: 11,
              left: "50%",
              transform: "translateX(-50%)",
              width: 120,
              height: 35,
              borderRadius: 20,
              background: "#000",
              zIndex: 50,
            }}
          />
          {/* Status bar */}
          <div
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              zIndex: 40,
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              padding: "18px 28px 0",
              fontFamily: '-apple-system, "SF Pro", system-ui',
              fontWeight: 600,
              fontSize: 15,
              color: "#0d0d0d",
            }}
          >
            <span>9:41</span>
            <div style={{ display: "flex", gap: 5, alignItems: "center" }}>
              <svg width="16" height="10" viewBox="0 0 16 10" aria-hidden>
                <rect x="0" y="6" width="2.6" height="4" rx="0.6" fill="#0d0d0d" />
                <rect x="4" y="4" width="2.6" height="6" rx="0.6" fill="#0d0d0d" />
                <rect x="8" y="2" width="2.6" height="8" rx="0.6" fill="#0d0d0d" />
                <rect x="12" y="0" width="2.6" height="10" rx="0.6" fill="#0d0d0d" />
              </svg>
              <svg width="22" height="10" viewBox="0 0 22 10" aria-hidden>
                <rect
                  x="0.5"
                  y="0.5"
                  width="19"
                  height="9"
                  rx="2.5"
                  stroke="#0d0d0d"
                  strokeOpacity="0.35"
                  fill="none"
                />
                <rect x="2" y="2" width="16" height="6" rx="1.5" fill="#0d0d0d" />
              </svg>
            </div>
          </div>
          <div style={{ position: "absolute", inset: 0, paddingTop: 54 }}>
            {children}
          </div>
        </div>
      </div>
      {label && (
        <div
          style={{
            marginTop: 14,
            textAlign: "center",
            fontSize: 11,
            letterSpacing: "0.18em",
            textTransform: "uppercase",
            color: "rgba(250,250,247,0.55)",
            fontFamily: sans,
          }}
        >
          {label}
        </div>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────────────────
// Deterministic waveform data (stable across renders)
// ─────────────────────────────────────────────────────────
export function makeWave(seed: number, count: number): number[] {
  const arr: number[] = [];
  let s = seed;
  for (let i = 0; i < count; i++) {
    s = (s * 9301 + 49297) % 233280;
    const r = s / 233280;
    const base = 0.15 + r * 0.7;
    const spike = r > 0.88 ? r * 0.5 : 0;
    arr.push(Math.min(1, base + spike));
  }
  return arr;
}

// Reused instances so every screen renders the same bars
export const WAVE_A = makeWave(42, 70);
export const WAVE_B = makeWave(7, 62);
export const WAVE_C = makeWave(19, 72);

// ─────────────────────────────────────────────────────────
// Waveform — vertical bars with optional playhead
// ─────────────────────────────────────────────────────────
function Waveform({
  data,
  height = 120,
  barWidth = 2,
  gap = 3,
  progress = null,
  playheadColor = PALETTE.red,
  pastColor = "#2f2f2f",
  futureColor = "#c9c3bd",
  style = {},
}: {
  data: number[];
  height?: number;
  barWidth?: number;
  gap?: number;
  progress?: number | null;
  playheadColor?: string;
  pastColor?: string;
  futureColor?: string;
  style?: CSSProperties;
}) {
  const total = data.length;
  const playIdx = progress != null ? Math.floor(progress * total) : -1;
  return (
    <svg
      viewBox={`0 0 ${total * (barWidth + gap)} ${height}`}
      preserveAspectRatio="none"
      style={{ width: "100%", height, display: "block", ...style }}
    >
      {data.map((v, i) => {
        const h = Math.max(1.5, v * height * 0.95);
        const x = i * (barWidth + gap);
        const y = (height - h) / 2;
        let color = futureColor;
        if (progress == null) color = pastColor;
        else if (i < playIdx) color = pastColor;
        else if (i === playIdx) color = playheadColor;
        return (
          <rect
            key={i}
            x={x}
            y={y}
            width={barWidth}
            height={h}
            rx={barWidth / 2}
            fill={color}
          />
        );
      })}
      {playIdx >= 0 && (
        <>
          <line
            x1={playIdx * (barWidth + gap) + barWidth / 2}
            x2={playIdx * (barWidth + gap) + barWidth / 2}
            y1={4}
            y2={height - 4}
            stroke={playheadColor}
            strokeWidth={1.8}
          />
          <circle
            cx={playIdx * (barWidth + gap) + barWidth / 2}
            cy={8}
            r={4.5}
            fill={playheadColor}
          />
        </>
      )}
    </svg>
  );
}

// ─────────────────────────────────────────────────────────
// Shared header row — back / title / trash
// ─────────────────────────────────────────────────────────
function AppHeader({
  title,
  onBack,
  onDelete,
}: {
  title: string;
  onBack?: () => void;
  onDelete?: () => void;
}) {
  const fg = "#0b0b0b";
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "44px 1fr 44px",
        alignItems: "center",
        padding: "6px 20px 10px",
        height: 44,
      }}
    >
      <button
        type="button"
        onClick={onBack}
        style={{
          background: "transparent",
          border: "none",
          padding: 0,
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          color: fg,
        }}
        aria-label="Back"
      >
        <svg width="14" height="22" viewBox="0 0 14 22" fill="none">
          <path
            d="M12 2L2 11L12 20"
            stroke={fg}
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>
      <div style={{ textAlign: "center" }}>
        <div
          style={{
            fontFamily: sans,
            fontSize: 13,
            fontWeight: 500,
            letterSpacing: "0.15em",
            color: fg,
            textTransform: "uppercase",
          }}
        >
          {title}
        </div>
      </div>
      <button
        type="button"
        onClick={onDelete}
        style={{
          background: "transparent",
          border: "none",
          padding: 0,
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          justifyContent: "flex-end",
          color: fg,
        }}
        aria-label="Delete"
      >
        <svg width="20" height="22" viewBox="0 0 20 22" fill="none">
          <path
            d="M3 6h14M8 3h4a1 1 0 011 1v2H7V4a1 1 0 011-1zM5 6l1 13a2 2 0 002 2h4a2 2 0 002-2l1-13"
            stroke={fg}
            strokeWidth="1.6"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>
    </div>
  );
}

// ═════════════════════════════════════════════════════════
// SCREEN 1 — Start
// ═════════════════════════════════════════════════════════
export function StartScreen({
  onStart,
  wave = WAVE_A,
}: {
  onStart?: () => void;
  wave?: number[];
}) {
  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        background: "#fff",
        fontFamily: sans,
      }}
    >
      {/* Top — waveform preview with stage labels */}
      <div
        style={{
          flex: "0 0 46%",
          position: "relative",
          padding: "74px 26px 0",
          boxSizing: "border-box",
        }}
      >
        <div
          style={{
            position: "absolute",
            inset: "74px 26px 30% 26px",
            pointerEvents: "none",
          }}
        >
          <span
            style={{
              position: "absolute",
              left: 4,
              top: 8,
              fontSize: 14,
              fontWeight: 500,
              letterSpacing: "0.22em",
              color: "#111",
            }}
          >
            TALK
          </span>
          <span
            style={{
              position: "absolute",
              right: "26%",
              top: 38,
              fontSize: 14,
              fontWeight: 500,
              letterSpacing: "0.22em",
              color: "#111",
            }}
          >
            TRANSCRIBE
          </span>
          <span
            style={{
              position: "absolute",
              left: "22%",
              top: 68,
              fontSize: 13,
              fontWeight: 500,
              letterSpacing: "0.22em",
              color: "#9a958f",
            }}
          >
            EASY
          </span>
          <span
            style={{
              position: "absolute",
              right: 4,
              top: 98,
              fontSize: 13,
              fontWeight: 500,
              letterSpacing: "0.22em",
              color: "#9a958f",
            }}
          >
            FAST
          </span>
        </div>
        <div
          style={{
            position: "absolute",
            left: 0,
            right: 0,
            bottom: 0,
            padding: "0 18px",
          }}
        >
          <Waveform
            data={wave}
            height={180}
            barWidth={1.6}
            gap={3.2}
            pastColor="#bcb6b0"
            futureColor="#bcb6b0"
          />
        </div>
      </div>

      {/* Bottom black panel */}
      <div
        style={{
          flex: 1,
          background: PALETTE.ink,
          color: "#fff",
          padding: "28px 28px 40px",
          position: "relative",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <div
          style={{
            width: 8,
            height: 8,
            borderRadius: 99,
            background: "#bcb6b0",
            marginBottom: 8,
          }}
        />
        <div style={{ fontSize: 22, fontWeight: 600, lineHeight: 1.1 }}>
          Recording
        </div>
        <div
          style={{
            fontSize: 22,
            fontWeight: 500,
            color: "#8f8a84",
            lineHeight: 1.15,
            marginTop: 2,
          }}
        >
          Editing
        </div>

        <div
          style={{
            position: "absolute",
            left: 28,
            right: 28,
            bottom: 54,
            display: "flex",
            alignItems: "center",
            gap: 14,
          }}
        >
          <div
            style={{
              fontSize: 68,
              fontWeight: 700,
              letterSpacing: "-0.02em",
              lineHeight: 1,
            }}
          >
            Start
          </div>
          <button
            type="button"
            onClick={onStart}
            style={{
              width: 52,
              height: 52,
              borderRadius: 99,
              background: PALETTE.red,
              border: "none",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              boxShadow: "0 6px 18px rgba(253,52,54,0.35)",
              marginTop: 10,
            }}
            aria-label="Start recording"
          >
            <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
              <path
                d="M4 11h14M12 5l6 6-6 6"
                stroke="#fff"
                strokeWidth="2.2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}

// ═════════════════════════════════════════════════════════
// SCREEN 2 — Recording (live)
// ═════════════════════════════════════════════════════════
export function RecordingScreen({
  timeMs,
  paused,
  wave = WAVE_B,
  progress = 0.72,
  onPause,
  onStop,
  onEdit,
  onBack,
  onDelete,
}: {
  timeMs: number;
  paused: boolean;
  wave?: number[];
  progress?: number;
  onPause?: () => void;
  onStop?: () => void;
  onEdit?: () => void;
  onBack?: () => void;
  onDelete?: () => void;
}) {
  const mm = String(Math.floor(timeMs / 60000)).padStart(2, "0");
  const ss = String(Math.floor((timeMs / 1000) % 60)).padStart(2, "0");
  const cs = String(Math.floor((timeMs / 10) % 100)).padStart(2, "0");

  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        background: "#fff",
        fontFamily: sans,
        color: "#0b0b0b",
      }}
    >
      <AppHeader title="Recording" onBack={onBack} onDelete={onDelete} />

      <div style={{ textAlign: "center", padding: "16px 0 6px" }}>
        <div
          style={{
            fontSize: 60,
            fontWeight: 700,
            letterSpacing: "-0.02em",
            fontVariantNumeric: "tabular-nums",
            lineHeight: 1,
          }}
        >
          {mm}:{ss}:{cs}
        </div>
        <div style={{ fontSize: 13, color: "#8c867f", marginTop: 6 }}>
          Recorded time
        </div>
      </div>

      <div style={{ padding: "22px 20px 4px" }}>
        <Waveform
          data={wave}
          height={110}
          barWidth={2}
          gap={3.2}
          progress={progress}
          pastColor="#2f2f2f"
          futureColor="#c9c3bd"
        />
      </div>

      <div
        style={{
          flex: 1,
          padding: "18px 24px 0",
          overflow: "hidden",
          position: "relative",
        }}
      >
        <p
          style={{
            margin: 0,
            fontSize: 19,
            lineHeight: 1.3,
            color: "#d0cbc5",
            fontWeight: 400,
          }}
        >
          Today I&apos;m going to talk about new marketing strategies for business owners.
        </p>
        <p
          style={{
            margin: "18px 0 0",
            fontSize: 21,
            lineHeight: 1.25,
            color: "#0b0b0b",
            fontWeight: 500,
          }}
        >
          First, let&apos;s get to know…
        </p>
      </div>

      <div
        style={{
          padding: "0 20px 30px",
          display: "grid",
          gridTemplateColumns: "64px 1fr 64px",
          gap: 12,
          alignItems: "center",
        }}
      >
        <button
          type="button"
          onClick={onEdit}
          style={{
            width: 64,
            height: 64,
            borderRadius: 18,
            background: PALETTE.cream,
            border: "none",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
          aria-label="Edit transcript"
        >
          <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
            <path
              d="M13.5 3.5l5 5L8 19H3v-5L13.5 3.5z"
              stroke="#0b0b0b"
              strokeWidth="1.6"
              strokeLinejoin="round"
            />
            <path d="M12 5l5 5" stroke="#0b0b0b" strokeWidth="1.6" />
          </svg>
        </button>

        <button
          type="button"
          onClick={onPause}
          style={{
            height: 64,
            borderRadius: 18,
            background: PALETTE.ink,
            color: "#fff",
            border: "none",
            cursor: "pointer",
            fontFamily: sans,
            fontSize: 20,
            fontWeight: 500,
          }}
        >
          {paused ? "Resume" : "Pause"}
        </button>

        <button
          type="button"
          onClick={onStop}
          style={{
            width: 64,
            height: 64,
            borderRadius: 18,
            background: PALETTE.cream,
            border: "none",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
          aria-label="Finish recording"
        >
          <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
            <path
              d="M4 11.5l5 5L19 6"
              stroke="#0b0b0b"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
      </div>
    </div>
  );
}

// ═════════════════════════════════════════════════════════
// SCREEN 3 — Editing / playback with transcript highlighting
// ═════════════════════════════════════════════════════════
export function EditingScreen({
  progress,
  setProgress,
  playing,
  wave = WAVE_C,
  onPlayToggle,
  onRestart,
  onBack,
  onDelete,
}: {
  progress: number;
  setProgress: (p: number) => void;
  playing: boolean;
  wave?: number[];
  onPlayToggle?: () => void;
  onRestart?: () => void;
  onBack?: () => void;
  onDelete?: () => void;
}) {
  const total = 25000;
  const currentMs = Math.floor(progress * total);
  const mm = String(Math.floor(currentMs / 60000)).padStart(2, "0");
  const ss = String(Math.floor((currentMs / 1000) % 60)).padStart(2, "0");
  const dmm = String(Math.floor(total / 60000)).padStart(2, "0");
  const dss = String(Math.floor((total / 1000) % 60)).padStart(2, "0");

  const activeIdx = progress < 0.33 ? 0 : progress < 0.78 ? 1 : 2;

  const blocks = [
    "Today I'm going to talk about new marketing strategies for business owners.",
    "First, let's get to know… My name is David Crowie and I am current hmm…",
    "Financial consultant with 20 years of experience in business support",
  ];

  const barRef = useRef<HTMLDivElement | null>(null);
  const onWaveClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!barRef.current) return;
    const r = barRef.current.getBoundingClientRect();
    const p = Math.max(0, Math.min(1, (e.clientX - r.left) / r.width));
    setProgress(p);
  };

  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        background: "#fff",
        fontFamily: sans,
        color: "#0b0b0b",
      }}
    >
      <AppHeader title="Feb 01, 2025 2:46 PM" onBack={onBack} onDelete={onDelete} />

      <div
        style={{
          flex: 1,
          overflow: "hidden",
          padding: "6px 24px 0",
          position: "relative",
        }}
      >
        {blocks.map((text, i) => {
          const active = i === activeIdx;
          const past = i < activeIdx;
          return (
            <div
              key={i}
              style={{
                marginTop: i === 0 ? 6 : 14,
                padding: active ? "10px 12px" : 0,
                margin: active ? "14px -6px 0" : undefined,
                borderRadius: active ? 10 : 0,
                background: active ? PALETTE.cream : "transparent",
                color: active ? "#0b0b0b" : past ? "#b7b1ab" : "#d0cbc5",
                fontSize: active ? 21 : 19,
                fontWeight: active ? 500 : 400,
                lineHeight: 1.28,
                transition: "all 200ms ease",
              }}
            >
              {text}
            </div>
          );
        })}
      </div>

      <div style={{ padding: "8px 20px 0" }}>
        <div ref={barRef} onClick={onWaveClick} style={{ cursor: "pointer" }}>
          <Waveform
            data={wave}
            height={90}
            barWidth={1.8}
            gap={3}
            progress={progress}
            pastColor="#2f2f2f"
            futureColor="#c9c3bd"
          />
        </div>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            fontSize: 12,
            color: "#8c867f",
            marginTop: 6,
            fontVariantNumeric: "tabular-nums",
          }}
        >
          <span>
            {mm}:{ss}:18
          </span>
          <span>
            {dmm}:{dss}:00
          </span>
        </div>
      </div>

      <div
        style={{
          padding: "16px 20px 28px",
          display: "grid",
          gridTemplateColumns: "1fr 1fr 1fr",
          gap: 12,
        }}
      >
        <button
          type="button"
          onClick={onRestart}
          style={{
            height: 72,
            borderRadius: 18,
            background: PALETTE.warmGray,
            border: "none",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
          aria-label="Restart"
        >
          <svg width="26" height="26" viewBox="0 0 26 26" fill="none">
            <path
              d="M5 13a8 8 0 108-8M5 5v5h5"
              stroke="#fff"
              strokeWidth="1.9"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
        <button
          type="button"
          onClick={onPlayToggle}
          style={{
            height: 72,
            borderRadius: 18,
            background: PALETTE.ink,
            border: "none",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
          aria-label={playing ? "Pause" : "Play"}
        >
          {playing ? (
            <svg width="22" height="22" viewBox="0 0 22 22" fill="#fff">
              <rect x="5" y="4" width="4.5" height="14" rx="1.2" />
              <rect x="12.5" y="4" width="4.5" height="14" rx="1.2" />
            </svg>
          ) : (
            <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
              <circle cx="11" cy="11" r="5" fill="#fff" />
              <circle cx="11" cy="11" r="8.5" stroke="#fff" strokeWidth="1.6" />
            </svg>
          )}
        </button>
        <button
          type="button"
          onClick={onBack}
          style={{
            height: 72,
            borderRadius: 18,
            background: PALETTE.red,
            border: "none",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
          aria-label="Save"
        >
          <svg width="26" height="26" viewBox="0 0 26 26" fill="none">
            <path
              d="M5 13.5l6 6L21 7"
              stroke="#fff"
              strokeWidth="2.2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
      </div>
    </div>
  );
}

// ═════════════════════════════════════════════════════════
// Prototype — drives screen state via clicks
// ═════════════════════════════════════════════════════════
export function Prototype() {
  const [screen, setScreen] = useState<ScreenName>("start");
  const [timeMs, setTimeMs] = useState(32910);
  const [paused, setPaused] = useState(false);
  const [progress, setProgress] = useState(0.62);
  const [playing, setPlaying] = useState(false);
  const [liveProg, setLiveProg] = useState(0.72);

  useEffect(() => {
    if (screen !== "recording" || paused) return;
    const id = setInterval(() => setTimeMs((t) => t + 70), 70);
    return () => clearInterval(id);
  }, [screen, paused]);

  useEffect(() => {
    if (screen !== "editing" || !playing) return;
    const id = setInterval(() => {
      setProgress((p) => {
        const next = p + 0.004;
        if (next >= 1) {
          setPlaying(false);
          return 1;
        }
        return next;
      });
    }, 50);
    return () => clearInterval(id);
  }, [screen, playing]);

  useEffect(() => {
    if (screen !== "recording" || paused) return;
    const id = setInterval(() => {
      setLiveProg((p) => (p < 0.95 ? p + 0.004 : 0.15));
    }, 120);
    return () => clearInterval(id);
  }, [screen, paused]);

  if (screen === "start") {
    return (
      <StartScreen
        wave={WAVE_A}
        onStart={() => {
          setScreen("recording");
          setTimeMs(0);
          setPaused(false);
          setLiveProg(0.05);
        }}
      />
    );
  }

  if (screen === "recording") {
    return (
      <RecordingScreen
        timeMs={timeMs}
        paused={paused}
        wave={WAVE_B}
        progress={liveProg}
        onPause={() => setPaused((p) => !p)}
        onStop={() => {
          setScreen("editing");
          setProgress(0.62);
          setPlaying(false);
        }}
        onEdit={() => {
          setScreen("editing");
          setProgress(0.3);
          setPlaying(false);
        }}
        onBack={() => setScreen("start")}
        onDelete={() => setScreen("start")}
      />
    );
  }

  return (
    <EditingScreen
      progress={progress}
      setProgress={setProgress}
      playing={playing}
      wave={WAVE_C}
      onPlayToggle={() => setPlaying((p) => !p)}
      onRestart={() => {
        setProgress(0);
        setPlaying(true);
      }}
      onBack={() => setScreen("start")}
      onDelete={() => setScreen("start")}
    />
  );
}
