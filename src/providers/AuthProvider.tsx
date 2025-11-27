import { createContext, useState, useEffect } from "react";
import { getAuth, saveAuth, clearAuth } from "../utils/storage";

export const AuthContext = createContext<any>(null);

export const AuthProvider = ({ children }: any) => {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const saved = getAuth();
    if (saved) setUser(saved);
    setLoading(false);
  }, []);

  const login = (userdata: any) => {
    saveAuth(userdata);
    setUser(userdata);
  };

  const logout = () => {
    clearAuth();
    setUser(null);
  };

  if (loading) return null; // atau loading spinner

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

