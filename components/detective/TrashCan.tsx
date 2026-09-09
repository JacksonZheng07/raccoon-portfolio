/*
 * Renders any bin inline by name. Same contract as `Investigator`: a union of
 * names, an optional accessible label, decorative by default. The bins are
 * drawn at roughly 60–200px, so they are built from few, widely spaced lines.
 */
import { FieldSvg } from "../nature/field-art";
import { TRASH_ART, type TrashCanName } from "./trash-art";

export type { TrashCanName };

export function TrashCan({
  name,
  className,
  label,
}: {
  name: TrashCanName;
  className?: string;
  label?: string;
}) {
  const { viewBox, art } = TRASH_ART[name];
  return (
    <FieldSvg viewBox={viewBox} className={className} label={label}>
      {art}
    </FieldSvg>
  );
}

export default TrashCan;
