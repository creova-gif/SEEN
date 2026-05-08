import { ScrollView, View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import * as Haptics from 'expo-haptics';
import { Colors } from '../../constants/colors';
import { getStoryWorld } from '../../data/storyDatabase';
import { getContentById } from '../../data/database';
import { useStoryState } from '../../contexts/StoryStateContext';

export default function StoryPreviewScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const insets = useSafeAreaInsets();
  const { enterStoryWorld } = useStoryState();

  const storyWorld = getStoryWorld(id);
  const fallback = getContentById(id);

  const title = storyWorld?.title.en ?? fallback?.title ?? 'Story';
  const description = storyWorld?.description.en ?? fallback?.description ?? '';
  const creator = storyWorld?.creator.en ?? fallback?.creator ?? '';
  const coverImage = storyWorld?.coverImage ?? fallback?.mediaSource ?? '';
  const themes = storyWorld?.culturalThemes ?? fallback?.tags ?? [];
  const duration = storyWorld?.totalDuration ?? fallback?.duration ?? '';
  const chapters = storyWorld?.chapters ?? [];
  const chapterCount = storyWorld?.chapterCount ?? chapters.length;
  const languages = storyWorld?.languagesAvailable ?? fallback?.language ?? ['en'];

  const handleBegin = (chapterId?: string) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    enterStoryWorld(id);
    const firstChapter = chapters[0]?.id ?? 'ch1';
    router.push({
      pathname: '/chapter',
      params: { storyId: id, chapterId: chapterId ?? firstChapter },
    });
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      {/* Back button */}
      <TouchableOpacity style={[styles.backBtn, { top: insets.top + 12 }]} onPress={() => router.back()}>
        <Ionicons name="chevron-down" size={22} color={Colors.textSecondary} />
      </TouchableOpacity>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: insets.bottom + 100 }}>
        {/* Hero */}
        <View style={styles.hero}>
          <Image source={{ uri: coverImage }} style={styles.heroImg} />
          <LinearGradient
            colors={['rgba(0,0,0,0.2)', 'rgba(0,0,0,0.0)', '#000']}
            style={styles.heroGrad}
          />
        </View>

        {/* Content */}
        <View style={styles.content}>
          {/* Type + languages */}
          <View style={styles.topRow}>
            <View style={styles.langRow}>
              {languages.map(lang => (
                <View key={lang} style={styles.langPill}>
                  <Text style={styles.langText}>{lang.toUpperCase()}</Text>
                </View>
              ))}
            </View>
            <View style={styles.metaRow}>
              <Ionicons name="time-outline" size={13} color={Colors.textMuted} />
              <Text style={styles.metaText}>{duration}</Text>
              {chapterCount > 0 && (
                <>
                  <View style={styles.dot} />
                  <Text style={styles.metaText}>{chapterCount} chapters</Text>
                </>
              )}
            </View>
          </View>

          <Text style={styles.title}>{title}</Text>
          <Text style={styles.creator}>{creator}</Text>

          {/* Cultural themes */}
          <View style={styles.themeRow}>
            {themes.slice(0, 3).map(theme => (
              <View key={theme} style={styles.themePill}>
                <Text style={styles.themeText}>{theme}</Text>
              </View>
            ))}
          </View>

          <Text style={styles.description}>{description}</Text>

          {/* Begin button */}
          <TouchableOpacity style={styles.beginBtn} onPress={() => handleBegin()}>
            <Ionicons name="play" size={18} color="#000" />
            <Text style={styles.beginBtnText}>Begin Story</Text>
          </TouchableOpacity>

          {/* Chapter list */}
          {chapters.length > 0 && (
            <View style={styles.chapters}>
              <Text style={styles.chaptersTitle}>CHAPTERS</Text>
              {chapters.map((ch, index) => (
                <TouchableOpacity
                  key={ch.id}
                  style={styles.chapterRow}
                  onPress={() => handleBegin(ch.id)}
                  activeOpacity={0.7}
                >
                  <View style={styles.chapterNum}>
                    <Text style={styles.chapterNumText}>{index + 1}</Text>
                  </View>
                  <View style={styles.chapterInfo}>
                    <Text style={styles.chapterTitle}>{ch.title.en}</Text>
                    <Text style={styles.chapterDesc} numberOfLines={1}>{ch.description.en}</Text>
                    <Text style={styles.chapterDuration}>{ch.estimatedDuration} min</Text>
                  </View>
                  <Ionicons name="play-circle-outline" size={22} color={Colors.textMuted} />
                </TouchableOpacity>
              ))}
            </View>
          )}

          {/* Context cards */}
          {chapters.some(ch => ch.contextCards && ch.contextCards.length > 0) && (
            <View style={styles.contextSection}>
              <Text style={styles.chaptersTitle}>CULTURAL CONTEXT</Text>
              {chapters.flatMap(ch => ch.contextCards ?? []).slice(0, 2).map(card => (
                <View key={card.id} style={styles.contextCard}>
                  <View style={styles.contextTypeRow}>
                    <Ionicons name="information-circle-outline" size={14} color={Colors.amber} />
                    <Text style={styles.contextType}>{card.type.toUpperCase()}</Text>
                  </View>
                  <Text style={styles.contextTitle}>{card.title.en}</Text>
                  <Text style={styles.contextBody}>{card.content.en}</Text>
                </View>
              ))}
            </View>
          )}
        </View>
      </ScrollView>

      {/* Sticky bottom CTA */}
      <View style={[styles.stickyBottom, { paddingBottom: insets.bottom + 12 }]}>
        <TouchableOpacity style={styles.stickyBtn} onPress={() => handleBegin()}>
          <Ionicons name="play" size={16} color="#000" />
          <Text style={styles.stickyBtnText}>Begin Listening</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.bookmarkBtn}>
          <Ionicons name="bookmark-outline" size={20} color={Colors.textSecondary} />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  backBtn: {
    position: 'absolute',
    left: 16,
    zIndex: 10,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0,0,0,0.5)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: Colors.border,
  },
  hero: { height: 320, position: 'relative' },
  heroImg: { width: '100%', height: '100%' },
  heroGrad: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 },
  content: { paddingHorizontal: 20, paddingTop: 0, gap: 14 },
  topRow: { gap: 8 },
  langRow: { flexDirection: 'row', gap: 6 },
  langPill: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 4,
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  langText: { fontSize: 10, fontFamily: Colors.fontSemiBold, color: Colors.textMuted, letterSpacing: 1 },
  metaRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  metaText: { fontSize: 12, fontFamily: Colors.fontRegular, color: Colors.textMuted },
  dot: { width: 2, height: 2, borderRadius: 1, backgroundColor: Colors.textMuted },
  title: { fontSize: 30, fontFamily: Colors.fontBold, color: Colors.textPrimary, lineHeight: 36 },
  creator: { fontSize: 14, fontFamily: Colors.fontRegular, color: Colors.textSecondary },
  themeRow: { flexDirection: 'row', gap: 8, flexWrap: 'wrap' },
  themePill: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: Colors.radiusFull,
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  themeText: { fontSize: 12, fontFamily: Colors.fontMedium, color: Colors.textSecondary },
  description: {
    fontSize: 15,
    fontFamily: Colors.fontRegular,
    color: Colors.textSecondary,
    lineHeight: 23,
  },
  beginBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    backgroundColor: Colors.amber,
    paddingVertical: 16,
    borderRadius: Colors.radius,
    marginTop: 4,
  },
  beginBtnText: { fontSize: 16, fontFamily: Colors.fontSemiBold, color: '#000' },
  chapters: { marginTop: 10, gap: 0 },
  chaptersTitle: {
    fontSize: 10,
    fontFamily: Colors.fontSemiBold,
    color: Colors.textMuted,
    letterSpacing: 3,
    marginBottom: 14,
  },
  chapterRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  chapterNum: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  chapterNumText: { fontSize: 13, fontFamily: Colors.fontSemiBold, color: Colors.textSecondary },
  chapterInfo: { flex: 1, gap: 3 },
  chapterTitle: { fontSize: 15, fontFamily: Colors.fontSemiBold, color: Colors.textPrimary },
  chapterDesc: { fontSize: 12, fontFamily: Colors.fontRegular, color: Colors.textMuted },
  chapterDuration: { fontSize: 11, fontFamily: Colors.fontRegular, color: Colors.amber },
  contextSection: { marginTop: 10, gap: 12 },
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
  stickyBottom: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    gap: 10,
    paddingHorizontal: 16,
    paddingTop: 12,
    backgroundColor: Colors.background,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
  },
  stickyBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: Colors.amber,
    paddingVertical: 14,
    borderRadius: Colors.radius,
  },
  stickyBtnText: { fontSize: 15, fontFamily: Colors.fontSemiBold, color: '#000' },
  bookmarkBtn: {
    width: 50,
    height: 50,
    borderRadius: Colors.radiusSm,
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
