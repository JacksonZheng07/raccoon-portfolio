import Link from "next/link";
import { photoFor } from "@/components/work/case-photos";
import { DOMAIN_TONE } from "@/components/work/field-marks";
import type { Project } from "@/lib/projects";
import styles from "./case-can.module.css";

/*
 * One case file: a photographic plate you can reach into.
 *
 * This was a drawn bin with a drawn raccoon standing up out of it. The
 * drawings were replaced with the licensed photographs that went unused when
 * the photographic band came out, and the mechanic had to change with them: a
 * photograph is a rectangle, not a cutout, so nothing can rise from behind
 * its rim. The sign slides up over the foot of the plate instead.
 *
 * Everything here is still CSS. The only JavaScript in this band is the
 * rail's paging, and it lives in its own component.
 */

/* next/image is unusable here: with `images: { unoptimized: true }`
   generateImgAttrs returns the src verbatim and never applies basePath. */
const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

export function CaseCan({ project }: { project: Project }) {
  const photo = photoFor(project.slug);

  return (
    <figure className="m-0">
      <Link
        href={`/work/${project.slug}/`}
        className={`${styles.can} block`}
        /*
         * The link's name is the project, not the sign's contents: a screen
         * reader listing the case files should hear six project names, not
         * six paragraphs. The tagline is in the caption below, in the reading
         * order, where it is read once in context.
         */
        aria-label={`${project.name} — case study`}
      >
        <div className={`${styles.stage} border-2 border-line bg-plate`}>
          {/* eslint-disable-next-line @next/next/no-img-element -- next/image
              drops basePath under images.unoptimized; see the note above. */}
          <img
            src={`${basePath}/assets/photos/${photo.file}`}
            alt={photo.alt}
            loading="lazy"
            className={`absolute inset-0 h-full w-full object-cover ${photo.position}`}
          />

          {/*
           * The sign. In the document whether or not it is visible, so it
           * costs nothing to a reader who never hovers -- but `aria-hidden`,
           * because every word on it is already in the caption underneath and
           * announcing it twice is worse than not at all.
           */}
          <span
            aria-hidden="true"
            className={`${styles.sign} border-t-2 border-line bg-plate px-4 py-3`}
          >
            <span className="block font-display text-[19px] leading-[1.15] text-ink">
              {project.name}
            </span>
            <span
              className={`mt-[6px] inline-block border-2 border-line px-[7px] py-[1px] font-mono text-[10px] uppercase tracking-[0.1em] text-ink ${DOMAIN_TONE[project.domain]}`}
            >
              {project.domain}
            </span>
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
