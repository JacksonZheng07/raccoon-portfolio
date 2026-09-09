import type { ReactNode } from "react";

type StampProps = {
  children: ReactNode;
  className?: string;
};

/**
 * The rotated circular rubber stamp badge. The full border radius is the one
 * documented exception to the no-radii rule, because the shape is a circle.
 */
export function Stamp({ children, className }: StampProps) {
  return (
    <div
      className={`grid h-[94px] w-[94px] rotate-12 place-items-center rounded-full border-2 border-line bg-accent-pink text-center font-mono text-[10px] font-bold leading-[1.35] text-ink${
        className ? ` ${className}` : ""
      }`}
    >
      {children}
    </div>
  );
}
