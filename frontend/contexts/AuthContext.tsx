import React, { createContext, useEffect, useRef, useState } from "react";
import api from "../api/client";

export type User = { id: number; email: string; name?: string } | null;

type AuthCtx = {
  user: User;
  loading: boolean;
  setUser: React.Dispatch<React.SetStateAction<User>>;
  logout: () => Promise<void>;
};

export const AuthContext = createContext<AuthCtx | undefined>(undefined);

const AuthProvider: React.FC<React.PropsWithChildren> = ({ children }) => {
  const [user, setUser] = useState<User>(null);
  const [loading, setLoading] = useState(true);
  const initialized = useRef(false);

  useEffect(() => {
    if (initialized.current) return;
    initialized.current = true;
    (async () => {
      try {
        const { data } = await api.get("/auth/me");
        setUser(data?.data ?? null);
      } catch {
        setUser(null);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const logout = async () => {
    await api.post("/auth/logout");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, setUser, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
