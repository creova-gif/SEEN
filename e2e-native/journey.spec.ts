import { expect, test, type Page } from "@playwright/test";

/** First run as a guest, up to the story page. The same screens Expo Go shows. */
async function enterAsGuest(page: Page) {
  await page.goto("/");
  await page.getByText("English", { exact: true }).first().click();
  await page.getByRole("button", { name: "S.E.E.N" }).click();
  await page.getByRole("button", { name: /^continue$/i }).click();
  await page.getByRole("button", { name: /explore without an account/i }).click();
  await expect(page.getByText("For You", { exact: true }).first()).toBeVisible();
}

test("the entry screens come first, in order, with the guest link on the purpose step", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByText(/choose your language/i)).toBeVisible();
  await page.getByText("English", { exact: true }).first().click();
  await expect(page.getByText(/you are entering seen/i)).toBeVisible();
  await expect(page.getByText(/explore without an account/i)).toHaveCount(0);
  await page.getByRole("button", { name: "S.E.E.N" }).click();
  await expect(page.getByText(/this is not/i)).toBeVisible();
  await page.getByRole("button", { name: /^continue$/i }).click();
  await expect(page.getByText(/what brings you to seen/i)).toBeVisible();
  await expect(page.getByText(/explore without an account/i)).toBeVisible();
});

test("a guest lands on For You, opens a story and reaches chapter 1", async ({ page }) => {
  await enterAsGuest(page);
  await expect(page.getByText(/exploring as a guest/i)).toBeVisible();
  await page.getByRole("button", { name: /midnight resonance|voices of migration/i }).first().click();
  await expect(page.getByRole("button", { name: /start reading/i })).toBeVisible();
  await page.getByRole("button", { name: /start reading/i }).click();
  await expect(page.getByText(/chapter 1 of/i)).toBeVisible();
  await expect(page.getByRole("button", { name: /^play$/i })).toBeVisible();
});

test("a guest is asked to sign in to save, and the account form creates an account that finishes the save", async ({ page }) => {
  await enterAsGuest(page);
  await page.getByRole("button", { name: /midnight resonance|voices of migration/i }).first().click();
  await page.getByRole("button", { name: /save to library/i }).click();
  await expect(page.getByText("Keep this story")).toBeVisible();
  await page.getByRole("button", { name: "Create free account" }).click();
  await page.getByLabel("Name").fill("Maya");
  await page.getByLabel("Email").fill(`maya-${Date.now()}@example.com`);
  await page.getByLabel("Password").fill("Password123");
  await page.getByRole("button", { name: "Create account" }).click();
  await expect(page.getByRole("button", { name: /remove from library/i })).toBeVisible();
});
