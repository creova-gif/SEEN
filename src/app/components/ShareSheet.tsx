import { motion, AnimatePresence } from "motion/react";
import { X, Share2, Link2, Check, Send } from "lucide-react";
import { useState } from "react";
import { useStoryState } from "../contexts/StoryStateContext";
import { useDialogA11y } from "../hooks/useDialogA11y";

export interface ShareSheetProps {
  isOpen: boolean;
  onClose: () => void;
  /** Title of the story/content being shared (without any " — SEEN" suffix). */
  title: string;
  /** Fully-qualified URL to share, e.g. `https://seen.app/story/{id}`. */
  url: string;
  /** Optional thumbnail/cover image shown in the sheet header. */
  thumbnailUrl?: string;
}

type ShareStatus = "idle" | "copied" | "shared";

/**
 * Reusable bottom-sheet share UI. Wraps the same navigator.share-with-
 * clipboard-fallback logic used elsewhere in the app (see
 * FeaturedStoryPreview.handleShareContent) behind a custom sheet that also
 * supports an optional personal note, appended to the shared text.
 */
export function ShareSheet({ isOpen, onClose, title, url, thumbnailUrl }: ShareSheetProps) {
  const { state } = useStoryState();
  const language = state.language as "en" | "fr" | "es";
  const dialogRef = useDialogA11y(isOpen, onClose);
  const [note, setNote] = useState("");
  const [status, setStatus] = useState<ShareStatus>("idle");

  const getText = (key: string) => {
    const translations: Record<string, Record<string, string>> = {
      shareStory: { en: "Share Story", fr: "Partager l'Histoire", es: "Compartir Historia" },
      shareVia: { en: "Share via", fr: "Partager via", es: "Compartir vía" },
      moreOptions: { en: "More options", fr: "Plus d'options", es: "Más opciones" },
      copyLink: { en: "Copy Link", fr: "Copier le Lien", es: "Copiar Enlace" },
      linkCopied: { en: "Link Copied", fr: "Lien Copié", es: "Enlace Copiado" },
      addNoteLabel: { en: "Share With a Note", fr: "Partager avec une Note", es: "Compartir con una Nota" },
      addNotePlaceholder: {
        en: "Add a personal note or translation note...",
        fr: "Ajoutez une note personnelle ou de traduction...",
        es: "Añade una nota personal o de traducción...",
      },
      shared: { en: "Shared", fr: "Partagé", es: "Compartido" },
      close: { en: "Close", fr: "Fermer", es: "Cerrar" },
    };
    return translations[key]?.[language] || translations[key]?.en || key;
  };

  const buildShareData = () => {
    const trimmedNote = note.trim();
    const baseText = `Explore this on SEEN — "${title}"`;
    return {
      title: `${title} — SEEN`,
      text: trimmedNote ? `${baseText}\n\n${trimmedNote}` : baseText,
      url,
    };
  };

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setStatus("copied");
      setTimeout(() => setStatus("idle"), 2000);
    } catch {
      // Clipboard API unavailable — nothing more we can do silently.
    }
  };

  const handleNativeShare = async () => {
    const shareData = buildShareData();
    try {
      if (navigator.share) {
        await navigator.share(shareData);
        setStatus("shared");
        setTimeout(() => setStatus("idle"), 2000);
      } else {
        await handleCopyLink();
      }
    } catch {
      // User cancelled the native share sheet, or share() isn't supported —
      // fall back to copying the link so the action never dead-ends.
      await handleCopyLink();
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
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
          />

          <motion.div
            ref={dialogRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby="share-sheet-title"
            tabIndex={-1}
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", damping: 30, stiffness: 300 }}
            className="fixed bottom-0 left-0 right-0 md:left-1/2 md:-translate-x-1/2 md:max-w-[428px] z-50 outline-none"
          >
            <div className="bg-black border-t border-white/10 md:border md:rounded-t-3xl rounded-t-3xl pb-8 max-h-[85vh] overflow-y-auto">
              <div className="flex justify-center pt-3 pb-1">
                <div className="w-10 h-1 rounded-full bg-white/20" />
              </div>

              {/* Header */}
              <div className="flex items-start justify-between gap-3 px-6 pt-3 pb-4 border-b border-white/10">
                <div className="flex items-center gap-3 min-w-0">
                  {thumbnailUrl && (
                    <img
                      src={thumbnailUrl}
                      alt=""
                      className="w-10 h-10 rounded-lg object-cover flex-shrink-0"
                    />
                  )}
                  <div className="min-w-0">
                    <p className="text-xs tracking-wider uppercase text-white/40">{getText("shareVia")}</p>
                    <h3 id="share-sheet-title" className="text-sm text-white truncate">
                      {title}
                    </h3>
                  </div>
                </div>
                <button
                  onClick={onClose}
                  aria-label={getText("close")}
                  className="p-2 -m-2 rounded-full hover:bg-white/10 transition-colors flex-shrink-0"
                >
                  <X className="w-5 h-5 text-white/60" />
                </button>
              </div>

              {/* Share actions */}
              <div className="px-6 pt-5 flex gap-4">
                <button
                  onClick={handleNativeShare}
                  className="flex-1 flex flex-col items-center gap-2 group"
                >
                  <div className="w-12 h-12 rounded-full bg-white/5 border border-white/10 flex items-center justify-center group-hover:bg-white/10 transition-colors">
                    {status === "shared" ? (
                      <Check className="w-5 h-5 text-green-400" />
                    ) : (
                      <Send className="w-5 h-5 text-white" />
                    )}
                  </div>
                  <span className="text-xs text-white/50">{getText("moreOptions")}</span>
                </button>
                <button
                  onClick={handleCopyLink}
                  className="flex-1 flex flex-col items-center gap-2 group"
                >
                  <div className="w-12 h-12 rounded-full bg-white/5 border border-white/10 flex items-center justify-center group-hover:bg-white/10 transition-colors">
                    {status === "copied" ? (
                      <Check className="w-5 h-5 text-green-400" />
                    ) : (
                      <Link2 className="w-5 h-5 text-white" />
                    )}
                  </div>
                  <span className="text-xs text-white/50">
                    {status === "copied" ? getText("linkCopied") : getText("copyLink")}
                  </span>
                </button>
              </div>

              {/* Optional personal note */}
              <div className="px-6 pt-6 space-y-2">
                <h4 className="text-xs tracking-wider uppercase text-white/40">{getText("addNoteLabel")}</h4>
                <textarea
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  placeholder={getText("addNotePlaceholder")}
                  rows={2}
                  className="w-full p-4 rounded-xl bg-white/5 border border-white/10 text-white text-sm placeholder:text-white/30 focus:outline-none focus:border-white/30 resize-none"
                />
              </div>

              <div className="px-6 pt-5">
                <button
                  onClick={handleNativeShare}
                  className="w-full py-4 rounded-full bg-white text-black text-sm tracking-wider uppercase hover:bg-white/90 transition-colors flex items-center justify-center gap-2"
                >
                  <Share2 className="w-4 h-4" />
                  {getText("shareStory")}
                </button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
