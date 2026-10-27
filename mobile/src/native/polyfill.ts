/**
 * The shared catalogue code was written for a browser and reads `localStorage` for a few user-made items.
 * The phone has none, so this gives it a small in-memory one. (Saved items and progress use AsyncStorage in
 * `storage.ts`; nothing important lives in this shim.)
 */
const mem = new Map<string, string>();
const shim = {
  getItem: (k: string) => (mem.has(k) ? mem.get(k)! : null),
  setItem: (k: string, v: string) => void mem.set(k, String(v)),
  removeItem: (k: string) => void mem.delete(k),
  clear: () => mem.clear(),
  key: (i: number) => [...mem.keys()][i] ?? null,
  get length() {
    return mem.size;
  },
};
const g = globalThis as unknown as { localStorage?: unknown; window?: unknown };
if (!g.localStorage) g.localStorage = shim;
