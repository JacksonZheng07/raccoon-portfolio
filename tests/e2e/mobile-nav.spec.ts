import { expect, test } from "@playwright/test";
import { NAV_ITEMS } from "../../components/ui/nav-items";

// The disclosure menu replaces the inline nav below 740px.
test.use({ viewport: { width: 480, height: 820 } });

test.describe("mobile disclosure menu", () => {
  test("is collapsed on load and opens on click", async ({ page }) => {
    await page.goto("/");

    const toggle = page.getByRole("button", { name: "Menu" });
    await expect(toggle).toBeVisible();
    await expect(toggle).toHaveAttribute("aria-expanded", "false");

    const menu = page.getByRole("navigation", { name: "Primary" });
    await expect(menu).toBeHidden();

    await toggle.click();

    await expect(page.getByRole("button", { name: "Close" })).toHaveAttribute(
      "aria-expanded",
      "true",
    );
    await expect(menu).toBeVisible();
    for (const item of NAV_ITEMS) {
      await expect(menu.getByRole("link", { name: item.label })).toBeVisible();
    }
  });

  test("opens from the keyboard and reaches every link by Tab", async ({
    page,
  }) => {
    await page.goto("/");

    const toggle = page.getByRole("button", { name: "Menu" });
    await toggle.focus();
    await expect(toggle).toBeFocused();
    await page.keyboard.press("Enter");

    const menu = page.getByRole("navigation", { name: "Primary" });
    await expect(menu).toBeVisible();

    for (const item of NAV_ITEMS) {
      await page.keyboard.press("Tab");
      await expect(menu.getByRole("link", { name: item.label })).toBeFocused();
    }
  });

  test("closes on Escape and returns focus to the toggle", async ({ page }) => {
    await page.goto("/");

    const toggle = page.getByRole("button", { name: "Menu" });
    await toggle.click();
    const menu = page.getByRole("navigation", { name: "Primary" });
    await expect(menu).toBeVisible();

    await page.keyboard.press("Escape");

    await expect(menu).toBeHidden();
    await expect(page.getByRole("button", { name: "Menu" })).toBeFocused();
    await expect(page.getByRole("button", { name: "Menu" })).toHaveAttribute(
      "aria-expanded",
      "false",
    );
  });

  test("closes by navigating when a link is chosen", async ({ page }) => {
    await page.goto("/");

    await page.getByRole("button", { name: "Menu" }).click();
    await page
      .getByRole("navigation", { name: "Primary" })
      .getByRole("link", { name: "Notes" })
      .click();

    await expect(page).toHaveURL("/notes/");
    await expect(page.getByRole("button", { name: "Menu" })).toBeVisible();
  });
});
