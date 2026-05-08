import { useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity,
  Platform,
} from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import * as Haptics from 'expo-haptics';
import { Colors } from '../constants/colors';
import { getStoryWorld } from '../data/storyDatabase';
import { useStoryState } from '../contexts/StoryStateContext';

export default function ChapterScreen() {
  const { storyId, chapterId } = useLocalSearchParams<{ storyId: string; chapterId: string }>();
  const insets = useSafeAreaInsets();
  const { state, saveProgress } = useStoryState();
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [activeLanguage, setActiveLanguage] = useState<'en' | 'fr' | 'es'>(state.language as any ?? 'en');
  const [showContext, setShowContext] = useState(false);

  const world = getStoryWorld(storyId);
  const chapter = world?.chapters.find(c => c.id === chapterId);
  const chapterIndex = world?.chapters.findIndex(c => c.id === chapterId) ?? 0;
  const hasNext = chapterIndex < (world?.chapters.length ?? 0) - 1;
  const hasPrev = chapterIndex > 0;

  const title = chapter?.title[activeLanguage] ?? chapter?.title.en ?? 'Chapter';
  const text = chapter?.text[activeLanguage] ?? chapter?.text.en ?? '';
  const contextCards = chapter?.contextCards ?? [];

  const togglePlay = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setIsPlaying(prev => !prev);
  };

  const goNext = () => {
    if (!hasNext || !world) return;
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    const nextChapter = world.chapters[chapterIndex + 1];
    saveProgress(storyId, chapterId);
    router.replace({ pathname: '/chapter', params: { storyId, chapterId: nextChapter.id } });
  };

  const goPrev = () => {
    if (!hasPrev || !world) return;
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    const prevChapter = world.chapters[chapterIndex - 1];
    router.replace({ pathname: '/chapter', params: { storyId, chapterId: prevChapter.id } });
  };

  const langs: ('en' | 'fr' | 'es')[] = (world?.languagesAvailable ?? ['en']) as any;

  if (!chapter || !world) {
    return (
      <View style={[styles.container, { paddingTop: insets.top }]}>
        <TouchableOpacity style={[styles.closeBtn, { top: insets.top + 12 }]} onPress={() => router.back()}>
          <Ionicons name="close" size={22} color={Colors.textSecondary} />
        </TouchableOpacity>
        <View style={styles.errorState}>
          <Text style={styles.errorText}>Chapter not found</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.closeBtn2} onPress={() => { router.back(); }}>
          <Ionicons name="chevron-down" size={22} color={Colors.textSecondary} />
        </TouchableOpacity>
        <View style={styles.headerCenter}>
          <Text style={styles.headerTitle} numberOfLines={1}>{world.title.en}</Text>
          <Text style={styles.headerSub}>Chapter {chapterIndex + 1} of {world.chapterCount}</Text>
        </View>
        <TouchableOpacity
          style={styles.contextToggle}
          onPress={() => setShowContext(!showContext)}
        >
          <Ionicons name="information-circle-outline" size={22} color={contextCards.length > 0 ? Colors.amber : Colors.textMuted} />
        </TouchableOpacity>
      </View>

      {/* Progress bar */}
      <View style={styles.progressBar}>
        {world.chapters.map((ch, i) => (
          <View
            key={ch.id}
            style={[
              styles.progressSegment,
              i < chapterIndex && styles.progressSegmentDone,
              i === chapterIndex && styles.progressSegmentActive,
            ]}
          />
        ))}
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={[styles.scrollContent, { paddingBottom: insets.bottom + 200 }]}
        showsVerticalScrollIndicator={false}
      >
        {/* Chapter title */}
        <View style={styles.chapterHeader}>
          <Text style={styles.chapterNum}>Chapter {chapterIndex + 1}</Text>
          <Text style={styles.chapterTitle}>{title}</Text>
        </View>

        {/* Language switcher */}
        <View style={styles.langSwitcher}>
          {langs.map(lang => (
            <TouchableOpacity
              key={lang}
              style={[styles.langBtn, activeLanguage === lang && styles.langBtnActive]}
              onPress={() => { Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light); setActiveLanguage(lang); }}
            >
              <Text style={[styles.langBtnText, activeLanguage === lang && styles.langBtnTextActive]}>
                {lang.toUpperCase()}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Chapter text */}
        <Text style={styles.chapterText}>{text}</Text>

        {/* Context cards (expandable) */}
        {showContext && contextCards.length > 0 && (
          <View style={styles.contextSection}>
            <Text style={styles.contextHeader}>CULTURAL CONTEXT</Text>
            {contextCards.map(card => (
              <View key={card.id} style={styles.contextCard}>
                <View style={styles.contextTypeRow}>
                  <Ionicons name="globe-outline" size={13} color={Colors.amber} />
                  <Text style={styles.contextType}>{card.type.toUpperCase()}</Text>
                </View>
                <Text style={styles.contextTitle}>{card.title[activeLanguage] ?? card.title.en}</Text>
                <Text style={styles.contextBody}>{card.content[activeLanguage] ?? card.content.en}</Text>
              </View>
            ))}
          </View>
        )}
      </ScrollView>

      {/* Audio Player */}
      <View style={[styles.player, { paddingBottom: insets.bottom + 8 }]}>
        <View style={styles.playerTrack}>
          <View style={[styles.playerFill, { width: `${progress}%` }]} />
        </View>
        <View style={styles.playerControls}>
          <TouchableOpacity
            style={[styles.navBtn, !hasPrev && styles.navBtnDisabled]}
            onPress={goPrev}
            disabled={!hasPrev}
          >
            <Ionicons name="play-skip-back" size={20} color={hasPrev ? Colors.textSecondary : Colors.textMuted} />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.rewindBtn}
            onPress={() => setProgress(Math.max(0, progress - 10))}
          >
            <Ionicons name="play-back-outline" size={20} color={Colors.textSecondary} />
          </TouchableOpacity>

          <TouchableOpacity style={styles.playBtn} onPress={togglePlay}>
            <Ionicons name={isPlaying ? 'pause' : 'play'} size={26} color="#000" />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.rewindBtn}
            onPress={() => setProgress(Math.min(100, progress + 10))}
          >
            <Ionicons name="play-forward-outline" size={20} color={Colors.textSecondary} />
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.navBtn, !hasNext && styles.navBtnDisabled]}
            onPress={goNext}
            disabled={!hasNext}
          >
            <Ionicons name="play-skip-forward" size={20} color={hasNext ? Colors.textSecondary : Colors.textMuted} />
          </TouchableOpacity>
        </View>
        <Text style={styles.playerLabel}>
          {isPlaying ? 'Playing...' : 'Tap play to begin'}
          {' · '}Est. {chapter.estimatedDuration} min
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  closeBtn: {
    position: 'absolute', left: 16, zIndex: 10,
    width: 40, height: 40, borderRadius: 20,
    backgroundColor: Colors.surface, borderWidth: 1, borderColor: Colors.border,
    alignItems: 'center', justifyContent: 'center',
  },
  closeBtn2: {
    width: 36, height: 36, borderRadius: 18,
    backgroundColor: Colors.surface, borderWidth: 1, borderColor: Colors.border,
    alignItems: 'center', justifyContent: 'center',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  headerCenter: { flex: 1 },
  headerTitle: { fontSize: 15, fontFamily: Colors.fontSemiBold, color: Colors.textPrimary },
  headerSub: { fontSize: 11, fontFamily: Colors.fontRegular, color: Colors.textMuted, letterSpacing: 1 },
  contextToggle: { width: 36, height: 36, alignItems: 'center', justifyContent: 'center' },
  progressBar: {
    flexDirection: 'row',
    gap: 3,
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  progressSegment: {
    flex: 1,
    height: 3,
    borderRadius: 2,
    backgroundColor: Colors.border,
  },
  progressSegmentDone: { backgroundColor: Colors.amber },
  progressSegmentActive: { backgroundColor: Colors.amberText },
  scroll: { flex: 1 },
  scrollContent: { paddingHorizontal: 24 },
  chapterHeader: { paddingTop: 20, paddingBottom: 16, gap: 8 },
  chapterNum: { fontSize: 11, fontFamily: Colors.fontRegular, color: Colors.textMuted, letterSpacing: 3 },
  chapterTitle: { fontSize: 26, fontFamily: Colors.fontBold, color: Colors.textPrimary, lineHeight: 32 },
  langSwitcher: {
    flexDirection: 'row',
    backgroundColor: Colors.surface,
    borderRadius: Colors.radiusSm,
    padding: 3,
    alignSelf: 'flex-start',
    marginBottom: 20,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  langBtn: {
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: Colors.radiusSm - 2,
  },
  langBtnActive: { backgroundColor: Colors.amber },
  langBtnText: { fontSize: 11, fontFamily: Colors.fontSemiBold, color: Colors.textMuted, letterSpacing: 1 },
  langBtnTextActive: { color: '#000' },
  chapterText: {
    fontSize: 17,
    fontFamily: Colors.fontRegular,
    color: Colors.textPrimary,
    lineHeight: 28,
    letterSpacing: 0.2,
  },
  contextSection: { marginTop: 32, gap: 12 },
  contextHeader: {
    fontSize: 10,
    fontFamily: Colors.fontSemiBold,
    color: Colors.textMuted,
    letterSpacing: 3,
    marginBottom: 4,
  },
  contextCard: {
    backgroundColor: Colors.surface,
    borderRadius: Colors.radius,
    borderWidth: 1,
    borderColor: Colors.border,
    padding: 16,
    gap: 8,
  },
  contextTypeRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  contextType: { fontSize: 9, fontFamily: Colors.fontSemiBold, color: Colors.amber, letterSpacing: 2 },
  contextTitle: { fontSize: 14, fontFamily: Colors.fontSemiBold, color: Colors.textPrimary },
  contextBody: { fontSize: 13, fontFamily: Colors.fontRegular, color: Colors.textSecondary, lineHeight: 19 },
  player: {
    position: 'absolute',
    bottom: 0, left: 0, right: 0,
    backgroundColor: Colors.background,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
    paddingHorizontal: 20,
    paddingTop: 14,
    gap: 12,
  },
  playerTrack: {
    height: 3,
    backgroundColor: Colors.border,
    borderRadius: 2,
    overflow: 'hidden',
  },
  playerFill: { height: '100%', backgroundColor: Colors.amber, borderRadius: 2 },
  playerControls: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 20,
  },
  navBtn: { width: 36, height: 36, alignItems: 'center', justifyContent: 'center' },
  navBtnDisabled: { opacity: 0.3 },
  rewindBtn: { width: 36, height: 36, alignItems: 'center', justifyContent: 'center' },
  playBtn: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: Colors.amber,
    alignItems: 'center',
    justifyContent: 'center',
  },
  playerLabel: {
    textAlign: 'center',
    fontSize: 11,
    fontFamily: Colors.fontRegular,
    color: Colors.textMuted,
    letterSpacing: 1,
  },
  errorState: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  errorText: { fontSize: 16, fontFamily: Colors.fontRegular, color: Colors.textMuted },
});
