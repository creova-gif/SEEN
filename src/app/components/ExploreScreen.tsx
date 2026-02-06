/**
 * EXPLORE SCREEN
 * SEEN by CREOVA
 * 
 * Curated discovery with fixed categories
 * NO personalized content - different from For You
 */

import { motion } from "motion/react";
import { useState } from "react";
import { NavigationBar } from "./NavigationBar";
import { ContentCard } from "./ContentCard";
import { StoryCard } from "./StoryCard";
import { SectionHeader } from "./SectionHeader";
import { EmptyState } from "./EmptyState";
import { Search, Filter, Music, Film, Archive, Globe, TrendingUp, Clock, Home, Compass, Library, User } from "lucide-react";
import type { ContentLanguage } from "../data/types";
import { getExploreCategories, searchStories } from "../data/storyService";
import type { Language } from "../data/storyDatabase";

interface ExploreScreenProps {
  onStoryClick: (contentId: string) => void;
  onNavigate: (screen: string) => void;
  language: ContentLanguage;
}

/**
 * EXPLORE SECTION - CURATED DISCOVERY
 * 
 * Data Flow:
 * 1. Load fixed categories from storyService
 * 2. NO personalization - same for all users
 * 3. Search functionality
 * 4. Filter by type
 */
export function ExploreScreen({ 
  onStoryClick, 
  onNavigate, 
  language 
}: ExploreScreenProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedType, setSelectedType] = useState<string | null>(null);

  // Get curated categories
  const categories = getExploreCategories(language as Language);
  
  console.log(`[ExploreScreen] Loaded ${categories.length} categories for language: ${language}`);

  // Search results
  const searchResults = searchQuery.length > 2 
    ? searchStories(searchQuery, language as Language) 
    : [];

  // Filter categories by selected type
  const filteredCategories = selectedType
    ? categories.map(cat => ({
        ...cat,
        items: cat.items.filter(item => item.type === selectedType)
      })).filter(cat => cat.items.length > 0)
    : categories;

  // Show empty state if no categories
  if (categories.length === 0 && !searchQuery) {
    const emptyStateText = {
      en: { title: 'No Content Available', message: 'Check back soon for new stories.' },
      fr: { title: 'Aucun Contenu Disponible', message: 'Revenez bientôt pour de nouvelles histoires.' },
      es: { title: 'No Hay Contenido Disponible', message: 'Vuelva pronto para nuevas historias.' },
    };
    const text = emptyStateText[language as Language] || emptyStateText.en;
    
    return (
      <div className="min-h-screen bg-black">
        <NavigationBar />
        <div className="pt-20 pb-24">
          <EmptyState
            icon="Compass"
            title={text.title}
            message={text.message}
            actionLabel="For You"
            onAction={() => onNavigate('for-you')}
          />
        </div>
        <BottomNav onNavigate={onNavigate} activeTab="explore" />
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
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-6"
        >
          <h1 className="text-2xl font-bold text-white mb-2">Explore</h1>
          <p className="text-sm text-white/60">Discover cultural stories and creators</p>
        </motion.div>

        {/* Search Bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-6"
        >
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
            <input
              type="text"
              placeholder="Search stories, creators, topics..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-xl pl-12 pr-4 py-3 text-white placeholder-white/40 focus:outline-none focus:border-white/30 transition-colors"
            />
          </div>
        </motion.div>

        {/* Type Filters */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mb-8"
        >
          <div className="flex gap-3 overflow-x-auto scrollbar-hide pb-2 -mx-5 px-5">
            <TypeFilter
              icon={<Globe className="w-4 h-4" />}
              label="All"
              active={selectedType === null}
              onClick={() => setSelectedType(null)}
            />
            <TypeFilter
              icon={<Music className="w-4 h-4" />}
              label="Music"
              active={selectedType === 'music'}
              onClick={() => setSelectedType('music')}
            />
            <TypeFilter
              icon={<Film className="w-4 h-4" />}
              label="Stories"
              active={selectedType === 'story'}
              onClick={() => setSelectedType('story')}
            />
            <TypeFilter
              icon={<Film className="w-4 h-4" />}
              label="Films"
              active={selectedType === 'film'}
              onClick={() => setSelectedType('film')}
            />
            <TypeFilter
              icon={<Archive className="w-4 h-4" />}
              label="Collections"
              active={selectedType === 'collection'}
              onClick={() => setSelectedType('collection')}
            />
          </div>
        </motion.section>

        {/* Search Results */}
        {searchQuery.length > 2 && (
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-12"
          >
            <SectionHeader 
              title="Search Results"
              subtitle={`${searchResults.length} results for "${searchQuery}"`}
            />
            {searchResults.length > 0 ? (
              <div className="space-y-4">
                {searchResults.map(item => (
                  <div key={item.id} onClick={() => onStoryClick(item.id)} className="cursor-pointer relative">
                    <ContentCard
                      id={item.id}
                      title={item.title}
                      creator={item.description}
                      imageUrl={item.mediaSource}
                      category={item.creator}
                      onSelect={onStoryClick}
                    />
                    <div className="absolute top-3 left-3 px-2 py-1 bg-black/60 backdrop-blur-sm rounded text-xs text-white/90 uppercase tracking-wider border border-white/20">
                      {item.type}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-white/40 text-sm">
                No results found for "{searchQuery}"
              </div>
            )}
          </motion.section>
        )}

        {/* Curated Categories */}
        {!searchQuery && filteredCategories.map((category, index) => (
          <motion.section
            key={category.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 + index * 0.1 }}
            className="mb-12"
          >
            <SectionHeader 
              title={category.name}
              subtitle={category.description}
            />
            
            {/* Render based on category type */}
            {category.id === 'new-music' ? (
              // Horizontal scroll for music
              <div className="flex gap-4 overflow-x-auto scrollbar-hide pb-2 -mx-5 px-5">
                {category.items.map(item => (
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
            ) : (
              // Vertical list for stories/films/collections
              <div className="space-y-4">
                {category.items.map(item => (
                  <div key={item.id} onClick={() => onStoryClick(item.id)} className="cursor-pointer relative">
                    <ContentCard
                      id={item.id}
                      title={item.title}
                      creator={item.description}
                      imageUrl={item.mediaSource}
                      category={item.creator}
                      onSelect={onStoryClick}
                    />
                    <div className="absolute top-3 left-3 px-2 py-1 bg-black/60 backdrop-blur-sm rounded text-xs text-white/90 uppercase tracking-wider border border-white/20">
                      {item.type}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </motion.section>
        ))}

        {/* No results for filter */}
        {!searchQuery && filteredCategories.length === 0 && (
          <div className="text-center py-16 text-white/40 text-sm">
            No content found for this filter
          </div>
        )}
      </main>

      {/* Bottom Navigation */}
      <BottomNav onNavigate={onNavigate} activeTab="explore" />
    </motion.div>
  );
}

// Type Filter Button
function TypeFilter({ 
  icon, 
  label, 
  active, 
  onClick 
}: { 
  icon: React.ReactNode;
  label: string; 
  active: boolean; 
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={`px-4 py-2 rounded-full text-sm whitespace-nowrap transition-colors flex items-center gap-2 ${
        active
          ? "bg-white text-black"
          : "bg-white/5 border border-white/10 text-white/80 hover:bg-white/10"
      }`}
    >
      {icon}
      {label}
    </button>
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