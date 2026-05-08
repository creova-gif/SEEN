import { motion } from "motion/react";
import { Music, Video, Image, Headphones, Layers, Download, Play, Pause } from "lucide-react";

/**
 * SEEN Advanced Multimedia Handling Specification
 * 
 * Comprehensive technical specification for:
 * - Multi-layer audio (ambient, narration, music)
 * - Video overlays and adaptive streaming
 * - Image optimization and lazy loading
 * - Offline caching and background sync
 * - Accessibility (captions, audio descriptions)
 * - Performance optimization (HLS, CDN)
 */

export function MultimediaHandlingSpec() {
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
            <Layers className="w-8 h-8 text-purple-400" />
            <h1 className="text-3xl font-bold">SEEN Multimedia Handling Specification</h1>
          </div>
          <p className="text-white/60 text-lg">
            Advanced audio, video, and image handling with streaming, caching, and accessibility
          </p>
          <div className="mt-4 inline-block px-4 py-2 bg-purple-600/20 border border-purple-500/30 rounded-lg">
            <span className="text-xs tracking-wider text-purple-300">CINEMATIC QUALITY • ACCESSIBLE • PERFORMANT</span>
          </div>
        </motion.div>

        {/* Audio Architecture */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
            <Music className="w-6 h-6 text-blue-400" />
            Multi-Layer Audio Architecture
          </h2>

          <div className="bg-white/5 border border-white/10 rounded-lg p-6 mb-6">
            <h3 className="text-lg font-semibold mb-4">Three Independent Audio Layers</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <AudioLayer
                name="Ambient"
                description="Environmental soundscape"
                characteristics={[
                  "Looping background audio",
                  "Low-frequency drone/texture",
                  "Volume: 30-50% default",
                  "Fade in/out: 3-5 seconds"
                ]}
                color="cyan"
              />
              <AudioLayer
                name="Narration"
                description="Spoken word/voice-over"
                characteristics={[
                  "Primary narrative audio",
                  "Clear vocal range (200-3000Hz)",
                  "Volume: 80-100% default",
                  "Synced with text scroll"
                ]}
                color="purple"
              />
              <AudioLayer
                name="Music"
                description="Emotional score"
                characteristics={[
                  "Full-spectrum music",
                  "Dynamic volume (20-70%)",
                  "Fade in/out: 2-4 seconds",
                  "Tempo-synced to pacing"
                ]}
                color="green"
              />
            </div>

            <div className="bg-black/40 border border-white/10 rounded-lg p-4">
              <h4 className="text-sm font-semibold mb-3 text-white/80">Audio Mixing Logic</h4>
              <pre className="text-xs text-green-300 overflow-x-auto">
{`// Web Audio API implementation
const audioContext = new AudioContext();
const layers = {
  ambient: audioContext.createMediaElementSource(ambientAudio),
  narration: audioContext.createMediaElementSource(narrationAudio),
  music: audioContext.createMediaElementSource(musicAudio)
};

// Create gain nodes for volume control
const ambientGain = audioContext.createGain();
const narrationGain = audioContext.createGain();
const musicGain = audioContext.createGain();

// Set default volumes
ambientGain.gain.value = 0.4;    // 40%
narrationGain.gain.value = 1.0;   // 100%
musicGain.gain.value = 0.5;       // 50%

// Connect to speakers
layers.ambient.connect(ambientGain).connect(audioContext.destination);
layers.narration.connect(narrationGain).connect(audioContext.destination);
layers.music.connect(musicGain).connect(audioContext.destination);

// Sync playback
function playAll() {
  const startTime = audioContext.currentTime + 0.1;
  [ambientAudio, narrationAudio, musicAudio].forEach(audio => {
    audio.currentTime = 0;
    audio.play();
  });
}

// Fade transitions
function fadeOut(gainNode, duration = 3) {
  gainNode.gain.exponentialRampToValueAtTime(
    0.01,
    audioContext.currentTime + duration
  );
}`}
              </pre>
            </div>
          </div>

          {/* Audio Streaming */}
          <div className="bg-white/5 border border-white/10 rounded-lg p-6">
            <h3 className="text-lg font-semibold mb-4">HLS Adaptive Streaming</h3>
            <p className="text-sm text-white/70 mb-4">
              Use HTTP Live Streaming (HLS) for chunked audio delivery, enabling smooth scrubbing and bandwidth adaptation.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <StreamingSpec
                title="Audio Format"
                specs={[
                  "Container: MP3 / AAC",
                  "Bitrate: 128 kbps (standard), 320 kbps (high)",
                  "Sample Rate: 44.1 kHz / 48 kHz",
                  "Channels: Stereo (2.0)"
                ]}
              />
              <StreamingSpec
                title="Chunk Configuration"
                specs={[
                  "Chunk size: 10 seconds",
                  "Buffer ahead: 30 seconds",
                  "Adaptive bitrate: Yes",
                  "Preload: metadata only"
                ]}
              />
            </div>
          </div>
        </section>

        {/* Video Handling */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
            <Video className="w-6 h-6 text-red-400" />
            Video Overlays & Adaptive Streaming
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div className="bg-white/5 border border-white/10 rounded-lg p-6">
              <h3 className="text-base font-semibold mb-4">Video Specifications</h3>
              <ul className="space-y-2 text-sm text-white/80">
                <li className="flex items-start gap-2">
                  <span className="text-purple-400">•</span>
                  <span><strong>Format:</strong> MP4 (H.264/H.265)</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-purple-400">•</span>
                  <span><strong>Resolution:</strong> 1080p (1920×1080), 720p fallback</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-purple-400">•</span>
                  <span><strong>Aspect Ratio:</strong> 16:9 (landscape), 9:16 (vertical)</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-purple-400">•</span>
                  <span><strong>Bitrate:</strong> 5 Mbps (1080p), 2.5 Mbps (720p)</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-purple-400">•</span>
                  <span><strong>Frame Rate:</strong> 24 fps (cinematic), 30 fps (standard)</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-purple-400">•</span>
                  <span><strong>Audio:</strong> AAC 128 kbps stereo</span>
                </li>
              </ul>
            </div>

            <div className="bg-white/5 border border-white/10 rounded-lg p-6">
              <h3 className="text-base font-semibold mb-4">Adaptive Bitrate Streaming</h3>
              <ul className="space-y-2 text-sm text-white/80">
                <li className="flex items-start gap-2">
                  <span className="text-green-400">✓</span>
                  <span><strong>HLS/DASH:</strong> Adaptive streaming protocol</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-400">✓</span>
                  <span><strong>Quality Tiers:</strong> 1080p, 720p, 480p, 360p</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-400">✓</span>
                  <span><strong>Auto-Switching:</strong> Based on network conditions</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-400">✓</span>
                  <span><strong>Preload:</strong> First 10 seconds buffered</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-400">✓</span>
                  <span><strong>CDN:</strong> CloudFront/Cloudflare for global delivery</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-400">✓</span>
                  <span><strong>Captions:</strong> WebVTT format (EN/FR/ES)</span>
                </li>
              </ul>
            </div>
          </div>

          <div className="bg-black/40 border border-white/10 rounded-lg p-4">
            <h4 className="text-sm font-semibold mb-3 text-white/80">Video Player Implementation</h4>
            <pre className="text-xs text-cyan-300 overflow-x-auto">
{`import Hls from 'hls.js';

// Initialize HLS player
const video = document.getElementById('video-player');
const hls = new Hls({
  maxBufferLength: 30,      // Buffer 30 seconds ahead
  maxMaxBufferLength: 60,   // Maximum buffer size
  startLevel: -1,           // Auto quality selection
  capLevelToPlayerSize: true // Limit quality to player size
});

// Load HLS stream
hls.loadSource('https://cdn.seen.ca/video/chapter-01/playlist.m3u8');
hls.attachMedia(video);

// Add multilingual captions
const tracks = [
  { src: '/captions/en.vtt', srclang: 'en', label: 'English' },
  { src: '/captions/fr.vtt', srclang: 'fr', label: 'Français' },
  { src: '/captions/es.vtt', srclang: 'es', label: 'Español' }
];

tracks.forEach(track => {
  const textTrack = video.addTextTrack('captions', track.label, track.srclang);
  textTrack.mode = 'showing';
});`}
            </pre>
          </div>
        </section>

        {/* Image Optimization */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
            <Image className="w-6 h-6 text-green-400" />
            Image Optimization & Lazy Loading
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div className="bg-white/5 border border-white/10 rounded-lg p-6">
              <h3 className="text-base font-semibold mb-4">Image Formats & Sizes</h3>
              <div className="space-y-3">
                <ImageFormat
                  type="Story Covers"
                  format="WebP / AVIF (fallback: JPEG)"
                  dimensions="1080×1920 (9:16 portrait)"
                  fileSize="< 200 KB"
                />
                <ImageFormat
                  type="Context Cards"
                  format="WebP / PNG"
                  dimensions="800×600 (4:3)"
                  fileSize="< 150 KB"
                />
                <ImageFormat
                  type="Profile Images"
                  format="WebP / JPEG"
                  dimensions="400×400 (1:1)"
                  fileSize="< 50 KB"
                />
                <ImageFormat
                  type="Thumbnails"
                  format="WebP / JPEG"
                  dimensions="300×200 (3:2)"
                  fileSize="< 30 KB"
                />
              </div>
            </div>

            <div className="bg-white/5 border border-white/10 rounded-lg p-6">
              <h3 className="text-base font-semibold mb-4">Responsive Images</h3>
              <pre className="text-xs text-green-300 bg-black/40 border border-white/10 rounded p-3 overflow-x-auto">
{`// Next.js Image component
<Image
  src="/images/story-cover.jpg"
  alt="Midnight Resonance"
  width={1080}
  height={1920}
  sizes="(max-width: 768px) 100vw,
         (max-width: 1200px) 50vw,
         33vw"
  priority={true}
  quality={85}
  placeholder="blur"
  blurDataURL={blurDataUrl}
/>

// React Native cached image
<FastImage
  source={{
    uri: 'https://cdn.seen.ca/images/cover.jpg',
    priority: FastImage.priority.high,
    cache: FastImage.cacheControl.immutable
  }}
  style={{ width: 1080, height: 1920 }}
  resizeMode={FastImage.resizeMode.cover}
/>`}
              </pre>
            </div>
          </div>

          <div className="bg-white/5 border border-white/10 rounded-lg p-6">
            <h3 className="text-base font-semibold mb-4">CDN & Caching Strategy</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <CachingStrategy
                tier="Browser Cache"
                duration="7 days"
                scope="User device"
                notes="Immutable images with versioned URLs"
              />
              <CachingStrategy
                tier="CDN Cache"
                duration="30 days"
                scope="Edge locations"
                notes="CloudFront/Cloudflare global distribution"
              />
              <CachingStrategy
                tier="S3 Storage"
                duration="Permanent"
                scope="Origin server"
                notes="Versioned objects with lifecycle policies"
              />
            </div>
          </div>
        </section>

        {/* Offline Caching */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
            <Download className="w-6 h-6 text-orange-400" />
            Offline Caching & Background Sync
          </h2>

          <div className="bg-white/5 border border-white/10 rounded-lg p-6 mb-6">
            <h3 className="text-lg font-semibold mb-4">Downloadable Chapter Packages</h3>
            <p className="text-sm text-white/70 mb-4">
              Users can download complete chapters for offline access, including all audio layers, images, and text.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <OfflinePackage
                name="Lightweight"
                contents={[
                  "Chapter text (EN/FR/ES)",
                  "Narration audio only (128 kbps)",
                  "Compressed images (WebP)",
                  "Context cards (text only)"
                ]}
                size="15-25 MB"
              />
              <OfflinePackage
                name="Full Experience"
                contents={[
                  "Chapter text (EN/FR/ES)",
                  "All 3 audio layers (320 kbps)",
                  "High-quality images (JPEG)",
                  "Context cards with media",
                  "Video overlays (720p)"
                ]}
                size="80-120 MB"
              />
            </div>
          </div>

          <div className="bg-black/40 border border-white/10 rounded-lg p-4 mb-6">
            <h4 className="text-sm font-semibold mb-3 text-white/80">Service Worker Caching (Web)</h4>
            <pre className="text-xs text-purple-300 overflow-x-auto">
{`// Service Worker cache strategy
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open('seen-v1').then((cache) => {
      return cache.addAll([
        '/offline.html',
        '/styles/main.css',
        '/scripts/app.js',
        // Cache first chapter for instant offline access
        '/api/stories/midnight-resonance/chapters/01'
      ]);
    })
  );
});

// Network-first with cache fallback
self.addEventListener('fetch', (event) => {
  event.respondWith(
    fetch(event.request)
      .then((response) => {
        // Clone and cache successful responses
        const responseClone = response.clone();
        caches.open('seen-v1').then((cache) => {
          cache.put(event.request, responseClone);
        });
        return response;
      })
      .catch(() => {
        // Fallback to cache if offline
        return caches.match(event.request);
      })
  );
});`}
            </pre>
          </div>

          <div className="bg-black/40 border border-white/10 rounded-lg p-4">
            <h4 className="text-sm font-semibold mb-3 text-white/80">Background Sync (Mobile)</h4>
            <pre className="text-xs text-cyan-300 overflow-x-auto">
{`import BackgroundFetch from 'react-native-background-fetch';

// Configure background sync for progress updates
BackgroundFetch.configure(
  {
    minimumFetchInterval: 15, // Minutes
    stopOnTerminate: false,
    startOnBoot: true,
    enableHeadless: true
  },
  async (taskId) => {
    console.log('[BackgroundFetch] Task started:', taskId);
    
    // Sync user progress to backend
    const pendingProgress = await AsyncStorage.getItem('pending-sync');
    if (pendingProgress) {
      await fetch('https://api.seen.ca/progress', {
        method: 'POST',
        body: pendingProgress
      });
      await AsyncStorage.removeItem('pending-sync');
    }
    
    BackgroundFetch.finish(taskId);
  },
  (taskId) => {
    console.log('[BackgroundFetch] Task timeout:', taskId);
    BackgroundFetch.finish(taskId);
  }
);`}
            </pre>
          </div>
        </section>

        {/* Accessibility */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
            <Headphones className="w-6 h-6 text-yellow-400" />
            Accessibility Features
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <AccessibilityFeature
              title="Audio Descriptions"
              description="Narration layer includes visual scene descriptions for visually impaired users"
              implementation={[
                "Extended narration track with visual descriptions",
                "Toggle on/off in accessibility settings",
                "Automatic activation if screen reader detected",
                "Stored in separate audio file: narration-ad.mp3"
              ]}
            />
            <AccessibilityFeature
              title="Multilingual Captions"
              description="Real-time captions synced with narration in EN/FR/ES"
              implementation={[
                "WebVTT format for web, SRT for mobile",
                "Automatic language selection based on preferences",
                "Customizable font size and contrast",
                "Stored as: captions-en.vtt, captions-fr.vtt"
              ]}
            />
            <AccessibilityFeature
              title="Reduced Motion Mode"
              description="Disables animations and transitions for motion sensitivity"
              implementation={[
                "Respects prefers-reduced-motion media query",
                "Disables parallax scrolling effects",
                "Replaces animations with instant transitions",
                "Stored in user accessibility preferences"
              ]}
            />
            <AccessibilityFeature
              title="High Contrast Mode"
              description="Increases text contrast and removes low-opacity elements"
              implementation={[
                "Boosts text contrast to WCAG AAA (7:1)",
                "Removes background gradients/transparency",
                "Increases border visibility",
                "Alternative color palette for UI elements"
              ]}
            />
          </div>
        </section>

        {/* Performance Optimization */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-6">Performance Optimization Checklist</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <PerformanceOptimization
              category="Audio"
              optimizations={[
                "✓ HLS chunked streaming for scrubbing support",
                "✓ Adaptive bitrate (128 kbps / 320 kbps)",
                "✓ Preload only metadata to save bandwidth",
                "✓ Compress audio with Opus codec for 30% savings",
                "✓ Cache frequently accessed tracks locally"
              ]}
            />
            <PerformanceOptimization
              category="Video"
              optimizations={[
                "✓ Adaptive bitrate streaming (HLS/DASH)",
                "✓ Multiple quality tiers (360p - 1080p)",
                "✓ Lazy load videos below fold",
                "✓ Use poster images for preview",
                "✓ CDN distribution for global latency < 100ms"
              ]}
            />
            <PerformanceOptimization
              category="Images"
              optimizations={[
                "✓ WebP/AVIF for 30-50% smaller file sizes",
                "✓ Responsive images with srcset",
                "✓ Lazy loading with Intersection Observer",
                "✓ Blur placeholder while loading",
                "✓ CDN with automatic optimization (Cloudinary/Imgix)"
              ]}
            />
            <PerformanceOptimization
              category="Caching"
              optimizations={[
                "✓ Service Worker for offline web support",
                "✓ AsyncStorage + FileSystem for mobile downloads",
                "✓ Immutable URLs with versioned filenames",
                "✓ Cache-Control headers (max-age=2592000)",
                "✓ Background sync for progress updates"
              ]}
            />
          </div>
        </section>

        {/* Footer */}
        <div className="pt-8 border-t border-white/10 text-center">
          <p className="text-xs text-white/40">
            SEEN Multimedia Handling Specification v1.0 • Last Updated: February 2026
          </p>
        </div>
      </div>
    </div>
  );
}

// Helper Components

function AudioLayer({
  name,
  description,
  characteristics,
  color
}: {
  name: string;
  description: string;
  characteristics: string[];
  color: string;
}) {
  const colorClasses: Record<string, string> = {
    cyan: "bg-cyan-600/20 border-cyan-500/30 text-cyan-400",
    purple: "bg-purple-600/20 border-purple-500/30 text-purple-400",
    green: "bg-green-600/20 border-green-500/30 text-green-400"
  };

  return (
    <div className={`border rounded-lg p-4 ${colorClasses[color]}`}>
      <h4 className="text-base font-semibold mb-1">{name}</h4>
      <p className="text-xs text-white/70 mb-3">{description}</p>
      <ul className="space-y-1">
        {characteristics.map((char, index) => (
          <li key={index} className="text-xs text-white/80 flex items-start gap-2">
            <span className="mt-1">•</span>
            <span>{char}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

function StreamingSpec({ title, specs }: { title: string; specs: string[] }) {
  return (
    <div className="bg-black/40 border border-white/10 rounded-lg p-4">
      <h4 className="text-sm font-semibold mb-3 text-white/80">{title}</h4>
      <ul className="space-y-2">
        {specs.map((spec, index) => (
          <li key={index} className="text-xs text-white/70 flex items-start gap-2">
            <span className="text-green-400 mt-0.5">✓</span>
            <span>{spec}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

function ImageFormat({
  type,
  format,
  dimensions,
  fileSize
}: {
  type: string;
  format: string;
  dimensions: string;
  fileSize: string;
}) {
  return (
    <div className="bg-black/40 border border-white/10 rounded p-3">
      <div className="text-sm font-semibold text-white mb-2">{type}</div>
      <div className="space-y-1 text-xs text-white/70">
        <div><span className="text-white/40">Format:</span> {format}</div>
        <div><span className="text-white/40">Dimensions:</span> {dimensions}</div>
        <div><span className="text-white/40">Max Size:</span> {fileSize}</div>
      </div>
    </div>
  );
}

function CachingStrategy({
  tier,
  duration,
  scope,
  notes
}: {
  tier: string;
  duration: string;
  scope: string;
  notes: string;
}) {
  return (
    <div className="bg-black/40 border border-white/10 rounded-lg p-4">
      <h4 className="text-base font-semibold mb-3 text-white">{tier}</h4>
      <div className="space-y-2 text-xs">
        <div>
          <span className="text-white/40">Duration:</span>{" "}
          <span className="text-green-400 font-semibold">{duration}</span>
        </div>
        <div>
          <span className="text-white/40">Scope:</span>{" "}
          <span className="text-white/80">{scope}</span>
        </div>
        <div className="text-white/60 italic">{notes}</div>
      </div>
    </div>
  );
}

function OfflinePackage({ name, contents, size }: { name: string; contents: string[]; size: string }) {
  return (
    <div className="bg-black/40 border border-white/10 rounded-lg p-4">
      <div className="flex items-center justify-between mb-3">
        <h4 className="text-base font-semibold text-white">{name}</h4>
        <span className="px-2 py-1 bg-orange-600/20 border border-orange-500/30 rounded text-xs text-orange-400">
          {size}
        </span>
      </div>
      <ul className="space-y-2">
        {contents.map((item, index) => (
          <li key={index} className="text-xs text-white/80 flex items-start gap-2">
            <span className="text-orange-400 mt-0.5">✓</span>
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

function AccessibilityFeature({
  title,
  description,
  implementation
}: {
  title: string;
  description: string;
  implementation: string[];
}) {
  return (
    <div className="bg-white/5 border border-white/10 rounded-lg p-5">
      <h3 className="text-base font-semibold mb-2 text-white">{title}</h3>
      <p className="text-sm text-white/70 mb-3">{description}</p>
      <div className="space-y-1">
        {implementation.map((item, index) => (
          <div key={index} className="text-xs text-white/60 flex items-start gap-2">
            <span className="text-yellow-400 mt-0.5">•</span>
            <span>{item}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function PerformanceOptimization({ category, optimizations }: { category: string; optimizations: string[] }) {
  return (
    <div className="bg-white/5 border border-white/10 rounded-lg p-5">
      <h3 className="text-base font-semibold mb-3 text-purple-300">{category}</h3>
      <ul className="space-y-2">
        {optimizations.map((opt, index) => (
          <li key={index} className="text-sm text-white/80">
            {opt}
          </li>
        ))}
      </ul>
    </div>
  );
}
