import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export type Language = 'en' | 'fr' | 'es';
export type UserIntent = 'explore' | 'create' | 'contribute';
export type UserRole = 'viewer' | 'creator' | 'moderator' | 'admin';

export interface AccessibilityPreferences {
  captionsEnabled: boolean;
  highContrast: boolean;
  reducedMotion: boolean;
}

export interface PersonalizationPreferences {
  immersiveNarratives: boolean;
  richAudio: boolean;
  dynamicMotion: boolean;
}

export interface AudioState {
  isPlaying: boolean;
  isMuted: boolean;
  volume: number;
  currentTrackId?: string;
  playbackPosition: number;
}

export interface ProgressSnapshot {
  storyWorldId: string;
  lastCompletedChapterId: string;
  lastAccessDate: string;
  playbackPosition: number;
  completed?: boolean;
}

export interface BranchChoice {
  chapterId: string;
  choiceId: string;
  selectedOption: string;
  timestamp: string;
}

export interface StoryState {
  language: Language;
  intent: UserIntent;
  userRole: UserRole;
  accessibilityPreferences: AccessibilityPreferences;
  personalizationPreferences: PersonalizationPreferences;
  currentStoryWorldId?: string;
  currentChapterId?: string;
  audioState: AudioState;
  progressSnapshots: ProgressSnapshot[];
  branchChoices: BranchChoice[];
}

interface StoryStateContextType {
  state: StoryState;
  isLoaded: boolean;
  setLanguage: (lang: Language) => void;
  setIntent: (intent: UserIntent) => void;
  setUserRole: (role: UserRole) => void;
  setAccessibilityPreferences: (prefs: Partial<AccessibilityPreferences>) => void;
  setPersonalizationPreferences: (prefs: Partial<PersonalizationPreferences>) => void;
  enterStoryWorld: (storyWorldId: string) => void;
  navigateToChapter: (chapterId: string) => void;
  updateAudioState: (audioState: Partial<AudioState>) => void;
  saveProgress: (storyWorldId: string, chapterId: string) => void;
  getProgressForStory: (storyWorldId: string) => ProgressSnapshot | undefined;
  exitStory: () => void;
  recordBranchChoice: (chapterId: string, choiceId: string, selectedOption: string) => void;
  getChoicesForStory: (storyWorldId: string) => BranchChoice[];
}

const defaultState: StoryState = {
  language: 'en',
  intent: 'explore',
  userRole: 'viewer',
  accessibilityPreferences: { captionsEnabled: false, highContrast: false, reducedMotion: false },
  personalizationPreferences: { immersiveNarratives: false, richAudio: false, dynamicMotion: false },
  audioState: { isPlaying: false, isMuted: false, volume: 0.7, playbackPosition: 0 },
  progressSnapshots: [],
  branchChoices: [],
};

const StoryStateContext = createContext<StoryStateContextType | undefined>(undefined);
const STORAGE_KEY = 'seenos_story_state';

export function StoryStateProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<StoryState>(defaultState);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const load = async () => {
      try {
        const stored = await AsyncStorage.getItem(STORAGE_KEY);
        if (stored) {
          const parsed = JSON.parse(stored);
          setState({ ...defaultState, ...parsed });
        }
      } catch (e) {
        console.error('Failed to load story state:', e);
      } finally {
        setIsLoaded(true);
      }
    };
    load();
  }, []);

  useEffect(() => {
    if (!isLoaded) return;
    AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(state)).catch(console.error);
  }, [state, isLoaded]);

  const setLanguage = useCallback((lang: Language) => setState(prev => ({ ...prev, language: lang })), []);
  const setIntent = useCallback((intent: UserIntent) => setState(prev => ({ ...prev, intent })), []);
  const setUserRole = useCallback((role: UserRole) => setState(prev => ({ ...prev, userRole: role })), []);

  const setAccessibilityPreferences = useCallback((prefs: Partial<AccessibilityPreferences>) => {
    setState(prev => ({
      ...prev,
      accessibilityPreferences: { ...prev.accessibilityPreferences, ...prefs },
    }));
  }, []);

  const setPersonalizationPreferences = useCallback((prefs: Partial<PersonalizationPreferences>) => {
    setState(prev => ({
      ...prev,
      personalizationPreferences: { ...prev.personalizationPreferences, ...prefs },
    }));
  }, []);

  const enterStoryWorld = useCallback((storyWorldId: string) => {
    setState(prev => ({ ...prev, currentStoryWorldId: storyWorldId }));
  }, []);

  const navigateToChapter = useCallback((chapterId: string) => {
    setState(prev => ({ ...prev, currentChapterId: chapterId }));
  }, []);

  const updateAudioState = useCallback((audioState: Partial<AudioState>) => {
    setState(prev => ({ ...prev, audioState: { ...prev.audioState, ...audioState } }));
  }, []);

  const saveProgress = useCallback((storyWorldId: string, chapterId: string) => {
    setState(prev => {
      const existing = prev.progressSnapshots.findIndex(p => p.storyWorldId === storyWorldId);
      const snapshot: ProgressSnapshot = {
        storyWorldId,
        lastCompletedChapterId: chapterId,
        lastAccessDate: new Date().toISOString(),
        playbackPosition: prev.audioState.playbackPosition,
      };
      const snapshots = [...prev.progressSnapshots];
      if (existing >= 0) snapshots[existing] = snapshot;
      else snapshots.push(snapshot);
      return { ...prev, progressSnapshots: snapshots };
    });
  }, []);

  const getProgressForStory = useCallback((storyWorldId: string) =>
    state.progressSnapshots.find(p => p.storyWorldId === storyWorldId), [state.progressSnapshots]);

  const exitStory = useCallback(() => {
    setState(prev => ({ ...prev, currentStoryWorldId: undefined, currentChapterId: undefined }));
  }, []);

  const recordBranchChoice = useCallback((chapterId: string, choiceId: string, selectedOption: string) => {
    setState(prev => ({
      ...prev,
      branchChoices: [...prev.branchChoices, { chapterId, choiceId, selectedOption, timestamp: new Date().toISOString() }],
    }));
  }, []);

  const getChoicesForStory = useCallback((storyWorldId: string) => {
    const world = state.progressSnapshots.find(p => p.storyWorldId === storyWorldId);
    if (!world) return [];
    return state.branchChoices;
  }, [state]);

  return (
    <StoryStateContext.Provider value={{
      state, isLoaded,
      setLanguage, setIntent, setUserRole,
      setAccessibilityPreferences, setPersonalizationPreferences,
      enterStoryWorld, navigateToChapter, updateAudioState, saveProgress,
      getProgressForStory, exitStory, recordBranchChoice, getChoicesForStory,
    }}>
      {children}
    </StoryStateContext.Provider>
  );
}

export function useStoryState() {
  const ctx = useContext(StoryStateContext);
  if (!ctx) throw new Error('useStoryState must be used within StoryStateProvider');
  return ctx;
}
