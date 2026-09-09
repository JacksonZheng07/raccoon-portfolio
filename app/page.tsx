import type { Metadata } from "next";
import { MoonPhases } from "@/components/nature/MoonPhases";
import { ScatterMark, type ScatterName } from "@/components/nature/ScatterMark";
import { Specimen } from "@/components/nature/Specimen";
import { TapeStrip } from "@/components/nature/TapeStrip";
import { TrackTrail } from "@/components/nature/TrackTrail";
import { MaskEyes } from "@/components/raccoon/MaskEyes";
import { RaccoonHero } from "@/components/raccoon/RaccoonHero";
import { RaccoonPeek } from "@/components/raccoon/RaccoonPeek";
import { RingtailRule } from "@/components/raccoon/RingtailRule";
import { Contact } from "@/components/site/Contact";
import { Btn } from "@/components/ui/Btn";
import { Label } from "@/components/ui/Label";
import { Section } from "@/components/ui/Section";
import { Stamp } from "@/components/ui/Stamp";
import { SectionRow } from "@/components/ui/SectionRow";
import { WorkCard } from "@/components/work/WorkCard";
import { WorkGrid } from "@/components/work/WorkGrid";
import { getAllNotes } from "@/lib/notes";
import {
  getAllProjects,
  getCaseStudyProjects,
  type Project,
} from "@/lib/projects";
import {
  AUTHOR_EMAIL,
  AUTHOR_GITHUB,
  AUTHOR_NAME,
  OG_IMAGE,
  SITE_NAME,
  absoluteUrl,
} from "@/lib/site";

// next/image is not usable for assets here: with `images: { unoptimized: true }`
// generateImgAttrs returns the src verbatim and never applies basePath. Btn
// renders a plain anchor too, so both need the deploy subpath by hand.
// next/link, used inside WorkCard, does apply it.
const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

const HOME_DESCRIPTION =
  "Jackson Zheng builds language runtimes, parsers and internal tooling, and writes each one up: PyStruct, a Python-inspired runtime written from the tokenizer up, plus AI-assisted internal tooling at Foxfield and seven other projects.";

export const metadata: Metadata = {
  // The default title already names the person; the template would repeat it.
  title: SITE_NAME,
  description: HOME_DESCRIPTION,
  alternates: { canonical: absoluteUrl("/") },
  openGraph: {
    type: "website",
    siteName: SITE_NAME,
    locale: "en_US",
    url: absoluteUrl("/"),
    title: SITE_NAME,
    description: HOME_DESCRIPTION,
    images: [OG_IMAGE],
  },
  twitter: {
    card: "summary_large_image",
    title: SITE_NAME,
    description: HOME_DESCRIPTION,
    images: [{ url: OG_IMAGE.url, alt: OG_IMAGE.alt }],
  },
};

/*
 * Structured data. Every claim here is one this repo can back: the name, the
 * school, the public GitHub account and the email address printed in the
 * contact band. No job title, no photograph, and no social profile that does
 * not exist -- there is no LinkedIn URL anywhere in the source material.
 */
const personJsonLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: AUTHOR_NAME,
  url: absoluteUrl("/"),
  email: `mailto:${AUTHOR_EMAIL}`,
  sameAs: [AUTHOR_GITHUB],
  description:
    "CS + Math student at Northeastern who writes runtimes, parsers and internal tooling, and keeps notes on all of it.",
  affiliation: {
    "@type": "CollegeOrUniversity",
    name: "Northeastern University",
  },
};

/** Flagship and Strong work has a case study; Supporting work has a repo. */
function destination(project: Project): string {
  return project.priority === "Supporting"
    ? project.repo
    : `/work/${project.slug}`;
}

/*
 * One piece of notebook furniture parked at an exact spot.
 *
 * `ScatterMark` places itself in a corner of its containing block, so the
 * anchor span is the containing block: give the span the mark's size and its
 * position and the mark lands there, bled a third of its own width outwards
 * the way a pin pushed through a page overhangs it.
 */
function Mark({
  mark,
  className,
}: {
  mark: ScatterName;
  className: string;
}) {
  return (
    <span
      aria-hidden="true"
      className={`pointer-events-none absolute block ${className}`}
    >
      <ScatterMark mark={mark} corner="top-left" className="h-full w-full" />
    </span>
  );
}

const OBSERVATIONS = [
  {
    number: "01",
    theme: "Reliable systems",
    note: "A runtime is only useful if it fails the way the language it copies fails.",
  },
  {
    number: "02",
    theme: "Human-scale tools",
    note: "Internal tooling earns trust by keeping access scoped and behaviour predictable.",
  },
  {
    number: "03",
    theme: "Visual explanations",
    note: "Showing the AST, the steps and the variables beats describing them.",
  },
  {
    number: "04",
    theme: "Learning in public",
    note: "Every build here carries the notes that were written while it was still fresh.",
  },
];

const TIMELINE = [
  {
    when: "NOW",
    what: "CS + Math at Northeastern, and AI-assisted internal tooling at Foxfield: connector flows, authentication behaviour, and the specs behind them.",
  },
  {
    when: "BEFORE",
    what: "PyStruct, a Python-inspired language runtime written from the tokenizer up. SkyPrint, AfterCare and L3, built inside hackathon weekends. Team work on EmptyNEU and Sprouted.",
  },
  {
    when: "NEXT",
    what: "Deeper systems work, and a team that takes correctness as seriously as shipping.",
  },
];

/* The three pressed specimens filed in the margin beside the about copy. */
const PRESSED = [
  { name: "acorn", size: "h-[46px] w-[36px]" },
  { name: "mushroom-cluster", size: "h-[46px] w-[61px]" },
  { name: "berry-cluster", size: "h-[46px] w-[41px]" },
] as const;

export default function Home() {
  const projects = getAllProjects();
  const [featured, ...rest] = projects.slice(0, 3);

  /*
   * The hero index counts what is actually in `content/`, so it cannot drift
   * from the site: ten project files, the six of them that earn a case study,
   * and the notes in the notebook.
   */
  const fieldIndex = [
    { figure: projects.length, of: "builds filed" },
    { figure: getCaseStudyProjects().length, of: "case studies" },
    { figure: getAllNotes().length, of: "field notes" },
  ];

  return (
    <main>
      <script
        type="application/ld+json"
        // The value is a literal object built above, not user input.
        dangerouslySetInnerHTML={{ __html: JSON.stringify(personJsonLd) }}
      />
      <section
        aria-labelledby="hero-heading"
        className="tone-paper ruled grid min-h-[660px] grid-cols-[1.1fr_.9fr] border-b-2 border-line max-[740px]:block max-[740px]:min-h-0"
      >
        <div className="relative flex flex-col px-[65px] pb-[54px] pt-[76px] max-[740px]:px-[23px] max-[740px]:pb-10 max-[740px]:pt-[55px]">
          <Mark
            mark="paper-clip"
            className="-right-[10px] top-[128px] h-[38px] w-[21px] text-line max-[740px]:hidden"
          />
          <Label>Jackson Zheng / CS + Math / Northeastern</Label>
          <h1
            id="hero-heading"
            className="mb-[22px] mt-[18px] max-w-[760px] font-display text-display-1"
          >
            i take things{" "}
            <span className="box-decoration-clone bg-accent-blue px-2">
              apart
            </span>{" "}
            to see how they work.
          </h1>
          <p className="max-w-[470px] text-[18px] max-[740px]:text-base">
            A field notebook of ten builds — a language runtime, a recovery
            tracker, a flight-emissions comparison — each written up while the
            decisions were still fresh. Start with the raccoon; stay for the
            work.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Btn href={`${basePath}/work/`}>
              See selected work <span aria-hidden="true">&rarr;</span>
            </Btn>
            <Btn href="#about">About me</Btn>
          </div>
          <div className="relative mt-auto pt-[52px] max-[740px]:pt-10">
            <dl className="m-0 grid max-w-[490px] grid-cols-3 border-t-2 border-line pt-[18px]">
              {fieldIndex.map((entry) => (
                <div key={entry.of} className="m-0">
                  <dt className="font-mono text-specimen font-bold uppercase tabular-nums text-muted max-[740px]:text-[10px] max-[740px]:tracking-[0.08em]">
                    {entry.of}
                  </dt>
                  <dd className="m-0 mt-1 font-display text-display-4 tabular-nums">
                    {entry.figure}
                  </dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
        <div className="tone-blue relative min-h-[660px] border-l-2 border-line max-[740px]:h-[430px] max-[740px]:min-h-0 max-[740px]:border-l-0 max-[740px]:border-t-2">
          <p
            aria-hidden="true"
            className="absolute left-[28px] top-6 m-0 rotate-180 font-mono text-specimen-lg text-ink [writing-mode:vertical-rl]"
          >
            01 / meet the raccoon
          </p>
          <span
            aria-hidden="true"
            className="pointer-events-none absolute left-[12%] top-[9%] block h-[40px] w-[31px] text-ringtail max-[740px]:hidden"
          >
            <Specimen name="acorn" className="h-full w-full" />
          </span>
          <span
            aria-hidden="true"
            className="pointer-events-none absolute bottom-[16%] left-[11%] block h-[104px] w-[45px] text-ringtail max-[740px]:bottom-[24%] max-[740px]:left-[7%] max-[740px]:h-[76px] max-[740px]:w-[33px]"
          >
            <Specimen name="cattail" className="h-full w-full" />
          </span>
          <div className="absolute bottom-[11%] right-[7%] flex h-[74%] w-[70%] items-center justify-center border-2 border-line bg-paper max-[740px]:bottom-[18%] max-[740px]:h-[68%] max-[740px]:w-[62%]">
            <RaccoonHero className="h-full w-full p-3 text-ink" />
            <TapeStrip
              tilt="left"
              className="absolute -left-[18px] -top-[13px] h-[26px] w-[72px] text-line"
            />
          </div>
          <Stamp className="absolute right-[8%] top-[13%] z-10">
            HELLO
            <br />
            FROM THE
            <br />
            FIELD
          </Stamp>
          <span
            aria-hidden="true"
            className="pointer-events-none absolute bottom-[4%] right-[9%] block h-[20px] w-[64px] text-line max-[740px]:bottom-[7%]"
          >
            <ScatterMark
              mark="scale-bar"
              corner="top-left"
              className="h-full w-full"
            />
          </span>
          <p
            aria-hidden="true"
            className="absolute bottom-[25px] left-[28px] m-0 text-[11px] uppercase tracking-[0.08em] text-ink"
          >
            scroll to explore <span>&darr;</span>
          </p>
        </div>
      </section>

      <Section id="work" tone="shell" aria-labelledby="work-heading">
        <SectionRow
          number="02"
          kicker="selected work"
          headingId="work-heading"
          heading="A few things I've built"
          description="Each case study leads with the problem, the decisions, and what actually shipped — not a screenshot."
          className="reveal"
        />
        <div className="reveal relative mt-6">
          {/* The raccoon looking over the rim of the featured plate. */}
          <RaccoonPeek
            variant="ears"
            className="absolute left-[46px] top-0 h-[21px] w-[39px] -translate-y-full text-line"
          />
          <Mark
            mark="push-pin"
            className="right-[16px] top-[14px] z-10 h-[30px] w-[23px] text-line max-[740px]:hidden"
          />
          <WorkGrid>
            <WorkCard project={featured} featured href={destination(featured)} />
            {rest.map((project) => (
              <WorkCard
                key={project.slug}
                project={project}
                href={destination(project)}
              />
            ))}
          </WorkGrid>
        </div>
        <div className="mt-10 flex items-center justify-center gap-6 max-[740px]:flex-col max-[740px]:gap-4">
          {/* The trail walks in from the grid and stops at the button. */}
          <TrackTrail
            steps={6}
            className="h-[40px] w-[128px] text-ringtail max-[740px]:hidden"
          />
          <Btn href={`${basePath}/work/`}>
            All {projects.length} projects <span aria-hidden="true">&rarr;</span>
          </Btn>
          <TrackTrail
            steps={6}
            direction="left"
            className="h-[40px] w-[128px] text-ringtail max-[740px]:hidden"
          />
        </div>
      </Section>

      <Section
        tone="night"
        density="tight"
        aria-labelledby="observations-heading"
        className="relative"
      >
        <span
          aria-hidden="true"
          className="pointer-events-none absolute left-[14px] top-[30px] block h-[38px] w-[38px] text-night-line max-[740px]:hidden"
        >
          <Specimen name="star-cluster" className="h-full w-full" />
        </span>
        <SectionRow
          number="03"
          kicker="working notes"
          headingId="observations-heading"
          heading="What I'm paying attention to"
          description="A living snapshot of the questions the work keeps returning to."
          className="reveal"
        />
        <ul className="reveal m-0 grid list-none grid-cols-4 border-b border-t border-night-line p-0 max-[740px]:grid-cols-2">
          {OBSERVATIONS.map((observation, index) => (
            <li
              key={observation.number}
              className={`border-night-line px-[15px] py-[23px] ${
                index < OBSERVATIONS.length - 1 ? "border-r" : ""
              } max-[740px]:even:border-r-0 max-[740px]:[&:nth-child(-n+2)]:border-b`}
            >
              <b className="mb-[5px] block font-display text-display-4 font-normal text-accent-green">
                {observation.number}
              </b>
              <span className="block font-mono text-specimen uppercase">
                {observation.theme}
              </span>
              <p className="m-0 mt-3 text-[13px]">{observation.note}</p>
            </li>
          ))}
        </ul>
        {/* The dark band is the one place the raccoon can just be eyes. */}
        <div className="mt-7 flex items-end justify-between gap-6">
          <MaskEyes className="h-[34px] w-[78px] text-night-line" />
          <MoonPhases className="h-[30px] w-[150px] text-night-line max-[740px]:w-[112px]" />
        </div>
      </Section>

      <Section
        id="about"
        tone="paper"
        density="loose"
        ruled
        aria-labelledby="about-heading"
      >
        <div className="mb-12 flex items-center gap-6" aria-hidden="true">
          <RingtailRule className="w-[260px] shrink-0 text-line max-[740px]:w-[180px]" />
          <span className="block h-0 flex-1 border-t border-ringtail" />
        </div>
        <div className="grid grid-cols-[.7fr_1.3fr] gap-12 max-[740px]:block">
          <div className="reveal relative max-[740px]:mb-8">
            <figure className="relative m-0 h-[410px] overflow-hidden border-2 border-line bg-accent-pink max-[740px]:h-[340px]">
              {/* eslint-disable-next-line @next/next/no-img-element -- next/image
                  drops basePath under images.unoptimized; see the note above. */}
              <img
                src={`${basePath}/assets/photos/raccoon-glasses.jpg`}
                alt="A raccoon wearing round spectacles, standing in for a portrait"
                className="absolute inset-0 h-full w-full object-cover object-[center_23%] mix-blend-multiply"
              />
              <figcaption className="absolute bottom-3 left-3 border-2 border-line bg-paper px-[9px] py-[7px] font-mono text-specimen">
                stand-in / not a photograph of Jackson
              </figcaption>
            </figure>
            {/* Two strips holding the plate down, neither of them square. */}
            <TapeStrip
              tilt="left"
              className="absolute -top-[13px] left-[18px] h-[26px] w-[74px] text-line"
            />
            <TapeStrip
              tilt="right"
              className="absolute -top-[11px] right-[14px] h-[26px] w-[74px] text-line"
            />
            <div className="mt-8 grid grid-cols-3 items-end gap-3 border-t-2 border-line pt-7">
              {PRESSED.map((pressed, position) => (
                <span
                  key={pressed.name}
                  aria-hidden="true"
                  className="relative flex justify-center"
                >
                  {position === 0 ? (
                    <Mark
                      mark="push-pin"
                      className="-top-[13px] left-1/2 h-[28px] w-[21px] text-line"
                    />
                  ) : null}
                  <Specimen
                    name={pressed.name}
                    className={`${pressed.size} text-ringtail`}
                  />
                </span>
              ))}
            </div>
          </div>
          <div className="reveal">
            <Label>04 / about</Label>
            <h2
              id="about-heading"
              className="mb-5 mt-2 font-display text-display-2 max-[740px]:text-[38px]"
            >
              Software should feel considered.
            </h2>
            <p className="max-w-[640px] text-[18px] max-[740px]:text-base">
              I&rsquo;m Jackson, a CS + Math student at Northeastern. The work I
              like sits where structure meets judgment: choosing the right
              abstraction, then making the complicated part legible to whoever
              reads it next.
            </p>
            <p className="mt-4 max-w-[640px] text-[18px] max-[740px]:text-base">
              At Foxfield I build AI-assisted internal tooling for a real estate
              operations platform — connector flows that let approved
              assistants reach internal tools through controlled
              authentication, plus the backend reliability and spec work around
              them. On my own time I write runtimes, parsers and dashboards,
              and I keep notes on all of it, which is what this site is.
            </p>
            <div className="relative">
              <dl className="mt-[30px] border-t-2 border-line">
                {TIMELINE.map((row) => (
                  <div
                    key={row.when}
                    className="grid grid-cols-[100px_1fr] border-b border-ringtail py-[14px] max-[740px]:grid-cols-1 max-[740px]:gap-1"
                  >
                    <dt className="font-mono text-specimen uppercase">
                      {row.when}
                    </dt>
                    <dd className="m-0">{row.what}</dd>
                  </div>
                ))}
              </dl>
              {/* Somebody set a mug down on this page. */}
              <Mark
                mark="coffee-ring"
                className="-bottom-[34px] right-[12px] h-[48px] w-[48px] text-ringtail max-[740px]:hidden"
              />
            </div>
          </div>
        </div>
      </Section>

      <Contact />
    </main>
  );
}
