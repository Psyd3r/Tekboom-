
import { useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "@/components/ui/sonner";
import { Mail, ArrowLeft } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { StoreLogoHeader } from "@/components/Store/Auth/StoreLogoHeader";

const ForgotPasswordPage = () => {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: window.location.origin + "/store/reset-password",
      });

      if (error) {
        throw error;
      }

      setIsSubmitted(true);
      toast.success("Email de recuperação enviado com sucesso!");
    } catch (error: any) {
      toast.error(error.message || "Erro ao enviar o email de recuperação");
      console.error("Erro ao recuperar senha:", error);
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
        <Link 
          to="/store/login" 
          className="flex items-center text-sm text-primary hover:underline mb-6"
        >
          <ArrowLeft className="h-4 w-4 mr-1" />
          Voltar para o login
        </Link>

        <h2 className="text-2xl font-bold text-center mb-2">Recuperar senha</h2>
        <p className="text-center text-gray-600 mb-6">
          Digite seu email para receber instruções de recuperação de senha.
        </p>

        {isSubmitted ? (
          <div className="text-center space-y-4">
            <div className="bg-green-50 p-4 rounded-md border border-green-100 mb-4">
              <p className="text-green-800">
                Um email com instruções para redefinir sua senha foi enviado para{" "}
                <span className="font-semibold">{email}</span>.
              </p>
            </div>
            <p className="text-gray-600">
              Verifique sua caixa de entrada e siga as instruções no email.
            </p>
            <p className="text-gray-600">
              Não recebeu o email? Verifique sua pasta de spam ou
              <button
                onClick={() => setIsSubmitted(false)}
                className="text-primary hover:underline ml-1"
              >
                tente novamente
              </button>
              .
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="email" className="flex items-center gap-2 text-sm font-medium text-gray-700">
                <Mail className="h-4 w-4 text-gray-500" />
                Seu email
              </label>
              <div className="relative">
                <Input
                  id="email"
                  type="email"
                  placeholder="seu@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full"
                />
              </div>
            </div>

            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? "Enviando..." : "Enviar instruções"}
            </Button>
          </form>
        )}
      </div>
    </motion.div>
  );
};

export default ForgotPasswordPage;
