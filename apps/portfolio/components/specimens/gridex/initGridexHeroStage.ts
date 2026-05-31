/* eslint-disable */
// Faithful port of the Gridex homepage hero stage animation engine.
// Source: /Users/reyn/Gridex/src/pages/index.astro → function initStage()
// Surgical changes applied (per porting spec):
//   1. stageRoot param replaces document.querySelector('.brand-hero-stage')
//   2. All element lookups rescoped to stage.querySelector/querySelectorAll
//   3. IntersectionObserver now observes stage itself
//   4. centerOf/pointOf rewritten to use offsetWithinStage (layout offsets)
//   5. window.__heroGate removed; heroGate is a plain local fn
//   6. window.innerWidth replaced with stage.clientWidth in off-stage offsets
//   7. Teardown via alive flag, tracked timeouts/intervals/IO
//   8. Reduced-motion branch preserved (phases[1] guard made safe)

export function initGridexHeroStage(stageRoot: HTMLElement): () => void {
  const stage = stageRoot;

  const cursorEls = {
    alpha: stage.querySelector<HTMLElement>('.stage-cursor--alpha'),
    beta:  stage.querySelector<HTMLElement>('.stage-cursor--beta'),
    gamma: stage.querySelector<HTMLElement>('.stage-cursor--gamma'),
  };
  if (!cursorEls.alpha || !cursorEls.beta || !cursorEls.gamma) return () => {};

  // ── Teardown state ──────────────────────────────────────────────────
  let alive = true;
  const trackedTimeouts = new Set<ReturnType<typeof setTimeout>>();
  let trackedWaveformInterval: ReturnType<typeof setInterval> | null = null;
  let heroIO: IntersectionObserver | null = null;

  function safeSetTimeout(fn: () => void, ms: number): ReturnType<typeof setTimeout> {
    const id = setTimeout(() => {
      trackedTimeouts.delete(id);
      if (alive) fn();
    }, ms);
    trackedTimeouts.add(id);
    return id;
  }

  const wait = (ms: number) => new Promise<void>((r) => {
    const id = setTimeout(() => {
      trackedTimeouts.delete(id);
      if (alive) r();
      // if !alive, promise simply never resolves — loops suspend
    }, ms);
    trackedTimeouts.add(id);
  });

  const easeInOut = (t: number) => (t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2);

  // ── Scale-safe position helpers ─────────────────────────────────────
  // Walk up offsetParent chain accumulating offsets until we hit stage.
  // Returns {left, top, width, height} in stage-local unscaled px.
  function offsetWithinStage(el: HTMLElement): { left: number; top: number; width: number; height: number } {
    let left = 0;
    let top = 0;
    let cur: HTMLElement | null = el;
    while (cur && cur !== stage) {
      left += cur.offsetLeft;
      top  += cur.offsetTop;
      cur = cur.offsetParent as HTMLElement | null;
    }
    return { left, top, width: el.offsetWidth, height: el.offsetHeight };
  }

  function centerOf(el: HTMLElement) {
    const r = offsetWithinStage(el);
    return {
      x: r.left + r.width / 2 - 4,
      y: r.top  + r.height / 2 - 4,
    };
  }

  function pointOf(el: HTMLElement, dxFrac: number, dyFrac: number) {
    const r = offsetWithinStage(el);
    return {
      x: r.left + r.width  * dxFrac - 4,
      y: r.top  + r.height * dyFrac - 4,
    };
  }

  // ── Per-agent entrance offset (px right of the cursor's logical x). ──
  const entranceOffsetX: Record<string, number> = { alpha: 0, beta: 0, gamma: 0 };

  // ── Agent class ──────────────────────────────────────────────────────
  function Agent(this: any, el: HTMLElement, speed: number, name: string) {
    this.el = el;
    this.speed = speed;
    this.name = name;
    this.x = 0;
    this.y = 0;
  }

  Agent.prototype.setPos = function (x: number, y: number) {
    this.x = x;
    this.y = y;
    const offsetX = entranceOffsetX[this.name] || 0;
    const renderX = x + offsetX;
    this.el.style.transform = `translate(${renderX}px, ${y}px)`;
    if (stage) {
      const stageW = stage.clientWidth;
      const stageH = stage.clientHeight;
      const offStage = renderX > stageW || renderX < -4 || y < -4 || y > stageH;
      if (offStage !== this._wasOffStage) {
        this.el.style.opacity = offStage ? '0' : '';
        this._wasOffStage = offStage;
      }
    }
  };

  Agent.prototype.moveTo = function (x: number, y: number, opts?: { duration?: number }) {
    const sx = this.x, sy = this.y;
    const dx = x - sx, dy = y - sy;
    const dist = Math.hypot(dx, dy);
    if (dist < 0.5) return Promise.resolve();
    const duration = (opts && opts.duration)
      ? opts.duration
      : Math.max(220, (dist / this.speed) * 1000);
    const start = performance.now();
    const self = this;
    return new Promise<void>((resolve) => {
      function tick(now: number) {
        if (!alive) return;
        if (document.hidden) {
          self.setPos(x, y);
          resolve();
          return;
        }
        const elapsed = now - start;
        const k = Math.min(1, elapsed / duration);
        const e = easeInOut(k);
        self.setPos(sx + dx * e, sy + dy * e);
        if (k < 1) requestAnimationFrame(tick);
        else resolve();
      }
      requestAnimationFrame(tick);
    });
  };

  Agent.prototype.click = function () {
    this.el.classList.add('is-clicking');
    const el = this.el;
    safeSetTimeout(() => el.classList.remove('is-clicking'), 260);
  };

  Agent.prototype.typeInto = async function (targetEl: HTMLElement, text: string, opts?: { speedMult?: number }) {
    opts = opts || {};
    const speedMult = opts.speedMult || 1;
    targetEl.textContent = '';
    for (let i = 0; i < text.length; i++) {
      if (!alive) return;
      if (document.hidden) {
        targetEl.textContent = text;
        return;
      }
      targetEl.textContent += text[i];
      const ch = text[i];
      let delay = (25 + Math.random() * 30) * speedMult;
      if (ch === '.' || ch === '!' || ch === '?') delay = 260 * speedMult;
      else if (ch === ',' || ch === ';' || ch === ':') delay = 150 * speedMult;
      else if (ch === '\n') delay = 320 * speedMult;
      else if (ch === ' ' && Math.random() < 0.08) delay += 90 * speedMult;
      await wait(delay);
    }
  };

  Agent.prototype.dragTo = function (targetEl: HTMLElement, finalX: number, finalY: number) {
    const sx = this.x, sy = this.y;
    const dx = finalX - sx, dy = finalY - sy;
    const dist = Math.hypot(dx, dy);
    const duration = Math.max(420, (dist / (this.speed * 0.75)) * 1000);
    const start = performance.now();
    const self = this;
    targetEl.classList.add('ws-dragging');
    return new Promise<void>((resolve) => {
      function tick(now: number) {
        if (!alive) return;
        if (document.hidden) {
          self.setPos(finalX, finalY);
          targetEl.style.transform = `translate(${dx}px, ${dy}px)`;
          targetEl.classList.remove('ws-dragging');
          resolve();
          return;
        }
        const elapsed = now - start;
        const k = Math.min(1, elapsed / duration);
        const e = easeInOut(k);
        const cx = sx + dx * e;
        const cy = sy + dy * e;
        self.setPos(cx, cy);
        targetEl.style.transform = `translate(${cx - sx}px, ${cy - sy}px)`;
        if (k < 1) requestAnimationFrame(tick);
        else {
          targetEl.classList.remove('ws-dragging');
          resolve();
        }
      }
      requestAnimationFrame(tick);
    });
  };

  const alpha = new (Agent as any)(cursorEls.alpha, 320, 'alpha');
  const beta  = new (Agent as any)(cursorEls.beta,  280, 'beta');
  const gamma = new (Agent as any)(cursorEls.gamma, 300, 'gamma');

  // ── Hero-cursor entrance + activity gate ─────────────────────────────
  let _heroActive = false;
  async function heroGate() {
    while (!_heroActive) {
      if (!alive) return;
      await new Promise<void>((r) => {
        const id = setTimeout(() => {
          trackedTimeouts.delete(id);
          if (alive) r();
        }, 150);
        trackedTimeouts.add(id);
      });
    }
  }

  const HERO_PARKING = {
    alpha: { x: 10,  y: 280 },
    beta:  { x: 200, y: -20 },
    gamma: { x: 560, y: 240 },
  };
  const HERO_SILENT_GAP_MS = 300;
  const HERO_STAGGER_MS: Record<string, number> = { alpha: 0, beta: 180, gamma: 360 };
  const HERO_ENTRANCE_DUR_MS = 740;

  function _heroEaseOut(t: number) { return 1 - Math.pow(1 - t, 3); }

  let _heroRunToken = 0;

  function _heroResetEntrance() {
    _heroRunToken++;
    _heroActive = false;
    _heroApplyOffStageOffsets();
    alpha.setPos(HERO_PARKING.alpha.x, HERO_PARKING.alpha.y);
    beta .setPos(HERO_PARKING.beta.x,  HERO_PARKING.beta.y);
    gamma.setPos(HERO_PARKING.gamma.x, HERO_PARKING.gamma.y);
  }

  function _heroApplyOffStageOffsets() {
    // Changed: use stage.clientWidth instead of window.innerWidth
    // The stage is a fixed-size container; off-stage means past its right edge.
    const stageW = stage.clientWidth;
    const targetVx = stageW + 80;
    entranceOffsetX.alpha = targetVx - HERO_PARKING.alpha.x;
    entranceOffsetX.beta  = targetVx - HERO_PARKING.beta.x;
    entranceOffsetX.gamma = targetVx - HERO_PARKING.gamma.x;
  }

  function _heroStartEntrance() {
    const myToken = _heroRunToken;
    _heroApplyOffStageOffsets();
    safeSetTimeout(() => {
      if (myToken !== _heroRunToken) return;
      const names = ['alpha', 'beta', 'gamma'];
      let completed = 0;
      names.forEach((name) => {
        safeSetTimeout(() => {
          if (myToken !== _heroRunToken) return;
          const startT = performance.now();
          const from = entranceOffsetX[name];
          (function step(now: number) {
            if (!alive) return;
            if (myToken !== _heroRunToken) return;
            const t = Math.min(1, (now - startT) / HERO_ENTRANCE_DUR_MS);
            entranceOffsetX[name] = from * (1 - _heroEaseOut(t));
            if (t < 1) {
              requestAnimationFrame(step);
            } else {
              entranceOffsetX[name] = 0;
              completed++;
              if (completed === 3 && myToken === _heroRunToken) {
                _heroActive = true;
              }
            }
          })(performance.now());
        }, HERO_STAGGER_MS[name]);
      });
    }, HERO_SILENT_GAP_MS);
  }

  // Initial state: parked off-stage, loops gated, no entrance running.
  _heroResetEntrance();

  let _heroVisible = false;
  let _heroFirstSighting = true;
  heroIO = new IntersectionObserver((entries) => {
    for (const e of entries) {
      const inView = e.isIntersecting && e.intersectionRatio > 0.05;
      if (_heroFirstSighting) {
        _heroFirstSighting = false;
        _heroVisible = inView;
        if (inView) _heroStartEntrance();
        continue;
      }
      if (!_heroVisible && inView) {
        _heroVisible = true;
        _heroResetEntrance();
        requestAnimationFrame(_heroStartEntrance);
      } else if (_heroVisible && !inView) {
        _heroVisible = false;
        _heroResetEntrance();
      }
    }
  }, { threshold: [0, 0.05, 0.3, 0.7, 1] });
  // Surgical change #3: observe stage itself (not a .brand-hero wrapper)
  heroIO.observe(stage);

  // ── DOM refs ──────────────────────────────────────────────────────────
  const composeBody = stage.querySelector<HTMLElement>('.ws-typed');
  const composeCard = stage.querySelector<HTMLElement>('.ws-compose');
  const composeBodyEl = stage.querySelector<HTMLElement>('.ws-compose-body');
  const voiceCard = stage.querySelector<HTMLElement>('.ws-voice');
  const voiceBars = voiceCard ? voiceCard.querySelectorAll<HTMLElement>('.ws-voice-bar') : ([] as any as NodeListOf<HTMLElement>);
  const voiceTranscriptEl = voiceCard ? voiceCard.querySelector<HTMLElement>('.ws-voice-transcript') : null;
  const voiceRailEl = voiceCard ? voiceCard.querySelector<HTMLElement>('.ws-voice-rail') : null;
  const voiceMarkEl = voiceCard ? voiceCard.querySelector<HTMLElement>('.ws-card-mark') : null;
  const voiceMetaEl = voiceCard ? voiceCard.querySelector<HTMLElement>('.ws-card-meta') : null;
  const contractClause = stage.querySelector<HTMLElement>('.ws-clause--target');
  const marginNote = stage.querySelector<HTMLElement>('.ws-margin-note');
  const inboxList = stage.querySelector<HTMLElement>('.ws-inbox-list');
  const donePile = stage.querySelector<HTMLElement>('.ws-done-pile');
  const doneCountEl = stage.querySelector<HTMLElement>('.ws-done-count');

  const EMAIL_TEXT =
    "Hi Maria,\n\nConfirming the renewal terms we discussed last week. The revised Q3 pricing of $24,500 reflects the expanded coverage (A–D) and the cap raised to $1.2M per the carrier filing.\n\nLet me know if you'd like to walk through Schedule B before the call.\n\nBest,\nGridex";

  // L1: pool of email senders/subjects. Cycles through.
  const EMAIL_POOL = [
    { from: 'Jamie Park',     subj: 'New client onboarding' },
    { from: 'Carrier Ops',    subj: 'Policy renewal Q4' },
    { from: 'Davis & Co',     subj: 'Discovery package ready' },
    { from: 'Compliance',     subj: 'Annual report draft' },
    { from: 'Sarah Liu',      subj: 'Re: schedule update' },
    { from: 'Wells team',     subj: 'Subpoena response' },
    { from: 'Maria Chen',     subj: 'Re: Q3 renewal pricing' },
    { from: 'Hartford Ops',   subj: 'Wire confirmation' },
    { from: 'Brown intake',   subj: 'New case form' },
    { from: 'ABA review',     subj: '512 audit follow-up' },
    { from: 'PI desk',        subj: 'Client deposition prep' },
    { from: 'In-house Q&A',   subj: 'Schedule B clarification' },
  ];
  let emailPoolIdx = 0;

  // Reduced motion: skip animations entirely.
  // Note: original referenced phases[1] (a page-level variable); guarded here.
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    if (composeBody) composeBody.textContent = EMAIL_TEXT;
    if (composeCard) composeCard.classList.add('is-sent');
    if (contractClause) contractClause.classList.add('is-highlighted');
    if (marginNote) marginNote.classList.add('is-visible');
    // phases[1].classList.add('is-active') omitted — no phases in this context
    return () => {};
  }

  // ── L1: INBOX rotation ───────────────────────────────────────────────
  function makeEmailEl(data: { from: string; subj: string }) {
    const li = document.createElement('li');
    li.className = 'ws-email';
    const from = document.createElement('span');
    from.className = 'ws-email-from';
    from.textContent = data.from;
    const subj = document.createElement('span');
    subj.className = 'ws-email-subj';
    subj.textContent = data.subj;
    li.appendChild(from);
    li.appendChild(subj);
    return li;
  }

  async function rotateInbox() {
    if (!inboxList) return;
    const last = inboxList.lastElementChild as HTMLElement | null;
    if (last) {
      last.classList.add('email-leaving');
    }
    const next = EMAIL_POOL[emailPoolIdx % EMAIL_POOL.length];
    emailPoolIdx++;
    const li = makeEmailEl(next);
    li.classList.add('email-arriving');
    inboxList.insertBefore(li, inboxList.firstChild);
    void li.offsetHeight;
    li.classList.remove('email-arriving');
    await wait(440);
    if (last && last.parentNode === inboxList) inboxList.removeChild(last);
  }

  async function inboxLoop() {
    while (true) {
      if (!alive) return;
      await heroGate();
      await wait(5500 + Math.random() * 2200);
      if (document.hidden) continue;
      rotateInbox();
    }
  }

  // ── L2: addToDone ────────────────────────────────────────────────────
  const doneLog = stage.querySelector<HTMLElement>('.ws-done-log');
  const MAX_DONE_ROWS = 4;
  let doneCount = 47;

  const RECEIPT_OFFSET = { x: 14, y: -8 };

  function spawnCursorReceipt(agent: string, action: string, x: number, y: number) {
    if (!stage) return;
    const el = document.createElement('div');
    el.className = 'cursor-receipt cursor-receipt--' + agent;
    el.textContent = '✓ ' + action;
    const tx = x + RECEIPT_OFFSET.x;
    const ty = y + RECEIPT_OFFSET.y;
    el.style.transform = `translate(${tx}px, ${ty}px) scale(0.6)`;
    el.style.opacity = '0';
    stage.appendChild(el);
    void el.offsetHeight;
    el.style.transition =
      'transform 260ms cubic-bezier(0.34, 1.56, 0.64, 1), opacity 200ms ease';
    el.style.transform = `translate(${tx}px, ${ty}px) scale(1)`;
    el.style.opacity = '1';
    window.setTimeout(() => {
      el.style.transition = 'transform 360ms ease, opacity 360ms ease';
      el.style.transform = `translate(${tx}px, ${ty - 6}px) scale(0.92)`;
      el.style.opacity = '0';
      window.setTimeout(() => el.remove(), 380);
    }, 760);
  }

  function postDoneRow(agent: string, action: string, subject: string) {
    if (!doneLog) return;
    const li = document.createElement('li');
    li.className = 'ws-done-row ws-done-row--' + agent + ' is-new';
    const dot = document.createElement('span');
    dot.className = 'ws-done-dot ws-done-dot--' + agent;
    const act = document.createElement('span');
    act.className = 'ws-done-action';
    act.textContent = action;
    const subj = document.createElement('span');
    subj.className = 'ws-done-subj';
    subj.textContent = subject;
    li.appendChild(dot);
    li.appendChild(act);
    li.appendChild(subj);
    doneLog.insertBefore(li, doneLog.firstChild);
    void li.offsetHeight;
    li.classList.remove('is-new');
    li.classList.add('is-flashing');
    window.setTimeout(() => li.classList.remove('is-flashing'), 520);
    const live = Array.from(doneLog.children).filter((c) => !c.classList.contains('is-leaving'));
    let toTrim = live.length - MAX_DONE_ROWS;
    for (let i = live.length - 1; i >= 0 && toTrim > 0; i--, toTrim--) {
      const victim = live[i] as HTMLElement;
      victim.classList.add('is-leaving');
      window.setTimeout(() => { if (victim.parentNode) victim.parentNode.removeChild(victim); }, 340);
    }
  }

  function addToDone(opts: { agent?: string; action?: string; text?: string; subject?: string; x?: number; y?: number }) {
    if (!opts) return;
    const agent = opts.agent || 'alpha';
    const action = opts.action || opts.text || 'Done';
    const subject = opts.subject || '';
    if (typeof opts.x === 'number' && typeof opts.y === 'number') {
      spawnCursorReceipt(agent, action, opts.x, opts.y);
    }
    postDoneRow(agent, action, subject);
    doneCount++;
    if (doneCountEl) doneCountEl.textContent = String(doneCount);
    if (donePile) {
      donePile.classList.add('is-pulsing');
      window.setTimeout(() => donePile.classList.remove('is-pulsing'), 420);
    }
  }

  // ── L3 helpers ───────────────────────────────────────────────────────
  const SPAWN_DIRS = ['right', 'top', 'bottom', 'topright'];

  function pickDirection(_card: HTMLElement) {
    return SPAWN_DIRS[Math.floor(Math.random() * SPAWN_DIRS.length)];
  }

  function pickCleanExitDirection(card: HTMLElement | null) {
    if (!card || !stage) return 'top';
    const cy = card.offsetTop + card.offsetHeight / 2;
    return cy < stage.clientHeight / 2 ? 'top' : 'bottom';
  }

  async function exitRight(agent: any) {
    const stageW = stage.clientWidth;
    const targetX = stageW + 80;
    const targetY = agent.y;
    const dist = Math.max(60, targetX - agent.x);
    const duration = Math.max(520, Math.min(900, dist * 1.25));
    await agent.moveTo(targetX, targetY, { duration });
    await wait(520);
  }

  function getTilt(card: HTMLElement) {
    return parseFloat((card as any).dataset.tilt || '0');
  }

  function offStageTransform(card: HTMLElement, dir: string) {
    const t = getTilt(card);
    const stageW = stage ? stage.clientWidth : 540;
    const stageH = stage ? stage.clientHeight : 720;
    const cardL = card.offsetLeft;
    const cardT = card.offsetTop;
    const cardW = card.offsetWidth || 1;
    const cardH = card.offsetHeight || 1;
    const M = 60;
    let tx: number, ty: number, scale: number, rot: number;
    switch (dir) {
      case 'right':
        tx = (stageW - cardL) + M;
        ty = -cardH * 0.06;
        scale = 0.92;
        rot = t + 8;
        break;
      case 'top':
        tx = cardW * 0.12;
        ty = -(cardT + cardH + M);
        scale = 0.92;
        rot = t - 6;
        break;
      case 'bottom':
        tx = cardW * 0.08;
        ty = (stageH - cardT) + M;
        scale = 0.94;
        rot = t - 4;
        break;
      case 'topright':
        tx = (stageW - cardL) + M * 0.8;
        ty = -(cardT + cardH + M * 0.6);
        scale = 0.88;
        rot = t + 10;
        break;
      default:
        tx = (stageW - cardL) + M;
        ty = 0;
        scale = 0.9;
        rot = t + 5;
    }
    return `translate(${tx}px, ${ty}px) rotate(${rot}deg) scale(${scale})`;
  }

  async function moveCursorToCloseDot(agent: any, card: HTMLElement) {
    const close = card.querySelector<HTMLElement>('.ws-close');
    if (!close) return null;
    const sr = stage.getBoundingClientRect();
    const cr = close.getBoundingClientRect();
    const x = cr.left - sr.left + cr.width / 2 - 4;
    const y = cr.top - sr.top + cr.height / 2 - 4;
    await agent.moveTo(x, y);
    close.classList.add('is-hot');
    await wait(140);
    agent.click();
    await wait(80);
    close.classList.remove('is-hot');
    return close;
  }

  async function closeCard(agent: any, card: HTMLElement | null) {
    if (!card || card.style.display === 'none') return;
    await moveCursorToCloseDot(agent, card);
    const tilt = getTilt(card);
    card.style.transition =
      'transform 220ms cubic-bezier(0.55, 0, 0.85, 0.3), opacity 200ms ease 20ms';
    card.style.transformOrigin = 'top left';
    card.style.transform = `rotate(${tilt}deg) scale(0.04)`;
    card.style.opacity = '0';
    await wait(240);
    card.style.display = 'none';
    card.style.transition = '';
    card.style.transformOrigin = '';
    card.style.transform = '';
    card.style.opacity = '';
  }

  const GRAB_DX = 26;
  const GRAB_DY = 12;

  function pickupPointForCard(card: HTMLElement | null, dir: string) {
    if (!card) return { x: 0, y: 0 };
    const wasHidden = card.style.display === 'none';
    const prevTransition = card.style.transition;
    const prevTransform = card.style.transform;
    const prevOpacity = card.style.opacity;
    if (wasHidden) card.style.display = '';
    card.style.transition = 'none';
    card.style.transform = offStageTransform(card, dir);
    card.style.opacity = '0';
    void card.offsetHeight;
    const sr = stage.getBoundingClientRect();
    const r = card.getBoundingClientRect();
    const x = r.left - sr.left + GRAB_DX - 4;
    const y = r.top - sr.top + GRAB_DY - 4;
    card.style.transition = prevTransition;
    card.style.transform = prevTransform;
    card.style.opacity = prevOpacity;
    if (wasHidden) card.style.display = 'none';
    return { x, y };
  }

  async function exitToPickup(agent: any, nextCard: HTMLElement, dir: string) {
    const p = pickupPointForCard(nextCard, dir);
    const dist = Math.hypot(p.x - agent.x, p.y - agent.y);
    const duration = Math.max(520, Math.min(900, dist * 1.25));
    await agent.moveTo(p.x, p.y, { duration });
    await wait(520);
  }

  function offStagePoint(dir: string) {
    const w = stage.clientWidth;
    const h = stage.clientHeight;
    switch (dir) {
      case 'right':    return { x: w + 130, y: 200 };
      case 'top':      return { x: w * 0.6, y: -90 };
      case 'bottom':   return { x: w * 0.4, y: h + 70 };
      case 'topright': return { x: w + 100, y: -50 };
      default:         return { x: w + 130, y: 200 };
    }
  }

  async function exitToOffStage(agent: any, dir: string) {
    const p = offStagePoint(dir);
    const dist = Math.hypot(p.x - agent.x, p.y - agent.y);
    const duration = Math.max(520, Math.min(900, dist * 1.25));
    await agent.moveTo(p.x, p.y, { duration });
    await wait(520);
  }

  async function escortIn(agent: any, card: HTMLElement | null, dir: string, duration?: number) {
    if (!card) return;
    duration = duration || 1000;

    card.style.display = '';
    card.style.transition = 'none';
    card.style.transform = '';
    card.style.opacity = '0';
    void card.offsetHeight;

    const offTx = offStageTransform(card, dir);

    card.style.transform = offTx;
    void card.offsetHeight;

    const sr = stage.getBoundingClientRect();
    const offRect = card.getBoundingClientRect();
    const offX = offRect.left - sr.left;
    const offY = offRect.top - sr.top;

    card.style.transform = '';
    card.style.opacity = '';
    void card.offsetHeight;
    const natRect = card.getBoundingClientRect();
    const natX = natRect.left - sr.left;
    const natY = natRect.top - sr.top;
    card.style.transform = offTx;
    card.style.opacity = '0';
    void card.offsetHeight;

    const grabDX = 26;
    const grabDY = 12;
    const cursorStartX = offX + grabDX - 4;
    const cursorStartY = offY + grabDY - 4;
    const cursorEndX = natX + grabDX - 4;
    const cursorEndY = natY + grabDY - 4;
    agent.setPos(cursorStartX, cursorStartY);

    card.style.transition =
      `transform ${duration}ms cubic-bezier(0.22, 1, 0.36, 1), opacity 280ms ease`;
    card.style.transform = '';
    card.style.opacity = '';

    const startTs = performance.now();
    const dx = cursorEndX - cursorStartX;
    const dy = cursorEndY - cursorStartY;
    return new Promise<void>((resolve) => {
      function tick(now: number) {
        if (!alive) return;
        if (document.hidden) {
          agent.setPos(cursorEndX, cursorEndY);
          card!.style.transition = '';
          resolve();
          return;
        }
        const elapsed = now - startTs;
        const k = Math.min(1, elapsed / duration!);
        const e = 1 - Math.pow(1 - k, 3);
        agent.setPos(cursorStartX + dx * e, cursorStartY + dy * e);
        if (k < 1) requestAnimationFrame(tick);
        else {
          agent.setPos(cursorEndX, cursorEndY);
          card!.style.transition = '';
          resolve();
        }
      }
      requestAnimationFrame(tick);
    });
  }

  // ── Workflow primitives ───────────────────────────────────────────────
  const contractCard = stage.querySelector<HTMLElement>('.ws-contract');
  const docCard = stage.querySelector<HTMLElement>('.ws-doc');

  function resetContract() {
    if (contractClause) contractClause.classList.remove('is-highlighted');
    if (marginNote) marginNote.classList.remove('is-visible');
  }

  const contractMarkEl = contractCard ? contractCard.querySelector<HTMLElement>('.ws-card-mark') : null;
  const contractPageEl = contractCard ? contractCard.querySelector<HTMLElement>('.ws-card-meta') : null;
  const CONTRACTS_POOL = [
    {
      title: 'Hartford Q3 — Master Service Agreement',
      page: 'p. 14 / 28',
      clauseText: '4.2  Provider shall be liable for any losses incurred by Client up to the cap defined in Schedule B.',
      note: 'verify 2024 cap — see Sched B',
    },
    {
      title: 'Smith Arbitration — Settlement Memo',
      page: 'p. 6 / 11',
      clauseText: '3.4  Confidentiality of this settlement shall extend for ten (10) years from the date of execution.',
      note: 'check non-disparagement scope',
    },
    {
      title: 'Davis Estate — Engagement Letter',
      page: 'p. 2 / 9',
      clauseText: '2.1  Retainer of $18,500 is due upon execution, applied against hourly billing at $475/hr.',
      note: 'confirm trust-fund deposit path',
    },
    {
      title: 'Park v. Carrier — NDA Addendum',
      page: 'p. 3 / 5',
      clauseText: '1.3  Recipient shall return or destroy all Confidential Information within thirty (30) days of request.',
      note: 'add audit-trail clause?',
    },
  ];
  let contractIdx = 0;
  let currentContract = CONTRACTS_POOL[0];

  function rotateContract() {
    if (!contractCard) return;
    const c = CONTRACTS_POOL[contractIdx % CONTRACTS_POOL.length];
    contractIdx++;
    currentContract = c;
    if (contractMarkEl) contractMarkEl.textContent = c.title;
    if (contractPageEl) contractPageEl.textContent = c.page;
    if (contractClause) contractClause.textContent = c.clauseText;
    if (marginNote) marginNote.textContent = c.note;
  }

  async function contractCycle() {
    resetContract();
    await wait(1500);
    if (!contractClause) return;
    const clauseStart = pointOf(contractClause, 0.05, 0.5);
    await alpha.moveTo(clauseStart.x, clauseStart.y);
    await wait(280);
    const clauseEnd = pointOf(contractClause, 0.95, 0.5);
    await alpha.moveTo(clauseEnd.x, clauseEnd.y);
    contractClause.classList.add('is-highlighted');
    await wait(700);
    alpha.click();
    await wait(360);
    if (!marginNote) return;
    const margin = centerOf(marginNote);
    await alpha.moveTo(margin.x, margin.y - 4);
    await wait(320);
    marginNote.classList.add('is-visible');
    addToDone({ agent: 'alpha', action: 'Flagged', subject: currentContract.title, x: alpha.x, y: alpha.y });
    await wait(2200);
    const pageMeta = pointOf(contractPageEl || contractClause, 0.5, 0);
    await alpha.moveTo(pageMeta.x, pageMeta.y - 18);
    await wait(2000);
  }

  const docSuggestions = docCard ? docCard.querySelectorAll<HTMLElement>('.ws-doc-sugg') : ([] as any as NodeListOf<HTMLElement>);
  const docTyped = docCard ? docCard.querySelector<HTMLElement>('.ws-doc-typed') : null;
  const docMarkEl = docCard ? docCard.querySelector<HTMLElement>('.ws-card-mark') : null;
  const docMetaEl = docCard ? docCard.querySelector<HTMLElement>('.ws-card-meta') : null;
  const DOC_POOL = [
    {
      title: 'Onboarding brief — draft v3',
      meta: 'edited just now',
      text: 'Throughput jumped from 22 to 41 matters per week without adding headcount.',
      suggs: ['✦ Add concrete throughput #', '✦ Cite Q3 cycle-time figure', '✦ Note SOC2 boundary'],
    },
    {
      title: 'Renewal memo — Hartford Q4',
      meta: 'edited just now',
      text: 'The carrier confirmed the AI exclusion endorsement applies only to undisclosed model use.',
      suggs: ['✦ Quote CG 40-47 directly', '✦ Add disclosure-path diagram', '✦ Tag for compliance review'],
    },
    {
      title: 'Intake summary — Park matter',
      meta: 'edited just now',
      text: 'Client retains exposure under §3 of the schedule if disclosure is delayed past thirty days.',
      suggs: ['✦ Reference §3 directly', '✦ Add deadline calendar entry', '✦ Flag for partner review'],
    },
  ];
  let docIdx = 0;
  let currentDoc = DOC_POOL[0];

  function rotateDoc() {
    if (!docCard) return;
    const d = DOC_POOL[docIdx % DOC_POOL.length];
    docIdx++;
    currentDoc = d;
    if (docMarkEl) docMarkEl.textContent = d.title;
    if (docMetaEl) docMetaEl.textContent = d.meta;
    docSuggestions.forEach((s, i) => {
      if (d.suggs[i]) s.textContent = d.suggs[i];
    });
    (docCard as any).dataset.docPayload = d.text;
  }

  function resetDoc() {
    if (!docCard) return;
    docSuggestions.forEach((s) => s.classList.remove('is-visible', 'is-accepted'));
    if (docTyped) docTyped.textContent = '';
  }

  async function docCycle() {
    if (!docCard) return;
    resetDoc();
    const text = (docCard as any).dataset.docPayload || DOC_POOL[0].text;
    await wait(800);
    const paraTarget = docCard.querySelector<HTMLElement>('.ws-doc-para--target');
    if (!paraTarget) return;
    const bodyPt = pointOf(paraTarget, 0.05, 0.5);
    await alpha.moveTo(bodyPt.x, bodyPt.y);
    await wait(260);
    if (docTyped) await alpha.typeInto(docTyped, text, { speedMult: 0.7 });
    await wait(520);
    for (let i = 0; i < docSuggestions.length; i++) {
      const sugg = docSuggestions[i];
      const sp = pointOf(sugg, 0.08, 0.5);
      await alpha.moveTo(sp.x, sp.y);
      await wait(140);
      sugg.classList.add('is-visible');
      await wait(440);
    }
    const accept = docSuggestions[1];
    if (accept) {
      const ap = centerOf(accept);
      await alpha.moveTo(ap.x, ap.y);
      await wait(200);
      alpha.click();
      accept.classList.add('is-accepted');
      addToDone({ agent: 'alpha', action: 'Edited', subject: currentDoc.title, x: alpha.x, y: alpha.y });
    }
    await wait(2200);
  }

  // ── Spreadsheet ───────────────────────────────────────────────────────
  const sheetCard = stage.querySelector<HTMLElement>('.ws-spreadsheet');
  const sheetMarkEl = sheetCard ? sheetCard.querySelector<HTMLElement>('.ws-card-mark') : null;
  const sheetMetaEl = sheetCard ? sheetCard.querySelector<HTMLElement>('.ws-card-meta') : null;
  const sheetActualCells = sheetCard ? sheetCard.querySelectorAll<HTMLElement>('.ws-sheet-actual') : ([] as any as NodeListOf<HTMLElement>);
  const sheetDeltaCells = sheetCard ? sheetCard.querySelectorAll<HTMLElement>('.ws-sheet-delta') : ([] as any as NodeListOf<HTMLElement>);
  const sheetNoteCells = sheetCard ? sheetCard.querySelectorAll<HTMLElement>('.ws-sheet-note') : ([] as any as NodeListOf<HTMLElement>);
  const sheetTotalCell = sheetCard ? sheetCard.querySelector<HTMLElement>('.ws-sheet-total') : null;
  const sheetLabelCells = sheetCard ? sheetCard.querySelectorAll<HTMLElement>('.ws-sheet-label') : ([] as any as NodeListOf<HTMLElement>);
  const sheetFiledCells = sheetCard ? sheetCard.querySelectorAll<HTMLElement>('.ws-sheet-filed') : ([] as any as NodeListOf<HTMLElement>);
  const sheetTotalFiledCell = sheetCard ? sheetCard.querySelector<HTMLElement>('.ws-sheet-filed-total') : null;
  const sheetFCell = sheetCard ? sheetCard.querySelector<HTMLElement>('.ws-sheet-fcell') : null;
  const sheetFVal = sheetCard ? sheetCard.querySelector<HTMLElement>('.ws-sheet-fval') : null;

  function setFormulaBar(ref: string, value: string, isFormula: boolean) {
    if (sheetFCell) sheetFCell.textContent = ref;
    if (sheetFVal) {
      sheetFVal.textContent = value;
      sheetFVal.classList.toggle('is-formula', !!isFormula);
    }
  }

  const SHEET_POOL = [
    {
      title: 'Q3 renewal recon',
      meta: 'Sheet · audit',
      rows: [
        { label: 'Hartford', filed: '24,500', actual: '24,500', match: true,  note: '', delta: '' },
        { label: 'Smith',    filed: '18,200', actual: '18,200', match: true,  note: '', delta: '' },
        { label: 'Davis',    filed: '11,750', actual: '11,800', match: false, delta: '+50',  note: 'mid-cycle endorsement' },
        { label: 'Park',     filed: '9,800',  actual: '9,800',  match: true,  note: '', delta: '' },
        { label: 'Carlin',   filed: '7,400',  actual: '7,400',  match: true,  note: '', delta: '' },
        { label: 'Mitchell', filed: '5,200',  actual: '5,275',  match: false, delta: '+75',  note: 'rider added Aug 14' },
      ],
      filedTotal: '76,850',
      actualTotal: '76,975',
    },
    {
      title: 'Hours by matter — Wk 38',
      meta: 'Sheet · billing',
      rows: [
        { label: 'Brown v.',    filed: '32.5', actual: '32.5', match: true,  note: '', delta: '' },
        { label: 'Park NDA',    filed: '14.0', actual: '16.5', match: false, delta: '+2.5', note: 'extra discovery review' },
        { label: 'Wells dep.',  filed: '21.0', actual: '21.0', match: true,  note: '', delta: '' },
        { label: 'Davis trust', filed: '12.0', actual: '11.5', match: false, delta: '-0.5', note: 'call cancelled' },
        { label: 'Carlin',      filed: '8.5',  actual: '8.5',  match: true,  note: '', delta: '' },
        { label: 'Mitchell',    filed: '6.0',  actual: '6.0',  match: true,  note: '', delta: '' },
      ],
      filedTotal: '94.0',
      actualTotal: '96.0',
    },
    {
      title: 'Vendor invoices — Sep',
      meta: 'Sheet · AP',
      rows: [
        { label: 'Westlaw',  filed: '4,200', actual: '4,200', match: true,  note: '', delta: '' },
        { label: 'CourtCal', filed: '850',   actual: '850',   match: true,  note: '', delta: '' },
        { label: 'DocuSign', filed: '1,400', actual: '1,260', match: false, delta: '-140', note: 'pro-rated mid-month' },
        { label: 'Clio',     filed: '2,100', actual: '2,100', match: true,  note: '', delta: '' },
        { label: 'Lexis',    filed: '3,600', actual: '3,600', match: true,  note: '', delta: '' },
        { label: 'Calendly', filed: '320',   actual: '380',   match: false, delta: '+60',  note: 'team plan upgrade' },
      ],
      filedTotal: '12,470',
      actualTotal: '12,390',
    },
  ];
  let sheetIdx = 0;
  let sheetCurrent: typeof SHEET_POOL[0] | null = null;

  function rotateSheet() {
    if (!sheetCard) return;
    const s = SHEET_POOL[sheetIdx % SHEET_POOL.length];
    sheetIdx++;
    sheetCurrent = s;
    if (sheetMarkEl) sheetMarkEl.textContent = s.title;
    if (sheetMetaEl) sheetMetaEl.textContent = s.meta;
    sheetLabelCells.forEach((c, i) => {
      if (s.rows[i]) c.textContent = s.rows[i].label;
    });
    sheetFiledCells.forEach((c, i) => {
      if (s.rows[i]) c.textContent = s.rows[i].filed;
    });
    if (sheetTotalFiledCell) sheetTotalFiledCell.textContent = s.filedTotal;
  }

  function resetSheet() {
    sheetActualCells.forEach((c) => {
      c.textContent = '';
      c.classList.remove('is-filling');
    });
    sheetDeltaCells.forEach((c) => {
      c.textContent = '';
      c.classList.remove('is-match', 'is-variance');
    });
    sheetNoteCells.forEach((c) => {
      c.textContent = '';
      c.classList.remove('is-visible');
    });
    if (sheetTotalCell) {
      sheetTotalCell.textContent = '';
      sheetTotalCell.classList.remove('is-filling');
    }
  }

  async function sheetCycle() {
    if (!sheetCard || !sheetCurrent) return;
    resetSheet();
    setFormulaBar('—', '', false);
    const lastRowRef = sheetCurrent.rows.length + 1;
    const totalRef = `D${lastRowRef + 1}`;
    await wait(800);
    for (let i = 0; i < sheetCurrent.rows.length; i++) {
      const cell = sheetActualCells[i];
      const delta = sheetDeltaCells[i];
      const note = sheetNoteCells[i];
      const row = sheetCurrent.rows[i];
      if (!cell || !row) continue;
      const cellPt = centerOf(cell);
      await alpha.moveTo(cellPt.x, cellPt.y);
      cell.classList.add('is-active-cell');
      setFormulaBar(`D${i + 2}`, '', false);
      await wait(160);
      cell.classList.add('is-filling');
      await alpha.typeInto(cell, row.actual, { speedMult: 0.55 });
      setFormulaBar(`D${i + 2}`, row.actual, false);
      await wait(140);
      if (row.match) {
        delta.textContent = '✓';
        delta.classList.add('is-match');
      } else {
        delta.textContent = row.delta || '·';
        delta.classList.add('is-variance');
        if (note && row.note) {
          note.textContent = row.note;
          note.classList.add('is-visible');
        }
      }
      cell.classList.remove('is-active-cell');
      await wait(220);
    }
    await wait(360);
    for (let i = 0; i < sheetCurrent.rows.length; i++) {
      const row = sheetCurrent.rows[i];
      const delta = sheetDeltaCells[i];
      if (!row || !delta || row.match) continue;
      const dp = centerOf(delta);
      await alpha.moveTo(dp.x, dp.y);
      delta.classList.add('is-active-cell');
      setFormulaBar(`E${i + 2}`, row.delta, false);
      await wait(180);
      alpha.click();
      await wait(140);
      delta.classList.remove('is-variance', 'is-active-cell');
      delta.classList.add('is-approved');
      await wait(440);
    }
    if (sheetTotalCell && sheetFVal) {
      const totPt = centerOf(sheetTotalCell);
      await alpha.moveTo(totPt.x, totPt.y);
      sheetTotalCell.classList.add('is-active-cell');
      setFormulaBar(totalRef, '', true);
      await wait(280);
      const formula = `=SUM(D2:D${lastRowRef})`;
      await alpha.typeInto(sheetFVal, formula, { speedMult: 0.45 });
      await wait(420);
      sheetTotalCell.classList.add('is-filling');
      sheetTotalCell.textContent = sheetCurrent.actualTotal;
      await wait(360);
      sheetTotalCell.classList.remove('is-active-cell');
    }
    addToDone({ agent: 'alpha', action: 'Recon', subject: sheetCurrent.title, x: alpha.x, y: alpha.y });
    await wait(1600);
  }

  // ── Loop Alpha: 3-way rotation in the bottom-wide slot ────────────────
  async function loopAlpha() {
    if (docCard) docCard.style.display = 'none';
    if (sheetCard) sheetCard.style.display = 'none';
    const variants = [
      { card: contractCard, rotate: rotateContract, cycle: contractCycle },
      { card: docCard,      rotate: rotateDoc,      cycle: docCycle },
      { card: sheetCard,    rotate: rotateSheet,    cycle: sheetCycle },
    ];
    let slotIdx = 0;
    let firstIteration = true;
    let carryDir = null as any;
    rotateContract();
    while (true) {
      if (!alive) return;
      await heroGate();
      const v = variants[slotIdx];
      if (!v.card) { slotIdx = (slotIdx + 1) % variants.length; continue; }
      if (!firstIteration) {
        v.rotate();
        await escortIn(alpha, v.card, 'right');
      }
      firstIteration = false;
      await v.cycle();
      await closeCard(alpha, v.card);
      await exitRight(alpha);
      const nextIdx = (slotIdx + 1) % variants.length;
      slotIdx = nextIdx;
    }
  }

  // ── Compose cycle ─────────────────────────────────────────────────────
  const composeToEl = composeCard ? composeCard.querySelector<HTMLElement>('.ws-compose-meta div:nth-child(1) .ws-compose-val') : null;
  const composeReEl = composeCard ? composeCard.querySelector<HTMLElement>('.ws-compose-meta div:nth-child(2) .ws-compose-val') : null;
  const COMPOSE_POOL = [
    {
      to: 'maria@hartford-ins.com',
      re: 'Q3 renewal — pricing confirmation',
      body: "Hi Maria,\n\nConfirming the renewal terms we discussed last week. Revised Q3 pricing of $24,500 reflects the expanded coverage (A–D) and the cap raised to $1.2M per the carrier filing.\n\nBest,\nGridex",
    },
    {
      to: 'park@davis-co.com',
      re: 'Discovery package — Brown matter',
      body: "Hi Jamie,\n\nThe redline of the discovery package is attached. Two additions on §4 (privilege log) and one strikethrough on §7. Margin notes are mine; ready for your read.\n\nBest,\nGridex",
    },
    {
      to: 'compliance@aba-review.org',
      re: 'Re: 512 audit follow-up',
      body: "Hi team,\n\nResponses to the three follow-up questions are inline. We've confirmed the audit-trail retention now matches the 7-year requirement and patched the §3 gap flagged last quarter.\n\nBest,\nGridex",
    },
    {
      to: 'ops@hartford-ins.com',
      re: 'Wire confirmation — Q3 invoice',
      body: "Hi ops,\n\nWire received this morning. Receipt attached, applied against invoice #4471. Q3 statement will close on schedule Friday.\n\nBest,\nGridex",
    },
  ];
  let composeIdx = 0;
  let currentCompose = COMPOSE_POOL[0];

  function rotateCompose() {
    const c = COMPOSE_POOL[composeIdx % COMPOSE_POOL.length];
    composeIdx++;
    currentCompose = c;
    if (composeToEl) composeToEl.textContent = c.to;
    if (composeReEl) composeReEl.textContent = c.re;
    if (composeCard) (composeCard as any).dataset.composeBody = c.body;
  }

  async function composeCycle() {
    if (!composeCard || !composeBody) return;
    composeCard.classList.remove('is-sent');
    composeBody.textContent = '';
    stage.querySelectorAll('.ws-email.is-selected').forEach((e) => e.classList.remove('is-selected'));
    await wait(700);
    const target = stage.querySelector<HTMLElement>('.ws-inbox-list .ws-email');
    if (!target) { await wait(600); return; }
    const tp = centerOf(target);
    await beta.moveTo(tp.x, tp.y);
    await wait(180);
    beta.click();
    target.classList.add('is-selected');
    rotateCompose();
    await wait(480);
    if (!composeBodyEl) return;
    const cp = pointOf(composeBodyEl, 0.18, 0.18);
    await beta.moveTo(cp.x, cp.y);
    await wait(260);
    const body = (composeCard as any).dataset.composeBody || EMAIL_TEXT;
    await beta.typeInto(composeBody, body);
    await wait(900);
    composeCard.classList.add('is-sent');
    addToDone({ agent: 'beta', action: 'Replied', subject: currentCompose.re, x: beta.x, y: beta.y });
    await wait(1400);
  }

  // ── Slack ─────────────────────────────────────────────────────────────
  const slackChannelsCard = stage.querySelector<HTMLElement>('.ws-slack-channels');
  const slackChatCard = stage.querySelector<HTMLElement>('.ws-slack-chat');
  const slackStreamEl = slackChatCard ? slackChatCard.querySelector<HTMLElement>('.ws-slack-stream') : null;
  const slackInputBody = slackChatCard ? slackChatCard.querySelector<HTMLElement>('.ws-slack-input-body') : null;
  const slackInputText = slackChatCard ? slackChatCard.querySelector<HTMLElement>('.ws-slack-input-text') : null;
  const slackSendBtn = slackChatCard ? slackChatCard.querySelector<HTMLElement>('.ws-slack-send') : null;
  const slackChatMarkEl = slackChatCard ? slackChatCard.querySelector<HTMLElement>('.ws-card-mark') : null;
  const slackChatMetaEl = slackChatCard ? slackChatCard.querySelector<HTMLElement>('.ws-card-meta') : null;
  const slackChannelItems = slackChannelsCard ? slackChannelsCard.querySelectorAll<HTMLElement>('.ws-slack-channel') : ([] as any as NodeListOf<HTMLElement>);

  const SLACK_POOL = [
    {
      channel: 'brown-matter',
      members: 4,
      prior: [
        { spk: 'J', name: 'Jamie Park', time: '9:14', text: 'Need the Brown redline by EOD?' },
        { spk: 'S', name: 'Sarah Liu',  time: '9:18', text: 'Bumping — confirm timeline pls' },
      ],
      ai: { name: 'Gridex', text: 'Brown discovery package is ready · see #brown-matter for the redline. @reyn FYI.', reactions: [{ emoji: '👍', count: 1 }, { emoji: '✓', count: 1 }] },
      subject: '#brown-matter · discovery update',
    },
    {
      channel: 'ops',
      members: 6,
      prior: [
        { spk: 'M', name: 'Maria Chen', time: '10:02', text: 'Wire from Hartford landed this morning' },
        { spk: 'J', name: 'Jamie Park', time: '10:05', text: 'Which invoice — 4471 or 4472?' },
      ],
      ai: { name: 'Gridex', text: 'Wire $24,500 applied to invoice #4471. Q3 statement closes Fri.', reactions: [{ emoji: '✓', count: 1 }] },
      subject: '#ops · wire reconciled',
    },
    {
      channel: 'renewals',
      members: 5,
      prior: [
        { spk: 'M', name: 'Maria Chen', time: '11:34', text: 'Hartford pushed back on Schedule B' },
        { spk: 'L', name: 'Liu Chen',   time: '11:38', text: 'Cap raise to 1.2M?' },
      ],
      ai: { name: 'Gridex', text: 'Hartford Q3 — Schedule B cap updated to $1.2M per carrier filing. CG 40-47 still applies.', reactions: [{ emoji: '👍', count: 2 }] },
      subject: '#renewals · Schedule B raised',
    },
    {
      channel: 'general',
      members: 12,
      prior: [
        { spk: 'D', name: 'Davis & Co', time: '13:48', text: 'Heads up — Wells subpoena landed' },
        { spk: 'P', name: 'Park intake', time: '13:52', text: 'How tight is the clock?' },
      ],
      ai: { name: 'Gridex', text: 'Wells subpoena response due in 14d. Looping legal in, privilege log queued.', reactions: [{ emoji: '👀', count: 3 }] },
      subject: '#general · Wells subpoena flagged',
    },
  ];
  let slackIdx = 0;
  let currentSlack = SLACK_POOL[0];

  const SLACK_AVATAR_LETTERS: Record<string, string> = { M: 'M', P: 'P', D: 'D', L: 'L', S: 'S', J: 'J', G: 'G' };

  function rotateSlack() {
    const s = SLACK_POOL[slackIdx % SLACK_POOL.length];
    slackIdx++;
    currentSlack = s;
    if (slackChatMarkEl) slackChatMarkEl.textContent = '# ' + s.channel;
    if (slackChatMetaEl) slackChatMetaEl.textContent = s.members + ' members';
    slackChannelItems.forEach((el) => {
      const ch = (el as any).dataset.ch;
      const isActive = ch === s.channel;
      el.classList.toggle('is-active', isActive);
      const lastCell = el.querySelector('.ws-slack-active-dot, .ws-slack-unread');
      if (lastCell) lastCell.remove();
      if (isActive) {
        const dot = document.createElement('span');
        dot.className = 'ws-slack-active-dot';
        el.appendChild(dot);
      } else {
        const n = (ch === 'general') ? 14 : (ch === 'ops' ? 3 : 1);
        const badge = document.createElement('span');
        badge.className = 'ws-slack-unread';
        badge.textContent = String(n);
        el.appendChild(badge);
      }
    });
  }

  function makeSlackMsg(m: { spk?: string; name: string; time: string; text: string }) {
    const li = document.createElement('li');
    li.className = 'ws-slack-msg';
    const av = document.createElement('div');
    av.className = 'ws-slack-avatar ws-slack-avatar--' + (m.spk || (m.name ? m.name[0] : 'G'));
    av.textContent = SLACK_AVATAR_LETTERS[m.spk || ''] || (m.name ? m.name[0] : 'G');
    const body = document.createElement('div');
    body.className = 'ws-slack-msg-body';
    const head = document.createElement('div');
    head.className = 'ws-slack-msg-head';
    const nm = document.createElement('span');
    nm.className = 'ws-slack-msg-name';
    nm.textContent = m.name;
    const tm = document.createElement('span');
    tm.className = 'ws-slack-msg-time';
    tm.textContent = m.time;
    head.appendChild(nm);
    head.appendChild(tm);
    const tx = document.createElement('div');
    tx.className = 'ws-slack-msg-text';
    tx.textContent = m.text;
    body.appendChild(head);
    body.appendChild(tx);
    const rx = document.createElement('div');
    rx.className = 'ws-slack-reactions';
    body.appendChild(rx);
    li.appendChild(av);
    li.appendChild(body);
    return { li, reactionsEl: rx };
  }

  function spawnSlackReaction(reactionsEl: HTMLElement, emoji: string, count: number) {
    const chip = document.createElement('span');
    chip.className = 'ws-slack-reaction';
    chip.innerHTML = `<span>${emoji}</span><span>${count}</span>`;
    reactionsEl.appendChild(chip);
    void chip.offsetHeight;
    chip.classList.add('is-in');
  }

  async function slackCycle() {
    if (!slackChatCard) return;
    rotateSlack();
    if (slackStreamEl) slackStreamEl.innerHTML = '';
    if (slackInputText) slackInputText.textContent = '';
    slackChatCard.classList.remove('is-typing');
    await wait(500);

    const priorRefs: { li: HTMLElement; reactionsEl: HTMLElement }[] = [];
    for (let i = 0; i < currentSlack.prior.length; i++) {
      const p = currentSlack.prior[i];
      const { li, reactionsEl } = makeSlackMsg({ spk: p.spk, name: p.name, time: p.time, text: p.text });
      if (slackStreamEl) slackStreamEl.appendChild(li);
      priorRefs.push({ li, reactionsEl });
      void li.offsetHeight;
      li.classList.add('is-in');
      await wait(200);
    }

    for (const ref of priorRefs) {
      const pt = pointOf(ref.li, 0.3, 0.5);
      await beta.moveTo(pt.x, pt.y);
      await wait(380);
    }

    if (!slackInputBody) return;
    const ip = pointOf(slackInputBody, 0.5, 0.5);
    await beta.moveTo(ip.x, ip.y);
    await wait(180);
    beta.click();
    slackChatCard.classList.add('is-typing');
    await wait(220);
    if (slackInputText) await beta.typeInto(slackInputText, currentSlack.ai.text, { speedMult: 0.5 });
    await wait(380);

    if (!slackSendBtn) return;
    const sp = pointOf(slackSendBtn, 0.5, 0.5);
    await beta.moveTo(sp.x, sp.y);
    await wait(160);
    slackSendBtn.classList.add('is-active');
    beta.click();
    await wait(220);
    slackSendBtn.classList.remove('is-active');
    slackChatCard.classList.remove('is-typing');

    const aiMsg = makeSlackMsg({ spk: 'G', name: currentSlack.ai.name, time: 'just now', text: currentSlack.ai.text });
    if (slackStreamEl) slackStreamEl.appendChild(aiMsg.li);
    if (slackInputText) slackInputText.textContent = '';
    void aiMsg.li.offsetHeight;
    aiMsg.li.classList.add('is-in');
    await wait(720);

    for (const r of currentSlack.ai.reactions) {
      spawnSlackReaction(aiMsg.reactionsEl, r.emoji, r.count);
      await wait(220);
    }

    addToDone({
      agent: 'beta',
      action: 'Sent',
      subject: currentSlack.subject,
      x: beta.x,
      y: beta.y,
    });

    await wait(1400);
  }

  // ── Pair animation helpers ─────────────────────────────────────────────
  const PAIR_STAGGER_MS = 120;

  function minimizeCardOnly(card: HTMLElement | null) {
    if (!card || card.style.display === 'none') return;
    const tilt = getTilt(card);
    card.style.transition =
      'transform 220ms cubic-bezier(0.55, 0, 0.85, 0.3), opacity 200ms ease 20ms';
    card.style.transformOrigin = 'top left';
    card.style.transform = `rotate(${tilt}deg) scale(0.04)`;
    card.style.opacity = '0';
    window.setTimeout(() => {
      card.style.display = 'none';
      card.style.transition = '';
      card.style.transformOrigin = '';
      card.style.transform = '';
      card.style.opacity = '';
    }, 240);
  }

  async function closeCardPair(agent: any, mainCard: HTMLElement | null, sidekick: HTMLElement | null) {
    if (!mainCard) return;
    await moveCursorToCloseDot(agent, mainCard);
    const tilt = getTilt(mainCard);
    mainCard.style.transition =
      'transform 220ms cubic-bezier(0.55, 0, 0.85, 0.3), opacity 200ms ease 20ms';
    mainCard.style.transformOrigin = 'top left';
    mainCard.style.transform = `rotate(${tilt}deg) scale(0.04)`;
    mainCard.style.opacity = '0';
    window.setTimeout(() => minimizeCardOnly(sidekick), PAIR_STAGGER_MS);
    await wait(240);
    mainCard.style.display = 'none';
    mainCard.style.transition = '';
    mainCard.style.transformOrigin = '';
    mainCard.style.transform = '';
    mainCard.style.opacity = '';
    await wait(PAIR_STAGGER_MS);
  }

  function slideCardInOnly(card: HTMLElement | null, dir: string, duration?: number) {
    if (!card) return;
    duration = duration || 1000;
    card.style.display = '';
    card.style.transition = 'none';
    card.style.transform = '';
    card.style.opacity = '0';
    void card.offsetHeight;
    const offTx = offStageTransform(card, dir);
    card.style.transform = offTx;
    void card.offsetHeight;
    card.style.transition =
      `transform ${duration}ms cubic-bezier(0.22, 1, 0.36, 1), opacity 280ms ease`;
    card.style.transform = '';
    card.style.opacity = '';
    window.setTimeout(() => {
      if (card.style.transition.includes('transform')) card.style.transition = '';
    }, duration + 60);
  }

  async function escortInPair(agent: any, mainCard: HTMLElement | null, sidekick: HTMLElement | null, dir: string) {
    window.setTimeout(() => slideCardInOnly(sidekick, dir), PAIR_STAGGER_MS);
    await escortIn(agent, mainCard, dir);
    await wait(Math.max(0, PAIR_STAGGER_MS));
  }

  const inboxCard = stage.querySelector<HTMLElement>('.ws-inbox');

  async function loopBeta() {
    if (slackChannelsCard) slackChannelsCard.style.display = 'none';
    if (slackChatCard) slackChatCard.style.display = 'none';
    const variants = [
      { main: composeCard, sidekick: inboxCard,          cycle: composeCycle },
      { main: slackChatCard, sidekick: slackChannelsCard, cycle: slackCycle  },
    ];
    let slotIdx = 0;
    let firstIteration = true;
    while (true) {
      if (!alive) return;
      await heroGate();
      const v = variants[slotIdx];
      if (!v.main || !v.sidekick) { slotIdx = (slotIdx + 1) % variants.length; continue; }
      if (!firstIteration) {
        await escortInPair(beta, v.main, v.sidekick, 'right');
      }
      firstIteration = false;
      await v.cycle();
      await closeCardPair(beta, v.main, v.sidekick);
      await exitRight(beta);
      slotIdx = (slotIdx + 1) % variants.length;
    }
  }

  // ── Voice transcript ──────────────────────────────────────────────────
  const CALL_POOL = [
    {
      title: 'Maria · Hartford',
      meta: '04:23',
      subject: 'Q3 renewal · cap raise',
      lines: [
        { time: '00:12', spk: 'M', text: 'Hoping to nail Q3 timeline by Friday.' },
        { time: '00:19', spk: 'G', text: 'flagged · Friday deadline' },
        { time: '00:24', spk: 'M', text: 'Sched B cap should be raised to 1.2M.' },
        { time: '00:31', spk: 'G', text: 'noted · cap → $1.2M' },
        { time: '00:38', spk: 'M', text: 'Can you send a revised quote by EOD?' },
      ],
      captures: [
        { lineIdx: 0, text: 'Confirm Friday delivery' },
        { lineIdx: 2, text: 'Update cap → $1.2M' },
      ],
    },
    {
      title: 'Park depo · Brown',
      meta: '12:47',
      subject: 'Brown deposition · timeline',
      lines: [
        { time: '04:08', spk: 'P', text: 'On June 14 the policy was already in force.' },
        { time: '04:15', spk: 'G', text: 'flagged · date · June 14' },
        { time: '04:21', spk: 'P', text: 'My client never received the Schedule B amendment.' },
        { time: '04:28', spk: 'G', text: 'noted · disputed receipt' },
        { time: '04:34', spk: 'P', text: 'We will need the carrier filing produced.' },
      ],
      captures: [
        { lineIdx: 0, text: 'Verify June 14 policy date' },
        { lineIdx: 2, text: 'Produce Schedule B receipt log' },
      ],
    },
    {
      title: 'Davis intake',
      meta: '08:11',
      subject: 'Davis estate · trust setup',
      lines: [
        { time: '02:02', spk: 'D', text: 'We want a revocable trust by year-end.' },
        { time: '02:09', spk: 'G', text: 'flagged · revocable trust · Dec 31' },
        { time: '02:18', spk: 'D', text: "The retainer is $18,500, applied to billing." },
        { time: '02:25', spk: 'G', text: 'noted · retainer · $18,500' },
        { time: '02:33', spk: 'D', text: 'My CPA can send the asset list this week.' },
      ],
      captures: [
        { lineIdx: 0, text: 'Open Davis trust file · Dec 31' },
        { lineIdx: 2, text: 'Log retainer · $18,500 to billing' },
      ],
    },
    {
      title: 'Liu · Wells subpoena',
      meta: '06:54',
      subject: 'Wells discovery prep',
      lines: [
        { time: '01:34', spk: 'L', text: 'Subpoena response is due in 14 days.' },
        { time: '01:41', spk: 'G', text: 'flagged · response deadline · 14d' },
        { time: '01:48', spk: 'L', text: 'Privilege log needs the 2024 emails reviewed.' },
        { time: '01:56', spk: 'G', text: 'noted · 2024 email privilege review' },
        { time: '02:03', spk: 'L', text: 'Loop in the Hartford team on Tuesday.' },
      ],
      captures: [
        { lineIdx: 0, text: 'Wells response · 14-day clock' },
        { lineIdx: 2, text: 'Run 2024 email privilege log' },
      ],
    },
  ];
  let callIdx = 0;
  let currentCall = CALL_POOL[0];

  function rotateCall() {
    const c = CALL_POOL[callIdx % CALL_POOL.length];
    callIdx++;
    currentCall = c;
    if (voiceMarkEl) voiceMarkEl.textContent = c.title;
    if (voiceMetaEl) voiceMetaEl.textContent = c.meta;
  }

  let waveformInterval: ReturnType<typeof setInterval> | null = null;
  function setWaveform(mode: 'active' | 'idle') {
    if (!voiceBars.length) return;
    if (waveformInterval) {
      clearInterval(waveformInterval);
      waveformInterval = null;
    }
    const tick = () => {
      for (let i = 0; i < voiceBars.length; i++) {
        const r = Math.random();
        let h: number;
        if (mode === 'active') h = 2 + r * 11;
        else                    h = 2 + r * 4;
        voiceBars[i].style.height = h.toFixed(1) + 'px';
      }
    };
    tick();
    waveformInterval = setInterval(tick, 100);
    trackedWaveformInterval = waveformInterval;
  }

  function makeTranscriptLine(line: { time: string; spk: string; text: string }) {
    const li = document.createElement('li');
    li.className = 'ws-voice-line';
    const time = document.createElement('span');
    time.className = 'ws-voice-time';
    time.textContent = '[' + line.time + ']';
    const spk = document.createElement('span');
    spk.className = 'ws-voice-spk ws-voice-spk--' + line.spk;
    spk.textContent = line.spk;
    const txt = document.createElement('span');
    txt.className = 'ws-voice-text';
    txt.textContent = '';
    li.appendChild(time);
    li.appendChild(spk);
    li.appendChild(txt);
    return { li, txt };
  }

  const MAX_RAIL_ITEMS = 3;
  function addRailItem(text: string) {
    if (!voiceRailEl) return;
    const li = document.createElement('li');
    li.className = 'ws-voice-item';
    const check = document.createElement('span');
    check.className = 'ws-voice-item-check';
    check.textContent = '✓';
    const t = document.createElement('span');
    t.className = 'ws-voice-item-text';
    t.textContent = text;
    li.appendChild(check);
    li.appendChild(t);
    voiceRailEl.appendChild(li);
    void li.offsetHeight;
    li.classList.add('is-in');
    const live = Array.from(voiceRailEl.children).filter((c) => !c.classList.contains('is-leaving'));
    let toTrim = live.length - MAX_RAIL_ITEMS;
    for (let i = 0; i < live.length && toTrim > 0; i++, toTrim--) {
      const victim = live[i] as HTMLElement;
      victim.classList.add('is-leaving');
      window.setTimeout(() => { if (victim.parentNode) victim.parentNode.removeChild(victim); }, 320);
    }
  }

  function spawnGhostFromLine(lineEl: HTMLElement, text: string) {
    if (!stage || !lineEl) return null;
    const lr = lineEl.getBoundingClientRect();
    const sr = stage.getBoundingClientRect();
    const g = document.createElement('div');
    g.className = 'ws-voice-ghost';
    g.textContent = text;
    g.style.transform = `translate(${lr.left - sr.left + 24}px, ${lr.top - sr.top}px) scale(0.96)`;
    g.style.opacity = '0';
    stage.appendChild(g);
    void g.offsetHeight;
    g.style.transition = 'transform 380ms cubic-bezier(0.22, 1, 0.36, 1), opacity 240ms ease';
    g.style.opacity = '1';
    return g;
  }

  async function scrollLineIntoView(lineEl: HTMLElement) {
    if (!voiceTranscriptEl || !lineEl) return false;
    const cr = voiceTranscriptEl.getBoundingClientRect();
    const lr = lineEl.getBoundingClientRect();
    const margin = 4;
    let delta = 0;
    if (lr.bottom > cr.bottom - margin) {
      delta = lr.bottom - cr.bottom + margin;
    } else if (lr.top < cr.top + margin) {
      delta = -(cr.top - lr.top + margin);
    }
    if (delta === 0) return false;
    voiceTranscriptEl.scrollTop += delta;
    await wait(360);
    return true;
  }

  async function voiceCycle() {
    if (!voiceCard) return;
    rotateCall();
    if (voiceTranscriptEl) {
      voiceTranscriptEl.innerHTML = '';
      voiceTranscriptEl.scrollTop = 0;
    }
    setWaveform('idle');
    await wait(600);

    const lineEls: HTMLElement[] = [];
    for (let i = 0; i < currentCall.lines.length; i++) {
      const line = currentCall.lines[i];
      const { li, txt } = makeTranscriptLine(line);
      if (voiceTranscriptEl) voiceTranscriptEl.appendChild(li);
      lineEls.push(li);
      void li.offsetHeight;
      li.classList.add('is-in');
      await wait(220);
      await scrollLineIntoView(li);
      const txtPt = pointOf(txt, 0, 0.5);
      await gamma.moveTo(txtPt.x + 6, txtPt.y);
      await wait(140);
      setWaveform('active');
      await gamma.typeInto(txt, line.text, { speedMult: 0.42 });
      setWaveform('idle');
      await wait(220);
    }

    await wait(600);

    for (const cap of currentCall.captures) {
      const lineEl = lineEls[cap.lineIdx];
      if (!lineEl) continue;
      await scrollLineIntoView(lineEl);
      const lp = pointOf(lineEl, 0.5, 0.5);
      await gamma.moveTo(lp.x, lp.y);
      await wait(220);
      lineEl.classList.add('is-active');
      await wait(360);
      const ghost = spawnGhostFromLine(lineEl, cap.text);
      const railRect = voiceRailEl ? voiceRailEl.getBoundingClientRect() : null;
      const stageRect = stage ? stage.getBoundingClientRect() : null;
      let railX = lp.x, railY = lp.y + 40;
      if (railRect && stageRect) {
        railX = railRect.left - stageRect.left + 28;
        railY = railRect.top - stageRect.top + Math.min(railRect.height - 8, 12 + (voiceRailEl ? voiceRailEl.children.length : 0) * 12);
      }
      if (ghost) {
        ghost.style.transition = 'transform 460ms cubic-bezier(0.22, 1, 0.36, 1), opacity 280ms ease';
        ghost.style.transform = `translate(${railX - 24}px, ${railY - 4}px) scale(0.9)`;
      }
      await gamma.moveTo(railX, railY);
      if (ghost) {
        ghost.style.opacity = '0';
        window.setTimeout(() => ghost.remove(), 300);
      }
      addRailItem(cap.text);
      lineEl.classList.remove('is-active');
      lineEl.classList.add('is-pulled');
      addToDone({
        agent: 'gamma',
        action: 'Captured',
        subject: currentCall.subject + ' — ' + cap.text,
        x: gamma.x,
        y: gamma.y,
      });
      await wait(680);
    }

    await wait(1400);
  }

  // ── CRM Contact ───────────────────────────────────────────────────────
  const crmCard = stage.querySelector<HTMLElement>('.ws-crm');
  const crmMarkEl = crmCard ? crmCard.querySelector<HTMLElement>('.ws-card-mark') : null;
  const crmMetaEl = crmCard ? crmCard.querySelector<HTMLElement>('.ws-card-meta') : null;
  const crmHeaderLines = crmCard ? crmCard.querySelectorAll<HTMLElement>('.ws-crm-header .ws-crm-line') : ([] as any as NodeListOf<HTMLElement>);
  const crmFieldEls: Record<string, HTMLElement | null> = {
    status: crmCard ? crmCard.querySelector('.ws-crm-field[data-field="status"]') : null,
    owner:  crmCard ? crmCard.querySelector('.ws-crm-field[data-field="owner"]') : null,
    next:   crmCard ? crmCard.querySelector('.ws-crm-field[data-field="next"]') : null,
  };
  const crmStatusDropdown = crmCard ? crmCard.querySelector<HTMLElement>('.ws-crm-field[data-field="status"] .ws-crm-dropdown') : null;
  const crmActivityEl = crmCard ? crmCard.querySelector<HTMLElement>('.ws-crm-activity') : null;
  const MAX_CRM_EVENTS = 3;

  const CRM_POOL = [
    {
      name: 'Maria Chen',
      meta: 'Hartford · contact',
      contact: 'maria@hartford-ins.com · 555-0192',
      company: 'Hartford Insurance',
      initial: { status: 'Active', owner: 'Reyn', next: '2026-09-18' },
      seedActivity: [
        { time: 'Yest',  text: 'Q3 renewal sent' },
        { time: 'Aug 9', text: 'conflict cleared' },
      ],
      edits: [
        { field: 'status', mode: 'dropdown', options: ['Active', 'Renewal in progress', 'On hold', 'Closed'], targetIdx: 1, activity: 'status → Renewal', newValue: '' },
        { field: 'next',   mode: 'type', newValue: '2026-09-18', activity: 'Next renewal logged', options: [], targetIdx: 0 },
      ],
      subject: 'Maria Chen',
    },
    {
      name: 'Davis & Co',
      meta: 'estate · contact',
      contact: 'park@davis-co.com · 555-0741',
      company: 'Davis Estate Holdings',
      initial: { status: 'Onboarding', owner: 'Liu', next: '2026-12-31' },
      seedActivity: [
        { time: 'Mon',   text: 'kickoff scheduled' },
        { time: 'Aug 12', text: 'retainer received' },
      ],
      edits: [
        { field: 'status', mode: 'dropdown', options: ['Onboarding', 'Active', 'On hold', 'Closed'], targetIdx: 1, activity: 'status → Active', newValue: '' },
        { field: 'owner',  mode: 'type', newValue: 'Reyn', activity: 'owner reassigned', options: [], targetIdx: 0 },
      ],
      subject: 'Davis estate',
    },
    {
      name: 'Park v. Carrier',
      meta: 'opposing · case',
      contact: 'park-counsel@firm.com · n/a',
      company: 'Park Litigation Group',
      initial: { status: 'Active', owner: 'Reyn', next: '2026-08-22' },
      seedActivity: [
        { time: 'Yest', text: 'depo prep done' },
        { time: 'Aug 8', text: 'subpoena filed' },
      ],
      edits: [
        { field: 'status', mode: 'dropdown', options: ['Active', 'Discovery filed', 'On hold', 'Settled'], targetIdx: 1, activity: 'status → Discovery filed', newValue: '' },
        { field: 'next',   mode: 'type', newValue: '2026-08-22', activity: 'depo date locked', options: [], targetIdx: 0 },
      ],
      subject: 'Park matter',
    },
    {
      name: 'Wells team',
      meta: 'internal · matter',
      contact: 'wells@gridex.dev · 555-0118',
      company: 'Wells Subpoena Response',
      initial: { status: 'In review', owner: 'Liu', next: '2026-05-29' },
      seedActivity: [
        { time: '2:14 PM', text: 'privilege log queued' },
        { time: 'Yest',    text: 'matter intake opened' },
      ],
      edits: [
        { field: 'status', mode: 'dropdown', options: ['In review', 'Production ready', 'Filed', 'Closed'], targetIdx: 1, activity: 'status → Production ready', newValue: '' },
        { field: 'next',   mode: 'type', newValue: '2026-05-29', activity: '14-day clock locked', options: [], targetIdx: 0 },
      ],
      subject: 'Wells matter',
    },
  ];
  let crmIdx = 0;
  let currentContact = CRM_POOL[0];

  function rotateContact() {
    const c = CRM_POOL[crmIdx % CRM_POOL.length];
    crmIdx++;
    currentContact = c;
    if (crmMarkEl) crmMarkEl.textContent = c.name;
    if (crmMetaEl) crmMetaEl.textContent = c.meta;
    if (crmHeaderLines[0]) crmHeaderLines[0].textContent = c.contact;
    if (crmHeaderLines[1]) crmHeaderLines[1].textContent = c.company;
    for (const fname of ['status', 'owner', 'next'] as const) {
      const fel = crmFieldEls[fname];
      if (!fel) continue;
      fel.classList.remove('is-editing');
      const v = fel.querySelector<HTMLElement>('.ws-crm-value');
      if (v) v.textContent = (c.initial as any)[fname];
    }
    if (crmStatusDropdown) {
      crmStatusDropdown.classList.remove('is-open');
      const items = crmStatusDropdown.querySelectorAll('li');
      items.forEach((it) => it.classList.remove('is-highlighted'));
      crmStatusDropdown.innerHTML = '';
      c.edits.filter((e) => e.field === 'status').forEach((edit) => {
        edit.options.forEach((opt) => {
          const li = document.createElement('li');
          li.textContent = opt;
          crmStatusDropdown.appendChild(li);
        });
      });
    }
    if (crmActivityEl) {
      crmActivityEl.innerHTML = '';
      c.seedActivity.forEach((ev) => {
        const li = makeCrmEvent(ev.time, ev.text);
        li.classList.add('is-in');
        crmActivityEl.appendChild(li);
      });
    }
  }

  function makeCrmEvent(time: string, text: string) {
    const li = document.createElement('li');
    li.className = 'ws-crm-event';
    const t = document.createElement('span');
    t.className = 'ws-crm-event-time';
    t.textContent = time;
    const x = document.createElement('span');
    x.className = 'ws-crm-event-text';
    x.textContent = text;
    li.appendChild(t);
    li.appendChild(x);
    return li;
  }

  function prependCrmEvent(time: string, text: string) {
    if (!crmActivityEl) return;
    const li = makeCrmEvent(time, text);
    crmActivityEl.insertBefore(li, crmActivityEl.firstChild);
    void li.offsetHeight;
    li.classList.add('is-in', 'is-fresh');
    window.setTimeout(() => li.classList.remove('is-fresh'), 620);
    const live = Array.from(crmActivityEl.children).filter((c) => !c.classList.contains('is-leaving'));
    let toTrim = live.length - MAX_CRM_EVENTS;
    for (let i = live.length - 1; i >= 0 && toTrim > 0; i--, toTrim--) {
      const victim = live[i] as HTMLElement;
      victim.classList.add('is-leaving');
      window.setTimeout(() => { if (victim.parentNode) victim.parentNode.removeChild(victim); }, 320);
    }
  }

  async function crmCycle() {
    if (!crmCard) return;
    rotateContact();
    await wait(900);

    for (const edit of currentContact.edits) {
      const field = crmFieldEls[edit.field];
      if (!field) continue;
      const valueEl = field.querySelector<HTMLElement>('.ws-crm-value');
      if (!valueEl) continue;
      const vp = pointOf(valueEl, 0.5, 0.5);
      await gamma.moveTo(vp.x, vp.y);
      await wait(220);
      field.classList.add('is-editing');
      await wait(200);

      if (edit.mode === 'dropdown' && edit.field === 'status' && crmStatusDropdown) {
        crmStatusDropdown.classList.add('is-open');
        await wait(280);
        const items = crmStatusDropdown.querySelectorAll<HTMLElement>('li');
        for (let i = 0; i < items.length; i++) {
          const it = items[i];
          items.forEach((other, k) => other.classList.toggle('is-highlighted', k === i));
          const ip = pointOf(it, 0.5, 0.5);
          await gamma.moveTo(ip.x, ip.y);
          await wait(i === edit.targetIdx ? 360 : 180);
          if (i === edit.targetIdx) break;
        }
        gamma.click();
        await wait(200);
        valueEl.textContent = items[edit.targetIdx].textContent;
        crmStatusDropdown.classList.remove('is-open');
        items.forEach((it) => it.classList.remove('is-highlighted'));
        await wait(280);
      } else if (edit.mode === 'type') {
        gamma.click();
        await wait(180);
        valueEl.textContent = '';
        await gamma.typeInto(valueEl, edit.newValue, { speedMult: 0.5 });
        await wait(200);
      }

      field.classList.remove('is-editing');
      prependCrmEvent('just now', edit.activity);
      addToDone({
        agent: 'gamma',
        action: 'Updated',
        subject: currentContact.subject + ' · ' + edit.activity,
        x: gamma.x,
        y: gamma.y,
      });
      await wait(560);
    }

    await wait(1600);
  }

  // ── Loop Gamma: 2-way swap between Voice and CRM ─────────────────────
  async function loopGamma() {
    if (crmCard) crmCard.style.display = 'none';
    const variants = [
      { card: voiceCard, cycle: voiceCycle },
      { card: crmCard,   cycle: crmCycle  },
    ];
    let slotIdx = 0;
    let firstIteration = true;
    let carryDir = null as any;
    while (true) {
      if (!alive) return;
      await heroGate();
      const v = variants[slotIdx];
      if (!v.card) { slotIdx = (slotIdx + 1) % variants.length; continue; }
      if (!firstIteration) {
        await escortIn(gamma, v.card, 'right');
      }
      firstIteration = false;
      await v.cycle();
      await closeCard(gamma, v.card);
      await exitRight(gamma);
      const nextIdx = (slotIdx + 1) % variants.length;
      slotIdx = nextIdx;
    }
  }

  loopAlpha();
  loopBeta();
  loopGamma();
  inboxLoop();

  // ── Teardown ──────────────────────────────────────────────────────────
  return function teardown() {
    alive = false;
    trackedTimeouts.forEach((id) => clearTimeout(id));
    trackedTimeouts.clear();
    if (trackedWaveformInterval !== null) {
      clearInterval(trackedWaveformInterval);
      trackedWaveformInterval = null;
    }
    if (heroIO) {
      heroIO.disconnect();
      heroIO = null;
    }
  };
}
