
import { Link } from "react-router-dom";
import { ShoppingBag } from "lucide-react";

import { siteConfig } from "@/config/site";
import { Icons } from "@/components/icons";
import { Button } from "@/components/ui/button";
import { UserAccountNav } from "@/components/Store/UserAccountNav";

export function StoreHeader() {
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
