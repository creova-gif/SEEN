/**
 * SEARCH SERVICE
 * SEEN by CREOVA
 *
 * Full-text search for stories, chapters, and content
 * Uses Fuse.js for fast, fuzzy searching across multiple fields
 */

import Fuse from 'fuse.js';
import { STORY_WORLDS, getLocalizedText } from './storyDatabase';
import type { Language, StoryWorld } from './storyDatabase';
import type { ContentItem } from './types';

// ============================================
// SEARCH INDEX BUILDING
// ============================================

interface SearchableStory {
  id: string;
  title: string;
  description: string;
  creator: string;
  themes: string;
  language: Language;
  original: StoryWorld;
}

/**
 * Build a searchable index of all stories in a given language
 */
function buildSearchIndex(language: Language): Fuse<SearchableStory> {
  const searchableStories: SearchableStory[] = STORY_WORLDS.map(story => ({
    id: story.id,
    title: getLocalizedText(story.title, language),
    description: getLocalizedText(story.description, language),
    creator: getLocalizedText(story.creator, language),
    themes: story.culturalThemes.join(' '),
    language,
    original: story,
  }));

  return new Fuse(searchableStories, {
    keys: [
      { name: 'title', weight: 0.5 },
      { name: 'description', weight: 0.3 },
      { name: 'creator', weight: 0.15 },
      { name: 'themes', weight: 0.05 },
    ],
    threshold: 0.3,
    minMatchCharLength: 2,
  });
}

// Cache search indexes per language
const searchIndexCache = new Map<Language, Fuse<SearchableStory>>();

function getSearchIndex(language: Language): Fuse<SearchableStory> {
  if (!searchIndexCache.has(language)) {
    searchIndexCache.set(language, buildSearchIndex(language));
  }
  return searchIndexCache.get(language)!;
}

// ============================================
// SEARCH FUNCTIONS
// ============================================

/**
 * Search stories by query string
 */
export function searchStoriesByQuery(
  query: string,
  language: Language
): { id: string; story: StoryWorld; matchScore: number }[] {
  if (!query.trim()) {
    return [];
  }

  const searchIndex = getSearchIndex(language);
  const results = searchIndex.search(query);

  return results.map(result => ({
    id: result.item.id,
    story: result.item.original,
    matchScore: 1 - (result.score || 0), // Higher score = better match
  }));
}

/**
 * Search stories and return as ContentItem for feed rendering
 */
export function searchStories(
  query: string,
  language: Language
): ContentItem[] {
  const results = searchStoriesByQuery(query, language);
  return results.map(({ story }) => ({
    id: story.id,
    type: 'story',
    title: getLocalizedText(story.title, language),
    description: getLocalizedText(story.description, language),
    duration: `${story.chapterCount} chapters • ${story.totalDuration}`,
    creator: getLocalizedText(story.creator, language),
    releaseDate: story.releaseDate,
    language: story.languagesAvailable,
    mediaSource: story.coverImage,
    tags: story.culturalThemes,
    featured: story.featured,
    institutional: story.visibility === 'institutional',
    new: story.new,
    trending: story.trending,
  }));
}

/**
 * Get search suggestions (autocomplete)
 */
export function getSearchSuggestions(
  query: string,
  language: Language,
  limit: number = 10
): string[] {
  if (!query.trim()) {
    return [];
  }

  const results = searchStoriesByQuery(query, language);
  return results
    .slice(0, limit)
    .map(({ story }) => getLocalizedText(story.title, language));
}

/**
 * Search by category/theme
 */
export function searchByTheme(
  theme: string,
  language: Language
): ContentItem[] {
  const matchingStories = STORY_WORLDS.filter(story =>
    story.culturalThemes.some(t =>
      t.toLowerCase().includes(theme.toLowerCase())
    )
  );

  return matchingStories.map(story => ({
    id: story.id,
    type: 'story',
    title: getLocalizedText(story.title, language),
    description: getLocalizedText(story.description, language),
    duration: `${story.chapterCount} chapters • ${story.totalDuration}`,
    creator: getLocalizedText(story.creator, language),
    releaseDate: story.releaseDate,
    language: story.languagesAvailable,
    mediaSource: story.coverImage,
    tags: story.culturalThemes,
    featured: story.featured,
    institutional: story.visibility === 'institutional',
    new: story.new,
    trending: story.trending,
  }));
}

/**
 * Clear search cache (useful when content updates)
 */
export function clearSearchCache(): void {
  searchIndexCache.clear();
  console.log('[Search] Cache cleared');
}
