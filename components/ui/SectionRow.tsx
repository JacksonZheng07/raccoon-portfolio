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

/** The section header pattern: numbered kicker, display heading, muted note. */
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
          className="m-0 font-display text-[46px] tracking-[-0.05em] max-[740px]:mb-2 max-[740px]:text-[40px]"
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
