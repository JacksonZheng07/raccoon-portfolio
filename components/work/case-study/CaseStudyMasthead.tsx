import { Btn } from "@/components/ui/Btn";
import { Label } from "@/components/ui/Label";
import { Section } from "@/components/ui/Section";
import { Stamp } from "@/components/ui/Stamp";
import type { Project } from "@/lib/projects";
import { formatDateRange } from "./case-study-data";

// Btn renders a plain anchor, so an internal href needs the deploy subpath by
// hand, with the trailing slash `trailingSlash: true` exports.
const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

type CaseStudyMastheadProps = {
  project: Project;
  /** The specimen number this study carries in the case-study order. */
  number: string;
};

function repoName(repo: string): string {
  return repo.replace("https://github.com/", "");
}

/**
 * The head of a case study: the name, the tagline, and the field record —
 * the flat facts the content layer holds, set as a specimen card.
 */
export function CaseStudyMasthead({
  project,
  number,
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
    <Section className="grid grid-cols-[1.15fr_0.85fr] items-start gap-[56px] max-[740px]:block">
      <div>
        <Label>{`case study / ${number}`}</Label>
        <h1 className="m-0 mt-[18px] font-display text-[62px] leading-[0.92] tracking-[-0.065em] max-[740px]:text-[44px]">
          {project.name}
        </h1>
        <p className="mb-0 mt-[24px] max-w-[558px] font-display text-[18px] leading-[1.65]">
          {project.tagline}
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <Btn href={project.repo} rel="noreferrer">
            View the repository <span aria-hidden="true">&#8599;</span>
          </Btn>
          <Btn href={`${basePath}/work/`}>All work</Btn>
        </div>
      </div>
      <div className="relative border-2 border-line bg-accent-blue px-7 py-8 max-[740px]:mt-[38px]">
        <Label className="text-ink!">field record</Label>
        <dl className="m-0 mt-[18px] border-t-2 border-line">
          {rows.map((row) => (
            <div
              key={row.term}
              className="grid grid-cols-[92px_minmax(0,1fr)] gap-4 border-b border-line py-[11px]"
            >
              <dt className="font-mono text-[11px] uppercase tracking-[0.08em] text-ink">
                {row.term}
              </dt>
              <dd className="m-0 text-[14px] break-words">{row.detail}</dd>
            </div>
          ))}
        </dl>
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
