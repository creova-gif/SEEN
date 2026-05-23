import { View, Text, Image, Pressable, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, typography, radius } from '../constants/theme';

type Props = {
  title: string;
  creator?: string;
  duration?: string;
  imageUrl?: string;
  category: string;
  badge?: string;
  onPress?: () => void;
  width?: number;
};

// 3:4 aspect content card — matches ContentCard.tsx from the zip exactly:
// image fill, dark gradient scrim from bottom, category pill top-left,
// optional badge top-right, title + creator stacked at bottom with play icon.
export function ContentCard({ title, creator, duration, imageUrl, category, badge, onPress, width = 220 }: Props) {
  const height = Math.round((width / 3) * 4);
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [{ width, height }, styles.wrap, pressed && { opacity: 0.85 }]}
      accessibilityRole="button"
      accessibilityLabel={`${title}${creator ? `, by ${creator}` : ''}, ${category}${duration ? `, ${duration}` : ''}`}
    >
      {imageUrl ? (
        <Image source={{ uri: imageUrl }} style={StyleSheet.absoluteFillObject} />
      ) : (
        <View style={[StyleSheet.absoluteFillObject, { backgroundColor: '#111' }]} />
      )}

      <LinearGradient
        colors={['transparent', 'rgba(0,0,0,0.45)', '#000']}
        locations={[0.4, 0.7, 1]}
        style={StyleSheet.absoluteFillObject}
      />

      <View style={styles.topRow}>
        <View style={styles.categoryPill}>
          <Text style={styles.categoryText}>{category}</Text>
        </View>
        {badge && (
          <View style={[styles.categoryPill, { backgroundColor: 'rgba(255,255,255,0.10)', borderColor: colors.borderStrong }]}>
            <Text style={[styles.categoryText, { color: colors.textPrimary }]}>{badge}</Text>
          </View>
        )}
      </View>

      <View style={styles.bottom}>
        <Text style={styles.title} numberOfLines={2}>{title}</Text>
        {creator ? <Text style={styles.creator} numberOfLines={1}>{creator}</Text> : null}
        <View style={styles.playRow}>
          {duration ? <Text style={styles.duration}>{duration}</Text> : <View />}
          <View style={styles.playBtn}>
            <Ionicons name="play" size={12} color="#000" />
          </View>
        </View>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  wrap: {
    borderRadius: radius.lg,
    overflow: 'hidden',
    backgroundColor: '#0a0a0a',
  },
  topRow: {
    position: 'absolute', top: 12, left: 12, right: 12,
    flexDirection: 'row', justifyContent: 'space-between',
  },
  categoryPill: {
    paddingVertical: 4, paddingHorizontal: 10,
    borderRadius: radius.full,
    backgroundColor: 'rgba(0,0,0,0.40)',
    borderWidth: StyleSheet.hairlineWidth, borderColor: colors.border,
  },
  categoryText: { ...typography.microSm, color: colors.textMuted },
  bottom: { position: 'absolute', left: 14, right: 14, bottom: 14, gap: 4 },
  title: { ...typography.h3, color: colors.textPrimary, fontSize: 15, fontWeight: '400', letterSpacing: 0.3 },
  creator: { ...typography.bodySm, color: colors.textMuted, fontSize: 11 },
  playRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: spacing.sm },
  duration: { ...typography.microSm, color: colors.textFaint, fontSize: 9 },
  playBtn: {
    width: 26, height: 26, borderRadius: radius.full,
    backgroundColor: 'rgba(255,255,255,0.95)',
    alignItems: 'center', justifyContent: 'center',
  },
});
