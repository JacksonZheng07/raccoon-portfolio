import { ScatterMark } from "@/components/nature/ScatterMark";
import { Specimen } from "@/components/nature/Specimen";
import { SpecimenTag } from "@/components/nature/SpecimenTag";
import { Label } from "@/components/ui/Label";
import type { Note } from "@/lib/notes";
import { formatNoteDate, formatWordCount } from "./format";
import { getNoteFurniture } from "./marginalia";

type NoteRailProps = {
  note: Note;
  words: number;
};

/**
 * The left rail beside a printed note: what a specimen drawer label would
 * carry. The number and the date were already here; the word count, the
 * pressed specimen and its tied-on tag are what make the rail read as filed
 * rather than as a byline.
 *
 * The specimen is assigned per note in `marginalia.ts` and repeats on that
 * note's contents card, so the drawing is an identifier a reader can follow
 * down the page rather than an ornament.
 */
export function NoteRail({ note, words }: NoteRailProps) {
  const { specimen, specimenLabel } = getNoteFurniture(note.slug);

  return (
    <div className="relative flex h-full flex-col border-t-2 border-line pt-[12px] max-[740px]:mb-[30px] max-[740px]:block">
      {/* The pin that holds this sheet into the notebook. */}
      <ScatterMark
        mark="push-pin"
        corner="top-right"
        className="h-[30px] w-[22px] text-mask max-[740px]:hidden"
      />
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
      <div className="mt-[26px] flex items-end gap-[14px] border-t-2 border-line pt-[22px] max-[740px]:mt-[16px] max-[740px]:border-t-0 max-[740px]:pt-0">
        <Specimen
          name={specimen}
          className="h-[58px] w-[58px] shrink-0 text-mask max-[740px]:h-[40px] max-[740px]:w-[40px]"
        />
        <SpecimenTag className="h-[76px] w-[54px] shrink-0 text-ringtail max-[740px]:hidden">
          {specimenLabel}
        </SpecimenTag>
      </div>
      {/*
       * The margin rule torn off a sheet of ruled paper, run down the foot of
       * the rail: the mark that says this column is the edge of the page
       * rather than a sidebar. It is drawn tall, so it is used tall.
       */}
      <div className="relative mt-auto h-[104px] max-[900px]:hidden">
        <ScatterMark
          mark="ruled-margin"
          corner="top-left"
          className="h-[104px] w-[38px] text-ringtail"
        />
      </div>
    </div>
  );
}

export default NoteRail;
