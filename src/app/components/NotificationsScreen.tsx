import { motion } from "motion/react";
import { ArrowLeft, CheckCircle2, Download, Bell } from "lucide-react";
import { useMemo, useState } from "react";
import { useStoryState } from "../contexts/StoryStateContext";
import { getStoryWorldById, getLocalizedText } from "../data/storyDatabase";

interface NotificationsScreenProps {
  onBack: () => void;
}

interface DownloadedStory {
  id: string;
  title: string;
  downloadedAt: number;
}

const DOWNLOADS_KEY = "seen_downloads";

function loadDownloads(): DownloadedStory[] {
  try {
    return JSON.parse(localStorage.getItem(DOWNLOADS_KEY) || "[]");
  } catch {
    return [];
  }
}

type Filter = "all" | "completed" | "downloads";

interface NotificationItem {
  id: string;
  type: "completed" | "download";
  title: string;
  description: string;
  timestamp: number;
}

function isToday(timestamp: number) {
  const d = new Date(timestamp);
  const now = new Date();
  return d.getFullYear() === now.getFullYear() && d.getMonth() === now.getMonth() && d.getDate() === now.getDate();
}

function formatRelative(timestamp: number, language: string) {
  const diffMs = Date.now() - timestamp;
  const hours = Math.floor(diffMs / (1000 * 60 * 60));
  if (hours < 1) return language === "fr" ? "À l'instant" : language === "es" ? "Ahora mismo" : "Just now";
  if (hours < 24) {
    if (language === "fr") return `${hours}h`;
    if (language === "es") return `Hace ${hours}h`;
    return `${hours}h ago`;
  }
  const days = Math.floor(hours / 24);
  if (language === "fr") return `${days}j`;
  if (language === "es") return `Hace ${days}d`;
  return `${days}d ago`;
}

export function NotificationsScreen({ onBack }: NotificationsScreenProps) {
  const { state } = useStoryState();
  const [filter, setFilter] = useState<Filter>("all");
  const language = state.language as "en" | "fr" | "es";

  const getText = (key: string) => {
    const translations: Record<string, Record<string, string>> = {
      title: { en: "Notifications", fr: "Notifications", es: "Notificaciones" },
      all: { en: "All", fr: "Tout", es: "Todo" },
      completed: { en: "Completed", fr: "Terminé", es: "Completado" },
      downloads: { en: "Downloads", fr: "Téléchargements", es: "Descargas" },
      today: { en: "Today", fr: "Aujourd'hui", es: "Hoy" },
      earlier: { en: "Earlier", fr: "Plus tôt", es: "Anteriormente" },
      empty: { en: "You're all caught up", fr: "Vous êtes à jour", es: "Estás al día" },
      emptySub: {
        en: "Completed stories and downloads will show up here.",
        fr: "Les histoires terminées et les téléchargements apparaîtront ici.",
        es: "Las historias completadas y las descargas aparecerán aquí.",
      },
      completedDesc: { en: "You finished this story.", fr: "Vous avez terminé cette histoire.", es: "Terminaste esta historia." },
      downloadDesc: { en: "Available offline for 30 days.", fr: "Disponible hors ligne pendant 30 jours.", es: "Disponible sin conexión por 30 días." },
    };
    return translations[key]?.[language] || translations[key]?.en || key;
  };

  const notifications = useMemo<NotificationItem[]>(() => {
    const completed: NotificationItem[] = (state.progressSnapshots || [])
      .filter((p) => p.completed)
      .map((p) => {
        const story = getStoryWorldById(p.storyWorldId);
        return {
          id: `completed-${p.storyWorldId}`,
          type: "completed" as const,
          title: story ? getLocalizedText(story.title, language) : p.storyWorldId,
          description: getText("completedDesc"),
          timestamp: new Date(p.lastAccessDate).getTime() || Date.now(),
        };
      });

    const downloads: NotificationItem[] = loadDownloads().map((d) => ({
      id: `download-${d.id}`,
      type: "download" as const,
      title: d.title,
      description: getText("downloadDesc"),
      timestamp: d.downloadedAt,
    }));

    return [...completed, ...downloads].sort((a, b) => b.timestamp - a.timestamp);
  }, [state.progressSnapshots, language]);

  const filtered = notifications.filter((n) => {
    if (filter === "completed") return n.type === "completed";
    if (filter === "downloads") return n.type === "download";
    return true;
  });

  const todayItems = filtered.filter((n) => isToday(n.timestamp));
  const earlierItems = filtered.filter((n) => !isToday(n.timestamp));

  const renderItem = (item: NotificationItem, index: number) => (
    <motion.div
      key={item.id}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.03 }}
      className="p-4 rounded-xl bg-white/5 border border-white/10 flex items-start gap-3"
    >
      <div
        className={`w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 ${
          item.type === "completed" ? "bg-green-500/15 border border-green-500/30" : "bg-blue-500/15 border border-blue-500/30"
        }`}
      >
        {item.type === "completed" ? (
          <CheckCircle2 className="w-4 h-4 text-green-300" />
        ) : (
          <Download className="w-4 h-4 text-blue-300" />
        )}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2">
          <h4 className="text-sm text-white">{item.title}</h4>
          <span className="text-xs text-white/30 flex-shrink-0">{formatRelative(item.timestamp, language)}</span>
        </div>
        <p className="text-xs text-white/50 mt-0.5">{item.description}</p>
      </div>
    </motion.div>
  );

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

          {/* Filter tabs */}
          <div className="flex gap-6 px-6 pb-3">
            {(["all", "completed", "downloads"] as Filter[]).map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`text-sm pb-2 border-b-2 transition-colors ${
                  filter === f ? "text-white border-white" : "text-white/40 border-transparent hover:text-white/60"
                }`}
              >
                {getText(f)}
              </button>
            ))}
          </div>
        </div>

        <div className="px-6 pt-6 space-y-8">
          {filtered.length === 0 ? (
            <div className="pt-16 flex flex-col items-center text-center gap-3">
              <Bell className="w-8 h-8 text-white/20" />
              <p className="text-sm text-white/60">{getText("empty")}</p>
              <p className="text-xs text-white/30 max-w-[260px]">{getText("emptySub")}</p>
            </div>
          ) : (
            <>
              {todayItems.length > 0 && (
                <div className="space-y-3">
                  <h3 className="text-xs tracking-wider uppercase text-white/40">{getText("today")}</h3>
                  <div className="space-y-3">{todayItems.map(renderItem)}</div>
                </div>
              )}
              {earlierItems.length > 0 && (
                <div className="space-y-3">
                  <h3 className="text-xs tracking-wider uppercase text-white/40">{getText("earlier")}</h3>
                  <div className="space-y-3">{earlierItems.map(renderItem)}</div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </motion.div>
  );
}
