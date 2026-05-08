import { motion } from "motion/react";
import { AlertTriangle, CheckCircle, Info, Zap, Volume2, Image as ImageIcon, Video } from "lucide-react";

/**
 * TECHNICAL RISK ASSESSMENT & MULTIMEDIA HANDLING
 * Comprehensive risk mitigation and advanced media layer specifications
 */

export interface TechnicalRisk {
  category: "audio" | "performance" | "accessibility" | "multilingual" | "moderation" | "platform" | "institutional";
  risk: string;
  severity: "low" | "medium" | "high";
  mitigation: string;
  status: "mitigated" | "in_progress" | "identified";
}

export const TECHNICAL_RISKS: TechnicalRisk[] = [
  // AUDIO RISKS
  {
    category: "audio",
    risk: "Audio continuity loss across chapter transitions",
    severity: "high",
    mitigation: "Playback state object with timestamp tracking. Fade-out old layers, preload next chapter audio, fade-in with seamless transition.",
    status: "mitigated"
  },
  {
    category: "audio",
    risk: "Multiple audio layer synchronization",
    severity: "medium",
    mitigation: "Web Audio API for precise timing. All layers share master clock. Volume crossfades managed by AudioContext.",
    status: "mitigated"
  },
  {
    category: "audio",
    risk: "Audio file size impacts performance on mobile",
    severity: "medium",
    mitigation: "Lazy-load audio per chapter. Max 5MB per audio file. Compressed AAC format. Preload next chapter during current playback.",
    status: "mitigated"
  },

  // PERFORMANCE RISKS
  {
    category: "performance",
    risk: "Large media files slow down initial load",
    severity: "high",
    mitigation: "Progressive loading: text first, images on scroll, audio on play. Use CDN for media assets. Implement service worker for offline caching.",
    status: "mitigated"
  },
  {
    category: "performance",
    risk: "Branching complexity creates confusing UX",
    severity: "medium",
    mitigation: "Week 3 scope: soft branches only (optional perspectives, not divergent paths). Linear default with clear branch indicators.",
    status: "mitigated"
  },
  {
    category: "performance",
    risk: "Animation overload on low-end devices",
    severity: "low",
    mitigation: "Reduced motion setting always available. CSS-based animations preferred. Motion.js animations optimized for 60fps.",
    status: "mitigated"
  },

  // ACCESSIBILITY RISKS
  {
    category: "accessibility",
    risk: "Missing captions exclude deaf/hard-of-hearing users",
    severity: "high",
    mitigation: "Captions required for all audio/video. Creator validation enforces caption upload. Always-on caption toggle in accessibility settings.",
    status: "mitigated"
  },
  {
    category: "accessibility",
    risk: "Low contrast text unreadable for low vision users",
    severity: "medium",
    mitigation: "WCAG 2.1 AA contrast ratios enforced. High contrast mode available. Text size increase option (+20%).",
    status: "mitigated"
  },
  {
    category: "accessibility",
    risk: "Screen reader compatibility issues",
    severity: "medium",
    mitigation: "Semantic HTML structure. ARIA labels on all interactive elements. Keyboard navigation fully supported.",
    status: "mitigated"
  },

  // MULTILINGUAL RISKS
  {
    category: "multilingual",
    risk: "Missing translations break user experience",
    severity: "high",
    mitigation: "Fallback logic: selected language → default language → English → first available. Creator validation warns about missing translations.",
    status: "mitigated"
  },
  {
    category: "multilingual",
    risk: "Caption timing misalignment across languages",
    severity: "medium",
    mitigation: "Separate caption tracks per language. Timestamp validation on upload. Auto-sync tools available but manual review required.",
    status: "in_progress"
  },

  // MODERATION RISKS
  {
    category: "moderation",
    risk: "Community content abuse (hate speech, spam)",
    severity: "high",
    mitigation: "Human moderation required before public display. Audit trail for all actions. Flagging system for complex cases. Response time SLA: 24-48h.",
    status: "mitigated"
  },
  {
    category: "moderation",
    risk: "Moderator bias or inconsistent decisions",
    severity: "medium",
    mitigation: "Clear moderation guidelines. Cultural sensitivity training required. Audit log review by institutional admins. Appeal process available.",
    status: "mitigated"
  },

  // PLATFORM RISKS
  {
    category: "platform",
    risk: "Device compatibility (iOS, Android, Web)",
    severity: "medium",
    mitigation: "Start web-first (responsive design). Native wrappers for iOS/Android post-MVP. Progressive Web App for offline access.",
    status: "in_progress"
  },
  {
    category: "platform",
    risk: "Browser audio autoplay restrictions",
    severity: "low",
    mitigation: "User interaction required before audio starts (Play button). Autoplay only for subsequent chapters after initial interaction.",
    status: "mitigated"
  },

  // INSTITUTIONAL RISKS
  {
    category: "institutional",
    risk: "Institutional partnership misalignment",
    severity: "medium",
    mitigation: "Shared governance model with clear roles. Institutional admin accounts. Co-branded screens. Explicit consent for all stories.",
    status: "mitigated"
  },
  {
    category: "institutional",
    risk: "Student/faculty privacy concerns",
    severity: "high",
    mitigation: "Optional contributor profiles. No behavioral tracking. Local-first data storage. CMF-compliant privacy policy.",
    status: "mitigated"
  }
];

/**
 * ADVANCED MULTIMEDIA HANDLING SPECIFICATIONS
 */
export interface MultimediaLayer {
  type: "audio" | "video" | "image" | "text";
  layer: number; // Z-index equivalent
  fadeDuration: number; // milliseconds
  preloadStrategy: "eager" | "lazy" | "on-interaction";
}

export const MULTIMEDIA_SPECS = {
  audio: {
    formats: ["aac", "mp3", "ogg"],
    maxFileSize: "5MB per audio file",
    layers: [
      {
        name: "Background Music",
        type: "music",
        loop: true,
        volume: 0.7,
        fadeIn: 2000,
        fadeOut: 1500
      },
      {
        name: "Ambient Sounds",
        type: "ambient",
        loop: true,
        volume: 0.5,
        fadeIn: 1500,
        fadeOut: 1500
      },
      {
        name: "Narration",
        type: "narration",
        loop: false,
        volume: 1.0,
        fadeIn: 500,
        fadeOut: 500
      }
    ],
    transitions: {
      betweenChapters: "Crossfade with 1.5s overlap",
      withinChapter: "Volume modulation only",
      onPause: "Fade to 20% volume over 500ms",
      onResume: "Fade to original volume over 500ms"
    }
  },

  video: {
    formats: ["mp4", "webm"],
    maxFileSize: "20MB per video clip",
    resolution: "1080p max, adaptive streaming preferred",
    overlays: [
      {
        name: "Text Overlay",
        position: "bottom-third",
        background: "rgba(0,0,0,0.6) with backdrop-blur",
        animation: "Fade in/out with video timestamps"
      },
      {
        name: "Caption Bar",
        position: "bottom",
        alwaysVisible: true,
        maxLines: 2
      }
    ],
    autoplay: false,
    controls: "Custom controls with accessibility support"
  },

  images: {
    formats: ["jpg", "png", "webp"],
    maxFileSize: "2MB per image",
    optimization: "Automatic WebP conversion with fallback",
    lazy_loading: true,
    responsive: "Srcset with 480w, 768w, 1080w variants",
    alt_text: "Required for accessibility"
  },

  responses: {
    text: {
      maxLength: 500,
      formatting: "Plain text only, no HTML"
    },
    audio: {
      maxDuration: "120 seconds",
      format: "aac or mp3",
      maxFileSize: "3MB"
    },
    image: {
      maxFileSize: "2MB",
      aspectRatio: "Any, displayed as square in grid"
    }
  }
};

/**
 * PERFORMANCE BUDGETS
 */
export const PERFORMANCE_BUDGETS = {
  initialLoad: {
    target: "< 3 seconds on 3G",
    includes: ["HTML", "CSS", "Core JS", "First meaningful paint"]
  },
  
  chapterTransition: {
    target: "< 500ms",
    includes: ["Audio fade", "Content load", "Animation"]
  },

  mediaPreload: {
    strategy: "Preload next chapter during current playback",
    priority: "Audio > Text > Images > Video"
  },

  totalBundleSize: {
    target: "< 500KB gzipped for core bundle",
    chunks: "Code-split by route (Home, Story, Creator, Settings)"
  }
};

/**
 * VISUAL COMPONENT: Risk Dashboard
 */
interface RiskDashboardProps {
  onDismiss: () => void;
}

export function TechnicalRiskDashboard({ onDismiss }: RiskDashboardProps) {
  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "high": return "red";
      case "medium": return "amber";
      case "low": return "green";
      default: return "white";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "mitigated": return <CheckCircle className="w-4 h-4 text-green-400" />;
      case "in_progress": return <Zap className="w-4 h-4 text-amber-400" />;
      case "identified": return <AlertTriangle className="w-4 h-4 text-red-400" />;
      default: return null;
    }
  };

  const risksByCategory = TECHNICAL_RISKS.reduce((acc, risk) => {
    if (!acc[risk.category]) acc[risk.category] = [];
    acc[risk.category].push(risk);
    return acc;
  }, {} as Record<string, TechnicalRisk[]>);

  return (
    <div className="min-h-screen bg-black p-6 overflow-auto">
      <div className="max-w-6xl mx-auto pb-20">
        <div className="mb-8">
          <h1 className="text-3xl tracking-tight text-white mb-2">Technical Risk Assessment</h1>
          <p className="text-white/60">Comprehensive risk mitigation for SEEN platform</p>
        </div>

        {/* Summary */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          <div className="p-5 rounded-xl bg-green-500/10 border border-green-400/20">
            <div className="text-3xl text-green-300 mb-2">
              {TECHNICAL_RISKS.filter(r => r.status === "mitigated").length}
            </div>
            <div className="text-sm text-green-200/70">Mitigated</div>
          </div>
          <div className="p-5 rounded-xl bg-amber-500/10 border border-amber-400/20">
            <div className="text-3xl text-amber-300 mb-2">
              {TECHNICAL_RISKS.filter(r => r.status === "in_progress").length}
            </div>
            <div className="text-sm text-amber-200/70">In Progress</div>
          </div>
          <div className="p-5 rounded-xl bg-red-500/10 border border-red-400/20">
            <div className="text-3xl text-red-300 mb-2">
              {TECHNICAL_RISKS.filter(r => r.status === "identified").length}
            </div>
            <div className="text-sm text-red-200/70">Identified</div>
          </div>
        </div>

        {/* Risks by category */}
        <div className="space-y-6">
          {Object.entries(risksByCategory).map(([category, risks]) => (
            <div key={category} className="space-y-3">
              <h2 className="text-lg tracking-tight text-white capitalize">{category} Risks</h2>
              {risks.map((risk, index) => {
                const severityColor = getSeverityColor(risk.severity);
                return (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="p-5 rounded-xl bg-white/5 border border-white/10"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          {getStatusIcon(risk.status)}
                          <h3 className="text-base text-white">{risk.risk}</h3>
                        </div>
                      </div>
                      <div className={`px-3 py-1 rounded-full bg-${severityColor}-500/20 border border-${severityColor}-400/30`}>
                        <span className={`text-xs text-${severityColor}-300 capitalize`}>{risk.severity}</span>
                      </div>
                    </div>
                    
                    <div className="p-4 rounded-lg bg-white/5 border border-white/10">
                      <div className="flex items-center gap-2 mb-2">
                        <Info className="w-3 h-3 text-white/40" />
                        <span className="text-xs tracking-wider uppercase text-white/40">Mitigation</span>
                      </div>
                      <p className="text-sm text-white/70 leading-relaxed">{risk.mitigation}</p>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          ))}
        </div>

        {/* Multimedia specs */}
        <div className="mt-12 space-y-6">
          <h2 className="text-2xl tracking-tight text-white">Advanced Multimedia Handling</h2>

          {/* Audio layers */}
          <div className="p-6 rounded-xl bg-purple-500/5 border border-purple-400/20">
            <div className="flex items-center gap-2 mb-4">
              <Volume2 className="w-5 h-5 text-purple-300" />
              <h3 className="text-lg text-purple-200">Audio Layer System</h3>
            </div>
            <div className="space-y-3">
              {MULTIMEDIA_SPECS.audio.layers.map((layer, index) => (
                <div key={index} className="p-4 rounded-lg bg-white/5 border border-white/10">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="text-sm text-white">{layer.name}</h4>
                    <span className="text-xs text-white/40 capitalize">{layer.type}</span>
                  </div>
                  <div className="grid grid-cols-3 gap-3 text-xs text-white/60">
                    <div>Volume: {Math.round(layer.volume * 100)}%</div>
                    <div>Fade In: {layer.fadeIn}ms</div>
                    <div>Fade Out: {layer.fadeOut}ms</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Video specs */}
          <div className="p-6 rounded-xl bg-blue-500/5 border border-blue-400/20">
            <div className="flex items-center gap-2 mb-4">
              <Video className="w-5 h-5 text-blue-300" />
              <h3 className="text-lg text-blue-200">Video Specifications</h3>
            </div>
            <div className="grid grid-cols-2 gap-4 text-sm text-blue-200/70">
              <div>
                <div className="text-xs text-blue-300 mb-1">Formats</div>
                <div>{MULTIMEDIA_SPECS.video.formats.join(", ")}</div>
              </div>
              <div>
                <div className="text-xs text-blue-300 mb-1">Max Size</div>
                <div>{MULTIMEDIA_SPECS.video.maxFileSize}</div>
              </div>
              <div>
                <div className="text-xs text-blue-300 mb-1">Resolution</div>
                <div>{MULTIMEDIA_SPECS.video.resolution}</div>
              </div>
              <div>
                <div className="text-xs text-blue-300 mb-1">Autoplay</div>
                <div>{MULTIMEDIA_SPECS.video.autoplay ? "Yes" : "No (user interaction required)"}</div>
              </div>
            </div>
          </div>

          {/* Performance budgets */}
          <div className="p-6 rounded-xl bg-green-500/5 border border-green-400/20">
            <div className="flex items-center gap-2 mb-4">
              <Zap className="w-5 h-5 text-green-300" />
              <h3 className="text-lg text-green-200">Performance Budgets</h3>
            </div>
            <div className="space-y-3">
              {Object.entries(PERFORMANCE_BUDGETS).map(([key, budget]) => (
                <div key={key} className="p-4 rounded-lg bg-white/5 border border-white/10">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="text-sm text-white capitalize">{key.replace(/([A-Z])/g, ' $1')}</h4>
                    <span className="text-xs text-green-300">{budget.target}</span>
                  </div>
                  {budget.includes && (
                    <p className="text-xs text-white/50">Includes: {Array.isArray(budget.includes) ? budget.includes.join(", ") : budget.includes}</p>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}