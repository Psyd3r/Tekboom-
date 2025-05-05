
import { Route } from "react-router-dom";
import { StoreLayout } from "@/components/Layout/StoreLayout";
import { ProtectedRoute } from "./ProtectedRoute";

// Store Pages
import HomePage from "@/pages/Store/HomePage";
import LoginPage from "@/pages/Store/LoginPage";
import ProductPage from "@/pages/Store/ProductPage";
import ProductListPage from "@/pages/Store/ProductListPage";
import CartPage from "@/pages/Store/CartPage";
import CheckoutPage from "@/pages/Store/CheckoutPage";
import CustomerProfilePage from "@/pages/Store/CustomerProfilePage";
import FavoritesPage from "@/pages/Store/FavoritesPage";
import OrderHistoryPage from "@/pages/Store/OrderHistoryPage";
import BuildPcPage from "@/pages/Store/BuildPcPage";

export const storeRoutes = (
  <>
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
    <Route
      path="/store/categoria/:id"
      element={
        <StoreLayout>
          <ProductListPage />
        </StoreLayout>
      }
    />
    <Route
      path="/store/carrinho"
      element={
        <StoreLayout>
          <CartPage />
        </StoreLayout>
      }
    />
    <Route
      path="/store/checkout"
      element={
        <StoreLayout requireAuth={true}>
          <CheckoutPage />
        </StoreLayout>
      }
    />
    <Route
      path="/store/minha-conta"
      element={
        <StoreLayout requireAuth={true}>
          <CustomerProfilePage />
        </StoreLayout>
      }
    />
    <Route
      path="/store/favoritos"
      element={
        <StoreLayout requireAuth={true}>
          <FavoritesPage />
        </StoreLayout>
      }
    />
    <Route
      path="/store/historico"
      element={
        <StoreLayout requireAuth={true}>
          <OrderHistoryPage />
        </StoreLayout>
      }
    />
    <Route
      path="/store/monteseupc"
      element={
        <StoreLayout>
          <BuildPcPage />
        </StoreLayout>
      }
    />
    <Route
      path="/store/ofertas"
      element={
        <StoreLayout>
          <div className="p-8 text-center">
            <h1 className="text-2xl font-bold mb-4">Ofertas do Dia</h1>
            <p>Página em desenvolvimento</p>
          </div>
        </StoreLayout>
      }
    />
  </>
);
