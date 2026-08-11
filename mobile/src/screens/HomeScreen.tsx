import { useRef } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable, Image, Animated } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors, spacing, radii } from '../theme';
import { STORIES, type StoryPreview } from '../data/stories';

interface HomeScreenProps {
  onOpenStory: (story: StoryPreview) => void;
}

export function HomeScreen({ onOpenStory }: HomeScreenProps) {
  const insets = useSafeAreaInsets();

  return (
    <View style={styles.container}>
      <ScrollView
        contentContainerStyle={{ paddingTop: insets.top + spacing.md, paddingBottom: spacing.xxl }}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <Text style={styles.headerTitle}>For You</Text>
          <Text style={styles.headerSubtitle}>Your presence, unfolding in real time.</Text>
        </View>

        <Text style={styles.sectionLabel}>FEATURED</Text>

        {STORIES.map(story => (
          <StoryCard key={story.id} story={story} onPress={() => onOpenStory(story)} />
        ))}

        {/* Empty-state note for the rest of the catalog, honest about scope */}
        <View style={styles.moreNotice}>
          <Text style={styles.moreNoticeText}>
            More of the SEEN catalog is coming to mobile soon.
          </Text>
        </View>
      </ScrollView>
    </View>
  );
}

function StoryCard({ story, onPress }: { story: StoryPreview; onPress: () => void }) {
  const scale = useRef(new Animated.Value(1)).current;

  return (
    <Animated.View style={{ transform: [{ scale }] }}>
      <Pressable
        onPress={onPress}
        onPressIn={() => Animated.spring(scale, { toValue: 0.98, useNativeDriver: true }).start()}
        onPressOut={() => Animated.spring(scale, { toValue: 1, useNativeDriver: true }).start()}
        style={styles.card}
        accessibilityRole="button"
        accessibilityLabel={`Open ${story.title}`}
      >
        <Image source={{ uri: story.coverImage }} style={styles.cardImage} resizeMode="cover" />
        <View style={styles.cardOverlay} />
        <View style={styles.cardContent}>
          <Text style={styles.cardTheme}>{story.theme.toUpperCase()}</Text>
          <Text style={styles.cardTitle}>{story.title}</Text>
          <Text style={styles.cardMeta}>{story.creator} · {story.duration}</Text>
        </View>
      </Pressable>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.black,
  },
  header: {
    paddingHorizontal: spacing.lg,
    marginBottom: spacing.lg,
  },
  headerTitle: {
    fontSize: 26,
    color: colors.white,
    marginBottom: spacing.xs,
  },
  headerSubtitle: {
    fontSize: 13,
    color: colors.whiteMedium,
  },
  sectionLabel: {
    fontSize: 11,
    letterSpacing: 2,
    color: colors.whiteMedium,
    marginHorizontal: spacing.lg,
    marginBottom: spacing.md,
  },
  card: {
    height: 220,
    marginHorizontal: spacing.lg,
    marginBottom: spacing.md,
    borderRadius: radii.md,
    overflow: 'hidden',
    backgroundColor: colors.whiteFaint,
  },
  cardImage: {
    position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
  },
  cardOverlay: {
    position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.35)',
  },
  cardContent: {
    flex: 1,
    justifyContent: 'flex-end',
    padding: spacing.md,
  },
  cardTheme: {
    fontSize: 10,
    letterSpacing: 1.5,
    color: 'rgba(255,255,255,0.7)',
    marginBottom: spacing.xs,
  },
  cardTitle: {
    fontSize: 20,
    color: colors.white,
    marginBottom: spacing.xs / 2,
  },
  cardMeta: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.6)',
  },
  moreNotice: {
    marginHorizontal: spacing.lg,
    marginTop: spacing.md,
    paddingVertical: spacing.lg,
    alignItems: 'center',
  },
  moreNoticeText: {
    fontSize: 12,
    color: colors.whiteMedium,
    textAlign: 'center',
  },
});
