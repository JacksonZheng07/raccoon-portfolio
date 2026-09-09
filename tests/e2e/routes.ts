/*
 * The route table the whole suite iterates over.
 *
 * `/work` and `/work/[slug]` are being built on parallel branches. They are
 * listed in `PLANNED_ROUTES` so the navigation and 404 specs already assert
 * that the links point at them, without asserting page content that does not
 * exist yet. When those routes land, move them into `ROUTES` with their `h1`
 * and every per-route spec -- render, headings, alt text, console errors,
 * axe -- picks them up with no other change.
 */

export type Route = {
  /** Path as served, with the trailing slash `trailingSlash: true` produces. */
  path: string;
  /** Name used in the test title. */
  name: string;
  /** The page's single `h1`, matched as a whole string. */
  h1: string;
};

export const ROUTES: readonly Route[] = [
  {
    path: "/",
    name: "home",
    h1: "i take things apart to see how they work.",
  },
  {
    path: "/notes/",
    name: "notes",
    h1: "Notes from the notebook",
  },
];

/** Routes linked to from the nav and the 404 page but not yet built here. */
export const PLANNED_ROUTES: readonly string[] = ["/work/"];

/** A path with no page behind it, used to exercise the 404. */
export const MISSING_PATH = "/filing-cabinet/drawer-nine/";

export const NOT_FOUND_H1 = "Nothing is filed at this address";

export function isBuilt(path: string): boolean {
  return ROUTES.some((route) => route.path === path);
}
