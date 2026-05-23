import { useMemo, useState } from 'react';
import { ScrollView, View, Text, Pressable, StyleSheet, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LIVE_ITEMS, PLANNED_ITEMS, CONTENT_SUMMARY, type UnifiedItem } from '../../data/aggregate';
import { colors, spacing, radius, typography, layout } from '../../constants/theme';

const TABS = [
  { id: 'saved', label: 'Saved' },
  { id: 'continue', label: 'Continue Listening' },
  { id: 'collections', label: 'My Collections' },
] as const;

type TabId = (typeof TABS)[number]['id'];

const TYPE_ICON: Record<string, keyof typeof Ionicons.glyphMap> = {
  music: 'musical-notes-outline',
  story: 'book-outline',
  film: 'film-outline',
  collection: 'albums-outline',
  archive: 'library-outline',
};

export default function Library() {
  const [tab, setTab] = useState<TabId>('saved');
  const data = useMemo(() => {
    if (tab === 'saved') return LIVE_ITEMS.slice(2, 5);
    if (tab === 'continue') return LIVE_ITEMS.slice(6, 8);
    if (tab === 'collections') return LIVE_ITEMS.filter(i => i.type === 'collection').slice(0, 3);
    return [];
  }, [tab]);

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
      <Text style={styles.heading}>Your Library</Text>
      <Text style={styles.subheading}>
        Your personal archive
      </Text>

      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom: spacing.xl }} contentContainerStyle={{ gap: spacing.sm, paddingRight: spacing.xl }}>
        {TABS.map(t => {
          const active = tab === t.id;
          return (
            <Pressable
              key={t.id}
              onPress={() => setTab(t.id)}
              style={({ pressed }) => [styles.tab, active && styles.tabActive, pressed && { opacity: 0.7 }]}
            >
              <Text style={[styles.tabText, active && styles.tabTextActive]}>{t.label}</Text>
            </Pressable>
          );
        })}
      </ScrollView>

      {data.length === 0 ? (
        <View style={styles.empty}>
          <Ionicons name="bookmark-outline" size={36} color={colors.textWhisper} />
          <Text style={styles.emptyText}>Nothing here yet</Text>
          <Text style={styles.emptySub}>Tap the bookmark icon on any story to save it.</Text>
        </View>
      ) : (
        <View style={{ gap: spacing.md }}>
          {data.map(item => (
            <Pressable key={item.id} style={({ pressed }) => [styles.row, pressed && { opacity: 0.7 }]}>
              {item.coverImage ? (
                <Image source={{ uri: item.coverImage }} style={styles.thumb} />
              ) : (
                <View style={[styles.thumb, styles.thumbFallback]}>
                  <Ionicons name={TYPE_ICON[item.type]} size={24} color={colors.textFaint} />
                </View>
              )}
              <View style={{ flex: 1 }}>
                <Text style={styles.rowEyebrow}>
                  {item.type.toUpperCase()}{item.isPlanned ? ' · COMING SOON' : item.featured ? ' · FEATURED' : item.new ? ' · NEW' : item.trending ? ' · TRENDING' : ''}
                </Text>
                <Text style={styles.rowTitle} numberOfLines={2}>{item.title}</Text>
                <Text style={styles.rowMeta} numberOfLines={1}>{item.creator}{item.duration ? ` · ${item.duration}` : ''}</Text>
              </View>
              <Ionicons
                name={item.isPlanned ? 'time-outline' : 'play-circle-outline'}
                size={28}
                color={item.isPlanned ? colors.textWhisper : colors.textSecondary}
              />
            </Pressable>
          ))}
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  content: { paddingHorizontal: spacing.xl, paddingTop: spacing.lg, paddingBottom: spacing['4xl'], maxWidth: layout.containerMaxWidth, alignSelf: 'center', width: '100%' },
  heading: { fontSize: 32, fontWeight: '300', letterSpacing: -0.5, color: colors.textPrimary, marginBottom: 6 },
  subheading: { ...typography.bodySm, color: colors.textMuted, marginBottom: spacing.xl },
  tab: {
    paddingVertical: 8, paddingHorizontal: 14,
    borderRadius: radius.full,
    backgroundColor: colors.surface,
    borderWidth: StyleSheet.hairlineWidth, borderColor: colors.border,
  },
  tabActive: { backgroundColor: colors.textPrimary, borderColor: colors.textPrimary },
  tabText: { ...typography.micro, fontSize: 10, color: colors.textSecondary },
  tabTextActive: { color: '#000' },
  row: {
    flexDirection: 'row', alignItems: 'center', gap: spacing.md,
    padding: spacing.md,
    borderRadius: radius.lg,
    backgroundColor: colors.surface,
    borderWidth: StyleSheet.hairlineWidth, borderColor: colors.border,
  },
  thumb: { width: 60, height: 60, borderRadius: radius.md },
  thumbFallback: { backgroundColor: 'rgba(255,255,255,0.04)', alignItems: 'center', justifyContent: 'center' },
  rowEyebrow: { ...typography.microSm, color: colors.textFaint, fontSize: 9, marginBottom: 4 },
  rowTitle: { fontSize: 14, color: colors.textPrimary, fontWeight: '500', letterSpacing: 0.2 },
  rowMeta: { ...typography.bodySm, color: colors.textFaint, fontSize: 11, marginTop: 2 },
  empty: { alignItems: 'center', paddingTop: spacing['4xl'], gap: spacing.md },
  emptyText: { fontSize: 16, color: colors.textMuted, fontWeight: '400' },
  emptySub: { ...typography.bodySm, color: colors.textWhisper, textAlign: 'center', maxWidth: 280 },
});
