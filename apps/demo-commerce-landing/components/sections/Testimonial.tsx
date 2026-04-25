export function Testimonial() {
  return (
    <section style={{ padding: "64px 0" }}>
      <div
        className="wrap"
        style={{
          display: "grid",
          gridTemplateColumns: "1.25fr 1fr",
          gap: 48,
          alignItems: "center",
        }}
      >
        <div>
          <div
            aria-hidden
            style={{
              display: "flex",
              gap: 2,
              color: "var(--accent)",
              marginBottom: 22,
            }}
          >
            {Array.from({ length: 5 }).map((_, i) => (
              <svg
                key={i}
                width="16"
                height="16"
                viewBox="0 0 16 16"
                fill="currentColor"
              >
                <path d="M8 1L10 6L15 6L11 9L13 14L8 11L3 14L5 9L1 6L6 6L8 1Z" />
              </svg>
            ))}
          </div>
          <blockquote
            style={{
              margin: 0,
              fontSize: 26,
              letterSpacing: "-0.01em",
              lineHeight: 1.3,
              fontWeight: 500,
              color: "var(--ink)",
              maxWidth: 560,
            }}
          >
            Northwind has genuinely changed how I run my studio. Selling digital
            products used to be a compliance nightmare — now renewals, tax and
            chargebacks just… happen. I recommend it to every founder I meet.
          </blockquote>
          <div style={{ marginTop: 24 }}>
            <div style={{ fontWeight: 600, fontSize: 14 }}>Mira Valente</div>
            <div style={{ color: "var(--muted)", fontSize: 13 }}>
              Founder, Skyprose Ventures · Melbourne, Australia
            </div>
          </div>
        </div>
        <div
          style={{
            aspectRatio: "4 / 5",
            borderRadius: 14,
            overflow: "hidden",
            border: "1px solid var(--line)",
            background:
              "repeating-linear-gradient(135deg, #efeee5 0 10px, #f6f5ee 10px 20px)",
            position: "relative",
            display: "flex",
            alignItems: "flex-end",
            justifyContent: "center",
            padding: 20,
          }}
        >
          <span
            style={{
              fontFamily: "var(--font-geist-mono)",
              fontSize: 11,
              textTransform: "uppercase",
              letterSpacing: "0.08em",
              color: "var(--muted)",
              background: "rgba(255,255,255,0.8)",
              padding: "4px 8px",
              borderRadius: 4,
            }}
          >
            [ founder portrait ]
          </span>
        </div>
      </div>
    </section>
  );
}
