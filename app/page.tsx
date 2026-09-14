import type { Metadata } from "next";
import { DebrisTrail } from "@/components/detective/DebrisTrail";
import { Investigator } from "@/components/detective/Investigator";
import { SpecimenCard } from "@/components/detective/SpecimenCard";
import { TrashCan } from "@/components/detective/TrashCan";
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
             * Five prints crossing the foot of the column. They read on the
             * bare stock, where nothing else is drawn; over the panel they
             * were lost in the investigator's own line work. Off below
             * 1100px, where the column is too narrow to walk across.
             *
             * They used to sit above the counts rule. The counts are gone and
             * the prints stayed: they are the only thing in the column's
             * floor that is not furniture.
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
        id="about"
        tone="fern"
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
        number="04"
        heading={t("contact.heading")}
        body={t("contact.body")}
        cta={t("contact.cta")}
      />
    </main>
  );
}
