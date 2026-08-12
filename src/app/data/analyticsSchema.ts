/**
 * ANALYTICS SCHEMA
 * SEEN by CREOVA — Non-Extractive Analytics
 *
 * Tracks cultural engagement without exploitative surveillance
 * Privacy-first, transparent, aggregate data only
 */

import type { Language } from './types';

// ============================================
// TYPE DEFINITIONS
// ============================================

export type EventType =
  | 'story_start'            // User begins a story
  | 'chapter_start'          // User begins a chapter
  | 'chapter_complete'       // User completes a chapter
  | 'story_complete'         // User completes entire story
  | 'audio_play'             // Audio narration played
  | 'audio_pause'            // Audio narration paused
  | 'audio_complete'         // Audio narration finished
  | 'language_switch'        // User switches language
  | 'contribution_submit'    // Community contribution submitted
  | 'share_story'            // User shares a story
  | 'save_for_later';        // User bookmarks content

export interface AnalyticsEvent {
  id: string;
  
  /** Event type */
  type: EventType;
  
  /** Timestamp */
  timestamp: string;
  
  /** Anonymous session ID (not tied to user identity) */
  sessionId: string;
  
  /** Content identifiers */
  storyId?: string;
  chapterId?: string;
  
  /** Language context */
  language: Language;
  
  /** Event-specific metadata */
  metadata: {
    // For audio events
    audioDuration?: number; // Total duration
    audioPosition?: number; // Position when event fired
    audioComplete?: boolean; // Whether audio finished
    
    // For completion events
    completionTime?: number; // Time spent (seconds)
    
    // For contribution events
    contributionType?: string;
    
    // NO personal data
    // NO reading speed tracking
    // NO attention inference
    // NO cross-platform identity
  };
  
  /** Opt-out respected */
  optedOut?: boolean;
}

export interface AggregateMetrics {
  /** Time period */
  period: {
    start: string;
    end: string;
  };
  
  /** Story engagement */
  stories: {
    totalStarts: number;
    totalCompletions: number;
    completionRate: number;
    averageTimeSpent: number; // seconds
    
    byStory: Record<string, {
      starts: number;
      completions: number;
      completionRate: number;
    }>;
  };
  
  /** Chapter engagement */
  chapters: {
    totalStarts: number;
    totalCompletions: number;
    completionRate: number;
    
    byChapter: Record<string, {
      starts: number;
      completions: number;
      dropOffRate: number;
    }>;
  };
  
  /** Audio engagement */
  audio: {
    totalPlays: number;
    totalCompletions: number;
    averageListenDuration: number; // seconds
    completionRate: number;
  };
  
  /** Language usage */
  language: {
    en: number;
    fr: number;
    es: number;
    switches: number; // Number of language switches
  };
  
  /** Community contributions */
  contributions: {
    total: number;
    byType: {
      written: number;
      audio: number;
      image: number;
    };
    approvalRate: number;
  };
  
  /** NO personal profiling */
  /** NO attention manipulation */
  /** NO emotional inference */
}

// ============================================
// ANALYTICS CONFIGURATION
// ============================================

export const AnalyticsConfig = {
  /** Tracking enabled */
  enabled: true,
  
  /** Respect opt-out */
  respectOptOut: true,
  
  /** Anonymize all data */
  anonymize: true,
  
  /** Aggregate only (no individual tracking) */
  aggregateOnly: true,
  
  /** Session timeout (minutes) */
  sessionTimeout: 30,
  
  /** Data retention (days) */
  dataRetention: 365,
  
  /** Export format */
  exportFormat: 'csv',
};

// ============================================
// TRACKED METRICS (ALLOWED)
// ============================================

export const TRACKABLE_METRICS = [
  'Story starts',
  'Chapter completion',
  'Audio play duration',
  'Language usage',
  'Community contribution count',
  'Story completion rate',
  'Aggregate time spent',
  'Content discovery paths',
] as const;

// ============================================
// DO NOT TRACK (PROHIBITED)
// ============================================

export const PROHIBITED_TRACKING = [
  'Individual reading speed',
  'Emotional inference',
  'Attention manipulation metrics',
  'Cross-platform identity linking',
  'Behavioral prediction',
  'Ad targeting data',
  'Third-party data sharing',
  'Location tracking (beyond country-level)',
  'Device fingerprinting',
  'Session recording (playback)',
] as const;

// ============================================
// PRIVACY RULES
// ============================================

export const PrivacyRules = {
  /** Use anonymous session IDs only */
  anonymousSessionIds: true,
  
  /** No personally identifiable information */
  noPII: true,
  
  /** No cross-platform tracking */
  noCrossPlatformTracking: true,
  
  /** No behavioral profiling */
  noBehavioralProfiling: true,
  
  /** Opt-out always available */
  optOutAvailable: true,
  
  /** Data deletion on request */
  dataDeletionOnRequest: true,
  
  /** Transparent data usage */
  transparentUsage: true,
  
  /** No data selling */
  noDataSelling: true,
  
  /** GDPR/PIPEDA compliant */
  regulatoryCompliance: ['GDPR', 'PIPEDA', 'CCPA'],
};

// ============================================
// EVENT TRACKING
// ============================================

/**
 * In-memory event storage (would be database in production)
 */
export const ANALYTICS_EVENTS: AnalyticsEvent[] = [];

/**
 * Track an event
 */
export function trackEvent(event: Omit<AnalyticsEvent, 'id' | 'timestamp'>): void {
  // Check if user has opted out
  if (hasOptedOut()) {
    console.log('[Analytics] User has opted out, event not tracked');
    return;
  }
  
  const trackedEvent: AnalyticsEvent = {
    id: `event-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    timestamp: new Date().toISOString(),
    ...event,
  };
  
  ANALYTICS_EVENTS.push(trackedEvent);
}

/**
 * Check if user has opted out
 */
export function hasOptedOut(): boolean {
  return localStorage.getItem('analytics-opt-out') === 'true';
}

/**
 * Opt out of analytics
 */
export function optOut(): void {
  localStorage.setItem('analytics-opt-out', 'true');
  console.log('[Analytics] User opted out');
}

/**
 * Opt in to analytics
 */
export function optIn(): void {
  localStorage.removeItem('analytics-opt-out');
  console.log('[Analytics] User opted in');
}

// ============================================
// AGGREGATE METRICS
// ============================================

/**
 * Calculate aggregate metrics for a time period
 */
export function calculateAggregateMetrics(
  startDate: string,
  endDate: string
): AggregateMetrics {
  const events = ANALYTICS_EVENTS.filter(
    e => e.timestamp >= startDate && e.timestamp <= endDate
  );
  
  // Story metrics
  const storyStarts = events.filter(e => e.type === 'story_start');
  const storyCompletions = events.filter(e => e.type === 'story_complete');
  const chapterStarts = events.filter(e => e.type === 'chapter_start');
  const chapterCompletions = events.filter(e => e.type === 'chapter_complete');
  
  // Audio metrics
  const audioPlays = events.filter(e => e.type === 'audio_play');
  const audioCompletions = events.filter(e => e.type === 'audio_complete');
  
  // Language metrics
  const languageSwitches = events.filter(e => e.type === 'language_switch');
  const languageUsage = {
    en: events.filter(e => e.language === 'en').length,
    fr: events.filter(e => e.language === 'fr').length,
    es: events.filter(e => e.language === 'es').length,
    switches: languageSwitches.length,
  };
  
  // Community contributions
  const contributions = events.filter(e => e.type === 'contribution_submit');
  
  // Calculate completion rates
  const storyCompletionRate = storyStarts.length > 0 
    ? (storyCompletions.length / storyStarts.length) * 100 
    : 0;
  
  const chapterCompletionRate = chapterStarts.length > 0 
    ? (chapterCompletions.length / chapterStarts.length) * 100 
    : 0;
  
  const audioCompletionRate = audioPlays.length > 0 
    ? (audioCompletions.length / audioPlays.length) * 100 
    : 0;
  
  // Calculate average time spent
  const completionTimes = storyCompletions
    .map(e => e.metadata.completionTime)
    .filter((t): t is number => t !== undefined);
  
  const averageTimeSpent = completionTimes.length > 0
    ? completionTimes.reduce((sum, t) => sum + t, 0) / completionTimes.length
    : 0;
  
  // Calculate average listen duration
  const listenDurations = audioCompletions
    .map(e => e.metadata.audioDuration)
    .filter((d): d is number => d !== undefined);
  
  const averageListenDuration = listenDurations.length > 0
    ? listenDurations.reduce((sum, d) => sum + d, 0) / listenDurations.length
    : 0;
  
  // Group by story
  const byStory: Record<string, any> = {};
  storyStarts.forEach(e => {
    if (!e.storyId) return;
    if (!byStory[e.storyId]) {
      byStory[e.storyId] = { starts: 0, completions: 0, completionRate: 0 };
    }
    byStory[e.storyId].starts++;
  });
  
  storyCompletions.forEach(e => {
    if (!e.storyId) return;
    if (byStory[e.storyId]) {
      byStory[e.storyId].completions++;
    }
  });
  
  Object.keys(byStory).forEach(storyId => {
    const data = byStory[storyId];
    data.completionRate = data.starts > 0 ? (data.completions / data.starts) * 100 : 0;
  });
  
  // Group by chapter
  const byChapter: Record<string, any> = {};
  chapterStarts.forEach(e => {
    if (!e.chapterId) return;
    if (!byChapter[e.chapterId]) {
      byChapter[e.chapterId] = { starts: 0, completions: 0, dropOffRate: 0 };
    }
    byChapter[e.chapterId].starts++;
  });
  
  chapterCompletions.forEach(e => {
    if (!e.chapterId) return;
    if (byChapter[e.chapterId]) {
      byChapter[e.chapterId].completions++;
    }
  });
  
  Object.keys(byChapter).forEach(chapterId => {
    const data = byChapter[chapterId];
    data.dropOffRate = data.starts > 0 ? ((data.starts - data.completions) / data.starts) * 100 : 0;
  });
  
  return {
    period: { start: startDate, end: endDate },
    stories: {
      totalStarts: storyStarts.length,
      totalCompletions: storyCompletions.length,
      completionRate: storyCompletionRate,
      averageTimeSpent,
      byStory,
    },
    chapters: {
      totalStarts: chapterStarts.length,
      totalCompletions: chapterCompletions.length,
      completionRate: chapterCompletionRate,
      byChapter,
    },
    audio: {
      totalPlays: audioPlays.length,
      totalCompletions: audioCompletions.length,
      averageListenDuration,
      completionRate: audioCompletionRate,
    },
    language: languageUsage,
    contributions: {
      total: contributions.length,
      byType: {
        written: contributions.filter(e => e.metadata.contributionType === 'written-reflection').length,
        audio: contributions.filter(e => e.metadata.contributionType === 'audio-reflection').length,
        image: contributions.filter(e => e.metadata.contributionType === 'contextual-image').length,
      },
      approvalRate: 0, // Would calculate from contribution data
    },
  };
}

// ============================================
// CREATOR-FACING INSIGHTS (LIMITED)
// ============================================

/**
 * Generate limited insights for story creators
 * (Aggregated, no personal data)
 */
export function generateCreatorInsights(storyId: string): {
  totalStarts: number;
  totalCompletions: number;
  completionRate: number;
  averageTimeSpent: number;
  languageBreakdown: Record<Language, number>;
  communityContributions: number;
} {
  const events = ANALYTICS_EVENTS.filter(e => e.storyId === storyId);
  
  const starts = events.filter(e => e.type === 'story_start').length;
  const completions = events.filter(e => e.type === 'story_complete').length;
  const contributions = events.filter(e => e.type === 'contribution_submit').length;
  
  const completionTimes = events
    .filter(e => e.type === 'story_complete')
    .map(e => e.metadata.completionTime)
    .filter((t): t is number => t !== undefined);
  
  const averageTimeSpent = completionTimes.length > 0
    ? completionTimes.reduce((sum, t) => sum + t, 0) / completionTimes.length
    : 0;
  
  const languageBreakdown = {
    en: events.filter(e => e.language === 'en').length,
    fr: events.filter(e => e.language === 'fr').length,
    es: events.filter(e => e.language === 'es').length,
  };
  
  return {
    totalStarts: starts,
    totalCompletions: completions,
    completionRate: starts > 0 ? (completions / starts) * 100 : 0,
    averageTimeSpent,
    languageBreakdown,
    communityContributions: contributions,
  };
}
