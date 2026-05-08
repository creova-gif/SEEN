import { motion, AnimatePresence } from "motion/react";
import { NavigationBar } from "./NavigationBar";
import { 
  Settings, 
  Info, 
  Globe, 
  Eye, 
  Shield,
  Building2,
  MessageCircle,
  LogOut,
  Plus,
  Award,
  Clock,
  Heart,
  ChevronRight,
  BarChart3,
  FileText,
  Palette,
  Share2,
  Instagram,
  Twitter,
  Linkedin,
  Youtube,
  Link2,
  Check,
  X,
  Pencil
} from "lucide-react";
import { useState, useCallback } from "react";
import { useStoryState } from "../contexts/StoryStateContext";
import { useAuth } from "../contexts/AuthContext";
import type { Language } from "../contexts/StoryStateContext";

type SocialPlatform = 'instagram' | 'twitter' | 'linkedin' | 'youtube' | 'tiktok' | 'website';
interface SocialLink { platform: SocialPlatform; url: string; }

const PLATFORM_META: Record<SocialPlatform, { label: string; icon: React.ReactNode; placeholder: string }> = {
  instagram: { label: 'Instagram', icon: <Instagram className="w-4 h-4" />, placeholder: 'https://instagram.com/yourhandle' },
  twitter:   { label: 'X / Twitter', icon: <Twitter className="w-4 h-4" />, placeholder: 'https://x.com/yourhandle' },
  linkedin:  { label: 'LinkedIn', icon: <Linkedin className="w-4 h-4" />, placeholder: 'https://linkedin.com/in/yourhandle' },
  youtube:   { label: 'YouTube', icon: <Youtube className="w-4 h-4" />, placeholder: 'https://youtube.com/@yourchannel' },
  tiktok:    { label: 'TikTok', icon: <Link2 className="w-4 h-4" />, placeholder: 'https://tiktok.com/@yourhandle' },
  website:   { label: 'Website', icon: <Globe className="w-4 h-4" />, placeholder: 'https://yoursite.com' },
};

const PLATFORMS = Object.keys(PLATFORM_META) as SocialPlatform[];
const MAX_LINKS = 5;
const STORAGE_KEY = 'seen_social_links';

function loadSocialLinks(): SocialLink[] {
  try { return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]'); } catch { return []; }
}
function saveSocialLinks(links: SocialLink[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(links));
}
function isValidUrl(url: string) {
  if (!url.trim()) return true;
  try { const u = new URL(url.trim()); return u.protocol === 'http:' || u.protocol === 'https:'; }
  catch { return false; }
}

type ActiveModal = null | 'dashboard' | 'rights' | 'guidelines' | 'accessibility' | 'privacy' | 'feedback' | 'cmf';

interface ProfileScreenCreatorProps {
  onNavigate: (screen: "for-you" | "explore" | "library" | "profile" | "create") => void;
  onOpenSettings?: () => void;
  onOpenAbout?: () => void;
}

export function ProfileScreenCreator({ onNavigate, onOpenSettings, onOpenAbout }: ProfileScreenCreatorProps) {
  const { state: { language, accessibilityPreferences }, setLanguage, setAccessibilityPreferences } = useStoryState();
  const { state: authState, signOut } = useAuth();
  const [activeModal, setActiveModal] = useState<ActiveModal>(null);

  const cycleLanguage = () => {
    const next: Record<string, Language> = { en: 'fr', fr: 'es', es: 'en' };
    setLanguage(next[language] ?? 'en');
  };

  const userStats = {
    hoursCreated: 47,
    culturalContributions: 12,
    communityImpact: 2845,
    averageCompletion: 78,
  };

  // Social links
  const [socialLinks, setSocialLinks] = useState<SocialLink[]>(loadSocialLinks);
  const [editingLinks, setEditingLinks] = useState(false);
  const [draftLinks, setDraftLinks] = useState<Record<SocialPlatform, string>>(() => {
    const loaded = loadSocialLinks();
    const map = {} as Record<SocialPlatform, string>;
    PLATFORMS.forEach(p => { map[p] = loaded.find(l => l.platform === p)?.url ?? ''; });
    return map;
  });
  const [urlErrors, setUrlErrors] = useState<Record<string, boolean>>({});
  const [shareStatus, setShareStatus] = useState<'idle' | 'copied'>('idle');

  const userId = authState.user?.id ?? 'me';
  const profileUrl = `https://seen.app/profile/${userId}`;

  const handleOpenLink = (url: string) => {
    if (url) window.open(url, '_blank', 'noopener,noreferrer');
  };

  const handleShareProfile = useCallback(async () => {
    const shareData = {
      title: `${authState.user?.name || 'Creator'} on SEEN`,
      text: `Check out my creator profile on SEEN`,
      url: profileUrl,
    };
    try {
      if (navigator.share) { await navigator.share(shareData); }
      else {
        await navigator.clipboard.writeText(profileUrl);
        setShareStatus('copied');
        setTimeout(() => setShareStatus('idle'), 2000);
      }
    } catch {
      try {
        await navigator.clipboard.writeText(profileUrl);
        setShareStatus('copied');
        setTimeout(() => setShareStatus('idle'), 2000);
      } catch {}
    }
  }, [profileUrl, authState.user?.name]);

  const handleSaveLinks = () => {
    const errors: Record<string, boolean> = {};
    PLATFORMS.forEach(p => { if (draftLinks[p] && !isValidUrl(draftLinks[p])) errors[p] = true; });
    if (Object.keys(errors).length > 0) { setUrlErrors(errors); return; }
    setUrlErrors({});
    const filled = PLATFORMS.filter(p => draftLinks[p].trim()).map(p => ({ platform: p, url: draftLinks[p].trim() }));
    const trimmed = filled.slice(0, MAX_LINKS);
    saveSocialLinks(trimmed);
    setSocialLinks(trimmed);
    setEditingLinks(false);
  };

  const handleCancelEdit = () => {
    const map = {} as Record<SocialPlatform, string>;
    PLATFORMS.forEach(p => { map[p] = socialLinks.find(l => l.platform === p)?.url ?? ''; });
    setDraftLinks(map);
    setUrlErrors({});
    setEditingLinks(false);
  };

  const handleSignOut = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Navigation */}
      <NavigationBar 
        title="Profile"
        showBack={false}
        onBack={() => {}}
        action={{
          label: "Settings",
          icon: Settings,
          onClick: () => onOpenSettings?.()
        }}
      />

      {/* Scrollable Content */}
      <div className="pb-24 pt-6">
        {/* Creator Identity */}
        <div className="px-5 mb-8">
          <div className="flex items-start justify-between mb-6">
            {/* Avatar & Info */}
            <div className="flex items-start gap-4">
              <div className="w-20 h-20 rounded-full bg-white/10 border border-white/20 flex items-center justify-center relative">
                <span className="text-2xl font-light">
                  {authState.user?.name?.charAt(0).toUpperCase() || 'C'}
                </span>
                {/* Creator Badge */}
                <div className="absolute -bottom-1 -right-1 w-7 h-7 rounded-full bg-black border-2 border-white flex items-center justify-center">
                  <Award className="w-3.5 h-3.5 text-white" strokeWidth={2} />
                </div>
              </div>

              <div className="flex-1">
                <h2 className="text-xl font-light tracking-wide mb-1">
                  {authState.user?.name || 'Creator'}
                </h2>
                <div className="flex items-center gap-2 mb-2">
                  <span className="px-2 py-1 text-[10px] tracking-widest uppercase bg-white/10 text-white/80 rounded border border-white/20">
                    Creator
                  </span>
                  <span className="text-xs text-white/40">
                    {authState.user?.email}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Create New Button */}
          <button
            type="button"
            onClick={() => onNavigate("create")}
            className="w-full py-4 bg-white text-black rounded-lg flex items-center justify-center gap-2 text-sm tracking-wide font-medium hover:bg-white/90 transition-all duration-300"
          >
            <Plus className="w-4 h-4" strokeWidth={2} />
            <span>Create New</span>
          </button>
        </div>

        {/* Creator Stats */}
        <div className="px-5 mb-8">
          <div className="border border-white/10 bg-white/[0.02] rounded-lg p-5">
            <h3 className="text-xs tracking-widest uppercase text-white/40 mb-4">Impact & Contribution</h3>
            
            <div className="grid grid-cols-2 gap-4">
              {/* Hours Created */}
              <div className="space-y-1">
                <div className="flex items-center gap-1.5 mb-1">
                  <Clock className="w-3.5 h-3.5 text-white/40" strokeWidth={1.5} />
                  <span className="text-[10px] tracking-wider uppercase text-white/40">Hours Created</span>
                </div>
                <div className="text-2xl font-light tracking-tight">{userStats.hoursCreated}</div>
              </div>

              {/* Cultural Contributions */}
              <div className="space-y-1">
                <div className="flex items-center gap-1.5 mb-1">
                  <Palette className="w-3.5 h-3.5 text-white/40" strokeWidth={1.5} />
                  <span className="text-[10px] tracking-wider uppercase text-white/40">Contributions</span>
                </div>
                <div className="text-2xl font-light tracking-tight">{userStats.culturalContributions}</div>
              </div>

              {/* Community Impact */}
              <div className="space-y-1">
                <div className="flex items-center gap-1.5 mb-1">
                  <Heart className="w-3.5 h-3.5 text-white/40" strokeWidth={1.5} />
                  <span className="text-[10px] tracking-wider uppercase text-white/40">Community Impact</span>
                </div>
                <div className="text-2xl font-light tracking-tight">{userStats.communityImpact.toLocaleString()}</div>
              </div>

              {/* Avg Completion */}
              <div className="space-y-1">
                <div className="flex items-center gap-1.5 mb-1">
                  <BarChart3 className="w-3.5 h-3.5 text-white/40" strokeWidth={1.5} />
                  <span className="text-[10px] tracking-wider uppercase text-white/40">Avg Completion</span>
                </div>
                <div className="text-2xl font-light tracking-tight">{userStats.averageCompletion}%</div>
              </div>
            </div>
          </div>
        </div>

        {/* Links & Presence */}
        <div className="px-5 mb-8">
          <h3 className="text-xs tracking-widest uppercase text-white/40 mb-3 px-1">Links & Presence</h3>

          {/* Share Profile */}
          <button
            type="button"
            onClick={handleShareProfile}
            className="w-full flex items-center justify-between p-4 border border-white/10 bg-white/[0.02] rounded-lg hover:border-white/20 hover:bg-white/[0.04] transition-all duration-300 mb-2"
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center">
                {shareStatus === 'copied' ? (
                  <Check className="w-4 h-4 text-green-400" strokeWidth={1.5} />
                ) : (
                  <Share2 className="w-4 h-4 text-white/60" strokeWidth={1.5} />
                )}
              </div>
              <div className="text-left">
                <div className="text-sm tracking-wide">
                  {shareStatus === 'copied' ? 'Link Copied' : 'Share Profile'}
                </div>
                <div className="text-xs text-white/40">Share your creator page</div>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-white/30" strokeWidth={1.5} />
          </button>

          {/* Social Links */}
          <div className="bg-white/[0.02] border border-white/10 rounded-lg overflow-hidden">
            <div className="flex items-center justify-between px-4 py-3">
              <div className="flex items-center gap-3">
                {PLATFORMS.map(platform => {
                  const link = socialLinks.find(l => l.platform === platform);
                  const meta = PLATFORM_META[platform];
                  return (
                    <button
                      key={platform}
                      aria-label={meta.label}
                      onClick={() => link?.url ? handleOpenLink(link.url) : setEditingLinks(true)}
                      className={`transition-all duration-200 ${link?.url ? 'text-white hover:text-white/80' : 'text-white/20 hover:text-white/40'}`}
                    >
                      {meta.icon}
                    </button>
                  );
                })}
              </div>
              <button
                onClick={() => setEditingLinks(v => !v)}
                aria-label="Manage social links"
                className="text-white/40 hover:text-white/70 transition-colors"
              >
                <Pencil className="w-3.5 h-3.5" />
              </button>
            </div>

            <AnimatePresence>
              {editingLinks && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.25 }}
                  className="overflow-hidden"
                >
                  <div className="border-t border-white/10 px-4 py-4 space-y-3">
                    <p className="text-xs text-white/40 mb-1">Max {MAX_LINKS} links · {socialLinks.filter(l => l.url.trim()).length} active</p>
                    {PLATFORMS.map(platform => {
                      const meta = PLATFORM_META[platform];
                      const hasError = urlErrors[platform];
                      return (
                        <div key={platform}>
                          <div className={`flex items-center gap-2 rounded-xl border px-3 py-2.5 ${hasError ? 'border-red-500/50 bg-red-500/5' : 'border-white/10 bg-white/5'}`}>
                            <span className="text-white/50 flex-shrink-0">{meta.icon}</span>
                            <input
                              type="url"
                              value={draftLinks[platform]}
                              onChange={e => {
                                setDraftLinks(prev => ({ ...prev, [platform]: e.target.value }));
                                if (urlErrors[platform]) setUrlErrors(prev => { const n = {...prev}; delete n[platform]; return n; });
                              }}
                              placeholder={meta.placeholder}
                              className="flex-1 bg-transparent text-xs text-white placeholder-white/25 focus:outline-none min-w-0"
                            />
                            {draftLinks[platform] && (
                              <button onClick={() => setDraftLinks(prev => ({ ...prev, [platform]: '' }))} className="text-white/30 hover:text-white/60 flex-shrink-0">
                                <X className="w-3 h-3" />
                              </button>
                            )}
                          </div>
                          {hasError && <p className="text-xs text-red-400 mt-1 px-1">Invalid URL</p>}
                        </div>
                      );
                    })}
                    <div className="flex gap-2 pt-1">
                      <button onClick={handleSaveLinks} className="flex-1 py-2.5 rounded-xl bg-white text-black text-sm font-medium hover:bg-white/90 transition-colors">Save</button>
                      <button onClick={handleCancelEdit} className="flex-1 py-2.5 rounded-xl border border-white/20 text-white text-sm hover:border-white/40 transition-colors">Cancel</button>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Creator Tools */}
        <div className="px-5 mb-8">
          <h3 className="text-xs tracking-widest uppercase text-white/40 mb-3 px-1">Creator Tools</h3>
          
          <div className="space-y-2">
            {/* Creator Dashboard */}
            <button
              type="button"
              onClick={() => setActiveModal('dashboard')}
              className="w-full flex items-center justify-between p-4 border border-white/10 bg-white/[0.02] rounded-lg hover:border-white/20 hover:bg-white/[0.04] transition-all duration-300"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center">
                  <BarChart3 className="w-4 h-4 text-white/60" strokeWidth={1.5} />
                </div>
                <div className="text-left">
                  <div className="text-sm tracking-wide">Creator Dashboard</div>
                  <div className="text-xs text-white/40">Analytics & insights</div>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-white/30" strokeWidth={1.5} />
            </button>

            {/* Rights & Licensing */}
            <button
              type="button"
              onClick={() => setActiveModal('rights')}
              className="w-full flex items-center justify-between p-4 border border-white/10 bg-white/[0.02] rounded-lg hover:border-white/20 hover:bg-white/[0.04] transition-all duration-300"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center">
                  <Shield className="w-4 h-4 text-white/60" strokeWidth={1.5} />
                </div>
                <div className="text-left">
                  <div className="text-sm tracking-wide">Rights & Licensing</div>
                  <div className="text-xs text-white/40">Manage IP & attribution</div>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-white/30" strokeWidth={1.5} />
            </button>

            {/* Content Guidelines */}
            <button
              type="button"
              onClick={() => setActiveModal('guidelines')}
              className="w-full flex items-center justify-between p-4 border border-white/10 bg-white/[0.02] rounded-lg hover:border-white/20 hover:bg-white/[0.04] transition-all duration-300"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center">
                  <FileText className="w-4 h-4 text-white/60" strokeWidth={1.5} />
                </div>
                <div className="text-left">
                  <div className="text-sm tracking-wide">Content Guidelines</div>
                  <div className="text-xs text-white/40">Standards & best practices</div>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-white/30" strokeWidth={1.5} />
            </button>

            {/* Feature 6: CMF Eligibility Checker */}
            <button
              type="button"
              onClick={() => setActiveModal('cmf')}
              className="w-full flex items-center justify-between p-4 border border-white/10 bg-white/[0.02] rounded-lg hover:border-white/20 hover:bg-white/[0.04] transition-all duration-300"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center">
                  <Building2 className="w-4 h-4 text-white/60" strokeWidth={1.5} />
                </div>
                <div className="text-left">
                  <div className="text-sm tracking-wide">CMF Eligibility Checker</div>
                  <div className="text-xs text-white/40">Find matching grant programs</div>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-white/30" strokeWidth={1.5} />
            </button>
          </div>
        </div>

        {/* Settings Sections */}
        <div className="px-5 mb-8">
          <h3 className="text-xs tracking-widest uppercase text-white/40 mb-3 px-1">Settings</h3>
          
          <div className="space-y-2">
            {/* Language */}
            <button
              type="button"
              onClick={cycleLanguage}
              className="w-full flex items-center justify-between p-4 border border-white/10 bg-white/[0.02] rounded-lg hover:border-white/20 hover:bg-white/[0.04] transition-all duration-300"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center">
                  <Globe className="w-4 h-4 text-white/60" strokeWidth={1.5} />
                </div>
                <div className="text-left">
                  <div className="text-sm tracking-wide">Language</div>
                  <div className="text-xs text-white/40">
                    {language === 'en' ? 'English' : language === 'fr' ? 'Français' : 'Español'}
                  </div>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-white/30" strokeWidth={1.5} />
            </button>

            {/* Accessibility */}
            <button
              type="button"
              onClick={() => setActiveModal('accessibility')}
              className="w-full flex items-center justify-between p-4 border border-white/10 bg-white/[0.02] rounded-lg hover:border-white/20 hover:bg-white/[0.04] transition-all duration-300"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center">
                  <Eye className="w-4 h-4 text-white/60" strokeWidth={1.5} />
                </div>
                <div className="text-left">
                  <div className="text-sm tracking-wide">Accessibility</div>
                  <div className="text-xs text-white/40">Motion, audio, captions</div>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-white/30" strokeWidth={1.5} />
            </button>

            {/* Privacy */}
            <button
              type="button"
              onClick={() => setActiveModal('privacy')}
              className="w-full flex items-center justify-between p-4 border border-white/10 bg-white/[0.02] rounded-lg hover:border-white/20 hover:bg-white/[0.04] transition-all duration-300"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center">
                  <Shield className="w-4 h-4 text-white/60" strokeWidth={1.5} />
                </div>
                <div className="text-left">
                  <div className="text-sm tracking-wide">Privacy</div>
                  <div className="text-xs text-white/40">Data & permissions</div>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-white/30" strokeWidth={1.5} />
            </button>
          </div>
        </div>

        {/* Support & Info */}
        <div className="px-5 mb-8">
          <h3 className="text-xs tracking-widest uppercase text-white/40 mb-3 px-1">Support & Information</h3>
          
          <div className="space-y-2">
            {/* Grant Resources */}
            <button
              type="button"
              onClick={() => window.open('https://cmf-fmc.ca/en/', '_blank', 'noopener,noreferrer')}
              className="w-full flex items-center justify-between p-4 border border-white/10 bg-white/[0.02] rounded-lg hover:border-white/20 hover:bg-white/[0.04] transition-all duration-300"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center">
                  <Building2 className="w-4 h-4 text-white/60" strokeWidth={1.5} />
                </div>
                <span className="text-sm tracking-wide">CMF Grant Resources</span>
              </div>
              <ChevronRight className="w-4 h-4 text-white/30" strokeWidth={1.5} />
            </button>

            {/* Feedback */}
            <button
              type="button"
              onClick={() => setActiveModal('feedback')}
              className="w-full flex items-center justify-between p-4 border border-white/10 bg-white/[0.02] rounded-lg hover:border-white/20 hover:bg-white/[0.04] transition-all duration-300"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center">
                  <MessageCircle className="w-4 h-4 text-white/60" strokeWidth={1.5} />
                </div>
                <span className="text-sm tracking-wide">Send Feedback</span>
              </div>
              <ChevronRight className="w-4 h-4 text-white/30" strokeWidth={1.5} />
            </button>

            {/* About */}
            <button
              type="button"
              onClick={() => onOpenAbout?.()}
              className="w-full flex items-center justify-between p-4 border border-white/10 bg-white/[0.02] rounded-lg hover:border-white/20 hover:bg-white/[0.04] transition-all duration-300"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center">
                  <Info className="w-4 h-4 text-white/60" strokeWidth={1.5} />
                </div>
                <span className="text-sm tracking-wide">About SEEN</span>
              </div>
              <ChevronRight className="w-4 h-4 text-white/30" strokeWidth={1.5} />
            </button>
          </div>
        </div>

        {/* Sign Out */}
        <div className="px-5">
          <button
            type="button"
            onClick={handleSignOut}
            className="w-full flex items-center justify-center gap-2 py-4 border border-white/10 bg-white/[0.02] rounded-lg hover:border-red-500/30 hover:bg-red-500/5 hover:text-red-500 transition-all duration-300 text-white/60"
          >
            <LogOut className="w-4 h-4" strokeWidth={1.5} />
            <span className="text-sm tracking-wide">Sign Out</span>
          </button>
        </div>
      </div>

      {/* Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-black/95 backdrop-blur-xl border-t border-white/10 pointer-events-none">
        <div className="max-w-[428px] mx-auto px-4 py-4 flex justify-around items-end">
          <button
            type="button"
            onClick={() => onNavigate("for-you")}
            className="flex flex-col items-center gap-1.5 transition-all duration-300 pointer-events-auto group text-white/40 hover:text-white/60"
          >
            <div className="relative">
              <div className="w-5 h-5 flex items-center justify-center">
                <div className="w-3.5 h-3.5 rounded-sm border-2 border-white/40 group-hover:border-white/60 transition-colors duration-300" />
              </div>
              <div className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-white/40 border border-black" />
            </div>
            <span className="text-[10px] tracking-widest uppercase font-light">For You</span>
          </button>
          
          <button
            type="button"
            onClick={() => onNavigate("explore")}
            className="flex flex-col items-center gap-1.5 transition-all duration-300 pointer-events-auto group text-white/40 hover:text-white/60"
          >
            <div className="w-5 h-5 flex items-center justify-center">
              <div className="w-4 h-4 rounded-full border border-white/40 group-hover:border-white/60 transition-colors duration-300" />
            </div>
            <span className="text-[10px] tracking-widest uppercase font-light">Explore</span>
          </button>

          <button
            type="button"
            onClick={() => onNavigate("create")}
            className="flex flex-col items-center gap-1 transition-all duration-300 pointer-events-auto group -mt-3"
          >
            <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center shadow-[0_0_24px_rgba(255,255,255,0.25)] group-hover:shadow-[0_0_32px_rgba(255,255,255,0.4)] transition-shadow duration-300">
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                <path d="M10 4v12M4 10h12" stroke="black" strokeWidth="2" strokeLinecap="round"/>
              </svg>
            </div>
            <span className="text-[10px] tracking-widest uppercase font-light text-white/60 group-hover:text-white/80 transition-colors">Create</span>
          </button>
          
          <button
            type="button"
            onClick={() => onNavigate("library")}
            className="flex flex-col items-center gap-1.5 transition-all duration-300 pointer-events-auto group text-white/40 hover:text-white/60"
          >
            <div className="w-5 h-5 flex items-center justify-center">
              <div className="space-y-0.5">
                <div className="w-4 h-0.5 bg-white/40 group-hover:bg-white/60 transition-colors duration-300" />
                <div className="w-4 h-0.5 bg-white/40 group-hover:bg-white/60 transition-colors duration-300" />
                <div className="w-4 h-0.5 bg-white/40 group-hover:bg-white/60 transition-colors duration-300" />
              </div>
            </div>
            <span className="text-[10px] tracking-widest uppercase font-light">Library</span>
          </button>
          
          <button
            type="button"
            onClick={() => onNavigate("profile")}
            className="flex flex-col items-center gap-1.5 transition-all duration-300 pointer-events-auto group text-white"
          >
            <div className="w-5 h-5 flex items-center justify-center">
              <div className="w-4 h-4 rounded-full border border-white drop-shadow-[0_0_8px_rgba(255,255,255,0.5)] flex items-center justify-center">
                <div className="w-2 h-2 rounded-full bg-white" />
              </div>
            </div>
            <span className="text-[10px] tracking-widest uppercase font-medium">Profile</span>
          </button>
        </div>
      </div>

      {/* Modal Overlay */}
      <AnimatePresence>
        {activeModal && (
          <motion.div
            key="modal-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm"
            onClick={() => setActiveModal(null)}
          />
        )}
        {activeModal && (
          <motion.div
            key="modal-sheet"
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            className="fixed bottom-0 left-0 right-0 z-50 max-w-[428px] mx-auto bg-[#111] border-t border-white/10 rounded-t-2xl overflow-hidden"
          >
            {/* Modal Handle */}
            <div className="flex justify-center pt-3 pb-2">
              <div className="w-10 h-1 rounded-full bg-white/20" />
            </div>

            {/* Dashboard */}
            {activeModal === 'dashboard' && (
              <div className="px-5 pb-10">
                <h3 className="text-base tracking-wide font-light mb-1">Creator Dashboard</h3>
                <p className="text-xs text-white/40 mb-6">Your analytics at a glance</p>
                <div className="grid grid-cols-2 gap-3 mb-6">
                  {[
                    { label: 'Total Views', value: '4,368', icon: <Eye className="w-4 h-4" /> },
                    { label: 'Stories Published', value: '3', icon: <FileText className="w-4 h-4" /> },
                    { label: 'Avg. Completion', value: '78%', icon: <BarChart3 className="w-4 h-4" /> },
                    { label: 'Community Impact', value: '2,845', icon: <Heart className="w-4 h-4" /> },
                  ].map(({ label, value, icon }) => (
                    <div key={label} className="p-4 border border-white/10 bg-white/[0.02] rounded-lg">
                      <div className="flex items-center gap-2 mb-2 text-white/40">{icon}<span className="text-[10px] tracking-widest uppercase">{label}</span></div>
                      <div className="text-2xl font-light tracking-wide">{value}</div>
                    </div>
                  ))}
                </div>
                <button type="button" onClick={() => setActiveModal(null)} className="w-full py-3 text-sm tracking-widest uppercase text-white/40 border border-white/10 rounded-lg hover:border-white/20 transition-all">Close</button>
              </div>
            )}

            {/* Rights & Licensing */}
            {activeModal === 'rights' && (
              <div className="px-5 pb-10">
                <h3 className="text-base tracking-wide font-light mb-1">Rights & Licensing</h3>
                <p className="text-xs text-white/40 mb-5">Your intellectual property on SEEN</p>
                <div className="space-y-3 mb-6">
                  {[
                    { title: 'You own your content', body: 'All stories you publish remain your intellectual property. SEEN holds a limited licence to display your work on the platform.' },
                    { title: 'Attribution required', body: 'Content shared or remixed by other creators must credit you. Violations can be reported through the moderation system.' },
                    { title: 'CMF compliance', body: 'Content funded through CMF grants must comply with Canadian content requirements. See CMF Grant Resources for details.' },
                  ].map(({ title, body }) => (
                    <div key={title} className="p-3 border border-white/10 bg-white/[0.02] rounded-lg">
                      <div className="text-xs tracking-wide font-medium mb-1">{title}</div>
                      <div className="text-xs text-white/50 leading-relaxed">{body}</div>
                    </div>
                  ))}
                </div>
                <button type="button" onClick={() => setActiveModal(null)} className="w-full py-3 text-sm tracking-widest uppercase text-white/40 border border-white/10 rounded-lg hover:border-white/20 transition-all">Close</button>
              </div>
            )}

            {/* Content Guidelines */}
            {activeModal === 'guidelines' && (
              <div className="px-5 pb-10">
                <h3 className="text-base tracking-wide font-light mb-1">Content Guidelines</h3>
                <p className="text-xs text-white/40 mb-5">Standards for publishing on SEEN</p>
                <div className="space-y-2 mb-6">
                  {[
                    'Uplift underrepresented Canadian voices and cultural perspectives',
                    'No hate speech, discrimination, or harmful stereotyping',
                    'Audio must meet PIPEDA privacy standards — no recording third parties without consent',
                    'All copyrighted music or media must be properly licensed',
                    'Content involving minors requires parental consent documentation',
                    'Subtitle/caption files are strongly encouraged for accessibility',
                  ].map((item, i) => (
                    <div key={i} className="flex items-start gap-3 py-2 border-b border-white/5 last:border-0">
                      <div className="w-5 h-5 rounded-full bg-white/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <Check className="w-3 h-3 text-white/60" strokeWidth={2} />
                      </div>
                      <span className="text-xs text-white/60 leading-relaxed">{item}</span>
                    </div>
                  ))}
                </div>
                <button type="button" onClick={() => setActiveModal(null)} className="w-full py-3 text-sm tracking-widest uppercase text-white/40 border border-white/10 rounded-lg hover:border-white/20 transition-all">Close</button>
              </div>
            )}

            {/* Accessibility */}
            {activeModal === 'accessibility' && (
              <div className="px-5 pb-10">
                <h3 className="text-base tracking-wide font-light mb-1">Accessibility</h3>
                <p className="text-xs text-white/40 mb-5">Adjust your experience</p>
                <div className="space-y-3 mb-6">
                  {[
                    { key: 'reducedMotion' as const, label: 'Reduce Motion', desc: 'Minimise animations and transitions' },
                    { key: 'captionsEnabled' as const, label: 'Subtitles & Captions', desc: 'Show captions during story playback' },
                    { key: 'highContrast' as const, label: 'High Contrast', desc: 'Increase contrast for better readability' },
                  ].map(({ key, label, desc }) => (
                    <button
                      key={key}
                      type="button"
                      onClick={() => setAccessibilityPreferences({ [key]: !accessibilityPreferences[key] })}
                      className="w-full flex items-center justify-between p-4 border border-white/10 bg-white/[0.02] rounded-lg hover:border-white/20 transition-all"
                    >
                      <div className="text-left">
                        <div className="text-sm tracking-wide">{label}</div>
                        <div className="text-xs text-white/40">{desc}</div>
                      </div>
                      <div className={`w-10 h-5 rounded-full transition-all duration-300 flex items-center px-0.5 ${accessibilityPreferences[key] ? 'bg-white' : 'bg-white/20'}`}>
                        <div className={`w-4 h-4 rounded-full bg-black transition-all duration-300 ${accessibilityPreferences[key] ? 'translate-x-5' : 'translate-x-0'}`} />
                      </div>
                    </button>
                  ))}
                </div>
                <button type="button" onClick={() => setActiveModal(null)} className="w-full py-3 text-sm tracking-widest uppercase text-white/40 border border-white/10 rounded-lg hover:border-white/20 transition-all">Done</button>
              </div>
            )}

            {/* Privacy */}
            {activeModal === 'privacy' && (
              <div className="px-5 pb-10">
                <h3 className="text-base tracking-wide font-light mb-1">Privacy</h3>
                <p className="text-xs text-white/40 mb-5">PIPEDA-compliant data handling</p>
                <div className="space-y-3 mb-6">
                  {[
                    { title: 'Data we collect', body: 'Account details, content you publish, and anonymised engagement metrics. No third-party advertising data is collected.' },
                    { title: 'How it\'s used', body: 'Your data powers your creator analytics, personalised recommendations, and platform safety. It is never sold to third parties.' },
                    { title: 'Your rights', body: 'You may request a data export or deletion of your account at any time by contacting privacy@creova.ca.' },
                  ].map(({ title, body }) => (
                    <div key={title} className="p-3 border border-white/10 bg-white/[0.02] rounded-lg">
                      <div className="text-xs tracking-wide font-medium mb-1">{title}</div>
                      <div className="text-xs text-white/50 leading-relaxed">{body}</div>
                    </div>
                  ))}
                </div>
                <button type="button" onClick={() => setActiveModal(null)} className="w-full py-3 text-sm tracking-widest uppercase text-white/40 border border-white/10 rounded-lg hover:border-white/20 transition-all">Close</button>
              </div>
            )}

            {/* Feedback */}
            {activeModal === 'feedback' && (
              <div className="px-5 pb-10">
                <h3 className="text-base tracking-wide font-light mb-1">Send Feedback</h3>
                <p className="text-xs text-white/40 mb-5">Help us improve SEEN for all creators</p>
                <div className="space-y-3 mb-6">
                  <button
                    type="button"
                    onClick={() => { window.open('mailto:hello@creova.ca?subject=SEEN Creator Feedback', '_blank'); setActiveModal(null); }}
                    className="w-full flex items-center gap-3 p-4 border border-white/10 bg-white/[0.02] rounded-lg hover:border-white/20 transition-all"
                  >
                    <MessageCircle className="w-4 h-4 text-white/60" strokeWidth={1.5} />
                    <div className="text-left">
                      <div className="text-sm tracking-wide">Email the team</div>
                      <div className="text-xs text-white/40">hello@creova.ca</div>
                    </div>
                  </button>
                  <button
                    type="button"
                    onClick={() => { window.open('https://cmf-fmc.ca/en/', '_blank', 'noopener,noreferrer'); setActiveModal(null); }}
                    className="w-full flex items-center gap-3 p-4 border border-white/10 bg-white/[0.02] rounded-lg hover:border-white/20 transition-all"
                  >
                    <Building2 className="w-4 h-4 text-white/60" strokeWidth={1.5} />
                    <div className="text-left">
                      <div className="text-sm tracking-wide">Report a CMF concern</div>
                      <div className="text-xs text-white/40">cmf-fmc.ca</div>
                    </div>
                  </button>
                </div>
                <button type="button" onClick={() => setActiveModal(null)} className="w-full py-3 text-sm tracking-widest uppercase text-white/40 border border-white/10 rounded-lg hover:border-white/20 transition-all">Cancel</button>
              </div>
            )}

            {/* Feature 6: CMF Eligibility Checker */}
            {activeModal === 'cmf' && <CMFEligibilityChecker onClose={() => setActiveModal(null)} />}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// Feature 6: CMF Eligibility Checker Component
type CMFStep = 1 | 2 | 3 | 4;

const CMF_PROGRAMS = [
  {
    id: 'lfp',
    name: 'Linear and Digital Performance Envelopes',
    desc: 'For French-language dramatic series and docs with strong broadcaster support.',
    budget: ['250k-1m', '1m+'],
    types: ['drama', 'documentary'],
    languages: ['french'],
    url: 'https://cmf-fmc.ca/en/funding/programs/linear-digital-performance-envelopes/',
  },
  {
    id: 'esp',
    name: 'English-Language Performance Envelopes',
    desc: 'Broadcaster-driven funding for English dramatic and children\'s content.',
    budget: ['250k-1m', '1m+'],
    types: ['drama', 'childrens', 'animation'],
    languages: ['english'],
    url: 'https://cmf-fmc.ca/en/funding/programs/linear-digital-performance-envelopes/',
  },
  {
    id: 'experiment',
    name: 'Experimental Stream',
    desc: 'For digital-first and innovative format productions under $250k.',
    budget: ['under250k'],
    types: ['drama', 'documentary', 'variety', 'animation'],
    languages: ['english', 'french', 'indigenous', 'multilingual'],
    url: 'https://cmf-fmc.ca/en/funding/programs/experimental-stream/',
  },
  {
    id: 'indigenous',
    name: 'Indigenous Program',
    desc: 'Dedicated program for Indigenous creators telling Indigenous stories.',
    budget: ['under250k', '250k-1m', '1m+'],
    types: ['drama', 'documentary', 'animation', 'childrens'],
    languages: ['indigenous', 'multilingual'],
    url: 'https://cmf-fmc.ca/en/funding/programs/indigenous-program/',
  },
  {
    id: 'doc',
    name: 'Documentary Program',
    desc: 'For independently produced Canadian documentary projects.',
    budget: ['under250k', '250k-1m'],
    types: ['documentary'],
    languages: ['english', 'french', 'multilingual'],
    url: 'https://cmf-fmc.ca/en/funding/programs/documentary-program/',
  },
  {
    id: 'convergent',
    name: 'Convergent Stream',
    desc: 'Linear TV content with digital extensions for all content types.',
    budget: ['250k-1m', '1m+'],
    types: ['drama', 'documentary', 'childrens', 'variety'],
    languages: ['english', 'french'],
    url: 'https://cmf-fmc.ca/en/funding/programs/convergent-stream/',
  },
];

function CMFEligibilityChecker({ onClose }: { onClose: () => void }) {
  const [step, setStep] = useState<CMFStep>(1);
  const [budget, setBudget] = useState<string>('');
  const [prodType, setProdType] = useState<string>('');
  const [lang, setLang] = useState<string>('');

  const matchedPrograms = CMF_PROGRAMS.filter(p =>
    (!budget || p.budget.includes(budget)) &&
    (!prodType || p.types.includes(prodType)) &&
    (!lang || p.languages.includes(lang))
  );

  const BUDGET_OPTIONS = [
    { id: 'under250k', label: 'Under $250K', desc: 'Micro-budget & experimental' },
    { id: '250k-1m', label: '$250K – $1M', desc: 'Mid-budget production' },
    { id: '1m+', label: 'Over $1M', desc: 'Large-scale production' },
  ];
  const TYPE_OPTIONS = [
    { id: 'drama', label: 'Drama / Scripted' },
    { id: 'documentary', label: 'Documentary' },
    { id: 'childrens', label: "Children's" },
    { id: 'animation', label: 'Animation' },
    { id: 'variety', label: 'Variety / Talk' },
  ];
  const LANG_OPTIONS = [
    { id: 'english', label: 'English' },
    { id: 'french', label: 'French / OLFB' },
    { id: 'indigenous', label: 'Indigenous Language' },
    { id: 'multilingual', label: 'Multilingual' },
  ];

  return (
    <div className="px-5 pb-10 max-h-[70vh] overflow-y-auto">
      <div className="flex items-center justify-between mb-1">
        <h3 className="text-base tracking-wide font-light">CMF Eligibility Checker</h3>
        <span className="text-xs text-white/30">Step {step === 4 ? 3 : step} of 3</span>
      </div>
      <p className="text-xs text-white/40 mb-5">Answer 3 questions to see which programs match your project</p>

      {/* Step indicator */}
      <div className="flex gap-2 mb-6">
        {[1,2,3].map(s => (
          <div key={s} className={`flex-1 h-0.5 rounded-full transition-all duration-300 ${step >= s ? 'bg-white/60' : 'bg-white/10'}`} />
        ))}
      </div>

      {/* Step 1: Budget */}
      {step === 1 && (
        <div className="space-y-3">
          <p className="text-sm text-white/70 mb-4">What is your project budget?</p>
          {BUDGET_OPTIONS.map(opt => (
            <button
              key={opt.id}
              type="button"
              onClick={() => { setBudget(opt.id); setStep(2); }}
              className="w-full flex items-center justify-between p-4 border border-white/10 bg-white/[0.02] rounded-lg hover:border-white/30 hover:bg-white/[0.04] transition-all text-left"
            >
              <div>
                <div className="text-sm tracking-wide">{opt.label}</div>
                <div className="text-xs text-white/40 mt-0.5">{opt.desc}</div>
              </div>
              <ChevronRight className="w-4 h-4 text-white/30 flex-shrink-0" />
            </button>
          ))}
        </div>
      )}

      {/* Step 2: Production Type */}
      {step === 2 && (
        <div className="space-y-3">
          <p className="text-sm text-white/70 mb-4">What type of content are you producing?</p>
          {TYPE_OPTIONS.map(opt => (
            <button
              key={opt.id}
              type="button"
              onClick={() => { setProdType(opt.id); setStep(3); }}
              className="w-full flex items-center justify-between p-4 border border-white/10 bg-white/[0.02] rounded-lg hover:border-white/30 hover:bg-white/[0.04] transition-all text-left"
            >
              <span className="text-sm tracking-wide">{opt.label}</span>
              <ChevronRight className="w-4 h-4 text-white/30 flex-shrink-0" />
            </button>
          ))}
          <button type="button" onClick={() => setStep(1)} className="w-full text-xs text-white/30 py-2 hover:text-white/50 transition-colors">← Back</button>
        </div>
      )}

      {/* Step 3: Language */}
      {step === 3 && (
        <div className="space-y-3">
          <p className="text-sm text-white/70 mb-4">What is the primary language of your content?</p>
          {LANG_OPTIONS.map(opt => (
            <button
              key={opt.id}
              type="button"
              onClick={() => { setLang(opt.id); setStep(4); }}
              className="w-full flex items-center justify-between p-4 border border-white/10 bg-white/[0.02] rounded-lg hover:border-white/30 hover:bg-white/[0.04] transition-all text-left"
            >
              <span className="text-sm tracking-wide">{opt.label}</span>
              <ChevronRight className="w-4 h-4 text-white/30 flex-shrink-0" />
            </button>
          ))}
          <button type="button" onClick={() => setStep(2)} className="w-full text-xs text-white/30 py-2 hover:text-white/50 transition-colors">← Back</button>
        </div>
      )}

      {/* Step 4: Results */}
      {step === 4 && (
        <div>
          <p className="text-sm text-white/70 mb-4">
            {matchedPrograms.length > 0
              ? `${matchedPrograms.length} program${matchedPrograms.length !== 1 ? 's' : ''} match your project`
              : 'No exact matches — try adjusting your selections'}
          </p>
          <div className="space-y-3 mb-5">
            {matchedPrograms.map(prog => (
              <button
                key={prog.id}
                type="button"
                onClick={() => window.open(prog.url, '_blank', 'noopener,noreferrer')}
                className="w-full p-4 border border-white/10 bg-white/[0.02] rounded-lg hover:border-white/30 hover:bg-white/[0.04] transition-all text-left"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1">
                    <div className="text-xs font-medium tracking-wide mb-1">{prog.name}</div>
                    <div className="text-xs text-white/50 leading-relaxed">{prog.desc}</div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-white/30 flex-shrink-0 mt-0.5" />
                </div>
              </button>
            ))}
            {matchedPrograms.length === 0 && (
              <div className="p-4 border border-white/10 bg-white/[0.02] rounded-lg text-center">
                <p className="text-xs text-white/40">Try visiting cmf-fmc.ca for the full list of programs</p>
              </div>
            )}
          </div>
          <div className="flex gap-2">
            <button type="button" onClick={() => { setStep(1); setBudget(''); setProdType(''); setLang(''); }} className="flex-1 py-3 text-xs tracking-widest uppercase text-white/40 border border-white/10 rounded-lg hover:border-white/20 transition-all">Start Over</button>
            <button type="button" onClick={onClose} className="flex-1 py-3 text-xs tracking-widest uppercase text-white/40 border border-white/10 rounded-lg hover:border-white/20 transition-all">Close</button>
          </div>
        </div>
      )}
    </div>
  );
}
