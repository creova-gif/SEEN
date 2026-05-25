import { useEffect, useMemo, useRef, useState } from 'react';
import {
  View,
  Text,
  Image,
  Pressable,
  StyleSheet,
  ScrollView,
  Animated,
  Easing,
  Platform,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Audio, AVPlaybackStatus } from 'expo-av';
import { WebView } from 'react-native-webview';
import { LIVE_ITEMS, type UnifiedItem } from '../../data/aggregate';

// Real audio playback is attempted for hosted MP3/OGG/WAV sources only.
// Spotify/Soundcloud embeds and items without an audio source fall back
// to a simulated playback ticker so the UI stays alive.
const isPlayableAudio = (src?: string): boolean => {
  if (!src) return false;
  if (/spotify\.com|soundcloud\.com|youtube\.com|youtu\.be/i.test(src)) return false;
  return /\.(mp3|ogg|wav|m4a|aac)(\?.*)?$/i.test(src);
};
import { colors, spacing, typography, radius, layout } from '../../constants/theme';

type LangCode = 'en' | 'fr' | 'es';
const LANGS: { code: LangCode; label: string }[] = [
  { code: 'en', label: 'EN' },
  { code: 'fr', label: 'FR' },
  { code: 'es', label: 'ES' },
];

const REACTIONS = ['❤️', '🔥', '💫', '😢', '🙏'] as const;
type Reaction = { id: string; emoji: string; position: number; t: number };

const fmtTime = (s: number) => {
  if (!isFinite(s) || s < 0) s = 0;
  const m = Math.floor(s / 60);
  const sec = Math.floor(s % 60).toString().padStart(2, '0');
  return `${m}:${sec}`;
};

// Parse "12 min" / "3:45" / "42 min" -> seconds
const parseDuration = (d?: string): number => {
  if (!d) return 240;
  const m = d.match(/(\d+)\s*min/i);
  if (m) return parseInt(m[1], 10) * 60;
  const t = d.match(/^(\d+):(\d+)/);
  if (t) return parseInt(t[1], 10) * 60 + parseInt(t[2], 10);
  return 240;
};

export default function StoryChapter() {
  const params = useLocalSearchParams<{ id: string | string[] }>();
  const id = Array.isArray(params.id) ? params.id[0] : params.id;
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const item: UnifiedItem | undefined = useMemo(
    () => LIVE_ITEMS.find((i) => i.id === id),
    [id],
  );

  // Serialize AsyncStorage writes so bursts of reactions don't lose entries
  // due to interleaved get→mutate→set sequences.
  const writeChain = useRef<Promise<void>>(Promise.resolve());
  // Track the language-switch timer so we can cancel it on rapid switches
  // and on unmount, avoiding state updates after unmount.
  const langTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  useEffect(() => {
    return () => {
      if (langTimer.current) clearTimeout(langTimer.current);
    };
  }, []);

  const fallbackDur = useMemo(() => parseDuration(item?.duration), [item]);
  const useRealAudio = isPlayableAudio(item?.audioSrc);
  const isEmbed = item?.audioSrc && /spotify\.com|soundcloud\.com|youtube\.com|youtu\.be/i.test(item.audioSrc);

  const getEmbedUrl = (src: string) => {
    if (src.includes('spotify.com/track/')) return src.replace('spotify.com/track/', 'open.spotify.com/embed/track/');
    if (src.includes('spotify.com/episode/')) return src.replace('spotify.com/episode/', 'open.spotify.com/embed/episode/');
    if (src.includes('youtube.com/watch?v=')) return src.replace('youtube.com/watch?v=', 'youtube.com/embed/').split('&')[0];
    if (src.includes('youtu.be/')) return src.replace('youtu.be/', 'youtube.com/embed/').split('?')[0];
    return src;
  };

  const [language, setLanguage] = useState<LangCode>('en');
  const [langSwitching, setLangSwitching] = useState<LangCode | null>(null);
  const [captionsOn, setCaptionsOn] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [position, setPosition] = useState(0); // seconds
  const [realDuration, setRealDuration] = useState<number | null>(null);
  const [showReactionPicker, setShowReactionPicker] = useState(false);
  const [reactions, setReactions] = useState<Reaction[]>([]);
  const reactionFlash = useRef(new Animated.Value(0)).current;
  const [soundReady, setSoundReady] = useState(false);
  const [soundLoadFailed, setSoundLoadFailed] = useState(false);
  const soundRef = useRef<Audio.Sound | null>(null);

  // Use simulated ticker whenever there is no real, ready audio backing the UI.
  const useSimulated = !useRealAudio || !soundReady || soundLoadFailed;
  const totalSec = realDuration ?? fallbackDur;

  // Load saved reactions for this story
  useEffect(() => {
    if (!id) return;
    AsyncStorage.getItem('seen_reactions')
      .then((raw) => {
        if (!raw) return;
        try {
          const all = JSON.parse(raw) as Array<Reaction & { storyId: string }>;
          setReactions(all.filter((r) => r.storyId === id));
        } catch {}
      })
      .catch(() => {});
  }, [id]);

  // Reset playback state whenever the item/source changes so the previous
  // item's duration/position can't leak into the new one.
  useEffect(() => {
    setPosition(0);
    setIsPlaying(false);
    setRealDuration(null);
    setSoundReady(false);
    setSoundLoadFailed(false);
  }, [item?.id, item?.audioSrc]);

  // Real audio: load Audio.Sound for hosted MP3/OGG/WAV sources.
  useEffect(() => {
    if (!useRealAudio || !item?.audioSrc) return;
    let cancelled = false;
    let local: Audio.Sound | null = null;
    (async () => {
      try {
        await Audio.setAudioModeAsync({ playsInSilentModeIOS: true, staysActiveInBackground: false });
        const { sound } = await Audio.Sound.createAsync(
          { uri: item.audioSrc! },
          { shouldPlay: false, progressUpdateIntervalMillis: 500 },
          (status: AVPlaybackStatus) => {
            if (cancelled || !status.isLoaded) return;
            if (typeof status.durationMillis === 'number') {
              setRealDuration(status.durationMillis / 1000);
            }
            setPosition(status.positionMillis / 1000);
            setIsPlaying(status.isPlaying);
            if (status.didJustFinish) setIsPlaying(false);
          },
        );
        if (cancelled) {
          await sound.unloadAsync();
          return;
        }
        local = sound;
        soundRef.current = sound;
        setSoundReady(true);
      } catch {
        // Network/CORS/codec failure — flip into simulated playback.
        if (!cancelled) setSoundLoadFailed(true);
      }
    })();
    return () => {
      cancelled = true;
      soundRef.current = null;
      setSoundReady(false);
      if (local) {
        local.unloadAsync().catch(() => {});
      }
    };
  }, [item?.audioSrc, useRealAudio]);

  // Simulated playback ticker — used when there is no playable real audio
  // source, or when the real audio failed to load / isn't ready yet.
  useEffect(() => {
    if (!useSimulated) return;
    if (!isPlaying) return;
    const t = setInterval(() => {
      setPosition((p) => {
        const next = p + 0.5;
        if (next >= totalSec) {
          setIsPlaying(false);
          return totalSec;
        }
        return next;
      });
    }, 500);
    return () => clearInterval(t);
  }, [isPlaying, totalSec, useSimulated]);

  const handleTogglePlay = async () => {
    if (!useSimulated && soundRef.current) {
      try {
        if (isPlaying) await soundRef.current.pauseAsync();
        else await soundRef.current.playAsync();
        return;
      } catch {}
    }
    setIsPlaying((p) => !p);
  };

  const handleSeek = async (seconds: number) => {
    const clamped = Math.max(0, Math.min(totalSec, seconds));
    if (!useSimulated && soundRef.current) {
      try {
        await soundRef.current.setPositionAsync(clamped * 1000);
        return;
      } catch {}
    }
    setPosition(clamped);
  };

  // Pulse the reaction flash whenever a new reaction is added
  const flashReaction = () => {
    reactionFlash.setValue(1);
    Animated.timing(reactionFlash, {
      toValue: 0,
      duration: 1200,
      easing: Easing.out(Easing.quad),
      useNativeDriver: false,
    }).start();
  };

  const addReaction = (emoji: string) => {
    if (!id) return;
    const newR: Reaction = {
      id: `r_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
      emoji,
      position: totalSec > 0 ? position / totalSec : 0,
      t: Date.now(),
    };
    // Functional update — safe against bursty taps that share a stale closure.
    setReactions((prev) => [...prev, newR]);
    setShowReactionPicker(false);
    flashReaction();
    // Chain writes so the next save always sees the previous one's effect.
    writeChain.current = writeChain.current
      .then(async () => {
        try {
          const raw = await AsyncStorage.getItem('seen_reactions');
          const arr = raw ? (JSON.parse(raw) as any[]) : [];
          arr.push({ ...newR, storyId: id });
          await AsyncStorage.setItem('seen_reactions', JSON.stringify(arr));
        } catch {}
      })
      .catch(() => {});
  };

  const switchLanguage = (code: LangCode) => {
    if (code === language) return;
    if (langTimer.current) clearTimeout(langTimer.current);
    setLangSwitching(code);
    langTimer.current = setTimeout(() => {
      setLanguage(code);
      setLangSwitching(null);
      langTimer.current = null;
    }, 1200);
  };

  if (!item) {
    return (
      <View style={[styles.root, { justifyContent: 'center', alignItems: 'center' }]}>
        <Text style={{ color: colors.textMuted, marginBottom: spacing.lg }}>Story not found</Text>
        <Pressable
          onPress={() => router.back()}
          style={styles.iconBtn}
          accessibilityRole="button"
          accessibilityLabel="Go back"
        >
          <Ionicons name="arrow-back" size={20} color="#fff" />
        </Pressable>
      </View>
    );
  }

  const progress = totalSec > 0 ? Math.min(position / totalSec, 1) : 0;

  return (
    <View style={styles.root}>
      {/* Background image with cinematic scrim */}
      {item.coverImage ? (
        <Image source={{ uri: item.coverImage }} style={StyleSheet.absoluteFillObject} />
      ) : (
        <View style={[StyleSheet.absoluteFillObject, { backgroundColor: '#0a0a0a' }]} />
      )}
      <LinearGradient
        colors={['rgba(0,0,0,0.70)', 'rgba(0,0,0,0.40)', '#000000']}
        locations={[0, 0.45, 1]}
        style={StyleSheet.absoluteFillObject}
      />

      {/* Top controls */}
      <View style={[styles.topRow, { paddingTop: insets.top + spacing.sm }]}>
        <Pressable
          onPress={() => router.back()}
          style={styles.iconBtn}
          accessibilityRole="button"
          accessibilityLabel="Close player"
        >
          <Ionicons name="arrow-back" size={20} color="#fff" />
        </Pressable>

        <View style={styles.topRight}>
          <Pressable
            onPress={() => setCaptionsOn((v) => !v)}
            style={[styles.iconBtn, captionsOn && styles.iconBtnActive]}
            accessibilityRole="button"
            accessibilityLabel={captionsOn ? 'Hide captions' : 'Show captions'}
          >
            <Ionicons name={captionsOn ? 'mic' : 'mic-off-outline'} size={18} color="#fff" />
          </Pressable>
          <Pressable
            onPress={() => setShowReactionPicker((v) => !v)}
            style={[styles.iconBtn, showReactionPicker && styles.iconBtnActive]}
            accessibilityRole="button"
            accessibilityLabel="React to this moment"
          >
            <Ionicons name="happy-outline" size={18} color="#fff" />
          </Pressable>
        </View>
      </View>

      {/* Reaction picker bar */}
      {showReactionPicker && (
        <View style={[styles.reactionPicker, { top: insets.top + 60 }]}>
          {REACTIONS.map((emoji) => (
            <Pressable
              key={emoji}
              onPress={() => addReaction(emoji)}
              style={({ pressed }) => [styles.reactionBtn, pressed && { opacity: 0.5 }]}
              accessibilityRole="button"
              accessibilityLabel={`React with ${emoji}`}
            >
              <Text style={{ fontSize: 24 }}>{emoji}</Text>
            </Pressable>
          ))}
        </View>
      )}

      {/* Language switching overlay */}
      {langSwitching && (
        <View style={styles.langSwitchOverlay}>
          <View style={styles.langSwitchPill}>
            <Ionicons name="globe-outline" size={14} color={colors.textPrimary} />
            <Text style={styles.langSwitchText}>
              Loading {langSwitching.toUpperCase()} track…
            </Text>
          </View>
        </View>
      )}

      {/* Main content (scrollable for long descriptions) */}
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={[
          styles.scrollContent,
          { paddingTop: insets.top + 80, paddingBottom: 220 },
        ]}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.eyebrow}>
          {item.type === 'music' ? 'Music' : item.type === 'film' ? 'Film' : item.type === 'collection' ? 'Collection' : item.type === 'archive' ? 'Archive' : 'Story'}
        </Text>
        <Text style={styles.title}>{item.title}</Text>
        {item.creator ? <Text style={styles.byline}>by {item.creator}</Text> : null}

        <Text style={styles.body}>{item.description}</Text>

        {/* Caption card */}
        {captionsOn && (
          <View style={styles.captionCard}>
            <Text style={styles.captionLabel}>Live captions</Text>
            <Text style={styles.captionText}>
              {item.description.length > 140 ? `${item.description.slice(0, 140)}…` : item.description}
            </Text>
          </View>
        )}

        {/* Tag pills */}
        {item.tags?.length > 0 && (
          <View style={styles.tagRow}>
            {item.tags.slice(0, 6).map((tag) => (
              <View key={tag} style={styles.tagPill}>
                <Text style={styles.tagText}>{tag}</Text>
              </View>
            ))}
          </View>
        )}

        {/* Embedded Player */}
        {isEmbed && item.audioSrc && (
          <View style={styles.embedContainer}>
            <WebView
              source={{ uri: getEmbedUrl(item.audioSrc) }}
              style={{ flex: 1, backgroundColor: 'transparent' }}
              scrollEnabled={false}
              allowsInlineMediaPlayback
              mediaPlaybackRequiresUserAction={false}
            />
          </View>
        )}
      </ScrollView>

      {/* Bottom controls */}
      <View style={[styles.bottomBar, { paddingBottom: insets.bottom + spacing.lg }]}>
        <LinearGradient
          colors={['transparent', 'rgba(0,0,0,0.85)', '#000']}
          locations={[0, 0.4, 1]}
          style={StyleSheet.absoluteFillObject}
        />

        {/* Language pills */}
        <View style={styles.langRow}>
          {LANGS.map((l) => {
            const active = l.code === language;
            return (
              <Pressable
                key={l.code}
                onPress={() => switchLanguage(l.code)}
                style={[styles.langPill, active && styles.langPillActive]}
                accessibilityRole="button"
                accessibilityLabel={`Switch to ${l.label} audio track`}
              >
                <Text style={[styles.langPillText, active && styles.langPillTextActive]}>
                  {l.label}
                </Text>
              </Pressable>
            );
          })}
        </View>

        {/* Scrubber + reactions overlay (only if not an embed) */}
        {!isEmbed && (
          <>
            <View style={styles.scrubberWrap}>
              {/* Floating reaction emojis at their timestamps */}
              <View style={styles.reactionsLayer} pointerEvents="none">
                {reactions.map((r) => (
                  <Text
                    key={r.id}
                    style={[
                      styles.floatingEmoji,
                      { left: `${Math.max(0, Math.min(100, r.position * 100))}%` },
                    ]}
                  >
                    {r.emoji}
                  </Text>
                ))}
              </View>

              <View style={styles.scrubberTrack}>
                <View style={[styles.scrubberFill, { width: `${progress * 100}%` }]} />
                <View style={[styles.scrubberThumb, { left: `${progress * 100}%` }]} />
              </View>
              <View style={styles.scrubberTimes}>
                <Text style={styles.timeText}>{fmtTime(position)}</Text>
                <Text style={styles.timeText}>{fmtTime(totalSec)}</Text>
              </View>
            </View>

            {/* Transport controls */}
            <View style={styles.transport}>
              <Pressable
                onPress={() => handleSeek(position - 15)}
                style={styles.transportBtn}
                accessibilityRole="button"
                accessibilityLabel="Back 15 seconds"
              >
                <Ionicons name="play-back" size={20} color="#fff" />
              </Pressable>

              <Pressable
                onPress={handleTogglePlay}
                style={styles.playBtn}
                accessibilityRole="button"
                accessibilityLabel={isPlaying ? 'Pause' : 'Play'}
              >
                <Ionicons name={isPlaying ? 'pause' : 'play'} size={28} color="#000" style={!isPlaying && { marginLeft: 3 }} />
              </Pressable>

              <Pressable
                onPress={() => handleSeek(position + 15)}
                style={styles.transportBtn}
                accessibilityRole="button"
                accessibilityLabel="Forward 15 seconds"
              >
                <Ionicons name="play-forward" size={20} color="#fff" />
              </Pressable>
            </View>
          </>
        )}

        {/* Reaction flash */}
        <Animated.View
          style={[
            styles.reactionFlash,
            {
              opacity: reactionFlash,
              transform: [
                {
                  translateY: reactionFlash.interpolate({
                    inputRange: [0, 1],
                    outputRange: [0, -20],
                  }),
                },
              ],
            },
          ]}
          pointerEvents="none"
        >
          <Text style={styles.reactionFlashText}>Reaction saved at {fmtTime(position)}</Text>
        </Animated.View>
      </View>

      {/* Web note: real audio playback requires a hosted MP3/OGG source.
          On items with audioSrc this UI will be wired to expo-av in a follow-up. */}
      {Platform.OS === 'web' && !item.audioSrc && null}
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#000' },

  topRow: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.xl,
    paddingBottom: spacing.sm,
    maxWidth: layout.containerMaxWidth,
    alignSelf: 'center',
    width: '100%',
  },
  topRight: { flexDirection: 'row', gap: spacing.sm },
  iconBtn: {
    width: 40,
    height: 40,
    borderRadius: radius.full,
    backgroundColor: 'rgba(0,0,0,0.45)',
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconBtnActive: {
    backgroundColor: 'rgba(255,255,255,0.15)',
    borderColor: 'rgba(255,255,255,0.25)',
  },

  reactionPicker: {
    position: 'absolute',
    right: spacing.xl,
    zIndex: 30,
    flexDirection: 'row',
    gap: spacing.xs,
    backgroundColor: 'rgba(0,0,0,0.75)',
    borderRadius: radius.full,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.borderStrong,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
  },
  reactionBtn: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },

  langSwitchOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 25,
    alignItems: 'center',
    paddingTop: 120,
  },
  langSwitchPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    backgroundColor: 'rgba(0,0,0,0.85)',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
    borderRadius: radius.full,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.borderStrong,
  },
  langSwitchText: { ...typography.micro, color: colors.textPrimary, fontSize: 11 },

  scrollContent: {
    paddingHorizontal: spacing.xl,
    maxWidth: layout.containerMaxWidth,
    alignSelf: 'center',
    width: '100%',
  },
  eyebrow: { ...typography.micro, color: 'rgba(255,255,255,0.4)', fontSize: 11, letterSpacing: 4, textTransform: 'uppercase', marginBottom: spacing.md },
  title: { ...typography.h1, color: colors.textPrimary, fontSize: 30, lineHeight: 36, letterSpacing: -0.5, fontWeight: '400', marginBottom: spacing.sm },
  byline: { ...typography.body, color: 'rgba(255,255,255,0.5)', fontSize: 14, marginBottom: spacing.xl },
  body: { ...typography.body, color: 'rgba(255,255,255,0.7)', lineHeight: 24, fontSize: 15 },

  captionCard: {
    marginTop: spacing.xl,
    padding: spacing.lg,
    borderRadius: radius.lg,
    backgroundColor: 'rgba(0,0,0,0.55)',
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.border,
  },
  captionLabel: { ...typography.microSm, color: colors.textWhisper, marginBottom: spacing.sm },
  captionText: { ...typography.bodySm, color: colors.textHigh, lineHeight: 20 },

  tagRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
    marginTop: spacing['2xl'],
  },
  tagPill: {
    paddingHorizontal: spacing.md,
    paddingVertical: 4,
    borderRadius: radius.full,
    backgroundColor: 'rgba(255,255,255,0.06)',
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.border,
  },
  tagText: { ...typography.microSm, color: colors.textMuted, fontSize: 9 },

  embedContainer: {
    height: 160,
    marginTop: spacing.xl,
    borderRadius: radius.lg,
    overflow: 'hidden',
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.border,
  },

  bottomBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: spacing.xl,
    paddingTop: spacing['2xl'],
    maxWidth: layout.containerMaxWidth,
    alignSelf: 'center',
    width: '100%',
  },
  langRow: {
    flexDirection: 'row',
    gap: spacing.sm,
    justifyContent: 'center',
    marginBottom: spacing.lg,
  },
  langPill: {
    paddingHorizontal: spacing.md,
    paddingVertical: 5,
    borderRadius: radius.full,
    backgroundColor: 'rgba(255,255,255,0.06)',
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.border,
  },
  langPillActive: {
    backgroundColor: 'rgba(255,255,255,0.15)',
    borderColor: 'rgba(255,255,255,0.25)',
  },
  langPillText: { ...typography.micro, color: colors.textMuted, fontSize: 9, letterSpacing: 2, textTransform: 'uppercase' },
  langPillTextActive: { color: colors.textPrimary },

  scrubberWrap: { marginBottom: spacing.lg, position: 'relative' },
  reactionsLayer: {
    position: 'absolute',
    top: -22,
    left: 0,
    right: 0,
    height: 22,
  },
  floatingEmoji: {
    position: 'absolute',
    fontSize: 14,
    marginLeft: -7,
  },
  scrubberTrack: {
    height: 3,
    borderRadius: radius.full,
    backgroundColor: 'rgba(255,255,255,0.15)',
    position: 'relative',
  },
  scrubberFill: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    backgroundColor: '#fff',
    borderRadius: radius.full,
  },
  scrubberThumb: {
    position: 'absolute',
    top: -4,
    width: 11,
    height: 11,
    borderRadius: radius.full,
    backgroundColor: '#fff',
    marginLeft: -5.5,
  },
  scrubberTimes: { flexDirection: 'row', justifyContent: 'space-between', marginTop: spacing.sm },
  timeText: { ...typography.microSm, color: colors.textFaint, fontSize: 10 },

  transport: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing['2xl'],
    marginTop: spacing.sm,
  },
  transportBtn: {
    width: 48,
    height: 48,
    borderRadius: radius.full,
    alignItems: 'center',
    justifyContent: 'center',
  },
  playBtn: {
    width: 64,
    height: 64,
    borderRadius: radius.full,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#fff',
    shadowOpacity: 0.3,
    shadowRadius: 18,
    shadowOffset: { width: 0, height: 0 },
  },

  reactionFlash: {
    position: 'absolute',
    top: -8,
    alignSelf: 'center',
    paddingHorizontal: spacing.md,
    paddingVertical: 4,
    borderRadius: radius.full,
    backgroundColor: 'rgba(0,0,0,0.7)',
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: 'rgba(255,255,255,0.2)',
  },
  reactionFlashText: { ...typography.microSm, color: '#fff', fontSize: 9, letterSpacing: 1 },
});
