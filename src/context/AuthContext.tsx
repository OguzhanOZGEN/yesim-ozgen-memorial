import { createContext, useContext, useState, useCallback, ReactNode } from 'react';

interface AuthContextType {
  isAdmin: boolean;
  login: (username: string, password: string) => boolean;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [isAdmin, setIsAdmin] = useState<boolean>(() => {
    // Check if admin was logged in from sessionStorage
    try {
      return sessionStorage.getItem('isAdmin') === 'true';
    } catch {
      return false;
    }
  });

  const login = useCallback((username: string, password: string): boolean => {
    // Simple admin login check
    if (username === 'admin' && password === 'admin') {
      setIsAdmin(true);
      try {
        sessionStorage.setItem('isAdmin', 'true');
      } catch {
        // Ignore storage errors
      }
      return true;
    }
    return false;
  }, []);

  const logout = useCallback(() => {
    setIsAdmin(false);
    try {
      sessionStorage.removeItem('isAdmin');
    } catch {
      // Ignore storage errors
    }
  }, []);

  return (
    <AuthContext.Provider value={{ isAdmin, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
