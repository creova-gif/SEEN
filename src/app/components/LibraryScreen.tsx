/**
 * LIBRARY SCREEN
 * SEEN by CREOVA
 * 
 * Shows ONLY user-owned content (saved, in-progress, completed)
 * + Collections (Feature 3) + Downloads (Feature 4)
 * NO default or promotional content - empty states only
 */

import { motion, AnimatePresence } from "motion/react";
import { useState } from "react";
import { NavigationBar } from "./NavigationBar";
import { ContentCard } from "./ContentCard";
import { EmptyState } from "./EmptyState";
import { Play, Bookmark, Check, Trash2, Home, Compass, Library, User, Download, FolderOpen, FolderPlus, Clock, Shield } from "lucide-react";
import { useStoryState } from "../contexts/StoryStateContext";
import { getLibraryStories } from "../data/storyService";
import type { Language } from "../data/storyDatabase";
import { loadCollections, loadDownloads, type StoryCollection, type DownloadedStory } from "./FeaturedStoryPreview";

function saveCollections(c: StoryCollection[]) {
  localStorage.setItem('seen_collections', JSON.stringify(c));
}
function saveDownloads(d: DownloadedStory[]) {
  localStorage.setItem('seen_downloads', JSON.stringify(d));
}
function daysLeft(expiresAt: number) {
  return Math.max(0, Math.ceil((expiresAt - Date.now()) / (1000 * 60 * 60 * 24)));
}

interface LibraryScreenProps {
  onStoryClick: (contentId: string) => void;
  onNavigate: (screen: string) => void;
}

type LibraryTab = 'inProgress' | 'completed' | 'collections' | 'downloads';

export function LibraryScreen({ 
  onStoryClick, 
  onNavigate 
}: LibraryScreenProps) {
  const [activeTab, setActiveTab] = useState<LibraryTab>('inProgress');
  const { state } = useStoryState();

  // Feature 3: Collections
  const [collections, setCollections] = useState<StoryCollection[]>(loadCollections);
  // Feature 4: Downloads
  const [downloads, setDownloads] = useState<DownloadedStory[]>(loadDownloads);

  // Get library data with current language
  const libraryData = getLibraryStories(
    state.progressSnapshots,
    state.language as Language
  );

  console.log(`[LibraryScreen] In progress: ${libraryData.inProgress.length}, Completed: ${libraryData.completed.length}`);

  // Feature 3: Delete a collection
  const handleDeleteCollection = (id: string) => {
    const updated = collections.filter(c => c.id !== id);
    saveCollections(updated);
    setCollections(updated);
  };

  // Feature 4: Delete a download
  const handleDeleteDownload = (id: string) => {
    const updated = downloads.filter(d => d.id !== id);
    saveDownloads(updated);
    setDownloads(updated);
  };

  const handleDelete = (contentId: string, type: 'progress') => {
    // Just a placeholder - actual deletion would be through context
    console.log(`[LibraryScreen] Remove from ${type}: ${contentId}`);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4 }}
      className="min-h-screen bg-black"
    >
      <NavigationBar />

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
            className={`flex items-center gap-4 group cursor-pointer transition-opacity duration-300 ${
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
            className={`flex items-center gap-4 group cursor-pointer transition-opacity duration-300 ${
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

          {/* Feature 3: Collections */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.6, duration: 0.8 }}
            onClick={() => setActiveTab('collections')}
            className={`flex items-center gap-4 group cursor-pointer transition-opacity duration-300 ${
              activeTab === 'collections' ? 'opacity-100' : 'opacity-40 hover:opacity-70'
            }`}
          >
            <div className="relative">
              <Bookmark className="w-5 h-5 text-violet-200/70" />
              {activeTab === 'collections' && (
                <div className="absolute inset-0 bg-violet-400/20 blur-xl" />
              )}
              <div className="absolute inset-0 bg-violet-400/20 blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-light text-white/90 tabular-nums">
                {collections.length}
              </span>
              <span className="text-sm text-white/40 font-light tracking-wide">
                {collections.length === 1 ? 'Collection' : 'Collections'} curated
              </span>
            </div>
          </motion.div>

          {/* Feature 4: Downloads */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.7, duration: 0.8 }}
            onClick={() => setActiveTab('downloads')}
            className={`flex items-center gap-4 group cursor-pointer transition-opacity duration-300 ${
              activeTab === 'downloads' ? 'opacity-100' : 'opacity-40 hover:opacity-70'
            }`}
          >
            <div className="relative">
              <Download className="w-5 h-5 text-amber-200/70" />
              {activeTab === 'downloads' && (
                <div className="absolute inset-0 bg-amber-400/20 blur-xl" />
              )}
              <div className="absolute inset-0 bg-amber-400/20 blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-light text-white/90 tabular-nums">
                {downloads.length}
              </span>
              <span className="text-sm text-white/40 font-light tracking-wide">
                {downloads.length === 1 ? 'Story' : 'Stories'} saved offline
              </span>
            </div>
          </motion.div>
        </motion.div>

        {/* In Progress Tab */}
        <AnimatePresence mode="wait">
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
                      <div onClick={() => onStoryClick(content.id)} className="cursor-pointer">
                        <ContentCard
                          id={content.id}
                          title={content.title}
                          creator={content.description}
                          imageUrl={content.mediaSource}
                          category={content.creator}
                          onSelect={onStoryClick}
                        />
                        <div className="absolute top-3 right-3 px-2 py-1 bg-purple-600/80 backdrop-blur-sm rounded text-xs text-white font-medium">
                          {progress.progressPercentage}%
                        </div>
                        <div className="absolute top-3 left-3 px-2 py-1 bg-black/60 backdrop-blur-sm rounded text-xs text-white/90 uppercase tracking-wider border border-white/20">
                          {content.type}
                        </div>
                      </div>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDelete(content.id, 'progress');
                        }}
                        className="absolute bottom-3 right-3 p-2 bg-red-600/80 backdrop-blur-sm rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                        title="Remove from in-progress"
                      >
                        <Trash2 className="w-4 h-4 text-white" />
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
                      <div onClick={() => onStoryClick(content.id)} className="cursor-pointer">
                        <ContentCard
                          id={content.id}
                          title={content.title}
                          creator={content.description}
                          imageUrl={content.mediaSource}
                          category={content.creator}
                          onSelect={onStoryClick}
                        />
                        <div className="absolute top-3 right-3 px-2 py-1 bg-green-600/80 backdrop-blur-sm rounded text-xs text-white font-medium">
                          ✓ Completed
                        </div>
                        <div className="absolute top-3 left-3 px-2 py-1 bg-black/60 backdrop-blur-sm rounded text-xs text-white/90 uppercase tracking-wider border border-white/20">
                          {content.type}
                        </div>
                      </div>
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

          {/* Feature 3: Collections Tab */}
          {activeTab === 'collections' && (
            <motion.div
              key="collections"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              {collections.length > 0 ? (
                <div className="space-y-3">
                  {collections.map(col => (
                    <div
                      key={col.id}
                      className="flex items-center justify-between p-4 border border-white/10 bg-white/[0.02] rounded-xl group"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg border border-white/10 bg-white/5 flex items-center justify-center">
                          <FolderOpen className="w-5 h-5 text-violet-300/70" strokeWidth={1.5} />
                        </div>
                        <div>
                          <div className="text-sm font-light tracking-wide">{col.name}</div>
                          <div className="text-xs text-white/40 mt-0.5">
                            {col.storyIds.length} {col.storyIds.length === 1 ? 'story' : 'stories'}
                          </div>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleDeleteCollection(col.id)}
                        className="p-2 rounded-full bg-red-600/0 hover:bg-red-600/20 opacity-0 group-hover:opacity-100 transition-all"
                        aria-label="Delete collection"
                      >
                        <Trash2 className="w-3.5 h-3.5 text-red-400" />
                      </button>
                    </div>
                  ))}
                  <p className="text-xs text-white/30 text-center pt-2">
                    Tap the Bookmark icon on any story to add it to a collection
                  </p>
                </div>
              ) : (
                <div className="text-center py-16 space-y-3">
                  <FolderPlus className="w-8 h-8 text-white/20 mx-auto" strokeWidth={1} />
                  <p className="text-sm text-white/40">No collections yet</p>
                  <p className="text-xs text-white/25 max-w-[220px] mx-auto">Tap the bookmark icon on any story to save it to a collection</p>
                  <button
                    type="button"
                    onClick={() => onNavigate('explore')}
                    className="mt-4 px-5 py-2.5 rounded-full border border-white/10 bg-white/5 text-xs tracking-wider uppercase text-white/60 hover:text-white hover:bg-white/10 transition-all"
                  >
                    Browse Stories
                  </button>
                </div>
              )}
            </motion.div>
          )}

          {/* Feature 4: Downloads Tab */}
          {activeTab === 'downloads' && (
            <motion.div
              key="downloads"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              {downloads.length > 0 ? (
                <div className="space-y-4">
                  {downloads.map(dl => {
                    const days = daysLeft(dl.expiresAt);
                    return (
                      <div key={dl.id} className="relative group">
                        <div
                          onClick={() => onStoryClick(dl.id)}
                          className="cursor-pointer flex items-center gap-3 p-3 border border-white/10 bg-white/[0.02] rounded-xl"
                        >
                          <img
                            src={dl.coverImage}
                            alt={dl.title}
                            className="w-16 h-16 rounded-lg object-cover flex-shrink-0 border border-white/10"
                          />
                          <div className="flex-1 min-w-0">
                            <div className="text-sm font-light tracking-wide truncate">{dl.title}</div>
                            <div className="text-xs text-white/50 mt-0.5">{dl.creator}</div>
                            <div className="mt-2 flex items-center gap-1.5">
                              <Clock className="w-3 h-3 text-amber-400/70" />
                              <span className={`text-[10px] tracking-wide ${days <= 3 ? 'text-red-400' : 'text-white/40'}`}>
                                {days === 0 ? 'Expires today' : `${days} day${days !== 1 ? 's' : ''} left`}
                              </span>
                              <span className="w-1 h-1 rounded-full bg-white/20 mx-1" />
                              <span className="text-[10px] text-white/30 uppercase tracking-wider">{dl.typeLabel}</span>
                            </div>
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteDownload(dl.id);
                          }}
                          className="absolute top-3 right-3 p-2 bg-red-600/80 backdrop-blur-sm rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                          aria-label="Remove download"
                        >
                          <Trash2 className="w-3.5 h-3.5 text-white" />
                        </button>
                      </div>
                    );
                  })}
                  <p className="text-xs text-white/25 text-center pt-2">
                    Downloads expire 30 days after saving · PIPEDA compliant
                  </p>
                </div>
              ) : (
                <div className="text-center py-16 space-y-3">
                  <Download className="w-8 h-8 text-white/20 mx-auto" strokeWidth={1} />
                  <p className="text-sm text-white/40">No offline stories</p>
                  <p className="text-xs text-white/25 max-w-[220px] mx-auto">Tap the download icon on any story to save it for offline listening — available for 30 days</p>
                  <button
                    type="button"
                    onClick={() => onNavigate('explore')}
                    className="mt-4 px-5 py-2.5 rounded-full border border-white/10 bg-white/5 text-xs tracking-wider uppercase text-white/60 hover:text-white hover:bg-white/10 transition-all"
                  >
                    Browse Stories
                  </button>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
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
  const { state } = useStoryState();
  const isModerator = state.userRole === 'moderator' || state.userRole === 'admin';
  return (
    <nav className="fixed bottom-0 left-0 right-0 backdrop-blur-xl bg-black/60 border-t border-white/5 z-50 pointer-events-auto">
      <div className="max-w-[428px] mx-auto px-5 py-4 flex justify-around">
        <button
          type="button"
          onClick={() => onNavigate("for-you")}
          className={`flex flex-col items-center gap-1.5 transition-all duration-300 pointer-events-auto group ${
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
          className={`flex flex-col items-center gap-1.5 transition-all duration-300 pointer-events-auto group ${
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
          className={`flex flex-col items-center gap-1.5 transition-all duration-300 pointer-events-auto group ${
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
        {isModerator && (
          <button
            type="button"
            onClick={() => onNavigate("moderation-queue")}
            className={`flex flex-col items-center gap-1.5 transition-all duration-300 pointer-events-auto group ${
              activeTab === 'moderation-queue' ? 'text-amber-400' : 'text-amber-500/50 hover:text-amber-400/70'
            }`}
          >
            <div className="relative">
              <Shield 
                className={`w-5 h-5 transition-all duration-300 ${
                  activeTab === 'moderation-queue' 
                    ? 'drop-shadow-[0_0_8px_rgba(251,191,36,0.6)]' 
                    : 'group-hover:drop-shadow-[0_0_4px_rgba(251,191,36,0.3)]'
                }`}
                strokeWidth={activeTab === 'moderation-queue' ? 2 : 1.5}
              />
              <div className="absolute -top-0.5 -right-1 w-1.5 h-1.5 rounded-full bg-amber-400" />
            </div>
            <span className={`text-[10px] tracking-widest uppercase transition-all duration-300 ${
              activeTab === 'moderation-queue' ? 'font-medium' : 'font-light'
            }`}>
              Queue
            </span>
          </button>
        )}
        <button
          type="button"
          onClick={() => onNavigate("profile")}
          className={`flex flex-col items-center gap-1.5 transition-all duration-300 pointer-events-auto group ${
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
            activeTab === 'library' ? 'font-medium' : 'font-light'
          }`}>
            Profile
          </span>
        </button>
      </div>
    </nav>
  );
}
