/**
 * Work — the single source of truth for everything shown on the site.
 *
 * Case-study copy and image metadata live in content/work/<slug>.json so
 * the writing can be edited without touching components. This file adds
 * what the JSON doesn't know: order and discipline.
 */
import adula from "@/content/work/adula.json";
import backtech from "@/content/work/backtech-elite.json";
import car from "@/content/work/car.json";
import cooldrip from "@/content/work/cooldrip.json";
import cooldripV1 from "@/content/work/cooldrip-v1.json";
import makingCase from "@/content/work/making.json";
import insole from "@/content/work/insole.json";
import kbRGrid from "@/content/work/keyboard-r-grid.json";
import kbR64 from "@/content/work/keyboard-r-64.json";
import kbR67 from "@/content/work/keyboard-r-67.json";
import kbR75 from "@/content/work/keyboard-r-75.json";
import kbRAlice from "@/content/work/keyboard-r-alice.json";
import kbThin67 from "@/content/work/keyboard-thin-67.json";
import kbDial75 from "@/content/work/keyboard-75-dial.json";
import kbStacked64 from "@/content/work/keyboard-stacked-64.json";
import kbRounded64 from "@/content/work/keyboard-rounded-64.json";
import kbStacked75 from "@/content/work/keyboard-stacked-75.json";
import kbGasket64 from "@/content/work/keyboard-gasket-64.json";
import ofx from "@/content/work/ofx-rebrand.json";
import oasis from "@/content/work/organic-oasis.json";
import snapjoy from "@/content/work/snapjoy.json";
import xrKeyboard from "@/content/work/xr-keyboard.json";
import picked from "@/lib/picks.json";

export interface WorkImage {
  w: number;
  h: number;
  kind: string;
  alt: string;
  caption?: string;
  bg?: "dark" | "light";
  poster?: string;
}

export interface WorkSection {
  heading: string;
  body: string;
  images: string[];
  /** A working demonstration shown with this section, by name. */
  demo?: "finger-keys" | "keyboard-layouts" | "keyboard-takeapart" | "keyboard-finishes";
}

export interface Award {
  name: string;
  year: string;
  category?: string;
}

export interface CaseStudy {
  slug: string;
  title: string;
  subtitle: string;
  year: string;
  context: string;
  role: string;
  team: string;
  tools: string[];
  awards: Award[];
  links?: { label: string; url: string }[] | null;
  summary: string;
  sections: WorkSection[];
  hero: string;
  cover: string;
  images: Record<string, WorkImage>;
}

/**
 * Public-domain paintings (Art Institute of Chicago, CC0) that the
 * windows rest on. All are quiet: fog, still water and open sky, with
 * little detail, so the painting never competes with the work on it.
 */
export const backdrops = {
  waterloo: {
    src: "/backdrops/monet-waterloo-sunlight.webp",
    credit: "Claude Monet, Waterloo Bridge, Sunlight Effect, 1903",
  },
  waterlooGray: {
    src: "/backdrops/monet-waterloo-gray.webp",
    credit: "Claude Monet, Waterloo Bridge, Gray Weather, 1900",
  },
  coast: {
    src: "/backdrops/whistler-coast.webp",
    credit: "James McNeill Whistler, Coast Scene, Bathers, 1884–85",
  },
  charingCross: {
    src: "/backdrops/monet-charing-cross.webp",
    credit: "Claude Monet, Charing Cross Bridge, London, 1901",
  },
  trouville: {
    src: "/backdrops/whistler-trouville.webp",
    credit: "James McNeill Whistler, Trouville (Grey and Green, the Silver Sea), 1865",
  },
  parliament: {
    src: "/backdrops/monet-parliament.webp",
    credit: "Claude Monet, Houses of Parliament, London, 1900–01",
  },
  nocturne: {
    src: "/backdrops/whistler-nocturne.webp",
    credit: "James McNeill Whistler, Nocturne: Blue and Gold, Southampton Water, 1872",
  },
} as const;

export type BackdropKey = keyof typeof backdrops;

/**
 * Which painting sits behind each case study's hero. All are quiet in
 * tone, so the mostly warm product pictures stand out against them.
 */
export const CASE_BACKDROP: Record<string, BackdropKey> = {
  cooldrip: "nocturne",
  insole: "coast",
  "backtech-elite": "waterlooGray",
  snapjoy: "charingCross",
  "cooldrip-v1": "trouville",
  "organic-oasis": "waterloo",
  adula: "parliament",
  making: "coast",
  "ofx-rebrand": "coast",
  car: "waterloo",
  "keyboard-r-grid": "nocturne",
  "keyboard-r-64": "coast",
  "keyboard-r-67": "trouville",
  "keyboard-r-75": "waterlooGray",
  "keyboard-r-alice": "charingCross",
  "keyboard-thin-67": "parliament",
  "keyboard-75-dial": "waterlooGray",
  "keyboard-stacked-64": "coast",
  "keyboard-rounded-64": "trouville",
  "keyboard-stacked-75": "nocturne",
  "keyboard-gasket-64": "charingCross",
  "xr-keyboard": "nocturne",
};

/** A picture plus where its subject sits, so crops keep the subject in frame. */
export interface Shot {
  src: string;
  w: number;
  h: number;
  alt: string;
  /** CSS object-position for cropped frames. Defaults to the centre. */
  pos?: string;
  /** Show the whole picture on this ground instead of cropping it. */
  ground?: string;
  /** A looping clip; `src` is then its poster frame. */
  video?: string;
  /** One or two words for what a closer view shows; its tab in the small frame. */
  name?: string;
}

/** What an index (card, list row, window) needs to know about a piece. */
export interface WorkEntry {
  slug: string;
  title: string;
  /** Short name for tight spaces. */
  short: string;
  subtitle: string;
  year: string;
  /** Which side of the practice it sits on. Some pieces are both. */
  group: "object" | "software" | "web" | "study";
  /** What kind of thing it is, in a few words: "Object and app", "Mac app". */
  label: string;
  /** Where it leads: a case study, a prototype, or the product's own site. */
  href?: string;
  external?: boolean;
  /** The words on its link. */
  cta: string;
  /** Picture for cards (shown square or 4:3). */
  cover: Shot;
  /** Picture for wide frames (the work window). */
  wide: Shot;
  /** Closer pictures or clips, one tab each in the small frame. Only where they add something. */
  details?: Shot[];
  /** Hang the small frame on the left corner instead, where the right one would cover something that matters. */
  detailsLeft?: boolean;
  /** The painting it hangs on. */
  paint: BackdropKey;
}

const raw = {
  cooldrip,
  insole,
  "backtech-elite": backtech,
  snapjoy,
  "cooldrip-v1": cooldripV1,
  "organic-oasis": oasis,
  adula,
  making: makingCase,
  "ofx-rebrand": ofx,
  car,
  "keyboard-r-grid": kbRGrid,
  "keyboard-r-64": kbR64,
  "keyboard-r-67": kbR67,
  "keyboard-r-75": kbR75,
  "keyboard-r-alice": kbRAlice,
  "keyboard-thin-67": kbThin67,
  "keyboard-75-dial": kbDial75,
  "keyboard-stacked-64": kbStacked64,
  "keyboard-rounded-64": kbRounded64,
  "keyboard-stacked-75": kbStacked75,
  "keyboard-gasket-64": kbGasket64,
  "xr-keyboard": xrKeyboard,
} as unknown as Record<string, CaseStudy>;

export const caseStudies: Record<string, CaseStudy> = raw;

type Pick = string | [file: string, pos: string];

/**
 * For each case study: which picture goes where, and where its subject
 * sits. Chosen by looking at every image, not by filename.
 */
const META: Record<
  string,
  { short: string; group: WorkEntry["group"]; label: string; card: Pick; wide: Pick }
> = {
  cooldrip: {
    short: "CoolDrip",
    group: "object",
    label: "Object and app",
    card: "cover.webp",
    wide: "hero.webp",
  },
  insole: {
    short: "Insole",
    group: "object",
    label: "Object",
    // White ground: the black turntable render hides the material.
    card: "render-redesign-underside.webp",
    wide: "render-redesign-underside.webp",
  },
  "backtech-elite": {
    short: "BackTech Elite",
    group: "object",
    label: "Object",
    card: ["cover.webp", "50% 62%"],
    wide: "hero-crop.webp",
  },
  snapjoy: {
    short: "SnapJoy",
    group: "object",
    label: "Object",
    card: ["hero.webp", "34% 50%"],
    wide: "hero.webp",
  },
  "organic-oasis": {
    short: "OrganicOasis",
    group: "object",
    label: "Object",
    card: "cover.webp",
    wide: ["hero.webp", "50% 72%"],
  },
  adula: {
    short: "ADULA",
    group: "object",
    label: "Object",
    card: "cover.webp",
    wide: "hero.webp",
  },
  "cooldrip-v1": {
    short: "CoolDrip v1",
    group: "object",
    label: "Object and app",
    card: ["hero.webp", "42% 50%"],
    wide: "hero.webp",
  },
  car: {
    short: "LF-2050",
    group: "object",
    label: "Concept car",
    card: "cover.webp",
    wide: "hero.webp",
  },
  "keyboard-r-grid": {
    short: "R GRID",
    group: "object",
    label: "Keyboard series, a design",
    card: "series.webp",
    wide: "series.webp",
  },
  "keyboard-r-64": {
    short: "R 64",
    group: "object",
    label: "Keyboard, a design",
    card: "hero.webp",
    wide: "hero.webp",
  },
  "keyboard-r-67": {
    short: "R 67",
    group: "object",
    label: "Keyboard, a design",
    card: "hero.webp",
    wide: "hero.webp",
  },
  "keyboard-r-75": {
    short: "R 75",
    group: "object",
    label: "Keyboard, a design",
    card: "hero.webp",
    wide: "hero.webp",
  },
  "keyboard-r-alice": {
    short: "R Alice",
    group: "object",
    label: "Keyboard, a design",
    card: "hero.webp",
    wide: "hero.webp",
  },
  "keyboard-thin-67": {
    short: "Thin 67",
    group: "object",
    label: "Keyboard",
    card: "full.webp",
    wide: "full.webp",
  },
  "keyboard-75-dial": {
    short: "75 with a dial",
    group: "object",
    label: "Keyboard",
    card: "full.webp",
    wide: "full.webp",
  },
  "keyboard-stacked-64": {
    short: "Stacked 64",
    group: "object",
    label: "Keyboard",
    card: "full.webp",
    wide: "full.webp",
  },
  "keyboard-rounded-64": {
    short: "Rounded 64",
    group: "object",
    label: "Keyboard",
    card: "full.webp",
    wide: "full.webp",
  },
  "keyboard-stacked-75": {
    short: "Stacked 75",
    group: "object",
    label: "Keyboard, drawn",
    card: "full.webp",
    wide: "full.webp",
  },
  "keyboard-gasket-64": {
    short: "Gasket 64",
    group: "object",
    label: "Keyboard, drawn",
    card: "full.webp",
    wide: "full.webp",
  },
  making: {
    short: "Making",
    group: "object",
    label: "Models and drawing",
    card: "cover.webp",
    wide: "hero.webp",
  },
  "xr-keyboard": {
    short: "XR keyboard",
    group: "study",
    label: "Interface and prototype",
    card: "cover.webp",
    wide: "hero.webp",
  },
  "ofx-rebrand": {
    short: "OFX",
    group: "study",
    label: "Brand identity",
    card: "street.webp",
    wide: "street.webp",
  },
};

function shot(slug: string, pick: Pick): Shot {
  const [file, pos] = typeof pick === "string" ? [pick, undefined] : pick;
  const m = raw[slug].images[file];
  return { src: `/work/${slug}/${file}`, w: m.w, h: m.h, alt: m.alt, pos };
}

/**
 * The smaller pictures. Not every piece has them. Where there are some
 * they must not repeat the big picture: the big one shows the whole
 * piece, these go close on parts of it, or show it moving. Each has a
 * name, which is its tab. A set shares one shape so the frame holds
 * still while the pictures change.
 */
const close = (
  slug: string,
  file: string,
  name: string,
  w: number,
  h: number,
  alt: string,
): Shot => ({ src: `/work/${slug}/${file}.webp`, w, h, alt, name });

const DETAILS: Record<string, Shot[] | undefined> = {
  cooldrip: [
    close("cooldrip", "detail", "App", 1000, 750, "The CoolDrip app held in a hand, showing 92 mg of caffeine remaining"),
    close("cooldrip", "detail-lid", "Lid", 1000, 750, "The lid of the printed model, with its indicator light and red pull tab"),
    close("cooldrip", "detail-handle", "Handle", 800, 600, "The wooden handle on its steel arm"),
    close("cooldrip", "detail-box", "Box", 1200, 900, "The CoolDrip box, white sleeve over a red tray"),
  ],
  insole: [
    {
      src: "/work/insole/printing-poster.webp",
      w: 1600,
      h: 900,
      alt: "Animation of the insole being printed layer by layer",
      video: "/work/insole/printing.mp4",
      name: "Printing",
    },
    close("insole", "detail-top", "Top side", 1080, 608, "The top of the insole at the forefoot: soft pads set in the frame"),
  ],
  "backtech-elite": [
    close("backtech-elite", "detail", "Base", 1000, 750, "Close-up of the backpack's base corner, with its frame and an orange tag"),
    close("backtech-elite", "detail-frame", "Frame", 1200, 900, "The back panel: suspension mounts and a leather-lined strap"),
    close("backtech-elite", "detail-laptop", "Loading", 1200, 900, "A laptop being slid into the backpack"),
  ],
  snapjoy: [
    close("snapjoy", "detail", "Controls", 1000, 750, "Close-up of the gimbal's control head, with its joystick and buttons"),
    close("snapjoy", "detail-airbag", "Grip", 1000, 750, "The inflated grip in the palm, translucent green"),
    close("snapjoy", "detail-grips", "Studies", 1200, 900, "Printed grip studies in different shapes"),
  ],
  adula: [
    close("adula", "detail", "Gears", 900, 675, "Close-up of the grinder's bevel gears and motor, pulled apart"),
    close("adula", "detail-level", "Screen", 800, 600, "The green status screen on top of the grinder"),
    close("adula", "detail-blade", "Blade", 1000, 750, "The grinder fitted with a saw blade"),
    close("adula", "detail-model", "Model", 1000, 750, "The built model on a workshop shelf"),
  ],
  "xr-keyboard": [
    {
      src: "/work/xr-keyboard/prototype-poster.webp",
      w: 1200,
      h: 900,
      alt: "The working prototype: a camera view of two hands and a list of words that narrows with each press",
      video: "/work/xr-keyboard/prototype.mp4",
      name: "Prototype",
    },
    close("xr-keyboard", "detail-training", "Training", 800, 600, "Hands typing on a real keyboard inside a capture frame"),
    close("xr-keyboard", "detail-sketch", "Sketch", 1000, 750, "Line drawing of a headset watching hands type on a keyboard"),
  ],
  car: [
    close("car", "render-day", "Front", 2400, 1350, "The car from a low front angle in a daylight street"),
    close("car", "model", "Model", 1706, 1278, "The physical model: silver body, dark canopy, red wheel hubs"),
  ],
  "ofx-rebrand": [
    close("ofx-rebrand", "detail", "Grid", 800, 600, "The OFX cube mark on its construction grid"),
    close("ofx-rebrand", "detail-card", "Card", 900, 675, "The business card, with the mark cropped across the back"),
    close("ofx-rebrand", "detail-app", "App", 1120, 840, "The app's home and cards screens"),
    close("ofx-rebrand", "detail-van", "Van", 1200, 900, "A delivery van in the new livery"),
  ],
};

/**
 * Pictures Ryan chose himself in the picker (written by apply_picks.py):
 * the big picture, the card picture and the closer views for each piece.
 * Where he has chosen, his choice replaces the defaults in META and DETAILS.
 */
const PICKS = picked as unknown as Record<
  string,
  { include: boolean; wide?: Shot; cover?: Shot; details: Shot[] } | undefined
>;

/** Pieces whose small frame hangs on the left corner, so it does not cover the subject. */
const DETAILS_LEFT = new Set<string>(["ofx-rebrand", "xr-keyboard", "adula"]);

function entryFromCase(slug: string): WorkEntry {
  const c = raw[slug];
  const m = META[slug];
  const pick = PICKS[slug];
  const wide = pick?.wide ?? shot(slug, m.wide);
  const details = pick ? pick.details : DETAILS[slug];
  return {
    slug,
    title: c.title,
    short: m.short,
    subtitle: c.subtitle,
    year: c.year,
    group: m.group,
    label: m.label,
    href: `/work/${slug}`,
    cta: "Read the case study →",
    cover: pick?.cover ?? shot(slug, m.card),
    wide,
    details: details?.length ? details : undefined,
    detailsLeft: DETAILS_LEFT.has(slug) || undefined,
    paint: CASE_BACKDROP[slug],
  };
}

/** The 2026 series: its own page, then one per layout. */
export const gridPages: WorkEntry[] = [
  "keyboard-r-grid",
  "keyboard-r-64",
  "keyboard-r-67",
  "keyboard-r-75",
  "keyboard-r-alice",
].map(entryFromCase);

/**
 * The keyboards. Each is a project with its own page; the 2026 series is
 * one of them, with a page per layout under it.
 */
export const keyboards: WorkEntry[] = [
  "keyboard-thin-67",
  "keyboard-75-dial",
  "keyboard-stacked-64",
  "keyboard-rounded-64",
  "keyboard-stacked-75",
  "keyboard-gasket-64",
  "keyboard-r-grid",
].map(entryFromCase);

const kbShot = (slug: string, name: string): Shot => ({ ...shot(slug, raw[slug].hero), name });

/**
 * Everywhere outside their own page the keyboards take one place, like any
 * other piece. It leads to a page that lays all of them out.
 */
export const keyboardsEntry: WorkEntry = {
  slug: "keyboards",
  title: "Keyboards",
  short: "Keyboards",
  subtitle: "Cases for mechanical keyboards, drawn, cut and printed since 2021",
  year: "2021–2026",
  group: "object",
  label: "Seven projects",
  href: "/work/keyboards",
  cta: "See the keyboards →",
  cover: { ...shot("keyboard-thin-67", "full.webp"), pos: "38% 50%" },
  wide: shot("keyboard-thin-67", "full.webp"),
  details: [
    kbShot("keyboard-75-dial", "75"),
    kbShot("keyboard-stacked-64", "Stacked 64"),
    kbShot("keyboard-rounded-64", "Rounded 64"),
    kbShot("keyboard-r-grid", "R GRID"),
  ],
  paint: "parliament",
};

/** Objects: industrial design, in the order it should be read. */
export const objects: WorkEntry[] = [
  ...[
    "cooldrip",
    "insole",
    "backtech-elite",
    "snapjoy",
    "organic-oasis",
    "adula",
    "cooldrip-v1",
    "car",
  ].map(entryFromCase),
  keyboardsEntry,
];

/** Models, builds and drawing: not a project, kept as a page behind About. */
export const making: WorkEntry = entryFromCase("making");

/** Interface design with a working prototype behind it. */
export const interfaces: WorkEntry[] = ["xr-keyboard"].map(entryFromCase);

/** Brand identity. */
export const brand: WorkEntry[] = ["ofx-rebrand"].map(entryFromCase);

/** The CoolDrip app on its own, for the software page. */
export const cooldripApp: WorkEntry = {
  ...entryFromCase("cooldrip"),
  slug: "cooldrip-app",
  title: "CoolDrip app",
  short: "CoolDrip app",
  subtitle: "The caffeine tracker that pairs with the coffee maker",
  group: "software",
  label: "App design",
  cover: shot("cooldrip", "app-hand.webp"),
  wide: shot("cooldrip", "app-screens.webp"),
};

/** Software products: designed and built by me, with their own sites. */
const PRODUCTS: WorkEntry[] = [
  {
    slug: "peeko",
    title: "Peeko",
    short: "Peeko",
    subtitle: "A Mac notch app that shows coding agents as a team of characters",
    year: "2026",
    group: "software",
    label: "Mac app",
    href: "https://usepeeko.app",
    external: true,
    cta: "Visit usepeeko.app ↗",
    cover: {
      src: "/software/peeko/notch-close.webp",
      w: 1127,
      h: 1127,
      alt: "Close on the Mac notch: Peeko’s characters sitting in it, two of them with a count of agents",
    },
    wide: {
      src: "/software/peeko/film-poster.webp",
      w: 1280,
      h: 720,
      alt: "The Peeko launch film: characters in the notch, the Today window, each project as a team",
      video: "/software/peeko/film.mp4",
    },
    paint: "waterloo",
  },
  {
    slug: "digo",
    title: "Digo",
    short: "Digo",
    subtitle: "Push-to-talk dictation for Mac that runs locally, with a character at the caret",
    year: "2026",
    group: "software",
    label: "Mac app",
    href: "https://usedigo.app",
    external: true,
    cta: "Visit usedigo.app ↗",
    cover: {
      src: "/software/digo/caret-close.webp",
      w: 1010,
      h: 1010,
      alt: "Close on a text field: a hand-drawn cat character sitting at the caret after the words “delete it.”",
    },
    wide: {
      src: "/software/digo/dictation-poster.webp",
      w: 1280,
      h: 720,
      alt: "Digo in use: a sentence being dictated into a text field, with the character sitting at the caret",
      video: "/software/digo/dictation.mp4",
    },
    paint: "parliament",
  },
  {
    slug: "stash",
    title: "Stash",
    short: "Stash",
    subtitle: "A Mac library for visual references that hands them to AI tools as context",
    year: "2026",
    group: "software",
    label: "Mac app, beta",
    href: "https://www.usestash.dev",
    external: true,
    cta: "Visit usestash.dev ↗",
    cover: {
      src: "/software/stash/macbook-close.webp",
      w: 1400,
      h: 1400,
      alt: "Close on a MacBook screen under the notch: the Stash window with its Library and Playground switch in focus, saved references below it out of focus",
    },
    wide: {
      src: "/software/stash/library-poster.webp",
      w: 1400,
      h: 856,
      alt: "Scrolling through the Stash library: saved visual references laid out in a grid",
      video: "/software/stash/library.mp4",
    },
    paint: "coast",
  },
  {
    slug: "standpoint",
    title: "Standpoint",
    short: "Standpoint",
    subtitle: "An iPhone app that draws the ground underfoot as a small moving world",
    year: "2026",
    group: "software",
    label: "iPhone app, in development",
    cta: "In development",
    cover: {
      src: "/software/standpoint/phone-close.webp",
      w: 1400,
      h: 1400,
      alt: "Close on the corner of an iPhone running Standpoint: a harbour street drawn from above, with the place label “Nyhavn, Copenhagen” in focus",
    },
    wide: {
      src: "/software/standpoint/world-poster.webp",
      w: 720,
      h: 1060,
      alt: "Standpoint on an iPhone: a street of houses and trees drawing itself in, with clouds drifting over",
      video: "/software/standpoint/world.mp4",
    },
    paint: "trouville",
  },
];

/**
 * More software: one product still in development and one study. Shown
 * after the released apps, with what each one is stated plainly.
 */
export const more: WorkEntry[] = [
  {
    slug: "macro",
    title: "Macro",
    short: "Macro",
    subtitle:
      "A browser editor for filming product demos: several devices in one frame, real depth of field, and a camera that pushes in to the pixels",
    year: "2026",
    group: "software",
    label: "Web app, in development",
    cta: "In development",
    cover: {
      src: "/software/macro/editor.webp",
      w: 1920,
      h: 1200,
      alt: "The Macro editor: a phone and a watch on a desk in the canvas, a multi-track timeline below, lens and light settings on the right",
    },
    wide: {
      src: "/software/macro/editor.webp",
      w: 1920,
      h: 1200,
      alt: "The Macro editor: a phone and a watch on a desk in the canvas, a multi-track timeline below, lens and light settings on the right",
    },
    paint: "waterlooGray",
  },
  {
    slug: "gnovi",
    title: "Gnovi",
    short: "Gnovi",
    subtitle:
      "A desktop AI chat where any part of an answer can be dragged out as a note and dragged back in as context",
    year: "2026",
    group: "software",
    label: "Desktop app, study",
    cta: "A study, not released",
    cover: {
      src: "/software/gnovi/drag-poster.webp",
      w: 1600,
      h: 1275,
      alt: "The Gnovi window: a sentence being dragged out of an answer toward the notes column on the left",
    },
    wide: {
      src: "/software/gnovi/drag-poster.webp",
      w: 1600,
      h: 1275,
      alt: "Gnovi in use: part of an answer is dragged out as a note, then dragged back to the message box as context",
      video: "/software/gnovi/drag.mp4",
    },
    paint: "coast",
  },
];

function prototype(
  slug: string,
  title: string,
  short: string,
  subtitle: string,
  h: number,
  alt: string,
  paint: BackdropKey,
): WorkEntry {
  const pic: Shot = { src: `/specimens/${slug}-poster.webp`, w: 1200, h, alt, pos: "50% 0%" };
  return {
    slug,
    title,
    short,
    subtitle,
    year: "2026",
    group: "software",
    label: "Prototype",
    href: `/lab/${slug}`,
    cta: "Open the prototype →",
    cover: pic,
    wide: { ...pic, pos: undefined, video: `/specimens/${slug}.mp4` },
    paint,
  };
}

/** Interface ideas built far enough to use, under /lab. */
export const prototypes: WorkEntry[] = [
  prototype(
    "atlas",
    "Atlas",
    "Atlas",
    "A zoomable file canvas instead of a folder tree",
    1026,
    "Atlas prototype: files laid out as a zoomable canvas",
    "nocturne",
  ),
  prototype(
    "agent-cursor",
    "Point, don't tell",
    "Agent cursor",
    "A help assistant that travels to the real control",
    970,
    "A cursor-shaped assistant pointing at a control inside a settings console",
    "charingCross",
  ),
  prototype(
    "command-palette",
    "Optical command palette",
    "Command palette",
    "A ⌘K palette whose selection is pulled into focus",
    994,
    "A command palette where one command is sharp and the rest sit out of focus",
    "waterlooGray",
  ),
  prototype(
    "gridex",
    "Gridex home hero",
    "Gridex",
    "An AI workspace shown in motion through panels and cursors",
    1136,
    "An exploded workspace view with agent cursors moving between panels",
    "coast",
  ),
  prototype(
    "refractive-lens",
    "Refractive lens",
    "Lens",
    "A glass loupe over a page of type: real refraction that follows the pointer",
    962,
    "A glass lens over a page of text, magnifying the word “focus” and bending the lines beneath it",
    "trouville",
  ),
  prototype(
    "grammar-board",
    "Grammar board",
    "Grammar board",
    "Eight product glyphs as cards to drag, throw, sort and open",
    1080,
    "A board of eight cards with abstract product glyphs, one card lifted in mid-drag",
    "parliament",
  ),
];

/**
 * Websites: designed and built by me. Each is shown as a recording of the
 * live page being scrolled, taken from the public site.
 */
function site(
  slug: string,
  title: string,
  short: string,
  subtitle: string,
  alt: string,
  paint: BackdropKey,
  href?: string,
): WorkEntry {
  return {
    slug: `web-${slug}`,
    title,
    short,
    subtitle,
    year: "2026",
    group: "web",
    label: "Website",
    href,
    external: href ? true : undefined,
    cta: href ? `Visit ${href.replace(/^https?:\/\/(www\.)?/, "")} ↗` : "Not public yet",
    cover: { src: `/web/${slug}/hero.webp`, w: 1800, h: 1125, alt, pos: "50% 0%" },
    wide: {
      src: `/web/${slug}/scroll-poster.webp`,
      w: 1280,
      h: 800,
      alt: `${alt}, scrolled from the top`,
      video: `/web/${slug}/scroll.mp4`,
    },
    paint,
  };
}

const WEB: WorkEntry[] = [
  site(
    "peeko",
    "Peeko website",
    "Peeko site",
    "A cast of characters, a pinned scroll story and the notch at the top of the page",
    "The Peeko website: the wordmark behind a crowd of gradient characters",
    "charingCross",
    "https://usepeeko.app",
  ),
  site(
    "digo",
    "Digo website",
    "Digo site",
    "Black ink on white, in English and Chinese, with product scenes tied to scroll",
    "The Digo website: large black type above a row of ink characters",
    "trouville",
    "https://usedigo.app",
  ),
  site(
    "stash",
    "Stash website",
    "Stash site",
    "A quiet serif page that walks through the library, the playground and the handoff",
    "The Stash website: a serif headline above the app's library",
    "parliament",
    "https://usestash.dev",
  ),
  site(
    "curio",
    "Curio Editions",
    "Curio Editions",
    "Website for hand-finished neighbourhood art cards, sent on behalf of estate agents",
    "The Curio Editions website: a hand holding a painted card against black",
    "waterlooGray",
    "https://www.curioeditions.com",
  ),
  site(
    "cooldrip",
    "CoolDrip website",
    "CoolDrip site",
    "The launch page for the coffee maker, built around film, photography and how it brews",
    "The CoolDrip website: coffee dripping through the steel filter",
    "nocturne",
  ),
  site(
    "gridex",
    "Gridex website",
    "Gridex site",
    "Company site whose pictures are working windows: a mailbox, a draft, a call transcript",
    "The Gridex website: a headline above three working application windows",
    "waterloo",
    "https://gridex.dev",
  ),
];

/** Apply Ryan's picker choices to an entry that is not a case study. */
function withPicks(prefix: string) {
  return (e: WorkEntry): WorkEntry => {
    const pick = PICKS[`${prefix}${e.slug.replace(/^web-/, "")}`];
    if (!pick) return e;
    return {
      ...e,
      wide: pick.wide ?? e.wide,
      cover: pick.cover ?? e.cover,
      details: pick.details.length ? pick.details : e.details,
    };
  };
}

/** Software products: designed and built by me, with their own sites. */
export const products: WorkEntry[] = PRODUCTS.map(withPicks("app-"));

/** Websites, each shown as a recording of the live page. */
export const web: WorkEntry[] = WEB.map(withPicks("web-"));

export const software: WorkEntry[] = [...products, ...prototypes];

/** Every award entry for CoolDrip, one per category, as the certificates state them. */
export const awards: { short: string; name: string; level: string; category: string; year: string }[] = [
  { short: "Red Dot", name: "Red Dot Award", level: "Winner", category: "Design Concept", year: "2025" },
  { short: "MUSE Design Awards", name: "MUSE Design Awards", level: "Gold", category: "Home Appliances", year: "2025" },
  { short: "MUSE Design Awards", name: "MUSE Design Awards", level: "Gold", category: "Lifestyle", year: "2025" },
  { short: "NY Product Design Awards", name: "NY Product Design Awards", level: "Silver", category: "Household Appliances & Accessories", year: "2024" },
  { short: "London Design Awards", name: "London Design Awards", level: "Silver", category: "Bakeware, Tableware, Drinkware & Cookware", year: "2024" },
  { short: "International Design Awards", name: "International Design Awards", level: "Honorable mention", category: "Conceptual Products, Personal", year: "2024" },
  { short: "International Design Awards", name: "International Design Awards", level: "Honorable mention", category: "Conceptual Products, Food & Beverage", year: "2024" },
  { short: "LICC", name: "LICC", level: "Official selection", category: "Product, Professional", year: "2024" },
];

export const CONTACT_EMAIL = "ryan.runsheng@gmail.com";
