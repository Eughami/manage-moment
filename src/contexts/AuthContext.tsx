import { AUTH_TOKEN } from '@/constants/auth';
import { LoginResponse } from '@/services/auth';
import { createContext, useContext, ReactNode, useState } from 'react';

interface AuthContextType {
  isAuthenticated: boolean;
  login: (d: LoginResponse) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

let externalLogout = () => {};

export function AuthProvider({ children }: { children: ReactNode }) {
  const token = localStorage.getItem(AUTH_TOKEN);
  const [isAuthenticated, setIsAuthenticated] = useState(token ? true : false);

  const login = (data: LoginResponse) => {
    localStorage.setItem(AUTH_TOKEN, data.accessToken);
    setIsAuthenticated(true);
  };

  const logout = () => {
    setIsAuthenticated(false);
  };

  // Assign logout to the external reference
  externalLogout = logout;

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

// Export logout function for non-component files
export const logoutExternally = () => {
  externalLogout();
};

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
