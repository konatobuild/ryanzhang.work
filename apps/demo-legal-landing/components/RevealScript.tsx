"use client";

import { useEffect } from "react";

export default function RevealScript() {
  useEffect(() => {
    const raf = requestAnimationFrame(() => {
      const io = new IntersectionObserver(
        (entries) => {
          entries.forEach((e) => {
            if (e.isIntersecting) {
              e.target.classList.remove("pending");
              e.target.classList.add("in");
            }
          });
        },
        { threshold: 0.05 },
      );
      document.querySelectorAll(".reveal").forEach((el) => {
        const r = el.getBoundingClientRect();
        if (r.top > window.innerHeight * 0.9) {
          el.classList.add("pending");
          io.observe(el);
        }
      });
    });
    return () => cancelAnimationFrame(raf);
  }, []);

  return null;
}
