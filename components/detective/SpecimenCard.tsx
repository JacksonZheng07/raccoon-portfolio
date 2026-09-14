import motion from "@/components/site/hero-motion.module.css";

/*
 * next/image is not usable for assets here: with `images: { unoptimized: true }`
 * generateImgAttrs returns the src verbatim and never applies basePath. Same
 * note, same reason, as `Plate` on the home page.
 */
const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

/*
 * The subject is a character in costume, not an observation of an animal, and
 * the description says so: a reader who cannot see it is told about the
 * deerstalker and the magnifier, because those are what make the joke.
 */
const SUBJECT_LABEL =
  "A raccoon in a deerstalker cap and canvas detective's coat, holding a brass magnifying glass up to a small circuit board, its ringed tail raised behind it and a dented blue bin of paper at its side";

/**
 * The hero's specimen card.
 *
 * Three sheets and a ring, which is the whole idea: the photograph is not
 * presented as a photograph but as something filed. A shell backing sheet, a
 * plain cream sheet, and the card itself, each turned by a different amount
 * and each showing along a different edge, so the stack reads as paper that
 * was put down by hand rather than as a drop shadow.
 *
 * The rotations are deliberately small and deliberately unequal. Equal angles
 * read as a graphic; a degree and a half of disagreement reads as a desk.
 *
 * The 460px cap is measured, not chosen by eye. Uncapped, the card grows with
 * the panel and takes the hero band from 831px to 848px at 1440x900, which
 * pushes the "scroll to explore" cue in the other column past the fold on a
 * 900px screen. At 460 the band measures 831px -- the same height the page
 * has on main, where the left column is what sets it.
 *
 * Everything is drawn in palette tokens and hard 2px rules, so the card sits
 * in the same world as the plates in the notebook further down the page --
 * the difference between the two is the furniture around this one, not a
 * different set of materials.
 */
export function SpecimenCard({ className }: { className?: string }) {
  return (
    <figure
      className={`relative m-0 w-full max-w-[460px]${
        className ? ` ${className}` : ""
      }`}
    >
      <div className={`relative ${motion.settle}`}>
        {/*
         * The two sheets under the card. Both are pure furniture: they carry
         * no content, so they are hidden from the reading order entirely.
         *
         * They are inset-0 clones of the card's own box rather than fixed
         * sizes, so the stack keeps its shape when the card grows with the
         * panel instead of the sheets sliding out from under it.
         *
         * The lower sheet is shell rather than the mockup's blue: the
         * panel behind this card is already `--color-accent-blue`, so a
         * blue sheet on it is a shape nobody can see. Shell is the one
         * neutral in the palette that reads against blue and against the
         * cream sheet above it both.
         */}
        <span
          aria-hidden="true"
          className="absolute inset-0 block translate-x-[18px] translate-y-[10px] rotate-[3.5deg] bg-surface-raised"
        />
        <span
          aria-hidden="true"
          className="absolute inset-0 block -translate-x-[12px] translate-y-[6px] -rotate-[2deg] border-2 border-line bg-surface"
        />

        <div className="relative -rotate-[0.75deg] border-2 border-line bg-surface px-5 pb-4 pt-4">
          {/*
           * Both header labels sit at the left, where the footer's two sit at
           * opposite ends. That asymmetry is forced, not chosen: the roundel
           * below is 116px of opaque paper hung on this corner, and it covers
           * the right end of this rule at every card width. A right-aligned
           * label here would not be a label, it would be markup nobody can
           * read. The roundel owns that end of the rule instead.
           */}
          <div className="flex items-baseline gap-3 border-b-2 border-line pb-3">
            <span className="font-mono text-specimen font-bold uppercase tabular-nums text-muted">
              field specimen / 001
            </span>
            <span className="font-mono text-specimen font-bold uppercase text-muted">
              j.z.
            </span>
          </div>

          {/*
           * The window. The photograph's own ground is cooler and lighter
           * than `--color-surface` -- near white against the card's warm cream
           * -- and it is left that way: the kit presents
           * the subject as a print, so the print having its own paper is the
           * point. The 2px rule is what makes that seam deliberate.
           *
           * The native 1122x1402 ratio is held exactly, so `object-cover`
           * crops nothing and the whole character survives at every width.
           */}
          <div className="relative mt-4 aspect-[1122/1402] overflow-hidden border-2 border-line bg-surface">
            {/* eslint-disable-next-line @next/next/no-img-element -- next/image
                drops basePath under images.unoptimized; see the note above. */}
            <img
              src={`${basePath}/assets/photos/raccoon-detective.webp`}
              alt={SUBJECT_LABEL}
              width={1122}
              height={1402}
              /*
               * The one image above the fold on the site's entry page: it is
               * never lazy, and it is the element the largest-contentful-paint
               * will land on, so it is fetched at high priority.
               */
              fetchPriority="high"
              decoding="async"
              className="absolute inset-0 h-full w-full object-cover"
            />
          </div>

          <div className="mt-3 flex items-baseline justify-between gap-4 border-t-2 border-line pt-3">
            <span className="font-mono text-specimen font-bold uppercase text-muted">
              the dumpster detective
            </span>
            <span className="font-mono text-specimen font-bold uppercase text-muted">
              est. curious
            </span>
          </div>
        </div>

        {/*
         * The roundel, overlapping the corner the way a stamp lands half off
         * the page it is stamping. It is the hero's only rust, and the only
         * thing in the composition set in italic -- an annotation added to
         * the card after the fact, not a label printed on it.
         *
         * `Stamp` is the site's rubber stamp: pink, mono, bold, rotated the
         * other way. This is a different object and stays local rather than
         * bending that one into two shapes.
         */}
        <span
          aria-hidden="true"
          className="absolute -right-[8px] -top-[26px] grid h-[116px] w-[116px] rotate-[8deg] place-items-center rounded-full border-2 border-ink bg-mint px-2 text-center font-display text-[12px] italic leading-[1.3] text-ink"
        >
          still investigating.
        </span>
      </div>

      <figcaption className="mt-6 text-center font-mono text-specimen uppercase text-muted">
        good things are worth a closer look.
      </figcaption>
    </figure>
  );
}

export default SpecimenCard;
