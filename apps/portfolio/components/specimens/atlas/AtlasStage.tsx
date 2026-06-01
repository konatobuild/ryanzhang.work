"use client";

import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import Image from "next/image";
import "./atlas.css";

/*
 * AtlasStage — the interactive heart of the "tidying is spatial" specimen.
 *
 * One world canvas, panned/zoomed with the pointer. A single rAF loop lerps a
 * `view` transform toward a `target`, writes the transform + an `--s` scale
 * custom property onto the world node, and lets CSS clamp() cross-fade the
 * three representations (terrain blob → tray → file cards). React only re-renders
 * on coarse events (layer crossing, pick-up, drop), never per frame.
 *
 * The move that a folder tree can't do: pick a file up, zoom OUT while still
 * holding it (it rides the cursor in screen space), then drop it into a zone you
 * can now see — origin and destination on screen at once.
 */

const MIN_S = 0.34;
const MAX_S = 4.2;
const FILE_W = 132;
const FILE_H = 158;
const GAP = 20;
const PAD = 20;
const HEAD = 48;

type FileKind = "image" | "pdf" | "doc" | "zip";

interface FileItem {
  id: string;
  name: string;
  kind: FileKind;
  sizeMB: number;
  ageMonths: number;
  dup: boolean;
  zone: string;
}

// A zone's geometry is DERIVED, never authored — it always re-flows to fit the
// files currently inside it (see computeLayout). The static part is only its
// identity and where it sits in the column grid.
interface ZoneDef {
  id: string;
  name: string;
  cols: number;
  col: number; // which column it stacks in (staging spans all → -1)
  order: number; // vertical order within that column
  staging?: boolean;
}

// Resolved geometry produced by computeLayout each time files change.
interface Zone {
  id: string;
  name: string;
  x: number;
  y: number;
  cols: number;
  w: number;
  h: number;
  staging?: boolean;
}

// Zone box sizes are computed from the live row count so a zone is always snug
// around its contents — never a vast empty frame, never a cramped one that
// overlaps cards. (cols, rows) → px:
const zw = (cols: number) => cols * FILE_W + (cols - 1) * GAP + PAD * 2;
const zh = (rows: number) => HEAD + rows * FILE_H + (rows - 1) * GAP + PAD;

// Column grid: three stacking columns + a full-width staging strip beneath.
const COL_X = [48, 560, 1076];
const TOP = 48;
const VGAP = 32; // vertical gap between stacked zones in a column
const LOOSE_X = 48;
const LOOSE_W = 1504;
const WORLD_MIN_W = 1600;

const ZONE_DEFS: ZoneDef[] = [
  { id: "downloads", name: "Downloads", cols: 3, col: 0, order: 0 },
  { id: "screenshots", name: "Screenshots", cols: 3, col: 1, order: 0 },
  { id: "invoices", name: "Invoices", cols: 2, col: 1, order: 1 },
  { id: "projects", name: "Projects", cols: 3, col: 2, order: 0 },
  { id: "archive", name: "Archive 2019", cols: 3, col: 2, order: 1 },
  { id: "loose", name: "Loose pile — drop here", cols: 8, col: -1, order: 0, staging: true },
];

// Deterministic file set (no Math.random — keeps SSR/StrictMode stable).
const RAW: FileItem[] = [
  // Downloads — the mess: mixed kinds, some dup screenshots leaked in, big zips
  { id: "f1", name: "invoice-acme-q3.pdf", kind: "pdf", sizeMB: 0.4, ageMonths: 2, dup: false, zone: "downloads" },
  { id: "f2", name: "Screenshot 2026-04-12.png", kind: "image", sizeMB: 3.1, ageMonths: 1, dup: true, zone: "downloads" },
  { id: "f3", name: "Screenshot 2026-04-12 (1).png", kind: "image", sizeMB: 3.1, ageMonths: 1, dup: true, zone: "downloads" },
  { id: "f4", name: "design-assets-final.zip", kind: "zip", sizeMB: 248, ageMonths: 3, dup: false, zone: "downloads" },
  { id: "f5", name: "design-assets-final-v2.zip", kind: "zip", sizeMB: 251, ageMonths: 2, dup: true, zone: "downloads" },
  { id: "f6", name: "contract-draft.docx", kind: "doc", sizeMB: 0.2, ageMonths: 4, dup: false, zone: "downloads" },
  { id: "f7", name: "receipt-uber.pdf", kind: "pdf", sizeMB: 0.1, ageMonths: 2, dup: false, zone: "downloads" },
  { id: "f8", name: "IMG_4821.jpg", kind: "image", sizeMB: 4.6, ageMonths: 5, dup: false, zone: "downloads" },
  { id: "f9", name: "statement-mar.pdf", kind: "pdf", sizeMB: 0.3, ageMonths: 2, dup: false, zone: "downloads" },
  // Screenshots
  { id: "f10", name: "Screenshot 2026-03-02.png", kind: "image", sizeMB: 2.8, ageMonths: 3, dup: false, zone: "screenshots" },
  { id: "f11", name: "Screenshot 2026-02-19.png", kind: "image", sizeMB: 2.5, ageMonths: 4, dup: false, zone: "screenshots" },
  { id: "f12", name: "Screenshot 2026-01-30.png", kind: "image", sizeMB: 2.9, ageMonths: 4, dup: false, zone: "screenshots" },
  // Invoices
  { id: "f13", name: "invoice-northwind.pdf", kind: "pdf", sizeMB: 0.5, ageMonths: 1, dup: false, zone: "invoices" },
  { id: "f14", name: "invoice-lattice.pdf", kind: "pdf", sizeMB: 0.4, ageMonths: 2, dup: false, zone: "invoices" },
  // Projects
  { id: "f15", name: "atlas-spec.docx", kind: "doc", sizeMB: 0.6, ageMonths: 1, dup: false, zone: "projects" },
  { id: "f16", name: "moodboard.jpg", kind: "image", sizeMB: 6.2, ageMonths: 1, dup: false, zone: "projects" },
  { id: "f17", name: "build.zip", kind: "zip", sizeMB: 92, ageMonths: 2, dup: false, zone: "projects" },
  // Archive — old, stale, grey
  { id: "f18", name: "taxes-2019.pdf", kind: "pdf", sizeMB: 1.2, ageMonths: 70, dup: false, zone: "archive" },
  { id: "f19", name: "old-site-backup.zip", kind: "zip", sizeMB: 410, ageMonths: 66, dup: false, zone: "archive" },
  { id: "f20", name: "resume-2019.docx", kind: "doc", sizeMB: 0.1, ageMonths: 72, dup: false, zone: "archive" },
];

interface LayoutResult {
  zones: Zone[];
  pos: Record<string, { wx: number; wy: number }>;
  worldW: number;
  worldH: number;
}

// The whole layout is a pure function of which files sit in which zone. Every
// drop just re-runs this: zones grow to fit their row count, lower zones in the
// same column are pushed down, and files re-tile into a clean grid. No file is
// ever placed at an arbitrary point, so cards can never overlap (and therefore
// hover never thrashes). "Dropping" and "tidying" become the same gesture.
function computeLayout(files: FileItem[]): LayoutResult {
  // group files by zone, preserving array order (drop pushes to the end)
  const byZone: Record<string, FileItem[]> = {};
  for (const f of files) (byZone[f.zone] ??= []).push(f);

  const geo: Record<string, Zone> = {};
  const colBottom = [TOP, TOP, TOP];

  // stack the column zones top-to-bottom; each one's height follows its content
  for (const d of ZONE_DEFS) {
    if (d.staging) continue;
    const count = byZone[d.id]?.length ?? 0;
    const rows = Math.max(1, Math.ceil(count / d.cols));
    const w = zw(d.cols);
    const h = zh(rows);
    const x = COL_X[d.col];
    const y = colBottom[d.col];
    geo[d.id] = { id: d.id, name: d.name, x, y, cols: d.cols, w, h };
    colBottom[d.col] = y + h + VGAP;
  }

  // the staging strip spans full width, parked just below the tallest column
  const looseDef = ZONE_DEFS.find((d) => d.staging)!;
  const looseTop = Math.max(...colBottom);
  const looseCount = byZone[looseDef.id]?.length ?? 0;
  const looseH = zh(Math.max(1, Math.ceil(looseCount / looseDef.cols)));
  geo[looseDef.id] = {
    id: looseDef.id,
    name: looseDef.name,
    x: LOOSE_X,
    y: looseTop,
    cols: looseDef.cols,
    w: LOOSE_W,
    h: looseH,
    staging: true,
  };

  // tile each zone's files into its grid, snug under the header
  const pos: Record<string, { wx: number; wy: number }> = {};
  for (const id in byZone) {
    const z = geo[id];
    if (!z) continue;
    byZone[id].forEach((f, i) => {
      const col = i % z.cols;
      const row = Math.floor(i / z.cols);
      pos[f.id] = {
        wx: z.x + PAD + col * (FILE_W + GAP),
        wy: z.y + HEAD + row * (FILE_H + GAP),
      };
    });
  }

  // render in stable ZONE_DEFS order so React keys never reshuffle
  const zones = ZONE_DEFS.map((d) => geo[d.id]);
  const worldW = Math.max(WORLD_MIN_W, LOOSE_X + LOOSE_W + 48);
  const worldH = looseTop + looseH + 48;
  return { zones, pos, worldW, worldH };
}

// Fresh copy of the seed set — used for initial state and "reset desk".
const seed = (): FileItem[] => RAW.map((f) => ({ ...f }));

const clamp = (v: number, lo: number, hi: number) =>
  Math.min(hi, Math.max(lo, v));

interface ViewT {
  s: number;
  tx: number;
  ty: number;
}

export default function AtlasStage() {
  const stageRef = useRef<HTMLDivElement>(null);
  const worldRef = useRef<HTMLDivElement>(null);
  const heldRef = useRef<HTMLDivElement>(null);

  const [files, setFiles] = useState<FileItem[]>(seed);
  const [layer, setLayer] = useState<"atlas" | "zone" | "files">("atlas");
  const [heldId, setHeldId] = useState<string | null>(null);
  const [dropZone, setDropZone] = useState<string | null>(null);
  const [didMove, setDidMove] = useState(false);
  const [panning, setPanning] = useState(false);

  // Geometry is fully derived from `files`; re-run on every move/drop.
  const { zones, pos, worldW, worldH } = useMemo(
    () => computeLayout(files),
    [files],
  );
  // Pointer handlers run outside render and need the live geometry for hit
  // testing + fit bounds, so mirror it into refs after each layout change.
  const zonesRef = useRef(zones);
  const worldSize = useRef({ w: worldW, h: worldH });
  useEffect(() => {
    zonesRef.current = zones;
    worldSize.current = { w: worldW, h: worldH };
  }, [zones, worldW, worldH]);

  const view = useRef<ViewT>({ s: 0.5, tx: 0, ty: 0 });
  const target = useRef<ViewT>({ s: 0.5, tx: 0, ty: 0 });
  const raf = useRef<number | null>(null);

  // pointer interaction state (mutable, no re-render)
  const mode = useRef<"idle" | "pan" | "hold" | "press">("idle");
  const pressFile = useRef<FileItem | null>(null);
  const last = useRef({ x: 0, y: 0 });
  const pressStart = useRef({ x: 0, y: 0 });
  const heldFile = useRef<FileItem | null>(null);
  const ptr = useRef({ x: 0, y: 0 });

  // ── coordinate helpers ────────────────────────────────────────────────
  const screenToWorld = useCallback((sx: number, sy: number) => {
    const v = view.current;
    return { wx: (sx - v.tx) / v.s, wy: (sy - v.ty) / v.s };
  }, []);

  const fitView = useCallback(() => {
    const el = stageRef.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const { w: wW, h: wH } = worldSize.current;
    const pad = 28;
    const s = clamp(
      Math.min((r.width - pad * 2) / wW, (r.height - pad * 2) / wH),
      MIN_S,
      MAX_S,
    );
    const tx = (r.width - wW * s) / 2;
    const ty = (r.height - wH * s) / 2;
    target.current = { s, tx, ty };
    view.current = { s, tx, ty };
  }, []);

  // ── the single render loop ────────────────────────────────────────────
  useEffect(() => {
    fitView();
    let lastLayer: typeof layer = "atlas";

    const tick = () => {
      const v = view.current;
      const t = target.current;
      // lerp toward target (zoom glides; pan is applied 1:1 below so it snaps)
      v.s += (t.s - v.s) * 0.2;
      v.tx += (t.tx - v.tx) * 0.2;
      v.ty += (t.ty - v.ty) * 0.2;
      if (Math.abs(t.s - v.s) < 0.0005) v.s = t.s;

      const w = worldRef.current;
      if (w) {
        w.style.transform = `translate3d(${v.tx}px, ${v.ty}px, 0) scale(${v.s})`;
        w.style.setProperty("--s", String(v.s));
      }

      // reposition held file in screen space (rides the cursor)
      if (heldFile.current && heldRef.current) {
        const hs = clamp(v.s, 0.5, 1.15); // keep it grabbable when zoomed out
        heldRef.current.style.transform = `translate(${ptr.current.x}px, ${ptr.current.y}px) translate(-50%, -50%) scale(${hs})`;
      }

      const nextLayer = v.s < 0.7 ? "atlas" : v.s < 1.02 ? "zone" : "files";
      if (nextLayer !== lastLayer) {
        lastLayer = nextLayer;
        setLayer(nextLayer);
      }

      raf.current = requestAnimationFrame(tick);
    };
    raf.current = requestAnimationFrame(tick);

    const onResize = () => fitView();
    window.addEventListener("resize", onResize);
    return () => {
      if (raf.current) cancelAnimationFrame(raf.current);
      window.removeEventListener("resize", onResize);
    };
  }, [fitView]);

  // ── zoom toward a stage-local point, keeping that world point fixed ────
  const zoomAt = useCallback((cx: number, cy: number, factor: number) => {
    const t = target.current;
    const ns = clamp(t.s * factor, MIN_S, MAX_S);
    const wx = (cx - t.tx) / t.s;
    const wy = (cy - t.ty) / t.s;
    t.s = ns;
    t.tx = cx - wx * ns;
    t.ty = cy - wy * ns;
  }, []);

  // ── wheel + trackpad pinch + Safari gestures ──────────────────────────
  // Native non-passive listeners so preventDefault() actually stops the
  // browser's own page-zoom. React's onWheel is passive, so a trackpad
  // pinch (a wheel event with ctrlKey=true) would otherwise zoom the page.
  useEffect(() => {
    const el = stageRef.current;
    if (!el) return;

    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      const r = el.getBoundingClientRect();
      const cx = e.clientX - r.left;
      const cy = e.clientY - r.top;
      // ctrlKey ⇒ trackpad pinch (deltas are tiny) — amplify so it feels 1:1.
      const k = e.ctrlKey ? 0.01 : 0.0014;
      zoomAt(cx, cy, Math.exp(-e.deltaY * k));
    };

    // Safari fires its own gesture events instead of ctrl+wheel.
    let gestureScale = 1;
    let gx = 0;
    let gy = 0;
    const onGestureStart = (e: Event) => {
      e.preventDefault();
      const ge = e as Event & { scale: number; clientX: number; clientY: number };
      gestureScale = ge.scale ?? 1;
      const r = el.getBoundingClientRect();
      gx = (ge.clientX ?? r.width / 2 + r.left) - r.left;
      gy = (ge.clientY ?? r.height / 2 + r.top) - r.top;
    };
    const onGestureChange = (e: Event) => {
      e.preventDefault();
      const ge = e as Event & { scale: number };
      const next = ge.scale ?? gestureScale;
      zoomAt(gx, gy, next / gestureScale);
      gestureScale = next;
    };

    el.addEventListener("wheel", onWheel, { passive: false });
    el.addEventListener("gesturestart", onGestureStart as EventListener);
    el.addEventListener("gesturechange", onGestureChange as EventListener);
    el.addEventListener("gestureend", (e) => e.preventDefault());
    return () => {
      el.removeEventListener("wheel", onWheel);
      el.removeEventListener("gesturestart", onGestureStart as EventListener);
      el.removeEventListener("gesturechange", onGestureChange as EventListener);
    };
  }, [zoomAt]);

  // ── pointer down ──────────────────────────────────────────────────────
  const onPointerDown = useCallback(
    (e: React.PointerEvent) => {
      const el = stageRef.current;
      if (!el) return;
      el.setPointerCapture(e.pointerId);
      const r = el.getBoundingClientRect();
      const sx = e.clientX - r.left;
      const sy = e.clientY - r.top;
      last.current = { x: sx, y: sy };
      pressStart.current = { x: sx, y: sy };
      ptr.current = { x: sx, y: sy };

      const fileEl = (e.target as HTMLElement).closest<HTMLElement>(
        ".atlas-file",
      );
      if (fileEl && layer !== "atlas") {
        const f = files.find((ff) => ff.id === fileEl.dataset.id);
        if (f) {
          pressFile.current = f;
          mode.current = "press"; // upgrade to "hold" once it actually moves
          return;
        }
      }
      mode.current = "pan";
      setPanning(true);
    },
    [files, layer],
  );

  // ── pointer move ──────────────────────────────────────────────────────
  const onPointerMove = useCallback(
    (e: React.PointerEvent) => {
      const el = stageRef.current;
      if (!el || mode.current === "idle") return;
      const r = el.getBoundingClientRect();
      const sx = e.clientX - r.left;
      const sy = e.clientY - r.top;
      const dx = sx - last.current.x;
      const dy = sy - last.current.y;
      last.current = { x: sx, y: sy };
      ptr.current = { x: sx, y: sy };

      if (mode.current === "pan") {
        target.current.tx += dx;
        target.current.ty += dy;
        view.current.tx += dx;
        view.current.ty += dy;
        if (!didMove && Math.hypot(sx - pressStart.current.x, sy - pressStart.current.y) > 24)
          setDidMove(true);
        return;
      }

      if (mode.current === "press") {
        const moved = Math.hypot(
          sx - pressStart.current.x,
          sy - pressStart.current.y,
        );
        if (moved > 5 && pressFile.current) {
          heldFile.current = pressFile.current;
          setHeldId(pressFile.current.id);
          mode.current = "hold";
        }
      }

      if (mode.current === "hold") {
        const { wx, wy } = screenToWorld(sx, sy);
        const hz = zonesRef.current.find(
          (z) => wx >= z.x && wx <= z.x + z.w && wy >= z.y && wy <= z.y + z.h,
        );
        setDropZone((cur) => (cur === (hz?.id ?? null) ? cur : hz?.id ?? null));
      }
    },
    [didMove, screenToWorld],
  );

  // ── pointer up ────────────────────────────────────────────────────────
  const onPointerUp = useCallback(
    (e: React.PointerEvent) => {
      const el = stageRef.current;
      if (el?.hasPointerCapture(e.pointerId))
        el.releasePointerCapture(e.pointerId);

      if (mode.current === "hold" && heldFile.current) {
        const r = el!.getBoundingClientRect();
        const sx = e.clientX - r.left;
        const sy = e.clientY - r.top;
        const { wx, wy } = screenToWorld(sx, sy);
        const z = zonesRef.current.find(
          (zz) =>
            wx >= zz.x && wx <= zz.x + zz.w && wy >= zz.y && wy <= zz.y + zz.h,
        );
        const dropped = heldFile.current;
        // A drop into a *different* zone re-flows: the file is appended to the
        // destination (moved to the end of the list so it tiles last) and the
        // whole layout re-runs. computeLayout grows the zone + pushes lower
        // zones down, so cards snap into a clean grid — never overlap.
        if (z && z.id !== dropped.zone) {
          setFiles((prev) => {
            const moved = prev.find((f) => f.id === dropped.id);
            if (!moved) return prev;
            return [
              ...prev.filter((f) => f.id !== dropped.id),
              { ...moved, zone: z.id },
            ];
          });
          setDidMove(true);
        }
      }

      mode.current = "idle";
      pressFile.current = null;
      heldFile.current = null;
      setHeldId(null);
      setDropZone(null);
      setPanning(false);
    },
    [screenToWorld],
  );

  const onReset = useCallback(() => {
    setFiles(seed());
    setDidMove(false);
    fitView();
  }, [fitView]);

  // ── derived per-zone diagnostics (for the distant terrain) ────────────
  const zoneStats = useMemo(() => {
    const m: Record<
      string,
      { count: number; size: number; avgAge: number; dups: number }
    > = {};
    for (const z of ZONE_DEFS) m[z.id] = { count: 0, size: 0, avgAge: 0, dups: 0 };
    for (const f of files) {
      const s = m[f.zone];
      if (!s) continue;
      s.count += 1;
      s.size += f.sizeMB;
      s.avgAge += f.ageMonths;
      if (f.dup) s.dups += 1;
    }
    for (const id in m) if (m[id].count) m[id].avgAge /= m[id].count;
    return m;
  }, [files]);

  const held = heldId ? files.find((f) => f.id === heldId) ?? null : null;

  return (
    <div
      ref={stageRef}
      className="atlas-stage"
      data-layer={layer}
      data-holding={heldId ? "true" : "false"}
      data-panning={panning ? "true" : "false"}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onPointerCancel={onPointerUp}
    >
      <div
        ref={worldRef}
        className="atlas-world"
        style={{ width: worldW, height: worldH }}
      >
        {zones.map((z) => {
          const st = zoneStats[z.id];
          const stale = st.count > 0 && st.avgAge > 24;
          const big = st.size > 200;
          return (
            <div
              key={z.id}
              className="atlas-zone"
              data-drop={dropZone === z.id ? "true" : "false"}
              style={{ left: z.x, top: z.y, width: z.w, height: z.h }}
            >
              {/* distant terrain */}
              {!z.staging && (
                <div
                  className="atlas-blob"
                  data-stale={stale ? "true" : "false"}
                  data-hot={big ? "true" : "false"}
                  data-dup={st.dups > 1 ? "true" : "false"}
                >
                  <span className="atlas-dup-glow" aria-hidden="true" />
                  <div className="atlas-blob-label">
                    <span className="atlas-blob-name">{z.name}</span>
                    <span className="atlas-blob-meta">
                      {st.count} items · {formatSize(st.size)}
                      {stale ? " · untouched" : ""}
                    </span>
                  </div>
                </div>
              )}

              {/* mid-distance tray */}
              <div className="atlas-tray">
                <div className="atlas-tray-head">
                  <span className="atlas-tray-name">{z.name}</span>
                  <span className="atlas-tray-count">{st.count}</span>
                </div>
                <div className="atlas-tray-flags">
                  {st.dups > 1 && (
                    <span className="atlas-flag atlas-flag--dup">
                      {st.dups} dupes
                    </span>
                  )}
                  {big && (
                    <span className="atlas-flag atlas-flag--big">
                      {formatSize(st.size)}
                    </span>
                  )}
                  {stale && (
                    <span className="atlas-flag atlas-flag--stale">stale</span>
                  )}
                </div>
              </div>
            </div>
          );
        })}

        {/* file cards live in world space, above the trays. Position comes from
            the layout engine (pos), so a drop re-tiles them into a clean grid —
            they glide to their slot (transitioned in CSS) rather than overlap. */}
        {files.map((f) => (
          <FileCard
            key={f.id}
            file={f}
            held={f.id === heldId}
            wx={pos[f.id]?.wx ?? 0}
            wy={pos[f.id]?.wy ?? 0}
          />
        ))}
      </div>

      {/* the file riding the cursor (screen space) */}
      {held && (
        <div ref={heldRef} className="atlas-held">
          <FileCard file={held} held={false} ghost />
        </div>
      )}

      <div className="atlas-hud">
        <span
          className="atlas-hud-step"
          data-active={layer === "atlas" ? "true" : "false"}
        >
          1 · spot the mess
        </span>
        <span
          className="atlas-hud-step"
          data-active={layer === "zone" ? "true" : "false"}
        >
          2 · zoom in
        </span>
        <span
          className="atlas-hud-step"
          data-active={heldId ? "true" : "false"}
        >
          3 · carry &amp; drop
        </span>
      </div>
      <span className="atlas-hint">scroll to zoom · drag a file to move it</span>
      {didMove && (
        <button className="atlas-reset" onClick={onReset} type="button">
          reset desk
        </button>
      )}
    </div>
  );
}

function FileCard({
  file,
  held,
  ghost,
  wx = 0,
  wy = 0,
}: {
  file: FileItem;
  held: boolean;
  ghost?: boolean;
  wx?: number;
  wy?: number;
}) {
  return (
    <div
      className="atlas-file"
      data-id={file.id}
      data-held={held ? "true" : "false"}
      data-dup={file.dup ? "true" : "false"}
      data-stale={file.ageMonths > 24 ? "true" : "false"}
      style={
        ghost
          ? { position: "relative", left: 0, top: 0, opacity: 1 }
          : { left: wx, top: wy }
      }
    >
      {/* the real preview IS the thumbnail — present from the moment the card
          appears; zooming just enlarges it until the text is legible. */}
      <div className="atlas-file-content" aria-hidden="true">
        <FileContent file={file} />
        {file.dup && <span className="atlas-thumb-dup" />}
      </div>

      {/* filename label — shown at card scale, fades out as you push in to
          read so the deepest view is clean full-bleed content. */}
      <div className="atlas-file-foot">
        <div className="atlas-file-name">{file.name}</div>
        <div className="atlas-file-meta">
          <span>{file.kind.toUpperCase()}</span>
          <span>{formatSize(file.sizeMB)}</span>
        </div>
      </div>

      {/* glass rim — material framing only, never covers the preview. */}
      <div className="atlas-file-frame" />
    </div>
  );
}

/* The "read" layer: each kind resolves to a genuinely different artifact —
   pdf → a billed page, doc → body text, image → a full-bleed frame, zip → its
   manifest. Recognizable beats complete; this only ever shows when zoomed in. */
function FileContent({ file }: { file: FileItem }) {
  if (file.kind === "image") {
    const src = IMAGE_SRC[file.id];
    return (
      <div className="atlas-doc atlas-doc--image">
        {src ? (
          <Image
            className="atlas-doc-photo"
            src={src}
            alt=""
            fill
            sizes="240px"
            draggable={false}
          />
        ) : (
          <div className="atlas-doc-photo atlas-thumb--image" />
        )}
        <div className="atlas-doc-exif">
          <span>{file.name}</span>
          <span>3024 × 4032 · {formatSize(file.sizeMB)}</span>
        </div>
      </div>
    );
  }

  if (file.kind === "zip") {
    const manifest = ZIP_MANIFEST[file.id] ?? ZIP_MANIFEST.default;
    return (
      <div className="atlas-doc atlas-doc--zip">
        <div className="atlas-doc-ziphead">
          <span>{file.name}</span>
          <span>{manifest.length} items</span>
        </div>
        <ul className="atlas-doc-manifest">
          {manifest.map((m) => (
            <li key={m.name}>
              <span className="atlas-doc-mfile">{m.name}</span>
              <span className="atlas-doc-msize">{m.size}</span>
            </li>
          ))}
        </ul>
      </div>
    );
  }

  if (file.kind === "pdf") {
    const bill = PDF_BILL[file.id] ?? PDF_BILL.default;
    return (
      <div className="atlas-doc atlas-doc--pdf">
        <div className="atlas-doc-billhead">
          <span className="atlas-doc-billmark">{bill.mark}</span>
          <span className="atlas-doc-billno">{bill.no}</span>
        </div>
        <div className="atlas-doc-billto">{bill.to}</div>
        <ul className="atlas-doc-lines">
          {bill.lines.map((l) => (
            <li key={l.label}>
              <span>{l.label}</span>
              <span>{l.amt}</span>
            </li>
          ))}
        </ul>
        <div className="atlas-doc-total">
          <span>Total</span>
          <span>{bill.total}</span>
        </div>
      </div>
    );
  }

  // doc
  const doc = DOC_BODY[file.id] ?? DOC_BODY.default;
  return (
    <div className="atlas-doc atlas-doc--text">
      <div className="atlas-doc-h1">{doc.title}</div>
      <div className="atlas-doc-byline">{doc.byline}</div>
      {doc.paras.map((p, i) => (
        <p key={i} className="atlas-doc-p">
          {p}
        </p>
      ))}
    </div>
  );
}

// Real images downloaded into /public/specimens/atlas. f2 and f3 point at the
// SAME file on disk — a genuine duplicate, which is exactly what the terrain
// shimmer flags.
const IMG_BASE = "/specimens/atlas";
const IMAGE_SRC: Record<string, string> = {
  f2: `${IMG_BASE}/f2.jpg`,
  f3: `${IMG_BASE}/f3.jpg`,
  f8: `${IMG_BASE}/f8.jpg`,
  f10: `${IMG_BASE}/f10.jpg`,
  f11: `${IMG_BASE}/f11.jpg`,
  f12: `${IMG_BASE}/f12.jpg`,
  f16: `${IMG_BASE}/f16.jpg`,
};

const ZIP_MANIFEST: Record<string, { name: string; size: string }[]> = {
  default: [
    { name: "index.html", size: "12 KB" },
    { name: "styles/app.css", size: "48 KB" },
    { name: "assets/logo.svg", size: "8 KB" },
    { name: "scripts/main.js", size: "210 KB" },
    { name: "README.md", size: "3 KB" },
  ],
  f4: [
    { name: "brand/logo-lockup.svg", size: "14 KB" },
    { name: "brand/palette.ase", size: "6 KB" },
    { name: "exports/hero@2x.png", size: "184 MB" },
    { name: "exports/cover@2x.png", size: "52 MB" },
    { name: "fonts/Geist.woff2", size: "2 MB" },
  ],
  f19: [
    { name: "public_html/", size: "—" },
    { name: "wp-content/uploads/", size: "362 MB" },
    { name: "database.sql", size: "41 MB" },
    { name: "config.php", size: "4 KB" },
    { name: "robots.txt", size: "1 KB" },
  ],
};

const PDF_BILL: Record<
  string,
  {
    mark: string;
    no: string;
    to: string;
    lines: { label: string; amt: string }[];
    total: string;
  }
> = {
  default: {
    mark: "INVOICE",
    no: "#0481",
    to: "Billed to — Acme Co.",
    lines: [
      { label: "Design retainer", amt: "$3,200" },
      { label: "Front-end build", amt: "$4,800" },
      { label: "Revisions", amt: "$640" },
    ],
    total: "$8,640",
  },
  f7: {
    mark: "RECEIPT",
    no: "Uber",
    to: "Trip — Mission → SFO",
    lines: [
      { label: "Fare", amt: "$38.40" },
      { label: "Wait time", amt: "$2.10" },
      { label: "Tip", amt: "$8.00" },
    ],
    total: "$48.50",
  },
  f18: {
    mark: "1040",
    no: "TY 2019",
    to: "Dept. of the Treasury — IRS",
    lines: [
      { label: "Total income", amt: "$112,400" },
      { label: "Deductions", amt: "−$24,800" },
      { label: "Tax withheld", amt: "$19,210" },
    ],
    total: "Refund $1,840",
  },
};

const DOC_BODY: Record<
  string,
  { title: string; byline: string; paras: string[] }
> = {
  default: {
    title: "Contract — Statement of Work",
    byline: "Draft · v0.3 · confidential",
    paras: [
      "This agreement sets out the terms under which the Contractor will provide design and engineering services to the Client for the duration of the engagement.",
      "Deliverables, milestones, and acceptance criteria are defined in Schedule A. Payment is net-30 from the date of each approved milestone.",
      "Either party may terminate with fourteen days' written notice. Work product transfers to the Client upon final payment.",
    ],
  },
  f15: {
    title: "Atlas — design spec",
    byline: "Ryan Zhang · working draft",
    paras: [
      "A folder tree is built for storing, not for tidying. Atlas treats the disk as one continuous map: pull back and files become terrain, push in and they resolve into real, readable content.",
      "Zoom is the only navigation. There are no separate windows — overview and detail are the same surface seen at different distances, so you never lose your place.",
      "The deepest layer is the file itself. The glass is only the container; reaching it means you can read the document without ever opening it.",
    ],
  },
  f20: {
    title: "Résumé — 2019",
    byline: "stale · last edited 6 yrs ago",
    paras: [
      "Product designer with a focus on interaction systems, design tooling, and the seam between craft and engineering.",
      "Previously led design on internal platform tools; shipped a component system adopted across four product teams.",
      "Skills — interface design, prototyping, front-end, design systems, a little too much CSS.",
    ],
  },
};

function formatSize(mb: number): string {
  if (mb >= 1024) return `${(mb / 1024).toFixed(1)} GB`;
  if (mb >= 1) return `${Math.round(mb)} MB`;
  return `${Math.round(mb * 1000)} KB`;
}
