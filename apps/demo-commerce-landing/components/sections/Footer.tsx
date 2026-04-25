"use client";

import { Btn, Logo } from "../atoms";

function FooterCol({ title, items }: { title: string; items: string[] }) {
  return (
    <div>
      <div className="mono" style={{ marginBottom: 16 }}>
        {title}
      </div>
      <ul
        style={{
          listStyle: "none",
          padding: 0,
          margin: 0,
          display: "flex",
          flexDirection: "column",
          gap: 10,
        }}
      >
        {items.map((x) => (
          <li key={x}>
            <a
              href="#"
              style={{
                color: "var(--ink-2)",
                fontSize: 14,
                textDecoration: "none",
              }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.color = "var(--accent)")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.color = "var(--ink-2)")
              }
            >
              {x}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}

export function Footer() {
  return (
    <footer
      style={{
        padding: "48px 0 0",
        borderTop: "1px solid var(--line)",
        marginTop: 32,
      }}
    >
      <div className="wrap">
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1.3fr 1fr",
            gap: 32,
            paddingBottom: 56,
            borderBottom: "1px solid var(--line-2)",
          }}
        >
          <div>
            <h3
              style={{
                margin: 0,
                fontSize: 30,
                letterSpacing: "-0.02em",
                fontWeight: 600,
                lineHeight: 1.1,
              }}
            >
              Get set up today with a 14-day free trial.
            </h3>
            <p
              style={{
                color: "var(--muted)",
                marginTop: 12,
                fontSize: 15,
                maxWidth: 520,
              }}
            >
              Explore every corner of Northwind for two weeks, no card required.
              Keep what you build.
            </p>
          </div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 18,
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
          </div>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1.2fr repeat(5, 1fr)",
            gap: 32,
            padding: "48px 0",
          }}
        >
          <div>
            <Logo />
            <p
              style={{
                color: "var(--muted)",
                fontSize: 13,
                marginTop: 14,
                maxWidth: 260,
                lineHeight: 1.55,
              }}
            >
              Payments, tax and billing infrastructure for digital businesses —
              global from day one.
            </p>
          </div>
          <FooterCol
            title="Product"
            items={[
              "Overview",
              "Features",
              "Solutions",
              "Tutorials",
              "Pricing",
              "Releases",
            ]}
          />
          <FooterCol
            title="Company"
            items={[
              "About us",
              "Careers",
              "Press",
              "News",
              "Media kit",
              "Contact",
            ]}
          />
          <FooterCol
            title="Resources"
            items={[
              "Blog",
              "Newsletter",
              "Events",
              "Help center",
              "Tutorials",
              "Support",
            ]}
          />
          <FooterCol
            title="Use cases"
            items={[
              "Startups",
              "Enterprise",
              "Government",
              "SaaS",
              "Marketplaces",
              "E-commerce",
            ]}
          />
          <FooterCol
            title="Social"
            items={[
              "Twitter",
              "LinkedIn",
              "Facebook",
              "GitHub",
              "AngelList",
              "Dribbble",
            ]}
          />
        </div>

        <div
          style={{
            padding: "28px 0",
            borderTop: "1px solid var(--line-2)",
            display: "flex",
            justifyContent: "space-between",
            color: "var(--muted)",
            fontSize: 13,
          }}
        >
          <div>© 2026 Northwind Inc. All rights reserved.</div>
          <div style={{ display: "flex", gap: 20 }}>
            <a
              href="#"
              style={{ color: "inherit", textDecoration: "none" }}
            >
              Terms
            </a>
            <a
              href="#"
              style={{ color: "inherit", textDecoration: "none" }}
            >
              Privacy
            </a>
            <a
              href="#"
              style={{ color: "inherit", textDecoration: "none" }}
            >
              Cookies
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
