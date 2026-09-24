import { describe, expect, it } from "vitest";
import { SCREENS, canAccess, fromHash, toHash, type AppScreen } from "../navigation/routes";

describe("hash routes", () => {
  it("round-trips id routes", () => {
    for (const [screen, id] of [
      ["creator-profile", "kira-chen"],
      ["collection-detail", "theme-migration-diaspora"],
      ["opportunity", "opp-first-voices-residency"],
      ["story-preview", "midnight-resonance"],
    ] as [AppScreen, string][]) {
      const hash = toHash(screen, { id });
      expect(fromHash(hash)).toEqual({ screen, params: { id } });
    }
  });

  it("round-trips explore tabs and plain screens", () => {
    expect(fromHash(toHash("explore", { tab: "creators" }))).toEqual({ screen: "explore", params: { tab: "creators" } });
    expect(fromHash(toHash("funding"))).toEqual({ screen: "funding", params: {} });
  });

  it("rejects unknown and onboarding routes", () => {
    expect(fromHash("#/does-not-exist")).toBeNull();
    expect(fromHash("#/onboarding")).toBeNull();
    expect(fromHash("")).toBeNull();
  });

  it("encodes ids safely", () => {
    const hash = toHash("creator-profile", { id: "a b/c" });
    expect(fromHash(hash)?.params.id).toBe("a b/c");
  });
});

describe("screen permissions", () => {
  it("restricts admin to admins", () => {
    expect(canAccess("admin-dashboard", "admin")).toBe(true);
    expect(canAccess("admin-dashboard", "moderator")).toBe(false);
    expect(canAccess("admin-dashboard", "creator")).toBe(false);
    expect(canAccess("admin-dashboard", "viewer")).toBe(false);
  });

  it("does not let moderators into creator money screens (allow-list, not hierarchy)", () => {
    expect(canAccess("creator-earnings", "moderator")).toBe(false);
    expect(canAccess("creator-earnings", "creator")).toBe(true);
    expect(canAccess("moderation-governance", "creator")).toBe(false);
    expect(canAccess("moderation-governance", "moderator")).toBe(true);
  });

  it("keeps every public screen open to viewers", () => {
    const restricted = new Set(["admin-dashboard", "moderation-governance", "creator-earnings", "creator-monetization"]);
    for (const s of SCREENS) {
      if (!restricted.has(s)) expect(canAccess(s, "viewer")).toBe(true);
    }
  });
});
