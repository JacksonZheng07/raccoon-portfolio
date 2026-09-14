import type { Metadata } from "next";
import type { ReactNode } from "react";
import { DebrisTrail } from "@/components/detective/DebrisTrail";
import { Investigator } from "@/components/detective/Investigator";
import { SpecimenCard } from "@/components/detective/SpecimenCard";
import { TrashCan } from "@/components/detective/TrashCan";
import { FieldSvg } from "@/components/nature/field-art";
import { MoonPhases } from "@/components/nature/MoonPhases";
import { ScatterMark, type ScatterName } from "@/components/nature/ScatterMark";
import { Specimen } from "@/components/nature/Specimen";
import { TapeStrip } from "@/components/nature/TapeStrip";
import { TrackTrail } from "@/components/nature/TrackTrail";
import { RingtailRule } from "@/components/raccoon/RingtailRule";
import { Contact } from "@/components/site/Contact";
import motion from "@/components/site/hero-motion.module.css";
import { Btn } from "@/components/ui/Btn";
import { Label } from "@/components/ui/Label";
import { Section } from "@/components/ui/Section";
import { SectionRow } from "@/components/ui/SectionRow";
import { CaseRail } from "@/components/work/CaseRail";
import { getAllNotes } from "@/lib/notes";
import { getPageText, splitMarked } from "@/lib/page-text";
import {
  getAllProjects,
  getCaseStudyProjects,
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

/*
 * Every word on this page that is editorial rather than structural lives in
 * content/pages/home.txt. Reword it there and rebuild; nothing in this file
 * needs touching. A key that does not exist throws at build time rather than
 * rendering an empty element, and tests/unit/page-keys.test.ts catches the
 * same mistake before a build is even run.
 */
const t = getPageText("home");

export const metadata: Metadata = {
  // The default title already names the person; the template would repeat it.
  title: SITE_NAME,
  description: t("meta.description"),
  alternates: { canonical: absoluteUrl("/") },
  openGraph: {
    type: "website",
    siteName: SITE_NAME,
    locale: "en_US",
    url: absoluteUrl("/"),
    title: SITE_NAME,
    description: t("meta.description"),
    images: [OG_IMAGE],
  },
  twitter: {
    card: "summary_large_image",
    title: SITE_NAME,
    description: t("meta.description"),
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
 * The three instruments, drawn here rather than pulled out of
 * `components/nature`: the library has no wrench, no hand lens and no pad,
 * and the alternative was three more full-size raccoons in a band that
 * already has one holding a torch. Same rules as everything else in the site
 * -- one weight, 2px, `currentColor`, no fill, so `FieldSvg` supplies the
 * stroke settings and these are just the geometry.
 *
 * They are aria-hidden. Each one sits immediately left of the words it
 * illustrates, so a screen reader that read them out would say the theme
 * twice.
 */
type InstrumentName = "wrench" | "hand-lens" | "notepad";

const INSTRUMENT_ART: Record<InstrumentName, { viewBox: string; art: ReactNode }> = {
  // An open-jaw spanner: two prongs, a shaft, a ring end.
  wrench: {
    viewBox: "0 0 52 62",
    art: (
      <>
        <path d="M 12 5 L 12 22 L 20 29 L 20 53 L 32 53 L 32 29 L 40 22 L 40 5 L 33 5 L 33 18 L 19 18 L 19 5 Z" />
        <circle cx="26" cy="45" r="3.2" />
      </>
    ),
  },
  // A hand lens, angled the way one is actually held over a page.
  "hand-lens": {
    viewBox: "0 0 56 60",
    art: (
      <>
        <circle cx="24" cy="22" r="15" />
        <path d="M 15 12 C 12 15 11 19 11 22" />
        <path d="M 32 34 L 45 49" />
        <path d="M 37 30 L 50 45" />
        <path d="M 45 49 L 50 45" />
      </>
    ),
  },
  // A wire-bound pad with three ruled lines, the last one short.
  notepad: {
    viewBox: "0 0 52 62",
    art: (
      <>
        <path d="M 12 15 L 40 15 L 40 54 L 12 54 Z" />
        <path d="M 18 26 L 34 26" />
        <path d="M 18 35 L 34 35" />
        <path d="M 18 44 L 28 44" />
        <path d="M 18 15 L 18 8" />
        <path d="M 26 15 L 26 8" />
        <path d="M 34 15 L 34 8" />
      </>
    ),
  },
};

function InstrumentMark({
  name,
  className,
}: {
  name: InstrumentName;
  className: string;
}) {
  const { viewBox, art } = INSTRUMENT_ART[name];
  return (
    <FieldSvg viewBox={viewBox} className={className}>
      {art}
    </FieldSvg>
  );
}

/*
 * One ray of the beam, landing on one observation.
 *
 * A straight run with a cross-tick at the end that touches the row, drawn
 * flat and turned by the caller: four different angles converging back on the
 * torch is what makes four separate elements read as one fan. The turn is
 * about the left end, so every ray lands on the centre line of its own row at
 * the same x and only the far end swings up towards the torch. It is laid out
 * in the flow of its own row rather than positioned absolutely, so a row that
 * wraps to a second line takes its ray with it.
 */
function Ray({ className }: { className: string }) {
  return (
    <span aria-hidden="true" className={`block ${className}`}>
      <svg viewBox="0 0 120 12" className="block h-auto w-full">
        <g fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
          <path d="M 6 6 L 114 6" />
          <path d="M 6 1.5 L 6 10.5" />
        </g>
      </svg>
    </span>
  );
}

/*
 * The four working notes, and what each one is lit by.
 *
 * `instrument` is the drawing filed against the theme, and `ray` is how far
 * the beam has to turn to reach that row from the torch at the top right.
 *
 * 01 has no instrument, and that is the entry rather than an oversight:
 * nothing in the library, and nothing I could draw at 56px, honestly means
 * "fails the way the language it copies fails". A wrench for tools and a pad
 * for notes are literal; a scale bar for conformance would have been me
 * filling the column for symmetry. The ray still lands on it.
 */
const OBSERVATIONS: {
  number: string;
  theme: string;
  note: string;
  instrument?: InstrumentName;
  ray: string;
}[] = [
  {
    number: "01",
    theme: t("observations.1.theme"),
    note: t("observations.1.note"),
    ray: "rotate-0",
  },
  {
    number: "02",
    theme: t("observations.2.theme"),
    note: t("observations.2.note"),
    instrument: "wrench",
    ray: "rotate-[-15deg]",
  },
  {
    number: "03",
    theme: t("observations.3.theme"),
    note: t("observations.3.note"),
    instrument: "hand-lens",
    ray: "rotate-[-32deg]",
  },
  {
    number: "04",
    theme: t("observations.4.theme"),
    note: t("observations.4.note"),
    instrument: "notepad",
    ray: "rotate-[-44deg]",
  },
];

const TIMELINE = [
  {
    when: t("timeline.1.when"),
    what: t("timeline.1.what"),
  },
  {
    when: t("timeline.2.when"),
    what: t("timeline.2.what"),
  },
  {
    when: t("timeline.3.when"),
    what: t("timeline.3.what"),
  },
];

/* The three pressed specimens filed in the margin beside the about copy. */
const PRESSED = [
  { name: "acorn", size: "h-[46px] w-[36px]" },
  { name: "mushroom-cluster", size: "h-[46px] w-[61px]" },
  { name: "berry-cluster", size: "h-[46px] w-[41px]" },
] as const;

/*
 * The pose at the foot of the dark band. It is the one drawing on the page
 * whose subject is the section it sits in -- a light, in the dark -- so it
 * gets a name rather than being hidden: the band's own copy never mentions a
 * torch, and a reader who cannot see the drawing would otherwise lose it.
 */
const FLASHLIGHT_LABEL =
  "A raccoon standing with a lit torch held low in one paw, its beam thrown down and to the left across the dark band";

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

export default function Home() {
  const projects = getAllProjects();
  const caseFiles = getCaseStudyProjects();

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
       * the subject, held whole on a card -- see the panel's own note below
       * for why a photograph gets the opposite treatment from the drawing
       * that used to bleed off this panel's edges.
       *
       * `overflow-hidden` stays on the band. Nothing is deliberately cropped
       * by it any more, but the card's backing sheets are rotated and the
       * roundel is hung off a corner, so it is what guarantees none of that
       * furniture can overhang the page or raise a scrollbar.
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
          <Label>{t("hero.label")}</Label>
          <Label className="mt-1">{t("hero.byline")}</Label>
          <h1
            id="hero-heading"
            className="mb-[18px] mt-[14px] max-w-[760px] font-display text-display-1"
          >
            {/*
              * One sentence in the text file, with the emphasised word marked
              * by asterisks, so rewording the headline does not mean
              * rebalancing three separate keys.
              */}
            {splitMarked(t("hero.heading")).map((run, i) =>
              run.mark ? (
                <span
                  key={i}
                  className="box-decoration-clone bg-citron px-2 text-ink"
                >
                  {run.text}
                </span>
              ) : (
                <span key={i}>{run.text}</span>
              ),
            )}
          </h1>
          <p className="max-w-[520px] text-[18px] max-[740px]:text-base">
            {t("hero.intro")}
          </p>
          <p className="mt-3 max-w-[520px] font-mono text-specimen uppercase text-muted">
            {t("hero.aside")}
          </p>
          <div className="mt-7 flex flex-wrap gap-3">
            <Btn href={`${basePath}/work/`}>
              {t("hero.cta")} <span aria-hidden="true">&rarr;</span>
            </Btn>
            <Btn href="#about">{t("hero.cta-secondary")}</Btn>
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
                {t("hero.scroll")} <span>&darr;</span>
              </p>
              <span
                aria-hidden="true"
                className="flex shrink-0 items-end gap-1 max-[740px]:hidden"
              >
                <DebrisTrail
                  count={3}
                  direction="left"
                  className="h-[40px] w-[92px] text-figure"
                />
                <TrashCan
                  name="trash-can-tipped"
                  className="h-[92px] w-[121px] text-line"
                />
              </span>
            </div>
          </div>
        </div>
        {/*
         * The subject: one photographed specimen, filed.
         *
         * The panel that used to be here held a drawn investigator at 112% of
         * its own width, cropped by the section rule, plus a blinking lens, an
         * occupied bin and three pieces of falling rubbish. That composition
         * worked because every piece of it was the same ink line -- the
         * oversize crop read as a character leaning into the page.
         *
         * A photograph cannot be cropped by the page that way. Blown past the
         * edges it stops being a specimen and becomes a background, and the
         * furniture that made the drawing funny would be line art standing
         * next to a rendered animal. So the photograph is given the opposite
         * treatment: held whole, well inside the panel, and framed by the card
         * that makes it evidence rather than decoration.
         *
         * The panel keeps its blue tone and its rule. Its height is measured
         * rather than asserted: at 1440x900 the band is 831px, which is what
         * it already is on main -- the left column sets that, and the capped
         * card stays under it. `min-h-[740px]` is kept as the floor it has
         * always been, not as a description of what renders.
         *
         * Mobile is the one real change: the old panel was a fixed 470px
         * holding a cropped drawing, and this one is about 640px because the
         * card is shown whole. The band grows with it. That is the cost of
         * not cropping the subject, and it falls below the copy and the
         * primary action, which is the reading order the design asks for.
         */}
        <div className="tone-blue relative flex min-h-[740px] items-center justify-center overflow-hidden border-l-2 border-line px-[56px] py-[64px] max-[740px]:min-h-0 max-[740px]:border-l-0 max-[740px]:border-t-2 max-[740px]:px-[23px] max-[740px]:py-[52px] max-[1100px]:px-[34px]">
          <SpecimenCard />
        </div>
      </section>

      <Section id="work" tone="citron" aria-labelledby="work-heading">
        <SectionRow
          number="02"
          kicker={t("work.kicker")}
          headingId="work-heading"
          heading={t("work.heading")}
          description={t("work.description")}
          className="reveal"
        />
        {/*
         * Six bins, one per case study.
         *
         * This band used to be a three-card grid with the flagship card
         * spanning two rows. Its content filled about 400px of a 971px card,
         * so more than half of the loudest thing on the page was empty --
         * the layout was sized by the column beside it rather than by
         * anything it had to say.
         *
         * The bins are uniform, so there is no cell to stretch and nothing
         * to pad. They also replace a separate case-files band further down
         * that was showing the same six projects: one index, not two.
         */}
        <div className="reveal mt-8">
          <CaseRail projects={caseFiles} />
        </div>
        <div className="mt-10 flex items-center justify-center gap-6 max-[740px]:flex-col max-[740px]:gap-4">
          {/* The trail walks in from the grid and stops at the button. */}
          <TrackTrail
            steps={6}
            className="h-[40px] w-[128px] text-figure max-[740px]:hidden"
          />
          <Btn href={`${basePath}/work/`}>
            All {projects.length} projects <span aria-hidden="true">&rarr;</span>
          </Btn>
          <TrackTrail
            steps={6}
            direction="left"
            className="h-[40px] w-[128px] text-figure max-[740px]:hidden"
          />
        </div>
      </Section>

      <Section
        tone="deep"
        density="tight"
        aria-labelledby="observations-heading"
        className="relative"
      >
        <span
          aria-hidden="true"
          className="pointer-events-none absolute left-[14px] top-[30px] block h-[38px] w-[38px] text-muted max-[740px]:hidden"
        >
          <Specimen name="star-cluster" className="h-full w-full" />
        </span>
        {/*
         * The band is one composition rather than a list with a drawing
         * parked under it. The torch is at the top of the right-hand column
         * and its beam leaves the drawing towards its own lower left, which
         * is where the observations are; each row picks the beam back up as
         * a ray turned to the angle that points at the torch. So the copy
         * about the torch landing on four things is something the page shows
         * rather than asserts, and the lower half of the band is no longer
         * empty dark.
         */}
        <div className="reveal grid grid-cols-[minmax(0,1fr)_324px] gap-x-[40px] max-[1240px]:grid-cols-1 max-[1240px]:gap-y-10">
          <div>
            <SectionRow
              number="03"
              kicker={t("observations.kicker")}
              headingId="observations-heading"
              heading={t("observations.heading")}
            />
            {/*
             * The note that used to be `SectionRow`'s `description`, which
             * sets itself at the top right -- exactly where the torch now
             * stands. Under the heading it also stops competing for the same
             * baseline as a 48px display line.
             */}
            <p className="m-0 mb-[34px] max-w-[46ch] text-muted">
              {t("observations.description")}
            </p>
            <ul className="m-0 list-none border-t border-line p-0">
              {OBSERVATIONS.map((observation) => (
                <li
                  key={observation.number}
                  className="grid grid-cols-[56px_168px_minmax(0,1fr)_168px] items-center gap-x-5 border-b border-line py-[20px] max-[1240px]:grid-cols-[56px_168px_minmax(0,1fr)] max-[900px]:grid-cols-[56px_minmax(0,1fr)] max-[900px]:items-start max-[900px]:gap-y-2"
                >
                  <span
                    aria-hidden="true"
                    className="flex h-[54px] items-center justify-start max-[900px]:h-[44px]"
                  >
                    {observation.instrument ? (
                      <InstrumentMark
                        name={observation.instrument}
                        className="h-full w-auto text-shell"
                      />
                    ) : null}
                  </span>
                  <div className="max-[900px]:flex max-[900px]:items-baseline max-[900px]:gap-3">
                    <b className="block font-display text-display-4 font-normal text-ink">
                      {observation.number}
                    </b>
                    <span className="mt-[3px] block font-mono text-specimen uppercase max-[900px]:mt-0">
                      {observation.theme}
                    </span>
                  </div>
                  <p className="m-0 text-[13px] max-[900px]:col-start-2 max-[900px]:mt-1">
                    {observation.note}
                  </p>
                  {/* Where the beam lands. Hidden once the torch is no longer beside it. */}
                  <Ray
                    className={`${observation.ray} origin-left text-muted max-[1240px]:hidden`}
                  />
                </li>
              ))}
            </ul>
          </div>
          <div className="flex flex-col items-end justify-between gap-9 max-[1240px]:flex-row max-[1240px]:flex-wrap max-[1240px]:items-end max-[1240px]:justify-between">
            <Investigator
              name="raccoon-flashlight"
              label={FLASHLIGHT_LABEL}
              /*
               * The poses fill their solid areas with `--color-surface` so they
               * sit on cream stock. Remapping that one variable inside this
               * drawing turns every fill into the band's own dark ground, so
               * what is left is the line work in shell -- 10.39:1 on night --
               * instead of a cream cut-out glowing on a dark band.
               */
              className="h-auto w-[324px] text-shell [--color-surface:var(--color-night)] max-[1240px]:w-[224px] max-[740px]:w-[188px]"
            />
            {/*
             * The litter at the outer edge of the fan: the beam finds four
             * questions, and it finds this.
             */}
            <div className="self-start max-[1240px]:self-end max-[740px]:hidden">
              <DebrisTrail
                count={5}
                direction="left"
                className="h-auto w-[176px] text-muted"
              />
              <p className="m-0 mt-[10px] font-mono text-specimen uppercase text-muted">
                what it also found
              </p>
            </div>
            <MoonPhases className="h-[30px] w-[150px] shrink-0 text-muted max-[740px]:w-[112px]" />
          </div>
        </div>
      </Section>

      <Section
        id="about"
        tone="tangerine"
        density="loose"
        ruled
        aria-labelledby="about-heading"
      >
        <div className="mb-12 flex items-center gap-6" aria-hidden="true">
          <RingtailRule className="w-[260px] shrink-0 text-line max-[740px]:w-[180px]" />
          <span className="block h-0 flex-1 border-t border-figure" />
        </div>
        <div className="grid grid-cols-[.7fr_1.3fr] gap-12 max-[740px]:block">
          <div className="reveal relative max-[740px]:mb-8">
            <figure className="relative m-0 h-[410px] overflow-hidden border-2 border-line bg-plate max-[740px]:h-[340px]">
              {/* eslint-disable-next-line @next/next/no-img-element -- next/image
                  drops basePath under images.unoptimized; see the note above. */}
              <img
                src={`${basePath}/assets/photos/raccoon-portrait-closeup.jpg`}
                alt="Close portrait of a raccoon's face, head tilted, whiskers lit against a dark blurred background"
                className="absolute inset-0 h-full w-full object-cover object-[center_38%]"
              />
              <figcaption className="absolute bottom-3 left-3 border-2 border-line bg-surface px-[9px] py-[7px] font-mono text-specimen">
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
                    className={`${pressed.size} text-figure`}
                  />
                </span>
              ))}
            </div>
            {/*
             * Somebody has to have looked at those three pressed specimens,
             * and the ruled paper under them was empty. The pose is the
             * ground-level one, crouched over what it found, so it is drawn
             * looking back up the column at the strip above it.
             */}
            <div className="mt-7 flex items-end justify-between gap-5 border-t border-figure pt-6 max-[740px]:hidden">
              <p className="m-0 max-w-[15ch] font-mono text-specimen uppercase leading-[1.7] text-muted">
                {t("about.specimens-note")}
              </p>
              <Investigator
                name="raccoon-magnifier-ground"
                className="h-auto w-[132px] shrink-0 text-ink"
              />
            </div>
          </div>
          <div className="reveal">
            <Label>{t("about.kicker")}</Label>
            <h2
              id="about-heading"
              className="mb-5 mt-2 font-display text-display-2 max-[740px]:text-[38px]"
            >
              {t("about.heading")}
            </h2>
            {/* Two paragraphs in the file, separated by a blank line. */}
            {t.paragraphs("about.body").map((para, i) => (
              <p
                key={i}
                className={`max-w-[640px] text-[18px] max-[740px]:text-base${
                  i > 0 ? " mt-4" : ""
                }`}
              >
                {para}
              </p>
            ))}
            <dl className="mt-[30px] border-t-2 border-line">
              {TIMELINE.map((row) => (
                <div
                  key={row.when}
                  className="grid grid-cols-[100px_1fr] border-b border-figure py-[14px] max-[740px]:grid-cols-1 max-[740px]:gap-1"
                >
                  <dt className="font-mono text-specimen uppercase">
                    {row.when}
                  </dt>
                  <dd className="m-0">{row.what}</dd>
                </div>
              ))}
            </dl>
            {/*
             * What used to be here was a hundred pixels of blank ruled paper
             * and a coffee ring parked on top of the last line of the
             * timeline. The bin is the honest end of the band: a NOW / BEFORE
             * / NEXT list is a tidied account, and this is the pile it was
             * tidied out of. The mug moves down here too, where it stops
             * sitting on a sentence.
             */}
            <div className="relative mt-[42px] flex items-end justify-between gap-6 max-[740px]:mt-[30px] max-[740px]:flex-wrap max-[740px]:gap-5">
              <div className="max-[740px]:order-2">
                <p className="m-0 mb-[10px] max-w-[30ch] font-mono text-specimen uppercase leading-[1.7] text-muted">
                  {t("about.cuttings-note")}
                </p>
                {/* The spill leaves the bin to its left, so the trail does too. */}
                <DebrisTrail
                  count={5}
                  direction="left"
                  className="h-auto w-[176px] max-w-full text-figure"
                />
              </div>
              <TrashCan
                name="trash-can-tipped"
                className="h-auto w-[192px] shrink-0 text-line max-[740px]:order-1 max-[740px]:w-[144px]"
              />
              <Mark
                mark="coffee-ring"
                className="bottom-[6px] left-[214px] h-[48px] w-[48px] text-figure max-[900px]:hidden"
              />
            </div>
          </div>
        </div>
      </Section>

      <Contact
        number="05"
        heading={t("contact.heading")}
        body={t("contact.body")}
        cta={t("contact.cta")}
      />
    </main>
  );
}
