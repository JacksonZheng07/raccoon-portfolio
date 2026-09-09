import { describe, expect, it } from "vitest";
import { NAV_ITEMS } from "@/components/ui/nav-items";

describe("top nav destinations", () => {
  it("points at the routes the site actually builds", () => {
    expect(NAV_ITEMS.map((item) => item.href)).toEqual([
      "/work",
      "/#about",
      "/notes",
      "/#contact",
    ]);
  });

  it("keeps every destination unique and labelled", () => {
    const hrefs = NAV_ITEMS.map((item) => item.href);
    expect(new Set(hrefs).size).toBe(hrefs.length);
    for (const item of NAV_ITEMS) {
      expect(item.label.trim()).not.toBe("");
    }
  });
});
