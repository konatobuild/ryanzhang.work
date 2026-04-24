import { MetaLabel } from "../ui/MetaLabel";
import type { DesignToken } from "./types";

interface DesignSystemProps {
  label?: string;
  heading?: string;
  intro?: string;
  tokens: DesignToken[];
}

export function DesignSystem({
  label = "Design system",
  heading = "The language, in small pieces",
  intro,
  tokens,
}: DesignSystemProps) {
  return (
    <section className="container-page px-6 md:px-10 pt-24 md:pt-32">
      <div className="grid gap-8 md:grid-cols-[220px_1fr] md:gap-16">
        <div className="md:pt-3">
          <MetaLabel as="p">{label}</MetaLabel>
          {intro && (
            <p className="mt-2 text-sm text-[color:var(--color-muted)]">
              {intro}
            </p>
          )}
        </div>

        <div className="max-w-3xl">
          <h2 className="text-3xl md:text-4xl font-semibold tracking-tight mb-10">
            {heading}
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {tokens.map((token, idx) => (
              <div
                key={idx}
                className="card overflow-hidden flex flex-col"
              >
                <div className="relative aspect-[4/3] bg-[#f4f4f4] flex items-center justify-center overflow-hidden">
                  {token.visual}
                </div>
                <div className="flex flex-col gap-1 px-5 py-4">
                  <div className="flex items-baseline justify-between gap-3">
                    <h3 className="text-base font-semibold tracking-tight">
                      {token.label}
                    </h3>
                    {token.value && (
                      <span className="meta-text whitespace-nowrap">
                        {token.value}
                      </span>
                    )}
                  </div>
                  {token.note && (
                    <p className="text-sm text-[color:var(--color-muted)] leading-relaxed">
                      {token.note}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
