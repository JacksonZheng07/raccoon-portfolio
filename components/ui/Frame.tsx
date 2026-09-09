import type { ReactNode } from "react";

type FrameProps = {
  children: ReactNode;
};

/**
 * The outer bordered paper container. Full-bleed below 740px, matching the
 * wireframe's `.frame` rule and its mobile override.
 */
export function Frame({ children }: FrameProps) {
  return (
    <div className="mx-auto my-6 max-w-[1260px] overflow-hidden border-2 border-line bg-paper shadow-frame max-[740px]:m-0 max-[740px]:border-0 max-[740px]:shadow-none">
      {children}
    </div>
  );
}
