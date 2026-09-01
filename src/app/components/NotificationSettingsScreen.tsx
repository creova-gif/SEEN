import { motion } from "motion/react";
import {
  ArrowLeft,
  Check,
  BookOpen,
  Sparkles,
  Award,
  Upload,
  Users,
  TrendingUp,
  Heart,
  Shield,
  Globe,
  BellRing,
} from "lucide-react";
import { useState } from "react";
import { useStoryState } from "../contexts/StoryStateContext";

interface NotificationSettingsScreenProps {
  onBack: () => void;
}

type ToggleId =
  | "newChapters"
  | "storyRecommendations"
  | "completedBadges"
  | "submissionStatus"
  | "collaborationInvites"
  | "creatorInsights"
  | "responseReactions"
  | "moderationUpdates"
  | "communityHighlights"
  | "pushNotifications";

type ToggleState = Record<ToggleId, boolean>;

const SETTINGS_KEY = "seen_notification_settings";

const DEFAULT_SETTINGS: ToggleState = {
  newChapters: true,
  storyRecommendations: true,
  completedBadges: false,
  submissionStatus: true,
  collaborationInvites: true,
  creatorInsights: false,
  responseReactions: false,
  moderationUpdates: true,
  communityHighlights: false,
  pushNotifications: true,
};

function loadSettings(): ToggleState {
  try {
    const raw = localStorage.getItem(SETTINGS_KEY);
    if (!raw) return { ...DEFAULT_SETTINGS };
    return { ...DEFAULT_SETTINGS, ...JSON.parse(raw) };
  } catch {
    return { ...DEFAULT_SETTINGS };
  }
}

function saveSettings(settings: ToggleState) {
  localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
}

interface ToggleRowConfig {
  id: ToggleId;
  icon: React.ReactNode;
}

const SECTION_CONFIG: { key: string; items: ToggleRowConfig[] }[] = [
  {
    key: "storyUpdates",
    items: [
      { id: "newChapters", icon: <BookOpen className="w-4 h-4" /> },
      { id: "storyRecommendations", icon: <Sparkles className="w-4 h-4" /> },
      { id: "completedBadges", icon: <Award className="w-4 h-4" /> },
    ],
  },
  {
    key: "creator",
    items: [
      { id: "submissionStatus", icon: <Upload className="w-4 h-4" /> },
      { id: "collaborationInvites", icon: <Users className="w-4 h-4" /> },
      { id: "creatorInsights", icon: <TrendingUp className="w-4 h-4" /> },
    ],
  },
  {
    key: "community",
    items: [
      { id: "responseReactions", icon: <Heart className="w-4 h-4" /> },
      { id: "moderationUpdates", icon: <Shield className="w-4 h-4" /> },
      { id: "communityHighlights", icon: <Globe className="w-4 h-4" /> },
    ],
  },
  {
    key: "system",
    items: [{ id: "pushNotifications", icon: <BellRing className="w-4 h-4" /> }],
  },
];

export function NotificationSettingsScreen({ onBack }: NotificationSettingsScreenProps) {
  const { state } = useStoryState();
  const language = state.language as "en" | "fr" | "es";
  const [settings, setSettings] = useState<ToggleState>(loadSettings);
  const [saved, setSaved] = useState(false);

  const getText = (key: string) => {
    const translations: Record<string, Record<string, string>> = {
      title: { en: "Notification Settings", fr: "Paramètres de Notification", es: "Ajustes de Notificaciones" },
      storyUpdates: { en: "Story Updates", fr: "Mises à Jour d'Histoires", es: "Actualizaciones de Historias" },
      creator: { en: "Creator", fr: "Créateur", es: "Creador" },
      community: { en: "Community", fr: "Communauté", es: "Comunidad" },
      system: { en: "System", fr: "Système", es: "Sistema" },
      save: { en: "Save Preferences", fr: "Enregistrer les Préférences", es: "Guardar Preferencias" },
      saved: { en: "Preferences Saved", fr: "Préférences Enregistrées", es: "Preferencias Guardadas" },
      newChaptersLabel: { en: "New chapters available", fr: "Nouveaux chapitres disponibles", es: "Nuevos capítulos disponibles" },
      storyRecommendationsLabel: { en: "Story recommendations", fr: "Recommandations d'histoires", es: "Recomendaciones de historias" },
      completedBadgesLabel: { en: "Completed story badges", fr: "Badges d'histoires terminées", es: "Insignias de historias completadas" },
      submissionStatusLabel: { en: "Submission status updates", fr: "Statut de soumission", es: "Estado de las publicaciones" },
      collaborationInvitesLabel: { en: "Collaboration invites", fr: "Invitations de collaboration", es: "Invitaciones de colaboración" },
      creatorInsightsLabel: { en: "Creator insights", fr: "Statistiques de créateur", es: "Estadísticas de creador" },
      responseReactionsLabel: { en: "Response reactions", fr: "Réactions aux réponses", es: "Reacciones a respuestas" },
      moderationUpdatesLabel: { en: "Moderation updates", fr: "Mises à jour de modération", es: "Actualizaciones de moderación" },
      communityHighlightsLabel: { en: "Community highlights", fr: "Temps forts de la communauté", es: "Destacados de la comunidad" },
      pushNotificationsLabel: { en: "Push notifications", fr: "Notifications push", es: "Notificaciones push" },
      pushNotificationsSub: {
        en: "Master switch for all notifications on this device.",
        fr: "Interrupteur principal pour toutes les notifications sur cet appareil.",
        es: "Interruptor principal para todas las notificaciones en este dispositivo.",
      },
    };
    return translations[key]?.[language] || translations[key]?.en || key;
  };

  const toggle = (id: ToggleId) => {
    setSaved(false);
    setSettings((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const handleSave = () => {
    saveSettings(settings);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const renderToggle = (row: ToggleRowConfig, index: number) => {
    const enabled = settings[row.id];
    return (
      <motion.div
        key={row.id}
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: index * 0.03 }}
        className="p-4 rounded-xl bg-white/5 border border-white/10 flex items-center justify-between gap-3"
      >
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-9 h-9 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center flex-shrink-0 text-white/50">
            {row.icon}
          </div>
          <div className="min-w-0">
            <p className="text-sm text-white truncate">{getText(`${row.id}Label`)}</p>
            {row.id === "pushNotifications" && (
              <p className="text-xs text-white/40 mt-0.5">{getText("pushNotificationsSub")}</p>
            )}
          </div>
        </div>
        <button
          type="button"
          role="switch"
          aria-checked={enabled}
          aria-label={getText(`${row.id}Label`)}
          onClick={() => toggle(row.id)}
          className="flex-shrink-0"
        >
          <motion.div
            animate={{ backgroundColor: enabled ? "rgba(255,255,255,0.9)" : "rgba(255,255,255,0.1)" }}
            className="w-12 h-7 rounded-full border border-white/20 relative"
          >
            <motion.div
              animate={{ x: enabled ? 20 : 2, backgroundColor: enabled ? "rgb(0,0,0)" : "rgba(255,255,255,0.4)" }}
              transition={{ type: "spring", stiffness: 500, damping: 30 }}
              className="absolute top-1 w-5 h-5 rounded-full"
            />
          </motion.div>
        </button>
      </motion.div>
    );
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black z-50 overflow-auto"
    >
      <div className="min-h-full max-w-[428px] mx-auto pb-12">
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

        <div className="px-6 pt-6 space-y-8">
          {SECTION_CONFIG.map((section) => (
            <div key={section.key} className="space-y-3">
              <h3 className="text-xs tracking-wider uppercase text-white/40">{getText(section.key)}</h3>
              <div className="space-y-3">
                {section.items.map((item, index) => renderToggle(item, index))}
              </div>
            </div>
          ))}

          <button
            onClick={handleSave}
            className="w-full py-4 rounded-full bg-white text-black text-sm tracking-wider uppercase hover:bg-white/90 transition-colors flex items-center justify-center gap-2"
          >
            {saved ? (
              <>
                <Check className="w-4 h-4" />
                {getText("saved")}
              </>
            ) : (
              getText("save")
            )}
          </button>
        </div>
      </div>
    </motion.div>
  );
}
