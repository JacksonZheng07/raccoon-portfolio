import type { Metadata } from "next";
import { NoteCard } from "@/components/notes/NoteCard";
import { NoteProse } from "@/components/notes/NoteProse";
import { formatNoteDate } from "@/components/notes/format";
import { PawDivider } from "@/components/raccoon/PawDivider";
import { Label } from "@/components/ui/Label";
import { Section } from "@/components/ui/Section";
import { SectionRow } from "@/components/ui/SectionRow";
import { Stamp } from "@/components/ui/Stamp";
import { getAllNotes } from "@/lib/notes";

/*
 * `next/image` is not an option here: `images.unoptimized` is on for the
 * static export, and an unoptimized image passes `src` through untouched, so
 * it would not pick up `basePath` either. The prefix is therefore explicit.
 */
const BASE_PATH = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

export const metadata: Metadata = {
  title: "Notes — Jackson Zheng",
  description:
    "Three field notes, printed in full: making technical work legible, small tools and real leverage, and learning without the theatre.",
};

export default function NotesPage() {
  const notes = getAllNotes();
  const lastIndex = notes.length - 1;

  return (
    <main>
      <Section className="grid grid-cols-[1.1fr_0.9fr] items-center gap-[56px] max-[740px]:block">
        <div>
          <Label>notes / field notebook</Label>
          <h1 className="m-0 mt-[18px] font-display text-[62px] leading-[0.92] tracking-[-0.065em] max-[740px]:text-[44px]">
            Notes from the notebook
          </h1>
          <p className="mb-0 mt-[24px] max-w-[52ch] font-display text-[18px] leading-[1.65]">
            Three pieces so far, each printed here in full rather than hidden
            behind a card. They are all circling the same question: what a
            project has actually earned the right to claim, and what it still
            owes a reader.
          </p>
        </div>
        <div className="relative border-2 border-line bg-accent-blue px-7 py-8 text-ink max-[740px]:mt-[34px]">
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

      <Section aria-labelledby="notes-contents">
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
      </Section>

      {notes.map((note, index) => (
        <Section
          key={note.slug}
          id={note.slug}
          aria-labelledby={`${note.slug}-title`}
          className={index === lastIndex ? "border-b-0!" : undefined}
        >
          <article className="grid grid-cols-[200px_minmax(0,1fr)] gap-[72px] max-[740px]:block">
            <div className="border-t-2 border-line pt-[10px] max-[740px]:mb-[26px] max-[740px]:flex max-[740px]:items-baseline max-[740px]:justify-between max-[740px]:gap-4">
              <Label>{`note / ${note.number}`}</Label>
              <p className="m-0 mt-[10px] font-mono text-[11px] uppercase leading-[1.7] text-muted max-[740px]:mt-0 max-[740px]:text-right">
                <time dateTime={note.date}>{formatNoteDate(note.date)}</time>
                <br />
                {note.readingMinutes} min read
              </p>
            </div>
            <div>
              <h2
                id={`${note.slug}-title`}
                className="m-0 max-w-[24ch] font-display text-[42px] leading-[1.02] tracking-[-0.05em] max-[740px]:text-[32px]"
              >
                {note.title}
              </h2>
              <div className="mb-[34px] mt-[26px] max-w-[558px] border-t-2 border-line" />
              <NoteProse paragraphs={note.body} />
            </div>
          </article>
          {index === lastIndex ? (
            <PawDivider count={3} className="mt-[64px] text-ringtail" />
          ) : null}
        </Section>
      ))}
    </main>
  );
}
