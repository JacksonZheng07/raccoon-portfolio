/*
 * A trail of raccoon tracks walking across the page. Each step is the single
 * track mark from public/assets/raccoon/track-single.svg, placed along a
 * gentle wander and turned as it goes, so the trail reads as one animal
 * crossing rather than a row of stamps. Decorative.
 */
import { FieldSvg } from "./field-art";
import { MICRO_ART } from "../raccoon/micro-art";

const STEP = 20;
const SCALE = 0.72;

export function TrackTrail({
  steps = 4,
  direction = "right",
  className,
}: {
  steps?: number;
  direction?: "right" | "left";
  className?: string;
}) {
  const count = Math.max(1, Math.min(12, Math.round(steps)));
  const width = 8 + count * STEP;
  const { art } = MICRO_ART["track-single"];
  return (
    <FieldSvg viewBox={`0 0 ${width} 40`} className={["block", className].filter(Boolean).join(" ")}>
      <g transform={direction === "left" ? `translate(${width} 0) scale(-1 1)` : undefined}>
        {Array.from({ length: count }, (_, i) => {
          const x = 4 + i * STEP;
          const y = 6 + 7 * Math.sin(i * 1.15);
          // turn each foot to face along the wander, so the trail never
          // over-rotates however many steps are asked for
          const turn = (Math.atan2(7 * 1.15 * Math.cos(i * 1.15), STEP) * 180) / Math.PI;
          return (
            <g key={i} transform={`translate(${x} ${y.toFixed(1)}) rotate(${turn.toFixed(1)}) scale(${SCALE})`}>
              {art}
            </g>
          );
        })}
      </g>
    </FieldSvg>
  );
}

export default TrackTrail;
