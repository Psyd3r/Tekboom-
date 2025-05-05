
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { toast } from "@/components/ui/sonner";
import { UserPlus, Trash2, Search, User, ShieldAlert, Shield, AlertCircle } from "lucide-react";
import { motion } from "framer-motion";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

type Profile = {
  id: string;
  email: string;
  full_name: string | null;
  created_at: string;
};

const Users = () => {
  const { user: currentUser } = useAuth();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
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
      // Usando o tipo any para evitar erros de tipagem
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

  return (
    <motion.div 
      className="space-y-6"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Usuários Administrativos</h1>
          <p className="text-gray-500 mt-1">Gerencie o acesso de usuários ao sistema</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <UserPlus className="mr-2 h-4 w-4" />
              Novo Usuário
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Criar Novo Usuário</DialogTitle>
              <DialogDescription>
                Adicione um novo usuário administrativo para acessar o sistema.
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleCreateUser} className="space-y-4 py-4">
              <div className="space-y-2">
                <label htmlFor="fullName" className="text-sm font-medium">Nome Completo</label>
                <Input
                  id="fullName"
                  value={newUserData.fullName}
                  onChange={(e) => setNewUserData({ ...newUserData, fullName: e.target.value })}
                  placeholder="Nome Completo"
                  required
                  className="w-full"
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="email" className="text-sm font-medium">Email</label>
                <Input
                  id="email"
                  type="email"
                  value={newUserData.email}
                  onChange={(e) => setNewUserData({ ...newUserData, email: e.target.value })}
                  placeholder="email@exemplo.com"
                  required
                  className="w-full"
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="password" className="text-sm font-medium">Senha</label>
                <Input
                  id="password"
                  type="password"
                  value={newUserData.password}
                  onChange={(e) => setNewUserData({ ...newUserData, password: e.target.value })}
                  placeholder="••••••••"
                  minLength={6}
                  required
                  className="w-full"
                />
                <p className="text-xs text-gray-500">A senha deve ter pelo menos 6 caracteres</p>
              </div>
              <DialogFooter className="mt-6">
                <Button type="submit" className="w-full">Criar Usuário</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader className="bg-gray-50 border-b">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <CardTitle className="flex items-center">
                <ShieldAlert className="mr-2 h-5 w-5 text-[#FF5722]" />
                Gerenciamento de Usuários
              </CardTitle>
              <CardDescription>
                Usuários com acesso administrativo ao sistema
              </CardDescription>
            </div>
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
              <Input
                type="search"
                placeholder="Buscar usuário"
                className="pl-9 w-full sm:w-[250px]"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          {isLoading ? (
            <div className="flex justify-center items-center p-8">
              <div className="animate-pulse text-gray-500">Carregando usuários...</div>
            </div>
          ) : error ? (
            <div className="flex justify-center items-center p-8">
              <div className="text-red-500 flex items-center">
                <AlertCircle className="mr-2 h-5 w-5" />
                Erro ao carregar usuários
              </div>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nome</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Data de Criação</TableHead>
                    <TableHead className="w-24">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredUsers.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={4} className="h-32 text-center">
                        <div className="flex flex-col items-center justify-center p-4">
                          <User className="h-8 w-8 text-gray-400 mb-2" />
                          {searchTerm ? (
                            <p className="text-gray-500">Nenhum usuário encontrado para "{searchTerm}"</p>
                          ) : (
                            <p className="text-gray-500">Nenhum usuário cadastrado ainda</p>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredUsers.map((user) => (
                      <TableRow key={user.id} className="group">
                        <TableCell>
                          <div className="flex items-center">
                            <div className="bg-gray-100 p-1 rounded-full mr-3">
                              <User className="h-5 w-5 text-gray-500" />
                            </div>
                            <div>
                              <div className="font-medium">{user.full_name || "—"}</div>
                              {user.id === currentUser?.id && (
                                <span className="text-xs bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full">Você</span>
                              )}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>{user.email}</TableCell>
                        <TableCell>
                          {formatDate(user.created_at)}
                        </TableCell>
                        <TableCell>
                          <div className="flex justify-end">
                            <Button
                              variant="outline"
                              size="icon"
                              onClick={() => handleDeleteUser(user.id)}
                              disabled={user.id === currentUser?.id}
                              className={`
                                opacity-0 group-hover:opacity-100 transition-opacity
                                ${user.id === currentUser?.id ? "cursor-not-allowed" : ""}
                              `}
                              title={user.id === currentUser?.id ? "Você não pode excluir sua própria conta" : "Excluir usuário"}
                            >
                              <Trash2 className="h-4 w-4 text-red-500" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="transition-all hover:shadow-md">
          <CardHeader className="pb-2">
            <CardDescription className="text-xs uppercase font-semibold text-gray-500">Total de Usuários</CardDescription>
            <CardTitle className="text-2xl">{users.length}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-500">Usuários com acesso ao sistema</p>
          </CardContent>
        </Card>
        
        <Card className="transition-all hover:shadow-md">
          <CardHeader className="pb-2">
            <CardDescription className="text-xs uppercase font-semibold text-gray-500">Último Usuário Adicionado</CardDescription>
            <CardTitle className="text-lg truncate">
              {users.length > 0 ? (users[0].full_name || users[0].email) : "Nenhum usuário"}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-500">
              {users.length > 0 ? `Adicionado em ${formatDate(users[0].created_at)}` : "Adicione seu primeiro usuário"}
            </p>
          </CardContent>
        </Card>

        <Card className="transition-all hover:shadow-md bg-gray-50">
          <CardHeader className="pb-2">
            <CardDescription className="text-xs uppercase font-semibold text-gray-500">Segurança</CardDescription>
            <CardTitle className="text-lg flex items-center">
              <Shield className="h-5 w-5 mr-2 text-green-500" />
              Controle de Acesso
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-500">
              Gerencie permissões e acesso ao sistema
            </p>
          </CardContent>
        </Card>
      </div>
    </motion.div>
  );
};

export default Users;
