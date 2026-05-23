import { useEffect, useMemo, useRef, useState } from 'react';
import {
  View,
  Text,
  Pressable,
  ScrollView,
  StyleSheet,
  Animated,
  Easing,
  Image,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { LIVE_ITEMS, STORY_ALL, MUSIC_ALL, FILM_ALL, type UnifiedItem } from '../data/aggregate';
import { colors, spacing, radius, typography, layout } from '../constants/theme';

// SEEN home — a mobile-app home screen, not a marketing site.
// Compact hero, content rails (Stories / Music / Film), and quick links
// into the rest of the app. Tapping the SEEN wordmark in the in-app
// Header brings the user back here from any screen.
export default function Home() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const pulse = useRef(new Animated.Value(0)).current;

  const [onboarded, setOnboarded] = useState(false);
  const [name, setName] = useState<string | null>(null);
  useEffect(() => {
    AsyncStorage.multiGet(['seen_onboarding_completed', 'seen_user_name'])
      .then((entries) => {
        const map = Object.fromEntries(entries);
        setOnboarded(map['seen_onboarding_completed'] === 'true');
        setName(map['seen_user_name'] || null);
      })
      .catch(() => {});
  }, []);

  // Slow ambient gradient pulse on the hero. Stored so we can stop the loop
  // on unmount — otherwise it keeps running across route changes.
  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(pulse, { toValue: 1, duration: 4000, easing: Easing.inOut(Easing.quad), useNativeDriver: true }),
        Animated.timing(pulse, { toValue: 0, duration: 4000, easing: Easing.inOut(Easing.quad), useNativeDriver: true }),
      ]),
    );
    loop.start();
    return () => loop.stop();
  }, [pulse]);
  const gradOpacity = pulse.interpolate({ inputRange: [0, 1], outputRange: [0.30, 0.60] });

  const featured = useMemo(
    () => LIVE_ITEMS.filter((i) => i.coverImage)[0],
    [],
  );
  const stories = useMemo(() => STORY_ALL.filter((i) => i.coverImage).slice(0, 8), []);
  const music = useMemo(() => MUSIC_ALL.filter((i) => i.coverImage).slice(0, 8), []);
  const films = useMemo(() => FILM_ALL.filter((i) => i.coverImage).slice(0, 6), []);

  const ctaLabel = onboarded ? 'Enter SEEN' : 'Begin Listening';
  const goPrimary = () => router.push(onboarded ? '/(tabs)' : '/onboarding');

  return (
    <ScrollView
      style={styles.screen}
      contentContainerStyle={{ paddingBottom: insets.bottom + spacing['4xl'] }}
      showsVerticalScrollIndicator={false}
    >
      {/* ---------------- Hero (compact, app-style) ---------------- */}
      <View style={[styles.hero, { paddingTop: insets.top + spacing.xl }]}>
        <Animated.View style={[StyleSheet.absoluteFillObject, { opacity: gradOpacity }]}>
          <LinearGradient
            colors={['rgba(76,29,149,0.45)', '#000', 'rgba(30,58,138,0.40)']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={StyleSheet.absoluteFillObject}
          />
        </Animated.View>

        <View style={styles.heroInner}>
          <Text style={styles.heroEyebrow}>{name ? `Welcome back, ${name}` : 'SEEN · BY CREOVA'}</Text>
          <Text style={styles.heroTitle}>Where stories live,{'\n'}where culture breathes.</Text>
          <View style={styles.ctaRow}>
            <Pressable
              onPress={goPrimary}
              style={({ pressed }) => [styles.primaryCta, pressed && { opacity: 0.85 }]}
              accessibilityRole="button"
              accessibilityLabel={ctaLabel}
            >
              <Text style={styles.primaryCtaLabel}>{ctaLabel}</Text>
              <Ionicons name="arrow-forward" size={14} color="#000" />
            </Pressable>
            <Pressable
              onPress={() => router.push('/(tabs)/explore')}
              style={({ pressed }) => [styles.ghostCta, pressed && { opacity: 0.6 }]}
              accessibilityRole="button"
              accessibilityLabel="Explore"
            >
              <Ionicons name="compass-outline" size={14} color={colors.textPrimary} />
              <Text style={styles.ghostCtaLabel}>Explore</Text>
            </Pressable>
          </View>
        </View>
      </View>

      {/* ---------------- Featured hero card ---------------- */}
      {featured && (
        <View style={styles.featuredWrap}>
          <Pressable
            onPress={() => router.push(`/story/${featured.id}`)}
            style={({ pressed }) => [styles.featured, pressed && { opacity: 0.9 }]}
            accessibilityRole="button"
            accessibilityLabel={`Featured: ${featured.title}`}
          >
            <Image source={{ uri: featured.coverImage! }} style={styles.featuredImg} />
            <LinearGradient
              colors={['transparent', 'rgba(0,0,0,0.92)']}
              style={StyleSheet.absoluteFillObject}
            />
            <View style={styles.featuredText}>
              <Text style={styles.featuredEyebrow}>FEATURED · {featured.type.toUpperCase()}</Text>
              <Text style={styles.featuredTitle} numberOfLines={2}>{featured.title}</Text>
              <Text style={styles.featuredMeta} numberOfLines={1}>
                {featured.creator} · {featured.duration ?? ''}
              </Text>
              <View style={styles.featuredPlay}>
                <Ionicons name="play" size={14} color="#000" style={{ marginLeft: 2 }} />
              </View>
            </View>
          </Pressable>
        </View>
      )}

      {/* ---------------- Rails ---------------- */}
      <Rail
        title="Story worlds"
        sub="Cinematic audio chapters"
        items={stories}
        onItem={(i) => router.push(`/story/${i.id}`)}
        onSeeAll={() => router.push('/(tabs)/explore')}
        variant="poster"
      />
      <Rail
        title="CREOVA Music"
        sub="Tracks, EPs, and albums"
        items={music}
        onItem={(i) => router.push(`/story/${i.id}`)}
        onSeeAll={() => router.push('/(tabs)/explore')}
        variant="square"
      />
      <Rail
        title="Film"
        sub="Short and feature-length"
        items={films}
        onItem={(i) => router.push(`/story/${i.id}`)}
        onSeeAll={() => router.push('/(tabs)/explore')}
        variant="wide"
      />

      {/* ---------------- Quick links ---------------- */}
      <View style={styles.quickWrap}>
        <Text style={styles.sectionEyebrow}>SHORTCUTS</Text>
        <View style={styles.quickGrid}>
          <Quick icon="sparkles-outline" label="For You"   onPress={() => router.push('/(tabs)')} />
          <Quick icon="compass-outline"  label="Explore"   onPress={() => router.push('/(tabs)/explore')} />
          <Quick icon="bookmark-outline" label="Library"   onPress={() => router.push('/(tabs)/library')} />
          <Quick icon="person-outline"   label="Profile"   onPress={() => router.push('/(tabs)/profile')} />
        </View>
      </View>
    </ScrollView>
  );
}

/* ------------------------------ Sub-components ------------------------------ */

function Rail({
  title,
  sub,
  items,
  onItem,
  onSeeAll,
  variant,
}: {
  title: string;
  sub?: string;
  items: UnifiedItem[];
  onItem: (i: UnifiedItem) => void;
  onSeeAll: () => void;
  variant: 'poster' | 'square' | 'wide';
}) {
  if (!items.length) return null;
  const size = variant === 'poster'
    ? { w: 140, h: 200 }
    : variant === 'square'
    ? { w: 140, h: 140 }
    : { w: 220, h: 130 };

  return (
    <View style={styles.rail}>
      <View style={styles.railHeader}>
        <View style={{ flex: 1 }}>
          <Text style={styles.railTitle}>{title}</Text>
          {sub && <Text style={styles.railSub}>{sub}</Text>}
        </View>
        <Pressable onPress={onSeeAll} hitSlop={8} accessibilityRole="button" accessibilityLabel={`See all ${title}`}>
          <Text style={styles.railSeeAll}>See all</Text>
        </Pressable>
      </View>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.railContent}
      >
        {items.map((item) => (
          <Pressable
            key={item.id}
            onPress={() => onItem(item)}
            style={({ pressed }) => [
              styles.card,
              { width: size.w, height: size.h },
              pressed && { opacity: 0.85 },
            ]}
            accessibilityRole="button"
            accessibilityLabel={`Open ${item.title}`}
          >
            <Image source={{ uri: item.coverImage! }} style={styles.cardImg} />
            <LinearGradient
              colors={['transparent', 'rgba(0,0,0,0.88)']}
              style={StyleSheet.absoluteFillObject}
            />
            <View style={styles.cardText}>
              <Text style={styles.cardTitle} numberOfLines={variant === 'wide' ? 2 : 2}>
                {item.title}
              </Text>
              <Text style={styles.cardMeta} numberOfLines={1}>{item.creator}</Text>
            </View>
          </Pressable>
        ))}
      </ScrollView>
    </View>
  );
}

function Quick({
  icon,
  label,
  onPress,
}: {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  onPress: () => void;
}) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [styles.quick, pressed && { opacity: 0.7 }]}
      accessibilityRole="button"
      accessibilityLabel={label}
    >
      <Ionicons name={icon} size={20} color={colors.textHigh} />
      <Text style={styles.quickLabel}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.background },

  /* Hero */
  hero: { paddingBottom: spacing['2xl'], position: 'relative' },
  heroInner: {
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.xl,
    maxWidth: layout.containerMaxWidth,
    alignSelf: 'center',
    width: '100%',
  },
  heroEyebrow: {
    ...typography.brandEyebrow,
    fontSize: 10,
    letterSpacing: 3,
    color: colors.textFaint,
    marginBottom: spacing.md,
  },
  heroTitle: {
    fontSize: 26,
    lineHeight: 32,
    fontWeight: '300',
    color: colors.textPrimary,
    letterSpacing: -0.4,
    marginBottom: spacing.xl,
  },
  ctaRow: { flexDirection: 'row', gap: spacing.sm },
  primaryCta: {
    flexDirection: 'row', alignItems: 'center', gap: spacing.sm,
    paddingVertical: 12, paddingHorizontal: spacing.xl,
    borderRadius: radius.full, backgroundColor: '#fff',
  },
  primaryCtaLabel: { ...typography.cta, color: '#000', fontSize: 12 },
  ghostCta: {
    flexDirection: 'row', alignItems: 'center', gap: spacing.sm,
    paddingVertical: 12, paddingHorizontal: spacing.lg,
    borderRadius: radius.full, borderWidth: 1, borderColor: colors.borderStrong,
  },
  ghostCtaLabel: { ...typography.cta, color: colors.textPrimary, fontSize: 12 },

  /* Featured card */
  featuredWrap: {
    paddingHorizontal: spacing.xl, paddingTop: spacing.lg,
    maxWidth: layout.containerMaxWidth, alignSelf: 'center', width: '100%',
  },
  featured: {
    width: '100%', height: 200, borderRadius: radius.lg,
    overflow: 'hidden', backgroundColor: '#111',
  },
  featuredImg: { ...StyleSheet.absoluteFillObject as any, width: '100%', height: '100%' },
  featuredText: { position: 'absolute', left: 0, right: 0, bottom: 0, padding: spacing.lg },
  featuredEyebrow: { ...typography.microSm, color: '#fff', fontSize: 9, letterSpacing: 2, marginBottom: 6, opacity: 0.85 },
  featuredTitle: { ...typography.h2, color: '#fff', fontSize: 20, lineHeight: 24, letterSpacing: -0.2 },
  featuredMeta: { ...typography.bodySm, color: 'rgba(255,255,255,0.75)', fontSize: 12, marginTop: 4 },
  featuredPlay: {
    position: 'absolute', right: spacing.lg, bottom: spacing.lg,
    width: 40, height: 40, borderRadius: 20, backgroundColor: '#fff',
    alignItems: 'center', justifyContent: 'center',
  },

  /* Rails */
  rail: {
    paddingTop: spacing['2xl'],
    maxWidth: layout.containerMaxWidth, alignSelf: 'center', width: '100%',
  },
  railHeader: {
    flexDirection: 'row', alignItems: 'flex-end',
    paddingHorizontal: spacing.xl, marginBottom: spacing.md, gap: spacing.md,
  },
  railTitle: { ...typography.h2, color: colors.textPrimary, fontSize: 17, letterSpacing: -0.2 },
  railSub: { ...typography.bodySm, color: colors.textFaint, fontSize: 11, marginTop: 2 },
  railSeeAll: { ...typography.cta, color: colors.textFaint, fontSize: 10, letterSpacing: 2 },
  railContent: { gap: spacing.md, paddingHorizontal: spacing.xl },
  card: { borderRadius: radius.md, overflow: 'hidden', backgroundColor: '#111' },
  cardImg: { width: '100%', height: '100%' },
  cardText: { position: 'absolute', left: 0, right: 0, bottom: 0, padding: 10 },
  cardTitle: { ...typography.h3, color: '#fff', fontSize: 12, lineHeight: 16 },
  cardMeta: { ...typography.bodySm, color: 'rgba(255,255,255,0.65)', fontSize: 10, marginTop: 2 },

  /* Shortcuts */
  quickWrap: {
    paddingHorizontal: spacing.xl, paddingTop: spacing['3xl'],
    maxWidth: layout.containerMaxWidth, alignSelf: 'center', width: '100%',
  },
  sectionEyebrow: { ...typography.micro, color: colors.textWhisper, fontSize: 9, letterSpacing: 2, marginBottom: spacing.md },
  quickGrid: { flexDirection: 'row', gap: spacing.sm },
  quick: {
    flex: 1, paddingVertical: spacing.lg, gap: 6,
    alignItems: 'center', justifyContent: 'center',
    borderRadius: radius.md, backgroundColor: 'rgba(255,255,255,0.04)',
    borderWidth: 1, borderColor: colors.borderSubtle,
  },
  quickLabel: { ...typography.microSm, color: colors.textHigh, fontSize: 10, letterSpacing: 1 },
});
