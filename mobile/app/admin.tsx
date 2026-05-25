import { useMemo, useState } from 'react';
import {
  View, Text, Pressable, ScrollView, StyleSheet, TextInput, Switch,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import {
  useFeaturePreferences,
  usePublicCollections,
  useChapterReflections,
} from '../hooks/useEnhancedFeatures';
import type { Collection, FeaturePreferences } from '../data/enhancedFeatures';
import { colors, spacing, radius, typography, layout, fontFamily } from '../constants/theme';

type Tab = 'toggles' | 'context' | 'collections' | 'reflections' | 'analytics';

const TABS: { id: Tab; label: string; icon: keyof typeof Ionicons.glyphMap }[] = [
  { id: 'toggles',     label: 'Toggles',     icon: 'options-outline' },
  { id: 'context',     label: 'Context',     icon: 'book-outline' },
  { id: 'collections', label: 'Collections', icon: 'albums-outline' },
  { id: 'reflections', label: 'Reflections', icon: 'chatbubbles-outline' },
  { id: 'analytics',   label: 'Analytics',   icon: 'stats-chart-outline' },
];

export default function AdminDashboard() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [tab, setTab] = useState<Tab>('toggles');

  return (
    <View style={[styles.screen, { paddingTop: insets.top }]}>
      {/* Top bar */}
      <View style={styles.topBar}>
        <Pressable onPress={() => router.back()} hitSlop={12} accessibilityRole="button" accessibilityLabel="Back">
          <Ionicons name="chevron-back" size={22} color={colors.textPrimary} />
        </Pressable>
        <View style={{ flex: 1 }}>
          <Text style={styles.title}>Admin</Text>
          <Text style={styles.subtitle}>Enhanced features</Text>
        </View>
      </View>

      {/* Segmented tabs */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.tabsRow}
      >
        {TABS.map((t) => {
          const active = tab === t.id;
          return (
            <Pressable
              key={t.id}
              onPress={() => setTab(t.id)}
              style={[styles.tabChip, active && styles.tabChipActive]}
              accessibilityRole="tab"
              accessibilityState={{ selected: active }}
              accessibilityLabel={t.label}
            >
              <Ionicons name={t.icon} size={14} color={active ? '#000' : colors.textHigh} />
              <Text style={[styles.tabLabel, active && styles.tabLabelActive]}>{t.label}</Text>
            </Pressable>
          );
        })}
      </ScrollView>

      {/* Body */}
      <View style={{ flex: 1 }}>
        {tab === 'toggles'     && <FeatureTogglesPane />}
        {tab === 'context'     && <ContextCardPane />}
        {tab === 'collections' && <CollectionsPane />}
        {tab === 'reflections' && <ReflectionsPane />}
        {tab === 'analytics'   && <AnalyticsPane />}
      </View>
    </View>
  );
}

/* ---------------- Panes ---------------- */

const TOGGLE_DEFS: { key: keyof FeaturePreferences; label: string; desc: string }[] = [
  { key: 'enhancedContextCardsEnabled',    label: 'Enhanced context cards',  desc: 'Progressive depth: explanation → expanded → institutional.' },
  { key: 'analyticsOptIn',                 label: 'Cultural impact analytics', desc: 'Aggregate-only usage data for CMF reporting.' },
  { key: 'creatorNotesEnabled',            label: 'Creator notes',           desc: 'Show creator reflections after story completion.' },
  { key: 'communityReflectionsVisible',    label: 'Community reflections',   desc: 'Enable moderated community reflections.' },
  { key: 'offlinePacksEnabled',            label: 'Offline cultural packs',  desc: 'Downloadable story bundles for offline access.' },
  { key: 'multiNarratorSelectionEnabled',  label: 'Multi-narrator support',  desc: 'Let users select alternative narrators.' },
  { key: 'seasonalEditorialFramingEnabled', label: 'Seasonal framing',       desc: 'Show curatorial introductions at season entry.' },
];

function FeatureTogglesPane() {
  const { preferences, loading, updatePreferences } = useFeaturePreferences('admin');
  if (loading || !preferences) return <Loading label="Loading preferences..." />;

  return (
    <ScrollView contentContainerStyle={paneStyles.body}>
      <Text style={paneStyles.lede}>
        Configure platform-wide features. All default to off unless enabled.
      </Text>
      {TOGGLE_DEFS.map((t) => (
        <View key={t.key} style={paneStyles.row}>
          <View style={{ flex: 1, paddingRight: spacing.md }}>
            <Text style={paneStyles.rowLabel}>{t.label}</Text>
            <Text style={paneStyles.rowDesc}>{t.desc}</Text>
          </View>
          <Switch
            value={!!preferences[t.key]}
            onValueChange={(v) => updatePreferences({ [t.key]: v } as Partial<FeaturePreferences>)}
            trackColor={{ true: 'rgba(255,255,255,0.45)', false: colors.borderStrong }}
            thumbColor={preferences[t.key] ? '#fff' : '#666'}
          />
        </View>
      ))}
    </ScrollView>
  );
}

function ContextCardPane() {
  const [term, setTerm] = useState('');
  const [en, setEN] = useState('');
  const [fr, setFR] = useState('');
  const [es, setES] = useState('');
  const [saved, setSaved] = useState(false);

  const onSave = () => {
    // Local-only stub; wire to backend when /admin/context-card exists.
    console.log('[admin] save context card', { term, en, fr, es });
    setSaved(true);
    setTimeout(() => setSaved(false), 1600);
  };

  return (
    <ScrollView contentContainerStyle={paneStyles.body}>
      <Text style={paneStyles.lede}>Add a new context card. Localize all three languages.</Text>
      <Field label="Term" value={term} onChangeText={setTerm} placeholder="e.g. Africville" />
      <Field label="Short explanation · EN" value={en} onChangeText={setEN} multiline />
      <Field label="Short explanation · FR" value={fr} onChangeText={setFR} multiline />
      <Field label="Short explanation · ES" value={es} onChangeText={setES} multiline />
      <Pressable
        onPress={onSave}
        disabled={!term.trim() || !en.trim()}
        style={({ pressed }) => [
          paneStyles.cta,
          (!term.trim() || !en.trim()) && { opacity: 0.4 },
          pressed && { opacity: 0.8 },
        ]}
      >
        <Text style={paneStyles.ctaLabel}>{saved ? 'Saved' : 'Save context card'}</Text>
      </Pressable>
    </ScrollView>
  );
}

function CollectionsPane() {
  const { collections, loading, addCollection } = usePublicCollections();
  const [titleEN, setTitleEN] = useState('');
  const [descEN, setDescEN] = useState('');

  if (loading) return <Loading label="Loading collections..." />;

  const onCreate = async () => {
    if (!titleEN.trim()) return;
    const c: Collection = {
      id: `c-${Date.now()}`,
      title: { en: titleEN, fr: '', es: '' },
      description: { en: descEN, fr: '', es: '' },
      curatedBy: 'admin',
      contentIds: [],
      isPublic: true,
      createdAt: new Date().toISOString(),
    };
    await addCollection(c);
    setTitleEN(''); setDescEN('');
  };

  return (
    <ScrollView contentContainerStyle={paneStyles.body}>
      <Text style={paneStyles.sectionTitle}>New collection</Text>
      <Field label="Title (EN)" value={titleEN} onChangeText={setTitleEN} />
      <Field label="Description (EN)" value={descEN} onChangeText={setDescEN} multiline />
      <Pressable
        onPress={onCreate}
        disabled={!titleEN.trim()}
        style={({ pressed }) => [
          paneStyles.cta,
          !titleEN.trim() && { opacity: 0.4 },
          pressed && { opacity: 0.8 },
        ]}
      >
        <Text style={paneStyles.ctaLabel}>Create collection</Text>
      </Pressable>

      <Text style={[paneStyles.sectionTitle, { marginTop: spacing['2xl'] }]}>
        Existing ({collections.length})
      </Text>
      {collections.length === 0 ? (
        <Text style={paneStyles.empty}>No collections yet.</Text>
      ) : (
        collections.map((c) => (
          <View key={c.id} style={paneStyles.card}>
            <Text style={paneStyles.cardTitle}>{c.title.en}</Text>
            <Text style={paneStyles.cardMeta}>
              {c.curatedBy} · {c.contentIds.length} stories · {c.isPublic ? 'Public' : 'Private'}
            </Text>
            {!!c.description.en && <Text style={paneStyles.cardBody}>{c.description.en}</Text>}
          </View>
        ))
      )}
    </ScrollView>
  );
}

function ReflectionsPane() {
  const { reflections, loading, moderate } = useChapterReflections();
  if (loading) return <Loading label="Loading reflections..." />;
  const pending = reflections.filter((r) => r.status === 'pending');

  return (
    <ScrollView contentContainerStyle={paneStyles.body}>
      <Text style={paneStyles.lede}>
        Review for cultural sensitivity, harm prevention, accessibility, and restorative care.
      </Text>
      {pending.length === 0 ? (
        <Text style={paneStyles.empty}>No pending reflections.</Text>
      ) : (
        pending.map((r) => (
          <View key={r.id} style={paneStyles.card}>
            <Text style={paneStyles.cardMeta}>
              Chapter: {r.chapterId} · {r.submitterLanguage.toUpperCase()} · {new Date(r.createdAt).toLocaleDateString()}
            </Text>
            {r.format === 'text' && !!r.reflectionText && (
              <Text style={paneStyles.cardBody}>{r.reflectionText}</Text>
            )}
            <View style={{ flexDirection: 'row', gap: spacing.sm, marginTop: spacing.md }}>
              <Pressable
                onPress={() => moderate(r.id, 'approved')}
                style={({ pressed }) => [paneStyles.smallBtn, { backgroundColor: colors.emerald }, pressed && { opacity: 0.8 }]}
              >
                <Text style={paneStyles.smallBtnLabel}>Approve</Text>
              </Pressable>
              <Pressable
                onPress={() => moderate(r.id, 'rejected')}
                style={({ pressed }) => [paneStyles.smallBtn, { backgroundColor: colors.destructive }, pressed && { opacity: 0.8 }]}
              >
                <Text style={paneStyles.smallBtnLabel}>Reject</Text>
              </Pressable>
            </View>
          </View>
        ))
      )}
    </ScrollView>
  );
}

function AnalyticsPane() {
  // No backend; show CMF-compliance placeholders. Wire up once /api/admin/cmf-report
  // is available — the metric cards are layout-ready.
  const metrics = useMemo(() => ([
    { label: 'Story completions', value: '—' },
    { label: 'Audio hours', value: '—' },
    { label: 'French engagement', value: '—' },
    { label: 'Spanish engagement', value: '—' },
    { label: 'Institutional users', value: '—' },
    { label: 'Collections', value: '—' },
  ]), []);

  return (
    <ScrollView contentContainerStyle={paneStyles.body}>
      <Text style={paneStyles.lede}>
        CMF reporting metrics — connect an analytics backend to populate.
      </Text>
      <View style={paneStyles.metricsGrid}>
        {metrics.map((m) => (
          <View key={m.label} style={paneStyles.metricCard}>
            <Text style={paneStyles.metricValue}>{m.value}</Text>
            <Text style={paneStyles.metricLabel}>{m.label}</Text>
          </View>
        ))}
      </View>
    </ScrollView>
  );
}

/* ---------------- shared bits ---------------- */

function Field({
  label, value, onChangeText, multiline, placeholder,
}: {
  label: string; value: string; onChangeText: (v: string) => void;
  multiline?: boolean; placeholder?: string;
}) {
  return (
    <View style={paneStyles.field}>
      <Text style={paneStyles.fieldLabel}>{label}</Text>
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={colors.textWhisper}
        multiline={multiline}
        style={[paneStyles.input, multiline && { minHeight: 80, textAlignVertical: 'top' }]}
      />
    </View>
  );
}

function Loading({ label }: { label: string }) {
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Text style={[typography.bodySm, { color: colors.textFaint }]}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.background },
  topBar: {
    flexDirection: 'row', alignItems: 'center', gap: spacing.md,
    paddingHorizontal: spacing.xl, paddingVertical: spacing.lg,
    maxWidth: layout.containerMaxWidth, alignSelf: 'center', width: '100%',
  },
  title:    { ...typography.h2, color: colors.textPrimary, letterSpacing: -0.2 },
  subtitle: { ...typography.bodySm, color: colors.textFaint, marginTop: 2 },

  tabsRow: { gap: spacing.sm, paddingHorizontal: spacing.xl, paddingBottom: spacing.md },
  tabChip: {
    flexDirection: 'row', alignItems: 'center', gap: 6,
    paddingHorizontal: spacing.md, paddingVertical: 8,
    borderRadius: radius.full,
    borderWidth: 1, borderColor: colors.borderStrong, backgroundColor: 'transparent',
  },
  tabChipActive: { backgroundColor: '#fff', borderColor: '#fff' },
  tabLabel: { fontFamily: fontFamily.medium, fontSize: 11, letterSpacing: 1, color: colors.textHigh, textTransform: 'uppercase' as const },
  tabLabelActive: { color: '#000' },
});

const paneStyles = StyleSheet.create({
  body: {
    padding: spacing.xl, paddingBottom: spacing['4xl'],
    maxWidth: layout.containerMaxWidth, alignSelf: 'center', width: '100%',
  },
  lede:         { ...typography.bodySm, color: colors.textMuted, marginBottom: spacing.lg },
  sectionTitle: { ...typography.h3, color: colors.textPrimary, marginBottom: spacing.md },

  row: {
    flexDirection: 'row', alignItems: 'center',
    paddingVertical: spacing.md,
    borderBottomWidth: 1, borderBottomColor: colors.borderSubtle,
  },
  rowLabel: { ...typography.h3, color: colors.textPrimary, fontSize: 14, marginBottom: 2 },
  rowDesc:  { ...typography.bodySm, color: colors.textFaint, fontSize: 11, lineHeight: 16 },

  field: { marginBottom: spacing.lg },
  fieldLabel: { ...typography.micro, color: colors.textFaint, marginBottom: 6 },
  input: {
    borderWidth: 1, borderColor: colors.border, borderRadius: radius.md,
    paddingHorizontal: spacing.md, paddingVertical: spacing.md,
    color: colors.textPrimary, fontFamily: fontFamily.regular, fontSize: 14,
    backgroundColor: 'rgba(255,255,255,0.04)',
  },

  cta: {
    backgroundColor: '#fff', borderRadius: radius.full,
    paddingVertical: 14, alignItems: 'center', marginTop: spacing.md,
  },
  ctaLabel: { ...typography.cta, color: '#000', fontSize: 12 },

  smallBtn: { paddingHorizontal: spacing.lg, paddingVertical: 10, borderRadius: radius.full },
  smallBtnLabel: { fontFamily: fontFamily.medium, fontSize: 11, color: '#000', letterSpacing: 1, textTransform: 'uppercase' as const },

  card: {
    borderWidth: 1, borderColor: colors.borderSubtle, borderRadius: radius.md,
    padding: spacing.lg, marginBottom: spacing.md, backgroundColor: 'rgba(255,255,255,0.03)',
  },
  cardTitle: { ...typography.h3, color: colors.textPrimary, marginBottom: 4 },
  cardMeta:  { ...typography.bodySm, color: colors.textFaint, fontSize: 11 },
  cardBody:  { ...typography.body, color: colors.textHigh, marginTop: spacing.sm },

  empty: { ...typography.bodySm, color: colors.textFaint, textAlign: 'center', paddingVertical: spacing['2xl'] },

  metricsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.md, marginTop: spacing.md },
  metricCard: {
    width: '47%', borderWidth: 1, borderColor: colors.borderSubtle, borderRadius: radius.md,
    padding: spacing.lg, backgroundColor: 'rgba(255,255,255,0.03)',
  },
  metricValue: { fontFamily: fontFamily.light, fontSize: 28, color: colors.textPrimary, letterSpacing: -0.5 },
  metricLabel: { ...typography.microSm, color: colors.textFaint, marginTop: 4 },
});
