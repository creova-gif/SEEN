import { useMemo } from 'react';
import { ScrollView, View, Text, StyleSheet, Pressable, Image } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, radius, typography } from '../../constants/theme';
import { getForYouFeed } from '../../../src/app/data/queries';
import type { ForYouFeedItem } from '../../../src/app/data/types';

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

export default function ForYou() {
  const insets = useSafeAreaInsets();

  // Real query from the shared SEEN content database.
  // Same function the web app uses on the For You screen.
  const feed = useMemo<ForYouFeedItem[]>(
    () => getForYouFeed('en', 'explore', 100),
    [],
  );

  const featured = feed.find(i => i.featured) ?? feed[0];
  const rest = feed.filter(i => i.id !== featured?.id);

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={{ paddingTop: insets.top + spacing.lg, paddingBottom: spacing['3xl'] }}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.header}>
        <Text style={styles.eyebrow}>For You · {feed.length} stories</Text>
        <Text style={styles.heading}>Voices that shaped{'\n'}this land.</Text>
      </View>

      {featured && (
        <Pressable style={({ pressed }) => [styles.featured, pressed && { opacity: 0.8 }]}>
          {featured.mediaSource ? (
            <Image source={{ uri: featured.mediaSource }} style={styles.featuredImage} />
          ) : (
            <View style={[styles.featuredImage, { backgroundColor: colors.surfaceElevated }]} />
          )}
          <View style={styles.featuredOverlay}>
            <View style={styles.tagRow}>
              <View style={[styles.tagPill, { borderColor: TYPE_ACCENT[featured.type] }]}>
                <Text style={[styles.tagPillText, { color: TYPE_ACCENT[featured.type] }]}>
                  {featured.recommendationReason}
                </Text>
              </View>
            </View>
            <Text style={styles.featuredTitle} numberOfLines={2}>{featured.title}</Text>
            <Text style={styles.featuredMeta}>
              {featured.creator} · {featured.duration}
            </Text>
          </View>
        </Pressable>
      )}

      {rest.map(item => (
        <Pressable key={item.id} style={({ pressed }) => [styles.card, pressed && { opacity: 0.7 }]}>
          <View style={[styles.accentDot, { backgroundColor: TYPE_ACCENT[item.type] }]} />
          {item.mediaSource ? (
            <Image source={{ uri: item.mediaSource }} style={styles.thumb} />
          ) : (
            <View style={[styles.thumb, { backgroundColor: colors.surfaceElevated }]}>
              <Ionicons name={TYPE_ICON[item.type]} size={22} color={colors.textFaint} />
            </View>
          )}
          <View style={{ flex: 1 }}>
            <Text style={styles.cardTag}>
              {item.type.toUpperCase()} · {item.recommendationReason}
            </Text>
            <Text style={styles.cardTitle} numberOfLines={2}>{item.title}</Text>
            <View style={styles.cardMeta}>
              <Ionicons name={TYPE_ICON[item.type]} size={11} color={colors.textFaint} />
              <Text style={styles.cardDuration}>{item.creator} · {item.duration}</Text>
            </View>
          </View>
          <Ionicons name="play-circle-outline" size={30} color={colors.textSecondary} />
        </Pressable>
      ))}

      {feed.length === 0 && (
        <View style={styles.empty}>
          <Text style={styles.emptyText}>No stories matched your preferences yet.</Text>
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background, paddingHorizontal: spacing.xl },

  header: { marginBottom: spacing['2xl'] },
  eyebrow: { ...typography.micro, color: colors.textFaint, marginBottom: spacing.md },
  heading: { fontSize: 28, fontWeight: '300', color: colors.textPrimary, lineHeight: 36, letterSpacing: 0.5 },

  featured: {
    borderRadius: radius.lg,
    overflow: 'hidden',
    marginBottom: spacing.xl,
    backgroundColor: colors.surface,
    borderWidth: 0.5,
    borderColor: colors.border,
  },
  featuredImage: { width: '100%', height: 220 },
  featuredOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: spacing.lg,
    backgroundColor: 'rgba(0,0,0,0.55)',
  },
  tagRow: { flexDirection: 'row', gap: spacing.sm, marginBottom: spacing.sm },
  tagPill: {
    borderWidth: 0.75,
    borderRadius: 999,
    paddingVertical: 3,
    paddingHorizontal: 10,
  },
  tagPillText: {
    fontSize: 9,
    letterSpacing: 1.5,
    textTransform: 'uppercase',
    fontWeight: '600',
  },
  featuredTitle: {
    color: colors.textPrimary,
    fontSize: 20,
    fontWeight: '500',
    letterSpacing: 0.3,
    marginBottom: 4,
  },
  featuredMeta: { color: colors.textMuted, fontSize: 12, letterSpacing: 0.5 },

  card: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    borderWidth: 0.5,
    borderColor: colors.border,
    borderRadius: radius.lg,
    padding: spacing.md,
    marginBottom: spacing.md,
    backgroundColor: colors.surface,
  },
  accentDot: { width: 6, height: 6, borderRadius: 3 },
  thumb: {
    width: 56, height: 56, borderRadius: radius.md,
    alignItems: 'center', justifyContent: 'center',
  },
  cardTag: { ...typography.micro, color: colors.textFaint, marginBottom: 4, fontSize: 9 },
  cardTitle: { fontSize: 14, fontWeight: '500', color: colors.textPrimary, letterSpacing: 0.2 },
  cardMeta: { flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 4 },
  cardDuration: { fontSize: 11, color: colors.textFaint, letterSpacing: 0.5, flex: 1 },

  empty: { padding: spacing.xl, alignItems: 'center' },
  emptyText: { ...typography.body, color: colors.textFaint },
});
