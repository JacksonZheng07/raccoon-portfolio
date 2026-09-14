import type { Domain } from "@/lib/projects";

/*
 * The image each case file shows.
 *
 * EMPTY ON PURPOSE. The six licensed raccoon photographs that used to sit
 * here were removed on 2026-09-14 and are being replaced with images the
 * owner is supplying. They are still in `public/assets/photos/` with their
 * attribution intact, because a licence record that points at deleted files
 * is worse than a few unused images.
 *
 * TO ADD THE NEW IMAGES
 *
 *   1. Drop them in `public/assets/photos/`.
 *   2. Add a row to `CASE_IMAGES` below, keyed by project slug -- the slugs
 *      are the filenames in `content/projects/`: pystruct, skyprint,
 *      aftercare, emptyneu, sprouted, l3.
 *   3. Write the alt text. It is not optional and it is not decoration: it
 *      is what a screen reader and a failed image request both fall back to.
 *   4. Add a credit row to `public/assets/photos/ATTRIBUTION.md`. The README
 *      requires it in the same commit, and this is a public repository.
 *
 * Until a slug has a row, its plate renders as type rather than as a broken
 * frame -- see `CaseCan`.
 */
export type CaseImage = {
  file: string;
  alt: string;
  /** Crop anchor, so the subject survives a window wider than the image. */
  position?: string;
};

export const CASE_IMAGES: Partial<Record<string, CaseImage>> = {};

/** The image for a project, or `undefined` while one has not been supplied. */
export function imageFor(slug: string): CaseImage | undefined {
  return CASE_IMAGES[slug];
}

/* Kept so a future image set can be grouped by domain if that is useful. */
export type { Domain };
