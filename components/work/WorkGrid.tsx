import type { ReactNode } from "react";

type WorkGridProps = {
  /** `WorkCard`s. In the "feature" layout the first one should be featured. */
  children: ReactNode;
  /**
   * "feature" is the home page's wide-plus-two-narrow arrangement from the
   * wireframe; "uniform" is the even three-column grid the index page wants.
   */
  layout?: "feature" | "uniform";
  className?: string;
};

const LAYOUTS = {
  feature: "grid-cols-[1.3fr_.7fr]",
  uniform: "grid-cols-3 max-[980px]:grid-cols-2",
} as const;

/** The work grid container. It owns spacing and columns, nothing else. */
export function WorkGrid({
  children,
  layout = "feature",
  className,
}: WorkGridProps) {
  return (
    <div
      className={`grid gap-5 ${LAYOUTS[layout]} max-[740px]:grid-cols-1${
        className ? ` ${className}` : ""
      }`}
    >
      {children}
    </div>
  );
}

export default WorkGrid;
