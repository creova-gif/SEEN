/**
 * FOR YOU SCREEN
 * SEEN by CREOVA
 * 
 * Personalized feed based on user language, intent, and activity
 * NO hardcoded content - all data from queries
 */

import { motion } from "motion/react";
import { NavigationBar } from "./NavigationBar";
import { ContentCard } from "./ContentCard";
import { StoryCard } from "./StoryCard";
import { SectionHeader } from "./SectionHeader";
import { EmptyState } from "./EmptyState";
import { Play, TrendingUp, Music, Film, BookOpen, Archive, Folder, Home, Compass, Library, User } from "lucide-react";
import type { ContentLanguage, UserIntent } from "../data/types";
import { getForYouFeed } from "../data/storyService";
import type { Language } from "../data/storyDatabase";

interface ForYouScreenProps {
  onStoryClick: (contentId: string) => void;
  onNavigate: (screen: string) => void;
  onSearch?: () => void;
  userIntent: UserIntent;
  language: ContentLanguage;
  isFirstVisit?: boolean;
}

/**
 * FOR YOU SECTION - PERSONALIZED FEED
 * 
 * Data Flow:
 * 1. Query personalized feed from storyService
 * 2. Display stories with multilingual support
 * 3. Show empty state if no content
 */
export function ForYouScreen({
  onStoryClick,
  onNavigate,
  onSearch,
  userIntent,
  language,
  isFirstVisit
}: ForYouScreenProps) {
  // Get personalized feed from story service
  const feedItems = getForYouFeed({
    language: language as Language,
    intent: userIntent,
    limit: 20,
  });
  
  console.log(`[ForYouScreen] Loaded ${feedItems.length} stories for language: ${language}`);

  // Separate content types
  const featuredContent = feedItems.filter(item => item.featured).slice(0, 2);
  const trendingContent = feedItems.filter(item => item.trending && !item.featured).slice(0, 3);
  const newContent = feedItems.filter(item => item.new && !item.featured && !item.trending).slice(0, 3);
  const allStories = feedItems.slice(0, 8);

  // Helper to get icon for content type
  const getContentTypeIcon = (type: string) => {
    switch (type) {
      case 'music':
        return <Music className="w-3 h-3" />;
      case 'story':
        return <BookOpen className="w-3 h-3" />;
      case 'film':
        return <Film className="w-3 h-3" />;
      case 'collection':
        return <Folder className="w-3 h-3" />;
      case 'archive':
        return <Archive className="w-3 h-3" />;
      default:
        return null;
    }
  };

  // Show empty state if no content
  if (feedItems.length === 0) {
    const emptyStateText = {
      en: { title: 'No Stories Available', message: 'Check back soon for new content.' },
      fr: { title: 'Aucune Histoire Disponible', message: 'Revenez bientôt pour du nouveau contenu.' },
      es: { title: 'No Hay Historias Disponibles', message: 'Vuelva pronto para contenido nuevo.' },
    };
    const text = emptyStateText[language as Language] || emptyStateText.en;
    
    return (
      <div className="min-h-screen bg-black">
        <NavigationBar onSearch={onSearch} />
        <div className="pt-20 pb-24">
          <EmptyState
            icon="Compass"
            title={text.title}
            message={text.message}
            actionLabel="Explore"
            onAction={() => onNavigate('explore')}
          />
        </div>
        <BottomNav onNavigate={onNavigate} activeTab="for-you" />
      </div>
    );
  }

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
        {/* Welcome Message for First Visit */}
        {isFirstVisit && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.2, ease: "easeOut" }}
            className="mb-8 py-6 border-b border-white/10"
          >
            <p className="text-base text-white/70 leading-relaxed">
              Welcome. Your space is forming.
            </p>
          </motion.div>
        )}

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-8"
        >
          {/* Editorial Hero Block */}
          <div className="mb-8">
            <h1 className="text-4xl font-light text-white/95 mb-3 tracking-tight">
              For You
            </h1>
            <p className="text-base text-white/50 font-light tracking-wide leading-relaxed">
              Your presence, unfolding in real time.
            </p>
          </div>

          {/* Dashboard Stats - Presence Indicators */}
          <div className="space-y-3">
            {/* Stories */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2, duration: 0.8 }}
              className="flex items-center gap-4 group cursor-pointer"
            >
              <div className="relative">
                <BookOpen className="w-5 h-5 text-amber-200/70" />
                <div className="absolute inset-0 bg-amber-400/20 blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-light text-white/90 tabular-nums">
                  {feedItems.filter(item => item.type === 'story').length}
                </span>
                <span className="text-sm text-white/40 font-light tracking-wide">
                  {feedItems.filter(item => item.type === 'story').length === 1 ? 'Story' : 'Stories'} in motion
                </span>
              </div>
            </motion.div>

            {/* Music */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3, duration: 0.8 }}
              className="flex items-center gap-4 group cursor-pointer"
            >
              <div className="relative">
                <Music className="w-5 h-5 text-emerald-200/70" />
                <div className="absolute inset-0 bg-emerald-400/20 blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-light text-white/90 tabular-nums">
                  {feedItems.filter(item => item.type === 'music').length}
                </span>
                <span className="text-sm text-white/40 font-light tracking-wide">
                  {feedItems.filter(item => item.type === 'music').length === 1 ? 'Track' : 'Tracks'} resonating
                </span>
              </div>
            </motion.div>

            {/* Films */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4, duration: 0.8 }}
              className="flex items-center gap-4 group cursor-pointer"
            >
              <div className="relative">
                <Film className="w-5 h-5 text-violet-200/70" />
                <div className="absolute inset-0 bg-violet-400/20 blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-light text-white/90 tabular-nums">
                  {feedItems.filter(item => item.type === 'film').length}
                </span>
                <span className="text-sm text-white/40 font-light tracking-wide">
                  {feedItems.filter(item => item.type === 'film').length === 1 ? 'Film' : 'Films'} living
                </span>
              </div>
            </motion.div>

            {/* Collections */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5, duration: 0.8 }}
              className="flex items-center gap-4 group cursor-pointer"
            >
              <div className="relative">
                <Folder className="w-5 h-5 text-orange-200/70" />
                <div className="absolute inset-0 bg-orange-400/20 blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-light text-white/90 tabular-nums">
                  {feedItems.filter(item => item.type === 'collection').length}
                </span>
                <span className="text-sm text-white/40 font-light tracking-wide">
                  {feedItems.filter(item => item.type === 'collection').length === 1 ? 'Collection' : 'Collections'} forming
                </span>
              </div>
            </motion.div>
          </div>
        </motion.div>

        {/* Featured Content */}
        {featuredContent.length > 0 && (
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mb-12"
          >
            <SectionHeader 
              title="Featured"
              subtitle="Hand-picked for you"
            />
            <div className="space-y-4">
              {featuredContent.map(item => (
                <div key={item.id} onClick={() => onStoryClick(item.id)} className="cursor-pointer relative">
                  <ContentCard
                    id={item.id}
                    title={item.title}
                    creator={item.description}
                    imageUrl={item.mediaSource}
                    category={item.creator}
                    onSelect={onStoryClick}
                  />
                  {/* Type badge with icon */}
                  <div className="absolute top-3 left-3 px-2 py-1 bg-black/60 backdrop-blur-sm rounded text-xs text-white/90 uppercase tracking-wider border border-white/20 flex items-center gap-1.5">
                    {getContentTypeIcon(item.type)}
                    {item.type}
                  </div>
                </div>
              ))}
            </div>
          </motion.section>
        )}

        {/* Trending */}
        {trendingContent.length > 0 && (
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="mb-12"
          >
            <SectionHeader 
              title="Trending Now"
              subtitle="Popular in your region"
              icon={<TrendingUp className="w-5 h-5" />}
            />
            <div className="flex gap-4 overflow-x-auto scrollbar-hide pb-2 -mx-5 px-5">
              {trendingContent.map(item => (
                <div key={item.id} onClick={() => onStoryClick(item.id)} className="flex-shrink-0">
                  <StoryCard
                    title={item.title}
                    author={item.creator}
                    readTime={item.duration}
                    imageUrl={item.mediaSource}
                  />
                  {/* Type badge with icon */}
                  <div className="mt-2 text-xs text-white/50 uppercase tracking-wider flex items-center gap-1.5">
                    {getContentTypeIcon(item.type)}
                    {item.type}
                  </div>
                </div>
              ))}
            </div>
          </motion.section>
        )}

        {/* New Releases */}
        {newContent.length > 0 && (
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="mb-12"
          >
            <SectionHeader 
              title="New Releases"
              subtitle="Fresh content"
              icon={<Music className="w-5 h-5" />}
            />
            <div className="flex gap-4 overflow-x-auto scrollbar-hide pb-2 -mx-5 px-5">
              {newContent.map(item => (
                <div key={item.id} onClick={() => onStoryClick(item.id)} className="flex-shrink-0">
                  <StoryCard
                    title={item.title}
                    author={item.creator}
                    readTime={item.duration}
                    imageUrl={item.mediaSource}
                  />
                </div>
              ))}
            </div>
          </motion.section>
        )}

        {/* Recommendation reason hint */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="text-center text-xs text-white/30 mt-8"
        >
          Content personalized for {userIntent === 'explore' ? 'exploration' : userIntent === 'create' ? 'creators' : 'contributors'}
        </motion.div>
      </main>

      {/* Bottom Navigation */}
      <BottomNav onNavigate={onNavigate} activeTab="for-you" />
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
            activeTab === 'profile' ? 'font-medium' : 'font-light'
          }`}>
            Profile
          </span>
        </button>
      </div>
    </nav>
  );
}