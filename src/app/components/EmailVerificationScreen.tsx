import { motion } from "motion/react";
import { ArrowLeft, MailCheck, ExternalLink, RefreshCw, Info } from "lucide-react";
import { useState } from "react";
import { useStoryState } from "../contexts/StoryStateContext";
import { useAuth } from "../contexts/AuthContext";

interface EmailVerificationScreenProps {
  onBack: () => void;
  /** Called when the user chooses to move on without verifying (there is no real gate to pass). */
  onContinue?: () => void;
}

/**
 * EMAIL VERIFICATION
 *
 * SEEN's authentication (see AuthContext.tsx) is local-storage only — there
 * is no backend and no email provider connected, so no verification email
 * was ever actually sent and no account is ever actually "unverified" in a
 * way that blocks access. This screen is an honest UI-only presentation of
 * the Figma design (node 29:54): it shows the account's real email address,
 * lets the user open their mail client for real (a genuine `mailto:` action),
 * and is explicit that "Resend Verification" cannot do anything real in this
 * build rather than faking a success state. Nothing here blocks navigation —
 * see the wiring notes for how a caller should treat "continue" as always
 * available.
 */
export function EmailVerificationScreen({ onBack, onContinue }: EmailVerificationScreenProps) {
  const { state } = useStoryState();
  const { state: authState } = useAuth();
  const [resendState, setResendState] = useState<"idle" | "acknowledged">("idle");

  const language = state.language as "en" | "fr" | "es";
  const email = authState.user?.email || "";

  const getText = (key: string) => {
    const translations: Record<string, Record<string, string>> = {
      eyebrow: { en: "Secure Entry", fr: "Entrée Sécurisée", es: "Entrada Segura" },
      title: { en: "Verify your identity", fr: "Vérifiez votre identité", es: "Verifica tu identidad" },
      bodyPrefix: { en: "We'd send a verification link to", fr: "Nous enverrions un lien de vérification à", es: "Enviaríamos un enlace de verificación a" },
      bodySuffix: {
        en: "Check your inbox to complete your registration.",
        fr: "Consultez votre boîte de réception pour terminer votre inscription.",
        es: "Revisa tu bandeja de entrada para completar tu registro.",
      },
      openEmail: { en: "Open Email App", fr: "Ouvrir l'Application Mail", es: "Abrir Aplicación de Correo" },
      resend: { en: "Resend Verification", fr: "Renvoyer la Vérification", es: "Reenviar Verificación" },
      resendNote: {
        en: "Not available in this build: SEEN's authentication runs entirely on-device (see AuthContext.tsx) with no connected email service, so no verification email can actually be sent or resent — this is not a bug, it's a limitation of the current local-only demo backend.",
        fr: "Indisponible dans cette version : l'authentification de SEEN fonctionne entièrement sur l'appareil, sans service de messagerie connecté. Aucun e-mail de vérification ne peut donc être envoyé ou renvoyé — ce n'est pas un bug, c'est une limite du backend de démonstration local actuel.",
        es: "No disponible en esta versión: la autenticación de SEEN funciona completamente en el dispositivo, sin un servicio de correo conectado, por lo que no se puede enviar ni reenviar ningún correo de verificación — no es un error, es una limitación del backend de demostración local actual.",
      },
      footer: {
        en: "This account is already fully active — verification isn't required to use SEEN in this build.",
        fr: "Ce compte est déjà pleinement actif — la vérification n'est pas requise pour utiliser SEEN dans cette version.",
        es: "Esta cuenta ya está totalmente activa — la verificación no es necesaria para usar SEEN en esta versión.",
      },
      continue: { en: "Continue", fr: "Continuer", es: "Continuar" },
    };
    return translations[key]?.[language] || translations[key]?.en || key;
  };

  const handleOpenEmail = () => {
    // Genuinely real action: hands off to whatever mail client the OS/browser
    // has registered for mailto: links. This is the only piece of this screen
    // that does something real, since there is no email-sending backend.
    window.open("mailto:", "_blank");
  };

  const handleResend = () => {
    setResendState("acknowledged");
  };

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
            <h2 className="text-sm tracking-wider uppercase text-white/40">{getText("eyebrow")}</h2>
            <div className="w-10" />
          </div>
        </div>

        <div className="flex-1 px-6 pt-10 pb-10 flex flex-col items-center text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.85 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1 }}
            className="w-20 h-20 rounded-full bg-amber-500/10 border border-amber-500/30 flex items-center justify-center mb-8"
          >
            <MailCheck className="w-8 h-8 text-amber-300" />
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-2xl tracking-tight text-white mb-4"
          >
            {getText("title")}
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-sm text-white/60 leading-relaxed mb-10 max-w-[300px]"
          >
            {getText("bodyPrefix")}{" "}
            {email && <span className="text-white font-medium">{email}</span>}
            {email ? ". " : " "}
            {getText("bodySuffix")}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="w-full space-y-4"
          >
            <button
              onClick={handleOpenEmail}
              className="w-full py-4 rounded-full bg-white text-black text-sm tracking-wider uppercase hover:bg-white/90 transition-colors flex items-center justify-center gap-2"
            >
              {getText("openEmail")}
              <ExternalLink className="w-4 h-4" />
            </button>

            <button
              onClick={handleResend}
              className="w-full py-3 text-sm text-white/70 hover:text-white transition-colors underline underline-offset-4 flex items-center justify-center gap-2"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              {getText("resend")}
            </button>

            {resendState === "acknowledged" && (
              <motion.div
                initial={{ opacity: 0, y: -6 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-4 rounded-xl bg-white/5 border border-white/10 flex items-start gap-3 text-left"
              >
                <Info className="w-4 h-4 text-amber-300 flex-shrink-0 mt-0.5" />
                <p className="text-xs text-white/60 leading-relaxed">{getText("resendNote")}</p>
              </motion.div>
            )}
          </motion.div>

          <div className="flex-1" />

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="text-xs text-white/30 leading-relaxed max-w-[280px] mb-6"
          >
            {getText("footer")}
          </motion.p>

          {onContinue && (
            <button
              onClick={onContinue}
              className="text-sm text-white/50 hover:text-white/80 transition-colors underline underline-offset-4"
            >
              {getText("continue")}
            </button>
          )}
        </div>
      </div>
    </motion.div>
  );
}
