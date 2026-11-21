import Image from "next/image";
import { backdrops, type BackdropKey } from "@/lib/work";

/**
 * Stage — the wall a picture hangs on: a public-domain oil painting, or,
 * with no `paint`, a flat tone.
 */
export function Stage({
  paint,
  className,
  children,
  priority,
}: {
  paint?: BackdropKey;
  className?: string;
  children: React.ReactNode;
  priority?: boolean;
}) {
  return (
    <div className={className ? `stage ${className}` : "stage"}>
      {paint ? (
        <Image
          className="stage__paint"
          src={backdrops[paint].src}
          alt=""
          fill
          sizes="(max-width: 860px) 100vw, 1300px"
          priority={priority}
        />
      ) : null}
      {children}
    </div>
  );
}

/**
 * Plate — a picture mounted on the wall, with a label underneath it the
 * way a gallery labels a piece. No window chrome.
 */
export function Plate({
  label,
  className,
  style,
  children,
}: {
  label?: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
  children: React.ReactNode;
}) {
  return (
    <div className={className ? `plate ${className}` : "plate"} style={style}>
      {children}
      {label ? <div className="plate__label">{label}</div> : null}
    </div>
  );
}
