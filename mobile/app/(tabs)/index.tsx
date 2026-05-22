import { ScrollView, View, Text, StyleSheet, Pressable } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, radius, typography } from '../../constants/theme';

const STORIES = [
  { id: '1', tag: 'Indigenous · Cree',     title: 'The River Remembers',    duration: '14 min', accent: colors.amber },
  { id: '2', tag: 'Acadian · Francophone', title: 'Racines / Roots',         duration: '8 min',  accent: colors.violet },
  { id: '3', tag: 'Black Canadian',        title: 'Halifax, 1962',           duration: '22 min', accent: colors.emerald },
  { id: '4', tag: 'Haudenosaunee',         title: 'The Two Row Wampum',      duration: '18 min', accent: colors.amber },
];

export default function ForYou() {
  const insets = useSafeAreaInsets();
  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={{ paddingTop: insets.top + spacing.lg, paddingBottom: spacing['3xl'] }}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.header}>
        <Text style={styles.eyebrow}>For You</Text>
        <Text style={styles.heading}>Stories chosen for{'\n'}this moment.</Text>
      </View>

      {STORIES.map(s => (
        <Pressable key={s.id} style={({ pressed }) => [styles.card, pressed && { opacity: 0.7 }]}>
          <View style={[styles.accentDot, { backgroundColor: s.accent }]} />
          <View style={{ flex: 1 }}>
            <Text style={styles.cardTag}>{s.tag}</Text>
            <Text style={styles.cardTitle}>{s.title}</Text>
            <View style={styles.cardMeta}>
              <Ionicons name="headset-outline" size={12} color={colors.textFaint} />
              <Text style={styles.cardDuration}>{s.duration}</Text>
            </View>
          </View>
          <Ionicons name="play-circle-outline" size={32} color={colors.textSecondary} />
        </Pressable>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background, paddingHorizontal: spacing.xl },
  header: { marginBottom: spacing['2xl'] },
  eyebrow: { ...typography.micro, color: colors.textFaint, marginBottom: spacing.md },
  heading: { fontSize: 28, fontWeight: '300', color: colors.textPrimary, lineHeight: 36, letterSpacing: 0.5 },

  card: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.lg,
    borderWidth: 0.5,
    borderColor: colors.border,
    borderRadius: radius.lg,
    padding: spacing.lg,
    marginBottom: spacing.md,
    backgroundColor: colors.surface,
  },
  accentDot: { width: 8, height: 8, borderRadius: 4 },
  cardTag: { ...typography.micro, color: colors.textFaint, marginBottom: 6 },
  cardTitle: { fontSize: 17, fontWeight: '500', color: colors.textPrimary, letterSpacing: 0.3 },
  cardMeta: { flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 6 },
  cardDuration: { fontSize: 11, color: colors.textFaint, letterSpacing: 1 },
});
