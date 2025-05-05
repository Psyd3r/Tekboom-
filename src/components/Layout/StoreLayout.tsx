
import { useAuth } from "@/context/AuthContext";
import { StoreHeader } from "./StoreHeader";
import { StoreFooter } from "./StoreFooter";
import { cn } from "@/lib/utils";
import { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";

interface StoreLayoutProps {
  children: React.ReactNode;
  requireAuth?: boolean;
}

export const StoreLayout = ({ children, requireAuth = false }: StoreLayoutProps) => {
  const { user, loading, userRole } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  
  useEffect(() => {
    // Redirect admin users to the admin panel when they access store pages
    if (!loading && user && userRole === 'admin' && location.pathname.startsWith('/store')) {
      navigate('/produtos', { replace: true });
      return;
    }
    
    // Redirect unauthenticated users to login if the page requires authentication
    if (!loading && !user && requireAuth) {
      navigate('/store/login', { state: { from: location.pathname } });
      return;
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
          {children}
        </div>
      </main>
      <StoreFooter />
    </div>
  );
};
