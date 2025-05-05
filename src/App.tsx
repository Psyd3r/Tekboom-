
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { MainLayout } from "./components/Layout/MainLayout";
import { StoreLayout } from "./components/Layout/StoreLayout";
import { AuthProvider, useAuth } from "@/context/AuthContext";
import Products from "./pages/Products";
import Orders from "./pages/Orders";
import Customers from "./pages/Customers";
import Settings from "./pages/Settings";
import Users from "./pages/Users";
import Login from "./pages/Login";
import NotFound from "./pages/NotFound";
import NewProduct from "./pages/NewProduct";
import EditProduct from "./pages/EditProduct";

// Store Pages
import HomePage from "./pages/Store/HomePage";
import LoginPage from "./pages/Store/LoginPage";
import ProductPage from "./pages/Store/ProductPage";
import ProductListPage from "./pages/Store/ProductListPage";

const queryClient = new QueryClient();

// Protected route component
const ProtectedRoute = ({ children }: { children: JSX.Element }) => {
  const { user, loading } = useAuth();
  
  if (loading) {
    return <div className="flex h-screen w-full items-center justify-center">Carregando...</div>;
  }
  
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  
  return children;
};

// Routes configuration with Auth provider
const AppRoutes = () => {
  return (
    <Routes>
      {/* Admin Routes */}
      <Route path="/login" element={<Login />} />
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <MainLayout>
              <Products />
            </MainLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/produtos"
        element={
          <ProtectedRoute>
            <MainLayout>
              <Products />
            </MainLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/produtos/novo"
        element={
          <ProtectedRoute>
            <MainLayout>
              <NewProduct />
            </MainLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/produtos/:id/editar"
        element={
          <ProtectedRoute>
            <MainLayout>
              <EditProduct />
            </MainLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/pedidos"
        element={
          <ProtectedRoute>
            <MainLayout>
              <Orders />
            </MainLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/clientes"
        element={
          <ProtectedRoute>
            <MainLayout>
              <Customers />
            </MainLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/configuracoes"
        element={
          <ProtectedRoute>
            <MainLayout>
              <Settings />
            </MainLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/usuarios"
        element={
          <ProtectedRoute>
            <MainLayout>
              <Users />
            </MainLayout>
          </ProtectedRoute>
        }
      />

      {/* Store Front (Customer) Routes */}
      <Route
        path="/store"
        element={
          <StoreLayout>
            <HomePage />
          </StoreLayout>
        }
      />
      <Route
        path="/store/login"
        element={
          <StoreLayout>
            <LoginPage />
          </StoreLayout>
        }
      />
      <Route
        path="/store/produtos"
        element={
          <StoreLayout>
            <ProductListPage />
          </StoreLayout>
        }
      />
      <Route
        path="/store/produto/:id"
        element={
          <StoreLayout>
            <ProductPage />
          </StoreLayout>
        }
      />

      {/* 404 Route */}
      <Route path="*" element={<NotFound />} />
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
          <AppRoutes />
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
