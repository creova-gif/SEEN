/**
 * CORE DATA TYPES & MODELS
 * SEEN by CREOVA
 * 
 * Strict typing system to prevent content leakage across sections
 */

// ============================================
// CONTENT TYPES
// ============================================

export type ContentType = 'music' | 'story' | 'film' | 'collection' | 'archive';
export type ContentLanguage = 'en' | 'fr' | 'es';
export type SectionContext = 'for_you' | 'explore' | 'library' | 'profile';
export type UserRole = 'viewer' | 'creator' | 'moderator' | 'admin';
export type UserIntent = 'explore' | 'create' | 'contribute';

// ============================================
// CONTENT ITEM (REQUIRED SCHEMA)
// ============================================

/**
 * Every content item MUST include ALL these fields.
 * Missing fields will cause rendering to fail with logged error.
 */
export interface ContentItem {
  // Identity
  id: string;
  type: ContentType;
  
  // Core metadata
  title: string;
  description: string;
  duration: string; // "45 min" or "12 tracks" or "4 chapters"
  creator: string;
  releaseDate: string; // "Feb 2026"
  
  // Multilingual support
  language: ContentLanguage[];
  
  // Media
  mediaSource: string; // Image URL
  
  // Classification
  tags: string[];
  
  // Flags
  featured?: boolean;
  institutional?: boolean;
  new?: boolean; // Released within 30 days
  trending?: boolean;
}

// ============================================
// USER PROGRESS (LIBRARY DATA)
// ============================================

export interface UserProgress {
  contentId: string;
  contentType: ContentType;
  
  // Progress tracking
  startedAt: string; // ISO timestamp
  lastAccessedAt: string;
  progressPercentage: number; // 0-100
  
  // Chapter/track position
  currentChapterId?: string;
  currentChapterIndex?: number;
  totalChapters?: number;
  
  // Playback position (for audio/video)
  playbackPosition?: number; // seconds
  
  // Completion
  completed: boolean;
  completedAt?: string;
}

export interface UserBookmark {
  contentId: string;
  contentType: ContentType;
  savedAt: string; // ISO timestamp
  notes?: string;
}

// ============================================
// SECTION-SPECIFIC DATA TYPES
// ============================================

/**
 * FOR YOU SECTION
 * Personalized feed based on user preferences
 */
export interface ForYouFeedItem extends ContentItem {
  recommendationReason?: string; // "Based on your language" | "Popular in your region" | etc.
  relevanceScore?: number; // 0-1, for sorting
}

/**
 * EXPLORE SECTION
 * Curated categories with diverse content
 */
export interface ExploreCategory {
  id: string;
  name: string;
  description?: string;
  items: ContentItem[];
}

/**
 * LIBRARY SECTION
 * User-owned content only
 */
export interface LibraryData {
  inProgress: {
    content: ContentItem;
    progress: UserProgress;
  }[];
  saved: {
    content: ContentItem;
    bookmark: UserBookmark;
  }[];
  completed: {
    content: ContentItem;
    progress: UserProgress;
  }[];
}

// ============================================
// EMPTY STATE TYPES
// ============================================

export interface EmptyState {
  icon: string; // Lucide icon name
  title: string;
  message: string;
  actionLabel?: string;
  actionTarget?: SectionContext;
}

// ============================================
// VALIDATION HELPERS
// ============================================

/**
 * Validates that a content item has all required fields
 * Returns true if valid, logs error and returns false if invalid
 */
export function validateContentItem(item: any, context: string): item is ContentItem {
  const requiredFields = [
    'id', 'type', 'title', 'description', 'duration', 
    'creator', 'releaseDate', 'language', 'mediaSource', 'tags'
  ];
  
  for (const field of requiredFields) {
    if (!(field in item) || item[field] === undefined || item[field] === null) {
      console.error(`[${context}] Invalid content item: missing field "${field}"`, item);
      return false;
    }
  }
  
  // Validate arrays
  if (!Array.isArray(item.language) || item.language.length === 0) {
    console.error(`[${context}] Invalid content item: language must be non-empty array`, item);
    return false;
  }
  
  if (!Array.isArray(item.tags)) {
    console.error(`[${context}] Invalid content item: tags must be an array`, item);
    return false;
  }
  
  return true;
}

/**
 * Filters out invalid content items and logs errors
 */
export function validateContentArray(items: any[], context: string): ContentItem[] {
  return items.filter(item => validateContentItem(item, context));
}
