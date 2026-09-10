import Link from "next/link";
import { Label } from "@/components/ui/Label";
import type { Project } from "@/lib/projects";

type CaseStudyNavProps = {
  previous: Project | undefined;
  next: Project | undefined;
};

const CARD_CLASS =
  "tactile flex h-full flex-col border-2 border-line bg-white px-[22px] py-[18px] text-ink no-underline hover:bg-accent-blue";

/**
 * Prev/next between case studies, in the order the work index lists them, plus
 * the way back out. `next/link` applies `basePath` on its own.
 */
export function CaseStudyNav({ previous, next }: CaseStudyNavProps) {
  return (
    <nav
      aria-label="Case studies"
      className="grid grid-cols-2 gap-5 max-[740px]:block"
    >
      {previous ? (
        <Link href={`/work/${previous.slug}`} className={CARD_CLASS}>
          <Label>
            <span aria-hidden="true">&larr;</span> previous case study
          </Label>
          <span className="mt-[8px] block font-display text-[28px] leading-[1.05] tracking-[-0.04em]">
            {previous.name}
          </span>
          <p className="m-0 mt-[6px] text-[14px] text-muted">
            {previous.domain} &middot; {previous.priority}
          </p>
        </Link>
      ) : (
        <Link href="/work" className={`${CARD_CLASS} max-[740px]:mb-4`}>
          <Label>
            <span aria-hidden="true">&larr;</span> index
          </Label>
          <span className="mt-[8px] block font-display text-[28px] leading-[1.05] tracking-[-0.04em]">
            All work
          </span>
          <p className="m-0 mt-[6px] text-[14px] text-muted">
            Every project, case study or repository.
          </p>
        </Link>
      )}
      {next ? (
        <Link
          href={`/work/${next.slug}`}
          className={`${CARD_CLASS} items-end text-right max-[740px]:mt-4 max-[740px]:items-start max-[740px]:text-left`}
        >
          <Label>
            next case study <span aria-hidden="true">&rarr;</span>
          </Label>
          <span className="mt-[8px] block font-display text-[28px] leading-[1.05] tracking-[-0.04em]">
            {next.name}
          </span>
          <p className="m-0 mt-[6px] text-[14px] text-muted">
            {next.domain} &middot; {next.priority}
          </p>
        </Link>
      ) : (
        <Link
          href="/work"
          className={`${CARD_CLASS} items-end text-right max-[740px]:mt-4 max-[740px]:items-start max-[740px]:text-left`}
        >
          <Label>
            index <span aria-hidden="true">&rarr;</span>
          </Label>
          <span className="mt-[8px] block font-display text-[28px] leading-[1.05] tracking-[-0.04em]">
            All work
          </span>
          <p className="m-0 mt-[6px] text-[14px] text-muted">
            Every project, case study or repository.
          </p>
        </Link>
      )}
    </nav>
  );
}

export default CaseStudyNav;
