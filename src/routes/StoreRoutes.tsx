
import { Route } from "react-router-dom";
import { StoreLayout } from "@/components/Layout/StoreLayout";

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
import OffersPage from "@/pages/Store/OffersPage";
import CategoriesPage from "@/pages/Store/CategoriesPage";

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
      path="/store/categorias"
      element={
        <StoreLayout>
          <CategoriesPage />
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
          <OffersPage />
        </StoreLayout>
      }
    />
  </>
);
