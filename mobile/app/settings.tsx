import { useEffect, useState } from 'react';
import { ScrollView, View, Text, Pressable, StyleSheet, Switch, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { colors, spacing, radius, typography, layout } from '../constants/theme';

type Lang = 'en' | 'fr' | 'es';
type AudioQ = 'low' | 'med' | 'high';

const LANG_OPTIONS: { code: Lang; label: string; native: string }[] = [
  { code: 'en', label: 'English', native: 'English' },
  { code: 'fr', label: 'French', native: 'Français' },
  { code: 'es', label: 'Spanish', native: 'Español' },
];

export default function Settings() {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const [lang, setLang] = useState<Lang>('en');
  const [audioQ, setAudioQ] = useState<AudioQ>('high');
  const [autoplay, setAutoplay] = useState(true);
  const [captions, setCaptions] = useState(false);
  const [largeText, setLargeText] = useState(false);

  useEffect(() => {
    AsyncStorage.multiGet(['seen_lang', 'seen_audio_q', 'seen_autoplay', 'seen_captions', 'seen_large_text']).then((kv) => {
      const map = Object.fromEntries(kv) as Record<string, string | null>;
      if (map.seen_lang) setLang(map.seen_lang as Lang);
      if (map.seen_audio_q) setAudioQ(map.seen_audio_q as AudioQ);
      if (map.seen_autoplay != null) setAutoplay(map.seen_autoplay === '1');
      if (map.seen_captions != null) setCaptions(map.seen_captions === '1');
      if (map.seen_large_text != null) setLargeText(map.seen_large_text === '1');
    });
  }, []);

  const persist = (k: string, v: string) => AsyncStorage.setItem(k, v);

  const handleExport = () => {
    Alert.alert('PIPEDA Data Export', 'Your data will be prepared as a JSON download. We will email you when ready.', [{ text: 'OK' }]);
  };
  const handleDelete = () => {
    Alert.alert('Delete Local Data', 'This removes your on-device cache. Cloud data must be deleted separately.', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Delete', style: 'destructive', onPress: async () => { await AsyncStorage.clear(); router.replace('/'); } },
    ]);
  };

  return (
    <View style={[styles.root, { paddingTop: insets.top }]}>
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} style={styles.iconBtn} accessibilityRole="button" accessibilityLabel="Back">
          <Ionicons name="chevron-back" size={20} color="#fff" />
        </Pressable>
        <Text style={styles.headerTitle}>Settings</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView
        contentContainerStyle={[styles.content, { paddingBottom: insets.bottom + spacing['4xl'] }]}
        showsVerticalScrollIndicator={false}
      >
        {/* Language */}
        <Text style={styles.sectionLabel} nativeID="lang-label">Language</Text>
        <View style={styles.cardStack} accessibilityRole="radiogroup" accessibilityLabelledBy="lang-label">
          {LANG_OPTIONS.map((l) => {
            const active = lang === l.code;
            return (
              <Pressable
                key={l.code}
                onPress={() => { setLang(l.code); persist('seen_lang', l.code); }}
                style={[styles.langRow, active && styles.langRowActive]}
                accessibilityRole="radio"
                accessibilityLabel={`${l.label} (${l.native})`}
                accessibilityState={{ selected: active, checked: active }}
              >
                <View style={[styles.radio, active && styles.radioActive]}>
                  {active && <View style={styles.radioDot} />}
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.rowTitle}>{l.label}</Text>
                  <Text style={styles.rowDesc}>{l.native}</Text>
                </View>
              </Pressable>
            );
          })}
        </View>

        {/* Audio */}
        <Text style={styles.sectionLabel}>Audio</Text>
        <View style={styles.card}>
          <Text style={styles.rowTitle} nativeID="audio-q-label">Audio quality</Text>
          <View style={styles.segment} accessibilityRole="radiogroup" accessibilityLabelledBy="audio-q-label">
            {(['low','med','high'] as AudioQ[]).map((q) => {
              const active = audioQ === q;
              const label = q === 'low' ? 'Low quality' : q === 'med' ? 'Medium quality' : 'High quality';
              return (
                <Pressable
                  key={q}
                  onPress={() => { setAudioQ(q); persist('seen_audio_q', q); }}
                  style={[styles.segBtn, active && styles.segBtnActive]}
                  accessibilityRole="radio"
                  accessibilityLabel={label}
                  accessibilityState={{ selected: active, checked: active }}
                >
                  <Text style={[styles.segTxt, active && styles.segTxtActive]}>
                    {q === 'low' ? 'LOW' : q === 'med' ? 'MEDIUM' : 'HIGH'}
                  </Text>
                </Pressable>
              );
            })}
          </View>
          <View style={styles.toggleRow}>
            <View style={{ flex: 1 }}>
              <Text style={styles.rowTitle}>Auto-play next chapter</Text>
              <Text style={styles.rowDesc}>Seamlessly continue the story</Text>
            </View>
            <Switch
              value={autoplay}
              onValueChange={(v) => { setAutoplay(v); persist('seen_autoplay', v ? '1' : '0'); }}
              trackColor={{ false: 'rgba(255,255,255,0.10)', true: 'rgba(255,255,255,0.45)' }}
              thumbColor={autoplay ? '#fff' : '#666'}
              accessibilityLabel="Auto-play next chapter"
              accessibilityHint="Continues the story without tapping play"
            />
          </View>
        </View>

        {/* Accessibility */}
        <Text style={styles.sectionLabel}>Accessibility</Text>
        <View style={styles.card}>
          <View style={styles.toggleRow}>
            <View style={{ flex: 1 }}>
              <Text style={styles.rowTitle}>Live captions</Text>
              <Text style={styles.rowDesc}>Show subtitle card during playback</Text>
            </View>
            <Switch
              value={captions}
              onValueChange={(v) => { setCaptions(v); persist('seen_captions', v ? '1' : '0'); }}
              trackColor={{ false: 'rgba(255,255,255,0.10)', true: 'rgba(255,255,255,0.45)' }}
              thumbColor={captions ? '#fff' : '#666'}
              accessibilityLabel="Live captions"
              accessibilityHint="Shows a subtitle card during playback"
            />
          </View>
          <View style={[styles.toggleRow, { borderTopWidth: StyleSheet.hairlineWidth, borderTopColor: 'rgba(255,255,255,0.06)' }]}>
            <View style={{ flex: 1 }}>
              <Text style={styles.rowTitle}>Larger text</Text>
              <Text style={styles.rowDesc}>Increase body type 1.2×</Text>
            </View>
            <Switch
              value={largeText}
              onValueChange={(v) => { setLargeText(v); persist('seen_large_text', v ? '1' : '0'); }}
              trackColor={{ false: 'rgba(255,255,255,0.10)', true: 'rgba(255,255,255,0.45)' }}
              thumbColor={largeText ? '#fff' : '#666'}
              accessibilityLabel="Larger text"
              accessibilityHint="Increases body type to 1.2x"
            />
          </View>
        </View>

        {/* CMF Compliance */}
        <Text style={styles.sectionLabel}>CMF Compliance</Text>
        <View style={styles.card}>
          <ComplianceRow label="CAVCON certification" value="Verified" ok />
          <ComplianceRow label="French as first-class language" value="Enabled" ok />
          <ComplianceRow label="Cultural attribution review" value="Active" ok />
        </View>

        {/* PIPEDA */}
        <Text style={styles.sectionLabel}>Your Data (PIPEDA)</Text>
        <View style={styles.cardStack}>
          <Pressable style={styles.linkRow} onPress={handleExport} accessibilityRole="button">
            <View style={[styles.iconChip, { backgroundColor: 'rgba(59,130,246,0.15)' }]}>
              <Ionicons name="download-outline" size={16} color="#60a5fa" />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.rowTitle}>Export my data</Text>
              <Text style={styles.rowDesc}>JSON download of your account</Text>
            </View>
            <Ionicons name="chevron-forward" size={16} color="rgba(255,255,255,0.3)" />
          </Pressable>
        </View>

        {/* Danger */}
        <Text style={styles.sectionLabel}>Dangerous</Text>
        <View style={styles.cardStack}>
          <Pressable style={styles.linkRow} onPress={handleDelete} accessibilityRole="button">
            <View style={[styles.iconChip, { backgroundColor: 'rgba(244,63,94,0.15)' }]}>
              <Ionicons name="trash-outline" size={16} color="#fb7185" />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={[styles.rowTitle, { color: '#fb7185' }]}>Delete local data</Text>
              <Text style={styles.rowDesc}>Clear on-device cache & preferences</Text>
            </View>
            <Ionicons name="chevron-forward" size={16} color="rgba(255,255,255,0.3)" />
          </Pressable>
        </View>
      </ScrollView>
    </View>
  );
}

function ComplianceRow({ label, value, ok }: { label: string; value: string; ok?: boolean }) {
  return (
    <View style={[styles.complianceRow]}>
      <View style={{ flex: 1 }}>
        <Text style={styles.rowTitle}>{label}</Text>
      </View>
      <View style={styles.statusRow}>
        {ok && <View style={styles.greenDot} />}
        <Text style={styles.rowDesc}>{value}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#000' },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.xl,
    paddingBottom: spacing.md,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: 'rgba(255,255,255,0.05)',
    backgroundColor: 'rgba(0,0,0,0.8)',
  },
  headerTitle: { flex: 1, textAlign: 'center', fontSize: 16, color: '#fff', letterSpacing: -0.2 },
  iconBtn: {
    width: 40, height: 40, borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderWidth: StyleSheet.hairlineWidth, borderColor: 'rgba(255,255,255,0.1)',
    alignItems: 'center', justifyContent: 'center',
  },
  content: { paddingHorizontal: spacing.xl, paddingTop: spacing.xl, maxWidth: layout.containerMaxWidth, alignSelf: 'center', width: '100%' },

  sectionLabel: {
    fontSize: 11, color: 'rgba(255,255,255,0.4)',
    letterSpacing: 2, textTransform: 'uppercase',
    marginTop: spacing['2xl'], marginBottom: spacing.md, marginLeft: 4,
  },

  cardStack: { gap: spacing.sm },
  card: {
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderWidth: StyleSheet.hairlineWidth, borderColor: 'rgba(255,255,255,0.1)',
    borderRadius: 16,
    padding: spacing.lg,
    gap: spacing.md,
  },

  langRow: {
    flexDirection: 'row', alignItems: 'center', gap: spacing.md,
    padding: spacing.lg,
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderRadius: 16,
    borderWidth: StyleSheet.hairlineWidth, borderColor: 'rgba(255,255,255,0.1)',
  },
  langRowActive: { backgroundColor: 'rgba(255,255,255,0.10)', borderColor: 'rgba(255,255,255,0.3)' },
  radio: {
    width: 20, height: 20, borderRadius: 10,
    borderWidth: 1.5, borderColor: 'rgba(255,255,255,0.4)',
    alignItems: 'center', justifyContent: 'center',
  },
  radioActive: { borderColor: '#fff', backgroundColor: '#fff' },
  radioDot: { width: 6, height: 6, borderRadius: 3, backgroundColor: '#000' },

  rowTitle: { fontSize: 14, color: '#fff', letterSpacing: 0.2 },
  rowDesc: { fontSize: 12, color: 'rgba(255,255,255,0.5)', marginTop: 2 },

  segment: {
    flexDirection: 'row',
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderRadius: 10,
    padding: 3,
    gap: 2,
  },
  segBtn: { flex: 1, paddingVertical: 8, borderRadius: 8, alignItems: 'center' },
  segBtnActive: { backgroundColor: 'rgba(255,255,255,0.15)' },
  segTxt: { fontSize: 10, color: 'rgba(255,255,255,0.5)', letterSpacing: 1.5 },
  segTxtActive: { color: '#fff' },

  toggleRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.md, paddingVertical: spacing.sm },

  complianceRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.md, paddingVertical: spacing.sm },
  statusRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  greenDot: { width: 6, height: 6, borderRadius: 3, backgroundColor: '#34d399' },

  linkRow: {
    flexDirection: 'row', alignItems: 'center', gap: spacing.md,
    padding: spacing.lg,
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderRadius: 16,
    borderWidth: StyleSheet.hairlineWidth, borderColor: 'rgba(255,255,255,0.1)',
  },
  iconChip: { width: 32, height: 32, borderRadius: 8, alignItems: 'center', justifyContent: 'center' },
});
