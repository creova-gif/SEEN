import { motion, AnimatePresence } from "motion/react";
import { Lock, LogOut } from "lucide-react";
import { useState } from "react";
import { useStoryState } from "../contexts/StoryStateContext";
import { useDialogA11y } from "../hooks/useDialogA11y";

export interface LogoutConfirmationModalProps {
  isOpen: boolean;
  /** "Stay" — dismiss without signing out. */
  onClose: () => void;
  /**
   * "Leave the archive" — invoke the caller's existing sign-out flow
   * (e.g. ProfileScreen's handleSignOut). This component is only a
   * confirmation gate; it never implements sign-out itself.
   */
  onConfirm: () => void | Promise<void>;
}

/**
 * Confirmation modal shown before signing out. Renders in front of whatever
 * screen triggers it (local `isOpen` state owned by the caller) — it is not
 * a routed AppScreen.
 */
export function LogoutConfirmationModal({ isOpen, onClose, onConfirm }: LogoutConfirmationModalProps) {
  const { state } = useStoryState();
  const language = state.language as "en" | "fr" | "es";
  const dialogRef = useDialogA11y(isOpen, onClose);
  const [isLeaving, setIsLeaving] = useState(false);

  const getText = (key: string) => {
    const translations: Record<string, Record<string, string>> = {
      eyebrow: { en: "System", fr: "Système", es: "Sistema" },
      title: { en: "Leave the archive?", fr: "Quitter l'archive ?", es: "¿Salir del archivo?" },
      body: {
        en: "Your stories, collections, and progress will be preserved. You can return anytime.",
        fr: "Vos histoires, collections et progression seront conservées. Vous pouvez revenir à tout moment.",
        es: "Tus historias, colecciones y progreso se conservarán. Puedes volver en cualquier momento.",
      },
      leave: { en: "Leave Archive", fr: "Quitter l'Archive", es: "Salir del Archivo" },
      stay: { en: "Stay", fr: "Rester", es: "Quedarse" },
    };
    return translations[key]?.[language] || translations[key]?.en || key;
  };

  const handleConfirm = async () => {
    setIsLeaving(true);
    try {
      await onConfirm();
    } finally {
      setIsLeaving(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={isLeaving ? undefined : onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
          />

          <motion.div
            ref={dialogRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby="logout-confirmation-title"
            aria-describedby="logout-confirmation-body"
            tabIndex={-1}
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="fixed bottom-8 left-4 right-4 md:left-1/2 md:-translate-x-1/2 md:w-full md:max-w-[420px] z-50 outline-none"
          >
            <div className="bg-black/95 backdrop-blur-xl border border-white/20 rounded-2xl overflow-hidden shadow-2xl p-6">
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs tracking-wider uppercase text-white/40">{getText("eyebrow")}</span>
                <div className="w-8 h-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center">
                  <Lock className="w-4 h-4 text-white/50" />
                </div>
              </div>

              <h3 id="logout-confirmation-title" className="text-xl tracking-tight text-white mb-2">
                {getText("title")}
              </h3>
              <p id="logout-confirmation-body" className="text-sm text-white/60 leading-relaxed mb-6">
                {getText("body")}
              </p>

              <div className="space-y-2">
                <button
                  onClick={handleConfirm}
                  disabled={isLeaving}
                  className="w-full py-4 rounded-full bg-white text-black text-sm tracking-wider uppercase hover:bg-white/90 transition-colors disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  <LogOut className="w-4 h-4" />
                  {getText("leave")}
                </button>
                <button
                  onClick={onClose}
                  disabled={isLeaving}
                  className="w-full py-4 rounded-full bg-white/5 border border-white/10 text-white text-sm tracking-wider uppercase hover:bg-white/10 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  {getText("stay")}
                </button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
