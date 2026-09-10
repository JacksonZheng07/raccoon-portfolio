/*
 * A raccoon small enough to sit in a margin, walking past whatever it is
 * set beside. Decorative.
 *
 * Inline copy of public/assets/raccoon/raccoon-tiny.svg, by way of the generated
 * micro-art registry, so the drawing inherits `currentColor`.
 */
import { FieldSvg } from "../nature/field-art";
import { MICRO_ART } from "./micro-art";

export function RaccoonMargin({ className }: { className?: string }) {
  const { viewBox, art } = MICRO_ART["raccoon-tiny"];
  return (
    <FieldSvg viewBox={viewBox} className={["block", className].filter(Boolean).join(" ")}>
      {art}
    </FieldSvg>
  );
}

export default RaccoonMargin;
