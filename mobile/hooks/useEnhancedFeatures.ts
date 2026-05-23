import { useCallback, useEffect, useState } from 'react';
import {
  DEFAULT_FEATURE_PREFS,
  loadFeaturePreferences,
  saveFeaturePreferences,
  loadPublicCollections,
  savePublicCollections,
  loadReflections,
  saveReflections,
  type FeaturePreferences,
  type Collection,
  type Reflection,
} from '../data/enhancedFeatures';

export function useFeaturePreferences(userId: string) {
  const [preferences, setPreferences] = useState<FeaturePreferences | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    loadFeaturePreferences(userId).then((p) => {
      if (active) { setPreferences(p); setLoading(false); }
    });
    return () => { active = false; };
  }, [userId]);

  const updatePreferences = useCallback(
    async (partial: Partial<FeaturePreferences>) => {
      const next = { ...(preferences ?? DEFAULT_FEATURE_PREFS), ...partial };
      setPreferences(next);
      await saveFeaturePreferences(userId, next);
    },
    [userId, preferences],
  );

  return { preferences, loading, updatePreferences };
}

export function usePublicCollections() {
  const [collections, setCollections] = useState<Collection[]>([]);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    const cs = await loadPublicCollections();
    setCollections(cs);
    setLoading(false);
  }, []);

  useEffect(() => { refresh(); }, [refresh]);

  const addCollection = useCallback(
    async (c: Collection) => {
      const next = [...collections, c];
      setCollections(next);
      await savePublicCollections(next);
    },
    [collections],
  );

  return { collections, loading, refresh, addCollection };
}

export function useChapterReflections(chapterId?: string) {
  const [reflections, setReflections] = useState<Reflection[]>([]);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    const all = await loadReflections();
    setReflections(chapterId ? all.filter((r) => r.chapterId === chapterId) : all);
    setLoading(false);
  }, [chapterId]);

  useEffect(() => { refresh(); }, [refresh]);

  const moderate = useCallback(
    async (id: string, status: 'approved' | 'rejected') => {
      const all = await loadReflections();
      const next = all.map((r) => (r.id === id ? { ...r, status } : r));
      await saveReflections(next);
      setReflections(chapterId ? next.filter((r) => r.chapterId === chapterId) : next);
    },
    [chapterId],
  );

  return { reflections, loading, refresh, moderate };
}
