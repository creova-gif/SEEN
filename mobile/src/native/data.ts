import './polyfill';
import {
  getPublicStories,
  getStoryWorldById,
  getLocalizedText,
  type Language,
  type StoryWorld,
} from '@seen/data/storyDatabase';
import { getChaptersForStory } from '@seen/data/storyDatabase';
import { translate, type StringKey } from '@seen/i18n/strings';

export type { Language, StoryWorld };
export { getPublicStories, getStoryWorldById, getLocalizedText, getChaptersForStory };

export const t = (key: StringKey, lang: Language, vars?: Record<string, string>) => translate(key, lang, vars);

/** Splits chapter text into sentences, the same way the website does (for follow-along reading). */
export const sentencesOf = (text: string) => text.split(/(?<=[.!?…])\s+/).filter(Boolean);
