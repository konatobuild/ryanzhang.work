import { MetaLabel } from "../ui/MetaLabel";
import type { DesignDecision } from "./types";

interface ApproachProps {
  decisions: DesignDecision[];
}

export function Approach({ decisions }: ApproachProps) {
  return (
    <section className="container-page px-6 md:px-10 pt-24 md:pt-32">
      <div className="grid gap-8 md:grid-cols-[220px_1fr] md:gap-16">
        <div className="md:pt-3">
          <MetaLabel as="p">Approach</MetaLabel>
          <p className="mt-2 text-sm text-[color:var(--color-muted)]">
            Key decisions — what was chosen, what was weighed, and why.
          </p>
        </div>

        <ol className="space-y-12 max-w-3xl">
          {decisions.map((decision, idx) => (
            <li
              key={idx}
              className="border-t border-[color:var(--color-hairline)] pt-8 first:border-t-0 first:pt-0"
            >
              <div className="flex items-baseline gap-4">
                <span className="meta-text">
                  {String(idx + 1).padStart(2, "0")}
                </span>
                <h3 className="text-2xl md:text-[28px] font-semibold tracking-tight">
                  {decision.title}
                </h3>
              </div>
              <p className="mt-4 text-[17px] leading-relaxed text-[color:var(--color-ink)]/80">
                {decision.body}
              </p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
