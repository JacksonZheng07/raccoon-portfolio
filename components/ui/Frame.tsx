import type { ReactNode } from "react";

type FrameProps = {
  children: ReactNode;
};

/**
 * The outer bordered paper container. Full-bleed below 740px, matching the
 * wireframe's `.frame` rule and its mobile override.
 *
 * `overflow-clip` rather than `overflow-hidden`: both clip the rotated stamp
 * and the bleeding hero art the same way, but `hidden` makes the frame a
 * scroll container, which would break the sticky header inside it. `clip`
 * does not.
 *
 * The paper tone rather than a flat `bg-paper` fill, so the grain shows
 * through in the header, the footer, and any section that leaves its own
 * background transparent.
 */
export function Frame({ children }: FrameProps) {
  return (
    <div className="tone-paper relative mx-auto my-6 max-w-[1260px] overflow-clip border-2 border-line shadow-frame max-[740px]:m-0 max-[740px]:border-0 max-[740px]:shadow-none">
      {children}
    </div>
  );
}
