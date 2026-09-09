import Link from "next/link";
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
 */
export function WorkCard({
  project,
  featured = false,
  weight,
  specimen,
  note,
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

  const body = (
    <>
      {plated ? (
        <div
          className={`flex flex-col gap-3 overflow-hidden border-2 border-line bg-paper p-4 ${
            wide
              ? "h-[295px] max-[740px]:h-auto max-[740px]:min-h-[230px]"
              : "h-[190px] max-[740px]:h-auto max-[740px]:min-h-[180px]"
          }`}
        >
          <div className="flex items-start justify-between gap-3">
            <Label>specimen</Label>
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

      {note ? (
        <p className="m-0 mt-[14px] w-fit border-2 border-line bg-white px-[10px] py-[5px] font-mono text-specimen font-bold uppercase text-muted">
          {note}
        </p>
      ) : null}

      <div className="mt-auto flex justify-between gap-4 pt-[18px] font-mono text-[11px] uppercase text-ink">
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
      aria-label={`${project.name} — open case study`}
    >
      {clip}
      {body}
    </Link>
  );
}

export default WorkCard;
