import { useMemo, useState } from 'react';
import { ScrollView, View, Text, StyleSheet, Pressable, Image } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, radius, typography } from '../../constants/theme';
import {
  MUSIC_ALL, STORY_ALL, FILM_ALL, COLLECTION_ALL, ARCHIVE_ALL,
  LIVE_ITEMS, PLANNED_ITEMS, CONTENT_SUMMARY, type UnifiedItem,
} from '../../data/aggregate';

const TYPE_ACCENT: Record<string, string> = {
  music: colors.violet, story: colors.amber, film: colors.emerald,
  collection: colors.violet, archive: colors.amber,
};
const TYPE_ICON: Record<string, any> = {
  music: 'musical-notes-outline', story: 'book-outline', film: 'film-outline',
  collection: 'albums-outline', archive: 'library-outline',
};

const SECTIONS = [
  { id: 'featured',     name: 'Featured & Trending',    items: LIVE_ITEMS.filter(i => i.featured || i.trending), desc: 'Editor picks across all media' },
  { id: 'new',          name: 'New Releases',           items: LIVE_ITEMS.filter(i => i.new),                    desc: 'Just landed on SEEN' },
  { id: 'stories',      name: 'Stories',                items: STORY_ALL.filter(i => !i.isPlanned),              desc: 'Multi-chapter audio experiences' },
  { id: 'music',        name: 'Music',                  items: MUSIC_ALL.filter(i => !i.isPlanned),              desc: 'Independent Canadian artists' },
  { id: 'films',        name: 'Films',                  items: FILM_ALL.filter(i => !i.isPlanned),               desc: 'Documentaries & short films' },
  { id: 'collections',  name: 'Curated Collections',    items: COLLECTION_ALL,                                    desc: 'Themed groupings of work' },
  { id: 'archives',     name: 'Institutional Archives', items: ARCHIVE_ALL,                                       desc: 'Cultural heritage partners' },
  { id: 'planned',      name: 'Coming Soon',            items: PLANNED_ITEMS,                                    desc: 'In production for upcoming seasons' },
].filter(s => s.items.length > 0);

export default function Explore() {
  const insets = useSafeAreaInsets();
  const [activeCat, setActiveCat] = useState<string>(SECTIONS[0]?.id ?? '');

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={{ paddingTop: insets.top + spacing.lg, paddingBottom: spacing['3xl'] }}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.header}>
        <Text style={styles.eyebrow}>Explore · {CONTENT_SUMMARY.total} items total</Text>
        <Text style={styles.heading}>The full catalogue.</Text>
      </View>

      <ScrollView
        horizontal showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ gap: spacing.sm, paddingRight: spacing.xl }}
        style={styles.chipRail}
      >
        {SECTIONS.map(cat => {
          const active = cat.id === activeCat;
          return (
            <Pressable key={cat.id} onPress={() => setActiveCat(cat.id)} style={[styles.chip, active && styles.chipActive]}>
              <Text style={[styles.chipText, active && styles.chipTextActive]}>{cat.name} · {cat.items.length}</Text>
            </Pressable>
          );
        })}
      </ScrollView>

      {SECTIONS.map(cat => (
        <View key={cat.id} style={styles.section}>
          <View style={styles.sectionHeader}>
            <View style={{ flex: 1 }}>
              <Text style={styles.sectionTitle}>{cat.name}</Text>
              <Text style={styles.sectionDesc}>{cat.desc}</Text>
            </View>
            <Text style={styles.sectionCount}>{cat.items.length}</Text>
          </View>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: spacing.md, paddingRight: spacing.xl }}>
            {cat.items.map(item => <ExploreCard key={item.id} item={item} />)}
          </ScrollView>
        </View>
      ))}
    </ScrollView>
  );
}

function ExploreCard({ item }: { item: UnifiedItem }) {
  const accent = TYPE_ACCENT[item.type];
  return (
    <Pressable style={({ pressed }) => [styles.card, pressed && { opacity: 0.75 }, item.isPlanned && styles.cardPlanned]}>
      {item.coverImage ? (
        <Image source={{ uri: item.coverImage }} style={styles.cardImage} />
      ) : (
        <View style={[styles.cardImage, { backgroundColor: colors.surfaceElevated, alignItems: 'center', justifyContent: 'center' }]}>
          <Ionicons name={TYPE_ICON[item.type]} size={32} color={colors.textFaint} />
        </View>
      )}
      {item.isPlanned && (
        <View style={styles.plannedRibbon}>
          <Text style={styles.plannedRibbonText}>PLANNED</Text>
        </View>
      )}
      <View style={styles.cardBody}>
        <View style={styles.cardTagRow}>
          <View style={[styles.typeDot, { backgroundColor: accent }]} />
          <Text style={styles.cardType}>{item.type.toUpperCase()}</Text>
          {item.new && <Text style={[styles.flag, { color: accent }]}>· NEW</Text>}
          {item.trending && !item.new && <Text style={[styles.flag, { color: accent }]}>· TRENDING</Text>}
        </View>
        <Text style={styles.cardTitle} numberOfLines={2}>{item.title}</Text>
        <Text style={styles.cardMeta} numberOfLines={1}>{item.creator}</Text>
        <Text style={styles.cardDuration}>{item.duration}</Text>
      </View>
    </Pressable>
  );
}

const CARD_W = 168;
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background, paddingHorizontal: spacing.xl },
  header: { marginBottom: spacing.xl },
  eyebrow: { ...typography.micro, color: colors.textFaint, marginBottom: spacing.md },
  heading: { fontSize: 28, fontWeight: '300', color: colors.textPrimary, lineHeight: 36, letterSpacing: 0.5 },
  chipRail: { marginBottom: spacing.xl, marginHorizontal: -spacing.xl, paddingHorizontal: spacing.xl },
  chip: { paddingVertical: 8, paddingHorizontal: 14, borderRadius: 999, borderWidth: 0.5, borderColor: colors.border, backgroundColor: colors.surface },
  chipActive: { borderColor: colors.textPrimary, backgroundColor: colors.textPrimary },
  chipText: { ...typography.micro, color: colors.textMuted, fontSize: 10 },
  chipTextActive: { color: colors.background },
  section: { marginBottom: spacing.xl, marginHorizontal: -spacing.xl, paddingLeft: spacing.xl },
  sectionHeader: { flexDirection: 'row', alignItems: 'flex-end', marginBottom: spacing.md, paddingRight: spacing.xl },
  sectionTitle: { fontSize: 16, fontWeight: '500', color: colors.textPrimary, letterSpacing: 0.3 },
  sectionDesc: { fontSize: 11, color: colors.textFaint, letterSpacing: 0.5, marginTop: 2 },
  sectionCount: { ...typography.micro, color: colors.textFaint, fontSize: 10 },
  card: { width: CARD_W, borderRadius: radius.lg, overflow: 'hidden', backgroundColor: colors.surface, borderWidth: 0.5, borderColor: colors.border },
  cardPlanned: { opacity: 0.78, borderStyle: 'dashed' },
  cardImage: { width: CARD_W, height: CARD_W * 0.62 },
  plannedRibbon: { position: 'absolute', top: 8, right: 8, paddingHorizontal: 6, paddingVertical: 3, borderRadius: 4, backgroundColor: 'rgba(0,0,0,0.7)' },
  plannedRibbonText: { fontSize: 8, color: colors.textPrimary, letterSpacing: 1.2, fontWeight: '700' },
  cardBody: { padding: spacing.md, gap: 4 },
  cardTagRow: { flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 4 },
  typeDot: { width: 5, height: 5, borderRadius: 3 },
  cardType: { fontSize: 9, color: colors.textFaint, letterSpacing: 1.5, fontWeight: '600' },
  flag: { fontSize: 9, letterSpacing: 1.5, fontWeight: '600' },
  cardTitle: { fontSize: 13, fontWeight: '500', color: colors.textPrimary, letterSpacing: 0.2, lineHeight: 17 },
  cardMeta: { fontSize: 11, color: colors.textMuted },
  cardDuration: { fontSize: 10, color: colors.textFaint, letterSpacing: 0.5, marginTop: 2 },
});
