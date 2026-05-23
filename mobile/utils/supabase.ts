import 'react-native-url-polyfill/auto';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createClient, type SupabaseClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY || '';

// When the Supabase env vars aren't configured we still want the app to
// load — fall back to a tiny stub whose auth methods return "no session"
// so screens that read the session keep working from AsyncStorage instead.
function makeStub(): SupabaseClient {
  const noSession = async () => ({ data: { session: null }, error: null });
  const stub: any = {
    auth: {
      getSession: noSession,
      getUser: async () => ({ data: { user: null }, error: null }),
      onAuthStateChange: () => ({ data: { subscription: { unsubscribe: () => {} } } }),
      signInWithPassword: async () => ({ data: { session: null, user: null }, error: { message: 'Supabase not configured' } }),
      signUp:               async () => ({ data: { session: null, user: null }, error: { message: 'Supabase not configured' } }),
      signOut:              async () => ({ error: null }),
    },
    from: () => ({
      select: async () => ({ data: [], error: null }),
      insert: async () => ({ data: null, error: { message: 'Supabase not configured' } }),
      update: async () => ({ data: null, error: { message: 'Supabase not configured' } }),
      delete: async () => ({ data: null, error: { message: 'Supabase not configured' } }),
    }),
  };
  return stub as SupabaseClient;
}

export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey);

export const supabase: SupabaseClient = isSupabaseConfigured
  ? createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        storage: AsyncStorage,
        autoRefreshToken: true,
        persistSession: true,
        detectSessionInUrl: false,
      },
    })
  : makeStub();

if (!isSupabaseConfigured && typeof console !== 'undefined') {
  console.warn('[supabase] EXPO_PUBLIC_SUPABASE_URL / EXPO_PUBLIC_SUPABASE_ANON_KEY not set — using offline stub.');
}
