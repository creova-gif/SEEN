# SEEN — Mobile (Expo)

Native iOS and Android client for SEEN by CREOVA, built on Expo SDK 57 (React Native 0.86, React 19).

## Run it with Expo Go

```bash
cd mobile
npm install
npx expo start
```

This prints a QR code in the terminal.

- **iOS**: open the Camera app and scan the QR code, or open it directly inside the Expo Go app.
- **Android**: open the Expo Go app and use its built-in QR scanner.

Both devices must be on the same network as the machine running `expo start` (or use the tunnel option if they aren't: `npx expo start --tunnel`).

## What's implemented

- Branded invocation screen with the signature pulsing S.E.E.N glow button
- Onboarding (role + intent selection)
- For You feed with story cards (sample catalog)
- Story detail screen
- Profile with sign-out
- Dark theme, safe-area-aware layout, custom app icon/splash for both platforms

## What's not yet wired up

This is the first mobile milestone, not a full port of the web app. Not yet built on mobile:

- Full chapter reader (audio playback, captions, branching choices)
- Authentication against the shared Supabase backend (currently local onboarding state only)
- Creator monetization, checkout, and subscription management
- Admin/moderation tools
- Search

The web app (`../src`) and this mobile app are intended to eventually share the same Supabase backend (`../supabase/functions/server`) rather than duplicate business logic — that wiring is the natural next step.

## Building for the App Store / Play Store

This project hasn't been configured with EAS Build yet. When ready to publish:

```bash
npm install -g eas-cli
eas login
eas build:configure
eas build --platform ios
eas build --platform android
```

That requires an Expo account and, for iOS, an active Apple Developer Program membership.
