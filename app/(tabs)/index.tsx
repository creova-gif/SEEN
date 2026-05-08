import { ScrollView, View, Text, TouchableOpacity, Image, StyleSheet, RefreshControl } from 'react-native';
import { useState } from 'react';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Colors } from '../../constants/colors';
import { StoryCard } from '../../components/StoryCard';
import { MusicCard } from '../../components/MusicCard';
import { STORY_CONTENT, MUSIC_CONTENT, FILM_CONTENT } from '../../data/database';
import { useStoryState } from '../../contexts/StoryStateContext';
import { useAuth } from '../../contexts/AuthContext';

const CULTURAL_TAGS = [
  'Indigenous', 'Black Canadian', 'Francophone', 'Immigrant Stories',
  'Métis', 'Cree', 'Acadian', 'Haitian-Canadian',
];

export default function ForYouScreen() {
  const insets = useSafeAreaInsets();
  const { state } = useStoryState();
  const { state: auth } = useAuth();
  const [refreshing, setRefreshing] = useState(false);

  const featured = STORY_CONTENT.find(s => s.featured && s.trending) ?? STORY_CONTENT[0];
  const music = MUSIC_CONTENT.slice(0, 5);
  const stories = STORY_CONTENT.slice(0, 6);
  const films = FILM_CONTENT.slice(0, 3);

  const isCreator = state.userRole === 'creator' || state.userRole === 'admin';

  const onRefresh = async () => {
    setRefreshing(true);
    await new Promise(r => setTimeout(r, 900));
    setRefreshing(false);
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.header}>
        <View>
          <Text style={styles.logo}>SEEN</Text>
          <Text style={styles.logoSub}>by CREOVA</Text>
        </View>
        <View style={styles.headerRight}>
          <TouchableOpacity style={styles.iconBtn} onPress={() => router.push('/settings')}>
            <Ionicons name="search-outline" size={22} color={Colors.textSecondary} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.iconBtn} onPress={() => router.push('/settings')}>
            <Ionicons name="notifications-outline" size={22} color={Colors.textSecondary} />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scroll}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={Colors.amber} />}
      >
        {isCreator && (
          <View style={styles.creatorBanner}>
            <Ionicons name="analytics-outline" size={16} color={Colors.violet} />
            <Text style={styles.creatorBannerText}>Creator Mode — 3 drafts awaiting review</Text>
            <TouchableOpacity>
              <Text style={styles.creatorBannerLink}>View →</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Featured Story */}
        <TouchableOpacity
          style={styles.featured}
          onPress={() => router.push({ pathname: '/story/[id]', params: { id: featured.id } })}
          activeOpacity={0.9}
        >
          <Image source={{ uri: featured.mediaSource }} style={styles.featuredImg} />
          <LinearGradient
            colors={['transparent', 'rgba(0,0,0,0.6)', 'rgba(0,0,0,0.97)']}
            style={styles.featuredGrad}
          >
            <View style={styles.featuredTags}>
              {featured.tags.slice(0, 2).map(tag => (
                <View key={tag} style={styles.tag}>
                  <Text style={styles.tagText}>{tag.replace('-', ' ').toUpperCase()}</Text>
                </View>
              ))}
              {featured.trending && (
                <View style={[styles.tag, styles.tagTrending]}>
                  <Text style={[styles.tagText, { color: Colors.amber }]}>TRENDING</Text>
                </View>
              )}
            </View>
            <Text style={styles.featuredTitle}>{featured.title}</Text>
            <Text style={styles.featuredMeta}>{featured.creator} · {featured.duration}</Text>
            <TouchableOpacity
              style={styles.playBtn}
              onPress={() => router.push({ pathname: '/story/[id]', params: { id: featured.id } })}
            >
              <Ionicons name="play" size={16} color="#000" />
              <Text style={styles.playBtnText}>Begin Story</Text>
            </TouchableOpacity>
          </LinearGradient>
        </TouchableOpacity>

        {/* Cultural Lens */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.tagsScroll} contentContainerStyle={styles.tagsContent}>
          {CULTURAL_TAGS.map(tag => (
            <TouchableOpacity key={tag} style={styles.lensTag}>
              <Text style={styles.lensTagText}>{tag}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* CREOVA Music */}
        <View style={styles.section}>
          <View style={styles.sectionRow}>
            <Text style={styles.sectionTitle}>CREOVA MUSIC</Text>
            <TouchableOpacity>
              <Text style={styles.sectionLink}>See all</Text>
            </TouchableOpacity>
          </View>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingRight: 20 }}>
            {music.map(item => <MusicCard key={item.id} item={item} />)}
          </ScrollView>
        </View>

        {/* Stories */}
        <View style={styles.section}>
          <View style={styles.sectionRow}>
            <Text style={styles.sectionTitle}>STORIES FOR YOU</Text>
          </View>
          <View style={styles.cardList}>
            {stories.map(item => <StoryCard key={item.id} item={item} />)}
          </View>
        </View>

        {/* Films */}
        <View style={styles.section}>
          <View style={styles.sectionRow}>
            <Text style={styles.sectionTitle}>DOCUMENTARY & FILM</Text>
          </View>
          <View style={styles.cardList}>
            {films.map(item => <StoryCard key={item.id} item={item} />)}
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  logo: {
    fontSize: 22,
    fontFamily: Colors.fontBold,
    color: Colors.textPrimary,
    letterSpacing: 6,
  },
  logoSub: {
    fontSize: 9,
    fontFamily: Colors.fontRegular,
    color: Colors.textMuted,
    letterSpacing: 3,
  },
  headerRight: { flexDirection: 'row', gap: 4 },
  iconBtn: { width: 40, height: 40, alignItems: 'center', justifyContent: 'center' },
  scroll: { paddingBottom: 120 },
  creatorBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginHorizontal: 16,
    marginTop: 12,
    padding: 12,
    backgroundColor: Colors.violetDim,
    borderRadius: Colors.radiusSm,
    borderWidth: 1,
    borderColor: `${Colors.violet}33`,
  },
  creatorBannerText: {
    flex: 1,
    fontSize: 12,
    fontFamily: Colors.fontRegular,
    color: Colors.textSecondary,
  },
  creatorBannerLink: {
    fontSize: 12,
    fontFamily: Colors.fontSemiBold,
    color: Colors.violet,
  },
  featured: {
    marginHorizontal: 16,
    marginTop: 16,
    height: 420,
    borderRadius: Colors.radiusLg,
    overflow: 'hidden',
  },
  featuredImg: {
    position: 'absolute',
    top: 0, left: 0, right: 0, bottom: 0,
    width: '100%', height: '100%',
  },
  featuredGrad: {
    position: 'absolute',
    bottom: 0, left: 0, right: 0,
    paddingHorizontal: 20,
    paddingBottom: 22,
    paddingTop: 80,
    gap: 8,
  },
  featuredTags: { flexDirection: 'row', gap: 8, flexWrap: 'wrap' },
  tag: {
    backgroundColor: 'rgba(255,255,255,0.12)',
    borderRadius: 4,
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  tagTrending: { backgroundColor: Colors.amberDim },
  tagText: {
    fontSize: 9,
    fontFamily: Colors.fontSemiBold,
    color: Colors.textSecondary,
    letterSpacing: 2,
  },
  featuredTitle: {
    fontSize: 26,
    fontFamily: Colors.fontBold,
    color: Colors.textPrimary,
    lineHeight: 32,
  },
  featuredMeta: {
    fontSize: 13,
    fontFamily: Colors.fontRegular,
    color: Colors.textSecondary,
  },
  playBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: Colors.amber,
    paddingHorizontal: 20,
    paddingVertical: 11,
    borderRadius: Colors.radiusSm,
    alignSelf: 'flex-start',
    marginTop: 4,
  },
  playBtnText: {
    fontSize: 13,
    fontFamily: Colors.fontSemiBold,
    color: '#000',
  },
  tagsScroll: { marginTop: 20 },
  tagsContent: { paddingHorizontal: 16, gap: 8, flexDirection: 'row' },
  lensTag: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: Colors.radiusFull,
    borderWidth: 1,
    borderColor: Colors.border,
    backgroundColor: Colors.surface,
  },
  lensTagText: {
    fontSize: 12,
    fontFamily: Colors.fontMedium,
    color: Colors.textSecondary,
  },
  section: { marginTop: 28, paddingLeft: 20 },
  sectionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingRight: 20,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 10,
    fontFamily: Colors.fontSemiBold,
    color: Colors.textMuted,
    letterSpacing: 3,
  },
  sectionLink: {
    fontSize: 12,
    fontFamily: Colors.fontRegular,
    color: Colors.amber,
  },
  cardList: { paddingRight: 20 },
});
