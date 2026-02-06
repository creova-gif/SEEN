import { motion } from "motion/react";
import { Smartphone, Globe, Monitor, Wifi, WifiOff, Download, Cloud, Lock } from "lucide-react";

/**
 * SEEN Multi-Platform Deployment Strategy
 * 
 * Complete deployment plan for:
 * - Web (Next.js + PWA)
 * - iOS (React Native)
 * - Android (React Native)
 * 
 * Includes API integration, offline caching, authentication,
 * multimedia handling, and role-based access across all platforms.
 */

export function MultiPlatformDeployment() {
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
            <Smartphone className="w-8 h-8 text-blue-400" />
            <h1 className="text-3xl font-bold">SEEN Multi-Platform Deployment</h1>
          </div>
          <p className="text-white/60 text-lg">
            Cross-platform strategy for Web, iOS, and Android with offline-first architecture
          </p>
          <div className="mt-4 inline-block px-4 py-2 bg-blue-600/20 border border-blue-500/30 rounded-lg">
            <span className="text-xs tracking-wider text-blue-300">MOBILE-FIRST • OFFLINE-CAPABLE • OS-READY</span>
          </div>
        </motion.div>

        {/* Platform Overview */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
            <Monitor className="w-6 h-6 text-purple-400" />
            Platform Overview
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <PlatformCard
              icon={<Globe className="w-8 h-8 text-green-400" />}
              title="Web"
              tech="Next.js 14 + PWA"
              features={[
                "Server-side rendering (SSR) for SEO",
                "Progressive Web App capabilities",
                "Offline chapter caching",
                "Responsive mobile-first design",
                "Desktop tablet support"
              ]}
              deployment="Vercel / AWS Amplify / Render"
              timeline="Week 1-2"
            />
            <PlatformCard
              icon={<Smartphone className="w-8 h-8 text-blue-400" />}
              title="iOS"
              tech="React Native + Expo"
              features={[
                "Native audio playback APIs",
                "Background audio support",
                "Offline chapter downloads",
                "Push notifications (optional)",
                "iOS 15+ compatibility"
              ]}
              deployment="TestFlight → App Store"
              timeline="Week 3-5"
            />
            <PlatformCard
              icon={<Smartphone className="w-8 h-8 text-cyan-400" />}
              title="Android"
              tech="React Native + Expo"
              features={[
                "Native audio playback APIs",
                "Background audio support",
                "Offline chapter downloads",
                "Push notifications (optional)",
                "Android 10+ compatibility"
              ]}
              deployment="Internal Testing → Play Store"
              timeline="Week 3-5"
            />
          </div>
        </section>

        {/* Web Deployment */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-6">Web Platform (Next.js + PWA)</h2>
          
          <DeploymentStep
            step={1}
            title="Setup Next.js Project"
            description="Initialize Next.js 14 with App Router, TypeScript, and Tailwind CSS"
            code={`npx create-next-app@14 seen-web --typescript --tailwind --app
cd seen-web
npm install motion framer-motion lucide-react`}
            notes="Use App Router for better performance and nested layouts"
          />

          <DeploymentStep
            step={2}
            title="Configure PWA"
            description="Add Progressive Web App capabilities for offline support"
            code={`npm install next-pwa
// next.config.js
const withPWA = require('next-pwa')({
  dest: 'public',
  disable: process.env.NODE_ENV === 'development',
  register: true,
  skipWaiting: true,
  runtimeCaching: [
    {
      urlPattern: /^https:\\/\\/cdn\\.seen\\.ca\\/.*/i,
      handler: 'CacheFirst',
      options: { cacheName: 'seen-media-cache' }
    }
  ]
})`}
            notes="Caches audio, images, and chapter content for offline reading"
          />

          <DeploymentStep
            step={3}
            title="API Integration"
            description="Connect to backend APIs with local-first caching"
            code={`// lib/api.ts
export async function fetchStory(id: string) {
  const cached = localStorage.getItem(\`story-\${id}\`);
  if (cached) return JSON.parse(cached);
  
  const response = await fetch(\`https://api.seen.ca/stories/\${id}\`);
  const data = await response.json();
  
  localStorage.setItem(\`story-\${id}\`, JSON.stringify(data));
  return data;
}`}
            notes="Local storage first, then network; supports offline mode"
          />

          <DeploymentStep
            step={4}
            title="Deploy to Production"
            description="Deploy to Vercel with automatic HTTPS and CDN"
            code={`# Install Vercel CLI
npm install -g vercel

# Deploy
vercel --prod

# Configure custom domain
vercel domains add seen.ca
vercel domains add www.seen.ca`}
            notes="Vercel provides automatic SSL, global CDN, and instant rollbacks"
          />
        </section>

        {/* Mobile Deployment */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-6">Mobile Platform (React Native)</h2>
          
          <DeploymentStep
            step={1}
            title="Initialize React Native + Expo"
            description="Create unified iOS/Android codebase with Expo"
            code={`npx create-expo-app seen-mobile --template blank-typescript
cd seen-mobile
npm install @react-navigation/native @react-navigation/stack
npm install react-native-track-player  # Audio playback
npm install @react-native-async-storage/async-storage  # Offline storage`}
            notes="Expo simplifies deployment and provides managed build services"
          />

          <DeploymentStep
            step={2}
            title="Configure Audio Playback"
            description="Setup native audio APIs for multi-layer playback"
            code={`import TrackPlayer from 'react-native-track-player';

// Setup audio layers
await TrackPlayer.setupPlayer();
await TrackPlayer.add([
  {
    id: 'ambient',
    url: 'https://cdn.seen.ca/audio/ambient-01.mp3',
    title: 'Ambient Layer',
    artist: 'SEEN',
  },
  {
    id: 'narration',
    url: 'https://cdn.seen.ca/audio/narration-01.mp3',
    title: 'Narration Layer',
  }
]);

// Play all layers simultaneously
await TrackPlayer.play();`}
            notes="Supports background playback, seeking, and simultaneous audio layers"
          />

          <DeploymentStep
            step={3}
            title="Offline Chapter Downloads"
            description="Enable users to download chapters for offline access"
            code={`import * as FileSystem from 'expo-file-system';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Download chapter
async function downloadChapter(chapterId: string) {
  const chapterData = await fetch(\`https://api.seen.ca/chapters/\${chapterId}\`);
  const json = await chapterData.json();
  
  // Download audio files
  await FileSystem.downloadAsync(
    json.audioLayers.ambient,
    FileSystem.documentDirectory + \`\${chapterId}-ambient.mp3\`
  );
  
  // Store chapter metadata
  await AsyncStorage.setItem(\`chapter-\${chapterId}\`, JSON.stringify(json));
  
  return { success: true, offlineReady: true };
}`}
            notes="Downloads audio, images, and text for complete offline experience"
          />

          <DeploymentStep
            step={4}
            title="iOS Deployment (TestFlight)"
            description="Build and deploy to Apple TestFlight for beta testing"
            code={`# Install EAS CLI
npm install -g eas-cli

# Configure iOS build
eas build:configure

# Build iOS app
eas build --platform ios

# Submit to TestFlight
eas submit --platform ios`}
            notes="Requires Apple Developer account ($99/year); TestFlight allows 10,000 beta testers"
          />

          <DeploymentStep
            step={5}
            title="Android Deployment (Play Store)"
            description="Build and deploy to Google Play Store"
            code={`# Build Android app
eas build --platform android

# Submit to Play Store Internal Testing
eas submit --platform android`}
            notes="Requires Google Play Developer account ($25 one-time); supports staged rollouts"
          />
        </section>

        {/* Cross-Platform Features */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-6">Cross-Platform Features</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FeatureCard
              icon={<WifiOff className="w-6 h-6 text-orange-400" />}
              title="Offline-First Architecture"
              description="Local storage priority with background sync"
              implementation={{
                web: "Service Workers + IndexedDB for chapter caching",
                mobile: "AsyncStorage + FileSystem for downloads"
              }}
            />
            <FeatureCard
              icon={<Cloud className="w-6 h-6 text-cyan-400" />}
              title="Cloud Sync"
              description="Progress and preferences sync across devices"
              implementation={{
                web: "LocalStorage → API sync on network restore",
                mobile: "AsyncStorage → API sync on app launch"
              }}
            />
            <FeatureCard
              icon={<Lock className="w-6 h-6 text-red-400" />}
              title="Authentication"
              description="JWT-based auth with social login support"
              implementation={{
                web: "Firebase Auth / Auth0 with cookie storage",
                mobile: "Firebase Auth / Auth0 with SecureStore"
              }}
            />
            <FeatureCard
              icon={<Download className="w-6 h-6 text-green-400" />}
              title="Media Caching"
              description="Audio, video, and images cached for performance"
              implementation={{
                web: "Service Worker runtime caching",
                mobile: "FileSystem downloads with cache management"
              }}
            />
          </div>
        </section>

        {/* API Integration Patterns */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-6">API Integration Patterns</h2>
          
          <div className="bg-white/5 border border-white/10 rounded-lg p-6 mb-6">
            <h3 className="text-lg font-semibold mb-4">Local-First Data Flow</h3>
            <div className="space-y-4">
              <DataFlowStep
                step="1. User Action"
                description="User opens chapter or updates profile"
                flow="User → App"
              />
              <DataFlowStep
                step="2. Check Local Cache"
                description="Query localStorage (web) or AsyncStorage (mobile)"
                flow="App → Local Storage"
              />
              <DataFlowStep
                step="3. Return Cached Data"
                description="If cached and fresh, return immediately"
                flow="Local Storage → App → User"
              />
              <DataFlowStep
                step="4. Background Fetch"
                description="If stale or missing, fetch from API in background"
                flow="App → Backend API"
              />
              <DataFlowStep
                step="5. Update Cache"
                description="Store fresh data locally for next access"
                flow="Backend API → Local Storage"
              />
              <DataFlowStep
                step="6. Sync User Changes"
                description="User edits sync to backend when online"
                flow="Local Storage → Backend API (when online)"
              />
            </div>
          </div>

          <div className="bg-white/5 border border-white/10 rounded-lg p-6">
            <h3 className="text-lg font-semibold mb-4">Network State Handling</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <NetworkStateCard
                state="Online"
                behavior={[
                  "Fetch fresh data from API",
                  "Update local cache",
                  "Sync pending changes to backend",
                  "Show live community responses"
                ]}
              />
              <NetworkStateCard
                state="Offline"
                behavior={[
                  "Serve from local cache only",
                  "Queue user changes for sync",
                  "Disable community features",
                  "Show offline indicator"
                ]}
              />
            </div>
          </div>
        </section>

        {/* Deployment Checklist */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-6">Pre-Launch Checklist</h2>
          <div className="space-y-3">
            <ChecklistItem
              category="Backend"
              items={[
                "APIs deployed to production environment",
                "Database migrations run successfully",
                "S3 buckets configured with CDN",
                "Authentication service active (Firebase/Auth0)",
                "Rate limiting enabled",
                "SSL certificates installed"
              ]}
            />
            <ChecklistItem
              category="Web"
              items={[
                "PWA manifest.json configured",
                "Service worker caching enabled",
                "Responsive design tested (mobile, tablet, desktop)",
                "SEO meta tags added to all pages",
                "Analytics disabled (CMF compliance)",
                "Domain DNS configured"
              ]}
            />
            <ChecklistItem
              category="iOS"
              items={[
                "App icons and splash screens added",
                "Background audio permissions requested",
                "TestFlight beta testing completed",
                "App Store listing prepared (EN/FR)",
                "Privacy policy link active",
                "In-app purchases disabled (if applicable)"
              ]}
            />
            <ChecklistItem
              category="Android"
              items={[
                "App icons and splash screens added",
                "Background audio permissions requested",
                "Internal testing completed",
                "Play Store listing prepared (EN/FR)",
                "Privacy policy link active",
                "ProGuard/R8 configuration tested"
              ]}
            />
            <ChecklistItem
              category="Content"
              items={[
                "At least 3 Story Worlds published",
                "All chapters have EN + FR translations",
                "Audio layers uploaded and tested",
                "Context cards populated",
                "Community moderation queue active"
              ]}
            />
          </div>
        </section>

        {/* Performance Targets */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-6">Performance Targets</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <PerformanceTarget
              metric="Initial Load Time"
              target="< 2 seconds"
              platform="Web"
              notes="First Contentful Paint on 4G connection"
            />
            <PerformanceTarget
              metric="App Launch Time"
              target="< 1 second"
              platform="Mobile"
              notes="Time to interactive on average device"
            />
            <PerformanceTarget
              metric="Audio Start Delay"
              target="< 500ms"
              platform="All"
              notes="Time from play button to audio playback"
            />
            <PerformanceTarget
              metric="Chapter Transition"
              target="< 300ms"
              platform="All"
              notes="Animation + content load for next chapter"
            />
            <PerformanceTarget
              metric="Offline Cache Size"
              target="< 100MB"
              platform="Mobile"
              notes="Per-chapter download including audio"
            />
            <PerformanceTarget
              metric="API Response Time"
              target="< 200ms"
              platform="Backend"
              notes="P95 response time for GET requests"
            />
          </div>
        </section>

        {/* Footer */}
        <div className="pt-8 border-t border-white/10 text-center">
          <p className="text-xs text-white/40">
            SEEN Multi-Platform Deployment Strategy v1.0 • Last Updated: February 2026
          </p>
        </div>
      </div>
    </div>
  );
}

// Helper Components

function PlatformCard({
  icon,
  title,
  tech,
  features,
  deployment,
  timeline
}: {
  icon: React.ReactNode;
  title: string;
  tech: string;
  features: string[];
  deployment: string;
  timeline: string;
}) {
  return (
    <div className="bg-white/5 border border-white/10 rounded-lg p-6">
      <div className="flex items-center gap-3 mb-4">
        {icon}
        <div>
          <h3 className="text-lg font-semibold">{title}</h3>
          <p className="text-sm text-white/60">{tech}</p>
        </div>
      </div>
      <ul className="space-y-2 mb-4">
        {features.map((feature, index) => (
          <li key={index} className="text-sm text-white/80 flex items-start gap-2">
            <span className="text-green-400 mt-1">✓</span>
            <span>{feature}</span>
          </li>
        ))}
      </ul>
      <div className="pt-4 border-t border-white/10 space-y-2">
        <div className="text-xs text-white/40">Deployment: <span className="text-white/80">{deployment}</span></div>
        <div className="text-xs text-white/40">Timeline: <span className="text-white/80">{timeline}</span></div>
      </div>
    </div>
  );
}

function DeploymentStep({
  step,
  title,
  description,
  code,
  notes
}: {
  step: number;
  title: string;
  description: string;
  code: string;
  notes: string;
}) {
  return (
    <div className="mb-8">
      <div className="flex items-start gap-4 mb-3">
        <div className="w-8 h-8 rounded-full bg-blue-600/20 border border-blue-500/30 flex items-center justify-center flex-shrink-0">
          <span className="text-sm font-semibold text-blue-400">{step}</span>
        </div>
        <div className="flex-1">
          <h3 className="text-lg font-semibold mb-1">{title}</h3>
          <p className="text-sm text-white/70">{description}</p>
        </div>
      </div>
      <div className="ml-12">
        <pre className="bg-black/40 border border-white/10 rounded-lg p-4 text-xs text-green-300 overflow-x-auto mb-2">
          {code}
        </pre>
        <p className="text-xs text-white/60 italic">💡 {notes}</p>
      </div>
    </div>
  );
}

function FeatureCard({
  icon,
  title,
  description,
  implementation
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
  implementation: { web: string; mobile: string };
}) {
  return (
    <div className="bg-white/5 border border-white/10 rounded-lg p-5">
      <div className="flex items-start gap-3 mb-3">
        {icon}
        <div>
          <h3 className="text-base font-semibold mb-1">{title}</h3>
          <p className="text-sm text-white/70">{description}</p>
        </div>
      </div>
      <div className="space-y-2 text-xs">
        <div>
          <span className="text-white/40">Web:</span>{" "}
          <span className="text-white/80">{implementation.web}</span>
        </div>
        <div>
          <span className="text-white/40">Mobile:</span>{" "}
          <span className="text-white/80">{implementation.mobile}</span>
        </div>
      </div>
    </div>
  );
}

function DataFlowStep({ step, description, flow }: { step: string; description: string; flow: string }) {
  return (
    <div className="flex items-start gap-3">
      <div className="w-6 h-6 rounded-full bg-cyan-600/20 border border-cyan-500/30 flex items-center justify-center flex-shrink-0 mt-1">
        <span className="text-xs font-semibold text-cyan-400">{step.charAt(0)}</span>
      </div>
      <div className="flex-1">
        <div className="text-sm font-semibold text-white mb-1">{step}</div>
        <div className="text-xs text-white/70 mb-1">{description}</div>
        <div className="text-xs text-cyan-400 font-mono">{flow}</div>
      </div>
    </div>
  );
}

function NetworkStateCard({ state, behavior }: { state: string; behavior: string[] }) {
  return (
    <div className="bg-white/5 border border-white/10 rounded-lg p-4">
      <div className="flex items-center gap-2 mb-3">
        {state === "Online" ? (
          <Wifi className="w-5 h-5 text-green-400" />
        ) : (
          <WifiOff className="w-5 h-5 text-orange-400" />
        )}
        <h4 className="text-base font-semibold">{state}</h4>
      </div>
      <ul className="space-y-2">
        {behavior.map((item, index) => (
          <li key={index} className="text-sm text-white/80 flex items-start gap-2">
            <span className="text-white/40 mt-1">•</span>
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

function ChecklistItem({ category, items }: { category: string; items: string[] }) {
  return (
    <div className="bg-white/5 border border-white/10 rounded-lg p-5">
      <h3 className="text-base font-semibold mb-3 text-purple-300">{category}</h3>
      <ul className="space-y-2">
        {items.map((item, index) => (
          <li key={index} className="text-sm text-white/80 flex items-start gap-3">
            <input type="checkbox" className="mt-1 w-4 h-4 rounded border-white/20" />
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

function PerformanceTarget({
  metric,
  target,
  platform,
  notes
}: {
  metric: string;
  target: string;
  platform: string;
  notes: string;
}) {
  return (
    <div className="bg-white/5 border border-white/10 rounded-lg p-4">
      <div className="text-xs tracking-wider uppercase text-white/40 mb-2">{metric}</div>
      <div className="text-2xl font-bold text-green-400 mb-2">{target}</div>
      <div className="text-xs text-white/60 mb-1">Platform: {platform}</div>
      <div className="text-xs text-white/50">{notes}</div>
    </div>
  );
}
