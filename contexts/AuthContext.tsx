import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import type { UserRole, Language, UserIntent } from './StoryStateContext';

const PROJECT_ID = 'cddipfbiqnxouvgsndly';
const PUBLIC_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNkZGlwZmJpcW54b3V2Z3NuZGx5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzAyNTk1NjMsImV4cCI6MjA4NTgzNTU2M30.v5kxc-jLeAra-aXgXxNAm2JKsbOTU5miWtkB1XPGdLA';
const API_BASE = `https://${PROJECT_ID}.supabase.co/functions/v1/make-server-2bdc05e6`;

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  language: Language;
  intent: UserIntent;
  createdAt?: string;
}

interface AuthState {
  user: User | null;
  accessToken: string | null;
  isLoading: boolean;
  isAuthenticated: boolean;
}

interface AuthContextType {
  state: AuthState;
  signUp: (email: string, password: string, name: string, role: UserRole, language: Language, intent: UserIntent) => Promise<void>;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  checkSession: () => Promise<void>;
  updateProfile: (updates: Partial<User>) => Promise<void>;
  requestRoleElevation: (requestedRole: UserRole, reason: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);
const AUTH_STORAGE_KEY = 'seenos_auth_session';

export function AuthProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AuthState>({
    user: null,
    accessToken: null,
    isLoading: true,
    isAuthenticated: false,
  });

  useEffect(() => {
    const loadSession = async () => {
      try {
        const stored = await AsyncStorage.getItem(AUTH_STORAGE_KEY);
        if (stored) {
          const { accessToken } = JSON.parse(stored);
          if (accessToken) {
            const response = await fetch(`${API_BASE}/auth/session`, {
              headers: { Authorization: `Bearer ${accessToken}` },
            });
            if (response.ok) {
              const { user } = await response.json();
              setState({ user, accessToken, isLoading: false, isAuthenticated: true });
              return;
            }
          }
        }
      } catch (e) {
        console.error('Failed to load session:', e);
      }
      setState({ user: null, accessToken: null, isLoading: false, isAuthenticated: false });
    };
    loadSession();
  }, []);

  const persistSession = async (accessToken: string | null, refreshToken: string | null, user: User | null) => {
    if (accessToken && refreshToken && user) {
      await AsyncStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify({ accessToken, refreshToken, user }));
    } else {
      await AsyncStorage.removeItem(AUTH_STORAGE_KEY);
    }
  };

  const signUp = async (
    email: string, password: string, name: string,
    role: UserRole, language: Language, intent: UserIntent
  ) => {
    const response = await fetch(`${API_BASE}/auth/signup`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${PUBLIC_ANON_KEY}` },
      body: JSON.stringify({ email, password, name, role, language, intent }),
    });
    const contentType = response.headers.get('content-type');
    let data: Record<string, unknown>;
    if (contentType?.includes('application/json')) {
      data = await response.json();
    } else {
      const text = await response.text();
      throw new Error(`Server error: ${text.substring(0, 200)}`);
    }
    if (!response.ok) {
      if (data.code === 'email_exists' || response.status === 409) {
        throw new Error('An account with this email already exists. Please sign in instead.');
      }
      throw new Error((data.error as string) || `Signup failed (${response.status})`);
    }
    if (data.session && data.user) {
      const { session, user: u } = data as { session: { access_token: string; refresh_token: string }; user: User };
      setState({ user: u, accessToken: session.access_token, isLoading: false, isAuthenticated: true });
      await persistSession(session.access_token, session.refresh_token, u);
    } else {
      await new Promise(resolve => setTimeout(resolve, 800));
      await signIn(email, password);
    }
  };

  const signIn = async (email: string, password: string) => {
    const response = await fetch(`${API_BASE}/auth/signin`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${PUBLIC_ANON_KEY}` },
      body: JSON.stringify({ email, password }),
    });
    const contentType = response.headers.get('content-type');
    let data: Record<string, unknown>;
    if (contentType?.includes('application/json')) {
      data = await response.json();
    } else {
      throw new Error('Unexpected server response. Please try again.');
    }
    if (!response.ok) {
      throw new Error((data.error as string) || (data.message as string) || 'Sign in failed. Check your email and password.');
    }
    const { session, user } = data as { session: { access_token: string; refresh_token: string }; user: User };
    if (!session || !user) throw new Error('Invalid response from server. Please try again.');
    setState({ user, accessToken: session.access_token, isLoading: false, isAuthenticated: true });
    await persistSession(session.access_token, session.refresh_token, user);
  };

  const signOut = async () => {
    try {
      if (state.accessToken) {
        await fetch(`${API_BASE}/auth/signout`, {
          method: 'POST',
          headers: { Authorization: `Bearer ${state.accessToken}` },
        });
      }
    } catch (e) {
      console.error('Sign out error:', e);
    }
    await AsyncStorage.removeItem(AUTH_STORAGE_KEY);
    setState({ user: null, accessToken: null, isLoading: false, isAuthenticated: false });
  };

  const checkSession = async () => {
    if (!state.accessToken) return;
    try {
      const response = await fetch(`${API_BASE}/auth/session`, {
        headers: { Authorization: `Bearer ${state.accessToken}` },
      });
      if (!response.ok) {
        setState({ user: null, accessToken: null, isLoading: false, isAuthenticated: false });
        await AsyncStorage.removeItem(AUTH_STORAGE_KEY);
      }
    } catch (e) {
      console.error('Session check failed:', e);
    }
  };

  const updateProfile = async (updates: Partial<User>) => {
    if (!state.accessToken) return;
    const response = await fetch(`${API_BASE}/user/profile`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${state.accessToken}` },
      body: JSON.stringify(updates),
    });
    if (response.ok) {
      const { user } = await response.json();
      setState(prev => ({ ...prev, user }));
      const stored = await AsyncStorage.getItem(AUTH_STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        await AsyncStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify({ ...parsed, user }));
      }
    }
  };

  const requestRoleElevation = async (requestedRole: UserRole, reason: string) => {
    if (!state.accessToken) return;
    await fetch(`${API_BASE}/user/role-elevation`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${state.accessToken}` },
      body: JSON.stringify({ requestedRole, reason }),
    });
  };

  return (
    <AuthContext.Provider value={{ state, signUp, signIn, signOut, checkSession, updateProfile, requestRoleElevation }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
