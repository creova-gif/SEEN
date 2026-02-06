import { motion } from "motion/react";
import { ArrowLeft, Globe, Volume2, Eye, Bookmark, Download, Shield, ChevronRight } from "lucide-react";
import { useState } from "react";
import { useStoryState } from "../contexts/StoryStateContext";

interface SavedStory {
  id: string;
  title: string;
  thumbnailUrl: string;
  progress: number; // 0-100
}

interface ProfilePreferencesScreenProps {
  onClose?: () => void;
  onBack?: () => void;
  onOpenAccessibility?: () => void;
  onOpenAbout?: () => void;
  savedStories?: SavedStory[];
  onStoryClick?: (storyId: string) => void;
}

export function ProfilePreferencesScreen({
  onClose,
  onBack,
  onOpenAccessibility,
  onOpenAbout,
  savedStories = [], // Default to empty array
  onStoryClick
}: ProfilePreferencesScreenProps) {
  const { state, dispatch } = useStoryState();
  const [downloadedStories, setDownloadedStories] = useState<string[]>([]);
  
  // Use onBack if onClose is not provided
  const handleClose = onClose || onBack || (() => {});

  const getText = (key: string) => {
    const translations: Record<string, Record<string, string>> = {
      preferences: {
        en: "Preferences",
        fr: "Préférences",
        es: "Preferencias"
      },
      language: {
        en: "Language",
        fr: "Langue",
        es: "Idioma"
      },
      accessibility: {
        en: "Accessibility",
        fr: "Accessibilité",
        es: "Accesibilidad"
      },
      saved: {
        en: "Saved Stories",
        fr: "Histoires Sauvegardées",
        es: "Historias Guardadas"
      },
      offline: {
        en: "Offline Access",
        fr: "Accès Hors Ligne",
        es: "Acceso Sin Conexión"
      },
      privacy: {
        en: "Privacy & Data",
        fr: "Confidentialité et Données",
        es: "Privacidad y Datos"
      },
      about: {
        en: "About SEEN",
        fr: "À Propos de SEEN",
        es: "Acerca de SEEN"
      },
      audioQuality: {
        en: "Audio Quality",
        fr: "Qualité Audio",
        es: "Calidad de Audio"
      },
      autoplay: {
        en: "Auto-play chapters",
        fr: "Lecture automatique des chapitres",
        es: "Reproducción automática de capítulos"
      }
    };
    return translations[key]?.[state.language] || translations[key]?.en || key;
  };

  const languageOptions = [
    { code: 'en', name: 'English', nativeName: 'English' },
    { code: 'fr', name: 'French', nativeName: 'Français' },
    { code: 'es', name: 'Spanish', nativeName: 'Español' }
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black z-50 overflow-auto"
    >
      <div className="min-h-full max-w-[428px] mx-auto">
        {/* Header */}
        <div className="sticky top-0 z-10 backdrop-blur-xl bg-black/80 border-b border-white/5">
          <div className="flex items-center justify-between p-5 pt-8">
            <button
              onClick={handleClose}
              className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center hover:bg-white/10 transition-colors"
              aria-label="Close"
            >
              <ArrowLeft className="w-5 h-5 text-white" />
            </button>
            <h2 className="text-base tracking-tight text-white">
              {getText("preferences")}
            </h2>
            <div className="w-10" />
          </div>
        </div>

        {/* Content */}
        <div className="px-6 py-8 space-y-8">
          {/* Language selection */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="space-y-4"
          >
            <div className="flex items-center gap-2">
              <Globe className="w-4 h-4 text-white/40" />
              <h3 className="text-sm tracking-wider uppercase text-white/40">
                {getText("language")}
              </h3>
            </div>

            <div className="space-y-2">
              {languageOptions.map((lang) => (
                <button
                  key={lang.code}
                  onClick={() => dispatch({ type: 'SET_LANGUAGE', language: lang.code as any })}
                  className={`
                    w-full p-4 rounded-xl text-left transition-all border
                    ${state.language === lang.code
                      ? 'border-white/30 bg-white/10'
                      : 'border-white/10 bg-white/5 hover:bg-white/10'
                    }
                  `}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-sm text-white mb-0.5">
                        {lang.nativeName}
                      </h4>
                      <p className="text-xs text-white/50">
                        {lang.name}
                      </p>
                    </div>
                    {state.language === lang.code && (
                      <div className="w-5 h-5 rounded-full bg-white flex items-center justify-center">
                        <div className="w-2 h-2 rounded-full bg-black" />
                      </div>
                    )}
                  </div>
                </button>
              ))}
            </div>
          </motion.section>

          {/* Accessibility shortcut */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <button
              onClick={onOpenAccessibility}
              className="w-full p-4 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all text-left"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-blue-500/20 border border-blue-400/30 flex items-center justify-center">
                    <Eye className="w-5 h-5 text-blue-300" />
                  </div>
                  <div>
                    <h3 className="text-sm text-white mb-0.5">
                      {getText("accessibility")}
                    </h3>
                    <p className="text-xs text-white/50">
                      {state.language === 'en' 
                        ? 'Contrast, captions, motion'
                        : state.language === 'fr'
                        ? 'Contraste, sous-titres, mouvement'
                        : 'Contraste, subtítulos, movimiento'
                      }
                    </p>
                  </div>
                </div>
                <ChevronRight className="w-5 h-5 text-white/30" />
              </div>
            </button>
          </motion.section>

          {/* Audio preferences */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="space-y-4"
          >
            <div className="flex items-center gap-2">
              <Volume2 className="w-4 h-4 text-white/40" />
              <h3 className="text-sm tracking-wider uppercase text-white/40">
                {state.language === 'en' ? 'Audio' : state.language === 'fr' ? 'Audio' : 'Audio'}
              </h3>
            </div>

            <div className="space-y-3">
              {/* Audio quality */}
              <div className="p-4 rounded-xl bg-white/5 border border-white/10">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-sm text-white/70">
                    {getText("audioQuality")}
                  </span>
                  <span className="text-xs text-white/40">
                    {state.language === 'en' ? 'High' : state.language === 'fr' ? 'Élevée' : 'Alta'}
                  </span>
                </div>
                <div className="flex gap-2">
                  {['Low', 'Medium', 'High'].map((quality) => (
                    <button
                      key={quality}
                      className={`
                        flex-1 py-2 rounded-lg text-xs transition-all
                        ${quality === 'High'
                          ? 'bg-white/10 text-white border border-white/20'
                          : 'bg-white/5 text-white/50 border border-white/10 hover:bg-white/10'
                        }
                      `}
                    >
                      {quality}
                    </button>
                  ))}
                </div>
              </div>

              {/* Auto-play toggle */}
              <label className="flex items-center justify-between p-4 rounded-xl bg-white/5 border border-white/10 cursor-pointer hover:bg-white/10 transition-colors">
                <span className="text-sm text-white/70">
                  {getText("autoplay")}
                </span>
                <input
                  type="checkbox"
                  defaultChecked
                  className="w-5 h-5 rounded border-white/20 bg-white/10 text-white focus:ring-white/20"
                />
              </label>
            </div>
          </motion.section>

          {/* Saved stories */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="space-y-4"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Bookmark className="w-4 h-4 text-white/40" />
                <h3 className="text-sm tracking-wider uppercase text-white/40">
                  {getText("saved")}
                </h3>
              </div>
              <span className="text-xs text-white/30">
                {savedStories.length}
              </span>
            </div>

            {savedStories.length > 0 ? (
              <div className="grid grid-cols-3 gap-3">
                {savedStories.map((story, index) => (
                  <motion.button
                    key={story.id}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.5 + index * 0.05 }}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => onStoryClick?.(story.id)}
                    className="relative aspect-square rounded-lg overflow-hidden group"
                  >
                    <img
                      src={story.thumbnailUrl}
                      alt={story.title}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-colors" />
                    
                    {/* Progress bar */}
                    {story.progress > 0 && (
                      <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/20">
                        <div
                          className="h-full bg-white"
                          style={{ width: `${story.progress}%` }}
                        />
                      </div>
                    )}

                    {/* Download indicator */}
                    {downloadedStories.includes(story.id) && (
                      <div className="absolute top-2 right-2">
                        <div className="w-5 h-5 rounded-full bg-green-500/80 flex items-center justify-center">
                          <Download className="w-3 h-3 text-white" />
                        </div>
                      </div>
                    )}
                  </motion.button>
                ))}
              </div>
            ) : (
              <div className="p-8 rounded-xl bg-white/5 border border-white/10 text-center">
                <Bookmark className="w-8 h-8 text-white/20 mx-auto mb-3" />
                <p className="text-sm text-white/40">
                  {state.language === 'en' 
                    ? 'No saved stories yet'
                    : state.language === 'fr'
                    ? 'Aucune histoire sauvegardée'
                    : 'Aún no hay historias guardadas'
                  }
                </p>
              </div>
            )}
          </motion.section>

          {/* Privacy & Data */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="space-y-3"
          >
            <div className="flex items-center gap-2">
              <Shield className="w-4 h-4 text-white/40" />
              <h3 className="text-sm tracking-wider uppercase text-white/40">
                {getText("privacy")}
              </h3>
            </div>

            <div className="p-5 rounded-xl bg-gradient-to-br from-purple-500/10 to-blue-500/10 border border-white/10">
              <p className="text-xs text-white/70 leading-relaxed mb-3">
                {state.language === 'en' 
                  ? 'SEEN stores all preferences locally. We never track individual behavior, viewing patterns, or engagement metrics. Your stories, your data, your privacy.'
                  : state.language === 'fr'
                  ? "SEEN stocke toutes les préférences localement. Nous ne suivons jamais le comportement individuel, les modèles de visionnage ou les métriques d'engagement. Vos histoires, vos données, votre vie privée."
                  : 'SEEN almacena todas las preferencias localmente. Nunca rastreamos el comportamiento individual, los patrones de visualización o las métricas de participación. Tus historias, tus datos, tu privacidad.'
                }
              </p>
              <button className="text-xs text-white/50 hover:text-white/70 transition-colors underline">
                {state.language === 'en' ? 'Read full privacy policy' : state.language === 'fr' ? 'Lire la politique complète' : 'Leer política completa'}
              </button>
            </div>
          </motion.section>

          {/* About link */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
          >
            <button
              onClick={onOpenAbout}
              className="w-full p-4 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all text-left"
            >
              <div className="flex items-center justify-between">
                <span className="text-sm text-white/70">
                  {getText("about")}
                </span>
                <ChevronRight className="w-5 h-5 text-white/30" />
              </div>
            </button>
          </motion.section>

          {/* Version info */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.9 }}
            className="text-center pt-8 border-t border-white/5"
          >
            <p className="text-xs text-white/30">
              SEEN v1.0.0 • CREOVA
            </p>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
}