/*
 * A raccoon looking over the top of something, or around the side of it.
 * `variant="ears"` is the pair of ears cresting a rim; `variant="face"` is the
 * masked face emerging past a vertical edge.
 *
 * Note this is the small marginal mark, not the full-page 404 drawing in
 * public/assets/raccoon/raccoon-peek.svg. Decorative.
 */
import { FieldSvg } from "../nature/field-art";
import { MICRO_ART } from "./micro-art";

const VARIANT = {
  ears: "ears-peek",
  face: "face-corner",
} as const;

export function RaccoonPeek({
  variant = "ears",
  className,
}: {
  variant?: keyof typeof VARIANT;
  className?: string;
}) {
  const { viewBox, art } = MICRO_ART[VARIANT[variant]];
  return (
    <FieldSvg viewBox={viewBox} className={["block", className].filter(Boolean).join(" ")}>
      {art}
    </FieldSvg>
  );
}

export default RaccoonPeek;
