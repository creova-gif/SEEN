import { View, Text, StyleSheet, ScrollView, Pressable, Image } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, radii } from '../theme';
import type { StoryPreview } from '../data/stories';

interface StoryDetailScreenProps {
  story: StoryPreview;
  onClose: () => void;
}

export function StoryDetailScreen({ story, onClose }: StoryDetailScreenProps) {
  const insets = useSafeAreaInsets();

  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.heroWrap}>
          <Image source={{ uri: story.coverImage }} style={styles.heroImage} resizeMode="cover" />
          <View style={styles.heroOverlay} />

          <Pressable
            onPress={onClose}
            style={[styles.closeButton, { top: insets.top + spacing.sm }]}
            accessibilityRole="button"
            accessibilityLabel="Close"
          >
            <Ionicons name="close" size={20} color={colors.white} />
          </Pressable>
        </View>

        <View style={styles.content}>
          <Text style={styles.theme}>{story.theme.toUpperCase()}</Text>
          <Text style={styles.title}>{story.title}</Text>
          <Text style={styles.description}>{story.description}</Text>

          <View style={styles.metaRow}>
            <Text style={styles.metaText}>Created by {story.creator}</Text>
            <Text style={styles.metaDot}>·</Text>
            <Text style={styles.metaText}>{story.duration}</Text>
          </View>

          <Pressable style={styles.enterButton} accessibilityRole="button">
            <Text style={styles.enterButtonText}>Enter Story</Text>
            <Ionicons name="play" size={16} color={colors.black} />
          </Pressable>

          <Text style={styles.note}>
            The full chapter reader is coming to mobile in a future update.
          </Text>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.black,
  },
  heroWrap: {
    height: 340,
  },
  heroImage: {
    position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
  },
  heroOverlay: {
    position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.3)',
  },
  closeButton: {
    position: 'absolute',
    left: spacing.md,
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(0,0,0,0.5)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    padding: spacing.lg,
  },
  theme: {
    fontSize: 11,
    letterSpacing: 2,
    color: colors.whiteMedium,
    marginBottom: spacing.sm,
  },
  title: {
    fontSize: 28,
    color: colors.white,
    marginBottom: spacing.md,
  },
  description: {
    fontSize: 15,
    lineHeight: 23,
    color: colors.whiteStrong,
    marginBottom: spacing.lg,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  metaText: {
    fontSize: 13,
    color: colors.whiteMedium,
  },
  metaDot: {
    fontSize: 13,
    color: colors.whiteMedium,
    marginHorizontal: spacing.sm,
  },
  enterButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
    backgroundColor: colors.white,
    borderRadius: radii.pill,
    paddingVertical: spacing.md,
    marginBottom: spacing.md,
  },
  enterButtonText: {
    fontSize: 13,
    letterSpacing: 1.5,
    textTransform: 'uppercase',
    color: colors.black,
    fontWeight: '600',
  },
  note: {
    fontSize: 12,
    color: colors.whiteMedium,
    textAlign: 'center',
  },
});
