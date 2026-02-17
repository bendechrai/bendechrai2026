import { test, expect } from "@playwright/test";

test.beforeEach(async ({ page }) => {
  await page.addInitScript(() => {
    sessionStorage.setItem(
      "booted-themes",
      JSON.stringify(["cyberpunk", "terminal", "lcars", "holographic", "win31"]),
    );
  });
});

// --- Terminal Theme: Command Input ---

test("terminal: can type and execute help command", async ({ page }) => {
  await page.goto("/?theme=terminal");
  await page.waitForTimeout(300);

  const input = page.getByLabel("Terminal command input");
  await expect(input).toBeVisible();
  await input.fill("help");
  await input.press("Enter");

  // Help output should show available commands
  await expect(page.getByText("articles")).toBeVisible();
  await expect(page.getByText("events")).toBeVisible();
  await expect(page.getByText("talks")).toBeVisible();
  await expect(page.getByText("contact")).toBeVisible();
});

test("terminal: can view articles", async ({ page }) => {
  await page.goto("/?theme=terminal");
  await page.waitForTimeout(300);

  const input = page.getByLabel("Terminal command input");
  await input.fill("articles");
  await input.press("Enter");

  await expect(page.getByText("Building Passwordless Auth with WebAuthn")).toBeVisible();
});

test("terminal: can view contact section with social links", async ({ page }) => {
  await page.goto("/?theme=terminal");
  await page.waitForTimeout(300);

  const input = page.getByLabel("Terminal command input");
  await input.fill("contact");
  await input.press("Enter");

  await expect(page.getByText("SUBSPACE RELAY")).toBeVisible();
  await expect(page.getByText("github.com/bendechrai")).toBeVisible();
  await expect(page.getByText("linkedin.com/in/bendechrai")).toBeVisible();
});

test("terminal: unknown command shows error", async ({ page }) => {
  await page.goto("/?theme=terminal");
  await page.waitForTimeout(300);

  const input = page.getByLabel("Terminal command input");
  await input.fill("foobar");
  await input.press("Enter");

  await expect(page.getByText("Unknown command: foobar")).toBeVisible();
});

// --- Cyberpunk Theme: Tab Navigation ---

test("cyberpunk: can switch tabs", async ({ page }) => {
  await page.goto("/?theme=cyberpunk");
  await page.waitForTimeout(300);

  // Default tab shows system profile
  await expect(page.getByText("SYSTEM PROFILE")).toBeVisible();

  // Switch to EVENTS tab
  await page.getByRole("tab", { name: "EVENTS" }).click();
  await expect(page.getByText("UPCOMING EVENTS")).toBeVisible();
  await expect(page.getByText("NDC Sydney")).toBeVisible();

  // Switch to COMMS tab
  await page.getByRole("tab", { name: "COMMS" }).click();
  await expect(page.getByText("ENCRYPTED RELAY")).toBeVisible();

  // Switch to ARCHIVES tab
  await page.getByRole("tab", { name: "ARCHIVES" }).click();
  await expect(page.getByText("ARCHIVED DATA")).toBeVisible();
  await expect(page.getByText("Building Passwordless Auth with WebAuthn")).toBeVisible();
});

test("cyberpunk: terminal command input works", async ({ page }) => {
  await page.goto("/?theme=cyberpunk");
  await page.waitForTimeout(300);

  const input = page.getByLabel("Command input");
  await input.fill("help");
  await input.press("Enter");

  await expect(page.getByText("articles | events | talks | contact")).toBeVisible();
});

// --- LCARS Theme: Pill Navigation ---

test("lcars: can navigate via sidebar pills", async ({ page }) => {
  await page.goto("/?theme=lcars");
  await page.waitForTimeout(300);

  // Default is articles - should show content
  await expect(page.getByText("PUBLISHED WRITINGS")).toBeVisible();

  // Click EVENTS pill
  await page.getByRole("button", { name: "EVENTS" }).click();
  await expect(page.getByText("UPCOMING APPEARANCES")).toBeVisible();
  await expect(page.getByText("NDC Sydney")).toBeVisible();

  // Click COMMS pill
  await page.getByRole("button", { name: "COMMS" }).click();
  await expect(page.getByText("SUBSPACE COMMUNICATIONS")).toBeVisible();
  await expect(page.getByText("github.com/bendechrai")).toBeVisible();
});

// --- Holographic Theme: Command Palette ---

test("holographic: command palette opens with / key", async ({ page }) => {
  await page.goto("/?theme=holographic");
  await page.waitForTimeout(300);

  await page.keyboard.press("/");
  await expect(page.getByPlaceholder("Type a command...")).toBeVisible();

  // Type to filter
  await page.getByPlaceholder("Type a command...").fill("quantum");
  await expect(page.getByRole("button", { name: "QUANTUM RELAY" })).toBeVisible();
});

test("holographic: can dismiss palette with Escape", async ({ page }) => {
  await page.goto("/?theme=holographic");
  await page.waitForTimeout(300);

  await page.keyboard.press("/");
  await expect(page.getByPlaceholder("Type a command...")).toBeVisible();

  await page.keyboard.press("Escape");
  await expect(page.getByPlaceholder("Type a command...")).not.toBeVisible();
});

// --- Windows 3.1 Theme: Window Management ---

test("win31: Program Manager shows desktop icons", async ({ page }) => {
  await page.goto("/?theme=win31");
  await page.waitForTimeout(300);

  await expect(page.getByText("Articles")).toBeVisible();
  await expect(page.getByText("Events")).toBeVisible();
  await expect(page.getByText("Talks")).toBeVisible();
  await expect(page.getByText("WinMsg")).toBeVisible();
});

test("win31: can open a content window by clicking icon", async ({ page }) => {
  await page.goto("/?theme=win31");
  await page.waitForTimeout(300);

  // Click the Articles icon
  await page.getByRole("button", { name: "Articles" }).click();
  await expect(page.getByText("Building Passwordless Auth with WebAuthn")).toBeVisible();
});

// --- Theme Switching via Commands ---

test("terminal: theme command switches to cyberpunk", async ({ page }) => {
  await page.goto("/?theme=terminal");
  await page.waitForTimeout(300);

  const input = page.getByLabel("Terminal command input");
  await input.fill("theme cyberpunk");
  await input.press("Enter");

  // After switching, cyberpunk status bar should appear
  await page.waitForTimeout(600);
  await expect(page.getByText("SYS://BENDECHRAI.NET")).toBeVisible();
});
