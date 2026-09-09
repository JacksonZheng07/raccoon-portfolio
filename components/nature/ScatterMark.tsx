/*
 * One small mark parked in a corner or a margin, for absolute placement
 * inside a `relative` container. This is the workhorse for making a page feel
 * observed: a pin in one corner, a track in another. Purely decorative, and
 * never in the way of a pointer.
 */
import { FieldSvg } from "./field-art";
import { MARK_ART, type MarkName } from "./mark-art";
import { MICRO_ART, type RaccoonMicroName } from "../raccoon/micro-art";
import type { FieldArt } from "./field-art";

export type ScatterName = MarkName | RaccoonMicroName;
export type ScatterCorner = "top-left" | "top-right" | "bottom-left" | "bottom-right";

const SCATTER_ART: Record<ScatterName, FieldArt> = { ...MARK_ART, ...MICRO_ART };

const CORNER: Record<ScatterCorner, string> = {
  "top-left": "left-0 top-0 -translate-x-1/3 -translate-y-1/3",
  "top-right": "right-0 top-0 translate-x-1/3 -translate-y-1/3",
  "bottom-left": "bottom-0 left-0 -translate-x-1/3 translate-y-1/3",
  "bottom-right": "bottom-0 right-0 translate-x-1/3 translate-y-1/3",
};

export function ScatterMark({
  mark,
  corner = "top-right",
  className,
}: {
  mark: ScatterName;
  corner?: ScatterCorner;
  className?: string;
}) {
  const { viewBox, art } = SCATTER_ART[mark];
  return (
    <span
      className={["pointer-events-none absolute block", CORNER[corner], className]
        .filter(Boolean)
        .join(" ")}
    >
      <FieldSvg viewBox={viewBox} className="block h-full w-full">
        {art}
      </FieldSvg>
    </span>
  );
}

export default ScatterMark;
