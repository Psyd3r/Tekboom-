
import { useAuth } from "@/context/AuthContext";
import { StoreHeader } from "./StoreHeader";
import { StoreFooter } from "./StoreFooter";
import { useEffect } from "react";
import { useNavigate, useLocation, Outlet } from "react-router-dom";

interface StoreLayoutProps {
  children?: React.ReactNode; // Made children optional since we're using Outlet
  requireAuth?: boolean;
}

export const StoreLayout = ({ requireAuth = false }: StoreLayoutProps) => {
  const { user, loading, userRole } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  
  useEffect(() => {
    // Se não está carregando, podemos verificar o usuário e papel
    if (!loading) {
      console.log("StoreLayout - Usuário:", user?.id, "Papel:", userRole);
      
      // Redirecionar usuários não autenticados para login se a página requer autenticação
      if (!user && requireAuth) {
        console.log("Redirecionando usuário não autenticado para login");
        navigate('/store/login', { state: { from: location.pathname } });
        return;
      }
    }
  }, [user, loading, userRole, requireAuth, navigate, location]);
  
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F5F9FF]">
        <div className="text-[#1E88E5]">Carregando...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#F5F9FF]">
      <StoreHeader />
      <main className="flex-1">
        <div className="container mx-auto py-6 px-4 animate-fade-in">
          <Outlet />
        </div>
      </main>
      <StoreFooter />
    </div>
  );
};
