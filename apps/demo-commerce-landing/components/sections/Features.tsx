"use client";

import { Btn, PlayIcon } from "../atoms";

function FeatureIcon({ d }: { d: string }) {
  return (
    <div
      style={{
        width: 34,
        height: 34,
        borderRadius: 8,
        border: "1px solid var(--line)",
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        background: "white",
      }}
    >
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
        <path
          d={d}
          stroke="var(--ink)"
          strokeWidth="1.3"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
        />
      </svg>
    </div>
  );
}

const ITEMS = [
  {
    t: "Sell anything",
    d: "Software, subscriptions, memberships, e-books, physical goods or bundled plans — one product catalog, any pricing model.",
    p: "M2 5L8 2L14 5L8 8L2 5ZM2 5V11L8 14M14 5V11L8 14",
  },
  {
    t: "Sell to anyone",
    d: "Localized checkout in 135+ currencies, with tax, VAT and GST handled automatically at the border.",
    p: "M8 1.5V14.5M1.5 8H14.5M3 3.5C5 6 5 10 3 12.5M13 3.5C11 6 11 10 13 12.5",
  },
  {
    t: "Sell anywhere",
    d: "Hosted checkout, embedded components, or a headless API. Plug into Shopify, Webflow and 300+ apps through Zapier.",
    p: "M2 8L5 3L8 8L11 3L14 8L11 13L8 8L5 13L2 8Z",
  },
  {
    t: "Stay tax compliant",
    d: "We're your merchant of record — we collect and remit sales tax, VAT and GST in every jurisdiction, automatically.",
    p: "M3 2H13V14H3V2ZM5.5 5.5H10.5M5.5 8H10.5M5.5 10.5H8.5",
  },
  {
    t: "Automate SaaS billing",
    d: "Dunning, proration, trials, coupons, usage-based pricing — built in. Route renewals across 12 payment methods.",
    p: "M8 2.5V8L11.5 10M2 8a6 6 0 1 0 6-6",
  },
  {
    t: "Stop fraud with A.I.",
    d: "A real-time model trained on $40B in transactions flags chargebacks, refund abuse and sign-up fraud before they post.",
    p: "M8 1.5L13 4V8C13 11 10.5 13.5 8 14.5C5.5 13.5 3 11 3 8V4L8 1.5ZM6 8L7.5 9.5L10.5 6.5",
  },
];

export function Features() {
  return (
    <section style={{ padding: "140px 0 72px" }}>
      <div className="wrap">
        <div style={{ maxWidth: 640, marginBottom: 40 }}>
          <div className="mono" style={{ marginBottom: 10 }}>
            The platform
          </div>
          <h2
            style={{
              margin: 0,
              fontSize: 38,
              letterSpacing: "-0.02em",
              lineHeight: 1.1,
              fontWeight: 600,
            }}
          >
            One commerce stack behind it all.
          </h2>
          <p
            style={{
              color: "var(--muted)",
              marginTop: 14,
              fontSize: 16,
              maxWidth: 560,
            }}
          >
            Everything you need to sell locally and globally. You keep control of
            pricing, branding and 100% of the revenue — zero hidden fees.
          </p>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)",
            border: "1px solid var(--line)",
            borderRadius: 16,
            overflow: "hidden",
            background: "white",
          }}
        >
          {ITEMS.map((it, i) => (
            <div
              key={it.t}
              style={{
                padding: "28px 26px 30px",
                borderRight: i % 3 !== 2 ? "1px solid var(--line-2)" : "none",
                borderBottom: i < 3 ? "1px solid var(--line-2)" : "none",
              }}
            >
              <FeatureIcon d={it.p} />
              <div
                style={{
                  fontWeight: 600,
                  fontSize: 16,
                  marginTop: 20,
                  letterSpacing: "-0.005em",
                }}
              >
                {it.t}
              </div>
              <p
                style={{
                  color: "var(--muted)",
                  fontSize: 14,
                  marginTop: 8,
                  lineHeight: 1.55,
                }}
              >
                {it.d}
              </p>
            </div>
          ))}
        </div>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 16,
            marginTop: 36,
            flexWrap: "wrap",
          }}
        >
          <Btn variant="primary" style={{ padding: "12px 20px" }}>
            Start free trial
          </Btn>
          <div
            style={{ fontSize: 13, color: "var(--muted)", lineHeight: 1.3 }}
          >
            <div style={{ color: "var(--ink)", fontWeight: 600 }}>
              Get 14 days free,
            </div>
            then 3 months for $1/month
          </div>
          <Btn
            variant="ghost"
            icon={<PlayIcon />}
            style={{ marginLeft: "auto" }}
          >
            How it works
          </Btn>
        </div>
      </div>
    </section>
  );
}
