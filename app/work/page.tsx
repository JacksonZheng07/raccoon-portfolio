import type { Metadata } from "next";
import { RingtailRule } from "@/components/raccoon/RingtailRule";
import { Label } from "@/components/ui/Label";
import { Section } from "@/components/ui/Section";
import { SectionRow } from "@/components/ui/SectionRow";
import { Stamp } from "@/components/ui/Stamp";
import { WorkCard } from "@/components/work/WorkCard";
import { WorkFilter } from "@/components/work/WorkFilter";
import {
  DOMAINS,
  PRIORITY_ORDER,
  getAllProjects,
  getCaseStudyProjects,
  type Project,
} from "@/lib/projects";

/*
 * `next/image` passes `src` through untouched under `images.unoptimized`, so a
 * hand-written asset path has to carry the deploy subpath itself. `next/link`
 * does prefix, which is why the card hrefs below do not.
 */
const BASE_PATH = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

export const metadata: Metadata = {
  title: "Work — Jackson Zheng",
  description:
    "Ten projects, from a Python-inspired language runtime to a hackathon flight-emissions comparison. Six carry a full case study; the rest link to the repository.",
};

/** Flagship and Strong work has a case study; Supporting work has a repo. */
function destination(project: Project): string {
  return project.priority === "Supporting"
    ? project.repo
    : `/work/${project.slug}/`;
}

export default function WorkIndexPage() {
  const projects = getAllProjects();
  const caseStudies = getCaseStudyProjects();
  const repoOnly = projects.length - caseStudies.length;

  const ledger = PRIORITY_ORDER.map((priority) => ({
    priority,
    count: projects.filter((project) => project.priority === priority).length,
  }));

  const items = projects.map((project) => ({
    slug: project.slug,
    domain: project.domain,
    card: (
      <>
        <WorkCard project={project} href={destination(project)} />
        {project.priority === "Supporting" ? (
          <p className="m-0 mt-[9px] border-2 border-line bg-paper px-[11px] py-[7px] font-mono text-[11px] uppercase tracking-[0.06em] text-muted">
            repo only / no case study
          </p>
        ) : null}
      </>
    ),
  }));

  return (
    <main>
      <Section className="grid grid-cols-[1.1fr_0.9fr] items-center gap-[56px] max-[740px]:block">
        <div>
          <Label>work / the index</Label>
          <h1 className="m-0 mt-[18px] font-display text-[62px] leading-[0.92] tracking-[-0.065em] max-[740px]:text-[44px]">
            Ten builds, filed and labelled
          </h1>
          <p className="mb-0 mt-[24px] max-w-[54ch] font-display text-[18px] leading-[1.65]">
            All {projects.length} projects, in one list. {caseStudies.length}{" "}
            of them carry a full case study — the problem, the decisions, and
            what actually shipped. The remaining {repoOnly} are smaller
            Supporting builds, and their cards go straight to the repository
            rather than pretending there is more to read.
          </p>
          <div className="mt-[26px] w-[280px] max-w-full">
            <RingtailRule className="text-ringtail" />
          </div>
        </div>
        <div className="relative border-2 border-line bg-accent-blue px-7 py-8 text-ink max-[740px]:mt-[34px]">
          <Label>field ledger</Label>
          <dl className="m-0 mt-4 border-t-2 border-line">
            {ledger.map((row) => (
              <div
                key={row.priority}
                className="flex items-baseline justify-between gap-4 border-b border-line py-[11px] font-mono text-[11px] uppercase tracking-[0.08em]"
              >
                <dt>{row.priority}</dt>
                <dd className="m-0">{row.count}</dd>
              </div>
            ))}
            <div className="flex items-baseline justify-between gap-4 py-[11px] font-mono text-[11px] uppercase tracking-[0.08em]">
              <dt>case studies / repo only</dt>
              <dd className="m-0">
                {caseStudies.length} / {repoOnly}
              </dd>
            </div>
          </dl>
          {/* eslint-disable-next-line @next/next/no-img-element -- see BASE_PATH note above */}
          <img
            src={`${BASE_PATH}/assets/raccoon/raccoon-tools.svg`}
            alt="Ink line drawing of a raccoon sorting through a set of tools"
            width={340}
            height={240}
            className="mx-auto mt-6 block h-auto w-full max-w-[300px]"
          />
          <Stamp className="absolute -right-[14px] -top-[14px]">
            <span>
              {projects.length} filed
              <br />
              {caseStudies.length} written
            </span>
          </Stamp>
        </div>
      </Section>

      <Section aria-labelledby="index-heading" className="border-b-0!">
        <SectionRow
          number="01"
          kicker="all projects"
          heading="Sorted by how much there is to say"
          headingId="index-heading"
          description="Flagship first, then Strong, then Supporting; newest end date first inside each group. Filter by domain to narrow it."
        />
        <WorkFilter domains={DOMAINS} items={items} />
      </Section>
    </main>
  );
}
