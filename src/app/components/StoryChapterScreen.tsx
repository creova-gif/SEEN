import { motion, AnimatePresence } from "motion/react";
import { ArrowLeft, ChevronLeft, ChevronRight, List, Share2, Bookmark, Info, MessageCircle } from "lucide-react";
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

export function StoryChapterScreen({ 
  onClose, 
  onShowIndex,
  storyWorldId = 'midnight-resonance'
}: StoryChapterScreenProps) {
  const { state, navigateToChapter, updateAudioState, saveProgress, setLanguage, recordBranchChoice } = useStoryState();
  const chapters = getChaptersForStory(storyWorldId);
  
  const [currentChapter, setCurrentChapter] = useState<Chapter>(() => {
    // Resume from saved progress or start at first chapter
    const savedChapterId = state.currentChapterId;
    return chapters.find(ch => ch.id === savedChapterId) || chapters[0];
  });
  
  const [showCaptions, setShowCaptions] = useState(state.accessibilityPreferences.captionsEnabled);
  const [controlsVisible, setControlsVisible] = useState(true);
  
  // NEW: State for context cards, community responses, and branching
  const [selectedContextCardIndex, setSelectedContextCardIndex] = useState<number | null>(null);
  const [showCommunityResponses, setShowCommunityResponses] = useState(false);
  const [showBranchChoice, setShowBranchChoice] = useState(false);
  const [hasMadeBranchChoice, setHasMadeBranchChoice] = useState(false);
  
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
  
  // Get context cards and responses for current chapter
  const contextCards = getContextCardsForChapter(currentChapter.id);
  const communityResponses = getResponsesForChapter(currentChapter.id);
  const branchChoice = currentChapter.branchChoices?.[0]; // Get first branch choice if available
  
  const audio = useAudioPlayer({ 
    src: currentChapter.audioSrc,
    autoPlay: false 
  });

  // Sync audio state with global state
  useEffect(() => {
    updateAudioState({
      isPlaying: audio.isPlaying,
      playbackPosition: audio.currentTime
    });
  }, [audio.isPlaying, audio.currentTime]);

  // Auto-hide controls after 3 seconds of inactivity
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
  };

  // NEW: Handler for branching choice
  const handleBranchChoice = (optionId: string, nextChapterId?: string) => {
    if (!branchChoice) return;
    
    // Record the choice
    recordBranchChoice(currentChapter.id, branchChoice.id, optionId);
    setHasMadeBranchChoice(true);
    setShowBranchChoice(false);
    
    // If this is a hard branch (impacts outcome), navigate to specific chapter
    if (branchChoice.impactsOutcome && nextChapterId) {
      const targetChapter = getChapter(nextChapterId);
      if (targetChapter) {
        audio.fadeOut();
        setTimeout(() => {
          setCurrentChapter(targetChapter);
        }, 600);
      }
    }
    // For soft branches, just continue normally
  };

  // NEW: Handler for community response submission
  const handleSubmitResponse = () => {
    // This would open the submit response modal
    // For now, just close the panel
    setShowCommunityResponses(false);
  };

  // Show branch choice automatically when chapter loads (if not already made)
  useEffect(() => {
    if (branchChoice && !hasMadeBranchChoice) {
      // Show branch choice after a brief delay
      const timer = setTimeout(() => {
        setShowBranchChoice(true);
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [currentChapter.id, branchChoice]);

  // Reset branch choice state when chapter changes
  useEffect(() => {
    setHasMadeBranchChoice(false);
    setShowBranchChoice(false);
  }, [currentChapter.id]);

  const navigateChapter = (direction: 'prev' | 'next') => {
    const currentIndex = chapters.findIndex(ch => ch.id === currentChapter.id);
    let newIndex = direction === 'prev' ? currentIndex - 1 : currentIndex + 1;
    
    if (newIndex >= 0 && newIndex < chapters.length) {
      // Cinematic transition: fade out audio
      audio.fadeOut();
      
      // Wait for fade, then switch chapter
      setTimeout(() => {
        setCurrentChapter(chapters[newIndex]);
      }, 500);
    }
  };

  const canGoPrev = chapters.findIndex(ch => ch.id === currentChapter.id) > 0;
  const canGoNext = chapters.findIndex(ch => ch.id === currentChapter.id) < chapters.length - 1;

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

              <div className="flex gap-2">
                <LanguageSwitcher
                  currentLanguage={state.language}
                  onLanguageChange={setLanguage}
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
                  onClick={() => setSelectedContextCardIndex(contextCards.length > 0 ? 0 : null)}
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
                  onClick={() => setShowCommunityResponses(true)}
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
              </div>
            </div>
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
            {/* Soft progress indicator */}
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

          {/* Captions overlay */}
          <AnimatePresence>
            {showCaptions && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                className="p-4 rounded-xl bg-black/60 backdrop-blur-md border border-white/10"
              >
                <p className="text-sm text-white/90 leading-relaxed">
                  [Ambient sounds: distant city traffic, wind through buildings, occasional footsteps]
                </p>
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