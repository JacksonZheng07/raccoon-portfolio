import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";

test("desktop opens a project from the Projects folder", async ({ page }) => {
  const errors: string[] = [];
  page.on("pageerror", (e) => errors.push(e.message));
  await page.goto("/");

  const finder = page.getByRole("dialog", { name: "Projects" });
  await finder.getByRole("button", { name: "PyStruct" }).click();
  const doc = page.getByRole("dialog", { name: "PyStruct" });
  await expect(doc.getByRole("heading", { name: "Overview" })).toBeVisible();
  await expect(page).toHaveURL(/#pystruct$/);

  await doc.getByRole("button", { name: "Close PyStruct" }).click();
  await expect(doc).toHaveCount(0);
  expect(errors).toEqual([]);
});

test("a hash deep-links to a window", async ({ page }) => {
  await page.goto("/#update");
  await expect(
    page.getByRole("dialog", { name: "Software Update" }).getByText(/Last pulled from Notion/),
  ).toBeVisible();
});

test("no axe violations", async ({ page }) => {
  await page.goto("/");
  const { violations } = await new AxeBuilder({ page }).analyze();
  expect(violations).toEqual([]);
});

test("a project's live app opens in a Chrome tab", async ({ page }) => {
  await page.goto("/#pystruct");
  await page.getByRole("button", { name: "Open live app" }).click();
  const chrome = page.getByRole("dialog", { name: "Google Chrome" });
  await expect(chrome.getByRole("tab", { name: "py-struct.vercel.app" })).toHaveCount(1);
  await expect(chrome.locator('iframe[src="https://py-struct.vercel.app"]')).toHaveCount(1);
});
