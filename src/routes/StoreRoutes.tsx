
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

export const StoreRoutes = () => {
  return (
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
    </>
  );
};
