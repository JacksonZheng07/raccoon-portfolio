/*
 * The shared shape of one inline drawing, and the wrapper that supplies the
 * single-weight line settings every illustration in this library uses.
 *
 * Everything here is decorative by default and so is hidden from assistive
 * technology. Pass `label` only when a drawing carries meaning; that switches
 * it to `role="img"` with an accessible name.
 */
import type { ReactNode } from "react";

export type FieldArt = {
  viewBox: string;
  art: ReactNode;
};

export function FieldSvg({
  viewBox,
  className,
  label,
  children,
}: {
  viewBox: string;
  className?: string;
  label?: string;
  children: ReactNode;
}) {
  const art = (
    <g fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      {children}
    </g>
  );
  if (label) {
    return (
      <svg viewBox={viewBox} className={className} role="img" aria-label={label}>
        {art}
      </svg>
    );
  }
  return (
    <svg viewBox={viewBox} className={className} aria-hidden="true">
      {art}
    </svg>
  );
}
