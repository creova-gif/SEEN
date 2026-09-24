/**
 * LIBRARY SCREEN
 * SEEN by CREOVA
 * 
 * Shows ONLY user-owned content (saved, in-progress, completed)
 * NO default or promotional content - empty states only
 */

import { motion } from "motion/react";
import { useState } from "react";
import { NavigationBar } from "./NavigationBar";
import { BottomNav } from "./seen/BottomNav";
import { ConfirmDialog } from "./seen/overlays";
import { CircularProgress } from "./seen/display";
import { toast } from "sonner";
import { ContentCard } from "./ContentCard";
import { EmptyState } from "./EmptyState";
import { Play, Bookmark, Check, Trash2, Home, Compass, Library, User } from "lucide-react";
import { useStoryState } from "../contexts/StoryStateContext";
import { getLibraryStories } from "../data/storyService";
import { getStoryWorldById, type Language } from "../data/storyDatabase";
import { getSavedIds } from "../data/userDataService";
import { StoryRow } from "./seen/StoryRow";

interface LibraryScreenProps {
  onStoryClick: (contentId: string) => void;
  onNavigate: (screen: string) => void;
  onSearch?: () => void;
}

type LibraryTab = 'inProgress' | 'completed' | 'saved';

/**
 * LIBRARY SECTION - USER-OWNED CONTENT ONLY
 * 
 * Data Flow:
 * 1. Load user progress from StoryStateContext
 * 2. Query actual story content with multilingual support
 * 3. Display with resume/completion info
 * 4. Show empty states if no content
 */
export function LibraryScreen({
  onStoryClick,
  onNavigate,
  onSearch
}: LibraryScreenProps) {
  const [activeTab, setActiveTab] = useState<LibraryTab>('inProgress');
  const { state, removeProgress } = useStoryState();
  // Only bookmarks that resolve to a real story (older demo data used placeholder ids).
  const savedIds = getSavedIds().filter(id => getStoryWorldById(id));
  const [pendingRemove, setPendingRemove] = useState<{ id: string; title: string } | null>(null);

  const handleDelete = (contentId: string, kind: 'progress') => {
    if (kind === 'progress') {
      removeProgress(contentId);
    }
  };

  // Get library data with current language
  const libraryData = getLibraryStories(
    state.progressSnapshots,
    state.language as Language
  );
  
  console.log(`[LibraryScreen] In progress: ${libraryData.inProgress.length}, Completed: ${libraryData.completed.length}`);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4 }}
      className="min-h-screen bg-black"
    >
      <NavigationBar onSearch={onSearch} />

      {/* Main Content */}
      <main className="pt-20 pb-24 px-5 max-w-[428px] mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-8"
        >
          <h1 className="text-2xl font-bold text-white mb-2">Library</h1>
          <p className="text-sm text-white/60">Your saved and in-progress content</p>
        </motion.div>

        {/* Presence Indicators / Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="space-y-3 mb-8"
        >
          {/* In Progress */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3, duration: 0.8 }}
            onClick={() => setActiveTab('inProgress')}
            role="button"
            tabIndex={0}
            aria-pressed={activeTab === 'inProgress'}
            onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && (e.preventDefault(), setActiveTab('inProgress'))}
            className={`flex items-center gap-4 min-h-11 pl-3 border-l-2 group cursor-pointer transition-colors duration-300 ${
              activeTab === 'inProgress' ? 'border-white' : 'border-transparent hover:border-white/30'
            }`}
          >
            <div className="relative">
              <Play className="w-5 h-5 text-blue-200/70" />
              {activeTab === 'inProgress' && (
                <div className="absolute inset-0 bg-blue-400/20 blur-xl" />
              )}
              <div className="absolute inset-0 bg-blue-400/20 blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-light text-white/90 tabular-nums">
                {libraryData.inProgress.length}
              </span>
              <span className="text-sm text-white/55 font-light tracking-wide">
                {libraryData.inProgress.length === 1 ? 'Story' : 'Stories'} in progress
              </span>
            </div>
          </motion.div>

          {/* Completed */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5, duration: 0.8 }}
            onClick={() => setActiveTab('completed')}
            role="button"
            tabIndex={0}
            aria-pressed={activeTab === 'completed'}
            onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && (e.preventDefault(), setActiveTab('completed'))}
            className={`flex items-center gap-4 min-h-11 pl-3 border-l-2 group cursor-pointer transition-colors duration-300 ${
              activeTab === 'completed' ? 'border-white' : 'border-transparent hover:border-white/30'
            }`}
          >
            <div className="relative">
              <Check className="w-5 h-5 text-emerald-200/70" />
              {activeTab === 'completed' && (
                <div className="absolute inset-0 bg-emerald-400/20 blur-xl" />
              )}
              <div className="absolute inset-0 bg-emerald-400/20 blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-light text-white/90 tabular-nums">
                {libraryData.completed.length}
              </span>
              <span className="text-sm text-white/55 font-light tracking-wide">
                {libraryData.completed.length === 1 ? 'Journey' : 'Journeys'} complete
              </span>
            </div>
          </motion.div>

          {/* Saved */}
          <div
            onClick={() => setActiveTab('saved')}
            role="button"
            tabIndex={0}
            aria-pressed={activeTab === 'saved'}
            onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && (e.preventDefault(), setActiveTab('saved'))}
            className={`flex items-center gap-4 min-h-11 pl-3 border-l-2 cursor-pointer transition-colors duration-300 ${
              activeTab === 'saved' ? 'border-white' : 'border-transparent hover:border-white/30'
            }`}
          >
            <Bookmark className="w-5 h-5 text-violet-200/70" aria-hidden />
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-light text-white/90 tabular-nums">{savedIds.length}</span>
              <span className="text-sm text-white/55 font-light tracking-wide">Saved {savedIds.length === 1 ? 'story' : 'stories'}</span>
            </div>
          </div>
        </motion.div>

        {/* Saved Tab */}
        {activeTab === 'saved' && (
          <div>
            {savedIds.length > 0 ? (
              <ul className="space-y-3" aria-label="Saved stories">
                {savedIds.map(id => (
                  <li key={id}>
                    <StoryRow storyId={id} language={state.language as Language} onOpen={onStoryClick} />
                  </li>
                ))}
              </ul>
            ) : (
              <EmptyState
                icon="Bookmark"
                title="Nothing saved yet"
                message="Tap the bookmark while reading to keep a story here."
                actionLabel="Explore Stories"
                onAction={() => onNavigate('explore')}
              />
            )}
          </div>
        )}

        {/* In Progress Tab */}
        {activeTab === 'inProgress' && (
          <motion.div
            key="inProgress"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            {libraryData.inProgress.length > 0 ? (
              <div className="space-y-4">
                {libraryData.inProgress.map(({ content, progress }) => (
                  <div key={content.id} className="relative group">
                    <ContentCard
                      id={content.id}
                      title={content.title}
                      creator={content.creator}
                      duration={content.duration}
                      imageUrl={content.mediaSource}
                      typeLabel={content.type}
                      badge={<CircularProgress value={progress.progressPercentage} size={30} label={`${progress.progressPercentage}% read`} />}
                      aspect="landscape"
                      onSelect={onStoryClick}
                    />
                    <button
                      type="button"
                      onClick={() => setPendingRemove({ id: content.id, title: content.title })}
                      className="absolute bottom-3 right-3 z-20 w-11 h-11 rounded-full backdrop-blur-sm flex items-center justify-center bg-black/60 text-white/80 border border-white/15 hover:bg-black/80"
                      aria-label={`Remove ${content.title} from in progress`}
                    >
                      <Trash2 className="w-4 h-4" aria-hidden />
                    </button>
                  
                  </div>
                ))}
              </div>
            ) : (
              <EmptyState
                icon="Play"
                title="No stories in progress"
                message="Start exploring to see your in-progress content here."
                actionLabel="Explore Stories"
                onAction={() => onNavigate('explore')}
              />
            )}
          </motion.div>
        )}

        {/* Completed Tab */}
        {activeTab === 'completed' && (
          <motion.div
            key="completed"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            {libraryData.completed.length > 0 ? (
              <div className="space-y-4">
                {libraryData.completed.map(({ content, progress }) => (
                  <div key={content.id} className="relative group">
                    <ContentCard
                      id={content.id}
                      title={content.title}
                      creator={content.creator}
                      duration={content.duration}
                      imageUrl={content.mediaSource}
                      typeLabel={content.type}
                      badge="✓ Completed"
                      aspect="landscape"
                      onSelect={onStoryClick}
                    />
                  </div>
                ))}
              </div>
            ) : (
              <EmptyState
                icon="Check"
                title="No completed content"
                message="Content you finish will appear here."
                actionLabel="Start Exploring"
                onAction={() => onNavigate('explore')}
              />
            )}
          </motion.div>
        )}
      </main>

      {/* Bottom Navigation */}
      <ConfirmDialog
        open={pendingRemove !== null}
        onOpenChange={open => !open && setPendingRemove(null)}
        title="Remove from In progress?"
        description={pendingRemove ? `“${pendingRemove.title}” will leave your library and your reading position will be forgotten. The story itself stays on SEEN.` : ""}
        confirmLabel="Remove"
        onConfirm={() => {
          if (!pendingRemove) return;
          handleDelete(pendingRemove.id, 'progress');
          toast.success("Removed from your library");
        }}
      />

      <BottomNav onNavigate={onNavigate} activeTab="library" />
    </motion.div>
  );
}
