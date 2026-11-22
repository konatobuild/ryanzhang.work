import Image from "next/image";
import Link from "next/link";
import { caseStudies, gridPages } from "@/lib/work";

/**
 * The layouts of the 2026 series, one row each: its name, how it looks,
 * and its drawing from above. They are pages under that project.
 */
export function KeyboardLayouts() {
  return (
    <ul className="kbl">
      {gridPages.slice(1).map((k) => {
        const c = caseStudies[k.slug];
        const d = c.images["d-top.webp"];
        return (
          <li key={k.slug}>
            <Link href={k.href!}>
              <div className="kbl__text">
                <p>{c.title}</p>
                <p className="muted">{c.subtitle}</p>
              </div>
              <Image
                src={k.wide.src}
                alt={k.wide.alt}
                width={k.wide.w}
                height={k.wide.h}
                sizes="(max-width: 760px) 45vw, 300px"
              />
              {d ? (
                <Image
                  src={`/work/${k.slug}/d-top.webp`}
                  alt={d.alt}
                  width={d.w}
                  height={d.h}
                  sizes="(max-width: 760px) 55vw, 420px"
                />
              ) : null}
            </Link>
          </li>
        );
      })}
    </ul>
  );
}
