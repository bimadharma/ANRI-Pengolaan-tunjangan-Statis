import { createContext, useState, useEffect } from "react";
import { getAuth, saveAuth, clearAuth } from "../utils/storage";

export const AuthContext = createContext<any>(null);

export const AuthProvider = ({ children }: any) => {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const logout = () => {
    clearAuth();
    setUser(null);
 
  };

  const login = (userdata: any) => {
    saveAuth(userdata);
    setUser(userdata);
  };

  useEffect(() => {
    const saved = getAuth(); 
    if (saved) {
      setUser(saved);
    } else {
      setUser(null);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    if (!user) return;

    const interval = setInterval(() => {
      const isValid = getAuth(); // Cek ke storage
      if (!isValid) {
        console.log("Session expired via interval check");
        logout();
      }
    }, 60000); 

    return () => clearInterval(interval);
  }, [user]);

  if (loading) return null;

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};