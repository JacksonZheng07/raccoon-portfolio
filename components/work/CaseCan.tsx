import Link from "next/link";
import { Investigator, type InvestigatorName } from "@/components/detective/Investigator";
import { TrashCan, type TrashCanName } from "@/components/detective/TrashCan";
import { DOMAIN_TONE } from "@/components/work/field-marks";
import type { Project } from "@/lib/projects";
import styles from "./case-can.module.css";

/*
 * One case file, filed in a bin.
 *
 * The raccoon is a full drawing sitting below the bin's mouth and clipped by
 * it, so standing up is a translate rather than a second piece of art. The
 * bin is painted over the top, which is what puts the animal behind the rim.
 *
 * Everything is CSS: no client component, no hydration, no JavaScript the
 * composition depends on. See `case-can.module.css` for what triggers it and
 * why touch is handled by the caption rather than by the sign.
 */

/* Which pose stands up, and which bin it stands up out of. Derived from the
   slug so a new project cannot collide with the card beside it, and so the
   same project always gets the same raccoon. */
const POSES: readonly InvestigatorName[] = [
  "raccoon-notepad",
  "raccoon-evidence-bag",
  "raccoon-magnifier-ground",
  "raccoon-flashlight",
  "raccoon-dusting",
  "raccoon-deerstalker",
];

/*
 * Bins only, and only ones that stand upright. `trash-can-lid-hat` is a
 * raccoon wearing a lid rather than a container -- it put an animal on the
 * page at rest, which is exactly what the interaction is supposed to be
 * withholding. `trash-can-tipped` is on its side and has nothing to hide in.
 */
const VESSELS: readonly TrashCanName[] = ["trash-can-closed", "trash-can-stack"];

function pick<T>(from: readonly T[], slug: string): T {
  const sum = [...slug].reduce((total, ch) => total + ch.charCodeAt(0), 0);
  return from[sum % from.length] as T;
}

export function CaseCan({ project }: { project: Project }) {
  const pose = pick(POSES, project.slug);
  const vessel = pick(VESSELS, project.slug);

  return (
    <figure className="m-0">
      <Link
        href={`/work/${project.slug}/`}
        className={`${styles.can} group block`}
        /*
         * The link's name is the project, not the sign's whole contents: a
         * screen reader listing the case files should hear six project names,
         * not six paragraphs. The tagline is in the caption below, in the
         * reading order, where it is read once in context.
         */
        aria-label={`${project.name} — case study`}
      >
        <div className={`${styles.stage} h-[268px] w-full`}>
          <span aria-hidden="true" className={`${styles.occupant} text-ink`}>
            <Investigator name={pose} className="h-full w-auto" />
          </span>

          {/*
           * The sign. It is in the document whether or not it is visible, so
           * it costs nothing to a reader who never hovers -- but it is
           * `aria-hidden` because every word on it is already in the caption
           * underneath, and announcing it twice is worse than not at all.
           */}
          <span
            aria-hidden="true"
            className={`${styles.sign} border-2 border-line bg-plate px-3 py-2 text-center shadow-[3px_3px_0_var(--color-line)]`}
          >
            <span className="block font-display text-[17px] leading-[1.15] text-ink">
              {project.name}
            </span>
            <span
              className={`mt-1 inline-block border border-line px-[6px] py-[1px] font-mono text-[10px] uppercase tracking-[0.1em] text-ink ${DOMAIN_TONE[project.domain]}`}
            >
              {project.domain}
            </span>
          </span>

          <span aria-hidden="true" className={`${styles.vessel} text-ink`}>
            <TrashCan name={vessel} className="h-full w-auto" />
          </span>
        </div>
      </Link>

      {/*
       * Printed, not revealed. A tap on a touch screen navigates without ever
       * producing a hover, so the name and the line about the project have to
       * exist outside the interaction.
       */}
      <figcaption className="mt-3 border-t-2 border-line pt-2">
        <span className="block font-mono text-specimen uppercase text-muted">
          {project.domain}
        </span>
        <span className="mt-1 block font-display text-display-4">
          {project.name}
        </span>
        <span className="mt-1 block text-[13px]">{project.tagline}</span>
      </figcaption>
    </figure>
  );
}

export default CaseCan;
