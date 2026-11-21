"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { COMMON_WORDS } from "@/lib/commonWords";

/**
 * FingerKeys — the recognition logic of the XR keyboard prototype, rebuilt
 * so it can be tried on the page.
 *
 * Eight fingers are eight keys; each key carries a group of letters. A
 * press is ambiguous on its own, so the run of presses is matched against
 * a list of common words: a word fits when its letters fall in those
 * groups, in order. Bend a finger by clicking it, or press 1 to 8.
 *
 * Keys 1, 2, 3, 5 and 7 are as they appear in the recordings of the
 * prototype (right index, middle and ring; left index and ring). The
 * recordings never show 4, 6 or 8 being pressed, so those three follow
 * from the letters that were left over.
 */
const KEYS: Record<number, string> = {
  1: "abc",
  2: "def",
  3: "ghi",
  4: "jkl",
  5: "mno",
  6: "tuv",
  7: "pqrs",
  8: "wxyz",
};

/** As you look down at your own hands: little finger to index, then index to little. */
const HANDS: { name: string; fingers: { key: number; finger: string; reach: number }[] }[] = [
  {
    name: "Left hand",
    fingers: [
      { key: 8, finger: "little", reach: 0.6 },
      { key: 7, finger: "ring", reach: 0.86 },
      { key: 6, finger: "middle", reach: 1 },
      { key: 5, finger: "index", reach: 0.9 },
    ],
  },
  {
    name: "Right hand",
    fingers: [
      { key: 1, finger: "index", reach: 0.9 },
      { key: 2, finger: "middle", reach: 1 },
      { key: 3, finger: "ring", reach: 0.86 },
      { key: 4, finger: "little", reach: 0.6 },
    ],
  },
];

const STEPS = [
  ["Camera", "Both hands in view"],
  ["Hand tracking", "21 points on each hand"],
  ["A fingertip dips", "That finger has pressed"],
  ["One of eight keys", "Three or four letters"],
  ["Words that fit", "From a list of common words"],
];

const EXAMPLES = ["home", "and", "people", "water"];
const SHOWN = 8;

const keyOf = (letter: string) =>
  Number(Object.keys(KEYS).find((k) => KEYS[Number(k)].includes(letter)));

export function FingerKeys() {
  const [presses, setPresses] = useState<number[]>([]);
  const [down, setDown] = useState<number | null>(null);
  const timers = useRef<number[]>([]);

  const fits = useMemo(() => {
    if (!presses.length) return [];
    return COMMON_WORDS.filter(
      (w) => w.length >= presses.length && presses.every((k, i) => KEYS[k].includes(w[i])),
    ).sort((a, b) => {
      // Whole words first, then the longer ones the run could still become.
      const whole = Number(b.length === presses.length) - Number(a.length === presses.length);
      return whole || a.localeCompare(b);
    });
  }, [presses]);

  function clearTimers() {
    timers.current.forEach((t) => window.clearTimeout(t));
    timers.current = [];
  }

  useEffect(() => clearTimers, []);

  function press(key: number) {
    setDown(key);
    setPresses((p) => [...p, key]);
    timers.current.push(window.setTimeout(() => setDown((d) => (d === key ? null : d)), 220));
  }

  function reset() {
    clearTimers();
    setDown(null);
    setPresses([]);
  }

  function play(word: string) {
    reset();
    [...word].forEach((letter, i) => {
      timers.current.push(window.setTimeout(() => press(keyOf(letter)), 260 + i * 520));
    });
  }

  function onKey(e: React.KeyboardEvent) {
    if (e.metaKey || e.ctrlKey || e.altKey) return;
    if (/^[1-8]$/.test(e.key)) {
      clearTimers();
      press(Number(e.key));
    } else if (e.key === "Backspace") {
      clearTimers();
      setPresses((p) => p.slice(0, -1));
    } else if (e.key === "Escape") reset();
    else return;
    e.preventDefault();
  }

  return (
    <div className="keys" onKeyDown={onKey}>
      <ol className="keys__steps">
        {STEPS.map(([title, text], i) => (
          <li key={title}>
            <span className="keys__n">{i + 1}</span>
            <span>
              {title}
              <small>{text}</small>
            </span>
          </li>
        ))}
      </ol>

      <div className="keys__body">
        <div className="keys__hands">
          {HANDS.map((hand) => (
            <div className="keys__hand" role="group" aria-label={hand.name} key={hand.name}>
              <div className="keys__fingers">
                {hand.fingers.map((f) => (
                  <button
                    key={f.key}
                    type="button"
                    className="keys__finger"
                    data-down={down === f.key}
                    style={{ "--reach": f.reach } as React.CSSProperties}
                    aria-label={`${hand.name}, ${f.finger} finger: key ${f.key}, letters ${[...KEYS[f.key]].join(", ")}`}
                    onClick={() => {
                      clearTimers();
                      press(f.key);
                    }}
                  >
                    <i aria-hidden="true" />
                    <span aria-hidden="true">
                      {KEYS[f.key]}
                      <small>{f.key}</small>
                    </span>
                  </button>
                ))}
              </div>
              <p className="keys__name">{hand.name}</p>
            </div>
          ))}
        </div>

        <div className="keys__out" aria-live="polite">
          <p className="keys__label">Presses</p>
          <p className="keys__run">
            {presses.length ? (
              presses.map((k, i) => <span key={i}>{KEYS[k]}</span>)
            ) : (
              <em>Bend a finger.</em>
            )}
          </p>
          <p className="keys__label">
            {presses.length
              ? fits.length === 1
                ? "One word fits"
                : `${fits.length} words fit`
              : "Words that fit"}
          </p>
          <ul className="keys__words">
            {fits.slice(0, SHOWN).map((w) => (
              <li key={w} data-whole={w.length === presses.length}>
                <b>{w.slice(0, presses.length)}</b>
                {w.slice(presses.length)}
              </li>
            ))}
            {presses.length > 0 && fits.length === 0 ? <li>No word in the list fits.</li> : null}
            {fits.length > SHOWN ? <li className="keys__more">and {fits.length - SHOWN} more</li> : null}
          </ul>
        </div>
      </div>

      <div className="keys__bar">
        <p>
          Try a word:{" "}
          {EXAMPLES.map((w) => (
            <button key={w} type="button" onClick={() => play(w)}>
              {w}
            </button>
          ))}
        </p>
        <button type="button" onClick={reset} disabled={!presses.length}>
          Reset
        </button>
      </div>
    </div>
  );
}
