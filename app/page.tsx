import type { Metadata } from "next";
import { DebrisTrail } from "@/components/detective/DebrisTrail";
import { Investigator } from "@/components/detective/Investigator";
import { Litter, type LitterName } from "@/components/detective/Litter";
import { TrashCan } from "@/components/detective/TrashCan";
import { MoonPhases } from "@/components/nature/MoonPhases";
import { ScatterMark, type ScatterName } from "@/components/nature/ScatterMark";
import { Specimen } from "@/components/nature/Specimen";
import { TapeStrip } from "@/components/nature/TapeStrip";
import { TrackTrail } from "@/components/nature/TrackTrail";
import { MaskEyes } from "@/components/raccoon/MaskEyes";
import { RaccoonPeek } from "@/components/raccoon/RaccoonPeek";
import { RingtailRule } from "@/components/raccoon/RingtailRule";
import { Contact } from "@/components/site/Contact";
import motion from "@/components/site/hero-motion.module.css";
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

/*
 * The photographic plates.
 *
 * Real photography sits very proud of a page built out of single-weight line
 * art, so every plate takes the treatment the about portrait already
 * established: a palette tint as the ground and `mix-blend-multiply` on the
 * image over it. Multiply is not a filter effect for its own sake — it pulls
 * each photograph towards one of the four colours the rest of the site is
 * printed in, so the plates read as pasted into the notebook rather than
 * pasted on top of it. No new tokens, no radii, no shadows.
 *
 * Only blue and pink are used as grounds. `--color-accent-green` was tried
 * and abandoned: multiplying a photograph by #c8d66a strips most of the blue
 * channel, and the two woodland shots came back bilious rather than tinted.
 *
 * Provenance for all six is recorded in
 * `public/assets/photos/ATTRIBUTION.md`. Every one is used under the Unsplash
 * License, which asks for no attribution; the file exists because a public
 * repository should be able to account for what it ships.
 */
type PlateSpec = {
  /** File name inside `public/assets/photos/`. */
  file: string;
  /** The specimen number printed under the plate. */
  plate: string;
  /** Descriptive alt text. These carry meaning; none of them is decoration. */
  alt: string;
  /** The notebook's own note on the plate. */
  caption: string;
  /** Palette tint the image multiplies into. Blue or pink only; see below. */
  tint: string;
  /** Crop anchor, chosen per photograph so the animal survives the crop. */
  position: string;
};

const PLATES = {
  dumpster: {
    file: "raccoons-on-dumpster.jpg",
    plate: "plate i",
    alt: "Four raccoons piled against one another on the rim of a blue metal dumpster, a chain-link fence behind them and one ringed tail hanging over the edge",
    caption: "Four of them, one dumpster, no remorse.",
    tint: "bg-accent-blue",
    position: "object-[center_40%]",
  },
  trunk: {
    file: "raccoon-on-tree-trunk.jpg",
    plate: "plate ii",
    alt: "A raccoon looking down from behind the trunk of a large tree at night, most of its body hidden in dark leaves",
    caption: "Watching from the trunk, well after dark.",
    tint: "bg-accent-pink",
    position: "object-[center_25%]",
  },
  fence: {
    file: "raccoon-peeking-fence.jpg",
    plate: "plate iii",
    alt: "A raccoon standing upright on its hind legs, both front paws gripping a wooden fence post, looking straight at the camera",
    caption: "Caught mid-climb, entirely unbothered.",
    tint: "bg-accent-pink",
    position: "object-[62%_35%]",
  },
  deck: {
    file: "raccoon-on-deck.jpg",
    plate: "plate iv",
    alt: "A raccoon walking across the boards of a wooden deck in low sunlight, framed between two railing posts, with dense green foliage behind it",
    caption: "Crossing the deck like it pays rent.",
    tint: "bg-accent-blue",
    position: "object-[40%_center]",
  },
  ferns: {
    file: "raccoon-in-ferns.jpg",
    plate: "plate v",
    alt: "A raccoon sitting upright among dark green ferns in woodland, seen from above, looking up towards the camera",
    caption: "Sat in the ferns, waiting it out.",
    tint: "bg-accent-blue",
    position: "object-[center_28%]",
  },
} satisfies Record<string, PlateSpec>;

/**
 * One bordered photographic plate with its specimen number and note.
 *
 * The window height is passed in by the row rather than derived from the
 * photograph, so every plate in a row is the same depth and the captions
 * under them sit on one line. Five photographs at five native aspect ratios
 * read as an accident; five plates cut to the same window reads as a page.
 */
function Plate({ spec, plateWindow }: { spec: PlateSpec; plateWindow: string }) {
  return (
    <figure className="m-0">
      <div
        className={`relative ${plateWindow} overflow-hidden border-2 border-line ${spec.tint}`}
      >
        {/* eslint-disable-next-line @next/next/no-img-element -- next/image
            drops basePath under images.unoptimized; see the note above. */}
        <img
          src={`${basePath}/assets/photos/${spec.file}`}
          alt={spec.alt}
          loading="lazy"
          className={`absolute inset-0 h-full w-full object-cover ${spec.position} mix-blend-multiply`}
        />
      </div>
      <figcaption className="mt-3 border-t-2 border-line pt-2">
        <span className="block font-mono text-specimen uppercase text-muted">
          {spec.plate}
        </span>
        <span className="mt-1 block text-[13px]">{spec.caption}</span>
      </figcaption>
    </figure>
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

/*
 * The hero drawing carries the page, so it is labelled rather than hidden:
 * a reader who cannot see it should still be told who is looking at them.
 */
const INVESTIGATOR_LABEL =
  "A raccoon holding an oversized magnifying glass up to one eye, so that the eye fills the whole lens, staring straight out of the page with its tongue out";

/*
 * The lens, alive.
 *
 * A second drawing laid exactly over the first: same 340x430 viewBox, same
 * box, same `preserveAspectRatio`, so its coordinates are the investigator's
 * coordinates and the lids land on the glass to the unit. Everything in it is
 * clipped to the lens ellipse, which is why a rectangle can play an eyelid.
 *
 *   the lids   two paper shutters closing on the lens centre line, stroked on
 *              the edge that meets, so the blink reads as drawn and not as a
 *              box passing over a drawing.
 *   the glint  two raked paper bars sweeping across. Paper on paper is
 *              nothing; over the dark of the eye it is a highlight. So the
 *              sweep only shows where light on glass would actually show.
 *
 * Decorative -- the investigator beside it already carries the description.
 */
function LensLife({ className }: { className: string }) {
  return (
    <svg viewBox="0 0 340 430" aria-hidden="true" className={className}>
      <defs>
        <clipPath id="hero-lens-glass">
          <ellipse cx="114" cy="132" rx="63" ry="65" />
        </clipPath>
      </defs>
      <g clipPath="url(#hero-lens-glass)">
        <g
          className={motion.glint}
          fill="var(--color-paper)"
          fillOpacity="0.82"
          stroke="none"
        >
          <path d="M 40 52 L 76 52 L 24 212 L -12 212 Z" />
          <path d="M 90 52 L 105 52 L 53 212 L 38 212 Z" />
        </g>
        <rect
          className={motion.lidTop}
          x="44"
          y="-30"
          width="140"
          height="162"
          fill="var(--color-paper)"
          stroke="currentColor"
          strokeWidth="2"
        />
        <rect
          className={motion.lidBottom}
          x="44"
          y="132"
          width="140"
          height="162"
          fill="var(--color-paper)"
          stroke="currentColor"
          strokeWidth="2"
        />
      </g>
    </svg>
  );
}

/*
 * Five prints walking out of the tipped bin and off towards the panel, each
 * one a single track from the existing trail mark rather than a new drawing.
 * They arrive one at a time, so something walks across the page instead of a
 * trail fading in. The gait alternates above and below the line, and each
 * foot is turned to face along it.
 */
const HERO_PRINTS = [
  { step: "paw1", lift: "mb-0", turn: "rotate-[10deg]" },
  { step: "paw2", lift: "mb-[12px]", turn: "rotate-[-6deg]" },
  { step: "paw3", lift: "mb-[2px]", turn: "rotate-[14deg]" },
  { step: "paw4", lift: "mb-[14px]", turn: "rotate-[-4deg]" },
  { step: "paw5", lift: "mb-[4px]", turn: "rotate-[16deg]" },
] as const;

/*
 * Three pieces of rubbish still coming down when the page opens. They fall
 * the last few centimetres and settle out of their tumble, which is the only
 * entrance in the hero: the headline is never animated.
 */
const HERO_FALLING: {
  mark: LitterName;
  step: string;
  at: string;
  size: string;
}[] = [
  {
    mark: "banana-peel",
    step: "drop1",
    at: "left-[46px] top-[26px]",
    size: "h-[26px] w-[42px]",
  },
  {
    mark: "crumpled-can",
    step: "drop2",
    at: "left-[172px] top-[62px]",
    size: "h-[34px] w-[20px]",
  },
  {
    mark: "apple-core",
    step: "drop3",
    at: "left-[300px] top-[18px] max-[740px]:hidden",
    size: "h-[28px] w-[25px]",
  },
];

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
      {/*
       * The hero.
       *
       * The left half is the page's argument, set in type. The right half is
       * one drawing at a size that has no business being on a portfolio: the
       * investigator is 112% of the panel's width, standing on the bottom
       * rule with its heels cropped by it, so it is cut off rather than
       * framed. The old hero put its raccoon on a modest bordered plate in
       * the middle of the panel, which read as an illustration of a raccoon.
       * Off the plate and over the edge, it reads as a raccoon looking at
       * you.
       *
       * `overflow-hidden` on the band is what makes the crop legitimate:
       * everything oversized is clipped by the section's own rules, so
       * nothing overhangs the page and no scrollbar appears.
       */}
      <section
        aria-labelledby="hero-heading"
        className="tone-paper ruled relative grid min-h-[740px] grid-cols-[1.04fr_.96fr] overflow-hidden border-b-2 border-line max-[740px]:block max-[740px]:min-h-0"
      >
        <div className="relative flex flex-col px-[65px] pb-[40px] pt-[62px] max-[740px]:px-[23px] max-[740px]:pb-9 max-[740px]:pt-[50px]">
          <Mark
            mark="paper-clip"
            className="-right-[10px] top-[128px] h-[38px] w-[21px] text-line max-[740px]:hidden"
          />
          <Label>01 / the investigation</Label>
          <Label className="mt-1">
            Jackson Zheng / CS + Math / Northeastern
          </Label>
          <h1
            id="hero-heading"
            className="mb-[18px] mt-[14px] max-w-[760px] font-display text-display-1"
          >
            i take things{" "}
            <span className="box-decoration-clone bg-accent-blue px-2">
              apart
            </span>{" "}
            to see how they work.
          </h1>
          <p className="max-w-[520px] text-[18px] max-[740px]:text-base">
            Ten builds, opened up with the parts still lying on the table: a
            language runtime written from the tokenizer up, a recovery tracker,
            a flight-emissions comparison. Every case study says what broke,
            what I decided, and what actually shipped.
          </p>
          <p className="mt-3 max-w-[520px] font-mono text-specimen uppercase text-muted">
            the raccoon is not a metaphor. he does the digging.
          </p>
          <div className="mt-7 flex flex-wrap gap-3">
            <Btn href={`${basePath}/work/`}>
              See selected work <span aria-hidden="true">&rarr;</span>
            </Btn>
            <Btn href="#about">About me</Btn>
          </div>
          <div className="relative mt-auto pt-[54px] max-[740px]:pt-9">
            {/*
             * Five prints crossing the page above the index rule. They read on
             * cream, where nothing else is drawn; over the panel they were
             * lost in the investigator's own line work. Off below 1100px,
             * where the column is too narrow to walk across.
             */}
            <span
              aria-hidden="true"
              className="absolute right-0 top-[6px] flex w-[248px] items-end justify-between max-[1100px]:hidden"
            >
              {HERO_PRINTS.map((print) => (
                <span
                  key={print.step}
                  className={`block h-[34px] w-[24px] text-line ${print.lift} ${print.turn} ${motion[print.step]}`}
                >
                  <TrackTrail steps={1} className="h-full w-full" />
                </span>
              ))}
            </span>
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
            {/*
             * The floor of the column: the scroll cue, and the bin somebody
             * already went through. Laid out in flow rather than positioned,
             * so the spill cannot land on the index however wide the column
             * gets. The tipped bin is drawn with its mouth to the left, so the
             * debris continues left rather than contradicting the drawing.
             */}
            <div className="mt-5 flex items-end justify-between gap-6">
              <p
                aria-hidden="true"
                className="m-0 text-[11px] uppercase tracking-[0.08em] text-ink"
              >
                scroll to explore <span>&darr;</span>
              </p>
              <span
                aria-hidden="true"
                className="flex shrink-0 items-end gap-1 max-[740px]:hidden"
              >
                <DebrisTrail
                  count={3}
                  direction="left"
                  className="h-[40px] w-[92px] text-ringtail"
                />
                <TrashCan
                  name="trash-can-tipped"
                  className="h-[92px] w-[121px] text-line"
                />
              </span>
            </div>
          </div>
        </div>
        <div className="tone-blue relative min-h-[740px] overflow-hidden border-l-2 border-line max-[740px]:h-[470px] max-[740px]:min-h-0 max-[740px]:border-l-0 max-[740px]:border-t-2">
          {HERO_FALLING.map((piece) => (
            <span
              key={piece.mark}
              aria-hidden="true"
              className={`pointer-events-none absolute block text-line ${piece.at} ${piece.size} ${motion[piece.step]}`}
            >
              <Litter mark={piece.mark} className="h-full w-full" />
            </span>
          ))}
          {/*
           * The subject. One drawing, one overlay, one shared coordinate
           * space -- see `LensLife`.
           *
           * Sized and placed off the panel's WIDTH, not its height, so the
           * framing survives the band growing with its own copy: `w-[112%]`
           * with the drawing's own aspect ratio, and a negative bottom margin
           * -- percentage margins resolve against the containing block's
           * width, where a percentage `bottom` would resolve against its
           * height and drift. -15.8% of the width is exactly the empty band
           * under the feet, so the animal stands ON the section rule with its
           * heels cropped by it, rather than floating above it with two
           * detached marks showing in the gap.
           *
           * What bleeds and what does not is a decision, not an accident: the
           * tail's outer curve lands at 99% of the panel width, so the tail
           * reads as attached and complete, and the only thing crossing an
           * edge is the plain stub of the magnifier handle at bottom left.
           */}
          <div
            className={`pointer-events-none absolute bottom-0 -left-[10.3%] -mb-[15.8%] block aspect-[34/43] w-[112%] text-ink ${motion.peer}`}
          >
            <Investigator
              name="raccoon-detective"
              label={INVESTIGATOR_LABEL}
              className="h-full w-full"
            />
            <LensLife className="absolute inset-0 h-full w-full" />
          </div>
          {/* Occupied. */}
          <span
            aria-hidden="true"
            className={`pointer-events-none absolute bottom-[16px] left-[6px] z-10 block h-[196px] w-[157px] text-line ${motion.binRock} max-[1100px]:h-[152px] max-[1100px]:w-[122px] max-[740px]:bottom-[10px] max-[740px]:h-[132px] max-[740px]:w-[106px]`}
          >
            <TrashCan name="trash-can-raccoon-inside" className="h-full w-full" />
          </span>
          <Stamp className="absolute right-[34px] top-[38px] z-10">
            CASE
            <br />
            STILL
            <br />
            OPEN
          </Stamp>
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

      <Section id="plates" tone="shell" aria-labelledby="plates-heading">
        <SectionRow
          number="04"
          kicker="field plates"
          headingId="plates-heading"
          heading="The subject, photographed"
          description="Five photographs of the animal the notebook is named after. None of them are mine, all of them are licensed, and the credits are filed beside the files."
          className="reveal"
        />
        <div className="reveal relative grid grid-cols-[1.35fr_1fr] gap-8 max-[740px]:block">
          <div className="relative max-[740px]:mb-8">
            <Plate
              spec={PLATES.dumpster}
              plateWindow="h-[460px] max-[740px]:h-[280px]"
            />
            <TapeStrip
              tilt="left"
              className="absolute -top-[13px] left-[26px] h-[26px] w-[74px] text-line"
            />
          </div>
          <div className="relative">
            <Plate
              spec={PLATES.trunk}
              plateWindow="h-[460px] max-[740px]:h-[280px]"
            />
            <Mark
              mark="push-pin"
              className="-top-[14px] right-[18px] z-10 h-[30px] w-[23px] text-line max-[740px]:hidden"
            />
          </div>
        </div>
        <div className="reveal mt-9 grid grid-cols-3 gap-8 max-[740px]:grid-cols-1">
          <Plate spec={PLATES.fence} plateWindow="h-[300px]" />
          <Plate spec={PLATES.deck} plateWindow="h-[300px]" />
          <Plate spec={PLATES.ferns} plateWindow="h-[300px]" />
        </div>
        <p className="mt-8 border-t-2 border-line pt-4 font-mono text-specimen uppercase text-muted">
          credits{" "}
          <a
            className="text-ink underline"
            href={`${basePath}/assets/photos/ATTRIBUTION.md`}
          >
            assets/photos/attribution.md
          </a>
        </p>
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
                src={`${basePath}/assets/photos/raccoon-portrait-closeup.jpg`}
                alt="Close portrait of a raccoon's face, head tilted, whiskers lit against a dark blurred background"
                className="absolute inset-0 h-full w-full object-cover object-[center_38%] mix-blend-multiply"
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
            <Label>05 / about</Label>
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

      <Contact number="06" />
    </main>
  );
}
