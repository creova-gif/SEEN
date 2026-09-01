import { useEffect, useState, type RefObject } from "react";
import { motion, AnimatePresence } from "motion/react";
import { ArrowLeft, AlertTriangle } from "lucide-react";
import { useStoryState } from "../contexts/StoryStateContext";

interface MediaPlaybackErrorScreenProps {
  /** Ref to the actual `HTMLAudioElement` (a rendered `<audio>` tag, or a `new Audio()`
   *  instance such as the one `useAudioPlayer.ts` creates) currently playing the chapter. */
  audioRef: RefObject<HTMLAudioElement | null>;
  /**
   * Any value that changes whenever `audioRef.current` is swapped for a new
   * Audio element (e.g. the current chapter id, or its audio src). Refs don't
   * trigger re-renders on their own, so this tells the component when to drop
   * its listeners on the old element and attach fresh ones to the new one.
   * Pass something like `currentChapter.id`.
   */
  watchKey: string | number;
  /** e.g. "Chapter II · The First Warp" */
  chapterLabel?: string;
  /** e.g. "The Silent Weaver" */
  chapterTitle?: string;
  onBack?: () => void;
  onSkipChapter?: () => void;
  onSwitchToTextMode?: () => void;
}

/**
 * Renders itself only in response to a REAL `error` event fired by the given
 * `<audio>` element — never on a fabricated/simulated condition. Clears again
 * once the same element reports `playing`/`canplay`. "Try Again" calls the
 * standard recovery sequence for a stalled/failed HTMLMediaElement: `.load()`
 * then `.play()` on that same element (per the MDN-documented pattern for
 * recovering from a MediaError).
 */
export function MediaPlaybackErrorScreen({
  audioRef,
  watchKey,
  chapterLabel,
  chapterTitle,
  onBack,
  onSkipChapter,
  onSwitchToTextMode,
}: MediaPlaybackErrorScreenProps) {
  const { state } = useStoryState();
  const language = state.language;
  const [visible, setVisible] = useState(false);
  const [retrying, setRetrying] = useState(false);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const handleError = () => {
      setVisible(true);
      setRetrying(false);
    };
    const handleRecovered = () => {
      setVisible(false);
      setRetrying(false);
    };

    audio.addEventListener("error", handleError);
    audio.addEventListener("playing", handleRecovered);
    audio.addEventListener("canplay", handleRecovered);

    // Covers the case where the element already had a MediaError before this
    // component mounted (e.g. it failed during the very first load).
    if (audio.error) handleError();

    return () => {
      audio.removeEventListener("error", handleError);
      audio.removeEventListener("playing", handleRecovered);
      audio.removeEventListener("canplay", handleRecovered);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [audioRef.current, watchKey]);

  const getText = (key: string) => {
    const translations: Record<string, Record<string, string>> = {
      label: { en: "Playback Error", fr: "Erreur de Lecture", es: "Error de Reproducción" },
      title: { en: "Unable to Load Audio", fr: "Impossible de Charger l'Audio", es: "No se Pudo Cargar el Audio" },
      body: {
        en: "The audio track could not be loaded. This may be due to a network issue or the content being temporarily unavailable.",
        fr: "La piste audio n'a pas pu être chargée. Cela peut être dû à un problème de réseau ou au contenu temporairement indisponible.",
        es: "No se pudo cargar la pista de audio. Esto puede deberse a un problema de red o a que el contenido no está disponible temporalmente.",
      },
      retry: { en: "Try Again", fr: "Réessayer", es: "Intentar de Nuevo" },
      skip: { en: "Skip to Next Chapter", fr: "Passer au Chapitre Suivant", es: "Saltar al Siguiente Capítulo" },
      textMode: { en: "Switch to Text Mode", fr: "Passer en Mode Texte", es: "Cambiar a Modo Texto" },
      back: { en: "Back", fr: "Retour", es: "Atrás" },
    };
    return translations[key]?.[language] || translations[key]?.en || key;
  };

  const handleSwitchToTextMode = () => {
    // The chapter's text content is already rendered behind this overlay —
    // "text mode" here means dismissing the audio error so the viewer can
    // keep reading and use the normal chapter controls, since there is no
    // separate text-only screen to navigate to.
    setVisible(false);
    onSwitchToTextMode?.();
  };

  const handleRetry = () => {
    const audio = audioRef.current;
    if (!audio) return;
    setRetrying(true);
    audio.load();
    audio
      .play()
      .then(() => {
        setVisible(false);
        setRetrying(false);
      })
      .catch(() => {
        // The 'error' listener above will re-fire on a real failure and keep
        // this screen visible; this catch only avoids an unhandled rejection.
        setRetrying(false);
      });
  };

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black z-50 overflow-auto"
          role="alert"
        >
          <div className="min-h-full max-w-[428px] mx-auto flex flex-col">
            {onBack && (
              <div className="p-5 pt-8">
                <button
                  onClick={onBack}
                  className="flex items-center gap-2 text-white/60 hover:text-white transition-colors text-xs tracking-wider uppercase"
                >
                  <ArrowLeft className="w-4 h-4" />
                  {getText("back")}
                </button>
              </div>
            )}

            {(chapterLabel || chapterTitle) && (
              <div className="px-6 pt-2">
                {chapterLabel && (
                  <p className="text-xs tracking-wider uppercase text-amber-300/80 mb-1">{chapterLabel}</p>
                )}
                {chapterTitle && <h1 className="text-xl text-white tracking-tight">{chapterTitle}</h1>}
              </div>
            )}

            <div className="flex-1 flex flex-col items-center justify-center px-6 text-center gap-5">
              <div className="w-20 h-20 rounded-full bg-amber-500/10 border border-amber-400/40 flex items-center justify-center">
                <AlertTriangle className="w-8 h-8 text-amber-300" strokeWidth={1.5} />
              </div>
              <p className="text-xs tracking-[0.2em] uppercase text-amber-300">{getText("label")}</p>
              <h2 className="text-2xl tracking-tight text-white">{getText("title")}</h2>
              <p className="text-sm text-white/60 leading-relaxed max-w-[300px]">{getText("body")}</p>
            </div>

            <div className="px-6 pb-8 space-y-3">
              <button
                onClick={handleRetry}
                disabled={retrying}
                className="w-full py-4 rounded-full bg-amber-400 text-black text-sm tracking-wider uppercase hover:bg-amber-300 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {retrying ? "…" : getText("retry")}
              </button>
              {onSkipChapter && (
                <button
                  onClick={onSkipChapter}
                  className="w-full py-4 rounded-full bg-white/5 border border-white/10 text-white text-sm tracking-wider uppercase hover:bg-white/10 transition-colors"
                >
                  {getText("skip")}
                </button>
              )}
              {onSwitchToTextMode && (
                <button
                  onClick={handleSwitchToTextMode}
                  className="w-full text-center text-xs tracking-wider uppercase text-amber-300/90 underline underline-offset-4 hover:text-amber-200 transition-colors pt-1"
                >
                  {getText("textMode")}
                </button>
              )}
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
