import { cases, type CaseCategory } from "@/lib/cases";
import { CaseCard } from "./CaseCard";
import { MetaLabel } from "./ui/MetaLabel";

interface Section {
  id: CaseCategory;
  title: string;
  subtitle: string;
}

const sections: Section[] = [
  {
    id: "landing",
    title: "Landing pages",
    subtitle:
      "Marketing surfaces that convert — tuned for specific verticals, not template skins.",
  },
  {
    id: "web-app",
    title: "Web applications",
    subtitle:
      "Operational surfaces where dense data, flow, and decisions have to coexist.",
  },
  {
    id: "mobile",
    title: "Mobile",
    subtitle: "Consumer-facing experiences sized for the thumb.",
  },
];

export function FeaturedWorkGrid() {
  return (
    <div className="space-y-20 md:space-y-28">
      {sections.map((section) => {
        const items = cases.filter((c) => c.category === section.id);
        if (items.length === 0) return null;
        return (
          <section
            key={section.id}
            id={section.id}
            aria-labelledby={`section-${section.id}`}
          >
            <div className="mb-8 md:mb-10 flex items-end justify-between gap-6">
              <div>
                <MetaLabel as="p" className="mb-2">
                  {String(sections.indexOf(section) + 1).padStart(2, "0")}
                </MetaLabel>
                <h2
                  id={`section-${section.id}`}
                  className="text-3xl md:text-5xl font-semibold tracking-tight"
                >
                  {section.title}
                </h2>
                <p className="mt-3 text-[color:var(--color-muted)] max-w-xl">
                  {section.subtitle}
                </p>
              </div>
              <MetaLabel className="hidden md:block">
                {items.length.toString().padStart(2, "0")} cases
              </MetaLabel>
            </div>

            <div className="grid gap-6 md:gap-7 sm:grid-cols-2 lg:grid-cols-3">
              {items.map((entry) => (
                <CaseCard key={entry.slug} entry={entry} />
              ))}
            </div>
          </section>
        );
      })}
    </div>
  );
}
