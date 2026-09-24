/**
 * API contracts for the SEEN feature domains added in the product-completion
 * pass (Creators, Collections, Funding, Notifications).
 *
 * UI code depends only on these interfaces. `demoAdapter` (services/demo/*)
 * implements them against seeded data + localStorage so the product is fully
 * testable today; a Supabase adapter implementing the same interfaces is the
 * planned swap (docs/architecture/API_CONTRACTS.md). Every entity that will be
 * tenant-scoped carries an `orgId` so row-level policies can key on it.
 */

export type ISODate = string;

// ---------------------------------------------------------------- Creators
export interface Creator {
  id: string;            // stable slug, e.g. "kira-chen"
  name: string;
  bio: string;
  themes: string[];      // derived from the creator's published stories
  storyIds: string[];
  languages: string[];
  orgId: string | null;  // institutional/collective owner, null for individuals
}

export interface CreatorsApi {
  list(): Promise<Creator[]>;
  get(id: string): Promise<Creator>;
  listFollowing(): Promise<string[]>;
  setFollowing(id: string, following: boolean): Promise<void>;
}

// ------------------------------------------------------------- Collections
export type CollectionKind = "thematic" | "institutional";

export interface Collection {
  id: string;
  kind: CollectionKind;
  title: string;
  description: string;
  curator: string;
  storyIds: string[];
  coverStoryId: string;
  orgId: string | null;
}

export interface CollectionsApi {
  list(kind?: CollectionKind): Promise<Collection[]>;
  get(id: string): Promise<Collection>;
  listSaved(): Promise<string[]>;
  setSaved(id: string, saved: boolean): Promise<void>;
}

// ----------------------------------------------------------------- Funding
export type OpportunityType = "grant" | "residency" | "commission" | "fellowship";
export type ApplicationStatus = "none" | "saved" | "in-progress" | "applied";
export type DeadlineState = "open" | "closing-soon" | "closed";

export interface FundingOpportunity {
  id: string;
  title: string;
  funder: string;
  type: OpportunityType;
  amountMin: number;
  amountMax: number;
  currency: "CAD";
  deadline: ISODate;
  summary: string;
  eligibility: string[];
  disciplines: string[];
  languages: string[];
  steps: string[];        // application checklist shown on the detail screen
  isDemo: boolean;        // demo listings are always labelled in the UI
  orgId: string | null;
}

export interface ApplicationState {
  opportunityId: string;
  status: ApplicationStatus;
  completedSteps: number[];
  updatedAt: ISODate;
}

export interface FundingApi {
  list(): Promise<FundingOpportunity[]>;
  get(id: string): Promise<FundingOpportunity>;
  listApplications(): Promise<ApplicationState[]>;
  getApplication(id: string): Promise<ApplicationState>;
  updateApplication(id: string, patch: Partial<Pick<ApplicationState, "status" | "completedSteps">>): Promise<ApplicationState>;
}

// ----------------------------------------------------------- Notifications
export type NotificationType = "story" | "funding" | "money" | "moderation";

export interface SeenNotification {
  id: string;
  type: NotificationType;
  title: string;
  body: string;
  createdAt: ISODate;
  read: boolean;
  /** Where tapping the notification should take the user. */
  target?: { screen: "story" | "opportunity" | "creator" | "collection" | "moderation"; id?: string };
}

export interface NotificationsApi {
  list(): Promise<SeenNotification[]>;
  markRead(id: string): Promise<void>;
  markAllRead(): Promise<void>;
  unreadCount(): Promise<number>;
}

export interface SeenApi {
  creators: CreatorsApi;
  collections: CollectionsApi;
  funding: FundingApi;
  notifications: NotificationsApi;
}
