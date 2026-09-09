import { Specimen } from "@/components/nature/Specimen";
import { Label } from "@/components/ui/Label";
import type { Note } from "@/lib/notes";
import { formatNoteDate } from "./format";
import { getNoteFurniture } from "./marginalia";

type NoteCardProps = {
  note: Note;
};

/**
 * The wireframe's note card, minus the photograph it had no real image for.
 * Every card is a jump link to the note printed in full further down the page,
 * so the card is a contents entry rather than a teaser for another route.
 *
 * The specimen in the corner is the same drawing that sits in that note's rail
 * below, which is what makes the three cards tell themselves apart at a
 * glance. `tactile` gives it the site's lift-and-press on hover.
 */
export function NoteCard({ note }: NoteCardProps) {
  const { specimen } = getNoteFurniture(note.slug);

  return (
    <a
      href={`#${note.slug}`}
      className="tactile group flex flex-1 flex-col border-2 border-line bg-white p-[15px] text-ink no-underline hover:bg-accent-blue"
    >
      <span className="flex items-start justify-between gap-3">
        <Label>{`note / ${note.number}`}</Label>
        <Specimen
          name={specimen}
          className="-mt-[3px] h-[34px] w-[34px] shrink-0 text-ringtail group-hover:text-mask"
        />
      </span>
      <span className="mt-[8px] block font-display text-display-4 group-hover:underline">
        {note.title}
      </span>
      <span className="mt-[9px] block">{note.dek}</span>
      <span className="mt-auto flex items-baseline justify-between gap-3 pt-[18px] font-mono text-specimen uppercase text-muted">
        <time dateTime={note.date}>{formatNoteDate(note.date)}</time>
        <span>{note.readingMinutes} min read</span>
      </span>
    </a>
  );
}

export default NoteCard;
