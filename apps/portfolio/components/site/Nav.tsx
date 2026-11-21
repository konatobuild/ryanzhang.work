"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useSyncExternalStore } from "react";
import { CopyEmail } from "./CopyEmail";
import { Icon } from "./Marks";

/** Every item is its own page. */
const LINKS = [
  { href: "/work", label: "Work" },
  { href: "/industrial-design", label: "Industrial design" },
  { href: "/software", label: "Software" },
  { href: "/about", label: "About" },
];

const noop = () => () => {};

/**
 * industrial.ryanzhang.work serves the industrial page as its root, so "/"
 * there would loop back to it. On that host, the home link goes to the apex.
 */
function useHomeHref() {
  return useSyncExternalStore(
    noop,
    () => (window.location.hostname.startsWith("industrial.") ? "https://ryanzhang.work/" : "/"),
    () => "/",
  );
}

export function Nav() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const home = useHomeHref();

  return (
    <header className="nav">
      <div className="wrap">
        <div className="nav__row">
          <Link href={home} className="brand">
            Ryan Zhang
          </Link>
          <nav className="nav__links" aria-label="Primary">
            {LINKS.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                aria-current={pathname === l.href || pathname.startsWith(l.href + "/") ? "page" : undefined}
              >
                {l.label}
              </Link>
            ))}
          </nav>
          <div className="nav__end">
            <CopyEmail className="btn btn--s btn--line nav__copy" />
            <Link href="/contact" className="btn btn--s">
              Contact
            </Link>
            <button
              type="button"
              className="icon-btn nav__menu-btn"
              aria-expanded={open}
              aria-controls="nav-sheet"
              aria-label={open ? "Close menu" : "Open menu"}
              onClick={() => setOpen((v) => !v)}
            >
              <Icon name={open ? "close" : "menu"} />
            </button>
          </div>
        </div>
        <nav id="nav-sheet" className="nav__sheet" data-open={open} aria-label="Menu">
          {LINKS.map((l) => (
            <Link key={l.href} href={l.href} onClick={() => setOpen(false)}>
              {l.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
