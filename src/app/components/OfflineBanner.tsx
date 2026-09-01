import { motion, AnimatePresence } from "motion/react";
import { WifiOff } from "lucide-react";
import { useEffect, useState } from "react";
import { useStoryState } from "../contexts/StoryStateContext";

/**
 * OFFLINE INDICATOR
 *
 * This is distinct from the existing "download for offline viewing" feature
 * (FeaturedStoryPreview's handleDownload/loadDownloads, backed by the
 * `seen_downloads` localStorage key and surfaced in NotificationsScreen and
 * LibraryScreen) — that feature already exists and is not rebuilt here.
 *
 * This component answers a different question: "is this device's network
 * connection currently up?" It is driven by the real, browser-native
 * `navigator.onLine` property plus the `online`/`offline` window events, so
 * the banner genuinely appears and disappears as connectivity changes (e.g.
 * toggling airplane mode, or the network throttling panel in devtools) —
 * nothing about it is simulated.
 *
 * Renders nothing at all while online, so it is safe to mount once near the
 * root of the app (see wiring notes) and have it apply across every screen.
 */
export function useIsOnline(): boolean {
  const [isOnline, setIsOnline] = useState(() => (typeof navigator === "undefined" ? true : navigator.onLine));

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);
    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  return isOnline;
}

interface OfflineBannerProps {
  className?: string;
}

export function OfflineBanner({ className = "" }: OfflineBannerProps) {
  const isOnline = useIsOnline();
  const { state } = useStoryState();
  const language = state.language as "en" | "fr" | "es";

  const getText = (key: string) => {
    const translations: Record<string, Record<string, string>> = {
      title: { en: "You are currently offline", fr: "Vous êtes actuellement hors ligne", es: "Actualmente estás sin conexión" },
      subtitle: { en: "Some features may be limited", fr: "Certaines fonctionnalités peuvent être limitées", es: "Algunas funciones pueden estar limitadas" },
    };
    return translations[key]?.[language] || translations[key]?.en || key;
  };

  return (
    <AnimatePresence>
      {!isOnline && (
        <motion.div
          initial={{ opacity: 0, y: -12, height: 0 }}
          animate={{ opacity: 1, y: 0, height: "auto" }}
          exit={{ opacity: 0, y: -12, height: 0 }}
          transition={{ duration: 0.3 }}
          role="status"
          aria-live="polite"
          className={`overflow-hidden ${className}`}
        >
          <div className="flex items-start gap-3 px-5 py-3 bg-amber-500/15 border-b border-amber-500/30">
            <WifiOff className="w-4 h-4 text-amber-300 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm text-amber-200 leading-tight">{getText("title")}</p>
              <p className="text-xs text-amber-200/60 leading-tight mt-0.5">{getText("subtitle")}</p>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
