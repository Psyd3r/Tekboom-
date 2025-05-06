
import { useState, useEffect } from "react";
import { Session, User } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { toast } from "@/components/ui/sonner";
import { UserRole } from "@/types/auth";

export function useAuthProvider() {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [userRole, setUserRole] = useState<UserRole>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetchUserRole = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', userId)
        .single();
        
      if (error) {
        console.error('Error fetching user role:', error);
        return;
      }
      
      // Verificando se o papel do usuário é válido
      if (data?.role === 'admin' || data?.role === 'customer') {
        setUserRole(data.role);
        console.log("Papel do usuário definido como:", data.role);
      } else {
        console.log("Papel não reconhecido, definindo como cliente por padrão:", data?.role);
        setUserRole('customer'); // Valor padrão caso não seja nem admin nem customer
      }
    } catch (error) {
      console.error('Error in fetchUserRole:', error);
    }
  };

  useEffect(() => {
    // Get the initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      
      if (session?.user) {
        fetchUserRole(session.user.id);
      }
      
      setLoading(false);
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        console.log("Auth state changed:", event, session?.user?.id);
        setSession(session);
        setUser(session?.user ?? null);
        
        if (session?.user) {
          fetchUserRole(session.user.id);
        } else {
          setUserRole(null);
        }
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  const signIn = async (email: string, password: string) => {
    try {
      console.log("Tentando fazer login com:", email);
      
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      
      if (error) {
        throw error;
      }
      
      // Buscar informações do usuário após o login bem-sucedido
      const currentUser = (await supabase.auth.getUser()).data.user;
      if (!currentUser) {
        throw new Error("Falha ao obter usuário após login");
      }
      
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('role, full_name')
        .eq('id', currentUser.id)
        .single();
      
      if (profileError) {
        console.error('Erro ao buscar perfil:', profileError);
        toast.error("Erro ao buscar informações de perfil do usuário");
        return;
      }
      
      console.log("Perfil obtido após login:", profileData);
      
      // Determinar o redirecionamento baseado no papel do usuário
      // Modificado para garantir acesso ao painel administrativo
      if (profileData?.role === 'admin') {
        toast.success("Login administrativo realizado com sucesso!");
        console.log("Redirecionando para o painel administrativo");
        navigate("/produtos", { replace: true });
      } else {
        toast.success("Login realizado com sucesso!");
        console.log("Redirecionando para a loja");
        navigate("/store", { replace: true });
      }
    } catch (error: any) {
      toast.error(error.message || "Erro ao fazer login");
      throw error;
    }
  };

  const signUp = async (email: string, password: string, fullName: string, role: 'admin' | 'customer' = 'customer') => {
    try {
      console.log("Tentando criar usuário com papel:", role);
      
      const { error, data } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
            role: role
          },
        },
      });

      if (error) {
        throw error;
      }

      // Esperar um momento para garantir que o perfil já tenha sido criado pelo gatilho do supabase
      setTimeout(async () => {
        if (data.user?.id) {
          // Verificar se o perfil foi criado corretamente
          const { error: profileError } = await supabase
            .from('profiles')
            .update({ role: role })
            .eq('id', data.user.id);
            
          if (profileError) {
            console.error("Erro ao atualizar papel do usuário:", profileError);
          }
        }
      }, 1000);
      
      toast.success("Usuário criado com sucesso!");
      
      // Para contas de administrador, fazemos login automaticamente e redirecionamos para o painel
      if (role === 'admin') {
        await signIn(email, password);
      } else {
        // Redirecionar para a página de login da loja
        navigate("/store/login", { replace: true });
      }
    } catch (error: any) {
      toast.error(error.message || "Erro ao criar usuário");
      throw error;
    }
  };

  const resetPassword = async (email: string) => {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: window.location.origin + "/store/reset-password",
      });
      
      if (error) {
        throw error;
      }
      
      return { success: true };
    } catch (error: any) {
      console.error("Erro ao enviar email de recuperação:", error);
      return { success: false, error: error.message };
    }
  };

  const updatePassword = async (newPassword: string) => {
    try {
      const { error } = await supabase.auth.updateUser({
        password: newPassword,
      });
      
      if (error) {
        throw error;
      }
      
      return { success: true };
    } catch (error: any) {
      console.error("Erro ao atualizar senha:", error);
      return { success: false, error: error.message };
    }
  };

  const signOut = async () => {
    try {
      await supabase.auth.signOut();
      // Redirecionar para a página de login apropriada
      if (userRole === 'admin') {
        navigate("/login", { replace: true });
      } else {
        navigate("/store/login", { replace: true });
      }
      toast.success("Logout realizado com sucesso!");
    } catch (error: any) {
      toast.error(error.message || "Erro ao fazer logout");
    }
  };

  return {
    session,
    user,
    loading,
    userRole,
    signIn,
    signUp,
    resetPassword,
    updatePassword,
    signOut
  };
}
