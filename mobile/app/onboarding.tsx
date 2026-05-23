import { useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  Pressable,
  StyleSheet,
  Animated,
  Easing,
  TextInput,
  ScrollView,
  ImageBackground,
  KeyboardAvoidingView,
  Platform,
  Switch,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { colors, spacing, radius, typography, layout } from '../constants/theme';

// SEEN by CREOVA — Native onboarding flow
// Faithful port of src/app/components/OnboardingSystem.tsx (zip):
//  0 Language → 1 Invocation → 2 Purpose → 3 Role → 4 Intent →
//  5 Account → 6 Accessibility → 7 Presence → 8 Threshold
// Each step uses a slow fade/slide entrance to match the cinematic feel.

type Language = 'en' | 'fr' | 'es';
type Role = 'creator' | 'viewer' | 'moderator';
type Intent = 'create' | 'explore' | 'contribute';
type Step =
  | 'language'
  | 'invocation'
  | 'purpose'
  | 'role'
  | 'intent'
  | 'account'
  | 'accessibility'
  | 'presence'
  | 'threshold';

const STEP_ORDER: Step[] = [
  'language',
  'invocation',
  'purpose',
  'role',
  'intent',
  'account',
  'accessibility',
  'presence',
  'threshold',
];

export default function Onboarding() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [step, setStep] = useState<Step>('language');
  const [language, setLanguage] = useState<Language | null>(null);
  const [role, setRole] = useState<Role | null>(null);
  const [intent, setIntent] = useState<Intent | null>(null);

  // Note: we intentionally do not persist mid-onboarding step state.
  // Returning users either completed onboarding (handled by the splash gate
  // reading `seen_onboarding_completed`) or restart the flow from step 1.

  const finish = async () => {
    try {
      await AsyncStorage.multiSet([
        ['seen_onboarding_completed', 'true'],
        ['seen_language', language ?? 'en'],
        ['seen_role', role ?? 'viewer'],
        ['seen_intent', intent ?? 'explore'],
      ]);
    } catch {}
    router.replace('/(tabs)');
  };

  const skipToTabs = async () => {
    try {
      await AsyncStorage.multiSet([
        ['seen_onboarding_completed', 'true'],
        ['seen_guest', 'true'],
      ]);
    } catch {}
    router.replace('/(tabs)');
  };

  return (
    <View style={styles.root}>
      <FadeKey step={step}>
        {step === 'language' && (
          <LanguageStep
            insets={insets}
            onSelect={(lang) => {
              setLanguage(lang);
              setStep('invocation');
            }}
            onSkip={skipToTabs}
          />
        )}
        {step === 'invocation' && (
          <InvocationStep insets={insets} onComplete={() => setStep('purpose')} />
        )}
        {step === 'purpose' && (
          <PurposeStep insets={insets} onNext={() => setStep('role')} />
        )}
        {step === 'role' && (
          <RoleStep
            insets={insets}
            onSelect={(r) => {
              setRole(r);
              setStep('intent');
            }}
          />
        )}
        {step === 'intent' && (
          <IntentStep
            insets={insets}
            onSelect={(i) => {
              setIntent(i);
              setStep('account');
            }}
          />
        )}
        {step === 'account' && (
          <AccountStep
            insets={insets}
            onComplete={() => setStep('accessibility')}
            onGuest={() => setStep('accessibility')}
          />
        )}
        {step === 'accessibility' && (
          <AccessibilityStep
            insets={insets}
            onComplete={() => setStep('presence')}
          />
        )}
        {step === 'presence' && (
          <PresenceStep insets={insets} onNext={() => setStep('threshold')} />
        )}
        {step === 'threshold' && (
          <ThresholdStep insets={insets} onEnter={finish} />
        )}
      </FadeKey>
    </View>
  );
}

/* --------------------------- Fade transition --------------------------- */

function FadeKey({ step, children }: { step: Step; children: React.ReactNode }) {
  const opacity = useRef(new Animated.Value(1)).current;
  useEffect(() => {
    opacity.setValue(0.001);
    Animated.timing(opacity, {
      toValue: 1,
      duration: 500,
      easing: Easing.out(Easing.quad),
      useNativeDriver: false,
    }).start();
  }, [step, opacity]);
  return (
    <Animated.View style={[StyleSheet.absoluteFillObject, { opacity }]} pointerEvents="auto">
      {children}
    </Animated.View>
  );
}

/* ------------------------------- Step 0: Language ------------------------------- */

const LANGUAGES: { code: Language; native: string; name: string }[] = [
  { code: 'en', native: 'English', name: 'English' },
  { code: 'fr', native: 'Français', name: 'French' },
  { code: 'es', native: 'Español', name: 'Spanish' },
];

function LanguageStep({
  insets,
  onSelect,
  onSkip,
}: {
  insets: { top: number; bottom: number };
  onSelect: (l: Language) => void;
  onSkip: () => void;
}) {
  return (
    <CenteredContainer insets={insets}>
      <Text style={styles.heading}>Choose your language</Text>
      <View style={styles.stack}>
        {LANGUAGES.map((l) => (
          <Pressable
            key={l.code}
            onPress={() => onSelect(l.code)}
            accessibilityRole="button"
            accessibilityLabel={`Choose ${l.name}`}
            style={({ pressed }) => [styles.listItem, pressed && styles.listItemPressed]}
          >
            <Text style={styles.listLabel}>{l.native}</Text>
            <Text style={styles.listSub}>{l.name}</Text>
          </Pressable>
        ))}
      </View>
      <Text style={styles.whisper}>You can change this anytime in settings</Text>
      <Pressable
        onPress={onSkip}
        accessibilityRole="button"
        accessibilityLabel="Explore without signing in"
        style={styles.guestLink}
      >
        <Text style={styles.guestLinkLabel}>Explore without signing in</Text>
      </Pressable>
    </CenteredContainer>
  );
}

/* ------------------------------- Step 1: Invocation ------------------------------- */

function InvocationStep({
  insets,
  onComplete,
}: {
  insets: { top: number; bottom: number };
  onComplete: () => void;
}) {
  const pulse = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulse, { toValue: 1, duration: 4000, easing: Easing.inOut(Easing.quad), useNativeDriver: true }),
        Animated.timing(pulse, { toValue: 0, duration: 4000, easing: Easing.inOut(Easing.quad), useNativeDriver: true }),
      ]),
    ).start();
  }, [pulse]);
  const gradOpacity = pulse.interpolate({ inputRange: [0, 1], outputRange: [0.2, 0.45] });

  return (
    <View style={[styles.fullBleed, { paddingTop: insets.top, paddingBottom: insets.bottom + spacing.xl }]}>
      <Animated.View style={[StyleSheet.absoluteFillObject, { opacity: gradOpacity }]}>
        <LinearGradient
          colors={['rgba(76,29,149,0.40)', '#000000', 'rgba(30,58,138,0.40)']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={StyleSheet.absoluteFillObject}
        />
      </Animated.View>

      <View style={styles.invocationInner}>
        <FadeInRow delay={300}>
          <Text style={styles.invocationTitle}>SEEN</Text>
          <Text style={styles.invocationEyebrow}>BY CREOVA</Text>
        </FadeInRow>
        <FadeInRow delay={900}>
          <Text style={styles.invocationTagline}>Where stories live,{'\n'}where culture breathes</Text>
        </FadeInRow>
        <FadeInRow delay={1500}>
          <Text style={styles.invocationLine}>You are entering SEEN.</Text>
        </FadeInRow>
        <FadeInRow delay={2200}>
          <Pressable
            onPress={onComplete}
            accessibilityRole="button"
            accessibilityLabel="Enter SEEN"
            style={({ pressed }) => [styles.invocationBtn, pressed && { opacity: 0.7 }]}
          >
            <Text style={styles.invocationBtnText}>S · E · E · N</Text>
          </Pressable>
        </FadeInRow>
      </View>
    </View>
  );
}

/* ------------------------------- Step 2: Purpose ------------------------------- */

function PurposeStep({
  insets,
  onNext,
}: {
  insets: { top: number; bottom: number };
  onNext: () => void;
}) {
  return (
    <View style={styles.fullBleed}>
      <ImageBackground
        source={{
          uri: 'https://images.unsplash.com/photo-1665590309886-1d9d0411fa03?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=1080&q=80',
        }}
        style={StyleSheet.absoluteFillObject}
        resizeMode="cover"
      >
        <LinearGradient
          colors={['rgba(0,0,0,0.55)', 'rgba(0,0,0,0.55)', '#000000']}
          style={StyleSheet.absoluteFillObject}
        />
      </ImageBackground>
      <View
        style={[
          styles.purposeInner,
          { paddingTop: insets.top + spacing['2xl'], paddingBottom: insets.bottom + spacing['2xl'] },
        ]}
      >
        <Text style={styles.purposeEyebrow}>SEEN</Text>
        <View style={{ flex: 1 }} />
        <FadeInRow delay={300}>
          <Text style={styles.purposeHeading}>This is not{'\n'}social media</Text>
          <Text style={styles.purposeBody}>
            SEEN is a cultural operating system — an immersive space for stories, sound, and shared identity.
          </Text>
        </FadeInRow>
        <FadeInRow delay={900}>
          <Pressable
            onPress={onNext}
            accessibilityRole="button"
            accessibilityLabel="Continue"
            style={({ pressed }) => [styles.purposeBtn, pressed && { opacity: 0.7 }]}
          >
            <Text style={styles.purposeBtnLabel}>Continue</Text>
            <Ionicons name="arrow-forward" size={16} color={colors.textPrimary} />
          </Pressable>
        </FadeInRow>
      </View>
    </View>
  );
}

/* ------------------------------- Step 3: Role ------------------------------- */

function RoleStep({
  insets,
  onSelect,
}: {
  insets: { top: number; bottom: number };
  onSelect: (r: Role) => void;
}) {
  const ROLES: { value: Role; label: string; sub: string }[] = [
    { value: 'creator', label: 'Creator', sub: 'I make work' },
    { value: 'viewer', label: 'Viewer', sub: 'I explore culture' },
    { value: 'moderator', label: 'Moderator', sub: 'I shape communities' },
  ];
  return (
    <CenteredContainer insets={insets}>
      <Text style={styles.heading}>How will you move through this space?</Text>
      <View style={styles.stack}>
        {ROLES.map((r, i) => (
          <FadeInRow key={r.value} delay={500 + i * 100}>
            <Pressable
              onPress={() => onSelect(r.value)}
              accessibilityRole="button"
              accessibilityLabel={`Role: ${r.label}`}
              style={({ pressed }) => [styles.listItem, pressed && styles.listItemPressed]}
            >
              <Text style={styles.listLabel}>{r.label}</Text>
              <Text style={styles.listSub}>{r.sub}</Text>
            </Pressable>
          </FadeInRow>
        ))}
      </View>
    </CenteredContainer>
  );
}

/* ------------------------------- Step 4: Intent ------------------------------- */

function IntentStep({
  insets,
  onSelect,
}: {
  insets: { top: number; bottom: number };
  onSelect: (i: Intent) => void;
}) {
  const INTENTS: { label: string; value: Intent }[] = [
    { label: 'Share work', value: 'create' },
    { label: 'Build a body of work', value: 'create' },
    { label: 'Explore culture', value: 'explore' },
    { label: 'Connect with communities', value: 'contribute' },
  ];
  return (
    <CenteredContainer insets={insets}>
      <Text style={styles.heading}>What brings you here?</Text>
      <View style={styles.stack}>
        {INTENTS.map((it, i) => (
          <FadeInRow key={it.label} delay={500 + i * 100}>
            <Pressable
              onPress={() => onSelect(it.value)}
              accessibilityRole="button"
              accessibilityLabel={it.label}
              style={({ pressed }) => [styles.listItem, pressed && styles.listItemPressed]}
            >
              <Text style={styles.listLabel}>{it.label}</Text>
            </Pressable>
          </FadeInRow>
        ))}
      </View>
    </CenteredContainer>
  );
}

/* ------------------------------- Step 5: Account ------------------------------- */

function AccountStep({
  insets,
  onComplete,
  onGuest,
}: {
  insets: { top: number; bottom: number };
  onComplete: () => void;
  onGuest: () => void;
}) {
  const [mode, setMode] = useState<'signup' | 'signin'>('signup');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const validation = {
    length: password.length >= 8,
    upper: /[A-Z]/.test(password),
    lower: /[a-z]/.test(password),
    number: /[0-9]/.test(password),
  };
  const passwordValid = Object.values(validation).every(Boolean);
  const formValid =
    mode === 'signup' ? !!name && !!email && passwordValid : !!email && !!password;

  const submit = async () => {
    if (!formValid) return;
    try {
      await AsyncStorage.multiSet([
        ['seen_user_name', name || ''],
        ['seen_user_email', email],
      ]);
    } catch {}
    onComplete();
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      style={{ flex: 1 }}
    >
      <ScrollView
        contentContainerStyle={[
          styles.scrollCenter,
          {
            paddingTop: insets.top + spacing['3xl'],
            paddingBottom: insets.bottom + spacing['3xl'],
          },
        ]}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.containerInner}>
          <Text style={styles.heading}>
            {mode === 'signup' ? 'Create your account' : 'Welcome back'}
          </Text>
          <View style={styles.formStack}>
            {mode === 'signup' && (
              <TextInput
                value={name}
                onChangeText={setName}
                placeholder="Name"
                placeholderTextColor={colors.textFaint}
                style={styles.input}
                accessibilityLabel="Name"
              />
            )}
            <TextInput
              value={email}
              onChangeText={setEmail}
              placeholder="Email"
              placeholderTextColor={colors.textFaint}
              autoCapitalize="none"
              keyboardType="email-address"
              style={styles.input}
              accessibilityLabel="Email"
            />
            <TextInput
              value={password}
              onChangeText={setPassword}
              placeholder="Password"
              placeholderTextColor={colors.textFaint}
              secureTextEntry
              style={styles.input}
              accessibilityLabel="Password"
            />
            {mode === 'signup' && (
              <View style={styles.pwReq}>
                <PwLine ok={validation.length} label="At least 8 characters" />
                <PwLine ok={validation.upper} label="One uppercase letter" />
                <PwLine ok={validation.lower} label="One lowercase letter" />
                <PwLine ok={validation.number} label="One number" />
              </View>
            )}
          </View>

          <Pressable
            onPress={submit}
            disabled={!formValid}
            accessibilityRole="button"
            accessibilityLabel={mode === 'signup' ? 'Create account' : 'Sign in'}
            style={({ pressed }) => [
              styles.primaryBtn,
              !formValid && { opacity: 0.3 },
              pressed && formValid && { opacity: 0.7 },
            ]}
          >
            <Text style={styles.primaryBtnLabel}>
              {mode === 'signup' ? 'Create Account' : 'Sign In'}
            </Text>
          </Pressable>

          <Pressable
            onPress={() => setMode(mode === 'signup' ? 'signin' : 'signup')}
            style={styles.modeSwitch}
            accessibilityRole="button"
            accessibilityLabel="Switch sign-in mode"
          >
            <Text style={styles.modeSwitchLabel}>
              {mode === 'signup'
                ? 'Already have an account? Sign in'
                : 'Need an account? Create one'}
            </Text>
          </Pressable>

          <View style={styles.dividerRow}>
            <View style={styles.divider} />
            <Text style={styles.dividerLabel}>OR</Text>
            <View style={styles.divider} />
          </View>

          <Pressable
            onPress={onGuest}
            style={({ pressed }) => [styles.guestBtn, pressed && { opacity: 0.6 }]}
            accessibilityRole="button"
            accessibilityLabel="Continue as guest"
          >
            <Text style={styles.guestBtnLabel}>Continue as guest</Text>
          </Pressable>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

function PwLine({ ok, label }: { ok: boolean; label: string }) {
  return (
    <View style={styles.pwLine}>
      <Text style={[styles.pwMark, { color: ok ? colors.emerald : colors.textFaint }]}>
        {ok ? '✓' : '○'}
      </Text>
      <Text style={[styles.pwLabel, { color: ok ? colors.emerald : colors.textFaint }]}>
        {label}
      </Text>
    </View>
  );
}

/* ------------------------------- Step 6: Accessibility ------------------------------- */

function AccessibilityStep({
  insets,
  onComplete,
}: {
  insets: { top: number; bottom: number };
  onComplete: () => void;
}) {
  const [narratives, setNarratives] = useState(true);
  const [audio, setAudio] = useState(true);
  const [motion, setMotion] = useState(false);

  const save = async () => {
    try {
      await AsyncStorage.setItem(
        'seen_personalization',
        JSON.stringify({
          immersiveNarratives: narratives,
          richAudio: audio,
          dynamicMotion: motion,
        }),
      );
    } catch {}
    onComplete();
  };

  return (
    <CenteredContainer insets={insets}>
      <View style={{ marginBottom: spacing['2xl'] }}>
        <Text style={styles.heading}>Experience SEEN, your way</Text>
        <Text style={styles.subheading}>
          Tune into your frequency — shape how stories, sound, and visuals speak to you.
        </Text>
      </View>
      <View style={styles.stack}>
        <ToggleRow
          title="Immersive Narratives"
          desc="Cinematic story experiences with deeper context"
          value={narratives}
          onChange={setNarratives}
        />
        <ToggleRow
          title="Rich Audio"
          desc="Layered sound design and ambient music"
          value={audio}
          onChange={setAudio}
        />
        <ToggleRow
          title="Dynamic Motion"
          desc="Visuals breathe and move with cinematic presence"
          value={motion}
          onChange={setMotion}
        />
      </View>
      <Pressable
        onPress={save}
        accessibilityRole="button"
        accessibilityLabel="Save preferences"
        style={({ pressed }) => [styles.primaryBtn, { marginTop: spacing['2xl'] }, pressed && { opacity: 0.7 }]}
      >
        <Text style={styles.primaryBtnLabel}>Continue</Text>
      </Pressable>
    </CenteredContainer>
  );
}

function ToggleRow({
  title,
  desc,
  value,
  onChange,
}: {
  title: string;
  desc: string;
  value: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <View style={styles.toggleRow}>
      <View style={{ flex: 1, paddingRight: spacing.lg }}>
        <Text style={styles.toggleTitle}>{title}</Text>
        <Text style={styles.toggleDesc}>{desc}</Text>
      </View>
      <Switch
        value={value}
        onValueChange={onChange}
        trackColor={{ false: 'rgba(255,255,255,0.10)', true: colors.violetDeep }}
        thumbColor={value ? colors.violet : '#666'}
        accessibilityLabel={title}
      />
    </View>
  );
}

/* ------------------------------- Step 7: Presence ------------------------------- */

function PresenceStep({
  insets,
  onNext,
}: {
  insets: { top: number; bottom: number };
  onNext: () => void;
}) {
  return (
    <CenteredContainer insets={insets}>
      <FadeInRow delay={300}>
        <Text style={styles.presenceLine1}>Your presence will form here.</Text>
        <Text style={styles.presenceLine2}>
          As you create, explore, and contribute, this space becomes yours.
        </Text>
      </FadeInRow>
      <FadeInRow delay={1100}>
        <Pressable
          onPress={onNext}
          accessibilityRole="button"
          accessibilityLabel="Continue"
          style={({ pressed }) => [styles.ghostBtn, pressed && { opacity: 0.7 }]}
        >
          <Text style={styles.ghostBtnLabel}>Continue</Text>
        </Pressable>
      </FadeInRow>
    </CenteredContainer>
  );
}

/* ------------------------------- Step 8: Threshold ------------------------------- */

function ThresholdStep({
  insets,
  onEnter,
}: {
  insets: { top: number; bottom: number };
  onEnter: () => void;
}) {
  return (
    <CenteredContainer insets={insets}>
      <FadeInRow delay={300}>
        <Text style={styles.thresholdTitle}>You are now SEEN.</Text>
      </FadeInRow>
      <FadeInRow delay={900}>
        <Pressable
          onPress={onEnter}
          accessibilityRole="button"
          accessibilityLabel="Enter"
          style={({ pressed }) => [styles.ghostBtn, pressed && { opacity: 0.7 }]}
        >
          <Text style={styles.ghostBtnLabel}>Enter</Text>
        </Pressable>
      </FadeInRow>
    </CenteredContainer>
  );
}

/* ------------------------------- Shared helpers ------------------------------- */

function CenteredContainer({
  insets,
  children,
}: {
  insets: { top: number; bottom: number };
  children: React.ReactNode;
}) {
  return (
    <View
      style={[
        styles.centered,
        {
          paddingTop: insets.top + spacing['3xl'],
          paddingBottom: insets.bottom + spacing['2xl'],
        },
      ]}
    >
      <View style={styles.containerInner}>{children}</View>
    </View>
  );
}

function FadeInRow({ delay: _delay, children }: { delay: number; children: React.ReactNode }) {
  // The parent FadeKey provides the screen-level fade. Per-row staggered
  // fades were causing visibility issues on web's JS-driver animation fallback,
  // so we render rows immediately and keep the cinematic feel via the page fade.
  return <View style={{ width: '100%' }}>{children}</View>;
}

/* ------------------------------- Styles ------------------------------- */

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.background },

  centered: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing['2xl'],
  },
  scrollCenter: {
    flexGrow: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing['2xl'],
  },
  containerInner: {
    width: '100%',
    maxWidth: layout.containerMaxWidth - 32,
    alignItems: 'center',
  },

  fullBleed: { flex: 1, backgroundColor: colors.background },

  heading: {
    ...typography.h2,
    color: colors.textHigh,
    textAlign: 'center',
    marginBottom: spacing['3xl'],
    lineHeight: 28,
  },
  subheading: {
    ...typography.body,
    color: colors.textFaint,
    textAlign: 'center',
    marginTop: spacing.md,
    lineHeight: 20,
  },

  stack: { width: '100%' },
  formStack: { width: '100%', gap: spacing.md },

  listItem: {
    width: '100%',
    paddingVertical: spacing.xl,
    paddingHorizontal: spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  listItemPressed: { backgroundColor: 'rgba(255,255,255,0.03)' },
  listLabel: { ...typography.h3, color: colors.textHigh, fontSize: 17 },
  listSub: { ...typography.bodySm, color: colors.textFaint, marginTop: 4 },

  whisper: {
    ...typography.bodySm,
    color: colors.textWhisper,
    marginTop: spacing['3xl'],
    textAlign: 'center',
  },

  guestLink: { marginTop: spacing.xl, paddingVertical: spacing.sm },
  guestLinkLabel: { ...typography.micro, color: colors.textFaint, fontSize: 10 },

  /* Invocation */
  invocationInner: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing['2xl'],
  },
  invocationTitle: {
    fontSize: 44,
    letterSpacing: -1,
    fontWeight: '300',
    color: colors.textPrimary,
    textAlign: 'center',
  },
  invocationEyebrow: {
    ...typography.brandEyebrow,
    fontSize: 11,
    letterSpacing: 4,
    color: colors.textFaint,
    textAlign: 'center',
    marginTop: 8,
    marginBottom: spacing['4xl'],
  },
  invocationTagline: {
    ...typography.body,
    color: colors.textMuted,
    textAlign: 'center',
    fontSize: 15,
    lineHeight: 22,
    marginBottom: spacing['4xl'],
  },
  invocationLine: {
    ...typography.h3,
    color: colors.textHigh,
    textAlign: 'center',
    fontSize: 18,
    marginBottom: spacing['4xl'],
  },
  invocationBtn: {
    paddingVertical: 14,
    paddingHorizontal: spacing['3xl'],
    borderWidth: 1,
    borderColor: 'rgba(76,175,80,0.4)',
    backgroundColor: 'rgba(76,175,80,0.08)',
    borderRadius: 4,
  },
  invocationBtnText: {
    ...typography.cta,
    color: colors.textHigh,
    fontSize: 13,
    letterSpacing: 4,
  },

  /* Purpose */
  purposeInner: {
    flex: 1,
    paddingHorizontal: spacing['2xl'],
    width: '100%',
    maxWidth: layout.containerMaxWidth,
    alignSelf: 'center',
  },
  purposeEyebrow: { ...typography.micro, color: colors.textFaint, fontSize: 10 },
  purposeHeading: {
    fontSize: 36,
    fontWeight: '300',
    color: colors.textPrimary,
    lineHeight: 42,
    letterSpacing: -0.5,
    marginBottom: spacing.xl,
  },
  purposeBody: {
    ...typography.body,
    color: colors.textSecondary,
    lineHeight: 22,
    fontSize: 15,
    maxWidth: 320,
  },
  purposeBtn: {
    marginTop: spacing['3xl'],
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    alignSelf: 'flex-start',
    paddingVertical: spacing.lg,
    paddingHorizontal: spacing.xl,
    borderWidth: 1,
    borderColor: colors.borderStrong,
    borderRadius: radius.full,
  },
  purposeBtnLabel: { ...typography.cta, color: colors.textPrimary, fontSize: 12 },

  /* Account */
  input: {
    width: '100%',
    paddingVertical: 14,
    paddingHorizontal: spacing.lg,
    backgroundColor: '#000',
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.sm,
    color: colors.textHigh,
    fontSize: 14,
  },
  pwReq: { marginTop: spacing.sm, gap: 6, alignSelf: 'flex-start' },
  pwLine: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  pwMark: { fontSize: 12, width: 14 },
  pwLabel: { fontSize: 12 },

  primaryBtn: {
    width: '100%',
    paddingVertical: 16,
    marginTop: spacing['2xl'],
    borderTopWidth: 1,
    borderTopColor: colors.border,
    alignItems: 'center',
  },
  primaryBtnLabel: { ...typography.cta, color: colors.textHigh, fontSize: 12 },

  modeSwitch: { marginTop: spacing.lg, paddingVertical: spacing.sm },
  modeSwitchLabel: { ...typography.bodySm, color: colors.textFaint, fontSize: 12 },

  dividerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    marginTop: spacing.xl,
    gap: spacing.md,
  },
  divider: { flex: 1, height: 1, backgroundColor: colors.borderSubtle },
  dividerLabel: { ...typography.micro, color: colors.textWhisper, fontSize: 9 },

  guestBtn: {
    marginTop: spacing.lg,
    paddingVertical: 14,
    paddingHorizontal: spacing['2xl'],
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.full,
  },
  guestBtnLabel: { ...typography.cta, color: colors.textMuted, fontSize: 11 },

  /* Accessibility */
  toggleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.xl,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  toggleTitle: { ...typography.h3, color: colors.textHigh, fontSize: 15 },
  toggleDesc: { ...typography.bodySm, color: colors.textFaint, marginTop: 4, fontSize: 12 },

  /* Presence + Threshold */
  presenceLine1: {
    ...typography.h2,
    color: colors.textSecondary,
    textAlign: 'center',
    fontSize: 19,
    lineHeight: 26,
    marginBottom: spacing.lg,
  },
  presenceLine2: {
    ...typography.body,
    color: colors.textFaint,
    textAlign: 'center',
    fontSize: 14,
    lineHeight: 22,
    marginBottom: spacing['3xl'],
  },
  thresholdTitle: {
    fontSize: 26,
    fontWeight: '300',
    color: colors.textHigh,
    textAlign: 'center',
    marginBottom: spacing['3xl'],
    letterSpacing: 0.2,
    lineHeight: 32,
  },
  ghostBtn: {
    paddingVertical: 14,
    paddingHorizontal: spacing['3xl'],
  },
  ghostBtnLabel: { ...typography.cta, color: colors.textHigh, fontSize: 12 },
});
