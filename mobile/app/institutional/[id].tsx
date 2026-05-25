import { useMemo } from 'react';
import { ScrollView, View, Text, Pressable, StyleSheet, Image } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { LIVE_ITEMS } from '../../data/aggregate';
import { spacing, layout } from '../../constants/theme';

export default function InstitutionalCollection() {
  const params = useLocalSearchParams<{ id: string | string[] }>();
  const id = Array.isArray(params.id) ? params.id[0] : params.id;
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const collection = useMemo(() => LIVE_ITEMS.find((i) => i.id === id), [id]);
  // Show a curated sample of related items as the collection's contents.
  const items = useMemo(() => LIVE_ITEMS.filter((i) => i.coverImage && i.id !== id).slice(0, 8), [id]);

  if (!collection) {
    return (
      <View style={[styles.root, { justifyContent: 'center', alignItems: 'center' }]}>
        <Text style={{ color: 'rgba(255,255,255,0.5)', marginBottom: spacing.lg }}>Collection not found</Text>
        <Pressable onPress={() => router.back()} style={styles.iconBtn}>
          <Ionicons name="arrow-back" size={20} color="#fff" />
        </Pressable>
      </View>
    );
  }

  return (
    <View style={styles.root}>
      {/* Hero */}
      <View style={styles.hero}>
        {collection.coverImage ? (
          <Image source={{ uri: collection.coverImage }} style={StyleSheet.absoluteFillObject} />
        ) : (
          <View style={[StyleSheet.absoluteFillObject, { backgroundColor: '#0a0a0a' }]} />
        )}
        <LinearGradient
          colors={['rgba(0,0,0,0.6)', 'rgba(0,0,0,0.4)', '#000']}
          locations={[0, 0.5, 1]}
          style={StyleSheet.absoluteFillObject}
        />
        <View style={[styles.heroHeader, { paddingTop: insets.top + spacing.sm }]}>
          <Pressable onPress={() => router.back()} style={styles.iconBtn} accessibilityRole="button" accessibilityLabel="Back">
            <Ionicons name="chevron-back" size={20} color="#fff" />
          </Pressable>
        </View>
        <View style={styles.heroBottom}>
          <View style={styles.heroRow}>
            <View style={styles.logoSquare}>
              <Ionicons name="library-outline" size={20} color="#fff" />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.eyebrow}>INSTITUTIONAL COLLECTION</Text>
              <Text style={styles.heroTitle} numberOfLines={2}>{collection.title}</Text>
            </View>
          </View>
        </View>
      </View>

      <ScrollView
        contentContainerStyle={[styles.content, { paddingBottom: insets.bottom + spacing['4xl'] }]}
        showsVerticalScrollIndicator={false}
      >
        {/* Curator note */}
        {collection.description ? (
          <Text style={styles.curatorNote}>"{collection.description.slice(0, 220)}{collection.description.length > 220 ? '…' : ''}"</Text>
        ) : null}

        <Text style={styles.sectionH}>In this collection · {items.length}</Text>

        <View style={styles.list}>
          {items.map((it) => (
            <Pressable
              key={it.id}
              onPress={() => router.push(`/story/${it.id}`)}
              style={styles.card}
              accessibilityRole="button"
              accessibilityLabel={it.title}
            >
              <View style={styles.thumb}>
                {it.coverImage ? <Image source={{ uri: it.coverImage }} style={StyleSheet.absoluteFillObject} /> : null}
                <View style={styles.playBadge}>
                  <Ionicons name="play" size={14} color="rgba(255,255,255,0.95)" />
                </View>
                {it.duration ? (
                  <View style={styles.durBadge}>
                    <Text style={styles.durText}>{it.duration}</Text>
                  </View>
                ) : null}
              </View>
              <View style={{ flex: 1, gap: 4 }}>
                <View style={styles.tagRow}>
                  <View style={styles.catBadge}><Text style={styles.catText}>{(it.type || 'STORY').toUpperCase()}</Text></View>
                  <Text style={styles.langText}>EN · FR</Text>
                </View>
                <Text style={styles.cardTitle} numberOfLines={2}>{it.title}</Text>
                {it.creator ? <Text style={styles.cardCreator}>{it.creator}</Text> : null}
              </View>
            </Pressable>
          ))}
        </View>

        {/* Partnership note */}
        <LinearGradient
          colors={['rgba(59,130,246,0.08)', 'rgba(167,139,250,0.08)']}
          start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}
          style={styles.partnerCard}
        >
          <Ionicons name="ribbon-outline" size={16} color="rgba(255,255,255,0.7)" />
          <Text style={styles.partnerText}>
            Curated in partnership with cultural institutions and community archives across Canada.
          </Text>
        </LinearGradient>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#000' },
  hero: { height: 320, position: 'relative' },
  heroHeader: { paddingHorizontal: spacing.xl },
  heroBottom: { position: 'absolute', left: 0, right: 0, bottom: 0, paddingHorizontal: spacing.xl, paddingBottom: spacing['2xl'] },
  heroRow: { flexDirection: 'row', gap: spacing.md, alignItems: 'flex-end' },
  logoSquare: {
    width: 48, height: 48, borderRadius: 10,
    backgroundColor: 'rgba(255,255,255,0.10)',
    borderWidth: StyleSheet.hairlineWidth, borderColor: 'rgba(255,255,255,0.15)',
    alignItems: 'center', justifyContent: 'center',
  },
  eyebrow: { fontSize: 11, color: 'rgba(255,255,255,0.4)', letterSpacing: 4, textTransform: 'uppercase', marginBottom: 6 },
  heroTitle: { fontSize: 22, fontWeight: '400', color: '#fff', letterSpacing: -0.3, lineHeight: 28 },

  iconBtn: {
    width: 40, height: 40, borderRadius: 20,
    backgroundColor: 'rgba(0,0,0,0.45)',
    borderWidth: StyleSheet.hairlineWidth, borderColor: 'rgba(255,255,255,0.1)',
    alignItems: 'center', justifyContent: 'center',
  },

  content: { paddingHorizontal: spacing.xl, paddingTop: spacing.xl, maxWidth: layout.containerMaxWidth, alignSelf: 'center', width: '100%' },
  curatorNote: { fontSize: 14, fontStyle: 'italic', color: 'rgba(255,255,255,0.7)', lineHeight: 22, marginBottom: spacing['2xl'] },

  sectionH: { fontSize: 11, color: 'rgba(255,255,255,0.4)', letterSpacing: 2, textTransform: 'uppercase', marginBottom: spacing.md },
  list: { gap: spacing.md },
  card: {
    flexDirection: 'row', gap: spacing.md,
    padding: spacing.md,
    borderRadius: 16,
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderWidth: StyleSheet.hairlineWidth, borderColor: 'rgba(255,255,255,0.1)',
    alignItems: 'center',
  },
  thumb: {
    width: 96, height: 96, borderRadius: 8,
    backgroundColor: '#111', overflow: 'hidden',
    alignItems: 'center', justifyContent: 'center',
  },
  playBadge: {
    width: 28, height: 28, borderRadius: 14,
    backgroundColor: 'rgba(0,0,0,0.5)',
    alignItems: 'center', justifyContent: 'center',
  },
  durBadge: {
    position: 'absolute', bottom: 4, right: 4,
    paddingHorizontal: 6, paddingVertical: 2,
    borderRadius: 4,
    backgroundColor: 'rgba(0,0,0,0.7)',
  },
  durText: { fontSize: 9, color: '#fff', letterSpacing: 0.5 },

  tagRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  catBadge: {
    paddingHorizontal: 8, paddingVertical: 2,
    backgroundColor: 'rgba(255,255,255,0.10)',
    borderRadius: 4,
  },
  catText: { fontSize: 9, color: '#fff', letterSpacing: 1.5 },
  langText: { fontSize: 10, color: 'rgba(255,255,255,0.4)', letterSpacing: 1 },
  cardTitle: { fontSize: 15, color: '#fff', letterSpacing: -0.2, lineHeight: 20 },
  cardCreator: { fontSize: 13, color: 'rgba(255,255,255,0.5)' },

  partnerCard: {
    flexDirection: 'row', alignItems: 'center', gap: spacing.md,
    marginTop: spacing['2xl'],
    padding: spacing.lg,
    borderRadius: 16,
    borderWidth: StyleSheet.hairlineWidth, borderColor: 'rgba(255,255,255,0.08)',
  },
  partnerText: { flex: 1, fontSize: 12, color: 'rgba(255,255,255,0.7)', lineHeight: 17 },
});
