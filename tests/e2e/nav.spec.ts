import { expect, test } from "@playwright/test";
import { NAV_ITEMS } from "../../components/ui/nav-items";
import { expectPath } from "./helpers";
import { ROUTES, isBuilt } from "./routes";

/*
 * The nav item list is imported rather than restated, so a new destination is
 * covered the moment it is added to `components/ui/nav-items.ts`. An item
 * pointing at a route still being built on another branch is checked as far
 * as the URL; its content assertion switches on by itself once the route is
 * listed in `tests/e2e/routes.ts`.
 */
test.describe("top navigation", () => {
  test("shows the wordmark as a link home", async ({ page }) => {
    await page.goto("/notes/");

    await page.getByRole("link", { name: "JZ" }).click();

    await expectPath(page, "/");
    await expect(page.locator("h1")).toHaveText(ROUTES[0]?.h1 ?? "");
  });

  for (const item of NAV_ITEMS) {
    test(`reaches ${item.label}`, async ({ page }) => {
      await page.goto("/");

      const link = page
        .getByRole("navigation", { name: "Primary" })
        .getByRole("link", { name: item.label });
      await expect(link).toBeVisible();

      await link.click();

      if (item.href.includes("#")) {
        const fragment = item.href.split("#")[1] ?? "";
        await expect(page).toHaveURL(`/#${fragment}`);
        await expect(page.locator(`#${fragment}`)).toBeVisible();
        return;
      }

      // `trailingSlash` is on, so "/work" is served as "/work/".
      const target = item.href.endsWith("/") ? item.href : `${item.href}/`;
      await expectPath(page, target);

      const route = ROUTES.find((candidate) => candidate.path === target);
      if (route) {
        await expect(page.locator("h1")).toHaveText(route.h1);
      } else {
        // Not built on this branch yet; see tests/e2e/routes.ts.
        expect(isBuilt(target)).toBe(false);
      }
    });
  }
});
