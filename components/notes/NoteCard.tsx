import type { Note } from "@/lib/notes";
import { Label } from "@/components/ui/Label";
import { formatNoteDate } from "./format";

type NoteCardProps = {
  note: Note;
};

/**
 * The wireframe's note card, minus the photograph it had no real image for.
 * Every card is a jump link to the note printed in full further down the page,
 * so the card is a contents entry rather than a teaser for another route.
 */
export function NoteCard({ note }: NoteCardProps) {
  return (
    <a
      href={`#${note.slug}`}
      className="group flex flex-1 flex-col border-2 border-line bg-white p-[15px] text-ink no-underline hover:bg-accent-blue"
    >
      <Label>{`note / ${note.number}`}</Label>
      <span className="mt-[10px] block font-display text-[24px] leading-[1.12] tracking-[-0.03em] group-hover:underline">
        {note.title}
      </span>
      <span className="mt-[7px] block">{note.dek}</span>
      <span className="mt-auto flex items-baseline justify-between gap-3 pt-[18px] font-mono text-[11px] uppercase text-muted">
        <time dateTime={note.date}>{formatNoteDate(note.date)}</time>
        <span>{note.readingMinutes} min read</span>
      </span>
    </a>
  );
}

export default NoteCard;
