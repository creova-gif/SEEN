import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { Platform, View, StyleSheet } from 'react-native';
import { colors } from '../constants/theme';

// iPhone 14 Pro logical viewport. The bezel adds ~14px on each side and the
// rounded corners + Dynamic Island sit on top of the app surface.
const PHONE_W = 390;
const PHONE_H = 844;
const BEZEL = 14;
const NOTCH_W = 120;
const NOTCH_H = 32;
const NOTCH_TOP = 12;

// initialMetrics so the SafeAreaProvider reports a top inset on web (where
// there are no real device insets) — the app then pushes content below the
// Dynamic Island notch.
const WEB_INITIAL_METRICS = {
  frame: { x: 0, y: 0, width: PHONE_W, height: PHONE_H },
  insets: { top: 47, bottom: 34, left: 0, right: 0 },
};

export default function RootLayout() {
  const app = (
    <SafeAreaProvider initialMetrics={Platform.OS === 'web' ? WEB_INITIAL_METRICS : undefined}>
      <View style={{ flex: 1, backgroundColor: colors.background }}>
        <StatusBar style="light" />
        <Stack
          screenOptions={{
            headerShown: false,
            contentStyle: { backgroundColor: colors.background },
            animation: 'fade',
          }}
        >
          <Stack.Screen name="index" />
          <Stack.Screen name="onboarding" />
          <Stack.Screen name="(tabs)" />
          <Stack.Screen name="story/[id]" options={{ animation: 'fade' }} />
        </Stack>
      </View>
    </SafeAreaProvider>
  );

  // Native (Expo Go on a real device) — render the app directly, no bezel.
  if (Platform.OS !== 'web') {
    return (
      <GestureHandlerRootView style={{ flex: 1, backgroundColor: colors.background }}>
        {app}
      </GestureHandlerRootView>
    );
  }

  // Web — wrap the entire app in a centered iPhone-frame mockup so the
  // canvas preview reads as a real device, not a browser window.
  return (
    <GestureHandlerRootView style={styles.webStage}>
      <View style={styles.webBackdrop}>
        <View style={styles.phone}>
          <View style={styles.phoneScreen}>
            {app}
            {/* Dynamic Island */}
            <View pointerEvents="none" style={styles.notch} />
            {/* Home indicator */}
            <View pointerEvents="none" style={styles.homeIndicator} />
          </View>
        </View>
      </View>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  webStage: { flex: 1, backgroundColor: '#0a0a0a' },
  webBackdrop: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#0a0a0a',
    padding: 24,
  },
  phone: {
    width: PHONE_W + BEZEL * 2,
    height: PHONE_H + BEZEL * 2,
    maxWidth: '100%',
    maxHeight: '100%',
    backgroundColor: '#1a1a1a',
    borderRadius: 56,
    padding: BEZEL,
    // Soft outer glow / shadow for depth
    shadowColor: '#000',
    shadowOpacity: 0.6,
    shadowRadius: 40,
    shadowOffset: { width: 0, height: 20 },
    elevation: 24,
    borderWidth: 1,
    borderColor: '#2a2a2a',
  },
  phoneScreen: {
    flex: 1,
    borderRadius: 44,
    overflow: 'hidden',
    backgroundColor: colors.background,
    position: 'relative',
  },
  notch: {
    position: 'absolute',
    top: NOTCH_TOP,
    left: '50%',
    marginLeft: -NOTCH_W / 2,
    width: NOTCH_W,
    height: NOTCH_H,
    backgroundColor: '#000',
    borderRadius: NOTCH_H / 2,
    zIndex: 1000,
  },
  homeIndicator: {
    position: 'absolute',
    bottom: 8,
    left: '50%',
    marginLeft: -67,
    width: 134,
    height: 5,
    borderRadius: 3,
    backgroundColor: 'rgba(255,255,255,0.45)',
    zIndex: 1000,
  },
});
