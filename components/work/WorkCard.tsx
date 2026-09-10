import Link from "next/link";
import { MaskBadge } from "@/components/raccoon/MaskBadge";
import { Label } from "@/components/ui/Label";
import type { Project } from "@/lib/projects";

type WorkCardProps = {
  /** The project to describe. The card reads it; it never loads it. */
  project: Project;
  /** Render the two-row plate that anchors the grid. */
  featured?: boolean;
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

/**
 * One project in the work grid. The whole card is the link, so the hover and
 * focus states cover the same area a pointer already treats as clickable.
 */
export function WorkCard({ project, featured = false, href }: WorkCardProps) {
  const external = isExternal(href);
  const plateSkills = project.skills.slice(0, featured ? 8 : 4);
  const flow = project.architecture.slice(0, featured ? 7 : 4);

  const body = (
    <>
      <div
        className={`flex flex-col gap-3 overflow-hidden border-2 border-line bg-paper p-4 ${
          featured
            ? "h-[295px] max-[740px]:h-auto max-[740px]:min-h-[230px]"
            : "h-[190px] max-[740px]:h-auto max-[740px]:min-h-[180px]"
        }`}
      >
        <div className="flex items-start justify-between gap-3">
          <Label>specimen</Label>
          <MaskBadge className="text-ink" />
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
      <Label className="mt-[18px]">
        {project.domain.toLowerCase()} · {years(project)}
      </Label>
      <h3
        className={`mb-[5px] mt-[6px] font-display tracking-[-0.03em] ${
          featured ? "text-[34px] max-[740px]:text-[30px]" : "text-[30px]"
        }`}
      >
        {project.name}
      </h3>
      <p className="m-0 max-w-[550px]">{project.tagline}</p>
      {featured ? (
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
      <div className="mt-auto flex justify-between gap-4 pt-[18px] font-mono text-[11px] uppercase text-ink">
        <span>{project.priority.toLowerCase()}</span>
        <span>
          {external ? "view repository" : "open case study"}{" "}
          <span aria-hidden="true">&#8599;</span>
        </span>
      </div>
    </>
  );

  const className = `flex flex-col border-2 border-line p-[19px] text-ink no-underline hover:bg-accent-blue ${
    featured
      ? "bg-accent-blue row-span-2 max-[740px]:min-h-0"
      : "min-h-[390px] bg-white max-[740px]:min-h-0"
  }`;

  if (external) {
    return (
      <a
        href={href}
        className={className}
        rel="noreferrer"
        aria-label={`${project.name} — view repository`}
      >
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
      {body}
    </Link>
  );
}

export default WorkCard;
