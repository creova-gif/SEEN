# SEEN on phones

SEEN is a mobile-first web app. It can be installed from the browser to the home screen and then opens full screen like an app, with no app store.

## Install (for customers)

- **iPhone / iPad (Safari):** open the SEEN link, tap Share, then "Add to Home Screen".
- **Android (Chrome):** open the SEEN link, tap the menu (three dots), then "Install app" or "Add to Home screen".

Use the production link (`https://seen-sigma-eight.vercel.app`). Preview links on `*.vercel.app` are protected by Vercel sign-in and are for the team only.

## What is in place

- `public/manifest.webmanifest`: name, standalone display, portrait, black theme and background colours, icons.
- `public/icons/`: 192 and 512 px icons, a maskable 512 px icon (kept inside the safe zone so Android can crop it), and a 180 px iOS icon. They are drawn from the S.E.E.N entry button.
- `index.html`: manifest link, `theme-color`, iOS home-screen tags, description. Zoom is **not** disabled (WCAG 1.4.4).
- `src/styles/index.css`: no pull-to-refresh bounce, no tap flash, no double-tap-zoom delay (pinch zoom still works), black page background.
- Notch and home-indicator spacing was already handled with `env(safe-area-inset-*)` in the header, bottom nav and onboarding.
- Tests: `src/app/__tests__/installable.test.ts` (manifest, icon sizes, tags) and `e2e/installable.spec.ts` (served over HTTP).

## What is not included (yet)

- **Offline use:** there is no service worker. Opening the app with no connection shows the app's own offline state for data screens, but the app shell itself needs the network on first load. A service worker is deliberately left out until there is a caching and update plan, because a bad one can leave customers on an old version.
- **Push notifications, app-store listing, native audio in the background:** need a native wrapper.
- **Real-device checks:** tested at phone widths in a browser only. Test on a real iPhone and Android before announcing it widely.

## If a store app is wanted later

Wrap this same web app with Capacitor (iOS and Android) and keep one codebase. The `mobile/` folder is an old Expo prototype of a different, earlier app; it does not run this app and Expo Go cannot open it, so it is not the route.
