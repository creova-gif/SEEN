import { View, Text, Image, Pressable, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { colors, spacing, typography, radius } from '../constants/theme';

type Props = {
  title: string;
  author?: string;
  readTime?: string;
  imageUrl?: string;
  onPress?: () => void;
  width?: number;
};

// Square-ish story card — matches StoryCard.tsx from the zip.
// Used in horizontal rails for Archive / Community Voices sections.
export function StoryCard({ title, author, readTime, imageUrl, onPress, width = 200 }: Props) {
  const height = Math.round(width * 1.15);
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [{ width, height }, styles.wrap, pressed && { opacity: 0.85 }]}
      accessibilityRole="button"
      accessibilityLabel={`${title}${author ? `, by ${author}` : ''}${readTime ? `, ${readTime}` : ''}`}
    >
      {imageUrl ? (
        <Image source={{ uri: imageUrl }} style={StyleSheet.absoluteFillObject} />
      ) : (
        <View style={[StyleSheet.absoluteFillObject, { backgroundColor: '#111' }]} />
      )}
      <LinearGradient
        colors={['transparent', 'rgba(0,0,0,0.30)', '#000']}
        locations={[0.35, 0.7, 1]}
        style={StyleSheet.absoluteFillObject}
      />
      <View style={styles.bottom}>
        {readTime ? <Text style={styles.eyebrow}>{readTime}</Text> : null}
        <Text style={styles.title} numberOfLines={2}>{title}</Text>
        {author ? <Text style={styles.author} numberOfLines={1}>by {author}</Text> : null}
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  wrap: { borderRadius: radius.lg, overflow: 'hidden', backgroundColor: '#0a0a0a' },
  bottom: { position: 'absolute', left: spacing.lg, right: spacing.lg, bottom: spacing.lg, gap: 4 },
  eyebrow: { ...typography.microSm, color: colors.textWhisper, fontSize: 9 },
  title: { ...typography.h3, color: colors.textPrimary, fontSize: 15, fontWeight: '400' },
  author: { ...typography.bodySm, color: colors.textMuted, fontSize: 11 },
});
