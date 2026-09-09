import { Specimen, type SpecimenName } from "@/components/nature/Specimen";
import { TapeStrip } from "@/components/nature/TapeStrip";
import { TrackTrail } from "@/components/nature/TrackTrail";
import { Btn } from "@/components/ui/Btn";
import { Label } from "@/components/ui/Label";
import { Section } from "@/components/ui/Section";
import { Stamp } from "@/components/ui/Stamp";
import { PLATE_TONE } from "@/components/work/field-marks";
import type { Project } from "@/lib/projects";
import { formatDateRange } from "./case-study-data";

// Btn renders a plain anchor, so an internal href needs the deploy subpath by
// hand, with the trailing slash `trailingSlash: true` exports.
const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

type CaseStudyMastheadProps = {
  project: Project;
  /** The specimen number this study carries in the case-study order. */
  number: string;
  /** The project's own nature specimen, from `projectSpecimen`. */
  specimen: SpecimenName;
};

function repoName(repo: string): string {
  return repo.replace("https://github.com/", "");
}

/**
 * The head of a case study: the name, the tagline, and the field record —
 * the flat facts the content layer holds, set as a specimen card taped to
 * the page.
 *
 * The plate's colour comes from the project's priority and its drawing from
 * its domain, so the four Flagship studies and the two Strong ones open on
 * visibly different stock without a line of per-project code.
 */
export function CaseStudyMasthead({
  project,
  number,
  specimen,
}: CaseStudyMastheadProps) {
  const rows = [
    { term: "domain", detail: project.domain },
    { term: "active", detail: formatDateRange(project.start, project.end) },
    { term: "write-up", detail: project.status },
    {
      term: "skills",
      detail: project.skills.length > 0 ? project.skills.join(" · ") : "—",
    },
    { term: "repository", detail: repoName(project.repo) },
  ];

  return (
    <Section
      tone="paper"
      density="loose"
      className="grid grid-cols-[1.15fr_0.85fr] items-start gap-[56px] max-[740px]:block"
    >
      <div>
        <Label>{`case study / ${number}`}</Label>
        <h1 className="m-0 mt-[18px] font-display text-display-1">
          {project.name}
        </h1>
        <p className="mb-0 mt-[26px] max-w-[558px] font-display text-[19px] leading-[1.6]">
          {project.tagline}
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <Btn href={project.repo} rel="noreferrer">
            View the repository <span aria-hidden="true">&#8599;</span>
          </Btn>
          <Btn href={`${basePath}/work/`}>All work</Btn>
        </div>
        <TrackTrail
          steps={5}
          className="mt-[34px] w-[176px] text-ringtail max-[740px]:hidden"
        />
      </div>
      <div
        className={`relative border-2 border-line px-7 py-8 max-[740px]:mt-[46px] ${
          PLATE_TONE[project.priority]
        }`}
      >
        <TapeStrip
          tilt="left"
          className="pointer-events-none absolute -top-[13px] left-1/2 w-[132px] -translate-x-1/2 text-ringtail"
        />
        <Label className="text-muted-strong!">field record</Label>
        <dl className="m-0 mt-[18px] border-t-2 border-line">
          {rows.map((row) => (
            <div
              key={row.term}
              className="grid grid-cols-[92px_minmax(0,1fr)] gap-4 border-b border-line py-[11px]"
            >
              <dt className="font-mono text-[11px] uppercase tracking-[0.08em] text-ink">
                {row.term}
              </dt>
              <dd className="m-0 break-words text-[14px]">{row.detail}</dd>
            </div>
          ))}
        </dl>
        <div className="mt-[22px] flex items-end justify-between gap-5">
          <div>
            <Label className="text-muted-strong!">field mark</Label>
            <p className="m-0 mt-[4px] font-display text-[17px] leading-[1.35] text-ink">
              Filed under {project.domain.toLowerCase()}
            </p>
          </div>
          <Specimen name={specimen} className="w-[74px] shrink-0 text-line" />
        </div>
        <Stamp className="absolute -right-[16px] -top-[16px]">
          <span>
            {project.priority.toUpperCase()}
            <br />
            SPECIMEN
          </span>
        </Stamp>
      </div>
    </Section>
  );
}

export default CaseStudyMasthead;
