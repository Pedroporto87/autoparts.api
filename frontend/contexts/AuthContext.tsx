import React, { createContext, useState, useEffect, useRef } from 'react';
import api from '../api/client'

type User = {
    id: number;
    email: string,
    name?: string
} | null;

type AuthCtx = {
    user: User;
    loading: boolean;
    setUser: React.Dispatch<React.SetStateAction<User>>;
    logout: () => Promise<void>;
}

export const AuthContext = createContext<AuthCtx>({
    user: null,
    loading: true,
    setUser: () => {},
    logout: async () => {},
  });

export const AuthProvider: React.FC<React.PropsWithChildren> = ({ children }) => {
    const [user, setUser] = useState<User>(null);
    const [loading, setLoading] = useState(true);
    const initialized = useRef(false);

    useEffect(() => {
        if (initialized.current) return;
        initialized.current = true;
    
        (async () => {
          try {
            const { data } = await api.get("/auth/me");
            setUser(data.data);
          } catch {
            setUser(null);
          } finally {
            setLoading(false);
          }
        })();
      }, []);

      const login  = async (email: string, password: string) => {
        const { data } = await api.post("/auth/login", { email, password });
        setUser(data.data.user ?? data.data);
      }

      const logout = async () => {
        await api.post("/auth/logout");
        setUser(null);
      }

      return (
        <AuthContext.Provider value={{ user, loading, login, logout }}>
            {children}
        </AuthContext.Provider>
      )
}