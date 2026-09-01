import { motion, AnimatePresence } from "motion/react";
import { Bookmark } from "lucide-react";
import { useStoryState } from "../contexts/StoryStateContext";
import { useDialogA11y } from "../hooks/useDialogA11y";

interface GuestSignupPromptModalProps {
  /** Controls visibility. The component renders nothing (and traps no focus) when false. */
  isOpen: boolean;
  /** "Continue exploring as guest" — dismiss without taking any action. Also fires on Escape/backdrop click. */
  onClose: () => void;
  /** "Create Account" — should route the caller to the real sign-up entry point. */
  onCreateAccount: () => void;
  /** "Sign In" — should route the caller to the real sign-in entry point. */
  onSignIn: () => void;
}

/**
 * Bottom-sheet prompt encouraging a guest/unauthenticated visitor to create a
 * real account. This app has no formal "guest" auth state (see App.tsx's
 * handleGuestPreview, which only ever writes a `guest_mode` localStorage flag
 * that nothing else reads) — this component is a generic, reusable prompt
 * that any screen can show whenever it detects `!authState.isAuthenticated`
 * at a moment that calls for an account (saving, downloading, viewing a
 * profile, etc). It does not read auth state itself; the caller decides when
 * to render it.
 */
export function GuestSignupPromptModal({
  isOpen,
  onClose,
  onCreateAccount,
  onSignIn,
}: GuestSignupPromptModalProps) {
  const { state } = useStoryState();
  const language = state.language as "en" | "fr" | "es";
  const dialogRef = useDialogA11y(isOpen, onClose);

  const getText = (key: string) => {
    const translations: Record<string, Record<string, string>> = {
      heading: { en: "Save to your archive", fr: "Enregistrer dans vos archives", es: "Guardar en tu archivo" },
      body: {
        en: "Create a free account to save stories, build collections, and continue where you left off.",
        fr: "Créez un compte gratuit pour enregistrer des histoires, créer des collections et reprendre là où vous vous êtes arrêté.",
        es: "Crea una cuenta gratis para guardar historias, crear colecciones y continuar donde lo dejaste.",
      },
      createAccount: { en: "Create Account", fr: "Créer un Compte", es: "Crear Cuenta" },
      signIn: { en: "Sign In", fr: "Se Connecter", es: "Iniciar Sesión" },
      continueGuest: { en: "Continue exploring as guest", fr: "Continuer en tant qu'invité", es: "Continuar como invitado" },
    };
    return translations[key]?.[language] || translations[key]?.en || key;
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/70 backdrop-blur-sm z-40"
          />

          <motion.div
            ref={dialogRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby="guest-signup-prompt-heading"
            tabIndex={-1}
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 40 }}
            transition={{ type: "spring", damping: 28, stiffness: 300 }}
            className="fixed bottom-0 left-0 right-0 md:left-1/2 md:-translate-x-1/2 md:bottom-8 md:max-w-[420px] z-50 outline-none"
          >
            <div className="bg-black border-t md:border border-white/10 rounded-t-3xl md:rounded-3xl px-6 pt-6 pb-8 max-w-[428px] mx-auto">
              <div className="w-10 h-1 rounded-full bg-white/20 mx-auto mb-6" />

              <div className="flex flex-col items-center text-center gap-4">
                <div className="w-14 h-14 rounded-full bg-white/5 border border-white/10 flex items-center justify-center">
                  <Bookmark className="w-6 h-6 text-white/80" />
                </div>

                <div className="space-y-2">
                  <h2 id="guest-signup-prompt-heading" className="text-xl tracking-tight text-white">
                    {getText("heading")}
                  </h2>
                  <p className="text-sm text-white/50 leading-relaxed max-w-[300px]">{getText("body")}</p>
                </div>
              </div>

              <div className="mt-6 space-y-3">
                <button
                  onClick={onCreateAccount}
                  className="w-full py-4 rounded-full bg-white text-black text-sm tracking-wider uppercase hover:bg-white/90 transition-colors"
                >
                  {getText("createAccount")}
                </button>
                <button
                  onClick={onSignIn}
                  className="w-full py-4 rounded-full bg-white/5 border border-white/15 text-white text-sm tracking-wider uppercase hover:bg-white/10 transition-colors"
                >
                  {getText("signIn")}
                </button>
                <button
                  onClick={onClose}
                  className="w-full py-2 text-sm text-white/40 hover:text-white/70 underline underline-offset-2 transition-colors"
                >
                  {getText("continueGuest")}
                </button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
