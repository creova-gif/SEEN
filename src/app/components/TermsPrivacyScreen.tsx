import { motion } from "motion/react";
import { ArrowLeft, ChevronDown, Scale } from "lucide-react";
import { useState } from "react";
import { useStoryState } from "../contexts/StoryStateContext";

interface TermsPrivacyScreenProps {
  onBack: () => void;
}

type Tab = "terms" | "privacy";

interface LegalSection {
  id: string;
  title: Record<"en" | "fr" | "es", string>;
  body: Record<"en" | "fr" | "es", string>;
}

const TERMS_SECTIONS: LegalSection[] = [
  {
    id: "acceptable-use",
    title: { en: "1. Acceptable Use", fr: "1. Utilisation Acceptable", es: "1. Uso Aceptable" },
    body: {
      en: "You agree to use the SEEN archive only for preserving and sharing authentic cultural expressions. Misrepresentation or commercial exploitation of shared archives, without the express consent of the contributing creator, is prohibited.",
      fr: "Vous acceptez d'utiliser l'archive SEEN uniquement pour préserver et partager des expressions culturelles authentiques. La déformation ou l'exploitation commerciale des archives partagées, sans le consentement exprès du créateur contributeur, est interdite.",
      es: "Aceptas usar el archivo de SEEN únicamente para preservar y compartir expresiones culturales auténticas. Está prohibida la tergiversación o la explotación comercial de los archivos compartidos sin el consentimiento expreso del creador que contribuye.",
    },
  },
  {
    id: "content-rights",
    title: { en: "2. Content Rights", fr: "2. Droits sur le Contenu", es: "2. Derechos de Contenido" },
    body: {
      en: "Creators retain copyright of their multimedia stories. By uploading, you grant SEEN a non-exclusive license to host, stream, and display your work within the app so it can be experienced by the audience you choose to share it with.",
      fr: "Les créateurs conservent les droits d'auteur de leurs histoires multimédias. En téléversant, vous accordez à SEEN une licence non exclusive pour héberger, diffuser et afficher votre œuvre dans l'application afin qu'elle puisse être vécue par le public que vous choisissez.",
      es: "Los creadores conservan los derechos de autor de sus historias multimedia. Al subir contenido, otorgas a SEEN una licencia no exclusiva para alojar, transmitir y mostrar tu obra dentro de la aplicación para que la experimente el público que elijas.",
    },
  },
  {
    id: "user-conduct",
    title: { en: "3. User Conduct", fr: "3. Conduite des Utilisateurs", es: "3. Conducta del Usuario" },
    body: {
      en: "Harassment, hate speech, and coordinated inauthentic behavior have no place in the archive. Moderators may remove content or suspend accounts that violate SEEN's community guidelines, with notice wherever practicable.",
      fr: "Le harcèlement, les discours de haine et les comportements inauthentiques coordonnés n'ont pas leur place dans l'archive. Les modérateurs peuvent retirer du contenu ou suspendre des comptes qui violent les règles de la communauté SEEN, avec préavis dans la mesure du possible.",
      es: "El acoso, el discurso de odio y el comportamiento inauténtico coordinado no tienen cabida en el archivo. Los moderadores pueden eliminar contenido o suspender cuentas que infrinjan las normas comunitarias de SEEN, con aviso siempre que sea posible.",
    },
  },
  {
    id: "termination",
    title: { en: "4. Termination", fr: "4. Résiliation", es: "4. Terminación" },
    body: {
      en: "You may close your account at any time. We may suspend or terminate access for violations of these terms. Archived stories you contributed may remain viewable, attributed to you, unless you request removal under your data rights.",
      fr: "Vous pouvez fermer votre compte à tout moment. Nous pouvons suspendre ou résilier l'accès en cas de violation des présentes conditions. Les histoires archivées que vous avez contribuées peuvent rester visibles, avec attribution, sauf demande de suppression.",
      es: "Puedes cerrar tu cuenta en cualquier momento. Podemos suspender o terminar el acceso por infracciones de estos términos. Las historias archivadas que hayas contribuido pueden seguir siendo visibles, atribuidas a ti, salvo que solicites su eliminación.",
    },
  },
  {
    id: "liability",
    title: { en: "5. Limitation of Liability", fr: "5. Limitation de Responsabilité", es: "5. Limitación de Responsabilidad" },
    body: {
      en: "SEEN is provided \"as is.\" CREOVA is not liable for indirect or consequential damages arising from use of the archive, to the fullest extent permitted by applicable law.",
      fr: "SEEN est fourni \"tel quel\". CREOVA n'est pas responsable des dommages indirects ou consécutifs découlant de l'utilisation de l'archive, dans toute la mesure permise par la loi applicable.",
      es: "SEEN se proporciona \"tal cual\". CREOVA no es responsable de daños indirectos o consecuentes derivados del uso del archivo, en la máxima medida permitida por la ley aplicable.",
    },
  },
];

const PRIVACY_SECTIONS: LegalSection[] = [
  {
    id: "data-we-collect",
    title: { en: "1. Data We Collect", fr: "1. Données Collectées", es: "1. Datos Que Recopilamos" },
    body: {
      en: "SEEN stores account details, language and accessibility preferences, and story progress. Wherever possible, this information stays on your device rather than a central server.",
      fr: "SEEN stocke les détails du compte, les préférences de langue et d'accessibilité, ainsi que la progression des histoires. Dans la mesure du possible, ces informations restent sur votre appareil plutôt que sur un serveur central.",
      es: "SEEN almacena los datos de la cuenta, las preferencias de idioma y accesibilidad, y el progreso de las historias. Siempre que sea posible, esta información permanece en tu dispositivo en lugar de en un servidor central.",
    },
  },
  {
    id: "how-we-use-data",
    title: { en: "2. How We Use Data", fr: "2. Utilisation des Données", es: "2. Cómo Usamos los Datos" },
    body: {
      en: "We use your data only to operate the app: syncing your saved stories, remembering your language, and letting creators see aggregate, non-identifying engagement with their work. We do not build advertising profiles.",
      fr: "Nous utilisons vos données uniquement pour faire fonctionner l'application : synchroniser vos histoires sauvegardées, mémoriser votre langue et permettre aux créateurs de voir l'engagement agrégé et non identifiant. Nous ne créons pas de profils publicitaires.",
      es: "Utilizamos tus datos únicamente para operar la aplicación: sincronizar tus historias guardadas, recordar tu idioma y permitir que los creadores vean el compromiso agregado y no identificable. No creamos perfiles publicitarios.",
    },
  },
  {
    id: "data-sharing",
    title: { en: "3. Data Sharing", fr: "3. Partage des Données", es: "3. Compartición de Datos" },
    body: {
      en: "We never sell personal data. Limited data may be shared with infrastructure providers (hosting, authentication) strictly to operate SEEN, under contracts requiring the same protections described here.",
      fr: "Nous ne vendons jamais de données personnelles. Des données limitées peuvent être partagées avec des fournisseurs d'infrastructure (hébergement, authentification) strictement pour faire fonctionner SEEN, sous contrat exigeant les mêmes protections.",
      es: "Nunca vendemos datos personales. Se pueden compartir datos limitados con proveedores de infraestructura (alojamiento, autenticación) estrictamente para operar SEEN, bajo contratos que exigen las mismas protecciones aquí descritas.",
    },
  },
  {
    id: "your-rights",
    title: { en: "4. Your Rights (PIPEDA)", fr: "4. Vos Droits (LPRPDE)", es: "4. Tus Derechos (PIPEDA)" },
    body: {
      en: "Under Canada's Personal Information Protection and Electronic Documents Act, you may access, correct, export, or request deletion of your data at any time from Profile → Preferences → Your Data Rights.",
      fr: "En vertu de la Loi canadienne sur la protection des renseignements personnels et les documents électroniques (LPRPDE), vous pouvez accéder à vos données, les corriger, les exporter ou demander leur suppression à tout moment depuis Profil → Préférences → Vos Droits.",
      es: "En virtud de la Ley de Protección de Información Personal y Documentos Electrónicos de Canadá (PIPEDA), puedes acceder, corregir, exportar o solicitar la eliminación de tus datos en cualquier momento desde Perfil → Preferencias → Tus Derechos.",
    },
  },
  {
    id: "data-retention",
    title: { en: "5. Data Retention", fr: "5. Conservation des Données", es: "5. Retención de Datos" },
    body: {
      en: "We keep account data for as long as your account is active. Deletion requests are processed within 30 days, after which associated personal data is permanently removed from our systems.",
      fr: "Nous conservons les données du compte tant que votre compte est actif. Les demandes de suppression sont traitées sous 30 jours, après quoi les données personnelles associées sont définitivement supprimées de nos systèmes.",
      es: "Conservamos los datos de la cuenta mientras esté activa. Las solicitudes de eliminación se procesan en un plazo de 30 días, tras lo cual los datos personales asociados se eliminan permanentemente de nuestros sistemas.",
    },
  },
];

export function TermsPrivacyScreen({ onBack }: TermsPrivacyScreenProps) {
  const { state } = useStoryState();
  const language = state.language as "en" | "fr" | "es";
  const [tab, setTab] = useState<Tab>("terms");
  const [expanded, setExpanded] = useState<string | null>(TERMS_SECTIONS[0].id);

  const getText = (key: string) => {
    const translations: Record<string, Record<string, string>> = {
      title: { en: "Terms & Privacy", fr: "Conditions et Confidentialité", es: "Términos y Privacidad" },
      terms: { en: "Terms of Service", fr: "Conditions d'Utilisation", es: "Términos de Servicio" },
      privacy: { en: "Privacy Policy", fr: "Politique de Confidentialité", es: "Política de Privacidad" },
      lastUpdated: { en: "Last updated", fr: "Dernière mise à jour", es: "Última actualización" },
      contact: {
        en: "Questions about these terms? Contact privacy@creova.studio.",
        fr: "Des questions sur ces conditions ? Contactez privacy@creova.studio.",
        es: "¿Preguntas sobre estos términos? Contacta a privacy@creova.studio.",
      },
    };
    return translations[key]?.[language] || translations[key]?.en || key;
  };

  const sections = tab === "terms" ? TERMS_SECTIONS : PRIVACY_SECTIONS;

  const toggleSection = (id: string) => {
    setExpanded((prev) => (prev === id ? null : id));
  };

  const handleTabChange = (next: Tab) => {
    setTab(next);
    setExpanded((next === "terms" ? TERMS_SECTIONS : PRIVACY_SECTIONS)[0].id);
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

          {/* Tabs */}
          <div className="flex gap-6 px-6 pb-3">
            {(["terms", "privacy"] as Tab[]).map((t) => (
              <button
                key={t}
                onClick={() => handleTabChange(t)}
                className={`text-sm pb-2 border-b-2 transition-colors ${
                  tab === t ? "text-white border-white" : "text-white/40 border-transparent hover:text-white/60"
                }`}
              >
                {getText(t)}
              </button>
            ))}
          </div>
        </div>

        <div className="px-6 pt-6 space-y-3">
          {sections.map((section, index) => {
            const isOpen = expanded === section.id;
            return (
              <motion.div
                key={section.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.03 }}
                className="rounded-xl bg-white/5 border border-white/10 overflow-hidden"
              >
                <button
                  onClick={() => toggleSection(section.id)}
                  aria-expanded={isOpen}
                  className="w-full flex items-center justify-between gap-3 p-4 text-left hover:bg-white/5 transition-colors"
                >
                  <span className="text-sm text-white">{section.title[language] || section.title.en}</span>
                  <ChevronDown
                    className={`w-4 h-4 text-white/40 flex-shrink-0 transition-transform ${isOpen ? "rotate-180" : ""}`}
                  />
                </button>
                {isOpen && (
                  <div className="px-4 pb-4">
                    <p className="text-sm text-white/60 leading-relaxed">
                      {section.body[language] || section.body.en}
                    </p>
                  </div>
                )}
              </motion.div>
            );
          })}

          <div className="pt-6 flex items-start gap-2 text-white/30">
            <Scale className="w-4 h-4 flex-shrink-0 mt-0.5" />
            <div className="space-y-1">
              <p className="text-xs">{getText("lastUpdated")}: {new Date(2026, 7, 1).toLocaleDateString(language, { year: "numeric", month: "long" })}</p>
              <p className="text-xs">{getText("contact")}</p>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
