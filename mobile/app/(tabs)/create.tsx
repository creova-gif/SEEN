import { useState } from 'react';
import { View, Text, Pressable, ScrollView, StyleSheet, TextInput } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors, spacing, typography, radius, layout } from '../../constants/theme';

type CreateType = 'story' | 'music' | 'film' | 'collection';

const CREATE_TYPES: { key: CreateType; label: string; sub: string; icon: keyof typeof import('@expo/vector-icons/Ionicons').glyphMap }[] = [
  { key: 'story', label: 'Story World', sub: 'Cinematic audio chapters with imagery', icon: 'book-outline' },
  { key: 'music', label: 'Music Release', sub: 'Single, EP, or full-length album', icon: 'musical-notes-outline' },
  { key: 'film', label: 'Film', sub: 'Short or feature-length with subtitles', icon: 'film-outline' },
  { key: 'collection', label: 'Curated Collection', sub: 'A themed grouping of existing works', icon: 'albums-outline' },
];

export default function Create() {
  const insets = useSafeAreaInsets();
  const [selected, setSelected] = useState<CreateType | null>(null);
  const [title, setTitle] = useState('');

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={[
        styles.content,
        { paddingTop: spacing['2xl'], paddingBottom: insets.bottom + spacing['4xl'] },
      ]}
      showsVerticalScrollIndicator={false}
    >
      <Text style={styles.eyebrow}>Create</Text>
      <Text style={styles.heading}>What do you want to share?</Text>
      <Text style={styles.subheading}>
        Start a new work. You'll be guided through metadata, audio, captions, and cultural attribution.
      </Text>

      <View style={styles.typeGrid}>
        {CREATE_TYPES.map((t) => {
          const active = selected === t.key;
          return (
            <Pressable
              key={t.key}
              onPress={() => setSelected(t.key)}
              style={({ pressed }) => [
                styles.typeCard,
                active && styles.typeCardActive,
                pressed && { opacity: 0.85 },
              ]}
              accessibilityRole="button"
              accessibilityLabel={`Create a new ${t.label}`}
            >
              <Ionicons
                name={t.icon}
                size={22}
                color={active ? colors.violet : colors.textFaint}
              />
              <Text style={[styles.typeLabel, active && { color: colors.textPrimary }]}>{t.label}</Text>
              <Text style={styles.typeSub}>{t.sub}</Text>
            </Pressable>
          );
        })}
      </View>

      {selected && (
        <View style={styles.draftBlock}>
          <Text style={styles.draftEyebrow}>Working title</Text>
          <TextInput
            value={title}
            onChangeText={setTitle}
            placeholder={`Untitled ${CREATE_TYPES.find((t) => t.key === selected)?.label.toLowerCase()}`}
            placeholderTextColor={colors.textFaint}
            style={styles.input}
            accessibilityLabel="Working title"
          />
          <Pressable
            style={({ pressed }) => [styles.startBtn, pressed && { opacity: 0.7 }]}
            accessibilityRole="button"
            accessibilityLabel="Start draft"
          >
            <Text style={styles.startBtnLabel}>Start draft</Text>
            <Ionicons name="arrow-forward" size={16} color="#000" />
          </Pressable>
        </View>
      )}

      <View style={styles.toolsHeader}>
        <Text style={styles.toolsEyebrow}>Creator tools</Text>
      </View>
      <View style={styles.toolsList}>
        {[
          { label: 'CMF Eligibility Checker', sub: 'Match your project to Canada Media Fund programs', icon: 'shield-checkmark-outline' as const },
          { label: 'Collaboration invites', sub: 'Invite co-creators by email with Lead or Contributor roles', icon: 'people-outline' as const },
          { label: 'Drafts & analytics', sub: 'Resume in-progress work and view performance', icon: 'bar-chart-outline' as const },
        ].map((row) => (
          <Pressable
            key={row.label}
            style={({ pressed }) => [styles.toolRow, pressed && styles.toolRowPressed]}
            accessibilityRole="button"
            accessibilityLabel={row.label}
          >
            <Ionicons name={row.icon} size={20} color={colors.textMuted} />
            <View style={{ flex: 1 }}>
              <Text style={styles.toolLabel}>{row.label}</Text>
              <Text style={styles.toolSub}>{row.sub}</Text>
            </View>
            <Ionicons name="chevron-forward" size={16} color={colors.textFaint} />
          </Pressable>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  content: {
    paddingHorizontal: spacing.xl,
    maxWidth: layout.containerMaxWidth,
    alignSelf: 'center',
    width: '100%',
  },
  eyebrow: { ...typography.micro, color: colors.textWhisper, marginBottom: spacing.sm },
  heading: { ...typography.h1, color: colors.textPrimary, fontSize: 26, marginBottom: spacing.sm },
  subheading: { ...typography.body, color: colors.textMuted, lineHeight: 22, marginBottom: spacing['2xl'] },

  typeGrid: { gap: spacing.md, marginBottom: spacing['2xl'] },
  typeCard: {
    padding: spacing.lg,
    borderRadius: radius.lg,
    backgroundColor: 'rgba(255,255,255,0.03)',
    borderWidth: 1,
    borderColor: colors.borderSubtle,
    gap: 6,
  },
  typeCardActive: {
    backgroundColor: 'rgba(167,139,250,0.08)',
    borderColor: colors.violet,
  },
  typeLabel: { ...typography.h3, color: colors.textHigh, fontSize: 15, marginTop: 4 },
  typeSub: { ...typography.bodySm, color: colors.textFaint, fontSize: 12 },

  draftBlock: {
    padding: spacing.lg,
    borderRadius: radius.lg,
    backgroundColor: 'rgba(255,255,255,0.04)',
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: spacing['2xl'],
  },
  draftEyebrow: { ...typography.microSm, color: colors.textWhisper, marginBottom: spacing.sm },
  input: {
    paddingVertical: 12,
    paddingHorizontal: spacing.lg,
    backgroundColor: '#000',
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.sm,
    color: colors.textHigh,
    fontSize: 14,
    marginBottom: spacing.md,
  },
  startBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
    paddingVertical: 14,
    borderRadius: radius.full,
    backgroundColor: '#fff',
  },
  startBtnLabel: { ...typography.cta, color: '#000', fontSize: 12 },

  toolsHeader: { marginTop: spacing.lg, marginBottom: spacing.md },
  toolsEyebrow: { ...typography.micro, color: colors.textWhisper, fontSize: 10 },
  toolsList: { gap: spacing.sm },
  toolRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.lg,
    paddingVertical: spacing.lg,
    paddingHorizontal: spacing.lg,
    borderRadius: radius.lg,
    backgroundColor: 'rgba(255,255,255,0.03)',
    borderWidth: 1,
    borderColor: colors.borderSubtle,
  },
  toolRowPressed: { opacity: 0.85, backgroundColor: 'rgba(255,255,255,0.06)' },
  toolLabel: { ...typography.h3, color: colors.textHigh, fontSize: 14 },
  toolSub: { ...typography.bodySm, color: colors.textFaint, fontSize: 11, marginTop: 2 },
});
