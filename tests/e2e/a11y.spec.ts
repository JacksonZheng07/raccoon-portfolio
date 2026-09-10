import AxeBuilder from "@axe-core/playwright";
import type { Page } from "@playwright/test";
import { expect, test } from "@playwright/test";
import { MISSING_PATH, ROUTES } from "./routes";

/*
 * The gate: axe-core against every route, failing on serious and critical
 * violations. Tags are restricted to the WCAG A/AA success criteria the site
 * is held to, so a best-practice advisory cannot fail the build while a real
 * AA failure can.
 */
const WCAG_TAGS = ["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa"];
const BLOCKING_IMPACTS = new Set(["serious", "critical"]);

async function blockingViolations(page: Page) {
  const results = await new AxeBuilder({ page })
    .withTags(WCAG_TAGS)
    .analyze();

  return results.violations
    .filter((violation) => BLOCKING_IMPACTS.has(violation.impact ?? ""))
    .map((violation) => ({
      id: violation.id,
      impact: violation.impact,
      help: violation.help,
      nodes: violation.nodes.map((node) => node.target.join(" ")),
    }));
}

const PAGES = [
  ...ROUTES.map((route) => ({ name: route.name, path: route.path })),
  { name: "404", path: MISSING_PATH },
];

for (const target of PAGES) {
  test(`${target.name} has no serious or critical axe violations`, async ({
    page,
  }) => {
    await page.goto(target.path);
    expect(await blockingViolations(page)).toEqual([]);
  });
}

test("the open mobile menu has no serious or critical axe violations", async ({
  page,
}) => {
  await page.setViewportSize({ width: 480, height: 820 });
  await page.goto("/");
  await page.getByRole("button", { name: "Menu" }).click();
  await expect(page.getByRole("navigation", { name: "Primary" })).toBeVisible();

  expect(await blockingViolations(page)).toEqual([]);
});
