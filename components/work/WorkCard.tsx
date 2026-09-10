import Link from "next/link";
import { TrashCan, type TrashCanName } from "@/components/detective/TrashCan";
import { ScatterMark } from "@/components/nature/ScatterMark";
import { Specimen, type SpecimenName } from "@/components/nature/Specimen";
import { MaskBadge } from "@/components/raccoon/MaskBadge";
import { Label } from "@/components/ui/Label";
import type { Project } from "@/lib/projects";

/**
 * How much of the grid a card is allowed to take.
 *
 * `flagship` is the plate-and-contributions card, `standard` the plate card,
 * `compact` a typographic row with no plate at all. The index hands these out
 * by priority, which is what makes the grid read as a ranking rather than as
 * twelve equal tiles.
 */
export type CardWeight = "flagship" | "standard" | "compact";

type WorkCardProps = {
  /** The project to describe. The card reads it; it never loads it. */
  project: Project;
  /** Render the two-row plate that anchors the home page's feature grid. */
  featured?: boolean;
  /** The card's rank in the grid. Defaults to `flagship` when `featured`. */
  weight?: CardWeight;
  /** The project's own specimen, from `projectSpecimen`. */
  specimen?: SpecimenName;
  /** An honest caption printed inside the card, e.g. the repo-only note. */
  note?: string;
  /**
   * The bin the card stands beside, from `projectBin`. Drawn on `compact`
   * cards only: those carry no specimen plate, so the bin is the drawing that
   * stops the short cards reading as four lines of type, and a small bin is
   * the honest picture of a project with nothing written up behind it.
   */
  bin?: TrashCanName;
  /** Where the card goes: a case study path, or a repo URL. */
  href: string;
};

function years({ start, end }: Project): string {
  const from = start.slice(0, 4);
  const to = end.slice(0, 4);
  return from === to ? from : `${from}–${to}`;
}

function isExternal(href: string): boolean {
  return href.startsWith("http://") || href.startsWith("https://");
}

const SURFACE: Record<CardWeight, string> = {
  flagship: "bg-accent-blue",
  standard: "bg-white",
  compact: "bg-paper",
};

const PADDING: Record<CardWeight, string> = {
  flagship: "p-[22px]",
  standard: "p-[19px]",
  compact: "px-[19px] py-[17px]",
};

const TITLE: Record<CardWeight, string> = {
  flagship: "text-[38px] max-[740px]:text-[30px]",
  standard: "text-display-3",
  compact: "text-display-4",
};

const MIN_HEIGHT: Record<CardWeight, string> = {
  flagship: "min-h-[430px] max-[740px]:min-h-0",
  standard: "min-h-[390px] max-[740px]:min-h-0",
  compact: "min-h-0",
};

/**
 * One project in the work grid. The whole card is the link, so the hover and
 * focus states cover the same area a pointer already treats as clickable, and
 * `.tactile` gives that area the site's 2px lift on the way in.
 *
 * `data-bin-card` marks that hit area for `BinMagnifier`, which is the only
 * thing reading it. It is an attribute rather than a class so nothing can
 * accidentally style against it, and it costs the card nothing on `/work`,
 * where no magnifier is mounted.
 */
export function WorkCard({
  project,
  featured = false,
  weight,
  specimen,
  note,
  bin,
  href,
}: WorkCardProps) {
  const rank: CardWeight = weight ?? (featured ? "flagship" : "standard");
  const external = isExternal(href);
  const plated = rank !== "compact";
  const wide = rank === "flagship";
  const plateSkills = project.skills.slice(0, wide ? 8 : 4);
  const flow = project.architecture.slice(0, wide ? 7 : 4);

  const mark = specimen ? (
    <Specimen
      name={specimen}
      className={`shrink-0 text-muted ${wide ? "w-[34px]" : "w-[26px]"}`}
    />
  ) : (
    <MaskBadge className="text-ink" />
  );

  /*
   * The bin sits in flow at the foot of the card rather than absolutely, so
   * it can never land on the tagline however narrow the column gets. Its
   * bottom is pulled past the text baseline by a few pixels so the bin looks
   * stood on the row instead of floated above it.
   */
  const binMark =
    bin && !plated ? (
      <span aria-hidden="true" className="-mb-[7px] shrink-0">
        <TrashCan
          name={bin}
          className="h-[88px] w-auto text-line max-[740px]:h-[68px]"
        />
      </span>
    ) : null;

  /*
   * Which of the two bottom rows takes the slack. Only one of them may carry
   * `mt-auto`: give it to both and the browser splits the free space between
   * them, which floats the bin somewhere in the middle of a short card. When
   * the card has a note-and-bin row that row goes to the floor and the stamp
   * line follows it; otherwise the stamp line takes the slack itself. The two
   * cases are separate constants because they set the same property.
   */
  const footed = Boolean(note || binMark);
  const footRowTop = footed ? "mt-auto pt-[14px]" : "mt-[14px]";
  const stampRowTop = footed ? "mt-0" : "mt-auto";

  const body = (
    <>
      {plated ? (
        /*
         * The plate, drawn as the bin the project came out of.
         *
         * A literal taper was tried first and thrown away: the only ways to
         * narrow a real text box are `clip-path`, which cuts the 2px border
         * and eats the descenders of the last mono line, and a `skew`, which
         * leans the type. Neither survives four to seven flow steps at 11px.
         * So the body is straight-sided and the silhouette does the tapering
         * instead: the lid plate overhangs by 15px and the rim under it by
         * 8px, the body sits flush, and the foot steps in by 34px a side.
         * Widest at the rim, straight through the body, narrowest at the base
         * — read top to bottom that is a bin, and the text never moves.
         *
         * Deliberately not the shape the bins were rebuilt away from: no
         * horizontal hooping across the body and no bulge, because together
         * those read as a wine cask.
         */
        <div className="relative">
          {/*
           * The lid, in three parts read from the top: a knob — the one
           * genuine circle the house rules allow — then the lid plate, which
           * overhangs furthest, then the rim lip, which overhangs half as
           * far. One bar was tried and it read as a shelf; the second step is
           * what makes the lid sit *on* something.
           */}
          <span
            aria-hidden="true"
            className="mx-auto block h-[11px] w-[11px] rounded-full border-2 border-line bg-shell"
          />
          <span
            aria-hidden="true"
            className="-mx-[15px] -mt-[2px] block h-[10px] border-2 border-line bg-shell"
          />
          <span
            aria-hidden="true"
            className="-mx-[8px] -mt-[2px] block h-[11px] border-2 border-line bg-shell"
          />

          {/*
           * Side handles, hung off the body flush with the rim's own 8px
           * overhang, so the bin has one silhouette rather than three. The
           * inner border is dropped on each so they read as brackets welded
           * to the body, not as two floating boxes.
           */}
          <span
            aria-hidden="true"
            className="absolute -left-[12px] top-[58px] block h-[38px] w-[12px] border-2 border-r-0 border-line bg-shell"
          />
          <span
            aria-hidden="true"
            className="absolute -right-[12px] top-[58px] block h-[38px] w-[12px] border-2 border-l-0 border-line bg-shell"
          />

          <div
            className={`flex flex-col gap-3 overflow-hidden border-2 border-t-0 border-line bg-paper p-4 ${
              wide
                ? "h-[286px] max-[740px]:h-auto max-[740px]:min-h-[230px]"
                : "h-[196px] max-[740px]:h-auto max-[740px]:min-h-[180px]"
            }`}
          >
            <div className="flex items-start justify-between gap-3">
              {/*
               * Not `SPECIMEN` any more. A specimen is something collected on
               * purpose; this is a bin, and what is listed underneath is what
               * the raccoon got out of it. `RECOVERED` stays in the same
               * evidence-register voice as the rest of the site's labels,
               * says the investigation happened, and is short enough for the
               * narrow cards where `WHAT WAS IN IT` would wrap.
               */}
              <Label>recovered</Label>
              {mark}
            </div>
            <ol className="m-0 flex flex-1 list-none flex-col justify-center gap-[3px] p-0 font-mono text-[11px] uppercase tracking-[0.06em] text-ink">
              {flow.map((step, index) => (
                <li key={step}>
                  {index > 0 ? (
                    <span aria-hidden="true" className="mr-2 text-muted">
                      &darr;
                    </span>
                  ) : null}
                  {step}
                </li>
              ))}
            </ol>
            {plateSkills.length > 0 ? (
              <p className="m-0 font-mono text-[11px] uppercase tracking-[0.06em] text-muted">
                {plateSkills.join(" · ")}
              </p>
            ) : null}
          </div>

          {/* The base, narrower than the body: the taper, done as silhouette. */}
          <span
            aria-hidden="true"
            className="mx-[34px] -mt-[2px] block h-[10px] border-2 border-t-0 border-line bg-shell"
          />
        </div>
      ) : null}

      <div
        className={
          plated ? "mt-[18px]" : "flex items-baseline justify-between gap-4"
        }
      >
        <Label>
          {project.domain.toLowerCase()} · {years(project)}
        </Label>
        {plated ? null : (
          <span className="shrink-0 text-ringtail">
            {specimen ? (
              <Specimen name={specimen} className="w-[22px]" />
            ) : null}
          </span>
        )}
      </div>

      <h3 className={`mb-[5px] mt-[6px] font-display ${TITLE[rank]}`}>
        {project.name}
      </h3>
      <p className="m-0 max-w-[550px]">{project.tagline}</p>

      {wide ? (
        <div className="mt-5 border-t-2 border-line pt-4">
          <Label>what I did</Label>
          <ul className="m-0 mt-2 list-none p-0">
            {project.contributions.slice(0, 3).map((contribution) => (
              <li key={contribution} className="flex gap-3 py-[3px]">
                <span aria-hidden="true" className="font-mono text-muted">
                  &mdash;
                </span>
                <span>{contribution}</span>
              </li>
            ))}
          </ul>
        </div>
      ) : null}

      {note || binMark ? (
        <div className={`${footRowTop} flex items-end justify-between gap-4`}>
          {note ? (
            <p className="m-0 w-fit border-2 border-line bg-white px-[10px] py-[5px] font-mono text-specimen font-bold uppercase text-muted">
              {note}
            </p>
          ) : null}
          {binMark}
        </div>
      ) : null}

      <div
        className={`${stampRowTop} flex justify-between gap-4 pt-[18px] font-mono text-[11px] uppercase text-ink`}
      >
        <span>{project.priority.toLowerCase()}</span>
        <span>
          {external ? "view repository" : "open case study"}{" "}
          <span aria-hidden="true">&#8599;</span>
        </span>
      </div>
    </>
  );

  const className = [
    "tactile relative flex h-full flex-col border-2 border-line text-ink no-underline",
    SURFACE[rank],
    PADDING[rank],
    MIN_HEIGHT[rank],
    rank === "flagship" ? "hover:bg-accent-green" : "hover:bg-accent-blue",
    featured ? "row-span-2" : null,
  ]
    .filter((value): value is string => Boolean(value))
    .join(" ");

  const clip = wide ? (
    <ScatterMark
      mark="paper-clip"
      corner="top-right"
      className="w-[30px] text-line"
    />
  ) : null;

  if (external) {
    return (
      <a
        href={href}
        className={className}
        rel="noreferrer"
        data-bin-card=""
        aria-label={`${project.name} — view repository`}
      >
        {clip}
        {body}
      </a>
    );
  }

  return (
    <Link
      href={href}
      className={className}
      data-bin-card=""
      aria-label={`${project.name} — open case study`}
    >
      {clip}
      {body}
    </Link>
  );
}

export default WorkCard;
