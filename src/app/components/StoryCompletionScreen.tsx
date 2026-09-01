import { motion } from "motion/react";
import { ArrowLeft, PartyPopper, Clock, BookOpen, Compass, Library } from "lucide-react";
import { useStoryState } from "../contexts/StoryStateContext";
import { getStoryWorldById, getLocalizedText } from "../data/storyDatabase";

interface StoryCompletionScreenProps {
  /** The story world that was just finished. */
  storyWorldId: string;
  onBack: () => void;
  onBackToLibrary: () => void;
  onExploreMore: () => void;
}

/**
 * STORY COMPLETION
 * SEEN by CREOVA
 *
 * Celebration screen shown when a story reaches its final chapter. Ties
 * into the same "final chapter reached" derivation StoryStateContext's
 * `saveProgress()` already uses (chapterIndex + 1 >= story.chapterCount),
 * and pulls every stat shown (title, chapter count, total duration, creator,
 * choices made) from the real story record via getStoryWorldById — nothing
 * here is fabricated.
 */
export function StoryCompletionScreen({
  storyWorldId,
  onBack,
  onBackToLibrary,
  onExploreMore,
}: StoryCompletionScreenProps) {
  const { state, getChoicesForStory } = useStoryState();
  const language = state.language as "en" | "fr" | "es";
  const story = getStoryWorldById(storyWorldId);
  const choicesMade = getChoicesForStory(storyWorldId).length;

  const getText = (key: string) => {
    const translations: Record<string, Record<string, string>> = {
      title: { en: "Story Complete", fr: "Histoire Terminée", es: "Historia Completada" },
      youFinished: { en: "You finished", fr: "Vous avez terminé", es: "Terminaste" },
      chapters: { en: "Chapters", fr: "Chapitres", es: "Capítulos" },
      duration: { en: "Duration", fr: "Durée", es: "Duración" },
      choices: { en: "Choices Made", fr: "Choix Effectués", es: "Decisiones Tomadas" },
      byCreator: { en: "By", fr: "Par", es: "Por" },
      library: { en: "Back to Library", fr: "Retour à la Bibliothèque", es: "Volver a la Biblioteca" },
      exploreMore: { en: "Explore More Stories", fr: "Explorer Plus d'Histoires", es: "Explorar Más Historias" },
      notFound: { en: "This story could not be found.", fr: "Cette histoire est introuvable.", es: "No se pudo encontrar esta historia." },
    };
    return translations[key]?.[language] || translations[key]?.en || key;
  };

  if (!story) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black z-50 flex flex-col items-center justify-center gap-4 px-6 text-center"
      >
        <p className="text-white/50 text-sm">{getText("notFound")}</p>
        <button onClick={onBackToLibrary} className="text-white/70 underline text-sm">
          {getText("library")}
        </button>
      </motion.div>
    );
  }

  const title = getLocalizedText(story.title, language);
  const creator = getLocalizedText(story.creator, language);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black z-50 overflow-auto"
    >
      <div className="min-h-full max-w-[428px] mx-auto flex flex-col">
        {/* Header */}
        <div className="sticky top-0 z-10 backdrop-blur-xl bg-black/80 border-b border-white/5">
          <div className="flex items-center justify-between p-5 pt-8">
            <button
              onClick={onBack}
              className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center hover:bg-white/10 transition-colors"
              aria-label="Back"
            >
              <ArrowLeft className="w-5 h-5 text-white" />
            </button>
            <h2 className="text-base tracking-tight text-white">{getText("title")}</h2>
            <div className="w-10" />
          </div>
        </div>

        <div className="flex-1 px-6 py-10 space-y-10">
          {/* Celebration hero */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1, type: "spring", stiffness: 200 }}
            className="flex flex-col items-center text-center gap-5 pt-6"
          >
            <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-purple-500/20 to-blue-500/20 border border-white/10 flex items-center justify-center">
              <PartyPopper className="w-10 h-10 text-white/80" />
            </div>
            <div className="space-y-2">
              <p className="text-xs tracking-wider uppercase text-white/40">{getText("youFinished")}</p>
              <h1 className="text-2xl tracking-tight text-white leading-tight max-w-[300px]">{title}</h1>
              <p className="text-sm text-white/50">
                {getText("byCreator")} <span className="text-white/70">{creator}</span>
              </p>
            </div>
          </motion.div>

          {/* Real stats pulled from the story record */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="grid grid-cols-3 gap-3"
          >
            <div className="p-4 rounded-xl bg-white/5 border border-white/10 text-center space-y-1.5">
              <BookOpen className="w-4 h-4 text-white/40 mx-auto" />
              <p className="text-lg text-white">{story.chapterCount}</p>
              <p className="text-[10px] tracking-wider uppercase text-white/40">{getText("chapters")}</p>
            </div>
            <div className="p-4 rounded-xl bg-white/5 border border-white/10 text-center space-y-1.5">
              <Clock className="w-4 h-4 text-white/40 mx-auto" />
              <p className="text-lg text-white">{story.totalDuration}</p>
              <p className="text-[10px] tracking-wider uppercase text-white/40">{getText("duration")}</p>
            </div>
            <div className="p-4 rounded-xl bg-white/5 border border-white/10 text-center space-y-1.5">
              <Compass className="w-4 h-4 text-white/40 mx-auto" />
              <p className="text-lg text-white">{choicesMade}</p>
              <p className="text-[10px] tracking-wider uppercase text-white/40">{getText("choices")}</p>
            </div>
          </motion.div>

          {/* Cultural themes, if any */}
          {story.culturalThemes.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="flex flex-wrap gap-2 justify-center"
            >
              {story.culturalThemes.map((theme) => (
                <span
                  key={theme}
                  className="px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-xs text-white/60"
                >
                  {theme}
                </span>
              ))}
            </motion.div>
          )}

          {/* Actions */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="space-y-3 pt-4"
          >
            <button
              onClick={onBackToLibrary}
              className="w-full py-4 rounded-full bg-white text-black text-sm tracking-wider uppercase hover:bg-white/90 transition-colors flex items-center justify-center gap-2"
            >
              <Library className="w-4 h-4" />
              {getText("library")}
            </button>
            <button
              onClick={onExploreMore}
              className="w-full py-4 rounded-full bg-white/5 border border-white/10 text-white text-sm tracking-wider uppercase hover:bg-white/10 transition-colors flex items-center justify-center gap-2"
            >
              <Compass className="w-4 h-4" />
              {getText("exploreMore")}
            </button>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
}
