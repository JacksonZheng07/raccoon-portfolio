import type { ReactNode } from "react";

type NoteProseProps = {
  paragraphs: readonly string[];
};

/**
 * The reading column. Georgia at 18px on a 558px measure — about 66 characters a
 * line in Georgia — with a paragraph gap wide enough to see the shape of the argument.
 */
export function NoteProse({ paragraphs }: NoteProseProps): ReactNode {
  return (
    <div className="max-w-[558px] font-display text-[18px] leading-[1.72] text-ink">
      {paragraphs.map((paragraph, index) => (
        <p key={index} className={index === 0 ? "m-0" : "mb-0 mt-[26px]"}>
          {paragraph}
        </p>
      ))}
    </div>
  );
}

export default NoteProse;
