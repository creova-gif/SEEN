/**
 * LOCAL STORAGE SERVICE-LAYER CONTRACT
 * SEEN by CREOVA
 *
 * Every feature's data module (userStoriesService.ts, adminService.ts,
 * monetizationService.ts, etc.) persists a typed value under one localStorage
 * key through this exact load/save pair. Centralizing it here means:
 *
 * 1. New feature modules import it instead of redefining it per-file.
 * 2. When a feature migrates to a real Supabase-backed implementation, only
 *    this module (or that feature's own service functions) needs to change —
 *    calling screens keep using the same service function names/signatures.
 */

export function load<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}

export function save<T>(key: string, value: T): void {
  localStorage.setItem(key, JSON.stringify(value));
}
