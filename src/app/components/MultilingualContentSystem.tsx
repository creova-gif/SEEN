import { motion } from "motion/react";
import { Globe, AlertCircle, CheckCircle } from "lucide-react";

/**
 * MULTILINGUAL CONTENT SYSTEM
 * Enforces EN/FR/ES support for all creator-facing text fields
 */

export type SupportedLanguage = "en" | "fr" | "es";

export interface MultilingualText {
  en: string;
  fr: string;
  es: string;
}

/**
 * FALLBACK LOGIC
 * Priority: Selected Language → Default Language → English → Original
 */
export function getMultilingualText(
  content: Partial<MultilingualText>,
  selectedLanguage: SupportedLanguage,
  defaultLanguage: SupportedLanguage = "en"
): string {
  // 1. Try selected language
  if (content[selectedLanguage]) {
    return content[selectedLanguage]!;
  }
  
  // 2. Try default language
  if (content[defaultLanguage]) {
    return content[defaultLanguage]!;
  }
  
  // 3. Try English
  if (content.en) {
    return content.en;
  }
  
  // 4. Return first available
  const firstAvailable = Object.values(content).find(text => text);
  return firstAvailable || "";
}

/**
 * VALIDATION RULES FOR CREATORS
 */
export interface MultilingualValidation {
  hasEnglish: boolean;
  hasFrench: boolean;
  hasSpanish: boolean;
  isComplete: boolean;
  missingLanguages: SupportedLanguage[];
}

export function validateMultilingualContent(
  content: Partial<MultilingualText>
): MultilingualValidation {
  const hasEnglish = !!content.en && content.en.trim().length > 0;
  const hasFrench = !!content.fr && content.fr.trim().length > 0;
  const hasSpanish = !!content.es && content.es.trim().length > 0;
  
  const missingLanguages: SupportedLanguage[] = [];
  if (!hasEnglish) missingLanguages.push("en");
  if (!hasFrench) missingLanguages.push("fr");
  if (!hasSpanish) missingLanguages.push("es");
  
  return {
    hasEnglish,
    hasFrench,
    hasSpanish,
    isComplete: hasEnglish && hasFrench && hasSpanish,
    missingLanguages
  };
}

/**
 * CONTENT CREATION RULES
 */
export const MULTILINGUAL_RULES = {
  required: {
    en: true,  // English is required (default)
    fr: false, // French is optional but encouraged
    es: false  // Spanish is optional but encouraged
  },
  
  recommended: {
    description: "All three languages recommended for CMF compliance and maximum reach",
    priority: ["en", "fr", "es"] as SupportedLanguage[]
  },
  
  captions: {
    description: "Audio/video captions must match content language",
    autoGenerate: false, // Manual captions required for quality
    timing: "Must sync with audio timestamps"
  },
  
  contextCards: {
    description: "Cultural context cards support creator-provided translations",
    fallback: "English definition used if translation unavailable",
    pronunciation: "Optional pronunciation guide in IPA or phonetic spelling"
  },
  
  interface: {
    description: "All UI labels are translated automatically",
    hardcoded: false,
    dynamicLoading: true
  }
};

/**
 * CAPTION TIMING SCHEMA
 */
export interface CaptionSegment {
  startTime: number; // milliseconds
  endTime: number;   // milliseconds
  text: MultilingualText;
}

export interface CaptionTrack {
  language: SupportedLanguage;
  segments: CaptionSegment[];
}

/**
 * VISUAL COMPONENT: Multilingual Content Creator Interface
 */
interface MultilingualContentEditorProps {
  fieldName: string;
  value: Partial<MultilingualText>;
  onChange: (value: Partial<MultilingualText>) => void;
  required?: boolean;
  placeholder?: MultilingualText;
  maxLength?: number;
  multiline?: boolean;
}

export function MultilingualContentEditor({
  fieldName,
  value,
  onChange,
  required = false,
  placeholder,
  maxLength,
  multiline = false
}: MultilingualContentEditorProps) {
  const validation = validateMultilingualContent(value);
  
  const languages: Array<{ code: SupportedLanguage; name: string; flag: string }> = [
    { code: "en", name: "English", flag: "🇬🇧" },
    { code: "fr", name: "Français", flag: "🇫🇷" },
    { code: "es", name: "Español", flag: "🇪🇸" }
  ];

  const handleChange = (lang: SupportedLanguage, text: string) => {
    onChange({
      ...value,
      [lang]: text
    });
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Globe className="w-4 h-4 text-white/40" />
          <h4 className="text-sm tracking-wider uppercase text-white/40">
            {fieldName}
          </h4>
          {required && (
            <span className="text-xs text-red-300">*</span>
          )}
        </div>
        
        {/* Validation indicator */}
        <div className="flex items-center gap-2">
          {validation.isComplete ? (
            <>
              <CheckCircle className="w-4 h-4 text-green-400" />
              <span className="text-xs text-green-300">Complete</span>
            </>
          ) : (
            <>
              <AlertCircle className="w-4 h-4 text-amber-400" />
              <span className="text-xs text-amber-300">
                {validation.missingLanguages.length} missing
              </span>
            </>
          )}
        </div>
      </div>

      {/* Language inputs */}
      <div className="space-y-3">
        {languages.map((lang) => {
          const hasContent = !!value[lang.code] && value[lang.code]!.trim().length > 0;
          const isRequired = lang.code === "en" && required;
          
          return (
            <div
              key={lang.code}
              className={`
                p-4 rounded-xl border transition-all
                ${hasContent 
                  ? 'bg-white/10 border-white/20' 
                  : 'bg-white/5 border-white/10'
                }
              `}
            >
              <div className="flex items-center gap-2 mb-2">
                <span className="text-lg">{lang.flag}</span>
                <span className="text-sm text-white/70">{lang.name}</span>
                {isRequired && (
                  <span className="text-xs text-red-300">Required</span>
                )}
                {hasContent && (
                  <CheckCircle className="w-4 h-4 text-green-400 ml-auto" />
                )}
              </div>
              
              {multiline ? (
                <textarea
                  value={value[lang.code] || ""}
                  onChange={(e) => handleChange(lang.code, e.target.value)}
                  placeholder={placeholder?.[lang.code] || `Enter ${lang.name} text...`}
                  maxLength={maxLength}
                  rows={4}
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white placeholder-white/30 focus:outline-none focus:ring-2 focus:ring-white/20 resize-none"
                />
              ) : (
                <input
                  type="text"
                  value={value[lang.code] || ""}
                  onChange={(e) => handleChange(lang.code, e.target.value)}
                  placeholder={placeholder?.[lang.code] || `Enter ${lang.name} text...`}
                  maxLength={maxLength}
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white placeholder-white/30 focus:outline-none focus:ring-2 focus:ring-white/20"
                />
              )}
              
              {maxLength && value[lang.code] && (
                <div className="mt-2 text-xs text-white/30 text-right">
                  {value[lang.code]!.length} / {maxLength}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Guidance note */}
      {!validation.isComplete && (
        <div className="p-4 rounded-xl bg-blue-500/10 border border-blue-400/20">
          <p className="text-xs text-blue-200/70 leading-relaxed">
            💡 Tip: Provide all three languages for maximum reach. English is required. French and Spanish help meet CMF multilingual accessibility standards.
          </p>
        </div>
      )}
    </div>
  );
}

/**
 * VISUAL COMPONENT: Caption Editor with Timing
 */
interface CaptionEditorProps {
  audioUrl: string;
  captions: Partial<Record<SupportedLanguage, CaptionSegment[]>>;
  onChange: (captions: Partial<Record<SupportedLanguage, CaptionSegment[]>>) => void;
  selectedLanguage: SupportedLanguage;
}

export function CaptionEditor({
  audioUrl,
  captions,
  onChange,
  selectedLanguage
}: CaptionEditorProps) {
  const currentCaptions = captions[selectedLanguage] || [];

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Globe className="w-4 h-4 text-white/40" />
          <h4 className="text-sm tracking-wider uppercase text-white/40">
            Audio Captions
          </h4>
        </div>
        
        <div className="flex gap-2">
          <button className="px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-xs text-white/70 hover:bg-white/10 transition-colors">
            Import SRT
          </button>
          <button className="px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-xs text-white/70 hover:bg-white/10 transition-colors">
            Auto-generate
          </button>
        </div>
      </div>

      {/* Audio player preview */}
      <div className="p-4 rounded-xl bg-white/5 border border-white/10">
        <audio src={audioUrl} controls className="w-full" />
      </div>

      {/* Caption segments */}
      <div className="space-y-2">
        {currentCaptions.length > 0 ? (
          currentCaptions.map((segment, index) => (
            <div
              key={index}
              className="p-3 rounded-lg bg-white/5 border border-white/10"
            >
              <div className="flex items-center gap-3 mb-2">
                <input
                  type="text"
                  value={formatTimestamp(segment.startTime)}
                  placeholder="00:00.000"
                  className="w-24 bg-white/5 border border-white/10 rounded px-2 py-1 text-xs text-white"
                />
                <span className="text-white/40">→</span>
                <input
                  type="text"
                  value={formatTimestamp(segment.endTime)}
                  placeholder="00:00.000"
                  className="w-24 bg-white/5 border border-white/10 rounded px-2 py-1 text-xs text-white"
                />
              </div>
              <input
                type="text"
                value={segment.text[selectedLanguage] || ""}
                placeholder="Caption text..."
                className="w-full bg-white/5 border border-white/10 rounded px-3 py-2 text-sm text-white"
              />
            </div>
          ))
        ) : (
          <div className="p-8 rounded-xl bg-white/5 border border-white/10 text-center">
            <p className="text-sm text-white/40">
              No captions yet. Add segments with timestamps.
            </p>
          </div>
        )}
      </div>

      {/* Add segment button */}
      <button className="w-full py-3 rounded-lg bg-white/5 border border-white/10 text-sm text-white/70 hover:bg-white/10 transition-colors">
        + Add Caption Segment
      </button>

      {/* Accessibility note */}
      <div className="p-4 rounded-xl bg-green-500/10 border border-green-400/20">
        <p className="text-xs text-green-200/70 leading-relaxed">
          ♿ {selectedLanguage === 'en' 
                ? 'SEEN follows WCAG 2.1 AA standards. Your stories inherit these accessibility features.'
                : selectedLanguage === 'fr'
                ? 'SEEN suit les normes WCAG 2.1 AA. Vos histoires héritent de ces fonctionnalités d\'accessibilité.'
                : 'SEEN sigue los estándares WCAG 2.1 AA. Tus historias heredan estas características de accesibilidad.'
              }
        </p>
      </div>
    </div>
  );
}

/**
 * HELPER FUNCTIONS
 */
function formatTimestamp(ms: number): string {
  const totalSeconds = Math.floor(ms / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  const milliseconds = ms % 1000;
  
  return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}.${String(milliseconds).padStart(3, '0')}`;
}

/**
 * DOCUMENTATION COMPONENT
 */
export function MultilingualContentRules() {
  return (
    <div className="space-y-6 p-6 overflow-auto pb-20">
      <h2 className="text-2xl tracking-tight text-white">Multilingual Content Rules</h2>
      
      <div className="space-y-4">
        <div className="p-5 rounded-xl bg-white/5 border border-white/10">
          <h3 className="text-base text-white mb-3">Language Requirements</h3>
          <ul className="space-y-2 text-sm text-white/70">
            <li>✅ English (EN) - Required as default</li>
            <li>🇫🇷 French (FR) - Optional but encouraged for CMF compliance</li>
            <li>🇪🇸 Spanish (ES) - Optional but encouraged for community reach</li>
          </ul>
        </div>

        <div className="p-5 rounded-xl bg-white/5 border border-white/10">
          <h3 className="text-base text-white mb-3">Fallback Logic</h3>
          <ol className="space-y-2 text-sm text-white/70 list-decimal list-inside">
            <li>Display user's selected language</li>
            <li>Fallback to story's default language</li>
            <li>Fallback to English</li>
            <li>Display first available language</li>
          </ol>
        </div>

        <div className="p-5 rounded-xl bg-white/5 border border-white/10">
          <h3 className="text-base text-white mb-3">Captions & Audio</h3>
          <p className="text-sm text-white/70 mb-3">
            Audio/video captions must be provided for each language version. Auto-generation is available but manual review is required for accuracy.
          </p>
          <ul className="space-y-1 text-xs text-white/50">
            <li>• Timestamps must sync with audio</li>
            <li>• Maximum 2 lines per caption segment</li>
            <li>• Use sentence case, not ALL CAPS</li>
          </ul>
        </div>

        <div className="p-5 rounded-xl bg-white/5 border border-white/10">
          <h3 className="text-base text-white mb-3">Context Cards</h3>
          <p className="text-sm text-white/70">
            Cultural context cards support creator-provided translations for culturally specific terms. Include pronunciation guides when helpful.
          </p>
        </div>
      </div>
    </div>
  );
}