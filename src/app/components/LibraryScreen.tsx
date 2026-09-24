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
import { ContentCard } from "./ContentCard";
import { EmptyState } from "./EmptyState";
import { Play, Bookmark, Check, Trash2, Home, Compass, Library, User } from "lucide-react";
import { useStoryState } from "../contexts/StoryStateContext";
import { getLibraryStories } from "../data/storyService";
import type { Language } from "../data/storyDatabase";

interface LibraryScreenProps {
  onStoryClick: (contentId: string) => void;
  onNavigate: (screen: string) => void;
  onSearch?: () => void;
}

type LibraryTab = 'inProgress' | 'completed';

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
  const [pendingRemove, setPendingRemove] = useState<string | null>(null);

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
            className={`flex items-center gap-4 min-h-11 group cursor-pointer transition-opacity duration-300 ${
              activeTab === 'inProgress' ? 'opacity-100' : 'opacity-40 hover:opacity-70'
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
              <span className="text-sm text-white/40 font-light tracking-wide">
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
            className={`flex items-center gap-4 min-h-11 group cursor-pointer transition-opacity duration-300 ${
              activeTab === 'completed' ? 'opacity-100' : 'opacity-40 hover:opacity-70'
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
              <span className="text-sm text-white/40 font-light tracking-wide">
                {libraryData.completed.length === 1 ? 'Journey' : 'Journeys'} complete
              </span>
            </div>
          </motion.div>
        </motion.div>

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
                      badge={`${progress.progressPercentage}%`}
                      aspect="landscape"
                      onSelect={onStoryClick}
                    />
                    <button
                      type="button"
                      onClick={() => {
                        if (pendingRemove === content.id) {
                          handleDelete(content.id, 'progress');
                          setPendingRemove(null);
                        } else {
                          setPendingRemove(content.id);
                        }
                      }}
                      onBlur={() => setPendingRemove(null)}
                      className={`absolute bottom-3 right-3 z-20 min-h-9 px-3 rounded-full backdrop-blur-sm flex items-center gap-2 text-[11px] tracking-wider uppercase transition-colors ${
                        pendingRemove === content.id ? 'bg-red-600 text-white' : 'bg-black/60 text-white/70 border border-white/15'
                      }`}
                      aria-label={pendingRemove === content.id ? `Confirm remove ${content.title}` : `Remove ${content.title} from in progress`}
                    >
                      <Trash2 className="w-3.5 h-3.5" aria-hidden />
                      {pendingRemove === content.id ? 'Tap to confirm' : null}
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
      <BottomNav onNavigate={onNavigate} activeTab="library" />
    </motion.div>
  );
}

// Bottom Navigation Component
function BottomNav({ 
  onNavigate, 
  activeTab 
}: { 
  onNavigate: (screen: string) => void;
  activeTab: string;
}) {
  return (
    <nav aria-label="Main" className="fixed bottom-0 left-0 right-0 backdrop-blur-xl bg-black/60 border-t border-white/5 z-50 pointer-events-auto">
      <div className="max-w-[428px] mx-auto px-5 py-4 flex justify-around">
        <button
          type="button"
          onClick={() => onNavigate("for-you")}
          aria-current={activeTab === 'for-you' ? 'page' : undefined}
          className={`flex flex-col min-w-11 min-h-11 justify-center items-center gap-1.5 transition-all duration-300 pointer-events-auto group ${
            activeTab === 'for-you' ? 'text-white' : 'text-white/40 hover:text-white/60'
          }`}
        >
          <Home 
            className={`w-5 h-5 transition-all duration-300 ${
              activeTab === 'for-you' 
                ? 'drop-shadow-[0_0_8px_rgba(255,255,255,0.5)]' 
                : 'group-hover:drop-shadow-[0_0_4px_rgba(255,255,255,0.2)]'
            }`}
            strokeWidth={activeTab === 'for-you' ? 2 : 1.5}
          />
          <span className={`text-[10px] tracking-widest uppercase transition-all duration-300 ${
            activeTab === 'for-you' ? 'font-medium' : 'font-light'
          }`}>
            For You
          </span>
        </button>
        <button
          type="button"
          onClick={() => onNavigate("explore")}
          aria-current={activeTab === 'explore' ? 'page' : undefined}
          className={`flex flex-col min-w-11 min-h-11 justify-center items-center gap-1.5 transition-all duration-300 pointer-events-auto group ${
            activeTab === 'explore' ? 'text-white' : 'text-white/40 hover:text-white/60'
          }`}
        >
          <Compass 
            className={`w-5 h-5 transition-all duration-300 ${
              activeTab === 'explore' 
                ? 'drop-shadow-[0_0_8px_rgba(255,255,255,0.5)]' 
                : 'group-hover:drop-shadow-[0_0_4px_rgba(255,255,255,0.2)]'
            }`}
            strokeWidth={activeTab === 'explore' ? 2 : 1.5}
          />
          <span className={`text-[10px] tracking-widest uppercase transition-all duration-300 ${
            activeTab === 'explore' ? 'font-medium' : 'font-light'
          }`}>
            Explore
          </span>
        </button>
        <button
          type="button"
          onClick={() => onNavigate("library")}
          aria-current={activeTab === 'library' ? 'page' : undefined}
          className={`flex flex-col min-w-11 min-h-11 justify-center items-center gap-1.5 transition-all duration-300 pointer-events-auto group ${
            activeTab === 'library' ? 'text-white' : 'text-white/40 hover:text-white/60'
          }`}
        >
          <Library 
            className={`w-5 h-5 transition-all duration-300 ${
              activeTab === 'library' 
                ? 'drop-shadow-[0_0_8px_rgba(255,255,255,0.5)]' 
                : 'group-hover:drop-shadow-[0_0_4px_rgba(255,255,255,0.2)]'
            }`}
            strokeWidth={activeTab === 'library' ? 2 : 1.5}
          />
          <span className={`text-[10px] tracking-widest uppercase transition-all duration-300 ${
            activeTab === 'library' ? 'font-medium' : 'font-light'
          }`}>
            Library
          </span>
        </button>
        <button
          type="button"
          onClick={() => onNavigate("profile")}
          aria-current={activeTab === 'profile' ? 'page' : undefined}
          className={`flex flex-col min-w-11 min-h-11 justify-center items-center gap-1.5 transition-all duration-300 pointer-events-auto group ${
            activeTab === 'profile' ? 'text-white' : 'text-white/40 hover:text-white/60'
          }`}
        >
          <User 
            className={`w-5 h-5 transition-all duration-300 ${
              activeTab === 'profile' 
                ? 'drop-shadow-[0_0_8px_rgba(255,255,255,0.5)]' 
                : 'group-hover:drop-shadow-[0_0_4px_rgba(255,255,255,0.2)]'
            }`}
            strokeWidth={activeTab === 'profile' ? 2 : 1.5}
          />
          <span className={`text-[10px] tracking-widest uppercase transition-all duration-300 ${
            activeTab === 'profile' ? 'font-medium' : 'font-light'
          }`}>
            Profile
          </span>
        </button>
      </div>
    </nav>
  );
}