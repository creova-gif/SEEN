import { describe, expect, it } from "vitest";
import { api, deadlineState, formatAmount, formatDeadline, ServiceError } from "../services";
import { setSimulation } from "../services/runtime";
import { getStoryWorldById } from "../data/storyDatabase";

describe("funding rules", () => {
  const now = new Date("2026-09-24T12:00:00Z");
  it("computes deadline state", () => {
    expect(deadlineState("2026-09-01T00:00:00Z", now)).toBe("closed");
    expect(deadlineState("2026-10-01T00:00:00Z", now)).toBe("closing-soon");
    expect(deadlineState("2026-12-01T00:00:00Z", now)).toBe("open");
  });
  it("formats amounts and deadlines", () => {
    expect(formatAmount({ amountMin: 1500, amountMax: 5000, currency: "CAD" })).toBe("$1,500–$5,000 CAD");
    expect(formatAmount({ amountMin: 8000, amountMax: 8000, currency: "CAD" })).toBe("$8,000 CAD");
    expect(formatDeadline("2026-09-25T12:00:00Z", now)).toBe("Closes tomorrow");
    expect(formatDeadline("2026-09-01T00:00:00Z", now)).toMatch(/^Closed /);
  });
});

describe("creators (derived from the story catalog)", () => {
  it("every creator's stories resolve to real stories", async () => {
    const creators = await api.creators.list();
    expect(creators.length).toBeGreaterThan(5);
    for (const c of creators) {
      expect(c.storyIds.length).toBeGreaterThan(0);
      for (const id of c.storyIds) expect(getStoryWorldById(id)).toBeDefined();
    }
    expect(new Set(creators.map(c => c.id)).size).toBe(creators.length);
  });

  it("persists follow state", async () => {
    const [first] = await api.creators.list();
    await api.creators.setFollowing(first.id, true);
    expect(await api.creators.listFollowing()).toEqual([first.id]);
    await api.creators.setFollowing(first.id, false);
    expect(await api.creators.listFollowing()).toEqual([]);
  });

  it("rejects unknown creators", async () => {
    await expect(api.creators.get("nope")).rejects.toMatchObject({ code: "not_found" });
    await expect(api.creators.setFollowing("nope", true)).rejects.toBeInstanceOf(ServiceError);
  });
});

describe("collections", () => {
  it("has thematic collections whose stories all exist", async () => {
    const list = await api.collections.list("thematic");
    expect(list.length).toBeGreaterThan(0);
    list.forEach(c => c.storyIds.forEach(id => expect(getStoryWorldById(id)).toBeDefined()));
  });

  it("saves and unsaves", async () => {
    const [c] = await api.collections.list();
    await api.collections.setSaved(c.id, true);
    expect(await api.collections.listSaved()).toContain(c.id);
    await api.collections.setSaved(c.id, false);
    expect(await api.collections.listSaved()).not.toContain(c.id);
  });
});

describe("funding tracker", () => {
  it("only allows 'applied' once every checklist step is done", async () => {
    const opp = (await api.funding.list())[0];
    await api.funding.updateApplication(opp.id, { status: "saved" });
    await expect(api.funding.updateApplication(opp.id, { status: "applied" })).rejects.toMatchObject({ code: "invalid" });
    const all = opp.steps.map((_, i) => i);
    await api.funding.updateApplication(opp.id, { completedSteps: all, status: "in-progress" });
    const done = await api.funding.updateApplication(opp.id, { status: "applied" });
    expect(done.status).toBe("applied");
    expect((await api.funding.listApplications()).map(a => a.opportunityId)).toContain(opp.id);
  });

  it("drops out-of-range and duplicate steps", async () => {
    const opp = (await api.funding.list())[0];
    const app = await api.funding.updateApplication(opp.id, { completedSteps: [0, 0, 99, -1] });
    expect(app.completedSteps).toEqual([0]);
  });

  it("labels every seeded listing as demo", async () => {
    (await api.funding.list()).forEach(o => expect(o.isDemo).toBe(true));
  });
});

describe("notifications", () => {
  it("marks one and all as read", async () => {
    const before = await api.notifications.unreadCount();
    expect(before).toBeGreaterThan(0);
    const [n] = await api.notifications.list();
    await api.notifications.markRead(n.id);
    expect(await api.notifications.unreadCount()).toBe(before - 1);
    await api.notifications.markAllRead();
    expect(await api.notifications.unreadCount()).toBe(0);
  });
});

describe("failure simulation", () => {
  it("surfaces offline and unavailable as typed errors", async () => {
    setSimulation("offline");
    await expect(api.creators.list()).rejects.toMatchObject({ code: "offline" });
    setSimulation("error");
    await expect(api.funding.list()).rejects.toMatchObject({ code: "unavailable" });
    setSimulation("none");
    await expect(api.funding.list()).resolves.toBeInstanceOf(Array);
  });
});
