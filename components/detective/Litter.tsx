/*
 * One piece of rubbish, for scattering. These are drawn at 18–28px, so they
 * are solid fills rather than line work: a 2px stroke in a 40-unit box would
 * render at half a pixel. Always decorative.
 */
import { FieldSvg } from "../nature/field-art";
import { LITTER_ART, type LitterName } from "./litter-art";

export type { LitterName };

export function Litter({ mark, className }: { mark: LitterName; className?: string }) {
  const { viewBox, art } = LITTER_ART[mark];
  return (
    <FieldSvg viewBox={viewBox} className={["block", className].filter(Boolean).join(" ")}>
      {art}
    </FieldSvg>
  );
}

export default Litter;
