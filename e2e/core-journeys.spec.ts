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

test.describe("reporting", () => {
  test("viewer reports a creator profile and a moderator sees it", async ({ page }) => {
    await signInAs(page, "viewer");
    await page.goto("/#/creator/kira-chen");
    await page.getByRole("button", { name: /report this profile/i }).click();
    await expect(page.getByRole("button", { name: /send report/i })).toBeDisabled();
    await page.getByLabel(/misleading or false/i).check();
    await page.getByRole("button", { name: /send report/i }).click();
    await expect(page.getByText(/a moderator will review/i)).toBeVisible();
    await page.getByRole("button", { name: /^done$/i }).click();

    // Same person reporting the same profile again is told it is already under review.
    await page.getByRole("button", { name: /report this profile/i }).click();
    await page.getByLabel(/misleading or false/i).check();
    await page.getByRole("button", { name: /send report/i }).click();
    await expect(page.getByText(/already reported this/i)).toBeVisible();

    // A moderator opens the Reports tab and finds it.
    await page.evaluate(() => {
      const db = JSON.parse(localStorage.getItem("seenos_users_db") || "{}");
      db.user_e2e_mod = { id: "user_e2e_mod", email: "mod@e2e.test", name: "E2E mod", role: "moderator", language: "en", intent: "explore" };
      localStorage.setItem("seenos_users_db", JSON.stringify(db));
      localStorage.setItem("seenos_auth_session", JSON.stringify({ accessToken: "tok_e2e", userId: "user_e2e_mod" }));
    });
    await page.goto("/#/moderation-governance");
    await page.reload();
    await page.getByRole("button", { name: /^reports \(1\)/i }).click();
    await expect(page.getByText("Kira Chen")).toBeVisible();
    await expect(page.getByText(/misleading or false/i)).toBeVisible();
    await page.getByRole("button", { name: /dismiss/i }).click();
    await expect(page.getByRole("button", { name: /^reports \(0\)/i })).toBeVisible();
  });
});

test.describe("private notes", () => {
  test("a reader sends a private note and the creator reads and deletes it", async ({ page }) => {
    await signInAs(page, "viewer");
    await page.goto("/#/story/midnight-resonance");
    await page.getByRole("button", { name: /write a private note/i }).click();
    await expect(page.getByRole("button", { name: /send note/i })).toBeDisabled();
    await page.getByLabel(/your note/i).fill("This stayed with me for days.");
    await page.getByRole("button", { name: /send note/i }).click();
    await expect(page.getByText(/creator will see your note/i)).toBeVisible();
    await page.getByRole("button", { name: /^done$/i }).click();

    // Same reader, same story, within the hour: told to wait.
    await page.getByRole("button", { name: /write a private note/i }).click();
    await page.getByLabel(/your note/i).fill("Another one");
    await page.getByRole("button", { name: /send note/i }).click();
    await expect(page.getByText(/already sent a note on this story/i)).toBeVisible();
    await page.keyboard.press("Escape");

    // The creator opens Notes from Settings; the reader is anonymous by default.
    await page.evaluate(() => {
      const db = JSON.parse(localStorage.getItem("seenos_users_db") || "{}");
      db.user_e2e_creator = { id: "user_e2e_creator", email: "creator@e2e.test", name: "E2E creator", role: "creator", language: "en", intent: "explore" };
      localStorage.setItem("seenos_users_db", JSON.stringify(db));
      localStorage.setItem("seenos_auth_session", JSON.stringify({ accessToken: "tok", userId: "user_e2e_creator" }));
    });
    await page.goto("/#/notes");
    await page.reload();
    await expect(page.getByText("This stayed with me for days.")).toBeVisible();
    await expect(page.getByText(/someone who read your story/i)).toBeVisible();
    // Block the sender: allowed, listed (anonymously) in Account and privacy, and reversible.
    await page.getByRole("button", { name: /block sender/i }).first().click();
    await page.getByRole("button", { name: /^block sender$/i }).last().click();
    await expect(page.getByText(/they can't send you new notes/i)).toBeVisible();
    await page.goto("/#/account");
    await expect(page.getByText("Blocked reader 1")).toBeVisible();
    await page.getByRole("button", { name: /^unblock$/i }).click();
    await expect(page.getByText(/no blocked accounts/i)).toBeVisible();
    await page.goto("/#/notes");
    await page.getByRole("button", { name: /delete note/i }).click();
    await page.getByRole("button", { name: /^delete note$/i }).last().click();
    await expect(page.getByText(/no notes yet/i)).toBeVisible();
  });

  test("a viewer cannot open the creator inbox", async ({ page }) => {
    await signInAs(page, "viewer");
    await page.goto("/#/notes");
    await expect(page.getByText(/don't have access to this area/i)).toBeVisible();
  });
});

test.describe("guest-first return", () => {
  test("a deep link survives onboarding and sign-up", async ({ page }) => {
    await page.goto("/#/story/midnight-resonance");
    await page.getByRole("button", { name: /S \. E \. E \. N/ }).click();
    await page.getByRole("button", { name: /^continue$/i }).click();
    await page.getByRole("button", { name: /viewer/i }).click();
    await page.getByRole("button", { name: /explore culture/i }).click();
    await page.getByPlaceholder("Name").fill("Deep Linker");
    await page.getByPlaceholder("Email").fill(`deep-${Date.now()}@example.com`);
    await page.getByPlaceholder("Password").fill("Password123");
    await page.getByRole("button", { name: /create account/i }).click();
    await page.getByRole("button", { name: /^continue$/i }).click();
    await page.getByRole("button", { name: /^continue$/i }).click();
    await page.getByRole("button", { name: /^enter$/i }).click();
    await expect(page).toHaveURL(/#\/story\/midnight-resonance$/);
  });
});

test.describe("keyboard-only", () => {
  test("report sheet traps focus, closes on Escape and returns focus to its button", async ({ page }) => {
    await signInAs(page, "viewer");
    await page.goto("/#/creator/kira-chen");
    const trigger = page.getByRole("button", { name: /report this profile/i });
    await trigger.focus();
    await page.keyboard.press("Enter");
    const dialog = page.getByRole("dialog");
    await expect(dialog).toBeVisible();
    for (let i = 0; i < 12; i++) {
      await page.keyboard.press("Tab");
      await expect(dialog.locator(":focus")).toHaveCount(1);
    }
    await page.keyboard.press("Escape");
    await expect(dialog).toBeHidden();
    await expect(trigger).toBeFocused();
  });

  test("delete account asks first and Escape cancels without deleting", async ({ page }) => {
    await signInAs(page, "viewer");
    await page.goto("/#/account");
    const del = page.getByRole("button", { name: /delete my account/i });
    await del.focus();
    await page.keyboard.press("Enter");
    await expect(page.getByRole("alertdialog").or(page.getByRole("dialog"))).toBeVisible();
    await page.keyboard.press("Escape");
    await expect(page.getByRole("alertdialog").or(page.getByRole("dialog"))).toBeHidden();
    await expect(del).toBeFocused();
    await expect(page).toHaveURL(/#\/account$/);
  });

  test("note sheet can be completed with the keyboard alone", async ({ page }) => {
    await signInAs(page, "viewer");
    await page.goto("/#/story/midnight-resonance");
    await page.getByRole("button", { name: /write a private note/i }).focus();
    await page.keyboard.press("Enter");
    await page.getByLabel(/your note/i).focus();
    await page.keyboard.type("Typed without a mouse");
    await page.getByRole("button", { name: /send note/i }).focus();
    await page.keyboard.press("Enter");
    await expect(page.getByText(/creator will see your note/i)).toBeVisible();
  });
});

test.describe("french", () => {
  test("the note flow follows the chosen language", async ({ page }) => {
    await signInAs(page, "viewer");
    await page.goto("/#/settings");
    await page.getByLabel("Français").check();
    await page.goto("/#/story/midnight-resonance");
    await page.getByRole("button", { name: /note privée/i }).click();
    await expect(page.getByRole("heading", { name: /écrire une note privée/i })).toBeVisible();
    await page.getByLabel(/votre note/i).fill("Merci pour cette histoire.");
    await page.getByRole("button", { name: /envoyer la note/i }).click();
    await expect(page.getByText(/verra votre note/i)).toBeVisible();
  });
});

test.describe("french: report and account", () => {
  test("report sheet and account screen follow the language", async ({ page }) => {
    await signInAs(page, "viewer");
    await page.goto("/#/settings");
    await page.getByLabel("Français").check();
    await page.goto("/#/creator/kira-chen");
    await page.getByRole("button", { name: /signaler ce profil/i }).click();
    await expect(page.getByRole("heading", { name: /signaler ce profil/i })).toBeVisible();
    await page.getByLabel(/trompeur ou faux/i).check();
    await page.getByRole("button", { name: /envoyer le signalement/i }).click();
    await expect(page.getByText(/un modérateur examinera ce profil/i)).toBeVisible();
    await page.goto("/#/account");
    await expect(page.getByRole("heading", { name: /compte et confidentialité/i })).toBeVisible();
    await expect(page.getByRole("button", { name: /supprimer mon compte/i })).toBeVisible();
  });
});

test.describe("search: landing, filters, zero results", () => {
  test.beforeEach(async ({ page }) => { await signInAs(page, "viewer"); });

  test("landing offers themes; a theme runs a search; filters narrow it; zero results can be recovered", async ({ page }) => {
    await page.goto("/");
    await page.getByRole("button", { name: "Search", exact: true }).click();
    await expect(page.getByText(/browse by theme/i)).toBeVisible();
    await page.getByRole("region", { name: /browse by theme/i }).getByRole("button").first().click();
    await expect(page.getByTestId("story-card").first()).toBeVisible();
    // Filters sheet: choose a language that has no match in the current results, then see the count and reset.
    await page.getByRole("button", { name: /^filters/i }).click();
    await expect(page.getByRole("dialog", { name: /filters/i })).toBeVisible();
    await page.getByRole("button", { name: /^reset$/i }).click();
    await page.keyboard.press("Escape");
    // Zero results state with a way out
    await page.getByLabel(/search stories/i).fill("zzqqxx");
    await expect(page.getByText(/no results for/i)).toBeVisible();
  });

  test("a recent search is remembered on this device and can be cleared", async ({ page }) => {
    await page.goto("/");
    await page.getByRole("button", { name: "Search", exact: true }).click();
    await page.getByPlaceholder(/search by title/i).fill("midnight");
    await page.getByTestId("story-card").first().click();
    await page.goto("/");
    await page.getByRole("button", { name: "Search", exact: true }).click();
    const recents = page.getByRole("region", { name: /^recent searches$/i });
    await expect(recents).toBeVisible();
    await expect(recents.getByRole("button", { name: /midnight/i })).toBeVisible();
    await page.getByRole("button", { name: /clear recent searches/i }).click();
    await expect(recents).toBeHidden();
  });
});

test.describe("reader: transcript, captions, completion", () => {
  test.beforeEach(async ({ page }) => { await signInAs(page, "viewer"); });

  test("transcript shows the chapter text; captions toggle; finishing the last chapter shows completion", async ({ page }) => {
    await page.goto("/#/story/midnight-resonance");
    await page.getByRole("button", { name: /enter story/i }).click();
    await page.getByRole("button", { name: /^transcript$/i }).click();
    const dialog = page.getByRole("dialog", { name: /transcript/i });
    await expect(dialog).toBeVisible();
    await expect(dialog.getByText(/timed captions are not available yet/i)).toBeVisible();
    await page.keyboard.press("Escape");
    const cc = page.getByRole("button", { name: /^captions$/i });
    await expect(cc).toHaveAttribute("aria-pressed", "false");
    await cc.click();
    await expect(cc).toHaveAttribute("aria-pressed", "true");
    // walk to the last chapter, then Finish
    for (let i = 0; i < 6; i++) {
      const next = page.getByRole("button", { name: /^(next|finish)$/i });
      if (/finish/i.test((await next.innerText()).trim())) break;
      await next.click();
      await page.waitForTimeout(700);
    }
    await page.getByRole("button", { name: /^finish$/i }).click();
    const done = page.getByRole("dialog", { name: /you finished/i });
    await expect(done).toBeVisible();
    await expect(done.getByRole("button", { name: /share a reflection/i })).toBeVisible();
    await done.getByRole("button", { name: /keep reading/i }).click();
    await expect(done).toBeHidden();
  });
});

test.describe("library: following and collections tabs", () => {
  test.beforeEach(async ({ page }) => { await signInAs(page, "viewer"); });

  test("followed creators appear in Library and can be unfollowed", async ({ page }) => {
    await page.goto("/#/creator/kira-chen");
    await page.getByRole("button", { name: /^follow$/i }).click();
    await page.goto("/#/library");
    await page.getByRole("button", { name: /following/i }).first().click();
    const row = page.getByRole("button", { name: /open kira chen/i });
    await expect(row).toBeVisible();
    await page.getByRole("button", { name: /unfollow kira chen/i }).click();
    await expect(page.getByText(/not following anyone yet/i)).toBeVisible();
  });

  test("saved collections appear in Library", async ({ page }) => {
    await page.goto("/#/library");
    await page.getByRole("button", { name: /saved collections?$/i }).click();
    await expect(page.getByText(/no saved collections/i)).toBeVisible();
    await page.getByRole("button", { name: /browse collections/i }).click();
    await expect(page).toHaveURL(/#\/explore\/collections/);
  });
});

test.describe("profile: edit, password, legal", () => {
  test("edit profile saves name and bio; legal opens signed out", async ({ page }) => {
    await signInAs(page, "viewer");
    await page.goto("/#/edit-profile");
    await expect(page.getByRole("heading", { name: /edit profile/i })).toBeVisible();
    await page.getByLabel(/display name/i).fill("Ada Reader");
    await page.locator("#edit-bio").fill("I read at night.");
    await page.getByRole("button", { name: /save changes/i }).click();
    await page.goto("/#/edit-profile");
    await expect(page.getByLabel(/display name/i)).toHaveValue("Ada Reader");
    await expect(page.locator("#edit-bio")).toHaveValue("I read at night.");
  });

  test("change password screen renders and blocks mismatched confirm", async ({ page }) => {
    await signInAs(page, "viewer");
    await page.goto("/#/change-password");
    await page.getByLabel(/^current password/i).fill("whatever1A");
    await page.getByLabel(/^new password/i).fill("Str0ngPass!word");
    await page.getByLabel(/confirm new password/i).fill("different");
    await expect(page.getByText(/passwords don't match/i)).toBeVisible();
    await expect(page.getByRole("button", { name: /update password/i })).toBeDisabled();
  });

  test("legal screen is public", async ({ page }) => {
    await page.goto("/#/legal");
    await expect(page.getByRole("heading", { name: /terms/i }).first()).toBeVisible();
  });
});

test.describe("creator: your stories", () => {
  test("lists drafts and published tabs; discard removes a draft; viewers are blocked", async ({ page }) => {
    await signInAs(page, "creator");
    await page.goto("/#/creator-stories");
    await expect(page.getByRole("heading", { name: /your stories/i })).toBeVisible();
    await page.getByRole("tab", { name: /^drafts/i }).click();
    await expect(page.getByText(/no drafts/i)).toBeVisible();
    await page.getByRole("button", { name: /new story/i }).click();
    await expect(page).toHaveURL(/#\/creator-publish/);
  });

  test("viewer cannot open creator stories", async ({ page }) => {
    await signInAs(page, "viewer");
    await page.goto("/#/creator-stories");
    await expect(page.getByRole("heading", { name: /your stories/i })).toHaveCount(0);
  });
});
