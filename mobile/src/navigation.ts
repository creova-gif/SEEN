/**
 * Which links may open inside the app's web view. Everything else opens in the system browser,
 * so SEEN's screen can never be turned into a window onto another site.
 * Pure TypeScript (no React Native imports) so the root test suite can cover it.
 */
export function originOf(url: string): string | null {
  const m = /^(https?:\/\/[^/?#]+)/i.exec(url.trim());
  return m ? m[1].toLowerCase() : null;
}

export function isInternalUrl(url: string, baseUrl: string): boolean {
  if (url === 'about:blank') return true;
  const origin = originOf(url);
  const base = originOf(baseUrl);
  return origin !== null && base !== null && origin === base;
}

/** Schemes the app may hand to the phone (mail, phone, maps); anything else is dropped. */
export function isExternalHandoff(url: string): boolean {
  return /^(https?:|mailto:|tel:|sms:)/i.test(url.trim());
}
