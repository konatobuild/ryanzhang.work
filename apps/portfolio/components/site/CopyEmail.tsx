"use client";

import { useState } from "react";
import { CONTACT_EMAIL } from "@/lib/work";

/**
 * Copies the address. Most people who want to write already have a mail
 * client open somewhere else; a mailto link is the wrong tool for them.
 */
export function CopyEmail({ className }: { className?: string }) {
  const [copied, setCopied] = useState(false);

  async function copy() {
    try {
      await navigator.clipboard.writeText(CONTACT_EMAIL);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1800);
    } catch {
      window.location.href = `mailto:${CONTACT_EMAIL}`;
    }
  }

  return (
    <button type="button" className={className} onClick={copy} aria-live="polite">
      {copied ? "Copied" : "Copy email"}
    </button>
  );
}
