import { useMemo, useState } from 'react';
import { View, Text, Pressable, ScrollView, StyleSheet, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LIVE_ITEMS } from '../../data/aggregate';
import { colors, spacing, typography, radius, layout } from '../../constants/theme';

type QueueTab = 'queue' | 'flagged' | 'approved';

export default function Moderate() {
  const insets = useSafeAreaInsets();
  const [tab, setTab] = useState<QueueTab>('queue');

  // Pull a deterministic sample from live content as a stand-in queue.
  const { queueItems, flaggedItems, approvedItems } = useMemo(() => {
    const items = LIVE_ITEMS.filter((i) => i.coverImage);
    return {
      queueItems: items.slice(0, 6),
      flaggedItems: items.slice(6, 9),
      approvedItems: items.slice(9, 15),
    };
  }, []);

  const visible = tab === 'queue' ? queueItems : tab === 'flagged' ? flaggedItems : approvedItems;

  return (
    <View style={styles.container}>
      <View style={[styles.tabRow, { paddingTop: spacing.lg }]}>
        {(['queue', 'flagged', 'approved'] as QueueTab[]).map((t) => {
          const active = tab === t;
          const label = t === 'queue' ? `Queue · ${queueItems.length}` : t === 'flagged' ? `Flagged · ${flaggedItems.length}` : 'Approved';
          return (
            <Pressable
              key={t}
              onPress={() => setTab(t)}
              style={[styles.tabPill, active && styles.tabPillActive]}
              accessibilityRole="button"
              accessibilityLabel={`${t} tab`}
            >
              <Text style={[styles.tabPillText, active && styles.tabPillTextActive]}>{label}</Text>
            </Pressable>
          );
        })}
      </View>

      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={[styles.content, { paddingBottom: insets.bottom + spacing['4xl'] }]}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.contextLine}>
          {tab === 'queue'
            ? 'Review new submissions for cultural attribution, accessibility, and CMF compliance.'
            : tab === 'flagged'
            ? 'Community-flagged items awaiting moderator action.'
            : 'Recently approved — visible to the community.'}
        </Text>

        <View style={styles.list}>
          {visible.map((item, idx) => (
            <View key={item.id} style={styles.row}>
              {item.coverImage ? (
                <Image source={{ uri: item.coverImage }} style={styles.thumb} />
              ) : (
                <View style={[styles.thumb, { backgroundColor: '#111' }]} />
              )}
              <View style={{ flex: 1, gap: 2 }}>
                <Text style={styles.rowTitle} numberOfLines={1}>{item.title}</Text>
                <Text style={styles.rowMeta} numberOfLines={1}>{item.creator} · {item.duration}</Text>
                <View style={styles.rowTagRow}>
                  <View style={[styles.tag, tab === 'flagged' && { borderColor: colors.rose }]}>
                    <Text style={[styles.tagText, tab === 'flagged' && { color: colors.rose }]}>
                      {tab === 'queue' ? `Submitted ${idx + 1}d ago` : tab === 'flagged' ? `${idx + 1} flag${idx === 0 ? '' : 's'}` : 'Live'}
                    </Text>
                  </View>
                  <View style={styles.tag}>
                    <Text style={styles.tagText}>{item.type.toUpperCase()}</Text>
                  </View>
                </View>
              </View>
              <View style={styles.rowActions}>
                {tab !== 'approved' && (
                  <>
                    <Pressable
                      style={[styles.actionBtn, { backgroundColor: 'rgba(16,185,129,0.15)', borderColor: colors.emerald }]}
                      accessibilityRole="button"
                      accessibilityLabel={`Approve ${item.title}`}
                    >
                      <Ionicons name="checkmark" size={16} color={colors.emerald} />
                    </Pressable>
                    <Pressable
                      style={[styles.actionBtn, { backgroundColor: 'rgba(251,113,133,0.12)', borderColor: colors.rose }]}
                      accessibilityRole="button"
                      accessibilityLabel={`Reject ${item.title}`}
                    >
                      <Ionicons name="close" size={16} color={colors.rose} />
                    </Pressable>
                  </>
                )}
                <Pressable
                  style={styles.actionBtn}
                  accessibilityRole="button"
                  accessibilityLabel={`Open ${item.title}`}
                >
                  <Ionicons name="chevron-forward" size={16} color={colors.textFaint} />
                </Pressable>
              </View>
            </View>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  content: {
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.lg,
    maxWidth: layout.containerMaxWidth,
    alignSelf: 'center',
    width: '100%',
  },
  tabRow: {
    flexDirection: 'row',
    gap: spacing.sm,
    paddingHorizontal: spacing.xl,
    paddingBottom: spacing.md,
    maxWidth: layout.containerMaxWidth,
    alignSelf: 'center',
    width: '100%',
  },
  tabPill: {
    paddingHorizontal: spacing.lg,
    paddingVertical: 7,
    borderRadius: radius.full,
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderWidth: 1,
    borderColor: colors.borderSubtle,
  },
  tabPillActive: { backgroundColor: 'rgba(255,255,255,0.12)', borderColor: 'rgba(255,255,255,0.25)' },
  tabPillText: { ...typography.micro, color: colors.textMuted, fontSize: 10 },
  tabPillTextActive: { color: colors.textPrimary },

  contextLine: { ...typography.bodySm, color: colors.textFaint, marginBottom: spacing.lg, lineHeight: 18 },
  list: { gap: spacing.md },

  row: {
    flexDirection: 'row',
    gap: spacing.md,
    padding: spacing.md,
    borderRadius: radius.lg,
    backgroundColor: 'rgba(255,255,255,0.03)',
    borderWidth: 1,
    borderColor: colors.borderSubtle,
    alignItems: 'center',
  },
  thumb: { width: 56, height: 56, borderRadius: radius.md, backgroundColor: '#111' },
  rowTitle: { ...typography.h3, color: colors.textHigh, fontSize: 14 },
  rowMeta: { ...typography.bodySm, color: colors.textFaint, fontSize: 11 },
  rowTagRow: { flexDirection: 'row', gap: 4, marginTop: 4 },
  tag: {
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
    borderRadius: radius.full,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.border,
  },
  tagText: { ...typography.microSm, color: colors.textMuted, fontSize: 8 },

  rowActions: { flexDirection: 'row', gap: 4 },
  actionBtn: {
    width: 30,
    height: 30,
    borderRadius: radius.full,
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderWidth: 1,
    borderColor: colors.borderSubtle,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
