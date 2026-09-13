import type { ReactNode } from "react";

/**
 * The surface a section paints.
 *
 * `auto` is the default and means "alternate with the neighbouring
 * undecided bands": odd ones stay paper, even ones take the slightly darker
 * shell. That is what stops a nine-section page reading as one long scroll
 * without every page having to hand-assign a surface. `paper` pins a band to
 * cream and takes it out of the alternation; the rest are deliberate
 * choices. Every pairing clears WCAG AA — see the contrast table in
 * `app/globals.css`.
 */
/*
 * Three surfaces, where the light palette had six. Hue is gone, so `blue`,
 * `pink` and `night` no longer name anything: all three meant "a band that
 * is not the base surface", which is what `raised` means.
 */
export type SectionTone =
  | "auto"
  | "deep"
  | "surface"
  | "raised"
  | "high"
  | "plate";

/** How much vertical weight the band carries. */
export type SectionDensity = "normal" | "tight" | "loose";

const TONE_CLASS: Record<SectionTone, string> = {
  auto: "tone-auto",
  deep: "tone-deep",
  surface: "tone-surface",
  raised: "tone-raised",
  high: "tone-high",
  plate: "tone-plate",
};

const DENSITY_CLASS: Record<SectionDensity, string> = {
  normal: "py-[72px] max-[740px]:py-[50px]",
  tight: "py-[42px] max-[740px]:py-[32px]",
  loose: "py-[110px] max-[740px]:py-[68px]",
};

type SectionProps = {
  children: ReactNode;
  id?: string;
  /** The band's surface. Defaults to `auto`. */
  tone?: SectionTone;
  /** The band's vertical rhythm. Defaults to `normal`. */
  density?: SectionDensity;
  /** Adds the faint ruled-notebook lines over the tone. */
  ruled?: boolean;
  className?: string;
  "aria-labelledby"?: string;
};

/** Bordered section wrapper carrying the standard wireframe padding rhythm. */
export function Section({
  children,
  id,
  tone = "auto",
  density = "normal",
  ruled = false,
  className,
  "aria-labelledby": ariaLabelledBy,
}: SectionProps) {
  const classes = [
    TONE_CLASS[tone],
    ruled ? "ruled" : null,
    "border-b-2 border-line px-[65px] max-[740px]:px-[23px]",
    DENSITY_CLASS[density],
    className,
  ].filter((value): value is string => Boolean(value));

  return (
    <section
      id={id}
      aria-labelledby={ariaLabelledBy}
      className={classes.join(" ")}
    >
      {children}
    </section>
  );
}
