/**
 * STORY SERVICE — DATA LAYER TESTS
 * SEEN by CREOVA
 *
 * Adapted from the web `complete-workflow-validation.test.tsx` for the
 * React Native data layer. Rendering tests are intentionally omitted —
 * those require an Expo / RNTL setup that's heavier than this suite.
 */

import {
  getPublicStories,
  getFeaturedStories,
  getStoriesByLanguage,
  getStoriesByTheme,
  searchStories,
  getForYouFeed,
  getExploreCategories,
  getLibraryStories,
  getStoryWorldData,
  getChapterData,
  getNextChapter,
  getPreviousChapter,
  STORY_WORLDS,
  type Language,
} from '../data/storyService';

describe('storyService — counts & isolation', () => {
  it('has stories defined', () => {
    expect(STORY_WORLDS.length).toBeGreaterThan(0);
  });

  it('all story ids are unique', () => {
    const ids = STORY_WORLDS.map((s) => s.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it('getPublicStories only returns public visibility', () => {
    expect(getPublicStories().every((s) => s.visibility === 'public')).toBe(true);
  });

  it('featured is a subset of public', () => {
    expect(getFeaturedStories().length).toBeLessThanOrEqual(getPublicStories().length);
  });
});

describe('storyService — multilingual', () => {
  const languages: Language[] = ['en', 'fr', 'es'];

  it.each(languages)('getStoriesByLanguage returns stories available in %s', (lang) => {
    expect(getStoriesByLanguage(lang).every((s) => s.languagesAvailable.includes(lang))).toBe(true);
  });

  it.each(languages)('getForYouFeed returns items in %s with a title', (lang) => {
    const feed = getForYouFeed({ language: lang, limit: 5 });
    expect(feed.length).toBeGreaterThan(0);
    expect(feed.every((f) => typeof f.title === 'string' && f.title.length > 0)).toBe(true);
  });

  it.each(languages)('getExploreCategories returns named categories in %s', (lang) => {
    const cats = getExploreCategories(lang);
    expect(cats.length).toBeGreaterThan(0);
    expect(cats.every((c) => !!c.name && c.items.length > 0)).toBe(true);
  });
});

describe('storyService — navigation', () => {
  const story = STORY_WORLDS.find((s) => s.chapters.length > 1)!;

  it('getStoryWorldData returns localized story', () => {
    const data = getStoryWorldData(story.id, 'en');
    expect(data).toBeTruthy();
    expect(data!.id).toBe(story.id);
    expect(data!.chapters.length).toBe(story.chapters.length);
  });

  it('getChapterData returns localized chapter', () => {
    const ch = story.chapters[0];
    const data = getChapterData(story.id, ch.id, 'en');
    expect(data).toBeTruthy();
    expect(data!.id).toBe(ch.id);
    expect(typeof data!.text).toBe('string');
  });

  it('next/previous chapter navigation works', () => {
    const first = story.chapters[0];
    const next = getNextChapter(story.id, first.id);
    expect(next?.id).toBe(story.chapters[1].id);

    const prev = getPreviousChapter(story.id, story.chapters[1].id);
    expect(prev?.id).toBe(first.id);
  });

  it('last chapter has no next, first chapter has no previous', () => {
    const first = story.chapters[0];
    const last  = story.chapters[story.chapters.length - 1];
    expect(getPreviousChapter(story.id, first.id)).toBeNull();
    expect(getNextChapter(story.id, last.id)).toBeNull();
  });
});

describe('storyService — search & library', () => {
  it('searchStories is case-insensitive', () => {
    const lower = searchStories('the', 'en');
    const upper = searchStories('THE', 'en');
    expect(lower.length).toBe(upper.length);
  });

  it('searchStories returns [] for no matches', () => {
    expect(searchStories('zzznonexistent_xyz', 'en')).toEqual([]);
  });

  it('library handles empty progress', () => {
    const lib = getLibraryStories([], 'en');
    expect(lib.inProgress).toEqual([]);
    expect(lib.completed).toEqual([]);
  });

  it('library categorizes completed vs in-progress', () => {
    const s = STORY_WORLDS[0];
    const last = s.chapters[s.chapters.length - 1];
    const lib = getLibraryStories(
      [
        { storyWorldId: s.id, lastCompletedChapterId: last.id, completed: true },
      ],
      'en',
    );
    expect(lib.completed.length).toBe(1);
    expect(lib.inProgress.length).toBe(0);
  });

  it('library skips invalid story ids', () => {
    const lib = getLibraryStories(
      [{ storyWorldId: 'does-not-exist', completed: false }],
      'en',
    );
    expect(lib.inProgress.length).toBe(0);
    expect(lib.completed.length).toBe(0);
  });
});

describe('storyService — semantic guarantees', () => {
  it('getFeaturedStories returns only stories with featured===true', () => {
    const featured = getFeaturedStories();
    expect(featured.length).toBeGreaterThan(0);
    expect(featured.every((s) => s.featured === true)).toBe(true);
  });

  it('getStoriesByTheme matches the canonical culturalThemes field', () => {
    // Pick a theme that exists on at least one story.
    const sample = STORY_WORLDS.find((s) => (s.culturalThemes?.length ?? 0) > 0)!;
    const theme = sample.culturalThemes[0];
    const matches = getStoriesByTheme(theme);
    expect(matches.length).toBeGreaterThan(0);
    expect(matches.every((s) =>
      s.culturalThemes.some((th) => th.toLowerCase().includes(theme.toLowerCase())),
    )).toBe(true);
  });

  it('getStoriesByTheme returns [] for an unknown theme', () => {
    expect(getStoriesByTheme('zzz_no_such_theme')).toEqual([]);
  });

  it('getExploreCategories includes a featured category and at least one theme category', () => {
    const cats = getExploreCategories('en');
    expect(cats.find((c) => c.id === 'featured')).toBeTruthy();
    expect(cats.length).toBeGreaterThan(1);
  });
});
