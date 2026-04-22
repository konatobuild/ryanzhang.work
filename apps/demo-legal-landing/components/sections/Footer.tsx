import { Logo } from "../shared";

type ColProps = { title: string; links: string[] };
const FooterCol = ({ title, links }: ColProps) => (
  <div>
    <div className="eyebrow" style={{ marginBottom: 18 }}>
      — {title}
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
      {links.map((l) => (
        <li key={l}>
          <a href="#" style={{ color: "var(--ink)", fontSize: 13.5 }}>
            {l}
          </a>
        </li>
      ))}
    </ul>
  </div>
);

export default function Footer() {
  return (
    <footer
      style={{
        background: "var(--cream)",
        color: "var(--ink)",
        padding: "80px 0 40px",
        borderTop: "1px solid var(--edge)",
      }}
    >
      <div className="wrap">
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1.3fr 1fr 1fr 1fr",
            gap: 48,
            paddingBottom: 56,
          }}
        >
          <div>
            <Logo />
            <p
              style={{
                marginTop: 24,
                maxWidth: 340,
                fontSize: 13.5,
                lineHeight: 1.65,
                color: "var(--muted)",
              }}
            >
              A boutique firm serving founders, investors, and family offices
              since 2012. San Francisco · New York · Singapore.
            </p>
          </div>
          <FooterCol
            title="Practice"
            links={[
              "Corporate & M&A",
              "Disputes & Arbitration",
              "International & Tax",
              "IP & Employment",
            ]}
          />
          <FooterCol
            title="Firm"
            links={["The Partners", "Insights", "Case Notes", "Pro Bono", "Press"]}
          />
          <FooterCol
            title="Contact"
            links={[
              "Schedule consultation",
              "Secure intake",
              "hello@meridiancole.law",
              "+1 (415) 555 · 0142",
            ]}
          />
        </div>

        <div className="rule" />

        <div
          style={{
            paddingTop: 24,
            paddingBottom: 20,
            display: "grid",
            gridTemplateColumns: "200px 1fr",
            gap: 40,
          }}
        >
          <div className="eyebrow">Attorney Advertising</div>
          <div
            style={{
              fontSize: 11.5,
              lineHeight: 1.7,
              color: "var(--muted)",
              maxWidth: "78ch",
            }}
          >
            Principal office: 412 Pine Street, Suite 2200, San Francisco, CA
            94108. Responsible attorney: Eleanor R. Meridian. Prior results do
            not guarantee a similar outcome. The information on this website
            is for general purposes only and does not constitute legal advice.
            Contacting the firm does not create an attorney-client
            relationship; such a relationship is formed only upon execution of
            a written engagement letter. Meridian &amp; Cole (Singapore) is a
            foreign law practice registered with the Legal Services Regulatory
            Authority of Singapore; matters of Singapore law are referred to
            locally qualified counsel.
          </div>
        </div>

        <div className="rule" />

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            paddingTop: 24,
            fontSize: 11,
            color: "var(--muted-2)",
            letterSpacing: ".18em",
            textTransform: "uppercase",
          }}
        >
          <span>© MMXXVI — Meridian &amp; Cole LLP</span>
          <span>Privacy · Terms · Accessibility</span>
        </div>
      </div>
    </footer>
  );
}
