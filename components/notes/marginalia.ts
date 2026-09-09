import type { SpecimenName } from "@/components/nature/Specimen";

/**
 * The per-note furniture: the specimen pressed into its rail, and the
 * sentence pulled out into the right-hand margin.
 *
 * Every quote is a verbatim run of the essay it sits beside — the margin
 * repeats the writer's words, it does not paraphrase them.
 * `tests/unit/notes-marginalia.test.ts` holds that true against the content
 * files, so an edit to an essay that drops a quoted sentence fails the suite
 * instead of leaving a misquote on the page.
 */
export type NoteFurniture = {
  /** The drawing that becomes this note's mark, in the rail and on its card. */
  specimen: SpecimenName;
  /**
   * What the tied-on tag beside that drawing says. The tag face is 54px wide
   * and the text inside it is 10px mono, so this has to stay short -- six
   * characters is the most that fits between the tag's edges.
   */
  specimenLabel: string;
  /** A verbatim sentence from the note, set in the margin. */
  quote: string;
};

const NOTE_FURNITURE: Record<string, NoteFurniture> = {
  "making-technical-work-legible": {
    specimen: "maple-leaf",
    specimenLabel: "maple",
    quote: "A case study nobody is able to contradict is a brochure.",
  },
  "small-tools-real-leverage": {
    specimen: "acorn",
    specimenLabel: "acorn",
    quote: "Leverage does not have to be clever.",
  },
  "learning-without-the-theatre": {
    specimen: "mushroom-cluster",
    specimenLabel: "fungi",
    quote: "Helped is not a smaller word than built.",
  },
};

/** Throws rather than silently rendering a bare rail for an unfurnished note. */
export function getNoteFurniture(slug: string): NoteFurniture {
  const furniture = NOTE_FURNITURE[slug];
  if (!furniture) {
    throw new Error(`Note "${slug}" has no marginalia in components/notes/marginalia.ts`);
  }
  return furniture;
}

export { NOTE_FURNITURE };
