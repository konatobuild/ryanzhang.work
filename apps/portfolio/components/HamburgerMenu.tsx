"use client";

import Link from "next/link";
import { useEffect } from "react";

interface HamburgerMenuProps {
  open: boolean;
  onClose: () => void;
}

const primary = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
  { href: "/industrial-design", label: "Industrial Design" },
  { href: "/contact", label: "Contact" },
];

const secondary = [
  { href: "mailto:ryan.runsheng@gmail.com", label: "ryan.runsheng@gmail.com" },
  { href: "https://www.linkedin.com/in/", label: "LinkedIn" },
];

export function HamburgerMenu({ open, onClose }: HamburgerMenuProps) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Navigation menu"
      className="fixed inset-0 z-50 bg-[color:var(--color-canvas)]"
    >
      <div className="grid grid-cols-[1fr_auto_1fr] items-center px-6 md:px-10 h-14 border-b border-[color:var(--color-hairline)]">
        <div aria-hidden="true" />
        <p className="justify-self-center font-mono text-[11px] tracking-[0.18em] uppercase">
          MENU <span className="text-[color:var(--color-muted)]">/</span>{" "}
          NAVIGATION
        </p>
        <div className="justify-self-end">
          <button
            type="button"
            onClick={onClose}
            aria-label="Close menu"
            className="inline-flex h-8 w-8 items-center justify-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--color-klein)] focus-visible:ring-offset-2 rounded-sm"
          >
            <svg
              viewBox="0 0 24 24"
              width="18"
              height="18"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              aria-hidden="true"
            >
              <path d="M4 4L20 20M20 4L4 20" />
            </svg>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-12 gap-6 md:gap-8 px-6 md:px-10 pt-12 md:pt-20">
        <div className="col-span-12 md:col-span-2">
          <p className="font-mono text-[11px] tracking-[0.18em] uppercase text-[color:var(--color-muted)]">
            Primary
          </p>
        </div>
        <nav
          className="col-span-12 md:col-span-10 flex flex-col"
          aria-label="Primary navigation"
        >
          {primary.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={onClose}
              className="group block border-b border-[color:var(--color-hairline)] py-5 md:py-7 text-[32px] md:text-[56px] font-semibold tracking-[-0.02em] hover:text-[color:var(--color-klein)] transition-colors"
            >
              <span className="mr-4 font-mono text-[11px] tracking-[0.18em] uppercase text-[color:var(--color-muted)] group-hover:text-[color:var(--color-klein)] align-middle">
                →
              </span>
              {link.label}
            </Link>
          ))}
        </nav>
      </div>

      <div className="grid grid-cols-12 gap-6 md:gap-8 px-6 md:px-10 pt-16 md:pt-24">
        <div className="col-span-12 md:col-span-2">
          <p className="font-mono text-[11px] tracking-[0.18em] uppercase text-[color:var(--color-muted)]">
            Elsewhere
          </p>
        </div>
        <ul className="col-span-12 md:col-span-10 flex flex-col gap-3">
          {secondary.map((link) => (
            <li key={link.href}>
              <a
                href={link.href}
                target={link.href.startsWith("http") ? "_blank" : undefined}
                rel={
                  link.href.startsWith("http") ? "noopener noreferrer" : undefined
                }
                className="inline-block text-[15px] hover:text-[color:var(--color-klein)] transition-colors"
              >
                {link.label}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
