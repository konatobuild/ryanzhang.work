"use client";

import { useState } from "react";
import { ArrowUR } from "../shared";

const PRACTICE_OPTIONS = [
  "Corporate & M&A",
  "Disputes & Arbitration",
  "International & Tax",
  "IP & Employment",
  "Not sure yet",
];

type ContactBlockProps = { label: string; lines: string[] };
const ContactBlock = ({ label, lines }: ContactBlockProps) => (
  <div>
    <div className="eyebrow light" style={{ marginBottom: 12 }}>
      — {label}
    </div>
    {lines.map((l, i) => (
      <div
        key={i}
        style={{
          fontSize: i === 0 ? 15 : 14,
          color: i === 0 ? "var(--cream)" : "rgba(244,241,234,.65)",
          lineHeight: 1.55,
        }}
      >
        {l}
      </div>
    ))}
  </div>
);

type FieldGroupProps = { label: string; children: React.ReactNode };
const FieldGroup = ({ label, children }: FieldGroupProps) => (
  <div>
    <div className="eyebrow light" style={{ marginBottom: 14 }}>
      — {label}
    </div>
    {children}
  </div>
);

export default function Contact() {
  const [practice, setPractice] = useState("Corporate & M&A");
  const [form, setForm] = useState({ name: "", email: "", details: "" });
  const [errors, setErrors] = useState<{ name?: string; email?: string }>({});
  const [sent, setSent] = useState(false);

  const set = (k: "name" | "email" | "details") =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
      setForm({ ...form, [k]: e.target.value });

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const errs: { name?: string; email?: string } = {};
    if (!form.name.trim()) errs.name = "Required";
    if (!form.email.trim()) errs.email = "Required";
    else if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(form.email))
      errs.email = "Enter a valid email";
    setErrors(errs);
    if (Object.keys(errs).length) return;
    setSent(true);
  };

  const sharedInputStyle: React.CSSProperties = {
    background: "transparent",
    border: "none",
    outline: "none",
    width: "100%",
    padding: "10px 0",
    color: "var(--cream)",
    fontFamily: "inherit",
    fontSize: 16,
  };

  return (
    <section
      id="contact"
      style={{
        background: "var(--ink-2)",
        color: "var(--cream)",
        padding: "140px 0 120px",
      }}
    >
      <div className="wrap">
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "200px 1fr",
            gap: 80,
            alignItems: "start",
            marginBottom: 80,
          }}
        >
          <div className="eyebrow light reveal">§ 04 — Engage</div>
          <div className="reveal">
            <h2
              className="display"
              style={{
                fontSize: "clamp(48px, 5vw, 76px)",
                margin: 0,
                lineHeight: 1.05,
                color: "var(--cream)",
              }}
            >
              Bring the matter.
              <br />
              <em style={{ color: "var(--accent-2)" }}>
                We’ll bring the plan.
              </em>
            </h2>
            <p
              style={{
                marginTop: 28,
                fontSize: 15,
                lineHeight: 1.65,
                color: "rgba(244,241,234,.65)",
                maxWidth: "46ch",
              }}
            >
              Initial consultations are complimentary. A partner will reply
              within one business day. Please do not send confidential or
              privileged information through this form.
            </p>
          </div>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "320px 1fr",
            gap: 80,
            borderTop: "1px solid var(--edge-dark)",
            paddingTop: 48,
          }}
        >
          <aside
            className="reveal"
            style={{ display: "flex", flexDirection: "column", gap: 36 }}
          >
            <ContactBlock
              label="San Francisco — Headquarters"
              lines={["412 Pine Street, Suite 2200", "San Francisco, CA 94108"]}
            />
            <ContactBlock
              label="Direct line"
              lines={["+1 (415) 555 · 0142"]}
            />
            <ContactBlock
              label="General enquiries"
              lines={["hello@meridiancole.law"]}
            />
            <ContactBlock
              label="Hours"
              lines={[
                "Monday – Friday",
                "08:30 – 18:00 Pacific",
                "After-hours for existing clients",
              ]}
            />
          </aside>

          <div className="reveal">
            {sent ? (
              <div
                style={{
                  padding: "48px 40px",
                  border: "1px solid var(--edge-dark)",
                  background: "rgba(244,241,234,.04)",
                }}
              >
                <div
                  className="eyebrow light"
                  style={{ marginBottom: 16 }}
                >
                  — Received
                </div>
                <div
                  className="display"
                  style={{
                    fontSize: 32,
                    lineHeight: 1.15,
                    color: "var(--cream)",
                  }}
                >
                  Thank you, {form.name.split(" ")[0]}.
                  <br />
                  <em style={{ color: "var(--accent-2)" }}>
                    A partner will reply within one business day.
                  </em>
                </div>
                <button
                  onClick={() => {
                    setSent(false);
                    setForm({ name: "", email: "", details: "" });
                  }}
                  style={{ marginTop: 32 }}
                  className="btn btn-outline-light"
                >
                  Send another <ArrowUR />
                </button>
              </div>
            ) : (
              <form
                onSubmit={submit}
                style={{ display: "flex", flexDirection: "column", gap: 44 }}
              >
                <FieldGroup label="Practice area">
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                    {PRACTICE_OPTIONS.map((o) => (
                      <button
                        key={o}
                        type="button"
                        className={`pill light ${practice === o ? "active" : ""}`}
                        onClick={() => setPractice(o)}
                      >
                        {o}
                      </button>
                    ))}
                  </div>
                </FieldGroup>

                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr",
                    gap: 32,
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      gap: 8,
                    }}
                  >
                    <div className="eyebrow light">— Your name</div>
                    <div
                      style={{
                        borderBottom: `1px solid ${errors.name ? "#b26a6a" : "var(--edge-dark)"}`,
                        paddingBottom: 2,
                      }}
                    >
                      <input
                        type="text"
                        placeholder="Full name"
                        value={form.name}
                        onChange={set("name")}
                        style={sharedInputStyle}
                      />
                    </div>
                    {errors.name && (
                      <span
                        style={{
                          color: "#d09999",
                          fontSize: 11,
                          letterSpacing: ".12em",
                          textTransform: "uppercase",
                        }}
                      >
                        {errors.name}
                      </span>
                    )}
                  </div>

                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      gap: 8,
                    }}
                  >
                    <div className="eyebrow light">— Your email</div>
                    <div
                      style={{
                        borderBottom: `1px solid ${errors.email ? "#b26a6a" : "var(--edge-dark)"}`,
                        paddingBottom: 2,
                      }}
                    >
                      <input
                        type="email"
                        placeholder="name@company.com"
                        value={form.email}
                        onChange={set("email")}
                        style={sharedInputStyle}
                      />
                    </div>
                    {errors.email && (
                      <span
                        style={{
                          color: "#d09999",
                          fontSize: 11,
                          letterSpacing: ".12em",
                          textTransform: "uppercase",
                        }}
                      >
                        {errors.email}
                      </span>
                    )}
                  </div>
                </div>

                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: 8,
                  }}
                >
                  <div className="eyebrow light">— Details (optional)</div>
                  <div
                    style={{
                      borderBottom: "1px solid var(--edge-dark)",
                      paddingBottom: 2,
                    }}
                  >
                    <textarea
                      rows={2}
                      placeholder="A sentence or two on what you’re working on."
                      value={form.details}
                      onChange={set("details")}
                      style={{ ...sharedInputStyle, resize: "none" }}
                    />
                  </div>
                </div>

                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 20,
                    marginTop: 8,
                  }}
                >
                  <button type="submit" className="btn btn-light">
                    Send message <ArrowUR />
                  </button>
                  <span
                    style={{
                      fontSize: 11,
                      color: "rgba(244,241,234,.5)",
                      letterSpacing: ".16em",
                      textTransform: "uppercase",
                    }}
                  >
                    — No attorney-client relationship is formed until an
                    engagement letter is signed
                  </span>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
