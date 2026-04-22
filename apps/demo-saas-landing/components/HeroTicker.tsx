"use client";

import { useEffect, useState } from "react";

export function HeroTicker() {
  const [throughput, setThroughput] = useState(2847);
  const [p99, setP99] = useState(11);
  const [anomalies, setAnomalies] = useState(127);

  useEffect(() => {
    const id = setInterval(() => {
      setThroughput((v) => {
        const step = Math.floor(Math.random() * 23) - 11;
        const next = v + step;
        return next < 2600 || next > 3100 ? 2847 : next;
      });
      if (Math.random() < 0.18) {
        setP99((v) => {
          const next = v + (Math.random() < 0.5 ? -1 : 1);
          return Math.max(9, Math.min(14, next));
        });
      }
      if (Math.random() < 0.22) {
        setAnomalies((v) => v + 1);
      }
    }, 1400);
    return () => clearInterval(id);
  }, []);

  return (
    <span>
      {throughput.toLocaleString()} TRACES/S · P99 {p99}MS · {anomalies}{" "}
      ANOMALIES ▲
    </span>
  );
}
