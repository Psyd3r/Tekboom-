
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes } from "react-router-dom";
import { AuthProvider } from "@/context/AuthContext";
import { CartProvider } from "@/context/CartContext";
import { AdminRoutes } from "./routes/AdminRoutes";
import { StoreRoutes } from "./routes/StoreRoutes";
import { AuthRoutes } from "./routes/AuthRoutes";
import { ErrorRoutes } from "./routes/ErrorRoutes";

const queryClient = new QueryClient();

// Routes configuration with Auth provider
const AppRoutes = () => {
  return (
    <Routes>
      {/* Authentication Routes */}
      <AuthRoutes />
      
      {/* Admin Routes */}
      <AdminRoutes />
      
      {/* Store Front Routes */}
      <StoreRoutes />
      
      {/* 404 Route */}
      <ErrorRoutes />
    </Routes>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <CartProvider>
            <AppRoutes />
          </CartProvider>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
