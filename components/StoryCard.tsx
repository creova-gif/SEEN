import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { Colors } from '../constants/colors';
import type { ContentItem } from '../data/types';

interface Props {
  item: ContentItem;
  compact?: boolean;
}

const TYPE_COLORS: Record<string, string> = {
  story: Colors.amber,
  music: Colors.violet,
  film: Colors.emerald,
  collection: Colors.blue,
  archive: Colors.textMuted,
};

const TYPE_ICONS: Record<string, string> = {
  story: 'book-outline',
  music: 'musical-notes-outline',
  film: 'film-outline',
  collection: 'layers-outline',
  archive: 'archive-outline',
};

export function StoryCard({ item, compact }: Props) {
  const accentColor = TYPE_COLORS[item.type] ?? Colors.amber;

  return (
    <TouchableOpacity
      style={styles.card}
      onPress={() => router.push({ pathname: '/story/[id]', params: { id: item.id } })}
      activeOpacity={0.7}
    >
      <Image source={{ uri: item.mediaSource }} style={styles.thumbnail} />
      <View style={styles.info}>
        <View style={styles.topRow}>
          <View style={[styles.typeBadge, { backgroundColor: `${accentColor}22` }]}>
            <Ionicons name={TYPE_ICONS[item.type] as any} size={10} color={accentColor} />
            <Text style={[styles.typeText, { color: accentColor }]}>{item.type.toUpperCase()}</Text>
          </View>
          {item.new && (
            <View style={styles.newBadge}>
              <Text style={styles.newText}>NEW</Text>
            </View>
          )}
        </View>
        <Text style={styles.title} numberOfLines={2}>{item.title}</Text>
        {!compact && (
          <Text style={styles.desc} numberOfLines={2}>{item.description}</Text>
        )}
        <View style={styles.meta}>
          <Text style={styles.metaText}>{item.creator}</Text>
          <View style={styles.dot} />
          <Text style={styles.metaText}>{item.duration}</Text>
          {item.language.length > 1 && (
            <>
              <View style={styles.dot} />
              <Ionicons name="globe-outline" size={10} color={Colors.textMuted} />
              <Text style={styles.metaText}>{item.language.join(' · ')}</Text>
            </>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    gap: 12,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  thumbnail: {
    width: 80,
    height: 80,
    borderRadius: Colors.radiusSm,
    backgroundColor: Colors.surface,
    flexShrink: 0,
  },
  info: {
    flex: 1,
    gap: 4,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  typeBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  typeText: {
    fontSize: 9,
    fontFamily: Colors.fontSemiBold,
    letterSpacing: 1.5,
  },
  newBadge: {
    backgroundColor: Colors.amberDim,
    paddingHorizontal: 5,
    paddingVertical: 2,
    borderRadius: 4,
  },
  newText: {
    fontSize: 9,
    fontFamily: Colors.fontSemiBold,
    color: Colors.amber,
    letterSpacing: 1.5,
  },
  title: {
    fontSize: 15,
    fontFamily: Colors.fontSemiBold,
    color: Colors.textPrimary,
    lineHeight: 20,
  },
  desc: {
    fontSize: 12,
    fontFamily: Colors.fontRegular,
    color: Colors.textSecondary,
    lineHeight: 17,
  },
  meta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    flexWrap: 'wrap',
    marginTop: 2,
  },
  metaText: {
    fontSize: 11,
    fontFamily: Colors.fontRegular,
    color: Colors.textMuted,
  },
  dot: {
    width: 2,
    height: 2,
    borderRadius: 1,
    backgroundColor: Colors.textMuted,
  },
});
