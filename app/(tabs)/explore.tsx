import { useState, useMemo } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity,
  TextInput, Image, FlatList,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors } from '../../constants/colors';
import { ALL_CONTENT, searchContent } from '../../data/database';

const CULTURAL_LENSES = [
  { id: 'all', label: 'All', color: Colors.amber },
  { id: 'indigenous', label: 'Indigenous', color: '#10B981' },
  { id: 'black-canadian', label: 'Black Canadian', color: '#3B82F6' },
  { id: 'francophone', label: 'Francophone', color: '#8B5CF6' },
  { id: 'immigrant', label: 'Immigrant Stories', color: '#F59E0B' },
  { id: 'cree', label: 'Cree', color: '#EC4899' },
  { id: 'metis', label: 'Métis', color: '#14B8A6' },
  { id: 'acadian', label: 'Acadian', color: '#F97316' },
  { id: 'somali', label: 'Somali-Canadian', color: '#6366F1' },
  { id: 'haitian', label: 'Haitian-Canadian', color: '#EF4444' },
  { id: 'quebecois', label: 'Québécois', color: '#A855F7' },
  { id: 'chinese', label: 'Chinese-Canadian', color: '#06B6D4' },
];

const TYPE_FILTERS = ['All', 'Stories', 'Music', 'Film', 'Archive'];

export default function ExploreScreen() {
  const insets = useSafeAreaInsets();
  const [query, setQuery] = useState('');
  const [selectedLens, setSelectedLens] = useState('all');
  const [selectedType, setSelectedType] = useState('All');

  const filtered = useMemo(() => {
    let items = query.trim() ? searchContent(query) : ALL_CONTENT;
    if (selectedType !== 'All') {
      const typeMap: Record<string, string> = {
        Stories: 'story', Music: 'music', Film: 'film', Archive: 'archive',
      };
      const t = typeMap[selectedType];
      if (t) items = items.filter(i => i.type === t);
    }
    if (selectedLens !== 'all') {
      items = items.filter(i => i.tags.some(tag => tag.toLowerCase().includes(selectedLens)));
    }
    return items;
  }, [query, selectedLens, selectedType]);

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.header}>
        <Text style={styles.title}>Explore</Text>
        <Text style={styles.subtitle}>SEEN — Canadian Stories</Text>
      </View>

      <View style={styles.searchContainer}>
        <Ionicons name="search-outline" size={18} color={Colors.textMuted} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search stories, creators, themes..."
          placeholderTextColor={Colors.textMuted}
          value={query}
          onChangeText={setQuery}
          returnKeyType="search"
        />
        {query.length > 0 && (
          <TouchableOpacity onPress={() => setQuery('')}>
            <Ionicons name="close-circle" size={18} color={Colors.textMuted} />
          </TouchableOpacity>
        )}
      </View>

      {/* Type filters */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.typeScroll}
        contentContainerStyle={styles.typeContent}
      >
        {TYPE_FILTERS.map(type => (
          <TouchableOpacity
            key={type}
            style={[styles.typeChip, selectedType === type && styles.typeChipActive]}
            onPress={() => setSelectedType(type)}
          >
            <Text style={[styles.typeChipText, selectedType === type && styles.typeChipTextActive]}>
              {type}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 120 }}>
        {/* Cultural lens */}
        <View style={styles.lensSection}>
          <Text style={styles.sectionLabel}>CULTURAL LENS</Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.lensContent}
          >
            {CULTURAL_LENSES.map(lens => {
              const active = selectedLens === lens.id;
              return (
                <TouchableOpacity
                  key={lens.id}
                  style={[
                    styles.lensChip,
                    active && { borderColor: lens.color, backgroundColor: `${lens.color}20` },
                  ]}
                  onPress={() => setSelectedLens(active ? 'all' : lens.id)}
                >
                  {active && <View style={[styles.lensDot, { backgroundColor: lens.color }]} />}
                  <Text style={[styles.lensChipText, active && { color: lens.color }]}>
                    {lens.label}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        </View>

        {/* Results */}
        <View style={styles.results}>
          <Text style={styles.resultCount}>{filtered.length} results</Text>
          <View style={styles.grid}>
            {filtered.map(item => (
              <TouchableOpacity
                key={item.id}
                style={styles.gridCard}
                onPress={() => router.push({ pathname: '/story/[id]', params: { id: item.id } })}
                activeOpacity={0.8}
              >
                <Image source={{ uri: item.mediaSource }} style={styles.gridImg} />
                <LinearGradient
                  colors={['transparent', 'rgba(0,0,0,0.9)']}
                  style={styles.gridGrad}
                >
                  <View style={styles.gridTypeBadge}>
                    <Text style={styles.gridTypeText}>{item.type.toUpperCase()}</Text>
                  </View>
                  <Text style={styles.gridTitle} numberOfLines={2}>{item.title}</Text>
                  <Text style={styles.gridMeta} numberOfLines={1}>{item.creator}</Text>
                </LinearGradient>
                {item.new && (
                  <View style={styles.newBadge}>
                    <Text style={styles.newBadgeText}>NEW</Text>
                  </View>
                )}
              </TouchableOpacity>
            ))}
          </View>
          {filtered.length === 0 && (
            <View style={styles.empty}>
              <Ionicons name="search-outline" size={40} color={Colors.textMuted} />
              <Text style={styles.emptyTitle}>No results found</Text>
              <Text style={styles.emptySub}>Try a different search or lens</Text>
            </View>
          )}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  header: {
    paddingHorizontal: 20,
    paddingTop: 8,
    paddingBottom: 14,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  title: { fontSize: 26, fontFamily: Colors.fontBold, color: Colors.textPrimary, letterSpacing: 1 },
  subtitle: { fontSize: 11, fontFamily: Colors.fontRegular, color: Colors.textMuted, letterSpacing: 2, marginTop: 2 },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginHorizontal: 16,
    marginTop: 14,
    paddingHorizontal: 14,
    paddingVertical: 12,
    backgroundColor: Colors.surface,
    borderRadius: Colors.radius,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  searchInput: {
    flex: 1,
    fontSize: 15,
    fontFamily: Colors.fontRegular,
    color: Colors.textPrimary,
  },
  typeScroll: { marginTop: 12 },
  typeContent: { paddingHorizontal: 16, gap: 8 },
  typeChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: Colors.radiusFull,
    borderWidth: 1,
    borderColor: Colors.border,
    backgroundColor: Colors.surface,
  },
  typeChipActive: { backgroundColor: Colors.amber, borderColor: Colors.amber },
  typeChipText: { fontSize: 13, fontFamily: Colors.fontMedium, color: Colors.textSecondary },
  typeChipTextActive: { color: '#000' },
  lensSection: { marginTop: 20 },
  sectionLabel: {
    fontSize: 10,
    fontFamily: Colors.fontSemiBold,
    color: Colors.textMuted,
    letterSpacing: 3,
    paddingHorizontal: 20,
    marginBottom: 12,
  },
  lensContent: { paddingHorizontal: 16, gap: 8 },
  lensChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: Colors.radiusFull,
    borderWidth: 1,
    borderColor: Colors.border,
    backgroundColor: Colors.surface,
  },
  lensDot: { width: 6, height: 6, borderRadius: 3 },
  lensChipText: { fontSize: 12, fontFamily: Colors.fontMedium, color: Colors.textSecondary },
  results: { marginTop: 20, paddingHorizontal: 16 },
  resultCount: {
    fontSize: 11,
    fontFamily: Colors.fontRegular,
    color: Colors.textMuted,
    letterSpacing: 1,
    marginBottom: 14,
  },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  gridCard: {
    width: '48%',
    aspectRatio: 0.85,
    borderRadius: Colors.radius,
    overflow: 'hidden',
    backgroundColor: Colors.surface,
  },
  gridImg: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, width: '100%', height: '100%' },
  gridGrad: {
    position: 'absolute',
    bottom: 0, left: 0, right: 0,
    padding: 10,
    paddingTop: 30,
    gap: 3,
  },
  gridTypeBadge: {
    backgroundColor: 'rgba(255,255,255,0.15)',
    alignSelf: 'flex-start',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    marginBottom: 4,
  },
  gridTypeText: { fontSize: 8, fontFamily: Colors.fontSemiBold, color: Colors.textSecondary, letterSpacing: 1.5 },
  gridTitle: { fontSize: 13, fontFamily: Colors.fontSemiBold, color: Colors.textPrimary, lineHeight: 17 },
  gridMeta: { fontSize: 11, fontFamily: Colors.fontRegular, color: Colors.textSecondary },
  newBadge: {
    position: 'absolute', top: 8, right: 8,
    backgroundColor: Colors.amber, paddingHorizontal: 6, paddingVertical: 2, borderRadius: 4,
  },
  newBadgeText: { fontSize: 8, fontFamily: Colors.fontBold, color: '#000', letterSpacing: 1 },
  empty: { alignItems: 'center', paddingVertical: 60, gap: 12 },
  emptyTitle: { fontSize: 18, fontFamily: Colors.fontSemiBold, color: Colors.textSecondary },
  emptySub: { fontSize: 14, fontFamily: Colors.fontRegular, color: Colors.textMuted },
});
