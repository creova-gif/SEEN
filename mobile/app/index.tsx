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
  Platform,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { LIVE_ITEMS } from '../data/aggregate';
import { colors, spacing, radius, typography, layout } from '../constants/theme';

// Public landing page at `/` — marketing-style hero, what SEEN is,
// featured stories pulled from the live catalog, and CTAs that route
// to onboarding (new visitors) or straight into the tabs (returning users).
// The SEEN wordmark in the in-app Header navigates back here.
export default function Home() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const pulse = useRef(new Animated.Value(0)).current;

  const [onboarded, setOnboarded] = useState<boolean | null>(null);
  useEffect(() => {
    AsyncStorage.getItem('seen_onboarding_completed')
      .then((v) => setOnboarded(v === 'true'))
      .catch(() => setOnboarded(false));
  }, []);

  // Slow ambient gradient pulse on the hero — matches the splash treatment.
  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulse, { toValue: 1, duration: 4000, easing: Easing.inOut(Easing.quad), useNativeDriver: true }),
        Animated.timing(pulse, { toValue: 0, duration: 4000, easing: Easing.inOut(Easing.quad), useNativeDriver: true }),
      ]),
    ).start();
  }, [pulse]);
  const gradOpacity = pulse.interpolate({ inputRange: [0, 1], outputRange: [0.25, 0.55] });

  // Pick a small, deterministic set of featured items with cover art.
  const featured = useMemo(
    () => LIVE_ITEMS.filter((i) => i.coverImage).slice(0, 6),
    [],
  );

  const primaryCta = onboarded ? 'Enter SEEN' : 'Begin Listening';
  const goPrimary = () => router.push(onboarded ? '/(tabs)' : '/onboarding');
  const goSignIn = () => router.push('/onboarding');

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={{ paddingBottom: insets.bottom + spacing['4xl'] }}
      showsVerticalScrollIndicator={false}
    >
      {/* ------------------------------ Hero ------------------------------ */}
      <View style={[styles.hero, { paddingTop: insets.top + spacing['3xl'] }]}>
        <Animated.View style={[StyleSheet.absoluteFillObject, { opacity: gradOpacity }]}>
          <LinearGradient
            colors={['rgba(76,29,149,0.45)', '#000000', 'rgba(30,58,138,0.40)']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={StyleSheet.absoluteFillObject}
          />
        </Animated.View>

        <View style={styles.heroInner}>
          <View style={styles.eyeRing}>
            <Ionicons name="eye-outline" size={24} color={colors.textPrimary} />
          </View>
          <Text style={styles.heroTitle}>SEEN</Text>
          <Text style={styles.heroEyebrow}>BY CREOVA</Text>
          <Text style={styles.heroTagline}>
            Where stories live,{'\n'}where culture breathes.
          </Text>
          <Text style={styles.heroBody}>
            Canadian stories from voices that shaped this land — and were never truly heard.
          </Text>

          <View style={styles.ctaRow}>
            <Pressable
              onPress={goPrimary}
              style={({ pressed }) => [styles.primaryCta, pressed && { opacity: 0.85 }]}
              accessibilityRole="button"
              accessibilityLabel={primaryCta}
            >
              <Text style={styles.primaryCtaLabel}>{primaryCta}</Text>
              <Ionicons name="arrow-forward" size={14} color="#000" />
            </Pressable>
            {!onboarded && (
              <Pressable
                onPress={goSignIn}
                style={({ pressed }) => [styles.secondaryCta, pressed && { opacity: 0.6 }]}
                accessibilityRole="button"
                accessibilityLabel="Sign in"
              >
                <Text style={styles.secondaryCtaLabel}>Sign in</Text>
              </Pressable>
            )}
          </View>

          <View style={styles.statsRow}>
            <Stat number={`${LIVE_ITEMS.length}+`} label="Live works" />
            <View style={styles.statDivider} />
            <Stat number="6" label="Cultures" />
            <View style={styles.statDivider} />
            <Stat number="EN · FR" label="First-class" />
          </View>
        </View>
      </View>

      {/* --------------------------- What is SEEN --------------------------- */}
      <Section eyebrow="Manifesto" title="This is not social media">
        <Text style={styles.body}>
          SEEN is a cultural operating system — an immersive space for stories, sound,
          and shared identity. No follower counts. No engagement metrics. Just human
          connection through art.
        </Text>
        <View style={styles.pillarGrid}>
          <Pillar
            icon="headset-outline"
            title="Cinematic audio"
            desc="Multi-chapter story worlds with captions and music."
          />
          <Pillar
            icon="people-outline"
            title="Voices first"
            desc="Indigenous, Black Canadian, francophone, immigrant creators."
          />
          <Pillar
            icon="shield-checkmark-outline"
            title="CMF compliant"
            desc="Canada Media Fund eligibility, PIPEDA privacy, French equal-first."
          />
        </View>
      </Section>

      {/* --------------------------- Featured rail -------------------------- */}
      <Section eyebrow="Featured" title="Begin listening">
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.railContent}
        >
          {featured.map((item) => (
            <Pressable
              key={item.id}
              onPress={() => router.push(`/story/${item.id}`)}
              style={({ pressed }) => [styles.card, pressed && { opacity: 0.85 }]}
              accessibilityRole="button"
              accessibilityLabel={`Open ${item.title}`}
            >
              {item.coverImage ? (
                <Image source={{ uri: item.coverImage }} style={styles.cardImg} />
              ) : (
                <View style={[styles.cardImg, { backgroundColor: '#111' }]} />
              )}
              <View style={styles.cardOverlay}>
                <LinearGradient
                  colors={['transparent', 'rgba(0,0,0,0.85)']}
                  style={StyleSheet.absoluteFillObject}
                />
              </View>
              <View style={styles.cardText}>
                <Text style={styles.cardType}>{item.type.toUpperCase()}</Text>
                <Text style={styles.cardTitle} numberOfLines={2}>{item.title}</Text>
                <Text style={styles.cardMeta} numberOfLines={1}>{item.creator}</Text>
              </View>
            </Pressable>
          ))}
        </ScrollView>
      </Section>

      {/* ------------------------------ For who ------------------------------ */}
      <Section eyebrow="For everyone in the room" title="A space for three roles">
        <View style={styles.roleList}>
          <RoleRow icon="sparkles-outline" label="Viewer" sub="Explore stories, music, and film from Canadian cultures." />
          <RoleRow icon="brush-outline" label="Creator" sub="Publish work, invite collaborators, check CMF eligibility." />
          <RoleRow icon="shield-checkmark-outline" label="Moderator" sub="Steward submissions and care for community standards." />
        </View>
      </Section>

      {/* ----------------------------- Footer CTA ---------------------------- */}
      <View style={styles.footerCta}>
        <Text style={styles.footerTitle}>You are entering SEEN.</Text>
        <Pressable
          onPress={goPrimary}
          style={({ pressed }) => [styles.footerBtn, pressed && { opacity: 0.7 }]}
          accessibilityRole="button"
          accessibilityLabel={primaryCta}
        >
          <Text style={styles.footerBtnLabel}>S · E · E · N</Text>
        </Pressable>
        <Text style={styles.footerNote}>Mobile native · Expo · Canada Media Fund aligned</Text>
      </View>
    </ScrollView>
  );
}

/* ------------------------------- Sub-components ------------------------------- */

function Section({
  eyebrow,
  title,
  children,
}: {
  eyebrow: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <View style={styles.section}>
      <View style={styles.sectionInner}>
        <Text style={styles.sectionEyebrow}>{eyebrow}</Text>
        <Text style={styles.sectionTitle}>{title}</Text>
        {children}
      </View>
    </View>
  );
}

function Stat({ number, label }: { number: string; label: string }) {
  return (
    <View style={{ alignItems: 'center', flex: 1 }}>
      <Text style={styles.statNum}>{number}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </View>
  );
}

function Pillar({
  icon,
  title,
  desc,
}: {
  icon: keyof typeof Ionicons.glyphMap;
  title: string;
  desc: string;
}) {
  return (
    <View style={styles.pillar}>
      <Ionicons name={icon} size={20} color={colors.violet} />
      <Text style={styles.pillarTitle}>{title}</Text>
      <Text style={styles.pillarDesc}>{desc}</Text>
    </View>
  );
}

function RoleRow({
  icon,
  label,
  sub,
}: {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  sub: string;
}) {
  return (
    <View style={styles.roleRow}>
      <View style={styles.roleIcon}>
        <Ionicons name={icon} size={18} color={colors.textHigh} />
      </View>
      <View style={{ flex: 1 }}>
        <Text style={styles.roleLabel}>{label}</Text>
        <Text style={styles.roleSub}>{sub}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },

  /* Hero */
  hero: { paddingBottom: spacing['4xl'], minHeight: 540, position: 'relative' },
  heroInner: {
    paddingHorizontal: spacing['2xl'],
    paddingTop: spacing['3xl'],
    maxWidth: layout.containerMaxWidth,
    alignSelf: 'center',
    width: '100%',
    alignItems: 'center',
  },
  eyeRing: {
    width: 60, height: 60, borderRadius: 30,
    borderWidth: 1, borderColor: colors.borderStrong,
    alignItems: 'center', justifyContent: 'center',
    marginBottom: spacing.xl,
  },
  heroTitle: { fontSize: 48, letterSpacing: -1, fontWeight: '300', color: colors.textPrimary, textAlign: 'center' },
  heroEyebrow: {
    ...typography.brandEyebrow, fontSize: 11, letterSpacing: 4,
    color: colors.textFaint, textAlign: 'center', marginTop: 8, marginBottom: spacing['3xl'],
  },
  heroTagline: {
    fontSize: 22, lineHeight: 30, fontWeight: '300',
    color: colors.textHigh, textAlign: 'center', marginBottom: spacing.lg,
    letterSpacing: -0.2,
  },
  heroBody: {
    ...typography.body, color: colors.textMuted, textAlign: 'center',
    lineHeight: 22, maxWidth: 340, marginBottom: spacing['2xl'],
  },
  ctaRow: { flexDirection: 'row', gap: spacing.md, alignItems: 'center', marginBottom: spacing['3xl'] },
  primaryCta: {
    flexDirection: 'row', alignItems: 'center', gap: spacing.sm,
    paddingVertical: 14, paddingHorizontal: spacing['2xl'],
    borderRadius: radius.full, backgroundColor: '#fff',
  },
  primaryCtaLabel: { ...typography.cta, color: '#000', fontSize: 12 },
  secondaryCta: {
    paddingVertical: 14, paddingHorizontal: spacing.xl,
    borderRadius: radius.full, borderWidth: 1, borderColor: colors.borderStrong,
  },
  secondaryCtaLabel: { ...typography.cta, color: colors.textPrimary, fontSize: 12 },

  statsRow: {
    flexDirection: 'row', alignItems: 'center', width: '100%',
    maxWidth: 340, paddingTop: spacing.lg,
    borderTopWidth: StyleSheet.hairlineWidth, borderTopColor: colors.borderSubtle,
  },
  statDivider: { width: 1, height: 24, backgroundColor: colors.borderSubtle },
  statNum: { ...typography.h3, color: colors.textHigh, fontSize: 16 },
  statLabel: { ...typography.microSm, color: colors.textFaint, marginTop: 2, fontSize: 9, letterSpacing: 1.5, textTransform: 'uppercase' },

  /* Section shared */
  section: { paddingVertical: spacing['3xl'], paddingHorizontal: spacing.xl },
  sectionInner: { maxWidth: layout.containerMaxWidth, alignSelf: 'center', width: '100%' },
  sectionEyebrow: { ...typography.micro, color: colors.textWhisper, fontSize: 10, marginBottom: spacing.sm },
  sectionTitle: {
    ...typography.h1, color: colors.textPrimary, fontSize: 24, marginBottom: spacing.lg,
    letterSpacing: -0.3,
  },
  body: { ...typography.body, color: colors.textMuted, lineHeight: 22, marginBottom: spacing.xl },

  /* Pillars */
  pillarGrid: { gap: spacing.md, marginTop: spacing.sm },
  pillar: {
    padding: spacing.lg, borderRadius: radius.lg,
    backgroundColor: 'rgba(255,255,255,0.03)',
    borderWidth: 1, borderColor: colors.borderSubtle,
  },
  pillarTitle: { ...typography.h3, color: colors.textHigh, fontSize: 15, marginTop: spacing.sm, marginBottom: 4 },
  pillarDesc: { ...typography.bodySm, color: colors.textFaint, fontSize: 12, lineHeight: 18 },

  /* Featured rail */
  railContent: { gap: spacing.md, paddingRight: spacing.xl },
  card: { width: 200, height: 260, borderRadius: radius.lg, overflow: 'hidden', backgroundColor: '#111' },
  cardImg: { width: '100%', height: '100%' },
  cardOverlay: { ...StyleSheet.absoluteFillObject as any },
  cardText: { position: 'absolute', left: 0, right: 0, bottom: 0, padding: spacing.md },
  cardType: { ...typography.microSm, color: colors.textWhisper, fontSize: 9, letterSpacing: 1.5, marginBottom: 4 },
  cardTitle: { ...typography.h3, color: '#fff', fontSize: 14, lineHeight: 18 },
  cardMeta: { ...typography.bodySm, color: 'rgba(255,255,255,0.7)', fontSize: 11, marginTop: 2 },

  /* Roles */
  roleList: { gap: spacing.sm, marginTop: spacing.sm },
  roleRow: {
    flexDirection: 'row', alignItems: 'center', gap: spacing.md,
    paddingVertical: spacing.lg, paddingHorizontal: spacing.lg,
    borderRadius: radius.lg,
    backgroundColor: 'rgba(255,255,255,0.03)',
    borderWidth: 1, borderColor: colors.borderSubtle,
  },
  roleIcon: {
    width: 36, height: 36, borderRadius: 18,
    backgroundColor: 'rgba(167,139,250,0.12)',
    alignItems: 'center', justifyContent: 'center',
  },
  roleLabel: { ...typography.h3, color: colors.textHigh, fontSize: 14 },
  roleSub: { ...typography.bodySm, color: colors.textFaint, fontSize: 12, marginTop: 2, lineHeight: 16 },

  /* Footer CTA */
  footerCta: {
    paddingTop: spacing['4xl'], paddingBottom: spacing['3xl'],
    paddingHorizontal: spacing['2xl'], alignItems: 'center',
    borderTopWidth: StyleSheet.hairlineWidth, borderTopColor: colors.borderSubtle,
  },
  footerTitle: { ...typography.h2, color: colors.textHigh, textAlign: 'center', fontSize: 20, marginBottom: spacing['2xl'] },
  footerBtn: {
    paddingVertical: 14, paddingHorizontal: spacing['3xl'],
    borderWidth: 1, borderColor: 'rgba(76,175,80,0.4)',
    backgroundColor: 'rgba(76,175,80,0.08)',
    borderRadius: 4,
  },
  footerBtnLabel: { ...typography.cta, color: colors.textHigh, fontSize: 13, letterSpacing: 4 },
  footerNote: { ...typography.micro, color: colors.textWhisper, fontSize: 9, marginTop: spacing['2xl'] },
});
