"use client";

/**
 * AgentCursorStage.tsx — top-level component for the agent-cursor specimen.
 *
 * Composes:
 *   - MockConsole    : the fictional SaaS admin console (the "world" to move in)
 *   - AgentCursor    : the cursor overlay (PLACEHOLDER motion — orchestrator owns this)
 *   - Scenario chips : suggested questions; clicking one starts the scenario
 *   - Text input     : freeform question → resolveQuestion → scenario
 *
 * Scenario runner:
 *   1. User clicks a chip or submits a question.
 *   2. resolveQuestion() returns a Scenario (or null).
 *   3. runScenario() steps through each Step sequentially:
 *      a. If step.section != activeSection, call setActiveSection(step.section).
 *      b. Wait one rAF for layout to settle.
 *      c. Call getTargetRect(step.targetId) — fails gracefully if null.
 *      d. Call cursorRef.current.goTo(rect, step.mode, step.text).
 *      e. Wait STEP_DELAY_MS before next step.
 *   4. After all steps, wait IDLE_DELAY_MS then dismiss the cursor.
 *
 * AgentCursor interface (WHAT THE ORCHESTRATOR NEEDS TO IMPLEMENT):
 *   - Exported as `AgentCursorHandle` below.
 *   - The stage calls cursorRef.current.goTo(rect, mode, text) to drive it.
 *   - The cursor component accepts this ref via React.forwardRef + useImperativeHandle.
 *   - Props: none beyond the ref (the cursor is self-contained for display).
 */

import {
  useRef,
  useState,
  useCallback,
  useEffect,
  useLayoutEffect,
  type FormEvent,
  forwardRef,
  useImperativeHandle,
} from "react";
import { MockConsole, getTargetRect } from "./MockConsole";
import {
  SCENARIOS,
  resolveQuestion,
  type SectionId,
  type Step,
} from "./scenarios";

// ─── Timing constants ─────────────────────────────────────────────────────────

const STEP_DELAY_MS = 2400;  // ms between steps (time for the user to read the caption)
const IDLE_DELAY_MS = 3000;  // ms before cursor auto-dismisses after last step
const LAYOUT_RAF_COUNT = 2;  // rAF cycles to wait after section switch before rect query
const AWAIT_TIMEOUT_MS = 16000; // how long the cursor waits for the user to act
const CELEBRATE_HOLD_MS = 1900;  // how long the "done ✓" celebration holds before exit

// ─── AgentCursor interface ────────────────────────────────────────────────────

/**
 * AgentCursorHandle — the ref API the stage uses to drive the cursor.
 *
 * ORCHESTRATOR: implement this via useImperativeHandle in AgentCursor.
 *
 *   goTo(rect, mode, text)
 *     - rect: the DOMRect of the target element (in viewport coords)
 *     - mode: "guide" → ring + caption; "answer" → chip explanation
 *     - text: the caption/answer string to display
 *
 *   dismiss()
 *     - Hide the cursor (called after the last step or on user interrupt).
 */
export type AgentCursorHandle = {
  goTo: (rect: DOMRect, mode: "guide" | "answer", text: string) => void;
  /** The user performed the awaited action — play the success beat: the ring
   *  turns green, a check pops, the cursor gives a small nod, the caption
   *  swaps to the completion line. */
  celebrate: (text: string) => void;
  dismiss: () => void;
};

// ─── Runner utilities ─────────────────────────────────────────────────────────

/** Wait for `n` animation frames. Used to let layout settle after section switch. */
function waitFrames(n: number): Promise<void> {
  return new Promise((resolve) => {
    let remaining = n;
    const tick = () => {
      remaining -= 1;
      if (remaining <= 0) resolve();
      else requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  });
}

function waitMs(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/** Wait for the user to actually click the target element (closing the loop:
 *  the cursor points, the human acts). Resolves true on click, false on
 *  timeout. Uses a capture-phase listener so the host element's own handler
 *  still runs. */
function waitForUserAction(targetId: string, timeoutMs: number): Promise<boolean> {
  return new Promise((resolve) => {
    const el = document.querySelector(`[data-target="${targetId}"]`);
    if (!el) {
      resolve(false);
      return;
    }
    let settled = false;
    const finish = (acted: boolean) => {
      if (settled) return;
      settled = true;
      clearTimeout(timer);
      el.removeEventListener("click", onClick, true);
      resolve(acted);
    };
    const onClick = () => finish(true);
    const timer = setTimeout(() => finish(false), timeoutMs);
    el.addEventListener("click", onClick, true);
  });
}

// ─── Stage component ──────────────────────────────────────────────────────────

export function AgentCursorStage() {
  const [activeSection, setActiveSection] = useState<SectionId>("overview");
  const [inputValue, setInputValue] = useState("");
  const [isRunning, setIsRunning] = useState(false);
  const [activeScenarioId, setActiveScenarioId] = useState<string | null>(null);

  const cursorRef = useRef<AgentCursorHandle>(null);
  // Used to abort in-flight scenario if user clicks another chip
  const abortRef = useRef(false);

  const runScenario = useCallback(
    async (steps: Step[], scenarioId: string) => {
      if (isRunning) {
        // Abort current scenario
        abortRef.current = true;
        await waitMs(50); // let current step yield
      }
      abortRef.current = false;
      setIsRunning(true);
      setActiveScenarioId(scenarioId);
      let celebrated = false;

      // Bring the stage into view once so the user watches the agent work
      // (all later target reveals scroll only the console's own panel).
      const reduceMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)",
      ).matches;
      document.querySelector(".acs-console-wrap")?.scrollIntoView({
        block: "center",
        behavior: reduceMotion ? "auto" : "smooth",
      });
      await waitMs(reduceMotion ? 16 : 440);

      for (const step of steps) {
        if (abortRef.current) break;

        // 1. Switch section if needed
        if (step.section && step.section !== activeSection) {
          setActiveSection(step.section);
          // Wait for React to re-render + layout to settle
          await waitFrames(LAYOUT_RAF_COUNT);
        }

        if (abortRef.current) break;

        // 2. Reveal the target: a real guide brings the thing on-screen before
        //    pointing. We scroll ONLY the console's own scroll panel (.mc-main),
        //    never the window — so the page stays put and the fixed-position
        //    cursor always lands on a target that's visible inside the console.
        //    Recompute the rect AFTER the scroll settles.
        const el = document.querySelector<HTMLElement>(
          `[data-target="${step.targetId}"]`,
        );
        if (!el) {
          console.warn(`[agent-cursor] target "${step.targetId}" not found`);
          continue;
        }
        const reduce = window.matchMedia(
          "(prefers-reduced-motion: reduce)",
        ).matches;
        const panel = el.closest<HTMLElement>(".mc-main");
        if (panel) {
          const pr = panel.getBoundingClientRect();
          const er = el.getBoundingClientRect();
          const delta = er.top + er.height / 2 - (pr.top + pr.height / 2);
          panel.scrollBy({ top: delta, behavior: reduce ? "auto" : "smooth" });
          await waitMs(reduce ? 16 : 380); // let the panel settle
        } else {
          await waitFrames(LAYOUT_RAF_COUNT);
        }

        if (abortRef.current) break;

        const rect = getTargetRect(step.targetId);
        if (!rect) continue;

        // 3. Drive cursor
        cursorRef.current?.goTo(rect, step.mode, step.text);

        // 4a. Terminal "do it yourself" step: wait for the user to act, then
        //     celebrate. This is the payoff that closes the loop.
        if (step.awaitAction) {
          const acted = await waitForUserAction(step.targetId, AWAIT_TIMEOUT_MS);
          if (abortRef.current) break;
          if (acted) {
            cursorRef.current?.celebrate(step.doneText ?? "Done.");
            celebrated = true;
            await waitMs(CELEBRATE_HOLD_MS);
          }
          break; // awaitAction is always the last beat
        }

        // 4b. Otherwise pause so the user can read the caption, then continue.
        await waitMs(STEP_DELAY_MS);
      }

      if (!abortRef.current) {
        if (!celebrated) await waitMs(IDLE_DELAY_MS);
        cursorRef.current?.dismiss();
      }

      setIsRunning(false);
      setActiveScenarioId(null);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [activeSection],
  );

  const handleChipClick = (id: string) => {
    const scenario = SCENARIOS.find((s) => s.id === id);
    if (!scenario) return;
    runScenario(scenario.steps, scenario.id);
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const scenario = resolveQuestion(inputValue.trim());
    if (!scenario) return;
    setInputValue("");
    runScenario(scenario.steps, scenario.id);
  };

  const handleDismiss = () => {
    abortRef.current = true;
    cursorRef.current?.dismiss();
    setIsRunning(false);
    setActiveScenarioId(null);
  };

  return (
    <div className="acs-root">
      {/* Control strip — above the console so a chip is always reachable
          without scrolling past the stage. */}
      <div className="acs-controls">
        <div className="acs-chips" role="list" aria-label="Suggested questions">
          {SCENARIOS.map((s) => (
            <button
              key={s.id}
              type="button"
              role="listitem"
              className="acs-chip"
              data-active={activeScenarioId === s.id}
              onClick={() => handleChipClick(s.id)}
              disabled={isRunning && activeScenarioId !== s.id}
            >
              {s.question}
            </button>
          ))}
        </div>

        <form className="acs-form" onSubmit={handleSubmit}>
          <input
            type="text"
            className="acs-input"
            placeholder="Ask the agent…"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            disabled={isRunning}
            aria-label="Ask a question"
          />
          <button
            type="submit"
            className="acs-form__submit"
            disabled={isRunning || !inputValue.trim()}
          >
            Ask
          </button>
          {isRunning && (
            <button
              type="button"
              className="acs-form__dismiss"
              onClick={handleDismiss}
            >
              Stop
            </button>
          )}
        </form>
      </div>

      {/* Console — the world the cursor moves in. */}
      <div className="acs-console-wrap">
        <MockConsole
          activeSection={activeSection}
          onSectionChange={setActiveSection}
        />
        {/* Cursor overlay — sits above the console, pointer-events none by default */}
        <AgentCursor ref={cursorRef} />
      </div>
    </div>
  );
}

// ─── AgentCursor ──────────────────────────────────────────────────────────────

/**
 * AgentCursor — the cursor overlay component + MOTION ENGINE.
 *
 * The agent is embodied as a single pointer that physically TRAVELS to its
 * target. Motion is the whole point: the path itself is the explanation, and
 * the cursor's behaviour reads its intent without any text.
 *
 * Motion model — matches the Gridex agent-cursor texture: a duration-based
 * easeInOutQuad tween, NOT a spring. It accelerates out, decelerates in, and
 * lands clean — no overshoot, no bounce. Calm and decisive.
 *
 * State machine (per goTo):
 *   thinking   — a short beat where the cursor holds and its halo pulses.
 *                Reads as "I'm finding it."
 *   traveling  — eased glide to the landing point over a distance-proportional
 *                duration (constant-ish speed). Stays upright; no rotation,
 *                no scale swoop.
 *   arrived    — holds on the target; the ring (guide) or answer chip blooms.
 *
 * Implementation notes:
 *   - One rAF loop writes the cursor transform straight to the DOM node every
 *     frame (no React re-render during motion). React state changes only on
 *     phase transitions (visible / arrived / exiting).
 *   - prefers-reduced-motion: skip the glide entirely; snap to the target and
 *     reveal immediately.
 *   - Coordinates come from the target's DOMRect (viewport-relative); the
 *     overlay is position:fixed, so no offset compensation is needed.
 */

type Mode = "guide" | "answer";

type Visual =
  | { status: "hidden" }
  | { status: "visible"; rect: DOMRect; mode: Mode; text: string };

const PAD = 6;
const THINK_MS = 240; // "deciding" beat before the glide
const MS_PER_PX = 0.85; // travel duration per pixel of distance
const MIN_TRAVEL_MS = 360;
const MAX_TRAVEL_MS = 1050;

/** easeInOutQuad — the exact curve the Gridex cursors use. Monotonic, so the
 *  cursor never overshoots its target. */
function easeInOutQuad(t: number) {
  return t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
}

function clamp(v: number, lo: number, hi: number) {
  return v < lo ? lo : v > hi ? hi : v;
}

/** The point the cursor tip flies to: roughly the centre of the element —
 *  biased a touch up-and-left of dead-centre so the arrow body (which extends
 *  down-right of the tip) sits over the element instead of past its edge. This
 *  reads like a real person resting their pointer on the thing, not pointing at
 *  a corner. */
function landingPoint(rect: DOMRect) {
  return {
    x: rect.left + rect.width * 0.42,
    y: rect.top + rect.height * 0.5,
  };
}

const AgentCursor = forwardRef<AgentCursorHandle>(function AgentCursor(_, ref) {
  const [visual, setVisual] = useState<Visual>({ status: "hidden" });
  const [arrived, setArrived] = useState(false);
  const [exiting, setExiting] = useState(false);
  const [celebrating, setCelebrating] = useState(false);
  const [celebrateText, setCelebrateText] = useState("");

  const cursorElRef = useRef<HTMLDivElement>(null);
  const haloElRef = useRef<HTMLDivElement>(null);

  // Motion state (mutable refs — never trigger re-render).
  const pos = useRef({ x: 0, y: 0 });
  const target = useRef({ x: 0, y: 0 });
  // The active glide tween, captured when travel begins.
  const tweenRef = useRef({ sx: 0, sy: 0, dx: 0, dy: 0, start: 0, dur: 0 });
  const phaseRef = useRef<"thinking" | "traveling" | "arrived">("thinking");
  const phaseStartRef = useRef(0);
  const initializedRef = useRef(false);
  const arrivedFiredRef = useRef(false);
  const reducedRef = useRef(false);
  const dismissTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const fireArrived = useCallback(() => {
    if (arrivedFiredRef.current) return;
    arrivedFiredRef.current = true;
    setArrived(true);
  }, []);

  // Write the current motion state to the DOM (cursor transform + halo).
  // The pointer stays upright and unscaled — a clean glide, Gridex-style.
  const render = useCallback(() => {
    const now = performance.now();
    const phase = phaseRef.current;

    const el = cursorElRef.current;
    if (el) {
      el.style.transform = `translate3d(${pos.current.x}px, ${pos.current.y}px, 0)`;
    }

    const halo = haloElRef.current;
    if (halo) {
      if (phase === "thinking") {
        const p = (Math.sin(now / 150) + 1) / 2; // 0..1
        halo.style.opacity = String(0.3 + p * 0.35);
        halo.style.transform = `scale(${1.2 + p * 0.35})`;
      } else {
        halo.style.opacity = "0.22";
        halo.style.transform = "scale(1)";
      }
    }
  }, []);

  // Advance the motion for the current frame timestamp (time-based; idempotent
  // if called more than once per frame).
  const tick = useCallback(
    (now: number) => {
      const phase = phaseRef.current;

      if (phase === "thinking") {
        if (now - phaseStartRef.current > THINK_MS) {
          // Begin the glide: capture the tween from the current position.
          const sx = pos.current.x;
          const sy = pos.current.y;
          const dx = target.current.x - sx;
          const dy = target.current.y - sy;
          const dist = Math.hypot(dx, dy);
          tweenRef.current = {
            sx,
            sy,
            dx,
            dy,
            start: now,
            dur: clamp(dist * MS_PER_PX, MIN_TRAVEL_MS, MAX_TRAVEL_MS),
          };
          phaseRef.current = "traveling";
        }
        return;
      }

      if (phase === "traveling") {
        const tw = tweenRef.current;
        const k = tw.dur > 0 ? Math.min(1, (now - tw.start) / tw.dur) : 1;
        const e = easeInOutQuad(k);
        pos.current.x = tw.sx + tw.dx * e;
        pos.current.y = tw.sy + tw.dy * e;
        if (k >= 1) {
          phaseRef.current = "arrived";
          fireArrived();
        }
      }
    },
    [fireArrived],
  );

  useImperativeHandle(
    ref,
    () => ({
      goTo(rect, mode, text) {
        if (dismissTimerRef.current) {
          clearTimeout(dismissTimerRef.current);
          dismissTimerRef.current = null;
        }
        const land = landingPoint(rect);
        target.current = land;
        arrivedFiredRef.current = false;
        setArrived(false);
        setExiting(false);
        setCelebrating(false);

        if (!initializedRef.current) {
          // First appearance — glide in from the lower-right, like it was resting.
          pos.current = {
            x: window.innerWidth * 0.82,
            y: window.innerHeight * 0.92,
          };
          initializedRef.current = true;
        }

        setVisual({ status: "visible", rect, mode, text });

        if (reducedRef.current) {
          pos.current = { ...land };
          phaseRef.current = "arrived";
          fireArrived();
          return;
        }

        phaseRef.current = "thinking";
        phaseStartRef.current = performance.now();
      },
      celebrate(text) {
        // Cursor has already arrived on the target; swap to the success beat.
        setCelebrateText(text);
        setCelebrating(true);
      },
      dismiss() {
        setExiting(true);
        if (dismissTimerRef.current) clearTimeout(dismissTimerRef.current);
        dismissTimerRef.current = setTimeout(() => {
          setVisual({ status: "hidden" });
          setArrived(false);
          setExiting(false);
          setCelebrating(false);
          arrivedFiredRef.current = false;
        }, 320);
      },
    }),
    [fireArrived],
  );

  // Track reduced-motion preference live.
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    reducedRef.current = mq.matches;
    const onChange = () => {
      reducedRef.current = mq.matches;
    };
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  // Place the cursor at its current position before paint (no first-frame
  // flash at the origin), then drive a time-based rAF loop while visible.
  // The loop reads target.current/phaseRef live, so subsequent goTo calls
  // (same "visible" status) steer the running loop without restarting it.
  useLayoutEffect(() => {
    if (visual.status !== "visible") return;
    render();
    if (reducedRef.current) return;

    let raf = 0;
    const frame = (now: number) => {
      tick(now);
      render();
      raf = requestAnimationFrame(frame);
    };
    raf = requestAnimationFrame(frame);
    return () => cancelAnimationFrame(raf);
  }, [visual.status, render, tick]);

  if (visual.status === "hidden") return null;

  const { rect, mode, text } = visual;
  const ringLeft = rect.left - PAD;
  const ringTop = rect.top - PAD;
  const ringW = rect.width + PAD * 2;
  const ringH = rect.height + PAD * 2;

  const ringClass =
    `ac-ring ac-ring--${mode}` +
    (arrived ? " is-arrived" : "") +
    (celebrating ? " is-celebrating" : "");
  const captionClass =
    `ac-caption ac-caption--${mode}` +
    (arrived ? " is-arrived" : "") +
    (celebrating ? " is-celebrating" : "");

  return (
    <div className="ac-overlay" aria-live="polite" aria-atomic="true">
      {/* Ring / highlight around the target — blooms in on arrival, turns
          green on completion. */}
      <div
        className={ringClass}
        style={{
          left: `${ringLeft}px`,
          top: `${ringTop}px`,
          width: `${ringW}px`,
          height: `${ringH}px`,
        }}
      />

      {/* Success check — pops at the ring's corner when the user completes. */}
      {celebrating && (
        <div
          className="ac-check"
          style={{ left: `${ringLeft + ringW - 9}px`, top: `${ringTop - 9}px` }}
          aria-hidden="true"
        >
          ✓
        </div>
      )}

      {/* Caption (guide) / answer chip — swaps to the completion line on done. */}
      <div
        className={captionClass}
        style={{
          left: `${ringLeft}px`,
          top: `${ringTop + ringH + 12}px`,
        }}
      >
        <span className="ac-caption__dot" aria-hidden="true" />
        <span className="ac-caption__text">
          {celebrating ? celebrateText : text}
        </span>
      </div>

      {/* The agent cursor — transform written by the rAF loop. */}
      <div
        ref={cursorElRef}
        className={
          `ac-cursor${exiting ? " is-exiting" : ""}` +
          (celebrating ? " is-celebrating" : "")
        }
        aria-hidden="true"
      >
        <div ref={haloElRef} className="ac-cursor__halo" />
        <svg
          className="ac-cursor__nib"
          width="15"
          height="21"
          viewBox="0 0 15 21"
          fill="none"
        >
          <path
            d="M1 1 L1 16.5 L4.7 12.8 L7.4 19.2 L9.6 18.3 L6.9 12 L12 12 Z"
            fill="var(--color-klein)"
            stroke="#fff"
            strokeWidth="1.4"
            strokeLinejoin="round"
          />
        </svg>
      </div>
    </div>
  );
});
