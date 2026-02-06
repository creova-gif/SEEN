import { 
  Database, 
  Smartphone, 
  Map,
  FileCode,
  Users,
  Palette
} from "lucide-react";

/**
 * SEEN by CREOVA
 * Master Figma AI Prompt Stack & Technical Implementation Guide
 * 
 * Complete developer-ready documentation for building SEEN across all platforms
 * with full backend/frontend specifications, role-based access, and CMF compliance.
 * 
 * Last Updated: February 2026
 */

export function MasterPromptStack() {
  return (
    <div className="min-h-screen bg-black text-white overflow-auto">
      <div className="max-w-7xl mx-auto p-8 pb-32">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-16"
        >
          <div className="flex items-center gap-3 mb-4">
            <Layers className="w-10 h-10 text-cyan-400" />
            <h1 className="text-4xl font-bold">SEEN Master Documentation</h1>
          </div>
          <p className="text-xl text-white/70 mb-6">
            Complete Figma AI Prompt Stack & Technical Implementation Guide
          </p>
          <div className="flex flex-wrap gap-3">
            <Badge icon={<Database />} label="Backend Ready" color="green" />
            <Badge icon={<Smartphone />} label="Multi-Platform" color="blue" />
            <Badge icon={<Shield />} label="CMF Grant-Safe" color="purple" />
            <Badge icon={<Users />} label="Role-Based Access" color="orange" />
          </div>
        </motion.div>

        {/* Global Context */}
        <section className="mb-16">
          <SectionTitle icon={<FileCode />} title="Global Context" />
          <div className="bg-gradient-to-br from-cyan-600/10 to-blue-600/10 border border-cyan-500/30 rounded-xl p-8">
            <h3 className="text-lg font-semibold text-cyan-300 mb-4">Platform Overview</h3>
            <div className="space-y-3 text-white/80 text-sm leading-relaxed">
              <p>
                <strong className="text-white">SEEN</strong> is a cinematic, mobile-first, interactive storytelling platform by CREOVA.
              </p>
              <p>
                <strong className="text-cyan-300">Platforms:</strong> Web, iOS, Android
              </p>
              <p>
                <strong className="text-cyan-300">Languages:</strong> English (EN), French (FR), Spanish (ES)
              </p>
              <p>
                <strong className="text-cyan-300">Accessibility:</strong> WCAG compliant - captions, high contrast, reduced motion
              </p>
              <p>
                <strong className="text-cyan-300">Design Inspiration:</strong> Apple Music, Spotify Editorial, Netflix, A24
              </p>
              <p>
                <strong className="text-cyan-300">User Roles:</strong> Viewer, Creator, Moderator, Institutional Admin
              </p>
            </div>
          </div>
        </section>

        {/* Phase 1: Backend MVP */}
        <section className="mb-16">
          <PhaseHeader 
            phase={1} 
            title="Backend MVP" 
            description="API Architecture & Database Design"
            icon={<Database />}
            color="green"
          />
          
          <div className="space-y-6">
            {/* What to Build */}
            <ContentBlock title="What to Build">
              <ul className="space-y-2 text-white/70 text-sm">
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-green-400 mt-0.5 flex-shrink-0" />
                  <span><strong>User Profiles & Auth:</strong> Login, signup, JWT authentication, multi-language selection, accessibility preferences</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-green-400 mt-0.5 flex-shrink-0" />
                  <span><strong>Story World & Chapter APIs:</strong> List stories, fetch metadata, chapters, multimedia links (audio/video/images)</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-green-400 mt-0.5 flex-shrink-0" />
                  <span><strong>Progress Save/Load:</strong> Track chapter position, audio/video timestamp, last visited, branch state</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-green-400 mt-0.5 flex-shrink-0" />
                  <span><strong>Community Responses:</strong> Submission panel, moderation queue, approval/rejection workflow</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-green-400 mt-0.5 flex-shrink-0" />
                  <span><strong>Multilingual Text Support:</strong> EN/FR/ES content fields with fallback logic</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-green-400 mt-0.5 flex-shrink-0" />
                  <span><strong>Audit Trails:</strong> Log all moderation actions, user permissions, and content changes</span>
                </li>
              </ul>
            </ContentBlock>

            {/* Figma AI Prompt */}
            <PromptBlock 
              phase="Phase 1"
              color="green"
              prompt="Design backend API visual documentation for SEEN. Include REST/GraphQL endpoints for users, stories, chapters, progress, community responses, moderation, and multilingual fields. Show exact screen-to-data bindings (read/write/store) for each endpoint. Include role-based access (Viewer, Creator, Moderator, Institutional Admin), JWT authentication, audit trails, and server/client interactions. Make diagrams developer-friendly, CMF grant-safe, and visually clear."
            />

            {/* Technical Specifications */}
            <TechnicalSpecs
              title="Backend Technical Stack"
              specs={[
                { label: "Database", value: "PostgreSQL with JSON fields for multilingual content" },
                { label: "Authentication", value: "JWT tokens with refresh mechanism" },
                { label: "API Style", value: "RESTful with optional GraphQL layer" },
                { label: "File Storage", value: "AWS S3 or equivalent for multimedia assets" },
                { label: "Caching", value: "Redis for session and progress state" },
                { label: "Security", value: "Row-level security (RLS), RBAC policies" }
              ]}
            />

            {/* Key Endpoints */}
            <EndpointTable
              endpoints={[
                { method: "POST", path: "/api/auth/login", description: "User authentication" },
                { method: "POST", path: "/api/auth/register", description: "New user signup" },
                { method: "GET", path: "/api/stories", description: "List all story worlds (filtered by language)" },
                { method: "GET", path: "/api/stories/:id", description: "Fetch story metadata + chapters" },
                { method: "GET", path: "/api/chapters/:id", description: "Get chapter content + audio layers" },
                { method: "POST", path: "/api/progress/save", description: "Save user progress (chapter + timestamp)" },
                { method: "GET", path: "/api/progress/load", description: "Load user progress for story" },
                { method: "POST", path: "/api/responses/submit", description: "Submit community response (moderation queue)" },
                { method: "GET", path: "/api/responses/approved", description: "Fetch approved responses for chapter" },
                { method: "POST", path: "/api/moderation/review", description: "Approve/reject response (Moderator only)" },
                { method: "GET", path: "/api/moderation/audit", description: "View audit trail (Admin only)" }
              ]}
            />
          </div>
        </section>

        {/* Phase 2: Frontend MVP (Web) */}
        <section className="mb-16">
          <PhaseHeader 
            phase={2} 
            title="Frontend MVP (Web)" 
            description="Core User Experience Screens"
            icon={<Layers />}
            color="blue"
          />
          
          <div className="space-y-6">
            {/* What to Build */}
            <ContentBlock title="Screens to Generate">
              <ul className="space-y-2 text-white/70 text-sm">
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-blue-400 mt-0.5 flex-shrink-0" />
                  <span><strong>Home / Discover:</strong> Featured stories, personalized by user intent (explore/create/contribute)</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-blue-400 mt-0.5 flex-shrink-0" />
                  <span><strong>Story World List & Entry:</strong> Browse stories with preview, metadata, chapter count</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-blue-400 mt-0.5 flex-shrink-0" />
                  <span><strong>Chapter Node:</strong> Immersive reading with audio/video playback + synchronized captions</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-blue-400 mt-0.5 flex-shrink-0" />
                  <span><strong>Chapter Navigation:</strong> Index of all chapters, progress bar, chapter switching</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-blue-400 mt-0.5 flex-shrink-0" />
                  <span><strong>Community Response Panel:</strong> Submit text/audio/image responses, view approved responses</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-blue-400 mt-0.5 flex-shrink-0" />
                  <span><strong>Profile / Preferences:</strong> Language, accessibility, saved stories, intent selection</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-blue-400 mt-0.5 flex-shrink-0" />
                  <span><strong>Accessibility Overlays:</strong> Captions toggle, contrast adjustment, reduced motion</span>
                </li>
              </ul>
            </ContentBlock>

            {/* Figma AI Prompt */}
            <PromptBlock 
              phase="Phase 2"
              color="blue"
              prompt="Design Web frontend screens for SEEN. Include Home/Discover, Story World List & Entry, Chapter Node with multiple audio/video layers, captions, and Chapter Navigation with progress tracking. Add Community Response Panel per chapter and Profile/Preferences with accessibility toggles. Map all screens to backend API endpoints (user profile, story metadata, chapter content, progress save/load, community responses). Show multilingual support (EN/FR/ES) and role-based UI elements."
            />

            {/* Technical Specifications */}
            <TechnicalSpecs
              title="Frontend Technical Stack"
              specs={[
                { label: "Framework", value: "React 18+ with TypeScript" },
                { label: "Styling", value: "Tailwind CSS v4" },
                { label: "Animation", value: "Motion (Framer Motion)" },
                { label: "State Management", value: "React Context + Local Storage" },
                { label: "Audio/Video", value: "HTML5 Audio/Video APIs with HLS.js for streaming" },
                { label: "Accessibility", value: "ARIA labels, keyboard navigation, screen reader support" }
              ]}
            />

            {/* Screen-to-API Mapping */}
            <ScreenAPITable
              mappings={[
                { screen: "Home / Discover", reads: "GET /api/stories (featured)", writes: "None", notes: "Filtered by language + intent" },
                { screen: "Story World Preview", reads: "GET /api/stories/:id", writes: "None", notes: "Metadata, chapters, audio preview" },
                { screen: "Chapter Node", reads: "GET /api/chapters/:id, GET /api/progress/load", writes: "POST /api/progress/save", notes: "Auto-save every 30s" },
                { screen: "Community Responses", reads: "GET /api/responses/approved", writes: "POST /api/responses/submit", notes: "Submit to moderation queue" },
                { screen: "Profile", reads: "GET /api/user/profile", writes: "PUT /api/user/preferences", notes: "Language, intent, accessibility" }
              ]}
            />
          </div>
        </section>

        {/* Phase 3: React Native Mobile */}
        <section className="mb-16">
          <PhaseHeader 
            phase={3} 
            title="React Native Mobile" 
            description="iOS & Android Native Apps"
            icon={<Smartphone />}
            color="purple"
          />
          
          <div className="space-y-6">
            {/* What to Build */}
            <ContentBlock title="Mobile Features & Optimizations">
              <ul className="space-y-2 text-white/70 text-sm">
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-purple-400 mt-0.5 flex-shrink-0" />
                  <span><strong>Responsive Layouts:</strong> Port all Web screens to mobile-first iOS & Android designs</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-purple-400 mt-0.5 flex-shrink-0" />
                  <span><strong>Offline Caching:</strong> Download stories, chapters, and multimedia for offline access</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-purple-400 mt-0.5 flex-shrink-0" />
                  <span><strong>Audio/Video Streaming:</strong> Multiple layers (ambient, narration, music) with smooth fade-ins/outs</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-purple-400 mt-0.5 flex-shrink-0" />
                  <span><strong>Background Playback:</strong> Continue audio when app is backgrounded (iOS/Android)</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-purple-400 mt-0.5 flex-shrink-0" />
                  <span><strong>Progress Sync:</strong> Real-time sync between devices using backend API</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-purple-400 mt-0.5 flex-shrink-0" />
                  <span><strong>Role-Specific Overlays:</strong> Creator Dashboard, Moderation Panel, Institutional Collections</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-purple-400 mt-0.5 flex-shrink-0" />
                  <span><strong>Native Features:</strong> Push notifications, deep linking, biometric auth</span>
                </li>
              </ul>
            </ContentBlock>

            {/* Figma AI Prompt */}
            <PromptBlock 
              phase="Phase 3"
              color="purple"
              prompt="Convert SEEN Web screens to mobile-friendly layouts for iOS and Android using React Native. Include offline caching for stories, chapters, and multimedia. Design audio/video streaming with multiple layers (ambient, narration, music), fade-in/out transitions, and captions. Map Chapter progress to backend sync. Include Creator Dashboard, Moderation Panel, and Institutional Collection overlays. Ensure all screens are multilingual (EN/FR/ES), accessible, and CMF grant-safe."
            />

            {/* Technical Specifications */}
            <TechnicalSpecs
              title="React Native Technical Stack"
              specs={[
                { label: "Framework", value: "React Native 0.72+ with Expo" },
                { label: "Navigation", value: "React Navigation v6" },
                { label: "Audio/Video", value: "react-native-video, react-native-track-player" },
                { label: "Offline Storage", value: "AsyncStorage + SQLite for metadata" },
                { label: "File Downloads", value: "react-native-fs for chapter caching" },
                { label: "Push Notifications", value: "Expo Notifications (cross-platform)" },
                { label: "Deep Linking", value: "Universal Links (iOS), App Links (Android)" }
              ]}
            />

            {/* Mobile-Specific Considerations */}
            <ContentBlock title="Mobile Performance Optimizations">
              <div className="space-y-3 text-sm text-white/70">
                <p><strong className="text-purple-300">Audio Layers:</strong> Preload ambient layer on chapter load, lazy-load narration/music on demand</p>
                <p><strong className="text-purple-300">Video Streaming:</strong> Use adaptive bitrate streaming (HLS) with quality selection based on network</p>
                <p><strong className="text-purple-300">Offline Mode:</strong> Download chapters in background, show download progress, manage storage limits</p>
                <p><strong className="text-purple-300">Battery Optimization:</strong> Reduce animation frame rate when battery is low, pause background tasks</p>
                <p><strong className="text-purple-300">Network Handling:</strong> Detect connectivity changes, queue uploads when offline, sync when reconnected</p>
              </div>
            </ContentBlock>
          </div>
        </section>

        {/* Phase 4: Institutional & Advanced Features */}
        <section className="mb-16">
          <PhaseHeader 
            phase={4} 
            title="Institutional & Advanced Features" 
            description="Creator Tools, Moderation, and Partnerships"
            icon={<Users />}
            color="orange"
          />
          
          <div className="space-y-6">
            {/* What to Build */}
            <ContentBlock title="Advanced Screens & Workflows">
              <ul className="space-y-2 text-white/70 text-sm">
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-orange-400 mt-0.5 flex-shrink-0" />
                  <span><strong>Branch Maps:</strong> Visualize story structure, nodes, and soft branching paths</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-orange-400 mt-0.5 flex-shrink-0" />
                  <span><strong>Creator Dashboard:</strong> Manage stories, view analytics (qualitative engagement signals)</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-orange-400 mt-0.5 flex-shrink-0" />
                  <span><strong>Visual Story Builder:</strong> Drag-and-drop nodes, add chapters, upload multimedia, define soft branches</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-orange-400 mt-0.5 flex-shrink-0" />
                  <span><strong>Context Cards / Footnotes:</strong> Creator-provided cards (music, film, fashion, cultural) in multiple languages</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-orange-400 mt-0.5 flex-shrink-0" />
                  <span><strong>Institutional Collections:</strong> Brock University partnership - curated academic collections</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-orange-400 mt-0.5 flex-shrink-0" />
                  <span><strong>Contributor Profiles:</strong> Public profiles for institutional contributors with permissions</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-orange-400 mt-0.5 flex-shrink-0" />
                  <span><strong>Audit Trail & Governance:</strong> View all moderation actions, approve contributors, manage permissions</span>
                </li>
              </ul>
            </ContentBlock>

            {/* Figma AI Prompt */}
            <PromptBlock 
              phase="Phase 4"
              color="orange"
              prompt="Design advanced SEEN screens: Branch Maps showing story nodes and soft branches, Creator Dashboard with Visual Story Builder (drag/drop nodes, add audio/video/images, soft branching), Context Cards / Footnotes (multilingual, optional), Institutional Collections (Brock partnership), Contributor Profiles, and Audit Trail & Governance Panel. Map each screen to backend APIs and role-based access. Include multilingual support (EN/FR/ES), accessibility features, and audit-ready moderation workflow. Make immersive, modular, developer-ready, and CMF grant-safe."
            />

            {/* Visual Story Builder Specifications */}
            <ContentBlock title="Visual Story Builder - Technical Details">
              <div className="space-y-4">
                <div className="p-4 bg-white/5 border border-white/10 rounded-lg">
                  <h4 className="text-sm font-semibold text-orange-300 mb-2">Node Types</h4>
                  <ul className="space-y-1 text-xs text-white/70">
                    <li>• <strong>Chapter Node:</strong> Main story segment with text, audio layers, video</li>
                    <li>• <strong>Branch Node:</strong> Decision point (soft branching - no true choices, exploration paths)</li>
                    <li>• <strong>Context Card Node:</strong> Optional footnotes (music, film, fashion, cultural reference)</li>
                    <li>• <strong>Response Node:</strong> Community response collection point</li>
                  </ul>
                </div>
                <div className="p-4 bg-white/5 border border-white/10 rounded-lg">
                  <h4 className="text-sm font-semibold text-orange-300 mb-2">Connections</h4>
                  <ul className="space-y-1 text-xs text-white/70">
                    <li>• <strong>Linear:</strong> Chapter 1 → Chapter 2 → Chapter 3 (default)</li>
                    <li>• <strong>Soft Branch:</strong> Chapter 2 → [Path A, Path B] → Chapter 3 (exploration, not choice)</li>
                    <li>• <strong>Context Link:</strong> Chapter → Context Card (optional, user-initiated)</li>
                  </ul>
                </div>
                <div className="p-4 bg-white/5 border border-white/10 rounded-lg">
                  <h4 className="text-sm font-semibold text-orange-300 mb-2">Multimedia Upload</h4>
                  <ul className="space-y-1 text-xs text-white/70">
                    <li>• <strong>Audio Layers:</strong> Ambient (looped), Narration (timed), Music (background)</li>
                    <li>• <strong>Video:</strong> MP4/HLS, optional per chapter</li>
                    <li>• <strong>Images:</strong> Cover art, context card images</li>
                    <li>• <strong>Captions:</strong> VTT format for accessibility (EN/FR/ES)</li>
                  </ul>
                </div>
              </div>
            </ContentBlock>

            {/* Role-Based Features Table */}
            <RoleFeatureTable
              features={[
                { feature: "View Stories", viewer: true, creator: true, moderator: true, admin: true },
                { feature: "Create Stories", viewer: false, creator: true, moderator: false, admin: false },
                { feature: "Visual Story Builder", viewer: false, creator: true, moderator: false, admin: false },
                { feature: "Branch Maps", viewer: false, creator: true, moderator: false, admin: true },
                { feature: "Submit Responses", viewer: true, creator: true, moderator: true, admin: true },
                { feature: "Moderate Responses", viewer: false, creator: false, moderator: true, admin: true },
                { feature: "Audit Trail Access", viewer: false, creator: false, moderator: true, admin: true },
                { feature: "Manage Collections", viewer: false, creator: false, moderator: false, admin: true },
                { feature: "Assign Permissions", viewer: false, creator: false, moderator: false, admin: true }
              ]}
            />
          </div>
        </section>

        {/* Full Navigation Flow */}
        <section className="mb-16">
          <SectionTitle icon={<Map />} title="Full App Navigation Flow (All Phases)" />
          
          <div className="space-y-6">
            {/* Navigation Diagram */}
            <div className="bg-gradient-to-br from-cyan-600/10 to-purple-600/10 border border-cyan-500/30 rounded-xl p-8">
              <h3 className="text-lg font-semibold text-cyan-300 mb-6">Global Navigation Structure</h3>
              
              <div className="space-y-8">
                {/* Viewer Flow */}
                <NavigationFlow
                  role="Viewer"
                  color="blue"
                  steps={[
                    "Splash",
                    "Language Selection",
                    "Intent Selection",
                    "Home / For You",
                    "Story World List",
                    "Story Preview",
                    "Chapter Node",
                    "Context Cards (optional)",
                    "Community Responses",
                    "Chapter Navigation",
                    "Profile / Preferences"
                  ]}
                />

                {/* Creator Flow */}
                <NavigationFlow
                  role="Creator"
                  color="purple"
                  steps={[
                    "Creator Dashboard",
                    "Create New Story",
                    "Visual Story Builder",
                    "Add Chapters",
                    "Upload Multimedia",
                    "Define Soft Branches",
                    "Add Context Cards",
                    "Preview Story",
                    "Publish to Community"
                  ]}
                />

                {/* Moderator Flow */}
                <NavigationFlow
                  role="Moderator"
                  color="red"
                  steps={[
                    "Moderation Panel",
                    "Review Queue",
                    "Review Response",
                    "Approve / Reject",
                    "Add Moderator Notes",
                    "View Audit Trail"
                  ]}
                />

                {/* Institutional Admin Flow */}
                <NavigationFlow
                  role="Institutional Admin"
                  color="green"
                  steps={[
                    "Institutional Dashboard",
                    "Manage Collections",
                    "Review Contributor Submissions",
                    "Approve Stories",
                    "View Contributor Profiles",
                    "Assign Permissions"
                  ]}
                />
              </div>
            </div>

            {/* Final Figma AI Prompt */}
            <PromptBlock 
              phase="Navigation Flow"
              color="cyan"
              prompt="Generate a full app navigation flow for SEEN, connecting all screens across all phases. Include Viewer, Creator, Moderator, and Institutional Admin roles. Show Splash → Language → Intent → Home → Story World → Chapter Node → Context Cards → Community Responses → Chapter Navigation. Include Creator Dashboard, Visual Story Builder, Preview, Publish, Moderation Panel, Audit Trail, and Institutional Collections. Label role-based access, screen-to-data bindings, multilingual support (EN/FR/ES), and accessibility options. Make developer-friendly, immersive, and CMF grant-safe."
            />
          </div>
        </section>

        {/* CMF Grant Compliance */}
        <section className="mb-16">
          <SectionTitle icon={<Shield />} title="CMF Grant Compliance Checklist" />
          
          <div className="bg-gradient-to-br from-purple-600/10 to-pink-600/10 border border-purple-500/30 rounded-xl p-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <ComplianceItem
                title="No Behavioral Tracking"
                description="No individual user behavior analytics, viewing patterns, or engagement metrics collected"
              />
              <ComplianceItem
                title="Local-First Storage"
                description="All preferences stored locally first, synced only when authenticated"
              />
              <ComplianceItem
                title="Privacy-First Design"
                description="No surveillance analytics, no third-party tracking, no PII collection without consent"
              />
              <ComplianceItem
                title="Multilingual Support"
                description="Official support for EN/FR, expansion capability for ES and Indigenous languages"
              />
              <ComplianceItem
                title="Accessibility First"
                description="WCAG compliant - captions, high contrast, reduced motion, screen reader support"
              />
              <ComplianceItem
                title="Cultural Focus"
                description="Content prioritizes Canadian cultural stories, Indigenous voices, and institutional partnerships"
              />
              <ComplianceItem
                title="Audit-Ready"
                description="Complete audit trails for all moderation, approval, and permission changes"
              />
              <ComplianceItem
                title="Open Standards"
                description="No vendor lock-in, open file formats, exportable data"
              />
            </div>
          </div>
        </section>

        {/* Implementation Timeline */}
        <section className="mb-16">
          <SectionTitle icon={<GitBranch />} title="Recommended Implementation Timeline" />
          
          <div className="space-y-4">
            <TimelineItem
              week="Weeks 1-2"
              phase="Backend MVP"
              tasks={[
                "Set up PostgreSQL database with multilingual schema",
                "Implement JWT authentication",
                "Build core API endpoints (users, stories, chapters, progress)",
                "Set up file storage (S3 or equivalent)"
              ]}
            />
            <TimelineItem
              week="Weeks 3-4"
              phase="Frontend MVP (Web)"
              tasks={[
                "Build core screens (Home, Story List, Chapter Node)",
                "Implement audio/video playback with multiple layers",
                "Add progress tracking and save/load",
                "Integrate with backend APIs"
              ]}
            />
            <TimelineItem
              week="Weeks 5-6"
              phase="Community & Moderation"
              tasks={[
                "Build Community Response submission panel",
                "Create Moderation Panel for reviewers",
                "Implement audit trail logging",
                "Add role-based access control"
              ]}
            />
            <TimelineItem
              week="Weeks 7-8"
              phase="Mobile Apps (React Native)"
              tasks={[
                "Port Web screens to React Native",
                "Implement offline caching and download",
                "Add background audio playback",
                "Test on iOS and Android devices"
              ]}
            />
            <TimelineItem
              week="Weeks 9-10"
              phase="Advanced Features"
              tasks={[
                "Build Creator Dashboard and Visual Story Builder",
                "Implement soft branching logic",
                "Add Context Cards system",
                "Create Institutional Collections interface"
              ]}
            />
            <TimelineItem
              week="Weeks 11-12"
              phase="Testing & Launch"
              tasks={[
                "Comprehensive QA across all platforms",
                "Accessibility audit and fixes",
                "Performance optimization",
                "CMF compliance verification",
                "Soft launch and user feedback"
              ]}
            />
          </div>
        </section>

        {/* Footer */}
        <div className="pt-12 border-t border-white/10 text-center">
          <p className="text-xs text-white/40 mb-2">
            SEEN by CREOVA • Master Documentation v1.0
          </p>
          <p className="text-xs text-white/30">
            Last Updated: February 2026 • CMF Grant-Compliant • Developer-Ready
          </p>
        </div>
      </div>
    </div>
  );
}

// Helper Components

function Badge({ icon, label, color }: { icon: React.ReactNode; label: string; color: string }) {
  const colors: Record<string, string> = {
    green: "bg-green-600/20 border-green-500/30 text-green-300",
    blue: "bg-blue-600/20 border-blue-500/30 text-blue-300",
    purple: "bg-purple-600/20 border-purple-500/30 text-purple-300",
    orange: "bg-orange-600/20 border-orange-500/30 text-orange-300"
  };

  return (
    <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-lg border ${colors[color]}`}>
      <div className="w-4 h-4">{icon}</div>
      <span className="text-xs font-semibold">{label}</span>
    </div>
  );
}

function SectionTitle({ icon, title }: { icon: React.ReactNode; title: string }) {
  return (
    <div className="flex items-center gap-3 mb-6">
      <div className="text-cyan-400">{icon}</div>
      <h2 className="text-2xl font-bold text-white">{title}</h2>
    </div>
  );
}

function PhaseHeader({ 
  phase, 
  title, 
  description, 
  icon, 
  color 
}: { 
  phase: number; 
  title: string; 
  description: string;
  icon: React.ReactNode;
  color: string;
}) {
  const colors: Record<string, string> = {
    green: "from-green-600/10 to-emerald-600/10 border-green-500/30",
    blue: "from-blue-600/10 to-cyan-600/10 border-blue-500/30",
    purple: "from-purple-600/10 to-pink-600/10 border-purple-500/30",
    orange: "from-orange-600/10 to-yellow-600/10 border-orange-500/30"
  };

  return (
    <div className={`bg-gradient-to-br ${colors[color]} border rounded-xl p-6 mb-8`}>
      <div className="flex items-start gap-4">
        <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center flex-shrink-0">
          {icon}
        </div>
        <div>
          <div className="text-xs tracking-wider uppercase text-white/50 mb-1">Phase {phase}</div>
          <h3 className="text-xl font-bold text-white mb-1">{title}</h3>
          <p className="text-sm text-white/70">{description}</p>
        </div>
      </div>
    </div>
  );
}

function ContentBlock({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="bg-white/5 border border-white/10 rounded-xl p-6">
      <h4 className="text-sm font-semibold text-white mb-4">{title}</h4>
      {children}
    </div>
  );
}

function PromptBlock({ phase, color, prompt }: { phase: string; color: string; prompt: string }) {
  const colors: Record<string, string> = {
    green: "from-green-600/20 to-emerald-600/20 border-green-500/40 text-green-300",
    blue: "from-blue-600/20 to-cyan-600/20 border-blue-500/40 text-blue-300",
    purple: "from-purple-600/20 to-pink-600/20 border-purple-500/40 text-purple-300",
    orange: "from-orange-600/20 to-yellow-600/20 border-orange-500/40 text-orange-300",
    cyan: "from-cyan-600/20 to-blue-600/20 border-cyan-500/40 text-cyan-300"
  };

  return (
    <div className={`bg-gradient-to-br ${colors[color]} border rounded-xl p-6`}>
      <div className="mb-3">
        <h4 className="text-sm font-semibold">Figma AI Prompt — {phase}</h4>
      </div>
      <p className="text-sm text-white/90 leading-relaxed italic">
        "{prompt}"
      </p>
    </div>
  );
}

function TechnicalSpecs({ title, specs }: { title: string; specs: Array<{ label: string; value: string }> }) {
  return (
    <ContentBlock title={title}>
      <div className="space-y-3">
        {specs.map((spec, index) => (
          <div key={index} className="flex items-start gap-3">
            <div className="text-xs font-semibold text-white/50 w-32 flex-shrink-0 pt-0.5">{spec.label}</div>
            <div className="text-sm text-white/80">{spec.value}</div>
          </div>
        ))}
      </div>
    </ContentBlock>
  );
}

function EndpointTable({ endpoints }: { endpoints: Array<{ method: string; path: string; description: string }> }) {
  return (
    <ContentBlock title="Key API Endpoints">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-white/10">
              <th className="text-left py-2 text-white/60 font-semibold text-xs">Method</th>
              <th className="text-left py-2 text-white/60 font-semibold text-xs">Endpoint</th>
              <th className="text-left py-2 text-white/60 font-semibold text-xs">Description</th>
            </tr>
          </thead>
          <tbody>
            {endpoints.map((endpoint, index) => (
              <tr key={index} className="border-b border-white/5">
                <td className="py-2">
                  <span className={`px-2 py-0.5 rounded text-xs font-mono ${
                    endpoint.method === 'GET' ? 'bg-blue-600/20 text-blue-300' : 'bg-green-600/20 text-green-300'
                  }`}>
                    {endpoint.method}
                  </span>
                </td>
                <td className="py-2 font-mono text-xs text-white/80">{endpoint.path}</td>
                <td className="py-2 text-white/60 text-xs">{endpoint.description}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </ContentBlock>
  );
}

function ScreenAPITable({ mappings }: { mappings: Array<{ screen: string; reads: string; writes: string; notes: string }> }) {
  return (
    <ContentBlock title="Screen-to-API Mappings">
      <div className="space-y-3">
        {mappings.map((mapping, index) => (
          <div key={index} className="p-3 bg-white/5 border border-white/10 rounded-lg">
            <div className="text-sm font-semibold text-white mb-2">{mapping.screen}</div>
            <div className="grid grid-cols-2 gap-2 text-xs mb-2">
              <div>
                <span className="text-green-400">Reads:</span>
                <span className="text-white/70 ml-2">{mapping.reads}</span>
              </div>
              <div>
                <span className="text-blue-400">Writes:</span>
                <span className="text-white/70 ml-2">{mapping.writes}</span>
              </div>
            </div>
            <div className="text-xs text-white/50 italic">{mapping.notes}</div>
          </div>
        ))}
      </div>
    </ContentBlock>
  );
}

function RoleFeatureTable({ features }: { features: Array<{ feature: string; viewer: boolean; creator: boolean; moderator: boolean; admin: boolean }> }) {
  return (
    <ContentBlock title="Role-Based Feature Access">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-white/10">
              <th className="text-left py-2 text-white/60 font-semibold text-xs">Feature</th>
              <th className="text-center py-2 text-blue-400 font-semibold text-xs">Viewer</th>
              <th className="text-center py-2 text-purple-400 font-semibold text-xs">Creator</th>
              <th className="text-center py-2 text-red-400 font-semibold text-xs">Moderator</th>
              <th className="text-center py-2 text-green-400 font-semibold text-xs">Admin</th>
            </tr>
          </thead>
          <tbody>
            {features.map((feature, index) => (
              <tr key={index} className="border-b border-white/5">
                <td className="py-2 text-white/80 text-xs">{feature.feature}</td>
                <td className="py-2 text-center">{feature.viewer ? '✓' : '—'}</td>
                <td className="py-2 text-center">{feature.creator ? '✓' : '—'}</td>
                <td className="py-2 text-center">{feature.moderator ? '✓' : '—'}</td>
                <td className="py-2 text-center">{feature.admin ? '✓' : '—'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </ContentBlock>
  );
}

function NavigationFlow({ role, color, steps }: { role: string; color: string; steps: string[] }) {
  const colors: Record<string, string> = {
    blue: "text-blue-300",
    purple: "text-purple-300",
    red: "text-red-300",
    green: "text-green-300"
  };

  return (
    <div>
      <h4 className={`text-sm font-semibold ${colors[color]} mb-3`}>{role} Flow</h4>
      <div className="flex flex-wrap gap-2 items-center">
        {steps.map((step, index) => (
          <div key={index} className="flex items-center gap-2">
            <div className="px-3 py-1.5 bg-white/5 border border-white/10 rounded text-xs text-white/80">
              {step}
            </div>
            {index < steps.length - 1 && (
              <ArrowRight className="w-3 h-3 text-white/30" />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

function ComplianceItem({ title, description }: { title: string; description: string }) {
  return (
    <div className="flex items-start gap-3">
      <CheckCircle className="w-5 h-5 text-purple-400 flex-shrink-0 mt-0.5" />
      <div>
        <h4 className="text-sm font-semibold text-white mb-1">{title}</h4>
        <p className="text-xs text-white/70">{description}</p>
      </div>
    </div>
  );
}

function TimelineItem({ week, phase, tasks }: { week: string; phase: string; tasks: string[] }) {
  return (
    <div className="bg-white/5 border border-white/10 rounded-xl p-5">
      <div className="flex items-start gap-4">
        <div className="w-16 h-16 rounded-lg bg-cyan-600/20 border border-cyan-500/30 flex items-center justify-center flex-shrink-0">
          <span className="text-xs font-bold text-cyan-300">{week}</span>
        </div>
        <div className="flex-1">
          <h4 className="text-sm font-semibold text-white mb-3">{phase}</h4>
          <ul className="space-y-1.5">
            {tasks.map((task, index) => (
              <li key={index} className="text-xs text-white/70 flex items-start gap-2">
                <CheckCircle className="w-3 h-3 text-cyan-400 mt-0.5 flex-shrink-0" />
                <span>{task}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}