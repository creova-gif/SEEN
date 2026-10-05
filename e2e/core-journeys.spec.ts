import { expect, signInAs, test } from "./fixtures";

test.describe("first visit", () => {
  test("onboarding → account → For You", async ({ page }) => {
    await page.goto("/");
    await page.getByRole("button", { name: /S \. E \. E \. N/ }).click();
    await page.getByRole("button", { name: /^continue$/i }).click();
    await page.getByRole("button", { name: /viewer/i }).click();
    await page.getByRole("button", { name: /explore culture/i }).click();
    await page.getByPlaceholder("Name").fill("First Visitor");
    await page.getByPlaceholder("Email").fill(`first-${Date.now()}@example.com`);
    await page.getByPlaceholder("Password").fill("Password123");
    await page.getByRole("button", { name: /create account/i }).click();
    await page.getByRole("button", { name: /^continue$/i }).click();
    await page.getByRole("button", { name: /^continue$/i }).click();
    await page.getByRole("button", { name: /^enter$/i }).click();
    await expect(page.getByRole("heading", { name: "For You" })).toBeVisible();
    await expect(page).toHaveURL(/#\/for-you$/);
  });

  test("choosing Moderator at sign-up does not grant moderator access", async ({ page }) => {
    await page.goto("/");
    await page.getByRole("button", { name: /S \. E \. E \. N/ }).click();
    await page.getByRole("button", { name: /^continue$/i }).click();
    await page.getByRole("button", { name: /moderator/i }).click();
    await page.getByRole("button", { name: /explore culture/i }).click();
    await page.getByPlaceholder("Name").fill("Would-be Mod");
    await page.getByPlaceholder("Email").fill(`mod-${Date.now()}@example.com`);
    await page.getByPlaceholder("Password").fill("Password123");
    await page.getByRole("button", { name: /create account/i }).click();
    await expect(page.getByText(/moderator access requested/i)).toBeVisible();
    await page.getByRole("button", { name: /^continue$/i }).click();
    await page.getByRole("button", { name: /^continue$/i }).click();
    await page.getByRole("button", { name: /^enter$/i }).click();
    await page.goto("/#/moderation-governance");
    await page.reload();
    await expect(page.getByText(/don't have access to this area/i)).toBeVisible();
  });
});

test.describe("signed-in viewer", () => {
  test.beforeEach(async ({ page }) => {
    await signInAs(page, "viewer");
  });

  test("header search → result → story", async ({ page }) => {
    await page.goto("/");
    await page.getByRole("button", { name: "Search", exact: true }).click();
    await page.getByPlaceholder(/search by title/i).fill("midnight");
    await page.getByTestId("story-card").first().click();
    await expect(page).toHaveURL(/#\/story\/midnight-resonance/);
  });

  test("explore creators → follow → shows in Profile", async ({ page }) => {
    await page.goto("/#/explore/creators");
    await page.getByTestId("creator-card").filter({ hasText: "Kira Chen" }).click();
    await expect(page).toHaveURL(/#\/creator\/kira-chen/);
    await page.getByRole("button", { name: /^follow$/i }).click();
    await expect(page.getByRole("button", { name: /following/i })).toHaveAttribute("aria-pressed", "true");
    await page.goto("/#/profile");
    await expect(page.getByRole("button", { name: /following\s*1/i })).toBeVisible();
  });

  test("collections → detail → save", async ({ page }) => {
    await page.goto("/#/explore/collections");
    await page.getByTestId("collection-card").first().click();
    await page.getByRole("button", { name: /save collection/i }).click();
    await expect(page.getByRole("button", { name: /^saved$/i })).toHaveAttribute("aria-pressed", "true");
    await expect(page.getByTestId("story-row").first()).toBeVisible();
  });

  test("funding → save → checklist → applied", async ({ page }) => {
    await page.goto("/#/funding");
    await page.getByTestId("opportunity-card").filter({ hasText: "Research and Creation" }).click();
    await page.getByRole("button", { name: /save & track/i }).click();
    const boxes = page.getByRole("checkbox");
    const count = await boxes.count();
    for (let i = 0; i < count; i++) {
      await boxes.nth(i).check();
      await expect(boxes.nth(i)).toBeChecked();
    }
    await page.getByRole("button", { name: /mark as applied/i }).click();
    await expect(page.getByText(/marked as applied\. we'll keep it/i)).toBeVisible();
    await page.goBack();
    await page.getByRole("tab", { name: /my tracker/i }).click();
    await expect(page.getByTestId("opportunity-card")).toContainText("Applied");
  });

  test("notifications: badge, open, mark all read", async ({ page }) => {
    await page.goto("/#/for-you");
    await expect(page.getByRole("button", { name: /notifications \(3 unread\)/i })).toBeVisible();
    await page.getByRole("button", { name: /notifications/i }).click();
    await page.getByRole("button", { name: /mark all read/i }).click();
    await page.goBack();
    await expect(page.getByRole("button", { name: "Notifications", exact: true })).toBeVisible();
  });

  test("browser back returns to the previous screen", async ({ page }) => {
    await page.goto("/#/for-you");
    await page.getByRole("navigation", { name: "Main" }).getByRole("button", { name: "Explore" }).click();
    await page.getByRole("tab", { name: /creators/i }).click();
    await page.getByTestId("creator-card").first().click();
    await expect(page).toHaveURL(/#\/creator\//);
    await page.goBack();
    await expect(page).toHaveURL(/#\/explore/);
  });

  test("viewer cannot open admin or moderation screens", async ({ page }) => {
    for (const route of ["admin-dashboard", "moderation-governance", "creator-earnings"]) {
      await page.goto(`/#/${route}`);
      await page.reload();
      await expect(page.getByText(/don't have access to this area/i)).toBeVisible();
    }
  });

  test("funding list shows real listings with official links", async ({ page }) => {
    await page.goto("/#/funding");
    await expect(page.getByText(/checked against each funder's website/i)).toBeVisible();
    await expect(page.getByTestId("opportunity-card").first()).toBeVisible();
    await expect(page.getByText(/demo listing/i)).toHaveCount(0);
    await page.getByRole("tab", { name: /coming up/i }).click();
    await expect(page.getByTestId("opportunity-card").filter({ hasText: "Hot Docs" }).first()).toBeVisible();
    await page.getByTestId("opportunity-card").filter({ hasText: "Rogers Documentary Fund" }).click();
    await expect(page.getByRole("link", { name: /on funder's site/i })).toHaveAttribute("href", /rogersgroupoffunds\.com/);
  });

  test("reader: save, pick a chapter, and keep listening in the mini player", async ({ page }) => {
    await page.goto("/#/story/midnight-resonance");
    await page.getByRole("button", { name: /enter story/i }).click();
    await expect(page.getByTestId("expanded-player")).toBeVisible();
    await page.getByRole("button", { name: "Save story" }).click();
    await expect(page.getByRole("button", { name: "Remove from saved" })).toHaveAttribute("aria-pressed", "true");
    await page.getByRole("button", { name: "Chapter index" }).click();
    const rows = page.getByTestId("chapter-row");
    await expect(rows.first()).toHaveAttribute("data-state", "playing");
    await rows.nth(2).click();
    await expect(page.getByText(/chapter 3 of/i)).toBeVisible();
    await page.getByRole("button", { name: "Close", exact: true }).first().click();
    const mini = page.getByTestId("mini-player");
    await expect(mini).toBeVisible();
    await mini.getByRole("button", { name: /open player/i }).click();
    await expect(page.getByRole("dialog", { name: /now playing/i })).toBeVisible();
    await page.keyboard.press("Escape");
    await page.goto("/#/library");
    await page.getByRole("button", { name: /saved stor/i }).click();
    await expect(page.getByTestId("story-row").filter({ hasText: "Midnight Resonance" })).toBeVisible();
  });

  test("settings apply high contrast and reduced motion app-wide", async ({ page }) => {
    await page.goto("/#/settings");
    await page.getByRole("switch", { name: /high contrast/i }).click();
    await page.getByRole("switch", { name: /reduce motion/i }).click();
    await expect(page.locator("html")).toHaveAttribute("data-contrast", "high");
    await expect(page.locator("html")).toHaveAttribute("data-motion", "reduced");
    await page.getByRole("radio", { name: /français/i }).check();
    await expect(page.getByRole("heading", { name: "Préférences" })).toBeVisible();
  });

  test("funding filters in the drawer", async ({ page }) => {
    await page.goto("/#/funding");
    await page.getByRole("tab", { name: /coming up/i }).click();
    await page.getByRole("button", { name: /^filters/i }).click();
    const drawer = page.getByRole("dialog", { name: /filter funding/i });
    await drawer.getByRole("radio", { name: "Lab" }).check();
    await drawer.getByRole("button", { name: /show results/i }).click();
    await expect(page.getByTestId("opportunity-card")).toHaveCount(1);
    await expect(page.getByTestId("opportunity-card")).toContainText("Shared Ground");
    await page.getByRole("button", { name: /remove type filter/i }).click();
    await expect(page.getByTestId("opportunity-card").nth(1)).toBeVisible();
  });

  test("offline and error states are recoverable", async ({ page }) => {
    await page.goto("/?simulate=offline#/funding");
    await expect(page.getByText(/you're offline/i)).toBeVisible();
    await page.goto("/?simulate=error#/explore/creators");
    await expect(page.getByText(/couldn't load creators/i)).toBeVisible();
    await page.goto("/?simulate=none#/explore/creators");
    await expect(page.getByTestId("creator-card").first()).toBeVisible();
  });
});

test.describe("admin", () => {
  test("admin can open the platform dashboard", async ({ page }) => {
    await signInAs(page, "admin");
    await page.goto("/#/admin-dashboard");
    await page.reload();
    await expect(page.getByText(/don't have access/i)).toHaveCount(0);
  });
});

test.describe("responsive layout", () => {
  for (const width of [320, 360, 390, 430, 768, 1280]) {
    test(`no horizontal overflow at ${width}px`, async ({ page }) => {
      await signInAs(page, "creator");
      await page.setViewportSize({ width, height: 900 });
      for (const route of ["for-you", "explore/stories", "explore/creators", "explore/collections", "library", "profile", "funding", "notifications", "opportunity/cca-explore-create-research-creation"]) {
        await page.goto(`/#/${route}`);
        await page.waitForTimeout(400);
        const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
        expect(overflow, `${route} overflows by ${overflow}px`).toBeLessThanOrEqual(0);
      }
    });
  }
});
