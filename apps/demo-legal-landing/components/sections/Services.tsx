"use client";

import { useState } from "react";
import { Minus, Plus } from "../shared";

type Service = {
  id: string;
  title: string;
  summary: string;
  points: string[];
};

const SERVICES: Service[] = [
  {
    id: "corp",
    title: "Corporate & M&A",
    summary:
      "From formation and governance through venture financings and acquisition — a single partner owns the matter end to end.",
    points: [
      "Entity formation & governance",
      "Venture financings (Seed → Series D)",
      "Acquisition & divestiture",
      "Commercial agreements",
      "Secondary transactions",
      "Joint ventures",
    ],
  },
  {
    id: "disp",
    title: "Disputes & Arbitration",
    summary:
      "Commercial disputes resolved through negotiation, international arbitration, and — when necessary — the courtroom.",
    points: [
      "Commercial litigation (state & federal)",
      "International arbitration (SIAC, ICC, LCIA)",
      "Shareholder & partnership disputes",
      "Fraud & recovery",
    ],
  },
  {
    id: "intl",
    title: "International & Tax",
    summary:
      "Entry strategy, tax-efficient structuring, and treaty-aware counsel for multi-jurisdictional clients.",
    points: [
      "Market entry (US, UK, EU, SG)",
      "Transfer pricing",
      "Cross-border M&A",
      "Sanctions & export controls",
    ],
  },
  {
    id: "ipe",
    title: "IP & Employment",
    summary:
      "Protecting the assets that make technology companies valuable, and structuring the relationships that drive them.",
    points: [
      "Licensing & technology transfer",
      "Trademark & trade secret",
      "Equity & incentive plans",
      "Executive agreements",
      "Workforce reductions",
      "Investigations",
    ],
  },
];

type RowProps = {
  service: Service;
  index: number;
  open: boolean;
  onToggle: () => void;
};

const ServiceRow = ({ service, index, open, onToggle }: RowProps) => (
  <div className="reveal" style={{ borderBottom: "1px solid var(--edge)" }}>
    <button
      onClick={onToggle}
      style={{
        width: "100%",
        background: "transparent",
        border: "none",
        padding: "36px 0",
        color: "var(--ink)",
        display: "grid",
        gridTemplateColumns: "80px 1fr auto",
        alignItems: "center",
        gap: 40,
        cursor: "pointer",
        textAlign: "left",
        fontFamily: "inherit",
      }}
    >
      <span className="eyebrow">{String(index + 1).padStart(2, "0")}</span>
      <span
        className="display"
        style={{
          fontSize: "clamp(28px, 3vw, 44px)",
          color: "var(--ink)",
          opacity: open ? 1 : 0.55,
          transition: "opacity .3s ease",
        }}
      >
        {service.title}
      </span>
      <span
        style={{
          width: 36,
          height: 36,
          borderRadius: 999,
          border: "1px solid var(--ink)",
          display: "grid",
          placeItems: "center",
          background: open ? "var(--ink)" : "transparent",
          color: open ? "var(--cream)" : "var(--ink)",
          transition: "all .2s",
        }}
      >
        {open ? <Minus /> : <Plus />}
      </span>
    </button>

    <div
      style={{
        maxHeight: open ? 260 : 0,
        overflow: "hidden",
        transition: "max-height .5s cubic-bezier(.2,.7,.2,1)",
      }}
    >
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "80px 1fr 1fr",
          gap: 40,
          paddingBottom: 40,
          alignItems: "start",
        }}
      >
        <span />
        <p
          style={{
            color: "var(--ink)",
            opacity: 0.75,
            fontSize: 15,
            lineHeight: 1.65,
            margin: 0,
            maxWidth: "48ch",
          }}
        >
          {service.summary}
        </p>
        <ul
          style={{
            margin: 0,
            padding: 0,
            listStyle: "none",
            columnCount: 2,
            columnGap: 32,
            color: "var(--muted)",
            fontSize: 13.5,
          }}
        >
          {service.points.map((p) => (
            <li
              key={p}
              style={{
                padding: "5px 0",
                breakInside: "avoid",
                borderTop: "1px solid var(--edge)",
              }}
            >
              {p}
            </li>
          ))}
        </ul>
      </div>
    </div>
  </div>
);

export default function Services() {
  const [open, setOpen] = useState<string | null>("disp");

  return (
    <section
      id="practice"
      style={{
        background: "var(--cream-2)",
        padding: "140px 0 120px",
        borderTop: "1px solid var(--edge)",
        borderBottom: "1px solid var(--edge)",
      }}
    >
      <div className="wrap">
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "200px 1fr 1fr",
            gap: 80,
            alignItems: "start",
            marginBottom: 80,
          }}
        >
          <div className="eyebrow reveal">§ 02 — Practice</div>
          <h2
            className="display reveal"
            style={{
              fontSize: "clamp(40px, 4.4vw, 64px)",
              margin: 0,
              lineHeight: 1.08,
            }}
          >
            Four practices,
            <br />
            <em>one point</em> of contact.
          </h2>
          <p
            className="reveal"
            style={{
              fontSize: 14.5,
              lineHeight: 1.65,
              color: "var(--muted)",
              margin: 0,
              maxWidth: "38ch",
              justifySelf: "end",
              marginTop: 16,
            }}
          >
            We organize around the matter, not the org chart. A named partner
            owns every engagement end-to-end, drawing in specialists only when
            the work calls for it.
          </p>
        </div>

        <div style={{ borderTop: "1px solid var(--edge)" }}>
          {SERVICES.map((s, i) => (
            <ServiceRow
              key={s.id}
              service={s}
              index={i}
              open={open === s.id}
              onToggle={() => setOpen(open === s.id ? null : s.id)}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
