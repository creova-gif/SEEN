import { View, Text, StyleSheet, Pressable, ScrollView } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, radii } from '../theme';
import type { UserRole, UserIntent } from './OnboardingScreen';

interface ProfileScreenProps {
  role: UserRole;
  intent: UserIntent;
  onSignOut: () => void;
}

const ROLE_LABEL: Record<UserRole, string> = {
  creator: 'Creator',
  viewer: 'Viewer',
  moderator: 'Moderator',
};

const INTENT_LABEL: Record<UserIntent, string> = {
  create: 'Share work',
  explore: 'Discover stories',
  contribute: 'Support creators',
};

export function ProfileScreen({ role, intent, onSignOut }: ProfileScreenProps) {
  const insets = useSafeAreaInsets();

  return (
    <View style={styles.container}>
      <ScrollView
        contentContainerStyle={{ paddingTop: insets.top + spacing.md, paddingBottom: spacing.xxl }}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <View style={styles.avatar}>
            <Ionicons name="person" size={28} color={colors.whiteMedium} />
          </View>
          <Text style={styles.roleLabel}>{ROLE_LABEL[role]}</Text>
          <Text style={styles.intentLabel}>{INTENT_LABEL[intent]}</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionLabel}>ABOUT</Text>
          <View style={styles.row}>
            <Text style={styles.rowLabel}>SEEN by CREOVA</Text>
          </View>
          <Text style={styles.privacyNote}>
            SEEN stores your preferences on this device. We don't track individual
            behavior, viewing time, or engagement scores.
          </Text>
        </View>

        <Pressable onPress={onSignOut} style={styles.signOutButton} accessibilityRole="button">
          <Ionicons name="log-out-outline" size={16} color="#f87171" />
          <Text style={styles.signOutText}>Sign Out</Text>
        </Pressable>

        <Text style={styles.version}>SEEN v1.0.0 · by CREOVA</Text>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.black,
  },
  header: {
    alignItems: 'center',
    paddingVertical: spacing.xl,
  },
  avatar: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: colors.whiteFaint,
    borderWidth: 1,
    borderColor: colors.whiteSoft,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.md,
  },
  roleLabel: {
    fontSize: 20,
    color: colors.white,
    marginBottom: spacing.xs / 2,
  },
  intentLabel: {
    fontSize: 13,
    color: colors.whiteMedium,
  },
  section: {
    paddingHorizontal: spacing.lg,
    marginBottom: spacing.lg,
  },
  sectionLabel: {
    fontSize: 11,
    letterSpacing: 2,
    color: colors.whiteMedium,
    marginBottom: spacing.md,
  },
  row: {
    paddingVertical: spacing.md,
    borderRadius: radii.sm,
    backgroundColor: colors.whiteFaint,
    borderWidth: 1,
    borderColor: colors.whiteSoft,
    paddingHorizontal: spacing.md,
    marginBottom: spacing.md,
  },
  rowLabel: {
    fontSize: 14,
    color: colors.white,
  },
  privacyNote: {
    fontSize: 12,
    color: colors.whiteMedium,
    lineHeight: 18,
  },
  signOutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
    marginHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    borderRadius: radii.sm,
    borderWidth: 1,
    borderColor: 'rgba(248,113,113,0.3)',
    marginBottom: spacing.xl,
  },
  signOutText: {
    fontSize: 14,
    color: '#f87171',
  },
  version: {
    fontSize: 11,
    color: 'rgba(255,255,255,0.25)',
    textAlign: 'center',
  },
});
