
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "@/components/ui/sonner";
import { Lock, AlertCircle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { supabase } from "@/integrations/supabase/client";
import { StoreLogoHeader } from "@/components/Store/Auth/StoreLogoHeader";

const ResetPasswordPage = () => {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  
  // Check for hash params from the password reset link
  useEffect(() => {
    const hash = window.location.hash;
    if (!hash || !hash.includes('type=recovery')) {
      setError("Link de recuperação inválido ou expirado. Por favor, solicite um novo link de redefinição de senha.");
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    
    // Validate passwords
    if (password !== confirmPassword) {
      setError("As senhas não coincidem.");
      return;
    }
    
    if (password.length < 6) {
      setError("A senha deve ter pelo menos 6 caracteres.");
      return;
    }
    
    setIsLoading(true);
    
    try {
      const { error } = await supabase.auth.updateUser({
        password: password
      });
      
      if (error) {
        throw error;
      }
      
      toast.success("Senha atualizada com sucesso!");
      
      // Redirect to login after a short delay
      setTimeout(() => {
        navigate("/store/login");
      }, 1500);
    } catch (error: any) {
      setError(error.message || "Erro ao atualizar senha. Tente novamente.");
      console.error("Erro ao atualizar senha:", error);
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
      <StoreLogoHeader />
      
      <div className="mt-6">
        <h2 className="text-2xl font-bold text-center mb-2">Definir nova senha</h2>
        <p className="text-center text-gray-600 mb-6">
          Por favor, digite e confirme sua nova senha.
        </p>
        
        {error && (
          <Alert variant="destructive" className="mb-4">
            <AlertCircle className="h-4 w-4 mr-2" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="password" className="flex items-center gap-2 text-sm font-medium text-gray-700">
              <Lock className="h-4 w-4 text-gray-500" />
              Nova senha
            </label>
            <div className="relative">
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                minLength={6}
                className="w-full"
                disabled={!!error && !error.includes("As senhas não coincidem")}
              />
            </div>
            <p className="text-xs text-gray-500">Mínimo 6 caracteres</p>
          </div>
          
          <div className="space-y-2">
            <label htmlFor="confirmPassword" className="flex items-center gap-2 text-sm font-medium text-gray-700">
              <Lock className="h-4 w-4 text-gray-500" />
              Confirme a senha
            </label>
            <div className="relative">
              <Input
                id="confirmPassword"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="••••••••"
                required
                minLength={6}
                className="w-full"
                disabled={!!error && !error.includes("As senhas não coincidem")}
              />
            </div>
          </div>
          
          <Button 
            type="submit" 
            className="w-full" 
            disabled={isLoading || (!!error && !error.includes("As senhas não coincidem"))}
          >
            {isLoading ? "Atualizando..." : "Atualizar senha"}
          </Button>
        </form>
      </div>
    </motion.div>
  );
};

export default ResetPasswordPage;
