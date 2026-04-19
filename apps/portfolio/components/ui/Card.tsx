import type { HTMLAttributes } from "react";

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  flat?: boolean;
}

export function Card({
  flat = false,
  className = "",
  children,
  ...rest
}: CardProps) {
  return (
    <div className={`${flat ? "card-flat" : "card"} ${className}`} {...rest}>
      {children}
    </div>
  );
}
