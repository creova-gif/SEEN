import { motion, AnimatePresence } from "motion/react";
import { useState } from "react";
import { Shield, CheckCircle, XCircle, Clock, AlertTriangle, ArrowLeft, BookOpen, Mic, ImageIcon, BarChart2 } from "lucide-react";

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
  { role: "contributor", permissions: { submitResponse: true, createStory: false, moderateOwnStories: false, moderateAllStories: false, manageInstitutionalCollection: false, viewAuditLogs: false, editUserRoles: false } },
  { role: "creator", permissions: { submitResponse: true, createStory: true, moderateOwnStories: true, moderateAllStories: false, manageInstitutionalCollection: false, viewAuditLogs: false, editUserRoles: false } },
  { role: "moderator", permissions: { submitResponse: true, createStory: true, moderateOwnStories: true, moderateAllStories: true, manageInstitutionalCollection: false, viewAuditLogs: true, editUserRoles: false } },
  { role: "institutional_admin", permissions: { submitResponse: true, createStory: true, moderateOwnStories: true, moderateAllStories: false, manageInstitutionalCollection: true, viewAuditLogs: true, editUserRoles: true } },
];

export const MODERATION_GUIDELINES = {
  approve_criteria: [
    "Respectful and thoughtful response",
    "Relates to the story/chapter content",
    "No harassment, hate speech, or threats",
    "No spam or promotional content",
    "Appropriate language for all ages (if story is family-friendly)",
  ],
  reject_criteria: [
    "Contains hate speech or discrimination",
    "Harasses or targets individuals",
    "Contains spam or promotional links",
    "Off-topic or unrelated to story",
    "Violates community guidelines",
  ],
  flag_criteria: [
    "Requires additional review",
    "Potential cultural sensitivity issue",
    "Unclear intent or context needed",
    "Language barrier (translation needed)",
  ],
  response_time: "24-48 hours for initial review",
  appeal_process: "Contributors can appeal rejected responses via email to moderation team",
};

function formatRelativeTime(date: Date): string {
  const now = new Date();
  const diff = Math.floor((now.getTime() - date.getTime()) / 1000);
  if (diff < 60) return "just now";
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  return `${Math.floor(diff / 86400)}d ago`;
}

function getInitials(name: string) {
  return name.split(" ").map(n => n[0]).join("").slice(0, 2).toUpperCase();
}

// ─── QUEUE TAB ────────────────────────────────────────────────────────────────

interface ModerationQueueProps {
  responses: CommunityResponse[];
  onApprove: (id: string, notes?: string) => void;
  onReject: (id: string, reason: string) => void;
  onFlag: (id: string, reason: string) => void;
  userRole: UserRole;
}

export function ModerationQueue({ responses, onApprove, onReject, onFlag }: ModerationQueueProps) {
  const pending = responses.filter(r => r.status === "pending");
  const flagged = responses.filter(r => r.status === "flagged");

  return (
    <div className="space-y-6">
      {/* Flagged — priority */}
      <AnimatePresence>
        {flagged.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="space-y-3"
          >
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-white/40" />
              <h3 className="text-sm tracking-wider uppercase text-white/40">Flagged · Priority</h3>
            </div>
            {flagged.map((r, i) => (
              <ReviewCard key={r.id} response={r} onApprove={onApprove} onReject={onReject} onFlag={onFlag} index={i} priority />
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Pending */}
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <Clock className="w-4 h-4 text-white/40" />
          <h3 className="text-sm tracking-wider uppercase text-white/40">Awaiting Review</h3>
        </div>

        {pending.length > 0 ? (
          pending.map((r, i) => (
            <ReviewCard key={r.id} response={r} onApprove={onApprove} onReject={onReject} onFlag={onFlag} index={i} />
          ))
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="py-14 flex flex-col items-center gap-4"
          >
            <div className="w-12 h-12 rounded-full bg-white/5 border border-white/10 flex items-center justify-center">
              <CheckCircle className="w-5 h-5 text-white/30" strokeWidth={1.5} />
            </div>
            <div className="text-center">
              <p className="text-sm text-white/50">Queue is clear</p>
              <p className="text-xs text-white/25 mt-1 tracking-wide">All contributions reviewed</p>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}

// ─── REVIEW CARD ──────────────────────────────────────────────────────────────

interface ReviewCardProps {
  response: CommunityResponse;
  onApprove: (id: string, notes?: string) => void;
  onReject: (id: string, reason: string) => void;
  onFlag: (id: string, reason: string) => void;
  priority?: boolean;
  index: number;
}

function ReviewCard({ response, onApprove, onReject, onFlag, priority = false, index }: ReviewCardProps) {
  const [dismissed, setDismissed] = useState(false);
  const [actionMode, setActionMode] = useState<null | "reject" | "flag">(null);
  const [inputValue, setInputValue] = useState("");

  const TypeIcon = response.type === "text" ? BookOpen : response.type === "audio" ? Mic : ImageIcon;

  const handleApprove = () => {
    setDismissed(true);
    setTimeout(() => onApprove(response.id), 350);
  };

  const handleConfirm = () => {
    if (!inputValue.trim()) return;
    setDismissed(true);
    setTimeout(() => {
      if (actionMode === "reject") onReject(response.id, inputValue);
      if (actionMode === "flag") onFlag(response.id, inputValue);
    }, 350);
  };

  return (
    <AnimatePresence>
      {!dismissed && (
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, x: 24, scale: 0.97 }}
          transition={{ delay: index * 0.05, duration: 0.28 }}
          className={`rounded-xl border p-4 space-y-4 ${
            priority ? "bg-white/5 border-white/10" : "bg-white/5 border-white/10"
          }`}
        >
          {/* Contributor row */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-white/10 border border-white/10 flex items-center justify-center shrink-0">
              <span className="text-xs font-medium text-white/70 tracking-wide">
                {getInitials(response.contributorName)}
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm text-white/90 truncate">{response.contributorName}</p>
              <div className="flex items-center gap-2 mt-0.5">
                <span className="text-xs text-white/30">{formatRelativeTime(response.timestamp)}</span>
                <span className="text-white/15">·</span>
                <span className="text-xs text-white/30 uppercase tracking-widest">{response.language}</span>
              </div>
            </div>
            <div className="flex items-center gap-1.5 px-2 py-1 rounded-full bg-white/5 border border-white/10">
              <TypeIcon className="w-3 h-3 text-white/40" strokeWidth={1.5} />
              <span className="text-[10px] tracking-widest uppercase text-white/40">{response.type}</span>
            </div>
          </div>

          {/* Content */}
          <div className="rounded-xl bg-black/40 border border-white/5 px-4 py-3">
            {response.type === "text" ? (
              <p className="text-sm text-white/70 leading-relaxed line-clamp-3">{response.content}</p>
            ) : response.type === "audio" ? (
              <audio src={response.content} controls className="w-full" />
            ) : (
              <img src={response.content} alt="Response" className="w-full rounded-lg" />
            )}
          </div>

          {/* Flag reason */}
          {response.flagReason && (
            <div className="flex items-start gap-2 px-3 py-2.5 rounded-xl bg-white/5 border border-white/10">
              <AlertTriangle className="w-3.5 h-3.5 text-white/40 mt-0.5 shrink-0" strokeWidth={1.5} />
              <p className="text-xs text-white/50 leading-relaxed">{response.flagReason}</p>
            </div>
          )}

          {/* Actions */}
          <AnimatePresence mode="wait">
            {actionMode === null ? (
              <motion.div
                key="btns"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex gap-2"
              >
                <button
                  onClick={handleApprove}
                  className="flex-1 py-3 rounded-xl bg-white/5 border border-white/10 text-xs tracking-widest uppercase text-white/60 hover:bg-white/10 hover:text-white/80 transition-all active:scale-[0.98] flex items-center justify-center gap-2"
                >
                  <CheckCircle className="w-3.5 h-3.5" strokeWidth={1.5} />
                  Approve
                </button>
                <button
                  onClick={() => { setActionMode("reject"); setInputValue(""); }}
                  className="flex-1 py-3 rounded-xl bg-white/5 border border-white/10 text-xs tracking-widest uppercase text-white/60 hover:bg-white/10 hover:text-white/80 transition-all active:scale-[0.98] flex items-center justify-center gap-2"
                >
                  <XCircle className="w-3.5 h-3.5" strokeWidth={1.5} />
                  Reject
                </button>
                <button
                  onClick={() => { setActionMode("flag"); setInputValue(""); }}
                  className="px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-xs tracking-widest uppercase text-white/60 hover:bg-white/10 hover:text-white/80 transition-all active:scale-[0.98]"
                >
                  Flag
                </button>
              </motion.div>
            ) : (
              <motion.div
                key="input"
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -4 }}
                className="space-y-3"
              >
                <p className="text-xs tracking-widest uppercase text-white/30">
                  {actionMode === "reject" ? "Rejection reason" : "Flag reason"}
                </p>
                <textarea
                  value={inputValue}
                  onChange={e => setInputValue(e.target.value)}
                  placeholder={actionMode === "reject" ? "Why is this being rejected?" : "What needs further review?"}
                  rows={2}
                  autoFocus
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white/80 placeholder-white/20 resize-none focus:outline-none focus:border-white/20 leading-relaxed"
                />
                <div className="flex gap-2">
                  <button
                    onClick={() => setActionMode(null)}
                    className="flex-1 py-3 rounded-xl border border-white/10 text-xs tracking-widest uppercase text-white/40 hover:text-white/60 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleConfirm}
                    disabled={!inputValue.trim()}
                    className="flex-1 py-3 rounded-xl bg-white/5 border border-white/10 text-xs tracking-widest uppercase text-white/60 hover:bg-white/10 hover:text-white/80 transition-all disabled:opacity-30"
                  >
                    Confirm
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// ─── AUDIT LOG ────────────────────────────────────────────────────────────────

interface AuditLogViewerProps {
  actions: ModerationAction[];
  userRole: UserRole;
}

export function AuditLogViewer({ actions, userRole }: AuditLogViewerProps) {
  const canView = userRole === "moderator" || userRole === "institutional_admin";

  if (!canView) {
    return (
      <div className="py-14 flex flex-col items-center gap-4">
        <div className="w-12 h-12 rounded-full bg-white/5 border border-white/10 flex items-center justify-center">
          <Shield className="w-5 h-5 text-white/30" strokeWidth={1.5} />
        </div>
        <p className="text-sm text-white/40">Moderator access required</p>
      </div>
    );
  }

  const iconMap = {
    approve: { Icon: CheckCircle, color: "text-white/60" },
    reject:  { Icon: XCircle,     color: "text-white/60" },
    flag:    { Icon: AlertTriangle,color: "text-white/60" },
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2 mb-2">
        <BarChart2 className="w-4 h-4 text-white/40" />
        <h3 className="text-sm tracking-wider uppercase text-white/40">Action History</h3>
      </div>

      {actions.length === 0 ? (
        <div className="py-14 text-center">
          <p className="text-sm text-white/30">No actions recorded yet</p>
        </div>
      ) : (
        actions.map((action, i) => {
          const { Icon, color } = iconMap[action.action];
          return (
            <motion.div
              key={action.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.06 }}
              className="p-4 rounded-xl bg-white/5 border border-white/10 space-y-1"
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-2">
                  <Icon className={`w-4 h-4 ${color}`} strokeWidth={1.5} />
                  <span className="text-sm text-white/80 capitalize">{action.action}</span>
                </div>
                <span className="text-xs text-white/30">{formatRelativeTime(action.timestamp)}</span>
              </div>
              <p className="text-xs text-white/40 pl-6">by {action.moderatorName}</p>
              {action.reason && (
                <p className="text-xs text-white/30 pl-6 leading-relaxed">"{action.reason}"</p>
              )}
              {action.notes && (
                <p className="text-xs text-white/25 pl-6 italic leading-relaxed">{action.notes}</p>
              )}
            </motion.div>
          );
        })
      )}
    </div>
  );
}

// ─── GUIDELINES ───────────────────────────────────────────────────────────────

export function GovernanceGuidelines() {
  const sections = [
    {
      label: "Approval Criteria",
      Icon: CheckCircle,
      items: MODERATION_GUIDELINES.approve_criteria,
      marker: "✓",
    },
    {
      label: "Rejection Criteria",
      Icon: XCircle,
      items: MODERATION_GUIDELINES.reject_criteria,
      marker: "✗",
    },
    {
      label: "Flag for Review",
      Icon: AlertTriangle,
      items: MODERATION_GUIDELINES.flag_criteria,
      marker: "·",
    },
  ];

  return (
    <div className="space-y-6">
      {sections.map(({ label, Icon, items, marker }) => (
        <div key={label} className="space-y-3">
          <div className="flex items-center gap-2">
            <Icon className="w-4 h-4 text-white/40" strokeWidth={1.5} />
            <h3 className="text-sm tracking-wider uppercase text-white/40">{label}</h3>
          </div>
          <div className="p-4 rounded-xl bg-white/5 border border-white/10 space-y-3">
            {items.map((item, i) => (
              <div key={i} className="flex items-start gap-3">
                <span className="text-xs text-white/30 mt-0.5 shrink-0">{marker}</span>
                <p className="text-sm text-white/60 leading-relaxed">{item}</p>
              </div>
            ))}
          </div>
        </div>
      ))}

      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <Clock className="w-4 h-4 text-white/40" />
          <h3 className="text-sm tracking-wider uppercase text-white/40">Process Notes</h3>
        </div>
        <div className="p-4 rounded-xl bg-white/5 border border-white/10 space-y-3">
          {[
            MODERATION_GUIDELINES.response_time,
            MODERATION_GUIDELINES.appeal_process,
            "All actions logged with timestamps and moderator IDs",
            "Cultural sensitivity training required for moderators",
          ].map((note, i) => (
            <div key={i} className="flex items-start gap-3">
              <span className="text-xs text-white/30 mt-0.5 shrink-0">·</span>
              <p className="text-sm text-white/60 leading-relaxed">{note}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── MAIN SCREEN ──────────────────────────────────────────────────────────────

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
      status: "pending",
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
      status: "pending",
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
      flagReason: "Potential cultural sensitivity — requires second review before approval.",
    },
  ];

  const mockActions: ModerationAction[] = [
    {
      id: "act-1",
      responseId: "resp-4",
      moderatorId: "mod-1",
      moderatorName: "Admin User",
      action: "approve",
      timestamp: new Date(Date.now() - 86400000),
      notes: "Thoughtful reflection on cultural context",
    },
    {
      id: "act-2",
      responseId: "resp-5",
      moderatorId: "mod-1",
      moderatorName: "Admin User",
      action: "reject",
      reason: "Off-topic and promotional content",
      timestamp: new Date(Date.now() - 172800000),
    },
  ];

  const handleApprove = (id: string, notes?: string) => console.log("Approved:", id, notes);
  const handleReject = (id: string, reason: string) => console.log("Rejected:", id, reason);
  const handleFlag = (id: string, reason: string) => console.log("Flagged:", id, reason);

  const pending = mockResponses.filter(r => r.status === "pending");
  const flagged = mockResponses.filter(r => r.status === "flagged");

  const tabs = [
    {
      id: "queue" as const,
      Icon: Shield,
      count: mockResponses.length,
      label: "submissions to review",
      glowColor: "bg-amber-400/20",
      iconColor: "text-amber-200/70",
    },
    {
      id: "audit" as const,
      Icon: BarChart2,
      count: mockActions.length,
      label: "actions logged",
      glowColor: "bg-white/20",
      iconColor: "text-white/50",
    },
    {
      id: "guidelines" as const,
      Icon: CheckCircle,
      count: MODERATION_GUIDELINES.approve_criteria.length + MODERATION_GUIDELINES.reject_criteria.length,
      label: "community standards",
      glowColor: "bg-white/20",
      iconColor: "text-white/50",
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen bg-black"
    >
      {/* Header — matches ProfilePreferencesScreen exactly */}
      <div className="sticky top-0 z-10 backdrop-blur-xl bg-black/80 border-b border-white/5">
        <div className="flex items-center justify-between p-5 pt-8 max-w-[428px] mx-auto">
          <button
            onClick={onBack}
            className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center hover:bg-white/10 transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-white" strokeWidth={1.5} />
          </button>
          <h2 className="text-base tracking-tight text-white">Moderation</h2>
          <div className="w-10" />
        </div>
      </div>

      {/* Main content */}
      <main className="pt-2 pb-24 px-5 max-w-[428px] mx-auto">

        {/* Tab selector — Library-style animated stat rows */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="py-8 space-y-3 border-b border-white/5 mb-8"
        >
          {tabs.map(({ id, Icon, count, label, glowColor, iconColor }, i) => (
            <motion.div
              key={id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.15 + i * 0.1, duration: 0.8 }}
              onClick={() => setActiveTab(id)}
              className={`flex items-center gap-4 group cursor-pointer transition-opacity duration-300 ${
                activeTab === id ? "opacity-100" : "opacity-40 hover:opacity-70"
              }`}
            >
              <div className="relative">
                <Icon className={`w-5 h-5 ${iconColor}`} strokeWidth={1.5} />
                {activeTab === id && (
                  <div className={`absolute inset-0 ${glowColor} blur-xl`} />
                )}
                <div className={`absolute inset-0 ${glowColor} blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-light text-white/90 tabular-nums">{count}</span>
                <span className="text-sm text-white/40 font-light tracking-wide">{label}</span>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Flagged alert strip — only on queue tab */}
        <AnimatePresence>
          {activeTab === "queue" && flagged.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              className="mb-6 flex items-center gap-3 px-4 py-3 rounded-xl bg-white/5 border border-white/10"
            >
              <AlertTriangle className="w-4 h-4 text-white/50 shrink-0" strokeWidth={1.5} />
              <p className="text-sm text-white/60">
                <span className="text-white/80">{flagged.length} flagged</span>{" "}
                {flagged.length === 1 ? "submission needs" : "submissions need"} priority review
              </p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Active tab content */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
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
      </main>
    </motion.div>
  );
}
