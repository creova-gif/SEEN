import { motion, AnimatePresence } from "motion/react";
import { ArrowUpCircle, Sparkles } from "lucide-react";
import { useStoryState } from "../contexts/StoryStateContext";
import { useDialogA11y } from "../hooks/useDialogA11y";

interface AppUpdateModalProps {
  isOpen: boolean;
  /** "Later" — dismiss without doing anything. */
  onDismiss: () => void;
  /** Version label to display, e.g. "v1.1.0". Defaults to the app's current version string. */
  version?: string;
}

/**
 * APP UPDATE PROMPT
 *
 * SEEN is a web SPA with no app-store/binary update mechanism, no update
 * server, and no version-check API — there is nothing that could ever detect
 * a "new version is available" in this build. This component is therefore a
 * static, UI-only prompt matching the Figma design (node 33:369): the copy
 * is generic marketing text, not real release notes pulled from anywhere.
 * "Update Now" performs the closest real, honest action available in a web
 * app — a full page reload, which on a real deployment would fetch whatever
 * the latest deployed build is — and "Later" just dismisses the modal.
 * There is no real forced/required-update enforcement, so (unlike the Figma
 * mock, which shows a "must install within 7 days" deadline) this component
 * does not claim one.
 */
export function AppUpdateModal({ isOpen, onDismiss, version = "v1.1.0" }: AppUpdateModalProps) {
  const { state } = useStoryState();
  const dialogRef = useDialogA11y(isOpen, onDismiss);
  const language = state.language as "en" | "fr" | "es";

  const getText = (key: string) => {
    const translations: Record<string, Record<string, string>> = {
      eyebrow: { en: "System Update", fr: "Mise à Jour Système", es: "Actualización del Sistema" },
      title: { en: "Update Available", fr: "Mise à Jour Disponible", es: "Actualización Disponible" },
      bullet1: { en: "Enhanced audio layers", fr: "Couches audio améliorées", es: "Capas de audio mejoradas" },
      bullet2: { en: "New community features", fr: "Nouvelles fonctionnalités communautaires", es: "Nuevas funciones comunitarias" },
      bullet3: { en: "Security improvements", fr: "Améliorations de sécurité", es: "Mejoras de seguridad" },
      updateNow: { en: "Update Now", fr: "Mettre à Jour", es: "Actualizar Ahora" },
      later: { en: "Remind Me Later", fr: "Me le Rappeler Plus Tard", es: "Recordarme Después" },
      note: {
        en: "SEEN is a web app with no update server in this build — “Update Now” simply reloads the page to fetch the latest deployed version.",
        fr: "SEEN est une application web sans serveur de mise à jour dans cette version — « Mettre à jour » recharge simplement la page pour récupérer la dernière version déployée.",
        es: "SEEN es una aplicación web sin servidor de actualizaciones en esta versión — «Actualizar ahora» simplemente recarga la página para obtener la última versión publicada.",
      },
    };
    return translations[key]?.[language] || translations[key]?.en || key;
  };

  const handleUpdateNow = () => {
    window.location.reload();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onDismiss}
            className="fixed inset-0 bg-black/70 backdrop-blur-sm z-40"
          />

          <motion.div
            ref={dialogRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby="app-update-title"
            tabIndex={-1}
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="fixed left-4 right-4 top-1/2 -translate-y-1/2 md:left-1/2 md:-translate-x-1/2 md:right-auto md:w-full md:max-w-[380px] z-50 outline-none"
          >
            <div className="p-6 rounded-2xl bg-black border border-white/10 shadow-2xl text-center">
              <div className="w-14 h-14 rounded-full bg-amber-500/10 border border-amber-500/30 flex items-center justify-center mx-auto mb-4">
                <ArrowUpCircle className="w-7 h-7 text-amber-300" />
              </div>

              <p className="text-xs tracking-wider uppercase text-amber-300/80 mb-1">{getText("eyebrow")}</p>
              <h2 id="app-update-title" className="text-xl tracking-tight text-white mb-1">
                {getText("title")}
              </h2>
              <p className="text-xs text-white/40 mb-5">{version}</p>

              <div className="border-t border-white/10 pt-5 mb-6 space-y-2.5 text-left">
                {["bullet1", "bullet2", "bullet3"].map((key) => (
                  <div key={key} className="flex items-start gap-2.5">
                    <Sparkles className="w-3.5 h-3.5 text-amber-300/80 flex-shrink-0 mt-0.5" />
                    <span className="text-sm text-white/70">{getText(key)}</span>
                  </div>
                ))}
              </div>

              <button
                onClick={handleUpdateNow}
                className="w-full py-4 rounded-full bg-white text-black text-sm tracking-wider uppercase hover:bg-white/90 transition-colors mb-3"
              >
                {getText("updateNow")}
              </button>
              <button
                onClick={onDismiss}
                className="w-full py-2 text-sm text-white/50 hover:text-white/80 transition-colors"
              >
                {getText("later")}
              </button>

              <p className="mt-5 pt-4 border-t border-white/5 text-[11px] text-white/30 leading-relaxed">
                {getText("note")}
              </p>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
