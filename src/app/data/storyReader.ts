/**
 * STORY READER ADAPTER
 *
 * The live reader UI (StoryChapterScreen, ChapterIndexScreen, ContextCardModal,
 * BranchingChoiceOverlay) was originally built against data/content.ts, a
 * 2-story sample dataset (only 1 of which actually has chapters). Meanwhile
 * Explore/Library/For You all list from data/storyDatabase.ts, the real
 * 14-story catalog. Opening any story other than "midnight-resonance" hit
 * an empty chapter list.
 *
 * This module adapts storyDatabase.ts's StoryWorld/Chapter shape into the
 * shape the reader UI already expects, so the UI keeps working unchanged
 * while actually reading from the real catalog. storyDatabase.ts content has
 * no seeded captions, branch choices, or community responses yet — the
 * reader UI already treats all of those as optional and degrades gracefully
 * when absent.
 */

import { Language } from '../contexts/StoryStateContext';
import {
  STORY_WORLDS as DB_STORY_WORLDS,
  StoryWorld as DBStoryWorld,
  Chapter as DBChapter,
  ContextCard as DBContextCard,
} from './storyDatabase';

export interface MultilingualText {
  en: string;
  fr: string;
  es: string;
}

export interface StoryWorld {
  id: string;
  title: MultilingualText;
  description: MultilingualText;
  subtitle: MultilingualText;
  category: MultilingualText;
  themes: MultilingualText[];
  availableLanguages: Language[];
  imageUrl: string;
  status: 'draft' | 'published';
  creatorId?: string;
}

export interface BranchOption {
  id: string;
  text: MultilingualText;
  nextChapterId?: string;
  tag?: string;
}

export interface BranchChoice {
  id: string;
  questionText: MultilingualText;
  options: BranchOption[];
  impactsOutcome: boolean;
}

export interface ContextCard {
  id: string;
  type: 'artist' | 'cultural' | 'historical' | 'technical' | 'location' | 'institutional';
  title: MultilingualText;
  content: MultilingualText;
  imageUrl?: string;
  externalLink?: string;
  relatedTags: string[];
}

export interface CommunityResponse {
  id: string;
  chapterId: string;
  userId: string;
  userName: string;
  userAvatar?: string;
  responseType: 'text' | 'audio' | 'image';
  content: string;
  timestamp: string;
  moderationStatus: 'pending' | 'approved' | 'rejected';
  likes: number;
}

export interface Chapter {
  id: string;
  storyWorldId: string;
  number: number;
  title: MultilingualText;
  content: MultilingualText;
  subtitle: MultilingualText;
  imageUrl: string;
  audioSrc?: string;
  captionsSrc?: {
    en?: string;
    fr?: string;
    es?: string;
  };
  duration: string;
  orderIndex: number;
  branchChoices?: BranchChoice[];
  nextChapterId?: string;
}

export function getText(text: MultilingualText | string, preferredLang: Language = 'en'): string {
  if (typeof text === 'string') return text;
  if (text[preferredLang]) return text[preferredLang];
  if (text.en) return text.en;
  return text[Object.keys(text)[0] as Language] || '';
}

function pickAudioSrc(media: DBChapter['media']): string | undefined {
  return media.narration?.url || media.music?.url || media.ambient?.url;
}

function toReaderChapter(dbStory: DBStoryWorld, dbChapter: DBChapter): Chapter {
  return {
    id: dbChapter.id,
    storyWorldId: dbStory.id,
    number: dbChapter.order,
    orderIndex: dbChapter.order,
    title: dbChapter.title,
    subtitle: dbChapter.description,
    content: dbChapter.text,
    imageUrl: dbChapter.media.images?.[0] || dbStory.coverImage,
    audioSrc: pickAudioSrc(dbChapter.media),
    duration: `${dbChapter.estimatedDuration} min`,
  };
}

function toReaderStoryWorld(dbStory: DBStoryWorld): StoryWorld {
  const primaryTheme = dbStory.culturalThemes[0] || 'Story World';
  return {
    id: dbStory.id,
    title: dbStory.title,
    description: dbStory.description,
    subtitle: dbStory.description,
    category: { en: primaryTheme, fr: primaryTheme, es: primaryTheme },
    themes: dbStory.culturalThemes.map((t) => ({ en: t, fr: t, es: t })),
    availableLanguages: dbStory.languagesAvailable,
    imageUrl: dbStory.coverImage,
    status: 'published',
  };
}

function toReaderContextCard(card: DBContextCard): ContextCard {
  return {
    id: card.id,
    type: card.type,
    title: card.title,
    content: card.content,
    relatedTags: [],
  };
}

export function getChaptersForStory(storyWorldId: string): Chapter[] {
  const story = DB_STORY_WORLDS.find((s) => s.id === storyWorldId);
  if (!story) return [];
  return [...story.chapters]
    .sort((a, b) => a.order - b.order)
    .map((ch) => toReaderChapter(story, ch));
}

export function getStoryWorld(id: string): StoryWorld | undefined {
  const story = DB_STORY_WORLDS.find((s) => s.id === id);
  return story ? toReaderStoryWorld(story) : undefined;
}

export function getChapter(chapterId: string): Chapter | undefined {
  for (const story of DB_STORY_WORLDS) {
    const ch = story.chapters.find((c) => c.id === chapterId);
    if (ch) return toReaderChapter(story, ch);
  }
  return undefined;
}

export function getContextCardsForChapter(chapterId: string): ContextCard[] {
  for (const story of DB_STORY_WORLDS) {
    const ch = story.chapters.find((c) => c.id === chapterId);
    if (ch) return (ch.contextCards || []).map(toReaderContextCard);
  }
  return [];
}

export function getResponsesForChapter(_chapterId: string): CommunityResponse[] {
  // storyDatabase.ts content has no seeded community responses yet.
  return [];
}
