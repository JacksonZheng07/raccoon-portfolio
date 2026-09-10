import type { ReactNode } from "react";

/** One event in the margin: a drawing, and the notebook's note on it. */
export type MarginBeat = {
  /** The mark. Sized by the caller, because each drawing has its own box. */
  art: ReactNode;
  /**
   * A short mono annotation under it. Six words is the working limit. Left
   * off for the one small mark in each column that is there to give the eye
   * somewhere to land, not to say anything.
   */
  caption?: string;
};

type NoteMarginaliaProps = {
  /** A sentence lifted verbatim out of the essay beside it. */
  quote: string;
  /** Which paragraph it came from, so the mark points at something real. */
  paragraph: number;
  /** The drawings down the rest of the column, top to bottom. */
  beats: readonly MarginBeat[];
};

/**
 * The right-hand margin: the space a 558px measure leaves over on a 1126px
 * band, about 264px of it once the rule and its gutter are taken out.
*
 * The column used to hold three events across roughly 1200px of essay, which
 * `justify-between` spread into two 300px holes -- the quote at the top, a
 * lone mark adrift in the middle, a specimen at the foot, and nothing joining
 * them up. It now holds five, and they hang off a continuous margin rule with
 * a tick where each one meets it, so the run reads as one annotated edge
 * rather than as unrelated drawings on blank paper. Five events over four
 * gaps also brings every gap down to roughly 130px, which is what actually
 * stops the middle thinning out.
 *
 * The rule sits 52px clear of the longest line of prose -- the grid's own
 * column gap -- so nothing in here crowds a sentence.
 *
 * `aria-hidden`, and deliberately so: the quote is already in the essay a few
 * centimetres to the left, the captions annotate drawings a screen reader
 * cannot see, and a reader should not hear the same sentence twice. It also
 * disappears below 1080px, where there is no margin left to annotate and the
 * prose takes the width back.
 */
export function NoteMarginalia({
  quote,
  paragraph,
  beats,
}: NoteMarginaliaProps) {
  return (
    <aside
      aria-hidden="true"
      className="relative flex h-full flex-col justify-between gap-[44px] max-[1080px]:hidden"
    >
      {/* The margin rule the whole column hangs off. */}
      <span className="pointer-events-none absolute bottom-[6px] left-0 top-[6px] block border-l border-ringtail" />
      <div className="relative pl-[26px]">
        <Tick />
        <p className="m-0 font-display text-[21px] leading-[1.38] text-ink">
          {quote}
        </p>
        <p className="m-0 mt-[14px] font-mono text-specimen uppercase text-muted">
          quoted from paragraph {paragraph}
        </p>
      </div>
      {beats.map((beat, index) => (
        <div key={index} className="relative pl-[26px]">
          <Tick />
          {beat.art}
          {beat.caption ? (
            <p className="m-0 mt-[12px] max-w-[30ch] font-mono text-specimen uppercase leading-[1.7] text-muted">
              {beat.caption}
            </p>
          ) : null}
        </div>
      ))}
    </aside>
  );
}

/** The short cross-stroke where one beat meets the margin rule. */
function Tick() {
  return (
    <span className="pointer-events-none absolute left-0 top-[9px] block w-[15px] border-t border-ringtail" />
  );
}

export default NoteMarginalia;
