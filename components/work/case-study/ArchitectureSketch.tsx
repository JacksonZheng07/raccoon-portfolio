import { FieldSvg } from "@/components/nature/field-art";
import { MARK_ART } from "@/components/nature/mark-art";
import { Label } from "@/components/ui/Label";
import { splitArchitectureFlows } from "./case-study-data";

type ArchitectureSketchProps = {
  architecture: readonly string[];
};

/**
 * The flow sketch, drawn as a flow: one bordered box per step, connected top
 * to bottom, on the same specimen plate the work cards use.
 *
 * The content layer keeps the sketch as a flat list of steps with the arrows
 * stripped, and a project can fold a second flow into that list by naming it
 * inline. Each detected flow gets its own column, so PyStruct's runtime flow
 * and its browser IDE flow read as two sequences rather than one long one.
 */
export function ArchitectureSketch({ architecture }: ArchitectureSketchProps) {
  const flows = splitArchitectureFlows(architecture);

  if (flows.length === 0) {
    return null;
  }

  return (
    <div
      className={`border-2 border-line bg-paper px-[30px] pb-[26px] pt-[32px] ${
        flows.length > 1 ? "" : "mx-auto max-w-[640px]"
      }`}
    >
      <div
        className={`grid gap-x-[46px] gap-y-9 ${
          flows.length > 1 ? "grid-cols-2 max-[740px]:block" : "grid-cols-1"
        }`}
      >
      {flows.map((flow, flowIndex) => (
        <div
          key={flow.title ?? `flow-${flowIndex}`}
          className={flowIndex > 0 ? "max-[740px]:mt-[36px]" : undefined}
        >
          {flows.length > 1 ? (
            <Label className="mb-[18px]">
              {`flow ${flowIndex + 1} / ${flow.title ?? "core sequence"}`}
            </Label>
          ) : null}
          <ol className="m-0 mx-auto list-none p-0 max-w-[440px]">
            {flow.steps.map((step, stepIndex) => (
              <li key={`${step.label ?? ""}${step.text}`}>
                {stepIndex > 0 ? (
                  <div
                    aria-hidden="true"
                    className="flex flex-col items-center justify-center"
                  >
                    <span className="h-[16px] w-0 border-l-2 border-line" />
                    <span className="font-mono text-[13px] leading-[1] text-line">
                      &darr;
                    </span>
                  </div>
                ) : null}
                <div className="border-2 border-line bg-white px-[15px] py-[11px]">
                  {step.label !== undefined ? (
                    <Label className="mb-[5px]">{step.label}</Label>
                  ) : null}
                  <p className="m-0 font-mono text-[12px] uppercase leading-[1.45] tracking-[0.05em] text-ink">
                    {step.text}
                  </p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      ))}
      </div>
      {/*
        * The scale bar is the one mark this plate gets: it is what a real
        * field sketch carries under the drawing, and it closes the plate off
        * without competing with the flow.
        */}
      <FieldSvg
        viewBox={MARK_ART["scale-bar"].viewBox}
        className="mx-auto mt-8 block w-[136px] text-ringtail"
      >
        {MARK_ART["scale-bar"].art}
      </FieldSvg>
    </div>
  );
}

export default ArchitectureSketch;
