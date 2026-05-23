/**
 * SEEN Mobile — Unified Content Aggregator
 *
 * Brute-pulls every content item from every catalog in src/app/data/,
 * normalizes them to a single shape, and dedupes by id.
 *
 * Sources covered (everything in the brute audit):
 *  - database.ts           → 26  (MUSIC/STORY/FILM/INSTITUTIONAL_CONTENT)
 *  - storyDatabase.ts      → 14  (STORY_WORLDS, i18n)
 *  - exploreContentCatalog → 11  (EXPLORE_COLLECTIONS/FILMS/MUSIC/ARCHIVES)
 *  - musicBIPOCCatalog     → 5   (MUSIC_BIPOC_CATALOG)
 *  - institutionalCollectionsCatalog → 8
 *  - bipocCollectionsCatalog → 5
 *  - filmsEmbedRegistry    → 5   (FILMS_CATALOG)
 *  - 7× season individual story files (ExpandedStoryWorld)
 *  - futureStoryWorldsInventory → 14 (PLANNED)
 *  - futureStoryWorldsSeasons234 → 18 (PLANNED)
 */

import {
  MUSIC_CONTENT,
  STORY_CONTENT,
  FILM_CONTENT,
  INSTITUTIONAL_CONTENT,
} from '../../src/app/data/database';
import { STORY_WORLDS } from '../../src/app/data/storyDatabase';
import {
  EXPLORE_COLLECTIONS,
  EXPLORE_FILMS,
  EXPLORE_MUSIC,
  EXPLORE_ARCHIVES,
} from '../../src/app/data/exploreContentCatalog';
import { MUSIC_BIPOC_CATALOG } from '../../src/app/data/musicBIPOCCatalog';
import { INSTITUTIONAL_COLLECTIONS } from '../../src/app/data/institutionalCollectionsCatalog';
import { BIPOC_COLLECTIONS } from '../../src/app/data/bipocCollectionsCatalog';
import { FILMS_CATALOG } from '../../src/app/data/filmsEmbedRegistry';
import { SEASON_2_EXPANDED_STORIES } from '../../src/app/data/season2ExpandedChapters';
import { STORY_SLEEPING_CAR_PORTERS } from '../../src/app/data/season2ExpandedChaptersPart2';
import { CURATED_FILMS_REGISTRY } from '../../src/app/data/curatedFilmsRegistry';
import { BLACK_CANADIAN_HISTORY_STORIES } from '../../src/app/data/blackCanadianHistoryStories';
import { STORY_BLACK_WOMENS_ARCHIVE } from '../../src/app/data/season2Story3BlackWomensArchive';
import { STORY_MONTREAL_BLACK_MUSIC } from '../../src/app/data/season2Story4MontrealMusic';
import { STORY_AFRICVILLE_MEMORY } from '../../src/app/data/season2Story5AfricvilleMemory';
import { STORY_BLACK_CANADIAN_FUTURES } from '../../src/app/data/season2Story6BlackFutures';
import { SEASON3_STORY1_DIASPORA } from '../../src/app/data/season3Story1Diaspora';
import { SEASON3_STORY2_INDIGENOUS_URBAN } from '../../src/app/data/season3Story2IndigenousUrban';
import { SEASON4_STORY1_YOUTH_VOICES } from '../../src/app/data/season4Story1YouthVoices';
import {
  FUTURE_BLACK_CANADIAN_STORIES,
  FUTURE_INDIGENOUS_STORIES,
  FUTURE_ASIAN_DIASPORA_STORIES,
  FUTURE_SOLIDARITY_STORIES,
} from '../../src/app/data/futureStoryWorldsInventory';
import {
  SEASON_2_BLACK_FUTURES,
  SEASON_3_DIASPORA_MIGRATION,
  SEASON_4_YOUTH_CULTURE_TOMORROW,
} from '../../src/app/data/futureStoryWorldsSeasons234';

export type UnifiedType =
  | 'music' | 'story' | 'film' | 'collection' | 'archive';

export type UnifiedItem = {
  id: string;
  type: UnifiedType;
  title: string;
  description: string;
  creator: string;
  duration: string;
  coverImage?: string;
  audioSrc?: string;
  releaseDate?: string;
  language: string[];
  tags: string[];
  featured?: boolean;
  new?: boolean;
  trending?: boolean;
  isPlanned?: boolean;       // future/planned content
  source: string;            // which catalog it came from (for debugging)
};

// ---------- helpers ----------

const pick = <T>(v: T | { en?: T; fr?: T; es?: T } | undefined, fallback: T): T => {
  if (v == null) return fallback;
  if (typeof v === 'object' && v !== null && 'en' in (v as any)) {
    return ((v as any).en ?? (v as any).fr ?? (v as any).es ?? fallback) as T;
  }
  return v as T;
};

const str = (v: any, fallback = ''): string => {
  const picked = pick<any>(v, fallback);
  return typeof picked === 'string' ? picked : fallback;
};

const arr = (v: any): string[] => {
  if (Array.isArray(v)) return v.filter(x => typeof x === 'string');
  return [];
};

// ---------- normalizers ----------

// database.ts ContentItem — already in target shape
const fromContentItem = (i: any, source: string): UnifiedItem => ({
  id: i.id,
  type: i.type,
  title: i.title,
  description: i.description,
  creator: i.creator,
  duration: i.duration,
  coverImage: i.mediaSource,
  audioSrc: i.audioSrc,
  releaseDate: i.releaseDate,
  language: arr(i.language),
  tags: arr(i.tags),
  featured: !!i.featured,
  new: !!i.new,
  trending: !!i.trending,
  source,
});

// storyDatabase.ts StoryWorld
const fromStoryWorld = (s: any, source: string): UnifiedItem => ({
  id: s.id,
  type: 'story',
  title: str(s.title, s.id),
  description: str(s.description),
  creator: str(s.creator),
  duration: s.totalDuration || `${s.chapterCount ?? '?'} chapters`,
  coverImage: s.coverImage,
  releaseDate: s.releaseDate,
  language: arr(s.languagesAvailable),
  tags: arr(s.culturalThemes),
  featured: !!s.featured,
  new: !!s.new,
  trending: !!s.trending,
  source,
});

// exploreContentCatalog.ts ExploreContent
const fromExploreContent = (i: any, source: string): UnifiedItem => ({
  id: i.id,
  type: i.type as UnifiedType,
  title: str(i.title, i.id),
  description: str(i.description),
  creator: str(i.creator),
  duration: i.duration || '',
  coverImage: i.coverImage,
  releaseDate: i.releaseDate,
  language: arr(i.languagesAvailable),
  tags: arr(i.culturalThemes),
  featured: !!i.featured,
  new: !!i.new,
  trending: !!i.trending,
  source,
});

// musicBIPOCCatalog.ts MusicItem (title is a plain string here)
const fromMusicBIPOC = (m: any, source: string): UnifiedItem => ({
  id: m.musicId,
  type: 'music',
  title: typeof m.title === 'string' ? m.title : str(m.title, m.musicId),
  description: str(m.description),
  creator: m.artistName || str(m.creator),
  duration: m.duration || '',
  coverImage: m.coverArt,
  audioSrc: m.audioUrl,
  releaseDate: m.releaseYear ? String(m.releaseYear) : undefined,
  language: arr(m.language),
  tags: arr(m.themes ?? m.genre),
  featured: !!m.featured,
  new: !!m.new,
  source,
});

// institutionalCollectionsCatalog.ts InstitutionalCollection
const fromInstitutional = (c: any, source: string): UnifiedItem => ({
  id: c.collectionId,
  type: 'archive',
  title: str(c.title, c.collectionId),
  description: str(c.institutionalDescription ?? c.description),
  creator: str(c.institution ?? c.curator, 'Institutional Partner'),
  duration: c.historicalScope?.timeperiod || 'Collection',
  language: ['en'],
  tags: arr(c.historicalScope?.themes),
  source,
});

// bipocCollectionsCatalog.ts BIPOCCollection
const fromBIPOCCollection = (c: any, source: string): UnifiedItem => ({
  id: c.collectionId,
  type: 'collection',
  title: str(c.title, c.collectionId),
  description: str(c.curatorialDescription),
  creator: str(c.curator, 'SEEN Editorial'),
  duration: 'Curated Collection',
  language: ['en'],
  tags: arr(c.themes),
  featured: !!c.featured,
  source,
});

// filmsEmbedRegistry.ts Film
const fromFilmEmbed = (f: any, source: string): UnifiedItem => ({
  id: f.id,
  type: 'film',
  title: str(f.title, f.id),
  description: str(f.description),
  creator: typeof f.creator === 'string' ? f.creator : str(f.creator),
  duration: f.duration || '',
  coverImage: f.coverImage,
  releaseDate: f.year ? String(f.year) : undefined,
  language: arr(f.language),
  tags: arr(f.themes ?? f.culturalFocus),
  featured: !!f.featured,
  new: !!f.new,
  source,
});

// curatedFilmsRegistry.ts CuratedFilm (NFB / YouTube embeds)
const fromCuratedFilm = (f: any, source: string): UnifiedItem => ({
  id: f.filmId,
  type: 'film',
  title: str(f.title, f.filmId),
  description: str(f.canadianRelevance ?? f.description),
  creator: typeof f.creator === 'string'
    ? (f.channel ? `${f.creator} · ${f.channel}` : f.creator)
    : (f.channel || 'Curated film'),
  duration: f.duration || '',
  coverImage: f.coverImage || f.thumbnail,
  releaseDate: f.year ? String(f.year) : undefined,
  language: arr(f.languages ?? f.language),
  tags: arr(f.themes ?? f.culturalFocus),
  featured: !!f.featured,
  new: !!f.new,
  source,
});

// season individual stories (ExpandedStoryWorld)
const fromExpandedStory = (s: any, source: string): UnifiedItem => ({
  id: s.storyWorldId,
  type: 'story',
  title: str(s.title, s.storyWorldId),
  description: str(s.description),
  creator: str(s.creator, 'SEEN Editorial'),
  duration: s.estimatedDuration || `${s.totalChapters ?? '?'} chapters`,
  language: arr(s.languagesAvailable) .length ? arr(s.languagesAvailable) : ['en'],
  tags: arr(s.culturalThemes),
  featured: s.publicationStatus === 'ready',
  source,
});

// futureStoryWorlds*.ts FutureStoryWorld (marked as planned)
const fromFutureStory = (s: any, source: string): UnifiedItem => ({
  id: s.storyWorldId,
  type: (s.format === 'film' ? 'film' : s.format === 'music' ? 'music' : 'story') as UnifiedType,
  title: str(s.workingTitle, s.storyWorldId),
  description: str(s.editorialIntent ?? s.planningNotes),
  creator: 'SEEN Editorial · ' + (s.communityFocus ?? 'Upcoming'),
  duration: s.estimatedChapters ? `${s.estimatedChapters} chapters · planned` : 'Planned',
  language: ['en'],
  tags: [s.culturalTheme, s.season].filter(Boolean),
  isPlanned: true,
  source,
});

// ---------- build unified, deduped list ----------

const raw: UnifiedItem[] = [
  ...MUSIC_CONTENT.map(i => fromContentItem(i, 'database.MUSIC')),
  ...STORY_CONTENT.map(i => fromContentItem(i, 'database.STORY')),
  ...FILM_CONTENT.map(i => fromContentItem(i, 'database.FILM')),
  ...INSTITUTIONAL_CONTENT.map(i => fromContentItem(i, 'database.INSTITUTIONAL')),

  ...STORY_WORLDS.map(s => fromStoryWorld(s, 'storyDatabase.STORY_WORLDS')),

  ...EXPLORE_COLLECTIONS.map(i => fromExploreContent(i, 'exploreCatalog.COLLECTIONS')),
  ...EXPLORE_FILMS.map(i => fromExploreContent(i, 'exploreCatalog.FILMS')),
  ...EXPLORE_MUSIC.map(i => fromExploreContent(i, 'exploreCatalog.MUSIC')),
  ...EXPLORE_ARCHIVES.map(i => fromExploreContent(i, 'exploreCatalog.ARCHIVES')),

  ...MUSIC_BIPOC_CATALOG.map(m => fromMusicBIPOC(m, 'musicBIPOCCatalog')),
  ...INSTITUTIONAL_COLLECTIONS.map(c => fromInstitutional(c, 'institutionalCollections')),
  ...BIPOC_COLLECTIONS.map(c => fromBIPOCCollection(c, 'bipocCollections')),
  ...FILMS_CATALOG.map(f => fromFilmEmbed(f, 'filmsEmbedRegistry')),

  ...SEASON_2_EXPANDED_STORIES.map((s: any) => fromExpandedStory(s, 'season2.ExpandedStories')),
  fromExpandedStory(STORY_SLEEPING_CAR_PORTERS, 'season2.SleepingCarPorters'),
  ...BLACK_CANADIAN_HISTORY_STORIES.map((s: any) => fromStoryWorld(s, 'blackCanadianHistoryStories')),
  ...CURATED_FILMS_REGISTRY.map((f: any) => fromCuratedFilm(f, 'curatedFilmsRegistry')),
  fromExpandedStory(STORY_BLACK_WOMENS_ARCHIVE, 'season2.BlackWomensArchive'),
  fromExpandedStory(STORY_MONTREAL_BLACK_MUSIC, 'season2.MontrealMusic'),
  fromExpandedStory(STORY_AFRICVILLE_MEMORY, 'season2.AfricvilleMemory'),
  fromExpandedStory(STORY_BLACK_CANADIAN_FUTURES, 'season2.BlackFutures'),
  fromExpandedStory(SEASON3_STORY1_DIASPORA, 'season3.Diaspora'),
  fromExpandedStory(SEASON3_STORY2_INDIGENOUS_URBAN, 'season3.IndigenousUrban'),
  fromExpandedStory(SEASON4_STORY1_YOUTH_VOICES, 'season4.YouthVoices'),

  ...FUTURE_BLACK_CANADIAN_STORIES.map(s => fromFutureStory(s, 'future.BlackCanadian')),
  ...FUTURE_INDIGENOUS_STORIES.map(s => fromFutureStory(s, 'future.Indigenous')),
  ...FUTURE_ASIAN_DIASPORA_STORIES.map(s => fromFutureStory(s, 'future.AsianDiaspora')),
  ...FUTURE_SOLIDARITY_STORIES.map(s => fromFutureStory(s, 'future.Solidarity')),
  ...SEASON_2_BLACK_FUTURES.map((s: any) => fromFutureStory(s, 'future.S2BlackFutures')),
  ...SEASON_3_DIASPORA_MIGRATION.map((s: any) => fromFutureStory(s, 'future.S3Diaspora')),
  ...SEASON_4_YOUTH_CULTURE_TOMORROW.map((s: any) => fromFutureStory(s, 'future.S4Youth')),
];

// Dedupe by id. Score each candidate by richness; highest score wins.
// Live always beats planned. Among live, prefer entries with more metadata
// (audio source, cover image, multiple languages, tags, release date).
const richnessScore = (x: UnifiedItem): number =>
  (x.isPlanned ? -100 : 0) +
  (x.audioSrc ? 5 : 0) +
  (x.coverImage ? 4 : 0) +
  (x.releaseDate ? 2 : 0) +
  Math.min(x.language.length, 4) +
  Math.min(x.tags.length * 0.5, 4) +
  (x.description?.length ? Math.min(x.description.length / 100, 3) : 0) +
  (x.featured ? 1 : 0) + (x.new ? 1 : 0) + (x.trending ? 1 : 0);

const seen = new Map<string, UnifiedItem>();
for (const item of raw) {
  if (!item.id) continue;
  const existing = seen.get(item.id);
  if (!existing) { seen.set(item.id, item); continue; }
  if (richnessScore(item) > richnessScore(existing)) seen.set(item.id, item);
}

export const ALL_ITEMS: UnifiedItem[] = Array.from(seen.values());

// Sort: featured first, then new, then trending, then live items, planned last.
ALL_ITEMS.sort((a, b) => {
  const score = (x: UnifiedItem) =>
    (x.isPlanned ? -10 : 0) +
    (x.featured ? 3 : 0) +
    (x.new ? 2 : 0) +
    (x.trending ? 1 : 0) +
    (x.coverImage ? 0.5 : 0);
  return score(b) - score(a);
});

export const MUSIC_ALL          = ALL_ITEMS.filter(i => i.type === 'music');
export const STORY_ALL          = ALL_ITEMS.filter(i => i.type === 'story');
export const FILM_ALL           = ALL_ITEMS.filter(i => i.type === 'film');
export const COLLECTION_ALL     = ALL_ITEMS.filter(i => i.type === 'collection');
export const ARCHIVE_ALL        = ALL_ITEMS.filter(i => i.type === 'archive');

export const LIVE_ITEMS    = ALL_ITEMS.filter(i => !i.isPlanned);
export const PLANNED_ITEMS = ALL_ITEMS.filter(i => i.isPlanned);

export const CONTENT_SUMMARY = {
  total: ALL_ITEMS.length,
  live: LIVE_ITEMS.length,
  planned: PLANNED_ITEMS.length,
  music: MUSIC_ALL.length,
  story: STORY_ALL.length,
  film: FILM_ALL.length,
  collection: COLLECTION_ALL.length,
  archive: ARCHIVE_ALL.length,
};
