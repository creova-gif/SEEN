import { motion } from "motion/react";
import { ArrowLeft, Eye, EyeOff } from "lucide-react";
import { useState } from "react";
import { useStoryState } from "../contexts/StoryStateContext";
import { useAuth } from "../contexts/AuthContext";
import { SaveConfirmationToast } from "./SaveConfirmationToast";

interface ChangePasswordScreenProps {
  onBack: () => void;
}

export function ChangePasswordScreen({ onBack }: ChangePasswordScreenProps) {
  const { state } = useStoryState();
  const { changePassword } = useAuth();

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");

  const getText = (key: string) => {
    const translations: Record<string, Record<string, string>> = {
      title: { en: "Change Password", fr: "Changer le mot de passe", es: "Cambiar contraseña" },
      current: { en: "Current Password", fr: "Mot de Passe Actuel", es: "Contraseña Actual" },
      new: { en: "New Password", fr: "Nouveau Mot de Passe", es: "Nueva Contraseña" },
      confirm: { en: "Confirm New Password", fr: "Confirmer le Mot de Passe", es: "Confirmar Contraseña" },
      save: { en: "Update Password", fr: "Mettre à Jour", es: "Actualizar Contraseña" },
      saved: { en: "Password Updated", fr: "Mot de Passe Mis à Jour", es: "Contraseña Actualizada" },
      mismatch: { en: "New passwords don't match.", fr: "Les mots de passe ne correspondent pas.", es: "Las contraseñas no coinciden." },
      tooShort: { en: "New password must be at least 8 characters.", fr: "Le mot de passe doit contenir au moins 8 caractères.", es: "La contraseña debe tener al menos 8 caracteres." },
    };
    return translations[key]?.[state.language] || translations[key]?.en || key;
  };

  const canSubmit = currentPassword.length > 0 && newPassword.length > 0 && confirmPassword.length > 0;

  const handleSave = async () => {
    setError("");
    if (newPassword.length < 8) {
      setError(getText("tooShort"));
      return;
    }
    if (newPassword !== confirmPassword) {
      setError(getText("mismatch"));
      return;
    }
    setSaving(true);
    try {
      await changePassword(currentPassword, newPassword);
      setSaved(true);
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not update password.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black z-50 overflow-auto"
    >
      <div className="min-h-full max-w-[428px] mx-auto">
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
            <h2 className="text-base tracking-tight text-white">{getText("title")}</h2>
            <div className="w-10" />
          </div>
        </div>

        <div className="px-6 py-8 space-y-6">
          {/* Current password */}
          <div className="space-y-2">
            <label htmlFor="current-password" className="text-sm tracking-wider uppercase text-white/40">
              {getText("current")}
            </label>
            <div className="relative">
              <input
                id="current-password"
                type={showCurrent ? "text" : "password"}
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                className="w-full p-4 pr-12 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-white/30"
              />
              <button
                type="button"
                onClick={() => setShowCurrent((v) => !v)}
                aria-label={showCurrent ? "Hide password" : "Show password"}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-white/40 hover:text-white/70 transition-colors"
              >
                {showCurrent ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* New password */}
          <div className="space-y-2">
            <label htmlFor="new-password" className="text-sm tracking-wider uppercase text-white/40">
              {getText("new")}
            </label>
            <div className="relative">
              <input
                id="new-password"
                type={showNew ? "text" : "password"}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full p-4 pr-12 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-white/30"
              />
              <button
                type="button"
                onClick={() => setShowNew((v) => !v)}
                aria-label={showNew ? "Hide password" : "Show password"}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-white/40 hover:text-white/70 transition-colors"
              >
                {showNew ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Confirm password */}
          <div className="space-y-2">
            <label htmlFor="confirm-password" className="text-sm tracking-wider uppercase text-white/40">
              {getText("confirm")}
            </label>
            <input
              id="confirm-password"
              type={showNew ? "text" : "password"}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full p-4 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-white/30"
            />
          </div>

          {error && <p className="text-sm text-red-400">{error}</p>}

          <button
            onClick={handleSave}
            disabled={saving || !canSubmit}
            className="w-full py-4 rounded-full bg-white text-black text-sm tracking-wider uppercase hover:bg-white/90 transition-colors disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {getText("save")}
          </button>
        </div>
      </div>

      <SaveConfirmationToast
        visible={saved}
        message={getText("saved")}
        onDismiss={() => setSaved(false)}
      />
    </motion.div>
  );
}
