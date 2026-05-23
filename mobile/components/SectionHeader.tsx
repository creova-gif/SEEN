import { View, Text, Pressable, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, typography } from '../constants/theme';

type Props = { title: string; subtitle?: string; onSeeAll?: () => void };

export function SectionHeader({ title, subtitle, onSeeAll }: Props) {
  return (
    <View style={styles.wrap}>
      <View style={{ flex: 1 }}>
        <Text style={styles.title}>{title}</Text>
        {subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
      </View>
      {onSeeAll ? (
        <Pressable
          onPress={onSeeAll}
          style={({ pressed }) => [styles.seeAll, pressed && { opacity: 0.6 }]}
          accessibilityRole="button"
          accessibilityLabel={`See all ${title}`}
        >
          <Text style={styles.seeAllText}>See All</Text>
          <Ionicons name="chevron-forward" size={12} color={colors.textFaint} />
        </Pressable>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { flexDirection: 'row', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: spacing.lg },
  title: { ...typography.h2, color: colors.textPrimary, fontSize: 20 },
  subtitle: { ...typography.bodySm, color: colors.textFaint, marginTop: 4, fontSize: 11 },
  seeAll: { flexDirection: 'row', alignItems: 'center', gap: 2, paddingLeft: spacing.md },
  seeAllText: { ...typography.micro, color: colors.textFaint, fontSize: 10 },
});
