import { Label } from "@/components/ui/Label";
import type { Note } from "@/lib/notes";
import { formatNoteDate, formatWordCount } from "./format";

type NoteRailProps = {
  note: Note;
  words: number;
};

/**
 * The left rail beside a printed note: what a specimen drawer label would
 * carry. The number and the date were already here; the word count, the
 * pressed specimen and its tied-on tag are what make the rail read as filed
 * rather than as a byline.
 */
export function NoteRail({ note, words }: NoteRailProps) {
  return (
    <div className="relative flex h-full flex-col border-t-2 border-line pt-[12px] max-[740px]:mb-[30px] max-[740px]:block">
      <Label>{`note / ${note.number}`}</Label>
      <div className="mt-[12px] font-mono text-specimen uppercase text-muted max-[740px]:mt-[8px] max-[740px]:flex max-[740px]:flex-wrap max-[740px]:gap-x-4">
        <div>
          <time dateTime={note.date}>{formatNoteDate(note.date)}</time>
        </div>
        <div className="mt-[6px] max-[740px]:mt-0">
          {formatWordCount(words)} words
        </div>
        <div className="mt-[6px] max-[740px]:mt-0">
          {note.readingMinutes} min read
        </div>
      </div>
      {/*
       * The margin rule torn off a sheet of ruled paper, run down the foot of
       * the rail: the mark that says this column is the edge of the page
       * rather than a sidebar. It is drawn tall, so it is used tall.
       */}
    </div>
  );
}

export default NoteRail;
