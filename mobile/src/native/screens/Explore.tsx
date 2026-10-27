import { useNavigation } from '@react-navigation/native';
import { useMemo, useState } from 'react';
import { FlatList, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { getPublicStories } from '../data';
import { useApp } from '../storage';
import { c, font, gutter, radius, space } from '../theme';
import { Chip } from '../ui';
import { StoryCard } from './ForYou';

export function Explore() {
  const nav = useNavigation<any>();
  const insets = useSafeAreaInsets();
  const { lang } = useApp();
  const all = getPublicStories();
  const topics = useMemo(() => {
    const n = new Map<string, number>();
    all.forEach(s => s.culturalThemes.forEach(t => n.set(t, (n.get(t) ?? 0) + 1)));
    return [...n.entries()].sort((a, b) => b[1] - a[1]).map(([t]) => t).slice(0, 10);
  }, [all]);
  const [topic, setTopic] = useState<string | null>(null);
  const [q, setQ] = useState('');
  const shown = all.filter(s => (!topic || s.culturalThemes.includes(topic)) && (!q.trim() || JSON.stringify(s.title).toLowerCase().includes(q.trim().toLowerCase())));

  return (
    <View style={{ flex: 1, backgroundColor: c.canvas, paddingTop: insets.top }}>
      <FlatList
        data={shown}
        numColumns={2}
        keyExtractor={s => s.id}
        columnWrapperStyle={{ gap: space.md, paddingHorizontal: gutter, marginBottom: space.lg }}
        ListHeaderComponent={
          <View>
            <Text style={styles.h1}>Explore</Text>
            <TextInput
              value={q}
              onChangeText={setQ}
              placeholder="Search stories"
              placeholderTextColor={c.muted}
              accessibilityLabel="Search stories"
              style={styles.search}
              returnKeyType="search"
            />
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: gutter, gap: space.sm, marginBottom: space.lg }}>
              {topics.map(t => (
                <Chip key={t} label={t} selected={topic === t} onPress={() => setTopic(topic === t ? null : t)} />
              ))}
            </ScrollView>
          </View>
        }
        renderItem={({ item }) => (
          <View style={{ flex: 1 }}>
            <StoryCard story={item} wide onPress={() => nav.navigate('Story', { id: item.id })} />
          </View>
        )}
        ListEmptyComponent={<Text style={styles.empty}>No stories match. Try another topic.</Text>}
        contentContainerStyle={{ paddingBottom: space.xxl }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  h1: { color: c.text, fontFamily: font.display, fontSize: 34, marginHorizontal: gutter, marginTop: space.lg, marginBottom: space.md },
  search: { marginHorizontal: gutter, marginBottom: space.md, minHeight: 48, borderRadius: radius.pill, borderWidth: 1, borderColor: c.border, backgroundColor: c.surface, color: c.text, paddingHorizontal: space.lg, fontSize: 15 },
  empty: { color: c.muted, textAlign: 'center', marginTop: space.xxl },
});
