import type { ReactNode } from "react";

type NoteProseProps = {
  paragraphs: readonly string[];
};

/**
 * The reading column: Georgia at 18px on a literal 558px measure.
 *
 * 558px is measured, not guessed. Walking a `Range` over the first
 * paragraph's text nodes counts 63 to 71 characters a line, averaging 67 --
 * squarely inside the 45-75 the typographic literature asks for. Georgia's
 * `ch` unit is far wider than its average lowercase letter, so `67ch` here
 * would have set a 700px line and about 84 characters. The pixel value stays.
 *
 * The leading is the one change: 28px rather than 31. It is the pitch of the
 * ruled lines the note bands are printed on (`--field-rule`, a 28px repeat),
 * and the paragraph gap is one whole ruled line, so the prose and the paper
 * share a frequency instead of drifting against each other. 18px on 28px is
 * 1.56, which is inside the range Georgia's large x-height wants.
 */
export function NoteProse({ paragraphs }: NoteProseProps): ReactNode {
  return (
    <div className="max-w-[558px] font-display text-[18px] leading-[28px] text-pretty text-ink">
      {paragraphs.map((paragraph, index) => (
        <p key={index} className={index === 0 ? "m-0" : "mb-0 mt-[28px]"}>
          {paragraph}
        </p>
      ))}
    </div>
  );
}

export default NoteProse;
