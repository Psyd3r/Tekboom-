
import { Navigate, Route } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { MainLayout } from "@/components/Layout/MainLayout";

// Admin Pages
import Products from "@/pages/Products";
import Orders from "@/pages/Orders";
import NewOrder from "@/pages/NewOrder";
import Customers from "@/pages/Customers";
import Settings from "@/pages/Settings";
import Users from "@/pages/Users";
import NewProduct from "@/pages/NewProduct";
import EditProduct from "@/pages/EditProduct";
import StockManagement from "@/pages/StockManagement";

// Protected route component for admin users
export const AdminRoute = ({ children }: { children: JSX.Element }) => {
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

export const AdminRoutes = () => {
  return (
    <>
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
        path="/estoque"
        element={
          <AdminRoute>
            <MainLayout>
              <StockManagement />
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
    </>
  );
};
