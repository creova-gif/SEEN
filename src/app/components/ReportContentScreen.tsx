import { motion, AnimatePresence } from "motion/react";
import { ArrowLeft, ShieldAlert, CheckCircle2 } from "lucide-react";
import { useMemo, useState } from "react";
import { useStoryState } from "../contexts/StoryStateContext";
import { getStoryWorldData } from "../data/storyService";
import { getContentById } from "../data/database";
import type { Language } from "../data/storyDatabase";

interface ReportContentScreenProps {
  /** The story world or content item id being reported (e.g. state.currentStoryWorldId). */
  contentId: string;
  onBack: () => void;
}

export interface ContentReport {
  id: string;
  contentId: string;
  contentTitle: string;
  reason: string;
  details: string;
  reportedAt: number;
}

const REPORTS_KEY = "seen_content_reports";

export function loadContentReports(): ContentReport[] {
  try {
    return JSON.parse(localStorage.getItem(REPORTS_KEY) || "[]");
  } catch {
    return [];
  }
}

function saveContentReport(report: ContentReport) {
  const all = loadContentReports();
  all.push(report);
  localStorage.setItem(REPORTS_KEY, JSON.stringify(all));
}

const REASON_KEYS = [
  "culturalMisrepresentation",
  "harmfulOffensive",
  "copyrightAttribution",
  "inaccurateHistorical",
  "spamIrrelevant",
] as const;

const TYPE_LABEL_KEYS: Record<string, string> = {
  music: "typeMusic",
  story: "typeStory",
  film: "typeFilm",
  archive: "typeArchive",
  collection: "typeCollection",
};

export function ReportContentScreen({ contentId, onBack }: ReportContentScreenProps) {
  const { state } = useStoryState();
  const language = state.language as "en" | "fr" | "es";

  const [reason, setReason] = useState<string | null>(null);
  const [details, setDetails] = useState("");
  const [submitted, setSubmitted] = useState(false);

  // A short, human-readable ticket number shown to the reporter and stored
  // as the report's persisted id — generated once per screen visit.
  const [ticketId] = useState(() => String(Math.floor(10000 + Math.random() * 90000)));

  const getText = (key: string) => {
    const translations: Record<string, Record<string, string>> = {
      label: { en: "Community Safety", fr: "Sécurité Communautaire", es: "Seguridad Comunitaria" },
      heading: { en: "Report this content", fr: "Signaler ce contenu", es: "Denunciar este contenido" },
      subheading: {
        en: "Help us protect the integrity and safety of our collective stories.",
        fr: "Aidez-nous à protéger l'intégrité et la sécurité de nos histoires collectives.",
        es: "Ayúdanos a proteger la integridad y seguridad de nuestras historias colectivas.",
      },
      reportId: { en: "Report ID", fr: "ID du Signalement", es: "ID del Reporte" },
      reasonLabel: { en: "Reason", fr: "Motif", es: "Motivo" },
      culturalMisrepresentation: { en: "Cultural misrepresentation", fr: "Représentation culturelle erronée", es: "Representación cultural errónea" },
      harmfulOffensive: { en: "Harmful or offensive content", fr: "Contenu nuisible ou offensant", es: "Contenido dañino u ofensivo" },
      copyrightAttribution: { en: "Copyright or attribution issue", fr: "Problème de droit d'auteur ou d'attribution", es: "Problema de derechos de autor o atribución" },
      inaccurateHistorical: { en: "Inaccurate historical claims", fr: "Affirmations historiques inexactes", es: "Afirmaciones históricas inexactas" },
      spamIrrelevant: { en: "Spam or irrelevant content", fr: "Spam ou contenu non pertinent", es: "Spam o contenido irrelevante" },
      detailsLabel: { en: "Additional Context (Optional)", fr: "Contexte Supplémentaire (Optionnel)", es: "Contexto Adicional (Opcional)" },
      detailsPlaceholder: {
        en: "Provide details to help us investigate...",
        fr: "Fournissez des détails pour nous aider à enquêter...",
        es: "Proporciona detalles para ayudarnos a investigar...",
      },
      submit: { en: "Submit Report", fr: "Envoyer le Signalement", es: "Enviar Reporte" },
      submitting: { en: "Submitting...", fr: "Envoi...", es: "Enviando..." },
      reviewNote: {
        en: "Reports are reviewed by our moderation team within 48 hours.",
        fr: "Les signalements sont examinés par notre équipe de modération sous 48 heures.",
        es: "Los reportes son revisados por nuestro equipo de moderación en un plazo de 48 horas.",
      },
      submittedHeading: { en: "Report submitted", fr: "Signalement envoyé", es: "Reporte enviado" },
      submittedBody: {
        en: "Thank you for helping keep SEEN safe. Your report will be reviewed within 48 hours.",
        fr: "Merci de nous aider à assurer la sécurité de SEEN. Votre signalement sera examiné sous 48 heures.",
        es: "Gracias por ayudar a mantener SEEN seguro. Tu reporte será revisado en un plazo de 48 horas.",
      },
      done: { en: "Done", fr: "Terminé", es: "Listo" },
      typeMusic: { en: "Music", fr: "Musique", es: "Música" },
      typeStory: { en: "Story", fr: "Histoire", es: "Historia" },
      typeFilm: { en: "Film", fr: "Film", es: "Película" },
      typeArchive: { en: "Oral Archive", fr: "Archive Orale", es: "Archivo Oral" },
      typeCollection: { en: "Collection", fr: "Collection", es: "Colección" },
    };
    return translations[key]?.[language] || translations[key]?.en || key;
  };

  const resolved = useMemo(() => {
    const storyData = getStoryWorldData(contentId, language as Language);
    if (storyData) {
      return { title: storyData.title, image: storyData.coverImage, typeLabel: getText("typeStory") };
    }
    const contentItem = getContentById(contentId);
    if (contentItem) {
      const typeKey = TYPE_LABEL_KEYS[contentItem.type] ?? "typeStory";
      return { title: contentItem.title, image: contentItem.mediaSource, typeLabel: getText(typeKey) };
    }
    return { title: contentId, image: undefined as string | undefined, typeLabel: getText("typeStory") };
  }, [contentId, language]);

  const canSubmit = reason !== null;

  const handleSubmit = () => {
    if (!canSubmit) return;
    const report: ContentReport = {
      id: ticketId,
      contentId,
      contentTitle: resolved.title,
      reason,
      details: details.trim(),
      reportedAt: Date.now(),
    };
    saveContentReport(report);
    setSubmitted(true);
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
            <h2 className="text-xs tracking-wider uppercase text-white/40">{getText("label")}</h2>
            <div className="w-10" />
          </div>
        </div>

        <AnimatePresence mode="wait">
          {submitted ? (
            <motion.div
              key="confirmation"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="px-6 pt-16 flex flex-col items-center text-center gap-4"
            >
              <div className="w-16 h-16 rounded-full bg-green-500/15 border border-green-500/30 flex items-center justify-center">
                <CheckCircle2 className="w-7 h-7 text-green-300" />
              </div>
              <h1 className="text-2xl tracking-tight text-white">{getText("submittedHeading")}</h1>
              <p className="text-sm text-white/50 leading-relaxed max-w-[300px]">{getText("submittedBody")}</p>
              <p className="text-xs text-white/30 tracking-wider uppercase">
                {getText("reportId")}: #{ticketId}
              </p>
              <button
                onClick={onBack}
                className="mt-4 w-full py-4 rounded-full bg-white text-black text-sm tracking-wider uppercase hover:bg-white/90 transition-colors"
              >
                {getText("done")}
              </button>
            </motion.div>
          ) : (
            <motion.div
              key="form"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="px-6 pt-6 space-y-6"
            >
              <div className="space-y-2">
                <h1 className="text-2xl tracking-tight text-white">{getText("heading")}</h1>
                <p className="text-sm text-white/50 leading-relaxed">{getText("subheading")}</p>
              </div>

              {/* Content card */}
              <div className="p-3 rounded-xl bg-white/5 border border-white/10 flex items-center gap-3">
                {resolved.image && (
                  <img src={resolved.image} alt="" className="w-14 h-14 rounded-lg object-cover flex-shrink-0" />
                )}
                <div className="min-w-0">
                  <p className="text-[10px] tracking-wider uppercase text-purple-300">{resolved.typeLabel}</p>
                  <p className="text-sm text-white truncate">{resolved.title}</p>
                  <p className="text-xs text-white/30">
                    {getText("reportId")}: #{ticketId}
                  </p>
                </div>
              </div>

              {/* Reason selection */}
              <div className="space-y-2">
                <h3 className="text-sm tracking-wider uppercase text-white/40">{getText("reasonLabel")}</h3>
                <div role="radiogroup" aria-label={getText("reasonLabel")} className="space-y-2">
                  {REASON_KEYS.map((key) => {
                    const selected = reason === key;
                    return (
                      <button
                        key={key}
                        type="button"
                        role="radio"
                        aria-checked={selected}
                        onClick={() => setReason(key)}
                        className={`w-full text-left p-4 rounded-xl border flex items-center gap-3 transition-colors ${
                          selected
                            ? "bg-white/10 border-white/40 text-white"
                            : "bg-white/5 border-white/10 text-white/70 hover:bg-white/[0.07]"
                        }`}
                      >
                        <span
                          className={`w-4 h-4 rounded-full border flex-shrink-0 flex items-center justify-center ${
                            selected ? "border-white" : "border-white/30"
                          }`}
                        >
                          {selected && <span className="w-2 h-2 rounded-full bg-white" />}
                        </span>
                        <span className="text-sm">{getText(key)}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Additional context */}
              <div className="space-y-2">
                <label htmlFor="report-details" className="text-sm tracking-wider uppercase text-white/40">
                  {getText("detailsLabel")}
                </label>
                <textarea
                  id="report-details"
                  value={details}
                  onChange={(e) => setDetails(e.target.value)}
                  rows={4}
                  placeholder={getText("detailsPlaceholder")}
                  className="w-full p-4 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-white/30 focus:outline-none focus:border-white/30 resize-none"
                />
              </div>

              <button
                onClick={handleSubmit}
                disabled={!canSubmit}
                className="w-full py-4 rounded-full bg-white text-black text-sm tracking-wider uppercase hover:bg-white/90 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
              >
                {getText("submit")}
              </button>

              <div className="flex items-center justify-center gap-2 pb-4">
                <ShieldAlert className="w-3.5 h-3.5 text-white/30" />
                <p className="text-xs text-white/30 text-center">{getText("reviewNote")}</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}
