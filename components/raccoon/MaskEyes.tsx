/*
 * Just the bandit mask and two eyes, for the night band: the raccoon looking
 * back out of the dark. Decorative.
 *
 * Inline copy of public/assets/raccoon/mask-eyes.svg, by way of the generated
 * micro-art registry, so the drawing inherits `currentColor`.
 */
import { FieldSvg } from "../nature/field-art";
import { MICRO_ART } from "./micro-art";

export function MaskEyes({ className }: { className?: string }) {
  const { viewBox, art } = MICRO_ART["mask-eyes"];
  return (
    <FieldSvg viewBox={viewBox} className={["block", className].filter(Boolean).join(" ")}>
      {art}
    </FieldSvg>
  );
}

export default MaskEyes;
