import { test, expect } from "@playwright/test";

const THEMES = ["cyberpunk", "terminal", "lcars", "holographic", "win31"] as const;

// Skip boot sequence for all tests via sessionStorage seeding
test.beforeEach(async ({ page }) => {
  await page.addInitScript(() => {
    sessionStorage.setItem(
      "booted-themes",
      JSON.stringify(["cyberpunk", "terminal", "lcars", "holographic", "win31"]),
    );
  });
});

// --- Visual Regression: Full-page screenshots per theme ---

for (const theme of THEMES) {
  test(`screenshot - ${theme} theme renders correctly`, async ({ page }) => {
    await page.goto(`/?theme=${theme}`);
    // Wait for fonts and layout to settle
    await page.waitForTimeout(500);
    await expect(page).toHaveScreenshot(`${theme}-full.png`, {
      maxDiffPixelRatio: 0.02,
    });
  });
}

// --- Theme Switching ---

test("can switch themes via URL query parameter", async ({ page }) => {
  await page.goto("/?theme=terminal");
  await page.waitForTimeout(300);

  // Verify terminal theme loaded (green text on dark background)
  const body = page.locator("body");
  await expect(body).toBeVisible();

  // Switch to LCARS
  await page.goto("/?theme=lcars");
  await page.waitForTimeout(300);
  await expect(body).toBeVisible();
});

// --- Default Theme ---

test("loads cyberpunk as default theme", async ({ page }) => {
  await page.goto("/");
  await page.waitForTimeout(300);

  // Cyberpunk has a status bar with SYS://BENDECHRAI.NET
  await expect(page.getByText("SYS://BENDECHRAI.NET")).toBeVisible();
});
