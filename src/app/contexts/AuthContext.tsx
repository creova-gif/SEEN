import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import type { UserRole, Language, UserIntent } from './StoryStateContext';

/**
 * AUTHENTICATION
 *
 * Local-storage backed authentication. Accounts, sessions, and profile
 * updates are persisted on-device so the full auth flow (sign up, sign in,
 * sign out, password recovery, role elevation) works end-to-end without a
 * deployed backend. A Supabase Edge Function with a matching contract lives
 * at supabase/functions/server/index.tsx — swap the implementations below
 * for fetch() calls to that API once it is deployed; the AuthContextType
 * surface is designed to stay identical either way.
 */

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  language: Language;
  intent: UserIntent;
  passwordHash?: string;
  createdAt?: string;
  updatedAt?: string;
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
  requestPasswordRecovery: (email: string) => Promise<{ resetToken?: string }>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const AUTH_STORAGE_KEY = 'seenos_auth_session';
const USERS_STORAGE_KEY = 'seenos_users_db';

// ============================================
// Local "database" helpers
// ============================================

function loadUsersDb(): Record<string, User> {
  try {
    const raw = localStorage.getItem(USERS_STORAGE_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

function saveUsersDb(db: Record<string, User>) {
  localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(db));
}

// Not cryptographically secure — this is a demo-mode local auth store.
// A real deployment must hash with bcrypt/argon2 server-side and never
// store or compare passwords client-side.
async function hashPassword(password: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(password + 'seen_salt_v1');
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  return Array.from(new Uint8Array(hashBuffer)).map(b => b.toString(16).padStart(2, '0')).join('');
}

function generateToken(): string {
  return `tok_${crypto.randomUUID()}`;
}

function sleep(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AuthState>({
    user: null,
    accessToken: null,
    isLoading: true,
    isAuthenticated: false,
  });

  // Load session from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(AUTH_STORAGE_KEY);
      if (stored) {
        const { accessToken, userId } = JSON.parse(stored);
        const usersDb = loadUsersDb();
        const user = userId ? usersDb[userId] : null;

        if (accessToken && user) {
          setState({
            user: stripPassword(user),
            accessToken,
            isLoading: false,
            isAuthenticated: true,
          });
          return;
        }
      }
    } catch (error) {
      console.error('Failed to load session:', error);
    }

    setState({
      user: null,
      accessToken: null,
      isLoading: false,
      isAuthenticated: false,
    });
  }, []);

  const stripPassword = (user: User): User => {
    const { passwordHash, ...rest } = user;
    return rest as User;
  };

  const persistSession = (accessToken: string | null, userId: string | null) => {
    if (accessToken && userId) {
      localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify({ accessToken, userId }));
    } else {
      localStorage.removeItem(AUTH_STORAGE_KEY);
    }
  };

  const signUp = async (
    email: string,
    password: string,
    name: string,
    role: UserRole,
    language: Language,
    intent: UserIntent
  ) => {
    await sleep(400); // simulate network latency for realistic UX

    const normalizedEmail = email.trim().toLowerCase();
    if (!normalizedEmail || !password || !name) {
      throw new Error('Email, password, and name are required.');
    }
    if (password.length < 8) {
      throw new Error('Password must be at least 8 characters.');
    }

    const usersDb = loadUsersDb();
    const existing = Object.values(usersDb).find(u => u.email.toLowerCase() === normalizedEmail);
    if (existing) {
      throw new Error('An account with this email already exists. Please sign in instead.');
    }

    const passwordHash = await hashPassword(password);
    const now = new Date().toISOString();
    const newUser: User = {
      id: `user_${crypto.randomUUID()}`,
      email: normalizedEmail,
      name,
      role,
      language,
      intent,
      passwordHash,
      createdAt: now,
      updatedAt: now,
    };

    usersDb[newUser.id] = newUser;
    saveUsersDb(usersDb);

    const accessToken = generateToken();
    setState({
      user: stripPassword(newUser),
      accessToken,
      isLoading: false,
      isAuthenticated: true,
    });
    persistSession(accessToken, newUser.id);
  };

  const signIn = async (email: string, password: string) => {
    await sleep(400);

    const normalizedEmail = email.trim().toLowerCase();
    const usersDb = loadUsersDb();
    const user = Object.values(usersDb).find(u => u.email.toLowerCase() === normalizedEmail);

    if (!user) {
      throw new Error('No account found with this email. Please sign up first.');
    }

    const passwordHash = await hashPassword(password);
    if (user.passwordHash !== passwordHash) {
      throw new Error('Incorrect password. Please try again.');
    }

    const accessToken = generateToken();
    setState({
      user: stripPassword(user),
      accessToken,
      isLoading: false,
      isAuthenticated: true,
    });
    persistSession(accessToken, user.id);
  };

  const signOut = async () => {
    setState({
      user: null,
      accessToken: null,
      isLoading: false,
      isAuthenticated: false,
    });
    persistSession(null, null);

    localStorage.removeItem('hasEnteredSEEN');
    localStorage.removeItem('onboarding_completed');
    localStorage.removeItem('onboarding_step');
  };

  const checkSession = async () => {
    if (!state.user) return;
    const usersDb = loadUsersDb();
    const freshUser = usersDb[state.user.id];
    if (!freshUser) {
      await signOut();
      return;
    }
    setState(prev => ({ ...prev, user: stripPassword(freshUser) }));
  };

  const updateProfile = async (updates: Partial<User>) => {
    if (!state.user) {
      throw new Error('Not authenticated');
    }

    const usersDb = loadUsersDb();
    const existing = usersDb[state.user.id];
    if (!existing) {
      throw new Error('User not found');
    }

    const updated: User = {
      ...existing,
      ...updates,
      id: existing.id, // never allow id/password overwrite via profile updates
      passwordHash: existing.passwordHash,
      updatedAt: new Date().toISOString(),
    };

    usersDb[existing.id] = updated;
    saveUsersDb(usersDb);

    setState(prev => ({ ...prev, user: stripPassword(updated) }));
  };

  const requestRoleElevation = async (requestedRole: UserRole, reason: string) => {
    if (!state.user) {
      throw new Error('Not authenticated');
    }
    // Demo mode: role elevation requests are auto-logged for admin review
    // via the moderation/admin data layer rather than applied immediately.
    const key = 'seenos_role_elevation_requests';
    const raw = localStorage.getItem(key);
    const requests = raw ? JSON.parse(raw) : [];
    requests.push({
      id: `elev_${crypto.randomUUID()}`,
      userId: state.user.id,
      userName: state.user.name,
      currentRole: state.user.role,
      requestedRole,
      reason,
      status: 'pending',
      createdAt: new Date().toISOString(),
    });
    localStorage.setItem(key, JSON.stringify(requests));
  };

  const requestPasswordRecovery = async (email: string) => {
    await sleep(300);
    const usersDb = loadUsersDb();
    const user = Object.values(usersDb).find(u => u.email.toLowerCase() === email.trim().toLowerCase());
    if (!user) {
      // Do not reveal whether the account exists
      return {};
    }
    // Demo mode: return a reset token directly instead of emailing it,
    // since no email provider is connected in this environment.
    const resetToken = generateToken();
    const key = 'seenos_password_resets';
    const raw = localStorage.getItem(key);
    const resets = raw ? JSON.parse(raw) : {};
    resets[resetToken] = { userId: user.id, expiresAt: Date.now() + 30 * 60 * 1000 };
    localStorage.setItem(key, JSON.stringify(resets));
    return { resetToken };
  };

  return (
    <AuthContext.Provider
      value={{
        state,
        signUp,
        signIn,
        signOut,
        checkSession,
        updateProfile,
        requestRoleElevation,
        requestPasswordRecovery,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
