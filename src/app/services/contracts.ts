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
export type OpportunityType = "grant" | "residency" | "commission" | "fellowship" | "fund" | "lab" | "pitch";
export type ApplicationStatus = "none" | "saved" | "in-progress" | "applied";
/**
 * open / closing-soon / closed — fixed deadline, computed against now.
 * rolling  — apply any time (e.g. before your project starts).
 * upcoming — intake announced but not open yet.
 * tba      — recurring programme whose next dates the funder hasn't confirmed.
 */
export type DeadlineState = "open" | "closing-soon" | "closed" | "rolling" | "upcoming" | "tba";
export type Availability = "deadline" | "rolling" | "upcoming" | "tba";

export interface FundingOpportunity {
  id: string;
  title: string;
  funder: string;
  type: OpportunityType;
  /** null when the funder publishes no single figure; see amountNote. */
  amountMin: number | null;
  amountMax: number | null;
  amountNote?: string;
  currency: "CAD";
  availability: Availability;
  /** Only set when the funder has published the date. Never estimated. */
  deadline: ISODate | null;
  opensAt?: ISODate | null;
  /** IANA zone the funder publishes the deadline in (default America/Toronto). */
  deadlineTimeZone?: string;
  deadlineNote?: string;
  region: string;
  summary: string;
  eligibility: string[];
  disciplines: string[];
  languages: string[];
  steps: string[];        // application checklist shown on the detail screen
  applyUrl: string;       // funder's official programme page
  sourceUrls: string[];   // where each fact was verified
  verifiedAt: ISODate;    // when SEEN last checked the listing
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
