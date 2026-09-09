import { describe, expect, it } from "vitest";
import { isCurrentRoute } from "../../components/ui/NavLink";
import { NAV_ITEMS } from "../../components/ui/nav-items";

describe("isCurrentRoute", () => {
  it("matches a route regardless of the trailing slash on either side", () => {
    expect(isCurrentRoute("/work", "/work/")).toBe(true);
    expect(isCurrentRoute("/work/", "/work")).toBe(true);
    expect(isCurrentRoute("/notes", "/notes/")).toBe(true);
  });

  it("treats a case study as being inside /work", () => {
    expect(isCurrentRoute("/work", "/work/pystruct/")).toBe(true);
  });

  it("does not treat every route as being inside the home page", () => {
    expect(isCurrentRoute("/", "/work/")).toBe(false);
    expect(isCurrentRoute("/", "/")).toBe(true);
  });

  it("never marks a hash destination current", () => {
    /*
     * `/#about` and `/#contact` are sections of the home page, not routes.
     * Marking them current would put `aria-current="page"` on three items at
     * once whenever the home page is open.
     */
    expect(isCurrentRoute("/#about", "/")).toBe(false);
    expect(isCurrentRoute("/#contact", "/")).toBe(false);
  });

  it("marks exactly one nav item current on any single route", () => {
    for (const pathname of ["/", "/work/", "/notes/", "/work/l3/"]) {
      const current = NAV_ITEMS.filter((item) =>
        isCurrentRoute(item.href, pathname),
      );
      expect(current.length, `${pathname} matched ${current.length} items`)
        .toBeLessThanOrEqual(1);
    }
  });

  it("does not confuse a route with one that shares its prefix", () => {
    expect(isCurrentRoute("/work", "/workshop/")).toBe(false);
  });
});
