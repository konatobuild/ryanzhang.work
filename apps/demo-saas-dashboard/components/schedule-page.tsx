"use client";

import { useMemo, useState, type CSSProperties, type ReactNode } from "react";
import { Icon } from "./icons";

type ShiftCode = "D" | "N" | "C" | "OFF" | "GAP" | "PTO";

interface ScheduleRow {
  id: string;
  name: string;
  short: string;
  service: string;
  cells: ShiftCode[];
}

const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

const ROWS: ScheduleRow[] = [
  {
    id: "aoki",
    name: "Dr. Hana Aoki",
    short: "Aoki",
    service: "Cardiology",
    cells: ["D", "D", "N", "C", "D", "OFF", "OFF"],
  },
  {
    id: "petrov",
    name: "Dr. Kai Petrov",
    short: "Petrov",
    service: "Cardiology",
    cells: ["D", "N", "OFF", "D", "N", "D", "D"],
  },
  {
    id: "castell",
    name: "Dr. Iris Castell",
    short: "Castell",
    service: "Cardiology",
    cells: ["OFF", "D", "D", "D", "C", "N", "GAP"],
  },
  {
    id: "doroshenko",
    name: "Dr. Anya Doroshenko",
    short: "Doroshenko",
    service: "Endocrinology",
    cells: ["D", "OFF", "D", "D", "D", "OFF", "D"],
  },
  {
    id: "mensah",
    name: "Dr. Otis Mensah",
    short: "Mensah",
    service: "Emergency",
    cells: ["N", "D", "N", "OFF", "D", "D", "C"],
  },
  {
    id: "patel",
    name: "Dr. Saoirse Patel",
    short: "Patel",
    service: "Anesthesia",
    cells: ["D", "C", "D", "D", "OFF", "D", "N"],
  },
  {
    id: "kovac",
    name: "Dr. Theo Kovac",
    short: "Kovac",
    service: "Orthopedics",
    cells: ["OFF", "D", "D", "C", "D", "OFF", "D"],
  },
  {
    id: "halvorsen",
    name: "Dr. Ezra Halvorsen",
    short: "Halvorsen",
    service: "Pediatrics",
    cells: ["D", "D", "OFF", "D", "D", "PTO", "PTO"],
  },
  {
    id: "ahn",
    name: "Dr. Lena Ahn",
    short: "Ahn",
    service: "Neurology",
    cells: ["C", "D", "D", "OFF", "N", "D", "OFF"],
  },
  {
    id: "singh",
    name: "Dr. Wren Singh",
    short: "Singh",
    service: "Surgery",
    cells: ["D", "OFF", "C", "D", "D", "N", "D"],
  },
  {
    id: "renz",
    name: "Dr. Sana Renz",
    short: "Renz",
    service: "Internal med",
    cells: ["D", "D", "D", "OFF", "C", "OFF", "D"],
  },
  {
    id: "marchetti",
    name: "Dr. Cyrus Marchetti",
    short: "Marchetti",
    service: "Pulmonology",
    cells: ["OFF", "C", "D", "D", "D", "D", "OFF"],
  },
];

const CELL_STYLES: Record<ShiftCode, CSSProperties & { label: string }> = {
  D: {
    label: "Day",
    background: "var(--ink)",
    color: "var(--surface)",
  },
  N: {
    label: "Night",
    background: "var(--surface)",
    color: "var(--ink)",
    border: "1.5px solid var(--ink)",
  },
  C: {
    label: "On call",
    background: "var(--surface-2)",
    color: "var(--muted)",
    border: "1px dashed var(--muted-2)",
  },
  OFF: {
    label: "Off",
    background: "transparent",
    color: "var(--muted-2)",
  },
  PTO: {
    label: "PTO",
    background: "var(--chip)",
    color: "var(--muted)",
  },
  GAP: {
    label: "Uncovered",
    background: "rgba(229,72,77,.10)",
    color: "var(--danger)",
    border: "1.5px solid var(--danger)",
  },
};

interface CredentialItem {
  provider: string;
  short: string;
  cred: string;
  due: number;
}

const CREDENTIALS: CredentialItem[] = [
  { provider: "Dr. Hana Aoki", short: "Aoki", cred: "ACLS", due: 7 },
  { provider: "Dr. Saoirse Patel", short: "Patel", cred: "DEA registration", due: 14 },
  { provider: "Dr. Wren Singh", short: "Singh", cred: "State license", due: 22 },
  { provider: "Dr. Otis Mensah", short: "Mensah", cred: "BLS", due: 28 },
  { provider: "Dr. Sana Renz", short: "Renz", cred: "Internal med boards", due: 30 },
];

export function SchedulePage() {
  const [weekOffset, setWeekOffset] = useState(0);

  const stats = useMemo(() => {
    const flat = ROWS.flatMap((r) => r.cells);
    const onShift = flat.filter((c) => c === "D" || c === "N").length;
    const total = flat.length;
    const gaps = flat.filter((c) => c === "GAP").length;
    return { onShift, total, gaps, fillPct: (onShift / total) * 100 };
  }, []);

  return (
    <div style={{ padding: "0 28px 28px", position: "relative" }}>
      <SubHeader weekOffset={weekOffset} setWeekOffset={setWeekOffset} />
      <CoverageHero
        fillPct={stats.fillPct}
        onShift={stats.onShift}
        servicesCovered={5}
        gaps={stats.gaps}
        savedHours={142}
      />
      <ScheduleGridSection />
      <CredentialsSection />
      <FooterStrip />
    </div>
  );
}

function SubHeader({
  weekOffset,
  setWeekOffset,
}: {
  weekOffset: number;
  setWeekOffset: (n: number) => void;
}) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "18px 0",
      }}
    >
      <div
        className="mono"
        style={{
          fontSize: 11.5,
          color: "var(--muted)",
          letterSpacing: ".02em",
          display: "flex",
          alignItems: "center",
          gap: 8,
        }}
      >
        <span>WORKSPACE</span>
        <Icon name="chevron-right" size={11} />
        <span>Clinical</span>
        <Icon name="chevron-right" size={11} />
        <span style={{ color: "var(--ink)" }}>Coverage</span>
      </div>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 6,
          color: "var(--muted)",
        }}
      >
        <button
          type="button"
          onClick={() => setWeekOffset(weekOffset - 1)}
          style={navArrow}
        >
          <Icon name="arrow-left" size={13} />
        </button>
        <span
          className="mono"
          style={{
            fontSize: 11.5,
            color: "var(--ink)",
            padding: "6px 10px",
            background: "var(--surface)",
            border: "1px solid var(--line)",
            borderRadius: 8,
            letterSpacing: ".04em",
          }}
        >
          WEEK OF APR 20 · 2026
        </span>
        <button
          type="button"
          onClick={() => setWeekOffset(weekOffset + 1)}
          style={navArrow}
        >
          <Icon name="arrow-right" size={13} />
        </button>
        <div style={{ width: 1, height: 20, background: "var(--line)", margin: "0 6px" }} />
        <span
          className="mono"
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 6,
            fontSize: 11,
            color: "var(--ink)",
            padding: "5px 10px",
            background: "var(--surface)",
            border: "1px solid var(--line)",
            borderRadius: 999,
            letterSpacing: ".06em",
          }}
        >
          <span
            style={{
              width: 6,
              height: 6,
              borderRadius: 99,
              background: "var(--accent)",
              boxShadow: "0 0 0 3px var(--accent-soft)",
            }}
          />
          LIVE
        </span>
        <button type="button" style={subBtn}>
          <Icon name="docs" size={13} />
          Roster export
        </button>
        <button type="button" style={subBtn}>
          <Icon name="print" size={13} />
          Print
        </button>
      </div>
    </div>
  );
}

const navArrow: CSSProperties = {
  width: 28,
  height: 28,
  borderRadius: 6,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  color: "var(--muted)",
  background: "var(--surface)",
  border: "1px solid var(--line)",
  padding: 0,
};

const subBtn: CSSProperties = {
  display: "inline-flex",
  alignItems: "center",
  gap: 6,
  color: "var(--muted)",
  fontSize: 12.5,
  padding: "6px 8px",
  borderRadius: 6,
};

function CoverageHero({
  fillPct,
  onShift,
  servicesCovered,
  gaps,
  savedHours,
}: {
  fillPct: number;
  onShift: number;
  servicesCovered: number;
  gaps: number;
  savedHours: number;
}) {
  return (
    <div
      style={{
        position: "relative",
        marginBottom: 24,
        padding: 28,
        borderRadius: 16,
        border: "1px solid var(--line)",
        background: "var(--surface)",
        overflow: "hidden",
      }}
    >
      {/* Layered frosted bloom */}
      <div
        aria-hidden
        style={{
          position: "absolute",
          inset: 0,
          background:
            "radial-gradient(60% 70% at 18% 0%, var(--accent-glow), transparent 55%), radial-gradient(40% 60% at 80% 110%, var(--accent-soft), transparent 60%), radial-gradient(45% 70% at 50% 50%, rgba(181,242,106,.32), transparent 70%)",
          filter: "blur(36px)",
          opacity: 0.95,
          pointerEvents: "none",
        }}
      />
      <div
        aria-hidden
        style={{
          position: "absolute",
          inset: 0,
          background: "rgba(255,255,255,.55)",
          backdropFilter: "blur(2px)",
          pointerEvents: "none",
        }}
      />

      <div
        style={{
          position: "relative",
          display: "grid",
          gridTemplateColumns: "minmax(280px, 320px) 1fr",
          gap: 32,
          alignItems: "stretch",
        }}
      >
        <GaugeBlock pct={fillPct} />

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 18,
            justifyContent: "space-between",
          }}
        >
          <div>
            <div
              className="mono"
              style={{
                fontSize: 10.5,
                color: "var(--muted)",
                letterSpacing: ".08em",
                textTransform: "uppercase",
                display: "flex",
                alignItems: "center",
                gap: 10,
                marginBottom: 4,
              }}
            >
              <span style={{ color: "var(--ink)", fontWeight: 600 }}>
                Coverage now
              </span>
              <span>·</span>
              <span>Apr 25 · 14:32 ET</span>
            </div>
            <h1
              style={{
                margin: 0,
                fontSize: 30,
                fontWeight: 600,
                letterSpacing: "-.02em",
                lineHeight: 1.2,
              }}
            >
              {servicesCovered} of 6 services covered.{" "}
              <span style={{ color: "var(--danger)" }}>
                1 gap requires action by Sunday.
              </span>
            </h1>
            <div
              style={{
                marginTop: 6,
                fontSize: 13,
                color: "var(--muted-2)",
              }}
            >
              Auto-scheduling has freed{" "}
              <span style={{ color: "var(--ink)", fontWeight: 600 }}>
                {savedHours} attending hours
              </span>{" "}
              this month and pre-closed 6 credential gaps.
            </div>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(3, 1fr)",
              gap: 12,
            }}
          >
            <HeroStat
              label="On shift right now"
              value={String(onShift)}
              suffix={`/ ${ROWS.length * 7}`}
              accent
            />
            <HeroStat
              label="Coverage gaps"
              value={String(gaps)}
              suffix="this week"
              danger
            />
            <HeroStat
              label="Credentials due ≤30d"
              value={String(CREDENTIALS.length)}
              suffix="auto-renewals queued"
            />
          </div>

          <GapCallout />
        </div>
      </div>
    </div>
  );
}

function GaugeBlock({ pct }: { pct: number }) {
  // Semicircle, opens downward (dome on top), value text inside.
  const R = 110;
  const CX = 130;
  const CY = 130;
  const circ = Math.PI * R; // half-circle path length
  const filled = (pct / 100) * circ;
  // Marker dot position
  const angle = Math.PI - (pct / 100) * Math.PI; // from π → 0
  const markerX = CX + R * Math.cos(angle);
  const markerY = CY - R * Math.sin(angle);

  return (
    <div
      style={{
        position: "relative",
        background: "var(--ink)",
        color: "var(--surface)",
        borderRadius: 14,
        padding: "24px 22px 22px",
        display: "flex",
        flexDirection: "column",
        alignItems: "stretch",
        overflow: "hidden",
        border: "1px solid var(--ink)",
      }}
    >
      {/* internal accent halo */}
      <div
        aria-hidden
        style={{
          position: "absolute",
          inset: 0,
          background:
            "radial-gradient(70% 60% at 50% 100%, rgba(181,242,106,.45), transparent 70%)",
          filter: "blur(20px)",
          pointerEvents: "none",
        }}
      />

      <div
        className="mono"
        style={{
          position: "relative",
          fontSize: 10.5,
          letterSpacing: ".08em",
          textTransform: "uppercase",
          color: "rgba(255,255,255,.55)",
        }}
      >
        Schedule fill rate
      </div>
      <div
        style={{
          position: "relative",
          display: "flex",
          justifyContent: "center",
          alignItems: "flex-end",
          marginTop: 10,
          height: 150,
        }}
      >
        <svg
          width="260"
          height="150"
          viewBox="0 0 260 150"
          style={{ display: "block" }}
        >
          {/* track */}
          <path
            d={`M ${CX - R} ${CY} A ${R} ${R} 0 0 1 ${CX + R} ${CY}`}
            fill="none"
            stroke="rgba(255,255,255,.12)"
            strokeWidth={14}
            strokeLinecap="round"
          />
          {/* filled */}
          <path
            d={`M ${CX - R} ${CY} A ${R} ${R} 0 0 1 ${CX + R} ${CY}`}
            fill="none"
            stroke="var(--accent)"
            strokeWidth={14}
            strokeLinecap="round"
            strokeDasharray={`${filled} ${circ - filled}`}
          />
          {/* marker */}
          <circle
            cx={markerX}
            cy={markerY}
            r={9}
            fill="var(--accent)"
            stroke="var(--ink)"
            strokeWidth={3}
          />
          {/* center value */}
          <text
            x={CX}
            y={CY - 8}
            textAnchor="middle"
            fill="var(--surface)"
            fontWeight={600}
            style={{ fontSize: 44, letterSpacing: "-.025em" }}
          >
            {pct.toFixed(1).replace(".", ",")}
            <tspan fontSize={20} fill="rgba(255,255,255,.6)" dx={2}>
              %
            </tspan>
          </text>
        </svg>
      </div>
      <div
        style={{
          position: "relative",
          display: "flex",
          justifyContent: "space-between",
          fontSize: 11,
          color: "rgba(255,255,255,.55)",
        }}
        className="mono"
      >
        <span>0%</span>
        <span style={{ color: "var(--accent)" }}>TARGET 85%</span>
        <span>100%</span>
      </div>
      <div
        style={{
          position: "relative",
          marginTop: 14,
          paddingTop: 14,
          borderTop: "1px solid rgba(255,255,255,.10)",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          fontSize: 12,
          color: "rgba(255,255,255,.7)",
        }}
      >
        <span>vs last week</span>
        <span
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 4,
            color: "var(--accent)",
            fontWeight: 600,
            fontSize: 13,
          }}
        >
          <Icon name="arrow-up" size={12} />
          +4.2 pts
        </span>
      </div>
    </div>
  );
}

function HeroStat({
  label,
  value,
  suffix,
  accent,
  danger,
}: {
  label: string;
  value: string;
  suffix: string;
  accent?: boolean;
  danger?: boolean;
}) {
  return (
    <div
      style={{
        position: "relative",
        background: "rgba(255,255,255,.62)",
        backdropFilter: "blur(8px)",
        border: "1px solid var(--line)",
        borderRadius: 12,
        padding: "14px 16px",
      }}
    >
      <div
        className="mono"
        style={{
          fontSize: 10,
          color: "var(--muted)",
          letterSpacing: ".08em",
          textTransform: "uppercase",
        }}
      >
        {label}
      </div>
      <div
        style={{
          marginTop: 4,
          fontSize: 32,
          fontWeight: 600,
          letterSpacing: "-.02em",
          lineHeight: 1,
          color: danger ? "var(--danger)" : "var(--ink)",
          display: "flex",
          alignItems: "center",
          gap: 6,
        }}
      >
        {value}
        {accent && (
          <span
            style={{
              width: 8,
              height: 8,
              borderRadius: 99,
              background: "var(--accent)",
              boxShadow: "0 0 0 4px var(--accent-soft)",
            }}
          />
        )}
      </div>
      <div style={{ marginTop: 4, fontSize: 11.5, color: "var(--muted)" }}>
        {suffix}
      </div>
    </div>
  );
}

function GapCallout() {
  return (
    <div
      style={{
        position: "relative",
        display: "flex",
        alignItems: "center",
        gap: 14,
        padding: "12px 16px",
        background: "var(--ink)",
        color: "var(--surface)",
        borderRadius: 12,
      }}
    >
      <div
        style={{
          width: 6,
          height: 36,
          borderRadius: 4,
          background: "var(--danger)",
        }}
      />
      <div style={{ flex: 1, minWidth: 0 }}>
        <div
          className="mono"
          style={{
            fontSize: 10,
            letterSpacing: ".08em",
            color: "rgba(255,255,255,.55)",
          }}
        >
          OPEN GAP · CARDIOLOGY · CATH LAB
        </div>
        <div style={{ fontSize: 14, fontWeight: 600, marginTop: 2 }}>
          Sun Apr 26 · 02:00–06:00 ET — no attending after Aoki off, before
          Petrov on.
        </div>
      </div>
      <button
        type="button"
        style={{
          padding: "8px 14px",
          borderRadius: 999,
          background: "var(--accent)",
          color: "var(--ink)",
          fontSize: 12.5,
          fontWeight: 600,
          display: "inline-flex",
          alignItems: "center",
          gap: 6,
          flexShrink: 0,
        }}
      >
        Page float pool
        <Icon name="arrow-right" size={12} />
      </button>
    </div>
  );
}

function ScheduleGridSection() {
  return (
    <div
      style={{
        background: "var(--surface)",
        border: "1px solid var(--line)",
        borderRadius: 14,
        overflow: "hidden",
        marginBottom: 24,
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "14px 18px",
          borderBottom: "1px solid var(--line-2)",
        }}
      >
        <div>
          <div style={{ fontSize: 14.5, fontWeight: 600 }}>
            Weekly schedule
          </div>
          <div style={{ fontSize: 11.5, color: "var(--muted)", marginTop: 2 }}>
            Apr 20 – Apr 26 · {ROWS.length} attending physicians · 6 services
          </div>
        </div>
        <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
          <SmallBtn icon="filter">Filters</SmallBtn>
          <SmallBtn icon="settings-2">Group: Service</SmallBtn>
          <SmallBtn icon="plus" primary>
            Build next week
          </SmallBtn>
        </div>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "minmax(220px, 1.4fr) repeat(7, 1fr)",
          background: "var(--surface-2)",
          borderBottom: "1px solid var(--line-2)",
        }}
      >
        <div
          className="mono"
          style={{
            ...gridHead,
            paddingLeft: 18,
          }}
        >
          PROVIDER
        </div>
        {DAYS.map((d, i) => (
          <div
            key={d}
            className="mono"
            style={{
              ...gridHead,
              textAlign: "center",
              color: i >= 5 ? "var(--ink)" : "var(--muted)",
            }}
          >
            {d.toUpperCase()}
            <div
              style={{
                fontSize: 10,
                color: "var(--muted-2)",
                fontWeight: 400,
                marginTop: 2,
              }}
            >
              {20 + i}
            </div>
          </div>
        ))}
      </div>

      {ROWS.map((row, rowIndex) => (
        <div
          key={row.id}
          style={{
            display: "grid",
            gridTemplateColumns: "minmax(220px, 1.4fr) repeat(7, 1fr)",
            borderBottom:
              rowIndex === ROWS.length - 1 ? "none" : "1px solid var(--line-2)",
            alignItems: "stretch",
          }}
        >
          <div
            style={{
              padding: "12px 18px",
              display: "flex",
              alignItems: "center",
              gap: 10,
              minWidth: 0,
            }}
          >
            <div
              style={{
                width: 30,
                height: 30,
                borderRadius: 8,
                background: "var(--ink)",
                color: "var(--accent)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontWeight: 600,
                fontSize: 11.5,
                flexShrink: 0,
                letterSpacing: "-.02em",
              }}
            >
              {row.short[0] + (row.short[1] ?? "")}
            </div>
            <div style={{ minWidth: 0 }}>
              <div
                style={{
                  fontSize: 13,
                  fontWeight: 500,
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                }}
              >
                {row.name}
              </div>
              <div
                className="mono"
                style={{
                  fontSize: 10.5,
                  color: "var(--muted)",
                  letterSpacing: ".02em",
                }}
              >
                {row.service.toUpperCase()}
              </div>
            </div>
          </div>
          {row.cells.map((c, i) => (
            <ShiftCell key={i} code={c} />
          ))}
        </div>
      ))}

      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "12px 18px",
          borderTop: "1px solid var(--line-2)",
          background: "var(--surface-2)",
        }}
      >
        <div
          style={{
            display: "flex",
            gap: 16,
            fontSize: 11.5,
            color: "var(--muted)",
          }}
        >
          <Legend code="D" />
          <Legend code="N" />
          <Legend code="C" />
          <Legend code="OFF" />
          <Legend code="PTO" />
          <Legend code="GAP" />
        </div>
        <div
          className="mono"
          style={{ fontSize: 11, color: "var(--muted)", letterSpacing: ".04em" }}
        >
          12 OF 312 · SHOWING ON-CALL ROTATION
        </div>
      </div>
    </div>
  );
}

function ShiftCell({ code }: { code: ShiftCode }) {
  const s = CELL_STYLES[code];
  if (code === "OFF") {
    return (
      <div
        style={{
          padding: 8,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <span
          style={{
            fontSize: 10.5,
            color: s.color,
            letterSpacing: ".05em",
          }}
          className="mono"
        >
          —
        </span>
      </div>
    );
  }
  if (code === "GAP") {
    return (
      <div
        style={{
          padding: 8,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <div
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 4,
            padding: "5px 9px",
            background: s.background,
            color: s.color,
            border: s.border as string,
            borderRadius: 6,
            fontWeight: 600,
            fontSize: 11,
            letterSpacing: ".04em",
          }}
          className="mono"
        >
          GAP
        </div>
      </div>
    );
  }
  return (
    <div
      style={{
        padding: 8,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <div
        style={{
          minWidth: 38,
          textAlign: "center",
          padding: "5px 9px",
          background: s.background,
          color: s.color,
          border: s.border as string | undefined,
          borderRadius: 6,
          fontSize: 11,
          fontWeight: 600,
          letterSpacing: ".04em",
        }}
        className="mono"
      >
        {code}
      </div>
    </div>
  );
}

function Legend({ code }: { code: ShiftCode }) {
  const s = CELL_STYLES[code];
  return (
    <span style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>
      <span
        style={{
          width: 16,
          height: 16,
          borderRadius: 4,
          background: code === "OFF" ? "transparent" : s.background,
          border:
            (s.border as string | undefined) ??
            (code === "OFF" ? "1px dashed var(--muted-2)" : "none"),
          color: s.color,
          display: "inline-flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: 9,
          fontWeight: 700,
        }}
        className="mono"
      >
        {code === "OFF" || code === "GAP" ? "" : code}
      </span>
      <span>{s.label}</span>
    </span>
  );
}

function CredentialsSection() {
  return (
    <div
      style={{
        background: "var(--surface)",
        border: "1px solid var(--line)",
        borderRadius: 14,
        overflow: "hidden",
        marginBottom: 24,
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "14px 18px",
          borderBottom: "1px solid var(--line-2)",
        }}
      >
        <div>
          <div style={{ fontSize: 14.5, fontWeight: 600 }}>
            Credentials due
          </div>
          <div
            style={{ fontSize: 11.5, color: "var(--muted)", marginTop: 2 }}
          >
            Within 30 days · auto-reminders sent · CMO sign-off required for
            ≤14d
          </div>
        </div>
        <button type="button" style={{ ...subBtn, color: "var(--ink-2)" }}>
          View all 6 →
        </button>
      </div>
      <div
        className="mono"
        style={{
          display: "grid",
          gridTemplateColumns: "1.6fr 1.4fr 0.8fr 1fr 0.6fr",
          padding: "10px 18px",
          fontSize: 10.5,
          color: "var(--muted)",
          letterSpacing: ".06em",
          textTransform: "uppercase",
          borderBottom: "1px solid var(--line-2)",
          background: "var(--surface-2)",
        }}
      >
        <span>Provider</span>
        <span>Credential</span>
        <span>Due</span>
        <span>Status</span>
        <span style={{ textAlign: "right" }}>Action</span>
      </div>
      {CREDENTIALS.map((c) => {
        const urgent = c.due <= 14;
        return (
          <div
            key={c.provider}
            style={{
              display: "grid",
              gridTemplateColumns: "1.6fr 1.4fr 0.8fr 1fr 0.6fr",
              padding: "12px 18px",
              alignItems: "center",
              borderBottom: "1px solid var(--line-2)",
              gap: 10,
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 10,
                minWidth: 0,
              }}
            >
              <div
                style={{
                  width: 26,
                  height: 26,
                  borderRadius: 8,
                  background: "var(--chip)",
                  color: "var(--ink)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontWeight: 600,
                  fontSize: 10.5,
                  flexShrink: 0,
                  letterSpacing: "-.02em",
                }}
              >
                {c.short.slice(0, 2)}
              </div>
              <span style={{ fontSize: 13, fontWeight: 500 }}>
                {c.provider}
              </span>
            </div>
            <span style={{ fontSize: 12.5 }}>{c.cred}</span>
            <span
              className="mono"
              style={{
                fontSize: 12.5,
                color: urgent ? "var(--danger)" : "var(--ink)",
                fontWeight: urgent ? 600 : 500,
              }}
            >
              {c.due}d
            </span>
            <DueBar days={c.due} />
            <div style={{ display: "flex", justifyContent: "flex-end" }}>
              <button
                type="button"
                style={{
                  padding: "6px 12px",
                  borderRadius: 999,
                  background: urgent ? "var(--ink)" : "var(--surface)",
                  color: urgent ? "var(--accent)" : "var(--ink-2)",
                  border: `1px solid ${urgent ? "var(--ink)" : "var(--line)"}`,
                  fontSize: 11.5,
                  fontWeight: 500,
                }}
              >
                {urgent ? "Renew now" : "Queue auto-renew"}
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
}

function DueBar({ days }: { days: number }) {
  const pct = Math.min(100, Math.max(0, ((30 - days) / 30) * 100));
  const urgent = days <= 14;
  return (
    <div
      style={{
        height: 6,
        borderRadius: 99,
        background: "var(--line)",
        overflow: "hidden",
        position: "relative",
      }}
    >
      <div
        style={{
          width: `${pct}%`,
          height: "100%",
          background: urgent ? "var(--danger)" : "var(--accent)",
          borderRadius: 99,
        }}
      />
    </div>
  );
}

function FooterStrip() {
  return (
    <div
      style={{
        marginTop: 20,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        fontSize: 12,
        color: "var(--muted)",
      }}
    >
      <div className="mono" style={{ fontSize: 11 }}>
        © 2026 Atria Clinical Cloud · Region: us-east-2 · Build 4a91c
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
        <span>HIPAA</span>
        <span>SOC 2</span>
        <span>Status</span>
      </div>
    </div>
  );
}

function SmallBtn({
  children,
  icon,
  primary,
}: {
  children: ReactNode;
  icon?: "filter" | "settings-2" | "plus";
  primary?: boolean;
}) {
  return (
    <button
      type="button"
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 6,
        padding: "7px 12px",
        borderRadius: 8,
        fontSize: 12.5,
        fontWeight: 500,
        background: primary ? "var(--ink)" : "var(--surface)",
        color: primary ? "var(--accent)" : "var(--ink-2)",
        border: `1px solid ${primary ? "var(--ink)" : "var(--line)"}`,
      }}
    >
      {icon && <Icon name={icon} size={13} />}
      {children}
    </button>
  );
}

const gridHead: CSSProperties = {
  padding: "10px 12px",
  fontSize: 11,
  color: "var(--muted)",
  letterSpacing: ".06em",
  textTransform: "uppercase",
  fontWeight: 500,
};
