import type { ReactNode } from "react";
import { Label } from "./Label";

type SectionRowProps = {
  /** The specimen number, e.g. "02". Rendered as "02 /". */
  number: string;
  /** The section heading, set in the display face. */
  heading: ReactNode;
  /** Optional muted description; sits to the right on desktop, stacks below 740px. */
  description?: ReactNode;
  /** Optional words after the slash in the kicker, e.g. "selected work". */
  kicker?: string;
  /** Set when a Section needs to be labelled by this heading. */
  headingId?: string;
  className?: string;
};

/**
 * The section header pattern: numbered kicker, display heading, muted note.
 *
 * The heading takes the `display-2` step of the scale, which carries its own
 * leading (1) and tracking (-0.05em) instead of inheriting the body's 1.5 —
 * that inherited leading was what made every Georgia heading on the site sit
 * slack inside its own box.
 */
export function SectionRow({
  number,
  heading,
  description,
  kicker,
  headingId,
  className,
}: SectionRowProps) {
  return (
    <div
      className={`mb-[30px] flex items-baseline justify-between gap-8 max-[740px]:block max-[740px]:gap-0${
        className ? ` ${className}` : ""
      }`}
    >
      <div>
        <Label>{kicker ? `${number} / ${kicker}` : `${number} /`}</Label>
        <h2
          id={headingId}
          className="m-0 mt-[6px] font-display text-display-2 max-[740px]:mb-2 max-[740px]:text-[38px]"
        >
          {heading}
        </h2>
      </div>
      {description ? (
        <p className="m-0 max-w-[350px] text-muted">{description}</p>
      ) : null}
    </div>
  );
}
