
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
import NewOrder from "./pages/NewOrder";
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

// Protected route component for admin users
const AdminRoute = ({ children }: { children: JSX.Element }) => {
  const { user, loading, userRole } = useAuth();
  
  if (loading) {
    return <div className="flex h-screen w-full items-center justify-center">Carregando...</div>;
  }
  
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (userRole !== 'admin') {
    return <Navigate to="/store" replace />;
  }
  
  return children;
};

// Protected route component for any authenticated user
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
          <AdminRoute>
            <MainLayout>
              <Products />
            </MainLayout>
          </AdminRoute>
        }
      />
      <Route
        path="/produtos"
        element={
          <AdminRoute>
            <MainLayout>
              <Products />
            </MainLayout>
          </AdminRoute>
        }
      />
      <Route
        path="/produtos/novo"
        element={
          <AdminRoute>
            <MainLayout>
              <NewProduct />
            </MainLayout>
          </AdminRoute>
        }
      />
      <Route
        path="/produtos/:id/editar"
        element={
          <AdminRoute>
            <MainLayout>
              <EditProduct />
            </MainLayout>
          </AdminRoute>
        }
      />
      <Route
        path="/pedidos"
        element={
          <AdminRoute>
            <MainLayout>
              <Orders />
            </MainLayout>
          </AdminRoute>
        }
      />
      <Route
        path="/pedidos/novo"
        element={
          <AdminRoute>
            <MainLayout>
              <NewOrder />
            </MainLayout>
          </AdminRoute>
        }
      />
      <Route
        path="/clientes"
        element={
          <AdminRoute>
            <MainLayout>
              <Customers />
            </MainLayout>
          </AdminRoute>
        }
      />
      <Route
        path="/configuracoes"
        element={
          <AdminRoute>
            <MainLayout>
              <Settings />
            </MainLayout>
          </AdminRoute>
        }
      />
      <Route
        path="/usuarios"
        element={
          <AdminRoute>
            <MainLayout>
              <Users />
            </MainLayout>
          </AdminRoute>
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
