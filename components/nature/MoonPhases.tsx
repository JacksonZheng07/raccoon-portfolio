/*
 * The row of five moon phases, new through full. Decorative; it reads as a
 * night-band ornament rather than data.
 */
import { FieldSvg } from "./field-art";
import { SPECIMEN_ART } from "./specimen-art";

export function MoonPhases({ className }: { className?: string }) {
  const { viewBox, art } = SPECIMEN_ART["moon-phases"];
  return (
    <FieldSvg viewBox={viewBox} className={["block", className].filter(Boolean).join(" ")}>
      {art}
    </FieldSvg>
  );
}

export default MoonPhases;
