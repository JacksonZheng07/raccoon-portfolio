import type { SpecimenName } from "@/components/nature/Specimen";
import type { Domain, Priority, Project } from "@/lib/projects";

/*
 * Every project carries one nature specimen of its own, so six case studies
 * built from one template still read as six different pages.
 *
 * The mark is derived, never hand-assigned: the domain picks the family the
 * mark comes from, and the project's position among its own domain-mates
 * turns the ring. Two projects filed under the same domain therefore never
 * share a mark while the family lasts, and adding a project cannot make an
 * existing one collide with its neighbour.
 *
 * The families are only as long as they need to be — Product carries five
 * projects, Systems one. Every name here is from the set that survived the
 * render review; the four drawings that read as something other than what
 * they are (`tail-curl`, `fern-frond`, `oak-leaf`, `raccoon-tiny`) appear
 * nowhere in this file.
 */
const DOMAIN_SPECIMENS: Record<Domain, readonly SpecimenName[]> = {
  Systems: ["pine-tree", "cattail", "acorn"],
  Product: [
    "acorn",
    "mushroom-cluster",
    "maple-leaf",
    "berry-cluster",
    "star-cluster",
  ],
  Data: ["star-cluster", "berry-cluster", "mushroom-cluster"],
  Infrastructure: ["cattail", "maple-leaf", "pine-tree"],
};

/** The specimen a project carries, given the filing order it sits in. */
export function projectSpecimen(
  projects: readonly Project[],
  slug: string,
): SpecimenName {
  const project = projects.find((candidate) => candidate.slug === slug);
  const domain: Domain = project?.domain ?? "Product";
  const family = DOMAIN_SPECIMENS[domain];
  const rank = projects
    .filter((candidate) => candidate.domain === domain)
    .findIndex((candidate) => candidate.slug === slug);

  return family[Math.max(0, rank) % family.length] ?? family[0] ?? "acorn";
}

/**
 * The plate colour a case-study masthead paints, by how much the project has
 * to say. Flagship work takes the blue stock the site uses for its loudest
 * surfaces; Strong work takes the pink. Both clear AA for ink and for
 * `muted-strong` — see the table in `app/globals.css`.
 */
export const PLATE_TONE: Record<Priority, string> = {
  Flagship: "bg-accent-blue",
  Strong: "bg-accent-pink",
  Supporting: "bg-paper",
};

/** The mark that heads each priority group on the work index. */
export const PRIORITY_SPECIMEN: Record<Priority, SpecimenName> = {
  Flagship: "pine-tree",
  Strong: "mushroom-cluster",
  Supporting: "acorn",
};

/**
 * What each group of the index actually is, written out rather than left for
 * the reader to infer from a one-word label.
 */
export const PRIORITY_BLURB: Record<Priority, string> = {
  Flagship:
    "The builds with the most decisions behind them. A full case study each.",
  Strong: "Smaller builds that still earned a write-up of their own.",
  Supporting:
    "Short builds. The card goes to the repository, because that is all there is.",
};
