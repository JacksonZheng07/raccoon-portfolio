/*
 * Renders any investigator pose inline by name, so the drawing inherits
 * `currentColor` from whatever it is placed in. The name is a union, so a
 * misspelling is a compile error rather than a blank space on the page.
 *
 * These poses carry line detail and are drawn at 200–600px. Pass `label` when
 * the drawing is doing the talking — the hero, say — and leave it off when it
 * is decoration beside copy that already says the same thing.
 */
import { FieldSvg } from "../nature/field-art";
import { INVESTIGATOR_ART, type InvestigatorName } from "./investigator-art";

export type { InvestigatorName };

export function Investigator({
  name,
  className,
  label,
}: {
  name: InvestigatorName;
  className?: string;
  label?: string;
}) {
  const { viewBox, art } = INVESTIGATOR_ART[name];
  return (
    <FieldSvg viewBox={viewBox} className={className} label={label}>
      {art}
    </FieldSvg>
  );
}

export default Investigator;
