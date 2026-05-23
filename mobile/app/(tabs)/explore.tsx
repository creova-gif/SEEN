import { useMemo, useState } from 'react';
import { ScrollView, View, Text, StyleSheet, Pressable, Image, FlatList } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, radius, typography } from '../../constants/theme';
import { getExploreCategories } from '../../../src/app/data/queries';
import type { ContentItem, ExploreCategory } from '../../../src/app/data/types';

const TYPE_ACCENT: Record<string, string> = {
  music: colors.violet,
  story: colors.amber,
  film: colors.emerald,
  collection: colors.violet,
  archive: colors.amber,
};

const TYPE_ICON: Record<string, any> = {
  music: 'musical-notes-outline',
  story: 'book-outline',
  film: 'film-outline',
  collection: 'albums-outline',
  archive: 'library-outline',
};

export default function Explore() {
  const insets = useSafeAreaInsets();
  const categories = useMemo<ExploreCategory[]>(() => getExploreCategories(), []);
  const totalItems = categories.reduce((n, c) => n + c.items.length, 0);
  const [activeCat, setActiveCat] = useState<string>(categories[0]?.id ?? '');

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={{ paddingTop: insets.top + spacing.lg, paddingBottom: spacing['3xl'] }}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.header}>
        <Text style={styles.eyebrow}>Explore · {totalItems} items</Text>
        <Text style={styles.heading}>The full catalogue.</Text>
      </View>

      {/* Category chip rail */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ gap: spacing.sm, paddingRight: spacing.xl }}
        style={styles.chipRail}
      >
        {categories.map(cat => {
          const active = cat.id === activeCat;
          return (
            <Pressable
              key={cat.id}
              onPress={() => setActiveCat(cat.id)}
              style={[styles.chip, active && styles.chipActive]}
            >
              <Text style={[styles.chipText, active && styles.chipTextActive]}>
                {cat.name} · {cat.items.length}
              </Text>
            </Pressable>
          );
        })}
      </ScrollView>

      {/* Render every category as a horizontal-scroll row */}
      {categories.map(cat => (
        <View key={cat.id} style={styles.section}>
          <View style={styles.sectionHeader}>
            <View style={{ flex: 1 }}>
              <Text style={styles.sectionTitle}>{cat.name}</Text>
              <Text style={styles.sectionDesc}>{cat.description}</Text>
            </View>
            <Text style={styles.sectionCount}>{cat.items.length}</Text>
          </View>

          <FlatList
            data={cat.items}
            keyExtractor={i => i.id}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ gap: spacing.md, paddingRight: spacing.xl }}
            renderItem={({ item }) => <ExploreCard item={item} />}
          />
        </View>
      ))}
    </ScrollView>
  );
}

function ExploreCard({ item }: { item: ContentItem }) {
  const accent = TYPE_ACCENT[item.type];
  return (
    <Pressable style={({ pressed }) => [styles.card, pressed && { opacity: 0.75 }]}>
      {item.mediaSource ? (
        <Image source={{ uri: item.mediaSource }} style={styles.cardImage} />
      ) : (
        <View style={[styles.cardImage, { backgroundColor: colors.surfaceElevated, alignItems: 'center', justifyContent: 'center' }]}>
          <Ionicons name={TYPE_ICON[item.type]} size={28} color={colors.textFaint} />
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
  chip: {
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 999,
    borderWidth: 0.5,
    borderColor: colors.border,
    backgroundColor: colors.surface,
  },
  chipActive: { borderColor: colors.textPrimary, backgroundColor: colors.textPrimary },
  chipText: { ...typography.micro, color: colors.textMuted, fontSize: 10 },
  chipTextActive: { color: colors.background },

  section: { marginBottom: spacing.xl, marginHorizontal: -spacing.xl, paddingLeft: spacing.xl },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    marginBottom: spacing.md,
    paddingRight: spacing.xl,
  },
  sectionTitle: { fontSize: 16, fontWeight: '500', color: colors.textPrimary, letterSpacing: 0.3 },
  sectionDesc: { fontSize: 11, color: colors.textFaint, letterSpacing: 0.5, marginTop: 2 },
  sectionCount: { ...typography.micro, color: colors.textFaint, fontSize: 10 },

  card: {
    width: CARD_W,
    borderRadius: radius.lg,
    overflow: 'hidden',
    backgroundColor: colors.surface,
    borderWidth: 0.5,
    borderColor: colors.border,
  },
  cardImage: { width: CARD_W, height: CARD_W * 0.62 },
  cardBody: { padding: spacing.md, gap: 4 },
  cardTagRow: { flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 4 },
  typeDot: { width: 5, height: 5, borderRadius: 3 },
  cardType: { fontSize: 9, color: colors.textFaint, letterSpacing: 1.5, fontWeight: '600' },
  flag: { fontSize: 9, letterSpacing: 1.5, fontWeight: '600' },
  cardTitle: { fontSize: 13, fontWeight: '500', color: colors.textPrimary, letterSpacing: 0.2, lineHeight: 17 },
  cardMeta: { fontSize: 11, color: colors.textMuted },
  cardDuration: { fontSize: 10, color: colors.textFaint, letterSpacing: 0.5, marginTop: 2 },
});
