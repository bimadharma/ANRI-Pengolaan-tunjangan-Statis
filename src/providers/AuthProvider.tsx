import { createContext, useState, useEffect } from "react";
import { getAuth, saveAuth, clearAuth } from "../utils/storage";

export const AuthContext = createContext<any>(null);

export const AuthProvider = ({ children }: any) => {
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const saved = getAuth();
    if (saved) setUser(saved);
  }, []);

  const login = (userdata: any) => {
    saveAuth(userdata);
    setUser(userdata);
  };

  const logout = () => {
    clearAuth();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
