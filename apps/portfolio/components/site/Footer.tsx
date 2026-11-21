import Link from "next/link";
import { CONTACT_EMAIL, backdrops, brand, interfaces, objects, products, prototypes, web } from "@/lib/work";
import { ThemeSwitch } from "./ThemeToggle";

export function Footer() {
  const painters = Array.from(
    new Set(Object.values(backdrops).map((b) => b.credit.split(",")[0])),
  );
  return (
    <footer className="footer">
      <div className="wrap">
        <div className="footer__cols">
          <div>
            <h2>Objects</h2>
            <ul>
              {objects.map((o) => (
                <li key={o.slug}>
                  <Link href={o.href!}>{o.short}</Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h2>Software</h2>
            <ul>
              {products.map((o) => (
                <li key={o.slug}>
                  {o.href ? (
                    <a href={o.href} target="_blank" rel="noopener noreferrer">
                      {o.short} ↗
                    </a>
                  ) : (
                    <Link href="/software">{o.short}</Link>
                  )}
                </li>
              ))}
              {prototypes.map((o) => (
                <li key={o.slug}>
                  <Link href={o.href!}>{o.short}</Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h2>Web, interface, brand</h2>
            <ul>
              {web.map((o) => (
                <li key={o.slug}>
                  {o.href ? (
                    <a href={o.href} target="_blank" rel="noopener noreferrer">
                      {o.short} ↗
                    </a>
                  ) : (
                    <Link href="/software#websites">{o.short}</Link>
                  )}
                </li>
              ))}
              {[...interfaces, ...brand].map((o) => (
                <li key={o.slug}>
                  <Link href={o.href!}>{o.short}</Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h2>Ryan</h2>
            <ul>
              <li>
                <Link href="/work">All work</Link>
              </li>
              <li>
                <Link href="/about">About</Link>
              </li>
              <li>
                <Link href="/contact">Contact</Link>
              </li>
              <li>
                <a href={`mailto:${CONTACT_EMAIL}`}>Email</a>
              </li>
            </ul>
          </div>
          <p className="footer__note">
            The paintings behind the windows are in the public domain: {painters.join(", ")}.
            Images courtesy of the Art Institute of Chicago.
          </p>
        </div>
        <div className="footer__base">
          <span>© {new Date().getFullYear()} Ryan Zhang</span>
          <ThemeSwitch />
        </div>
      </div>
    </footer>
  );
}
