import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Crypto from 'expo-crypto';
import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import type { Language } from './data';
import { findAccount, signIn as signInLocal, signUp as signUpLocal, type Account, type AccountStore, type Me } from './auth';

/** What the phone remembers: language, saved stories, and where you were in each story. */
interface Persisted {
  lang: Language;
  saved: string[];
  following: string[];
  chapter: Record<string, number>;
  /** The first-run screens are done. */
  onboarded: boolean;
  /** They chose "Explore without an account". */
  guest: boolean;
  userId: string | null;
  interests: string[];
}
const KEY = 'seen.native.v1';
const DEFAULT: Persisted = { lang: 'en', saved: [], following: [], chapter: {}, onboarded: false, guest: false, userId: null, interests: [] };

const ACCOUNTS = 'seen.native.accounts.v1';
const accountStore: AccountStore = {
  load: async () => JSON.parse((await AsyncStorage.getItem(ACCOUNTS)) ?? '[]') as Account[],
  save: async list => AsyncStorage.setItem(ACCOUNTS, JSON.stringify(list)),
};
const sha = (text: string) => Crypto.digestStringAsync(Crypto.CryptoDigestAlgorithm.SHA256, text);

interface AppState extends Persisted {
  ready: boolean;
  user: Me | null;
  signUp: (i: { name: string; email: string; password: string }) => Promise<void>;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => void;
  enterGuest: () => void;
  setInterests: (topics: string[]) => void;
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
  const [user, setUser] = useState<Me | null>(null);

  useEffect(() => {
    AsyncStorage.getItem(KEY)
      .then(async raw => {
        const saved = raw ? { ...DEFAULT, ...(JSON.parse(raw) as Partial<Persisted>) } : DEFAULT;
        setData(saved);
        if (saved.userId) setUser(await findAccount(accountStore, saved.userId));
      })
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
      user,
      signUp: async input => {
        const me = await signUpLocal(accountStore, sha, input, () => Crypto.randomUUID());
        setUser(me);
        update(p => ({ ...p, userId: me.id, onboarded: true, guest: false }));
      },
      signIn: async (email, password) => {
        const me = await signInLocal(accountStore, sha, email, password);
        setUser(me);
        update(p => ({ ...p, userId: me.id, onboarded: true, guest: false }));
      },
      signOut: () => {
        setUser(null);
        update(p => ({ ...p, userId: null, guest: true }));
      },
      enterGuest: () => update(p => ({ ...p, onboarded: true, guest: true })),
      setInterests: interests => update(p => ({ ...p, interests })),
      setLang: lang => update(p => ({ ...p, lang })),
      toggleSaved: id => update(p => ({ ...p, saved: p.saved.includes(id) ? p.saved.filter(x => x !== id) : [...p.saved, id] })),
      isSaved: id => data.saved.includes(id),
      toggleFollow: id => update(p => ({ ...p, following: p.following.includes(id) ? p.following.filter(x => x !== id) : [...p.following, id] })),
      isFollowing: id => data.following.includes(id),
      rememberChapter: (id, index) => update(p => ({ ...p, chapter: { ...p.chapter, [id]: index } })),
    }),
    [data, ready, user, update],
  );
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}
