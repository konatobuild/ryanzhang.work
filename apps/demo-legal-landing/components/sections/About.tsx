"use client";

import { useEffect, useRef, useState } from "react";

const useCounter = (target: number, start: boolean) => {
  const [val, setVal] = useState(0);
  useEffect(() => {
    if (!start) return;
    let raf = 0;
    const dur = 1400;
    const t0 = performance.now();
    const tick = (t: number) => {
      const p = Math.min(1, (t - t0) / dur);
      const eased = 1 - Math.pow(1 - p, 3);
      setVal(Math.round(target * eased));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [start, target]);
  return val;
};

type StatProps = {
  n: string | number;
  suffix: string;
  label: string;
  num: string;
  last: boolean;
};

const Stat = ({ n, suffix, label, num, last }: StatProps) => (
  <div
    className="reveal"
    style={{
      padding: "56px 36px 48px",
      borderRight: last ? "none" : "1px solid var(--edge)",
      display: "flex",
      flexDirection: "column",
      gap: 32,
    }}
  >
    <div className="eyebrow">— {num}</div>
    <div
      className="display numeral"
      style={{
        fontSize: "clamp(64px, 6vw, 92px)",
        letterSpacing: "-0.02em",
        lineHeight: 1,
      }}
    >
      {n}
      <span style={{ color: "var(--accent)" }}>{suffix}</span>
    </div>
    <div
      style={{ fontSize: 13, color: "var(--muted)", letterSpacing: ".02em" }}
    >
      {label}
    </div>
  </div>
);

export default function About() {
  const [visible, setVisible] = useState(false);
  const ref = useRef<HTMLElement | null>(null);
  useEffect(() => {
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) setVisible(true);
      },
      { threshold: 0.25 },
    );
    if (ref.current) io.observe(ref.current);
    return () => io.disconnect();
  }, []);

  const c1 = useCounter(184, visible);
  const c2 = useCounter(9, visible);

  return (
    <section id="firm" ref={ref} style={{ padding: "140px 0 120px" }}>
      <div className="wrap">
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "200px 1fr",
            gap: 80,
            alignItems: "start",
            marginBottom: 120,
          }}
        >
          <div className="eyebrow reveal">§ 01 — The Firm</div>
          <div className="reveal">
            <p
              className="display"
              style={{
                fontSize: "clamp(28px, 2.8vw, 40px)",
                lineHeight: 1.28,
                margin: 0,
                maxWidth: "28ch",
              }}
            >
              We represent founders, investors, and operators through formation,
              financing, disputes, and transition —{" "}
              <em>with the restraint of a small firm</em> and the reach of a
              much larger one.
            </p>
          </div>
        </div>

        <div
          style={{
            borderTop: "1px solid var(--edge)",
            borderBottom: "1px solid var(--edge)",
            display: "grid",
            gridTemplateColumns: "repeat(4, 1fr)",
          }}
        >
          <Stat
            n={c1}
            suffix="+"
            label="Matters closed"
            num="01"
            last={false}
          />
          <Stat
            n={c2.toString().padStart(2, "0")}
            suffix=""
            label="Jurisdictions"
            num="02"
            last={false}
          />
          <Stat n="3" suffix="" label="Partners" num="03" last={false} />
          <Stat
            n="100"
            suffix="%"
            label="Partner-led matters"
            num="04"
            last={true}
          />
        </div>
      </div>
    </section>
  );
}
