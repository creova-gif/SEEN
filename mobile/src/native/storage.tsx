import AsyncStorage from '@react-native-async-storage/async-storage';
import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import type { Language } from './data';

/** What the phone remembers: language, saved stories, and where you were in each story. */
interface Persisted {
  lang: Language;
  saved: string[];
  following: string[];
  chapter: Record<string, number>;
}
const KEY = 'seen.native.v1';
const DEFAULT: Persisted = { lang: 'en', saved: [], following: [], chapter: {} };

interface AppState extends Persisted {
  ready: boolean;
  setLang: (l: Language) => void;
  toggleSaved: (storyId: string) => void;
  isSaved: (storyId: string) => boolean;
  toggleFollow: (creatorId: string) => void;
  isFollowing: (creatorId: string) => boolean;
  rememberChapter: (storyId: string, index: number) => void;
}

const Ctx = createContext<AppState | null>(null);
export const useApp = () => {
  const v = useContext(Ctx);
  if (!v) throw new Error('useApp must be used inside <AppStateProvider>');
  return v;
};

export function AppStateProvider({ children }: { children: ReactNode }) {
  const [data, setData] = useState<Persisted>(DEFAULT);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    AsyncStorage.getItem(KEY)
      .then(raw => raw && setData({ ...DEFAULT, ...(JSON.parse(raw) as Partial<Persisted>) }))
      .catch(() => {})
      .finally(() => setReady(true));
  }, []);

  const update = useCallback((fn: (p: Persisted) => Persisted) => {
    setData(prev => {
      const next = fn(prev);
      AsyncStorage.setItem(KEY, JSON.stringify(next)).catch(() => {});
      return next;
    });
  }, []);

  const value = useMemo<AppState>(
    () => ({
      ...data,
      ready,
      setLang: lang => update(p => ({ ...p, lang })),
      toggleSaved: id => update(p => ({ ...p, saved: p.saved.includes(id) ? p.saved.filter(x => x !== id) : [...p.saved, id] })),
      isSaved: id => data.saved.includes(id),
      toggleFollow: id => update(p => ({ ...p, following: p.following.includes(id) ? p.following.filter(x => x !== id) : [...p.following, id] })),
      isFollowing: id => data.following.includes(id),
      rememberChapter: (id, index) => update(p => ({ ...p, chapter: { ...p.chapter, [id]: index } })),
    }),
    [data, ready, update],
  );
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}
