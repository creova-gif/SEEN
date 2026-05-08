import { motion, AnimatePresence } from "motion/react";
import { useState } from "react";
import { Shield, CheckCircle, XCircle, Clock, AlertTriangle, ChevronDown, BookOpen, Mic, ImageIcon, Eye, BarChart2 } from "lucide-react";

export type ModerationStatus = "pending" | "approved" | "rejected" | "flagged";
export type UserRole = "contributor" | "creator" | "moderator" | "institutional_admin";

export interface CommunityResponse {
  id: string;
  chapterId: string;
  storyId: string;
  contributorId: string;
  contributorName: string;
  type: "text" | "audio" | "image";
  content: string;
  language: "en" | "fr" | "es";
  timestamp: Date;
  status: ModerationStatus;
  moderatorId?: string;
  moderatorNotes?: string;
  reviewedAt?: Date;
  flagReason?: string;
}

export interface ModerationAction {
  id: string;
  responseId: string;
  moderatorId: string;
  moderatorName: string;
  action: "approve" | "reject" | "flag";
  reason?: string;
  timestamp: Date;
  notes?: string;
}

export interface PermissionMatrix {
  role: UserRole;
  permissions: {
    submitResponse: boolean;
    createStory: boolean;
    moderateOwnStories: boolean;
    moderateAllStories: boolean;
    manageInstitutionalCollection: boolean;
    viewAuditLogs: boolean;
    editUserRoles: boolean;
  };
}

export const PERMISSION_MATRIX: PermissionMatrix[] = [
  {
    role: "contributor",
    permissions: {
      submitResponse: true,
      createStory: false,
      moderateOwnStories: false,
      moderateAllStories: false,
      manageInstitutionalCollection: false,
      viewAuditLogs: false,
      editUserRoles: false
    }
  },
  {
    role: "creator",
    permissions: {
      submitResponse: true,
      createStory: true,
      moderateOwnStories: true,
      moderateAllStories: false,
      manageInstitutionalCollection: false,
      viewAuditLogs: false,
      editUserRoles: false
    }
  },
  {
    role: "moderator",
    permissions: {
      submitResponse: true,
      createStory: true,
      moderateOwnStories: true,
      moderateAllStories: true,
      manageInstitutionalCollection: false,
      viewAuditLogs: true,
      editUserRoles: false
    }
  },
  {
    role: "institutional_admin",
    permissions: {
      submitResponse: true,
      createStory: true,
      moderateOwnStories: true,
      moderateAllStories: false,
      manageInstitutionalCollection: true,
      viewAuditLogs: true,
      editUserRoles: true
    }
  }
];

export const MODERATION_GUIDELINES = {
  approve_criteria: [
    "Respectful and thoughtful response",
    "Relates to the story/chapter content",
    "No harassment, hate speech, or threats",
    "No spam or promotional content",
    "Appropriate language for all ages (if story is family-friendly)"
  ],
  reject_criteria: [
    "Contains hate speech or discrimination",
    "Harasses or targets individuals",
    "Contains spam or promotional links",
    "Off-topic or unrelated to story",
    "Violates community guidelines"
  ],
  flag_criteria: [
    "Requires additional review",
    "Potential cultural sensitivity issue",
    "Unclear intent or context needed",
    "Language barrier (translation needed)"
  ],
  response_time: "24-48 hours for initial review",
  appeal_process: "Contributors can appeal rejected responses via email to moderation team"
};

function formatRelativeTime(date: Date): string {
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
  if (diffInSeconds < 60) return "just now";
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
  return `${Math.floor(diffInSeconds / 86400)}d ago`;
}

function getInitials(name: string) {
  return name.split(" ").map(n => n[0]).join("").slice(0, 2).toUpperCase();
}

function getAvatarColor(name: string) {
  const colors = [
    "from-violet-600/40 to-violet-900/40",
    "from-amber-600/40 to-amber-900/40",
    "from-teal-600/40 to-teal-900/40",
    "from-rose-600/40 to-rose-900/40",
    "from-sky-600/40 to-sky-900/40",
  ];
  const idx = name.charCodeAt(0) % colors.length;
  return colors[idx];
}

const TYPE_META = {
  text:  { icon: BookOpen,  label: "TEXT",  color: "text-emerald-400",  bg: "bg-emerald-500/10 border-emerald-500/20" },
  audio: { icon: Mic,       label: "AUDIO", color: "text-violet-400",   bg: "bg-violet-500/10 border-violet-500/20" },
  image: { icon: ImageIcon, label: "IMAGE", color: "text-sky-400",      bg: "bg-sky-500/10 border-sky-500/20" },
};

interface ModerationQueueProps {
  responses: CommunityResponse[];
  onApprove: (responseId: string, notes?: string) => void;
  onReject: (responseId: string, reason: string) => void;
  onFlag: (responseId: string, reason: string) => void;
  userRole: UserRole;
}

export function ModerationQueue({ responses, onApprove, onReject, onFlag, userRole }: ModerationQueueProps) {
  const pendingResponses = responses.filter(r => r.status === "pending");
  const flaggedResponses = responses.filter(r => r.status === "flagged");

  return (
    <div className="space-y-8 px-5 pt-6 pb-28">
      {/* Stats strip */}
      <div className="grid grid-cols-3 gap-3">
        {[
          { label: "PENDING",  value: pendingResponses.length, color: "text-amber-400" },
          { label: "FLAGGED",  value: flaggedResponses.length, color: "text-red-400" },
          { label: "TODAY",    value: responses.length,        color: "text-white/60" },
        ].map(s => (
          <div key={s.label} className="rounded-xl bg-white/[0.03] border border-white/[0.07] px-3 py-3 text-center">
            <p className={`text-2xl font-light tabular-nums ${s.color}`}>{s.value}</p>
            <p className="text-[9px] tracking-widest text-white/30 mt-0.5">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Flagged priority section */}
      <AnimatePresence>
        {flaggedResponses.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="space-y-3"
          >
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-3.5 h-3.5 text-red-400" />
              <span className="text-[10px] tracking-widest uppercase text-red-400 font-medium">Flagged · Priority</span>
              <div className="flex-1 h-px bg-red-500/20" />
            </div>
            {flaggedResponses.map((r, i) => (
              <ModerationCard key={r.id} response={r} onApprove={onApprove} onReject={onReject} onFlag={onFlag} index={i} priority />
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Pending section */}
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <Clock className="w-3.5 h-3.5 text-white/30" />
          <span className="text-[10px] tracking-widest uppercase text-white/30">Awaiting Review</span>
          <div className="flex-1 h-px bg-white/[0.06]" />
        </div>

        {pendingResponses.length > 0 ? (
          pendingResponses.map((r, i) => (
            <ModerationCard key={r.id} response={r} onApprove={onApprove} onReject={onReject} onFlag={onFlag} index={i} />
          ))
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="py-16 flex flex-col items-center gap-4"
          >
            <div className="w-14 h-14 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
              <CheckCircle className="w-6 h-6 text-emerald-400" strokeWidth={1.5} />
            </div>
            <div className="text-center">
              <p className="text-sm text-white/60">Queue is clear</p>
              <p className="text-xs text-white/25 mt-1 tracking-wide">All contributions reviewed</p>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}

interface ModerationCardProps {
  response: CommunityResponse;
  onApprove: (id: string, notes?: string) => void;
  onReject: (id: string, reason: string) => void;
  onFlag: (id: string, reason: string) => void;
  priority?: boolean;
  index: number;
}

function ModerationCard({ response, onApprove, onReject, onFlag, priority = false, index }: ModerationCardProps) {
  const [expanded, setExpanded] = useState(false);
  const [actionMode, setActionMode] = useState<null | "reject" | "flag">(null);
  const [inputValue, setInputValue] = useState("");
  const [resolved, setResolved] = useState(false);

  const TypeIcon = TYPE_META[response.type].icon;

  const handleApprove = () => {
    setResolved(true);
    setTimeout(() => onApprove(response.id), 400);
  };

  const handleAction = () => {
    if (!inputValue.trim()) return;
    setResolved(true);
    setTimeout(() => {
      if (actionMode === "reject") onReject(response.id, inputValue);
      if (actionMode === "flag") onFlag(response.id, inputValue);
    }, 400);
  };

  return (
    <AnimatePresence>
      {!resolved && (
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, x: 40, scale: 0.96 }}
          transition={{ delay: index * 0.06, duration: 0.3 }}
          className={`rounded-2xl border overflow-hidden ${
            priority
              ? "bg-red-950/20 border-red-500/20"
              : "bg-white/[0.03] border-white/[0.08]"
          }`}
        >
          {/* Top accent line */}
          <div className={`h-px w-full ${priority ? "bg-gradient-to-r from-red-500/60 via-red-400/30 to-transparent" : "bg-gradient-to-r from-amber-500/40 via-amber-400/10 to-transparent"}`} />

          <div className="p-4">
            {/* Row 1: avatar + name + type badge + time */}
            <div className="flex items-center gap-3 mb-3">
              <div className={`w-9 h-9 rounded-full bg-gradient-to-br ${getAvatarColor(response.contributorName)} border border-white/10 flex items-center justify-center shrink-0`}>
                <span className="text-[11px] font-medium text-white/80 tracking-wider">
                  {getInitials(response.contributorName)}
                </span>
              </div>

              <div className="flex-1 min-w-0">
                <p className="text-sm text-white/90 truncate">{response.contributorName}</p>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <span className="text-[10px] text-white/30 tracking-wide">{formatRelativeTime(response.timestamp)}</span>
                  <span className="text-white/15 text-[10px]">·</span>
                  <span className="text-[10px] text-white/30 uppercase tracking-widest">{response.language}</span>
                </div>
              </div>

              <div className={`flex items-center gap-1 px-2 py-1 rounded-full border text-[10px] tracking-widest uppercase ${TYPE_META[response.type].bg} ${TYPE_META[response.type].color}`}>
                <TypeIcon className="w-2.5 h-2.5" strokeWidth={2} />
                {TYPE_META[response.type].label}
              </div>
            </div>

            {/* Content preview */}
            <button
              onClick={() => setExpanded(v => !v)}
              className="w-full text-left mb-3 group"
            >
              <div className="relative rounded-xl bg-black/30 border border-white/[0.07] px-4 py-3">
                {response.type === "text" ? (
                  <p className={`text-sm text-white/70 leading-relaxed ${expanded ? "" : "line-clamp-2"}`}>
                    {response.content}
                  </p>
                ) : response.type === "audio" ? (
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-violet-500/20 border border-violet-400/30 flex items-center justify-center">
                      <Mic className="w-3.5 h-3.5 text-violet-400" />
                    </div>
                    <div>
                      <p className="text-xs text-white/60">Audio response</p>
                      <p className="text-[10px] text-white/30 tracking-wide">Tap to expand player</p>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-sky-500/20 border border-sky-400/30 flex items-center justify-center">
                      <Eye className="w-3.5 h-3.5 text-sky-400" />
                    </div>
                    <p className="text-xs text-white/60">Image attachment</p>
                  </div>
                )}

                <AnimatePresence>
                  {expanded && response.type === "audio" && (
                    <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} className="mt-3 overflow-hidden">
                      <audio src={response.content} controls className="w-full" />
                    </motion.div>
                  )}
                  {expanded && response.type === "image" && (
                    <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} className="mt-3 overflow-hidden">
                      <img src={response.content} alt="Response" className="w-full rounded-lg" />
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Expand chevron */}
                {response.type === "text" && response.content.length > 80 && (
                  <motion.div
                    animate={{ rotate: expanded ? 180 : 0 }}
                    className="absolute bottom-2 right-3 text-white/20 group-hover:text-white/40 transition-colors"
                  >
                    <ChevronDown className="w-3.5 h-3.5" />
                  </motion.div>
                )}
              </div>
            </button>

            {/* Flag reason if flagged */}
            <AnimatePresence>
              {response.flagReason && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="mb-3 flex items-start gap-2 px-3 py-2 rounded-lg bg-amber-500/8 border border-amber-400/15"
                >
                  <AlertTriangle className="w-3 h-3 text-amber-400 mt-0.5 shrink-0" />
                  <p className="text-[11px] text-amber-300/70 leading-relaxed">{response.flagReason}</p>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Action buttons */}
            <AnimatePresence mode="wait">
              {actionMode === null ? (
                <motion.div
                  key="actions"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex gap-2"
                >
                  <button
                    onClick={handleApprove}
                    className="flex-1 py-2.5 rounded-xl bg-emerald-500/12 border border-emerald-400/25 text-xs tracking-wider uppercase text-emerald-400 hover:bg-emerald-500/20 transition-all duration-200 flex items-center justify-center gap-1.5 active:scale-[0.98]"
                  >
                    <CheckCircle className="w-3.5 h-3.5" strokeWidth={2} />
                    Approve
                  </button>
                  <button
                    onClick={() => { setActionMode("reject"); setInputValue(""); }}
                    className="flex-1 py-2.5 rounded-xl bg-red-500/12 border border-red-400/25 text-xs tracking-wider uppercase text-red-400 hover:bg-red-500/20 transition-all duration-200 flex items-center justify-center gap-1.5 active:scale-[0.98]"
                  >
                    <XCircle className="w-3.5 h-3.5" strokeWidth={2} />
                    Reject
                  </button>
                  <button
                    onClick={() => { setActionMode("flag"); setInputValue(""); }}
                    className="px-3 py-2.5 rounded-xl bg-amber-500/12 border border-amber-400/25 text-xs tracking-wider uppercase text-amber-400 hover:bg-amber-500/20 transition-all duration-200 active:scale-[0.98]"
                  >
                    Flag
                  </button>
                </motion.div>
              ) : (
                <motion.div
                  key="input"
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -6 }}
                  className="space-y-2"
                >
                  <p className="text-[10px] tracking-widest uppercase text-white/30">
                    {actionMode === "reject" ? "Rejection reason" : "Flag reason"}
                  </p>
                  <textarea
                    value={inputValue}
                    onChange={e => setInputValue(e.target.value)}
                    placeholder={actionMode === "reject" ? "Why is this being rejected?" : "What needs review?"}
                    rows={2}
                    autoFocus
                    className="w-full bg-white/[0.04] border border-white/10 rounded-xl px-3 py-2.5 text-sm text-white/80 placeholder-white/20 resize-none focus:outline-none focus:border-white/20 leading-relaxed"
                  />
                  <div className="flex gap-2">
                    <button
                      onClick={() => setActionMode(null)}
                      className="flex-1 py-2 rounded-xl border border-white/10 text-xs text-white/40 hover:text-white/60 transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleAction}
                      disabled={!inputValue.trim()}
                      className={`flex-1 py-2 rounded-xl text-xs tracking-wider uppercase transition-all duration-200 disabled:opacity-30 ${
                        actionMode === "reject"
                          ? "bg-red-500/20 border border-red-400/30 text-red-300"
                          : "bg-amber-500/20 border border-amber-400/30 text-amber-300"
                      }`}
                    >
                      Confirm
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

interface AuditLogViewerProps {
  actions: ModerationAction[];
  userRole: UserRole;
}

export function AuditLogViewer({ actions, userRole }: AuditLogViewerProps) {
  const canView = userRole === "moderator" || userRole === "institutional_admin";

  if (!canView) {
    return (
      <div className="px-5 pt-8 flex flex-col items-center gap-4">
        <div className="w-14 h-14 rounded-full bg-red-500/10 border border-red-500/20 flex items-center justify-center">
          <Shield className="w-6 h-6 text-red-400" strokeWidth={1.5} />
        </div>
        <p className="text-sm text-white/40 text-center">Moderator access required</p>
      </div>
    );
  }

  const actionMeta = {
    approve: { icon: CheckCircle, color: "text-emerald-400", border: "border-emerald-500/20", bg: "bg-emerald-500/5", label: "Approved" },
    reject:  { icon: XCircle,     color: "text-red-400",     border: "border-red-500/20",     bg: "bg-red-500/5",     label: "Rejected" },
    flag:    { icon: AlertTriangle,color: "text-amber-400",   border: "border-amber-500/20",   bg: "bg-amber-500/5",   label: "Flagged"  },
  };

  return (
    <div className="px-5 pt-6 pb-28 space-y-4">
      <div className="flex items-center gap-2 mb-6">
        <BarChart2 className="w-3.5 h-3.5 text-white/30" />
        <span className="text-[10px] tracking-widest uppercase text-white/30">Action History</span>
        <div className="flex-1 h-px bg-white/[0.06]" />
        <span className="text-[10px] text-white/20">{actions.length} entries</span>
      </div>

      {actions.length === 0 ? (
        <div className="py-16 flex flex-col items-center gap-3">
          <p className="text-sm text-white/30">No actions recorded yet</p>
        </div>
      ) : (
        <div className="relative">
          {/* Timeline line */}
          <div className="absolute left-[18px] top-2 bottom-2 w-px bg-white/[0.06]" />

          <div className="space-y-4">
            {actions.map((action, i) => {
              const meta = actionMeta[action.action];
              const Icon = meta.icon;
              return (
                <motion.div
                  key={action.id}
                  initial={{ opacity: 0, x: -12 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.07 }}
                  className="flex gap-4"
                >
                  <div className={`w-9 h-9 rounded-full border shrink-0 flex items-center justify-center ${meta.bg} ${meta.border} z-10`}>
                    <Icon className={`w-4 h-4 ${meta.color}`} strokeWidth={1.5} />
                  </div>

                  <div className="flex-1 rounded-xl border border-white/[0.07] bg-white/[0.03] px-4 py-3">
                    <div className="flex items-start justify-between mb-1">
                      <p className={`text-sm font-medium ${meta.color}`}>{meta.label}</p>
                      <span className="text-[10px] text-white/25">{formatRelativeTime(action.timestamp)}</span>
                    </div>
                    <p className="text-xs text-white/40 mb-1">by {action.moderatorName}</p>
                    {action.reason && (
                      <p className="text-xs text-white/30 mt-1 leading-relaxed">"{action.reason}"</p>
                    )}
                    {action.notes && (
                      <p className="text-xs text-white/25 mt-1 italic leading-relaxed">{action.notes}</p>
                    )}
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

export function GovernanceGuidelines() {
  const [open, setOpen] = useState<string | null>(null);

  const sections = [
    {
      id: "approve",
      label: "Approval Criteria",
      icon: CheckCircle,
      color: "text-emerald-400",
      borderColor: "border-emerald-500/20",
      bg: "bg-emerald-500/5",
      items: MODERATION_GUIDELINES.approve_criteria,
      marker: "✓",
      markerColor: "text-emerald-500/60",
    },
    {
      id: "reject",
      label: "Rejection Criteria",
      icon: XCircle,
      color: "text-red-400",
      borderColor: "border-red-500/20",
      bg: "bg-red-500/5",
      items: MODERATION_GUIDELINES.reject_criteria,
      marker: "✗",
      markerColor: "text-red-500/60",
    },
    {
      id: "flag",
      label: "Flag for Review",
      icon: AlertTriangle,
      color: "text-amber-400",
      borderColor: "border-amber-500/20",
      bg: "bg-amber-500/5",
      items: MODERATION_GUIDELINES.flag_criteria,
      marker: "·",
      markerColor: "text-amber-500/60",
    },
  ];

  return (
    <div className="px-5 pt-6 pb-28 space-y-3">
      <div className="flex items-center gap-2 mb-6">
        <Shield className="w-3.5 h-3.5 text-white/30" />
        <span className="text-[10px] tracking-widest uppercase text-white/30">Community Standards</span>
        <div className="flex-1 h-px bg-white/[0.06]" />
      </div>

      {sections.map(s => {
        const Icon = s.icon;
        const isOpen = open === s.id;
        return (
          <div key={s.id} className={`rounded-2xl border overflow-hidden ${s.borderColor} ${s.bg}`}>
            <button
              onClick={() => setOpen(isOpen ? null : s.id)}
              className="w-full flex items-center justify-between px-4 py-4"
            >
              <div className="flex items-center gap-3">
                <Icon className={`w-4 h-4 ${s.color}`} strokeWidth={1.5} />
                <span className={`text-sm ${s.color}`}>{s.label}</span>
              </div>
              <motion.div animate={{ rotate: isOpen ? 180 : 0 }}>
                <ChevronDown className={`w-4 h-4 ${s.color} opacity-50`} />
              </motion.div>
            </button>

            <AnimatePresence>
              {isOpen && (
                <motion.ul
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="overflow-hidden"
                >
                  <div className="px-4 pb-4 space-y-2">
                    {s.items.map((item, i) => (
                      <div key={i} className="flex items-start gap-2">
                        <span className={`text-xs mt-0.5 shrink-0 ${s.markerColor}`}>{s.marker}</span>
                        <span className="text-xs text-white/50 leading-relaxed">{item}</span>
                      </div>
                    ))}
                  </div>
                </motion.ul>
              )}
            </AnimatePresence>
          </div>
        );
      })}

      <div className="rounded-2xl border border-white/[0.07] bg-white/[0.02] p-4 space-y-3 mt-2">
        <p className="text-[10px] tracking-widest uppercase text-white/25">Process Notes</p>
        {[
          `Response time: ${MODERATION_GUIDELINES.response_time}`,
          MODERATION_GUIDELINES.appeal_process,
          "All actions are logged with timestamps and moderator IDs",
          "Cultural sensitivity training required for moderators",
        ].map((note, i) => (
          <div key={i} className="flex items-start gap-2">
            <span className="text-white/15 text-xs shrink-0 mt-0.5">·</span>
            <p className="text-xs text-white/35 leading-relaxed">{note}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

interface ModerationGovernanceSystemProps {
  onBack: () => void;
}

export function ModerationGovernanceSystem({ onBack }: ModerationGovernanceSystemProps) {
  const [activeTab, setActiveTab] = useState<"queue" | "audit" | "guidelines">("queue");

  const mockResponses: CommunityResponse[] = [
    {
      id: "resp-1",
      chapterId: "ch-1",
      storyId: "midnight-resonance",
      contributorId: "user-1",
      contributorName: "Maria Santos",
      type: "text",
      content: "This chapter reminded me of walking through Tokyo at 3 AM. The silence speaks volumes — the way Oscar Peterson's music fills that quiet is something you feel in your chest, not just your ears.",
      language: "en",
      timestamp: new Date(Date.now() - 3600000),
      status: "pending"
    },
    {
      id: "resp-2",
      chapterId: "ch-2",
      storyId: "midnight-resonance",
      contributorId: "user-2",
      contributorName: "Jean Dubois",
      type: "text",
      content: "La résonance binaurale crée une expérience immersive incroyable. Mon grand-père était pianiste à Montréal dans les années 60.",
      language: "fr",
      timestamp: new Date(Date.now() - 7200000),
      status: "pending"
    },
    {
      id: "resp-3",
      chapterId: "ch-1",
      storyId: "iron-road",
      contributorId: "user-3",
      contributorName: "Priya Nair",
      type: "audio",
      content: "/audio/sample.mp3",
      language: "en",
      timestamp: new Date(Date.now() - 1800000),
      status: "flagged",
      flagReason: "Potential cultural sensitivity — requires second review before approval."
    }
  ];

  const mockActions: ModerationAction[] = [
    {
      id: "act-1",
      responseId: "resp-4",
      moderatorId: "mod-1",
      moderatorName: "Admin User",
      action: "approve",
      timestamp: new Date(Date.now() - 86400000),
      notes: "Thoughtful reflection on cultural context"
    },
    {
      id: "act-2",
      responseId: "resp-5",
      moderatorId: "mod-1",
      moderatorName: "Admin User",
      action: "reject",
      reason: "Off-topic and promotional content",
      timestamp: new Date(Date.now() - 172800000),
    }
  ];

  const handleApprove = (id: string, notes?: string) => console.log("Approved:", id, notes);
  const handleReject = (id: string, reason: string) => console.log("Rejected:", id, reason);
  const handleFlag = (id: string, reason: string) => console.log("Flagged:", id, reason);

  const tabs = [
    { id: "queue" as const,      label: "Queue",      count: mockResponses.length },
    { id: "audit" as const,      label: "Audit Log",  count: null },
    { id: "guidelines" as const, label: "Guidelines", count: null },
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen bg-black"
    >
      {/* Header */}
      <div className="sticky top-0 z-20 bg-black/90 backdrop-blur-2xl border-b border-white/[0.07]">
        <div className="max-w-[428px] mx-auto px-4 pt-4 pb-0">
          <div className="flex items-center gap-3 pb-4">
            <button
              onClick={onBack}
              className="w-9 h-9 rounded-full bg-white/[0.04] border border-white/[0.08] flex items-center justify-center hover:bg-white/[0.08] transition-colors active:scale-95"
            >
              <span className="text-white/50 text-sm leading-none">←</span>
            </button>
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <Shield className="w-4 h-4 text-amber-400" strokeWidth={1.5} />
                <h1 className="text-base text-white tracking-tight">Moderation</h1>
                <span className="px-2 py-0.5 rounded-full bg-amber-500/15 border border-amber-400/25 text-[9px] tracking-widest uppercase text-amber-400 ml-1">
                  Live
                </span>
              </div>
              <p className="text-[11px] text-white/30 tracking-wide mt-0.5">Community content review</p>
            </div>
          </div>

          {/* Tab bar */}
          <div className="flex">
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`relative flex-1 py-3 text-xs tracking-wider transition-all duration-200 ${
                  activeTab === tab.id ? "text-white" : "text-white/35 hover:text-white/55"
                }`}
              >
                <span className="flex items-center justify-center gap-1.5">
                  {tab.label}
                  {tab.count !== null && (
                    <span className={`text-[9px] px-1.5 py-0.5 rounded-full ${
                      activeTab === tab.id
                        ? "bg-amber-500/20 text-amber-400 border border-amber-400/30"
                        : "bg-white/[0.06] text-white/30"
                    }`}>
                      {tab.count}
                    </span>
                  )}
                </span>
                {activeTab === tab.id && (
                  <motion.div
                    layoutId="tab-underline"
                    className="absolute bottom-0 left-3 right-3 h-px bg-amber-400/70 rounded-full"
                  />
                )}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-[428px] mx-auto">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2 }}
          >
            {activeTab === "queue" && (
              <ModerationQueue
                responses={mockResponses}
                onApprove={handleApprove}
                onReject={handleReject}
                onFlag={handleFlag}
                userRole="moderator"
              />
            )}
            {activeTab === "audit" && (
              <AuditLogViewer actions={mockActions} userRole="moderator" />
            )}
            {activeTab === "guidelines" && <GovernanceGuidelines />}
          </motion.div>
        </AnimatePresence>
      </div>
    </motion.div>
  );
}
