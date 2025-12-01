import { createContext, useContext, useEffect, useState } from "react";
import { User, Session } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";

type UserRole = "admin" | "user" | "professor";

interface AuthContextType {
  user: User | null;
  session: Session | null;
  role: UserRole | null;
  loading: boolean;
  signIn: (identifier: string, password: string) => Promise<{ error: any }>;
  signUp: (email: string, password: string, fullName: string, phone: string, whatsapp: string) => Promise<{ error: any }>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [role, setRole] = useState<UserRole | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetchUserRole = async (userId: string) => {
    const { data, error } = await supabase
      .from("user_roles")
      .select("role")
      .eq("user_id", userId)
      .single();

    if (error) {
      console.error("Error fetching user role:", error);
      return null;
    }
    return data?.role as UserRole;
  };

  useEffect(() => {
    // Set up auth state listener FIRST
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        
        if (session?.user) {
          setTimeout(async () => {
            const userRole = await fetchUserRole(session.user.id);
            setRole(userRole);
            setLoading(false);
          }, 0);
        } else {
          setRole(null);
          setLoading(false);
        }
      }
    );

    // THEN check for existing session
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      
      if (session?.user) {
        const userRole = await fetchUserRole(session.user.id);
        setRole(userRole);
      }
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const signIn = async (identifier: string, password: string) => {
    // Detectar se é email ou telefone
    const isEmail = identifier.includes("@");
    
    let signInData;
    if (isEmail) {
      // Login com email
      signInData = await supabase.auth.signInWithPassword({
        email: identifier,
        password,
      });
    } else {
      // Login com telefone - buscar email usando RPC
      const { data: emailData, error: emailError } = await supabase
        .rpc("get_email_by_phone", { phone_number: identifier });
      
      if (emailError || !emailData) {
        return { error: { message: "Telefone não encontrado no sistema" } };
      }
      
      // Fazer login com o email encontrado
      signInData = await supabase.auth.signInWithPassword({
        email: emailData,
        password,
      });
    }

    const { data, error } = signInData;

    if (!error && data.user) {
      const userRole = await fetchUserRole(data.user.id);
      setRole(userRole);
      
      // Redirect based on role
      if (userRole === "admin") {
        navigate("/admin/school");
      } else if (userRole === "professor") {
        navigate("/student/courses");
      } else {
        navigate("/student/dashboard");
      }
    }

    return { error };
  };

  const signUp = async (
    email: string, 
    password: string, 
    fullName: string, 
    phone: string, 
    whatsapp: string
  ) => {
    const redirectUrl = `${window.location.origin}/`;
    
    // Criar usuário no auth
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: redirectUrl,
        data: {
          full_name: fullName,
          phone: phone,
          whatsapp: whatsapp,
        }
      },
    });
    
    if (authError) {
      return { error: authError };
    }
    
    // Criar perfil
    if (authData.user) {
      const { error: profileError } = await supabase
        .from("profiles")
        .insert({
          user_id: authData.user.id,
          full_name: fullName,
          phone: phone,
          whatsapp: whatsapp,
          is_active: true,
        });
      
      if (profileError) {
        console.error("Erro ao criar perfil:", profileError);
      }
      
      // Criar role padrão de usuário
      const { error: roleError } = await supabase
        .from("user_roles")
        .insert({
          user_id: authData.user.id,
          role: "user",
        });
      
      if (roleError) {
        console.error("Erro ao criar role:", roleError);
      }
      
      // Criar stats iniciais
      const { error: statsError } = await supabase
        .from("user_stats")
        .insert({
          user_id: authData.user.id,
          total_xp: 0,
          total_coins: 0,
          current_streak: 0,
          longest_streak: 0,
          rank: "bronze",
        });
      
      if (statsError) {
        console.error("Erro ao criar stats:", statsError);
      }
    }
    
    return { error: null };
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setSession(null);
    setRole(null);
    navigate("/auth");
  };

  return (
    <AuthContext.Provider
      value={{ user, session, role, loading, signIn, signUp, signOut }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
