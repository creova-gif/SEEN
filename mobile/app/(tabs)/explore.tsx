import { useMemo, useState } from 'react';
import { ScrollView, View, Text, Pressable, TextInput, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LIVE_ITEMS, PLANNED_ITEMS, type UnifiedItem } from '../../data/aggregate';
import { colors, spacing, radius, typography, layout } from '../../constants/theme';
import { ContentCard } from '../../components/ContentCard';
import { StoryCard } from '../../components/StoryCard';
import { SectionHeader } from '../../components/SectionHeader';

type Filter = 'all' | 'music' | 'story' | 'film' | 'collection' | 'archive';
const FILTERS: { id: Filter; label: string; icon: keyof typeof Ionicons.glyphMap }[] = [
  { id: 'all', label: 'All', icon: 'globe-outline' },
  { id: 'music', label: 'Music', icon: 'musical-notes-outline' },
  { id: 'story', label: 'Stories', icon: 'book-outline' },
  { id: 'film', label: 'Films', icon: 'film-outline' },
  { id: 'collection', label: 'Collections', icon: 'albums-outline' },
  { id: 'archive', label: 'Archives', icon: 'library-outline' },
];

const typeLabel = (t: UnifiedItem['type']) =>
  ({ music: 'Music', story: 'Story', film: 'Film', collection: 'Collection', archive: 'Archive' }[t] ?? '');

export default function Explore() {
  const [query, setQuery] = useState('');
  const [filter, setFilter] = useState<Filter>('all');

  const filtered = useMemo(() => {
    const base = filter === 'all' ? LIVE_ITEMS : LIVE_ITEMS.filter(i => i.type === filter);
    if (!query.trim()) return base;
    const q = query.toLowerCase();
    return base.filter(
      i =>
        i.title.toLowerCase().includes(q) ||
        i.creator.toLowerCase().includes(q) ||
        i.tags.some(t => t.toLowerCase().includes(q)),
    );
  }, [query, filter]);

  const sections = useMemo(() => {
    const trending = filtered.filter(i => i.trending).slice(0, 6);
    const featured = filtered.filter(i => i.featured && !i.trending).slice(0, 6);
    const indigenous = filtered.filter(i => i.tags.some(t => /indigenous|first nation|métis|cree|inuit|anishinaabe/i.test(t))).slice(0, 6);
    const black = filtered.filter(i => i.tags.some(t => /black|africville|afro|caribbean/i.test(t))).slice(0, 6);
    const francophone = filtered.filter(i => i.language.includes('fr')).slice(0, 6);
    const films = filtered.filter(i => i.type === 'film').slice(0, 6);
    const planned = PLANNED_ITEMS.slice(0, 6);
    return { trending, featured, indigenous, black, francophone, films, planned };
  }, [filtered]);

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
      <Text style={styles.heading}>Explore</Text>
      <Text style={styles.subheading}>Discover curated stories, films & music from across Canada</Text>

      <View style={styles.searchWrap}>
        <Ionicons name="search-outline" size={16} color={colors.textFaint} />
        <TextInput
          value={query}
          onChangeText={setQuery}
          placeholder="Search stories, creators, themes…"
          placeholderTextColor={colors.textWhisper}
          style={styles.searchInput}
        />
      </View>

      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom: spacing.xl }} contentContainerStyle={{ gap: spacing.sm, paddingRight: spacing.xl }}>
        {FILTERS.map(f => {
          const active = filter === f.id;
          return (
            <Pressable
              key={f.id}
              onPress={() => setFilter(f.id)}
              style={({ pressed }) => [styles.filterPill, active && styles.filterPillActive, pressed && { opacity: 0.7 }]}
            >
              <Ionicons name={f.icon} size={13} color={active ? '#000' : colors.textSecondary} />
              <Text style={[styles.filterText, active && styles.filterTextActive]}>{f.label}</Text>
            </Pressable>
          );
        })}
      </ScrollView>

      <Rail title="Trending" subtitle="Most-listened across Canada" items={sections.trending} variant="content" />
      <Rail title="Editor's Picks" subtitle="Featured collections" items={sections.featured} variant="content" />
      <Rail title="Indigenous Voices" subtitle="First Nations, Métis & Inuit creators" items={sections.indigenous} variant="story" />
      <Rail title="Black Canadian Stories" subtitle="From Africville to today" items={sections.black} variant="story" />
      <Rail title="Voix francophones" subtitle="French-language stories from across Canada" items={sections.francophone} variant="content" />
      <Rail title="Films & Documentaries" subtitle="NFB and independent works" items={sections.films} variant="content" />
      <Rail title="Coming Soon" subtitle="Stories in production" items={sections.planned} variant="story" planned />
    </ScrollView>
  );
}

function Rail({ title, subtitle, items, variant, planned }: { title: string; subtitle: string; items: UnifiedItem[]; variant: 'content' | 'story'; planned?: boolean }) {
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
              badge={planned ? 'SOON' : item.new ? 'NEW' : undefined}
            />
          ) : (
            <StoryCard
              key={item.id}
              title={item.title}
              author={planned ? 'In production' : item.creator}
              readTime={item.duration || (planned ? 'Coming soon' : undefined)}
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
  heading: { fontSize: 32, fontWeight: '300', letterSpacing: -0.5, color: colors.textPrimary, marginBottom: 6 },
  subheading: { ...typography.body, color: colors.textMuted, marginBottom: spacing.xl },
  searchWrap: {
    flexDirection: 'row', alignItems: 'center', gap: spacing.sm,
    backgroundColor: colors.surface,
    borderWidth: StyleSheet.hairlineWidth, borderColor: colors.border,
    borderRadius: radius.full,
    paddingHorizontal: spacing.lg, paddingVertical: 12,
    marginBottom: spacing.lg,
  },
  searchInput: { flex: 1, color: colors.textPrimary, fontSize: 14, padding: 0 },
  filterPill: {
    flexDirection: 'row', alignItems: 'center', gap: 6,
    paddingVertical: 8, paddingHorizontal: 14,
    borderRadius: radius.full,
    backgroundColor: colors.surface,
    borderWidth: StyleSheet.hairlineWidth, borderColor: colors.border,
  },
  filterPillActive: { backgroundColor: colors.textPrimary, borderColor: colors.textPrimary },
  filterText: { ...typography.micro, fontSize: 10, color: colors.textSecondary },
  filterTextActive: { color: '#000' },
  section: { marginBottom: spacing['2xl'] },
});
