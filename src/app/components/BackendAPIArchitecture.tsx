import { motion } from "motion/react";
import { Database, Lock, Cloud, GitBranch, Users, Shield, Zap } from "lucide-react";

/**
 * SEEN Backend API Architecture
 * 
 * Complete technical specification for backend API development including:
 * - RESTful API endpoints for all SEEN screens
 * - Database schema (PostgreSQL)
 * - Authentication & authorization (role-based access)
 * - File storage for multimedia (AWS S3 / Firebase Storage)
 * - Security, rate limiting, and audit trails
 * - Multilingual support (EN/FR/ES)
 * - CMF grant-compliant (no tracking/surveillance)
 */

export function BackendAPIArchitecture() {
  return (
    <div className="min-h-screen bg-black text-white p-8 overflow-auto">
      <div className="max-w-6xl mx-auto pb-20">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12"
        >
          <div className="flex items-center gap-3 mb-4">
            <Database className="w-8 h-8 text-purple-400" />
            <h1 className="text-3xl font-bold">SEEN Backend API Architecture</h1>
          </div>
          <p className="text-white/60 text-lg">
            Complete technical specification for scalable, secure, multilingual backend infrastructure
          </p>
          <div className="mt-4 inline-block px-4 py-2 bg-purple-600/20 border border-purple-500/30 rounded-lg">
            <span className="text-xs tracking-wider text-purple-300">CMF GRANT-COMPLIANT • PRIVACY-FIRST • NO TRACKING</span>
          </div>
        </motion.div>

        {/* Tech Stack */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
            <Zap className="w-6 h-6 text-blue-400" />
            Tech Stack Recommendation
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <TechStackCard
              layer="Backend Framework"
              tech="Node.js + Express / NestJS"
              notes="Fast, scalable REST/GraphQL support"
            />
            <TechStackCard
              layer="Database"
              tech="PostgreSQL"
              notes="Relational, multilingual support, ACID compliance"
            />
            <TechStackCard
              layer="File Storage"
              tech="AWS S3 / Firebase Storage"
              notes="Audio, video, images with CDN integration"
            />
            <TechStackCard
              layer="Authentication"
              tech="Firebase Auth / Auth0"
              notes="Email, social login, JWT token-based"
            />
            <TechStackCard
              layer="API Architecture"
              tech="REST + GraphQL (optional)"
              notes="REST for actions, GraphQL for complex queries"
            />
            <TechStackCard
              layer="Real-Time (Optional)"
              tech="WebSockets / Firebase"
              notes="Live community response updates"
            />
          </div>
        </section>

        {/* API Endpoints */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
            <GitBranch className="w-6 h-6 text-green-400" />
            Core API Endpoints (MVP)
          </h2>

          {/* User Management */}
          <EndpointCategory title="User Management" icon="👤">
            <Endpoint
              method="GET"
              path="/users/:id"
              purpose="Retrieve user profile"
              requestBody={null}
              responseBody={{
                id: "user-123",
                language: "en",
                intent: "explore",
                accessibility: {
                  reducedMotion: false,
                  highContrast: false,
                  audioDescriptions: true
                },
                createdAt: "2026-02-04T12:00:00Z"
              }}
              auth="JWT required"
              notes="Returns language preference, intent, accessibility settings"
            />
            <Endpoint
              method="POST"
              path="/users"
              purpose="Create user profile"
              requestBody={{
                language: "fr",
                intent: "create",
                accessibility: { reducedMotion: true }
              }}
              responseBody={{
                id: "user-456",
                language: "fr",
                intent: "create",
                createdAt: "2026-02-04T12:05:00Z"
              }}
              auth="Optional (anonymous allowed)"
              notes="Stores preferences locally-first, syncs when user creates account"
            />
            <Endpoint
              method="PUT"
              path="/users/:id"
              purpose="Update user profile"
              requestBody={{
                language: "es",
                accessibility: { highContrast: true }
              }}
              responseBody={{
                id: "user-123",
                language: "es",
                accessibility: { highContrast: true },
                updatedAt: "2026-02-04T12:10:00Z"
              }}
              auth="JWT required"
              notes="Partial updates allowed"
            />
          </EndpointCategory>

          {/* Story Content */}
          <EndpointCategory title="Story Content" icon="📖">
            <Endpoint
              method="GET"
              path="/stories"
              purpose="Fetch list of Story Worlds"
              requestBody={null}
              responseBody={{
                stories: [
                  {
                    id: "midnight-resonance",
                    title: { en: "Midnight Resonance", fr: "Résonance de Minuit", es: "Resonancia de Medianoche" },
                    category: "CREOVA Music",
                    featured: true,
                    coverImage: "https://cdn.seen.ca/stories/midnight-resonance/cover.jpg"
                  }
                ]
              }}
              auth="Public (no auth)"
              notes="Filtered by language preference; returns multilingual title object"
            />
            <Endpoint
              method="GET"
              path="/stories/:id"
              purpose="Fetch single Story World metadata"
              requestBody={null}
              responseBody={{
                id: "midnight-resonance",
                title: { en: "Midnight Resonance", fr: "Résonance de Minuit" },
                description: { en: "A journey through sound...", fr: "Un voyage à travers le son..." },
                chapters: ["chapter-01", "chapter-02"],
                audioLayers: ["ambient", "narration", "music"],
                contextCards: 12,
                totalDuration: 1800
              }}
              auth="Public (no auth)"
              notes="Includes chapter list, audio layers, context card count"
            />
            <Endpoint
              method="GET"
              path="/stories/:storyId/chapters/:chapterId"
              purpose="Fetch Chapter content"
              requestBody={null}
              responseBody={{
                id: "chapter-01",
                storyId: "midnight-resonance",
                title: { en: "The Opening", fr: "L'Ouverture" },
                content: { en: "Full text content...", fr: "Contenu textuel complet..." },
                audioLayers: {
                  ambient: "https://cdn.seen.ca/audio/ambient-01.mp3",
                  narration: "https://cdn.seen.ca/audio/narration-01.mp3",
                  music: "https://cdn.seen.ca/audio/music-01.mp3"
                },
                contextCards: [
                  { id: "card-01", type: "music", title: { en: "About the Score" } }
                ],
                nextChapter: "chapter-02"
              }}
              auth="Public (no auth)"
              notes="Full chapter text, audio URLs, context cards, navigation"
            />
          </EndpointCategory>

          {/* Progress Tracking */}
          <EndpointCategory title="Progress Tracking" icon="📊">
            <Endpoint
              method="POST"
              path="/stories/:storyId/chapters/:chapterId/progress"
              purpose="Save user progress snapshot"
              requestBody={{
                userId: "user-123",
                audioPosition: 145.5,
                scrollPosition: 0.42,
                branchState: { choice: "path-a" },
                timestamp: "2026-02-04T12:30:00Z"
              }}
              responseBody={{
                success: true,
                progressId: "progress-789"
              }}
              auth="JWT required"
              notes="Stores chapter position, audio timestamp, branch choices"
            />
            <Endpoint
              method="GET"
              path="/stories/:storyId/progress"
              purpose="Retrieve user's story progress"
              requestBody={null}
              responseBody={{
                userId: "user-123",
                storyId: "midnight-resonance",
                currentChapter: "chapter-02",
                lastVisited: "2026-02-04T12:30:00Z",
                completedChapters: ["chapter-01"],
                totalTimeSpent: 3600
              }}
              auth="JWT required"
              notes="Returns last chapter, completion status, time spent"
            />
          </EndpointCategory>

          {/* Community Responses */}
          <EndpointCategory title="Community Responses" icon="💬">
            <Endpoint
              method="GET"
              path="/stories/:storyId/chapters/:chapterId/responses"
              purpose="Fetch community responses"
              requestBody={null}
              responseBody={{
                responses: [
                  {
                    id: "response-001",
                    userId: "user-456",
                    type: "text",
                    content: { en: "This resonated deeply...", fr: "Cela a profondément résonné..." },
                    language: "en",
                    status: "approved",
                    createdAt: "2026-02-04T10:00:00Z"
                  }
                ]
              }}
              auth="Public (no auth)"
              notes="Only returns approved responses; filtered by language"
            />
            <Endpoint
              method="POST"
              path="/stories/:storyId/chapters/:chapterId/responses"
              purpose="Submit community response"
              requestBody={{
                userId: "user-123",
                type: "text",
                content: "My personal reflection...",
                language: "fr",
                mediaUrl: null
              }}
              responseBody={{
                id: "response-002",
                status: "pending",
                message: "Response submitted for human review"
              }}
              auth="JWT required"
              notes="All responses require human moderation before approval"
            />
          </EndpointCategory>

          {/* Moderation */}
          <EndpointCategory title="Moderation Queue" icon="🛡️">
            <Endpoint
              method="GET"
              path="/moderation/responses"
              purpose="Fetch pending responses for review"
              requestBody={null}
              responseBody={{
                pending: [
                  {
                    id: "response-002",
                    userId: "user-123",
                    content: "My personal reflection...",
                    language: "fr",
                    submittedAt: "2026-02-04T12:45:00Z"
                  }
                ]
              }}
              auth="JWT required (moderator role)"
              notes="Only accessible to users with moderator/admin role"
            />
            <Endpoint
              method="PUT"
              path="/moderation/responses/:responseId"
              purpose="Approve or reject response"
              requestBody={{
                status: "approved",
                moderatorId: "moderator-001",
                notes: "Appropriate content, aligns with community guidelines"
              }}
              responseBody={{
                id: "response-002",
                status: "approved",
                moderatedAt: "2026-02-04T12:50:00Z",
                moderatedBy: "moderator-001"
              }}
              auth="JWT required (moderator role)"
              notes="Creates audit trail for all moderation actions"
            />
          </EndpointCategory>

          {/* Institutional Collections */}
          <EndpointCategory title="Institutional Collections" icon="🏛️">
            <Endpoint
              method="GET"
              path="/institutions/:id/collections"
              purpose="Fetch institutional curated content"
              requestBody={null}
              responseBody={{
                institutionId: "brock-university",
                name: { en: "Brock University", fr: "Université Brock" },
                collections: [
                  {
                    id: "canadian-voices",
                    title: { en: "Canadian Voices", fr: "Voix Canadiennes" },
                    stories: ["story-01", "story-02"],
                    curated: true
                  }
                ]
              }}
              auth="Public (no auth)"
              notes="Brock University and partner collections"
            />
          </EndpointCategory>

          {/* Creator Tools */}
          <EndpointCategory title="Creator Tools" icon="✨">
            <Endpoint
              method="POST"
              path="/creator/stories"
              purpose="Create new Story World"
              requestBody={{
                creatorId: "user-789",
                title: { en: "New Story", fr: "Nouvelle Histoire" },
                description: { en: "A new journey...", fr: "Un nouveau voyage..." },
                category: "Community Archive"
              }}
              responseBody={{
                id: "story-new-001",
                status: "draft",
                createdAt: "2026-02-04T13:00:00Z"
              }}
              auth="JWT required (creator role)"
              notes="Creates draft story; requires review before publishing"
            />
            <Endpoint
              method="PUT"
              path="/creator/stories/:storyId/chapters/:chapterId"
              purpose="Update chapter content"
              requestBody={{
                content: { en: "Updated text...", fr: "Texte mis à jour..." },
                audioLayers: {
                  narration: "https://cdn.seen.ca/audio/narration-updated.mp3"
                }
              }}
              responseBody={{
                id: "chapter-01",
                status: "updated",
                updatedAt: "2026-02-04T13:05:00Z"
              }}
              auth="JWT required (creator role)"
              notes="Version control for all edits; maintains audit trail"
            />
          </EndpointCategory>
        </section>

        {/* Database Schema */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
            <Database className="w-6 h-6 text-purple-400" />
            Database Schema (PostgreSQL)
          </h2>
          <div className="space-y-6">
            <DatabaseTable
              name="users"
              columns={[
                { name: "id", type: "UUID", primary: true, notes: "Primary key" },
                { name: "email", type: "VARCHAR(255)", primary: false, notes: "Unique, nullable (anonymous users)" },
                { name: "language", type: "VARCHAR(2)", primary: false, notes: "en, fr, es" },
                { name: "intent", type: "VARCHAR(20)", primary: false, notes: "explore, create, contribute" },
                { name: "accessibility", type: "JSONB", primary: false, notes: "Accessibility preferences object" },
                { name: "role", type: "VARCHAR(20)", primary: false, notes: "viewer, creator, moderator, admin" },
                { name: "created_at", type: "TIMESTAMP", primary: false, notes: "Account creation" },
                { name: "updated_at", type: "TIMESTAMP", primary: false, notes: "Last profile update" }
              ]}
            />
            <DatabaseTable
              name="stories"
              columns={[
                { name: "id", type: "UUID", primary: true, notes: "Primary key" },
                { name: "creator_id", type: "UUID", primary: false, notes: "Foreign key → users.id" },
                { name: "title_en", type: "TEXT", primary: false, notes: "English title" },
                { name: "title_fr", type: "TEXT", primary: false, notes: "French title" },
                { name: "title_es", type: "TEXT", primary: false, notes: "Spanish title (optional)" },
                { name: "description_en", type: "TEXT", primary: false, notes: "English description" },
                { name: "description_fr", type: "TEXT", primary: false, notes: "French description" },
                { name: "category", type: "VARCHAR(50)", primary: false, notes: "CREOVA Music, Story World, etc." },
                { name: "featured", type: "BOOLEAN", primary: false, notes: "Featured on homepage" },
                { name: "status", type: "VARCHAR(20)", primary: false, notes: "draft, published, archived" },
                { name: "cover_image_url", type: "TEXT", primary: false, notes: "S3 URL" },
                { name: "created_at", type: "TIMESTAMP", primary: false, notes: "Creation timestamp" }
              ]}
            />
            <DatabaseTable
              name="chapters"
              columns={[
                { name: "id", type: "UUID", primary: true, notes: "Primary key" },
                { name: "story_id", type: "UUID", primary: false, notes: "Foreign key → stories.id" },
                { name: "chapter_number", type: "INTEGER", primary: false, notes: "Sequential order" },
                { name: "title_en", type: "TEXT", primary: false, notes: "English title" },
                { name: "title_fr", type: "TEXT", primary: false, notes: "French title" },
                { name: "content_en", type: "TEXT", primary: false, notes: "Full English text" },
                { name: "content_fr", type: "TEXT", primary: false, notes: "Full French text" },
                { name: "audio_ambient", type: "TEXT", primary: false, notes: "S3 URL for ambient layer" },
                { name: "audio_narration", type: "TEXT", primary: false, notes: "S3 URL for narration layer" },
                { name: "audio_music", type: "TEXT", primary: false, notes: "S3 URL for music layer" },
                { name: "duration", type: "INTEGER", primary: false, notes: "Total duration in seconds" },
                { name: "created_at", type: "TIMESTAMP", primary: false, notes: "Creation timestamp" }
              ]}
            />
            <DatabaseTable
              name="user_progress"
              columns={[
                { name: "id", type: "UUID", primary: true, notes: "Primary key" },
                { name: "user_id", type: "UUID", primary: false, notes: "Foreign key → users.id" },
                { name: "story_id", type: "UUID", primary: false, notes: "Foreign key → stories.id" },
                { name: "chapter_id", type: "UUID", primary: false, notes: "Foreign key → chapters.id" },
                { name: "audio_position", type: "FLOAT", primary: false, notes: "Current audio timestamp (seconds)" },
                { name: "scroll_position", type: "FLOAT", primary: false, notes: "Scroll percentage (0-1)" },
                { name: "branch_state", type: "JSONB", primary: false, notes: "User choices/branches" },
                { name: "last_visited", type: "TIMESTAMP", primary: false, notes: "Last access time" }
              ]}
            />
            <DatabaseTable
              name="community_responses"
              columns={[
                { name: "id", type: "UUID", primary: true, notes: "Primary key" },
                { name: "user_id", type: "UUID", primary: false, notes: "Foreign key → users.id" },
                { name: "story_id", type: "UUID", primary: false, notes: "Foreign key → stories.id" },
                { name: "chapter_id", type: "UUID", primary: false, notes: "Foreign key → chapters.id" },
                { name: "type", type: "VARCHAR(20)", primary: false, notes: "text, audio, image" },
                { name: "content", type: "TEXT", primary: false, notes: "Text content or description" },
                { name: "media_url", type: "TEXT", primary: false, notes: "S3 URL for audio/image" },
                { name: "language", type: "VARCHAR(2)", primary: false, notes: "en, fr, es" },
                { name: "status", type: "VARCHAR(20)", primary: false, notes: "pending, approved, rejected, flagged" },
                { name: "moderated_by", type: "UUID", primary: false, notes: "Foreign key → users.id (moderator)" },
                { name: "moderated_at", type: "TIMESTAMP", primary: false, notes: "Moderation timestamp" },
                { name: "created_at", type: "TIMESTAMP", primary: false, notes: "Submission timestamp" }
              ]}
            />
            <DatabaseTable
              name="institutions"
              columns={[
                { name: "id", type: "UUID", primary: true, notes: "Primary key" },
                { name: "name_en", type: "TEXT", primary: false, notes: "English name" },
                { name: "name_fr", type: "TEXT", primary: false, notes: "French name" },
                { name: "type", type: "VARCHAR(50)", primary: false, notes: "university, archive, museum" },
                { name: "logo_url", type: "TEXT", primary: false, notes: "S3 URL for logo" },
                { name: "created_at", type: "TIMESTAMP", primary: false, notes: "Creation timestamp" }
              ]}
            />
          </div>
        </section>

        {/* Security & Governance */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
            <Shield className="w-6 h-6 text-red-400" />
            Security & Governance
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <SecurityCard
              title="JWT Authentication"
              description="Token-based auth with 24-hour expiry; refresh tokens stored securely"
              critical={true}
            />
            <SecurityCard
              title="Role-Based Access Control (RBAC)"
              description="viewer, creator, moderator, admin roles with granular permissions"
              critical={true}
            />
            <SecurityCard
              title="Rate Limiting"
              description="100 requests/minute per user; 1000/minute per IP"
              critical={false}
            />
            <SecurityCard
              title="Audit Trails"
              description="All moderation actions, content edits, and deletions logged with timestamps"
              critical={true}
            />
            <SecurityCard
              title="Multilingual Support"
              description="All text fields stored as EN/FR/ES objects; fallback logic handled server-side"
              critical={false}
            />
            <SecurityCard
              title="CMF Grant Compliance"
              description="NO behavioral tracking, surveillance analytics, or user profiling; privacy-first"
              critical={true}
            />
          </div>
        </section>

        {/* API Integration Notes */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
            <Cloud className="w-6 h-6 text-cyan-400" />
            Integration Notes for Frontend
          </h2>
          <div className="bg-white/5 border border-white/10 rounded-lg p-6 space-y-4">
            <IntegrationNote
              title="Local-First Architecture"
              description="User preferences and progress stored locally first; sync to backend when authenticated"
            />
            <IntegrationNote
              title="Offline Support"
              description="Cache chapter content, audio files, and images for offline playback using Service Workers"
            />
            <IntegrationNote
              title="Language Fallback"
              description="If requested language unavailable, fallback: ES → EN → FR → first available"
            />
            <IntegrationNote
              title="Audio Streaming"
              description="Use HLS (HTTP Live Streaming) for chunked audio delivery; supports scrubbing and buffering"
            />
            <IntegrationNote
              title="Error Handling"
              description="All API errors return { error: true, message: 'Description', code: 'ERROR_CODE' }"
            />
            <IntegrationNote
              title="Pagination"
              description="List endpoints support ?page=1&limit=20 for pagination; max limit: 100"
            />
          </div>
        </section>

        {/* Footer */}
        <div className="pt-8 border-t border-white/10 text-center">
          <p className="text-xs text-white/40">
            SEEN Backend API Architecture v1.0 • Last Updated: February 2026
          </p>
        </div>
      </div>
    </div>
  );
}

// Helper Components

function TechStackCard({ layer, tech, notes }: { layer: string; tech: string; notes: string }) {
  return (
    <div className="bg-white/5 border border-white/10 rounded-lg p-4">
      <div className="text-xs tracking-wider uppercase text-white/40 mb-2">{layer}</div>
      <div className="text-base font-semibold text-white mb-1">{tech}</div>
      <div className="text-sm text-white/60">{notes}</div>
    </div>
  );
}

function EndpointCategory({ title, icon, children }: { title: string; icon: string; children: React.ReactNode }) {
  return (
    <div className="mb-8">
      <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
        <span>{icon}</span>
        {title}
      </h3>
      <div className="space-y-6">
        {children}
      </div>
    </div>
  );
}

function Endpoint({
  method,
  path,
  purpose,
  requestBody,
  responseBody,
  auth,
  notes
}: {
  method: string;
  path: string;
  purpose: string;
  requestBody: any;
  responseBody: any;
  auth: string;
  notes: string;
}) {
  const methodColors: Record<string, string> = {
    GET: "bg-green-600/20 text-green-400 border-green-500/30",
    POST: "bg-blue-600/20 text-blue-400 border-blue-500/30",
    PUT: "bg-yellow-600/20 text-yellow-400 border-yellow-500/30",
    DELETE: "bg-red-600/20 text-red-400 border-red-500/30"
  };

  return (
    <div className="bg-white/5 border border-white/10 rounded-lg p-5">
      <div className="flex items-start gap-3 mb-3">
        <span className={`px-3 py-1 rounded text-xs font-mono border ${methodColors[method]}`}>
          {method}
        </span>
        <div className="flex-1">
          <code className="text-sm text-purple-300 font-mono">{path}</code>
          <p className="text-sm text-white/70 mt-1">{purpose}</p>
        </div>
      </div>

      {requestBody && (
        <div className="mb-3">
          <div className="text-xs tracking-wider uppercase text-white/40 mb-2">Request Body</div>
          <pre className="bg-black/40 border border-white/10 rounded p-3 text-xs text-green-300 overflow-x-auto">
            {JSON.stringify(requestBody, null, 2)}
          </pre>
        </div>
      )}

      <div className="mb-3">
        <div className="text-xs tracking-wider uppercase text-white/40 mb-2">Response Body</div>
        <pre className="bg-black/40 border border-white/10 rounded p-3 text-xs text-cyan-300 overflow-x-auto">
          {JSON.stringify(responseBody, null, 2)}
        </pre>
      </div>

      <div className="flex items-start gap-4 text-xs">
        <div>
          <span className="text-white/40">Auth:</span>{" "}
          <span className="text-white/80">{auth}</span>
        </div>
        <div className="flex-1">
          <span className="text-white/40">Notes:</span>{" "}
          <span className="text-white/80">{notes}</span>
        </div>
      </div>
    </div>
  );
}

function DatabaseTable({ name, columns }: { name: string; columns: Array<{ name: string; type: string; primary: boolean; notes: string }> }) {
  return (
    <div className="bg-white/5 border border-white/10 rounded-lg overflow-hidden">
      <div className="bg-purple-600/20 border-b border-white/10 px-4 py-3">
        <code className="text-base font-mono text-purple-300">{name}</code>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-white/10 bg-white/5">
              <th className="text-left px-4 py-2 text-xs tracking-wider uppercase text-white/40">Column</th>
              <th className="text-left px-4 py-2 text-xs tracking-wider uppercase text-white/40">Type</th>
              <th className="text-left px-4 py-2 text-xs tracking-wider uppercase text-white/40">Primary</th>
              <th className="text-left px-4 py-2 text-xs tracking-wider uppercase text-white/40">Notes</th>
            </tr>
          </thead>
          <tbody>
            {columns.map((col, index) => (
              <tr key={index} className="border-b border-white/5">
                <td className="px-4 py-2 font-mono text-white/90">{col.name}</td>
                <td className="px-4 py-2 font-mono text-cyan-400">{col.type}</td>
                <td className="px-4 py-2">{col.primary ? "✓" : ""}</td>
                <td className="px-4 py-2 text-white/60">{col.notes}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function SecurityCard({ title, description, critical }: { title: string; description: string; critical: boolean }) {
  return (
    <div className={`border rounded-lg p-4 ${critical ? "bg-red-600/10 border-red-500/30" : "bg-white/5 border-white/10"}`}>
      <div className="flex items-start justify-between mb-2">
        <h4 className="text-base font-semibold text-white">{title}</h4>
        {critical && (
          <span className="px-2 py-1 bg-red-600/20 border border-red-500/30 rounded text-xs text-red-400">
            CRITICAL
          </span>
        )}
      </div>
      <p className="text-sm text-white/70">{description}</p>
    </div>
  );
}

function IntegrationNote({ title, description }: { title: string; description: string }) {
  return (
    <div>
      <h4 className="text-base font-semibold text-white mb-1">{title}</h4>
      <p className="text-sm text-white/70">{description}</p>
    </div>
  );
}
