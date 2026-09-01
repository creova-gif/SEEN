import { useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Check } from "lucide-react";
import { useStoryState } from "../contexts/StoryStateContext";
import { useDialogA11y } from "../hooks/useDialogA11y";

interface SaveConfirmationAction {
  label: string;
  onClick: () => void;
}

interface SaveConfirmationToastProps {
  visible: boolean;
  /** Headline, e.g. "Saved", "Password Updated", or "Saved to Collection". */
  message: string;
  /** Optional subtitle, e.g. "Black History Essentials · 4 stories". */
  detail?: string;
  /**
   * Supplying either action switches this into the rich bottom-sheet card
   * (matches Figma node 101:195 — "Saved to Collection" with
   * View Collection / Continue Reading). Omit both for the compact
   * auto-dismissing pill that generalizes the inline "Saved" /
   * "Password Updated" state currently duplicated in EditProfileScreen.tsx
   * and ChangePasswordScreen.tsx.
   */
  primaryAction?: SaveConfirmationAction;
  secondaryAction?: SaveConfirmationAction;
  /** Called when the toast is dismissed: backdrop tap, Escape (rich card only), or the auto-hide timer elapsing (compact pill only). */
  onDismiss?: () => void;
  /**
   * Auto-hide delay in ms for the compact pill. Defaults to 2000, matching
   * the existing `setTimeout(() => setSaved(false), 2000)` convention in
   * EditProfileScreen.tsx / ChangePasswordScreen.tsx. Ignored once
   * `primaryAction`/`secondaryAction` are supplied — the rich card stays
   * open until the viewer picks an action or dismisses it.
   */
  autoHideMs?: number;
}

/**
 * Shared "saved" confirmation. Two visual modes driven by whether an action
 * is supplied — see prop docs above. Both modes reuse this codebase's
 * existing success language: the green check-circle from NotificationsScreen's
 * "completed" rows for the compact pill, and the amber accent this session's
 * Figma frames (101:88, 101:9, 101:195) consistently use for attention/restricted
 * states for the rich card's action button.
 */
export function SaveConfirmationToast({
  visible,
  message,
  detail,
  primaryAction,
  secondaryAction,
  onDismiss,
  autoHideMs = 2000,
}: SaveConfirmationToastProps) {
  const isRichCard = Boolean(primaryAction || secondaryAction);
  const dialogRef = useDialogA11y(visible && isRichCard, onDismiss ?? (() => {}));

  useEffect(() => {
    if (!visible || isRichCard || !onDismiss) return;
    const timer = setTimeout(onDismiss, autoHideMs);
    return () => clearTimeout(timer);
  }, [visible, isRichCard, onDismiss, autoHideMs]);

  return (
    <AnimatePresence>
      {visible &&
        (isRichCard ? (
          <motion.div
            key="save-confirmation-card"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-end justify-center bg-black/60 backdrop-blur-sm px-4 pb-6"
            onClick={onDismiss}
          >
            <motion.div
              ref={dialogRef}
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 40 }}
              role="dialog"
              aria-modal="true"
              aria-label={message}
              tabIndex={-1}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-[400px] rounded-3xl bg-neutral-900/95 backdrop-blur-xl border border-white/10 p-6 shadow-2xl outline-none"
            >
              <div className="w-10 h-1 rounded-full bg-white/15 mx-auto mb-5" />
              <div className="flex items-center gap-3 mb-5">
                <div className="w-11 h-11 rounded-full bg-amber-500/15 border border-amber-400/40 flex items-center justify-center flex-shrink-0">
                  <Check className="w-5 h-5 text-amber-300" strokeWidth={2} />
                </div>
                <div className="min-w-0">
                  <h3 className="text-base text-white truncate">{message}</h3>
                  {detail && <p className="text-xs text-white/50 truncate">{detail}</p>}
                </div>
              </div>
              <div className="space-y-2">
                {primaryAction && (
                  <button
                    onClick={primaryAction.onClick}
                    className="w-full py-3.5 rounded-full bg-amber-400 text-black text-sm tracking-wider uppercase hover:bg-amber-300 transition-colors"
                  >
                    {primaryAction.label}
                  </button>
                )}
                {secondaryAction && (
                  <button
                    onClick={secondaryAction.onClick}
                    className="w-full py-3.5 rounded-full bg-white/5 border border-white/10 text-white text-sm tracking-wider uppercase hover:bg-white/10 transition-colors"
                  >
                    {secondaryAction.label}
                  </button>
                )}
              </div>
            </motion.div>
          </motion.div>
        ) : (
          <motion.div
            key="save-confirmation-pill"
            initial={{ opacity: 0, y: 10, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.96 }}
            className="fixed bottom-8 inset-x-0 z-50 flex justify-center px-6 pointer-events-none"
            role="status"
            aria-live="polite"
          >
            <div className="flex items-center gap-2 px-5 py-3 rounded-full bg-black/90 backdrop-blur-xl border border-white/10 pointer-events-auto">
              <div className="w-5 h-5 rounded-full bg-green-500/15 border border-green-500/30 flex items-center justify-center flex-shrink-0">
                <Check className="w-3 h-3 text-green-300" strokeWidth={2.5} />
              </div>
              <span className="text-sm text-white">{message}</span>
            </div>
          </motion.div>
        ))}
    </AnimatePresence>
  );
}
