import { View, Text, Image, Pressable, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, typography, radius } from '../constants/theme';

type Props = {
  title: string;
  subtitle?: string;
  category?: string;
  imageUrl?: string;
  onPress?: () => void;
};

// Big hero card for the top of For You — matches FeaturedStoryPreview's compact form.
export function FeaturedHero({ title, subtitle, category, imageUrl, onPress }: Props) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [styles.wrap, pressed && { opacity: 0.92 }]}
      accessibilityRole="button"
      accessibilityLabel={`Featured: ${title}${subtitle ? `, ${subtitle}` : ''}`}
      accessibilityHint="Open featured story"
    >
      {imageUrl ? (
        <Image source={{ uri: imageUrl }} style={StyleSheet.absoluteFillObject} />
      ) : (
        <View style={[StyleSheet.absoluteFillObject, { backgroundColor: '#0d0d10' }]} />
      )}
      <LinearGradient
        colors={['rgba(0,0,0,0.35)', 'rgba(0,0,0,0.55)', '#000']}
        locations={[0, 0.55, 1]}
        style={StyleSheet.absoluteFillObject}
      />

      <View style={styles.topRow}>
        {category ? (
          <View style={styles.categoryPill}>
            <Text style={styles.categoryText}>{category}</Text>
          </View>
        ) : <View />}
        <View style={styles.featuredPill}>
          <Text style={styles.featuredText}>Featured</Text>
        </View>
      </View>

      <View style={styles.bottom}>
        <Text style={styles.title} numberOfLines={2}>{title}</Text>
        {subtitle ? <Text style={styles.subtitle} numberOfLines={1}>{subtitle}</Text> : null}
        <View style={styles.playBtn}>
          <Ionicons name="play" size={18} color="#000" style={{ marginLeft: 2 }} />
        </View>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  wrap: {
    height: 460,
    borderRadius: radius.xl,
    overflow: 'hidden',
    backgroundColor: '#0a0a0a',
    marginBottom: spacing['2xl'],
  },
  topRow: {
    position: 'absolute', top: spacing.lg, left: spacing.lg, right: spacing.lg,
    flexDirection: 'row', justifyContent: 'space-between',
  },
  categoryPill: {
    paddingVertical: 5, paddingHorizontal: 12,
    borderRadius: radius.full,
    backgroundColor: 'rgba(0,0,0,0.40)',
    borderWidth: StyleSheet.hairlineWidth, borderColor: colors.border,
  },
  categoryText: { ...typography.micro, color: colors.textMuted, fontSize: 10 },
  featuredPill: {
    paddingVertical: 5, paddingHorizontal: 12,
    borderRadius: radius.full,
    backgroundColor: 'rgba(255,255,255,0.10)',
    borderWidth: StyleSheet.hairlineWidth, borderColor: colors.borderStrong,
  },
  featuredText: { ...typography.micro, color: colors.textPrimary, fontSize: 10 },
  bottom: { position: 'absolute', left: spacing.xl, right: spacing.xl, bottom: spacing.xl },
  title: { fontSize: 26, letterSpacing: 0.3, fontWeight: '300', color: colors.textPrimary, lineHeight: 32 },
  subtitle: { ...typography.body, color: colors.textMuted, marginTop: 8 },
  playBtn: {
    width: 56, height: 56, borderRadius: radius.full,
    backgroundColor: 'rgba(255,255,255,0.95)',
    alignItems: 'center', justifyContent: 'center',
    marginTop: spacing.xl,
  },
});
