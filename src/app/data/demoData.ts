/**
 * DEMO DATA HELPER
 * SEEN by CREOVA
 * 
 * Helper function to populate sample user data for testing
 * This simulates user interaction without requiring backend
 */

import { saveProgress, saveBookmark } from './userDataService';
import type { UserProgress, UserBookmark } from './types';

/**
 * Populate demo user data for testing
 * Call this once to simulate a user who has interacted with content
 */
export function populateDemoUserData(): void {
  // Simulate user started the CREOVA album
  const midnightResonanceProgress: UserProgress = {
    contentId: 'creova-album-001',
    contentType: 'music',
    startedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    lastAccessedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    progressPercentage: 45,
    playbackPosition: 1230,
    completed: false
  };
  saveProgress(midnightResonanceProgress);

  // Simulate user saved "Echoes of Light"
  const echoesBookmark: UserBookmark = {
    contentId: 'story-001',
    contentType: 'story',
    savedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(), // 3 days ago
    notes: 'Beautiful photography story'
  };
  saveBookmark(echoesBookmark);

  // Simulate user completed "The Last Cassette"
  const lastCassetteProgress: UserProgress = {
    contentId: 'story-002',
    contentType: 'story',
    startedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    lastAccessedAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
    progressPercentage: 100,
    currentChapterId: 'ch5',
    currentChapterIndex: 5,
    totalChapters: 5,
    completed: true,
    completedAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString()
  };
  saveProgress(lastCassetteProgress);

  // Simulate user saved "Desert Frequencies"
  const desertBookmark: UserBookmark = {
    contentId: 'music-003',
    contentType: 'music',
    savedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
  };
  saveBookmark(desertBookmark);

  console.log('✅ Demo user data populated for testing');
}

/**
 * Check if demo data is already populated
 */
export function isDemoDataPopulated(): boolean {
  try {
    const stored = localStorage.getItem('seenos_demo_populated');
    return stored === 'true';
  } catch {
    return false;
  }
}

/**
 * Mark demo data as populated
 */
export function markDemoDataPopulated(): void {
  try {
    localStorage.setItem('seenos_demo_populated', 'true');
  } catch (error) {
    console.error('Failed to mark demo data as populated:', error);
  }
}

/**
 * Auto-populate demo data on first run (for testing)
 * Call this in your app initialization
 */
export function initializeDemoData(): void {
  if (!isDemoDataPopulated()) {
    populateDemoUserData();
    markDemoDataPopulated();
  }
}
