/**
 * USER DATA SERVICE
 * SEEN by CREOVA
 * 
 * Manages user-specific data (progress, bookmarks, preferences)
 * Stored in localStorage with privacy-first approach
 */

import type { UserProgress, UserBookmark } from './types';

const STORAGE_KEYS = {
  PROGRESS: 'seenos_user_progress',
  BOOKMARKS: 'seenos_user_bookmarks'
};

// ============================================
// PROGRESS MANAGEMENT
// ============================================

/**
 * Get all user progress data
 */
export function getAllProgress(): Map<string, UserProgress> {
  try {
    const stored = localStorage.getItem(STORAGE_KEYS.PROGRESS);
    if (!stored) return new Map();
    
    const data = JSON.parse(stored);
    return new Map(Object.entries(data));
  } catch (error) {
    console.error('[UserDataService] Failed to load progress:', error);
    return new Map();
  }
}

/**
 * Get progress for specific content
 */
export function getProgress(contentId: string): UserProgress | undefined {
  const allProgress = getAllProgress();
  return allProgress.get(contentId);
}

/**
 * Save or update progress for content
 */
export function saveProgress(progress: UserProgress): void {
  try {
    const allProgress = getAllProgress();
    allProgress.set(progress.contentId, progress);
    
    const data = Object.fromEntries(allProgress);
    localStorage.setItem(STORAGE_KEYS.PROGRESS, JSON.stringify(data));
  } catch (error) {
    console.error('[UserDataService] Failed to save progress:', error);
  }
}

/**
 * Delete progress for content
 */
export function deleteProgress(contentId: string): void {
  try {
    const allProgress = getAllProgress();
    allProgress.delete(contentId);
    
    const data = Object.fromEntries(allProgress);
    localStorage.setItem(STORAGE_KEYS.PROGRESS, JSON.stringify(data));
  } catch (error) {
    console.error('[UserDataService] Failed to delete progress:', error);
  }
}

/**
 * Get all in-progress content IDs
 */
export function getInProgressIds(): string[] {
  const allProgress = getAllProgress();
  return Array.from(allProgress.values())
    .filter(p => !p.completed && p.progressPercentage > 0)
    .sort((a, b) => new Date(b.lastAccessedAt).getTime() - new Date(a.lastAccessedAt).getTime())
    .map(p => p.contentId);
}

/**
 * Get all completed content IDs
 */
export function getCompletedIds(): string[] {
  const allProgress = getAllProgress();
  return Array.from(allProgress.values())
    .filter(p => p.completed)
    .sort((a, b) => {
      const dateA = a.completedAt ? new Date(a.completedAt).getTime() : 0;
      const dateB = b.completedAt ? new Date(b.completedAt).getTime() : 0;
      return dateB - dateA;
    })
    .map(p => p.contentId);
}

// ============================================
// BOOKMARK MANAGEMENT
// ============================================

/**
 * Get all user bookmarks
 */
export function getAllBookmarks(): Map<string, UserBookmark> {
  try {
    const stored = localStorage.getItem(STORAGE_KEYS.BOOKMARKS);
    if (!stored) return new Map();
    
    const data = JSON.parse(stored);
    return new Map(Object.entries(data));
  } catch (error) {
    console.error('[UserDataService] Failed to load bookmarks:', error);
    return new Map();
  }
}

/**
 * Get bookmark for specific content
 */
export function getBookmark(contentId: string): UserBookmark | undefined {
  const allBookmarks = getAllBookmarks();
  return allBookmarks.get(contentId);
}

/**
 * Save or update bookmark
 */
export function saveBookmark(bookmark: UserBookmark): void {
  try {
    const allBookmarks = getAllBookmarks();
    allBookmarks.set(bookmark.contentId, bookmark);
    
    const data = Object.fromEntries(allBookmarks);
    localStorage.setItem(STORAGE_KEYS.BOOKMARKS, JSON.stringify(data));
  } catch (error) {
    console.error('[UserDataService] Failed to save bookmark:', error);
  }
}

/**
 * Delete bookmark
 */
export function deleteBookmark(contentId: string): void {
  try {
    const allBookmarks = getAllBookmarks();
    allBookmarks.delete(contentId);
    
    const data = Object.fromEntries(allBookmarks);
    localStorage.setItem(STORAGE_KEYS.BOOKMARKS, JSON.stringify(data));
  } catch (error) {
    console.error('[UserDataService] Failed to delete bookmark:', error);
  }
}

/**
 * Get all saved/bookmarked content IDs
 */
export function getSavedIds(): string[] {
  const allBookmarks = getAllBookmarks();
  return Array.from(allBookmarks.values())
    .sort((a, b) => new Date(b.savedAt).getTime() - new Date(a.savedAt).getTime())
    .map(b => b.contentId);
}

/**
 * Check if content is bookmarked
 */
export function isBookmarked(contentId: string): boolean {
  const allBookmarks = getAllBookmarks();
  return allBookmarks.has(contentId);
}

// ============================================
// UTILITY FUNCTIONS
// ============================================

/**
 * Clear all user data (for testing/debugging)
 */
export function clearAllUserData(): void {
  try {
    localStorage.removeItem(STORAGE_KEYS.PROGRESS);
    localStorage.removeItem(STORAGE_KEYS.BOOKMARKS);
    console.log('[UserDataService] All user data cleared');
  } catch (error) {
    console.error('[UserDataService] Failed to clear user data:', error);
  }
}

/**
 * Get user data summary
 */
export function getUserDataSummary(): {
  totalProgress: number;
  totalBookmarks: number;
  inProgress: number;
  completed: number;
} {
  const allProgress = getAllProgress();
  const allBookmarks = getAllBookmarks();
  
  const inProgressCount = Array.from(allProgress.values())
    .filter(p => !p.completed && p.progressPercentage > 0).length;
    
  const completedCount = Array.from(allProgress.values())
    .filter(p => p.completed).length;
  
  return {
    totalProgress: allProgress.size,
    totalBookmarks: allBookmarks.size,
    inProgress: inProgressCount,
    completed: completedCount
  };
}
