import { expect, test } from "@playwright/test";
import { MISSING_PATH, NOT_FOUND_H1, ROUTES, isBuilt } from "./routes";
import { expectPath, imageAlts } from "./helpers";

const EXITS = [
  { label: "Home", path: "/" },
  { label: "Work", path: "/work/" },
  { label: "Notes", path: "/notes/" },
];

test.describe("404", () => {
  test("answers a bad URL with the not-found page", async ({ page }) => {
    const response = await page.goto(MISSING_PATH);

    expect(response?.status()).toBe(404);
    await expect(page.locator("h1")).toHaveCount(1);
    await expect(page.locator("h1")).toHaveText(NOT_FOUND_H1);
    await expect(page).toHaveTitle("Page not found — Jackson Zheng");
  });

  test("gives every image an alt attribute", async ({ page }) => {
    await page.goto(MISSING_PATH);

    /*
     * No lower bound on the count, for the reason tests/e2e/routes.spec.ts
     * already records: this page's artwork is inline JSX so it can inherit
     * `currentColor`, and it now carries no `img` at all. Requiring one
     * asserted a layout decision rather than an accessibility property. The
     * suite-level check in routes.spec.ts keeps the alt assertion from being
     * vacuous everywhere at once.
     */
    for (const image of await imageAlts(page)) {
      expect(image.alt, `${image.src} has no alt attribute`).not.toBeNull();
    }
  });

  test("offers three exits, each pointing where it says", async ({ page }) => {
    await page.goto(MISSING_PATH);

    // Scoped to the list: the same labels appear in the top navigation.
    const exits = page.getByRole("main").getByRole("list").first();
    await expect(exits.getByRole("link")).toHaveCount(EXITS.length);

    for (const exit of EXITS) {
      await expect(
        exits.getByRole("link", { name: exit.label, exact: true }),
      ).toHaveAttribute("href", exit.path);
    }
  });

  for (const exit of EXITS) {
    test(`the ${exit.label} exit works`, async ({ page }) => {
      await page.goto(MISSING_PATH);
      await page
        .getByRole("main")
        .getByRole("list")
        .first()
        .getByRole("link", { name: exit.label, exact: true })
        .click();

      await expectPath(page, exit.path);

      const route = ROUTES.find((candidate) => candidate.path === exit.path);
      if (route) {
        await expect(page.locator("h1")).toHaveText(route.h1);
      } else {
        // /work lands on a parallel branch; see tests/e2e/routes.ts.
        expect(isBuilt(exit.path)).toBe(false);
      }
    });
  }

  test("keeps the top navigation available", async ({ page }) => {
    await page.goto(MISSING_PATH);

    await expect(
      page
        .getByRole("navigation", { name: "Primary" })
        .getByRole("link", { name: "Notes" }),
    ).toBeVisible();
  });
});
