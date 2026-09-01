/**
 * ADMIN / PLATFORM OPERATIONS — SERVICE LAYER
 *
 * localStorage-backed user directory + moderation queue persistence.
 * Reads the same 'seenos_users_db' store AuthContext writes to, so the
 * admin dashboard reflects real signed-up accounts in this demo
 * environment. Swap for real API calls once a backend is deployed.
 */

import type { UserRole } from '../contexts/StoryStateContext';

const USERS_KEY = 'seenos_users_db';
const MODERATION_KEY = 'seenos_moderation_queue';
const MODERATION_ACTIONS_KEY = 'seenos_moderation_actions';

export interface AdminUserRecord {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  createdAt?: string;
  status: 'active' | 'suspended';
}

function load<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}

function save<T>(key: string, value: T) {
  localStorage.setItem(key, JSON.stringify(value));
}

// ============================================
// USER MANAGEMENT
// ============================================

export function listAllUsers(): AdminUserRecord[] {
  const db = load<Record<string, any>>(USERS_KEY, {});
  const suspended = load<Record<string, boolean>>('seenos_suspended_users', {});
  return Object.values(db).map((u: any) => ({
    id: u.id,
    email: u.email,
    name: u.name,
    role: u.role,
    createdAt: u.createdAt,
    status: suspended[u.id] ? 'suspended' : 'active',
  }));
}

export function updateUserRole(userId: string, role: UserRole): void {
  const db = load<Record<string, any>>(USERS_KEY, {});
  if (db[userId]) {
    db[userId] = { ...db[userId], role, updatedAt: new Date().toISOString() };
    save(USERS_KEY, db);
  }
}

export function setUserSuspended(userId: string, suspended: boolean): void {
  const map = load<Record<string, boolean>>('seenos_suspended_users', {});
  map[userId] = suspended;
  save('seenos_suspended_users', map);
}

// ============================================
// MODERATION QUEUE (persisted community responses)
// ============================================

export type ModerationStatus = 'pending' | 'approved' | 'rejected' | 'flagged';

export interface QueuedResponse {
  id: string;
  chapterId: string;
  storyId: string;
  contributorId: string;
  contributorName: string;
  type: 'text' | 'audio' | 'image';
  content: string;
  language: 'en' | 'fr' | 'es';
  timestamp: string;
  status: ModerationStatus;
  moderatorId?: string;
  moderatorNotes?: string;
  reviewedAt?: string;
  flagReason?: string;
}

export interface ModerationActionRecord {
  id: string;
  responseId: string;
  moderatorId: string;
  moderatorName: string;
  action: 'approve' | 'reject' | 'flag';
  reason?: string;
  timestamp: string;
  notes?: string;
}

function seedModerationQueueIfEmpty(): QueuedResponse[] {
  const existing = load<QueuedResponse[]>(MODERATION_KEY, []);
  if (existing.length > 0) return existing;

  const seeded: QueuedResponse[] = [
    {
      id: 'resp-1',
      chapterId: 'ch-1',
      storyId: 'midnight-resonance',
      contributorId: 'user-1',
      contributorName: 'Maria Santos',
      type: 'text',
      content: 'This chapter reminded me of walking through Tokyo at 3 AM. The silence speaks volumes.',
      language: 'en',
      timestamp: new Date(Date.now() - 3600000).toISOString(),
      status: 'pending',
    },
    {
      id: 'resp-2',
      chapterId: 'ch-2',
      storyId: 'midnight-resonance',
      contributorId: 'user-2',
      contributorName: 'Jean Dubois',
      type: 'text',
      content: 'La résonance binaurale crée une expérience immersive incroyable.',
      language: 'fr',
      timestamp: new Date(Date.now() - 7200000).toISOString(),
      status: 'pending',
    },
  ];
  save(MODERATION_KEY, seeded);
  return seeded;
}

export function getModerationQueue(): QueuedResponse[] {
  return seedModerationQueueIfEmpty();
}

/**
 * Submit a new community response for moderation review. Used by
 * SubmitResponseModal — real user submissions land here as 'pending',
 * visible to moderators via ModerationGovernanceSystem / getModerationQueue.
 */
export function submitCommunityResponse(params: {
  chapterId: string;
  storyId: string;
  contributorId: string;
  contributorName: string;
  type: 'text' | 'audio' | 'image';
  content: string;
  language: 'en' | 'fr' | 'es';
}): QueuedResponse {
  const queue = seedModerationQueueIfEmpty();
  const response: QueuedResponse = {
    id: `resp_${crypto.randomUUID()}`,
    chapterId: params.chapterId,
    storyId: params.storyId,
    contributorId: params.contributorId,
    contributorName: params.contributorName,
    type: params.type,
    content: params.content,
    language: params.language,
    timestamp: new Date().toISOString(),
    status: 'pending',
  };
  queue.unshift(response);
  save(MODERATION_KEY, queue);
  return response;
}

/**
 * Approved responses for a specific chapter — what CommunityResponsesPanel
 * should actually display to readers (pending/rejected/flagged stay
 * invisible to the public until a moderator approves them).
 */
export function getApprovedResponsesForChapter(chapterId: string): QueuedResponse[] {
  return seedModerationQueueIfEmpty().filter(r => r.chapterId === chapterId && r.status === 'approved');
}

function logModerationAction(action: Omit<ModerationActionRecord, 'id' | 'timestamp'>) {
  const actions = load<ModerationActionRecord[]>(MODERATION_ACTIONS_KEY, []);
  actions.unshift({ ...action, id: `act_${crypto.randomUUID()}`, timestamp: new Date().toISOString() });
  save(MODERATION_ACTIONS_KEY, actions);
}

export function getModerationActions(): ModerationActionRecord[] {
  return load<ModerationActionRecord[]>(MODERATION_ACTIONS_KEY, []);
}

export function moderateResponse(
  responseId: string,
  action: 'approve' | 'reject' | 'flag',
  moderatorId: string,
  moderatorName: string,
  reason?: string
): QueuedResponse[] {
  const queue = seedModerationQueueIfEmpty();
  const idx = queue.findIndex(r => r.id === responseId);
  if (idx !== -1) {
    const status: ModerationStatus = action === 'approve' ? 'approved' : action === 'reject' ? 'rejected' : 'flagged';
    queue[idx] = {
      ...queue[idx],
      status,
      moderatorId,
      reviewedAt: new Date().toISOString(),
      flagReason: action === 'flag' ? reason : queue[idx].flagReason,
    };
    save(MODERATION_KEY, queue);
  }
  logModerationAction({ responseId, moderatorId, moderatorName, action, reason });
  return queue;
}

// ============================================
// PLATFORM-WIDE STATS
// ============================================

export function getPlatformUserStats() {
  const users = listAllUsers();
  return {
    totalUsers: users.length,
    creators: users.filter(u => u.role === 'creator').length,
    moderators: users.filter(u => u.role === 'moderator').length,
    admins: users.filter(u => u.role === 'admin').length,
    viewers: users.filter(u => u.role === 'viewer').length,
    suspended: users.filter(u => u.status === 'suspended').length,
  };
}
