
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/context/AuthContext";
import { CartProvider } from "@/context/CartContext";
import { adminRoutes } from "./routes/AdminRoutes";
import { storeRoutes } from "./routes/StoreRoutes";
import { authRoutes } from "./routes/AuthRoutes";
import { errorRoutes } from "./routes/ErrorRoutes";

const queryClient = new QueryClient();

// Routes configuration with Auth provider
const AppRoutes = () => {
  return (
    <Routes>
      {/* Authentication Routes */}
      {authRoutes}
      
      {/* Admin Routes */}
      {adminRoutes}
      
      {/* Store Front Routes */}
      {storeRoutes}
      
      {/* 404 Route */}
      {errorRoutes}
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
