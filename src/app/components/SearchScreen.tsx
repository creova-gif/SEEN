import { motion } from "motion/react";
import { ArrowLeft, Search as SearchIcon, X, TrendingUp } from "lucide-react";
import { useMemo, useState } from "react";
import { useStoryState } from "../contexts/StoryStateContext";
import { searchStories } from "../data/storyService";
import { getFeaturedStories } from "../data/storyDatabase";
import { storyWorldToContentItem } from "../data/storyService";
import { ContentCard } from "./ContentCard";

interface SearchScreenProps {
  onBack: () => void;
  onStoryClick: (id: string) => void;
}

const RECENT_SEARCHES_KEY = "seen_recent_searches";

function loadRecentSearches(): string[] {
  try {
    return JSON.parse(localStorage.getItem(RECENT_SEARCHES_KEY) || "[]");
  } catch {
    return [];
  }
}

function saveRecentSearch(query: string) {
  const trimmed = query.trim();
  if (!trimmed) return;
  const existing = loadRecentSearches().filter((q) => q.toLowerCase() !== trimmed.toLowerCase());
  const updated = [trimmed, ...existing].slice(0, 6);
  localStorage.setItem(RECENT_SEARCHES_KEY, JSON.stringify(updated));
}

export function SearchScreen({ onBack, onStoryClick }: SearchScreenProps) {
  const { state } = useStoryState();
  const [query, setQuery] = useState("");
  const [recentSearches, setRecentSearches] = useState<string[]>(loadRecentSearches);

  const language = state.language as "en" | "fr" | "es";

  const results = useMemo(() => {
    if (!query.trim()) return [];
    return searchStories(query, language);
  }, [query, language]);

  const trending = useMemo(
    () => getFeaturedStories().filter((s) => s.trending).map((s) => storyWorldToContentItem(s, language)),
    [language]
  );

  const getText = (key: string) => {
    const translations: Record<string, Record<string, string>> = {
      placeholder: { en: "Search stories, creators, themes...", fr: "Rechercher histoires, créateurs, thèmes...", es: "Buscar historias, creadores, temas..." },
      recent: { en: "Recent Searches", fr: "Recherches Récentes", es: "Búsquedas Recientes" },
      trending: { en: "Trending Now", fr: "Tendances", es: "Tendencias" },
      noResults: { en: "No results found", fr: "Aucun résultat", es: "Sin resultados" },
      results: { en: "Results", fr: "Résultats", es: "Resultados" },
    };
    return translations[key]?.[language] || translations[key]?.en || key;
  };

  const handleSelectResult = (id: string) => {
    saveRecentSearch(query);
    setRecentSearches(loadRecentSearches());
    onStoryClick(id);
  };

  const handleRecentSearchTap = (term: string) => {
    setQuery(term);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black z-50 overflow-auto"
    >
      <div className="min-h-full max-w-[428px] mx-auto pb-12">
        {/* Header */}
        <div className="sticky top-0 z-10 backdrop-blur-xl bg-black/80 border-b border-white/5">
          <div className="flex items-center gap-3 p-5 pt-8">
            <button
              onClick={onBack}
              className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center hover:bg-white/10 transition-colors flex-shrink-0"
              aria-label="Back"
            >
              <ArrowLeft className="w-5 h-5 text-white" />
            </button>
            <div className="relative flex-1">
              <SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
              <input
                autoFocus
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder={getText("placeholder")}
                className="w-full py-3 pl-11 pr-10 rounded-full bg-white/5 border border-white/10 text-white text-sm placeholder:text-white/30 focus:outline-none focus:border-white/30"
              />
              {query && (
                <button
                  onClick={() => setQuery("")}
                  aria-label="Clear search"
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 hover:text-white/70 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>
        </div>

        <div className="px-6 pt-6 space-y-8">
          {query.trim() ? (
            <div className="space-y-4">
              <h3 className="text-sm tracking-wider uppercase text-white/40">
                {results.length > 0 ? `${results.length} ${getText("results")}` : getText("noResults")}
              </h3>
              <div className="space-y-4">
                {results.map((item, index) => (
                  <div key={item.id} className="w-full aspect-[3/4] max-h-56">
                    <ContentCard
                      id={item.id}
                      title={item.title}
                      creator={item.creator}
                      duration={item.duration}
                      imageUrl={item.mediaSource}
                      category={item.tags[0] ?? item.creator}
                      index={index}
                      onSelect={handleSelectResult}
                    />
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <>
              {recentSearches.length > 0 && (
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-3">
                  <h3 className="text-sm tracking-wider uppercase text-white/40">{getText("recent")}</h3>
                  <div className="flex flex-wrap gap-2">
                    {recentSearches.map((term) => (
                      <button
                        key={term}
                        onClick={() => handleRecentSearchTap(term)}
                        className="px-4 py-2 rounded-full bg-white/5 border border-white/10 text-sm text-white/70 hover:bg-white/10 transition-colors"
                      >
                        {term}
                      </button>
                    ))}
                  </div>
                </motion.div>
              )}

              {trending.length > 0 && (
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="space-y-3">
                  <div className="flex items-center gap-2">
                    <TrendingUp className="w-4 h-4 text-white/40" />
                    <h3 className="text-sm tracking-wider uppercase text-white/40">{getText("trending")}</h3>
                  </div>
                  <div className="space-y-4">
                    {trending.map((item, index) => (
                      <div key={item.id} className="w-full aspect-[3/4] max-h-56">
                        <ContentCard
                          id={item.id}
                          title={item.title}
                          creator={item.creator}
                          duration={item.duration}
                          imageUrl={item.mediaSource}
                          category={item.tags[0] ?? item.creator}
                          index={index}
                          onSelect={handleSelectResult}
                        />
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}
            </>
          )}
        </div>
      </div>
    </motion.div>
  );
}
