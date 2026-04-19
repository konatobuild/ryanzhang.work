"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const links = [
  { href: "/", label: "Work" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
];

export function Nav() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-40 bg-[color:var(--color-canvas)]/80 backdrop-blur-md border-b border-[color:var(--color-hairline)]">
      <div className="container-page flex items-center justify-between px-6 md:px-10 h-16">
        <Link
          href="/"
          className="text-[15px] font-semibold tracking-tight"
          aria-label="Ryan Zhang — home"
        >
          Ryan Zhang
          <span className="text-[color:var(--color-muted)] font-normal">
            {" "}
            · Design Engineer
          </span>
        </Link>
        <nav aria-label="Primary">
          <ul className="flex items-center gap-1">
            {links.map((link) => {
              const isActive =
                link.href === "/"
                  ? pathname === "/" || pathname?.startsWith("/work")
                  : pathname?.startsWith(link.href);
              return (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="relative inline-flex items-center h-10 px-4 text-[14px] font-medium text-[color:var(--color-ink)] hover:text-[color:var(--color-klein)] transition-colors"
                    aria-current={isActive ? "page" : undefined}
                  >
                    {link.label}
                    {isActive && (
                      <span
                        className="absolute left-4 right-4 -bottom-0.5 h-[2px] bg-[color:var(--color-klein)]"
                        aria-hidden="true"
                      />
                    )}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
      </div>
    </header>
  );
}
