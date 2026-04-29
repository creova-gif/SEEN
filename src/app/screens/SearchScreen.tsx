import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Search } from 'lucide-react';
import { useStoryState } from '../context/StoryStateContext';
import { searchStories, getSearchSuggestions } from '../data/searchService';
import type { ContentItem } from '../data/types';
import { StoryCard } from '../components/StoryCard';

interface SearchScreenProps {
  onClose: () => void;
  onSelectStory?: (storyId: string) => void;
}

export function SearchScreen({ onClose, onSelectStory }: SearchScreenProps) {
  const { language } = useStoryState();
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<ContentItem[]>([]);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      setSuggestions([]);
      return;
    }

    setIsSearching(true);
    // Simulate search delay for UX feedback
    const timer = setTimeout(() => {
      const searchResults = searchStories(query, language);
      setResults(searchResults);

      const searchSuggestions = getSearchSuggestions(query, language, 5);
      setSuggestions(searchSuggestions);
      setIsSearching(false);
    }, 300);

    return () => clearTimeout(timer);
  }, [query, language]);

  const handleSelectStory = (storyId: string) => {
    if (onSelectStory) {
      onSelectStory(storyId);
    }
    onClose();
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md"
        onClick={onClose}
      >
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -20, opacity: 0 }}
          className="relative max-w-[428px] mx-auto h-screen flex flex-col bg-black/40"
          onClick={e => e.stopPropagation()}
        >
          {/* Search Header */}
          <div className="sticky top-0 z-10 px-5 pt-6 pb-4 border-b border-white/5">
            <div className="flex items-center gap-3 mb-4">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={onClose}
                className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center"
                aria-label="Close search"
              >
                <X className="w-4 h-4 text-white/70" />
              </motion.button>
              <h2 className="text-white text-lg font-light tracking-tight">
                {language === 'en' ? 'Search Stories' : language === 'fr' ? 'Rechercher des Histoires' : 'Buscar Historias'}
              </h2>
            </div>

            {/* Search Input */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-white/40" />
              <input
                type="text"
                placeholder={language === 'en' ? 'Search by title, author, or theme...' : language === 'fr' ? 'Rechercher par titre, auteur ou thème...' : 'Buscar por título, autor o tema...'}
                value={query}
                onChange={e => setQuery(e.target.value)}
                autoFocus
                className="w-full pl-10 pr-4 py-2.5 bg-white/5 border border-white/10 rounded-lg text-white placeholder-white/40 focus:outline-none focus:border-white/30 transition-colors"
              />
            </div>
          </div>

          {/* Results */}
          <div className="flex-1 overflow-y-auto">
            {query.trim() && (
              <div className="px-5 py-4">
                {isSearching && (
                  <div className="flex items-center justify-center py-8">
                    <div className="w-5 h-5 rounded-full border-2 border-white/20 border-t-white animate-spin" />
                  </div>
                )}

                {!isSearching && results.length === 0 && (
                  <div className="text-center py-8">
                    <p className="text-white/40 text-sm">
                      {language === 'en' ? 'No stories found' : language === 'fr' ? 'Aucune histoire trouvée' : 'No se encontraron historias'}
                    </p>
                  </div>
                )}

                {!isSearching && results.length > 0 && (
                  <div className="space-y-4">
                    {results.map(story => (
                      <motion.div
                        key={story.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        onClick={() => handleSelectStory(story.id)}
                      >
                        <StoryCard
                          story={story}
                          language={language}
                          interactive={true}
                        />
                      </motion.div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {!query.trim() && (
              <div className="px-5 py-8 text-center">
                <p className="text-white/40 text-sm mb-4">
                  {language === 'en' ? 'Start typing to search...' : language === 'fr' ? 'Commencez à taper pour rechercher...' : 'Comience a escribir para buscar...'}
                </p>
              </div>
            )}
          </div>

          {/* Footer Info */}
          <div className="px-5 py-4 border-t border-white/5 text-center">
            <p className="text-white/30 text-xs">
              {results.length > 0 && `${results.length} ${language === 'en' ? 'result' : language === 'fr' ? 'résultat' : 'resultado'}${results.length !== 1 ? 's' : ''}`}
            </p>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
