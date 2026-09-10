import type { InvestigatorName } from "@/components/detective/Investigator";
import type { TrashCanName } from "@/components/detective/TrashCan";
import type { Domain, Project } from "@/lib/projects";

/*
 * Which drawing each case study carries where.
 *
 * Six pages are built from one template, so the art has to differ between
 * them for the same reason the specimen mark does. Nothing here is assigned
 * by slug: every choice is derived from the project's own data, the way
 * `projectSpecimen` derives its mark. Add a project and it gets its art for
 * free; reorder the filing and no page collides with its neighbour.
 *
 * Sections 02 to 07 keep a fixed pose each, because those poses mean
 * something for the section they head — the raccoon takes notes beside the
 * build log and dusts for prints beside the evidence. The variation lives in
 * the two sections whose pose is free: the overview portrait, and the bin
 * still being gone through under "what this page still owes".
 */

/*
 * The overview portrait. Only the two poses that read as a portrait are
 * eligible: the other five are spoken for further down the same page, and a
 * page that shows the same drawing twice looks like a mistake rather than a
 * motif.
 */
const DOMAIN_PORTRAITS: Record<Domain, readonly InvestigatorName[]> = {
  Systems: ["raccoon-detective", "raccoon-deerstalker"],
  Product: ["raccoon-deerstalker", "raccoon-detective"],
  Data: ["raccoon-detective", "raccoon-deerstalker"],
  Infrastructure: ["raccoon-deerstalker", "raccoon-detective"],
};

/*
 * The bin under the open items. Two ways of still being in the rubbish,
 * turned by where the project files. `trash-can-closed` and
 * `trash-can-lid-hat` are not here: an intact bin is the one thing that
 * would contradict a section whose whole point is that the digging is not
 * finished.
 */
const OPEN_ITEM_BINS: readonly TrashCanName[] = [
  "trash-can-raccoon-inside",
  "trash-can-tipped",
];

function filingRank(projects: readonly Project[], slug: string): number {
  return Math.max(0, projects.findIndex((project) => project.slug === slug));
}

function domainRank(projects: readonly Project[], slug: string): number {
  const project = projects.find((candidate) => candidate.slug === slug);
  if (!project) {
    return 0;
  }
  return Math.max(
    0,
    projects
      .filter((candidate) => candidate.domain === project.domain)
      .findIndex((candidate) => candidate.slug === slug),
  );
}

/** The portrait the overview band carries, by domain and filing order. */
export function overviewPose(
  projects: readonly Project[],
  slug: string,
): InvestigatorName {
  const project = projects.find((candidate) => candidate.slug === slug);
  const family = DOMAIN_PORTRAITS[project?.domain ?? "Product"];
  return (
    family[domainRank(projects, slug) % family.length] ??
    "raccoon-deerstalker"
  );
}

/** The bin the open-items band carries, by filing order. */
export function openItemsBin(
  projects: readonly Project[],
  slug: string,
): TrashCanName {
  return (
    OPEN_ITEM_BINS[filingRank(projects, slug) % OPEN_ITEM_BINS.length] ??
    "trash-can-tipped"
  );
}

/**
 * How much mess a project spills, from how much it admits it still owes.
 * Clamped to three so no page gets a single sad crumb, and to six so the
 * spill never grows wider than the margin it sits in.
 */
export function debrisCount(project: Project): number {
  return Math.min(6, Math.max(3, project.followUps.length - 2));
}

/**
 * Whether a second bag stands beside the bin. Only for a project whose own
 * follow-up list has run past eight items: at that point one bin plainly is
 * not holding everything the page still owes.
 */
export function hasSpareBag(project: Project): boolean {
  return project.followUps.length >= 8;
}

/**
 * The length of the trail the raccoon follows beside the architecture
 * sketch, taken from how many steps the flow actually has. A six-step flow
 * gets a shorter trail than an eleven-step one, so the drawing says
 * something true about the band it sits in.
 *
 * The floor is high because this trail has a whole band to cross: seven
 * marks is the fewest that still reads as a trail at that width rather than
 * as three dropped crumbs. Twelve is `DebrisTrail`'s own ceiling.
 */
export function flowCount(project: Project): number {
  return Math.min(12, Math.max(7, project.architecture.length));
}

/**
 * The scatter beside the parts list, sized by how many areas the project
 * breaks into rather than by how much it owes.
 */
export function partsCount(project: Project): number {
  return Math.min(5, Math.max(2, project.technical.length));
}

/*
 * What each drawing is doing, written per pose rather than per project.
 *
 * These are captions about the raccoon and nothing else. Not one of them
 * says anything about the project the page is documenting, about what was
 * built, or about who built it — the pages are carefully hedged and a
 * caption is not the place to quietly un-hedge them. The register is the one
 * the photographic plates on the home page already established: present
 * tense, deadpan, lower case, no punctuation at the end.
 *
 * Because they are keyed by pose, the same caption is true on all six case
 * studies. `tests/unit/case-study-art.test.ts` checks that none of them
 * names a project or a person.
 */
export const POSE_NOTES: Record<InvestigatorName, string> = {
  "raccoon-detective": "brought his own magnifier",
  "raccoon-deerstalker": "the hat was not issued to him",
  "raccoon-notepad": "takes notes, reads none of them back",
  "raccoon-evidence-bag": "holds up the bag, waits to be asked",
  "raccoon-magnifier-ground": "follows the trail on all fours",
  "raccoon-dusting": "dusting for a print he left himself",
  "raccoon-flashlight": "the only light in the room",
};

/** The same, for the bins. */
export const BIN_NOTES: Record<TrashCanName, string> = {
  "trash-can-closed": "the lid is on, for now",
  "trash-can-tipped": "tipped it out, kept looking",
  "trash-can-raccoon-inside": "still in there",
  "trash-can-lid-hat": "wearing the lid, unbothered",
  "trash-can-stack": "has been through both of these",
  "trash-bag": "there was more of it than would fit",
};
