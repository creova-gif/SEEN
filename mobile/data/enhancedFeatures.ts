// SEEN Mobile — Enhanced Feature flags + data shapes (admin-managed)
import AsyncStorage from '@react-native-async-storage/async-storage';

export type FeaturePreferences = {
  enhancedContextCardsEnabled: boolean;
  analyticsOptIn: boolean;
  creatorNotesEnabled: boolean;
  communityReflectionsVisible: boolean;
  offlinePacksEnabled: boolean;
  multiNarratorSelectionEnabled: boolean;
  seasonalEditorialFramingEnabled: boolean;
};

export const DEFAULT_FEATURE_PREFS: FeaturePreferences = {
  enhancedContextCardsEnabled: false,
  analyticsOptIn: false,
  creatorNotesEnabled: false,
  communityReflectionsVisible: false,
  offlinePacksEnabled: false,
  multiNarratorSelectionEnabled: false,
  seasonalEditorialFramingEnabled: false,
};

const KEY_PREFS = (userId: string) => `seen_feature_prefs_${userId}`;
const KEY_COLLECTIONS = 'seen_public_collections';
const KEY_REFLECTIONS = 'seen_chapter_reflections';

export async function loadFeaturePreferences(userId: string): Promise<FeaturePreferences> {
  try {
    const raw = await AsyncStorage.getItem(KEY_PREFS(userId));
    if (!raw) return DEFAULT_FEATURE_PREFS;
    return { ...DEFAULT_FEATURE_PREFS, ...JSON.parse(raw) };
  } catch {
    return DEFAULT_FEATURE_PREFS;
  }
}

export async function saveFeaturePreferences(
  userId: string,
  prefs: FeaturePreferences,
): Promise<void> {
  try { await AsyncStorage.setItem(KEY_PREFS(userId), JSON.stringify(prefs)); } catch {}
}

export type ContextCard = {
  id: string;
  term: string;
  explanation: { en: string; fr: string; es: string };
  expandedContext: { en: string; fr: string; es: string };
  createdAt: string;
  lastUpdated: string;
};

export type Collection = {
  id: string;
  title: { en: string; fr: string; es: string };
  description: { en: string; fr: string; es: string };
  curatedBy: string;
  contentIds: string[];
  isPublic: boolean;
  createdAt: string;
};

export async function loadPublicCollections(): Promise<Collection[]> {
  try {
    const raw = await AsyncStorage.getItem(KEY_COLLECTIONS);
    return raw ? JSON.parse(raw) : [];
  } catch { return []; }
}

export async function savePublicCollections(cs: Collection[]): Promise<void> {
  try { await AsyncStorage.setItem(KEY_COLLECTIONS, JSON.stringify(cs)); } catch {}
}

export type Reflection = {
  id: string;
  chapterId: string;
  submitterLanguage: 'en' | 'fr' | 'es';
  format: 'text' | 'audio';
  reflectionText?: string;
  audioUrl?: string;
  status: 'pending' | 'approved' | 'rejected';
  createdAt: string;
};

export async function loadReflections(): Promise<Reflection[]> {
  try {
    const raw = await AsyncStorage.getItem(KEY_REFLECTIONS);
    return raw ? JSON.parse(raw) : [];
  } catch { return []; }
}

export async function saveReflections(rs: Reflection[]): Promise<void> {
  try { await AsyncStorage.setItem(KEY_REFLECTIONS, JSON.stringify(rs)); } catch {}
}
