// SEEN Mobile — Story Service
// Thin facade over the existing src/app/data/storyDatabase so screens, hooks
// and tests can call the same API surface the web app uses.

import {
  STORY_WORLDS,
  type StoryWorld,
  type Chapter,
  type Language,
  type MultilingualText,
} from '../../src/app/data/storyDatabase';

export type { Language, StoryWorld, Chapter, MultilingualText };
export { STORY_WORLDS };

// ---------------- helpers ----------------

const t = (m: MultilingualText | undefined, lang: Language): string =>
  (m?.[lang] ?? m?.en ?? m?.fr ?? m?.es ?? '') as string;

export type LocalizedStory = Omit<StoryWorld, 'title' | 'description' | 'creator'> & {
  title: string;
  description: string;
  creator: string;
  type: 'story';
};

export type LocalizedChapter = Omit<Chapter, 'title' | 'description' | 'text'> & {
  title: string;
  description: string;
  text: string;
};

const localizeStory = (s: StoryWorld, lang: Language): LocalizedStory => ({
  ...s,
  title:       t(s.title, lang),
  description: t(s.description, lang),
  creator:     t(s.creator as any, lang),
  type: 'story',
});

const localizeChapter = (c: Chapter, lang: Language): LocalizedChapter => ({
  ...c,
  title:       t(c.title, lang),
  description: t(c.description, lang),
  text:        t(c.text, lang),
});

// ---------------- queries ----------------

export const getPublicStories = (): StoryWorld[] =>
  STORY_WORLDS.filter((s) => s.visibility === 'public');

// A story is "featured" when the canonical record sets `featured: true`.
// We deliberately do NOT fall back to the first N public stories — that would
// hide editorial intent and silently break the home rail.
export const getFeaturedStories = (limit = 6): StoryWorld[] =>
  getPublicStories().filter((s) => s.featured === true).slice(0, limit);

export const getStoriesByLanguage = (lang: Language): StoryWorld[] =>
  STORY_WORLDS.filter((s) => s.languagesAvailable.includes(lang));

// Theme lookup uses the canonical `culturalThemes` field on StoryWorld.
export const getStoriesByTheme = (theme: string): StoryWorld[] => {
  const needle = theme.toLowerCase();
  return STORY_WORLDS.filter((s) =>
    s.culturalThemes?.some?.((th) => th.toLowerCase().includes(needle)),
  );
};

export const searchStories = (query: string, lang: Language): LocalizedStory[] => {
  const q = query.trim().toLowerCase();
  if (!q) return [];
  return getPublicStories()
    .filter((s) =>
      t(s.title, lang).toLowerCase().includes(q) ||
      t(s.description, lang).toLowerCase().includes(q) ||
      t(s.creator as any, lang).toLowerCase().includes(q) ||
      s.culturalThemes?.some?.((th) => th.toLowerCase().includes(q)),
    )
    .map((s) => localizeStory(s, lang));
};

export type ForYouOpts = { language: Language; limit?: number };
export const getForYouFeed = ({ language, limit = 10 }: ForYouOpts): LocalizedStory[] =>
  getPublicStories().slice(0, limit).map((s) => localizeStory(s, language));

export type ExploreCategory = {
  id: string;
  name: string;
  items: LocalizedStory[];
};
export const getExploreCategories = (language: Language): ExploreCategory[] => {
  const all = getPublicStories();
  const featured = getFeaturedStories(8);
  const byTheme = new Map<string, StoryWorld[]>();
  all.forEach((s) => {
    (s.culturalThemes ?? []).forEach((th) => {
      const arr = byTheme.get(th) ?? [];
      arr.push(s);
      byTheme.set(th, arr);
    });
  });

  const cats: ExploreCategory[] = [
    { id: 'featured', name: 'Featured', items: featured.map((s) => localizeStory(s, language)) },
    ...Array.from(byTheme.entries()).map(([theme, items]) => ({
      id: theme.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, ''),
      name: theme,
      items: items.map((s) => localizeStory(s, language)),
    })),
  ];
  return cats.filter((c) => c.items.length > 0);
};

export type ChapterProgress = {
  storyWorldId: string;
  lastCompletedChapterId?: string;
  chapterId?: string;
  audioPosition?: number;
  completed: boolean;
};

export type LibraryBuckets = {
  inProgress: LocalizedStory[];
  completed:  LocalizedStory[];
};

export const getLibraryStories = (
  progress: ChapterProgress[],
  language: Language,
): LibraryBuckets => {
  const seen = new Map<string, { story: StoryWorld; completed: boolean }>();
  for (const p of progress) {
    const story = STORY_WORLDS.find((s) => s.id === p.storyWorldId);
    if (!story) continue;
    const prev = seen.get(story.id);
    // A story is "completed" if any progress entry marked it done.
    seen.set(story.id, { story, completed: (prev?.completed ?? false) || p.completed });
  }
  const inProgress: LocalizedStory[] = [];
  const completed:  LocalizedStory[] = [];
  for (const { story, completed: done } of seen.values()) {
    (done ? completed : inProgress).push(localizeStory(story, language));
  }
  return { inProgress, completed };
};

export const getStoryWorldData = (
  id: string,
  language: Language,
): (LocalizedStory & { chapters: LocalizedChapter[] }) | null => {
  const story = STORY_WORLDS.find((s) => s.id === id);
  if (!story) return null;
  return {
    ...localizeStory(story, language),
    chapters: story.chapters.map((c) => localizeChapter(c, language)),
  };
};

export const getChapterData = (
  storyId: string,
  chapterId: string,
  language: Language,
): LocalizedChapter | null => {
  const story = STORY_WORLDS.find((s) => s.id === storyId);
  const chapter = story?.chapters.find((c) => c.id === chapterId);
  return chapter ? localizeChapter(chapter, language) : null;
};

export const getNextChapter = (storyId: string, chapterId: string): Chapter | null => {
  const story = STORY_WORLDS.find((s) => s.id === storyId);
  if (!story) return null;
  const idx = story.chapters.findIndex((c) => c.id === chapterId);
  return idx >= 0 && idx < story.chapters.length - 1 ? story.chapters[idx + 1] : null;
};

export const getPreviousChapter = (storyId: string, chapterId: string): Chapter | null => {
  const story = STORY_WORLDS.find((s) => s.id === storyId);
  if (!story) return null;
  const idx = story.chapters.findIndex((c) => c.id === chapterId);
  return idx > 0 ? story.chapters[idx - 1] : null;
};
