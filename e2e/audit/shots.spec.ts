import { signInAs, test } from "../fixtures";
const OUT = process.env.SHOTS_DIR ?? "test-results/shots";
const ROUTES = ["for-you", "explore", "library", "profile", "funding", "creator/kira-chen", "story/midnight-resonance", "settings", "account", "notifications", "collections"];
test("screenshots", async ({ page }) => {
  test.setTimeout(300000);
  await signInAs(page, "viewer");
  await page.setViewportSize({ width: 390, height: 844 });
  for (const r of ROUTES) {
    await page.goto(`/#/${r}`);
    await page.waitForTimeout(1500);
    await page.screenshot({ path: `${OUT}/${r.replace(/\//g, "_")}.png` });
  }
});
