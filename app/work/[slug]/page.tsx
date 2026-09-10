import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { DebrisTrail } from "@/components/detective/DebrisTrail";
import { Investigator } from "@/components/detective/Investigator";
import { TrashCan } from "@/components/detective/TrashCan";
import { NoteProse } from "@/components/notes/NoteProse";
import { MoonPhases } from "@/components/nature/MoonPhases";
import { ScatterMark } from "@/components/nature/ScatterMark";
import { Specimen } from "@/components/nature/Specimen";
import { TrackTrail } from "@/components/nature/TrackTrail";
import { FieldSvg } from "@/components/nature/field-art";
import { MARK_ART } from "@/components/nature/mark-art";
import { Label } from "@/components/ui/Label";
import { Section } from "@/components/ui/Section";
import { SectionRow } from "@/components/ui/SectionRow";
import { ArchitectureSketch } from "@/components/work/case-study/ArchitectureSketch";
import { ArtNote } from "@/components/work/case-study/ArtNote";
import { CaseStudyMasthead } from "@/components/work/case-study/CaseStudyMasthead";
import { CaseStudyNav } from "@/components/work/case-study/CaseStudyNav";
import { CaseTimeline } from "@/components/work/case-study/CaseTimeline";
import { ContributionsList } from "@/components/work/case-study/ContributionsList";
import { TechnicalBreakdown } from "@/components/work/case-study/TechnicalBreakdown";
import {
  BIN_NOTES,
  POSE_NOTES,
  debrisCount,
  flowCount,
  hasSpareBag,
  openItemsBin,
  overviewPose,
  partsCount,
} from "@/components/work/case-study/case-study-art";
import {
  adjacentCaseStudies,
  specimenNumber,
  splitContributions,
} from "@/components/work/case-study/case-study-data";
import { projectSpecimen } from "@/components/work/field-marks";
import {
  getAllProjects,
  getCaseStudyProjects,
  getProject,
  getProjectSlugs,
} from "@/lib/projects";

type CaseStudyPageProps = {
  params: Promise<{ slug: string }>;
};

/*
 * The night band re-lights its own section head: the kicker takes the band's
 * text colour (13.27:1) and the description the shell grey (10.39:1). Plain
 * `--color-muted` would be 4.47:1 there, which misses AA for an 11px label.
 */
const NIGHT_ROW =
  "[&_div]:text-night-text [&_h2]:leading-[1.02] [&_p]:text-shell";

export function generateStaticParams(): { slug: string }[] {
  return getProjectSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: CaseStudyPageProps): Promise<Metadata> {
  const { slug } = await params;
  const project = getProject(slug);

  if (!project) {
    return { title: "Case study not found — Jackson Zheng" };
  }

  return {
    title: `${project.name} — Jackson Zheng`,
    description: project.tagline,
  };
}

export default async function CaseStudyPage({ params }: CaseStudyPageProps) {
  const { slug } = await params;
  const project = getProject(slug);

  if (!project) {
    notFound();
  }

  const projects = getAllProjects();
  const caseStudies = getCaseStudyProjects();
  const { previous, next } = adjacentCaseStudies(caseStudies, project.slug);
  const { bullets, hedges } = splitContributions(project.contributions);
  const specimen = projectSpecimen(projects, project.slug);
  const portrait = overviewPose(projects, project.slug);
  const bin = openItemsBin(projects, project.slug);

  return (
    <main>
      <CaseStudyMasthead
        project={project}
        number={specimenNumber(caseStudies, project.slug)}
        specimen={specimen}
      />

      {/*
        * The band rhythm, and the reason this page is not ten of the same
        * box: paper for the reading sections, shell for the lists, the one
        * ruled band for the build log, blue for the sketch, night for the
        * talking points. Densities follow the weight of what is in them —
        * the overview is one paragraph, the log is the longest thing here.
        */}
      <Section tone="shell" density="tight" aria-labelledby="overview-heading">
        <SectionRow
          number="01"
          kicker="overview"
          heading="What it is"
          headingId="overview-heading"
          description="Written from the repository and the commit history, and no further."
        />
        <div className="grid grid-cols-[minmax(0,1fr)_248px] items-start gap-[52px] max-[740px]:block">
          <NoteProse paragraphs={[project.overview]} />
          {/*
            * The margin of the overview: the investigator this project drew,
            * standing over its own specimen mark. Which pose it is comes from
            * the project's domain and filing order, the same derivation the
            * mark uses — see `case-study-art.ts`. Line art only, no label:
            * the domain caption under it already says what it is.
            */}
          <div className="max-[740px]:hidden">
            <ArtNote caption={POSE_NOTES[portrait]} align="left">
              <Investigator name={portrait} className="w-[248px] text-ink" />
            </ArtNote>
            <div className="mt-[14px] flex items-end gap-3 border-t-2 border-line pt-3">
              <Specimen name={specimen} className="w-[54px] text-ringtail" />
              <Label className="text-muted-strong!">
                {project.domain.toLowerCase()}
              </Label>
            </div>
          </div>
        </div>
      </Section>

      <Section
        tone="paper"
        density="loose"
        ruled
        aria-labelledby="timeline-heading"
      >
        <SectionRow
          number="02"
          kicker="build log"
          heading="How it came together"
          headingId="timeline-heading"
          description="Each entry is one working session or one commit cluster: what changed, and how. The green plate marks what backs it up."
        />
        <CaseTimeline entries={project.timeline} />
        {/*
          * Who wrote the log. Laid out in flow under the last entry rather
          * than positioned over it, so a project with eleven sessions cannot
          * end up with a raccoon printed across its own dates. The coffee
          * ring stays, next to the notepad, where it reads as the desk the
          * notes were taken at.
          */}
        <ArtNote
          caption={POSE_NOTES["raccoon-notepad"]}
          className="mt-[26px]"
        >
          <FieldSvg
            viewBox={MARK_ART["coffee-ring"].viewBox}
            className="block w-[92px] shrink-0 text-ringtail max-[740px]:w-[58px]"
          >
            {MARK_ART["coffee-ring"].art}
          </FieldSvg>
          <Investigator
            name="raccoon-notepad"
            className="w-[248px] shrink-0 text-ink max-[740px]:w-[150px]"
          />
        </ArtNote>
      </Section>

      <Section tone="shell" aria-labelledby="contributions-heading">
        <SectionRow
          number="03"
          kicker="my part"
          heading="What I did"
          headingId="contributions-heading"
          description="Scoped to Jackson's own work, with the source's own caveats kept in and pinned up rather than buried."
        />
        {/*
          * The bag of what was actually found, in the margin beside the
          * list. Hidden under 980px, where the list needs the whole measure.
          */}
        <div className="grid grid-cols-[minmax(0,1fr)_212px] items-start gap-[42px] max-[980px]:block">
          <ContributionsList bullets={bullets} hedges={hedges} />
          <ArtNote
            caption={POSE_NOTES["raccoon-evidence-bag"]}
            align="left"
            className="max-[980px]:hidden"
          >
            <Investigator
              name="raccoon-evidence-bag"
              className="w-[212px] text-ink"
            />
          </ArtNote>
        </div>
      </Section>

      <Section tone="paper" aria-labelledby="technical-heading">
        <SectionRow
          number="04"
          kicker="breakdown"
          heading="The parts list"
          headingId="technical-heading"
          description="The pieces the project is actually made of, by area."
        />
        {/*
          * The parts, and what they came out of.
          *
          * An odd number of areas leaves the last row of cards half empty,
          * and that hole is where the bins go — inside the grid, at the size
          * the hole can carry, rather than parked small under the whole
          * band. An even number of areas leaves no hole, so the bins fall
          * back to a row of their own underneath. Both branches come from
          * the data; neither is a per-project special case.
          *
          * The scatter is as wide as the project has areas, so a three-part
          * build spills less than a five-part one. Height-only sizing keeps
          * each mark's own aspect ratio; a fixed width would squash them.
          */}
        <TechnicalBreakdown
          sections={project.technical}
          gapFigure={
            <ArtNote caption={BIN_NOTES["trash-can-stack"]}>
              <DebrisTrail
                count={partsCount(project)}
                className="h-[52px] w-auto text-ringtail max-[740px]:h-[34px]"
              />
              <TrashCan
                name="trash-can-stack"
                className="w-[300px] shrink-0 text-line max-[980px]:w-[226px] max-[740px]:w-[178px]"
              />
            </ArtNote>
          }
        />
        {project.technical.length % 2 === 0 ? (
          <ArtNote
            caption={BIN_NOTES["trash-can-stack"]}
            className="mt-[30px]"
          >
            <DebrisTrail
              count={partsCount(project)}
              className="h-[52px] w-auto text-ringtail max-[740px]:h-[34px]"
            />
            <TrashCan
              name="trash-can-stack"
              className="w-[300px] shrink-0 text-line max-[740px]:w-[178px]"
            />
          </ArtNote>
        ) : null}
      </Section>

      <Section tone="blue" aria-labelledby="architecture-heading">
        <SectionRow
          number="05"
          kicker="architecture"
          heading="How the data moves"
          headingId="architecture-heading"
          description="The sketch as it was drawn: one step per box, read top to bottom."
        />
        {/*
          * No `.reveal` here, deliberately. The scroll-reveal is driven by a
          * `view()` timeline, and in a viewport taller than the whole page
          * the plate never enters its animation range — it renders at
          * opacity 0 and the diagram is simply gone. A band this important
          * does not get to depend on that.
          */}
        <ArchitectureSketch architecture={project.architecture} />
        {/*
          * The floor of the blue band, which was the largest empty region on
          * the page. The raccoon follows the flow along the ground with the
          * magnifier and the debris runs on ahead of it in the direction the
          * sketch is read, at a size that occupies the hole rather than
          * decorating a corner of it.
          *
          * The top third of this drawing's box is empty — the animal is
          * crouched in the lower two thirds of its own viewBox — so the row
          * carries almost no top margin. That emptiness IS the gap under the
          * sketch; adding another 34px on top of it only reopened the hole.
          */}
        <ArtNote
          caption={POSE_NOTES["raccoon-magnifier-ground"]}
          align="left"
          className="mt-[4px]"
        >
          <Investigator
            name="raccoon-magnifier-ground"
            className="w-[400px] shrink-0 text-ink max-[980px]:w-[300px] max-[740px]:w-[220px]"
          />
          <DebrisTrail
            count={flowCount(project)}
            className="h-[60px] w-auto text-line max-[980px]:h-[46px] max-[740px]:h-[30px]"
          />
        </ArtNote>
      </Section>

      <Section tone="paper" aria-labelledby="evidence-heading">
        <SectionRow
          number="06"
          kicker="evidence"
          heading="What backs this up"
          headingId="evidence-heading"
          description="Where every claim on this page comes from, including the gaps."
        />
        <div className="grid grid-cols-[1.15fr_0.85fr] gap-[52px] max-[740px]:block">
          <ol className="m-0 list-none border-t-2 border-line p-0">
            {project.evidence.map((item, index) => (
              <li
                key={item}
                className="grid grid-cols-[74px_minmax(0,1fr)] gap-4 border-b border-ringtail py-[16px]"
              >
                {/*
                  * The same green plate the build log stamps on an evidence
                  * line, carried over here so the two sections read as one
                  * argument. Ink on accent green is 11.34:1.
                  */}
                <span className="h-fit w-fit border-2 border-line bg-accent-green px-[8px] py-[3px] font-mono text-specimen font-bold uppercase tabular-nums text-ink">
                  src {String(index + 1).padStart(2, "0")}
                </span>
                <span>{item}</span>
              </li>
            ))}
          </ol>
          <div className="relative border-2 border-line bg-accent-pink px-[24px] py-[22px] max-[740px]:mt-8">
            <ScatterMark
              mark="paper-clip"
              corner="top-right"
              className="w-[28px] text-line"
            />
            <Label className="text-muted-strong!">skills demonstrated</Label>
            <p className="m-0 mt-[12px] font-display text-[17px] leading-[1.6] text-ink">
              {project.skillsDemonstrated}
            </p>
          </div>
        </div>
        {/*
          * Dusting for prints, under the sources. This pose was written off
          * as correct-but-not-funny in isolation; against an evidence list it
          * has a job, so it keeps it.
          */}
        <ArtNote caption={POSE_NOTES["raccoon-dusting"]} className="mt-[20px]">
          <Investigator
            name="raccoon-dusting"
            className="w-[264px] shrink-0 text-ink max-[740px]:w-[168px]"
          />
        </ArtNote>
      </Section>

      <Section
        tone="night"
        density="loose"
        aria-labelledby="talking-points-heading"
        className="relative"
      >
        <SectionRow
          number="07"
          kicker="talking points"
          heading="Ask me about"
          headingId="talking-points-heading"
          description="The questions this build left me able to answer properly."
          className={NIGHT_ROW}
        />
        <ul className="m-0 grid list-none grid-cols-2 gap-x-[52px] border-t border-night-line p-0 max-[740px]:block">
          {project.talkingPoints.map((point, index) => (
            <li
              key={point}
              className="flex gap-4 border-b border-night-line py-[16px]"
            >
              <span
                aria-hidden="true"
                className="font-display text-[22px] leading-[1.3] tabular-nums text-accent-green"
              >
                {String(index + 1).padStart(2, "0")}
              </span>
              <span>{point}</span>
            </li>
          ))}
        </ul>
        <div className="mt-[42px] flex items-end justify-between gap-8">
          <MoonPhases className="w-[196px] text-night-line" />
          {/*
            * The raccoon looking back out of the dark. `mask-eyes` was the
            * obvious mark for this band and it does not survive rendering —
            * the mask and the eye whites are both solid fills, so at any
            * size this band can carry it reads as a bowtie. The face past a
            * page edge reads as what it is.
            */}
          {/*
            * A torch in the dark, which is the one place this pose works: on
            * paper it is a raccoon holding a tube, and on the night band it
            * is the only thing in the room with a light.
            *
            * Drawn in ink, not in the band's own cream: these figures carry
            * paper-coloured fills, so a cream stroke on the night band loses
            * every interior line and the animal comes back as one blank
            * blob. Ink keeps the fills reading as the lit shape and the line
            * work reading on top of them, which is what a torch in the dark
            * should look like.
            */}
          <ArtNote
            caption={POSE_NOTES["raccoon-flashlight"]}
            captionClassName="text-shell"
          >
            <Investigator
              name="raccoon-flashlight"
              className="w-[208px] shrink-0 text-line max-[740px]:w-[136px]"
            />
          </ArtNote>
        </div>
      </Section>

      <Section tone="shell" density="tight" aria-labelledby="open-items-heading">
        {/*
          * A torn page edge across the head of the band. The drawing is one
          * 120-unit tile and it keeps its aspect ratio, so the strip is laid
          * as six of them rather than one stretched wide.
          */}
        <div aria-hidden="true" className="mb-[30px] flex w-full text-ringtail">
          {Array.from({ length: 6 }, (_, tile) => (
            <FieldSvg
              key={tile}
              viewBox={MARK_ART["torn-edge"].viewBox}
              className="block w-1/6"
            >
              {MARK_ART["torn-edge"].art}
            </FieldSvg>
          ))}
        </div>
        <SectionRow
          number="08"
          kicker="open items"
          heading="What this page still owes"
          headingId="open-items-heading"
          description="The project's own follow-up list, published unedited rather than quietly dropped."
        />
        <ul className="m-0 grid list-none grid-cols-2 gap-x-[44px] p-0 max-[740px]:block">
          {project.followUps.map((item) => (
            <li
              key={item}
              className="flex gap-3 border-b border-ringtail py-[11px] text-muted"
            >
              <span aria-hidden="true" className="font-mono">
                &#9633;
              </span>
              <span>{item}</span>
            </li>
          ))}
        </ul>
        {/*
          * The joke the section was already making, drawn. Which bin turns up
          * comes from the project's filing order, and how much has come out
          * of it from the length of the list above — a page that owes eight
          * things spills more than one that owes five, and past eight there
          * is a bag beside the bin as well.
          */}
        <ArtNote caption={BIN_NOTES[bin]} className="mt-[26px]">
          <DebrisTrail
            count={debrisCount(project)}
            direction="left"
            className="h-[56px] w-auto text-ringtail max-[740px]:h-[34px]"
          />
          {hasSpareBag(project) ? (
            <TrashCan
              name="trash-bag"
              className="w-[92px] shrink-0 text-line max-[740px]:hidden"
            />
          ) : null}
          <TrashCan
            name={bin}
            className="w-[252px] shrink-0 text-line max-[740px]:w-[168px]"
          />
        </ArtNote>
      </Section>

      <Section tone="paper" density="tight">
        <CaseStudyNav previous={previous} next={next} />
        <TrackTrail
          steps={8}
          className="mx-auto mt-[42px] w-[240px] text-ringtail"
        />
      </Section>
    </main>
  );
}
