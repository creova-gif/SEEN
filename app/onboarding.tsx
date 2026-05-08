import { useState, useRef } from 'react';
import {
  View, Text, TouchableOpacity, StyleSheet, TextInput,
  ScrollView, KeyboardAvoidingView, Platform, ActivityIndicator, Alert,
} from 'react-native';
import { router } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import * as Haptics from 'expo-haptics';
import { Colors } from '../constants/colors';
import { useAuth } from '../contexts/AuthContext';
import { useStoryState } from '../contexts/StoryStateContext';
import type { Language, UserIntent, UserRole } from '../contexts/StoryStateContext';

const STEPS = ['welcome', 'language', 'intent', 'auth'] as const;
type Step = typeof STEPS[number];

const LANGUAGES = [
  { code: 'en' as Language, label: 'English', native: 'English' },
  { code: 'fr' as Language, label: 'French', native: 'Français' },
  { code: 'es' as Language, label: 'Spanish', native: 'Español' },
];

const INTENTS = [
  {
    id: 'explore' as UserIntent,
    icon: 'compass-outline' as const,
    title: 'Explore Stories',
    subtitle: 'Discover voices from across Canada',
  },
  {
    id: 'create' as UserIntent,
    icon: 'mic-outline' as const,
    title: 'Share My Story',
    subtitle: 'Contribute as a creator or storyteller',
  },
  {
    id: 'contribute' as UserIntent,
    icon: 'people-outline' as const,
    title: 'Support the Mission',
    subtitle: 'Help preserve underrepresented voices',
  },
];

export default function OnboardingScreen() {
  const insets = useSafeAreaInsets();
  const { signIn, signUp } = useAuth();
  const { setLanguage, setIntent } = useStoryState();

  const [step, setStep] = useState<Step>('welcome');
  const [selectedLang, setSelectedLang] = useState<Language>('en');
  const [selectedIntent, setSelectedIntent] = useState<UserIntent>('explore');
  const [authMode, setAuthMode] = useState<'signin' | 'signup'>('signup');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPw, setShowPw] = useState(false);

  const next = (nextStep: Step) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setStep(nextStep);
  };

  const finish = async (asGuest = false) => {
    setLanguage(selectedLang);
    setIntent(selectedIntent);
    await AsyncStorage.setItem('seenos_onboarding_complete', 'true');
    router.replace('/(tabs)');
  };

  const handleAuth = async () => {
    setError('');
    if (!email.trim() || !password.trim()) {
      setError('Please fill in all fields.');
      return;
    }
    if (authMode === 'signup' && !name.trim()) {
      setError('Please enter your name.');
      return;
    }
    setLoading(true);
    try {
      if (authMode === 'signup') {
        await signUp(email.trim(), password, name.trim(), 'viewer', selectedLang, selectedIntent);
      } else {
        await signIn(email.trim(), password);
      }
      await finish();
    } catch (e: any) {
      setError(e.message || 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (step === 'welcome') {
    return (
      <View style={[styles.screen, { paddingTop: insets.top + 20, paddingBottom: insets.bottom + 20 }]}>
        <View style={styles.welcomeContent}>
          <View style={styles.logoRow}>
            <Text style={styles.logoText}>SEEN</Text>
            <Text style={styles.byText}>by CREOVA</Text>
          </View>
          <Text style={styles.tagline}>
            Canadian stories{'\n'}from voices that shaped{'\n'}this land.
          </Text>
          <View style={styles.divider} />
          <Text style={styles.welcomeBody}>
            An audio-first platform for Indigenous, Black Canadian, francophone, and immigrant stories. Built for Canada. Heard by everyone.
          </Text>
        </View>
        <View style={styles.welcomeActions}>
          <TouchableOpacity style={styles.primaryBtn} onPress={() => next('language')}>
            <Text style={styles.primaryBtnText}>Begin</Text>
            <Ionicons name="arrow-forward" size={18} color="#000" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.ghostBtn} onPress={() => finish(true)}>
            <Text style={styles.ghostBtnText}>Explore without signing in</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  if (step === 'language') {
    return (
      <View style={[styles.screen, { paddingTop: insets.top + 20, paddingBottom: insets.bottom + 20 }]}>
        <View style={styles.stepHeader}>
          <Text style={styles.stepLabel}>01 / 03</Text>
          <Text style={styles.stepTitle}>Choose your language</Text>
          <Text style={styles.stepSub}>You can change this anytime in settings.</Text>
        </View>
        <View style={styles.optionList}>
          {LANGUAGES.map(lang => {
            const selected = selectedLang === lang.code;
            return (
              <TouchableOpacity
                key={lang.code}
                style={[styles.optionCard, selected && styles.optionCardSelected]}
                onPress={() => { Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light); setSelectedLang(lang.code); }}
              >
                <View style={styles.optionCardInner}>
                  <Text style={[styles.optionTitle, selected && styles.optionTitleSelected]}>{lang.native}</Text>
                  <Text style={styles.optionSub}>{lang.label}</Text>
                </View>
                {selected && <Ionicons name="checkmark-circle" size={22} color={Colors.amber} />}
              </TouchableOpacity>
            );
          })}
        </View>
        <TouchableOpacity style={styles.primaryBtn} onPress={() => next('intent')}>
          <Text style={styles.primaryBtnText}>Continue</Text>
          <Ionicons name="arrow-forward" size={18} color="#000" />
        </TouchableOpacity>
      </View>
    );
  }

  if (step === 'intent') {
    return (
      <View style={[styles.screen, { paddingTop: insets.top + 20, paddingBottom: insets.bottom + 20 }]}>
        <View style={styles.stepHeader}>
          <Text style={styles.stepLabel}>02 / 03</Text>
          <Text style={styles.stepTitle}>What brings you here?</Text>
          <Text style={styles.stepSub}>This shapes your experience from day one.</Text>
        </View>
        <View style={styles.optionList}>
          {INTENTS.map(intent => {
            const selected = selectedIntent === intent.id;
            return (
              <TouchableOpacity
                key={intent.id}
                style={[styles.optionCard, selected && styles.optionCardSelected]}
                onPress={() => { Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light); setSelectedIntent(intent.id); }}
              >
                <View style={[styles.intentIcon, selected && styles.intentIconSelected]}>
                  <Ionicons name={intent.icon} size={22} color={selected ? Colors.amber : Colors.textMuted} />
                </View>
                <View style={styles.optionCardInner}>
                  <Text style={[styles.optionTitle, selected && styles.optionTitleSelected]}>{intent.title}</Text>
                  <Text style={styles.optionSub}>{intent.subtitle}</Text>
                </View>
                {selected && <Ionicons name="checkmark-circle" size={22} color={Colors.amber} />}
              </TouchableOpacity>
            );
          })}
        </View>
        <View style={styles.bottomActions}>
          <TouchableOpacity style={styles.backBtn} onPress={() => next('language')}>
            <Ionicons name="arrow-back" size={18} color={Colors.textSecondary} />
          </TouchableOpacity>
          <TouchableOpacity style={[styles.primaryBtn, { flex: 1 }]} onPress={() => next('auth')}>
            <Text style={styles.primaryBtnText}>Continue</Text>
            <Ionicons name="arrow-forward" size={18} color="#000" />
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView
        style={styles.screen}
        contentContainerStyle={{ flexGrow: 1, paddingTop: insets.top + 20, paddingBottom: insets.bottom + 40 }}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.stepHeader}>
          <Text style={styles.stepLabel}>03 / 03</Text>
          <Text style={styles.stepTitle}>
            {authMode === 'signup' ? 'Create your account' : 'Welcome back'}
          </Text>
          <Text style={styles.stepSub}>
            {authMode === 'signup'
              ? 'Your stories. Your identity. Your platform.'
              : 'Sign in to continue your journey.'}
          </Text>
        </View>

        <View style={styles.authToggle}>
          <TouchableOpacity
            style={[styles.toggleBtn, authMode === 'signup' && styles.toggleBtnActive]}
            onPress={() => { setError(''); setAuthMode('signup'); }}
          >
            <Text style={[styles.toggleText, authMode === 'signup' && styles.toggleTextActive]}>Sign Up</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.toggleBtn, authMode === 'signin' && styles.toggleBtnActive]}
            onPress={() => { setError(''); setAuthMode('signin'); }}
          >
            <Text style={[styles.toggleText, authMode === 'signin' && styles.toggleTextActive]}>Sign In</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.form}>
          {authMode === 'signup' && (
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>FULL NAME</Text>
              <TextInput
                style={styles.input}
                value={name}
                onChangeText={setName}
                placeholder="Your name"
                placeholderTextColor={Colors.textMuted}
                autoCorrect={false}
              />
            </View>
          )}
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>EMAIL</Text>
            <TextInput
              style={styles.input}
              value={email}
              onChangeText={setEmail}
              placeholder="you@example.com"
              placeholderTextColor={Colors.textMuted}
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
            />
          </View>
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>PASSWORD</Text>
            <View style={styles.pwRow}>
              <TextInput
                style={[styles.input, { flex: 1, borderWidth: 0, padding: 0 }]}
                value={password}
                onChangeText={setPassword}
                placeholder="••••••••"
                placeholderTextColor={Colors.textMuted}
                secureTextEntry={!showPw}
                autoCapitalize="none"
              />
              <TouchableOpacity onPress={() => setShowPw(!showPw)} style={styles.eyeBtn}>
                <Ionicons name={showPw ? 'eye-off-outline' : 'eye-outline'} size={18} color={Colors.textMuted} />
              </TouchableOpacity>
            </View>
          </View>

          {error ? (
            <View style={styles.errorBox}>
              <Ionicons name="alert-circle-outline" size={14} color={Colors.red} />
              <Text style={styles.errorText}>{error}</Text>
            </View>
          ) : null}

          <TouchableOpacity style={styles.primaryBtn} onPress={handleAuth} disabled={loading}>
            {loading ? (
              <ActivityIndicator color="#000" size="small" />
            ) : (
              <>
                <Text style={styles.primaryBtnText}>
                  {authMode === 'signup' ? 'Create Account' : 'Sign In'}
                </Text>
                <Ionicons name="arrow-forward" size={18} color="#000" />
              </>
            )}
          </TouchableOpacity>
        </View>

        <View style={styles.bottomActions}>
          <TouchableOpacity style={styles.backBtn} onPress={() => next('intent')}>
            <Ionicons name="arrow-back" size={18} color={Colors.textSecondary} />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => finish(true)}>
            <Text style={styles.ghostBtnText}>Skip for now</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: Colors.background,
    paddingHorizontal: 24,
  },
  welcomeContent: {
    flex: 1,
    justifyContent: 'center',
    gap: 20,
  },
  logoRow: {
    gap: 4,
  },
  logoText: {
    fontSize: 52,
    fontFamily: Colors.fontBold,
    color: Colors.textPrimary,
    letterSpacing: 12,
  },
  byText: {
    fontSize: 13,
    fontFamily: Colors.fontRegular,
    color: Colors.textMuted,
    letterSpacing: 4,
  },
  tagline: {
    fontSize: 26,
    fontFamily: Colors.fontSemiBold,
    color: Colors.textPrimary,
    lineHeight: 36,
  },
  divider: {
    height: 1,
    backgroundColor: Colors.border,
    width: 60,
  },
  welcomeBody: {
    fontSize: 15,
    fontFamily: Colors.fontRegular,
    color: Colors.textSecondary,
    lineHeight: 23,
  },
  welcomeActions: {
    gap: 12,
  },
  primaryBtn: {
    backgroundColor: Colors.amber,
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: Colors.radius,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
  },
  primaryBtnText: {
    fontSize: 15,
    fontFamily: Colors.fontSemiBold,
    color: '#000',
    letterSpacing: 0.5,
  },
  ghostBtn: {
    padding: 16,
    alignItems: 'center',
  },
  ghostBtnText: {
    fontSize: 14,
    fontFamily: Colors.fontRegular,
    color: Colors.textMuted,
  },
  stepHeader: {
    gap: 8,
    marginBottom: 32,
  },
  stepLabel: {
    fontSize: 11,
    fontFamily: Colors.fontRegular,
    color: Colors.textMuted,
    letterSpacing: 3,
  },
  stepTitle: {
    fontSize: 26,
    fontFamily: Colors.fontBold,
    color: Colors.textPrimary,
    lineHeight: 33,
  },
  stepSub: {
    fontSize: 14,
    fontFamily: Colors.fontRegular,
    color: Colors.textSecondary,
    lineHeight: 20,
  },
  optionList: {
    gap: 10,
    flex: 1,
  },
  optionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    padding: 18,
    borderRadius: Colors.radius,
    borderWidth: 1,
    borderColor: Colors.border,
    backgroundColor: Colors.surface,
  },
  optionCardSelected: {
    borderColor: Colors.amber,
    backgroundColor: Colors.amberDim,
  },
  optionCardInner: {
    flex: 1,
    gap: 3,
  },
  intentIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  intentIconSelected: {
    borderColor: Colors.amber,
    backgroundColor: Colors.amberDim,
  },
  optionTitle: {
    fontSize: 16,
    fontFamily: Colors.fontSemiBold,
    color: Colors.textPrimary,
  },
  optionTitleSelected: {
    color: Colors.amber,
  },
  optionSub: {
    fontSize: 13,
    fontFamily: Colors.fontRegular,
    color: Colors.textMuted,
  },
  bottomActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginTop: 24,
  },
  backBtn: {
    width: 48,
    height: 48,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: Colors.border,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.surface,
  },
  authToggle: {
    flexDirection: 'row',
    backgroundColor: Colors.surface,
    borderRadius: Colors.radius,
    padding: 4,
    marginBottom: 28,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  toggleBtn: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
    borderRadius: Colors.radiusSm,
  },
  toggleBtnActive: {
    backgroundColor: Colors.amber,
  },
  toggleText: {
    fontSize: 14,
    fontFamily: Colors.fontSemiBold,
    color: Colors.textMuted,
  },
  toggleTextActive: {
    color: '#000',
  },
  form: {
    gap: 18,
    marginBottom: 24,
  },
  inputGroup: {
    gap: 8,
  },
  inputLabel: {
    fontSize: 10,
    fontFamily: Colors.fontSemiBold,
    color: Colors.textMuted,
    letterSpacing: 2,
  },
  input: {
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: Colors.radiusSm,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 15,
    fontFamily: Colors.fontRegular,
    color: Colors.textPrimary,
  },
  pwRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: Colors.radiusSm,
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  eyeBtn: {
    padding: 4,
  },
  errorBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: Colors.redDim,
    borderRadius: Colors.radiusSm,
    padding: 12,
  },
  errorText: {
    flex: 1,
    fontSize: 13,
    fontFamily: Colors.fontRegular,
    color: Colors.red,
  },
});
