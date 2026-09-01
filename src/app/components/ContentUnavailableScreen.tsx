import { motion } from "motion/react";
import { ArrowLeft, FileX2, ShieldAlert } from "lucide-react";
import { useStoryState } from "../contexts/StoryStateContext";
import { getStoryWorldById } from "../data/storyDatabase";

interface ContentUnavailableScreenProps {
  /** The story id that was requested. Looked up here via getStoryWorldById — never fabricated. */
  storyId?: string;
  onBack: () => void;
}

/**
 * CONTENT UNAVAILABLE
 * SEEN by CREOVA
 *
 * Shown when a story is looked up by id but either does not exist in
 * storyDatabase.ts, or exists with a non-'public' `visibility`
 * ('institutional' | 'private'). Nothing in the browsing UI today
 * (Explore/Library/For You/Search) lists institutional or private stories —
 * getPublicStories()/getFeaturedStories() both filter to visibility ===
 * 'public' — so the only way to reach a restricted story is a direct id
 * (a stale search/notification/download entry, a hand-typed deep link,
 * etc). This component performs the same real lookup rather than accepting
 * a fabricated "removed" flag.
 */
export function ContentUnavailableScreen({ storyId, onBack }: ContentUnavailableScreenProps) {
  const { state } = useStoryState();
  const language = state.language as "en" | "fr" | "es";

  const story = storyId ? getStoryWorldById(storyId) : undefined;
  const reason: "not-found" | "restricted" = !story ? "not-found" : "restricted";

  const getText = (key: string) => {
    const translations: Record<string, Record<string, string>> = {
      titleNotFound: { en: "Content Unavailable", fr: "Contenu Indisponible", es: "Contenido No Disponible" },
      titleRestricted: { en: "Restricted Content", fr: "Contenu Restreint", es: "Contenido Restringido" },
      bodyNotFound: {
        en: "This story couldn't be found. It may have been removed or the link may be incorrect.",
        fr: "Cette histoire est introuvable. Elle a peut-être été supprimée ou le lien est incorrect.",
        es: "No se pudo encontrar esta historia. Puede que haya sido eliminada o el enlace sea incorrecto.",
      },
      bodyRestrictedInstitutional: {
        en: "This story is part of an institutional collection and isn't available in general browsing.",
        fr: "Cette histoire fait partie d'une collection institutionnelle et n'est pas disponible dans la navigation générale.",
        es: "Esta historia forma parte de una colección institucional y no está disponible en la navegación general.",
      },
      bodyRestrictedPrivate: {
        en: "This story is private and isn't available to view.",
        fr: "Cette histoire est privée et ne peut pas être consultée.",
        es: "Esta historia es privada y no se puede ver.",
      },
      back: { en: "Go Back", fr: "Retour", es: "Volver" },
    };
    return translations[key]?.[language] || translations[key]?.en || key;
  };

  const bodyText =
    reason === "not-found"
      ? getText("bodyNotFound")
      : story?.visibility === "institutional"
        ? getText("bodyRestrictedInstitutional")
        : getText("bodyRestrictedPrivate");

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
          <div className="flex items-center gap-3 p-5 pt-8">
            <button
              onClick={onBack}
              className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center hover:bg-white/10 transition-colors flex-shrink-0"
              aria-label="Back"
            >
              <ArrowLeft className="w-5 h-5 text-white" />
            </button>
          </div>
        </div>

        <div className="flex-1 flex flex-col items-center justify-center text-center px-6 gap-6 pb-24">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1, type: "spring", stiffness: 200 }}
            className={`w-20 h-20 rounded-2xl border flex items-center justify-center ${
              reason === "restricted"
                ? "bg-amber-500/10 border-amber-400/20"
                : "bg-white/5 border-white/10"
            }`}
          >
            {reason === "restricted" ? (
              <ShieldAlert className="w-9 h-9 text-amber-300/90" />
            ) : (
              <FileX2 className="w-9 h-9 text-white/50" />
            )}
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="space-y-3"
          >
            <h1 className="text-2xl tracking-tight text-white">
              {reason === "restricted" ? getText("titleRestricted") : getText("titleNotFound")}
            </h1>
            <p className="text-sm text-white/50 leading-relaxed max-w-[300px]">{bodyText}</p>
          </motion.div>

          <motion.button
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            onClick={onBack}
            className="px-6 py-3 rounded-full bg-white/5 border border-white/10 text-white text-sm tracking-wider uppercase hover:bg-white/10 transition-colors"
          >
            {getText("back")}
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
}
