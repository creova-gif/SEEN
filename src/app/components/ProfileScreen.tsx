import { motion, AnimatePresence } from "motion/react";
import { NavigationBar } from "./NavigationBar";
import { 
  Settings, 
  Info, 
  Globe, 
  Eye, 
  BarChart3, 
  Heart, 
  ChevronRight, 
  User,
  Moon,
  Volume2,
  Plus,
  Shield,
  Building2,
  MessageCircle,
  LogOut,
  Home,
  Compass,
  Library,
  TrendingUp,
  Share2,
  Instagram,
  Twitter,
  Linkedin,
  Youtube,
  Link2,
  ExternalLink,
  Check,
  X,
  Pencil
} from "lucide-react";
import { useState, useCallback } from "react";
import { useStoryState } from "../contexts/StoryStateContext";
import { useAuth } from "../contexts/AuthContext";
import type { Language } from "../contexts/StoryStateContext";

type SocialPlatform = 'instagram' | 'twitter' | 'linkedin' | 'youtube' | 'tiktok' | 'website';

interface SocialLink {
  platform: SocialPlatform;
  url: string;
}

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
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveSocialLinks(links: SocialLink[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(links));
}

function isValidUrl(url: string) {
  if (!url.trim()) return true;
  try {
    const u = new URL(url.trim());
    return u.protocol === 'http:' || u.protocol === 'https:';
  } catch {
    return false;
  }
}

interface ProfileScreenProps {
  onNavigate: (screen: string) => void;
  onOpenSettings?: () => void;
  onOpenAbout?: () => void;
  onOpenCreatorDashboard?: () => void;
  onOpenModeration?: () => void;
  onOpenInstitutional?: () => void;
  userIntent?: "explore" | "create" | "contribute";
  language: "en" | "fr" | "es";
}

export function ProfileScreen({ 
  onNavigate, 
  onOpenSettings,
  onOpenAbout,
  onOpenCreatorDashboard,
  onOpenModeration,
  onOpenInstitutional,
  userIntent = "explore", 
  language = "en" 
}: ProfileScreenProps) {
  const { state, setUserRole, setLanguage, setIntent } = useStoryState();
  const [showGuidelinesModal, setShowGuidelinesModal] = useState(false);
  const { state: authState, signOut, requestRoleElevation } = useAuth();
  const [elevationReason, setElevationReason] = useState("");
  const [elevationSubmitted, setElevationSubmitted] = useState(false);
  const [elevationLoading, setElevationLoading] = useState(false);

  // Social links state
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

  const activeCount = socialLinks.filter(l => l.url.trim()).length;

  const handleOpenLink = (url: string) => {
    if (url) window.open(url, '_blank', 'noopener,noreferrer');
  };

  const handleShareProfile = useCallback(async () => {
    const shareData = {
      title: `${user.name} on SEEN`,
      text: `${user.bio} — ${language === 'fr' ? 'Découvrez mon profil sur SEEN' : 'Check out my profile on SEEN'}`,
      url: profileUrl,
    };
    try {
      if (navigator.share) {
        await navigator.share(shareData);
      } else {
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
  }, [profileUrl, language]);

  const handleSaveLinks = () => {
    const errors: Record<string, boolean> = {};
    PLATFORMS.forEach(p => {
      if (draftLinks[p] && !isValidUrl(draftLinks[p])) errors[p] = true;
    });
    if (Object.keys(errors).length > 0) { setUrlErrors(errors); return; }
    setUrlErrors({});

    const filled = PLATFORMS
      .filter(p => draftLinks[p].trim())
      .map(p => ({ platform: p, url: draftLinks[p].trim() }));

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

  // Handle sign out
  const handleSignOut = async () => {
    try {
      await signOut();
      window.location.reload();
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };
  
  const user = {
    name: authState.user?.name || "Alex Rivera",
    email: authState.user?.email || "alex.rivera@example.com",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwb3J0cmFpdCUyMG1hbiUyMHByb2Zlc3Npb25hbHxlbnwxfHx8fDE3Mzg3MTEyMDB8MA&ixlib=rb-4.1.0&q=80&w=400",
    bio: "Music lover, storyteller, cultural explorer",
    joinDate: "January 2026",
    role: state.userRole
  };

  const stats = {
    storiesCompleted: 12,
    hoursListened: 28,
    contributionsMade: 5,
    followersCount: 124,
    followingCount: 89
  };

  const recentActivity = [
    { action: "Completed", title: "Midnight Resonance", date: "Feb 3, 2026" },
    { action: "Bookmarked", title: "Echoes of Light", date: "Feb 2, 2026" },
    { action: "Contributed", title: "Community Response", date: "Feb 1, 2026" }
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4 }}
      className="min-h-screen bg-black"
    >
      <NavigationBar />

      <main className="pt-20 pb-24 px-5 max-w-[428px] mx-auto">

        {/* Profile Header */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-8"
        >
          <div className="flex items-start gap-4 mb-6">
            <div 
              className="w-20 h-20 rounded-full bg-cover bg-center border-2 border-white/10 flex-shrink-0"
              style={{ backgroundImage: `url(${user.avatar})` }}
            />
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <h1 className="text-xl font-bold text-white">{user.name}</h1>
                {user.role === "creator" && (
                  <Moon className="w-4 h-4 text-purple-400 flex-shrink-0" />
                )}
              </div>
              <p className="text-sm text-white/60 mb-2">{user.email}</p>
              <p className="text-xs text-white/40">Member since {user.joinDate}</p>
            </div>
          </div>

          <p className="text-sm text-white/80 mb-4">{user.bio}</p>

          {/* Edit Profile + Share Profile row */}
          <div className="flex gap-2 mb-4">
            <button className="flex-1 py-3 rounded-xl bg-white/5 border border-white/10 text-white text-sm hover:bg-white/10 transition-colors flex items-center justify-center gap-2">
              <User className="w-4 h-4" />
              {language === 'fr' ? 'Modifier le profil' : 'Edit Profile'}
            </button>
            <button
              onClick={handleShareProfile}
              aria-label="Share profile"
              className="py-3 px-4 rounded-xl bg-white/5 border border-white/10 text-white text-sm hover:bg-white/10 transition-colors flex items-center justify-center gap-2 min-w-[52px]"
            >
              {shareStatus === 'copied' ? (
                <Check className="w-4 h-4 text-green-400" />
              ) : (
                <Share2 className="w-4 h-4" />
              )}
              {shareStatus === 'copied' && (
                <span className="text-xs text-green-400">
                  {language === 'fr' ? 'Copié' : 'Copied'}
                </span>
              )}
            </button>
          </div>

          {/* Social Links */}
          <div className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden">
            {/* Platform icons row */}
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
                      className={`transition-all duration-200 ${
                        link?.url
                          ? 'text-white hover:text-white/80'
                          : 'text-white/20 hover:text-white/40'
                      }`}
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

            {/* Inline edit form */}
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
                    <p className="text-xs text-white/40 mb-1">
                      {language === 'fr'
                        ? `Max ${MAX_LINKS} liens · ${activeCount} actif${activeCount !== 1 ? 's' : ''}`
                        : `Max ${MAX_LINKS} links · ${activeCount} active`}
                    </p>
                    {PLATFORMS.map(platform => {
                      const meta = PLATFORM_META[platform];
                      const hasError = urlErrors[platform];
                      return (
                        <div key={platform}>
                          <div className={`flex items-center gap-2 rounded-xl border px-3 py-2.5 ${
                            hasError ? 'border-red-500/50 bg-red-500/5' : 'border-white/10 bg-white/5'
                          }`}>
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
                              <button
                                onClick={() => setDraftLinks(prev => ({ ...prev, [platform]: '' }))}
                                className="text-white/30 hover:text-white/60 flex-shrink-0"
                              >
                                <X className="w-3 h-3" />
                              </button>
                            )}
                          </div>
                          {hasError && (
                            <p className="text-xs text-red-400 mt-1 px-1">
                              {language === 'fr' ? 'URL invalide' : 'Invalid URL'}
                            </p>
                          )}
                        </div>
                      );
                    })}
                    <div className="flex gap-2 pt-1">
                      <button
                        onClick={handleSaveLinks}
                        className="flex-1 py-2.5 rounded-xl bg-white text-black text-sm font-medium hover:bg-white/90 transition-colors"
                      >
                        {language === 'fr' ? 'Enregistrer' : 'Save'}
                      </button>
                      <button
                        onClick={handleCancelEdit}
                        className="flex-1 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-sm hover:bg-white/10 transition-colors"
                      >
                        {language === 'fr' ? 'Annuler' : 'Cancel'}
                      </button>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.section>

        {/* Stats Grid */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-8"
        >
          <div className="grid grid-cols-3 gap-3">
            <StatCard value={stats.storiesCompleted} label="Stories" />
            <StatCard value={stats.hoursListened} label="Hours" />
            <StatCard value={stats.contributionsMade} label="Contributions" />
          </div>
        </motion.section>

        {/* Following Stats */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
          className="mb-8"
        >
          <div className="grid grid-cols-2 gap-3">
            <button className="bg-white/5 border border-white/10 rounded-xl p-4 hover:bg-white/10 transition-colors text-left">
              <div className="text-lg font-bold text-white mb-1">{stats.followersCount}</div>
              <div className="text-xs text-white/50">Followers</div>
            </button>
            <button className="bg-white/5 border border-white/10 rounded-xl p-4 hover:bg-white/10 transition-colors text-left">
              <div className="text-lg font-bold text-white mb-1">{stats.followingCount}</div>
              <div className="text-xs text-white/50">Following</div>
            </button>
          </div>
        </motion.section>

        {/* Role-Based Navigation */}
        {(state.userRole === 'creator' || state.userRole === 'moderator' || state.userRole === 'admin') && (
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.28 }}
            className="mb-8"
          >
            <h2 className="text-sm tracking-wider uppercase text-white/40 mb-4">
              {state.userRole === 'creator' ? 'Creator Tools' : 
               state.userRole === 'moderator' ? 'Moderation Tools' : 
               'Admin Tools'}
            </h2>
            <div className="space-y-2">
              {state.userRole === 'creator' && (
                <SettingItem
                  icon={<Moon className="w-5 h-5 text-purple-400" />}
                  label="Creator Dashboard"
                  value="Build stories"
                  onClick={onOpenCreatorDashboard}
                />
              )}
              {(state.userRole === 'moderator' || state.userRole === 'admin') && (
                <SettingItem
                  icon={<Shield className="w-5 h-5 text-blue-400" />}
                  label="Moderation Panel"
                  value="Review submissions"
                  onClick={onOpenModeration}
                />
              )}
              {state.userRole === 'admin' && (
                <SettingItem
                  icon={<Building2 className="w-5 h-5 text-green-400" />}
                  label="Institutional Collections"
                  value="Manage archives"
                  onClick={onOpenInstitutional}
                />
              )}
            </div>
          </motion.section>
        )}

        {/* Creator Section */}
        {user.role === "creator" && (
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mb-8"
          >
            <div className="bg-gradient-to-br from-purple-600/20 to-blue-600/20 border border-purple-500/30 rounded-2xl p-6">
              <div className="flex items-center gap-2 mb-3">
                <Moon className="w-5 h-5 text-purple-400" />
                <h2 className="text-base font-semibold text-white">Creator Dashboard</h2>
              </div>
              <p className="text-sm text-white/70 mb-4">Manage your stories and view analytics</p>
              <div className="flex gap-3">
                <button className="flex-1 py-2.5 rounded-lg bg-purple-600 text-white text-sm hover:bg-purple-700 transition-colors flex items-center justify-center gap-2">
                  <Plus className="w-4 h-4" />
                  New Story
                </button>
                <button className="flex-1 py-2.5 rounded-lg bg-white/10 border border-white/20 text-white text-sm hover:bg-white/20 transition-colors flex items-center justify-center gap-2">
                  <BarChart3 className="w-4 h-4" />
                  Analytics
                </button>
              </div>
            </div>
          </motion.section>
        )}

        {/* Role Elevation — viewers can apply to become creators */}
        {user.role === "viewer" && (
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mb-8"
          >
            {elevationSubmitted ? (
              <div className="bg-gradient-to-br from-green-600/10 to-emerald-600/10 border border-green-500/30 rounded-2xl p-6 text-center">
                <TrendingUp className="w-8 h-8 text-green-400 mx-auto mb-3" />
                <h2 className="text-base font-semibold text-white mb-2">Application Submitted</h2>
                <p className="text-sm text-white/60">Our team will review your application within 3–5 business days.</p>
              </div>
            ) : (
              <div className="bg-gradient-to-br from-purple-600/10 to-blue-600/10 border border-purple-500/20 rounded-2xl p-6">
                <div className="flex items-center gap-2 mb-2">
                  <TrendingUp className="w-5 h-5 text-purple-400" />
                  <h2 className="text-base font-semibold text-white">Become a Creator</h2>
                </div>
                <p className="text-sm text-white/60 mb-4">
                  {language === 'fr'
                    ? "Partagez votre histoire, votre son ou votre vision. Rejoignez notre communauté de conteurs autochtones, noirs, francophones et immigrants."
                    : "Share your story, sound, or vision. Join our community of Indigenous, Black Canadian, francophone, and immigrant storytellers."}
                </p>
                <textarea
                  value={elevationReason}
                  onChange={(e) => setElevationReason(e.target.value)}
                  placeholder={language === 'fr' ? "Parlez-nous de votre histoire et ce que vous souhaitez créer..." : "Tell us about your story and what you'd like to create..."}
                  rows={3}
                  className="w-full mb-3 px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-sm text-white placeholder-white/30 resize-none focus:outline-none focus:border-purple-400/40 transition-colors"
                />
                <button
                  disabled={elevationReason.trim().length < 20 || elevationLoading}
                  onClick={async () => {
                    setElevationLoading(true);
                    try {
                      await requestRoleElevation('creator', elevationReason);
                      setElevationSubmitted(true);
                    } catch {
                      setElevationSubmitted(true);
                    } finally {
                      setElevationLoading(false);
                    }
                  }}
                  className="w-full py-2.5 rounded-lg bg-purple-600 text-white text-sm hover:bg-purple-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
                >
                  {elevationLoading ? (
                    <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    <Plus className="w-4 h-4" />
                  )}
                  {language === 'fr' ? 'Soumettre ma candidature' : 'Apply to Create'}
                </button>
                <p className="text-xs text-white/30 text-center mt-2">
                  {language === 'fr' ? 'Minimum 20 caractères requis' : 'Min. 20 characters required'}
                </p>
              </div>
            )}
          </motion.section>
        )}

        {/* Recent Activity */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35 }}
          className="mb-8"
        >
          <h2 className="text-sm tracking-wider uppercase text-white/40 mb-4">Recent Activity</h2>
          <div className="space-y-3">
            {recentActivity.map((item, index) => (
              <div 
                key={index}
                className="bg-white/5 border border-white/10 rounded-xl p-4 flex items-center justify-between hover:bg-white/10 transition-colors cursor-pointer"
              >
                <div>
                  <div className="text-sm text-white mb-1">
                    <span className="text-purple-400">{item.action}</span> {item.title}
                  </div>
                  <div className="text-xs text-white/40">{item.date}</div>
                </div>
                <ChevronRight className="w-4 h-4 text-white/30" />
              </div>
            ))}
          </div>
        </motion.section>

        {/* Preferences & Settings */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mb-8"
        >
          <h2 className="text-sm tracking-wider uppercase text-white/40 mb-4">Preferences</h2>
          <div className="space-y-2">
            <SettingItem
              icon={<Globe className="w-5 h-5" />}
              label="Language"
              value={language === "en" ? "English" : language === "fr" ? "Français" : "Español"}
              onClick={() => {
                const next: Record<string, "en" | "fr" | "es"> = { en: 'fr', fr: 'es', es: 'en' };
                setLanguage(next[language] ?? 'en');
              }}
            />
            <SettingItem
              icon={<Moon className="w-5 h-5" />}
              label="Intent"
              value={userIntent === "create" ? "Create" : userIntent === "contribute" ? "Contribute" : "Explore"}
              onClick={() => {
                const next: Record<string, "explore" | "create" | "contribute"> = { explore: 'create', create: 'contribute', contribute: 'explore' };
                setIntent(next[userIntent] ?? 'explore');
              }}
            />
            <SettingItem
              icon={<Eye className="w-5 h-5" />}
              label="Accessibility"
              value="Customized"
              onClick={onOpenSettings}
            />
            <SettingItem
              icon={<Settings className="w-5 h-5" />}
              label="Settings"
              onClick={onOpenSettings}
            />
          </div>
        </motion.section>

        {/* Community & Support */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.45 }}
          className="mb-8"
        >
          <h2 className="text-sm tracking-wider uppercase text-white/40 mb-4">Community</h2>
          <div className="space-y-2">
            <SettingItem
              icon={<Heart className="w-5 h-5" />}
              label="Your Contributions"
              value={`${stats.contributionsMade} responses`}
              onClick={() => onNavigate("library")}
            />
            <SettingItem
              icon={<MessageCircle className="w-5 h-5" />}
              label="Community Guidelines"
              onClick={() => setShowGuidelinesModal(true)}
            />
            <SettingItem
              icon={<Info className="w-5 h-5" />}
              label="About SEEN"
              onClick={onOpenAbout}
            />
          </div>
        </motion.section>

        {/* Account Actions */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mb-8"
        >
          <button
            onClick={handleSignOut}
            className="w-full py-3 rounded-xl border border-red-500/30 text-red-400 text-sm hover:bg-red-500/10 transition-colors flex items-center justify-center gap-2"
          >
            <LogOut className="w-4 h-4" />
            Sign Out
          </button>
        </motion.section>

        <div className="text-center text-xs text-white/30">
          SEEN v1.0.0 • Made with ❤️ by CREOVA
        </div>
      </main>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 backdrop-blur-xl bg-black/60 border-t border-white/5 z-50 pointer-events-auto">
        <div className="max-w-[428px] mx-auto px-5 py-4 flex justify-around">
          <button
            type="button"
            onClick={() => onNavigate("for-you")}
            className="flex flex-col items-center gap-1.5 transition-all duration-300 pointer-events-auto group text-white/40 hover:text-white/60"
          >
            <Home className="w-5 h-5 transition-all duration-300 group-hover:drop-shadow-[0_0_4px_rgba(255,255,255,0.2)]" strokeWidth={1.5} />
            <span className="text-[10px] tracking-widest uppercase font-light">For You</span>
          </button>
          <button
            type="button"
            onClick={() => onNavigate("explore")}
            className="flex flex-col items-center gap-1.5 transition-all duration-300 pointer-events-auto group text-white/40 hover:text-white/60"
          >
            <Compass className="w-5 h-5 transition-all duration-300 group-hover:drop-shadow-[0_0_4px_rgba(255,255,255,0.2)]" strokeWidth={1.5} />
            <span className="text-[10px] tracking-widest uppercase font-light">Explore</span>
          </button>
          <button
            type="button"
            onClick={() => onNavigate("library")}
            className="flex flex-col items-center gap-1.5 transition-all duration-300 pointer-events-auto group text-white/40 hover:text-white/60"
          >
            <Library className="w-5 h-5 transition-all duration-300 group-hover:drop-shadow-[0_0_4px_rgba(255,255,255,0.2)]" strokeWidth={1.5} />
            <span className="text-[10px] tracking-widest uppercase font-light">Library</span>
          </button>
          <button
            type="button"
            onClick={() => onNavigate("profile")}
            className="flex flex-col items-center gap-1.5 transition-all duration-300 pointer-events-auto group text-white"
          >
            <User className="w-5 h-5 transition-all duration-300 drop-shadow-[0_0_8px_rgba(255,255,255,0.5)]" strokeWidth={2} />
            <span className="text-[10px] tracking-widest uppercase font-medium">Profile</span>
          </button>
        </div>
      </nav>

      {/* Community Guidelines Modal */}
      <AnimatePresence>
        {showGuidelinesModal && (
          <motion.div
            key="guidelines-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm"
            onClick={() => setShowGuidelinesModal(false)}
          />
        )}
        {showGuidelinesModal && (
          <motion.div
            key="guidelines-sheet"
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            className="fixed bottom-0 left-0 right-0 z-50 max-w-[428px] mx-auto bg-[#111] border-t border-white/10 rounded-t-2xl overflow-hidden"
          >
            <div className="flex justify-center pt-3 pb-2">
              <div className="w-10 h-1 rounded-full bg-white/20" />
            </div>
            <div className="px-5 pb-10">
              <h3 className="text-base tracking-wide font-light mb-1">Community Guidelines</h3>
              <p className="text-xs text-white/40 mb-5">How we keep SEEN a safe space</p>
              <div className="space-y-2 mb-6">
                {[
                  'Respect every voice — especially those historically silenced',
                  'No harassment, hate speech, or discrimination of any kind',
                  'Share content responsibly — misinformation is never welcome',
                  'Obtain consent before recording or featuring others in your story',
                  'Report harmful content using the in-story flag button',
                  'PIPEDA applies to all user data — protect people\'s privacy',
                ].map((item, i) => (
                  <div key={i} className="flex items-start gap-3 py-2 border-b border-white/5 last:border-0">
                    <div className="w-5 h-5 rounded-full bg-white/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <MessageCircle className="w-3 h-3 text-white/60" strokeWidth={2} />
                    </div>
                    <span className="text-xs text-white/60 leading-relaxed">{item}</span>
                  </div>
                ))}
              </div>
              <button type="button" onClick={() => setShowGuidelinesModal(false)} className="w-full py-3 text-sm tracking-widest uppercase text-white/40 border border-white/10 rounded-lg hover:border-white/20 transition-all">Got it</button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

function StatCard({ value, label }: { value: number; label: string }) {
  return (
    <div className="bg-white/5 border border-white/10 rounded-xl p-4 text-center">
      <div className="text-xl font-bold text-white mb-1">{value}</div>
      <div className="text-xs text-white/50">{label}</div>
    </div>
  );
}

function SettingItem({ 
  icon, 
  label, 
  value, 
  onClick 
}: { 
  icon: React.ReactNode; 
  label: string; 
  value?: string;
  onClick?: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className="w-full bg-white/5 border border-white/10 rounded-xl p-4 hover:bg-white/10 transition-colors flex items-center justify-between"
    >
      <div className="flex items-center gap-3">
        <div className="text-white/60">{icon}</div>
        <span className="text-sm text-white">{label}</span>
      </div>
      <div className="flex items-center gap-2">
        {value && <span className="text-sm text-white/50">{value}</span>}
        <ChevronRight className="w-4 h-4 text-white/30" />
      </div>
    </button>
  );
}
