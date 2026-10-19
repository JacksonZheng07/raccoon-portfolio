import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";

test("desktop opens a project from the Projects folder", async ({ page }) => {
  const errors: string[] = [];
  page.on("pageerror", (e) => errors.push(e.message));
  await page.goto("/#finder");

  const finder = page.getByRole("dialog", { name: "Projects" });
  for (const name of ["Systems", "PyStruct", "README.md"]) {
    await finder.getByRole("button", { name: new RegExp(`^${name}`) }).first().dblclick();
  }
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

test("the terminal opens apps by command", async ({ page }) => {
  await page.goto("/#terminal");
  const terminal = page.getByLabel(/jackson@jackson-os/);
  await terminal.fill("open pystruct");
  await terminal.press("Enter");
  await expect(page.getByRole("dialog", { name: "PyStruct" })).toBeVisible();
});

test("the timeline filters and links to projects", async ({ page }) => {
  await page.goto("/#timeline");
  const timeline = page.getByRole("dialog", { name: "Timeline" });
  await timeline.getByRole("button", { name: "Work", exact: true }).click();
  await expect(timeline.getByRole("heading", { name: "Software Engineering Intern", exact: true })).toBeVisible();
  await expect(timeline.getByRole("heading", { name: "PyStruct" })).toHaveCount(0);
  await timeline.getByRole("button", { name: "All", exact: true }).click();
  await timeline.getByRole("button", { name: "Open project" }).first().click();
  await expect(page.getByRole("dialog", { name: "PyStruct" })).toBeVisible();
});

test("the class-notes vault stays locked without the password", async ({ page }) => {
  await page.goto("/#vault");
  const vault = page.getByRole("dialog", { name: "Class Notes" });
  await vault.getByLabel("Vault password").fill("not-the-password");
  await vault.getByRole("button", { name: "Unlock" }).click();
  await expect(vault.getByText("That password didn't open the vault.")).toBeVisible({ timeout: 15_000 });
  await expect(vault.getByRole("button", { name: /Files/ })).toHaveCount(0);
});
