import { CaseCan } from "@/components/work/CaseCan";
import { RailArrows } from "@/components/work/RailArrows";
import type { Project } from "@/lib/projects";
import styles from "./case-can.module.css";

/*
 * Six case bins on a rail, three at a time.
 *
 * Native horizontal scroll with snapping, not a JavaScript carousel: swipe,
 * trackpad, shift-scroll and keyboard all work because they are the
 * browser's. Nothing here hydrates.
 *
 * The arrows are links to each page rather than prev/next buttons. Six bins
 * three at a time is exactly two pages, so a link per page says where it
 * goes, needs no script, and is keyboard-reachable because it is a link.
 * Prev/next would have to know where the rail currently sits, which is the
 * one thing CSS cannot tell it.
 */
const RAIL_ID = "case-rail";

export function CaseRail({ projects }: { projects: Project[] }) {
  return (
    <div className="relative">
      <ul id={RAIL_ID} className={`${styles.rail} m-0 list-none p-0`}>
        {projects.map((project) => (
          <li key={project.slug} className={`${styles.page} m-0`}>
            <CaseCan project={project} />
          </li>
        ))}
      </ul>
      <RailArrows railId={RAIL_ID} />
    </div>
  );
}

export default CaseRail;
