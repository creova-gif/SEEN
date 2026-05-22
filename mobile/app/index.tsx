import { View, Text, Pressable, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { SeenLogo } from '../components/SeenLogo';
import { colors, spacing, radius, typography } from '../constants/theme';

export default function Welcome() {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.container, { paddingTop: insets.top, paddingBottom: insets.bottom }]}>
      <View style={styles.spacerTop} />

      <View style={styles.center}>
        <SeenLogo size="lg" />
        <Text style={styles.tagline}>
          Canadian stories from voices that shaped this land —{'\n'}and were never truly heard.
        </Text>
      </View>

      <View style={styles.bottom}>
        <Pressable
          style={({ pressed }) => [styles.cta, pressed && { opacity: 0.7 }]}
          onPress={() => router.replace('/(tabs)')}
        >
          <Text style={styles.ctaLabel}>Begin Listening</Text>
        </Pressable>

        <Text style={styles.micro}>Mobile native · Expo</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    paddingHorizontal: spacing.xl,
  },
  spacerTop: { flex: 0.6 },
  center: { alignItems: 'center' },
  tagline: {
    ...typography.body,
    color: colors.textMuted,
    textAlign: 'center',
    marginTop: spacing['2xl'],
    lineHeight: 22,
    maxWidth: 320,
  },
  bottom: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
    paddingBottom: spacing.xl,
  },
  cta: {
    borderWidth: 1,
    borderColor: colors.borderStrong,
    borderRadius: radius.full,
    paddingVertical: spacing.lg,
    paddingHorizontal: spacing['3xl'],
    backgroundColor: 'transparent',
  },
  ctaLabel: {
    color: colors.textPrimary,
    fontSize: 14,
    fontWeight: '500',
    letterSpacing: 2,
    textTransform: 'uppercase',
  },
  micro: {
    ...typography.micro,
    color: colors.textFaint,
    marginTop: spacing.xl,
  },
});
