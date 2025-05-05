
import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Mail, Lock, User } from "lucide-react";
import { toast } from "@/components/ui/sonner";

export const RegisterForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [name, setName] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { signUp } = useAuth();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (password !== confirmPassword) {
      toast.error("As senhas não coincidem.");
      return;
    }
    
    setIsLoading(true);

    try {
      await signUp(email, password, name, 'customer');
      toast.success("Conta de cliente criada com sucesso!");
    } catch (error) {
      console.error("Erro ao criar conta:", error);
      toast.error("Falha ao criar conta. Por favor, tente novamente.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleRegister} className="space-y-4">
      <div className="space-y-2">
        <label htmlFor="name" className="flex items-center gap-2 text-sm font-medium text-gray-700">
          <User className="h-4 w-4 text-gray-500" />
          Nome Completo
        </label>
        <Input
          id="name"
          type="text"
          placeholder="Seu nome"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
      </div>
      
      <div className="space-y-2">
        <label htmlFor="register-email" className="flex items-center gap-2 text-sm font-medium text-gray-700">
          <Mail className="h-4 w-4 text-gray-500" />
          Email
        </label>
        <Input
          id="register-email"
          type="email"
          placeholder="seu@email.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
      </div>
      
      <div className="space-y-2">
        <label htmlFor="register-password" className="flex items-center gap-2 text-sm font-medium text-gray-700">
          <Lock className="h-4 w-4 text-gray-500" />
          Senha
        </label>
        <Input
          id="register-password"
          type="password"
          placeholder="••••••••"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
      </div>
      
      <div className="space-y-2">
        <label htmlFor="confirm-password" className="flex items-center gap-2 text-sm font-medium text-gray-700">
          <Lock className="h-4 w-4 text-gray-500" />
          Confirmar Senha
        </label>
        <Input
          id="confirm-password"
          type="password"
          placeholder="••••••••"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
        />
      </div>
      
      <Button type="submit" className="w-full" disabled={isLoading}>
        {isLoading ? "Criando conta..." : "Criar Conta de Cliente"}
      </Button>
    </form>
  );
};
