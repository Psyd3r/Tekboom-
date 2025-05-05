
import { Link } from "react-router-dom";
import { ShoppingBag, Settings } from "lucide-react";

import { siteConfig } from "@/config/site";
import { Icons } from "@/components/icons";
import { Button } from "@/components/ui/button";
import { UserAccountNav } from "@/components/Store/UserAccountNav";
import { useAuth } from "@/context/AuthContext";

export function StoreHeader() {
  const { userRole } = useAuth();
  const isAdmin = userRole === 'admin';

  return (
    <header className="bg-background sticky top-0 z-40 border-b">
      <div className="container flex h-16 items-center justify-between py-4">
        <Link to="/store" className="flex items-center gap-2">
          <Icons.logo className="h-8 w-8" />
          <span className="font-bold">{siteConfig.name}</span>
        </Link>

        <nav className="flex items-center space-x-4">
          <Link to="/store/produtos">
            <Button variant="ghost">Produtos</Button>
          </Link>
          
          {isAdmin && (
            <Link to="/produtos" className="flex items-center">
              <Button variant="secondary" size="sm" className="flex items-center">
                <Settings className="h-4 w-4 mr-2" />
                Painel Admin
              </Button>
            </Link>
          )}
          
          <UserAccountNav />
          <Link to="/store/carrinho">
            <Button variant="ghost">
              Carrinho
              <ShoppingBag className="w-4 h-4 ml-2" />
            </Button>
          </Link>
        </nav>
      </div>
    </header>
  );
}
