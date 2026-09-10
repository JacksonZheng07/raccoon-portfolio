import type { Metadata } from "next";
import { Fragment } from "react";
import Link from "next/link";
import { Investigator } from "@/components/detective/Investigator";
import { TrashCan } from "@/components/detective/TrashCan";
import { ScatterMark } from "@/components/nature/ScatterMark";
import { Specimen } from "@/components/nature/Specimen";
import { TapeStrip } from "@/components/nature/TapeStrip";
import { TrackTrail } from "@/components/nature/TrackTrail";
import { NoteCard } from "@/components/notes/NoteCard";
import { NoteGap } from "@/components/notes/NoteGap";
import {
  NoteMarginalia,
  type MarginBeat,
} from "@/components/notes/NoteMarginalia";
import { NoteProse } from "@/components/notes/NoteProse";
import { NoteRail } from "@/components/notes/NoteRail";
import { daysBetweenNotes, findQuoteParagraph, formatWordCount } from "@/components/notes/format";
import { getNoteFurniture } from "@/components/notes/marginalia";
import { PawDivider } from "@/components/raccoon/PawDivider";
import { RaccoonPeek } from "@/components/raccoon/RaccoonPeek";
import { Label } from "@/components/ui/Label";
import { Section } from "@/components/ui/Section";
import { SectionRow } from "@/components/ui/SectionRow";
import { Stamp } from "@/components/ui/Stamp";
import { countWords, getAllNotes } from "@/lib/notes";
import { OG_IMAGE, SITE_NAME, absoluteUrl } from "@/lib/site";

/*
 * `next/image` is not an option here: `images.unoptimized` is on for the
 * static export, and an unoptimized image passes `src` through untouched, so
 * it would not pick up `basePath` either. The prefix is therefore explicit.
 * The `Link` in the colophon needs no prefix: `next/link` adds it.
 */
const BASE_PATH = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

const NOTES_TITLE = "Notes from the notebook";
const NOTES_DESCRIPTION =
  "Three field notes, printed in full: making technical work legible, small tools and real leverage, and learning without the theatre.";

export const metadata: Metadata = {
  // The root layout appends " — Jackson Zheng".
  title: NOTES_TITLE,
  description: NOTES_DESCRIPTION,
  alternates: { canonical: absoluteUrl("/notes/") },
  openGraph: {
    type: "website",
    siteName: SITE_NAME,
    locale: "en_US",
    url: absoluteUrl("/notes/"),
    title: `${NOTES_TITLE} — Jackson Zheng`,
    description: NOTES_DESCRIPTION,
    images: [OG_IMAGE],
  },
  twitter: {
    card: "summary_large_image",
    title: `${NOTES_TITLE} — Jackson Zheng`,
    description: NOTES_DESCRIPTION,
    images: [{ url: OG_IMAGE.url, alt: OG_IMAGE.alt }],
  },
};

/*
 * What each note keeps in its right margin, top to bottom, under the pull
 * quote. Three beats a note: a raccoon working the case, a bin or a second
 * pose, and a pressed specimen closing the column.
 *
 * Every caption is a fact the essay beside it already states -- the parser
 * date, the confirmed window, the count of trials -- or a joke at the
 * writer's expense that the essay has earned. Nothing here paraphrases the
 * prose, and nothing here is filler: the margin is where the notebook talks
 * back to its own author.
 */
const MARGIN_BEATS: Record<string, readonly MarginBeat[]> = {
  // 001 is about the difference between writing work down and making it
  // checkable, and it ends on a habit: write the timeline from the commits.
  // So: a raccoon taking the note, then the evidence in a bag.
  "making-technical-work-legible": [
    {
      art: (
        <Investigator
          name="raccoon-notepad"
          className="h-auto w-[138px] text-mask"
        />
      ),
      caption: "commits first, memory second",
    },
    // Something looking over the edge of the paper at it, which is the whole
    // subject of the note. No caption: it is a rest for the eye, not a claim.
    {
      art: (
        <div className="w-[148px]">
          <RaccoonPeek variant="ears" className="h-auto w-[62px] text-mask" />
          <div className="border-t-2 border-line" />
        </div>
      ),
    },
    {
      art: (
        <Investigator
          name="raccoon-evidence-bag"
          className="h-auto w-[132px] text-mask"
        />
      ),
      caption: "exhibit a / april 25, 2026",
    },
    {
      art: (
        <Specimen
          name="berry-cluster"
          className="h-[64px] w-[57px] text-ringtail"
        />
      ),
      caption: "collected, still contradictable",
    },
  ],
  // 002 is the note about the tool that got built at the wrong end of the
  // project: filed in his head as a demo feature, wired up in late May, after
  // the hard part was over. It was in the bin the whole time, so the bin is
  // in the margin. The dusting pose is the ten thousand trials.
  "small-tools-real-leverage": [
    {
      art: (
        <TrashCan
          name="trash-can-raccoon-inside"
          className="h-auto w-[122px] text-mask"
        />
      ),
      caption: "filed under demo feature, recovered in may",
    },
    // A ring where the mug stood through all of it.
    {
      art: (
        <div className="relative h-[86px] w-[86px]">
          <ScatterMark
            mark="coffee-ring"
            corner="top-left"
            className="h-[86px] w-[86px] text-ringtail"
          />
        </div>
      ),
    },
    {
      art: (
        <Investigator
          name="raccoon-dusting"
          className="h-auto w-[136px] text-mask"
        />
      ),
      caption: "ten thousand trials, dusted",
    },
    {
      art: (
        <Specimen name="cattail" className="h-[104px] w-[45px] text-ringtail" />
      ),
      caption: "april to may, waiting",
    },
  ],
  // 003 admits what has not been verified and refuses the costume. The lid is
  // the joke the essay sets up: a hackathon weekend is not a platform, and a
  // bin lid is not a hat.
  "learning-without-the-theatre": [
    {
      art: (
        <Investigator
          name="raccoon-magnifier-ground"
          className="h-auto w-[142px] text-mask"
        />
      ),
      caption: "confirmed window: april 11 to 12, 2026",
    },
    // The horizon the 5 AM commit happened under.
    {
      art: (
        <Specimen name="pine-tree" className="h-[92px] w-[61px] text-ringtail" />
      ),
    },
    {
      art: (
        <TrashCan
          name="trash-can-lid-hat"
          className="h-auto w-[128px] text-mask"
        />
      ),
      caption: "the lid is not a hat",
    },
    {
      art: (
        <Specimen
          name="star-cluster"
          className="h-[78px] w-[78px] text-ringtail"
        />
      ),
      caption: "3:08 pm to after 5 am",
    },
  ],
};

export default function NotesPage() {
  const notes = getAllNotes();
  const totalWords = notes.reduce((sum, note) => sum + countWords(note.body), 0);

  return (
    <main>
      <Section
        tone="paper"
        density="loose"
        className="grid grid-cols-[1.1fr_0.9fr] items-center gap-[56px] max-[740px]:block"
      >
        <div>
          <Label>notes / field notebook</Label>
          <h1 className="m-0 mt-[18px] font-display text-display-1">
            Notes from the notebook
          </h1>
          <p className="mb-0 mt-[26px] max-w-[52ch] font-display text-[18px] leading-[28px] text-pretty">
            Three pieces so far, each printed here in full rather than hidden
            behind a card. They are all circling the same question: what a
            project has actually earned the right to claim, and what it still
            owes a reader.
          </p>
          <div className="mt-[30px] flex items-center gap-[18px]">
            <TrackTrail
              steps={5}
              className="h-auto w-[150px] shrink-0 text-ringtail"
            />
            <p className="m-0 font-mono text-specimen uppercase text-muted">
              printed oldest first
            </p>
          </div>
        </div>
        <div className="relative border-2 border-line bg-accent-blue px-7 py-8 text-ink max-[740px]:mt-[40px]">
          <TapeStrip
            tilt="left"
            className="absolute -top-[13px] left-[15%] h-auto w-[104px] text-mask"
          />
          {/* eslint-disable-next-line @next/next/no-img-element -- see BASE_PATH note above */}
          <img
            src={`${BASE_PATH}/assets/raccoon/raccoon-reading.svg`}
            alt="Ink line drawing of a raccoon looking down at an open notebook"
            width={340}
            height={300}
            className="mx-auto block h-auto w-full max-w-[330px]"
          />
          <Stamp className="absolute -right-[14px] -top-[14px]">
            <span>
              {notes.length} notes
              <br />
              filed
            </span>
          </Stamp>
        </div>
      </Section>

      <Section tone="shell" density="tight" aria-labelledby="notes-contents">
        <SectionRow
          number="01"
          kicker="contents"
          heading="What is in here"
          headingId="notes-contents"
          description="Reading times are counted from the words, not rounded up to look substantial."
        />
        <nav aria-label="Notes on this page">
          <ul className="m-0 grid list-none grid-cols-3 gap-4 p-0 max-[740px]:block">
            {notes.map((note) => (
              <li
                key={note.slug}
                className="flex max-[740px]:mb-4 max-[740px]:block"
              >
                <NoteCard note={note} />
              </li>
            ))}
          </ul>
        </nav>
        {/*
         * The trail walks off the contents and into the first note below, and
         * now it walks off towards somebody: the hat is the page saying it
         * intends to treat three essays as three cases. The prints arrive at
         * him rather than leaving, which is what makes him the destination.
         */}
        <div className="mt-[30px] flex items-end justify-end gap-6 max-[740px]:hidden">
          <p className="m-0 max-w-[20ch] pb-[6px] font-mono text-specimen uppercase leading-[1.7] text-muted">
            three cases, all open
          </p>
          <TrackTrail
            steps={7}
            className="h-auto w-[196px] shrink-0 text-ringtail"
          />
          <Investigator
            name="raccoon-deerstalker"
            className="h-auto w-[104px] shrink-0 text-mask"
          />
        </div>
      </Section>

      {notes.map((note, index) => {
        const { quote } = getNoteFurniture(note.slug);
        const next = notes[index + 1];

        return (
          <Fragment key={note.slug}>
            <Section
              id={note.slug}
              tone="paper"
              ruled
              density="loose"
              aria-labelledby={`${note.slug}-title`}
            >
              <article className="grid grid-cols-[172px_minmax(0,558px)_minmax(0,1fr)] gap-x-[52px] max-[1080px]:grid-cols-[172px_minmax(0,1fr)] max-[740px]:block">
                <NoteRail note={note} words={countWords(note.body)} />
                <div>
                  <h2
                    id={`${note.slug}-title`}
                    className="m-0 max-w-[22ch] font-display text-display-2 max-[740px]:text-[32px]"
                  >
                    {note.title}
                  </h2>
                  <p className="m-0 mt-[16px] max-w-[558px] font-display text-[19px] italic leading-[1.45] text-muted">
                    {note.dek}
                  </p>
                  <div className="mb-[30px] mt-[24px] max-w-[558px] border-t-2 border-line" />
                  <NoteProse paragraphs={note.body} />
                </div>
                <NoteMarginalia
                  quote={quote}
                  paragraph={findQuoteParagraph(note.body, quote)}
                  beats={MARGIN_BEATS[note.slug] ?? []}
                />
              </article>
            </Section>

            {next ? (
              <Section
                tone={index === 0 ? "night" : "shell"}
                density="tight"
              >
                <NoteGap
                  days={daysBetweenNotes(note.date, next.date)}
                  variant={index === 0 ? "moon" : "tracks"}
                />
              </Section>
            ) : null}
          </Fragment>
        );
      })}

      <Section tone="pink" density="tight">
        <PawDivider count={3} className="text-mask" />
        <p className="m-0 mt-[22px] text-center font-mono text-specimen uppercase text-muted">
          {notes.length} notes / {formatWordCount(totalWords)} words / printed
          in full above
        </p>
        <p className="m-0 mt-[14px] text-center font-display text-[18px] leading-[1.5]">
          The projects all three keep pointing at are{" "}
          <Link href="/work/" className="link-rule text-ink">
            filed under work
          </Link>
          .
        </p>
      </Section>
    </main>
  );
}
