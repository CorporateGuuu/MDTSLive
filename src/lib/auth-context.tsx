'use client';

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';

interface User {
  id: string;
  email: string;
  name: string;
  role: string;
}

interface AuthSession {
  user: User;
  access_token: string;
  refresh_token: string;
  timestamp: number;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  isAuthenticated: boolean;
  login: (user: User, session: any) => void;
  logout: () => void;
  refreshAuth: () => void;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  isAuthenticated: false,
  login: () => {},
  logout: () => {},
  refreshAuth: () => {},
});

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // Load session from localStorage on mount
  useEffect(() => {
    const loadSession = () => {
      try {
        const sessionData = localStorage.getItem('auth_session');
        if (sessionData) {
          const session: AuthSession = JSON.parse(sessionData);

          // Check if session is not too old (24 hours)
          const sessionAge = Date.now() - session.timestamp;
          const maxAge = 24 * 60 * 60 * 1000; // 24 hours in milliseconds

          if (sessionAge < maxAge && session.user) {
            setUser(session.user);
          } else {
            // Session expired, clear it
            localStorage.removeItem('auth_session');
          }
        }
      } catch (error) {
        console.error('Error loading session:', error);
        localStorage.removeItem('auth_session');
      } finally {
        setLoading(false);
      }
    };

    loadSession();

    // Listen for storage changes (in case another tab logs in/out)
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'auth_session') {
        if (e.newValue) {
          try {
            const session: AuthSession = JSON.parse(e.newValue);
            setUser(session.user);
          } catch (error) {
            setUser(null);
          }
        } else {
          setUser(null);
        }
        setLoading(false);
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const login = (userData: User, session: any) => {
    const sessionData: AuthSession = {
      user: userData,
      access_token: session.access_token,
      refresh_token: session.refresh_token,
      timestamp: Date.now()
    };

    localStorage.setItem('auth_session', JSON.stringify(sessionData));
    setUser(userData);
    setLoading(false);

    // Trigger a custom event for other components to listen to
    window.dispatchEvent(new CustomEvent('auth-login', { detail: { user: userData } }));
  };

  const logout = () => {
    localStorage.removeItem('auth_session');
    setUser(null);
    setLoading(false);

    // Trigger a custom event for other components to listen to
    window.dispatchEvent(new CustomEvent('auth-logout'));
  };

  const refreshAuth = () => {
    try {
      const sessionData = localStorage.getItem('auth_session');
      if (sessionData) {
        const session: AuthSession = JSON.parse(sessionData);
        const sessionAge = Date.now() - session.timestamp;
        const maxAge = 24 * 60 * 60 * 1000;

        if (sessionAge < maxAge && session.user) {
          setUser(session.user);
        } else {
          localStorage.removeItem('auth_session');
          setUser(null);
        }
      } else {
        setUser(null);
      }
    } catch (error) {
      console.error('Error refreshing auth:', error);
      setUser(null);
    }
    setLoading(false);
  };

  const value = {
    user,
    loading,
    isAuthenticated: !!user,
    login,
    logout,
    refreshAuth,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
