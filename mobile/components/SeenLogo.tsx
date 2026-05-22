import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing } from '../constants/theme';

type Props = { size?: 'sm' | 'md' | 'lg' };

export function SeenLogo({ size = 'md' }: Props) {
  const eye = size === 'lg' ? 56 : size === 'md' ? 40 : 28;
  const fs  = size === 'lg' ? 28 : size === 'md' ? 20 : 14;
  const sub = size === 'lg' ? 11 : size === 'md' ? 9  : 8;

  return (
    <View style={styles.wrap}>
      <View style={[styles.eyeRing, { width: eye, height: eye, borderRadius: eye / 2 }]}>
        <Ionicons name="eye-outline" size={eye * 0.45} color={colors.textFaint} />
      </View>
      <Text style={[styles.title, { fontSize: fs, marginTop: spacing.sm }]}>SEEN</Text>
      <Text style={[styles.sub, { fontSize: sub, marginTop: 2 }]}>BY CREOVA</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { alignItems: 'center' },
  eyeRing: {
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    color: colors.textPrimary,
    fontWeight: '600',
    letterSpacing: 4,
  },
  sub: {
    color: colors.textFaint,
    letterSpacing: 4,
    fontWeight: '500',
  },
});
