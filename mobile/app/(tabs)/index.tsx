import { useMemo } from 'react';
import { ScrollView, View, StyleSheet } from 'react-native';
import { LIVE_ITEMS, type UnifiedItem } from '../../data/aggregate';
import { colors, spacing, layout } from '../../constants/theme';
import { ContentCard } from '../../components/ContentCard';
import { StoryCard } from '../../components/StoryCard';
import { SectionHeader } from '../../components/SectionHeader';
import { FeaturedHero } from '../../components/FeaturedHero';

const typeLabel = (t: UnifiedItem['type']) =>
  ({ music: 'CREOVA Music', story: 'Story World', film: 'Film', collection: 'Collection', archive: 'Archive' }[t] ?? '');

export default function ForYou() {
  const { hero, featuredRail, trendingRail, newRail, archivesRail, voicesRail } = useMemo(() => {
    const live = LIVE_ITEMS;
    const withCover = live.filter(i => i.coverImage);
    const hero = withCover.find(i => i.featured) ?? withCover[0];

    const featuredRail = live.filter(i => i.featured && i.id !== hero?.id).slice(0, 8);
    const trendingRail = live.filter(i => i.trending && !i.featured).slice(0, 8);
    const newRail = live.filter(i => i.new && !i.featured && !i.trending).slice(0, 8);
    const archivesRail = live.filter(i => i.type === 'archive' || i.type === 'collection').slice(0, 8);
    const voicesRail = live.filter(i => i.type === 'story' && !i.featured).slice(0, 8);

    return { hero, featuredRail, trendingRail, newRail, archivesRail, voicesRail };
  }, []);

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      {hero && (
        <FeaturedHero
          title={hero.title}
          subtitle={hero.creator}
          category={typeLabel(hero.type)}
          imageUrl={hero.coverImage}
        />
      )}

      <Rail title="Featured" subtitle="Cinematic stories handpicked for you" items={featuredRail} variant="content" />
      <Rail title="Trending Now" subtitle="What the SEEN community is listening to" items={trendingRail} variant="content" />
      <Rail title="Just Released" subtitle="New voices, fresh chapters" items={newRail} variant="content" />
      <Rail title="From the Archive" subtitle="Collections curated by institutions" items={archivesRail} variant="story" />
      <Rail title="Community Voices" subtitle="Stories from underrepresented creators" items={voicesRail} variant="story" />
    </ScrollView>
  );
}

function Rail({ title, subtitle, items, variant }: { title: string; subtitle: string; items: UnifiedItem[]; variant: 'content' | 'story' }) {
  if (items.length === 0) return null;
  return (
    <View style={styles.section}>
      <SectionHeader title={title} subtitle={subtitle} />
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: spacing.md, paddingRight: spacing.xl }}>
        {items.map(item =>
          variant === 'content' ? (
            <ContentCard
              key={item.id}
              title={item.title}
              creator={item.creator}
              duration={item.duration}
              imageUrl={item.coverImage}
              category={typeLabel(item.type)}
              badge={item.new ? 'NEW' : item.trending ? 'HOT' : undefined}
            />
          ) : (
            <StoryCard
              key={item.id}
              title={item.title}
              author={item.creator}
              readTime={item.duration}
              imageUrl={item.coverImage}
            />
          ),
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  content: { paddingHorizontal: spacing.xl, paddingTop: spacing.lg, paddingBottom: spacing['4xl'], maxWidth: layout.containerMaxWidth, alignSelf: 'center', width: '100%' },
  section: { marginBottom: spacing['2xl'] },
});
