import type { ReactNode } from "react";

/**
 * One drawing with a note under it.
 *
 * The drawing is decorative and hidden; the note is not. It is real text,
 * and it is about the raccoon rather than about the project — see
 * `POSE_NOTES` in `case-study-art.ts` for why that distinction is load
 * bearing on pages this carefully hedged.
 *
 * `align` decides which edge the group sits on and which edge the note is
 * set to, so a figure in the right margin reads down its own column instead
 * of centring itself under the drawing.
 */
const ALIGN_CLASS = {
  left: "items-start text-left",
  right: "items-end text-right",
} as const;

export function ArtNote({
  caption,
  align = "right",
  className,
  captionClassName,
  children,
}: {
  caption: string;
  align?: keyof typeof ALIGN_CLASS;
  className?: string;
  /** Set on tinted bands where `muted-strong` is not the right grey. */
  captionClassName?: string;
  children: ReactNode;
}) {
  return (
    <figure
      className={`m-0 flex flex-col ${ALIGN_CLASS[align]}${
        className ? ` ${className}` : ""
      }`}
    >
      <div aria-hidden="true" className="flex items-end gap-3">
        {children}
      </div>
      <figcaption
        className={`mt-[10px] font-mono text-specimen font-bold uppercase ${
          captionClassName ?? "text-muted-strong"
        }`}
      >
        {caption}
      </figcaption>
    </figure>
  );
}

export default ArtNote;
