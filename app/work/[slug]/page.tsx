import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { NoteProse } from "@/components/notes/NoteProse";
import { PawDivider } from "@/components/raccoon/PawDivider";
import { Label } from "@/components/ui/Label";
import { Section } from "@/components/ui/Section";
import { SectionRow } from "@/components/ui/SectionRow";
import { ArchitectureSketch } from "@/components/work/case-study/ArchitectureSketch";
import { CaseStudyMasthead } from "@/components/work/case-study/CaseStudyMasthead";
import { CaseStudyNav } from "@/components/work/case-study/CaseStudyNav";
import { CaseTimeline } from "@/components/work/case-study/CaseTimeline";
import { ContributionsList } from "@/components/work/case-study/ContributionsList";
import { TechnicalBreakdown } from "@/components/work/case-study/TechnicalBreakdown";
import {
  adjacentCaseStudies,
  specimenNumber,
  splitContributions,
} from "@/components/work/case-study/case-study-data";
import {
  getCaseStudyProjects,
  getProject,
  getProjectSlugs,
} from "@/lib/projects";

type CaseStudyPageProps = {
  params: Promise<{ slug: string }>;
};

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

  const caseStudies = getCaseStudyProjects();
  const { previous, next } = adjacentCaseStudies(caseStudies, project.slug);
  const { bullets, hedges } = splitContributions(project.contributions);

  return (
    <main>
      <CaseStudyMasthead
        project={project}
        number={specimenNumber(caseStudies, project.slug)}
      />

      <Section aria-labelledby="overview-heading">
        <SectionRow
          number="01"
          kicker="overview"
          heading="What it is"
          headingId="overview-heading"
          description="Written from the repository and the commit history, and no further."
        />
        <NoteProse paragraphs={[project.overview]} />
      </Section>

      <Section aria-labelledby="timeline-heading">
        <SectionRow
          number="02"
          kicker="build log"
          heading="How it came together"
          headingId="timeline-heading"
          description="Each entry is one working session or one commit cluster: what changed, and how."
        />
        <CaseTimeline entries={project.timeline} />
      </Section>

      <Section aria-labelledby="contributions-heading">
        <SectionRow
          number="03"
          kicker="my part"
          heading="What I did"
          headingId="contributions-heading"
          description="Scoped to Jackson's own work, with the source's own caveats kept in."
        />
        <ContributionsList bullets={bullets} hedges={hedges} />
      </Section>

      <Section aria-labelledby="technical-heading">
        <SectionRow
          number="04"
          kicker="breakdown"
          heading="The parts list"
          headingId="technical-heading"
          description="The pieces the project is actually made of, by area."
        />
        <TechnicalBreakdown sections={project.technical} />
      </Section>

      <Section aria-labelledby="architecture-heading">
        <SectionRow
          number="05"
          kicker="architecture"
          heading="How the data moves"
          headingId="architecture-heading"
          description="The sketch as it was drawn: one step per box, read top to bottom."
        />
        <ArchitectureSketch architecture={project.architecture} />
      </Section>

      <Section aria-labelledby="evidence-heading">
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
                className="grid grid-cols-[46px_minmax(0,1fr)] gap-4 border-b border-ringtail py-[15px]"
              >
                <span
                  aria-hidden="true"
                  /*
                   * `text-muted`, not `text-ringtail`. At 20px normal weight
                   * this sits below the 24px large-text threshold, so it needs
                   * 4.5:1; ringtail on paper is 3.29:1. Being aria-hidden
                   * hides it from assistive tech but not from a sighted
                   * low-vision reader. muted on paper is 5.89:1.
                   */
                  className="font-display text-[20px] leading-[1.3] text-muted"
                >
                  {String(index + 1).padStart(2, "0")}
                </span>
                <span>{item}</span>
              </li>
            ))}
          </ol>
          <div className="border-2 border-line bg-accent-pink px-[24px] py-[22px] max-[740px]:mt-6">
            <Label className="text-ink!">skills demonstrated</Label>
            <p className="m-0 mt-[12px] font-display text-[17px] leading-[1.6]">
              {project.skillsDemonstrated}
            </p>
          </div>
        </div>
      </Section>

      <Section
        aria-labelledby="talking-points-heading"
        className="bg-night text-night-text"
      >
        <SectionRow
          number="07"
          kicker="talking points"
          heading="Ask me about"
          headingId="talking-points-heading"
          description="The questions this build left me able to answer properly."
          className="[&_div]:text-night-text [&_h2]:leading-[1.02] [&_p]:text-night-text"
        />
        <ul className="m-0 grid list-none grid-cols-2 gap-x-[52px] border-t border-night-line p-0 max-[740px]:block">
          {project.talkingPoints.map((point, index) => (
            <li
              key={point}
              className="flex gap-4 border-b border-night-line py-[15px]"
            >
              <span
                aria-hidden="true"
                className="font-display text-[20px] leading-[1.3] text-accent-green"
              >
                {String(index + 1).padStart(2, "0")}
              </span>
              <span>{point}</span>
            </li>
          ))}
        </ul>
      </Section>

      <Section aria-labelledby="open-items-heading">
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
      </Section>

      <Section className="border-b-0!">
        <CaseStudyNav previous={previous} next={next} />
        <PawDivider count={3} className="mt-[52px] text-ringtail" />
      </Section>
    </main>
  );
}
