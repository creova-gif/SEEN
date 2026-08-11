import { useState } from 'react';
import { View, Text, Pressable, StyleSheet, Animated } from 'react-native';
import { colors, spacing, radii } from '../theme';

export type UserRole = 'creator' | 'viewer' | 'moderator';
export type UserIntent = 'create' | 'explore' | 'contribute';

interface OnboardingScreenProps {
  onComplete: (role: UserRole, intent: UserIntent) => void;
}

const ROLES: { value: UserRole; label: string; subtitle: string }[] = [
  { value: 'creator', label: 'Creator', subtitle: 'I make work' },
  { value: 'viewer', label: 'Viewer', subtitle: 'I explore culture' },
  { value: 'moderator', label: 'Moderator', subtitle: 'I shape communities' },
];

const INTENTS: { value: UserIntent; label: string }[] = [
  { value: 'create', label: 'Share work' },
  { value: 'explore', label: 'Discover stories' },
  { value: 'contribute', label: 'Support creators' },
];

export function OnboardingScreen({ onComplete }: OnboardingScreenProps) {
  const [step, setStep] = useState<'role' | 'intent'>('role');
  const [role, setRole] = useState<UserRole | null>(null);

  return (
    <View style={styles.container}>
      {step === 'role' && (
        <View style={styles.stepContent}>
          <Text style={styles.question}>How will you move through this space?</Text>
          <View style={styles.optionList}>
            {ROLES.map(opt => (
              <Pressable
                key={opt.value}
                onPress={() => {
                  setRole(opt.value);
                  setStep('intent');
                }}
                style={({ pressed }) => [styles.optionRow, pressed && styles.optionRowPressed]}
              >
                <Text style={styles.optionLabel}>{opt.label}</Text>
                <Text style={styles.optionSubtitle}>{opt.subtitle}</Text>
              </Pressable>
            ))}
          </View>
        </View>
      )}

      {step === 'intent' && (
        <View style={styles.stepContent}>
          <Text style={styles.question}>What brings you here?</Text>
          <View style={styles.optionList}>
            {INTENTS.map(opt => (
              <Pressable
                key={opt.value}
                onPress={() => role && onComplete(role, opt.value)}
                style={({ pressed }) => [styles.optionRow, pressed && styles.optionRowPressed]}
              >
                <Text style={styles.optionLabel}>{opt.label}</Text>
              </Pressable>
            ))}
          </View>
          <Pressable onPress={() => setStep('role')} style={styles.backLink}>
            <Text style={styles.backLinkText}>Back</Text>
          </Pressable>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.black,
    justifyContent: 'center',
    paddingHorizontal: spacing.lg,
  },
  stepContent: {
    alignItems: 'stretch',
  },
  question: {
    fontSize: 20,
    color: colors.whiteStrong,
    textAlign: 'center',
    lineHeight: 28,
    marginBottom: spacing.xxl,
  },
  optionList: {
    gap: spacing.sm,
  },
  optionRow: {
    paddingVertical: spacing.md + 4,
    borderBottomWidth: 1,
    borderBottomColor: colors.whiteSoft,
  },
  optionRowPressed: {
    borderBottomColor: colors.white,
  },
  optionLabel: {
    fontSize: 16,
    color: colors.white,
    marginBottom: spacing.xs / 2,
  },
  optionSubtitle: {
    fontSize: 13,
    color: colors.whiteMedium,
  },
  backLink: {
    marginTop: spacing.xl,
    alignItems: 'center',
  },
  backLinkText: {
    fontSize: 12,
    letterSpacing: 1.5,
    textTransform: 'uppercase',
    color: colors.whiteMedium,
  },
});
