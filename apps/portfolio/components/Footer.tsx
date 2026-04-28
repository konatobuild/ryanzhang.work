"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { MetaLabel } from "./ui/MetaLabel";

const CONTACT_EMAIL = "ryan.runsheng@gmail.com";

export function Footer() {
  const pathname = usePathname();
  // Home is a fixed-positioned deck — footer is irrelevant there.
  if (pathname === "/") return null;

  const year = new Date().getFullYear();
  return (
    <footer className="border-t border-[color:var(--color-hairline)] mt-24">
      <div className="container-page px-6 md:px-10 py-16 md:py-20 grid gap-10 md:grid-cols-[1.5fr_1fr_1fr]">
        <div>
          <MetaLabel as="p" className="mb-4">
            Let&apos;s work together
          </MetaLabel>
          <h2 className="text-3xl md:text-5xl font-semibold leading-[1.05]">
            Have a brief that needs design and code under one roof?
          </h2>
          <a
            href={`mailto:${CONTACT_EMAIL}`}
            className="link-klein inline-block mt-6 text-lg font-medium"
          >
            {CONTACT_EMAIL}
          </a>
        </div>

        <div>
          <MetaLabel as="p" className="mb-4">
            Navigate
          </MetaLabel>
          <ul className="space-y-2 text-[15px]">
            <li>
              <Link href="/" className="link-klein">
                Selected work
              </Link>
            </li>
            <li>
              <Link href="/about" className="link-klein">
                About
              </Link>
            </li>
            <li>
              <Link href="/industrial-design" className="link-klein">
                Industrial design
              </Link>
            </li>
            <li>
              <Link href="/contact" className="link-klein">
                Contact
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <MetaLabel as="p" className="mb-4">
            Elsewhere
          </MetaLabel>
          <ul className="space-y-2 text-[15px]">
            <li>
              <a
                href="https://www.linkedin.com/in/"
                target="_blank"
                rel="noopener noreferrer"
                className="link-klein"
              >
                LinkedIn
              </a>
            </li>
            <li>
              <span className="text-[color:var(--color-muted)]">
                Upwork — coming soon
              </span>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-[color:var(--color-hairline)]">
        <div className="container-page px-6 md:px-10 py-6 flex items-center justify-between text-xs text-[color:var(--color-muted)]">
          <span>© {year} Ryan Zhang. All rights reserved.</span>
          <span className="meta-text">ryanzhang.work</span>
        </div>
      </div>
    </footer>
  );
}
