import type { Metadata } from "next";
import { ScatterMark } from "@/components/nature/ScatterMark";
import { Specimen } from "@/components/nature/Specimen";
import { TrackTrail } from "@/components/nature/TrackTrail";
import { RaccoonPeek } from "@/components/raccoon/RaccoonPeek";
import { MoonPhases } from "@/components/nature/MoonPhases";
import { RingtailRule } from "@/components/raccoon/RingtailRule";
import { Label } from "@/components/ui/Label";
import { Section } from "@/components/ui/Section";
import { SectionRow } from "@/components/ui/SectionRow";
import { Stamp } from "@/components/ui/Stamp";
import { WorkCard, type CardWeight } from "@/components/work/WorkCard";
import { WorkFilter } from "@/components/work/WorkFilter";
import {
  PRIORITY_BLURB,
  PRIORITY_SPECIMEN,
  projectSpecimen,
} from "@/components/work/field-marks";
import {
  DOMAINS,
  PRIORITY_ORDER,
  getAllProjects,
  getCaseStudyProjects,
  type Priority,
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

/*
 * Rank decides how much room a card gets. This is the whole hierarchy of the
 * page: a Flagship card is a plate with its contributions under it, a Strong
 * card is a plate, a Supporting card is four lines of type and an honest
 * caption. Nothing here is per-project.
 */
const WEIGHT: Record<Priority, CardWeight> = {
  Flagship: "flagship",
  Strong: "standard",
  Supporting: "compact",
};

const LAYOUT: Record<Priority, "pair" | "uniform"> = {
  Flagship: "pair",
  Strong: "pair",
  Supporting: "pair",
};

export default function WorkIndexPage() {
  const projects = getAllProjects();
  const caseStudies = getCaseStudyProjects();
  const repoOnly = projects.length - caseStudies.length;

  const ledger = PRIORITY_ORDER.map((priority) => ({
    priority,
    count: projects.filter((project) => project.priority === priority).length,
  }));

  const groups = PRIORITY_ORDER.map((priority) => ({
    name: priority,
    blurb: PRIORITY_BLURB[priority],
    layout: LAYOUT[priority],
    mark: (
      <Specimen name={PRIORITY_SPECIMEN[priority]} className="w-full" />
    ),
    items: projects
      .filter((project) => project.priority === priority)
      .map((project) => ({
        slug: project.slug,
        domain: project.domain,
        card: (
          <WorkCard
            project={project}
            weight={WEIGHT[priority]}
            specimen={projectSpecimen(projects, project.slug)}
            note={
              priority === "Supporting"
                ? "repo only / no case study"
                : undefined
            }
            href={destination(project)}
          />
        ),
      })),
  }));

  return (
    <main>
      <Section
        tone="paper"
        density="loose"
        className="grid grid-cols-[1.1fr_0.9fr] items-center gap-[56px] max-[740px]:block"
      >
        <div>
          <Label>work / the index</Label>
          <h1 className="m-0 mt-[18px] max-w-[15ch] font-display text-display-1">
            Ten builds, filed and labelled
          </h1>
          <p className="mb-0 mt-[26px] max-w-[54ch] font-display text-[18px] leading-[1.65]">
            All {projects.length} projects, in one list. {caseStudies.length}{" "}
            of them carry a full case study — the problem, the decisions, and
            what actually shipped. The remaining {repoOnly} are smaller
            Supporting builds, and their cards go straight to the repository
            rather than pretending there is more to read.
          </p>
          <div className="mt-[26px] w-[280px] max-w-full">
            <RingtailRule className="text-ringtail" />
          </div>
          <TrackTrail
            steps={5}
            className="mt-[22px] w-[168px] text-ringtail max-[740px]:hidden"
          />
        </div>
        <div className="relative border-2 border-line bg-accent-blue px-7 py-8 text-ink max-[740px]:mt-[34px]">
          <ScatterMark
            mark="push-pin"
            corner="top-left"
            className="w-[34px] text-line"
          />
          <Label className="text-muted-strong!">field ledger</Label>
          <dl className="m-0 mt-4 border-t-2 border-line">
            {ledger.map((row) => (
              <div
                key={row.priority}
                className="flex items-baseline justify-between gap-4 border-b border-line py-[11px] font-mono text-[11px] uppercase tracking-[0.08em]"
              >
                <dt>{row.priority}</dt>
                <dd className="m-0 tabular-nums">{row.count}</dd>
              </div>
            ))}
            <div className="flex items-baseline justify-between gap-4 py-[11px] font-mono text-[11px] uppercase tracking-[0.08em]">
              <dt>case studies / repo only</dt>
              <dd className="m-0 tabular-nums">
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
          <ScatterMark
            mark="coffee-ring"
            corner="bottom-left"
            className="w-[62px] text-ringtail"
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

      <Section tone="shell" aria-labelledby="index-heading">
        <SectionRow
          number="01"
          kicker="all projects"
          heading="Sorted by how much there is to say"
          headingId="index-heading"
          description="Flagship first, then Strong, then Supporting; newest end date first inside each group. Filter by domain to narrow it."
        />
        <WorkFilter domains={DOMAINS} groups={groups} />
      </Section>

      <Section
        tone="night"
        density="tight"
        aria-labelledby="honesty-heading"
        className="relative"
      >
        <div className="grid grid-cols-[1.15fr_0.85fr] items-center gap-[52px] max-[740px]:block">
          <div>
            <Label>on the short cards</Label>
            <h2
              id="honesty-heading"
              className="m-0 mt-[8px] font-display text-display-3"
            >
              {`${repoOnly} of these stop at the repository`}
            </h2>
            <p className="m-0 mt-[12px] max-w-[62ch] text-night-text">
              The Supporting builds have no write-up behind them, so their
              cards say so and link to the code instead. A card that implied
              otherwise would be the only dishonest thing on this site.
            </p>
          </div>
          <div className="flex items-center justify-end gap-8 max-[740px]:mt-8 max-[740px]:justify-start">
            <MoonPhases className="w-[164px] text-night-line max-[740px]:hidden" />
            {/*
              * `ears-peek` over `mask-eyes` here: rendered, the mask reads as
              * a bowtie at any size this band can carry, because its band and
              * its eye whites are both solid fills. The ears cresting a rim
              * read as a raccoon immediately.
              */}
            <RaccoonPeek variant="ears" className="w-[136px] text-night-line" />
          </div>
        </div>
      </Section>
    </main>
  );
}
