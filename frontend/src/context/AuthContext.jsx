import { createContext, useState, useEffect } from 'react';
import { authService } from '../services/authService';

export const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = authService.getToken();
    if (token) {
      const userData = authService.getUserFromToken();
      setUser(userData);
    }
    setLoading(false);
  }, []);

  const login = async (credentials) => {
    const token = await authService.login(credentials);
    const userData = authService.getUserFromToken();
    setUser(userData);
    return userData;
  };

  const signup = async (userData) => {
    await authService.signup(userData);
  };

  const logout = () => {
    authService.logout();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, signup, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
}