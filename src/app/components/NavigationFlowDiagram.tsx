import { motion } from "motion/react";
import { 
  Map, 
  User, 
  Crown, 
  Shield, 
  Building2,
  ArrowRight,
  ChevronRight,
  Check,
  Lock
} from "lucide-react";

/**
 * SEEN Complete Navigation Flow & Architecture
 * 
 * Visual diagram mapping all navigation paths, user roles, 
 * screen transitions, and data bindings across the entire platform.
 * 
 * Covers:
 * - 4 user roles: Viewer, Creator, Moderator, Institutional Admin
 * - Complete navigation tree from splash to all screens
 * - Role-based access control (RBAC)
 * - Data read/write bindings per screen
 * - Multilingual support (EN/FR/ES)
 */

export function NavigationFlowDiagram() {
  return (
    <div className="min-h-screen bg-black text-white p-8 overflow-auto">
      <div className="max-w-7xl mx-auto pb-20">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12"
        >
          <div className="flex items-center gap-3 mb-4">
            <Map className="w-8 h-8 text-cyan-400" />
            <h1 className="text-3xl font-bold">SEEN Navigation Flow & Architecture</h1>
          </div>
          <p className="text-white/60 text-lg">
            Complete navigation mapping with role-based access control and data bindings
          </p>
          <div className="mt-4 inline-block px-4 py-2 bg-cyan-600/20 border border-cyan-500/30 rounded-lg">
            <span className="text-xs tracking-wider text-cyan-300">COMPREHENSIVE • ROLE-BASED • SECURE</span>
          </div>
        </motion.div>

        {/* User Roles Overview */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-6">User Roles & Permissions</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <RoleCard
              icon={<User className="w-6 h-6" />}
              name="Viewer"
              color="blue"
              permissions={[
                "Browse stories",
                "Read chapters",
                "Submit community responses",
                "Manage profile/preferences",
                "Save/bookmark stories"
              ]}
            />
            <RoleCard
              icon={<Crown className="w-6 h-6" />}
              name="Creator"
              color="purple"
              permissions={[
                "All Viewer permissions",
                "Create/edit story worlds",
                "Manage chapters & branches",
                "Upload multimedia",
                "View creator analytics"
              ]}
            />
            <RoleCard
              icon={<Shield className="w-6 h-6" />}
              name="Moderator"
              color="red"
              permissions={[
                "All Viewer permissions",
                "Review community responses",
                "Approve/reject submissions",
                "Access moderation panel",
                "View audit trails"
              ]}
            />
            <RoleCard
              icon={<Building2 className="w-6 h-6" />}
              name="Institutional Admin"
              color="green"
              permissions={[
                "Manage institutional collections",
                "Approve contributor stories",
                "Assign permissions",
                "View contributor profiles",
                "Access admin dashboard"
              ]}
            />
          </div>
        </section>

        {/* Global Navigation Structure */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-6">Global Navigation Tabs</h2>
          <div className="bg-white/5 border border-white/10 rounded-xl p-6">
            <div className="space-y-4">
              <NavigationTab
                name="For You / Home"
                access="All users"
                description="Personalized feed based on intent (explore/create/contribute)"
              />
              <NavigationTab
                name="Explore / Discover"
                access="All users"
                description="Browse story worlds, categories, featured collections, creators"
              />
              <NavigationTab
                name="Library"
                access="All users"
                description="Saved stories, downloads, history, playlists"
              />
              <NavigationTab
                name="Profile"
                access="All users"
                description="User settings, preferences, language, accessibility"
              />
              <NavigationTab
                name="Creator Dashboard"
                access="Creators only"
                badge="Creator"
                description="Create/edit story worlds, visual story builder, analytics"
              />
              <NavigationTab
                name="Moderation Panel"
                access="Moderators only"
                badge="Moderator"
                description="Review community responses, approve/reject, audit trails"
              />
              <NavigationTab
                name="Institutional Dashboard"
                access="Institutional Admins only"
                badge="Admin"
                description="Manage collections, approve contributors, permissions"
              />
            </div>
          </div>
        </section>

        {/* Complete Navigation Flow */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-6">Complete Navigation Flow</h2>
          
          {/* Universal Flow (All Users) */}
          <div className="mb-8">
            <h3 className="text-lg font-semibold mb-4 text-cyan-300">Universal Flow (All Users)</h3>
            <div className="bg-gradient-to-r from-cyan-600/10 to-blue-600/10 border border-cyan-500/30 rounded-xl p-6">
              <FlowPath
                steps={[
                  { name: "Splash Screen", reads: "App version", writes: "None" },
                  { name: "Language Selection", reads: "Available languages", writes: "Language preference (EN/FR/ES)" },
                  { name: "Onboarding: Purpose", reads: "None", writes: "User understanding flag" },
                  { name: "Onboarding: Intent", reads: "None", writes: "Intent (explore/create/contribute)" },
                  { name: "Onboarding: Accessibility", reads: "None", writes: "Accessibility preferences" },
                  { name: "Home / For You", reads: "Stories, user intent, language", writes: "None" }
                ]}
              />
            </div>
          </div>

          {/* Story Discovery & Reading Flow */}
          <div className="mb-8">
            <h3 className="text-lg font-semibold mb-4 text-purple-300">Story Discovery & Reading Flow</h3>
            <div className="bg-gradient-to-r from-purple-600/10 to-pink-600/10 border border-purple-500/30 rounded-xl p-6">
              <FlowPath
                steps={[
                  { name: "Home / Explore", reads: "Featured stories, categories", writes: "None" },
                  { name: "Story World Preview", reads: "Story metadata, chapters, audio", writes: "None" },
                  { name: "Chapter Screen", reads: "Chapter content, audio layers, progress", writes: "Progress snapshot (audio position, scroll)" },
                  { name: "Context Cards (optional)", reads: "Card metadata, multimedia", writes: "Card interaction tracking" },
                  { name: "Community Responses", reads: "Approved responses", writes: "Submit response → moderation queue" },
                  { name: "Chapter Index", reads: "All chapters in story", writes: "None" },
                  { name: "Next Chapter", reads: "Next chapter ID", writes: "Progress update" }
                ]}
              />
            </div>
          </div>

          {/* Creator Flow */}
          <div className="mb-8">
            <h3 className="text-lg font-semibold mb-4 text-yellow-300 flex items-center gap-2">
              <Crown className="w-5 h-5" />
              Creator Flow (Creators Only)
            </h3>
            <div className="bg-gradient-to-r from-yellow-600/10 to-orange-600/10 border border-yellow-500/30 rounded-xl p-6">
              <FlowPath
                steps={[
                  { name: "Creator Dashboard", reads: "User's stories, analytics", writes: "None" },
                  { name: "Create New Story", reads: "Templates, categories", writes: "Story metadata (title, description)" },
                  { name: "Visual Story Builder", reads: "Story structure, nodes", writes: "Chapters, branches, connections" },
                  { name: "Add Chapter Content", reads: "Existing content", writes: "Text, audio layers, images" },
                  { name: "Add Context Cards", reads: "Card templates", writes: "Card content, multimedia" },
                  { name: "Add Branches/Choices", reads: "Chapter structure", writes: "Branch logic, conditions" },
                  { name: "Preview Story", reads: "Complete story data", writes: "None" },
                  { name: "Publish Story", reads: "Story readiness", writes: "Publish status → community/institutional" }
                ]}
              />
            </div>
          </div>

          {/* Moderator Flow */}
          <div className="mb-8">
            <h3 className="text-lg font-semibold mb-4 text-red-300 flex items-center gap-2">
              <Shield className="w-5 h-5" />
              Moderator Flow (Moderators Only)
            </h3>
            <div className="bg-gradient-to-r from-red-600/10 to-pink-600/10 border border-red-500/30 rounded-xl p-6">
              <FlowPath
                steps={[
                  { name: "Moderation Panel", reads: "Pending responses, flagged content", writes: "None" },
                  { name: "Review Response", reads: "Response content, user info, context", writes: "None" },
                  { name: "Approve/Reject", reads: "Community guidelines", writes: "Status change, moderator notes, audit log" },
                  { name: "View Audit Trail", reads: "All moderation history", writes: "None" }
                ]}
              />
            </div>
          </div>

          {/* Institutional Admin Flow */}
          <div className="mb-8">
            <h3 className="text-lg font-semibold mb-4 text-green-300 flex items-center gap-2">
              <Building2 className="w-5 h-5" />
              Institutional Admin Flow (Admins Only)
            </h3>
            <div className="bg-gradient-to-r from-green-600/10 to-teal-600/10 border border-green-500/30 rounded-xl p-6">
              <FlowPath
                steps={[
                  { name: "Institutional Dashboard", reads: "Institution metadata, collections", writes: "None" },
                  { name: "Manage Collection", reads: "Collection stories", writes: "Add/remove stories, featured status" },
                  { name: "Review Contributor Submissions", reads: "Pending stories", writes: "Approve/reject" },
                  { name: "View Contributor Profiles", reads: "Contributor data", writes: "Permissions, roles" },
                  { name: "Assign Permissions", reads: "User roles", writes: "Update role (viewer → creator)" }
                ]}
              />
            </div>
          </div>
        </section>

        {/* Screen-to-Data Bindings */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-6">Screen-to-Data Bindings Reference</h2>
          <div className="space-y-4">
            <DataBindingRow
              screen="Language Selection"
              reads="Available languages (EN/FR/ES)"
              writes="User language preference → LocalStorage + Backend sync"
              notes="Persists across sessions; fallback to browser language"
            />
            <DataBindingRow
              screen="Onboarding: Intent"
              reads="None"
              writes="User intent (explore/create/contribute) → LocalStorage + Backend"
              notes="Affects content curation on Home screen"
            />
            <DataBindingRow
              screen="Home / For You"
              reads="Featured stories, user intent, language, progress"
              writes="None"
              notes="Filters stories by intent + language; shows continue watching"
            />
            <DataBindingRow
              screen="Story World Preview"
              reads="Story metadata, chapter list, audio layers, cover image"
              writes="None"
              notes="Fetches from /api/stories/:id"
            />
            <DataBindingRow
              screen="Chapter Screen"
              reads="Chapter content (text, audio, video), progress state"
              writes="Progress snapshot (audio position, scroll position, timestamp)"
              notes="Syncs progress every 30 seconds or on chapter exit"
            />
            <DataBindingRow
              screen="Context Cards"
              reads="Card metadata (type: music/film/fashion/cultural), multimedia"
              writes="Card interaction log (opened, time spent)"
              notes="Optional engagement tracking for creators"
            />
            <DataBindingRow
              screen="Community Responses"
              reads="Approved responses (filtered by language)"
              writes="Submit response (text/audio/image) → moderation queue"
              notes="All responses require human moderation before visibility"
            />
            <DataBindingRow
              screen="Creator Dashboard"
              reads="User's story list, draft status, analytics"
              writes="None (navigation only)"
              notes="Entry point to Visual Story Builder"
            />
            <DataBindingRow
              screen="Visual Story Builder"
              reads="Story structure (nodes, branches, media)"
              writes="Create/update chapters, branches, context cards, multimedia"
              notes="Drag-and-drop interface; auto-saves drafts"
            />
            <DataBindingRow
              screen="Moderation Panel"
              reads="Pending community responses, flagged content"
              writes="Approve/reject response, add moderator notes, audit log"
              notes="Role-based access; moderators + admins only"
            />
            <DataBindingRow
              screen="Institutional Dashboard"
              reads="Institutional collection metadata, contributor submissions"
              writes="Approve contributor stories, assign featured status"
              notes="Brock University + partner institutions"
            />
            <DataBindingRow
              screen="Library"
              reads="Saved stories, downloads, history, playlists"
              writes="Bookmark story, create playlist, download chapter"
              notes="Local-first storage with backend sync"
            />
            <DataBindingRow
              screen="Profile / Preferences"
              reads="User profile, language, intent, accessibility, stats"
              writes="Update profile, language, intent, accessibility settings"
              notes="Changes sync across all devices"
            />
          </div>
        </section>

        {/* Role-Based Access Control Matrix */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-6">Role-Based Access Control (RBAC) Matrix</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="border-b border-white/20">
                  <th className="text-left p-3 text-white/60">Screen/Feature</th>
                  <th className="text-center p-3 text-blue-400">Viewer</th>
                  <th className="text-center p-3 text-purple-400">Creator</th>
                  <th className="text-center p-3 text-red-400">Moderator</th>
                  <th className="text-center p-3 text-green-400">Inst. Admin</th>
                </tr>
              </thead>
              <tbody className="text-xs">
                <AccessRow screen="Splash → Onboarding" viewer={true} creator={true} moderator={true} admin={true} />
                <AccessRow screen="Home / For You" viewer={true} creator={true} moderator={true} admin={true} />
                <AccessRow screen="Explore" viewer={true} creator={true} moderator={true} admin={true} />
                <AccessRow screen="Library" viewer={true} creator={true} moderator={true} admin={true} />
                <AccessRow screen="Profile / Preferences" viewer={true} creator={true} moderator={true} admin={true} />
                <AccessRow screen="Story World Preview" viewer={true} creator={true} moderator={true} admin={true} />
                <AccessRow screen="Chapter Reading" viewer={true} creator={true} moderator={true} admin={true} />
                <AccessRow screen="Context Cards" viewer={true} creator={true} moderator={true} admin={true} />
                <AccessRow screen="Community Responses (Read)" viewer={true} creator={true} moderator={true} admin={true} />
                <AccessRow screen="Community Responses (Submit)" viewer={true} creator={true} moderator={true} admin={true} />
                <AccessRow screen="Creator Dashboard" viewer={false} creator={true} moderator={false} admin={false} />
                <AccessRow screen="Visual Story Builder" viewer={false} creator={true} moderator={false} admin={false} />
                <AccessRow screen="Creator Analytics" viewer={false} creator={true} moderator={false} admin={false} />
                <AccessRow screen="Moderation Panel" viewer={false} creator={false} moderator={true} admin={true} />
                <AccessRow screen="Approve/Reject Responses" viewer={false} creator={false} moderator={true} admin={true} />
                <AccessRow screen="Audit Trail" viewer={false} creator={false} moderator={true} admin={true} />
                <AccessRow screen="Institutional Dashboard" viewer={false} creator={false} moderator={false} admin={true} />
                <AccessRow screen="Manage Collections" viewer={false} creator={false} moderator={false} admin={true} />
                <AccessRow screen="Assign User Permissions" viewer={false} creator={false} moderator={false} admin={true} />
              </tbody>
            </table>
          </div>
        </section>

        {/* Navigation Implementation Notes */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-6">Implementation Notes</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <ImplementationNote
              title="Local-First Navigation"
              description="User preferences (language, intent, accessibility) stored locally first, synced to backend when authenticated"
            />
            <ImplementationNote
              title="Role-Based Routing"
              description="Navigation guards check user role before rendering screens; redirect to appropriate landing page"
            />
            <ImplementationNote
              title="Progress Persistence"
              description="Chapter progress auto-saved every 30 seconds; restored on app reopen"
            />
            <ImplementationNote
              title="Offline Support"
              description="Downloaded chapters accessible without network; sync when online"
            />
            <ImplementationNote
              title="Multilingual Routing"
              description="All content fetched based on selected language; fallback logic: ES → EN → FR"
            />
            <ImplementationNote
              title="Deep Linking"
              description="Support direct links to stories, chapters, and collections (mobile + web)"
            />
          </div>
        </section>

        {/* Footer */}
        <div className="pt-8 border-t border-white/10 text-center">
          <p className="text-xs text-white/40">
            SEEN Navigation Flow & Architecture v1.0 • Last Updated: February 2026
          </p>
        </div>
      </div>
    </div>
  );
}

// Helper Components

function RoleCard({ 
  icon, 
  name, 
  color, 
  permissions 
}: { 
  icon: React.ReactNode; 
  name: string; 
  color: string;
  permissions: string[];
}) {
  const colorClasses: Record<string, string> = {
    blue: "bg-blue-600/10 border-blue-500/30",
    purple: "bg-purple-600/10 border-purple-500/30",
    red: "bg-red-600/10 border-red-500/30",
    green: "bg-green-600/10 border-green-500/30"
  };

  const iconColors: Record<string, string> = {
    blue: "text-blue-400",
    purple: "text-purple-400",
    red: "text-red-400",
    green: "text-green-400"
  };

  return (
    <div className={`border rounded-xl p-5 ${colorClasses[color]}`}>
      <div className={`mb-3 ${iconColors[color]}`}>{icon}</div>
      <h3 className="text-base font-semibold text-white mb-3">{name}</h3>
      <ul className="space-y-2">
        {permissions.map((perm, index) => (
          <li key={index} className="text-xs text-white/70 flex items-start gap-2">
            <Check className="w-3 h-3 mt-0.5 text-white/50 flex-shrink-0" />
            <span>{perm}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

function NavigationTab({ 
  name, 
  access, 
  badge, 
  description 
}: { 
  name: string; 
  access: string;
  badge?: string;
  description: string;
}) {
  return (
    <div className="flex items-start justify-between gap-4 p-4 bg-white/5 border border-white/10 rounded-lg">
      <div className="flex-1">
        <div className="flex items-center gap-2 mb-1">
          <h4 className="text-base font-semibold text-white">{name}</h4>
          {badge && (
            <span className="px-2 py-0.5 bg-purple-600/20 border border-purple-500/30 rounded text-xs text-purple-300">
              {badge}
            </span>
          )}
        </div>
        <p className="text-xs text-white/60 mb-2">{description}</p>
        <p className="text-xs text-white/40">Access: {access}</p>
      </div>
      <ChevronRight className="w-5 h-5 text-white/30 flex-shrink-0" />
    </div>
  );
}

function FlowPath({ steps }: { steps: Array<{ name: string; reads: string; writes: string }> }) {
  return (
    <div className="space-y-3">
      {steps.map((step, index) => (
        <div key={index}>
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-full bg-white/10 border border-white/20 flex items-center justify-center flex-shrink-0 mt-1">
              <span className="text-xs font-semibold text-white">{index + 1}</span>
            </div>
            <div className="flex-1">
              <h4 className="text-sm font-semibold text-white mb-1">{step.name}</h4>
              <div className="text-xs text-white/60">
                <span className="text-green-400">Reads:</span> {step.reads}
              </div>
              <div className="text-xs text-white/60">
                <span className="text-blue-400">Writes:</span> {step.writes}
              </div>
            </div>
          </div>
          {index < steps.length - 1 && (
            <div className="ml-4 h-6 border-l-2 border-white/10" />
          )}
        </div>
      ))}
    </div>
  );
}

function DataBindingRow({ 
  screen, 
  reads, 
  writes, 
  notes 
}: { 
  screen: string; 
  reads: string; 
  writes: string;
  notes: string;
}) {
  return (
    <div className="bg-white/5 border border-white/10 rounded-lg p-4">
      <h4 className="text-sm font-semibold text-white mb-3">{screen}</h4>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3 text-xs">
        <div>
          <span className="text-green-400 font-semibold">Reads:</span>
          <p className="text-white/70 mt-1">{reads}</p>
        </div>
        <div>
          <span className="text-blue-400 font-semibold">Writes:</span>
          <p className="text-white/70 mt-1">{writes}</p>
        </div>
      </div>
      <div className="text-xs text-white/50 italic border-t border-white/10 pt-3">
        💡 {notes}
      </div>
    </div>
  );
}

function AccessRow({ 
  screen, 
  viewer, 
  creator, 
  moderator, 
  admin 
}: { 
  screen: string;
  viewer: boolean;
  creator: boolean;
  moderator: boolean;
  admin: boolean;
}) {
  return (
    <tr className="border-b border-white/5 hover:bg-white/5 transition-colors">
      <td className="p-3 text-white/80">{screen}</td>
      <td className="text-center p-3">
        {viewer ? <Check className="w-4 h-4 text-blue-400 mx-auto" /> : <Lock className="w-4 h-4 text-white/20 mx-auto" />}
      </td>
      <td className="text-center p-3">
        {creator ? <Check className="w-4 h-4 text-purple-400 mx-auto" /> : <Lock className="w-4 h-4 text-white/20 mx-auto" />}
      </td>
      <td className="text-center p-3">
        {moderator ? <Check className="w-4 h-4 text-red-400 mx-auto" /> : <Lock className="w-4 h-4 text-white/20 mx-auto" />}
      </td>
      <td className="text-center p-3">
        {admin ? <Check className="w-4 h-4 text-green-400 mx-auto" /> : <Lock className="w-4 h-4 text-white/20 mx-auto" />}
      </td>
    </tr>
  );
}

function ImplementationNote({ title, description }: { title: string; description: string }) {
  return (
    <div className="bg-white/5 border border-white/10 rounded-lg p-5">
      <h4 className="text-base font-semibold text-white mb-2">{title}</h4>
      <p className="text-sm text-white/70">{description}</p>
    </div>
  );
}
