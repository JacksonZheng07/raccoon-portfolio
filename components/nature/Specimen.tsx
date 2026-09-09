/*
 * Renders any nature specimen inline by name, so the drawing inherits
 * `currentColor` from whatever it is placed in. The name is a union, so a
 * misspelling is a compile error rather than a blank space on the page.
 */
import { FieldSvg } from "./field-art";
import { SPECIMEN_ART, type SpecimenName } from "./specimen-art";

export type { SpecimenName };

export function Specimen({
  name,
  className,
  label,
}: {
  name: SpecimenName;
  className?: string;
  label?: string;
}) {
  const { viewBox, art } = SPECIMEN_ART[name];
  return (
    <FieldSvg viewBox={viewBox} className={className} label={label}>
      {art}
    </FieldSvg>
  );
}

export default Specimen;
