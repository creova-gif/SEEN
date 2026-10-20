import AxeBuilder from "@axe-core/playwright";
import type { Page } from "@playwright/test";
import { expect, signInAs, test } from "./fixtures";

/** Limited guest mode (D2) and the five-tab bar with Create (DT1, DT2). */

async function enterAsGuest(page: Page, hash = "/") {
  await page.goto(hash);
  await page.getByRole("button", { name: /s\W*e\W*e\W*n/i }).click();
  await page.getByRole("button", { name: /^continue$/i }).click();
  await page.getByRole("button", { name: /explore without an account/i }).click();
}

const nav = (page: Page) => page.getByRole("navigation", { name: "Main" });

test.describe("guest", () => {
  test("the protected first screens still come first; the guest link lives on the purpose step", async ({ page }) => {
    await page.goto("/");
    await expect(page.getByRole("button", { name: /explore without an account/i })).toHaveCount(0);
    await page.getByRole("button", { name: /s\W*e\W*e\W*n/i }).click();
    await expect(page.getByRole("heading", { name: /this is not\s+social media/i })).toBeVisible();
    await expect(page.getByRole("button", { name: /explore without an account/i })).toHaveCount(0);
    await page.getByRole("button", { name: /^continue$/i }).click();
    await expect(page.getByRole("button", { name: /explore without an account/i })).toBeVisible();
  });

  test("a guest lands on For You with the banner and locked tabs, and keeps their place after a reload", async ({ page }) => {
    await enterAsGuest(page);
    await expect(page).toHaveURL(/#\/for-you$/);
    await expect(page.getByRole("heading", { name: "For You" })).toBeVisible();
    await expect(page.getByRole("note").filter({ hasText: /exploring as a guest/i })).toBeVisible();
    for (const tab of ["Create", "Library", "Profile"]) await expect(nav(page).getByRole("button", { name: `${tab}, sign in required` })).toBeVisible();
    await expect(nav(page).getByRole("button", { name: "Explore", exact: true })).toBeVisible();

    await page.reload();
    await expect(page.getByRole("heading", { name: "For You" })).toBeVisible();
  });

  test("locked tabs open the sheet; 'Not now' leaves the guest where they were", async ({ page }) => {
    await enterAsGuest(page);
    await nav(page).getByRole("button", { name: "Library, sign in required" }).click();
    const sheet = page.getByRole("dialog");
    await expect(sheet.getByText("Your Library is waiting")).toBeVisible();
    await sheet.getByRole("button", { name: /not now/i }).click();
    await expect(sheet).toBeHidden();
    await expect(page).toHaveURL(/#\/for-you$/);

    await nav(page).getByRole("button", { name: "Create, sign in required" }).click();
    await expect(page.getByRole("dialog").getByText("Tell a story on SEEN")).toBeVisible();
  });

  test("typing a private URL gets the sheet, never a private screen", async ({ page }) => {
    await enterAsGuest(page);
    for (const [hash, headline] of [["#/library", "Your Library is waiting"], ["#/profile", "Make SEEN yours"], ["#/creator-publish", "Tell a story on SEEN"], ["#/admin-dashboard", "Sign in to see this"]] as const) {
      await page.evaluate(h => { window.location.hash = h; }, hash);
      await expect(page.getByRole("dialog").getByText(headline)).toBeVisible();
      await page.getByRole("dialog").getByRole("button", { name: /not now/i }).click();
      await expect(page.getByRole("dialog")).toBeHidden();
      // Behind the sheet is the same sign-in prompt, not the screen.
      await expect(page.getByRole("button", { name: "Create free account" }).first()).toBeVisible();
    }
  });

  test("saving a story: guest taps Save, creates an account, and the story is saved", async ({ page }) => {
    await enterAsGuest(page);
    await page.evaluate(() => { window.location.hash = "#/story/midnight-resonance"; });
    await expect(page.getByRole("heading", { name: /midnight resonance/i }).first()).toBeVisible();
    await page.getByRole("button", { name: /save to library/i }).click();
    const sheet = page.getByRole("dialog");
    await expect(sheet.getByText("Keep this story")).toBeVisible();
    await sheet.getByRole("button", { name: "Create free account" }).click();

    await page.getByPlaceholder("Name").fill("Guest Saver");
    await page.getByPlaceholder("Email").fill(`guest-${Date.now()}@example.com`);
    await page.getByPlaceholder("Password").fill("Password123");
    await page.getByRole("button", { name: /create account/i }).click();

    await expect(page.getByText(/saved to your library/i).first()).toBeVisible();
    await expect(page).toHaveURL(/#\/story\/midnight-resonance$/);
    await expect(page.getByRole("button", { name: /saved|remove from library/i }).first()).toBeVisible();
    // Signed in now: the guest banner is gone from For You and the tabs are unlocked.
    await page.goto("/#/for-you");
    await expect(page.getByRole("note").filter({ hasText: /exploring as a guest/i })).toHaveCount(0);
    await expect(nav(page).getByRole("button", { name: "Library", exact: true })).toBeVisible();
  });

  test("a guest follows a creator only after signing in", async ({ page }) => {
    await enterAsGuest(page);
    await page.goto("/#/creator/kira-chen");
    await page.getByRole("button", { name: /^follow$/i }).click();
    await expect(page.getByRole("dialog").getByText(/^Follow /)).toBeVisible();
    await page.getByRole("dialog").getByRole("button", { name: /not now/i }).click();
    expect(await page.evaluate(() => localStorage.getItem("seen.v1.following"))).toBeNull();
  });

  test("a guest reads chapter 1 and is asked to sign in to continue", async ({ page }) => {
    await enterAsGuest(page);
    await page.evaluate(() => { window.location.hash = "#/story/voices-of-migration"; });
    await expect(page.getByRole("heading", { name: /voices of migration/i }).first()).toBeVisible();
    await page.getByRole("button", { name: /start reading/i }).click();
    const next = page.getByRole("button", { name: /^next/i }).first();
    await expect(next).toBeVisible();
    await next.click();
    await expect(page.getByRole("dialog").getByText("Keep reading")).toBeVisible();
  });

  test("the guest sheet has no serious accessibility violations and Escape closes it", async ({ page }) => {
    await enterAsGuest(page);
    await nav(page).getByRole("button", { name: "Library, sign in required" }).click();
    const sheet = page.getByRole("dialog");
    await expect(sheet).toBeVisible();
    await page.waitForTimeout(600);
    const results = await new AxeBuilder({ page }).withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa"]).analyze();
    const blocking = results.violations.filter(v => v.impact === "critical" || v.impact === "serious");
    expect(blocking, blocking.map(v => `${v.id}: ${v.nodes[0]?.target.join(" ")}`).join("\n")).toEqual([]);
    await page.keyboard.press("Escape");
    await expect(sheet).toBeHidden();
  });
});

test.describe("Create tab", () => {
  test("a new member sees the creator intro once, then goes straight to the publish flow", async ({ page }) => {
    await signInAs(page, "viewer");
    await page.goto("/#/for-you");
    await nav(page).getByRole("button", { name: "Create", exact: true }).click();
    await expect(page).toHaveURL(/#\/creator-intro$/);
    await expect(page.getByRole("heading", { name: "Tell a story on SEEN" })).toBeVisible();
    await page.getByRole("button", { name: "Start a story" }).click();
    await expect(page).toHaveURL(/#\/creator-publish$/);

    await page.goto("/#/for-you");
    await nav(page).getByRole("button", { name: "Create", exact: true }).click();
    await expect(page).toHaveURL(/#\/creator-publish$/);
  });

  test("a creator goes straight to the publish flow", async ({ page }) => {
    await signInAs(page, "creator");
    await page.goto("/#/for-you");
    await nav(page).getByRole("button", { name: "Create", exact: true }).click();
    await expect(page).toHaveURL(/#\/creator-publish$/);
  });
});

test.describe("five-tab bar", () => {
  for (const lang of ["en", "fr", "es"] as const) {
    for (const width of [320, 360, 390]) {
      test(`no tab label is clipped or overlaps at ${width}px in ${lang}`, async ({ page }) => {
        await signInAs(page, "viewer", lang);
        await page.setViewportSize({ width, height: 740 });
        await page.goto("/#/for-you");
        await expect(nav(page).getByRole("button")).toHaveCount(5);
        const result = await page.evaluate(() =>
          [...document.querySelectorAll("nav[aria-label=Main] button")].map(b => {
            const label = b.querySelector("span:last-child") as HTMLElement;
            const range = document.createRange();
            range.selectNodeContents(label);
            const text = range.getBoundingClientRect();
            const box = b.getBoundingClientRect();
            return { label: label.innerText, textWidth: Math.round(text.width), tabWidth: Math.round(box.width), inside: text.left >= box.left - 0.5 && text.right <= box.right + 0.5, tall: Math.round(box.height) };
          }),
        );
        for (const r of result) {
          expect(r.inside, `${lang} ${width}px "${r.label}" is ${r.textWidth}px in a ${r.tabWidth}px tab`).toBe(true);
          expect(r.tall, `${r.label} tap height`).toBeGreaterThanOrEqual(44);
          expect(r.tabWidth, `${r.label} tap width`).toBeGreaterThanOrEqual(44);
        }
      });
    }
  }
});

test.describe("tab re-tap (PR-3)", () => {
  for (const tab of [["For You", "for-you"], ["Explore", "explore"], ["Library", "library"], ["Profile", "profile"]] as const) {
    test(`tapping the active ${tab[0]} tab scrolls to the top and stays on the screen`, async ({ page }) => {
      await signInAs(page, "viewer");
      await page.goto(`/#/${tab[1]}`);
      await expect(nav(page).getByRole("button", { name: tab[0], exact: true })).toHaveAttribute("aria-current", "page");
      await page.mouse.move(200, 400);
      await page.mouse.wheel(0, 1600);
      await expect.poll(() => page.evaluate(() => window.scrollY)).toBeGreaterThan(50); // Library is short in demo data
      await page.waitForTimeout(1200); // let the wheel's own smooth scroll finish before the tap
      await nav(page).getByRole("button", { name: tab[0], exact: true }).click();
      await expect.poll(() => page.evaluate(() => window.scrollY)).toBe(0);
      await expect(page).toHaveURL(new RegExp(`#/${tab[1]}`));
    });
  }
});

test.describe("creator navigation (PR-2)", () => {
  test("a creator reaches Your stories from the publish flow and from Profile; a viewer sees no such link", async ({ page }) => {
    await signInAs(page, "creator");
    await page.goto("/#/creator-publish");
    await page.getByRole("button", { name: "Your stories", exact: true }).click();
    await expect(page).toHaveURL(/#\/creator-stories$/);
    await expect(page.getByRole("heading", { name: /your stories/i })).toBeVisible();

    await page.goto("/#/profile");
    await page.getByRole("button", { name: "Your stories", exact: true }).click();
    await expect(page).toHaveURL(/#\/creator-stories$/);
  });

  test("a viewer does not see Your stories in the publish flow", async ({ page }) => {
    await signInAs(page, "viewer");
    await page.goto("/#/creator-publish");
    await expect(page.getByRole("button", { name: "Close", exact: true })).toBeVisible();
    await expect(page.getByRole("button", { name: "Your stories", exact: true })).toHaveCount(0);
  });
});
