import { motion } from "motion/react";
import { WifiOff } from "lucide-react";
import { useStoryState } from "../contexts/StoryStateContext";

interface NetworkErrorStateProps {
  /** Called when the visitor taps "Try Again". */
  onRetry: () => void;
  /** Optional secondary action, e.g. dismiss / continue with cached data. Omit to hide the link. */
  onDismiss?: () => void;
  /**
   * Render as a full-screen overlay (fixed inset-0, matches SearchScreen /
   * NotificationsScreen conventions) or as an inline block a parent can drop
   * into an existing layout (e.g. in place of a list that failed to load).
   * Defaults to true.
   */
  fullScreen?: boolean;
  /** Override the default localized heading. */
  title?: string;
  /** Override the default localized body copy. */
  message?: string;
}

/**
 * Generic network-error fallback: icon + message + retry action. This app's
 * data is entirely static/local (no `fetch` calls exist in src/app at the
 * time this was written), so there is currently no live code path that would
 * trigger this today. It's built as a ready-to-use fallback for the day a
 * real network call is added (e.g. a future backend for auth, sync, or
 * remote content), and can double as an onError fallback for the audio
 * player (src/app/hooks/useAudioPlayer.ts currently only console.errors a
 * failed play() call with no user-facing UI).
 */
export function NetworkErrorState({
  onRetry,
  onDismiss,
  fullScreen = true,
  title,
  message,
}: NetworkErrorStateProps) {
  const { state } = useStoryState();
  const language = state.language as "en" | "fr" | "es";

  const getText = (key: string) => {
    const translations: Record<string, Record<string, string>> = {
      label: { en: "Network Error", fr: "Erreur Réseau", es: "Error de Red" },
      heading: { en: "Connection interrupted", fr: "Connexion interrompue", es: "Conexión interrumpida" },
      body: {
        en: "Unable to reach SEEN. Check your connection and try again.",
        fr: "Impossible de joindre SEEN. Vérifiez votre connexion et réessayez.",
        es: "No se pudo conectar con SEEN. Revisa tu conexión e inténtalo de nuevo.",
      },
      retry: { en: "Try Again", fr: "Réessayer", es: "Reintentar" },
      dismiss: { en: "Continue Offline", fr: "Continuer Hors Ligne", es: "Continuar Sin Conexión" },
    };
    return translations[key]?.[language] || translations[key]?.en || key;
  };

  const content = (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col items-center text-center gap-4 px-6"
    >
      <div className="w-16 h-16 rounded-full bg-white/5 border border-white/10 flex items-center justify-center">
        <WifiOff className="w-6 h-6 text-white/40" />
      </div>

      <div className="space-y-2">
        <p className="text-xs tracking-wider uppercase text-amber-300/80">{getText("label")}</p>
        <h2 className="text-2xl tracking-tight text-white">{title ?? getText("heading")}</h2>
        <p className="text-sm text-white/50 leading-relaxed max-w-[280px] mx-auto">
          {message ?? getText("body")}
        </p>
      </div>

      <div className="w-full max-w-[280px] space-y-3 pt-2">
        <button
          onClick={onRetry}
          className="w-full py-4 rounded-full bg-white text-black text-sm tracking-wider uppercase hover:bg-white/90 transition-colors"
        >
          {getText("retry")}
        </button>
        {onDismiss && (
          <button
            onClick={onDismiss}
            className="w-full py-2 text-sm text-white/40 hover:text-white/70 underline underline-offset-2 transition-colors"
          >
            {getText("dismiss")}
          </button>
        )}
      </div>
    </motion.div>
  );

  if (!fullScreen) {
    return <div className="flex items-center justify-center py-16">{content}</div>;
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black z-50 flex items-center justify-center"
    >
      <div className="w-full max-w-[428px] mx-auto flex items-center justify-center">{content}</div>
    </motion.div>
  );
}
