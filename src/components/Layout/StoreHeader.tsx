
import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Search,
  ShoppingBag,
  User,
  Menu,
  X,
  Store,
  Heart,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/context/AuthContext";

export const StoreHeader = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { user, signOut } = useAuth();
  
  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  return (
    <header className="bg-white border-b border-gray-100 sticky top-0 z-40">
      <div className="container mx-auto px-4">
        {/* Top Bar */}
        <div className="py-2 text-xs text-center text-gray-500 border-b border-gray-100 hidden md:block">
          <span>Frete grátis para compras acima de R$100</span>
        </div>
        
        {/* Main Header */}
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/store" className="flex items-center gap-2">
            <Store className="h-7 w-7 text-primary" />
            <span className="font-bold text-xl">Teekbom</span>
          </Link>
          
          {/* Search - Desktop */}
          <div className="hidden md:block max-w-md w-full mx-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
              <Input
                type="search"
                placeholder="Buscar produtos..."
                className="w-full pl-10 border-gray-200"
              />
            </div>
          </div>
          
          {/* Nav Icons */}
          <div className="flex items-center gap-2">
            {/* Desktop navigation */}
            <div className="hidden md:flex items-center gap-1">
              <Link to="/store/favoritos">
                <Button variant="ghost" size="icon" className="relative">
                  <Heart className="h-5 w-5" />
                </Button>
              </Link>
              <Link to="/store/carrinho">
                <Button variant="ghost" size="icon" className="relative">
                  <ShoppingBag className="h-5 w-5" />
                  <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs bg-primary">
                    0
                  </Badge>
                </Button>
              </Link>
              {user ? (
                <Link to="/store/minha-conta">
                  <Button variant="ghost" size="icon">
                    <User className="h-5 w-5" />
                  </Button>
                </Link>
              ) : (
                <Link to="/store/login">
                  <Button variant="outline" size="sm">
                    Login
                  </Button>
                </Link>
              )}
            </div>
            
            {/* Mobile menu button */}
            <Button 
              variant="ghost" 
              size="icon" 
              className="md:hidden"
              onClick={toggleMobileMenu}
            >
              {mobileMenuOpen ? (
                <X className="h-5 w-5" />
              ) : (
                <Menu className="h-5 w-5" />
              )}
            </Button>
          </div>
        </div>
        
        {/* Navigation */}
        <nav className="hidden md:block py-3">
          <ul className="flex gap-6 text-sm font-medium">
            <li><Link to="/store" className="hover:text-primary transition-colors">Início</Link></li>
            <li><Link to="/store/produtos" className="hover:text-primary transition-colors">Produtos</Link></li>
            <li><Link to="/store/categorias" className="hover:text-primary transition-colors">Categorias</Link></li>
            <li><Link to="/store/ofertas" className="hover:text-primary transition-colors">Ofertas</Link></li>
            <li><Link to="/store/sobre" className="hover:text-primary transition-colors">Sobre nós</Link></li>
            <li><Link to="/store/contato" className="hover:text-primary transition-colors">Contato</Link></li>
          </ul>
        </nav>
        
        {/* Mobile search - placed below main header */}
        <div className="md:hidden py-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
            <Input
              type="search"
              placeholder="Buscar produtos..."
              className="w-full pl-10 border-gray-200"
            />
          </div>
        </div>
      </div>
      
      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-gray-100">
          <div className="container mx-auto px-4 py-4">
            <nav className="space-y-4">
              <ul className="space-y-3 border-b border-gray-100 pb-4">
                <li><Link to="/store" className="block py-1">Início</Link></li>
                <li><Link to="/store/produtos" className="block py-1">Produtos</Link></li>
                <li><Link to="/store/categorias" className="block py-1">Categorias</Link></li>
                <li><Link to="/store/ofertas" className="block py-1">Ofertas</Link></li>
                <li><Link to="/store/sobre" className="block py-1">Sobre nós</Link></li>
                <li><Link to="/store/contato" className="block py-1">Contato</Link></li>
              </ul>
              <div className="flex gap-4 pt-2">
                <Link to="/store/favoritos" className="flex items-center gap-1">
                  <Heart className="h-5 w-5" />
                  <span>Favoritos</span>
                </Link>
                <Link to="/store/carrinho" className="flex items-center gap-1">
                  <ShoppingBag className="h-5 w-5" />
                  <span>Carrinho</span>
                </Link>
                {user ? (
                  <Link to="/store/minha-conta" className="flex items-center gap-1">
                    <User className="h-5 w-5" />
                    <span>Minha Conta</span>
                  </Link>
                ) : (
                  <Link to="/store/login" className="flex items-center gap-1">
                    <User className="h-5 w-5" />
                    <span>Entrar</span>
                  </Link>
                )}
              </div>
            </nav>
          </div>
        </div>
      )}
    </header>
  );
};
