import { motion, AnimatePresence } from "motion/react";
import { ArrowLeft, ChevronLeft, ChevronRight, List, Share2, Bookmark, Info, MessageCircle, SmilePlus, Mic, Globe2 } from "lucide-react";
import { useState, useEffect } from "react";
import { AudioPlayer } from "./AudioPlayer";
import { useAudioPlayer } from "../hooks/useAudioPlayer";
import { useStoryState } from "../contexts/StoryStateContext";
import { 
  getChaptersForStory, 
  getText, 
  Chapter, 
  getContextCardsForChapter,
  getResponsesForChapter,
  getChapter
} from "../data/content";
import { LanguageSwitcher } from "./LanguageSwitcher";
import { ContextCardModal } from "./ContextCardModal";
import { CommunityResponsesPanel } from "./CommunityResponsesPanel";
import { BranchingChoiceOverlay } from "./BranchingChoiceOverlay";

interface StoryChapterScreenProps {
  onClose: () => void;
  onShowIndex: () => void;
  storyWorldId?: string;
}

// Feature 1: Timed Reaction types
const REACTION_EMOJIS = ['❤️', '🔥', '💫', '😢', '🙏'] as const;
type ReactionEmoji = typeof REACTION_EMOJIS[number];

interface TimedReaction {
  id: string;
  storyId: string;
  chapterId: string;
  emoji: ReactionEmoji;
  timePosition: number;
  timestamp: number;
}

const REACTIONS_KEY = 'seen_reactions';
function loadReactions(): TimedReaction[] {
  try { return JSON.parse(localStorage.getItem(REACTIONS_KEY) || '[]'); } catch { return []; }
}
function saveReactions(r: TimedReaction[]) {
  localStorage.setItem(REACTIONS_KEY, JSON.stringify(r));
}

// Feature 2: Multilingual track labels
const LANG_LABELS: Record<string, string> = { en: 'EN', fr: 'FR', es: 'ES' };
const LANG_NAMES: Record<string, string> = { en: 'English', fr: 'Français', es: 'Español' };

export function StoryChapterScreen({ 
  onClose, 
  onShowIndex,
  storyWorldId = 'midnight-resonance'
}: StoryChapterScreenProps) {
  const { state, navigateToChapter, updateAudioState, saveProgress, setLanguage, recordBranchChoice } = useStoryState();
  const chapters = getChaptersForStory(storyWorldId);
  
  const [currentChapter, setCurrentChapter] = useState<Chapter>(() => {
    const savedChapterId = state.currentChapterId;
    return chapters.find(ch => ch.id === savedChapterId) || chapters[0];
  });
  
  const [showCaptions, setShowCaptions] = useState(state.accessibilityPreferences.captionsEnabled);
  const [controlsVisible, setControlsVisible] = useState(true);
  
  const [selectedContextCardIndex, setSelectedContextCardIndex] = useState<number | null>(null);
  const [showCommunityResponses, setShowCommunityResponses] = useState(false);
  const [showBranchChoice, setShowBranchChoice] = useState(false);
  const [hasMadeBranchChoice, setHasMadeBranchChoice] = useState(false);

  // Feature 1: Timed Reactions state
  const [reactions, setReactions] = useState<TimedReaction[]>(() =>
    loadReactions().filter(r => r.storyId === storyWorldId)
  );
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);

  // Feature 2: Audio language track state
  const [audioLang, setAudioLang] = useState<string>(state.language);
  const [trackSwitching, setTrackSwitching] = useState(false);
  
  // Early return if no chapter is found
  if (!currentChapter) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-white/60 text-center px-5">
          <p className="mb-4">No chapters available</p>
          <button 
            onClick={onClose}
            className="text-white/80 hover:text-white transition-colors"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }
  
  const contextCards = getContextCardsForChapter(currentChapter.id);
  const communityResponses = getResponsesForChapter(currentChapter.id);
  const branchChoice = currentChapter.branchChoices?.[0];
  
  const audio = useAudioPlayer({ 
    src: currentChapter.audioSrc,
    autoPlay: false 
  });

  // Sync audio state
  useEffect(() => {
    updateAudioState({
      isPlaying: audio.isPlaying,
      playbackPosition: audio.currentTime
    });
  }, [audio.isPlaying, audio.currentTime]);

  // Auto-hide controls
  useEffect(() => {
    const timer = setTimeout(() => {
      setControlsVisible(false);
    }, 3000);
    return () => clearTimeout(timer);
  }, [controlsVisible]);

  // Save progress when chapter changes
  useEffect(() => {
    navigateToChapter(currentChapter.id);
    saveProgress();
  }, [currentChapter.id]);

  const handleShowControls = () => {
    setControlsVisible(true);
    setShowEmojiPicker(false);
  };

  const handleBranchChoice = (optionId: string, nextChapterId?: string) => {
    if (!branchChoice) return;
    recordBranchChoice(currentChapter.id, branchChoice.id, optionId);
    setHasMadeBranchChoice(true);
    setShowBranchChoice(false);
    if (branchChoice.impactsOutcome && nextChapterId) {
      const targetChapter = getChapter(nextChapterId);
      if (targetChapter) {
        audio.fadeOut();
        setTimeout(() => { setCurrentChapter(targetChapter); }, 600);
      }
    }
  };

  const handleSubmitResponse = () => {
    setShowCommunityResponses(false);
  };

  useEffect(() => {
    if (branchChoice && !hasMadeBranchChoice) {
      const timer = setTimeout(() => { setShowBranchChoice(true); }, 2000);
      return () => clearTimeout(timer);
    }
  }, [currentChapter.id, branchChoice]);

  useEffect(() => {
    setHasMadeBranchChoice(false);
    setShowBranchChoice(false);
  }, [currentChapter.id]);

  const navigateChapter = (direction: 'prev' | 'next') => {
    const currentIndex = chapters.findIndex(ch => ch.id === currentChapter.id);
    let newIndex = direction === 'prev' ? currentIndex - 1 : currentIndex + 1;
    if (newIndex >= 0 && newIndex < chapters.length) {
      audio.fadeOut();
      setTimeout(() => { setCurrentChapter(chapters[newIndex]); }, 500);
    }
  };

  const canGoPrev = chapters.findIndex(ch => ch.id === currentChapter.id) > 0;
  const canGoNext = chapters.findIndex(ch => ch.id === currentChapter.id) < chapters.length - 1;

  // Feature 1: Add reaction at current audio position
  const handleAddReaction = (emoji: ReactionEmoji) => {
    const newReaction: TimedReaction = {
      id: `rxn-${Date.now()}`,
      storyId: storyWorldId,
      chapterId: currentChapter.id,
      emoji,
      timePosition: audio.currentTime,
      timestamp: Date.now(),
    };
    const all = loadReactions();
    const updated = [newReaction, ...all];
    saveReactions(updated);
    setReactions(updated.filter(r => r.storyId === storyWorldId && r.chapterId === currentChapter.id));
    setShowEmojiPicker(false);
  };

  // Feature 2: Handle audio language switch
  const handleLanguageChange = (lang: string) => {
    setLanguage(lang as any);
    if (lang !== audioLang) {
      setTrackSwitching(true);
      // Simulate audio track loading (1.2s)
      setTimeout(() => {
        setAudioLang(lang);
        setTrackSwitching(false);
      }, 1200);
    }
  };

  // Reactions for current chapter (filtered)
  const chapterReactions = reactions.filter(r => r.chapterId === currentChapter.id);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={handleShowControls}
      className="fixed inset-0 bg-black z-50 overflow-hidden"
    >
      {/* Background image */}
      <div className="absolute inset-0">
        <img
          src={currentChapter.imageUrl}
          alt={getText(currentChapter.title, state.language)}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/40 to-black" />
      </div>

      {/* Top controls - auto-hide */}
      <AnimatePresence>
        {controlsVisible && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="absolute top-0 left-0 right-0 z-20"
          >
            <div className="max-w-[428px] mx-auto flex items-center justify-between p-5 pt-8">
              <button
                onClick={onClose}
                className="w-10 h-10 rounded-full bg-black/40 backdrop-blur-md border border-white/10 flex items-center justify-center hover:bg-black/60 transition-colors"
                aria-label="Close"
              >
                <ArrowLeft className="w-5 h-5 text-white" />
              </button>

              <div className="flex gap-2 flex-wrap justify-end">
                <LanguageSwitcher
                  currentLanguage={state.language}
                  onLanguageChange={handleLanguageChange}
                  availableLanguages={['en', 'fr', 'es']}
                />
                <button
                  onClick={onShowIndex}
                  className="w-10 h-10 rounded-full bg-black/40 backdrop-blur-md border border-white/10 flex items-center justify-center hover:bg-black/60 transition-colors"
                  aria-label="Chapter index"
                >
                  <List className="w-5 h-5 text-white" />
                </button>
                <button
                  className="w-10 h-10 rounded-full bg-black/40 backdrop-blur-md border border-white/10 flex items-center justify-center hover:bg-black/60 transition-colors"
                  aria-label="Share"
                >
                  <Share2 className="w-4 h-4 text-white" />
                </button>
                <button
                  className="w-10 h-10 rounded-full bg-black/40 backdrop-blur-md border border-white/10 flex items-center justify-center hover:bg-black/60 transition-colors"
                  aria-label="Bookmark"
                >
                  <Bookmark className="w-4 h-4 text-white" />
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedContextCardIndex(contextCards.length > 0 ? 0 : null);
                  }}
                  disabled={contextCards.length === 0}
                  className="w-10 h-10 rounded-full bg-black/40 backdrop-blur-md border border-white/10 flex items-center justify-center hover:bg-black/60 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  aria-label="Info"
                >
                  <Info className="w-4 h-4 text-white" />
                  {contextCards.length > 0 && (
                    <span className="absolute top-0 right-0 w-2 h-2 bg-blue-400 rounded-full" />
                  )}
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setShowCommunityResponses(true);
                  }}
                  className="w-10 h-10 rounded-full bg-black/40 backdrop-blur-md border border-white/10 flex items-center justify-center hover:bg-black/60 transition-colors"
                  aria-label="Community Responses"
                >
                  <MessageCircle className="w-4 h-4 text-white" />
                  {communityResponses.length > 0 && (
                    <span className="absolute -top-1 -right-1 w-5 h-5 bg-purple-500 rounded-full flex items-center justify-center text-[10px] text-white font-medium">
                      {communityResponses.length}
                    </span>
                  )}
                </button>
                {/* Feature 1: React button */}
                <div className="relative" onClick={e => e.stopPropagation()}>
                  <button
                    onClick={() => setShowEmojiPicker(v => !v)}
                    className={`w-10 h-10 rounded-full backdrop-blur-md border border-white/10 flex items-center justify-center transition-all ${
                      showEmojiPicker ? 'bg-white/20' : 'bg-black/40 hover:bg-black/60'
                    }`}
                    aria-label="Add reaction"
                  >
                    <SmilePlus className="w-4 h-4 text-white" />
                    {chapterReactions.length > 0 && (
                      <span className="absolute -top-1 -right-1 w-5 h-5 bg-rose-500 rounded-full flex items-center justify-center text-[10px] text-white font-medium">
                        {chapterReactions.length}
                      </span>
                    )}
                  </button>
                  <AnimatePresence>
                    {showEmojiPicker && (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.8, y: 8 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.8, y: 8 }}
                        className="absolute right-0 top-12 flex gap-2 bg-black/90 backdrop-blur-xl border border-white/15 rounded-2xl px-3 py-2.5 z-50 shadow-2xl"
                      >
                        {REACTION_EMOJIS.map(emoji => (
                          <button
                            key={emoji}
                            onClick={() => handleAddReaction(emoji)}
                            className="text-xl hover:scale-125 transition-transform"
                            aria-label={`React with ${emoji}`}
                          >
                            {emoji}
                          </button>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Feature 2: Audio language track switching indicator */}
      <AnimatePresence>
        {trackSwitching && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="absolute top-24 left-1/2 -translate-x-1/2 z-30 flex items-center gap-2 px-3 py-1.5 rounded-full bg-black/80 backdrop-blur-md border border-white/10"
          >
            <Globe2 className="w-3 h-3 text-white/60 animate-spin" />
            <span className="text-xs text-white/60 tracking-wide">Loading {LANG_NAMES[state.language]} track...</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Content */}
      <div className="relative z-10 h-full flex flex-col justify-end max-w-[428px] mx-auto">
        <div className="p-6 pb-32 space-y-6">
          {/* Chapter indicator */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-3"
          >
            <span className="text-xs tracking-[0.3em] uppercase text-white/40">
              Chapter {currentChapter.number} of {chapters.length}
            </span>
            <div className="flex gap-1">
              {chapters.map((ch, idx) => (
                <div
                  key={ch.id}
                  className={`h-1 rounded-full transition-all ${
                    idx <= chapters.findIndex(c => c.id === currentChapter.id)
                      ? 'w-4 bg-white/60'
                      : 'w-2 bg-white/20'
                  }`}
                />
              ))}
            </div>
          </motion.div>

          {/* Chapter title */}
          <motion.h1
            key={currentChapter.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-3xl tracking-tight text-white leading-tight"
          >
            {getText(currentChapter.title, state.language)}
          </motion.h1>

          {/* Chapter content */}
          <motion.p
            key={`${currentChapter.id}-content`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-base text-white/70 leading-relaxed"
          >
            {getText(currentChapter.content, state.language)}
          </motion.p>

          {/* Feature 2: Audio language track indicator */}
          <div className="flex items-center gap-2">
            <Mic className="w-3 h-3 text-white/30" strokeWidth={1.5} />
            <span className="text-[10px] tracking-widest uppercase text-white/30">Audio track</span>
            <div className="flex gap-1.5">
              {['en', 'fr', 'es'].map(lang => (
                <span
                  key={lang}
                  className={`text-[9px] tracking-widest px-1.5 py-0.5 rounded uppercase border ${
                    audioLang === lang
                      ? 'bg-white/20 border-white/30 text-white/80'
                      : 'border-white/10 text-white/20'
                  }`}
                >
                  {LANG_LABELS[lang]}
                </span>
              ))}
            </div>
          </div>

          {/* Subtitle captions overlay */}
          <AnimatePresence>
            {showCaptions && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                className="mx-auto max-w-sm"
              >
                <div className="px-4 py-3 rounded-lg bg-black/80 backdrop-blur-md border border-white/10 text-center">
                  <p className="text-sm text-white leading-relaxed font-light">
                    {getText(currentChapter.content, state.language)}
                  </p>
                </div>
                <div className="mt-1.5 flex items-center justify-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-white/60 animate-pulse" />
                  <span className="text-[10px] text-white/40 tracking-widest uppercase">
                    {state.language === 'fr' ? 'Sous-titres' : state.language === 'es' ? 'Subtítulos' : 'Subtitles'}
                  </span>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Context Card Modal */}
      {selectedContextCardIndex !== null && contextCards[selectedContextCardIndex] && (
        <ContextCardModal
          isOpen={true}
          onClose={() => setSelectedContextCardIndex(null)}
          contextCard={contextCards[selectedContextCardIndex]}
        />
      )}

      {/* Community Responses Panel */}
      <CommunityResponsesPanel
        isOpen={showCommunityResponses}
        onClose={() => setShowCommunityResponses(false)}
        chapterId={currentChapter.id}
        chapterTitle={getText(currentChapter.title, state.language)}
        responses={communityResponses.map(r => ({
          id: r.id,
          type: r.responseType,
          content: r.content,
          authorName: r.userName,
          timestamp: r.timestamp,
          language: state.language
        }))}
        onSubmitResponse={handleSubmitResponse}
      />

      {/* Branching Choice Overlay */}
      <AnimatePresence>
        {showBranchChoice && branchChoice && (
          <BranchingChoiceOverlay
            branchChoice={branchChoice}
            onChoose={handleBranchChoice}
          />
        )}
      </AnimatePresence>

      {/* Bottom controls */}
      <div className="absolute bottom-0 left-0 right-0 z-20 bg-gradient-to-t from-black via-black to-transparent">
        <div className="max-w-[428px] mx-auto p-6 space-y-4">
          {/* Feature 1: Reaction dots on progress bar area */}
          {chapterReactions.length > 0 && audio.duration > 0 && (
            <div className="relative h-2 mb-1">
              {chapterReactions.map(rxn => {
                const pct = Math.min(100, (rxn.timePosition / audio.duration) * 100);
                return (
                  <span
                    key={rxn.id}
                    className="absolute -top-1 text-base transform -translate-x-1/2 pointer-events-none select-none"
                    style={{ left: `${pct}%` }}
                    title={`${rxn.emoji} at ${Math.floor(rxn.timePosition)}s`}
                  >
                    {rxn.emoji}
                  </span>
                );
              })}
            </div>
          )}

          {/* Audio player */}
          <AudioPlayer
            isPlaying={audio.isPlaying}
            onTogglePlay={audio.togglePlay}
            volume={audio.volume}
            onVolumeChange={audio.setVolume}
            currentTime={audio.currentTime}
            duration={audio.duration}
            onSeek={audio.seek}
            showCaptions={showCaptions}
            onToggleCaptions={() => setShowCaptions(!showCaptions)}
          />

          {/* Chapter navigation */}
          <div className="flex items-center justify-between pt-2">
            <button
              onClick={() => navigateChapter('prev')}
              disabled={!canGoPrev}
              className={`
                flex items-center gap-2 px-4 py-2 rounded-full transition-all
                ${canGoPrev 
                  ? 'bg-white/10 hover:bg-white/20 text-white' 
                  : 'bg-white/5 text-white/20 cursor-not-allowed'
                }
              `}
            >
              <ChevronLeft className="w-4 h-4" />
              <span className="text-xs tracking-wider uppercase">Prev</span>
            </button>

            <button
              onClick={() => navigateChapter('next')}
              disabled={!canGoNext}
              className={`
                flex items-center gap-2 px-4 py-2 rounded-full transition-all
                ${canGoNext 
                  ? 'bg-white/10 hover:bg-white/20 text-white' 
                  : 'bg-white/5 text-white/20 cursor-not-allowed'
                }
              `}
            >
              <span className="text-xs tracking-wider uppercase">Next</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
