// Auto-hover engine for the exploded Gridex diagram.
//
// The exploded view's whole point is that the desk is pulled into layers and
// EACH layer reveals something different. Instead of waiting for a user mouse,
// the three agent cursors drive themselves: each one walks a fixed loop of
// surfaces, and on arrival it "probes" the layer (.is-probing) — which lifts +
// rings the card and fires that layer's own distinct reveal (a variance cell,
// a highlighted clause, a ✓ Sent line, a CRM status, a waveform line…). The
// hover IS the visualization: an agent finding the association between pages.
//
// Coordinate note (same trick as the hero engine): offset-chain math ignores
// CSS transforms, so x/y land correctly inside the rotated 3D plane. The
// cursor floats at one constant Z above the tallest layer so it's never
// occluded by a card — and its x/y are offset to cancel that Z's on-screen
// shift, keeping it pinned to whatever surface it's reading. See poseFor().

type Probe = {
  /** Card that lifts + rings, and whose --lift sets the cursor's Z. */
  cardSel: string;
  /** Inner element the cursor actually lands on (the thing being read). */
  hitSel: string;
};

type Chain = {
  cursorSel: string;
  /** ms offset so the three agents are never probing in lockstep. */
  phase: number;
  probes: Probe[];
};

const CHAINS: Chain[] = [
  // α — the numbers agent: variance → the cap clause it traces to → done pile.
  {
    cursorSel: ".stage-cursor--alpha",
    phase: 0,
    probes: [
      { cardSel: ".ws-spreadsheet", hitSel: ".ws-sheet-delta.is-variance" },
      { cardSel: ".ws-contract", hitSel: ".ws-clause--target" },
      { cardSel: ".ws-done-pile", hitSel: ".ws-done-row--alpha" },
    ],
  },
  // β — the comms agent: the email it picks up → its reply → the Slack thread.
  {
    cursorSel: ".stage-cursor--beta",
    phase: 900,
    probes: [
      { cardSel: ".ws-inbox", hitSel: ".ws-email.is-selected" },
      { cardSel: ".ws-compose", hitSel: ".ws-compose-sent" },
      { cardSel: ".ws-slack-chat", hitSel: ".ws-slack-reaction" },
    ],
  },
  // γ — the records agent: voice note → the CRM status it updates → margin note.
  {
    cursorSel: ".stage-cursor--gamma",
    phase: 1800,
    probes: [
      { cardSel: ".ws-voice", hitSel: ".ws-voice-line.is-active" },
      { cardSel: ".ws-crm", hitSel: '.ws-crm-field[data-field="status"]' },
      { cardSel: ".ws-contract", hitSel: ".ws-margin-note" },
    ],
  },
];

const TOP_MARGIN = 90; // how far the cursor floats above the TALLEST layer
const LAND = 180; // ms the pin spends doing its settle-bob on arrival
const BEAT = 260; // ms after the bob before the layer reveals (hover delay)
const DWELL = 1700; // ms the reveal is held while the cursor reads the layer

export function initGridexExplodedStage(stageRoot: HTMLElement): () => void {
  const stage = stageRoot;

  let alive = true;
  const trackedTimeouts = new Set<ReturnType<typeof setTimeout>>();
  const trackedRaf = new Set<number>();

  const wait = (ms: number) =>
    new Promise<void>((r) => {
      const id = setTimeout(() => {
        trackedTimeouts.delete(id);
        if (alive) r();
      }, ms);
      trackedTimeouts.add(id);
    });

  const easeInOut = (t: number) =>
    t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;

  // Scene knobs, read once from the root: explode multiplier + the two tilts
  // that define the axonometric projection.
  const root = stage.closest<HTMLElement>(".gridex-exploded") ?? stage;
  const rootStyle = getComputedStyle(root);
  const numVar = (name: string, fallback: number) => {
    const v = parseFloat(rootStyle.getPropertyValue(name));
    return Number.isFinite(v) ? v : fallback;
  };
  const exZ = numVar("--ex-z", 1) || 1;
  const theta = (numVar("--ex-tilt-x", 54) * Math.PI) / 180;
  const phi = (numVar("--ex-tilt-z", -38) * Math.PI) / 180;
  const tanT = Math.tan(theta);
  const sinP = Math.sin(phi);
  const cosP = Math.cos(phi);

  function liftOf(card: HTMLElement) {
    const raw = parseFloat(getComputedStyle(card).getPropertyValue("--lift"));
    return (Number.isFinite(raw) ? raw : 0) * exZ;
  }

  // The cursor must never be occluded by a layer, or the "hover" reading
  // breaks. So every cursor floats at one constant Z just above the TALLEST
  // card — guaranteeing it paints on top of the whole stack.
  let maxLift = 0;
  stage
    .querySelectorAll<HTMLElement>(".ws-card, .ws-done-pile")
    .forEach((c) => {
      maxLift = Math.max(maxLift, liftOf(c));
    });
  const cursorZ = maxLift + TOP_MARGIN;

  function offsetWithinStage(el: HTMLElement) {
    let left = 0;
    let top = 0;
    let cur: HTMLElement | null = el;
    while (cur && cur !== stage) {
      left += cur.offsetLeft;
      top += cur.offsetTop;
      cur = cur.offsetParent as HTMLElement | null;
    }
    return { left, top, width: el.offsetWidth, height: el.offsetHeight };
  }

  function centerOf(el: HTMLElement) {
    const r = offsetWithinStage(el);
    return { x: r.left + r.width / 2 - 4, y: r.top + r.height / 2 - 4 };
  }

  type Pose = { x: number; y: number; z: number };

  // Land the cursor visually on a point that lives at `lift` in the plane,
  // while the cursor itself sits at the constant `cursorZ`. Raising the
  // cursor's Z would shift it on screen; in this no-perspective projection a
  // translateZ(dz) moves a point by a fixed in-plane vector, so we add the
  // exact inverse offset to x/y. Derived from rotateX(theta)·rotateZ(phi):
  //   dx = dz·tan(theta)·sin(phi),  dy = dz·tan(theta)·cos(phi).
  function poseFor(probe: Probe): Pose | null {
    const card = stage.querySelector<HTMLElement>(probe.cardSel);
    if (!card) return null;
    const hit = stage.querySelector<HTMLElement>(probe.hitSel) ?? card;
    const { x, y } = centerOf(hit);
    const dz = cursorZ - liftOf(card);
    return {
      x: x + dz * tanT * sinP,
      y: y + dz * tanT * cosP,
      z: cursorZ,
    };
  }

  function setPose(el: HTMLElement, p: Pose) {
    el.style.transform = `translate3d(${p.x}px, ${p.y}px, ${p.z}px)`;
  }

  function animate(el: HTMLElement, from: Pose, to: Pose): Promise<void> {
    const dx = to.x - from.x;
    const dy = to.y - from.y;
    const dz = to.z - from.z;
    const dist = Math.hypot(dx, dy);
    const duration = Math.max(620, (dist / 340) * 1000);
    const start = performance.now();
    return new Promise<void>((resolve) => {
      function tick(now: number) {
        if (!alive) return;
        if (document.hidden) {
          setPose(el, to);
          resolve();
          return;
        }
        const k = Math.min(1, (now - start) / duration);
        const e = easeInOut(k);
        setPose(el, {
          x: from.x + dx * e,
          y: from.y + dy * e,
          z: from.z + dz * e,
        });
        if (k < 1) {
          const id = requestAnimationFrame(tick);
          trackedRaf.add(id);
        } else resolve();
      }
      const id = requestAnimationFrame(tick);
      trackedRaf.add(id);
    });
  }

  const reduceMotion =
    typeof window !== "undefined" &&
    window.matchMedia &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  // ── Reduced motion: park each cursor on its first layer, probe held on. ──
  if (reduceMotion) {
    for (const chain of CHAINS) {
      const el = stage.querySelector<HTMLElement>(chain.cursorSel);
      const pose = poseFor(chain.probes[0]);
      const card = stage.querySelector<HTMLElement>(chain.probes[0].cardSel);
      if (el && pose) setPose(el, pose);
      if (card) card.classList.add("is-probing");
    }
    return () => {
      stage
        .querySelectorAll(".is-probing")
        .forEach((n) => n.classList.remove("is-probing"));
    };
  }

  // ── Per-cursor loop ──────────────────────────────────────────────────
  async function runChain(chain: Chain) {
    const el = stage.querySelector<HTMLElement>(chain.cursorSel);
    if (!el) return;

    const poses = chain.probes
      .map((p) => ({ probe: p, pose: poseFor(p) }))
      .filter((x): x is { probe: Probe; pose: Pose } => x.pose !== null);
    if (!poses.length) return;

    // Start parked on the first layer.
    setPose(el, poses[0].pose);
    await wait(chain.phase);

    let idx = 0;
    while (alive) {
      const cur = poses[idx];
      const card = stage.querySelector<HTMLElement>(cur.probe.cardSel);

      // Arrival: the pin settles first (the cursor "lands"), THEN — after a
      // short hover beat — the layer reveals what it's being read for. Landing
      // before the reveal is what makes this read as a hover and not a flash.
      el.classList.add("is-landing");
      await wait(LAND);
      if (!alive) return;
      el.classList.remove("is-landing");

      await wait(BEAT);
      if (!alive) return;
      card?.classList.add("is-probing");

      await wait(DWELL);
      if (!alive) return;
      card?.classList.remove("is-probing");

      const next = poses[(idx + 1) % poses.length];
      await animate(el, cur.pose, next.pose);
      idx = (idx + 1) % poses.length;
    }
  }

  CHAINS.forEach((c) => void runChain(c));

  // ── Teardown ───────────────────────────────────────────────────────────
  return () => {
    alive = false;
    trackedTimeouts.forEach(clearTimeout);
    trackedTimeouts.clear();
    trackedRaf.forEach(cancelAnimationFrame);
    trackedRaf.clear();
    stage
      .querySelectorAll(".is-probing, .is-landing")
      .forEach((n) => n.classList.remove("is-probing", "is-landing"));
  };
}
