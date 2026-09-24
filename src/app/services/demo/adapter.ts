import type {
  ApplicationState,
  Collection,
  CollectionKind,
  Creator,
  SeenApi,
  SeenNotification,
} from "../contracts";
import { ServiceError, call, readStore, writeStore } from "../runtime";
import { FUNDING_SEED, buildCollections, buildCreators, seedNotifications } from "./catalog";

// Derived once per session; the story catalog is static.
let creatorsCache: Creator[] | null = null;
let collectionsCache: Collection[] | null = null;
const creators = () => (creatorsCache ??= buildCreators());
const collections = () => (collectionsCache ??= buildCollections());

function toggle(list: string[], id: string, on: boolean): string[] {
  const set = new Set(list);
  if (on) set.add(id);
  else set.delete(id);
  return [...set];
}

function notificationsStore(): SeenNotification[] {
  let list = readStore<SeenNotification[] | null>("notifications", null);
  if (!list) {
    list = seedNotifications(new Date());
    writeStore("notifications", list);
  }
  return list;
}

/** Push a notification from elsewhere in the app (e.g. after publishing). */
export function pushNotification(n: Omit<SeenNotification, "id" | "createdAt" | "read">) {
  const list = notificationsStore();
  writeStore("notifications", [
    { ...n, id: `n-${Date.now().toString(36)}`, createdAt: new Date().toISOString(), read: false },
    ...list,
  ]);
}

export const demoAdapter: SeenApi = {
  creators: {
    list: () => call(() => creators()),
    get: id =>
      call(() => {
        const c = creators().find(x => x.id === id);
        if (!c) throw new ServiceError("Creator not found.", "not_found");
        return c;
      }),
    listFollowing: () => call(() => readStore<string[]>("following", [])),
    setFollowing: (id, following) =>
      call(() => {
        if (!creators().some(c => c.id === id)) throw new ServiceError("Creator not found.", "not_found");
        writeStore("following", toggle(readStore<string[]>("following", []), id, following));
      }),
  },

  collections: {
    list: (kind?: CollectionKind) => call(() => collections().filter(c => !kind || c.kind === kind)),
    get: id =>
      call(() => {
        const c = collections().find(x => x.id === id);
        if (!c) throw new ServiceError("Collection not found.", "not_found");
        return c;
      }),
    listSaved: () => call(() => readStore<string[]>("savedCollections", [])),
    setSaved: (id, saved) =>
      call(() => {
        if (!collections().some(c => c.id === id)) throw new ServiceError("Collection not found.", "not_found");
        writeStore("savedCollections", toggle(readStore<string[]>("savedCollections", []), id, saved));
      }),
  },

  funding: {
    list: () => call(() => FUNDING_SEED),
    get: id =>
      call(() => {
        const o = FUNDING_SEED.find(x => x.id === id);
        if (!o) throw new ServiceError("Opportunity not found.", "not_found");
        return o;
      }),
    listApplications: () => call(() => Object.values(readStore<Record<string, ApplicationState>>("applications", {}))),
    getApplication: id =>
      call(() => {
        const apps = readStore<Record<string, ApplicationState>>("applications", {});
        return apps[id] ?? { opportunityId: id, status: "none", completedSteps: [], updatedAt: new Date(0).toISOString() };
      }),
    updateApplication: (id, patch) =>
      call(() => {
        const opp = FUNDING_SEED.find(x => x.id === id);
        if (!opp) throw new ServiceError("Opportunity not found.", "not_found");
        const apps = readStore<Record<string, ApplicationState>>("applications", {});
        const prev = apps[id] ?? { opportunityId: id, status: "none" as const, completedSteps: [], updatedAt: "" };
        const completedSteps = (patch.completedSteps ?? prev.completedSteps).filter(i => i >= 0 && i < opp.steps.length);
        if (patch.status === "applied" && completedSteps.length < opp.steps.length) {
          throw new ServiceError("Complete every checklist step before marking as applied.", "invalid");
        }
        const next: ApplicationState = {
          opportunityId: id,
          status: patch.status ?? prev.status,
          completedSteps: [...new Set(completedSteps)].sort((a, b) => a - b),
          updatedAt: new Date().toISOString(),
        };
        apps[id] = next;
        writeStore("applications", apps);
        return next;
      }),
  },

  notifications: {
    list: () => call(() => [...notificationsStore()].sort((a, b) => b.createdAt.localeCompare(a.createdAt))),
    markRead: id =>
      call(() => {
        writeStore(
          "notifications",
          notificationsStore().map(n => (n.id === id ? { ...n, read: true } : n)),
        );
      }),
    markAllRead: () =>
      call(() => {
        writeStore(
          "notifications",
          notificationsStore().map(n => ({ ...n, read: true })),
        );
      }),
    unreadCount: () => call(() => notificationsStore().filter(n => !n.read).length),
  },
};
