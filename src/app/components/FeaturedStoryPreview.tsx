import { motion, AnimatePresence } from "motion/react";
import { ArrowLeft, Play, Volume2, Share2, Bookmark, Check, BookmarkCheck, Download, CheckCircle2, FolderPlus, Plus, X } from "lucide-react";
import { useState, useCallback } from "react";
import { useStoryState } from "../contexts/StoryStateContext";
import { getStoryWorldData } from "../data/storyService";
import { getContentById } from "../data/database";
import type { Language } from "../data/storyDatabase";

interface FeaturedStoryPreviewProps {
  onClose: () => void;
  onEnterStory?: () => void;
}

const CONTENT_TYPE_LABELS: Record<string, string> = {
  music: 'Music',
  story: 'Story',
  film: 'Film',
  collection: 'Collection',
  archive: 'Archive',
};

// Feature 3: Collections helpers
export interface StoryCollection {
  id: string;
  name: string;
  storyIds: string[];
  createdAt: number;
}

const COLLECTIONS_KEY = 'seen_collections';
const DOWNLOADS_KEY = 'seen_downloads';

export function loadCollections(): StoryCollection[] {
  try { return JSON.parse(localStorage.getItem(COLLECTIONS_KEY) || '[]'); } catch { return []; }
}
function saveCollections(c: StoryCollection[]) {
  localStorage.setItem(COLLECTIONS_KEY, JSON.stringify(c));
}

// Feature 4: Downloads helpers
export interface DownloadedStory {
  id: string;
  title: string;
  creator: string;
  coverImage: string;
  typeLabel: string;
  downloadedAt: number;
  expiresAt: number;
}

export function loadDownloads(): DownloadedStory[] {
  try { return JSON.parse(localStorage.getItem(DOWNLOADS_KEY) || '[]'); } catch { return []; }
}
function saveDownloads(d: DownloadedStory[]) {
  localStorage.setItem(DOWNLOADS_KEY, JSON.stringify(d));
}
function daysUntilExpiry(expiresAt: number) {
  return Math.max(0, Math.ceil((expiresAt - Date.now()) / (1000 * 60 * 60 * 24)));
}

export function FeaturedStoryPreview({ onClose, onEnterStory }: FeaturedStoryPreviewProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [shareStatus, setShareStatus] = useState<'idle' | 'copied'>('idle');
  const { state } = useStoryState();

  // Feature 3: Collection state
  const [collections, setCollections] = useState<StoryCollection[]>(loadCollections);
  const [showCollectionSheet, setShowCollectionSheet] = useState(false);
  const [newCollectionName, setNewCollectionName] = useState('');
  const [bookmarkStatus, setBookmarkStatus] = useState<'idle' | 'saved'>('idle');

  // Feature 4: Download state
  const [downloadStatus, setDownloadStatus] = useState<'idle' | 'downloading' | 'done'>('idle');

  // Try storyDatabase first, then fall back to ALL_CONTENT database
  const storyDbData = state.currentStoryWorldId 
    ? getStoryWorldData(state.currentStoryWorldId, state.language as Language)
    : null;

  const contentDbItem = (!storyDbData && state.currentStoryWorldId)
    ? getContentById(state.currentStoryWorldId)
    : null;

  // Normalise to a common shape
  const storyData = storyDbData
    ? storyDbData
    : contentDbItem
      ? {
          id: contentDbItem.id,
          title: contentDbItem.title,
          description: contentDbItem.description,
          creator: contentDbItem.creator,
          coverImage: contentDbItem.mediaSource,
          releaseDate: contentDbItem.releaseDate,
          totalDuration: contentDbItem.duration,
          chapterCount: 0,
          culturalThemes: contentDbItem.tags,
          contentType: contentDbItem.type,
          audioSrc: contentDbItem.audioSrc,
          chapters: [],
        }
      : null;

  const handleShareContent = useCallback(async () => {
    if (!storyData) return;
    const shareUrl = `https://seen.app/story/${storyData.id}`;
    const shareData = {
      title: `${storyData.title} — SEEN`,
      text: `Explore this on SEEN — "${storyData.title}"`,
      url: shareUrl,
    };
    try {
      if (navigator.share) { await navigator.share(shareData); }
      else {
        await navigator.clipboard.writeText(shareUrl);
        setShareStatus('copied');
        setTimeout(() => setShareStatus('idle'), 2000);
      }
    } catch {
      try {
        await navigator.clipboard.writeText(shareUrl);
        setShareStatus('copied');
        setTimeout(() => setShareStatus('idle'), 2000);
      } catch {}
    }
  }, [storyData]);

  // Feature 3: Save to existing collection
  const handleSaveToCollection = (collectionId: string) => {
    if (!storyData) return;
    const updated = collections.map(c =>
      c.id === collectionId
        ? { ...c, storyIds: c.storyIds.includes(storyData.id) ? c.storyIds : [...c.storyIds, storyData.id] }
        : c
    );
    saveCollections(updated);
    setCollections(updated);
    setShowCollectionSheet(false);
    setBookmarkStatus('saved');
    setTimeout(() => setBookmarkStatus('idle'), 2000);
  };

  // Feature 3: Create new collection
  const handleCreateCollection = () => {
    if (!newCollectionName.trim() || !storyData) return;
    const newCol: StoryCollection = {
      id: `col-${Date.now()}`,
      name: newCollectionName.trim(),
      storyIds: [storyData.id],
      createdAt: Date.now(),
    };
    const updated = [newCol, ...collections];
    saveCollections(updated);
    setCollections(updated);
    setNewCollectionName('');
    setShowCollectionSheet(false);
    setBookmarkStatus('saved');
    setTimeout(() => setBookmarkStatus('idle'), 2000);
  };

  // Feature 4: Download story
  const handleDownload = () => {
    if (!storyData || downloadStatus !== 'idle') return;
    const existing = loadDownloads();
    if (existing.find(d => d.id === storyData.id)) {
      setDownloadStatus('done');
      return;
    }
    setDownloadStatus('downloading');
    setTimeout(() => {
      const entry: DownloadedStory = {
        id: storyData.id,
        title: storyData.title,
        creator: storyData.creator,
        coverImage: storyData.coverImage,
        typeLabel: (storyData as any).contentType ? CONTENT_TYPE_LABELS[(storyData as any).contentType] || 'Story' : 'Story',
        downloadedAt: Date.now(),
        expiresAt: Date.now() + 30 * 24 * 60 * 60 * 1000, // 30 days
      };
      const updated = [entry, ...existing];
      saveDownloads(updated);
      setDownloadStatus('done');
    }, 1800);
  };

  const isAlreadyDownloaded = storyData ? loadDownloads().some(d => d.id === storyData.id) : false;
  const isBookmarked = storyData ? collections.some(c => c.storyIds.includes(storyData.id)) : false;

  if (!storyData) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black z-50 flex flex-col items-center justify-center gap-4"
      >
        <p className="text-white/50 text-sm">Content not found</p>
        <button onClick={onClose} className="text-white/70 underline text-sm">Go back</button>
      </motion.div>
    );
  }

  const typeLabel = (storyData as any).contentType
    ? CONTENT_TYPE_LABELS[(storyData as any).contentType] || 'Content'
    : 'Story';

  const handleEnterStory = () => {
    if (onEnterStory) {
      onEnterStory();
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: "100%" }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: "100%" }}
      transition={{ type: "spring", damping: 30, stiffness: 300 }}
      className="fixed inset-0 bg-black z-50 overflow-hidden"
    >
      {/* Full-bleed hero image */}
      <div className="absolute inset-0">
        <img
          src={storyData.coverImage}
          alt={storyData.title}
          className="w-full h-full object-cover"
        />
        {/* Gradient overlays for readability */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-transparent to-black" />
      </div>

      {/* Content overlay */}
      <div className="relative z-10 h-full flex flex-col max-w-[428px] mx-auto">
        {/* Top bar */}
        <div className="flex items-center justify-between p-5 pt-8">
          <motion.button
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            onClick={onClose}
            className="w-10 h-10 rounded-full bg-black/40 backdrop-blur-md border border-white/10 flex items-center justify-center hover:bg-black/60 transition-colors"
            aria-label="Go back"
          >
            <ArrowLeft className="w-5 h-5 text-white" />
          </motion.button>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="flex gap-2"
          >
            <button 
              onClick={handleShareContent}
              className="w-10 h-10 rounded-full bg-black/40 backdrop-blur-md border border-white/10 flex items-center justify-center hover:bg-black/60 transition-colors"
              aria-label="Share"
            >
              {shareStatus === 'copied' ? (
                <Check className="w-4 h-4 text-green-400" />
              ) : (
                <Share2 className="w-4 h-4 text-white" />
              )}
            </button>
            {/* Feature 3: Bookmark → Save to Collection */}
            <button
              onClick={() => setShowCollectionSheet(true)}
              className="w-10 h-10 rounded-full bg-black/40 backdrop-blur-md border border-white/10 flex items-center justify-center hover:bg-black/60 transition-colors relative"
              aria-label="Save to collection"
            >
              {bookmarkStatus === 'saved' || isBookmarked ? (
                <BookmarkCheck className="w-4 h-4 text-white" />
              ) : (
                <Bookmark className="w-4 h-4 text-white" />
              )}
              {(bookmarkStatus === 'saved' || isBookmarked) && (
                <span className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-white flex items-center justify-center">
                  <span className="w-1.5 h-1.5 rounded-full bg-black" />
                </span>
              )}
            </button>
          </motion.div>
        </div>

        {/* Center: Play button */}
        <div className="flex-1 flex items-center justify-center">
          <motion.button
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.4, type: "spring", stiffness: 200 }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setIsPlaying(!isPlaying)}
            className="w-20 h-20 rounded-full bg-white/95 backdrop-blur-sm flex items-center justify-center shadow-2xl"
          >
            <Play className="w-8 h-8 text-black fill-black ml-1" />
          </motion.button>

          {isPlaying && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="absolute"
            >
              <motion.div
                animate={{ scale: [1, 1.5, 1], opacity: [0.3, 0, 0.3] }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                className="w-32 h-32 rounded-full border-2 border-white/30"
              />
            </motion.div>
          )}
        </div>

        {/* Bottom: Content info */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="p-6 pb-8 space-y-4"
        >
          {/* Category badge */}
          <div className="flex items-center gap-2">
            <span className="text-xs tracking-[0.2em] uppercase text-white/60 backdrop-blur-sm bg-white/5 px-3 py-1.5 rounded-full border border-white/10">
              {typeLabel}
            </span>
            <span className="text-xs text-white/40">• {storyData.totalDuration}</span>
          </div>

          {/* Title and description */}
          <div className="space-y-3">
            <h1 className="text-3xl tracking-tight text-white leading-tight">
              {storyData.title}
            </h1>
            <p className="text-base text-white/70 leading-relaxed max-w-[340px]">
              {storyData.description}
            </p>
          </div>

          {/* Credits */}
          <div className="pt-2 space-y-1">
            <p className="text-sm text-white/50">
              By <span className="text-white/80">{storyData.creator}</span>
            </p>
            <p className="text-xs text-white/40">
              Released {storyData.releaseDate}
            </p>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-3 pt-4">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleEnterStory}
              className="flex-1 py-4 rounded-full bg-white text-black text-sm tracking-wider uppercase hover:bg-white/90 transition-colors flex items-center justify-center gap-2"
            >
              Enter Story
              <Play className="w-4 h-4 fill-black" />
            </motion.button>
            
            <button 
              className="w-14 h-14 rounded-full bg-white/10 backdrop-blur-sm border border-white/10 flex items-center justify-center hover:bg-white/20 transition-colors"
              aria-label="Adjust volume"
            >
              <Volume2 className="w-5 h-5 text-white" />
            </button>

            {/* Feature 4: Download button */}
            <button
              onClick={handleDownload}
              disabled={downloadStatus === 'downloading'}
              className={`w-14 h-14 rounded-full backdrop-blur-sm border flex items-center justify-center transition-all ${
                downloadStatus === 'done' || isAlreadyDownloaded
                  ? 'bg-white/15 border-white/30'
                  : 'bg-white/10 border-white/10 hover:bg-white/20'
              }`}
              aria-label="Download for offline"
            >
              {downloadStatus === 'downloading' ? (
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                  className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full"
                />
              ) : downloadStatus === 'done' || isAlreadyDownloaded ? (
                <CheckCircle2 className="w-5 h-5 text-white" />
              ) : (
                <Download className="w-5 h-5 text-white" />
              )}
            </button>
          </div>

          {/* Feature 4: Download status message */}
          <AnimatePresence>
            {downloadStatus === 'downloading' && (
              <motion.p
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="text-xs text-white/40 text-center"
              >
                Saving for offline — 30 days access
              </motion.p>
            )}
            {(downloadStatus === 'done' || isAlreadyDownloaded) && downloadStatus !== 'downloading' && (
              <motion.p
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="text-xs text-white/40 text-center flex items-center justify-center gap-1.5"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-green-400" />
                Available offline · expires in 30 days
              </motion.p>
            )}
          </AnimatePresence>

          {/* Spotify embed — shown below actions when available */}
          {storyData.audioSrc?.includes('open.spotify.com/embed') && (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
              className="rounded-xl overflow-hidden"
            >
              <iframe
                src={storyData.audioSrc}
                width="100%"
                height="152"
                frameBorder="0"
                allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                loading="lazy"
                title="Listen on Spotify"
                style={{ borderRadius: '12px' }}
              />
            </motion.div>
          )}

          {/* Ambient sound notice */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
            className="flex items-center gap-2 pt-2"
          >
            <div className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
            <p className="text-xs text-white/40">
              Ambient soundscape playing
            </p>
          </motion.div>
        </motion.div>
      </div>

      {/* Feature 3: Save to Collection bottom sheet */}
      <AnimatePresence>
        {showCollectionSheet && (
          <motion.div
            key="col-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm"
            onClick={() => setShowCollectionSheet(false)}
          />
        )}
        {showCollectionSheet && (
          <motion.div
            key="col-sheet"
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            className="fixed bottom-0 left-0 right-0 z-50 max-w-[428px] mx-auto bg-[#111] border-t border-white/10 rounded-t-2xl overflow-hidden"
            onClick={e => e.stopPropagation()}
          >
            <div className="flex justify-center pt-3 pb-2">
              <div className="w-10 h-1 rounded-full bg-white/20" />
            </div>
            <div className="px-5 pb-8">
              <div className="flex items-center justify-between mb-5">
                <h3 className="text-base tracking-wide font-light">Save to Collection</h3>
                <button type="button" onClick={() => setShowCollectionSheet(false)}>
                  <X className="w-4 h-4 text-white/40" />
                </button>
              </div>

              {/* New collection input */}
              <div className="flex gap-2 mb-5">
                <input
                  type="text"
                  placeholder="New collection name..."
                  value={newCollectionName}
                  onChange={e => setNewCollectionName(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && handleCreateCollection()}
                  className="flex-1 bg-white/5 border border-white/10 rounded-lg px-3 py-2.5 text-sm text-white placeholder-white/30 focus:outline-none focus:border-white/30 transition-colors"
                />
                <button
                  type="button"
                  onClick={handleCreateCollection}
                  disabled={!newCollectionName.trim()}
                  className="w-10 h-10 rounded-lg border border-white/10 bg-white/5 flex items-center justify-center hover:bg-white/10 transition-colors disabled:opacity-30"
                >
                  <Plus className="w-4 h-4 text-white" />
                </button>
              </div>

              {/* Existing collections */}
              {collections.length > 0 ? (
                <div className="space-y-2">
                  {collections.map(col => {
                    const isSaved = storyData && col.storyIds.includes(storyData.id);
                    return (
                      <button
                        key={col.id}
                        type="button"
                        onClick={() => handleSaveToCollection(col.id)}
                        className="w-full flex items-center justify-between p-3 border border-white/10 bg-white/[0.02] rounded-lg hover:border-white/20 transition-all"
                      >
                        <div className="flex items-center gap-3">
                          <FolderPlus className="w-4 h-4 text-white/40" strokeWidth={1.5} />
                          <div className="text-left">
                            <div className="text-sm tracking-wide">{col.name}</div>
                            <div className="text-xs text-white/40">{col.storyIds.length} {col.storyIds.length === 1 ? 'story' : 'stories'}</div>
                          </div>
                        </div>
                        {isSaved && <Check className="w-4 h-4 text-white/60" />}
                      </button>
                    );
                  })}
                </div>
              ) : (
                <p className="text-xs text-white/30 text-center py-4">No collections yet — create your first one above</p>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
