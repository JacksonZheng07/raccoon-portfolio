import type { InvestigatorName } from "@/components/detective/Investigator";
import type { TrashCanName } from "@/components/detective/TrashCan";
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

/*
 * The bin a project carries on the index, derived exactly the way its
 * specimen is: the domain picks the family, the project's filing order inside
 * that domain turns the ring. Nothing is assigned per project, so the four
 * Supporting cards come out with four different bins without anybody naming
 * one, and a new project cannot collide with the card next to it.
 */
const DOMAIN_BINS: Record<Domain, readonly TrashCanName[]> = {
  Systems: ["trash-can-stack", "trash-can-closed"],
  Product: [
    "trash-can-closed",
    "trash-bag",
    "trash-can-stack",
    "trash-can-tipped",
    "trash-can-lid-hat",
  ],
  Data: ["trash-can-tipped", "trash-bag", "trash-can-closed"],
  Infrastructure: [
    "trash-can-lid-hat",
    "trash-can-raccoon-inside",
    "trash-can-closed",
  ],
};

/** The bin a project stands beside, given the filing order it sits in. */
export function projectBin(
  projects: readonly Project[],
  slug: string,
): TrashCanName {
  const project = projects.find((candidate) => candidate.slug === slug);
  const domain: Domain = project?.domain ?? "Product";
  const family = DOMAIN_BINS[domain];
  const rank = projects
    .filter((candidate) => candidate.domain === domain)
    .findIndex((candidate) => candidate.slug === slug);

  return (
    family[Math.max(0, rank) % family.length] ??
    family[0] ??
    "trash-can-closed"
  );
}

/**
 * The scene that heads each priority group on the index.
 *
 * The ranking is a raccoon sorting what it dug up, and the bins carry the
 * ranking on their own: a stack of them for the work with the most in it, one
 * bagged for the middle tier, and an already-tipped bin for the tier that is
 * honest about having nothing more to show. Decorative — the heading beside
 * each scene says the same thing in words.
 */
export const PRIORITY_SCENE: Record<
  Priority,
  { pose: InvestigatorName; bin: TrashCanName }
> = {
  Flagship: { pose: "raccoon-evidence-bag", bin: "trash-can-stack" },
  Strong: { pose: "raccoon-notepad", bin: "trash-bag" },
  Supporting: { pose: "raccoon-magnifier-ground", bin: "trash-can-tipped" },
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
