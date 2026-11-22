"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { Plate } from "./Stage";

const DIR = "/work/keyboard-thin-67/";

/**
 * The opening picture of the keyboards page. One link in the label takes
 * the bought parts away, leaving what was designed.
 */
export function KeyboardHero() {
  const [bare, setBare] = useState(false);
  return (
    <Plate
      label={
        <>
          <p className="muted">
            {bare
              ? "The thin 67 without the bought parts: case, plate, feet and badge as drawn."
              : "The thin 67, rendered from the Fusion file. Keycaps and switches are bought parts."}
          </p>
          <button type="button" className="link" onClick={() => setBare((b) => !b)}>
            {bare ? "Show the full build" : "Show only what I designed"}
          </button>
        </>
      }
    >
      <div className="swap">
        <Image
          src={`${DIR}full.webp`}
          alt="A 67-key keyboard in a case of stacked clear acrylic sheets, with dark keycaps and green legends"
          width={2400}
          height={1500}
          sizes="(max-width: 860px) 100vw, 1080px"
          priority
        />
        <Image
          src={`${DIR}bare.webp`}
          alt="The same case with keycaps and switches removed, showing the switch plate inside the stacked sheets"
          width={2400}
          height={1500}
          sizes="(max-width: 860px) 100vw, 1080px"
          className="swap__over"
          data-on={bare}
          aria-hidden={!bare}
        />
      </div>
    </Plate>
  );
}

const FRAMES = 36;
const frame = (i: number) => `${DIR}takeapart/${String(i).padStart(2, "0")}.webp`;

/** What is moving at each point of the sequence, as the last frame it covers. */
const STEPS: [number, string][] = [
  [0, "Assembled."],
  [6, "The keycaps lift off."],
  [12, "The switches follow, then the top sheet and the switch plate."],
  [19, "The circuit board comes out from between the sheets."],
  [28, "The sheets of the case separate: two layers, the frame and the base."],
  [35, "Last the feet, each a stack of cut pieces on a cross bolt."],
];

const SHEETS = [
  { id: "cad-01", name: "Top sheet", spec: "5 mm" },
  { id: "cad-02", name: "Switch plate", spec: "1.5 mm" },
  { id: "cad-05", name: "Second layer", spec: "2 mm, frosted on one side" },
  { id: "cad-06", name: "Third layer", spec: "5 mm clear" },
  { id: "cad-04", name: "Frame", spec: "8 mm clear" },
  { id: "cad-03", name: "Base", spec: "2 mm clear" },
];

/**
 * The thin 67 taken apart: a rendered sequence moved by one line, and under
 * it the outline of each sheet as it was drawn for cutting.
 */
export function TakeApart() {
  // Opens taken apart, so the layers are the first thing seen.
  const [at, setAt] = useState(28);
  const root = useRef<HTMLDivElement>(null);

  // Fetch the frames once the piece is near the screen, so dragging is smooth.
  useEffect(() => {
    const el = root.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (entries) => {
        if (!entries.some((e) => e.isIntersecting)) return;
        for (let i = 0; i < FRAMES; i++) new window.Image().src = frame(i);
        io.disconnect();
      },
      { rootMargin: "600px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const step = STEPS.find(([last]) => at <= last) ?? STEPS[STEPS.length - 1];

  return (
    <div className="apart" ref={root}>
      <div className="apart__frame">
        {/* eslint-disable-next-line @next/next/no-img-element -- frames are swapped by hand */}
        <img
          src={frame(at)}
          width={1600}
          height={1000}
          alt="The thin 67 partly taken apart, its layers separated one above another"
        />
      </div>
      <div className="apart__bar">
        <input
          type="range"
          min={0}
          max={FRAMES - 1}
          value={at}
          onChange={(e) => setAt(Number(e.target.value))}
          aria-label="Take the keyboard apart"
          aria-valuetext={step[1]}
        />
        <p className="muted" aria-live="polite">
          {step[1]}
        </p>
      </div>
      <ul className="sheets">
        {SHEETS.map((s) => (
          <li key={s.id}>
            {/* eslint-disable-next-line @next/next/no-img-element -- line drawing */}
            <img src={`${DIR}layers/${s.id}.svg`} alt="" width={324} height={133} loading="lazy" />
            <p>
              {s.name}
              <span className="muted"> {s.spec}</span>
            </p>
          </li>
        ))}
      </ul>
    </div>
  );
}

const FINISHES = [
  { file: "full.webp", label: "Clear", note: "As built." },
  { file: "finish-frosted.webp", label: "Frosted", note: "A study." },
  { file: "finish-smoke.webp", label: "Smoked", note: "A study." },
  {
    file: "finish-green-black.webp",
    label: "Green and black",
    note: "A study, after the stacked 64.",
  },
];

/** One case, one camera, four sheet materials. */
export function Finishes() {
  const [at, setAt] = useState(0);
  return (
    <figure className="fig finish">
      <div className="fig__frame swap">
        {FINISHES.map((f, i) => (
          <Image
            key={f.file}
            src={DIR + f.file}
            alt={`The thin 67 in ${f.label.toLowerCase()} acrylic`}
            width={2400}
            height={1500}
            sizes="(max-width: 980px) 100vw, 972px"
            className={i === 0 ? undefined : "swap__over"}
            data-on={i === 0 ? undefined : at === i}
            aria-hidden={at !== i}
          />
        ))}
      </div>
      <figcaption>
        {FINISHES.map((f, i) =>
          i === at ? (
            <span key={f.file} aria-current="true">
              {f.label}
            </span>
          ) : (
            <button key={f.file} type="button" className="link" onClick={() => setAt(i)}>
              {f.label}
            </button>
          ),
        )}
        <span className="muted">{FINISHES[at].note}</span>
      </figcaption>
    </figure>
  );
}
