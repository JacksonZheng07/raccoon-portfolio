import type { ReactNode } from "react";
import { ScatterMark } from "@/components/nature/ScatterMark";

type NoteMarginaliaProps = {
  /** A sentence lifted verbatim out of the essay beside it. */
  quote: string;
  /** Which paragraph it came from, so the mark points at something real. */
  paragraph: number;
  /** The drawing that sits about halfway down the margin. */
  middle?: ReactNode;
  /** The mark that closes the column at the foot of the note. */
  foot?: ReactNode;
};

/**
 * The right-hand margin: the space a 558px measure leaves over on a 1126px
 * band. Three events down its length -- a pull quote at the top, one drawing
 * at the middle, one pressed specimen at the foot -- distributed with
 * `justify-between` so a 440-word note and a 470-word note both end up with
 * an evenly kept margin instead of a cluster at the top and dead paper below.
 *
 * `aria-hidden`, and deliberately so: every word in here is already in the
 * essay a few centimetres to the left, and a screen reader should not read
 * the same sentence twice. It also disappears below 1080px, where there is no
 * margin left to annotate and the prose takes the width back.
 */
export function NoteMarginalia({
  quote,
  paragraph,
  middle,
  foot,
}: NoteMarginaliaProps) {
  return (
    <aside
      aria-hidden="true"
      className="flex h-full flex-col justify-between gap-[60px] max-[1080px]:hidden"
    >
      <div className="relative pl-[26px]">
        <ScatterMark
          mark="bracket"
          corner="top-left"
          className="h-[124px] w-[14px] text-ringtail"
        />
        <p className="m-0 font-display text-[21px] leading-[1.38] text-ink">
          {quote}
        </p>
        <p className="m-0 mt-[14px] font-mono text-specimen uppercase text-muted">
          quoted from paragraph {paragraph}
        </p>
      </div>
      {middle ? <div className="relative pl-[26px]">{middle}</div> : null}
      {foot ? (
        <div className="relative pl-[26px] pb-[6px]">{foot}</div>
      ) : null}
    </aside>
  );
}

export default NoteMarginalia;
