/*
 * A scattered run of rubbish across the page: `TrackTrail`, but for what the
 * raccoon left behind rather than where it walked. Each mark is one of the
 * four litter drawings, dropped along a gentle wander and turned as it goes,
 * so the run reads as one spill rather than a row of stamps.
 *
 * The marks are solid fills, which is why this can scale them in a transform
 * without thinning any stroke. Decorative.
 */
import { FieldSvg } from "../nature/field-art";
import { LITTER_ART, type LitterName } from "./litter-art";

const ORDER: LitterName[] = ["banana-peel", "fish-bone", "crumpled-can", "apple-core"];
const STEP = 30;
const MARK = 26;

export function DebrisTrail({
  count = 4,
  direction = "right",
  className,
}: {
  count?: number;
  direction?: "right" | "left";
  className?: string;
}) {
  const marks = Math.max(1, Math.min(12, Math.round(count)));
  const width = 12 + marks * STEP;
  return (
    <FieldSvg
      viewBox={`0 0 ${width} 44`}
      className={["block", className].filter(Boolean).join(" ")}
    >
      <g transform={direction === "left" ? `translate(${width} 0) scale(-1 1)` : undefined}>
        {Array.from({ length: marks }, (_, i) => {
          const name = ORDER[i % ORDER.length];
          const { viewBox, art } = LITTER_ART[name];
          const [, , w, h] = viewBox.split(" ").map(Number);
          const scale = MARK / Math.max(w, h);
          const x = 8 + i * STEP;
          const y = 22 + 8 * Math.sin(i * 1.4);
          const turn = -18 + ((i * 47) % 60);
          return (
            <g
              key={`${name}-${i}`}
              transform={`translate(${x} ${y.toFixed(1)}) rotate(${turn}) scale(${scale.toFixed(3)}) translate(${-w / 2} ${-h / 2})`}
            >
              {art}
            </g>
          );
        })}
      </g>
    </FieldSvg>
  );
}

export default DebrisTrail;
