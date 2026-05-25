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

// Cultural identity palette (matches the editorial source: each tag gets a distinct dot colour)
const TAG_PALETTE = ['#7C6FCD', '#E89B6E', '#6FCDB8', '#CD6F8E', '#6F9BCD', '#CDC06F', '#9BCD6F', '#CD6F6F', '#6FCD9B', '#B86FCD', '#CD8E6F', '#6FCDCD', '#CD6FB8', '#8ECD6F'];
const colorForTag = (tag: string) => {
  let h = 0;
  for (let i = 0; i < tag.length; i++) h = (h * 31 + tag.charCodeAt(i)) >>> 0;
  return TAG_PALETTE[h % TAG_PALETTE.length];
};

export default function Explore() {
  const [query, setQuery] = useState('');
  const [filter, setFilter] = useState<Filter>('all');
  const [selectedTag, setSelectedTag] = useState<string | null>(null);

  const allTags = useMemo(() => {
    const t = new Set<string>();
    LIVE_ITEMS.forEach(i => i.tags.forEach(tag => t.add(tag)));
    return Array.from(t).sort();
  }, []);

  const filtered = useMemo(() => {
    let base = filter === 'all' ? LIVE_ITEMS : LIVE_ITEMS.filter(i => i.type === filter);
    if (selectedTag) base = base.filter(i => i.tags.includes(selectedTag));
    if (!query.trim()) return base;
    const q = query.toLowerCase();
    return base.filter(
      i =>
        i.title.toLowerCase().includes(q) ||
        i.creator.toLowerCase().includes(q) ||
        i.tags.some(t => t.toLowerCase().includes(q)),
    );
  }, [query, filter, selectedTag]);

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

      {/* Cultural Tag Cloud — each tag has a distinct identity colour dot */}
      <Text style={styles.railLabel}>Cultural Identities</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom: spacing.md }} contentContainerStyle={{ gap: spacing.xs, paddingRight: spacing.xl }}>
        {allTags.map(tag => {
          const active = selectedTag === tag;
          const dot = colorForTag(tag);
          return (
            <Pressable
              key={tag}
              onPress={() => setSelectedTag(active ? null : tag)}
              style={({ pressed }) => [styles.tagChip, active && styles.tagChipActive, pressed && { opacity: 0.7 }]}
            >
              <View style={[styles.tagDot, { backgroundColor: active ? '#000' : dot }]} />
              <Text style={[styles.tagText, active && styles.tagTextActive]}>{tag}</Text>
            </Pressable>
          );
        })}
      </ScrollView>

      {/* Active tag context banner */}
      {selectedTag && (
        <View style={[styles.tagBanner, { borderColor: colorForTag(selectedTag) + '55', backgroundColor: colorForTag(selectedTag) + '14' }]}>
          <View style={[styles.tagDot, { backgroundColor: colorForTag(selectedTag) }]} />
          <Text style={styles.tagBannerText}>Showing stories tagged <Text style={{ color: colors.textPrimary }}>{selectedTag}</Text></Text>
          <Pressable onPress={() => setSelectedTag(null)} hitSlop={8}>
            <Text style={styles.tagBannerClear}>CLEAR</Text>
          </Pressable>
        </View>
      )}

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
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderWidth: StyleSheet.hairlineWidth, borderColor: 'rgba(255,255,255,0.1)',
    borderRadius: 12,
    paddingHorizontal: spacing.lg, paddingVertical: 12,
    marginBottom: spacing.lg,
  },
  searchInput: { flex: 1, color: colors.textPrimary, fontSize: 14, padding: 0 },
  filterPill: {
    flexDirection: 'row', alignItems: 'center', gap: 6,
    paddingVertical: 8, paddingHorizontal: 14,
    borderRadius: radius.full,
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderWidth: StyleSheet.hairlineWidth, borderColor: 'rgba(255,255,255,0.1)',
  },
  filterPillActive: { backgroundColor: colors.textPrimary, borderColor: colors.textPrimary },
  filterText: { ...typography.micro, fontSize: 10, color: colors.textSecondary },
  filterTextActive: { color: '#000' },
  tagChip: {
    flexDirection: 'row', alignItems: 'center', gap: 6,
    paddingVertical: 6, paddingHorizontal: 12,
    borderRadius: radius.full,
    backgroundColor: 'rgba(255,255,255,0.03)',
    borderWidth: StyleSheet.hairlineWidth, borderColor: 'rgba(255,255,255,0.08)',
  },
  tagChipActive: { backgroundColor: colors.textPrimary, borderColor: colors.textPrimary },
  tagDot: { width: 6, height: 6, borderRadius: 3 },
  tagText: { ...typography.micro, color: colors.textSecondary },
  tagTextActive: { color: '#000', fontWeight: '500' },
  tagBanner: {
    flexDirection: 'row', alignItems: 'center', gap: spacing.sm,
    paddingVertical: 10, paddingHorizontal: 14,
    borderRadius: 12,
    backgroundColor: 'rgba(255,255,255,0.04)',
    borderWidth: StyleSheet.hairlineWidth, borderColor: 'rgba(255,255,255,0.08)',
    marginBottom: spacing.lg,
  },
  tagBannerText: { flex: 1, ...typography.bodySm, color: colors.textMuted, fontSize: 12 },
  tagBannerClear: { ...typography.micro, fontSize: 10, color: colors.textPrimary },
  railLabel: { ...typography.micro, fontSize: 10, letterSpacing: 2, textTransform: 'uppercase', color: colors.textFaint, marginBottom: spacing.sm, marginLeft: 2 },
  section: { marginBottom: spacing['2xl'] },
});
