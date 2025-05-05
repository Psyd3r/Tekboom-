
import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Mail, Lock, ShieldAlert } from "lucide-react";
import { Link } from "react-router-dom";
import { toast } from "@/components/ui/sonner";

export const LoginForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isCreatingAdmin, setIsCreatingAdmin] = useState(false);
  const { signIn, signUp } = useAuth();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await signIn(email, password);
      // O redirecionamento é feito dentro da função signIn com base no papel do usuário
    } catch (error) {
      console.error("Erro ao fazer login:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateAdmin = async () => {
    if (!email || !password) {
      toast.error("Preencha email e senha para criar o administrador");
      return;
    }

    setIsCreatingAdmin(true);
    try {
      // O signUp com papel 'admin' fará login automaticamente e redirecionará para o painel administrativo
      await signUp(email, password, email.split('@')[0], 'admin');
    } catch (error) {
      console.error("Erro ao criar conta de administrador:", error);
    } finally {
      setIsCreatingAdmin(false);
    }
  };

  return (
    <form onSubmit={handleLogin} className="space-y-4">
      <div className="space-y-2">
        <label htmlFor="email" className="flex items-center gap-2 text-sm font-medium text-gray-700">
          <Mail className="h-4 w-4 text-gray-500" />
          Email
        </label>
        <div className="relative">
          <Input
            id="email"
            type="email"
            placeholder="seu@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
      </div>
      
      <div className="space-y-2">
        <div className="flex justify-between">
          <label htmlFor="password" className="flex items-center gap-2 text-sm font-medium text-gray-700">
            <Lock className="h-4 w-4 text-gray-500" />
            Senha
          </label>
          <Link to="/store/esqueci-senha" className="text-sm text-primary hover:underline">
            Esqueceu a senha?
          </Link>
        </div>
        <div className="relative">
          <Input
            id="password"
            type="password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
      </div>
      
      <Button type="submit" className="w-full" disabled={isLoading}>
        {isLoading ? "Entrando..." : "Entrar como Cliente"}
      </Button>
      
      <div className="mt-2 pt-2 border-t border-gray-100">
        <Button 
          type="button" 
          variant="outline" 
          className="w-full mt-2 border-dashed border-gray-300 flex items-center gap-2"
          onClick={handleCreateAdmin}
          disabled={isCreatingAdmin}
        >
          <ShieldAlert className="h-4 w-4 text-amber-600" />
          {isCreatingAdmin ? "Criando administrador..." : "Criar Conta Administrativa"}
        </Button>
        <p className="text-xs text-center text-gray-500 mt-2">
          Use esta opção apenas para criar um usuário administrador inicial
        </p>
      </div>
    </form>
  );
};
