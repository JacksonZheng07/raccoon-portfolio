/*
 * The route table the whole suite iterates over.
 *
 * Every route the site serves is listed here, so the per-route specs --
 * render, headings, alt text, console errors, axe -- cover all of them. The
 * six case studies are the `Flagship` and `Strong` projects; `Supporting`
 * projects deliberately have no page, only a repository link.
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
  {
    path: "/work/",
    name: "work index",
    h1: "Ten builds, filed and labelled",
  },
  { path: "/work/pystruct/", name: "case study: PyStruct", h1: "PyStruct" },
  { path: "/work/skyprint/", name: "case study: SkyPrint", h1: "SkyPrint" },
  { path: "/work/aftercare/", name: "case study: AfterCare", h1: "AfterCare" },
  { path: "/work/emptyneu/", name: "case study: EmptyNEU", h1: "EmptyNEU" },
  { path: "/work/sprouted/", name: "case study: Sprouted", h1: "Sprouted" },
  { path: "/work/l3/", name: "case study: L3", h1: "L3" },
];

/**
 * Routes linked to from the nav or the 404 page but not built in this repo.
 * Empty now that every linked route exists; kept so a future link to an
 * unbuilt page has an obvious place to be declared.
 */
export const PLANNED_ROUTES: readonly string[] = [];

/** A path with no page behind it, used to exercise the 404. */
export const MISSING_PATH = "/filing-cabinet/drawer-nine/";

export const NOT_FOUND_H1 = "Nothing is filed at this address";

export function isBuilt(path: string): boolean {
  return ROUTES.some((route) => route.path === path);
}
