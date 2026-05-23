import { useEffect, useRef } from 'react';
import { View, Text, Pressable, StyleSheet, Animated, Easing } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, radius, typography } from '../constants/theme';

// Splash / welcome screen — matches SplashScreen.tsx in the zip:
// pure black bg, slow-pulsing purple→blue gradient, eye logo,
// "SEEN" wordmark with "BY CREOVA" eyebrow, single CTA.
export default function Welcome() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const pulse = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulse, { toValue: 1, duration: 4000, easing: Easing.inOut(Easing.quad), useNativeDriver: true }),
        Animated.timing(pulse, { toValue: 0, duration: 4000, easing: Easing.inOut(Easing.quad), useNativeDriver: true }),
      ]),
    ).start();
  }, [pulse]);

  const gradientOpacity = pulse.interpolate({ inputRange: [0, 1], outputRange: [0.25, 0.55] });
  const gradientScale = pulse.interpolate({ inputRange: [0, 1], outputRange: [1, 1.08] });

  return (
    <View style={[styles.container, { paddingTop: insets.top, paddingBottom: insets.bottom + spacing.xl }]}>
      <Animated.View
        style={[
          StyleSheet.absoluteFillObject,
          { opacity: gradientOpacity, transform: [{ scale: gradientScale }] },
        ]}
      >
        <LinearGradient
          colors={['rgba(76,29,149,0.40)', '#000000', 'rgba(30,58,138,0.40)']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={StyleSheet.absoluteFillObject}
        />
      </Animated.View>

      <View style={styles.spacer} />

      <View style={styles.center}>
        <View style={styles.eyeRing}>
          <Ionicons name="eye-outline" size={26} color={colors.textPrimary} />
        </View>
        <Text style={styles.title}>SEEN</Text>
        <Text style={styles.sub}>BY CREOVA</Text>
        <Text style={styles.tagline}>
          Canadian stories from voices that{'\n'}shaped this land — and were{'\n'}never truly heard.
        </Text>
      </View>

      <View style={styles.bottom}>
        <Pressable
          style={({ pressed }) => [styles.cta, pressed && { opacity: 0.6 }]}
          onPress={() => router.replace('/(tabs)')}
        >
          <Text style={styles.ctaLabel}>Begin Listening</Text>
        </Pressable>
        <Text style={styles.micro}>Mobile Native · Expo</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background, paddingHorizontal: spacing['2xl'] },
  spacer: { flex: 1 },
  center: { alignItems: 'center' },
  eyeRing: {
    width: 64, height: 64, borderRadius: 32,
    borderWidth: 1, borderColor: colors.borderStrong,
    alignItems: 'center', justifyContent: 'center',
    marginBottom: spacing['2xl'],
  },
  title: { fontSize: 44, letterSpacing: -1, fontWeight: '300', color: colors.textPrimary },
  sub: { ...typography.brandEyebrow, fontSize: 11, letterSpacing: 4, color: colors.textFaint, marginTop: 8 },
  tagline: {
    ...typography.body,
    color: colors.textMuted,
    textAlign: 'center',
    marginTop: spacing['2xl'],
    lineHeight: 22,
    maxWidth: 320,
  },
  bottom: { flex: 1, justifyContent: 'flex-end', alignItems: 'center' },
  cta: {
    borderWidth: 1, borderColor: colors.borderStrong,
    borderRadius: radius.full,
    paddingVertical: 16, paddingHorizontal: spacing['3xl'],
    backgroundColor: 'transparent',
  },
  ctaLabel: { ...typography.cta, color: colors.textPrimary, fontSize: 13 },
  micro: { ...typography.micro, color: colors.textWhisper, marginTop: spacing.xl, fontSize: 9 },
});
