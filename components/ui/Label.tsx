import type { ReactNode } from "react";

type LabelProps = {
  children: ReactNode;
  className?: string;
};

/**
 * The small uppercase letterspaced mono specimen label.
 *
 * Size, leading and tracking come from the `specimen` step of the type
 * scale rather than three arbitrary values, so the whole family of labels
 * moves together. `font-variant-numeric: tabular-nums` keeps the `01 /`
 * `02 /` specimen numbers on the same rhythm from section to section.
 */
export function Label({ children, className }: LabelProps) {
  return (
    <div
      className={`font-mono text-specimen font-bold uppercase tabular-nums text-muted${
        className ? ` ${className}` : ""
      }`}
    >
      {children}
    </div>
  );
}
