import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { projectId, publicAnonKey } from '/utils/supabase/info';
import type { UserRole, Language, UserIntent } from './StoryStateContext';

const API_BASE = `https://${projectId}.supabase.co/functions/v1/make-server-2bdc05e6`;

console.log('Auth API Base URL:', API_BASE);

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  language: Language;
  intent: UserIntent;
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
  requestPasswordRecovery: (email: string) => Promise<void>;
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

  // Load session from localStorage and validate on mount
  useEffect(() => {
    const loadSession = async () => {
      try {
        const stored = localStorage.getItem(AUTH_STORAGE_KEY);
        if (stored) {
          const { accessToken } = JSON.parse(stored);
          if (accessToken) {
            // Validate session with backend
            const response = await fetch(`${API_BASE}/auth/session`, {
              headers: {
                'Authorization': `Bearer ${accessToken}`,
              },
            });

            if (response.ok) {
              const { user } = await response.json();
              setState({
                user,
                accessToken,
                isLoading: false,
                isAuthenticated: true,
              });
              return;
            }
          }
        }
      } catch (error) {
        console.error('Failed to load session:', error);
      }
      
      // No valid session
      setState({
        user: null,
        accessToken: null,
        isLoading: false,
        isAuthenticated: false,
      });
    };

    loadSession();
  }, []);

  // CRITICAL BLOCKER #1: Automatic token refresh
  // Refresh token 5 minutes before expiry
  useEffect(() => {
    if (!state.accessToken || !state.isAuthenticated) return;

    const refreshInterval = setInterval(async () => {
      try {
        const stored = localStorage.getItem(AUTH_STORAGE_KEY);
        if (!stored) return;

        const { accessToken, refreshToken } = JSON.parse(stored);
        if (!refreshToken) return;

        console.log('Refreshing session token...');
        
        const response = await fetch(`${API_BASE}/auth/refresh`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ refresh_token: refreshToken }),
        });

        if (response.ok) {
          const { session, user } = await response.json();
          
          setState(prev => ({
            ...prev,
            user,
            accessToken: session.access_token,
          }));

          // Update localStorage with new tokens
          localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify({
            accessToken: session.access_token,
            refreshToken: session.refresh_token,
            user,
          }));

          console.log('Session refreshed successfully');
        } else {
          console.error('Failed to refresh session, signing out...');
          await signOut();
        }
      } catch (error) {
        console.error('Error refreshing session:', error);
      }
    }, 50 * 60 * 1000); // Refresh every 50 minutes (tokens expire in 60 minutes)

    return () => clearInterval(refreshInterval);
  }, [state.accessToken, state.isAuthenticated]);

  // Persist session to localStorage
  const persistSession = (accessToken: string | null, refreshToken: string | null, user: User | null) => {
    if (accessToken && refreshToken && user) {
      localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify({ accessToken, refreshToken, user }));
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
    try {
      console.log('Attempting signup with:', { email, name, role, language, intent });
      console.log('API URL:', `${API_BASE}/auth/signup`);
      
      const response = await fetch(`${API_BASE}/auth/signup`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${publicAnonKey}`, // Add anon key for public endpoint
        },
        body: JSON.stringify({ email, password, name, role, language, intent }),
      }).catch(err => {
        console.error('Network error during signup fetch:', err);
        throw new Error(`Network error: ${err.message}`);
      });

      console.log('Signup response received:', response);
      
      const contentType = response.headers.get("content-type");
      console.log('Response content type:', contentType);
      
      let data;
      if (contentType && contentType.includes("application/json")) {
        data = await response.json();
      } else {
        const text = await response.text();
        console.error('Non-JSON response:', text);
        throw new Error(`Server returned non-JSON response: ${text.substring(0, 200)}`);
      }
      
      console.log('Signup response data:', { status: response.status, data });

      if (!response.ok) {
        console.error('Signup failed with response:', data);
        
        // Check for specific error codes
        if (data.code === 'email_exists' || response.status === 409) {
          throw new Error('An account with this email already exists. Please sign in instead.');
        }
        
        throw new Error(data.error || data.details || `Signup failed with status ${response.status}`);
      }

      // Check if signup returned a session (new behavior)
      if (data.session && data.user) {
        console.log('Signup successful with session - user automatically signed in');
        setState({
          user: data.user,
          accessToken: data.session.access_token,
          isLoading: false,
          isAuthenticated: true,
        });
        persistSession(data.session.access_token, data.session.refresh_token, data.user);
      } else if (data.requiresSignIn || data.message) {
        // Signup succeeded but immediate sign-in failed - try manual sign-in
        console.log('Signup successful but requires manual sign in:', data.message);
        console.log('Attempting manual sign in...');
        // Wait a moment before trying to sign in
        await new Promise(resolve => setTimeout(resolve, 1000));
        await signIn(email, password);
      } else {
        // Fallback - try to sign in
        console.log('Signup response unclear, attempting sign in...');
        await signIn(email, password);
      }
    } catch (error) {
      console.error('Error during signup:', error);
      throw error;
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      const response = await fetch(`${API_BASE}/auth/signin`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${publicAnonKey}`, // Add anon key for public endpoint
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Sign in failed');
      }

      const { session, user } = data;

      setState({
        user,
        accessToken: session.access_token,
        isLoading: false,
        isAuthenticated: true,
      });

      persistSession(session.access_token, session.refresh_token, user);
    } catch (error) {
      console.error('Error during sign in:', error);
      throw error;
    }
  };

  const signOut = async () => {
    try {
      if (state.accessToken) {
        await fetch(`${API_BASE}/auth/signout`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${state.accessToken}`,
          },
        });
      }
    } catch (error) {
      console.error('Error during sign out:', error);
    } finally {
      setState({
        user: null,
        accessToken: null,
        isLoading: false,
        isAuthenticated: false,
      });
      persistSession(null, null, null);
      
      // Clear onboarding state to force re-onboarding
      localStorage.removeItem('hasEnteredSEEN');
      localStorage.removeItem('onboarding_completed');
      localStorage.removeItem('onboarding_step');
    }
  };

  const checkSession = async () => {
    if (!state.accessToken) return;

    try {
      const response = await fetch(`${API_BASE}/auth/session`, {
        headers: {
          'Authorization': `Bearer ${state.accessToken}`,
        },
      });

      if (!response.ok) {
        // Session invalid, sign out
        await signOut();
        return;
      }

      const { user } = await response.json();
      setState(prev => ({
        ...prev,
        user,
      }));
    } catch (error) {
      console.error('Error checking session:', error);
    }
  };

  const updateProfile = async (updates: Partial<User>) => {
    if (!state.accessToken) {
      throw new Error('Not authenticated');
    }

    try {
      const response = await fetch(`${API_BASE}/profile`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${state.accessToken}`,
        },
        body: JSON.stringify(updates),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to update profile');
      }

      setState(prev => ({
        ...prev,
        user: data.profile,
      }));

      persistSession(state.accessToken, null, data.profile);
    } catch (error) {
      console.error('Error updating profile:', error);
      throw error;
    }
  };

  const requestRoleElevation = async (requestedRole: UserRole, reason: string) => {
    if (!state.accessToken) {
      throw new Error('Not authenticated');
    }

    try {
      const response = await fetch(`${API_BASE}/profile/request-role`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${state.accessToken}`,
        },
        body: JSON.stringify({ requestedRole, reason }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to request role elevation');
      }

      return data;
    } catch (error) {
      console.error('Error requesting role elevation:', error);
      throw error;
    }
  };

  const requestPasswordRecovery = async (email: string) => {
    try {
      const response = await fetch(`${API_BASE}/auth/recovery`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${publicAnonKey}`, // Add anon key for public endpoint
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to request password recovery');
      }

      return data;
    } catch (error) {
      console.error('Error requesting password recovery:', error);
      throw error;
    }
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