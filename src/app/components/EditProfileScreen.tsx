import { motion } from "motion/react";
import { ArrowLeft, Camera } from "lucide-react";
import { useState } from "react";
import { useStoryState } from "../contexts/StoryStateContext";
import { useAuth } from "../contexts/AuthContext";
import { SaveConfirmationToast } from "./SaveConfirmationToast";

interface EditProfileScreenProps {
  onBack: () => void;
}

export function EditProfileScreen({ onBack }: EditProfileScreenProps) {
  const { state } = useStoryState();
  const { state: authState, updateProfile } = useAuth();

  const [name, setName] = useState(authState.user?.name || "");
  const [bio, setBio] = useState(authState.user?.bio || "");
  const [location, setLocation] = useState(authState.user?.location || "");
  const [avatarUrl, setAvatarUrl] = useState(authState.user?.avatarUrl || "");
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");

  const getText = (key: string) => {
    const translations: Record<string, Record<string, string>> = {
      title: { en: "Edit Profile", fr: "Modifier le profil", es: "Editar perfil" },
      changePhoto: { en: "Change Photo", fr: "Changer la photo", es: "Cambiar foto" },
      displayName: { en: "Display Name", fr: "Nom Affiché", es: "Nombre Visible" },
      bio: { en: "Bio", fr: "Bio", es: "Biografía" },
      location: { en: "Location", fr: "Lieu", es: "Ubicación" },
      save: { en: "Save Changes", fr: "Enregistrer", es: "Guardar Cambios" },
      saved: { en: "Saved", fr: "Enregistré", es: "Guardado" },
    };
    return translations[key]?.[state.language] || translations[key]?.en || key;
  };

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === "string") setAvatarUrl(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const handleSave = async () => {
    setError("");
    setSaving(true);
    try {
      await updateProfile({ name: name.trim(), bio: bio.trim(), location: location.trim(), avatarUrl });
      setSaved(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not save changes.");
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

        <div className="px-6 py-8 space-y-8">
          {/* Avatar */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col items-center gap-3"
          >
            <div className="relative w-24 h-24 rounded-full overflow-hidden bg-white/10 border border-white/20">
              {avatarUrl && (
                <img src={avatarUrl} alt={name} className="w-full h-full object-cover" />
              )}
              <label className="absolute inset-0 flex flex-col items-center justify-center gap-1 bg-black/50 cursor-pointer hover:bg-black/60 transition-colors">
                <Camera className="w-5 h-5 text-white/80" />
                <span className="text-[10px] tracking-wider uppercase text-white/80">
                  {getText("changePhoto")}
                </span>
                <input type="file" accept="image/*" className="hidden" onChange={handleAvatarChange} />
              </label>
            </div>
          </motion.div>

          {/* Display Name */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="space-y-2">
            <label htmlFor="edit-profile-name" className="text-sm tracking-wider uppercase text-white/40">
              {getText("displayName")}
            </label>
            <input
              id="edit-profile-name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full p-4 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-white/30 focus:outline-none focus:border-white/30"
            />
          </motion.div>

          {/* Bio */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="space-y-2">
            <label htmlFor="edit-profile-bio" className="text-sm tracking-wider uppercase text-white/40">
              {getText("bio")}
            </label>
            <textarea
              id="edit-profile-bio"
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              rows={3}
              className="w-full p-4 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-white/30 focus:outline-none focus:border-white/30 resize-none"
            />
          </motion.div>

          {/* Location */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="space-y-2">
            <label htmlFor="edit-profile-location" className="text-sm tracking-wider uppercase text-white/40">
              {getText("location")}
            </label>
            <input
              id="edit-profile-location"
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="w-full p-4 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-white/30 focus:outline-none focus:border-white/30"
            />
          </motion.div>

          {error && (
            <p className="text-sm text-red-400">{error}</p>
          )}

          {/* Save button */}
          <motion.button
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            onClick={handleSave}
            disabled={saving || !name.trim()}
            className="w-full py-4 rounded-full bg-white text-black text-sm tracking-wider uppercase hover:bg-white/90 transition-colors disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {getText("save")}
          </motion.button>
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
