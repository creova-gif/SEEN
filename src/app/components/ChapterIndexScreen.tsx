import { motion } from "motion/react";
import { ArrowLeft, Play } from "lucide-react";
import { useStoryState } from "../contexts/StoryStateContext";
import { getChaptersForStory, getStoryWorldById, getLocalizedText } from "../data/storyDatabase";

interface ChapterIndexScreenProps {
  onClose: () => void;
  onSelectChapter: (chapterId: string) => void;
  storyWorldId?: string;
}

export function ChapterIndexScreen({ 
  onClose, 
  onSelectChapter,
  storyWorldId = 'midnight-resonance'
}: ChapterIndexScreenProps) {
  const { state, getProgressForStory } = useStoryState();
  const chapters = getChaptersForStory(storyWorldId);
  const storyWorld = getStoryWorldById(storyWorldId);
  const progress = getProgressForStory(storyWorldId);
  
  if (!storyWorld) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: "100%" }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: "100%" }}
      transition={{ type: "spring", damping: 30, stiffness: 300 }}
      className="fixed inset-0 bg-black z-50 overflow-auto"
    >
      <div className="min-h-full max-w-[428px] mx-auto">
        {/* Header */}
        <div className="sticky top-0 z-10 backdrop-blur-xl bg-black/80 border-b border-white/5">
          <div className="flex items-center justify-between p-5 pt-8">
            <button
              onClick={onClose}
              className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center hover:bg-white/10 transition-colors"
              aria-label="Close"
            >
              <ArrowLeft className="w-5 h-5 text-white" />
            </button>
            <h2 className="text-base tracking-tight text-white">
              {getLocalizedText(storyWorld.title, state.language)}
            </h2>
            <div className="w-10" /> {/* Spacer */}
          </div>
        </div>

        {/* Story metadata */}
        <div className="p-6 pb-8 border-b border-white/5">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="space-y-3"
          >
            <span className="text-xs tracking-[0.3em] uppercase text-white/40">
              {getLocalizedText(storyWorld.category, state.language)}
            </span>
            <h1 className="text-2xl tracking-tight text-white">
              {state.language === 'en' ? 'Table of Contents' : state.language === 'fr' ? 'Table des Matières' : 'Tabla de Contenidos'}
            </h1>
            <p className="text-sm text-white/50 leading-relaxed">
              {getLocalizedText(storyWorld.description, state.language)}
            </p>
            <div className="flex items-center gap-4 pt-2">
              <span className="text-xs text-white/40">
                {chapters.reduce((total, ch) => total + parseInt(ch.duration), 0)} min total
              </span>
              <span className="text-xs text-white/40">
                • {chapters.length} chapters
              </span>
            </div>
          </motion.div>
        </div>

        {/* Chapter list */}
        <div className="p-6 space-y-4">
          {chapters.map((chapter, index) => {
            const isCurrent = chapter.id === state.currentChapterId;
            const isCompleted = progress && chapters.findIndex(ch => ch.id === progress.lastCompletedChapterId) >= index;

            return (
              <motion.button
                key={chapter.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 + index * 0.05 }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => onSelectChapter(chapter.id)}
                className={`
                  w-full text-left rounded-2xl overflow-hidden transition-all
                  ${isCurrent 
                    ? 'bg-white/10 border-2 border-white/20' 
                    : 'bg-white/5 border border-white/10 hover:bg-white/10'
                  }
                `}
              >
                <div className="flex gap-4 p-4">
                  {/* Chapter image */}
                  <div className="relative w-20 h-20 rounded-lg overflow-hidden flex-shrink-0">
                    <img
                      src={chapter.imageUrl}
                      alt={getLocalizedText(chapter.title, state.language)}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-black/20" />
                    
                    {/* Play indicator */}
                    {isCurrent ? (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-6 h-6 rounded-full bg-white/90 flex items-center justify-center">
                          <Play className="w-3 h-3 text-black fill-black ml-0.5" />
                        </div>
                      </div>
                    ) : isCompleted ? (
                      <div className="absolute top-2 right-2">
                        <div className="w-4 h-4 rounded-full bg-white/20 backdrop-blur-sm border border-white/30 flex items-center justify-center">
                          <div className="w-1.5 h-1.5 rounded-full bg-white" />
                        </div>
                      </div>
                    ) : null}
                  </div>

                  {/* Chapter info */}
                  <div className="flex-1 min-w-0 space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-xs tracking-wider uppercase text-white/40">
                        Chapter {chapter.number}
                      </span>
                      {isCompleted && !isCurrent && (
                        <span className="text-xs text-white/30">
                          • Completed
                        </span>
                      )}
                      {isCurrent && (
                        <span className="text-xs text-white/60">
                          • Playing
                        </span>
                      )}
                    </div>
                    <h3 className="text-base text-white">
                      {getLocalizedText(chapter.title, state.language)}
                    </h3>
                    <p className="text-sm text-white/50">
                      {getLocalizedText(chapter.subtitle, state.language)}
                    </p>
                    <span className="text-xs text-white/30">
                      {chapter.duration}
                    </span>
                  </div>
                </div>
              </motion.button>
            );
          })}
        </div>

        {/* Resume listening CTA */}
        <div className="p-6 pt-8 pb-12">
          <motion.button
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => onSelectChapter(state.currentChapterId || chapters[0].id)}
            className="w-full py-4 rounded-full bg-white text-black text-sm tracking-wider uppercase hover:bg-white/90 transition-colors flex items-center justify-center gap-2"
          >
            <Play className="w-4 h-4 fill-black" />
            {state.language === 'en' ? 'Resume Story' : state.language === 'fr' ? 'Reprendre l\'Histoire' : 'Reanudar Historia'}
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
}