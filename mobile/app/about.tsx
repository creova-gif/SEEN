import { ScrollView, View, Text, Pressable, StyleSheet, Linking } from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { spacing, layout } from '../constants/theme';

const PRINCIPLES = [
  { icon: 'heart-outline' as const, label: 'Emotion first', tint: 'rgba(244,63,94,0.15)', color: '#fb7185' },
  { icon: 'language-outline' as const, label: 'Multilingual', tint: 'rgba(59,130,246,0.15)', color: '#60a5fa' },
  { icon: 'people-outline' as const, label: 'Community-led', tint: 'rgba(167,139,250,0.15)', color: '#a78bfa' },
  { icon: 'shield-checkmark-outline' as const, label: 'Privacy by default', tint: 'rgba(52,211,153,0.15)', color: '#34d399' },
];

export default function About() {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.root, { paddingTop: insets.top }]}>
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} style={styles.iconBtn} accessibilityRole="button" accessibilityLabel="Back">
          <Ionicons name="chevron-back" size={20} color="#fff" />
        </Pressable>
        <Text style={styles.headerTitle}>About</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView
        contentContainerStyle={[styles.content, { paddingBottom: insets.bottom + spacing['4xl'] }]}
        showsVerticalScrollIndicator={false}
      >
        {/* Hero */}
        <View style={styles.hero}>
          <LinearGradient
            colors={['rgba(167,139,250,0.12)', 'transparent']}
            style={StyleSheet.absoluteFillObject}
          />
          <View style={styles.logoSquare}>
            <Text style={styles.logoMark}>S</Text>
          </View>
          <Text style={styles.heroTitle}>SEEN</Text>
          <Text style={styles.heroSub}>BY CREOVA</Text>
        </View>

        {/* Manifesto */}
        <Text style={styles.sectionH}>What is SEEN?</Text>
        <Text style={styles.body}>
          SEEN is a cinematic audio-first platform built to surface underrepresented Canadian voices —
          Indigenous, Black Canadian, francophone, and immigrant storytellers. It treats every story
          like a film: pacing, restraint, and the right to be heard on your own terms.
        </Text>

        {/* Principles */}
        <Text style={styles.sectionH}>Principles</Text>
        <View style={styles.grid}>
          {PRINCIPLES.map((p) => (
            <View key={p.label} style={styles.principleCard}>
              <View style={[styles.principleIcon, { backgroundColor: p.tint }]}>
                <Ionicons name={p.icon} size={18} color={p.color} />
              </View>
              <Text style={styles.principleLabel}>{p.label}</Text>
            </View>
          ))}
        </View>

        {/* CREOVA */}
        <Text style={styles.sectionH}>CREOVA</Text>
        <Text style={styles.body}>
          CREOVA is the Canadian creative studio behind SEEN. We produce music, film, and immersive
          editorial work, with a focus on cultural specificity and craft.
        </Text>

        {/* Funding */}
        <Text style={styles.sectionH}>Funding</Text>
        <Text style={styles.body}>
          SEEN aligns to Canada Media Fund (CMF) eligibility for convergent and experimental streams,
          and is built to satisfy CAVCON certification and PIPEDA privacy requirements.
        </Text>
        <View style={styles.cmfLogo}>
          <Text style={styles.cmfMark}>CMF</Text>
          <Text style={styles.cmfSub}>Canada Media Fund</Text>
        </View>

        {/* Quote */}
        <LinearGradient
          colors={['rgba(167,139,250,0.10)', 'rgba(59,130,246,0.08)']}
          start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}
          style={styles.quoteCard}
        >
          <Text style={styles.quoteText}>
            "Some stories deserve a cinema. We built one that fits in your pocket."
          </Text>
          <Text style={styles.quoteAttrib}>— Founding note, 2026</Text>
        </LinearGradient>

        {/* Social */}
        <View style={styles.pillRow}>
          <Pressable
            style={styles.pill}
            onPress={() => Linking.openURL('mailto:hello@creova.ca')}
            accessibilityRole="link"
            accessibilityLabel="Email CREOVA"
            accessibilityHint="Opens your mail app to hello@creova.ca"
          >
            <Ionicons name="mail-outline" size={14} color="#fff" />
            <Text style={styles.pillText}>EMAIL</Text>
          </Pressable>
          <Pressable
            style={styles.pill}
            onPress={() => Linking.openURL('https://creova.ca')}
            accessibilityRole="link"
            accessibilityLabel="Open CREOVA website"
            accessibilityHint="Opens creova.ca in your browser"
          >
            <Ionicons name="globe-outline" size={14} color="#fff" />
            <Text style={styles.pillText}>WEBSITE</Text>
          </Pressable>
        </View>

        <Text style={styles.version}>Mobile · v0.1 · Expo SDK 52</Text>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#000' },
  header: {
    flexDirection: 'row', alignItems: 'center',
    paddingHorizontal: spacing.xl, paddingBottom: spacing.md,
    borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: 'rgba(255,255,255,0.05)',
    backgroundColor: 'rgba(0,0,0,0.8)',
  },
  headerTitle: { flex: 1, textAlign: 'center', fontSize: 16, color: '#fff', letterSpacing: -0.2 },
  iconBtn: {
    width: 40, height: 40, borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderWidth: StyleSheet.hairlineWidth, borderColor: 'rgba(255,255,255,0.1)',
    alignItems: 'center', justifyContent: 'center',
  },
  content: { paddingHorizontal: spacing.xl, paddingTop: spacing.xl, maxWidth: layout.containerMaxWidth, alignSelf: 'center', width: '100%' },

  hero: { alignItems: 'center', paddingVertical: spacing['3xl'], overflow: 'hidden', borderRadius: 24, marginBottom: spacing['2xl'] },
  logoSquare: {
    width: 80, height: 80, borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.06)',
    borderWidth: StyleSheet.hairlineWidth, borderColor: 'rgba(255,255,255,0.15)',
    alignItems: 'center', justifyContent: 'center',
    marginBottom: spacing.lg,
  },
  logoMark: { fontSize: 36, fontWeight: '300', color: '#fff' },
  heroTitle: { fontSize: 30, fontWeight: '400', color: '#fff', letterSpacing: -0.5 },
  heroSub: { fontSize: 11, color: 'rgba(255,255,255,0.4)', letterSpacing: 4, marginTop: 6 },

  sectionH: { fontSize: 18, color: '#fff', letterSpacing: -0.2, marginTop: spacing['2xl'], marginBottom: spacing.md },
  body: { fontSize: 15, color: 'rgba(255,255,255,0.7)', lineHeight: 24 },

  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.md, marginTop: spacing.sm },
  principleCard: {
    width: '47%',
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderWidth: StyleSheet.hairlineWidth, borderColor: 'rgba(255,255,255,0.1)',
    borderRadius: 16,
    padding: spacing.lg,
    gap: spacing.md,
  },
  principleIcon: { width: 36, height: 36, borderRadius: 10, alignItems: 'center', justifyContent: 'center' },
  principleLabel: { fontSize: 12, color: 'rgba(255,255,255,0.7)', lineHeight: 16 },

  cmfLogo: {
    marginTop: spacing.lg,
    width: 80, height: 64,
    borderRadius: 8,
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderWidth: StyleSheet.hairlineWidth, borderColor: 'rgba(255,255,255,0.1)',
    alignItems: 'center', justifyContent: 'center',
  },
  cmfMark: { fontSize: 16, color: '#fff', letterSpacing: 2 },
  cmfSub: { fontSize: 8, color: 'rgba(255,255,255,0.4)', letterSpacing: 1, marginTop: 2 },

  quoteCard: {
    marginTop: spacing['2xl'],
    padding: spacing['2xl'],
    borderRadius: 20,
    borderWidth: StyleSheet.hairlineWidth, borderColor: 'rgba(255,255,255,0.1)',
  },
  quoteText: { fontSize: 16, fontStyle: 'italic', color: '#fff', lineHeight: 24, letterSpacing: -0.2 },
  quoteAttrib: { fontSize: 11, color: 'rgba(255,255,255,0.5)', marginTop: spacing.md, letterSpacing: 1 },

  pillRow: { flexDirection: 'row', gap: spacing.md, marginTop: spacing['2xl'], justifyContent: 'center' },
  pill: {
    flexDirection: 'row', alignItems: 'center', gap: 8,
    paddingHorizontal: spacing.lg, paddingVertical: 10,
    borderRadius: 999,
    backgroundColor: 'rgba(255,255,255,0.08)',
    borderWidth: StyleSheet.hairlineWidth, borderColor: 'rgba(255,255,255,0.15)',
  },
  pillText: { fontSize: 10, color: '#fff', letterSpacing: 2 },

  version: { textAlign: 'center', fontSize: 11, color: 'rgba(255,255,255,0.3)', marginTop: spacing['2xl'], letterSpacing: 1 },
});
