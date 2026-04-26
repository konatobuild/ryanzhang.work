"use client";

import { useState, type CSSProperties } from "react";

type ShiftCode = "D" | "N" | "C" | "OFF" | "GAP" | "PTO";

interface ScheduleRow {
  id: string;
  name: string;
  service: string;
  cells: ShiftCode[];
}

const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const TODAY_INDEX = 5; // Sat Apr 25

const ROWS: ScheduleRow[] = [
  {
    id: "aoki",
    name: "Aoki",
    service: "Cardiology",
    cells: ["D", "D", "N", "C", "D", "OFF", "OFF"],
  },
  {
    id: "petrov",
    name: "Petrov",
    service: "Cardiology",
    cells: ["D", "N", "OFF", "D", "N", "D", "D"],
  },
  {
    id: "castell",
    name: "Castell",
    service: "Cardiology",
    cells: ["OFF", "D", "D", "D", "C", "N", "GAP"],
  },
  {
    id: "doroshenko",
    name: "Doroshenko",
    service: "Endocrinology",
    cells: ["D", "OFF", "D", "D", "D", "OFF", "D"],
  },
  {
    id: "mensah",
    name: "Mensah",
    service: "Emergency",
    cells: ["N", "D", "N", "OFF", "D", "D", "C"],
  },
  {
    id: "patel",
    name: "Patel",
    service: "Anesthesia",
    cells: ["D", "C", "D", "D", "OFF", "D", "N"],
  },
  {
    id: "kovac",
    name: "Kovac",
    service: "Orthopedics",
    cells: ["OFF", "D", "D", "C", "D", "OFF", "D"],
  },
  {
    id: "halvorsen",
    name: "Halvorsen",
    service: "Pediatrics",
    cells: ["D", "D", "OFF", "D", "D", "PTO", "PTO"],
  },
  {
    id: "ahn",
    name: "Ahn",
    service: "Neurology",
    cells: ["C", "D", "D", "OFF", "N", "D", "OFF"],
  },
  {
    id: "singh",
    name: "Singh",
    service: "General surgery",
    cells: ["D", "OFF", "C", "D", "D", "N", "D"],
  },
  {
    id: "renz",
    name: "Renz",
    service: "Internal medicine",
    cells: ["D", "D", "D", "OFF", "C", "OFF", "D"],
  },
  {
    id: "marchetti",
    name: "Marchetti",
    service: "Pulmonology",
    cells: ["OFF", "C", "D", "D", "D", "D", "OFF"],
  },
];

interface CredentialItem {
  name: string;
  cred: string;
  date: string;
  due: number;
}

const CREDENTIALS: CredentialItem[] = [
  { name: "Aoki", cred: "ACLS", date: "Sat May 2", due: 7 },
  { name: "Patel", cred: "DEA registration", date: "Sat May 9", due: 14 },
  { name: "Singh", cred: "State license", date: "Sun May 17", due: 22 },
  { name: "Mensah", cred: "BLS", date: "Sat May 23", due: 28 },
  { name: "Renz", cred: "Internal med boards", date: "Mon May 25", due: 30 },
];

export function SchedulePage() {
  const [weekOffset, setWeekOffset] = useState(0);
  return (
    <div
      style={{
        maxWidth: 1080,
        margin: "0 auto",
        padding: "32px 32px 64px",
      }}
    >
      <Breadcrumb />
      <Hero />
      <Divider />
      <ScheduleTable
        weekOffset={weekOffset}
        onShift={(d) => setWeekOffset(weekOffset + d)}
      />
      <Divider />
      <CredentialsList />
      <Divider />
      <Footer />
    </div>
  );
}

function Breadcrumb() {
  return (
    <div
      className="mono"
      style={{
        fontSize: 11,
        color: "var(--muted)",
        letterSpacing: ".04em",
        textTransform: "uppercase",
        marginBottom: 56,
      }}
    >
      Workspace · Clinical · Coverage
    </div>
  );
}

function Hero() {
  return (
    <section style={{ marginBottom: 64 }}>
      <h1
        style={{
          margin: 0,
          fontSize: 44,
          lineHeight: 1.12,
          letterSpacing: "-.025em",
          fontWeight: 600,
          color: "var(--ink)",
          maxWidth: 720,
        }}
      >
        Today is mostly covered.{" "}
        <span style={{ color: "var(--muted-2)" }}>
          One gap before Sunday.
        </span>
      </h1>
      <p
        style={{
          margin: "20px 0 0",
          maxWidth: 620,
          fontSize: 15.5,
          lineHeight: 1.55,
          color: "var(--muted)",
        }}
      >
        Cardiology cath lab needs an attending on Sun Apr 26 between{" "}
        <span style={{ color: "var(--ink)" }}>02:00 and 06:00 ET</span>. Aoki
        goes off shift at 02:00; Petrov picks up at 06:00. Float pool is
        available.
      </p>
      <div
        style={{
          marginTop: 24,
          display: "flex",
          gap: 28,
          alignItems: "center",
        }}
      >
        <ActionLink primary>Page float pool</ActionLink>
        <ActionLink>Open Sunday schedule</ActionLink>
        <ActionLink>Notify Dr. Lee</ActionLink>
      </div>
    </section>
  );
}

function ActionLink({
  children,
  primary,
}: {
  children: React.ReactNode;
  primary?: boolean;
}) {
  return (
    <button
      type="button"
      style={{
        background: "transparent",
        padding: 0,
        fontSize: 14,
        fontWeight: primary ? 600 : 500,
        color: primary ? "var(--ink)" : "var(--muted)",
        display: "inline-flex",
        alignItems: "center",
        gap: 6,
        borderBottom: primary
          ? "1px solid var(--ink)"
          : "1px solid transparent",
        paddingBottom: 1,
        transition: "color .12s, border-color .12s",
      }}
    >
      {primary ? "→" : "↳"} <span>{children}</span>
    </button>
  );
}

function ScheduleTable({
  weekOffset,
  onShift,
}: {
  weekOffset: number;
  onShift: (d: number) => void;
}) {
  return (
    <section style={{ marginBottom: 64 }}>
      <div
        style={{
          display: "flex",
          alignItems: "baseline",
          justifyContent: "space-between",
          marginBottom: 28,
        }}
      >
        <div>
          <h2
            style={{
              margin: 0,
              fontSize: 22,
              fontWeight: 600,
              letterSpacing: "-.015em",
            }}
          >
            Week of Apr 20
          </h2>
          <div
            style={{
              marginTop: 4,
              fontSize: 13,
              color: "var(--muted)",
            }}
          >
            12 attending physicians across 7 services
          </div>
        </div>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 18,
            fontSize: 13,
            color: "var(--muted)",
          }}
        >
          <button
            type="button"
            onClick={() => onShift(-1)}
            style={textBtn}
            aria-label="Previous week"
          >
            ←
          </button>
          <span
            className="mono"
            style={{
              fontSize: 11,
              color: weekOffset === 0 ? "var(--ink)" : "var(--muted)",
              letterSpacing: ".06em",
            }}
          >
            {weekOffset === 0 ? "THIS WEEK" : `WEEK ${weekOffset > 0 ? "+" : ""}${weekOffset}`}
          </span>
          <button
            type="button"
            onClick={() => onShift(1)}
            style={textBtn}
            aria-label="Next week"
          >
            →
          </button>
        </div>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: `220px repeat(7, 1fr)`,
          rowGap: 0,
          fontSize: 13.5,
        }}
      >
        {/* Header row: PROVIDER label + day cells */}
        <div
          className="mono"
          style={{
            padding: "0 0 14px",
            fontSize: 10.5,
            color: "var(--muted)",
            letterSpacing: ".08em",
            alignSelf: "end",
            borderBottom: "1px solid var(--line)",
          }}
        >
          PROVIDER
        </div>
        {DAYS.map((d, i) => {
          const isToday = i === TODAY_INDEX;
          return (
            <div
              key={d}
              style={{
                padding: "0 4px 14px",
                textAlign: "center",
                borderBottom: "1px solid var(--line)",
              }}
            >
              <div
                className="mono"
                style={{
                  fontSize: 10.5,
                  color: isToday ? "var(--ink)" : "var(--muted)",
                  letterSpacing: ".08em",
                  fontWeight: isToday ? 600 : 400,
                }}
              >
                {d.toUpperCase()}
              </div>
              <div
                className="mono"
                style={{
                  marginTop: 2,
                  fontSize: 12,
                  color: isToday ? "var(--ink)" : "var(--muted-2)",
                  fontWeight: isToday ? 600 : 400,
                  position: "relative",
                  display: "inline-block",
                }}
              >
                {20 + i}
                {isToday && (
                  <span
                    aria-hidden
                    style={{
                      position: "absolute",
                      bottom: -8,
                      left: "50%",
                      transform: "translateX(-50%)",
                      width: 6,
                      height: 6,
                      borderRadius: 99,
                      background: "var(--accent)",
                      boxShadow: "0 0 0 3px var(--accent-soft)",
                    }}
                  />
                )}
              </div>
            </div>
          );
        })}

        {/* Provider rows */}
        {ROWS.map((row, ri) => (
          <ProviderRow key={row.id} row={row} isLast={ri === ROWS.length - 1} />
        ))}
      </div>

      <Legend />
    </section>
  );
}

function ProviderRow({ row, isLast }: { row: ScheduleRow; isLast: boolean }) {
  const onNow = row.cells[TODAY_INDEX] === "D" || row.cells[TODAY_INDEX] === "N";
  const border = isLast ? "none" : "1px solid var(--line-2)";
  return (
    <>
      <div
        style={{
          padding: "16px 0",
          borderBottom: border,
          display: "flex",
          alignItems: "baseline",
          gap: 8,
          minWidth: 0,
        }}
      >
        <span
          aria-hidden
          style={{
            display: "inline-block",
            width: 6,
            height: 6,
            borderRadius: 99,
            background: onNow ? "var(--accent)" : "transparent",
            flexShrink: 0,
          }}
        />
        <span
          style={{
            fontSize: 14.5,
            fontWeight: 500,
            color: "var(--ink)",
          }}
        >
          {row.name}
        </span>
        <span
          style={{
            marginLeft: 4,
            fontSize: 12.5,
            color: "var(--muted)",
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
          }}
        >
          {row.service}
        </span>
      </div>
      {row.cells.map((c, i) => (
        <Cell key={i} code={c} isToday={i === TODAY_INDEX} border={border} />
      ))}
    </>
  );
}

function Cell({
  code,
  isToday,
  border,
}: {
  code: ShiftCode;
  isToday: boolean;
  border: string;
}) {
  const text =
    code === "D"
      ? "Day"
      : code === "N"
        ? "Night"
        : code === "C"
          ? "·Call"
          : code === "PTO"
            ? "PTO"
            : code === "GAP"
              ? "⚠ Open"
              : "—";
  const color =
    code === "D"
      ? "var(--ink)"
      : code === "N"
        ? "var(--ink)"
        : code === "C"
          ? "var(--muted)"
          : code === "PTO"
            ? "var(--muted-2)"
            : code === "GAP"
              ? "var(--danger)"
              : "var(--muted-2)";
  const fontWeight = code === "N" ? 600 : code === "GAP" ? 600 : 400;
  const fontStyle = code === "C" ? "italic" : "normal";

  return (
    <div
      style={{
        padding: "16px 4px",
        textAlign: "center",
        borderBottom: border,
        background: isToday ? "var(--surface)" : "transparent",
        position: "relative",
      }}
    >
      <span
        style={{
          fontSize: 13.5,
          color,
          fontWeight,
          fontStyle,
        }}
      >
        {text}
      </span>
      {code === "N" && (
        <span
          aria-hidden
          style={{
            display: "block",
            margin: "4px auto 0",
            width: 18,
            height: 1,
            background: "var(--ink)",
          }}
        />
      )}
    </div>
  );
}

function Legend() {
  const items: { label: string; render: () => React.ReactNode }[] = [
    {
      label: "Active shift",
      render: () => (
        <span style={{ color: "var(--ink)" }}>Day</span>
      ),
    },
    {
      label: "Night",
      render: () => (
        <span
          style={{
            color: "var(--ink)",
            fontWeight: 600,
            borderBottom: "1px solid var(--ink)",
            paddingBottom: 1,
          }}
        >
          Night
        </span>
      ),
    },
    {
      label: "On call",
      render: () => (
        <span style={{ color: "var(--muted)", fontStyle: "italic" }}>
          ·Call
        </span>
      ),
    },
    {
      label: "Off",
      render: () => <span style={{ color: "var(--muted-2)" }}>—</span>,
    },
    {
      label: "Uncovered",
      render: () => (
        <span style={{ color: "var(--danger)", fontWeight: 600 }}>
          ⚠ Open
        </span>
      ),
    },
    {
      label: "On shift right now",
      render: () => (
        <span
          aria-hidden
          style={{
            display: "inline-block",
            width: 6,
            height: 6,
            borderRadius: 99,
            background: "var(--accent)",
            verticalAlign: "middle",
          }}
        />
      ),
    },
  ];
  return (
    <div
      style={{
        marginTop: 28,
        display: "flex",
        flexWrap: "wrap",
        gap: 24,
        fontSize: 12,
        color: "var(--muted)",
      }}
    >
      {items.map((it) => (
        <span
          key={it.label}
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 8,
          }}
        >
          {it.render()}
          <span>{it.label}</span>
        </span>
      ))}
    </div>
  );
}

function CredentialsList() {
  return (
    <section style={{ marginBottom: 64 }}>
      <div style={{ marginBottom: 28 }}>
        <h2
          style={{
            margin: 0,
            fontSize: 22,
            fontWeight: 600,
            letterSpacing: "-.015em",
          }}
        >
          Credentials
        </h2>
        <div
          style={{
            marginTop: 4,
            fontSize: 13,
            color: "var(--muted)",
          }}
        >
          5 expiring in the next 30 days · auto-renewals queued where allowed
        </div>
      </div>
      <div>
        {CREDENTIALS.map((c, i) => {
          const urgent = c.due <= 14;
          return (
            <div
              key={c.name}
              style={{
                display: "grid",
                gridTemplateColumns: "180px 1fr 140px 110px 100px",
                alignItems: "baseline",
                gap: 24,
                padding: "18px 0",
                borderTop: i === 0 ? "1px solid var(--line)" : "none",
                borderBottom: "1px solid var(--line-2)",
                fontSize: 14,
              }}
            >
              <span style={{ color: "var(--ink)", fontWeight: 500 }}>
                {c.name}
              </span>
              <span style={{ color: "var(--ink)" }}>{c.cred}</span>
              <span className="mono" style={{ color: "var(--muted)", fontSize: 12.5 }}>
                {c.date}
              </span>
              <span
                className="mono"
                style={{
                  color: urgent ? "var(--danger)" : "var(--muted)",
                  fontWeight: urgent ? 600 : 400,
                  fontSize: 12.5,
                }}
              >
                {c.due} days
              </span>
              <button
                type="button"
                style={{
                  justifySelf: "end",
                  background: "transparent",
                  padding: "0 0 1px",
                  fontSize: 13,
                  fontWeight: 500,
                  color: urgent ? "var(--ink)" : "var(--muted)",
                  borderBottom: `1px solid ${urgent ? "var(--ink)" : "transparent"}`,
                }}
              >
                {urgent ? "Renew now →" : "Queue"}
              </button>
            </div>
          );
        })}
      </div>
    </section>
  );
}

function Divider() {
  return (
    <div
      aria-hidden
      style={{
        height: 1,
        background: "var(--line)",
        margin: "0 0 56px",
      }}
    />
  );
}

function Footer() {
  return (
    <div
      className="mono"
      style={{
        fontSize: 11,
        color: "var(--muted-2)",
        letterSpacing: ".04em",
        display: "flex",
        justifyContent: "space-between",
      }}
    >
      <span>Atria Clinical Cloud · us-east-2 · Build 4a91c</span>
      <span>HIPAA · SOC 2 · Status</span>
    </div>
  );
}

const textBtn: CSSProperties = {
  background: "transparent",
  padding: 0,
  color: "var(--muted)",
  fontSize: 14,
  cursor: "pointer",
};
