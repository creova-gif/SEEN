import { motion } from "motion/react";
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
  Library
} from "lucide-react";
import { useStoryState } from "../contexts/StoryStateContext";
import { useAuth } from "../contexts/AuthContext";
import type { Language } from "../contexts/StoryStateContext";

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
  const { state, setUserRole } = useStoryState();
  const { state: authState, signOut } = useAuth();
  
  // Handle sign out
  const handleSignOut = async () => {
    try {
      await signOut();
      // User will be redirected to onboarding automatically
      window.location.reload();
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };
  
  // User profile data
  const user = {
    name: authState.user?.name || "Alex Rivera",
    email: authState.user?.email || "alex.rivera@example.com",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwb3J0cmFpdCUyMG1hbiUyMHByb2Zlc3Npb25hbHxlbnwxfHx8fDE3Mzg3MTEyMDB8MA&ixlib=rb-4.1.0&q=80&w=400",
    bio: "Music lover, storyteller, cultural explorer",
    joinDate: "January 2026",
    role: state.userRole // Use role from global state
  };

  // User stats
  const stats = {
    storiesCompleted: 12,
    hoursListened: 28,
    contributionsMade: 5,
    followersCount: 124,
    followingCount: 89
  };

  // Recent activity
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
      {/* Navigation */}
      <NavigationBar />

      {/* Main Content */}
      <main className="pt-20 pb-24 px-5 max-w-[428px] mx-auto">
        {/* Profile Header */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-8"
        >
          <div className="flex items-start gap-4 mb-6">
            {/* Avatar */}
            <div 
              className="w-20 h-20 rounded-full bg-cover bg-center border-2 border-white/10"
              style={{ backgroundImage: `url(${user.avatar})` }}
            />
            {/* User Info */}
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <h1 className="text-xl font-bold text-white">{user.name}</h1>
                {user.role === "creator" && (
                  <Moon className="w-4 h-4 text-purple-400" />
                )}
              </div>
              <p className="text-sm text-white/60 mb-2">{user.email}</p>
              <p className="text-xs text-white/40">Member since {user.joinDate}</p>
            </div>
          </div>

          {/* Bio */}
          <p className="text-sm text-white/80 mb-4">{user.bio}</p>

          {/* Edit Profile Button */}
          <button className="w-full py-3 rounded-xl bg-white/5 border border-white/10 text-white text-sm hover:bg-white/10 transition-colors flex items-center justify-center gap-2">
            <User className="w-4 h-4" />
            Edit Profile
          </button>
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

        {/* Development Testing - Switch Role */}
        {process.env.NODE_ENV === 'development' && (
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mb-8"
          >
            {/* Testing mode removed - roles are now set during onboarding only */}
          </motion.section>
        )}

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

        {/* Creator Section (if creator) */}
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

        {/* Creator Invitation (if viewer) */}
        {user.role === "viewer" && (
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mb-8"
          >
            <div className="bg-gradient-to-br from-purple-600/10 to-blue-600/10 border border-purple-500/20 rounded-2xl p-6">
              <div className="mb-3">
                <h2 className="text-base font-semibold text-white">Share Your Story</h2>
              </div>
              <p className="text-sm text-white/70 mb-4">Have a story, sound, or vision to share? Create your first piece and join our community of storytellers.</p>
              <button 
                onClick={() => {
                  // This will trigger role upgrade when they publish
                  onOpenCreatorDashboard?.();
                }}
                className="w-full py-2.5 rounded-lg bg-purple-600 text-white text-sm hover:bg-purple-700 transition-colors flex items-center justify-center gap-2"
              >
                <Plus className="w-4 h-4" />
                Start Creating
              </button>
            </div>
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
              onClick={() => {}}
            />
            <SettingItem
              icon={<Moon className="w-5 h-5" />}
              label="Intent"
              value={userIntent === "create" ? "Create" : userIntent === "contribute" ? "Contribute" : "Explore"}
              onClick={() => {}}
            />
            <SettingItem
              icon={<Eye className="w-5 h-5" />}
              label="Accessibility"
              value="Customized"
              onClick={() => {}}
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
              onClick={() => {}}
            />
            <SettingItem
              icon={<MessageCircle className="w-5 h-5" />}
              label="Community Guidelines"
              onClick={() => {}}
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

        {/* App Version */}
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
            className={`flex flex-col items-center gap-1.5 transition-all duration-300 pointer-events-auto group ${
              'for-you' === 'profile' ? 'text-white' : 'text-white/40 hover:text-white/60'
            }`}
          >
            <Home 
              className={`w-5 h-5 transition-all duration-300 ${
                'for-you' === 'profile' 
                  ? 'drop-shadow-[0_0_8px_rgba(255,255,255,0.5)]' 
                  : 'group-hover:drop-shadow-[0_0_4px_rgba(255,255,255,0.2)]'
              }`}
              strokeWidth={'for-you' === 'profile' ? 2 : 1.5}
            />
            <span className={`text-[10px] tracking-widest uppercase transition-all duration-300 ${
              'for-you' === 'profile' ? 'font-medium' : 'font-light'
            }`}>
              For You
            </span>
          </button>
          <button
            type="button"
            onClick={() => onNavigate("explore")}
            className={`flex flex-col items-center gap-1.5 transition-all duration-300 pointer-events-auto group ${
              'explore' === 'profile' ? 'text-white' : 'text-white/40 hover:text-white/60'
            }`}
          >
            <Compass 
              className={`w-5 h-5 transition-all duration-300 ${
                'explore' === 'profile' 
                  ? 'drop-shadow-[0_0_8px_rgba(255,255,255,0.5)]' 
                  : 'group-hover:drop-shadow-[0_0_4px_rgba(255,255,255,0.2)]'
              }`}
              strokeWidth={'explore' === 'profile' ? 2 : 1.5}
            />
            <span className={`text-[10px] tracking-widest uppercase transition-all duration-300 ${
              'explore' === 'profile' ? 'font-medium' : 'font-light'
            }`}>
              Explore
            </span>
          </button>
          <button
            type="button"
            onClick={() => onNavigate("library")}
            className={`flex flex-col items-center gap-1.5 transition-all duration-300 pointer-events-auto group ${
              'library' === 'profile' ? 'text-white' : 'text-white/40 hover:text-white/60'
            }`}
          >
            <Library 
              className={`w-5 h-5 transition-all duration-300 ${
                'library' === 'profile' 
                  ? 'drop-shadow-[0_0_8px_rgba(255,255,255,0.5)]' 
                  : 'group-hover:drop-shadow-[0_0_4px_rgba(255,255,255,0.2)]'
              }`}
              strokeWidth={'library' === 'profile' ? 2 : 1.5}
            />
            <span className={`text-[10px] tracking-widest uppercase transition-all duration-300 ${
              'library' === 'profile' ? 'font-medium' : 'font-light'
            }`}>
              Library
            </span>
          </button>
          <button
            type="button"
            onClick={() => onNavigate("profile")}
            className={`flex flex-col items-center gap-1.5 transition-all duration-300 pointer-events-auto group ${
              'profile' === 'profile' ? 'text-white' : 'text-white/40 hover:text-white/60'
            }`}
          >
            <User 
              className={`w-5 h-5 transition-all duration-300 ${
                'profile' === 'profile' 
                  ? 'drop-shadow-[0_0_8px_rgba(255,255,255,0.5)]' 
                  : 'group-hover:drop-shadow-[0_0_4px_rgba(255,255,255,0.2)]'
              }`}
              strokeWidth={'profile' === 'profile' ? 2 : 1.5}
            />
            <span className={`text-[10px] tracking-widest uppercase transition-all duration-300 ${
              'profile' === 'profile' ? 'font-medium' : 'font-light'
            }`}>
              Profile
            </span>
          </button>
        </div>
      </nav>
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