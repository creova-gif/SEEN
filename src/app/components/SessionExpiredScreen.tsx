import { motion } from "motion/react";
import { LockKeyhole, LogIn } from "lucide-react";
import { useState } from "react";
import { useStoryState } from "../contexts/StoryStateContext";
import { useAuth } from "../contexts/AuthContext";

interface SessionExpiredScreenProps {
  /**
   * Called after signOut() has resolved. The caller navigates from here to
   * wherever sign-in lives (currently the "account" step inside
   * OnboardingSystem — see integration notes in the report).
   */
  onSignInAgain: () => void;
}

/**
 * SESSION EXPIRED
 * SEEN by CREOVA
 *
 * NOTE ON REALISM: AuthContext.tsx's local-storage auth has no TTL/expiry —
 * a session token is valid forever until signOut() is called explicitly, and
 * `checkSession()` only invalidates it if the underlying user record itself
 * was deleted from the local "database". So nothing in the app today can
 * actually cause this screen to appear on its own. It is built as a
 * ready-to-use, honestly-non-fabricated UI: the "Sign In Again" action does
 * real work (calls the real signOut()), it is just not wired to any trigger
 * yet. See the report for exactly where a real TTL check could hook in if
 * one is ever added.
 */
export function SessionExpiredScreen({ onSignInAgain }: SessionExpiredScreenProps) {
  const { state } = useStoryState();
  const { signOut } = useAuth();
  const [signingOut, setSigningOut] = useState(false);
  const language = state.language as "en" | "fr" | "es";

  const getText = (key: string) => {
    const translations: Record<string, Record<string, string>> = {
      title: { en: "Session Expired", fr: "Session Expirée", es: "Sesión Expirada" },
      message: {
        en: "Your session has expired for your security. Please sign in again to continue.",
        fr: "Votre session a expiré pour votre sécurité. Veuillez vous reconnecter pour continuer.",
        es: "Tu sesión ha expirado por tu seguridad. Vuelve a iniciar sesión para continuar.",
      },
      signInAgain: { en: "Sign In Again", fr: "Se Reconnecter", es: "Volver a Iniciar Sesión" },
      signingOut: { en: "Signing out…", fr: "Déconnexion…", es: "Cerrando sesión…" },
    };
    return translations[key]?.[language] || translations[key]?.en || key;
  };

  const handleSignInAgain = async () => {
    setSigningOut(true);
    try {
      await signOut();
    } finally {
      setSigningOut(false);
      onSignInAgain();
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black z-50 flex flex-col items-center justify-center px-6"
    >
      <div className="w-full max-w-[428px] mx-auto flex flex-col items-center text-center gap-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1, type: "spring", stiffness: 200 }}
          className="w-20 h-20 rounded-2xl bg-amber-500/10 border border-amber-400/20 flex items-center justify-center"
        >
          <LockKeyhole className="w-9 h-9 text-amber-300/90" />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="space-y-3"
        >
          <h1 className="text-2xl tracking-tight text-white">{getText("title")}</h1>
          <p className="text-sm text-white/50 leading-relaxed max-w-[300px]">{getText("message")}</p>
        </motion.div>

        <motion.button
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          onClick={handleSignInAgain}
          disabled={signingOut}
          className="w-full py-4 rounded-full bg-white text-black text-sm tracking-wider uppercase hover:bg-white/90 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
        >
          <LogIn className="w-4 h-4" />
          {signingOut ? getText("signingOut") : getText("signInAgain")}
        </motion.button>
      </div>
    </motion.div>
  );
}
