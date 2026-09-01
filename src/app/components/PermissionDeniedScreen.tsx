import { motion } from "motion/react";
import { Shield, Mic, Camera } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { useStoryState } from "../contexts/StoryStateContext";

export type PermissionDeniedVariant = "creator-access" | "microphone" | "camera";

interface PermissionDeniedScreenProps {
  /**
   * Which access is being denied. Defaults to "creator-access", matching
   * Figma node 101:88 ("Creator Access Required") exactly — that is what the
   * actual design at that node shows (a role/feature gate, not an OS media
   * permission prompt). Pass "microphone" or "camera" to reuse this same
   * shell for a real getUserMedia() denial — pair it with the
   * `useMediaPermission` hook (src/app/hooks/useMediaPermission.ts), whose
   * `requestAccess` is the honest retry: there is no API to reopen the
   * browser/OS permission dialog programmatically, so retrying just calls
   * getUserMedia again (which re-prompts, or fails again if the viewer
   * hasn't changed their browser/device settings yet).
   */
  variant?: PermissionDeniedVariant;
  /** Primary action — "Apply for Creator Access", or the permission retry (`requestAccess`). */
  onPrimaryAction: () => void;
  /** Secondary action — always rendered as "Go Back". */
  onGoBack: () => void;
  /** Shows a busy state on the primary button (e.g. while the permission prompt / application call is in flight). */
  primaryBusy?: boolean;
  /** Optional copy overrides — e.g. to surface the actual DOMException-derived message from `useMediaPermission`. */
  title?: string;
  body?: string;
}

const ICONS: Record<PermissionDeniedVariant, LucideIcon> = {
  "creator-access": Shield,
  microphone: Mic,
  camera: Camera,
};

export function PermissionDeniedScreen({
  variant = "creator-access",
  onPrimaryAction,
  onGoBack,
  primaryBusy = false,
  title,
  body,
}: PermissionDeniedScreenProps) {
  const { state } = useStoryState();
  const language = state.language;

  const getText = (key: string) => {
    const translations: Record<string, Record<string, string>> = {
      label: {
        en: variant === "creator-access" ? "Access Restricted" : "Permission Denied",
        fr: variant === "creator-access" ? "Accès Restreint" : "Permission Refusée",
        es: variant === "creator-access" ? "Acceso Restringido" : "Permiso Denegado",
      },
      title: {
        en:
          variant === "creator-access"
            ? "Creator Access Required"
            : variant === "microphone"
              ? "Microphone Access Needed"
              : "Camera Access Needed",
        fr:
          variant === "creator-access"
            ? "Accès Créateur Requis"
            : variant === "microphone"
              ? "Accès au Microphone Requis"
              : "Accès à la Caméra Requis",
        es:
          variant === "creator-access"
            ? "Acceso de Creador Requerido"
            : variant === "microphone"
              ? "Acceso al Micrófono Requerido"
              : "Acceso a la Cámara Requerido",
      },
      body: {
        en:
          variant === "creator-access"
            ? "This feature is available to creators. Apply for creator access to publish stories, view analytics, and collaborate with others."
            : variant === "microphone"
              ? "SEEN needs microphone access to record narration. If you previously blocked it, check your browser or device settings to allow access, then try again."
              : "SEEN needs camera access for this feature. If you previously blocked it, check your browser or device settings to allow access, then try again.",
        fr:
          variant === "creator-access"
            ? "Cette fonctionnalité est réservée aux créateurs. Faites une demande d'accès créateur pour publier des histoires, consulter les statistiques et collaborer avec d'autres."
            : variant === "microphone"
              ? "SEEN a besoin d'accéder au microphone pour enregistrer la narration. Si vous l'avez déjà bloqué, vérifiez les paramètres de votre navigateur ou appareil pour autoriser l'accès, puis réessayez."
              : "SEEN a besoin d'accéder à la caméra pour cette fonctionnalité. Si vous l'avez déjà bloqué, vérifiez les paramètres de votre navigateur ou appareil pour autoriser l'accès, puis réessayez.",
        es:
          variant === "creator-access"
            ? "Esta función está disponible para creadores. Solicita acceso de creador para publicar historias, ver análisis y colaborar con otros."
            : variant === "microphone"
              ? "SEEN necesita acceso al micrófono para grabar la narración. Si lo bloqueaste antes, revisa la configuración de tu navegador o dispositivo para permitir el acceso y vuelve a intentarlo."
              : "SEEN necesita acceso a la cámara para esta función. Si lo bloqueaste antes, revisa la configuración de tu navegador o dispositivo para permitir el acceso y vuelve a intentarlo.",
      },
      primary: {
        en: variant === "creator-access" ? "Apply for Creator Access" : "Try Again",
        fr: variant === "creator-access" ? "Demander l'Accès Créateur" : "Réessayer",
        es: variant === "creator-access" ? "Solicitar Acceso de Creador" : "Intentar de Nuevo",
      },
      goBack: { en: "Go Back", fr: "Retour", es: "Volver" },
    };
    return translations[key]?.[language] || translations[key]?.en || key;
  };

  const Icon = ICONS[variant];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black z-50 overflow-auto"
      role="alert"
    >
      <div className="min-h-full max-w-[428px] mx-auto flex flex-col justify-between px-6 pt-28 pb-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col items-center text-center gap-5"
        >
          <div className="w-20 h-20 rounded-full bg-amber-500/10 border border-amber-400/40 flex items-center justify-center">
            <Icon className="w-8 h-8 text-amber-300" strokeWidth={1.5} />
          </div>

          <p className="text-xs tracking-[0.2em] uppercase text-amber-300">{getText("label")}</p>

          <h2 className="text-2xl tracking-tight text-white leading-snug">{title || getText("title")}</h2>

          <p className="text-sm text-white/60 leading-relaxed max-w-[300px]">{body || getText("body")}</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="space-y-3"
        >
          <button
            onClick={onPrimaryAction}
            disabled={primaryBusy}
            className="w-full py-4 rounded-full bg-amber-400 text-black text-sm tracking-wider uppercase hover:bg-amber-300 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {primaryBusy ? "…" : getText("primary")}
          </button>
          <button
            onClick={onGoBack}
            className="w-full py-4 rounded-full bg-white/5 border border-white/10 text-white text-sm tracking-wider uppercase hover:bg-white/10 transition-colors"
          >
            {getText("goBack")}
          </button>
        </motion.div>
      </div>
    </motion.div>
  );
}
