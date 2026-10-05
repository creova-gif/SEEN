import { test as base, expect, type Page } from "@playwright/test";

/**
 * Signs a seeded demo account in by writing the same localStorage records the
 * app's local auth store uses. Only for skipping the (separately tested)
 * onboarding animation; authorization still runs through the app's own guards.
 */
export async function signInAs(page: Page, role: "viewer" | "creator" | "moderator" | "admin") {
  await page.addInitScript(r => {
    if (sessionStorage.getItem("e2e-seeded")) return;
    sessionStorage.setItem("e2e-seeded", "1");
    const id = `user_e2e_${r}`;
    const db = JSON.parse(localStorage.getItem("seenos_users_db") || "{}");
    db[id] = { id, email: `${r}@e2e.test`, name: `E2E ${r}`, role: r, language: "en", intent: "explore" };
    localStorage.setItem("seenos_users_db", JSON.stringify(db));
    localStorage.setItem("seenos_auth_session", JSON.stringify({ accessToken: "tok_e2e", userId: id }));
    localStorage.setItem("onboarding_completed", "true");
    localStorage.setItem("hasEnteredSEEN", "true");
  }, role);
}

export const test = base;
export { expect };
