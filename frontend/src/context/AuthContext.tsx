import { createContext, useEffect, useState } from "react";
import { supabase } from "../services/supabaseClient";


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

  const fetchRole = async (userId: string, token: string) => {
    const res = await fetch("http://localhost:5000/ping", {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (res.ok) {
      const data = await res.json();
      setRole(data.role);
    } else {
      setRole("user");
    }
  };

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      if (session?.user && session?.access_token) {
        fetchRole(session.user.id, session.access_token).finally(() =>
          setLoading(false)
        );
      } else {
        setLoading(false);
      }
    });

    const { data: listener } = supabase.auth.onAuthStateChange(
      async (_event, session) => {
        setUser(session?.user ?? null);
        if (session?.user && session?.access_token) {
          await fetchRole(session.user.id, session.access_token);
        } else {
          setRole(null);
        }
      }
    );

    return () => listener.subscription.unsubscribe();
  }, []);

  return (
    <AuthContext.Provider value={{ user, role, loading }}>
      {children}
    </AuthContext.Provider>
  );
};