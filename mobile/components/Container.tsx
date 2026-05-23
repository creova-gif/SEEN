import { View, type ViewProps, type StyleProp, type ViewStyle, StyleSheet } from 'react-native';
import { layout } from '../constants/theme';

// Mirrors the zip's `max-w-[428px] mx-auto` container.
// On phones it's full-width; on wider screens (web/tablet) it caps at 428 and centers.
export function Container({ style, children, ...rest }: ViewProps & { children?: React.ReactNode }) {
  return (
    <View style={[styles.outer, style]} {...rest}>
      <View style={styles.inner}>{children}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  outer: { width: '100%', alignItems: 'center' },
  inner: { width: '100%', maxWidth: layout.containerMaxWidth },
});
