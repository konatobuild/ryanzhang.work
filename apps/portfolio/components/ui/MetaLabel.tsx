import type { HTMLAttributes } from "react";

interface MetaLabelProps extends HTMLAttributes<HTMLSpanElement> {
  as?: "span" | "p" | "div" | "dt" | "dd" | "li";
}

export function MetaLabel({
  as: Tag = "span",
  className = "",
  children,
  ...rest
}: MetaLabelProps) {
  return (
    <Tag className={`meta-text ${className}`} {...rest}>
      {children}
    </Tag>
  );
}
