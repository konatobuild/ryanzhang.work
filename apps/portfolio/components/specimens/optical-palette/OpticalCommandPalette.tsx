"use client";

import { useEffect, useId, useRef, useState } from "react";

/*
 * OpticalCommandPalette — a working ⌘K palette whose selection is a glass
 * loupe.
 *
 * The list stays crisp and readable (a command palette's actual job). A
 * rounded-rect magnifier sits on the active row: inside it a scaled copy of
 * the list is magnified and refracted through a real thick-glass model, with
 * a specular rim highlight. Hover a row or arrow up/down and the loupe slides
 * to it on a spring.
 *
 * The glass is NOT hand-tuned CSS. The refraction is a direct port of the
 * kube.io / winaviation "liquid glass" technique:
 *   1. calcDisplacement1D — trace a view ray straight down through a curved
 *      glass bezel (convex-squircle height profile) and refract it with
 *      Snell's law; the lateral offset where it exits the back face, scaled by
 *      glass thickness, is the displacement at that bezel position. This 1D
 *      profile is the whole optical model.
 *   2. calcDisplacement2D — sweep the 1D profile around the rounded rect
 *      (corner arcs + straight edges), writing x-offset→R, y-offset→G. The
 *      flat interior stays neutral (128,128) so the magnified centre is clean.
 *   3. calcSpecular — a thin rim highlight lit from one direction.
 * An SVG filter then feDisplacementMaps the magnified copy by that field and
 * screens the specular layer over it.
 *
 * Ported from https://github.com/winaviation/liquid-glass-demo (kube.io's
 * article demo), adapted to this loupe's geometry.
 */

type Command = { label: string; tag: string };

const COMMANDS: Command[] = [
  { label: "Jump to Selected Work", tag: "Go" },
  { label: "Open Refractive Lens — design note", tag: "Lab" },
  { label: "Read the colophon", tag: "Go" },
  { label: "Email ryan.runsheng@gmail.com", tag: "Mail" },
  { label: "Copy link to this page", tag: "Copy" },
  { label: "View source on GitHub", tag: "Code" },
  { label: "Toggle reduced motion", tag: "Pref" },
  { label: "Switch to dark paper", tag: "Pref" },
];

/* Subsequence fuzzy match — every query char appears in order. */
function fuzzy(query: string, label: string): boolean {
  if (!query) return true;
  const q = query.toLowerCase();
  const s = label.toLowerCase();
  let i = 0;
  for (let j = 0; j < s.length && i < q.length; j++) {
    if (s[j] === q[i]) i++;
  }
  return i === q.length;
}

/* ─── Palette (dark register so the glass loupe pops) ────────────────── */

const PANEL = "#17171b"; // panel ground
const GLASS = "#23232a"; // loupe plane — lifts above the panel
const INK = "#f1f0ea"; // warm off-white type
const INK_SOFT = "#8d8c86"; // muted (tags / placeholder)
const ACCENT = "#8aa0ff"; // brightened Klein blue
const HAIRLINE = "rgba(255,255,255,0.10)";

const ROW_H = 52; // px
const PAD_X = 34; // px — generous left/right inset so magnified text keeps
//                   clear of the refraction walls
const MAG = 1.3; // loupe magnification
const LENS_PAD = 9; // lens height padding above/below the row
const LENS_RADIUS = 16; // loupe corner radius (matches the rendered radius)

/* Glass model parameters (kube.io defaults, scaled to this loupe). */
const BEZEL_WIDTH = 14; // px of curved glass wall, inside the rim
const GLASS_THICKNESS = 45; // depth knob — bigger ⇒ thicker-looking glass
const REFRACTIVE_INDEX = 1.5;
const SPECULAR_ANGLE = Math.PI / 3; // light from upper-left
const REFRACTION_SCALE = 1.4; // displacement multiplier

/* ─── Glass optics — ported verbatim from winaviation/liquid-glass-demo ── */

// Convex-squircle height profile of the bezel. x: 0 (edge) → 1 (inner/flat).
function convexSquircle(x: number): number {
  return Math.pow(1 - Math.pow(1 - x, 4), 1 / 4);
}

// 1D displacement along a radius, via Snell's law through the curved bezel.
// Verbatim from winaviation/liquid-glass-demo `calculateDisplacementMap1D`.
function calcDisplacement1D(
  glassThickness: number,
  bezelWidth: number,
  surfaceFn: (x: number) => number,
  refractiveIndex: number,
  samples = 128,
): number[] {
  const eta = 1 / refractiveIndex;

  function refract(normalX: number, normalY: number): [number, number] | null {
    const dot = normalY;
    const k = 1 - eta * eta * (1 - dot * dot);
    if (k < 0) return null;
    const kSqrt = Math.sqrt(k);
    return [
      -(eta * dot + kSqrt) * normalX,
      eta - (eta * dot + kSqrt) * normalY,
    ];
  }

  const result: number[] = [];
  for (let i = 0; i < samples; i++) {
    const x = i / samples;
    const y = surfaceFn(x);
    const dx = x < 1 ? 0.0001 : -0.0001;
    const y2 = surfaceFn(Math.max(0, Math.min(1, x + dx)));
    const derivative = (y2 - y) / dx;
    const magnitude = Math.sqrt(derivative * derivative + 1);
    const normal: [number, number] = [-derivative / magnitude, -1 / magnitude];
    const refracted = refract(normal[0], normal[1]);

    if (!refracted) {
      result.push(0);
    } else {
      const remainingHeightOnBezel = y * bezelWidth;
      const remainingHeight = remainingHeightOnBezel + glassThickness;
      result.push(refracted[0] * (remainingHeight / refracted[1]));
    }
  }
  return result;
}

// Sweep the 1D profile around a rounded rect into an RGBA displacement field.
// Verbatim from winaviation `calculateDisplacementMap2D` (canvas == object, so
// no objectX/objectY offset). For straight edges one of (x,y) is 0 so cos/sin
// reduce to a pure axis direction; in the corner arcs (x,y) is the offset from
// the arc centre, so (cos,sin) is the outward radial automatically.
function calcDisplacement2D(
  objectWidth: number,
  objectHeight: number,
  radius: number,
  bezelWidth: number,
  maximumDisplacement: number,
  precomputedMap: number[],
): ImageData {
  const imageData = new ImageData(objectWidth, objectHeight);
  for (let i = 0; i < imageData.data.length; i += 4) {
    imageData.data[i] = 128;
    imageData.data[i + 1] = 128;
    imageData.data[i + 2] = 0;
    imageData.data[i + 3] = 255;
  }

  const radiusSquared = radius * radius;
  const radiusPlusOneSquared = (radius + 1) * (radius + 1);
  const radiusMinusBezelSquared = Math.max(
    0,
    (radius - bezelWidth) * (radius - bezelWidth),
  );
  const widthBetweenRadiuses = objectWidth - radius * 2;
  const heightBetweenRadiuses = objectHeight - radius * 2;

  for (let y1 = 0; y1 < objectHeight; y1++) {
    for (let x1 = 0; x1 < objectWidth; x1++) {
      const idx = (y1 * objectWidth + x1) * 4;
      const isOnLeftSide = x1 < radius;
      const isOnRightSide = x1 >= objectWidth - radius;
      const isOnTopSide = y1 < radius;
      const isOnBottomSide = y1 >= objectHeight - radius;

      const x = isOnLeftSide
        ? x1 - radius
        : isOnRightSide
          ? x1 - radius - widthBetweenRadiuses
          : 0;
      const y = isOnTopSide
        ? y1 - radius
        : isOnBottomSide
          ? y1 - radius - heightBetweenRadiuses
          : 0;

      const distanceToCenterSquared = x * x + y * y;
      const isInBezel =
        distanceToCenterSquared <= radiusPlusOneSquared &&
        distanceToCenterSquared >= radiusMinusBezelSquared;

      if (isInBezel) {
        const opacity =
          distanceToCenterSquared < radiusSquared
            ? 1
            : 1 -
              (Math.sqrt(distanceToCenterSquared) - Math.sqrt(radiusSquared)) /
                (Math.sqrt(radiusPlusOneSquared) - Math.sqrt(radiusSquared));
        const distanceFromCenter = Math.sqrt(distanceToCenterSquared);
        const distanceFromSide = radius - distanceFromCenter;
        const cos = distanceFromCenter > 0 ? x / distanceFromCenter : 0;
        const sin = distanceFromCenter > 0 ? y / distanceFromCenter : 0;
        const bezelRatio = Math.max(
          0,
          Math.min(1, distanceFromSide / bezelWidth),
        );
        const bezelIndex = Math.floor(bezelRatio * precomputedMap.length);
        const distance =
          precomputedMap[
            Math.max(0, Math.min(bezelIndex, precomputedMap.length - 1))
          ] || 0;
        const dX =
          maximumDisplacement > 0 ? (-cos * distance) / maximumDisplacement : 0;
        const dY =
          maximumDisplacement > 0 ? (-sin * distance) / maximumDisplacement : 0;

        imageData.data[idx] = Math.max(0, Math.min(255, 128 + dX * 127 * opacity));
        imageData.data[idx + 1] = Math.max(
          0,
          Math.min(255, 128 + dY * 127 * opacity),
        );
        imageData.data[idx + 2] = 0;
        imageData.data[idx + 3] = 255;
      }
    }
  }
  return imageData;
}

// Thin specular rim highlight. Verbatim from winaviation
// `calculateSpecularHighlight` (light direction = specularAngle).
function calcSpecular(
  objectWidth: number,
  objectHeight: number,
  radius: number,
  specularAngle = Math.PI / 3,
): ImageData {
  const imageData = new ImageData(objectWidth, objectHeight);
  const specularVector = [Math.cos(specularAngle), Math.sin(specularAngle)];
  const specularThickness = 1.5;
  const radiusSquared = radius * radius;
  const radiusPlusOneSquared = (radius + 1) * (radius + 1);
  const radiusMinusSpecularSquared = Math.max(
    0,
    (radius - specularThickness) * (radius - specularThickness),
  );
  const widthBetweenRadiuses = objectWidth - radius * 2;
  const heightBetweenRadiuses = objectHeight - radius * 2;

  for (let y1 = 0; y1 < objectHeight; y1++) {
    for (let x1 = 0; x1 < objectWidth; x1++) {
      const idx = (y1 * objectWidth + x1) * 4;
      const isOnLeftSide = x1 < radius;
      const isOnRightSide = x1 >= objectWidth - radius;
      const isOnTopSide = y1 < radius;
      const isOnBottomSide = y1 >= objectHeight - radius;

      const x = isOnLeftSide
        ? x1 - radius
        : isOnRightSide
          ? x1 - radius - widthBetweenRadiuses
          : 0;
      const y = isOnTopSide
        ? y1 - radius
        : isOnBottomSide
          ? y1 - radius - heightBetweenRadiuses
          : 0;

      const distanceToCenterSquared = x * x + y * y;
      const isNearEdge =
        distanceToCenterSquared <= radiusPlusOneSquared &&
        distanceToCenterSquared >= radiusMinusSpecularSquared;

      if (isNearEdge) {
        const distanceFromCenter = Math.sqrt(distanceToCenterSquared);
        const distanceFromSide = radius - distanceFromCenter;
        const opacity =
          distanceToCenterSquared < radiusSquared
            ? 1
            : 1 -
              (distanceFromCenter - Math.sqrt(radiusSquared)) /
                (Math.sqrt(radiusPlusOneSquared) - Math.sqrt(radiusSquared));
        const cos = distanceFromCenter > 0 ? x / distanceFromCenter : 0;
        const sin = distanceFromCenter > 0 ? -y / distanceFromCenter : 0;
        const dotProduct = Math.abs(
          cos * specularVector[0] + sin * specularVector[1],
        );
        const edgeRatio = Math.max(
          0,
          Math.min(1, distanceFromSide / specularThickness),
        );
        const sharpFalloff = Math.sqrt(1 - (1 - edgeRatio) * (1 - edgeRatio));
        const coefficient = dotProduct * sharpFalloff;
        const color = Math.min(255, 255 * coefficient);
        const finalOpacity = Math.min(255, color * coefficient * opacity);

        imageData.data[idx] = color;
        imageData.data[idx + 1] = color;
        imageData.data[idx + 2] = color;
        imageData.data[idx + 3] = finalOpacity;
      }
    }
  }
  return imageData;
}

function imageDataToURL(img: ImageData): string {
  const c = document.createElement("canvas");
  c.width = img.width;
  c.height = img.height;
  c.getContext("2d")!.putImageData(img, 0, 0);
  return c.toDataURL();
}

type GlassMaps = { disp: string; spec: string; scale: number };

function buildGlassMaps(width: number, height: number): GlassMaps {
  const radius = Math.min(LENS_RADIUS, Math.floor(height / 2));
  const bezel = Math.min(BEZEL_WIDTH, radius);
  const map1D = calcDisplacement1D(
    GLASS_THICKNESS,
    bezel,
    convexSquircle,
    REFRACTIVE_INDEX,
  );
  const maxDisplacement = Math.max(...map1D.map(Math.abs)) || 1;
  const disp = calcDisplacement2D(
    width,
    height,
    radius,
    bezel,
    maxDisplacement,
    map1D,
  );
  const spec = calcSpecular(width, height, radius, SPECULAR_ANGLE);
  // winaviation sets feDisplacementMap scale = maxDisplacement * refractionScale.
  const scale = maxDisplacement * REFRACTION_SCALE;
  return { disp: imageDataToURL(disp), spec: imageDataToURL(spec), scale };
}

/* ─── Rows ───────────────────────────────────────────────────────────── */

function Rows({
  results,
  active,
  dim,
  onHover,
  padX = PAD_X,
  hideTags = false,
}: {
  results: Command[];
  active: number;
  dim?: boolean;
  onHover?: (i: number) => void;
  padX?: number;
  hideTags?: boolean;
}) {
  if (results.length === 0) {
    return (
      <div
        style={{
          height: ROW_H,
          display: "flex",
          alignItems: "center",
          padding: `0 ${padX}px`,
          fontFamily: "var(--font-inter)",
          fontSize: 16,
          color: INK_SOFT,
        }}
      >
        No matching commands
      </div>
    );
  }
  return (
    <>
      {results.map((cmd, i) => {
        const isActive = i === active;
        return (
          <div
            key={cmd.label}
            onPointerEnter={onHover ? () => onHover(i) : undefined}
            style={{
              height: ROW_H,
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              padding: `0 ${padX}px`,
              cursor: onHover ? "pointer" : "default",
              opacity: dim && !isActive ? 0.55 : 1,
              transition: "opacity 220ms var(--ease-snappy, ease)",
            }}
          >
            <span
              style={{
                fontFamily: "var(--font-inter)",
                fontSize: 17,
                fontWeight: 450,
                color: INK,
                whiteSpace: "nowrap",
              }}
            >
              {cmd.label}
            </span>
            {!hideTags && (
              <span
                style={{
                  fontFamily: "var(--font-geist-mono)",
                  fontSize: 11,
                  fontWeight: 500,
                  letterSpacing: "0.06em",
                  textTransform: "uppercase",
                  color: INK_SOFT,
                  marginLeft: 16,
                }}
              >
                {cmd.tag}
              </span>
            )}
          </div>
        );
      })}
    </>
  );
}

/* ─── Component ──────────────────────────────────────────────────────── */

export function OpticalCommandPalette({ className }: { className?: string }) {
  const inputRef = useRef<HTMLInputElement>(null);
  const lensRef = useRef<HTMLDivElement>(null);
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState(0);
  const [maps, setMaps] = useState<GlassMaps | null>(null);
  const [lensW, setLensW] = useState(0);

  const rawId = useId();
  const fid = `glass-${rawId.replace(/[^a-zA-Z0-9_-]/g, "")}`;

  const results = COMMANDS.filter((c) => fuzzy(query, c.label));
  const active = Math.min(selected, Math.max(0, results.length - 1));
  const hasResults = results.length > 0;

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  // Measure the loupe so the displacement field maps 1:1 to its bounds.
  useEffect(() => {
    const el = lensRef.current;
    if (!el) return;
    const measure = () => {
      const next = el.getBoundingClientRect().width;
      setLensW((prev) => (Math.abs(prev - next) > 0.5 ? next : prev));
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, [hasResults]);

  const lensH = ROW_H + LENS_PAD * 2;
  // Rebuild the (expensive) glass maps only when the loupe's pixel size
  // changes — keyed by a string so re-renders from typing/selection don't
  // recompute. Stored in a ref-guard pattern to satisfy the effect rules.
  const mapKey = `${Math.round(lensW)}x${lensH}`;
  const lastKeyRef = useRef<string>("");
  useEffect(() => {
    if (lensW <= 0 || lastKeyRef.current === mapKey) return;
    lastKeyRef.current = mapKey;
    setMaps(buildGlassMaps(Math.round(lensW), lensH));
  }, [mapKey, lensW, lensH]);

  const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setSelected((s) => Math.min(s + 1, results.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setSelected((s) => Math.max(s - 1, 0));
    } else if (e.key === "Escape") {
      setQuery("");
      setSelected(0);
    }
  };

  const listH = (hasResults ? results.length : 1) * ROW_H;
  const activeCenter = active * ROW_H + ROW_H / 2;
  const lensTop = activeCenter - lensH / 2;
  const filterReady = maps && lensW > 0;

  return (
    <div
      className={className}
      style={{
        width: "100%",
        maxWidth: 600,
        margin: "0 auto",
        background: PANEL,
        borderRadius: 14,
        border: `1px solid ${HAIRLINE}`,
        boxShadow: "0 30px 70px -36px rgba(0,0,0,0.70)",
        overflow: "hidden",
      }}
    >
      {/* Input row */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 12,
          padding: `0 ${PAD_X}px`,
          height: 60,
          borderBottom: `1px solid ${HAIRLINE}`,
        }}
      >
        <span
          aria-hidden
          style={{
            fontFamily: "var(--font-geist-mono)",
            fontSize: 13,
            letterSpacing: "0.04em",
            color: ACCENT,
          }}
        >
          ⌘K
        </span>
        <input
          ref={inputRef}
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setSelected(0);
          }}
          onKeyDown={onKeyDown}
          placeholder="Type a command…"
          aria-label="Command palette"
          style={{
            flex: 1,
            border: "none",
            outline: "none",
            background: "transparent",
            fontFamily: "var(--font-inter)",
            fontSize: 17,
            color: INK,
          }}
        />
      </div>

      {/* List + loupe */}
      <div style={{ position: "relative", height: listH, padding: "6px 0" }}>
        {/* Base list (crisp, slightly dimmed off-active) */}
        <Rows
          results={results}
          active={active}
          dim
          onHover={hasResults ? setSelected : undefined}
        />

        {/* Glass loupe */}
        {hasResults && (
          <div
            ref={lensRef}
            aria-hidden
            style={{
              position: "absolute",
              left: 8,
              right: 8,
              top: 6 + lensTop,
              height: lensH,
              borderRadius: LENS_RADIUS,
              overflow: "hidden",
              pointerEvents: "none",
              background: PANEL,
              border: "1px solid rgba(255,255,255,0.16)",
              boxShadow:
                "0 18px 38px -12px rgba(0,0,0,0.75), 0 2px 6px rgba(0,0,0,0.4)",
              transition:
                "top 420ms cubic-bezier(0.22, 1.0, 0.30, 1.0), height 240ms var(--ease-snappy, ease)",
            }}
          >
            {/* Refracting viewport — the displacement filter acts on exactly
                the lens bounds. The glass gradient is its own background, so it
                bends at the rim along with the magnified type. */}
            <div
              style={{
                position: "absolute",
                inset: 0,
                overflow: "hidden",
                borderRadius: LENS_RADIUS,
                background: `linear-gradient(180deg, #2c2c33 0%, ${GLASS} 55%, #1b1b20 100%)`,
                filter: filterReady ? `url(#${fid})` : undefined,
              }}
            >
              <div
                style={{
                  position: "absolute",
                  left: 0,
                  right: 0,
                  top: lensH / 2 - activeCenter,
                  // Magnify from the LEFT edge so a row's left end is anchored
                  // (≈ PAD_X·MAG) and never pushed off the lens — centre-origin
                  // scaling sends long rows like the email off the left rim. The
                  // refraction is gentle enough now that the slight wall
                  // asymmetry this causes is not noticeable.
                  transformOrigin: `0 ${activeCenter}px`,
                  transform: `scale(${MAG})`,
                  transition:
                    "top 420ms cubic-bezier(0.22, 1.0, 0.30, 1.0), transform-origin 420ms cubic-bezier(0.22, 1.0, 0.30, 1.0)",
                }}
              >
                <Rows results={results} active={active} />
              </div>
            </div>
          </div>
        )}

        {/* SVG filter — verbatim winaviation chain: blur → displace by the
            field → saturate → screen the specular rim over it. */}
        {filterReady && (
          <svg
            aria-hidden
            width="0"
            height="0"
            style={{ position: "absolute", pointerEvents: "none" }}
          >
            <defs>
              <filter
                id={fid}
                x="-50%"
                y="-50%"
                width="200%"
                height="200%"
                colorInterpolationFilters="sRGB"
              >
                <feGaussianBlur
                  in="SourceGraphic"
                  stdDeviation="0.5"
                  result="blurred"
                />
                <feImage
                  href={maps.disp}
                  x={0}
                  y={0}
                  width={Math.round(lensW)}
                  height={lensH}
                  preserveAspectRatio="none"
                  result="dispmap"
                />
                <feDisplacementMap
                  in="blurred"
                  in2="dispmap"
                  scale={maps.scale}
                  xChannelSelector="R"
                  yChannelSelector="G"
                  result="displaced"
                />
                <feColorMatrix
                  in="displaced"
                  type="saturate"
                  values="1.3"
                  result="displaced_sat"
                />
                <feImage
                  href={maps.spec}
                  x={0}
                  y={0}
                  width={Math.round(lensW)}
                  height={lensH}
                  preserveAspectRatio="none"
                  result="specular"
                />
                <feComponentTransfer in="specular" result="specular_faded">
                  <feFuncA type="linear" slope="0.5" />
                </feComponentTransfer>
                <feBlend
                  in="specular_faded"
                  in2="displaced_sat"
                  mode="screen"
                />
              </filter>
            </defs>
          </svg>
        )}
      </div>

      {/* Accessible mirror */}
      <ul
        role="listbox"
        aria-label="Commands"
        style={{
          position: "absolute",
          width: 1,
          height: 1,
          overflow: "hidden",
          clip: "rect(0 0 0 0)",
        }}
      >
        {results.map((c, i) => (
          <li key={c.label} role="option" aria-selected={i === active}>
            {c.label}
          </li>
        ))}
      </ul>
    </div>
  );
}
