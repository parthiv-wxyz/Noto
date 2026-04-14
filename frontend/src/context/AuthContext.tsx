import { createContext, useEffect, useState } from "react";
import { supabase } from "../services/supabaseClient";
import api  from "../services/api";

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

  const fetchRole = async () => {
  try {
    const res = await api.get("/ping");
    console.log("PING RESPONSE:", res.data);
    setRole(res.data.role ?? "user");
  } catch (err) {
    console.error("PING ERROR:", err);
    setRole("user");
  }
};

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      setUser(data.user);
      if (data.user) fetchRole();
      setLoading(false);
    });

    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      if (session?.user) {
        fetchRole();
      } else {
        setRole(null);
      }
    });

    return () => listener.subscription.unsubscribe();
  }, []);

  return (
    <AuthContext.Provider value={{ user, role, loading }}>
      {children}
    </AuthContext.Provider>
  );
};