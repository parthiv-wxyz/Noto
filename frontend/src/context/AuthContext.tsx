import { createContext, useEffect, useState, useCallback } from "react";
import { supabase } from "../services/supabaseClient";
import api from "../services/api";

type AuthContextType = {
  user: any;
  role: string | null;
  loading: boolean;
};

export const AuthContext = createContext<AuthContextType>({
  user: null,
  role: null,
  loading: true,
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<any>(null);
  const [role, setRole] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchRole = useCallback(async () => {
    try {
      const res = await api.get("/ping");
      setRole(res.data?.role ?? "user");
    } catch {
      setRole("user");
    }
  }, []);

  useEffect(() => {
    // Initial session check
    supabase.auth.getSession().then(({ data: { session } }) => {
      const currentUser = session?.user ?? null;
      setUser(currentUser);

      if (currentUser) {
        fetchRole().finally(() => setLoading(false));
      } else {
        setRole(null);
        setLoading(false);
      }
    });

    // Listen for auth state changes (login, logout, token refresh)
    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      const newUser = session?.user ?? null;
      setUser(newUser);

      if (newUser) {
        fetchRole();
      } else {
        setRole(null);
      }
    });

    return () => listener.subscription.unsubscribe();
  }, [fetchRole]);

  return (
    <AuthContext.Provider value={{ user, role, loading }}>
      {children}
    </AuthContext.Provider>
  );
};