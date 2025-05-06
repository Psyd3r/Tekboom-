import { Link } from "react-router-dom";
import { ShoppingBag, Settings, Heart, User, Menu, ChevronDown, Computer } from "lucide-react";
import { Button } from "@/components/ui/button";
import { UserAccountNav } from "@/components/Store/UserAccountNav";
import { useAuth } from "@/context/AuthContext";
import { useFavorites } from "@/context/FavoritesContext";
import { useCart } from "@/context/CartContext";
import { useState, useEffect } from "react";
import { Badge } from "@/components/ui/badge";
import { StoreLogoHeader } from "@/components/Store/Auth/StoreLogoHeader";
import { SearchBar } from "@/components/Store/SearchBar";
import { useFetchCategories } from "@/hooks/category/useFetchCategories";
import { CategoryDropdown } from "@/components/Store/CategoryDropdown";

export function StoreHeader() {
  const { userRole, user } = useAuth();
  const { favorites } = useFavorites();
  const { cart } = useCart();
  const isAdmin = userRole === 'admin';
  const isLoggedIn = !!user;
  
  const [showCategoriesMenu, setShowCategoriesMenu] = useState(false);
  const { data: categories = [], isLoading: categoriesLoading } = useFetchCategories();
  const [showCartBadge, setShowCartBadge] = useState(false);
  
  // Show cart badge with animation when cart items change
  useEffect(() => {
    if (cart.count > 0) {
      setShowCartBadge(true);
    }
  }, [cart.count]);

  // Filter out categories with no products
  const activeCategories = categories.filter(cat => cat.productCount && cat.productCount > 0);

  return (
    <header className="bg-white shadow-sm sticky top-0 z-40">
      {/* Top bar with secondary links */}
      <div className="bg-[#0D47A1] text-white py-1">
        <div className="container flex justify-end text-xs">
          <div className="flex items-center space-x-4">
            <Link to="/store/ofertas" className="hover:underline">Ofertas do dia</Link>
            <Link to="/store/historico" className="hover:underline">Histórico de pedidos</Link>
            <Link to="/store/ajuda" className="hover:underline">Central de ajuda</Link>
            {isAdmin && (
              <Link to="/produtos" className="hover:underline flex items-center">
                <Settings className="h-3 w-3 mr-1" />
                Painel Admin
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* Main header */}
      <div className="container py-4">
        <div className="flex items-center justify-between gap-4">
          {/* Logo using StoreLogoHeader component */}
          <Link to="/store" className="flex items-center">
            <StoreLogoHeader />
          </Link>

          {/* Search bar */}
          <div className="flex-1 max-w-2xl hidden md:block">
            <SearchBar />
          </div>

          {/* Account / Cart */}
          <div className="flex items-center gap-4">
            <div className="hidden md:flex items-center gap-4">
              <Link to="/store/favoritos" className="flex flex-col items-center text-gray-700 hover:text-[#1E88E5] relative">
                <Heart className="h-5 w-5" />
                <span className="text-xs">Favoritos</span>
                {favorites.length > 0 && (
                  <Badge className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center p-0 bg-[#E53935]">
                    {favorites.length}
                  </Badge>
                )}
              </Link>
              
              {isLoggedIn ? (
                <div className="flex flex-col items-center">
                  <UserAccountNav />
                </div>
              ) : (
                <Link to="/store/login" className="flex flex-col items-center text-gray-700 hover:text-[#1E88E5]">
                  <User className="h-5 w-5" />
                  <span className="text-xs">Entrar</span>
                </Link>
              )}
            </div>
            
            <Link to="/store/carrinho" className="flex flex-col items-center text-gray-700 hover:text-[#1E88E5] relative">
              <ShoppingBag className="h-5 w-5" />
              <span className="text-xs">Carrinho</span>
              
              {showCartBadge && cart.count > 0 && (
                <Badge className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center p-0 bg-[#E53935]">
                  {cart.count}
                </Badge>
              )}
            </Link>
          </div>
        </div>
      </div>

      {/* Mobile search bar */}
      <div className="md:hidden px-4 pb-2">
        <SearchBar className="w-full" />
      </div>

      {/* Categories bar */}
      <div className="bg-[#ECEFF1] border-y border-gray-200">
        <div className="container">
          <div className="flex items-center">
            {/* Categories dropdown */}
            <div className="relative">
              <Button
                variant="ghost"
                className="flex items-center py-3 px-4 text-gray-800 hover:bg-[#1E88E5] hover:text-white"
                onClick={() => setShowCategoriesMenu(!showCategoriesMenu)}
              >
                <Menu className="h-5 w-5 mr-2" />
                Categorias
                <ChevronDown className="h-4 w-4 ml-1" />
              </Button>
              
              {/* Dropdown menu with categories */}
              {showCategoriesMenu && (
                <div className="absolute left-0 top-full w-64 bg-white border border-gray-200 shadow-lg rounded-b-md z-50">
                  <CategoryDropdown 
                    categories={categories} 
                    isLoading={categoriesLoading} 
                    onItemClick={() => setShowCategoriesMenu(false)}
                  />
                </div>
              )}
            </div>
            
            {/* Navigation links */}
            <nav className="hidden md:flex">
              <Link to="/store/produtos" className="py-3 px-4 text-gray-800 hover:bg-[#1E88E5] hover:text-white">
                Produtos
              </Link>
              <Link to="/store/monteseupc" className="py-3 px-4 text-gray-800 flex items-center gap-1 font-medium bg-blue-100 hover:bg-[#1E88E5] hover:text-white">
                <Computer className="h-4 w-4" />
                Monte seu PC
              </Link>
            </nav>
          </div>
        </div>
      </div>
    </header>
  );
}
