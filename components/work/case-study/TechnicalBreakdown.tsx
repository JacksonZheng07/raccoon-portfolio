import type { ReactNode } from "react";
import { Label } from "@/components/ui/Label";
import type { TechnicalSection } from "@/lib/projects";

type TechnicalBreakdownProps = {
  sections: readonly TechnicalSection[];
  /**
   * Something to stand in the empty cell an odd number of areas leaves at
   * the end of the last row. Ignored when the row is full, because then
   * there is no hole to fill and nothing should be squeezed in beside a
   * card.
   */
  gapFigure?: ReactNode;
};

/**
 * The parts list, one bordered card per area. Two columns on desktop, which
 * suits both the three-area and four-area projects without a ragged last row.
 */
export function TechnicalBreakdown({
  sections,
  gapFigure,
}: TechnicalBreakdownProps) {
  const hasGap = sections.length % 2 === 1;

  return (
    <div className="grid grid-cols-2 items-stretch gap-5 max-[740px]:block">
      {sections.map((section, index) => (
        <section
          key={section.area}
          className="border-2 border-line bg-white px-[22px] py-[20px] max-[740px]:mb-4"
        >
          <Label>{`area ${String(index + 1).padStart(2, "0")} / ${
            section.points.length
          } parts`}</Label>
          <h3 className="m-0 mt-[6px] font-display text-display-4">
            {section.area}
          </h3>
          <ul className="m-0 mt-[14px] list-none border-t border-ringtail p-0">
            {section.points.map((point) => (
              <li
                key={point}
                className="flex gap-3 border-b border-ringtail py-[8px] text-[14px] last:border-b-0"
              >
                <span aria-hidden="true" className="font-mono text-muted">
                  &middot;
                </span>
                <span>{point}</span>
              </li>
            ))}
          </ul>
        </section>
      ))}
      {hasGap && gapFigure ? (
        <div className="flex items-end justify-center pb-[6px] max-[740px]:mt-6 max-[740px]:justify-end">
          {gapFigure}
        </div>
      ) : null}
    </div>
  );
}

export default TechnicalBreakdown;
