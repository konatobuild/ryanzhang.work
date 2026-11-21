"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import type { WorkImage } from "@/lib/work";
import { AutoVideo } from "./AutoVideo";
import { Icon } from "./Marks";

export interface Fig extends WorkImage {
  file: string;
  src: string;
}

const SHEET_KINDS = new Set(["board", "slide", "deck", "diagram", "sketch", "identity", "drawing"]);

/**
 * Figures — a section's images. Wide ones span the full measure, the rest
 * sit two-up. Process boards get a paper sheet behind them. Clicking any
 * still opens it large; arrow keys step through the section's images.
 */
export function Figures({ figs }: { figs: Fig[] }) {
  const stills = figs.filter((f) => !f.file.endsWith(".mp4"));
  const [open, setOpen] = useState<number | null>(null);
  const dialog = useRef<HTMLDialogElement>(null);

  const step = useCallback(
    (d: number) =>
      setOpen((i) => (i === null ? i : (i + d + stills.length) % stills.length)),
    [stills.length],
  );

  useEffect(() => {
    const el = dialog.current;
    if (!el) return;
    if (open !== null && !el.open) el.showModal();
    if (open === null && el.open) el.close();
  }, [open]);

  if (figs.length === 0) return null;
  const single = figs.length === 1;
  const current = open !== null ? stills[open] : null;

  return (
    <>
      <div className="figs">
        {figs.map((f, i) => {
          const isVideo = f.file.endsWith(".mp4");
          const sheet = SHEET_KINDS.has(f.kind) && f.bg !== "dark";
          const ratio = f.w / f.h;
          const wide =
            ratio > 1.9 ||
            (sheet && ratio > 1.6) ||
            (ratio >= 1.25 && (single || (i === 0 && figs.length % 2 === 1)));
          const cls = ["fig", wide ? "fig--wide" : "", sheet ? "fig--sheet" : ""]
            .filter(Boolean)
            .join(" ");
          return (
            <figure key={f.file} className={cls}>
              {isVideo ? (
                <div className="fig__frame" style={{ cursor: "default" }}>
                  <AutoVideo
                    src={f.src}
                    poster={f.poster ? f.src.replace(f.file, f.poster) : undefined}
                    label={f.alt}
                  />
                </div>
              ) : (
                <button
                  type="button"
                  className="fig__frame"
                  onClick={() => setOpen(stills.indexOf(f))}
                  aria-label={`Enlarge: ${f.alt}`}
                >
                  <Image
                    src={f.src}
                    alt={f.alt}
                    width={f.w}
                    height={f.h}
                    sizes={
                      wide
                        ? "(max-width: 980px) 100vw, 972px"
                        : "(max-width: 640px) 100vw, 486px"
                    }
                  />
                </button>
              )}
              {f.caption ? <figcaption>{f.caption}</figcaption> : null}
            </figure>
          );
        })}
      </div>

      <dialog
        ref={dialog}
        className="lightbox"
        onClose={() => setOpen(null)}
        onKeyDown={(e) => {
          if (e.key === "ArrowRight") step(1);
          if (e.key === "ArrowLeft") step(-1);
        }}
      >
        {current ? (
          <div className="lightbox__inner">
            <div className="lightbox__bar">
              <span>
                {open! + 1} / {stills.length}
              </span>
              <div className="lightbox__nav">
                {stills.length > 1 ? (
                  <>
                    <button
                      type="button"
                      className="icon-btn"
                      onClick={() => step(-1)}
                      aria-label="Previous image"
                    >
                      <Icon name="left" />
                    </button>
                    <button
                      type="button"
                      className="icon-btn"
                      onClick={() => step(1)}
                      aria-label="Next image"
                    >
                      <Icon name="right" />
                    </button>
                  </>
                ) : null}
                <button
                  type="button"
                  className="icon-btn"
                  onClick={() => setOpen(null)}
                  aria-label="Close"
                  autoFocus
                >
                  <Icon name="close" />
                </button>
              </div>
            </div>
            <div className="lightbox__stage" onClick={() => setOpen(null)}>
              {/* eslint-disable-next-line @next/next/no-img-element -- full-size original */}
              <img src={current.src} alt={current.alt} width={current.w} height={current.h} />
            </div>
            <p className="lightbox__cap">{current.caption ?? current.alt}</p>
          </div>
        ) : null}
      </dialog>
    </>
  );
}
