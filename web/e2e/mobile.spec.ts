import { test, expect } from "@playwright/test";

const THEMES = ["cyberpunk", "terminal", "starship", "holographic", "retro", "fms"] as const;

test.beforeEach(async ({ page }) => {
  await page.addInitScript(() => {
    sessionStorage.setItem(
      "booted-themes",
      JSON.stringify(["cyberpunk", "terminal", "starship", "holographic", "retro", "fms"]),
    );
  });
});

// These tests only run on mobile projects (Pixel 5, iPhone 13)
// as configured in playwright.config.ts

for (const theme of THEMES) {
  test(`mobile screenshot - ${theme} theme`, async ({ page }) => {
    await page.goto(`/?theme=${theme}`);
    await page.waitForTimeout(500);
    await expect(page).toHaveScreenshot(`${theme}-mobile.png`, {
      maxDiffPixelRatio: 0.03,
    });
  });
}

// --- Mobile-Specific Interactions ---

test("terminal: command input is accessible on mobile", async ({ page }) => {
  await page.goto("/?theme=terminal");
  await page.waitForTimeout(300);

  const input = page.getByLabel("Terminal command input");
  await expect(input).toBeVisible();
  await input.tap();
  await input.fill("help");
  await input.press("Enter");

  await expect(page.getByText("articles")).toBeVisible();
});

test("cyberpunk: tabs are tappable on mobile", async ({ page }) => {
  await page.goto("/?theme=cyberpunk");
  await page.waitForTimeout(300);

  const eventsTab = page.getByRole("tab", { name: "EVENTS" });
  await expect(eventsTab).toBeVisible();
  await eventsTab.tap();
  await expect(page.getByText("UPCOMING EVENTS")).toBeVisible();
});

test("holographic: palette trigger button is visible on mobile", async ({ page }) => {
  await page.goto("/?theme=holographic");
  await page.waitForTimeout(300);

  const trigger = page.getByLabel("Open command palette");
  await expect(trigger).toBeVisible();
  await trigger.tap();
  await expect(page.getByPlaceholder("Type a command...")).toBeVisible();
});

test("starship: pill navigation works on mobile", async ({ page }) => {
  await page.goto("/?theme=starship");
  await page.waitForTimeout(300);

  await page.getByRole("button", { name: "COMMS" }).tap();
  await expect(page.getByText("github.com/bendechrai")).toBeVisible();
});

test("fms: navigation buttons work on mobile", async ({ page }) => {
  await page.goto("/?theme=fms");
  await page.waitForTimeout(300);

  await page.getByRole("button", { name: "F-PLN" }).first().tap();
  await expect(page.getByText("Building Passwordless Auth with WebAuthn")).toBeVisible();
});

test("retro: desktop icons are tappable on mobile", async ({ page }) => {
  await page.goto("/?theme=retro");
  await page.waitForTimeout(300);

  await page.getByRole("button", { name: "Message" }).tap();
  await expect(page.getByText("github.com/bendechrai")).toBeVisible();
});
