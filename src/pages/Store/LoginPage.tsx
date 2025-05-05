
import { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Store, Mail, Lock, User, ShoppingBag } from "lucide-react";
import { toast } from "@/components/ui/sonner";
import { motion } from "framer-motion";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [name, setName] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { signIn, signUp } = useAuth();

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
    <motion.div 
      className="max-w-md mx-auto my-12 p-6 bg-white rounded-lg shadow-md border border-gray-100"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="flex justify-center mb-6">
        <div className="flex items-center gap-2">
          <Store className="h-7 w-7 text-primary" />
          <span className="font-bold text-xl">Teekbom</span>
        </div>
      </div>
      
      <div className="p-3 bg-blue-50 rounded-md text-blue-700 mb-4 flex items-center gap-2">
        <ShoppingBag className="h-5 w-5 flex-shrink-0" />
        <p className="text-sm">Área do Cliente - Acesse para comprar</p>
      </div>
      
      <Tabs defaultValue="login" className="w-full">
        <TabsList className="grid grid-cols-2 w-full mb-6">
          <TabsTrigger value="login">Entrar</TabsTrigger>
          <TabsTrigger value="register">Criar Conta</TabsTrigger>
        </TabsList>
        
        <TabsContent value="login" className="mt-0">
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
        </TabsContent>
        
        <TabsContent value="register" className="mt-0">
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
        </TabsContent>
      </Tabs>
      
      <div className="mt-6 pt-4 border-t border-gray-100 text-center text-sm text-gray-600">
        <div className="flex justify-center items-center gap-2">
          <Shield className="h-4 w-4 text-gray-500" />
          <span>Para acesso administrativo, use o <a href="/login" className="text-primary hover:underline">login de administrador</a></span>
        </div>
      </div>
    </motion.div>
  );
};

export default LoginPage;
