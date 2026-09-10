import { expect, test } from "@playwright/test";
import { headingLevels, imageAlts, watchPage } from "./helpers";
import { PLANNED_ROUTES, ROUTES } from "./routes";

for (const route of ROUTES) {
  test.describe(`${route.name} (${route.path})`, () => {
    test("renders with its expected h1, and only one h1", async ({ page }) => {
      const response = await page.goto(route.path);
      expect(response?.status()).toBe(200);

      const headings = page.locator("h1");
      await expect(headings).toHaveCount(1);
      await expect(headings.first()).toHaveText(route.h1);
    });

    test("exposes the page landmarks", async ({ page }) => {
      await page.goto(route.path);

      await expect(page.locator("body > div > header")).toHaveCount(1);
      await expect(page.getByRole("main")).toHaveCount(1);
      await expect(page.locator("footer")).toHaveCount(1);
      await expect(
        page.getByRole("navigation", { name: "Primary" }).first(),
      ).toBeAttached();
    });

    test("starts at h1 and never skips a heading level", async ({ page }) => {
      await page.goto(route.path);

      const levels = await headingLevels(page);
      expect(levels.length).toBeGreaterThan(0);
      expect(levels[0]).toBe(1);
      for (const [index, level] of levels.entries()) {
        if (index === 0) continue;
        const previous = levels[index - 1] ?? 1;
        expect(
          level - previous,
          `heading ${index} jumps from h${previous} to h${level}`,
        ).toBeLessThanOrEqual(1);
      }
    });

    test("gives every image an alt attribute", async ({ page }) => {
      await page.goto(route.path);

      /*
       * No lower bound on the count. The case studies carry no `img` at all:
       * there are no project screenshots, and the raccoon illustrations are
       * inlined as JSX so they can inherit `currentColor`. Requiring an image
       * on every route asserted a layout decision rather than an
       * accessibility property. The suite-level test below keeps this from
       * being vacuous everywhere at once.
       */
      for (const image of await imageAlts(page)) {
        expect(image.alt, `${image.src} has no alt attribute`).not.toBeNull();
      }
    });

    test("logs no console errors and requests nothing missing", async ({
      page,
    }) => {
      const watch = watchPage(page);

      await page.goto(route.path);
      await page.waitForLoadState("networkidle");

      expect(watch.errors).toEqual([]);

      /*
       * The router prefetches the RSC payload of every link it can see, and
       * `/work` is being built on a parallel branch, so its prefetch 404s
       * here. Anything else that 404s is a real missing asset. This filter
       * empties itself when `PLANNED_ROUTES` does.
       */
      const unexpected = watch.notFound.filter(
        (path) =>
          !PLANNED_ROUTES.some((planned) => path.startsWith(planned)),
      );
      expect(unexpected).toEqual([]);
    });

    test("keeps focus visible on the first interactive element", async ({
      page,
    }) => {
      await page.goto(route.path);
      await page.keyboard.press("Tab");

      const outline = await page.evaluate(() => {
        const active = document.activeElement;
        if (!(active instanceof HTMLElement)) return null;
        const style = getComputedStyle(active);
        return { width: style.outlineWidth, style: style.outlineStyle };
      });

      expect(outline).not.toBeNull();
      expect(outline?.style).not.toBe("none");
      expect(parseFloat(outline?.width ?? "0")).toBeGreaterThan(0);
    });
  });
}

test("the first tab stop is the skip link, and it moves focus to the content", async ({
  page,
}) => {
  await page.goto("/");
  await page.keyboard.press("Tab");

  const skipLink = page.getByRole("link", { name: "Skip to content" });
  await expect(skipLink).toBeFocused();

  await page.keyboard.press("Enter");
  await expect(page.locator("#content")).toBeFocused();
});

/*
 * Guards the per-route alt test against passing because nothing was ever
 * checked. Some route must actually serve an `img`.
 */
test("at least one route serves an image, so the alt check is not vacuous", async ({
  page,
}) => {
  let total = 0;
  for (const route of ROUTES) {
    await page.goto(route.path);
    total += (await imageAlts(page)).length;
  }
  expect(total).toBeGreaterThan(0);
});
