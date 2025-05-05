
import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Mail, Lock } from "lucide-react";
import { Link } from "react-router-dom";
import { toast } from "@/components/ui/sonner";

export const LoginForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { signIn } = useAuth();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await signIn(email, password);
    } catch (error) {
      console.error("Erro ao fazer login:", error);
      toast.error("Falha ao fazer login. Por favor, verifique suas credenciais.");
    } finally {
      setIsLoading(false);
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
    </form>
  );
};
