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
import { Search, Home, Compass, Library, User, BookOpen } from "lucide-react";
import { SegmentedTabs } from "./seen/primitives";
import { CreatorsPanel } from "../screens/CreatorsPanel";
import { CollectionsPanel } from "../screens/CollectionsPanel";
import type { ContentLanguage } from "../data/types";
import { getExploreCategories, searchStories } from "../data/storyService";
import type { Language } from "../data/storyDatabase";

interface ExploreScreenProps {
  onStoryClick: (contentId: string) => void;
  onNavigate: (screen: string) => void;
  onSearch?: () => void;
  language: ContentLanguage;
  initialTab?: ExploreTab;
}

export type ExploreTab = "stories" | "creators" | "collections";

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
  onSearch,
  language,
  initialTab = "stories",
}: ExploreScreenProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [tab, setTab] = useState<ExploreTab>(initialTab);

  // Get curated categories
  const categories = getExploreCategories(language as Language);
  
  console.log(`[ExploreScreen] Loaded ${categories.length} categories for language: ${language}`);

  // Search results
  const searchResults = searchQuery.length > 2 
    ? searchStories(searchQuery, language as Language) 
    : [];

  const filteredCategories = categories;

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
        <NavigationBar onSearch={onSearch} />
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
      <NavigationBar onSearch={onSearch} />

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

        <div className="mb-6">
          <SegmentedTabs<ExploreTab>
            label="Explore sections"
            value={tab}
            onChange={setTab}
            tabs={[
              { id: "stories", label: "Stories" },
              { id: "creators", label: "Creators" },
              { id: "collections", label: "Collections" },
            ]}
          />
        </div>

        {tab === "creators" && <CreatorsPanel />}
        {tab === "collections" && <CollectionsPanel />}

        {tab === "stories" && (<>
        {/* Search Bar */}
        <div className="mb-8">
          <label className="relative block">
            <span className="sr-only">Search stories</span>
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/55" aria-hidden />
            <input
              type="search"
              placeholder="Search stories, creators, topics..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-xl pl-12 pr-4 py-3 text-white placeholder-white/40 focus:outline-none focus:border-white/30 transition-colors"
            />
          </label>
        </div>

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
                  <ContentCard
                    key={item.id}
                    id={item.id}
                    title={item.title}
                    creator={item.creator}
                    subtitle={item.description}
                    duration={item.duration}
                    imageUrl={item.mediaSource}
                    typeLabel={<><BookOpen className="w-3 h-3" aria-hidden />{item.type}</>}
                    onSelect={onStoryClick}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-white/55 text-sm">
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
                  <StoryCard
                    key={item.id}
                    id={item.id}
                    title={item.title}
                    author={item.creator}
                    readTime={item.duration}
                    imageUrl={item.mediaSource}
                    onSelect={() => onStoryClick(item.id)}
                  />
                ))}
              </div>
            ) : (
              // Vertical list for stories/films/collections
              <div className="space-y-4">
                {category.items.map(item => (
                  <ContentCard
                    key={item.id}
                    id={item.id}
                    title={item.title}
                    creator={item.creator}
                    subtitle={item.description}
                    duration={item.duration}
                    imageUrl={item.mediaSource}
                    typeLabel={<><BookOpen className="w-3 h-3" aria-hidden />{item.type}</>}
                    onSelect={onStoryClick}
                  />
                ))}
              </div>
            )}
          </motion.section>
        ))}

        </>)}
      </main>

      {/* Bottom Navigation */}
      <BottomNav onNavigate={onNavigate} activeTab="explore" />
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
            activeTab === 'for-you' ? 'text-white' : 'text-white/55 hover:text-white/60'
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
            activeTab === 'explore' ? 'text-white' : 'text-white/55 hover:text-white/60'
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
            activeTab === 'library' ? 'text-white' : 'text-white/55 hover:text-white/60'
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
            activeTab === 'profile' ? 'text-white' : 'text-white/55 hover:text-white/60'
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