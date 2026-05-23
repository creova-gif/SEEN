import { ScrollView, View, Text, Pressable, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { CONTENT_SUMMARY } from '../../data/aggregate';
import { colors, spacing, radius, typography, layout } from '../../constants/theme';

type Row = { icon: keyof typeof Ionicons.glyphMap; label: string; value?: string };

const PREFERENCES: Row[] = [
  { icon: 'language-outline', label: 'Language', value: 'English · Français' },
  { icon: 'accessibility-outline', label: 'Accessibility', value: 'Captions, larger text' },
  { icon: 'volume-medium-outline', label: 'Audio Quality', value: 'High (320kbps)' },
  { icon: 'cloud-download-outline', label: 'Offline Downloads', value: '0 stories saved' },
];

const COMPLIANCE: Row[] = [
  { icon: 'shield-checkmark-outline', label: 'CAVCON Certification', value: 'Verified' },
  { icon: 'flag-outline', label: 'French as First Language', value: 'Enabled' },
  { icon: 'document-text-outline', label: 'Data Export (PIPEDA)', value: 'JSON' },
  { icon: 'trash-outline', label: 'Delete Account Data' },
];

export default function Profile() {
  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
      <View style={styles.avatarWrap}>
        <View style={styles.avatar}>
          <Ionicons name="person" size={28} color={colors.textPrimary} />
        </View>
        <Text style={styles.name}>Guest Listener</Text>
        <Text style={styles.sub}>Exploring without an account</Text>
        <Pressable
          style={({ pressed }) => [styles.cta, pressed && { opacity: 0.6 }]}
          accessibilityRole="button"
          accessibilityLabel="Sign in or create account"
        >
          <Text style={styles.ctaText}>Sign In or Create Account</Text>
        </Pressable>
      </View>

      <View style={styles.statsRow}>
        <Stat label="Live" value={String(CONTENT_SUMMARY.live)} />
        <View style={styles.divider} />
        <Stat label="Stories" value={String(CONTENT_SUMMARY.story)} />
        <View style={styles.divider} />
        <Stat label="Upcoming" value={String(CONTENT_SUMMARY.planned)} />
      </View>

      <Section title="Preferences" rows={PREFERENCES} />
      <Section title="CMF / PIPEDA Compliance" rows={COMPLIANCE} />

      <View style={styles.footer}>
        <Text style={styles.brand}>SEEN</Text>
        <Text style={styles.brandSub}>BY CREOVA</Text>
        <Text style={styles.version}>Mobile Native · v0.1 · Expo 52</Text>
      </View>
    </ScrollView>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <View style={{ flex: 1, alignItems: 'center' }}>
      <Text style={styles.statValue}>{value}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </View>
  );
}

function Section({ title, rows }: { title: string; rows: Row[] }) {
  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>{title}</Text>
      <View style={styles.card}>
        {rows.map((row, idx) => (
          <Pressable
            key={row.label}
            style={({ pressed }) => [styles.rowItem, idx !== rows.length - 1 && styles.rowDivider, pressed && { opacity: 0.6 }]}
          >
            <Ionicons name={row.icon} size={18} color={colors.textSecondary} />
            <View style={{ flex: 1 }}>
              <Text style={styles.rowLabel}>{row.label}</Text>
              {row.value ? <Text style={styles.rowValue}>{row.value}</Text> : null}
            </View>
            <Ionicons name="chevron-forward" size={16} color={colors.textWhisper} />
          </Pressable>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  content: { paddingHorizontal: spacing.xl, paddingTop: spacing.lg, paddingBottom: spacing['4xl'], maxWidth: layout.containerMaxWidth, alignSelf: 'center', width: '100%' },
  avatarWrap: { alignItems: 'center', marginBottom: spacing['2xl'] },
  avatar: {
    width: 72, height: 72, borderRadius: 36,
    backgroundColor: colors.surface,
    borderWidth: 1, borderColor: colors.borderStrong,
    alignItems: 'center', justifyContent: 'center',
    marginBottom: spacing.md,
  },
  name: { fontSize: 22, fontWeight: '300', color: colors.textPrimary, letterSpacing: 0.2 },
  sub: { ...typography.bodySm, color: colors.textMuted, marginTop: 4 },
  cta: {
    marginTop: spacing.lg,
    paddingVertical: 12, paddingHorizontal: spacing['2xl'],
    borderRadius: radius.full,
    borderWidth: 1, borderColor: colors.borderStrong,
  },
  ctaText: { ...typography.cta, fontSize: 11, color: colors.textPrimary },
  statsRow: {
    flexDirection: 'row',
    padding: spacing.lg,
    marginBottom: spacing['2xl'],
    backgroundColor: colors.surface,
    borderWidth: StyleSheet.hairlineWidth, borderColor: colors.border,
    borderRadius: radius.lg,
  },
  divider: { width: StyleSheet.hairlineWidth, backgroundColor: colors.border, marginHorizontal: spacing.sm },
  statValue: { fontSize: 22, fontWeight: '300', color: colors.textPrimary },
  statLabel: { ...typography.microSm, fontSize: 9, color: colors.textFaint, marginTop: 4 },
  section: { marginBottom: spacing['2xl'] },
  sectionTitle: { ...typography.micro, fontSize: 10, color: colors.textFaint, marginBottom: spacing.sm, marginLeft: 4 },
  card: {
    backgroundColor: colors.surface,
    borderWidth: StyleSheet.hairlineWidth, borderColor: colors.border,
    borderRadius: radius.lg,
    overflow: 'hidden',
  },
  rowItem: { flexDirection: 'row', alignItems: 'center', gap: spacing.md, padding: spacing.lg },
  rowDivider: { borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: colors.border },
  rowLabel: { fontSize: 14, color: colors.textPrimary, letterSpacing: 0.2 },
  rowValue: { ...typography.bodySm, color: colors.textMuted, fontSize: 11, marginTop: 2 },
  footer: { alignItems: 'center', paddingTop: spacing['2xl'], gap: 4 },
  brand: { fontSize: 18, fontWeight: '400', color: colors.textFaint, letterSpacing: -0.2 },
  brandSub: { ...typography.brandEyebrow, fontSize: 9, letterSpacing: 3, color: colors.textWhisper },
  version: { ...typography.bodySm, color: colors.textWhisper, fontSize: 10, marginTop: spacing.sm },
});
