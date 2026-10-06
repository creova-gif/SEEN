import { useCallback, useEffect, useRef, useState } from 'react';
import { ActivityIndicator, BackHandler, Linking, Platform, Pressable, StyleSheet, Text, View } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { WebView, type WebViewNavigation } from 'react-native-webview';
import type { ShouldStartLoadRequest } from 'react-native-webview/lib/WebViewTypes';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { SEEN_URL } from './config';
import { isExternalHandoff, isInternalUrl } from './navigation';
import { colors } from './theme';

/**
 * The real SEEN app, full screen, inside a native shell.
 * One product on web and phone: every screen, the protected S.E.E.N entry screens, onboarding,
 * reader, funding and creators all come from the same code that runs on the website.
 */
export function WebShell() {
  const webRef = useRef<WebView>(null);
  const canGoBack = useRef(false);
  const insets = useSafeAreaInsets();
  const [failed, setFailed] = useState(false);
  const [attempt, setAttempt] = useState(0);

  // Android hardware / gesture back goes back inside the app first, and only leaves the app at the start.
  useEffect(() => {
    if (Platform.OS !== 'android') return;
    const sub = BackHandler.addEventListener('hardwareBackPress', () => {
      if (canGoBack.current) {
        webRef.current?.goBack();
        return true;
      }
      return false;
    });
    return () => sub.remove();
  }, []);

  const onNavigationStateChange = useCallback((nav: WebViewNavigation) => {
    canGoBack.current = nav.canGoBack;
  }, []);

  const onShouldStart = useCallback((req: ShouldStartLoadRequest) => {
    if (req.isTopFrame === false) return true; // frames and subresources
    if (isInternalUrl(req.url, SEEN_URL)) return true;
    if (isExternalHandoff(req.url)) Linking.openURL(req.url).catch(() => {});
    return false;
  }, []);

  // iOS draws the web page under the status bar and home indicator and the page pads itself with
  // env(safe-area-inset-*). Android's web view does not report those insets, so pad here instead.
  const pad = Platform.OS === 'android' ? { paddingTop: insets.top, paddingBottom: insets.bottom } : null;

  return (
    <View style={[styles.root, pad]}>
      <StatusBar style="light" />
      {failed ? (
        <View style={styles.center} accessibilityRole="alert">
          <Text style={styles.title}>Can’t reach SEEN</Text>
          <Text style={styles.body}>Check your connection and try again.</Text>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Try again"
            style={styles.button}
            onPress={() => {
              setFailed(false);
              setAttempt(a => a + 1);
            }}
          >
            <Text style={styles.buttonText}>Try again</Text>
          </Pressable>
        </View>
      ) : (
        <WebView
          key={attempt}
          ref={webRef}
          source={{ uri: SEEN_URL }}
          style={styles.web}
          containerStyle={styles.web}
          applicationNameForUserAgent="SEEN-Expo"
          injectedJavaScriptBeforeContentLoaded={`window.__SEEN_NATIVE__ = { platform: '${Platform.OS}' }; true;`}
          onShouldStartLoadWithRequest={onShouldStart}
          onNavigationStateChange={onNavigationStateChange}
          onError={() => setFailed(true)}
          onHttpError={e => {
            if (e.nativeEvent.statusCode >= 500) setFailed(true);
          }}
          startInLoadingState
          renderLoading={() => (
            <View style={styles.center}>
              <ActivityIndicator color={colors.green} />
            </View>
          )}
          javaScriptEnabled
          domStorageEnabled
          sharedCookiesEnabled
          cacheEnabled
          allowsInlineMediaPlayback
          allowsBackForwardNavigationGestures
          contentInsetAdjustmentBehavior="never"
          automaticallyAdjustContentInsets={false}
          bounces={false}
          overScrollMode="never"
          pullToRefreshEnabled={false}
          setSupportMultipleWindows={false}
          allowFileAccess={false}
          mixedContentMode="never"
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.black },
  web: { flex: 1, backgroundColor: colors.black },
  center: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.black, paddingHorizontal: 32 },
  title: { color: colors.white, fontSize: 20, fontWeight: '600', marginBottom: 8, textAlign: 'center' },
  body: { color: colors.whiteStrong, fontSize: 16, marginBottom: 24, textAlign: 'center' },
  button: { minHeight: 48, minWidth: 160, paddingHorizontal: 24, borderRadius: 999, backgroundColor: colors.white, alignItems: 'center', justifyContent: 'center' },
  buttonText: { color: colors.black, fontSize: 16, fontWeight: '600' },
});
