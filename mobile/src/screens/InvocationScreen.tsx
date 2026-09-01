import { useEffect, useRef } from 'react';
import { View, Text, Pressable, StyleSheet, Animated, Easing } from 'react-native';
import { colors, spacing, radii } from '../theme';

interface InvocationScreenProps {
  onEnter: () => void;
}

/**
 * LAYER 0: INVOCATION
 * The emotional entry point — mirrors OnboardingSystem.tsx's InvocationLayer
 * on web, including the pulsing green glow around the S.E.E.N button.
 */
export function InvocationScreen({ onEnter }: InvocationScreenProps) {
  const fadeIn = useRef(new Animated.Value(0)).current;
  const pulse = useRef(new Animated.Value(0)).current;
  const pressScale = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.timing(fadeIn, {
      toValue: 1,
      duration: 1200,
      useNativeDriver: true,
    }).start();

    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(pulse, {
          toValue: 1,
          duration: 2000,
          easing: Easing.out(Easing.ease),
          useNativeDriver: false, // shadow/opacity interpolation isn't supported by native driver
        }),
        Animated.timing(pulse, {
          toValue: 0,
          duration: 0,
          useNativeDriver: false,
        }),
        Animated.delay(1000),
      ])
    );
    loop.start();
    return () => loop.stop();
  }, []);

  const ringScale = pulse.interpolate({ inputRange: [0, 1], outputRange: [1, 1.4] });
  const ringOpacity = pulse.interpolate({ inputRange: [0, 1], outputRange: [0.5, 0] });

  const handlePressIn = () => {
    Animated.spring(pressScale, { toValue: 0.97, useNativeDriver: true }).start();
  };
  const handlePressOut = () => {
    Animated.spring(pressScale, { toValue: 1, useNativeDriver: true }).start();
  };

  return (
    <Animated.View style={[styles.container, { opacity: fadeIn }]}>
      <View style={styles.content}>
        <View style={styles.brandBlock}>
          <Text style={styles.title}>SEEN</Text>
          <Text style={styles.subtitle}>by CREOVA</Text>
        </View>

        <Text style={styles.tagline}>Where stories live,{'\n'}where culture breathes</Text>
        <Text style={styles.invocation}>You are entering SEEN.</Text>

        <Animated.View style={{ transform: [{ scale: pressScale }] }}>
          <Pressable
            onPress={onEnter}
            onPressIn={handlePressIn}
            onPressOut={handlePressOut}
            style={styles.button}
            accessibilityRole="button"
            accessibilityLabel="Enter SEEN"
          >
            {/* Pulsing glow ring */}
            <Animated.View
              pointerEvents="none"
              style={[
                styles.glowRing,
                {
                  opacity: ringOpacity,
                  transform: [{ scale: ringScale }],
                },
              ]}
            />
            <View style={styles.buttonLetters}>
              {['S', '.', 'E', '.', 'E', '.', 'N'].map((ch, i) => (
                <Text key={i} style={ch === '.' ? styles.buttonDot : styles.buttonLetter}>
                  {ch}
                </Text>
              ))}
            </View>
          </Pressable>
        </Animated.View>
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.black,
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.lg,
  },
  brandBlock: {
    alignItems: 'center',
    marginBottom: spacing.xxl,
  },
  title: {
    fontSize: 36,
    letterSpacing: -0.5,
    color: colors.white,
    marginBottom: spacing.xs,
    fontWeight: '300',
  },
  subtitle: {
    fontSize: 11,
    letterSpacing: 4,
    textTransform: 'uppercase',
    color: 'rgba(255,255,255,0.3)',
  },
  tagline: {
    fontSize: 16,
    color: colors.whiteStrong,
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: spacing.xxl,
  },
  invocation: {
    fontSize: 18,
    color: 'rgba(255,255,255,0.8)',
    textAlign: 'center',
    marginBottom: spacing.xxl,
  },
  button: {
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.xl,
    borderRadius: radii.sm / 4,
    backgroundColor: colors.greenFaint,
    borderWidth: 1,
    borderColor: colors.greenBorder,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: colors.green,
    shadowOpacity: 0.5,
    shadowRadius: 20,
    shadowOffset: { width: 0, height: 4 },
    elevation: 8,
  },
  glowRing: {
    position: 'absolute',
    top: -8,
    left: -8,
    right: -8,
    bottom: -8,
    borderRadius: radii.sm,
    borderWidth: 2,
    borderColor: colors.green,
  },
  buttonLetters: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
  },
  buttonLetter: {
    fontSize: 14,
    fontWeight: '700',
    letterSpacing: 2,
    color: 'rgba(255,255,255,0.95)',
    textTransform: 'uppercase',
  },
  buttonDot: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.9)',
  },
});
