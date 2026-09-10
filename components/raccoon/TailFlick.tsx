/*
 * A ringed tail tip flicking out of frame. Decorative.
 *
 * Inline copy of public/assets/raccoon/tail-flick.svg, by way of the generated
 * micro-art registry, so the drawing inherits `currentColor`.
 */
import { FieldSvg } from "../nature/field-art";
import { MICRO_ART } from "./micro-art";

export function TailFlick({ className }: { className?: string }) {
  const { viewBox, art } = MICRO_ART["tail-flick"];
  return (
    <FieldSvg viewBox={viewBox} className={["block", className].filter(Boolean).join(" ")}>
      {art}
    </FieldSvg>
  );
}

export default TailFlick;
