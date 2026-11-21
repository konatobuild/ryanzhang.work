import Image from "next/image";

const USC_STORY = "https://iovine-young.usc.edu/the-pulse/ryan-zhang-msidbt-red-dot-award-winner";

/** A single-colour mark that takes the text colour, so it works in both themes. */
function Mark({ src, w, h, height }: { src: string; w: number; h: number; height: number }) {
  return (
    <span
      className="mark"
      role="img"
      style={
        {
          "--m": `url(${src})`,
          height,
          width: Math.round((height * w) / h),
        } as React.CSSProperties
      }
    />
  );
}

/**
 * Where each cell goes: the organiser's own page about the award (what it
 * is, who runs it, who judges it), not the page of a winning entry. The
 * section is about the awards and their standing.
 */
const ABOUT = {
  redDot: "https://www.red-dot.org/design-concept",
  muse: "https://design.museaward.com/about.php",
  ny: "https://nydesignawards.com/",
  london: "https://thelondondesignawards.com/about.php",
  ida: "https://www.idesignawards.com/about/",
  licc: "https://licc.uk/about/",
};

/** One award, one cell. The whole cell is a link to the page about that award. */
function Honor({
  href,
  level,
  name,
  detail,
  site,
  lead,
  children,
}: {
  href: string;
  level: string;
  name: string;
  detail: string;
  /** The site the link goes to, for the accessible name. */
  site: string;
  lead?: boolean;
  children: React.ReactNode;
}) {
  return (
    <a
      className={lead ? "card honor honor--lead" : "card honor"}
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={`${name}: ${level}. ${detail} Opens ${site}.`}
    >
      <p className="t-s muted honor__level">
        {level}
        <span aria-hidden="true">↗</span>
      </p>
      <div className="honor__badge">{children}</div>
      <div className="honor__text">
        <h3 className={lead ? "t-l" : undefined}>{name}</h3>
        <p className={lead ? "muted" : "t-xs muted"}>{detail}</p>
      </div>
    </a>
  );
}

/**
 * Recognition — Ryan's awards, and nothing else. Eight awards, eight cells:
 * the Red Dot win leads at full height; beside it two rows of four, gold
 * and silver above, mentions and the selection below, then the press
 * story. Awards won twice are shown twice, so the count can be seen
 * without reading. Every cell is built the same way (level, badge at one
 * height, name, year and category) and links to the organiser's page
 * about the award. The badges are the official winner artwork.
 */
export function Recognition() {
  return (
    <section className="wrap section" aria-labelledby="recognition">
      <h2 className="t-xxl center honors__title" id="recognition">
        Eight international design awards.
      </h2>

      <div className="honors">
        <Honor
          lead
          href={ABOUT.redDot}
          level="Winner"
          name="Red Dot Award: Design Concept"
          detail="2025. Red Dot’s award for concepts and prototypes, held in Singapore since 2005."
          site="the award’s page on red-dot.org"
        >
          <Image
            src="/awards/marks/red-dot-ball.webp"
            alt=""
            width={269}
            height={269}
            style={{ width: 132, height: 132 }}
          />
          <Mark src="/awards/marks/red-dot-text.png" w={837} h={71} height={21} />
        </Honor>

        <Honor
          href={ABOUT.muse}
          level="Gold"
          name="MUSE Design Awards"
          detail="2025. Home Appliances."
          site="the award’s page on museaward.com"
        >
          <Image src="/awards/marks/muse-gold.webp" alt="" width={335} height={560} />
        </Honor>

        <Honor
          href={ABOUT.muse}
          level="Gold"
          name="MUSE Design Awards"
          detail="2025. Lifestyle."
          site="the award’s page on museaward.com"
        >
          <Image src="/awards/marks/muse-gold.webp" alt="" width={335} height={560} />
        </Honor>

        <Honor
          href={ABOUT.ny}
          level="Silver"
          name="NY Product Design Awards"
          detail="2024. Household Appliances."
          site="nydesignawards.com"
        >
          <Image src="/awards/marks/ny-silver.webp" alt="" width={425} height={560} />
        </Honor>

        <Honor
          href={ABOUT.london}
          level="Silver"
          name="London Design Awards"
          detail="2024. Tableware, Drinkware & Cookware."
          site="the award’s page on thelondondesignawards.com"
        >
          <Image src="/awards/marks/london-silver.webp" alt="" width={432} height={560} />
        </Honor>

        <Honor
          href={ABOUT.ida}
          level="Honorable mention"
          name="International Design Awards"
          detail="2024. Conceptual Products, Personal."
          site="the award’s page on idesignawards.com"
        >
          <Mark src="/awards/marks/ida.png" w={734} h={659} height={64} />
        </Honor>

        <Honor
          href={ABOUT.ida}
          level="Honorable mention"
          name="International Design Awards"
          detail="2024. Conceptual Products, Food & Beverage."
          site="the award’s page on idesignawards.com"
        >
          <Mark src="/awards/marks/ida.png" w={734} h={659} height={64} />
        </Honor>

        <Honor
          href={ABOUT.licc}
          level="Official selection"
          name="London Int’l Creative Competition"
          detail="2024. Product, Professional."
          site="the award’s page on licc.uk"
        >
          <Mark src="/awards/marks/licc.png" w={900} h={150} height={26} />
        </Honor>

        <Honor
          href={USC_STORY}
          level="In the press"
          name="The story of the Red Dot award"
          detail="July 29, 2025."
          site="the story on usc.edu"
        >
          <p className="honor__press">
            USC Iovine and
            <br />
            Young Academy
          </p>
        </Honor>
      </div>

      <figure className="press">
        <blockquote className="t-l">
          “Ryan Zhang, a visionary designer … honored with one of the most prestigious accolades
          in the global design community: the 2025 Red Dot Design Concept Award.”
        </blockquote>
        <figcaption className="t-s muted">USC Iovine and Young Academy, July 29, 2025</figcaption>
      </figure>
    </section>
  );
}
