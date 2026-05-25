import { useMemo } from 'react';
import { ScrollView, View, Text, Pressable, StyleSheet, Image } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { LIVE_ITEMS } from '../../data/aggregate';
import { spacing, layout } from '../../constants/theme';

type Ch = { id: string; n: number; title: string; subtitle: string; duration: string; status: 'done' | 'playing' | 'queued' };

const fakeChapters = (count: number, baseTitle: string): Ch[] => {
  const labels = ['Arrival', 'The Threshold', 'Witness', 'The Long Hours', 'Return', 'Reckoning'];
  return Array.from({ length: count }, (_, i) => ({
    id: `ch-${i + 1}`,
    n: i + 1,
    title: labels[i % labels.length],
    subtitle: `${baseTitle} — Part ${i + 1}`,
    duration: `${4 + ((i * 3) % 5)} min`,
    status: i === 0 ? 'done' : i === 1 ? 'playing' : 'queued',
  }));
};

export default function ChapterIndex() {
  const params = useLocalSearchParams<{ id: string | string[] }>();
  const id = Array.isArray(params.id) ? params.id[0] : params.id;
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const item = useMemo(() => LIVE_ITEMS.find((i) => i.id === id), [id]);
  const chapters = useMemo(() => fakeChapters(item?.tags?.length ? Math.min(6, Math.max(3, item.tags.length)) : 5, item?.title || 'Story'), [item]);

  const totalMin = chapters.reduce((s, c) => s + parseInt(c.duration, 10), 0);

  if (!item) {
    return (
      <View style={[styles.root, { justifyContent: 'center', alignItems: 'center' }]}>
        <Text style={{ color: 'rgba(255,255,255,0.5)', marginBottom: spacing.lg }}>Story not found</Text>
        <Pressable onPress={() => router.back()} style={styles.iconBtn}>
          <Ionicons name="arrow-back" size={20} color="#fff" />
        </Pressable>
      </View>
    );
  }

  return (
    <View style={[styles.root, { paddingTop: insets.top }]}>
      {/* Sticky header */}
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} style={styles.iconBtn} accessibilityRole="button" accessibilityLabel="Back">
          <Ionicons name="chevron-back" size={20} color="#fff" />
        </Pressable>
        <Text style={styles.headerTitle} numberOfLines={1}>{item.title}</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView
        contentContainerStyle={[styles.content, { paddingBottom: insets.bottom + 96 }]}
        showsVerticalScrollIndicator={false}
      >
        {/* Hero metadata */}
        <Text style={styles.eyebrow}>
          {item.type === 'music' ? 'MUSIC' : item.type === 'film' ? 'FILM' : item.type === 'collection' ? 'COLLECTION' : 'STORY'}
        </Text>
        <Text style={styles.tocTitle}>Table of Contents</Text>
        <Text style={styles.meta}>{chapters.length} chapters · {totalMin} min</Text>

        {/* Chapter list */}
        <View style={styles.list}>
          {chapters.map((c) => {
            const active = c.status === 'playing';
            return (
              <Pressable
                key={c.id}
                onPress={() => router.push(`/story/${id}`)}
                style={[styles.card, active && styles.cardActive]}
                accessibilityRole="button"
                accessibilityLabel={`Chapter ${c.n}: ${c.title}`}
              >
                <View style={styles.thumb}>
                  {item.coverImage ? (
                    <Image source={{ uri: item.coverImage }} style={StyleSheet.absoluteFillObject} />
                  ) : null}
                  <View style={[StyleSheet.absoluteFillObject, { backgroundColor: 'rgba(0,0,0,0.2)' }]} />
                  {active && (
                    <View style={styles.playBadge}>
                      <Ionicons name="play" size={14} color="#fff" />
                    </View>
                  )}
                  {c.status === 'done' && (
                    <View style={styles.doneDot}>
                      <View style={styles.doneDotInner} />
                    </View>
                  )}
                </View>
                <View style={{ flex: 1, gap: 4 }}>
                  <Text style={styles.chN}>CHAPTER {String(c.n).padStart(2, '0')}</Text>
                  <Text style={styles.chTitle} numberOfLines={1}>{c.title}</Text>
                  <Text style={styles.chSub} numberOfLines={1}>{c.subtitle}</Text>
                  <Text style={styles.chDur}>{c.duration}</Text>
                </View>
              </Pressable>
            );
          })}
        </View>
      </ScrollView>

      {/* Sticky footer CTA */}
      <View style={[styles.footer, { paddingBottom: insets.bottom + spacing.md }]}>
        <Pressable
          onPress={() => router.push(`/story/${id}`)}
          style={({ pressed }) => [styles.resumeBtn, pressed && { opacity: 0.85 }]}
          accessibilityRole="button"
          accessibilityLabel="Resume story"
        >
          <Ionicons name="play" size={16} color="#000" />
          <Text style={styles.resumeText}>RESUME STORY</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#000' },
  header: {
    flexDirection: 'row', alignItems: 'center',
    paddingHorizontal: spacing.xl, paddingBottom: spacing.md,
    borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: 'rgba(255,255,255,0.05)',
    backgroundColor: 'rgba(0,0,0,0.8)',
  },
  headerTitle: { flex: 1, textAlign: 'center', fontSize: 16, color: '#fff', letterSpacing: -0.2, paddingHorizontal: spacing.md },
  iconBtn: {
    width: 40, height: 40, borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderWidth: StyleSheet.hairlineWidth, borderColor: 'rgba(255,255,255,0.1)',
    alignItems: 'center', justifyContent: 'center',
  },
  content: { paddingHorizontal: spacing.xl, paddingTop: spacing.xl, maxWidth: layout.containerMaxWidth, alignSelf: 'center', width: '100%' },

  eyebrow: { fontSize: 11, color: 'rgba(255,255,255,0.4)', letterSpacing: 4, textTransform: 'uppercase', marginBottom: spacing.md },
  tocTitle: { fontSize: 24, fontWeight: '400', color: '#fff', letterSpacing: -0.4, marginBottom: 6 },
  meta: { fontSize: 12, color: 'rgba(255,255,255,0.4)', letterSpacing: 0.5, marginBottom: spacing['2xl'] },

  list: { gap: spacing.md },
  card: {
    flexDirection: 'row', gap: spacing.md,
    padding: spacing.md,
    borderRadius: 16,
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderWidth: StyleSheet.hairlineWidth, borderColor: 'rgba(255,255,255,0.1)',
    alignItems: 'center',
  },
  cardActive: { backgroundColor: 'rgba(255,255,255,0.10)', borderColor: 'rgba(255,255,255,0.2)', borderWidth: 2 },
  thumb: {
    width: 80, height: 80, borderRadius: 12,
    backgroundColor: '#111', overflow: 'hidden',
    alignItems: 'center', justifyContent: 'center',
  },
  playBadge: {
    width: 32, height: 32, borderRadius: 16,
    backgroundColor: 'rgba(0,0,0,0.6)',
    alignItems: 'center', justifyContent: 'center',
  },
  doneDot: {
    position: 'absolute', top: 6, right: 6,
    width: 16, height: 16, borderRadius: 8,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center', justifyContent: 'center',
  },
  doneDotInner: { width: 6, height: 6, borderRadius: 3, backgroundColor: '#fff' },

  chN: { fontSize: 10, color: 'rgba(255,255,255,0.4)', letterSpacing: 2 },
  chTitle: { fontSize: 16, color: '#fff', letterSpacing: -0.2 },
  chSub: { fontSize: 13, color: 'rgba(255,255,255,0.5)' },
  chDur: { fontSize: 11, color: 'rgba(255,255,255,0.3)', letterSpacing: 0.5 },

  footer: {
    position: 'absolute', left: 0, right: 0, bottom: 0,
    paddingHorizontal: spacing.xl, paddingTop: spacing.md,
    backgroundColor: 'rgba(0,0,0,0.9)',
    borderTopWidth: StyleSheet.hairlineWidth, borderTopColor: 'rgba(255,255,255,0.05)',
  },
  resumeBtn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8,
    backgroundColor: '#fff',
    paddingVertical: 16,
    borderRadius: 999,
  },
  resumeText: { fontSize: 13, color: '#000', letterSpacing: 2 },
});
