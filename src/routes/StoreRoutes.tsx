
import { Route } from "react-router-dom";
import { StoreLayout } from "@/components/Layout/StoreLayout";
import HomePage from "@/pages/Store/HomePage";
import ProductListPage from "@/pages/Store/ProductListPage";
import ProductPage from "@/pages/Store/ProductPage";
import CategoriesPage from "@/pages/Store/CategoriesPage";
import OffersPage from "@/pages/Store/OffersPage";
import BuildPcPage from "@/pages/Store/BuildPcPage";
import CartPage from "@/pages/Store/CartPage";
import CheckoutPage from "@/pages/Store/CheckoutPage";
import FavoritesPage from "@/pages/Store/FavoritesPage";
import CustomerProfilePage from "@/pages/Store/CustomerProfilePage";
import OrderHistoryPage from "@/pages/Store/OrderHistoryPage";
import LoginPage from "@/pages/Store/LoginPage";
import ForgotPasswordPage from "@/pages/Store/ForgotPasswordPage";
import ResetPasswordPage from "@/pages/Store/ResetPasswordPage";
import HelpCenterPage from "@/pages/Store/HelpCenterPage";

export const storeRoutes = (
  <>
    {/* Public store routes */}
    <Route path="/store" element={<StoreLayout children={null} />}>
      <Route index element={<HomePage />} />
      <Route path="produtos" element={<ProductListPage />} />
      <Route path="produto/:id" element={<ProductPage />} />
      <Route path="categorias" element={<CategoriesPage />} />
      <Route path="categoria/:id" element={<ProductListPage />} />
      <Route path="ofertas" element={<OffersPage />} />
      <Route path="monte-seu-pc" element={<BuildPcPage />} />
      <Route path="carrinho" element={<CartPage />} />
      <Route path="ajuda" element={<HelpCenterPage />} />
    </Route>
    
    {/* Auth routes */}
    <Route path="/store/login" element={<LoginPage />} />
    <Route path="/store/esqueci-senha" element={<ForgotPasswordPage />} />
    <Route path="/store/reset-password" element={<ResetPasswordPage />} />
    
    {/* Protected store routes */}
    <Route path="/store" element={<StoreLayout requireAuth children={null} />}>
      <Route path="checkout" element={<CheckoutPage />} />
      <Route path="favoritos" element={<FavoritesPage />} />
      <Route path="perfil" element={<CustomerProfilePage />} />
      <Route path="pedidos" element={<OrderHistoryPage />} />
    </Route>
  </>
);
