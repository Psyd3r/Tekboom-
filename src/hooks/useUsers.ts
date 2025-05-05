
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/sonner";
import { useAuth } from "@/context/AuthContext";

export type Profile = {
  id: string;
  email: string;
  full_name: string | null;
  created_at: string;
};

export function useUsers() {
  const { user: currentUser } = useAuth();
  const [searchTerm, setSearchTerm] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newUserData, setNewUserData] = useState({
    email: "",
    password: "",
    fullName: "",
  });

  const { data: users = [], refetch, isLoading, error } = useQuery({
    queryKey: ["users"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('profiles')
        .select("id, email, full_name, created_at")
        .order("created_at", { ascending: false });

      if (error) {
        toast.error("Erro ao carregar usuários");
        throw error;
      }
      
      return data as Profile[];
    },
  });

  const filteredUsers = users.filter(user => 
    user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (user.full_name && user.full_name.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const { data, error } = await supabase.auth.signUp({
        email: newUserData.email,
        password: newUserData.password,
        options: {
          data: { 
            full_name: newUserData.fullName 
          },
        }
      });

      if (error) {
        throw error;
      }

      toast.success("Usuário criado com sucesso!");
      setIsDialogOpen(false);
      setNewUserData({ email: "", password: "", fullName: "" });
      refetch();
    } catch (error: any) {
      toast.error(error.message || "Erro ao criar usuário");
    }
  };

  const handleDeleteUser = async (id: string) => {
    // Prevent deleting your own account
    if (id === currentUser?.id) {
      toast.error("Você não pode excluir sua própria conta");
      return;
    }

    try {
      const { error } = await supabase.functions.invoke('delete-user', {
        body: { user_id: id }
      });

      if (error) {
        throw error;
      }

      toast.success("Usuário excluído com sucesso");
      refetch();
    } catch (error: any) {
      toast.error(error.message || "Erro ao excluir usuário");
    }
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return new Intl.DateTimeFormat('pt-BR').format(date);
  };

  return {
    users,
    filteredUsers,
    searchTerm,
    setSearchTerm,
    isLoading,
    error,
    isDialogOpen,
    setIsDialogOpen,
    newUserData,
    setNewUserData,
    handleCreateUser,
    handleDeleteUser,
    formatDate,
    currentUser
  };
}
