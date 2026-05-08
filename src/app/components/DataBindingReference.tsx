import { motion } from "motion/react";
import { Database, Eye, Edit, Server, HardDrive, Globe, Shield } from "lucide-react";

/**
 * SEEN DATA ARCHITECTURE SPECIFICATION
 * Complete screen-to-data binding reference for developers
 */

export interface DataBinding {
  screen: string;
  dataRead: string[];
  dataWrite: string[];
  storage: "local" | "server" | "both";
  multilingual: boolean;
  accessibility: boolean;
  notes: string;
}

export const DATA_BINDINGS: DataBinding[] = [
  // ONBOARDING & SETUP
  {
    screen: "SplashScreen",
    dataRead: [],
    dataWrite: [],
    storage: "local",
    multilingual: false,
    accessibility: true,
    notes: "Visual only, no data persistence"
  },
  {
    screen: "LanguageSelectionScreen",
    dataRead: ["user.language"],
    dataWrite: ["user.profile.language"],
    storage: "local",
    multilingual: true,
    accessibility: true,
    notes: "Sets global language (EN/FR/ES), triggers content filtering"
  },
  {
    screen: "IntentSelectionScreen",
    dataRead: ["user.profile.language"],
    dataWrite: ["user.profile.intent"],
    storage: "local",
    multilingual: true,
    accessibility: true,
    notes: "Adapts home layout (Explore/Create/Contribute)"
  },

  // HOME & DISCOVERY
  {
    screen: "HomeScreen",
    dataRead: [
      "user.profile.intent",
      "user.profile.language",
      "stories.featured[]",
      "stories.trending[]",
      "stories.saved[]"
    ],
    dataWrite: [],
    storage: "both",
    multilingual: true,
    accessibility: true,
    notes: "Display only, filters content by language + intent"
  },
  {
    screen: "StoryWorldEntryScreen",
    dataRead: [
      "story.metadata",
      "story.languages[]",
      "story.chapters[]",
      "user.profile.language"
    ],
    dataWrite: [],
    storage: "server",
    multilingual: true,
    accessibility: true,
    notes: "Preloads audio/video assets for first chapter"
  },

  // STORY PLAYBACK
  {
    screen: "ChapterPlaybackScreen",
    dataRead: [
      "chapter.media[]",
      "chapter.captions[]",
      "chapter.contextCards[]",
      "chapter.audioLayers[]",
      "user.progress.currentChapter",
      "user.accessibility.captions",
      "user.accessibility.reducedMotion"
    ],
    dataWrite: [
      "user.progress.currentChapter",
      "user.progress.timestamp",
      "user.progress.completedChapters[]"
    ],
    storage: "both",
    multilingual: true,
    accessibility: true,
    notes: "Audio state tracked, playback position synced server-side"
  },
  {
    screen: "ChapterNavigationScreen",
    dataRead: [
      "story.chapters[]",
      "user.progress.currentChapter",
      "user.progress.completedChapters[]"
    ],
    dataWrite: ["user.progress.currentChapter"],
    storage: "local",
    multilingual: true,
    accessibility: true,
    notes: "Chapter history for resume functionality"
  },
  {
    screen: "AudioLayerControl",
    dataRead: [
      "chapter.audioLayers[]",
      "user.audioSettings.quality"
    ],
    dataWrite: [
      "chapter.audioLayers[].volume",
      "user.audioSettings.quality"
    ],
    storage: "local",
    multilingual: false,
    accessibility: true,
    notes: "Audio layer volumes stored per-session, quality global"
  },

  // BRANCHING & CHOICES
  {
    screen: "SoftBranchingChoice",
    dataRead: [
      "chapter.branchOptions[]",
      "user.profile.language"
    ],
    dataWrite: [
      "user.progress.branchPath",
      "user.progress.branchesVisited[]"
    ],
    storage: "both",
    multilingual: true,
    accessibility: true,
    notes: "Creator-approved perspectives, no user-generated branches"
  },

  // COMMUNITY ENGAGEMENT
  {
    screen: "CommunityResponsesPanel",
    dataRead: [
      "chapter.responses.approved[]",
      "user.profile.language"
    ],
    dataWrite: [],
    storage: "server",
    multilingual: true,
    accessibility: true,
    notes: "Only shows moderated/approved responses"
  },
  {
    screen: "SubmitResponseModal",
    dataRead: [
      "user.profile.id",
      "user.profile.language",
      "chapter.id"
    ],
    dataWrite: [
      "response.chapterId",
      "response.type",
      "response.content",
      "response.language",
      "response.timestamp",
      "response.status" // pending/approved/rejected
    ],
    storage: "server",
    multilingual: true,
    accessibility: true,
    notes: "Requires moderation before public display"
  },

  // CULTURAL CONTEXT
  {
    screen: "ContextCard",
    dataRead: [
      "contextCard.term",
      "contextCard.definition[language]",
      "contextCard.pronunciation",
      "user.profile.language"
    ],
    dataWrite: [],
    storage: "server",
    multilingual: true,
    accessibility: true,
    notes: "Creator-provided translations, fallback to EN"
  },

  // CREATOR TOOLS
  {
    screen: "CreatorDashboard",
    dataRead: [
      "user.role",
      "user.stories[]",
      "story.metadata",
      "story.insights"
    ],
    dataWrite: [],
    storage: "server",
    multilingual: true,
    accessibility: true,
    notes: "Read-only dashboard, links to Story Builder"
  },
  {
    screen: "StoryBuilderScreen",
    dataRead: [
      "story.nodes[]",
      "story.connections[]",
      "user.profile.language"
    ],
    dataWrite: [
      "story.nodes[]",
      "story.nodes[].title",
      "story.nodes[].content",
      "story.nodes[].type",
      "story.connections[]"
    ],
    storage: "server",
    multilingual: true,
    accessibility: true,
    notes: "All text fields support EN/FR/ES, auto-save on edit"
  },
  {
    screen: "StoryBranchMapScreen",
    dataRead: [
      "story.nodes[]",
      "story.connections[]"
    ],
    dataWrite: [
      "story.nodes[].position",
      "story.connections[]"
    ],
    storage: "server",
    multilingual: false,
    accessibility: true,
    notes: "Visual-only editing, no content changes"
  },
  {
    screen: "ChapterInsightsPanel",
    dataRead: [
      "chapter.insights.qualitative",
      "chapter.insights.responseTypes",
      "chapter.insights.languageUsage",
      "user.profile.language"
    ],
    dataWrite: [],
    storage: "server",
    multilingual: true,
    accessibility: true,
    notes: "Qualitative signals only, no individual user tracking"
  },

  // INSTITUTIONAL PARTNERSHIPS
  {
    screen: "ObjectQREntryScreen",
    dataRead: [
      "object.story.id",
      "object.metadata",
      "story.preview"
    ],
    dataWrite: [
      "user.scannedObjects[]"
    ],
    storage: "both",
    multilingual: true,
    accessibility: true,
    notes: "QR code triggers story reveal, tracks scanned objects locally"
  },
  {
    screen: "BrockCollaborationScreen",
    dataRead: [
      "institution.metadata",
      "institution.featuredStories[]",
      "user.profile.language"
    ],
    dataWrite: [],
    storage: "server",
    multilingual: true,
    accessibility: true,
    notes: "Display only, no user data written"
  },
  {
    screen: "InstitutionalCollectionScreen",
    dataRead: [
      "collection.metadata",
      "collection.stories[]",
      "collection.contributors[]",
      "user.profile.language"
    ],
    dataWrite: [],
    storage: "server",
    multilingual: true,
    accessibility: true,
    notes: "Curated collections, admin-managed only"
  },
  {
    screen: "ContributorProfileCard",
    dataRead: [
      "contributor.metadata",
      "contributor.stories[]",
      "contributor.bio[language]"
    ],
    dataWrite: [],
    storage: "server",
    multilingual: true,
    accessibility: true,
    notes: "Display only, part of institutional collections"
  },

  // SETTINGS & PREFERENCES
  {
    screen: "ProfilePreferencesScreen",
    dataRead: [
      "user.profile.language",
      "user.audioSettings",
      "user.savedStories[]",
      "user.downloadedStories[]"
    ],
    dataWrite: [
      "user.profile.language",
      "user.audioSettings.quality",
      "user.audioSettings.autoplay"
    ],
    storage: "local",
    multilingual: true,
    accessibility: true,
    notes: "All preferences stored locally first"
  },
  {
    screen: "AccessibilityControlsScreen",
    dataRead: [
      "user.accessibility.highContrast",
      "user.accessibility.textSize",
      "user.accessibility.captions",
      "user.accessibility.reducedMotion",
      "user.accessibility.audioDescriptions",
      "user.accessibility.darkMode"
    ],
    dataWrite: [
      "user.accessibility.*"
    ],
    storage: "local",
    multilingual: true,
    accessibility: true,
    notes: "Accessibility settings persist across sessions, local only"
  },
  {
    screen: "AboutScreen",
    dataRead: ["user.profile.language"],
    dataWrite: [],
    storage: "local",
    multilingual: true,
    accessibility: true,
    notes: "Static content only"
  }
];

/**
 * DATA STORAGE LAYERS
 */
export const STORAGE_LAYERS = {
  local: {
    description: "Device-only storage (localStorage/AsyncStorage)",
    use_cases: [
      "User preferences (language, audio quality)",
      "Accessibility settings",
      "Scanned objects history",
      "Playback state (temporary)",
      "Downloaded stories (offline access)"
    ],
    privacy: "Never transmitted to server",
    retention: "Persists until user clears app data"
  },
  server: {
    description: "Backend API storage (authenticated)",
    use_cases: [
      "Story metadata and content",
      "User progress snapshots (for resume)",
      "Community responses (moderated)",
      "Creator-owned stories",
      "Institutional collections"
    ],
    privacy: "Minimal user identifiers, no behavioral tracking",
    retention: "Persists according to content ownership"
  },
  hybrid: {
    description: "Local-first with optional server sync",
    use_cases: [
      "Progress tracking (local cache, sync on pause)",
      "Saved stories list",
      "Creator draft edits (auto-save)"
    ],
    privacy: "User controls sync timing",
    retention: "Local cache refreshed on app launch"
  }
};

/**
 * MULTILINGUAL DATA SCHEMA
 */
export interface MultilingualContent {
  en: string;
  fr: string;
  es: string;
}

export interface StoryMetadata {
  id: string;
  title: MultilingualContent;
  description: MultilingualContent;
  creatorName: string;
  availableLanguages: ("en" | "fr" | "es")[];
  defaultLanguage: "en" | "fr" | "es";
}

export interface ChapterContent {
  id: string;
  title: MultilingualContent;
  text?: MultilingualContent;
  audioUrl?: {
    en?: string;
    fr?: string;
    es?: string;
  };
  captions?: {
    en?: string;
    fr?: string;
    es?: string;
  };
  audioLayers: AudioLayer[];
}

export interface AudioLayer {
  id: string;
  type: "music" | "ambient" | "narration";
  name: string;
  url: string;
  volume: number;
  fadeIn: number;
  fadeOut: number;
  loop: boolean;
}

/**
 * ACCESSIBILITY DATA SCHEMA
 */
export interface AccessibilitySettings {
  highContrast: boolean;
  increasedTextSize: boolean; // 20% larger
  captionsAlways: boolean;
  reducedMotion: boolean;
  audioDescriptions: boolean;
  darkMode: boolean;
}

/**
 * VISUAL COMPONENT: Data Binding Reference
 */
interface DataBindingReferenceProps {
  onClose: () => void;
}

export function DataBindingReference({ onClose }: DataBindingReferenceProps) {
  const getStorageColor = (storage: string) => {
    switch (storage) {
      case "local": return "green";
      case "server": return "blue";
      case "both": return "purple";
      default: return "white";
    }
  };

  return (
    <div className="min-h-screen bg-black text-white p-8 overflow-auto">
      <div className="max-w-6xl mx-auto pb-20">
        <div className="mb-8">
          <h1 className="text-3xl tracking-tight mb-2">SEEN Data Architecture</h1>
          <p className="text-white/60">Screen-to-data binding reference for developers</p>
        </div>

        {/* Legend */}
        <div className="flex gap-4 mb-8 p-4 rounded-xl bg-white/5 border border-white/10">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-green-400" />
            <span className="text-xs text-white/70">Local Only</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-blue-400" />
            <span className="text-xs text-white/70">Server Only</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-purple-400" />
            <span className="text-xs text-white/70">Both (Hybrid)</span>
          </div>
        </div>

        {/* Bindings table */}
        <div className="space-y-4">
          {DATA_BINDINGS.map((binding, index) => {
            const color = getStorageColor(binding.storage);
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.02 }}
                className="p-5 rounded-xl bg-white/5 border border-white/10"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-base text-white">{binding.screen}</h3>
                      <div className={`px-2 py-0.5 rounded bg-${color}-500/20 border border-${color}-400/30`}>
                        <span className={`text-xs text-${color}-300`}>{binding.storage}</span>
                      </div>
                    </div>
                    <p className="text-xs text-white/50">{binding.notes}</p>
                  </div>
                  <div className="flex gap-2">
                    {binding.multilingual && (
                      <div className="w-8 h-8 rounded-lg bg-blue-500/20 border border-blue-400/30 flex items-center justify-center">
                        <Globe className="w-4 h-4 text-blue-300" />
                      </div>
                    )}
                    {binding.accessibility && (
                      <div className="w-8 h-8 rounded-lg bg-green-500/20 border border-green-400/30 flex items-center justify-center">
                        <Shield className="w-4 h-4 text-green-300" />
                      </div>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  {/* Data Read */}
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <Eye className="w-3 h-3 text-white/40" />
                      <span className="text-xs tracking-wider uppercase text-white/40">Read</span>
                    </div>
                    {binding.dataRead.length > 0 ? (
                      <div className="space-y-1">
                        {binding.dataRead.map((field, i) => (
                          <div key={i} className="text-xs text-white/60 font-mono bg-white/5 px-2 py-1 rounded">
                            {field}
                          </div>
                        ))}
                      </div>
                    ) : (
                      <span className="text-xs text-white/30">None</span>
                    )}
                  </div>

                  {/* Data Write */}
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <Edit className="w-3 h-3 text-white/40" />
                      <span className="text-xs tracking-wider uppercase text-white/40">Write</span>
                    </div>
                    {binding.dataWrite.length > 0 ? (
                      <div className="space-y-1">
                        {binding.dataWrite.map((field, i) => (
                          <div key={i} className="text-xs text-white/60 font-mono bg-white/5 px-2 py-1 rounded">
                            {field}
                          </div>
                        ))}
                      </div>
                    ) : (
                      <span className="text-xs text-white/30">None</span>
                    )}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Storage layers explanation */}
        <div className="mt-12 space-y-4">
          <h2 className="text-xl tracking-tight mb-4">Storage Layers</h2>
          {Object.entries(STORAGE_LAYERS).map(([key, layer], index) => (
            <motion.div
              key={key}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 + index * 0.1 }}
              className="p-5 rounded-xl bg-white/5 border border-white/10"
            >
              <div className="flex items-center gap-3 mb-3">
                {key === "local" && <HardDrive className="w-5 h-5 text-green-300" />}
                {key === "server" && <Server className="w-5 h-5 text-blue-300" />}
                {key === "hybrid" && <Database className="w-5 h-5 text-purple-300" />}
                <h3 className="text-base text-white capitalize">{key}</h3>
              </div>
              <p className="text-sm text-white/60 mb-3">{layer.description}</p>
              <div className="space-y-2">
                <div className="text-xs tracking-wider uppercase text-white/40">Use Cases:</div>
                <ul className="space-y-1">
                  {layer.use_cases.map((useCase, i) => (
                    <li key={i} className="text-xs text-white/60 pl-3 border-l-2 border-white/10">
                      {useCase}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="mt-3 pt-3 border-t border-white/5">
                <span className="text-xs text-white/40">Privacy: </span>
                <span className="text-xs text-white/60">{layer.privacy}</span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}