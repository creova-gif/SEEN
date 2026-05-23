import { useMemo, useState } from 'react';
import { ScrollView, View, Text, StyleSheet, Pressable, Image } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, radius, typography } from '../../constants/theme';
import {
  ALL_CONTENT,
  MUSIC_CONTENT,
  STORY_CONTENT,
  FILM_CONTENT,
  INSTITUTIONAL_CONTENT,
} from '../../../src/app/data/database';
import type { ContentItem, ContentType } from '../../../src/app/data/types';

type Tab = 'all' | 'music' | 'story' | 'film' | 'institutional';

const TABS: { id: Tab; label: string; data: ContentItem[]; accent: string; icon: any }[] = [
  { id: 'all',           label: 'All',            data: ALL_CONTENT,           accent: colors.textPrimary, icon: 'apps-outline' },
  { id: 'music',         label: 'Music',          data: MUSIC_CONTENT,         accent: colors.violet,      icon: 'musical-notes-outline' },
  { id: 'story',         label: 'Stories',        data: STORY_CONTENT,         accent: colors.amber,       icon: 'book-outline' },
  { id: 'film',          label: 'Films',          data: FILM_CONTENT,          accent: colors.emerald,     icon: 'film-outline' },
  { id: 'institutional', label: 'Institutional',  data: INSTITUTIONAL_CONTENT, accent: colors.amber,       icon: 'library-outline' },
];

const TYPE_ICON: Record<ContentType, any> = {
  music: 'musical-notes-outline',
  story: 'book-outline',
  film: 'film-outline',
  collection: 'albums-outline',
  archive: 'library-outline',
};

const TYPE_ACCENT: Record<ContentType, string> = {
  music: colors.violet,
  story: colors.amber,
  film: colors.emerald,
  collection: colors.violet,
  archive: colors.amber,
};

export default function Library() {
  const insets = useSafeAreaInsets();
  const [active, setActive] = useState<Tab>('all');

  const items = useMemo(() => TABS.find(t => t.id === active)?.data ?? [], [active]);

  return (
    <View style={[styles.container, { paddingTop: insets.top + spacing.lg }]}>
      <View style={styles.header}>
        <Text style={styles.eyebrow}>Library · {ALL_CONTENT.length} items total</Text>
        <Text style={styles.heading}>Every story{'\n'}in one place.</Text>
      </View>

      {/* Tab rail */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ gap: spacing.sm, paddingHorizontal: spacing.xl }}
        style={styles.tabRail}
      >
        {TABS.map(t => {
          const isActive = t.id === active;
          return (
            <Pressable
              key={t.id}
              onPress={() => setActive(t.id)}
              style={[styles.tab, isActive && { borderColor: t.accent, backgroundColor: t.accent + '22' }]}
            >
              <Ionicons name={t.icon} size={13} color={isActive ? t.accent : colors.textMuted} />
              <Text style={[styles.tabLabel, isActive && { color: t.accent }]}>
                {t.label}
              </Text>
              <Text style={[styles.tabCount, isActive && { color: t.accent }]}>{t.data.length}</Text>
            </Pressable>
          );
        })}
      </ScrollView>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: spacing.xl, paddingBottom: spacing['3xl'] }}
      >
        {items.map(item => (
          <Pressable key={item.id} style={({ pressed }) => [styles.row, pressed && { opacity: 0.7 }]}>
            {item.mediaSource ? (
              <Image source={{ uri: item.mediaSource }} style={styles.thumb} />
            ) : (
              <View style={[styles.thumb, styles.thumbFallback]}>
                <Ionicons name={TYPE_ICON[item.type]} size={20} color={colors.textFaint} />
              </View>
            )}
            <View style={{ flex: 1 }}>
              <View style={styles.rowTagLine}>
                <View style={[styles.typeDot, { backgroundColor: TYPE_ACCENT[item.type] }]} />
                <Text style={styles.rowType}>{item.type.toUpperCase()}</Text>
                <Text style={styles.rowDot}>·</Text>
                <Text style={styles.rowDuration}>{item.duration}</Text>
                {item.new && (
                  <>
                    <Text style={styles.rowDot}>·</Text>
                    <Text style={[styles.rowFlag, { color: TYPE_ACCENT[item.type] }]}>NEW</Text>
                  </>
                )}
                {item.featured && !item.new && (
                  <>
                    <Text style={styles.rowDot}>·</Text>
                    <Text style={[styles.rowFlag, { color: TYPE_ACCENT[item.type] }]}>FEATURED</Text>
                  </>
                )}
              </View>
              <Text style={styles.rowTitle} numberOfLines={2}>{item.title}</Text>
              <Text style={styles.rowCreator} numberOfLines={1}>{item.creator} · {item.releaseDate}</Text>
            </View>
            <Ionicons name="play-circle-outline" size={28} color={colors.textSecondary} />
          </Pressable>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  header: { paddingHorizontal: spacing.xl, marginBottom: spacing.lg },
  eyebrow: { ...typography.micro, color: colors.textFaint, marginBottom: spacing.md },
  heading: { fontSize: 28, fontWeight: '300', color: colors.textPrimary, lineHeight: 36, letterSpacing: 0.5 },

  tabRail: { marginBottom: spacing.lg, flexGrow: 0 },
  tab: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 999,
    borderWidth: 0.5,
    borderColor: colors.border,
    backgroundColor: colors.surface,
  },
  tabLabel: { fontSize: 11, color: colors.textMuted, letterSpacing: 0.5, fontWeight: '500' },
  tabCount: { fontSize: 10, color: colors.textFaint, letterSpacing: 0.5 },

  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    paddingVertical: spacing.md,
    borderBottomWidth: 0.5,
    borderBottomColor: colors.border,
  },
  thumb: { width: 56, height: 56, borderRadius: radius.md },
  thumbFallback: {
    backgroundColor: colors.surfaceElevated,
    alignItems: 'center',
    justifyContent: 'center',
  },
  rowTagLine: { flexDirection: 'row', alignItems: 'center', gap: 4, marginBottom: 4 },
  typeDot: { width: 5, height: 5, borderRadius: 3, marginRight: 2 },
  rowType: { fontSize: 9, color: colors.textFaint, letterSpacing: 1.5, fontWeight: '600' },
  rowDot: { fontSize: 10, color: colors.textFaint },
  rowDuration: { fontSize: 10, color: colors.textFaint, letterSpacing: 0.3 },
  rowFlag: { fontSize: 9, letterSpacing: 1.5, fontWeight: '600' },
  rowTitle: { fontSize: 14, fontWeight: '500', color: colors.textPrimary, letterSpacing: 0.2, lineHeight: 18 },
  rowCreator: { fontSize: 11, color: colors.textMuted, marginTop: 2 },
});
