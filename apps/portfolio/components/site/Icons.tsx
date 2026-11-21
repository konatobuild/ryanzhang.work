import Image from "next/image";

/**
 * App icons — a piece of design of its own, shown apart from the products.
 *
 * Four cards, one icon each, built like every other card (kind, name, one
 * line, the picture underneath). Below them, the two icons that are Icon
 * Composer documents: flat layers that the system renders itself, so one
 * drawing has to hold up in six appearances. Those six are shown side by
 * side, rendered from the icon files with Icon Composer's own renderer.
 */
const ICONS = [
  {
    app: "Peeko",
    kind: "Mac app icon",
    text: "A glass ghost slipping out of the notch",
    file: "peeko",
  },
  {
    app: "Digo",
    kind: "Mac app icon",
    text: "The thinking cat inside the app’s own speech bubble, on an ink tile",
    file: "digo-cat",
  },
  {
    app: "Stash",
    kind: "Mac app icon",
    text: "The letter S, drawn so that it is also a face",
    file: "stash",
  },
  {
    app: "Standpoint",
    kind: "iPhone app icon",
    text: "A cloud looking down at a small town and a map pin",
    file: "standpoint",
  },
];

const APPEARANCES = [
  ["default", "Default"],
  ["dark", "Dark"],
  ["clearlight", "Clear"],
  ["cleardark", "Clear, dark"],
  ["tintedlight", "Tinted"],
  ["tinteddark", "Tinted, dark"],
];

const LAYERED = [
  { app: "Peeko", file: "peeko", layers: "eyes, ghost, trail and notch" },
  { app: "Standpoint", file: "standpoint", layers: "cloud, eyes, pin, dot and town" },
];

export function Icons() {
  return (
    <>
      <ul className="cards cards--4">
        {ICONS.map((it) => (
          <li key={it.app} className="card">
            <div className="card__text">
              <span className="t-s muted">{it.kind} · 2026</span>
              <h3>{it.app}</h3>
              <p>{it.text}</p>
            </div>
            <div className="card__gap" />
            <div className="icon__stage">
              <Image
                src={`/software/icons/${it.file}-default.webp`}
                alt={`The ${it.app} app icon: ${it.text.toLowerCase()}`}
                width={512}
                height={512}
                sizes="200px"
              />
            </div>
          </li>
        ))}
      </ul>

      <ul className="cards icons__sets">
        {LAYERED.map((it) => (
          <li key={it.app} className="card">
            <div className="card__text">
              <span className="t-s muted">Icon Composer · six appearances</span>
              <h3>{it.app}, as the system draws it</h3>
              <p>
                The icon is a stack of flat layers ({it.layers}). The glass, the light and the
                dark, clear and tinted versions are rendered from that one drawing.
              </p>
            </div>
            <div className="card__gap" />
            <ul className="icon__row">
              {APPEARANCES.map(([key, name]) => (
                <li key={key}>
                  <Image
                    src={`/software/icons/${it.file}-${key}.webp`}
                    alt={`${it.app} icon, ${name.toLowerCase()} appearance`}
                    width={512}
                    height={512}
                    sizes="110px"
                  />
                  <span className="t-xs muted">{name}</span>
                </li>
              ))}
            </ul>
          </li>
        ))}
      </ul>
    </>
  );
}
