import { View, Text, Pressable, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { Container } from './Container';
import { colors, spacing, typography, radius } from '../constants/theme';

// Glass header matching NavigationBar.tsx in the zip.
// Fixed top, backdrop-blur via solid rgba (RN doesn't support backdrop-filter),
// thin bottom hairline, SEEN wordmark on left + search/profile circles on right.
// Inner content is constrained to 428px and centered to match the zip's mobile container.
export function Header() {
  const insets = useSafeAreaInsets();
  const router = useRouter();

  return (
    <View style={[styles.header, { paddingTop: insets.top + 6 }]}>
      <Container>
        <View style={styles.row}>
          <Pressable
            onPress={() => router.push('/')}
            accessibilityRole="button"
            accessibilityLabel="Go to SEEN home"
            style={({ pressed }) => pressed && { opacity: 0.6 }}
            hitSlop={8}
          >
            <Text style={styles.title}>SEEN</Text>
            <Text style={styles.sub}>BY CREOVA</Text>
          </Pressable>
          <View style={styles.actions}>
            <Pressable
              style={({ pressed }) => [styles.iconBtn, pressed && { opacity: 0.6 }]}
              accessibilityRole="button"
              accessibilityLabel="Search"
              accessibilityHint="Open search"
            >
              <Ionicons name="search-outline" size={16} color={colors.textSecondary} />
            </Pressable>
            <Pressable
              style={({ pressed }) => [styles.iconBtn, pressed && { opacity: 0.6 }]}
              onPress={() => router.push('/(tabs)/profile')}
              accessibilityRole="button"
              accessibilityLabel="Profile"
              accessibilityHint="Open profile tab"
            >
              <Ionicons name="person-outline" size={16} color={colors.textSecondary} />
            </Pressable>
          </View>
        </View>
      </Container>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    backgroundColor: 'rgba(0,0,0,0.85)',
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.borderSubtle,
    paddingBottom: spacing.md,
  },
  row: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', width: '100%', paddingHorizontal: spacing.xl },
  title: { ...typography.brandMd, color: colors.textPrimary, fontSize: 18 },
  sub: { ...typography.brandEyebrow, color: colors.textFaint, marginTop: 2 },
  actions: { flexDirection: 'row', gap: spacing.md },
  iconBtn: {
    width: 36,
    height: 36,
    borderRadius: radius.full,
    backgroundColor: colors.surface,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
