import { useMemo, useState } from 'react';
import { ScrollView, View, Text, Pressable, StyleSheet, Image } from 'react-native';
import { Bookmark, Clock } from 'lucide-react-native';
import { LIVE_ITEMS, type UnifiedItem } from '../../data/aggregate';
import { colors, spacing, typography, layout } from '../../constants/theme';

const TABS = [
  { id: 'progress', label: 'In progress', color: '#6F9BCD' },
  { id: 'saved', label: 'Saved', color: '#fff' },
  { id: 'downloads', label: 'Downloads', color: '#E8B86F' },
  { id: 'collections', label: 'Collections', color: '#B86FCD' },
] as const;

type TabId = (typeof TABS)[number]['id'];

const typeLabel = (t: UnifiedItem['type']) =>
  ({ music: 'Music', story: 'Story', film: 'Film', collection: 'Collection', archive: 'Archive' }[t] ?? '');

export default function Library() {
  const [tab, setTab] = useState<TabId>('progress');

  const data = useMemo(() => {
    if (tab === 'progress') return LIVE_ITEMS.slice(0, 3).map(i => ({ ...i, progress: 0.45 + Math.random() * 0.4 }));
    if (tab === 'saved') return LIVE_ITEMS.slice(2, 6);
    if (tab === 'downloads') return LIVE_ITEMS.slice(4, 7).map(i => ({ ...i, daysLeft: 12 + Math.floor(Math.random() * 18) }));
    if (tab === 'collections') return LIVE_ITEMS.filter(i => i.type === 'collection').slice(0, 4);
    return [];
  }, [tab]);

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
      <Text style={styles.heading}>Your Library</Text>
      <Text style={styles.subheading}>Your personal archive of stories, downloads & collections</Text>

      {/* Presence indicator tabs — large numbers with coloured glow per source */}
      <View style={styles.tabsRow}>
        {TABS.map(t => {
          const active = tab === t.id;
          const count = t.id === 'progress' ? 3 : t.id === 'saved' ? LIVE_ITEMS.slice(2, 6).length : t.id === 'downloads' ? 3 : LIVE_ITEMS.filter(i => i.type === 'collection').length;
          return (
            <Pressable
              key={t.id}
              onPress={() => setTab(t.id)}
              style={({ pressed }) => [styles.tabCard, active && { borderColor: t.color + '55', backgroundColor: t.color + '0D' }, pressed && { opacity: 0.7 }]}
            >
              <Text style={[styles.tabCount, { color: active ? t.color : colors.textPrimary }]}>{count}</Text>
              <Text style={styles.tabLabel}>{t.label}</Text>
            </Pressable>
          );
        })}
      </View>

      {data.length === 0 ? (
        <View style={styles.empty}>
          <Bookmark size={32} color={colors.textWhisper} strokeWidth={1.2} />
          <Text style={styles.emptyText}>Nothing here yet</Text>
          <Text style={styles.emptySub}>Tap the bookmark icon on any story to save it.</Text>
        </View>
      ) : (
        <View style={{ gap: spacing.lg }}>
          {data.map((item: any) => (
            <Pressable key={item.id} style={({ pressed }) => [styles.card, pressed && { opacity: 0.85 }]}>
              {item.coverImage ? (
                <Image source={{ uri: item.coverImage }} style={styles.cover} />
              ) : (
                <View style={[styles.cover, styles.coverFallback]} />
              )}
              {/* Overlay badge based on tab */}
              {tab === 'progress' && (
                <View style={styles.badgeProgress}>
                  <Text style={styles.badgeProgressText}>{Math.round(item.progress * 100)}%</Text>
                </View>
              )}
              {tab === 'downloads' && (
                <View style={[styles.badgeDownload, item.daysLeft <= 3 && { backgroundColor: '#CD6F6F' }]}>
                  <Clock size={11} color="#000" strokeWidth={2.5} />
                  <Text style={styles.badgeDownloadText}>{item.daysLeft}d left</Text>
                </View>
              )}
              <View style={styles.cardBody}>
                <Text style={styles.cardEyebrow}>{typeLabel(item.type)}</Text>
                <Text style={styles.cardTitle} numberOfLines={2}>{item.title}</Text>
                <Text style={styles.cardMeta} numberOfLines={1}>{item.creator}{item.duration ? `  ·  ${item.duration}` : ''}</Text>
              </View>
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
  subheading: { ...typography.bodySm, color: colors.textMuted, marginBottom: spacing['2xl'] },

  tabsRow: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm, marginBottom: spacing['2xl'] },
  tabCard: {
    flexBasis: '47%', flexGrow: 1,
    paddingVertical: spacing.lg, paddingHorizontal: spacing.lg,
    borderRadius: 16,
    backgroundColor: 'rgba(255,255,255,0.03)',
    borderWidth: StyleSheet.hairlineWidth, borderColor: 'rgba(255,255,255,0.08)',
  },
  tabCount: { fontSize: 28, fontWeight: '300', letterSpacing: -0.5 },
  tabLabel: { ...typography.micro, fontSize: 10, letterSpacing: 2, textTransform: 'uppercase', color: colors.textMuted, marginTop: 4 },

  card: {
    borderRadius: 16,
    overflow: 'hidden',
    backgroundColor: 'rgba(255,255,255,0.03)',
    borderWidth: StyleSheet.hairlineWidth, borderColor: 'rgba(255,255,255,0.08)',
  },
  cover: { width: '100%', aspectRatio: 16 / 9, backgroundColor: 'rgba(255,255,255,0.04)' },
  coverFallback: { backgroundColor: 'rgba(255,255,255,0.06)' },
  cardBody: { padding: spacing.lg },
  cardEyebrow: { ...typography.micro, fontSize: 10, letterSpacing: 2, textTransform: 'uppercase', color: colors.textFaint, marginBottom: 6 },
  cardTitle: { fontSize: 17, fontWeight: '400', color: colors.textPrimary, letterSpacing: 0.1 },
  cardMeta: { ...typography.bodySm, color: colors.textMuted, fontSize: 12, marginTop: 4 },

  badgeProgress: {
    position: 'absolute', top: 12, right: 12,
    paddingVertical: 4, paddingHorizontal: 10,
    borderRadius: 999,
    backgroundColor: 'rgba(0,0,0,0.7)',
    borderWidth: StyleSheet.hairlineWidth, borderColor: 'rgba(255,255,255,0.2)',
  },
  badgeProgressText: { fontSize: 11, fontWeight: '500', color: '#fff', letterSpacing: 0.5 },
  badgeDownload: {
    position: 'absolute', top: 12, right: 12,
    flexDirection: 'row', alignItems: 'center', gap: 4,
    paddingVertical: 4, paddingHorizontal: 10,
    borderRadius: 999,
    backgroundColor: '#E8B86F',
  },
  badgeDownloadText: { fontSize: 11, fontWeight: '600', color: '#000', letterSpacing: 0.3 },

  empty: { alignItems: 'center', paddingTop: spacing['4xl'], gap: spacing.md },
  emptyText: { fontSize: 16, color: colors.textMuted, fontWeight: '300' },
  emptySub: { ...typography.bodySm, color: colors.textWhisper, textAlign: 'center', maxWidth: 280 },
});
