
import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Shield, Store, Mail, Lock } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { toast } from "@/components/ui/sonner";
import { Alert, AlertDescription } from "@/components/ui/alert";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { signIn, user, userRole } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      if (userRole === 'admin') {
        navigate("/produtos");
      } else {
        navigate("/store");
      }
    }
  }, [user, userRole, navigate]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await signIn(email, password);
    } catch (error) {
      console.error("Login error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#F5F9FF] p-4">
      <Card className="w-full max-w-md shadow-lg border border-[#ECEFF1]">
        <CardHeader className="space-y-1 text-center">
          <div className="flex justify-center mb-4">
            <Shield className="h-10 w-10 text-[#1E88E5]" />
          </div>
          <CardTitle className="text-2xl">Painel Administrativo</CardTitle>
          <CardDescription className="text-[#546E7A]">
            Acesso unificado - Entre com suas credenciais
          </CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-4">
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="email" className="text-sm font-medium text-[#263238] flex items-center gap-2">
                <Mail className="h-4 w-4 text-[#546E7A]" />
                Email
              </label>
              <Input
                id="email"
                type="email"
                placeholder="seu@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="border-[#ECEFF1] focus-visible:ring-[#1E88E5]"
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="password" className="text-sm font-medium text-[#263238] flex items-center gap-2">
                <Lock className="h-4 w-4 text-[#546E7A]" />
                Senha
              </label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="border-[#ECEFF1] focus-visible:ring-[#1E88E5]"
              />
            </div>
            
            <Button
              type="submit"
              className="w-full bg-[#1E88E5] hover:bg-[#1976D2]"
              disabled={isLoading}
            >
              {isLoading ? "Entrando..." : "Entrar no Sistema"}
            </Button>
          </form>
          
          <Alert className="bg-blue-50 border border-blue-100">
            <AlertDescription className="text-sm text-blue-700">
              Para obter acesso administrativo, entre em contato com o departamento de usuários.
            </AlertDescription>
          </Alert>
        </CardContent>
        
        <div className="px-6 py-4 bg-gray-50 text-sm text-gray-600 rounded-b-lg flex justify-center">
          <div className="flex items-center gap-2">
            <Store className="h-4 w-4 text-gray-500" />
            <span>Para acesso à loja, use <a href="/store/login" className="text-[#1E88E5] hover:underline">login de cliente</a></span>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default Login;
