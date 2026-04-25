"use client";

import { Btn, PlayIcon } from "../atoms";
import { DashboardPreview } from "./DashboardPreview";

function WhatsNewBadge() {
  return (
    <div
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 10,
        background: "white",
        border: "1px solid var(--line)",
        borderRadius: 999,
        padding: 4,
        fontSize: 13,
      }}
    >
      <span
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: 8,
          background: "var(--bg-2)",
          borderRadius: 999,
          padding: "4px 10px",
          fontWeight: 600,
          color: "var(--ink)",
        }}
      >
        <span
          style={{
            width: 6,
            height: 6,
            borderRadius: 999,
            background: "var(--accent)",
          }}
        />
        What&apos;s new?
      </span>
      <a
        href="#"
        style={{
          textDecoration: "none",
          color: "var(--muted)",
          display: "inline-flex",
          alignItems: "center",
          gap: 6,
          paddingRight: 12,
        }}
      >
        Ledger sync for Xero &amp; QuickBooks
        <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
          <path
            d="M2.5 6h7M6 2.5L9.5 6 6 9.5"
            stroke="currentColor"
            strokeWidth="1.3"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </a>
    </div>
  );
}

function HeroArrow() {
  return (
    <svg
      width="120"
      height="170"
      viewBox="0 0 120 170"
      fill="none"
      style={{
        position: "absolute",
        right: 90,
        top: 40,
        pointerEvents: "none",
      }}
      aria-hidden
    >
      <path
        d="M105 8 C 95 55, 70 85, 40 115 C 30 125, 22 135, 14 148"
        stroke="var(--ink)"
        strokeWidth="1.3"
        strokeLinecap="round"
        fill="none"
      />
      <path
        d="M14 148 L 26 142 M 14 148 L 20 136"
        stroke="var(--ink)"
        strokeWidth="1.3"
        strokeLinecap="round"
      />
    </svg>
  );
}

function HeroOrnament() {
  return (
    <svg
      width="520"
      height="560"
      viewBox="0 0 520 560"
      fill="none"
      style={{
        position: "absolute",
        right: -40,
        top: 20,
        opacity: 0.5,
        pointerEvents: "none",
      }}
      aria-hidden
    >
      <path
        d="M520 40 L 360 40 L 360 200 L 200 200 L 200 360 L 40 360 L 40 540"
        stroke="var(--line)"
        strokeWidth="1"
        fill="none"
      />
      <path
        d="M520 80 L 400 80 L 400 240 L 240 240 L 240 400 L 80 400"
        stroke="var(--line-2)"
        strokeWidth="1"
        fill="none"
      />
    </svg>
  );
}

export function Hero() {
  return (
    <section style={{ position: "relative", paddingTop: 56, overflow: "hidden" }}>
      <HeroOrnament />
      <div className="wrap" style={{ position: "relative" }}>
        <WhatsNewBadge />
        <h1
          style={{
            fontFamily: "var(--font-inter-tight)",
            fontSize: "clamp(40px, 5.2vw, 64px)",
            lineHeight: 1.04,
            letterSpacing: "-0.025em",
            fontWeight: 600,
            margin: "28px 0 20px",
            maxWidth: 760,
          }}
        >
          Run the whole back office of your commerce on one stack.
        </h1>
        <p
          style={{
            fontSize: 17,
            color: "var(--muted)",
            maxWidth: 520,
            margin: "0 0 36px",
            lineHeight: 1.55,
          }}
        >
          Northwind is a merchant-of-record platform for teams selling software,
          subscriptions and digital goods globally — payments, tax and billing,
          one integration.
        </p>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 18,
            flexWrap: "wrap",
            position: "relative",
          }}
        >
          <Btn variant="primary" style={{ padding: "14px 22px", fontSize: 14 }}>
            Start free trial
          </Btn>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              lineHeight: 1.25,
              fontSize: 13,
            }}
          >
            <span style={{ fontWeight: 600, color: "var(--ink)" }}>
              Get 14 days free,
            </span>
            <span style={{ color: "var(--muted)" }}>
              then 3 months for $1/month
            </span>
          </div>
          <div style={{ position: "relative", marginLeft: "auto" }}>
            <Btn variant="ghost" icon={<PlayIcon />}>
              How it works
            </Btn>
            <HeroArrow />
          </div>
        </div>
      </div>

      <DashboardPreview />
    </section>
  );
}
