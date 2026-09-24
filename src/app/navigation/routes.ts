import type { UserRole } from "../contexts/StoryStateContext";
import type { RouteParams } from "./AppNav";

/**
 * Route table: every screen the app can show, its URL form, and who may see it.
 *
 * URLs are hash-based (`#/explore/creators`, `#/creator/kira-chen`) so they
 * work on Vercel's static hosting without rewrites, and so the browser back
 * button and deep links behave as users expect.
 */
export const SCREENS = [
  "onboarding",
  "for-you",
  "explore",
  "library",
  "profile",
  "search",
  "notifications",
  "story-preview",
  "story-chapter",
  "chapter-index",
  "creator-profile",
  "collections",
  "collection-detail",
  "funding",
  "opportunity",
  "about",
  "settings",
  "creator-publish",
  "creator-monetization",
  "creator-earnings",
  "subscription-management",
  "moderation-governance",
  "admin-dashboard",
] as const;

export type AppScreen = (typeof SCREENS)[number];

export const TAB_SCREENS: AppScreen[] = ["for-you", "explore", "library", "profile"];

/**
 * Explicit allow-lists (not a hierarchy): a moderator is not a creator and
 * has no business in the earnings screens. Screens not listed are open to any
 * signed-in user. This is a UX guard only — real enforcement must live in the
 * backend (RLS / API checks), see docs/security/AUTHORIZATION_MATRIX.md.
 */
export const SCREEN_ROLES: Partial<Record<AppScreen, UserRole[]>> = {
  "creator-monetization": ["creator", "admin"],
  "creator-earnings": ["creator", "admin"],
  "moderation-governance": ["moderator", "admin"],
  "admin-dashboard": ["admin"],
};

export function canAccess(screen: AppScreen, role: UserRole): boolean {
  const allowed = SCREEN_ROLES[screen];
  return !allowed || allowed.includes(role);
}

export function isScreen(s: string): s is AppScreen {
  return (SCREENS as readonly string[]).includes(s);
}

// Screens whose URL carries an id. `story` covers the story-preview route.
const ID_ROUTES: Partial<Record<AppScreen, string>> = {
  "creator-profile": "creator",
  "collection-detail": "collection",
  opportunity: "opportunity",
  "story-preview": "story",
};
const ID_ROUTES_REVERSE = Object.fromEntries(Object.entries(ID_ROUTES).map(([k, v]) => [v, k])) as Record<string, AppScreen>;

export function toHash(screen: AppScreen, params: RouteParams = {}): string {
  const seg = ID_ROUTES[screen];
  if (seg && params.id) return `#/${seg}/${encodeURIComponent(params.id)}`;
  if (screen === "explore" && params.tab) return `#/explore/${params.tab}`;
  return `#/${screen}`;
}

export function fromHash(hash: string): { screen: AppScreen; params: RouteParams } | null {
  const parts = hash.replace(/^#\/?/, "").split("/").filter(Boolean).map(decodeURIComponent);
  if (parts.length === 0) return null;
  const [head, arg] = parts;
  if (ID_ROUTES_REVERSE[head] && arg) return { screen: ID_ROUTES_REVERSE[head], params: { id: arg } };
  if (head === "explore") return { screen: "explore", params: arg ? { tab: arg } : {} };
  if (isScreen(head) && head !== "onboarding") return { screen: head, params: {} };
  return null;
}

/** Screens that need state which a URL alone can't restore; deep links fall back to For You. */
export const NOT_DEEP_LINKABLE: AppScreen[] = ["onboarding", "story-chapter", "chapter-index"];
