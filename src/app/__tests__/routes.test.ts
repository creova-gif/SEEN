import { describe, expect, it } from "vitest";
import { SCREENS, canAccess, fromHash, toHash, type AppScreen } from "../navigation/routes";

describe("hash routes", () => {
  it("round-trips id routes", () => {
    for (const [screen, id] of [
      ["creator-profile", "kira-chen"],
      ["collection-detail", "theme-migration-diaspora"],
      ["opportunity", "cca-explore-create-research-creation"],
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

describe("malformed links", () => {
  it("ignores a bad percent-escape instead of throwing", () => {
    expect(() => fromHash("#/creator/50%")).not.toThrow();
    expect(fromHash("#/creator/50%")).toBeNull();
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

  // The whole role-by-route matrix, written out by hand so any change to who can open what fails here
  // (D14 regression contract). Screens not listed below are open to all four signed-in roles.
  const ROLES = ["viewer", "creator", "moderator", "admin"] as const;
  const RESTRICTED: Partial<Record<AppScreen, readonly (typeof ROLES)[number][]>> = {
    "creator-monetization": ["creator", "admin"],
    "creator-earnings": ["creator", "admin"],
    "creator-stories": ["creator", "admin"],
    notes: ["creator", "admin"],
    "moderation-governance": ["moderator", "admin"],
    "admin-dashboard": ["admin"],
  };

  it("matches the written matrix for every screen and every role", () => {
    const wrong: string[] = [];
    for (const screen of SCREENS) {
      for (const role of ROLES) {
        const expected = RESTRICTED[screen] ? RESTRICTED[screen]!.includes(role) : true;
        if (canAccess(screen, role) !== expected) wrong.push(`${role} -> ${screen}: expected ${expected}`);
      }
    }
    expect(wrong).toEqual([]);
  });

  it("lets a signed-in viewer open the publish flow (becoming a creator happens on first publish)", () => {
    expect(canAccess("creator-publish", "viewer")).toBe(true);
  });

  // Not built yet (guest mode, task DT1). Listed here as explicit requirements; todo tests do not fail CI.
  it.todo("a guest can open For You, Explore, Search and a story preview");
  it.todo("a guest opening #/library, #/profile or #/creator-publish gets the sign-in sheet, never a blank or private screen");
  it.todo("a guest can never open creator, moderator or admin screens, even by typing the URL");

  it("keeps every public screen open to viewers", () => {
    const restricted = new Set(["creator-stories", "admin-dashboard", "moderation-governance", "creator-earnings", "creator-monetization", "notes"]);
    for (const s of SCREENS) {
      if (!restricted.has(s)) expect(canAccess(s, "viewer")).toBe(true);
    }
  });
});
