import type { Metadata } from "next";
import { PawDivider } from "@/components/raccoon/PawDivider";
import { RaccoonHero } from "@/components/raccoon/RaccoonHero";
import { RingtailRule } from "@/components/raccoon/RingtailRule";
import { Contact } from "@/components/site/Contact";
import { Btn } from "@/components/ui/Btn";
import { Label } from "@/components/ui/Label";
import { Section } from "@/components/ui/Section";
import { Stamp } from "@/components/ui/Stamp";
import { SectionRow } from "@/components/ui/SectionRow";
import { WorkCard } from "@/components/work/WorkCard";
import { WorkGrid } from "@/components/work/WorkGrid";
import { getAllProjects, type Project } from "@/lib/projects";
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

export default function Home() {
  const projects = getAllProjects();
  const [featured, ...rest] = projects.slice(0, 3);

  return (
    <main>
      <script
        type="application/ld+json"
        // The value is a literal object built above, not user input.
        dangerouslySetInnerHTML={{ __html: JSON.stringify(personJsonLd) }}
      />
      <section
        aria-labelledby="hero-heading"
        className="grid min-h-[650px] grid-cols-[1.1fr_.9fr] border-b-2 border-line max-[740px]:block max-[740px]:min-h-0"
      >
        <div className="px-[65px] pb-[60px] pt-[82px] max-[740px]:px-[23px] max-[740px]:pb-10 max-[740px]:pt-[55px]">
          <Label>Jackson Zheng / CS + Math / Northeastern</Label>
          <h1
            id="hero-heading"
            className="mb-[25px] mt-6 max-w-[760px] font-display text-[clamp(58px,8vw,112px)] leading-[0.86] tracking-[-0.075em] max-[740px]:text-[62px]"
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
        </div>
        <div className="relative min-h-[650px] border-l-2 border-line bg-accent-blue max-[740px]:h-[420px] max-[740px]:min-h-0 max-[740px]:border-l-0 max-[740px]:border-t-2">
          <p
            aria-hidden="true"
            className="absolute left-[28px] top-6 m-0 rotate-180 font-mono text-[12px] text-ink [writing-mode:vertical-rl]"
          >
            01 / meet the raccoon
          </p>
          <div className="absolute bottom-[9%] right-[8%] flex h-[76%] w-[74%] items-center justify-center border-2 border-line bg-paper max-[740px]:bottom-[17%] max-[740px]:h-[70%] max-[740px]:w-[62%]">
            <RaccoonHero className="h-full w-full p-3 text-ink" />
          </div>
          <Stamp className="absolute right-[9%] top-[15%] z-10">
            HELLO
            <br />
            FROM THE
            <br />
            FIELD
          </Stamp>
          <p
            aria-hidden="true"
            className="absolute bottom-[25px] left-[28px] m-0 text-[11px] uppercase tracking-[0.08em] text-ink"
          >
            scroll to explore <span>&darr;</span>
          </p>
        </div>
      </section>

      <Section id="work" aria-labelledby="work-heading">
        <SectionRow
          number="02"
          kicker="selected work"
          headingId="work-heading"
          heading="A few things I've built"
          description="Each case study leads with the problem, the decisions, and what actually shipped — not a screenshot."
          className="[&_h2]:leading-[1.02]"
        />
        <WorkGrid className="mt-5">
          <WorkCard
            project={featured}
            featured
            href={destination(featured)}
          />
          {rest.map((project) => (
            <WorkCard
              key={project.slug}
              project={project}
              href={destination(project)}
            />
          ))}
        </WorkGrid>
        <PawDivider className="mt-10 text-line" count={3} />
        <p className="mt-8 text-center">
          <Btn href={`${basePath}/work/`}>
            All {projects.length} projects <span aria-hidden="true">&rarr;</span>
          </Btn>
        </p>
      </Section>

      <Section
        aria-labelledby="observations-heading"
        className="bg-night text-night-text"
      >
        <SectionRow
          number="03"
          kicker="working notes"
          headingId="observations-heading"
          heading="What I'm paying attention to"
          description="A living snapshot of the questions the work keeps returning to."
          className="[&_div]:text-night-text [&_h2]:leading-[1.02] [&_p]:text-night-text"
        />
        <ul className="m-0 grid list-none grid-cols-4 border-b border-t border-night-line p-0 max-[740px]:grid-cols-2">
          {OBSERVATIONS.map((observation, index) => (
            <li
              key={observation.number}
              className={`border-night-line px-[15px] py-[23px] ${
                index < OBSERVATIONS.length - 1 ? "border-r" : ""
              } max-[740px]:even:border-r-0 max-[740px]:[&:nth-child(-n+2)]:border-b`}
            >
              <b className="mb-[5px] block font-display text-[23px] font-normal text-accent-green">
                {observation.number}
              </b>
              <span className="block font-mono text-[11px] uppercase tracking-[0.08em]">
                {observation.theme}
              </span>
              <p className="m-0 mt-3 text-[13px]">{observation.note}</p>
            </li>
          ))}
        </ul>
      </Section>

      <Section id="about" aria-labelledby="about-heading">
        <div className="mx-auto mb-10 w-[320px] max-w-full">
          <RingtailRule className="text-line" />
        </div>
        <div className="grid grid-cols-[.7fr_1.3fr] gap-12 max-[740px]:block">
          <figure className="relative m-0 h-[410px] overflow-hidden border-2 border-line bg-accent-pink max-[740px]:mb-6 max-[740px]:h-[340px]">
            {/* eslint-disable-next-line @next/next/no-img-element -- next/image
                drops basePath under images.unoptimized; see the note above. */}
            <img
              src={`${basePath}/assets/photos/raccoon-glasses.jpg`}
              alt="A raccoon wearing round spectacles, standing in for a portrait"
              className="absolute inset-0 h-full w-full object-cover object-[center_23%] mix-blend-multiply"
            />
            <figcaption className="absolute bottom-3 left-3 border-2 border-line bg-paper px-[9px] py-[7px] font-mono text-[11px]">
              stand-in / not a photograph of Jackson
            </figcaption>
          </figure>
          <div>
            <Label>04 / about</Label>
            <h2
              id="about-heading"
              className="mb-5 mt-2 font-display text-[55px] leading-[0.95] tracking-[-0.06em] max-[740px]:text-[45px]"
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
            <dl className="mt-[30px] border-t-2 border-line">
              {TIMELINE.map((row) => (
                <div
                  key={row.when}
                  className="grid grid-cols-[100px_1fr] border-b border-ringtail py-[14px] max-[740px]:grid-cols-1 max-[740px]:gap-1"
                >
                  <dt className="font-mono text-[11px] uppercase tracking-[0.08em]">
                    {row.when}
                  </dt>
                  <dd className="m-0">{row.what}</dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </Section>

      <Contact />
    </main>
  );
}
