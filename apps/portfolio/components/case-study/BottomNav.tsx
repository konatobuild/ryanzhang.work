import Link from "next/link";
import { MetaLabel } from "../ui/MetaLabel";
import { ButtonLink } from "../ui/Button";
import type { CaseStudyNav } from "./types";

interface BottomNavProps {
  nav?: CaseStudyNav;
}

export function BottomNav({ nav }: BottomNavProps) {
  return (
    <section className="container-page px-6 md:px-10 pt-24 md:pt-32 pb-12">
      <div className="card px-8 py-12 md:px-14 md:py-16 flex flex-col items-center text-center gap-6">
        <MetaLabel as="p">Keep looking · Keep talking</MetaLabel>
        <h2 className="text-3xl md:text-5xl font-semibold tracking-tight max-w-2xl">
          Interested in something similar? Let&apos;s talk.
        </h2>
        <ButtonLink href="mailto:ryan.runsheng@gmail.com">
          Start a conversation →
        </ButtonLink>
      </div>

      {(nav?.previous || nav?.next) && (
        <nav
          aria-label="Case navigation"
          className="mt-10 flex items-center justify-between gap-6 px-2"
        >
          <div>
            {nav.previous ? (
              <Link
                href={`/work/${nav.previous.slug}`}
                className="group inline-flex flex-col"
              >
                <MetaLabel className="mb-1">← Previous</MetaLabel>
                <span className="text-[15px] font-medium link-klein">
                  {nav.previous.title}
                </span>
              </Link>
            ) : (
              <span aria-hidden="true" />
            )}
          </div>

          <div>
            {nav.next ? (
              <Link
                href={`/work/${nav.next.slug}`}
                className="group inline-flex flex-col items-end text-right"
              >
                <MetaLabel className="mb-1">Next →</MetaLabel>
                <span className="text-[15px] font-medium link-klein">
                  {nav.next.title}
                </span>
              </Link>
            ) : (
              <span aria-hidden="true" />
            )}
          </div>
        </nav>
      )}
    </section>
  );
}
