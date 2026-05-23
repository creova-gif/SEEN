import { useState, useEffect } from 'react';
import { View, Text, Pressable, ScrollView, StyleSheet, TextInput, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { colors, spacing, typography, radius, layout } from '../../constants/theme';
import { LIVE_ITEMS } from '../../data/aggregate'; // In a real app we'd post to Supabase

type CreateType = 'story' | 'music' | 'film' | 'collection';
type IconName = React.ComponentProps<typeof Ionicons>['name'];

const CREATE_TYPES: { key: CreateType; label: string; sub: string; icon: IconName }[] = [
  { key: 'story', label: 'Story World', sub: 'Cinematic audio chapters with imagery', icon: 'book-outline' },
  { key: 'music', label: 'Music Release', sub: 'Single, EP, or full-length album', icon: 'musical-notes-outline' },
  { key: 'film', label: 'Film', sub: 'Short or feature-length with subtitles', icon: 'film-outline' },
  { key: 'collection', label: 'Curated Collection', sub: 'A themed grouping of existing works', icon: 'albums-outline' },
];

export default function Create() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  
  const [step, setStep] = useState(0);
  const [selected, setSelected] = useState<CreateType | null>(null);
  
  // Draft Data
  const [title, setTitle] = useState('');
  const [coverUrl, setCoverUrl] = useState('');
  const [audioUrl, setAudioUrl] = useState('');
  const [description, setDescription] = useState('');
  const [duration, setDuration] = useState('');
  const [tags, setTags] = useState('');

  // Auto-save & Load Draft
  useEffect(() => {
    const loadDraft = async () => {
      try {
        const saved = await AsyncStorage.getItem('creator_draft');
        if (saved) {
          const draft = JSON.parse(saved);
          if (draft.step) setStep(draft.step);
          if (draft.selected) setSelected(draft.selected);
          if (draft.title) setTitle(draft.title);
          if (draft.coverUrl) setCoverUrl(draft.coverUrl);
          if (draft.audioUrl) setAudioUrl(draft.audioUrl);
          if (draft.description) setDescription(draft.description);
          if (draft.duration) setDuration(draft.duration);
          if (draft.tags) setTags(draft.tags);
        }
      } catch (e) {}
    };
    loadDraft();
  }, []);

  useEffect(() => {
    const saveDraft = async () => {
      try {
        const draft = { step, selected, title, coverUrl, audioUrl, description, duration, tags };
        await AsyncStorage.setItem('creator_draft', JSON.stringify(draft));
      } catch (e) {}
    };
    saveDraft();
  }, [step, selected, title, coverUrl, audioUrl, description, duration, tags]);

  const handleNext = () => setStep((s) => s + 1);
  const handleBack = () => setStep((s) => s - 1);
  const handleCancel = async () => {
    setStep(0);
    setSelected(null);
    setTitle('');
    setCoverUrl('');
    setAudioUrl('');
    setDescription('');
    setDuration('');
    setTags('');
    await AsyncStorage.removeItem('creator_draft');
  };

  const handlePublish = async () => {
    // In a real app, this would insert into Supabase
    // const { error } = await supabase.from('items').insert({ ... })
    await AsyncStorage.removeItem('creator_draft');
    Alert.alert('Published!', 'Your work is now live.', [
      {
        text: 'View in Explore',
        onPress: () => {
          handleCancel();
          router.replace('/(tabs)/explore');
        }
      }
    ]);
  };

  const renderStep0 = () => (
    <>
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
          />
          <Pressable
            style={({ pressed }) => [styles.primaryBtn, pressed && { opacity: 0.7 }]}
            onPress={handleNext}
          >
            <Text style={styles.primaryBtnLabel}>Start draft</Text>
            <Ionicons name="arrow-forward" size={16} color="#000" />
          </Pressable>
        </View>
      )}
    </>
  );

  const renderStep1 = () => (
    <View style={styles.stepContainer}>
      <Text style={styles.eyebrow}>Step 1 of 4</Text>
      <Text style={styles.heading}>Media Assets</Text>
      
      <Text style={styles.label}>Cover Image URL</Text>
      <TextInput
        value={coverUrl}
        onChangeText={setCoverUrl}
        placeholder="https://example.com/image.jpg"
        placeholderTextColor={colors.textFaint}
        style={styles.input}
      />
      
      <Text style={styles.label}>Audio/Embed URL</Text>
      <TextInput
        value={audioUrl}
        onChangeText={setAudioUrl}
        placeholder="MP3, Spotify, or YouTube link"
        placeholderTextColor={colors.textFaint}
        style={styles.input}
      />
    </View>
  );

  const renderStep2 = () => (
    <View style={styles.stepContainer}>
      <Text style={styles.eyebrow}>Step 2 of 4</Text>
      <Text style={styles.heading}>Story Details</Text>
      
      <Text style={styles.label}>Description</Text>
      <TextInput
        value={description}
        onChangeText={setDescription}
        placeholder="Tell us about this work..."
        placeholderTextColor={colors.textFaint}
        style={[styles.input, { height: 100, textAlignVertical: 'top' }]}
        multiline
      />
      
      <Text style={styles.label}>Estimated Duration</Text>
      <TextInput
        value={duration}
        onChangeText={setDuration}
        placeholder="e.g. 15 min"
        placeholderTextColor={colors.textFaint}
        style={styles.input}
      />
    </View>
  );

  const renderStep3 = () => (
    <View style={styles.stepContainer}>
      <Text style={styles.eyebrow}>Step 3 of 4</Text>
      <Text style={styles.heading}>Cultural Nuance</Text>
      
      <Text style={styles.label}>Tags (comma separated)</Text>
      <TextInput
        value={tags}
        onChangeText={setTags}
        placeholder="e.g. Indigenous, Folklore, Acoustic"
        placeholderTextColor={colors.textFaint}
        style={styles.input}
      />
    </View>
  );

  const renderStep4 = () => (
    <View style={styles.stepContainer}>
      <Text style={styles.eyebrow}>Step 4 of 4</Text>
      <Text style={styles.heading}>Review & Publish</Text>
      
      <View style={styles.reviewCard}>
        <Text style={styles.reviewTitle}>{title || 'Untitled'}</Text>
        <Text style={styles.reviewType}>Type: {selected}</Text>
        {tags ? <Text style={styles.reviewTags}>Tags: {tags}</Text> : null}
      </View>
    </View>
  );

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={[
        styles.content,
        { paddingTop: spacing['2xl'], paddingBottom: insets.bottom + spacing['4xl'] },
      ]}
      showsVerticalScrollIndicator={false}
    >
      {step === 0 && renderStep0()}
      {step === 1 && renderStep1()}
      {step === 2 && renderStep2()}
      {step === 3 && renderStep3()}
      {step === 4 && renderStep4()}

      {step > 0 && (
        <View style={styles.wizardControls}>
          <Pressable style={styles.secondaryBtn} onPress={handleBack}>
            <Text style={styles.secondaryBtnLabel}>Back</Text>
          </Pressable>
          {step < 4 ? (
            <Pressable style={styles.primaryBtn} onPress={handleNext}>
              <Text style={styles.primaryBtnLabel}>Continue</Text>
            </Pressable>
          ) : (
            <Pressable style={[styles.primaryBtn, { backgroundColor: colors.violet }]} onPress={handlePublish}>
              <Text style={[styles.primaryBtnLabel, { color: '#fff' }]}>Publish</Text>
            </Pressable>
          )}
        </View>
      )}

      {step > 0 && (
        <Pressable style={styles.cancelBtn} onPress={handleCancel}>
          <Text style={styles.cancelBtnLabel}>Cancel Draft</Text>
        </Pressable>
      )}
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
  
  stepContainer: {
    marginTop: spacing.md,
    marginBottom: spacing['2xl'],
  },
  label: {
    ...typography.microSm,
    color: colors.textSecondary,
    marginBottom: spacing.xs,
    marginTop: spacing.lg,
  },
  input: {
    paddingVertical: 12,
    paddingHorizontal: spacing.lg,
    backgroundColor: '#000',
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.sm,
    color: colors.textHigh,
    fontSize: 14,
  },
  
  wizardControls: {
    flexDirection: 'row',
    gap: spacing.md,
    marginTop: spacing.xl,
  },
  primaryBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
    paddingVertical: 14,
    borderRadius: radius.full,
    backgroundColor: '#fff',
  },
  primaryBtnLabel: { ...typography.cta, color: '#000', fontSize: 14 },
  secondaryBtn: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    borderRadius: radius.full,
    backgroundColor: 'rgba(255,255,255,0.1)',
  },
  secondaryBtnLabel: { ...typography.cta, color: '#fff', fontSize: 14 },
  cancelBtn: {
    alignItems: 'center',
    marginTop: spacing.xl,
  },
  cancelBtnLabel: { ...typography.bodySm, color: colors.textMuted },

  reviewCard: {
    padding: spacing.lg,
    borderRadius: radius.lg,
    backgroundColor: 'rgba(255,255,255,0.03)',
    borderWidth: 1,
    borderColor: colors.borderSubtle,
    marginTop: spacing.lg,
  },
  reviewTitle: { ...typography.h2, color: colors.textHigh, marginBottom: spacing.sm },
  reviewType: { ...typography.bodySm, color: colors.textSecondary, marginBottom: 4 },
  reviewTags: { ...typography.bodySm, color: colors.textSecondary },
});
