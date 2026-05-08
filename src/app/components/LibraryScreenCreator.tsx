import { motion, AnimatePresence } from "motion/react";
import { useState } from "react";
import { NavigationBar } from "./NavigationBar";
import { 
  FileText, 
  Clock, 
  Eye,
  Copy,
  Edit3,
  Archive as ArchiveIcon,
  Plus,
  Users,
  X,
  Mail,
  ChevronDown,
  Check
} from "lucide-react";

interface ContentItem {
  id: string;
  title: string;
  status: 'draft' | 'scheduled' | 'under_review' | 'published' | 'archived';
  progress?: number;
  lastEdited: string;
  views?: number;
  thumbnail?: string;
  completeness?: number;
}

interface LibraryScreenCreatorProps {
  onNavigate: (screen: "for-you" | "explore" | "library" | "profile" | "create") => void;
  onContentSelect: (contentId: string) => void;
}

// Feature 5: Collaboration types
interface CollabInvite {
  id: string;
  itemId: string;
  email: string;
  role: 'Lead' | 'Contributor';
  status: 'pending' | 'accepted';
  sentAt: number;
}

const COLLAB_KEY = 'seen_collab_invites';
function loadInvites(): CollabInvite[] {
  try { return JSON.parse(localStorage.getItem(COLLAB_KEY) || '[]'); } catch { return []; }
}
function saveInvites(i: CollabInvite[]) {
  localStorage.setItem(COLLAB_KEY, JSON.stringify(i));
}

const mockContent: Record<string, ContentItem[]> = {
  drafts: [
    { id: '1', title: 'Montreal Jazz History', status: 'draft', progress: 65, lastEdited: '2h ago', completeness: 65 },
    { id: '2', title: 'Indigenous Storytelling', status: 'draft', progress: 30, lastEdited: '1d ago', completeness: 30 },
    { id: '3', title: 'Quebecois Cinema', status: 'draft', progress: 80, lastEdited: '3d ago', completeness: 80 },
  ],
  scheduled: [
    { id: '4', title: 'Franco-African Music', status: 'scheduled', lastEdited: 'Publishes Mar 15', completeness: 100 },
    { id: '5', title: 'Street Art in Paris', status: 'under_review', lastEdited: 'Under review', completeness: 100 },
  ],
  published: [
    { id: '6', title: 'Caribbean Rhythms', status: 'published', lastEdited: '1 week ago', views: 2845 },
    { id: '7', title: 'Documentary Filmmaking', status: 'published', lastEdited: '2 weeks ago', views: 1523 },
    { id: '8', title: 'Fashion Archives', status: 'published', lastEdited: '1 month ago', views: 987 },
  ],
  archived: [
    { id: '9', title: 'Old Project Draft', status: 'archived', lastEdited: '3 months ago' },
  ],
};

export function LibraryScreenCreator({ 
  onNavigate,
  onContentSelect 
}: LibraryScreenCreatorProps) {
  const [activeTab, setActiveTab] = useState<'drafts' | 'scheduled' | 'published' | 'archived'>('drafts');
  const [selectedItem, setSelectedItem] = useState<string | null>(null);
  const [localContent, setLocalContent] = useState(mockContent);
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  // Feature 5: Collaboration state
  const [invites, setInvites] = useState<CollabInvite[]>(loadInvites);
  const [collabTarget, setCollabTarget] = useState<ContentItem | null>(null);
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteRole, setInviteRole] = useState<'Lead' | 'Contributor'>('Contributor');
  const [rolePickerOpen, setRolePickerOpen] = useState(false);

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 2200);
  };

  const handleDuplicate = (item: ContentItem) => {
    const clone: ContentItem = { ...item, id: `${item.id}-copy-${Date.now()}`, title: `${item.title} (Copy)`, status: 'draft', progress: 0, lastEdited: 'Just now', completeness: 0 };
    setLocalContent(prev => ({ ...prev, drafts: [clone, ...prev.drafts] }));
    showToast('Duplicated to Drafts');
  };

  const handleArchive = (item: ContentItem) => {
    setLocalContent(prev => {
      const updated: Record<string, ContentItem[]> = { ...prev };
      (Object.keys(updated) as Array<keyof typeof updated>).forEach(tab => {
        updated[tab] = updated[tab].filter(i => i.id !== item.id);
      });
      const archived: ContentItem = { ...item, status: 'archived' };
      updated.archived = [archived, ...updated.archived.filter(i => i.id !== item.id)];
      return updated;
    });
    showToast('Moved to Archive');
  };

  // Feature 5: Send collaboration invite
  const handleSendInvite = () => {
    if (!collabTarget || !inviteEmail.trim()) return;
    if (!inviteEmail.includes('@')) { showToast('Enter a valid email'); return; }

    const newInvite: CollabInvite = {
      id: `inv-${Date.now()}`,
      itemId: collabTarget.id,
      email: inviteEmail.trim(),
      role: inviteRole,
      status: 'pending',
      sentAt: Date.now(),
    };
    const updated = [newInvite, ...invites];
    saveInvites(updated);
    setInvites(updated);
    setCollabTarget(null);
    setInviteEmail('');
    setInviteRole('Contributor');
    showToast(`Invite sent to ${newInvite.email}`);
  };

  const getItemInvites = (itemId: string) => invites.filter(inv => inv.itemId === itemId);

  const content = localContent[activeTab] || [];

  const getStatusBadge = (status: ContentItem['status']) => {
    const badges = {
      draft: { label: 'Draft', color: 'text-white/40 bg-white/5' },
      scheduled: { label: 'Scheduled', color: 'text-white/60 bg-white/10' },
      under_review: { label: 'Under Review', color: 'text-yellow-500/80 bg-yellow-500/10' },
      published: { label: 'Published', color: 'text-green-500/80 bg-green-500/10' },
      archived: { label: 'Archived', color: 'text-white/30 bg-white/5' },
    };
    return badges[status];
  };

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Navigation */}
      <NavigationBar 
        title="Library"
        showBack={false}
        onBack={() => {}}
        action={{
          label: "Create",
          icon: Plus,
          onClick: () => onNavigate("create")
        }}
      />

      {/* Tab Navigation */}
      <div className="border-b border-white/10">
        <div className="max-w-[428px] mx-auto px-5">
          <div className="flex gap-6 overflow-x-auto scrollbar-hide">
            {[
              { id: 'drafts', label: 'Drafts', count: localContent.drafts.length },
              { id: 'scheduled', label: 'Scheduled', count: localContent.scheduled.length },
              { id: 'published', label: 'Published', count: localContent.published.length },
              { id: 'archived', label: 'Archived', count: localContent.archived.length },
            ].map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 py-4 border-b-2 transition-all duration-300 whitespace-nowrap ${
                  activeTab === tab.id
                    ? 'border-white text-white'
                    : 'border-transparent text-white/40 hover:text-white/60'
                }`}
              >
                <span className="text-sm tracking-wide">{tab.label}</span>
                <span className={`px-1.5 py-0.5 text-[10px] tracking-wider rounded ${
                  activeTab === tab.id ? 'bg-white/10' : 'bg-white/5'
                }`}>
                  {tab.count}
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Content List */}
      <div className="pb-24 pt-6">
        {content.length === 0 ? (
          <div className="px-5 py-16 text-center">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-white/5 border border-white/10 flex items-center justify-center">
              <FileText className="w-6 h-6 text-white/40" strokeWidth={1.5} />
            </div>
            <h3 className="text-lg font-light tracking-wide mb-2">No {activeTab} yet</h3>
            <p className="text-sm text-white/40">
              {activeTab === 'drafts' && "Start creating your first piece"}
              {activeTab === 'scheduled' && "Schedule content for future publication"}
              {activeTab === 'published' && "Your published work will appear here"}
              {activeTab === 'archived' && "Archive content you want to keep private"}
            </p>
          </div>
        ) : (
          <div className="px-5 space-y-3">
            {content.map((item, index) => {
              const itemInvites = getItemInvites(item.id);
              return (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 0.05 * index }}
                  className="border border-white/10 bg-white/[0.02] rounded-lg overflow-hidden hover:border-white/20 transition-all duration-300"
                >
                  {/* Main Content */}
                  <button
                    type="button"
                    onClick={() => onContentSelect(item.id)}
                    className="w-full p-4 text-left"
                  >
                    <div className="flex items-start gap-4">
                      {/* Progress Circle (for drafts) */}
                      {item.status === 'draft' && item.progress !== undefined && (
                        <div className="flex-shrink-0 mt-1">
                          <div className="relative w-12 h-12">
                            <svg className="w-12 h-12 -rotate-90">
                              <circle cx="24" cy="24" r="18" stroke="currentColor" strokeWidth="2" fill="none" className="text-white/10" />
                              <circle
                                cx="24" cy="24" r="18"
                                stroke="currentColor" strokeWidth="2" fill="none"
                                strokeDasharray={`${2 * Math.PI * 18}`}
                                strokeDashoffset={`${2 * Math.PI * 18 * (1 - item.progress / 100)}`}
                                className="text-white/60 transition-all duration-300"
                              />
                            </svg>
                            <div className="absolute inset-0 flex items-center justify-center">
                              <span className="text-xs font-light text-white/60">{item.progress}%</span>
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Content Info */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-3 mb-2">
                          <div className="flex-1 min-w-0">
                            <h3 className="text-base font-light tracking-wide">{item.title}</h3>
                            {/* Feature 5: Collaborator badge */}
                            {itemInvites.length > 0 && (
                              <div className="flex items-center gap-1.5 mt-1">
                                <Users className="w-3 h-3 text-violet-400/70" strokeWidth={1.5} />
                                <span className="text-[10px] tracking-wide text-violet-400/70">
                                  {itemInvites.length} collaborator{itemInvites.length !== 1 ? 's' : ''} invited
                                </span>
                              </div>
                            )}
                          </div>
                          <span className={`px-2 py-1 text-[10px] tracking-widest uppercase rounded whitespace-nowrap ${getStatusBadge(item.status).color}`}>
                            {getStatusBadge(item.status).label}
                          </span>
                        </div>

                        <div className="flex items-center gap-4 text-xs text-white/40">
                          <div className="flex items-center gap-1.5">
                            <Clock className="w-3 h-3" strokeWidth={1.5} />
                            <span>{item.lastEdited}</span>
                          </div>
                          {item.views !== undefined && (
                            <div className="flex items-center gap-1.5">
                              <Eye className="w-3 h-3" strokeWidth={1.5} />
                              <span>{item.views.toLocaleString()} views</span>
                            </div>
                          )}
                          {item.completeness !== undefined && item.completeness < 100 && (
                            <div className="flex items-center gap-1.5">
                              <FileText className="w-3 h-3" strokeWidth={1.5} />
                              <span>{item.completeness}% complete</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </button>

                  {/* Action Bar — 5 actions including Collab */}
                  <div className="flex items-center border-t border-white/5 bg-white/[0.01]">
                    <button
                      type="button"
                      onClick={(e) => { e.stopPropagation(); onNavigate("create"); }}
                      className="flex-1 flex items-center justify-center gap-1.5 py-3 text-xs tracking-wider uppercase text-white/40 hover:text-white/80 hover:bg-white/[0.02] transition-all duration-200 border-r border-white/5"
                    >
                      <Edit3 className="w-3.5 h-3.5" strokeWidth={1.5} />
                      <span>Edit</span>
                    </button>

                    <button
                      type="button"
                      onClick={(e) => { e.stopPropagation(); onContentSelect(item.id); }}
                      className="flex-1 flex items-center justify-center gap-1.5 py-3 text-xs tracking-wider uppercase text-white/40 hover:text-white/80 hover:bg-white/[0.02] transition-all duration-200 border-r border-white/5"
                    >
                      <Eye className="w-3.5 h-3.5" strokeWidth={1.5} />
                      <span>Preview</span>
                    </button>

                    <button
                      type="button"
                      onClick={(e) => { e.stopPropagation(); handleDuplicate(item); }}
                      className="flex-1 flex items-center justify-center gap-1.5 py-3 text-xs tracking-wider uppercase text-white/40 hover:text-white/80 hover:bg-white/[0.02] transition-all duration-200 border-r border-white/5"
                    >
                      <Copy className="w-3.5 h-3.5" strokeWidth={1.5} />
                      <span>Dupe</span>
                    </button>

                    {/* Feature 5: Collab button */}
                    <button
                      type="button"
                      onClick={(e) => { e.stopPropagation(); setCollabTarget(item); }}
                      className={`flex-1 flex items-center justify-center gap-1.5 py-3 text-xs tracking-wider uppercase transition-all duration-200 border-r border-white/5 ${
                        itemInvites.length > 0
                          ? 'text-violet-400/70 hover:text-violet-400 hover:bg-violet-400/5'
                          : 'text-white/40 hover:text-white/80 hover:bg-white/[0.02]'
                      }`}
                    >
                      <Users className="w-3.5 h-3.5" strokeWidth={1.5} />
                      <span>Collab</span>
                    </button>

                    <button
                      type="button"
                      onClick={(e) => { e.stopPropagation(); handleArchive(item); }}
                      className="flex-1 flex items-center justify-center gap-1.5 py-3 text-xs tracking-wider uppercase text-white/40 hover:text-white/80 hover:bg-white/[0.02] transition-all duration-200"
                    >
                      <ArchiveIcon className="w-3.5 h-3.5" strokeWidth={1.5} />
                      <span>Archive</span>
                    </button>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>

      {/* Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-black/95 backdrop-blur-xl border-t border-white/10 pointer-events-none">
        <div className="max-w-[428px] mx-auto px-4 py-4 flex justify-around items-end">
          <button type="button" onClick={() => onNavigate("for-you")} className="flex flex-col items-center gap-1.5 transition-all duration-300 pointer-events-auto group text-white/40 hover:text-white/60">
            <div className="relative">
              <div className="w-5 h-5 flex items-center justify-center">
                <div className="w-3.5 h-3.5 rounded-sm border-2 border-white/40 group-hover:border-white/60 transition-colors duration-300" />
              </div>
              <div className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-white/40 border border-black" />
            </div>
            <span className="text-[10px] tracking-widest uppercase font-light">For You</span>
          </button>
          
          <button type="button" onClick={() => onNavigate("explore")} className="flex flex-col items-center gap-1.5 transition-all duration-300 pointer-events-auto group text-white/40 hover:text-white/60">
            <div className="w-5 h-5 flex items-center justify-center">
              <div className="w-4 h-4 rounded-full border border-white/40 group-hover:border-white/60 transition-colors duration-300" />
            </div>
            <span className="text-[10px] tracking-widest uppercase font-light">Explore</span>
          </button>

          <button type="button" onClick={() => onNavigate("create")} className="flex flex-col items-center gap-1 transition-all duration-300 pointer-events-auto group -mt-3">
            <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center shadow-[0_0_24px_rgba(255,255,255,0.25)] group-hover:shadow-[0_0_32px_rgba(255,255,255,0.4)] transition-shadow duration-300">
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                <path d="M10 4v12M4 10h12" stroke="black" strokeWidth="2" strokeLinecap="round"/>
              </svg>
            </div>
            <span className="text-[10px] tracking-widest uppercase font-light text-white/60 group-hover:text-white/80 transition-colors">Create</span>
          </button>
          
          <button type="button" onClick={() => onNavigate("library")} className="flex flex-col items-center gap-1.5 transition-all duration-300 pointer-events-auto group text-white">
            <div className="w-5 h-5 flex items-center justify-center">
              <div className="space-y-0.5">
                <div className="w-4 h-0.5 bg-white drop-shadow-[0_0_8px_rgba(255,255,255,0.5)]" />
                <div className="w-4 h-0.5 bg-white drop-shadow-[0_0_8px_rgba(255,255,255,0.5)]" />
                <div className="w-4 h-0.5 bg-white drop-shadow-[0_0_8px_rgba(255,255,255,0.5)]" />
              </div>
            </div>
            <span className="text-[10px] tracking-widest uppercase font-medium">Library</span>
          </button>
          
          <button type="button" onClick={() => onNavigate("profile")} className="flex flex-col items-center gap-1.5 transition-all duration-300 pointer-events-auto group text-white/40 hover:text-white/60">
            <div className="w-5 h-5 flex items-center justify-center">
              <div className="w-4 h-4 rounded-full border border-white/40 group-hover:border-white/60 transition-colors duration-300 flex items-center justify-center">
                <div className="w-2 h-2 rounded-full bg-white/40 group-hover:bg-white/60 transition-colors duration-300" />
              </div>
            </div>
            <span className="text-[10px] tracking-widest uppercase font-light">Profile</span>
          </button>
        </div>
      </div>

      {/* Toast Notification */}
      <AnimatePresence>
        {toastMsg && (
          <motion.div
            key="library-toast"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-16 left-1/2 -translate-x-1/2 z-50 px-4 py-2.5 bg-white text-black text-xs tracking-widest uppercase rounded-full shadow-lg pointer-events-none"
          >
            {toastMsg}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Feature 5: Collaboration Invite Sheet */}
      <AnimatePresence>
        {collabTarget && (
          <motion.div
            key="collab-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm"
            onClick={() => { setCollabTarget(null); setRolePickerOpen(false); }}
          />
        )}
        {collabTarget && (
          <motion.div
            key="collab-sheet"
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            className="fixed bottom-0 left-0 right-0 z-50 max-w-[428px] mx-auto bg-[#111] border-t border-white/10 rounded-t-2xl overflow-visible"
            onClick={e => e.stopPropagation()}
          >
            <div className="flex justify-center pt-3 pb-2">
              <div className="w-10 h-1 rounded-full bg-white/20" />
            </div>
            <div className="px-5 pb-8">
              <div className="flex items-center justify-between mb-1">
                <h3 className="text-base tracking-wide font-light">Invite Collaborator</h3>
                <button type="button" onClick={() => { setCollabTarget(null); setRolePickerOpen(false); }}>
                  <X className="w-4 h-4 text-white/40" />
                </button>
              </div>
              <p className="text-xs text-white/40 mb-5">
                Inviting to: <span className="text-white/60">{collabTarget.title}</span>
              </p>

              {/* Email input */}
              <div className="flex items-center gap-2 border border-white/10 bg-white/5 rounded-xl px-3 py-3 mb-3">
                <Mail className="w-4 h-4 text-white/30 flex-shrink-0" />
                <input
                  type="email"
                  placeholder="Collaborator email address"
                  value={inviteEmail}
                  onChange={e => setInviteEmail(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && handleSendInvite()}
                  className="flex-1 bg-transparent text-sm text-white placeholder-white/25 focus:outline-none"
                />
              </div>

              {/* Role picker */}
              <div className="relative mb-5">
                <button
                  type="button"
                  onClick={() => setRolePickerOpen(v => !v)}
                  className="w-full flex items-center justify-between px-3 py-3 border border-white/10 bg-white/5 rounded-xl text-sm"
                >
                  <span className="text-white/60">
                    Role: <span className="text-white">{inviteRole}</span>
                  </span>
                  <ChevronDown className={`w-4 h-4 text-white/40 transition-transform ${rolePickerOpen ? 'rotate-180' : ''}`} />
                </button>
                <AnimatePresence>
                  {rolePickerOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: -4 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -4 }}
                      className="absolute left-0 right-0 top-full mt-1 bg-[#1a1a1a] border border-white/15 rounded-xl overflow-hidden z-10 shadow-xl"
                    >
                      {(['Lead', 'Contributor'] as const).map(role => (
                        <button
                          key={role}
                          type="button"
                          onClick={() => { setInviteRole(role); setRolePickerOpen(false); }}
                          className="w-full flex items-center justify-between px-4 py-3 text-sm hover:bg-white/5 transition-colors"
                        >
                          <div className="text-left">
                            <div className="text-white/80">{role}</div>
                            <div className="text-xs text-white/30 mt-0.5">
                              {role === 'Lead' ? 'Full edit access & attribution' : 'Can add content, limited edits'}
                            </div>
                          </div>
                          {inviteRole === role && <Check className="w-3.5 h-3.5 text-white/60" />}
                        </button>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Existing invites for this item */}
              {getItemInvites(collabTarget.id).length > 0 && (
                <div className="mb-5">
                  <p className="text-[10px] tracking-widest uppercase text-white/30 mb-2">Already invited</p>
                  <div className="space-y-2">
                    {getItemInvites(collabTarget.id).map(inv => (
                      <div key={inv.id} className="flex items-center justify-between px-3 py-2 border border-white/10 bg-white/[0.02] rounded-lg">
                        <div>
                          <div className="text-xs text-white/60">{inv.email}</div>
                          <div className="text-[10px] text-white/30">{inv.role} · Pending</div>
                        </div>
                        <Users className="w-3.5 h-3.5 text-violet-400/50" strokeWidth={1.5} />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <button
                type="button"
                onClick={handleSendInvite}
                disabled={!inviteEmail.trim()}
                className="w-full py-3.5 rounded-xl bg-white text-black text-sm tracking-wider font-medium hover:bg-white/90 transition-all disabled:opacity-30 disabled:cursor-not-allowed"
              >
                Send Invite
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
