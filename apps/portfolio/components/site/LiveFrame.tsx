"use client";

import { useEffect, useRef, useState } from "react";

/**
 * A working interface inside a frame, in place of a picture of it.
 *
 * The page is laid out `w` pixels wide and as tall as the frame needs, then
 * scaled as one piece to fill the frame exactly, so nothing is cut off and
 * the interface keeps its own proportions of type and spacing. It stays
 * live, so it can be clicked and scrolled.
 */
/** Below this frame width the interface would be too small to use. */
const MIN_WIDTH = 520;

export function LiveFrame({
  src,
  w,
  title,
  poster,
}: {
  src: string;
  w: number;
  title: string;
  /** A still of the interface: shown until it loads, and in place of it on narrow screens. */
  poster?: string;
}) {
  const box = useRef<HTMLDivElement>(null);
  const [size, setSize] = useState({ scale: 0, h: 0 });
  const [near, setNear] = useState(false);

  useEffect(() => {
    const el = box.current;
    if (!el) return;
    const fit = () => {
      // Too narrow to read or use at this size: the still stays instead.
      if (el.clientWidth < MIN_WIDTH) return setSize({ scale: 0, h: 0 });
      const scale = el.clientWidth / w;
      setSize({ scale, h: Math.ceil(el.clientHeight / scale) });
    };
    fit();
    const ro = new ResizeObserver(fit);
    ro.observe(el);
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setNear(true);
          io.disconnect();
        }
      },
      { rootMargin: "600px" },
    );
    io.observe(el);
    return () => {
      ro.disconnect();
      io.disconnect();
    };
  }, [w]);

  return (
    <div
      ref={box}
      className="live"
      style={poster ? { backgroundImage: `url(${poster})` } : undefined}
    >
      {near && size.scale > 0 ? (
        <iframe
          src={src}
          title={title}
          width={w}
          height={size.h}
          style={{ transform: `scale(${size.scale})` }}
        />
      ) : null}
    </div>
  );
}
