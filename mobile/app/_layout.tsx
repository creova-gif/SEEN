import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { Text, View } from 'react-native';
import {
  useFonts,
  Inter_300Light,
  Inter_400Regular,
  Inter_500Medium,
  Inter_600SemiBold,
} from '@expo-google-fonts/inter';
import { colors, fontFamily } from '../constants/theme';
import { AudioPlayerProvider } from '../contexts/AudioPlayerContext';

// Wire Inter as the default font on every Text node once it loads.
// We do this once at app boot rather than touching every component.
function setDefaultFont() {
  const TextAny = Text as any;
  if (TextAny.__seenDefaultsApplied) return;
  const prevProps = TextAny.defaultProps || {};
  const prevStyle = prevProps.style ?? {};
  TextAny.defaultProps = {
    ...prevProps,
    style: [{ fontFamily: fontFamily.regular }, prevStyle],
  };
  TextAny.__seenDefaultsApplied = true;
}

export default function RootLayout() {
  const [fontsLoaded] = useFonts({
    Inter_300Light,
    Inter_400Regular,
    Inter_500Medium,
    Inter_600SemiBold,
  });

  if (fontsLoaded) setDefaultFont();

  // Render a plain dark surface until fonts are ready. Fast on web/native;
  // avoids the FOUT/swap that would otherwise re-flow every screen.
  if (!fontsLoaded) {
    return (
      <GestureHandlerRootView style={{ flex: 1, backgroundColor: colors.background }}>
        <View style={{ flex: 1, backgroundColor: colors.background }} />
      </GestureHandlerRootView>
    );
  }

  return (
    <GestureHandlerRootView style={{ flex: 1, backgroundColor: colors.background }}>
      <SafeAreaProvider>
        <AudioPlayerProvider>
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
              <Stack.Screen name="admin" />
            </Stack>
          </View>
        </AudioPlayerProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
