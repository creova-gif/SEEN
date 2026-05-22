import { View, Text, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors, spacing, typography } from '../constants/theme';

type Props = { eyebrow: string; title: string; note: string };

export function Placeholder({ eyebrow, title, note }: Props) {
  const insets = useSafeAreaInsets();
  return (
    <View style={[styles.container, { paddingTop: insets.top + spacing['2xl'] }]}>
      <Text style={styles.eyebrow}>{eyebrow}</Text>
      <Text style={styles.title}>{title}</Text>
      <View style={styles.divider} />
      <Text style={styles.note}>{note}</Text>
      <View style={styles.pill}>
        <Text style={styles.pillText}>Coming in next port</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background, paddingHorizontal: spacing.xl },
  eyebrow: { ...typography.micro, color: colors.textFaint, marginBottom: spacing.md },
  title: { fontSize: 26, fontWeight: '300', color: colors.textPrimary, lineHeight: 34, letterSpacing: 0.5 },
  divider: { height: 0.5, backgroundColor: colors.border, marginVertical: spacing.xl },
  note: { ...typography.body, color: colors.textMuted, lineHeight: 22 },
  pill: {
    alignSelf: 'flex-start',
    marginTop: spacing.xl,
    paddingVertical: 6,
    paddingHorizontal: spacing.md,
    borderRadius: 999,
    borderWidth: 0.5,
    borderColor: colors.border,
  },
  pillText: { ...typography.micro, color: colors.textFaint },
});
