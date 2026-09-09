import type { ReactNode } from "react";

type LabelProps = {
  children: ReactNode;
  className?: string;
};

/** The small uppercase letterspaced mono specimen label. */
export function Label({ children, className }: LabelProps) {
  return (
    <div
      className={`font-mono text-[11px] font-bold uppercase tracking-[0.14em] text-muted${
        className ? ` ${className}` : ""
      }`}
    >
      {children}
    </div>
  );
}
